---
layout: "note"
title: "21_multivariable-chain-rule_plot.py"
display_title: "21_multivariable-chain-rule_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "21"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/multivariable-chain-rule/"
parent_title: "다변수 연쇄 법칙과 야코비 행렬"
description: "미분적분학 · 다변수 연쇄 법칙과 야코비 행렬 코드 코드"
permalink: "/studies/calculus/code/21_multivariable-chain-rule_plot/"
---
{% raw %}
[다변수 연쇄 법칙과 야코비 행렬](/Hongs_Blog/studies/calculus/multivariable-chain-rule/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 다변수 연쇄 법칙과 야코비 행렬 문서의 그림을 만든다: 21_multivariable-chain-rule_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 21_multivariable-chain-rule_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "21_multivariable-chain-rule"
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


R0, T0, DR, DT = 2.0, math.pi / 6, 0.4, 0.3


def polar(r, t):
    return r * np.cos(t), r * np.sin(t)


J = np.array([[math.cos(T0), -R0 * math.sin(T0)], [math.sin(T0), R0 * math.cos(T0)]])


def boundary(n=60):
    # (r, θ) 사각형의 테두리를 한 바퀴 도는 점들
    r = np.concatenate([np.linspace(R0 - DR / 2, R0 + DR / 2, n), np.full(n, R0 + DR / 2),
                        np.linspace(R0 + DR / 2, R0 - DR / 2, n), np.full(n, R0 - DR / 2)])
    t = np.concatenate([np.full(n, T0 - DT / 2), np.linspace(T0 - DT / 2, T0 + DT / 2, n),
                        np.full(n, T0 + DT / 2), np.linspace(T0 + DT / 2, T0 - DT / 2, n)])
    return r, t


# 그림 1: 극좌표 사각형(왼쪽)이 (x, y) 평면에서 휘어진 조각(오른쪽 파랑)이 된다. 야코비 J가 보낸 평행사변형(주황 점선)과 거의 겹친다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3.1))
r, t = boundary()
a1.fill(r, t, color=C[0], alpha=0.25)
a1.plot(r, t, color=C[0], lw=1.5)
a1.plot([R0], [T0], "o", ms=5, color=INK)
a1.set_xlabel("$r$")
a1.set_ylabel(r"$\theta$")
a1.set_xlim(1.5, 2.5)
a1.set_ylim(T0 - 0.4, T0 + 0.4)
a1.set_title(r"$(r,\theta)$ 평면", fontsize=10)
x, y = polar(r, t)
a2.fill(x, y, color=C[0], alpha=0.25)
a2.plot(x, y, color=C[0], lw=1.5, label="실제 모양")
c = np.array(polar(R0, T0))
corners = [np.array([a, b]) for a, b in [(-DR / 2, -DT / 2), (DR / 2, -DT / 2), (DR / 2, DT / 2), (-DR / 2, DT / 2), (-DR / 2, -DT / 2)]]
pts = np.array([c + J @ d for d in corners])
a2.plot(pts[:, 0], pts[:, 1], color=C[1], lw=1.5, ls="--", label=r"$J\mathbf{h}$로 본 모양")
a2.plot(*c, "o", ms=5, color=INK)
a2.set_aspect("equal")
a2.set_xlabel("$x$")
a2.set_ylabel("$y$")
a2.set_title(r"$(x,y)$ 평면", fontsize=10)
a2.legend(loc="upper left", bbox_to_anchor=(1.0, 1.0), fontsize=8)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # det J = r, 평행사변형 넓이 r·dr·dθ, 실제 조각 넓이 ∫∫ r dr dθ (가운데를 잡아 둘이 같다)
    assert abs(np.linalg.det(J) - R0) < 1e-12
    par = abs(np.linalg.det(J)) * DR * DT
    exact = ((R0 + DR / 2) ** 2 - (R0 - DR / 2) ** 2) / 2 * DT
    assert abs(par - exact) < 1e-12 and abs(par - 0.24) < 1e-12
    # 신발끈 공식으로 그린 조각의 넓이도 확인
    area = 0.5 * abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))
    assert abs(area - exact) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
