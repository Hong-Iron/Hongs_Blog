---
layout: "note"
title: "27_singularity-functions_plot.py"
display_title: "27_singularity-functions_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "27"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/singularity-functions/"
parent_title: "특이함수"
description: "신호 및 시스템 · 특이함수 그림 생성 코드"
permalink: "/studies/signals-and-systems/code/27_singularity-functions_plot/"
---
{% raw %}
[특이함수](/Hongs_Blog/studies/signals-and-systems/singularity-functions/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 특이함수 문서의 그림을 만든다: 27_singularity-functions_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 27_singularity-functions_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "27_singularity-functions"
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


dt = 1e-4
t = np.arange(0, 2.5, dt)
h = np.exp(-2 * t)                     # dy/dt + 2y = x의 임펄스 응답 (t ≥ 0)


def rect_pulse(D):
    return np.where(t < D, 1 / D, 0.0)


def tri_pulse(D):
    return np.where(t <= D, t / D ** 2, np.where(t <= 2 * D, (2 * D - t) / D ** 2, 0.0))


def respond(p):  # 수치 컨벌루션 p * h
    return np.convolve(p, h)[:len(t)] * dt


# 그림 1: 넓이 1인 사각 펄스와 삼각 펄스를 넣은 응답. Δ가 줄면 둘 다 h(t) = e^{-2t}로 모인다
fig, axs = plt.subplots(1, 2, figsize=(6.8, 2.9), sharey=True)
for ax, D in zip(axs, [0.25, 0.1]):
    ax.plot(t, h, color=INK, lw=2.2, label="$h(t) = e^{-2t}$")
    ax.plot(t, respond(rect_pulse(D)), color=C[0], lw=1.5, label="사각 펄스 응답")
    ax.plot(t, respond(tri_pulse(D)), color=C[1], lw=1.5, ls="--", label="삼각 펄스 응답")
    ax.set_title(f"$\\Delta = {D}$", fontsize=10)
    ax.set_xlabel("$t$")
    ax.axhline(0, color=INK, lw=0.6)
axs[0].legend(loc="upper right", fontsize=9)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 펄스 넓이 1, 사각 펄스 응답의 닫힌 꼴, Δ가 줄수록 h와의 최대 차이(t ≥ 2Δ)가 준다
    errs = []
    for D in (0.25, 0.1, 0.0025):
        assert abs(np.sum(rect_pulse(D)) * dt - 1) < 1e-3 and abs(np.sum(tri_pulse(D)) * dt - 1) < 1e-3
        yr = respond(rect_pulse(D))
        k = int(1.0 / dt)
        assert abs(yr[k] - (math.exp(-2 * (1.0 - D)) - math.exp(-2.0)) / (2 * D)) < 1e-3
        m = t >= 2 * D
        errs.append(max(np.max(np.abs(yr[m] - h[m])), np.max(np.abs(respond(tri_pulse(D))[m] - h[m]))))
    assert errs[0] > errs[1] > errs[2] and errs[2] < 0.01
    print("ALL CHECKS PASSED")
```
{% endraw %}
