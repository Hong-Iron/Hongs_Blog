---
layout: "note"
title: "25_master-theorem_plot.py"
display_title: "25_master-theorem_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "25"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/master-theorem/"
parent_title: "분할 정복 점화식과 마스터 정리"
description: "이산수학 · 분할 정복 점화식과 마스터 정리 코드 코드"
permalink: "/studies/discrete-math/code/25_master-theorem_plot/"
---
{% raw %}
[분할 정복 점화식과 마스터 정리](/Hongs_Blog/studies/discrete-math/master-theorem/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 분할 정복 점화식과 마스터 정리 문서의 그림을 만든다: 25_master-theorem_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 25_master-theorem_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "25_master-theorem"
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


RECS = [  # (라벨, a, f, 비교할 g, 모이는 값)
    (r"$2T(n/2) + n \;/\; n \lg n$", 2, lambda n: n, lambda n: n * math.log2(n), 1),
    (r"$4T(n/2) + n \;/\; n^2$", 4, lambda n: n, lambda n: n ** 2, 2),
    (r"$T(n/2) + n \;/\; n$", 1, lambda n: n, lambda n: n, 2),
    (r"$3T(n/2) + n \;/\; n^{\lg 3}$", 3, lambda n: n, lambda n: n ** math.log2(3), 3),
]


def T(a, f, n):
    # n = 2^k에서 T(n) = a T(n/2) + f(n), T(1) = 1
    return 1 if n == 1 else a * T(a, f, n // 2) + f(n)


# 그림 1: T(n)을 마스터 정리가 말하는 g(n)으로 나눈 비. n = 2^k가 커지면 상수로 모인다
ks = np.arange(1, 21)
fig, ax = plt.subplots(figsize=(6, 3.6))
styles = [dict(marker="o", ms=3), dict(marker="o", ms=7, mfc="none"), dict(marker="o", ms=3, ls="--"), dict(marker="o", ms=3)]
for (lab, a, f, g, lim), col, st in zip(RECS, C, styles):
    st = {"ls": "-", **st}
    ax.plot(ks, [T(a, f, 2 ** k) / g(2 ** k) for k in ks], color=col, lw=1.4, label=lab, **st)
ax.set_xticks([1, 5, 10, 15, 20])
ax.set_xlabel(r"$k$  ($n = 2^k$)")
ax.set_ylabel(r"$T(n) \,/\, g(n)$")
ax.set_ylim(0, 3.6)
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=9.5)
save(fig, 1)

if __name__ == "__main__":
    # 닫힌 꼴: n lg n + n, 2n^2 - n, 2n - 1, 3 n^{lg 3} - 2n. 예시 표의 n = 16 합 80, 496, 31
    for k in range(0, 21):
        n = 2 ** k
        assert T(2, lambda m: m, n) == n * k + n
        assert T(4, lambda m: m, n) == 2 * n * n - n
        assert T(1, lambda m: m, n) == 2 * n - 1
        assert T(3, lambda m: m, n) == 3 * 3 ** k - 2 * n
    assert [T(a, lambda m: m, 16) for a in (2, 4, 1)] == [80, 496, 31]
    for lab, a, f, g, lim in RECS:
        assert abs(T(a, f, 2 ** 20) / g(2 ** 20) - lim) < 0.06
    print("ALL CHECKS PASSED")
```
{% endraw %}
