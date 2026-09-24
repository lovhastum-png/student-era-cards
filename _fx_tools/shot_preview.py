"""用本机 Chrome 打开特效预览页，在若干时间点拖时间轴并截图，用于核对抠图质量与帧对齐。
截图写到系统临时目录，不落到项目里。"""
import json
import os
import tempfile
from playwright.sync_api import sync_playwright

URL = "http://127.0.0.1:8848/_fx_preview_shuati.html"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
TIMES = [0.06, 0.32, 0.56, 0.80, 0.98]

outdir = tempfile.mkdtemp(prefix="fxshot_")
print("OUTDIR", outdir)

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=CHROME,
        headless=True,
        args=["--no-proxy-server", "--use-gl=angle", "--use-angle=swiftshader",
              "--enable-unsafe-swiftshader"],
    )
    page = browser.new_page(viewport={"width": 1600, "height": 1000},
                            device_scale_factor=1)
    errors = []
    page.on("console", lambda m: errors.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))
    page.on("requestfailed", lambda r: errors.append("reqfail: " + r.url))

    page.goto(URL, wait_until="load", timeout=60000)
    page.wait_for_timeout(2500)          # 等图片全部加载

    # 暂停播放，之后完全由时间轴驱动
    page.evaluate("document.querySelector('#btnPlay').click()")

    info = page.evaluate("""() => {
      const imgs = [...document.querySelectorAll('img')];
      return {
        imgs: imgs.map(i => ({src: i.getAttribute('src'), w: i.naturalWidth, h: i.naturalHeight})),
        stageW: document.querySelector('#stage').getBoundingClientRect().width,
        fxW: document.querySelector('#fxLayer').getBoundingClientRect().width,
      };
    }""")
    print("IMG_INFO", json.dumps(info, ensure_ascii=False, indent=1))

    shots = []
    for t in TIMES:
        page.evaluate("""(t) => {
          const s = document.querySelector('#scrub');
          s.value = String(t);
          s.dispatchEvent(new Event('input'));
        }""", t)
        page.wait_for_timeout(260)
        f = os.path.join(outdir, "t_%s.png" % str(t).replace(".", "_"))
        page.screenshot(path=f)
        shots.append(f)
        print("SHOT", t, f)

    print("ERRORS", json.dumps(errors, ensure_ascii=False))
    browser.close()

print("DONE", outdir)
