---
layout: "note"
title: "26_randomized-analysis_plot.py"
display_title: "26_randomized-analysis_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "26"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/randomized-analysis/"
parent_title: "해싱과 무작위 알고리즘의 확률"
description: "확률과 통계 · 해싱과 무작위 알고리즘의 확률 그림 생성 코드"
permalink: "/studies/probability-statistics/code/26_randomized-analysis_plot/"
---
{% raw %}
[해싱과 무작위 알고리즘의 확률](/Hongs_Blog/studies/probability-statistics/randomized-analysis/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 해싱과 무작위 알고리즘의 확률 문서의 그림을 만든다: 26_randomized-analysis_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 26_randomized-analysis_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "26_randomized-analysis"
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


def Phi(z):
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


KEYS, SLOTS = 2000, 500                                 # 키 2,000개, 칸 500개 (적재율 α = 4)
rng = np.random.default_rng(26)
TRIALS = 200
lengths = np.concatenate([np.bincount(rng.integers(0, SLOTS, KEYS), minlength=SLOTS) for _ in range(TRIALS)])
freq = np.bincount(lengths, minlength=16)[:16] / lengths.size


def pois_pmf(lam, k):
    return math.exp(-lam) * lam ** k / math.factorial(k)


# 그림 1: 체인 길이(한 칸의 키 수)의 분포. 평균은 4이지만 빈 칸도, 10개가 넘는 칸도 있다
ks = np.arange(16)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.bar(ks, freq, color=C[0], width=0.7, label="모의실험 (200회)")
ax.plot(ks, [pois_pmf(KEYS / SLOTS, k) for k in ks], "o", color=C[1], ms=5, label="포아송(4)")
ax.axvline(KEYS / SLOTS, color=INK, lw=0.8, ls="--")
ax.text(4.2, 0.205, "평균 α = 4", fontsize=10)
ax.set_xticks(ks)
ax.set_xlabel("한 칸에 들어간 키 수(체인 길이)")
ax.set_ylabel("칸의 비율")
ax.set_ylim(0, 0.22)
ax.legend(loc="upper right")
save(fig, 1)

if __name__ == "__main__":
    assert abs(lengths.mean() - 4) < 1e-12                           # 칸마다 평균 α = 2000/500
    pairs = [sum(c * (c - 1) // 2 for c in lengths[i * SLOTS:(i + 1) * SLOTS]) for i in range(TRIALS)]
    assert abs(np.mean(pairs) / (math.comb(KEYS, 2) / SLOTS) - 1) < 0.02   # 충돌 쌍 기댓값 약 3,998
    assert max(abs(freq[k] - pois_pmf(4, k)) for k in ks) < 0.01
    assert abs(freq[0] - math.exp(-4)) < 0.003 and freq[11:].sum() > 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
