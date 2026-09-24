"""把「再刷一题」特效关键帧的纯黑底抠成透明 PNG。
做法：亮度键（max-channel luma）生成 alpha，再反预乘(unpremultiply)复原颜色，消除黑边。
输出到 其他插画/fx_shuati_1..4.png，四张保持同一 1024x1024 画布以保证枢轴对齐。
"""
import os
import numpy as np
from PIL import Image

SRC = r"C:\Users\ASUS\.workbuddy\plugins\data\mcp-miora\miora-media"
DST = r"D:\学生时代牌网页群主版本\金榜题名v0.17.4\其他插画"

# (帧序, 源文件)
JOBS = [
    (1, "miora_text_to_image-1789910420440-0-876ed8261582.jpg"),   # 起手 / 锚点
    (2, "miora_edit_image-1789910640377-0-91a4d13788e1.jpg"),      # 承 / 中段扩散
    (3, "miora_edit_image-1789910652312-0-1ace34918d60.jpg"),      # 转 / 爆发峰值
    (4, "miora_edit_image-1789910639824-0-1322047d8b72.jpg"),      # 收 / 飘散收尾
]

BLACK_CUT = 0.045   # 低于此亮度视为纯黑，全透明（杀掉 JPEG 黑底噪点）
RAMP_TOP = 0.78     # 到此处 alpha 达到 1
ALPHA_FLOOR = 0.10  # 反预乘时的 alpha 下限，避免极暗处放大噪点


def cutout(path_in, path_out):
    im = Image.open(path_in).convert("RGB")
    arr = np.asarray(im).astype(np.float32) / 255.0

    luma = arr.max(axis=2)                                  # 最大通道，对金色/白色辉光覆盖最好
    alpha = (luma - BLACK_CUT) / (RAMP_TOP - BLACK_CUT)
    alpha = np.clip(alpha, 0.0, 1.0)

    # 反预乘：c' = c / a，把被黑底压暗的颜色还原，叠到任何背景都不会有黑边
    a_safe = np.maximum(alpha, ALPHA_FLOOR)[..., None]
    rgb = np.clip(arr / a_safe, 0.0, 1.0)

    out = np.concatenate([rgb, alpha[..., None]], axis=2)
    Image.fromarray((out * 255.0 + 0.5).astype(np.uint8), "RGBA").save(path_out, "PNG", optimize=True)
    return alpha


print("=== 抠图 ===")
for idx, fn in JOBS:
    src = os.path.join(SRC, fn)
    if not os.path.isfile(src):
        raise SystemExit("MISSING SRC: " + src)
    dst = os.path.join(DST, "fx_shuati_%d.png" % idx)
    a = cutout(src, dst)
    cov = float((a > 0.02).mean()) * 100.0      # 非透明像素占比
    solid = float((a > 0.85).mean()) * 100.0    # 近乎不透明像素占比
    size_kb = os.path.getsize(dst) / 1024.0
    print("fx_shuati_%d.png  有效像素 %.1f%%  实心像素 %.1f%%  %.0f KB"
          % (idx, cov, solid, size_kb))

print("DONE")
