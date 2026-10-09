---
layout: "note"
title: "137_gamblers-fallacy--independence_plot.py"
display_title: "137_gamblers-fallacy--independence_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "137"
course: "이상 심리학"
course_slug: "abnormal-psychology"
course_url: "/studies/abnormal-psychology/"
track: "심리학"
parent_url: "/studies/abnormal-psychology/gamblers-fallacy--independence/"
parent_title: "도박사의 오류 ↔ 독립"
description: "이상 심리학 · 도박사의 오류 ↔ 독립 그림 생성 코드"
permalink: "/studies/abnormal-psychology/code/137_gamblers-fallacy--independence_plot/"
---
{% raw %}
[도박사의 오류 ↔ 독립](/Hongs_Blog/studies/abnormal-psychology/gamblers-fallacy--independence/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 도박사의 오류 ↔ 독립 문서의 그림을 만든다: 137_gamblers-fallacy--independence_fig1.svg, _fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 137_gamblers-fallacy--independence_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "137_gamblers-fallacy--independence"
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

rng = np.random.default_rng(20260927)
N = 2000
PATHS = 5

# 그림 1: 뒷면 5개를 먼저 안고 공정한 동전을 계속 던진다. 비율은 1/2로 가지만 차이는 메워지지 않는다
n = np.arange(1, N + 1)
flips = rng.integers(0, 2, size=(PATHS, N)) * 2 - 1        # 앞면 +1, 뒷면 -1
diff = -5 + np.cumsum(flips, axis=1)                        # (앞면 수) - (뒷면 수)
heads = (np.cumsum(flips == 1, axis=1))
ratio = heads / (n + 5)
fig, axes = plt.subplots(1, 2, figsize=(6.5, 3.0))
ax = axes[0]
for p in range(PATHS):
    ax.plot(n, ratio[p], color=C[p % 5], lw=0.9, alpha=0.8)
ax.plot(n, (n / 2) / (n + 5), color=INK, lw=2, ls="--")
ax.axhline(0.5, color=INK, lw=0.6)
ax.set_xscale("log")
ax.set_ylim(0, 0.8)
ax.set_title("앞면 비율: 1/2로 다가간다", fontsize=10)
ax.set_xlabel("더 던진 횟수 (로그 눈금)")
ax = axes[1]
for p in range(PATHS):
    ax.plot(n, diff[p], color=C[p % 5], lw=0.9, alpha=0.8)
ax.axhline(-5, color=INK, lw=2, ls="--")
ax.axhline(0, color=INK, lw=0.6)
ax.set_title("앞면 수 - 뒷면 수: 평균은 -5 그대로", fontsize=10)
ax.set_xlabel("더 던진 횟수")
fig.tight_layout()
save(fig, 1)

# 그림 2: 유럽식 룰렛 빨강에 1단위씩 건다. 한 판 한 판은 들쭉날쭉해도 누적 손익은 -n/37 선을 따라 내려간다
SPINS = 2000
spins = rng.integers(0, 37, size=(PATHS, SPINS))
net = np.cumsum(np.where((spins >= 1) & (spins <= 18), 1, -1), axis=1)
k = np.arange(1, SPINS + 1)
fig, ax = plt.subplots(figsize=(6, 3.4))
for p in range(PATHS):
    ax.plot(k, net[p], color=C[p % 5], lw=0.9, alpha=0.8)
ax.plot(k, -k / 37, color=INK, lw=2, ls="--")
ax.axhline(0, color=INK, lw=0.6)
ax.text(SPINS * 1.02, -SPINS / 37, "기댓값\n$-n/37$", fontsize=10, ha="left", va="center")
ax.set_xlim(-50, SPINS * 1.2)
ax.set_xlabel("판 수 $n$")
ax.set_ylabel("누적 손익 (단위)")
save(fig, 2)

if __name__ == "__main__":
    # 기댓값: 차이 -5, 비율 (n/2)/(n+5) -> 1/2, 빨강 베팅 한 판 -1/37
    assert abs((N / 2) / (N + 5) - 0.5) < 0.002
    many = rng.integers(0, 2, size=(20_000, 200)) * 2 - 1
    assert abs((-5 + many.sum(axis=1)).mean() + 5) < 0.3     # 200번 더 던져도 차이의 평균은 -5 근처
    big = rng.integers(0, 37, size=2_000_000)
    per = np.where((big >= 1) & (big <= 18), 1, -1).mean()
    assert abs(per + 1 / 37) < 0.003, per
    assert round(100 * 10_000 * (-1 / 37)) == -27027
    print("ALL CHECKS PASSED")
```
{% endraw %}
