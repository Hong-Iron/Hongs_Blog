---
layout: "note"
title: "25_pagerank_plot.py"
display_title: "25_pagerank_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "25"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/pagerank/"
parent_title: "PageRank"
description: "확률과 통계 · PageRank 그림 생성 코드"
permalink: "/studies/probability-statistics/code/25_pagerank_plot/"
---
{% raw %}
[PageRank](/Hongs_Blog/studies/probability-statistics/pagerank/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# PageRank 문서의 그림을 만든다: 25_pagerank_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 25_pagerank_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "25_pagerank"
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


def log_ticks(ax, axis="y"):
    """로그 눈금 글자를 수식 글꼴로 쓴다(한글 글꼴에 없는 마이너스 기호를 피한다)."""
    from matplotlib.ticker import FuncFormatter
    f = FuncFormatter(lambda v, _: f"$10^{{{int(round(math.log10(v)))}}}$" if v > 0 else "")
    (ax.yaxis if axis == "y" else ax.xaxis).set_major_formatter(f)


def pagerank_history(out, n, d=0.85, iters=200):
    """의사코드 PAGERANK를 그대로 돌리고 반복마다의 점수 벡터를 모두 돌려준다."""
    r = np.full(n, 1 / n)
    hist = [r.copy()]
    for _ in range(iters):
        dangling = sum(r[i] for i in range(n) if not out[i])
        new = np.full(n, (1 - d) / n + d * dangling / n)
        for i in range(n):
            for j in out[i]:
                new[j] += d * r[i] / len(out[i])
        r = new
        hist.append(r.copy())
    return np.array(hist)


# 예시: A→B, A→C, B→C, C→A, D→C (A = 0, B = 1, C = 2, D = 3)
small = {0: [1, 2], 1: [2], 2: [0], 3: [2]}
h_small = pagerank_history(small, 4)

# 무작위 링크 그래프: 페이지 300개, 페이지마다 링크 0~10개(평균 약 5개)
rng = np.random.default_rng(25)
n = 300
big = {i: sorted(set(rng.choice(n, size=rng.integers(0, 11), replace=True).tolist()) - {i}) for i in range(n)}
h_big = pagerank_history(big, n)

# 그림 1: 수렴값과의 L1 오차. 실제 오차는 최악 상한 0.85^k보다 빨리 준다
fig, ax = plt.subplots(figsize=(6, 3.6))
K = 61                                                  # 그림에는 앞의 60번만, 수렴값은 200번 반복한 값
k = np.arange(K)
for i, (h, name) in enumerate([(h_small, "예시 페이지 4개"), (h_big, "무작위 그래프 300개")]):
    err = np.abs(h[:K] - h[-1]).sum(axis=1)
    m = err > 1e-15
    ax.plot(k[m], err[m], "o-", color=C[i], ms=3, lw=1.2, label=name)
ax.plot(k, 2 * 0.85 ** k, color=INK, lw=1.2, ls="--", label="상한 $2 \\cdot 0.85^k$")
ax.set_yscale("log")
log_ticks(ax)
ax.set_ylim(1e-14, 5)
ax.set_xlim(0, 60)
ax.set_xlabel("반복 횟수 $k$")
ax.set_ylabel("수렴값과의 L1 거리")
ax.legend(loc="lower left")
save(fig, 1)

if __name__ == "__main__":
    assert np.allclose(h_small[1], [0.25, 0.14375, 0.56875, 0.0375])
    assert np.allclose(np.round(h_small[-1], 4), [0.3725, 0.1958, 0.3941, 0.0375])
    for h in (h_small, h_big):
        assert np.allclose(h.sum(axis=1), 1) and (h >= 0).all()
        err = np.abs(h - h[-1]).sum(axis=1)
        assert all(err[i] <= 2 * 0.85 ** i + 1e-12 for i in range(len(err)))
    print("ALL CHECKS PASSED")
```
{% endraw %}
