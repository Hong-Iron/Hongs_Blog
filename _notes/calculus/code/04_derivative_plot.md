---
layout: "note"
title: "04_derivative_plot.py"
display_title: "04_derivative_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "04"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/derivative/"
parent_title: "도함수"
description: "미분적분학 · 도함수 그림 생성 코드"
permalink: "/studies/calculus/code/04_derivative_plot/"
---
{% raw %}
[도함수](/Hongs_Blog/studies/calculus/derivative/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 도함수 문서의 그림을 만든다: 04_derivative_fig1.svg, 04_derivative_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 04_derivative_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "04_derivative"
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


def f(t):
    return t ** 2


# 그림 1: t = 3에서 할선이 구간을 줄이며 접선(기울기 6)으로 바뀐다
t = np.linspace(1.5, 4.3, 300)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(t, f(t), color=INK, lw=2.4, label="$f(t)=t^2$")
for i, h in enumerate([1, 0.5, 0.1]):
    s = (f(3 + h) - f(3)) / h
    ax.plot(t, f(3) + s * (t - 3), color=C[i], lw=1.3, label=f"할선 $h={h}$, 기울기 {s:g}")
    ax.plot([3 + h], [f(3 + h)], "o", ms=4, color=C[i])
ax.plot(t, f(3) + 6 * (t - 3), color=C[3], lw=1.6, ls="--", label="접선, 기울기 6")
ax.plot([3], [9], "o", ms=6, color=INK)
ax.set_xlim(1.5, 4.3)
ax.set_ylim(0, 19)
ax.set_xlabel("$t$ (초)")
ax.set_ylabel("위치 (m)")
ax.legend(loc="upper left", fontsize=9)
save(fig, 1)


# 그림 2: e^x의 x = 0에서 수치 미분 오차. h가 너무 커도, 너무 작아도 커진다
def fwd(h):
    return abs((math.exp(h) - 1.0) / h - 1.0)


def ctr(h):
    return abs((math.exp(h) - math.exp(-h)) / (2 * h) - 1.0)


H = 10.0 ** np.arange(-16, 0.01, 0.25)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.loglog(H, [fwd(h) for h in H], "o-", ms=3, lw=1.2, color=C[0], label="전진 차분")
ax.loglog(H, [ctr(h) for h in H], "s-", ms=3, lw=1.2, color=C[1], label="중앙 차분")
ax.axvline(1e-8, color=C[0], lw=0.8, ls=":")
ax.axvline(1e-5, color=C[1], lw=0.8, ls=":")
ax.text(3e-15, 1e-12, "반올림 오차가\n커지는 쪽", fontsize=9)
ax.text(2e-3, 3e-12, "극한에서 먼\n오차가 큰 쪽", fontsize=9)
ax.set_xlabel("$h$")
ax.set_ylabel("오차")
ax.set_ylim(1e-13, 10)
ax.xaxis.set_major_locator(ticker.FixedLocator(10.0 ** np.arange(-16, 1, 2)))
ax.yaxis.set_major_locator(ticker.FixedLocator(10.0 ** np.arange(-12, 1, 3)))
log_ticks(ax.xaxis)
log_ticks(ax.yaxis)
ax.legend(loc="center left", bbox_to_anchor=(0.02, 0.42), fontsize=9)
save(fig, 2)

if __name__ == "__main__":
    # 예시 표의 할선 기울기 6 + h, 문서 오차표 몇 칸과 최적 h 근처의 값
    for h in [1, 0.1, 0.01, 0.001]:
        assert abs((f(3 + h) - f(3)) / h - (6 + h)) < 1e-9
    assert abs(fwd(1e-1) - 5.2e-2) < 0.05e-2 and abs(ctr(1e-1) - 1.7e-3) < 0.05e-3
    assert abs(fwd(1e-4) - 5.0e-5) < 0.1e-5 and abs(ctr(1e-4) - 1.7e-9) < 0.1e-9
    assert abs(fwd(1e-8) - 6.1e-9) < 0.1e-9
    assert abs(ctr(1e-5) - 1.2e-11) < 0.1e-11
    assert abs(fwd(1e-15) - 1.1e-1) < 0.05e-1
    print("ALL CHECKS PASSED")
```
{% endraw %}
