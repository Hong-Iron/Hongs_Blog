---
layout: "note"
title: "09_lhopital-growth_plot.py"
display_title: "09_lhopital-growth_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "09"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/lhopital-growth/"
parent_title: "로피탈 정리와 증가 속도"
description: "미분적분학 · 로피탈 정리와 증가 속도 코드 코드"
permalink: "/studies/calculus/code/09_lhopital-growth_plot/"
---
{% raw %}
[로피탈 정리와 증가 속도](/Hongs_Blog/studies/calculus/lhopital-growth/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 로피탈 정리와 증가 속도 문서의 그림을 만든다: 09_lhopital-growth_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 09_lhopital-growth_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "09_lhopital-growth"
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


def log_ticks(axis, step=1):
    # 로그 눈금 글자를 10^k 꼴로 직접 쓴다(한글 글꼴에 없는 빼기 기호를 피한다)
    axis.set_major_formatter(ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(math.log10(v)))}}}$"))
    axis.set_minor_formatter(ticker.NullFormatter())


def ratio_log(L):
    # x = 10^L일 때 ln x / x^0.1. 큰 x에서도 넘치지 않게 로그로 계산한다
    return L * math.log(10) / 10 ** (0.1 * L)


# 그림 1: "결국 0으로 간다"가 아주 늦게 온다. 왼쪽 ln x / x^0.1, 오른쪽 x^10 / 1.1^x
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
L = np.linspace(0, 120, 600)
a1.plot(10 ** L, [ratio_log(v) for v in L], color=C[0], lw=2)
a1.set_xscale("log")
a1.xaxis.set_major_locator(ticker.FixedLocator(10.0 ** np.arange(0, 121, 30)))
log_ticks(a1.xaxis)
a1.plot([1e10], [ratio_log(10)], "o", ms=4, color=C[1])
a1.annotate("$x=10^{10}$에서 2.3", xy=(1e10, ratio_log(10)), xytext=(1e25, 3.2), fontsize=9,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
a1.set_title(r"$\ln x \,/\, x^{0.1}$", fontsize=10)
a1.set_xlabel("$x$ (로그 눈금)")
a1.set_ylim(0, 4)
x = np.linspace(1, 800, 800)
a2.semilogy(x, 10 ** (10 * np.log10(x) - x * np.log10(1.1)), color=C[1], lw=2)
a2.axhline(1, color=INK, lw=0.6, ls=":")
a2.yaxis.set_major_locator(ticker.FixedLocator(10.0 ** np.arange(-4, 17, 4)))
log_ticks(a2.yaxis)
a2.set_title(r"$x^{10} \,/\, 1.1^{x}$", fontsize=10)
a2.set_xlabel("$x$")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 문서의 두 값(10^10에서 약 2.3, 10^100에서 2.3e-8), 최댓값 위치 x = e^10, 둘째 비의 꼭대기와 1 아래로 내려가는 곳
    assert abs(ratio_log(10) - 2.3026) < 1e-3
    assert abs(ratio_log(100) - 2.3026e-8) < 1e-11
    Lm = L[np.argmax([ratio_log(v) for v in L])]
    assert abs(Lm - 10 / math.log(10)) < 0.2                 # 꼭대기는 x = e^10 근처
    r = 10 * np.log10(x) - x * np.log10(1.1)
    assert abs(x[np.argmax(r)] - 10 / math.log(1.1)) < 1 and r.max() > 15
    assert r[-1] < 0
    cross = x[np.where((r < 0) & (x > 100))[0][0]]
    assert 684 < cross < 687                                 # 비가 1 아래로 내려가는 곳은 x ≈ 685
    print("ALL CHECKS PASSED")
```
{% endraw %}
