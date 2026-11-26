---
layout: "note"
title: "39_macadam-ellipses_plot.py"
display_title: "39_macadam-ellipses_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "39"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/macadam-ellipses/"
parent_title: "맥애덤 타원"
description: "휴먼 인터페이스 미디어 · 맥애덤 타원 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/39_macadam-ellipses_plot/"
---
{% raw %}
[맥애덤 타원](/Hongs_Blog/studies/human-interface-media/macadam-ellipses/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 맥애덤 타원 문서의 그림을 만든다: 39_macadam-ellipses_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 39_macadam-ellipses_plot.py  (matplotlib, numpy 필요)
# 이 그림은 모식도다. 타원의 자리·크기·방향은 맥애덤(1942) 측정값이 아니라 "초록 쪽은 크고 길쭉하며,
# 파랑 쪽은 작다"는 경향만 흉내 낸 값이다. 실제 측정 그림처럼 10배로 키워 그렸다.
# 말굽은 CIE 1931 등색 함수의 해석적 근사(Wyman, Sloan, Shirley 2013)를 420~645 nm에서 쓴 근사다.
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager
from matplotlib.patches import Ellipse

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "39_macadam-ellipses"
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


# 모식도용 타원: (중심 x, 중심 y, 긴 반지름, 짧은 반지름, 기울기(도)). 실제 크기의 값이고 그릴 때 10배 한다
SCHEMATIC = [
    (0.18, 0.70, 0.0090, 0.0022, 100), (0.22, 0.58, 0.0070, 0.0021, 105), (0.12, 0.55, 0.0060, 0.0020, 95),
    (0.25, 0.47, 0.0050, 0.0017, 110), (0.38, 0.50, 0.0045, 0.0018, 70), (0.45, 0.42, 0.0035, 0.0016, 55),
    (0.15, 0.38, 0.0045, 0.0019, 95), (0.31, 0.33, 0.0030, 0.0012, 65), (0.50, 0.33, 0.0028, 0.0011, 30),
    (0.42, 0.25, 0.0026, 0.0010, 45), (0.22, 0.22, 0.0022, 0.0008, 70), (0.30, 0.17, 0.0020, 0.0008, 50),
    (0.18, 0.11, 0.0012, 0.0005, 65), (0.16, 0.05, 0.0006, 0.0004, 60),
]
SCALE = 10

lam = np.linspace(420, 645, 451)
LX, LY = locus(lam)
fig, ax = plt.subplots(figsize=(6.0, 6.4))
ax.plot(LX, LY, color=INK, lw=1.4)
ax.plot([LX[-1], LX[0]], [LY[-1], LY[0]], color=INK, lw=1.0, ls="--")
for cx, cy, a, b, th in SCHEMATIC:
    ax.add_patch(Ellipse((cx, cy), 2 * a * SCALE, 2 * b * SCALE, angle=th, fill=False, color=C[0], lw=1.3))
    ax.plot(cx, cy, ".", color=C[0], ms=3)
ax.annotate("초록 쪽: 크고 길쭉하다", (0.18, 0.70), xytext=(0.30, 0.80), fontsize=10.5, color=C[1],
            arrowprops=dict(arrowstyle="->", color=C[1], lw=0.9))
ax.annotate("파랑 쪽: 아주 작다", (0.16, 0.05), xytext=(0.30, 0.04), fontsize=10.5, color=C[1],
            arrowprops=dict(arrowstyle="->", color=C[1], lw=0.9))
ax.text(0.47, 0.62, "모식도\n(타원은 10배로 키움)", fontsize=10, ha="left")
ax.set_xlim(-0.02, 0.8)
ax.set_ylim(-0.03, 0.9)
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 1)

if __name__ == "__main__":
    big = max(a for _, _, a, _, _ in SCHEMATIC)
    small = min(a for _, _, a, _, _ in SCHEMATIC)
    assert big / small >= 10          # 초록 쪽 긴 반지름이 파랑 쪽보다 열 배 넘게 크다(모식)
    # 모든 타원 중심이 말굽 안쪽(대략)에 있다: y가 보라선 위, x가 0~0.75
    for cx, cy, *_ in SCHEMATIC:
        assert 0 < cx < 0.75 and 0 < cy < 0.85
    print("ALL CHECKS PASSED")
```
{% endraw %}
