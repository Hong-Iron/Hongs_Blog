---
layout: "note"
title: "35_hsl-hsv_plot.py"
display_title: "35_hsl-hsv_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "35"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/hsl-hsv/"
parent_title: "HSL과 HSV"
description: "휴먼 인터페이스 미디어 · HSL과 HSV 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/35_hsl-hsv_plot/"
---
{% raw %}
[HSL과 HSV](/Hongs_Blog/studies/human-interface-media/hsl-hsv/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# HSL과 HSV 문서의 그림을 만든다: 35_hsl-hsv_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 35_hsl-hsv_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "35_hsl-hsv"
INK = "#888888"                                         # 밝은 테마와 어두운 테마 모두에서 보이는 회색
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


N = 161
xs = np.linspace(-1, 1, N)          # 부호 붙은 크로마: 오른쪽은 색상 0도(빨강), 왼쪽은 180도(청록)
ys = np.linspace(0, 1, N)
X, Y = np.meshgrid(xs, ys)
Cc = np.abs(X)


def slice_image(mx, mn, valid):
    """세로 단면의 색. 오른쪽은 (M, m, m), 왼쪽은 (m, M, M). 바깥은 투명."""
    img = np.zeros((N, N, 4))
    right = X >= 0
    img[..., 0] = np.where(right, mx, mn)
    img[..., 1] = np.where(right, mn, mx)
    img[..., 2] = np.where(right, mn, mx)
    img[..., 3] = valid.astype(float)
    return np.clip(img, 0, 1)


# HSV: 위아래 축이 V = M. m = V - C. 가능한 곳: C <= V
hsv_img = slice_image(Y, Y - Cc, Cc <= Y + 1e-9)
# HSL: 위아래 축이 L = (M + m)/2. M = L + C/2, m = L - C/2. 가능한 곳: C <= 1 - |2L - 1|
hsl_img = slice_image(Y + Cc / 2, Y - Cc / 2, Cc <= 1 - np.abs(2 * Y - 1) + 1e-9)

# 그림 1: 색상 0도와 180도를 잇는 세로 단면. HSV는 삼각형(원뿔 하나), HSL은 마름모(원뿔 둘)
fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.4, 3.9))
for ax, img, title, ylab in ((a1, hsv_img, "HSV: 원뿔 하나", "V (밝기)"), (a2, hsl_img, "HSL: 원뿔 둘", "L (명도)")):
    ax.imshow(img, origin="lower", extent=(-1, 1, 0, 1), aspect="auto", interpolation="nearest")
    ax.set_xlim(-1.15, 1.15)
    ax.set_ylim(-0.05, 1.12)
    ax.set_xticks([-1, 0, 1])
    ax.set_xticklabels(["1", "0", "1"])
    ax.set_xlabel("회색 축에서 거리 (크로마 C)")
    ax.set_ylabel(ylab)
    ax.set_title(title, fontsize=11)
    ax.axvline(0, color=INK, lw=0.8, ls=":")
a1.plot([-1, 0, 1], [1, 0, 1], color=INK, lw=1)
a1.plot([-1, 1], [1, 1], color=INK, lw=1)
a1.text(0, 1.04, "흰색", ha="center", fontsize=10)
a1.text(1.0, 1.04, "빨강", ha="center", fontsize=10, color=C[1])
a1.text(-1.0, 1.04, "청록", ha="center", fontsize=10, color=C[0])
a1.text(0.06, -0.035, "검정", ha="left", fontsize=10)
a2.plot([-1, 0, 1, 0, -1], [0.5, 1, 0.5, 0, 0.5], color=INK, lw=1)
a2.text(0, 1.04, "흰색", ha="center", fontsize=10)
a2.text(1.02, 0.56, "빨강", ha="center", fontsize=10, color=C[1])
a2.text(-1.02, 0.56, "청록", ha="center", fontsize=10, color=C[0])
a2.text(0.06, -0.035, "검정", ha="left", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 빨강 (1, 0, 0): HSV에서는 위 모서리(V = 1, C = 1), HSL에서는 가운데 높이(L = 0.5, C = 1)
    j = np.argmin(np.abs(xs - 1))
    assert np.allclose(hsv_img[-1, j, :3], [1, 0, 0]) and hsv_img[-1, j, 3] == 1
    i_half = np.argmin(np.abs(ys - 0.5))
    assert np.allclose(hsl_img[i_half, j, :3], [1, 0, 0]) and hsl_img[i_half, j, 3] == 1
    # HSL 맨 위(L = 1)는 회색 축만 남는다: C > 0이면 투명
    assert hsl_img[-1, j, 3] == 0 and hsl_img[-1, N // 2, 3] == 1
    # HSV 맨 위(V = 1)는 회색 축부터 빨강까지 모두 가능
    assert hsv_img[-1, :, 3].all()
    print("ALL CHECKS PASSED")
```
{% endraw %}
