---
layout: "note"
title: "28_primes_plot.py"
display_title: "28_primes_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "28"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/primes/"
parent_title: "소수와 산술의 기본정리"
description: "이산수학 · 소수와 산술의 기본정리 코드 코드"
permalink: "/studies/discrete-math/code/28_primes_plot/"
---
{% raw %}
[소수와 산술의 기본정리](/Hongs_Blog/studies/discrete-math/primes/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 소수와 산술의 기본정리 문서의 그림을 만든다: 28_primes_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 28_primes_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "28_primes"
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


N = 10 ** 6
sieve = np.ones(N + 1, dtype=bool)
sieve[:2] = False
for p in range(2, int(N ** 0.5) + 1):
    if sieve[p]:
        sieve[p * p::p] = False
PI = np.cumsum(sieve)           # PI[n] = n 이하 소수의 개수

# 그림 1: (왼쪽) π(n)과 어림 n/ln n, (오른쪽) 두 값의 비가 1에 아주 천천히 다가간다
ns = np.unique(np.logspace(1, 6, 300).astype(int))
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(6.5, 3))
ax1.plot(ns, PI[ns], color=C[0], lw=2, label=r"$\pi(n)$")
ax1.plot(ns, ns / np.log(ns), color=C[1], lw=1.4, ls="--", label=r"$n / \ln n$")
ax1.set_xlabel("$n$")
ax1.set_xticks([0, 5 * 10 ** 5, 10 ** 6], ["0", "50만", "100만"])
ax1.set_yticks([0, 2 * 10 ** 4, 4 * 10 ** 4, 6 * 10 ** 4, 8 * 10 ** 4], ["0", "2만", "4만", "6만", "8만"])
ax1.legend(loc="upper left", fontsize=10)
ns2 = ns[ns >= 30]
ax2.semilogx(ns2, PI[ns2] / (ns2 / np.log(ns2)), color=C[0], lw=1.8)
ax2.axhline(1, color=INK, lw=0.8, ls=":")
ax2.set_xlabel("$n$")
ax2.set_ylabel(r"$\pi(n) \,/\, (n/\ln n)$")
ax2.set_ylim(0.95, 1.3)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # π(10^6) = 78,498, 어림 72,382, 비 약 1.08
    assert PI[N] == 78498
    assert int(N / math.log(N)) == 72382
    assert abs(PI[N] / (N / math.log(N)) - 1.0845) < 0.001
    assert PI[100] == 25
    print("ALL CHECKS PASSED")
```
{% endraw %}
