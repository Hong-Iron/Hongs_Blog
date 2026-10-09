---
layout: "note"
title: "31_fourier-transform_plot.py"
display_title: "31_fourier-transform_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "31"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/fourier-transform/"
parent_title: "푸리에 변환과 합성곱"
description: "미분적분학 · 푸리에 변환과 합성곱 코드 코드"
permalink: "/studies/calculus/code/31_fourier-transform_plot/"
---
{% raw %}
[푸리에 변환과 합성곱](/Hongs_Blog/studies/calculus/fourier-transform/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 푸리에 변환과 합성곱 문서의 그림을 만든다: 31_fourier-transform_fig1.svg, 31_fourier-transform_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 31_fourier-transform_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "31_fourier-transform"
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


def box(x, w=1.0):
    return (np.abs(x) < w / 2).astype(float)


def box_hat(xi, w=1.0):
    # 폭 w, 높이 1인 상자의 변환 w·sinc(w ξ)
    return w * np.sinc(w * xi)


def tri(x):
    return np.clip(1 - np.abs(x), 0, None)


# 그림 1: 상자 펄스(왼쪽)와 스펙트럼(오른쪽). 폭을 1에서 2로 늘리면 스펙트럼의 첫 0점이 1에서 1/2로 당겨진다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
x = np.linspace(-1.6, 1.6, 2001)
xi = np.linspace(-3, 3, 1201)
for i, w in enumerate([1, 2]):
    a1.plot(x, box(x, w) * (1 - 0.03 * i), color=C[i], lw=2, label=f"폭 {w}")
    a2.plot(xi, box_hat(xi, w), color=C[i], lw=1.8, label=f"폭 {w}")
    a2.plot([1 / w], [0], "o", ms=5, color=C[i])
a1.set_title("시간(위치) 쪽", fontsize=10)
a1.set_xlabel("$x$")
a1.set_ylim(-0.2, 1.3)
a1.legend(loc="upper right", fontsize=8)
a2.axhline(0, color=INK, lw=0.6)
a2.set_title(r"주파수 쪽 $\hat f(\xi)$", fontsize=10)
a2.set_xlabel(r"$\xi$")
a2.legend(loc="upper right", fontsize=8)
fig.tight_layout()
save(fig, 1)

# 그림 2: 상자 둘의 합성곱. 왼쪽은 x = 0.4만큼 민 상자와 겹친 넓이(0.6)가 삼각형 위의 한 점이 되는 모습,
# 오른쪽은 주파수 쪽에서 두 sinc를 곱한 sinc^2
X0 = 0.4
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
y = np.linspace(-1.6, 1.6, 2001)
a1.plot(y, box(y), color=C[0], lw=1.6, label="$f(y)$")
a1.plot(y, box(X0 - y) * 0.97, color=C[1], lw=1.6, label=f"$g({X0:g}-y)$")
ov = (box(y) * box(X0 - y)) > 0
a1.fill_between(y, 0, 1, where=ov, color=C[2], alpha=0.25)
a1.plot(y, tri(y), color=C[2], lw=2, label="$(f*g)(x)$")
a1.plot([X0], [tri(X0)], "o", ms=5, color=C[2])
a1.set_xlabel("$y$, $x$")
a1.set_ylim(-0.1, 1.45)
a1.legend(loc="upper left", fontsize=8, ncol=3, columnspacing=0.8, handlelength=1.2)
a2.plot(xi, box_hat(xi) ** 2, color=C[2], lw=1.8)
a2.axhline(0, color=INK, lw=0.6)
a2.set_title(r"$\hat f\,\hat g=\mathrm{sinc}^2$", fontsize=10)
a2.set_xlabel(r"$\xi$")
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    # sinc 값(ξ = 1/2에서 2/π, 정수에서 0), 폭 2의 첫 0점 1/2, 겹친 넓이 0.6 = 삼각형 값,
    # 삼각형을 수치로 변환하면 sinc^2(합성곱 정리)
    assert abs(box_hat(0.5) - 2 / math.pi) < 1e-12 and abs(box_hat(1.0)) < 1e-12
    assert abs(box_hat(0.5, 2)) < 1e-12 and box_hat(0.25, 2) > 0
    dy = y[1] - y[0]
    assert abs(np.sum(box(y) * box(X0 - y)) * dy - 0.6) < 2e-3 and abs(tri(X0) - 0.6) < 1e-12
    t = np.linspace(-1, 1, 20001)
    dt = t[1] - t[0]
    for v in [0.0, 0.3, 0.5, 1.2]:
        ft = np.sum(tri(t) * np.cos(2 * np.pi * v * t)) * dt
        assert abs(ft - np.sinc(v) ** 2) < 1e-6
    print("ALL CHECKS PASSED")
```
{% endraw %}
