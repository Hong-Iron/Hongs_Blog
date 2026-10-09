---
layout: "note"
title: "19_inclusion-exclusion_plot.py"
display_title: "19_inclusion-exclusion_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "19"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/inclusion-exclusion/"
parent_title: "포함-배제 원리"
description: "이산수학 · 포함-배제 원리 코드 코드"
permalink: "/studies/discrete-math/code/19_inclusion-exclusion_plot/"
---
{% raw %}
[포함-배제 원리](/Hongs_Blog/studies/discrete-math/inclusion-exclusion/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 포함-배제 원리 문서의 그림을 만든다: 19_inclusion-exclusion_fig1.svg, 19_inclusion-exclusion_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 19_inclusion-exclusion_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "19_inclusion-exclusion"
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


def derangements(n):
    return round(math.factorial(n) * sum((-1) ** k / math.factorial(k) for k in range(n + 1)))


# 그림 1: 아무도 자기 모자를 받지 못할 확률 D_n / n! 이 1/e로 다가가는 모습
ns = np.arange(1, 11)
p = [derangements(n) / math.factorial(n) for n in ns]
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.axhline(1 / math.e, color=INK, lw=1, ls="--")
ax.text(10, 1 / math.e + 0.03, r"$1/e \approx 0.368$", ha="right", va="bottom", fontsize=10)
ax.plot(ns, p, "o-", color=C[0], ms=5, lw=1.5)
for n, v in zip(ns[:5], p[:5]):
    ax.annotate(f"{v:.3f}", (n, v), textcoords="offset points", xytext=(0, 8 if n % 2 == 0 or n == 1 else -15),
                ha="center", fontsize=9)
ax.set_xticks(ns)
ax.set_ylim(-0.05, 0.6)
ax.set_xlabel("사람 수 $n$")
ax.set_ylabel(r"$D_n / n!$")
save(fig, 1)

# 그림 2: 1~1000에서 2, 3, 5의 배수 집합을 벤 다이어그램으로. 칸마다 그 칸에만 드는 수의 개수
N = 1000
SETS = [(2, "2의 배수"), (3, "3의 배수"), (5, "5의 배수")]
REGION = {}
for x in range(1, N + 1):
    key = tuple(x % d == 0 for d, _ in SETS)
    REGION[key] = REGION.get(key, 0) + 1
centers = [(-0.6, 0.35), (0.6, 0.35), (0.0, -0.62)]
fig, ax = plt.subplots(figsize=(5.2, 4.6))
for (cx, cy), col in zip(centers, C[:3]):
    ax.add_patch(plt.Circle((cx, cy), 1.0, fill=True, alpha=0.12, color=col, lw=0))
    ax.add_patch(plt.Circle((cx, cy), 1.0, fill=False, color=col, lw=1.6))
spots = {
    (True, False, False): (-1.05, 0.62), (False, True, False): (1.05, 0.62), (False, False, True): (0.0, -1.25),
    (True, True, False): (0.0, 0.82), (True, False, True): (-0.68, -0.42), (False, True, True): (0.68, -0.42),
    (True, True, True): (0.0, 0.02),
}
for key, (x, y) in spots.items():
    ax.text(x, y, str(REGION[key]), ha="center", va="center", fontsize=13)
ax.text(-1.55, 1.45, f"{SETS[0][1]} 500", ha="center", color=C[0], fontsize=11)
ax.text(1.55, 1.45, f"{SETS[1][1]} 333", ha="center", color=C[1], fontsize=11)
ax.text(1.25, -1.62, f"{SETS[2][1]} 200", ha="left", color=C[2], fontsize=11)
ax.text(-1.95, -1.75, f"어느 것으로도 안 나뉨: {REGION[(False, False, False)]}", ha="left", fontsize=10)
ax.set_xlim(-2.0, 2.0)
ax.set_ylim(-1.9, 1.7)
ax.set_aspect("equal")
ax.axis("off")
save(fig, 2)

if __name__ == "__main__":
    # D_1..D_6 = 0, 1, 2, 9, 44, 265, n = 10이면 1/e와 1e-7 안쪽
    assert [derangements(n) for n in range(1, 7)] == [0, 1, 2, 9, 44, 265]
    assert abs(derangements(10) / math.factorial(10) - 1 / math.e) < 1e-7
    assert abs(9 / 24 - 0.375) < 1e-12
    assert round(265 / 720, 3) == 0.368 and round(44 / 120, 3) == 0.367
    # 그림 2의 칸: 일곱 칸의 합이 734, 셋 모두 33, 둘씩만 133·67·33, 하나만 267·134·67, 밖 266
    assert sum(v for k, v in REGION.items() if any(k)) == 734
    assert REGION[(True, True, True)] == 33
    assert (REGION[(True, True, False)], REGION[(True, False, True)], REGION[(False, True, True)]) == (133, 67, 33)
    assert (REGION[(True, False, False)], REGION[(False, True, False)], REGION[(False, False, True)]) == (267, 134, 67)
    assert REGION[(False, False, False)] == 266
    print("ALL CHECKS PASSED")
```
{% endraw %}
