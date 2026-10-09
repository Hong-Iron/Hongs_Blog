---
layout: "note"
title: "30_em-algorithm_plot.py"
display_title: "30_em-algorithm_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "30"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/em-algorithm/"
parent_title: "EM 알고리즘"
description: "데이터 과학 · EM 알고리즘 그림 생성 코드"
permalink: "/studies/data-science/code/30_em-algorithm_plot/"
---
{% raw %}
[EM 알고리즘](/Hongs_Blog/studies/data-science/em-algorithm/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# EM 알고리즘 문서의 그림을 만든다: 30_em-algorithm_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 30_em-algorithm_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "30_em-algorithm"
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

Z = [0, 1, 2, 6, 7, 8]


def npdf(x, m, v):
    return math.exp(-(x - m) ** 2 / (2 * v)) / math.sqrt(2 * math.pi * v)


def e_step(X, mu, var, pi):
    R = []
    for x in X:
        p = [pi[a] * npdf(x, mu[a], var[a]) for a in range(len(mu))]
        s = sum(p); R.append([q / s for q in p])
    return R


def m_step(X, R):                                       # 30_em-gmm_impl.py와 같은 식 (분산 아래한계 1e-6)
    k = len(R[0]); n = len(X); mu, var, pi = [], [], []
    for a in range(k):
        na = sum(r[a] for r in R)
        m = sum(r[a] * x for r, x in zip(R, X)) / na
        v = sum(r[a] * (x - m) ** 2 for r, x in zip(R, X)) / na
        mu.append(m); var.append(max(v, 1e-6)); pi.append(na / n)
    return mu, var, pi


def loglik(X, mu, var, pi):
    return sum(math.log(sum(pi[a] * npdf(x, mu[a], var[a]) for a in range(len(mu)))) for x in X)


hist = [([1.0, 2.0], [1.0, 1.0], [0.5, 0.5])]
for _ in range(15):
    mu, var, pi = hist[-1]
    hist.append(m_step(Z, e_step(Z, mu, var, pi)))
LL = [loglik(Z, *h) for h in hist]
it = np.arange(len(hist))

# 그림 1: 반복마다 두 무리의 평균(왼쪽)과 로그가능도(오른쪽)
fig, axes = plt.subplots(1, 2, figsize=(6.5, 2.9))
ax = axes[0]
for a in range(2):
    ax.plot(it, [h[0][a] for h in hist], "o-", ms=3.5, color=C[a], lw=1.6, label=f"무리 {a + 1} 평균")
for v in (1, 7):
    ax.axhline(v, color=INK, lw=0.7, ls=":")
ax.set_xlabel("반복 횟수")
ax.set_ylim(0, 8)
ax.set_title("두 무리의 평균", fontsize=10)
ax.legend(loc="center right", fontsize=9)
ax = axes[1]
ax.plot(it, LL, "o-", ms=3.5, color=C[2], lw=1.6)
ax.set_xlabel("반복 횟수")
ax.set_title("로그가능도", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    R = e_step(Z, [1.0, 2.0], [1.0, 1.0], [0.5, 0.5])
    assert [round(r[0], 3) for r in R] == [0.818, 0.622, 0.378, 0.011, 0.004, 0.002]
    mu, var, pi = hist[1]
    assert [round(v, 3) for v in mu + var + pi] == [0.809, 5.405, 0.885, 7.076, 0.306, 0.694]
    assert all(b >= a - 1e-9 for a, b in zip(LL, LL[1:]))
    mu, var, pi = hist[-1]
    assert abs(mu[0] - 1) < 1e-3 and abs(mu[1] - 7) < 1e-3 and abs(pi[0] - 0.5) < 1e-3
    print("ALL CHECKS PASSED")
```
{% endraw %}
