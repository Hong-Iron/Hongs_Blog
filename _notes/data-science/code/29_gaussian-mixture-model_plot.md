---
layout: "note"
title: "29_gaussian-mixture-model_plot.py"
display_title: "29_gaussian-mixture-model_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "29"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/gaussian-mixture-model/"
parent_title: "가우스 혼합 모델"
description: "데이터 과학 · 가우스 혼합 모델 코드 코드"
permalink: "/studies/data-science/code/29_gaussian-mixture-model_plot/"
---
{% raw %}
[가우스 혼합 모델](/Hongs_Blog/studies/data-science/gaussian-mixture-model/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 가우스 혼합 모델 문서의 그림을 만든다: 29_gaussian-mixture-model_fig1.svg, 29_gaussian-mixture-model_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 29_gaussian-mixture-model_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "29_gaussian-mixture-model"
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



def npdf(x, m, s):
    return np.exp(-(x - m) ** 2 / (2 * s * s)) / (s * math.sqrt(2 * math.pi))


def resp1(x):                                           # 평균 0·5, 표준편차 1·1, 비율 반반일 때 무리 1의 책임도
    a, b = 0.5 * npdf(x, 0, 1), 0.5 * npdf(x, 5, 1)
    return a / (a + b)


def stripes():                                          # 25.k-평균 그림 2와 같은 자료
    rng = np.random.default_rng(5)
    a = np.column_stack([rng.normal(0, 3, 150), rng.normal(0, 0.35, 150)])
    b = np.column_stack([rng.normal(0, 3, 150), rng.normal(2.2, 0.35, 150)])
    th = math.radians(25); R = np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]])
    return np.vstack([a, b]) @ R.T, np.repeat([0, 1], 150)


def mvn(P, m, S):
    d = P - m; Si = np.linalg.inv(S)
    return np.exp(-0.5 * np.einsum("ij,jk,ik->i", d, Si, d)) / (2 * math.pi * math.sqrt(np.linalg.det(S)))


def em2d(P, mu, iters=300):
    k = len(mu); S = [np.cov(P.T) for _ in range(k)]; pi = np.full(k, 1 / k); ll = []
    for _ in range(iters):
        dens = np.column_stack([pi[a] * mvn(P, mu[a], S[a]) for a in range(k)])
        ll.append(np.log(dens.sum(axis=1)).sum())
        R = dens / dens.sum(axis=1, keepdims=True)
        n = R.sum(axis=0); pi = n / len(P)
        mu = [(R[:, a:a + 1] * P).sum(axis=0) / n[a] for a in range(k)]
        S = [((R[:, a:a + 1] * (P - mu[a])).T @ (P - mu[a])) / n[a] + 1e-6 * np.eye(2) for a in range(k)]
    return mu, S, pi, R, ll


def ellipse(m, S, r):
    w, V = np.linalg.eigh(S); t = np.linspace(0, 2 * np.pi, 200)
    return (V @ (np.sqrt(w)[:, None] * r * np.vstack([np.cos(t), np.sin(t)]))).T + m


# 그림 1: 1차원 두 무리의 가중 밀도(위)와 무리 1의 책임도(아래)
x = np.linspace(-3, 8, 500)
fig, axes = plt.subplots(2, 1, figsize=(6, 3.6), sharex=True, gridspec_kw={"height_ratios": [1, 1]})
ax = axes[0]
ax.plot(x, 0.5 * npdf(x, 0, 1), color=C[0], lw=2, label="무리 1")
ax.plot(x, 0.5 * npdf(x, 5, 1), color=C[1], lw=2, label="무리 2")
ax.set_yticks([])
ax.set_ylabel("밀도")
ax.legend(loc="upper right", fontsize=10)
ax = axes[1]
ax.plot(x, resp1(x), color=C[0], lw=2)
for v in (0.5, 2.5):
    ax.plot([v], [resp1(v)], "o", color=INK)
ax.text(2.7, 0.52, "2.5에서 0.5", fontsize=10)
ax.text(-0.2, 0.68, "0.5에서 거의 1", fontsize=10)
ax.set_ylim(-0.05, 1.1)
ax.set_ylabel("무리 1일 확률")
ax.set_xlabel("$x$")
fig.tight_layout()
save(fig, 1)

# 그림 2: 길쭉한 두 무리에 GMM을 맞춘 결과 (여러 번 다시 시작해 로그가능도가 가장 큰 답)
P, T = stripes()
rng = np.random.default_rng(0)
fits = [em2d(P, list(P[rng.choice(len(P), 2, replace=False)])) for _ in range(8)]
mu, S, pi, R, ll = max(fits, key=lambda f: f[4][-1])
lab = R.argmax(axis=1)
fig, ax = plt.subplots(figsize=(6, 3.2))
for j in range(2):
    ax.plot(*P[lab == j].T, "o", ms=3, color=C[j], alpha=0.7)
    for r in (1, 2):
        ax.plot(*ellipse(mu[j], S[j], r).T, color=INK, lw=1.2 if r == 1 else 0.8, ls="-" if r == 1 else "--")
ax.set_aspect("equal")
ax.set_xticks([]); ax.set_yticks([])
save(fig, 2)

if __name__ == "__main__":
    assert abs(resp1(2.5) - 0.5) < 1e-12 and resp1(0.5) > 0.9999
    acc = (lab == T).mean(); acc = max(acc, 1 - acc)
    assert acc > 0.95 and all(b >= a - 1e-6 for a, b in zip(ll, ll[1:]))
    print(f"     GMM 맞힌 비율 {acc:.3f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
