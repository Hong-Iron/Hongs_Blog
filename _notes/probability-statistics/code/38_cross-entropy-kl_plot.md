---
layout: "note"
title: "38_cross-entropy-kl_plot.py"
display_title: "38_cross-entropy-kl_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "38"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/cross-entropy-kl/"
parent_title: "교차 엔트로피와 KL 발산"
description: "확률과 통계 · 교차 엔트로피와 KL 발산 코드 코드"
permalink: "/studies/probability-statistics/code/38_cross-entropy-kl_plot/"
---
{% raw %}
[교차 엔트로피와 KL 발산](/Hongs_Blog/studies/probability-statistics/cross-entropy-kl/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 교차 엔트로피와 KL 발산 문서의 그림을 만든다: 38_cross-entropy-kl_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 38_cross-entropy-kl_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "38_cross-entropy-kl"
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


P = np.array([0.9, 0.1])                                # 실제 분포 p


def kl(a, b):
    a, b = np.asarray(a, float), np.asarray(b, float)
    m = a > 0
    return float(np.sum(a[m] * np.log2(a[m] / b[m])))


# 그림 1: q = (t, 1 − t)를 움직이며 D(p‖q)와 D(q‖p)를 비교. 순서를 바꾸면 값이 다르다
t = np.linspace(0.005, 0.995, 600)
d_pq = [kl(P, [s, 1 - s]) for s in t]
d_qp = [kl([s, 1 - s], P) for s in t]
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(t, d_pq, color=C[0], lw=2, label="$D(p\\,\\|\\,q)$")
ax.plot(t, d_qp, color=C[1], lw=2, label="$D(q\\,\\|\\,p)$")
ax.axvline(0.5, color=INK, lw=0.6, ls=":")
a, b = kl(P, [0.5, 0.5]), kl([0.5, 0.5], P)
ax.plot([0.5, 0.5], [a, b], "o", color=INK, ms=4)
ax.text(0.48, a - 0.1, f"{a:.3f}", fontsize=10, ha="right", va="top")
ax.text(0.52, b + 0.05, f"{b:.3f}", fontsize=10)
ax.plot(0.9, 0, "o", color=INK, ms=4)
ax.text(0.9, 0.12, "$q = p$", fontsize=10, ha="center")
ax.set_xlabel("$q$가 첫 값에 주는 확률 $t$  ($p = (0.9, 0.1)$)")
ax.set_ylabel("비트")
ax.set_ylim(0, 3.5)
ax.legend(loc="upper center")
save(fig, 1)

if __name__ == "__main__":
    assert round(a, 3) == 0.531 and round(b, 3) == 0.737
    assert min(d_pq) >= 0 and min(d_qp) >= 0 and abs(kl(P, P)) < 1e-15
    pl = np.array([1 / 2, 1 / 4, 1 / 8, 1 / 8])
    assert abs(kl(pl, np.full(4, 0.25)) - 0.25) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
