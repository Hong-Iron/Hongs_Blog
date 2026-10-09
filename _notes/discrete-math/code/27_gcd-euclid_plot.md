---
layout: "note"
title: "27_gcd-euclid_plot.py"
display_title: "27_gcd-euclid_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "27"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/gcd-euclid/"
parent_title: "최대공약수와 유클리드 호제법"
description: "이산수학 · 최대공약수와 유클리드 호제법 그림 생성 코드"
permalink: "/studies/discrete-math/code/27_gcd-euclid_plot/"
---
{% raw %}
[최대공약수와 유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 최대공약수와 유클리드 호제법 문서의 그림을 만든다: 27_gcd-euclid_fig1.svg, 27_gcd-euclid_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 27_gcd-euclid_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "27_gcd-euclid"
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


def steps(a, b):
    # 유클리드 호제법의 나눗셈 횟수 (b가 0이 될 때까지)
    c = 0
    while b:
        a, b = b, a % b
        c += 1
    return c


def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


BMAX = 150
# 작은 수 b를 정했을 때 가장 오래 걸리는 경우: 첫 나눗셈 뒤에는 (b, r), 0 ≤ r < b
WORST = [1 + max(steps(b, r) for r in range(b)) for b in range(1, BMAX + 1)]

# 그림 1: 작은 수 b마다 가장 많은 나눗셈 횟수와 증명한 한계 2 lg b + 2. 피보나치 쌍이 최악이다
bs = np.arange(1, BMAX + 1)
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.step(bs, WORST, where="post", color=C[0], lw=1.4, label="가장 많은 나눗셈 횟수")
ax.plot(bs, 2 * np.log2(bs) + 2, color=C[1], lw=1.4, ls="--", label=r"한계 $2\lg b + 2$")
fk = [(fib(k + 1), fib(k)) for k in range(2, 14) if fib(k) <= BMAX]
ax.plot([b for _, b in fk], [steps(a, b) for a, b in fk], "o", color=C[2], ms=5, label="이웃한 피보나치 수")
ax.annotate("(89, 55): 9번", (55, 9), xytext=(66, 4.2), fontsize=10, ha="center",
            arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
ax.set_xlabel("작은 수 $b$")
ax.set_ylabel("나눗셈 횟수")
ax.legend(loc="lower right", fontsize=10)
save(fig, 1)


def tile_squares(w, h):
    # 가로 w, 세로 h 직사각형에서 짧은 변 크기의 정사각형을 되풀이해 떼어 낸다: (x, y, 변) 목록
    out, x0, y0 = [], 0, 0
    while w and h:
        if w >= h:
            for _ in range(w // h):
                out.append((x0, y0, h))
                x0 += h
            w = w % h
        else:
            for _ in range(h // w):
                out.append((x0, y0, w))
                y0 += w
            h = h % w
    return out


# 그림 2: 252 x 105 바닥을 정사각형으로 떼어 내는 호제법의 세 단계. 마지막 정사각형의 변 21이 최대공약수다
W, H = 252, 105
SQ = tile_squares(W, H)
fig, ax = plt.subplots(figsize=(6.4, 2.9))
for gx in range(0, W + 1, 21):
    ax.plot([gx, gx], [0, H], color=INK, lw=0.4, ls=":")
for gy in range(0, H + 1, 21):
    ax.plot([0, W], [gy, gy], color=INK, lw=0.4, ls=":")
colour = {105: C[0], 42: C[1], 21: C[2]}
for x, y, a in SQ:
    ax.add_patch(plt.Rectangle((x, y), a, a, facecolor=matplotlib.colors.to_rgba(colour[a], 0.18), edgecolor=colour[a], lw=1.8))
    ax.text(x + a / 2, y + a / 2, str(a), ha="center", va="center", fontsize=12 if a > 21 else 10, color=colour[a])
ax.set_xlim(-2, W + 2)
ax.set_ylim(-14, H + 2)
ax.set_aspect("equal")
ax.axis("off")
ax.text(0, -10, "가로 252", ha="left", fontsize=10)
ax.text(W, -10, "점선 칸: 21 x 21 타일 60장", ha="right", fontsize=10)
save(fig, 2)

if __name__ == "__main__":
    # gcd(89, 55)는 9번, gcd(252, 105)는 3번, 모든 a > b, b ≤ 150에서 한계 이하, 피보나치 쌍은 각 b까지의 최악과 같다
    assert steps(89, 55) == 9 and steps(252, 105) == 3
    for b in range(1, BMAX + 1):
        assert WORST[b - 1] <= 2 * math.log2(b) + 2
        assert all(steps(a, b) <= WORST[b - 1] for a in range(b, 3 * b + 1))
    for a, b in fk:
        assert steps(a, b) == max(WORST[:b])
    # 그림 2: 정사각형은 105 두 개, 42 두 개, 21 두 개이고 넓이 합이 252 x 105, 가장 작은 변이 gcd
    assert [a for _, _, a in SQ] == [105, 105, 42, 42, 21, 21]
    assert sum(a * a for _, _, a in SQ) == W * H
    assert min(a for _, _, a in SQ) == math.gcd(W, H) == 21 and (W // 21) * (H // 21) == 60
    print("ALL CHECKS PASSED")
```
{% endraw %}
