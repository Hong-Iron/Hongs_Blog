---
layout: "note"
title: "32_ctfs-properties_plot.py"
display_title: "32_ctfs-properties_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "32"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/ctfs-properties/"
parent_title: "연속 시간 푸리에 급수의 성질"
description: "신호 및 시스템 · 연속 시간 푸리에 급수의 성질 코드 코드"
permalink: "/studies/signals-and-systems/code/32_ctfs-properties_plot/"
---
{% raw %}
[연속 시간 푸리에 급수의 성질](/Hongs_Blog/studies/signals-and-systems/ctfs-properties/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 연속 시간 푸리에 급수의 성질 문서의 그림을 만든다: 32_ctfs-properties_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 32_ctfs-properties_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "32_ctfs-properties"
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


def stem(ax, n, x, color, label=None, ms=5):
    # 이산 시간 신호는 막대 끝에 점을 찍은 줄기 그림으로 그린다
    ml, sl, bl = ax.stem(n, x, linefmt="-", markerfmt="o", basefmt=" ", label=label)
    plt.setp(sl, color=color, lw=1.4)
    plt.setp(ml, color=color, markersize=ms)
    ax.axhline(0, color=INK, lw=0.6)


# 사각파 (예제 3.6의 x, 주기 4, |t| < 1에서 1)와 삼각파 (예제 3.7, 주기 4, x(0) = 0, x(±2) = 1)
def sq_coef(k):
    return np.sin(np.pi * k / 2) / (k * np.pi)


def tri_coef(k):  # e_k = 2 sin(πk/2) / (j(kπ)²) e^{-jkπ/2}
    return 2 * np.sin(np.pi * k / 2) / (1j * (k * np.pi) ** 2) * np.exp(-1j * k * np.pi / 2)


t = np.linspace(-4, 4, 2001)
sq = (np.abs(((t + 2) % 4) - 2) < 1).astype(float)
tri = np.abs(((t + 2) % 4) - 2) / 2

# 그림 1: 사각파는 끊겨 있어 |a_k|가 1/k로, 꺾이기만 하는 삼각파는 1/k²로 줄어든다
fig, axs = plt.subplots(1, 2, figsize=(7, 2.9), gridspec_kw={"width_ratios": [1, 1.15]})
axs[0].plot(t, sq + 1.4, color=C[0], lw=1.6)
axs[0].plot(t, tri, color=C[1], lw=1.6)
axs[0].text(4.2, 1.9, "사각파", fontsize=10, va="center", color=C[0])
axs[0].text(4.2, 0.5, "삼각파", fontsize=10, va="center", color=C[1])
axs[0].set_yticks([])
axs[0].spines["left"].set_visible(False)
axs[0].set_xlabel("$t$")
k = np.arange(1, 40, 2)
axs[1].loglog(k, np.abs(sq_coef(k)), "o", color=C[0], ms=4, label="사각파 $|a_k|$")
axs[1].loglog(k, np.abs(tri_coef(k)), "s", color=C[1], ms=4, label="삼각파 $|e_k|$")
axs[1].loglog(k, 1 / (k * np.pi), color=C[0], lw=0.8, ls="--")
axs[1].loglog(k, 2 / (k * np.pi) ** 2, color=C[1], lw=0.8, ls="--")
axs[1].set_xticks([1, 3, 10, 30])
axs[1].set_xticklabels(["1", "3", "10", "30"])
axs[1].set_yticks([1e-3, 1e-2, 1e-1])
axs[1].set_yticklabels(["0.001", "0.01", "0.1"])
axs[1].minorticks_off()
axs[1].set_xlabel("$k$ (홀수)")
axs[1].legend(loc="lower left", fontsize=9)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 미분 성질: 삼각파 도함수 계수 = jkω0 e_k = 예제 3.6의 d_k = a_k e^{-jkπ/2}. 분석식 수치 적분으로도 확인
    w0 = np.pi / 2
    for kk in (1, 3, 5):
        assert abs(1j * kk * w0 * tri_coef(kk) - sq_coef(kk) * np.exp(-1j * kk * np.pi / 2)) < 1e-12
    tt = np.linspace(0, 4, 400001)[:-1]
    trit = np.abs(((tt + 2) % 4) - 2) / 2
    for kk in (1, 3):
        num = np.mean(trit * np.exp(-1j * kk * w0 * tt))
        assert abs(num - tri_coef(kk)) < 1e-5
    assert abs(np.mean(trit) - 0.5) < 1e-6
    print("ALL CHECKS PASSED")
```
{% endraw %}
