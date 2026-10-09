---
layout: "note"
title: "35_overfitting-cv_plot.py"
display_title: "35_overfitting-cv_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "35"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/overfitting-cv/"
parent_title: "과적합과 교차검증"
description: "확률과 통계 · 과적합과 교차검증 그림 생성 코드"
permalink: "/studies/probability-statistics/code/35_overfitting-cv_plot/"
---
{% raw %}
[과적합과 교차검증](/Hongs_Blog/studies/probability-statistics/overfitting-cv/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 과적합과 교차검증 문서의 그림을 만든다: 35_overfitting-cv_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 35_overfitting-cv_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "35_overfitting-cv"
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


from fractions import Fraction as Fr
import random


def fit(data, d):
    """d차 다항식 최소제곱 (분수 산술로 정확히, 35_overfitting-cv_verify.py와 같은 방법)."""
    X = [[Fr(x) ** k for k in range(d + 1)] for x, _ in data]
    Y = [Fr(y) for _, y in data]
    n = d + 1
    M = [[sum(r[i] * r[j] for r in X) for j in range(n)] + [sum(r[i] * y for r, y in zip(X, Y))] for i in range(n)]
    for k in range(n):
        p = next(i for i in range(k, n) if M[i][k] != 0)
        M[k], M[p] = M[p], M[k]
        for i in range(k + 1, n):
            f = M[i][k] / M[k][k]
            M[i] = [a - f * c for a, c in zip(M[i], M[k])]
    c = [Fr(0)] * n
    for i in range(n - 1, -1, -1):
        c[i] = (M[i][n] - sum(M[i][j] * c[j] for j in range(i + 1, n))) / M[i][i]
    return [float(t) for t in c]


def predict(c, x):
    return sum(ci * x ** k for k, ci in enumerate(c))


def mse(c, data):
    return sum((y - predict(c, x)) ** 2 for x, y in data) / len(data)


rng = random.Random(37)                                 # 검증 코드와 같은 자료
train = [((i + 0.5) / 10, math.sin(2 * math.pi * (i + 0.5) / 10) + rng.gauss(0, 0.3)) for i in range(10)]
test = [(x, math.sin(2 * math.pi * x) + rng.gauss(0, 0.3)) for x in [rng.uniform(0.05, 0.95) for _ in range(2000)]]
coefs = [fit(train, d) for d in range(10)]
tr = [mse(c, train) for c in coefs]
te = [mse(c, test) for c in coefs]

# 그림 1: 왼쪽 1·3·9차 곡선, 오른쪽 차수에 따른 훈련·시험 오차
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
t = np.linspace(0.02, 0.98, 400)
a1.plot(t, np.sin(2 * np.pi * t), color=INK, lw=1, ls="--")
for i, d in enumerate([1, 3, 9]):
    a1.plot(t, [predict(coefs[d], v) for v in t], color=C[i], lw=1.6, label=f"{d}차")
a1.plot([x for x, _ in train], [y for _, y in train], "o", color=INK, ms=4)
a1.set_ylim(-2, 2)
a1.set_xlabel("$x$")
a1.legend(loc="lower left", fontsize=9, ncol=3)
ds = np.arange(10)
a2.plot(ds, tr, "o-", color=C[0], ms=4, label="훈련 오차")
a2.plot(ds, te, "o-", color=C[1], ms=4, label="시험 오차")
a2.axhline(0.09, color=INK, lw=0.8, ls=":")
a2.text(5, 0.055, "잡음 분산 0.09", fontsize=9, va="center")
a2.set_xticks(ds)
a2.set_xlabel("다항식 차수")
a2.set_ylim(0, 0.75)
a2.legend(loc="upper center", fontsize=9)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    table_tr = {0: 0.488, 1: 0.195, 3: 0.029, 5: 0.022, 7: 0.011, 9: 0.0}
    table_te = {0: 0.704, 1: 0.289, 3: 0.129, 5: 0.134, 7: 0.148, 9: 0.544}
    assert all(round(tr[d], 3) == v for d, v in table_tr.items()) and all(round(te[d], 3) == v for d, v in table_te.items())
    assert te.index(min(te)) == 3 and min(te) > 0.09
    print("ALL CHECKS PASSED")
```
{% endraw %}
