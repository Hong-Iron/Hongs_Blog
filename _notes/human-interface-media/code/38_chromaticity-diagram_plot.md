---
layout: "note"
title: "38_chromaticity-diagram_plot.py"
display_title: "38_chromaticity-diagram_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "38"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/chromaticity-diagram/"
parent_title: "색도도"
description: "휴먼 인터페이스 미디어 · 색도도 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/38_chromaticity-diagram_plot/"
---
{% raw %}
[색도도](/Hongs_Blog/studies/human-interface-media/chromaticity-diagram/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 색도도 문서의 그림을 만든다: 38_chromaticity-diagram_fig1.svg, 38_chromaticity-diagram_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 38_chromaticity-diagram_plot.py  (matplotlib, numpy 필요)
# 말굽(스펙트럼 궤적)은 CIE 1931 등색 함수의 해석적 근사(Wyman, Sloan, Shirley 2013)로 그린다.
# 근사가 표준표와 0.015 안으로 맞는 420~645 nm만 쓴다. 흑체 궤적은 Kim 등(2002)의 근사식이다.
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "38_chromaticity-diagram"
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


def cmf(lam):
    lam = np.asarray(lam, dtype=float)
    xb = 1.056 * _g(lam, 599.8, 37.9, 31.0) + 0.362 * _g(lam, 442.0, 16.0, 26.7) - 0.065 * _g(lam, 501.1, 20.4, 26.2)
    yb = 0.821 * _g(lam, 568.8, 46.9, 40.5) + 0.286 * _g(lam, 530.9, 16.3, 31.1)
    zb = 1.217 * _g(lam, 437.0, 11.8, 36.0) + 0.681 * _g(lam, 459.0, 26.0, 13.8)
    return xb, yb, zb


def locus(lam):
    X, Y, Z = cmf(lam)
    s = X + Y + Z
    return X / s, Y / s


def kim_planck(T):
    if T <= 4000:
        x = -0.2661239e9 / T**3 - 0.2343589e6 / T**2 + 0.8776956e3 / T + 0.179910
    else:
        x = -3.0258469e9 / T**3 + 2.1070379e6 / T**2 + 0.2226347e3 / T + 0.240390
    if T <= 2222:
        y = -1.1063814 * x**3 - 1.34811020 * x**2 + 2.18555832 * x - 0.20219683
    elif T <= 4000:
        y = -0.9549476 * x**3 - 1.37418593 * x**2 + 2.09137015 * x - 0.16748867
    else:
        y = 3.0817580 * x**3 - 5.87338670 * x**2 + 3.75112997 * x - 0.37001483
    return x, y


def bary(P, W):
    (x1, y1), (x2, y2), (x3, y3) = P
    x, y = W
    det = (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
    a = ((x - x3) * (y2 - y3) - (x2 - x3) * (y - y3)) / det
    b = ((x1 - x3) * (y - y3) - (x - x3) * (y1 - y3)) / det
    return a, b, 1 - a - b


LAM = np.linspace(420, 645, 451)
LX, LY = locus(LAM)
D65 = (0.3127, 0.3290)
E = (1 / 3, 1 / 3)
SRGB = [(0.64, 0.33), (0.30, 0.60), (0.15, 0.06)]


def horseshoe(ax):
    ax.plot(LX, LY, color=INK, lw=1.6)
    ax.plot([LX[-1], LX[0]], [LY[-1], LY[0]], color=C[3], lw=1.4, ls="--")
    ax.set_xlim(-0.08, 0.8)
    ax.set_ylim(-0.05, 0.9)
    ax.set_aspect("equal")
    ax.set_xlabel("$x$")
    ax.set_ylabel("$y$")


# 그림 1: 색도도의 구성 요소
fig, ax = plt.subplots(figsize=(6.4, 6.8))
horseshoe(ax)
for lam in [460, 480, 490, 500, 510, 520, 540, 560, 580, 600, 620]:
    x, y = locus(lam)
    cx, cy = x - 0.33, y - 0.33
    d = np.hypot(cx, cy)
    ax.plot(x, y, "o", color=INK, ms=3)
    ax.annotate(f"{lam}", (x, y), xytext=(x + 0.05 * cx / d, y + 0.05 * cy / d), fontsize=9.5,
                ha="center", va="center")
ax.text(0.40, 0.86, "말굽 테두리: 단색광(숫자는 nm)", fontsize=10)
ax.text(0.47, 0.10, "보라선", color=C[3], fontsize=10.5, rotation=24)
TT = np.linspace(1700, 20000, 400)
PL = np.array([kim_planck(T) for T in TT])
ax.plot(PL[:, 0], PL[:, 1], color=C[1], lw=1.4)
for T, off in [(2000, (0, 8)), (3000, (0, 8)), (4000, (0, 8)), (6500, (-16, 10)), (10000, (-6, -16))]:
    x, y = kim_planck(T)
    ax.plot(x, y, "o", color=C[1], ms=3.5)
    ax.annotate(f"{T}K", (x, y), xytext=off, textcoords="offset points", fontsize=9.5, color=C[1], ha="center")
ax.text(0.47, 0.365, "흑체 궤적", color=C[1], fontsize=10.5)
tri = np.array(SRGB + [SRGB[0]])
ax.plot(tri[:, 0], tri[:, 1], color=C[0], lw=1.3)
ax.text(0.37, 0.265, "sRGB 색역", color=C[0], fontsize=10.5)
ax.plot(*D65, "s", color=C[2], ms=5)
ax.annotate("D65", D65, xytext=(-34, -4), textcoords="offset points", fontsize=10, color=C[2])
ax.plot(*E, "^", color=C[4], ms=5)
ax.annotate("E (1/3, 1/3)", E, xytext=(8, -14), textcoords="offset points", fontsize=10, color=C[4])
save(fig, 1)

# 그림 2: 강의 문제. 세 광원 A, B, C와 목표 D65. 작은 삼각형의 넓이 비가 각 광원의 몫이다
A, B, Cc = (0.2, 0.2), (0.6, 0.3), (0.1, 0.4)
lam3 = bary([A, B, Cc], D65)
fig, ax = plt.subplots(figsize=(6.0, 4.4))
P = np.array([A, B, Cc, A])
ax.fill(P[:-1, 0], P[:-1, 1], color=INK, alpha=0.06)
ax.plot(P[:, 0], P[:, 1], color=INK, lw=1.4)
for V in (A, B, Cc):
    ax.plot([D65[0], V[0]], [D65[1], V[1]], color=INK, lw=0.9, ls=":")
for V, name, off in [(A, "A (0.2, 0.2)", (-6, -16)), (B, "B (0.6, 0.3)", (6, -4)), (Cc, "C (0.1, 0.4)", (-8, 6))]:
    ax.plot(*V, "o", color=C[0], ms=6)
    ax.annotate(name, V, xytext=off, textcoords="offset points", fontsize=10.5, color=C[0],
                ha="right" if off[0] < 0 else "left")
ax.plot(*D65, "s", color=C[2], ms=6)
ax.annotate("W = D65 (0.3127, 0.3290)", D65, xytext=(0.42, 0.165), textcoords="data", fontsize=10.5, color=C[2],
            ha="center", arrowprops=dict(arrowstyle="->", color=C[2], lw=0.9))
# 작은 삼각형의 넓이가 맞은편 광원의 몫이다. A의 몫(삼각형 WBC)은 가늘어서 밖에 적고 화살표로 가리킨다
cA = ((D65[0] + B[0] + Cc[0]) / 3, (D65[1] + B[1] + Cc[1]) / 3)
ax.annotate(f"A의 몫 {lam3[0]:.3f}\n(삼각형 WBC)", cA, xytext=(0.47, 0.405), textcoords="data", fontsize=9.5,
            color=C[1], ha="center", arrowprops=dict(arrowstyle="->", color=C[1], lw=0.9))
cB = ((D65[0] + A[0] + Cc[0]) / 3, (D65[1] + A[1] + Cc[1]) / 3)
ax.text(cB[0], cB[1], f"B의 몫\n{lam3[1]:.3f}", fontsize=9.5, ha="center", va="center", color=C[1])
ax.text(0.43, 0.28, f"C의 몫\n{lam3[2]:.3f}", fontsize=9.5, ha="center", va="center", color=C[1])
ax.set_xlim(0.05, 0.7)
ax.set_ylim(0.13, 0.45)
ax.set_aspect("equal")
ax.set_xlabel("$x$")
ax.set_ylabel("$y$")
save(fig, 2)

if __name__ == "__main__":
    # 근사 말굽이 표준표의 몇 점과 0.015 안에서 맞는다
    for lam, tx, ty in [(450, 0.1566, 0.0177), (500, 0.0082, 0.5384), (520, 0.0743, 0.8338), (600, 0.6270, 0.3725)]:
        x, y = locus(lam)
        assert abs(x - tx) < 0.015 and abs(y - ty) < 0.015, (lam, x, y)
    # 흑체 6500K, D65, 강의 문제의 몫
    x, y = kim_planck(6500)
    assert abs(x - 0.3135) < 5e-5 and abs(y - 0.3237) < 5e-5
    assert all(abs(a - b) < 5e-4 for a, b in zip(lam3, (0.158, 0.394, 0.448)))
    assert abs(sum(lam3) - 1) < 1e-12
    # 넓이 비 = 몫
    def area(p, q, r):
        return abs((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1])) / 2
    T = area(A, B, Cc)
    assert abs(area(D65, B, Cc) / T - lam3[0]) < 1e-12
    # D65는 sRGB 삼각형 안에 있다
    assert min(bary(SRGB, D65)) > 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
