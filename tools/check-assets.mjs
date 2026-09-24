#!/usr/bin/env node
/**
 * 《学生时代牌 · 金榜题名》资源引用校验
 * ════════════════════════════════════════════════════════════
 * 为什么需要它：
 *   多人协作时最容易翻车的不是逻辑，而是「引用了不存在的素材路径」。
 *   游戏不会报错，只会静默白屏、或背景显示为纯黑，排查成本极高
 *   （项目历史上就发生过：小蕾事件框引用了不存在的图片，背景一直全黑）。
 *
 * 它检查什么：
 *   1. HTML 中 src / href / url() 引用的素材是否存在
 *   2. JS 字符串里的素材路径是否存在
 *   3. 所有 JS 文件的语法是否合法
 *   4. 所有 JSON 文件格式是否合法
 *   5. 单文件体积是否超过 5MB 红线
 *   6. 素材文件名是否符合协作规范（无空格、无「副本」等）
 *
 * 用法：
 *   node tools/check-assets.mjs
 *
 * 退出码：
 *   0 = 通过（或有警告但无错误）
 *   1 = 存在必须修复的错误
 * ════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ASSET_EXT = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico',
  'mp3', 'wav', 'ogg', 'm4a', 'm4v', 'mp4', 'webm', 'flac',
  'ttf', 'otf', 'woff', 'woff2',
]);

/** 明确不是项目内路径的前缀 */
const SKIP_PREFIX = /^(?:https?:|data:|blob:|javascript:|mailto:|tel:|#|\/\/|\{|\$)/i;
/** 文档里的示例占位文本，不是真实引用 */
const PLACEHOLDER = /例如|示例|如：|placeholder|\bTODO\b|xxx/i;
/** 体积红线 */
const SIZE_LIMIT = 5 * 1024 * 1024;

/**
 * 有意留空的占位资源白名单。
 * 这些引用在代码里已做兜底（回退渐变 / 默认图），缺失属于预期，不算错误。
 * 新增此类资源时请在此登记，并确认代码里确实有回退逻辑。
 */
const IGNORED_REFS = [
  // 待出图资源，缺失时回退 linear-gradient 背景
  // 见 学生时代牌-网页版.html 中 .card.card-back 的 background-image
  '卡牌样式/怪物卡背.png',
];

/**
 * 素材路径提取正则。
 * 刻意不匹配空格、引号、等号、尖括号等 HTML/JS 语法字符，
 * 这样无论字符串是纯路径 '立绘/小蕾.png'，还是一整段 HTML
 * '<img src="立绘/小蕾.png">'，都能准确切出路径本身。
 * 结尾的负向前瞻避免把 .jpg 误当成 .jpeg 的前缀。
 */
const ASSET_PATH_RE = /[\w\u4e00-\u9fa5.*\-\\/]*\.(?:jpeg|webp|woff2|woff|ttf|otf|png|jpg|gif|svg|bmp|ico|flac|m4v|mp4|webm|m4a|ogg|wav|mp3)(?![\w])/gi;

/** 全项目文件名索引（小写 basename → 绝对路径列表），用于判定裸文件名 */
const basenameIndex = new Map();

function extractAssetPaths(str) {
  const out = [];
  ASSET_PATH_RE.lastIndex = 0;
  let m;
  while ((m = ASSET_PATH_RE.exec(str)) !== null) {
    out.push({ path: m[0], index: m.index });
  }
  return out;
}

/**
 * 判断某个位置是否处于注释中。
 * 注释里常写路径示例（如 '// portrait: {video:"立绘/程良.mp4"}'），
 * 它们不是真实引用，必须排除，否则脚本会持续误报。
 *
 * 这里刻意不用"逐字符状态机"——几千行的游戏脚本里只要有一个未闭合引号，
 * 状态机就会全盘错位；改用基于所在行的启发式判断，更鲁棒：
 *   · 该位置之前若出现双斜杠（且前一个字符不是冒号，避开 http://）→ 行注释
 *   · 向前最近的块注释起始符比结束符更接近 → 块注释
 */
function isLikelyCommented(text, index) {
  const lineStart = text.lastIndexOf('\n', index) + 1;
  const before = text.slice(lineStart, index);
  if (/(^|[^:'"`\\])\/\//.test(before)) return true;

  const lastOpen = text.lastIndexOf('/*', index);
  const lastClose = text.lastIndexOf('*/', index);
  if (lastOpen > lastClose) return true;

  // HTML 注释（注释掉一段带 url() 的样式也很常见）
  const htmlOpen = text.lastIndexOf('<!--', index);
  const htmlClose = text.lastIndexOf('-->', index);
  return htmlOpen > htmlClose;
}

// ──────────────────────────────────────────────────────────
// 基础工具
// ──────────────────────────────────────────────────────────

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === '.workbuddy') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

/** 把引用字符串解析为绝对路径；无法解析时返回 null */
function resolveRef(raw, base) {
  let s = String(raw).split(/[?#]/)[0].trim();
  if (!s) return null;
  if (SKIP_PREFIX.test(s)) return null;
  if (PLACEHOLDER.test(s)) return null;
  try {
    s = decodeURIComponent(s);
  } catch {
    /* 非法编码，按原样处理 */
  }
  s = s.replace(/\\/g, '/').replace(/^\.\//, '');
  return path.resolve(base, s);
}

function extOf(s) {
  const m = /\.([A-Za-z0-9]+)$/.exec(s.split(/[?#]/)[0]);
  return m ? m[1].toLowerCase() : '';
}

// ──────────────────────────────────────────────────────────
// 定位游戏目录
// ──────────────────────────────────────────────────────────

function findGameDir() {
  const entries = fs.readdirSync(ROOT, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const e of entries) {
    const p = path.join(ROOT, e.name);
    if (fs.existsSync(path.join(p, '学生时代牌-网页版.html'))) return p;
  }
  return null;
}

const GAME_DIR = findGameDir();

// ──────────────────────────────────────────────────────────
// 扫描
// ──────────────────────────────────────────────────────────

const missing = [];   // 引用了但文件不存在 → 错误
const warnings = [];  // 需要留意
const syntaxErrors = [];
const bigFiles = [];
const badNames = [];

let refCount = 0;

/** HTML：src / href / url() */
function scanHtml(file) {
  const text = fs.readFileSync(file, 'utf8');
  const base = path.dirname(file);

  /** 按「第几个捕获组是路径」逐条正则收集 */
  const collect = (re, groupIndex) => {
    let m;
    while ((m = re.exec(text)) !== null) {
      const candidate = m[groupIndex];
      if (!candidate || candidate.length > 300) continue;
      if (SKIP_PREFIX.test(candidate)) continue;
      // 只关心素材文件，以及被引用的本地 js / css / json
      if (!ASSET_EXT.has(extOf(candidate)) && !/\.(js|css|json|html?)$/i.test(candidate)) continue;

      const abs = resolveRef(candidate, base);
      if (!abs) continue;

      refCount++;
      if (!fs.existsSync(abs)) {
        missing.push({
          file,
          line: lineOf(text, m.index),
          raw: candidate,
          resolved: abs,
          level: 'error',
        });
      }
    }
  };

  // <img src="..."> <link href="..."> <script src="..."> 等
  collect(/\b(?:src|href|poster|data-src|data-image|data-bg|data-background)\s*=\s*["']([^"']+)["']/gi, 1);
  // 内联样式与 <style> 中的 url(...)
  collect(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi, 1);
}

/** JS：字符串中的素材路径（含内嵌 HTML 片段） */
function scanJs(file) {
  const text = fs.readFileSync(file, 'utf8');
  // JS 里的相对路径以「游戏根目录」为基准（由页面 URL 决定，而不是 js/ 所在目录）
  const base = GAME_DIR || path.dirname(file);

  const re = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;
  const reported = new Set();
  let m;

  while ((m = re.exec(text)) !== null) {
    // 整段落在注释里的，是文档示例而非真实引用
    if (isLikelyCommented(text, m.index)) continue;

    const value = m[2];
    if (!value || PLACEHOLDER.test(value)) continue;
    if (value.length > 8000) continue; // base64 内联数据之类，跳过

    // 含 ${...} 插值的路径由运行时决定（如 `立绘/${name}.png`），静态无法还原
    const dynamic = value.includes('${');
    const quoteStart = m.index + 1;

    for (const { path: candidate, index } of extractAssetPaths(value)) {
      if (SKIP_PREFIX.test(candidate)) continue;
      if (reported.has(candidate)) continue;

      // 只有扩展名的碎片（模板拼接产物），忽略
      const stem = candidate.replace(/\.[A-Za-z0-9]+$/, '').replace(/[\\/]/g, '').trim();
      if (!stem) continue;

      const hasDir = /[\\/]/.test(candidate);

      // 动态拼接且无目录前缀 → 多半只是文件名片段，不判为问题
      if (dynamic && !hasDir) continue;

      const abs = resolveRef(candidate, base);
      if (!abs) continue;

      const pos = quoteStart + index;
      if (isLikelyCommented(text, pos)) continue;

      refCount++;
      reported.add(candidate);
      if (fs.existsSync(abs)) continue;

      const line = lineOf(text, pos);

      if (hasDir && !dynamic) {
        missing.push({ file, line, raw: candidate, resolved: abs, level: 'error' });
      } else if (!basenameIndex.has(candidate.toLowerCase())) {
        // 裸文件名在代码里通常配合 '立绘/' 这类前缀于运行时拼接，静态无法还原，
        // 因此只在「全项目都找不到同名文件」时才提示，避免大量误报。
        missing.push({ file, line, raw: candidate, resolved: abs, level: 'warn' });
      }
    }
  }
}

/** JS 语法校验（只编译不执行） */
function checkJsSyntax(file) {
  const code = fs.readFileSync(file, 'utf8');
  try {
    new vm.Script(code, { filename: file });
  } catch (e) {
    syntaxErrors.push({ file, message: e.message });
  }
}

/** JSON 格式校验 */
function checkJson(file) {
  try {
    JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
  } catch (e) {
    syntaxErrors.push({ file, message: 'JSON 格式错误：' + e.message });
  }
}

// ──────────────────────────────────────────────────────────
// 主流程
// ──────────────────────────────────────────────────────────

console.log('');
console.log('《学生时代牌》资源引用校验');
console.log('─'.repeat(58));
console.log(`仓库根目录：${ROOT}`);
console.log(`游戏目录　：${GAME_DIR || '（未找到，仅校验根目录）'}`);
console.log('');

const allFiles = walk(ROOT);

// 先建立文件名索引，供 JS 中「裸文件名」的判定使用
for (const f of allFiles) {
  const b = path.basename(f).toLowerCase();
  if (!basenameIndex.has(b)) basenameIndex.set(b, []);
  basenameIndex.get(b).push(f);
}

for (const f of allFiles) {
  const ext = extOf(f);
  const rel = toPosix(path.relative(ROOT, f));
  const stat = fs.statSync(f);

  if (ext === 'html') scanHtml(f);
  else if (ext === 'js') scanJs(f);

  // 注意：vm.Script 只能解析传统脚本，.mjs（ES 模块）会误报 "Cannot use import statement"，
  // 而本项目的游戏脚本全部是传统脚本，因此只对 .js 做语法校验。
  if (ext === 'js') checkJsSyntax(f);
  if (ext === 'json') checkJson(f);

  // 体积检查（排除 .git 内部，已由 walk 过滤）
  if (stat.size > SIZE_LIMIT) {
    bigFiles.push({ file: rel, size: stat.size });
  }

  // 文件名规范（仅针对素材）
  if (ASSET_EXT.has(ext)) {
    const name = path.basename(f);
    const problems = [];
    if (/\s/.test(name)) problems.push('含空格');
    if (/副本|copy|最终|final|（\d+）|\(\d+\)/.test(name)) problems.push('含"副本/最终"类后缀');
    if (problems.length) badNames.push({ file: rel, problems });
  }
}

// ──────────────────────────────────────────────────────────
// 报告
// ──────────────────────────────────────────────────────────

// 过滤掉已登记的、有意留空的占位资源
const effective = missing.filter(m => !IGNORED_REFS.includes(m.raw));
const hardMissing = effective.filter(m => m.level === 'error');
const softMissing = effective.filter(m => m.level === 'warn');

let hasError = false;

console.log(`已扫描 ${allFiles.length} 个文件，解析 ${refCount} 条资源引用。`);
console.log('');

const groupByFile = list => {
  const g = new Map();
  for (const it of list) {
    if (!g.has(it.file)) g.set(it.file, []);
    g.get(it.file).push(it);
  }
  return g;
};

const printGrouped = list => {
  for (const [file, items] of groupByFile(list)) {
    console.log(`  ${toPosix(path.relative(ROOT, file))}`);
    for (const it of items.slice(0, 12)) {
      console.log(`    第 ${it.line} 行  →  ${it.raw}`);
    }
    if (items.length > 12) console.log(`    ...还有 ${items.length - 12} 处`);
  }
};

// 1. 缺失引用（确定错误）
if (hardMissing.length) {
  hasError = true;
  console.log(`✗ 引用了不存在的文件（${hardMissing.length} 处）`);
  console.log('  这类问题不会报错，只会导致白屏、破图或纯黑背景，必须修复：');
  printGrouped(hardMissing);
  console.log('');
} else {
  console.log('✓ 资源引用完整，未发现缺失文件。');
  console.log('');
}

// 2. 可疑的裸文件名（提示，不算错误）
if (softMissing.length) {
  console.log(`⚠ 找不到对应文件的素材名（${softMissing.length} 处）`);
  console.log('  这些引用没有目录前缀，通常由代码在运行时拼接；');
  console.log('  若确实配合前缀使用则无需处理，否则请检查路径是否写错：');
  printGrouped(softMissing);
  console.log('');
}

// 2. 语法错误
if (syntaxErrors.length) {
  hasError = true;
  console.log(`✗ 语法 / 格式错误（${syntaxErrors.length} 个文件）`);
  for (const s of syntaxErrors) {
    console.log(`  ${toPosix(path.relative(ROOT, s.file))}`);
    console.log(`    ${s.message.split('\n')[0]}`);
  }
  console.log('');
} else {
  console.log('✓ 所有 JS / JSON 文件语法正确。');
  console.log('');
}

// 3. 大文件
if (bigFiles.length) {
  console.log(`⚠ 超过 5MB 的文件（${bigFiles.length} 个）`);
  console.log('  请确认已压缩，并确认是否应该走 Git LFS：');
  for (const b of bigFiles.sort((a, b) => b.size - a.size)) {
    const mb = (b.size / 1024 / 1024).toFixed(1);
    console.log(`  ${mb.padStart(7)} MB  ${b.file}`);
  }
  console.log('');
}

// 4. 文件名规范
if (badNames.length) {
  console.log(`⚠ 素材文件名不符合协作规范（${badNames.length} 个）`);
  console.log('  建议改名（改名后记得改代码里的引用，或保持引用一致）：');
  for (const b of badNames.slice(0, 20)) {
    console.log(`  ${b.file}  ← ${b.problems.join('、')}`);
  }
  if (badNames.length > 20) console.log(`  ...还有 ${badNames.length - 20} 个`);
  console.log('');
}

// ──────────────────────────────────────────────────────────
// 结论
// ──────────────────────────────────────────────────────────

console.log('─'.repeat(58));
if (hasError) {
  console.log('结果：发现必须修复的问题，请处理后重新运行。');
  console.log('');
  process.exit(1);
} else {
  console.log('结果：通过。可以提交。');
  console.log('');
  process.exit(0);
}
