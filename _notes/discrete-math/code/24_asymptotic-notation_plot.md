---
layout: "note"
title: "24_asymptotic-notation_plot.py"
display_title: "24_asymptotic-notation_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "24"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/asymptotic-notation/"
parent_title: "점근 표기"
description: "이산수학 · 점근 표기 그림 생성 코드"
permalink: "/studies/discrete-math/code/24_asymptotic-notation_plot/"
---
{% raw %}
[점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 점근 표기 문서의 그림을 만든다: 24_asymptotic-notation_fig1.svg, 24_asymptotic-notation_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 24_asymptotic-notation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "24_asymptotic-notation"
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


def A(n):
    return 3 * n * n + 5 * n + 7


def B(n):
    return 50 * n * math.log2(n)


CROSS = next(n for n in range(2, 10 ** 5) if A(n) > B(n))

# 그림 1: 예시의 두 비교 횟수 A(n), B(n) (두 축 모두 로그). n = 112부터 A가 더 커진다
ns = np.unique(np.logspace(np.log10(2), 4, 300).astype(int))
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.loglog(ns, [A(n) for n in ns], color=C[0], lw=2, label=r"$A(n) = 3n^2 + 5n + 7$")
ax.loglog(ns, [B(n) for n in ns], color=C[1], lw=2, label=r"$B(n) = 50\,n \lg n$")
ax.axvline(CROSS, color=INK, lw=0.8, ls=":")
ax.text(CROSS * 1.15, 30, f"$n = {CROSS}$", fontsize=10)
ax.text(5, 4e3, "A가 적다", fontsize=10)
ax.text(1500, 2e5, "B가 적다", fontsize=10)
ax.set_xlabel("$n$")
ax.set_ylabel("비교 횟수")
ax.legend(loc="upper left")
save(fig, 1)

# 그림 2: 예제의 여덟 함수 (두 축 모두 로그). 작은 n에서는 순서가 뒤섞이고, n이 커지면 서열대로 갈라진다
xs = np.unique(np.logspace(np.log10(2), 6, 400).astype(int))
funcs = [
    (r"$\lg n$", lambda n: math.log2(n)),
    (r"$\sqrt{n}$", lambda n: math.sqrt(n)),
    (r"$n$", lambda n: n),
    (r"$n \lg n$", lambda n: n * math.log2(n)),
    (r"$n^{1.5}$", lambda n: n ** 1.5),
    (r"$n^2$", lambda n: n ** 2),
    (r"$2^n$", lambda n: 2.0 ** n),
    (r"$n!$", lambda n: float(math.factorial(n))),
]
colors = C + ["#2bb3b3", "#c0587e", INK]
fig, ax = plt.subplots(figsize=(6, 3.8))
for (name, f), col in zip(funcs, colors):
    ys = [f(n) if n < 60 or name not in (r"$2^n$", r"$n!$") else np.nan for n in xs]
    ax.loglog(xs, ys, color=col, lw=1.6, label=name)
ax.axvline(16, color=INK, lw=0.6, ls=":")
ax.set_ylim(0.8, 1e13)
ax.set_xlabel("$n$")
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=10)
save(fig, 2)

if __name__ == "__main__":
    # 예시 표의 값, 교차점 112, n = 40과 64에서 서열, n = 16에서는 lg n = 4 = sqrt n
    assert [A(n) for n in [10, 100, 1000, 10000]] == [357, 30507, 3005007, 300050007]
    assert [round(B(n)) for n in [10, 100, 1000, 10000]] == [1661, 33219, 498289, 6643856]
    assert CROSS == 112 and all(A(n) > B(n) for n in range(112, 20000))
    for n in [40, 64]:
        vals = [f(n) for _, f in funcs]
        assert vals == sorted(vals) and len(set(vals)) == len(vals)
    assert math.log2(16) == math.sqrt(16) == 4
    assert math.log2(8) > math.sqrt(8)
    print("ALL CHECKS PASSED")
```
{% endraw %}
