---
layout: "note"
title: "11_riemann-integral_plot.py"
display_title: "11_riemann-integral_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "11"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/riemann-integral/"
parent_title: "정적분과 리만 합"
description: "미분적분학 · 정적분과 리만 합 그림 생성 코드"
permalink: "/studies/calculus/code/11_riemann-integral_plot/"
---
{% raw %}
[정적분과 리만 합](/Hongs_Blog/studies/calculus/riemann-integral/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 정적분과 리만 합 문서의 그림을 만든다: 11_riemann-integral_fig1.svg, 11_riemann-integral_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 11_riemann-integral_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "11_riemann-integral"
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


from matplotlib import ticker


def log_ticks(axis):
    # 로그 눈금 글자를 10^k 꼴로 직접 쓴다(한글 글꼴에 없는 빼기 기호를 피한다)
    axis.set_major_formatter(ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(math.log10(v)))}}}$"))
    axis.set_minor_formatter(ticker.NullFormatter())


def endpoint_sum(f, a, b, n, right):
    dx = (b - a) / n
    return sum(f(a + (i + (1 if right else 0)) * dx) for i in range(n)) * dx


def trapezoid(f, a, b, n):
    dx = (b - a) / n
    return dx * (0.5 * f(a) + sum(f(a + i * dx) for i in range(1, n)) + 0.5 * f(b))


def simpson(f, a, b, n):
    dx = (b - a) / n
    s = f(a) + f(b) + sum((4 if i % 2 else 2) * f(a + i * dx) for i in range(1, n))
    return s * dx / 3


def v(t):
    return t * t


# 그림 1: 속도 t^2을 6칸으로 나눈 왼쪽 끝 합(모자람)과 오른쪽 끝 합(넘침)
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3), sharey=True)
t = np.linspace(0, 3, 200)
n, dx = 6, 0.5
for ax, right, title, col in [(axes[0], False, "왼쪽 끝 합", C[0]), (axes[1], True, "오른쪽 끝 합", C[1])]:
    for i in range(n):
        h = v((i + (1 if right else 0)) * dx)
        ax.bar(i * dx, h, width=dx, align="edge", color=col, alpha=0.3, edgecolor=col, lw=1)
    ax.plot(t, v(t), color=INK, lw=2)
    s = endpoint_sum(v, 0, 3, n, right)
    ax.set_title(f"{title} $= {s:g}$", fontsize=10)
    ax.set_xlabel("$t$ (초)")
axes[0].set_ylabel("속도 (m/s)")
fig.tight_layout()
save(fig, 1)

# 그림 2: 칸 수를 늘릴 때 오차가 줄어드는 빠르기. 기울기가 가파를수록 빨리 준다(∫_0^1 e^x dx)
ex = math.e - 1
ns = [2 ** k for k in range(1, 10)]
errs = {
    "왼쪽 끝 합": [abs(endpoint_sum(math.exp, 0, 1, m, False) - ex) for m in ns],
    "사다리꼴 규칙": [abs(trapezoid(math.exp, 0, 1, m) - ex) for m in ns],
    "심프슨 규칙": [abs(simpson(math.exp, 0, 1, m) - ex) for m in ns],
}
fig, ax = plt.subplots(figsize=(6, 3.6))
for (name, e), col, mk in zip(errs.items(), C, "os^"):
    ax.loglog(ns, e, mk + "-", ms=4, lw=1.4, color=col, label=name)
for (name, e), col, lab in zip(errs.items(), C, ["2배마다 1/2로", "1/4로", "1/16로"]):
    ax.text(620, e[-1], lab, fontsize=9, color=col, va="center")
ax.set_xticks(ns)
ax.xaxis.set_major_formatter(ticker.FuncFormatter(lambda v_, _: f"{int(v_)}"))
ax.xaxis.set_minor_formatter(ticker.NullFormatter())
ax.yaxis.set_major_locator(ticker.FixedLocator(10.0 ** np.arange(-14, 1, 2)))
log_ticks(ax.yaxis)
ax.set_xlim(1.6, 3000)
ax.set_xlabel("칸 수 $n$")
ax.set_ylabel("오차")
ax.legend(loc="lower left", fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 표의 L_6, R_6, 그리고 n을 2배로 할 때 오차 비율이 약 2, 4, 16
    assert abs(endpoint_sum(v, 0, 3, 6, False) - 6.875) < 1e-12
    assert abs(endpoint_sum(v, 0, 3, 6, True) - 11.375) < 1e-12
    for name, want in [("왼쪽 끝 합", 2), ("사다리꼴 규칙", 4), ("심프슨 규칙", 16)]:
        e = errs[name]
        assert abs(e[3] / e[4] - want) / want < 0.05, (name, e[3] / e[4])
    assert errs["심프슨 규칙"][-1] < 1e-12                       # 칸 512개면 오차가 10^-12 아래
    print("ALL CHECKS PASSED")
```
{% endraw %}
