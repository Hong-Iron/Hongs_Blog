---
layout: "note"
title: "36_shooting-method_plot.py"
display_title: "36_shooting-method_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "36"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/shooting-method/"
parent_title: "사격법"
description: "수치해석 · 사격법 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/36_shooting-method_plot/"
---
{% raw %}
[사격법](/Hongs_Blog/studies/numerical-analysis/shooting-method/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 사격법 문서의 그림을 만든다: 36_shooting-method_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 36_shooting-method_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "36_shooting-method"
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


HP, TA = 0.01, 20.0


def F(x, s):
    return np.array([s[1], HP * (s[0] - TA)])


def shoot(z0, h):
    x, s = 0.0, np.array([40.0, z0])
    xs, Ts = [x], [s[0]]
    for _ in range(round(10 / h)):
        k1 = F(x, s)
        k2 = F(x + h / 2, s + h / 2 * k1)
        k3 = F(x + h / 2, s + h / 2 * k2)
        k4 = F(x + h, s + h * k3)
        s = s + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
        x += h
        xs.append(x)
        Ts.append(s[0])
    return np.array(xs), np.array(Ts)


end2 = {z: shoot(z, 2.0)[1][-1] for z in (10, 20)}      # 슬라이드처럼 걸음 2
z_star = 10 + (20 - 10) / (end2[20] - end2[10]) * (200 - end2[10])

fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (z, name) in enumerate([(10, "첫 번째 짐작"), (20, "두 번째 짐작"), (z_star, "보간한 기울기")]):
    xs, Ts = shoot(z, 0.05)
    ax.plot(xs, Ts, color=C[[0, 1, 2][i]], lw=2 if i == 2 else 1.4, ls="-" if i == 2 else "--",
            label=f"$z(0) = {z:.4g}$: {name}")
    ax.plot(10, Ts[-1], "o", color=C[i], ms=5)
    ax.annotate(f"{Ts[-1]:.0f}" + (" (과녁)" if i == 2 else ""), (10, Ts[-1]), textcoords="offset points",
                xytext=(6, -4), fontsize=9, color=C[i])
ax.plot(0, 40, "s", color=INK, ms=5)
ax.annotate("T(0) = 40", (0, 40), textcoords="offset points", xytext=(6, -12), fontsize=9)
ax.plot(10, 200, "+", color=INK, ms=14, mew=1.5)
ax.set_xlim(-0.3, 12)
ax.set_xlabel("막대 위치 $x$ (m)")
ax.set_ylabel("온도 $T$ (°C)")
ax.legend(loc="upper left", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 표: z(0) = 10 → 168.3797, 20 → 285.8980 (RK4, 걸음 2), 보간한 기울기 12.6907이 T(10) = 200을 맞힌다
    assert abs(end2[10] - 168.3797) < 1e-4 and abs(end2[20] - 285.8980) < 1e-4
    assert abs(z_star - 12.6907) < 1e-4 and abs(shoot(z_star, 2.0)[1][-1] - 200) < 1e-9
    assert abs(shoot(z_star, 0.05)[1][-1] - 200) < 0.1     # 그림의 촘촘한 걸음에서도 과녁 근처
    print("ALL CHECKS PASSED")
```
{% endraw %}
