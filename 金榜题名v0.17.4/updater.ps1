# 学生时代牌 一键更新器（2026-08-25）
# 用法：把更新包解压进游戏目录（学生时代牌-网页版.html 所在文件夹），双击 一键更新.cmd
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$清单路径 = Join-Path $root '更新清单.json'
$更新目录 = Join-Path $root '更新文件'
$版本路径 = Join-Path $root '版本.json'

function 显示($msg) { Write-Host $msg }

if (-not (Test-Path $清单路径)) {
    if (Test-Path $版本路径) {
        显示 '没有待安装的更新包。'
        显示 '收到新更新包时，先把 zip 解压到本目录，再运行 一键更新.cmd。'
        显示 '现在可以直接双击游戏游玩。'
    } else {
        显示 '[错误] 没找到 版本.json，请确认本程序放在游戏目录里（学生时代牌-网页版.html 所在文件夹）。'
    }
    Start-Sleep -Seconds 4
    exit 1
}

try { $清单 = Get-Content $清单路径 -Raw -Encoding UTF8 | ConvertFrom-Json }
catch { 显示 "[错误] 更新清单读取失败：$($_.Exception.Message)"; Start-Sleep -Seconds 3; exit 1 }

# ---- 版本比较（x.y.z 分段数值比较）----
function 版本转数组($v) {
    $v = [string]$v -replace '[^0-9.]', ''
    if ($v -eq '') { return @(0) }
    return @($v -split '\.' | ForEach-Object { [int]$_ })
}
function 版本较新($a, $b) {
    $va = 版本转数组 $a; $vb = 版本转数组 $b
    $n = [Math]::Max($va.Count, $vb.Count)
    for ($i = 0; $i -lt $n; $i++) {
        $x = if ($i -lt $va.Count) { $va[$i] } else { 0 }
        $y = if ($i -lt $vb.Count) { $vb[$i] } else { 0 }
        if ($x -gt $y) { return $true }
        if ($x -lt $y) { return $false }
    }
    return $false
}

$本地版本 = '0'
if (Test-Path $版本路径) {
    try { $本地版本 = (Get-Content $版本路径 -Raw -Encoding UTF8 | ConvertFrom-Json).version } catch { $本地版本 = '0' }
}
显示 "当前版本 v$本地版本 -> 更新包 v$($清单.version)"

if (-not (版本较新 $清单.version $本地版本)) {
    显示 '已是最新版本，无需更新。'
    # 清理残留的更新文件
    if (Test-Path $更新目录) { Remove-Item $更新目录 -Recurse -Force }
    if (Test-Path $清单路径) { Remove-Item $清单路径 -Force }
    Start-Sleep -Seconds 3
    exit 0
}

if (-not (Test-Path $更新目录)) {
    显示 '[错误] 没找到 更新文件 文件夹，更新包可能解压不完整。'
    Start-Sleep -Seconds 3
    exit 1
}

# ---- 应用更新 ----
$文件列表 = @($清单.files.PSObject.Properties)
$总数 = $文件列表.Count
$完成 = 0
$失败 = 0
foreach ($条目 in $文件列表) {
    $相对路径 = $条目.Name
    $期望 = [string]$条目.Value.md5
    $源 = Join-Path $更新目录 $相对路径
    $目标 = Join-Path $root $相对路径
    $完成++
    try {
        if (-not (Test-Path $源)) { throw "更新包内缺少文件" }
        $父目录 = Split-Path -Parent $目标
        if (-not (Test-Path $父目录)) { New-Item -ItemType Directory -Force $父目录 | Out-Null }
        Copy-Item $源 $目标 -Force
        # MD5 校验（防下载/解压损坏）
        $实际 = (Get-FileHash $目标 -Algorithm MD5).Hash.ToLower()
        if ($实际 -ne $期望.ToLower()) { throw "MD5 校验不符" }
        Write-Progress -Activity "正在更新 v$($清单.version)" -Status $相对路径 -PercentComplete (($完成 / $总数) * 100)
    } catch {
        $失败++
        显示 "[失败] $相对路径 ：$($_.Exception.Message)"
    }
}
Write-Progress -Activity '更新完成' -Completed

# ---- 删除已移除的文件 ----
foreach ($删除项 in @($清单.deleted)) {
    $路径 = Join-Path $root ([string]$删除项)
    if (Test-Path $路径) { Remove-Item $路径 -Force; 显示 "[清理] 已删除 $($删除项)" }
}

if ($失败 -gt 0) {
    显示 "[错误] 有 $失败 个文件更新失败，游戏可能不完整，请重新解压更新包再试。"
    Start-Sleep -Seconds 5
    exit 1
}

# ---- 写入新版本号 ----
$新版本 = @{ version = [string]$清单.version; notes = [string]$清单.notes; date = [string]$清单.date } | ConvertTo-Json -Compress
[System.IO.File]::WriteAllText($版本路径, $新版本, (New-Object System.Text.UTF8Encoding $true))

# ---- 清理更新包残留 ----
if (Test-Path $更新目录) { Remove-Item $更新目录 -Recurse -Force }
if (Test-Path $清单路径) { Remove-Item $清单路径 -Force }

显示 ''
显示 "=============================================="
显示 "  更新完成！当前版本：v$($清单.version)"
显示 "  $($清单.notes)"
显示 "=============================================="
Start-Sleep -Seconds 4
