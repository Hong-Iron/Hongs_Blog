---
layout: "note"
title: "41_yuv-ycbcr_plot.py"
display_title: "41_yuv-ycbcr_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "41"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/yuv-ycbcr/"
parent_title: "YUV와 YCbCr"
description: "휴먼 인터페이스 미디어 · YUV와 YCbCr 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/41_yuv-ycbcr_plot/"
---
{% raw %}
[YUV와 YCbCr](/Hongs_Blog/studies/human-interface-media/yuv-ycbcr/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# YUV와 YCbCr 문서의 그림을 만든다: 41_yuv-ycbcr_fig1.svg, 41_yuv-ycbcr_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 41_yuv-ycbcr_plot.py  (matplotlib, numpy 필요)
# 말굽은 CIE 1931 등색 함수의 해석적 근사(Wyman, Sloan, Shirley 2013)를 420~645 nm에서 쓴 근사다.
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "41_yuv-ycbcr"
INK = "#888888"
C = ["#3b82c4", "#d9622b", "#3a9a5b", "#9b59b6", "#c49a1b"]
_fonts = {f.name for f in font_manager.fontManager.ttflist}
FONT = next((n for n in ["Apple SD Gothic Neo", "NanumGothic", "Noto Sans CJK KR"] if n in _fonts), "DejaVu Sans")
plt.rcParams.update({
    "font.family": FONT, "mathtext.fontset": "dejavusans",
    "font.size": 11, "axes.unicode_minus": False, "svg.fonttype": "path", "svg.hashsalt": PREFIX,
    "axes.edgecolor": INK, "axes.labelcolor": INK, "xtick.color": INK, "ytick.color": INK,
    "text.color": INK, "legend.frameon": False,
    "axes.facecolor": "none", "figure.facecolor": "none", "savefig.transparent": True,
    "axes.spines.top": False, "axes.spines.right": False,
})


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


def _g(lam, mu, s1, s2):
    s = np.where(lam < mu, s1, s2)
    return np.exp(-0.5 * ((lam - mu) / s) ** 2)


def locus(lam):
    lam = np.asarray(lam, dtype=float)
    X = 1.056 * _g(lam, 599.8, 37.9, 31.0) + 0.362 * _g(lam, 442.0, 16.0, 26.7) - 0.065 * _g(lam, 501.1, 20.4, 26.2)
    Y = 0.821 * _g(lam, 568.8, 46.9, 40.5) + 0.286 * _g(lam, 530.9, 16.3, 31.1)
    Z = 1.217 * _g(lam, 437.0, 11.8, 36.0) + 0.681 * _g(lam, 459.0, 26.0, 13.8)
    s = X + Y + Z
    return X / s, Y / s


def xyz_from_xy(x, y):
    return np.array([x / y, 1.0, (1 - x - y) / y])


def rgb_to_xyz(prims, white):
    P = np.column_stack([xyz_from_xy(*p) for p in prims])
    s = np.linalg.solve(P, xyz_from_xy(*white))
    return P * s


def chroma(v):
    return v[0] / v.sum(), v[1] / v.sum()


SRGB = [(0.64, 0.33), (0.30, 0.60), (0.15, 0.06)]
NTSC = [(0.67, 0.33), (0.21, 0.71), (0.14, 0.08)]
MS = rgb_to_xyz(SRGB, (0.3127, 0.3290))
MN = rgb_to_xyz(NTSC, (0.3101, 0.3162))
YEL_S = chroma(MS @ np.array([1, 1, 0]))
YEL_N = chroma(MN @ np.array([1, 1, 0]))

# 그림 1: 같은 RGB 숫자가 화면마다 다른 색이 된다
lam = np.linspace(420, 645, 451)
LX, LY = locus(lam)
fig, ax = plt.subplots(figsize=(6.0, 6.2))
ax.plot(LX, LY, color=INK, lw=1.4)
ax.plot([LX[-1], LX[0]], [LY[-1], LY[0]], color=INK, lw=1.0, ls="--")
for prims, col, name, pos in [(SRGB, C[0], "sRGB", (0.33, 0.41)), (NTSC, C[1], "NTSC (1953)", (0.12, 0.62))]:
    t = np.array(prims + [prims[0]])
    ax.plot(t[:, 0], t[:, 1], color=col, lw=1.5)
    ax.text(*pos, name, color=col, fontsize=10.5)
ax.plot(0.64, 0.33, "o", color=C[0], ms=6)
ax.plot(0.67, 0.33, "o", color=C[1], ms=6)
ax.annotate("둘 다 RGB (1, 0, 0)", (0.655, 0.33), xytext=(0.47, 0.17), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.plot(*YEL_S, "s", color=C[0], ms=6)
ax.plot(*YEL_N, "s", color=C[1], ms=6)
ax.annotate("둘 다 RGB (1, 1, 0)", (YEL_N[0], YEL_N[1]), xytext=(0.50, 0.62), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
ax.set_xlim(-0.02, 0.8)
ax.set_ylim(-0.03, 0.9)
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 1)

# 그림 2: 4x2 픽셀 묶음에서 밝기(Y) 표본과 색차(Cb, Cr) 표본이 놓이는 자리
fig, axes = plt.subplots(1, 3, figsize=(7.6, 2.9))
schemes = [("4:4:4", [(c + 0.5, r + 0.5) for r in range(2) for c in range(4)], 24),
           ("4:2:2", [(c + 1.0, r + 0.5) for r in range(2) for c in (0, 2)], 16),
           ("4:2:0", [(c + 1.0, 1.0) for c in (0, 2)], 12)]
for ax, (name, cpos, bits) in zip(axes, schemes):
    for r in range(2):
        for c in range(4):
            ax.add_patch(Rectangle((c, r), 1, 1, fill=False, ec=INK, lw=0.8))
            ax.plot(c + 0.5, r + 0.5, "o", ms=12, mfc="none", mec=C[0], mew=1.4)
    for (x, y) in cpos:
        ax.plot(x, y, "s", ms=5.5, color=C[1])
    ax.set_xlim(-0.1, 4.1)
    ax.set_ylim(-0.8, 2.6)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.text(2, 2.25, name, ha="center", fontsize=12)
    ax.text(2, -0.55, f"색차 {len(cpos)}곳 · 픽셀당 {bits}비트", ha="center", fontsize=10)
fig.text(0.5, 0.06, "동그라미: 밝기 Y 표본 (모든 픽셀)    네모: 색차 Cb·Cr 표본 (네모 하나에 Cb, Cr 둘)",
         ha="center", fontsize=10)
fig.subplots_adjust(bottom=0.12, wspace=0.08)
save(fig, 2)

if __name__ == "__main__":
    assert np.allclose(MS[1], [0.2126, 0.7152, 0.0722], atol=2e-4)
    assert np.allclose(MN[1], [0.299, 0.587, 0.114], atol=1.5e-3)
    assert abs(YEL_S[0] - 0.4193) < 5e-4 and abs(YEL_N[0] - 0.451) < 1e-3
    for name, cpos, bits in schemes:
        assert (8 + 2 * len(cpos)) * 8 / 8 == bits      # 픽셀 8개: Y 8개 + Cb·Cr 각 len(cpos)개, 8비트씩
    print("ALL CHECKS PASSED")
```
{% endraw %}
