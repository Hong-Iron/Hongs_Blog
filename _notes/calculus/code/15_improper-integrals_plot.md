---
layout: "note"
title: "15_improper-integrals_plot.py"
display_title: "15_improper-integrals_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "15"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/improper-integrals/"
parent_title: "이상적분"
description: "미분적분학 · 이상적분 코드 코드"
permalink: "/studies/calculus/code/15_improper-integrals_plot/"
---
{% raw %}
[이상적분](/Hongs_Blog/studies/calculus/improper-integrals/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 이상적분 문서의 그림을 만든다: 15_improper-integrals_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 15_improper-integrals_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "15_improper-integrals"
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

# 그림 1: 왼쪽은 두 곡선의 꼬리, 오른쪽은 1부터 t까지 쌓인 넓이. 1/x^2은 1에서 멈추고 1/x은 끝없이 자란다
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
x = np.linspace(1, 10, 300)
a1.plot(x, 1 / x, color=C[1], lw=2, label="$1/x$")
a1.plot(x, 1 / x ** 2, color=C[0], lw=2, label="$1/x^2$")
a1.fill_between(x, 1 / x, color=C[1], alpha=0.12)
a1.fill_between(x, 1 / x ** 2, color=C[0], alpha=0.25)
a1.set_xlabel("$x$")
a1.set_ylim(0, 1.05)
a1.legend(loc="upper right", fontsize=9)
t = np.logspace(0, 6, 300)
a2.plot(t, 1 - 1 / t, color=C[0], lw=2, label=r"$\int_1^t x^{-2}dx$")
a2.plot(t, np.log(t), color=C[1], lw=2, label=r"$\int_1^t x^{-1}dx$")
a2.axhline(1, color=C[0], lw=0.8, ls=":")
a2.set_xscale("log")
a2.xaxis.set_major_locator(ticker.FixedLocator([1, 10, 1e2, 1e3, 1e4, 1e5, 1e6]))
a2.xaxis.set_major_formatter(ticker.FuncFormatter(lambda v, _: f"$10^{{{int(round(math.log10(v)))}}}$"))
a2.xaxis.set_minor_formatter(ticker.NullFormatter())
a2.set_xlabel("자른 곳 $t$ (로그 눈금)")
a2.set_ylabel("쌓인 넓이")
a2.legend(loc="upper left", fontsize=9)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 표의 값: t = 10, 1000, 10^6에서 1 - 1/t와 ln t
    for tv, a, b in [(10, 0.9, 2.30), (1000, 0.999, 6.91), (1e6, 0.999999, 13.8)]:
        assert abs((1 - 1 / tv) - a) < 1e-12 and abs(math.log(tv) - b) < 0.02
    # 중점 합으로 ∫_1^10 1/x^2 = 0.9 확인
    n = 200000
    dx = 9 / n
    assert abs(sum(1 / (1 + (i + 0.5) * dx) ** 2 for i in range(n)) * dx - 0.9) < 1e-8
    print("ALL CHECKS PASSED")
```
{% endraw %}
