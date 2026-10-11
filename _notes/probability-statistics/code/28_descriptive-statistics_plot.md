---
layout: "note"
title: "28_descriptive-statistics_plot.py"
display_title: "28_descriptive-statistics_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "28"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/descriptive-statistics/"
parent_title: "기술통계"
description: "확률과 통계 · 기술통계 그림 생성 코드"
permalink: "/studies/probability-statistics/code/28_descriptive-statistics_plot/"
---
{% raw %}
[기술통계](/Hongs_Blog/studies/probability-statistics/descriptive-statistics/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 기술통계 문서의 그림을 만든다: 28_descriptive-statistics_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 28_descriptive-statistics_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "28_descriptive-statistics"
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


rng = np.random.default_rng(28)
# 지연 시간 로그를 흉내 낸 자료: 대부분 10~30 ms, 오른쪽으로 긴 꼬리 (로그정규분포)
lat = np.exp(rng.normal(math.log(18), 0.45, 100000))
mean, med, p99 = lat.mean(), np.median(lat), np.quantile(lat, 0.99)

# 그림 1: 긴 꼬리 때문에 평균이 중앙값보다 오른쪽에 있고, p99는 훨씬 멀리 있다
fig, ax = plt.subplots(figsize=(6, 3.6))
counts, _, _ = ax.hist(lat, bins=np.arange(0, 80, 1), color=C[0], alpha=0.75)
ax.set_ylim(0, counts.max() * 1.3)
for v, name, col, dx, ha in [(med, "중앙값 p50", C[2], -0.8, "right"), (mean, "평균", C[1], 0.8, "left"), (p99, "p99", C[3], 0.8, "left")]:
    ax.axvline(v, color=col, lw=1.6)
    ax.text(v + dx, ax.get_ylim()[1] * 0.99, f"{name}\n{v:.1f} ms", color=col, fontsize=10, va="top", ha=ha)
ax.set_xlabel("응답 시간(ms)")
ax.set_ylabel("요청 수")
save(fig, 1)

if __name__ == "__main__":
    x = [12, 13, 13, 14, 15, 15, 16, 18, 20, 250]
    m = sum(x) / 10
    sd = math.sqrt(sum((v - m) ** 2 for v in x) / 9)
    assert round(m, 1) == 38.6 and round(sd, 1) == 74.3 and sorted(x)[4:6] == [15, 15]
    assert med < mean < p99 and 10 < np.quantile(lat, 0.25) and np.quantile(lat, 0.75) < 30
    print("ALL CHECKS PASSED")
```
{% endraw %}
