---
layout: "note"
title: "25_latency_plot.py"
display_title: "25_latency_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "25"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/latency/"
parent_title: "소요시간"
description: "컴퓨터 통신 · 소요시간 그림 생성 코드"
permalink: "/studies/computer-communication/code/25_latency_plot/"
---
{% raw %}
[소요시간](/Hongs_Blog/studies/computer-communication/latency/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 소요시간 문서의 그림을 만든다: 25_latency_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 25_latency_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "25_latency"
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


def wq_formula(rho):
    """M/M/1 대기 행렬의 평균 큐잉 지연 (평균 전송 시간 L/R 단위): ρ/(1-ρ)"""
    return rho / (1 - rho)


def wq_simulate(rho, n=200_000, seed=1):
    """패킷이 무작위로(포아송) 오고 크기도 무작위(지수)일 때, 줄 서서 기다린 시간의 평균.
    린들리 점화식: 다음 패킷의 대기 = max(0, 이번 대기 + 이번 전송 시간 - 도착 간격)"""
    rng = np.random.default_rng(seed)
    service = rng.exponential(1.0, n)
    gaps = rng.exponential(1.0 / rho, n)
    w, total = 0.0, 0.0
    for i in range(n - 1):
        total += w
        w = max(0.0, w + service[i] - gaps[i + 1])
    return total / (n - 1)


# 그림 1: 링크가 바쁜 정도(트래픽 강도)에 따른 평균 큐잉 지연
rho = np.linspace(0, 0.95, 300)
sim_rho = [0.2, 0.4, 0.6, 0.8, 0.9]
sim = [wq_simulate(r) for r in sim_rho]
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(rho, wq_formula(rho), color=C[0], lw=1.8)
ax.plot(sim_rho, sim, "o", color=C[1], ms=5)
ax.text(0.08, 14.0, "점: 패킷 20만 개 시뮬레이션", color=C[1], fontsize=10)
ax.text(0.08, 12.5, "선: 대기 행렬 모형의 식 $\\rho/(1-\\rho)$", color=C[0], fontsize=10)
ax.set_xlim(0, 1)
ax.set_ylim(0, 20)
ax.set_yticks([0, 5, 10, 15, 20])
ax.axvline(1, color=INK, lw=0.8, ls="--")
ax.set_xlabel("트래픽 강도 $\\rho$ (들어오는 비트 ÷ 링크 전송률)")
ax.set_ylabel("평균 큐잉 지연 ($L/R$ 단위)")
save(fig, 1)

if __name__ == "__main__":
    # 식의 값: ρ = 0.5에서 1, 0.8에서 4, 0.9에서 9. 시뮬레이션이 식과 15% 안에서 맞는다
    assert abs(wq_formula(0.5) - 1) < 1e-12 and abs(wq_formula(0.8) - 4) < 1e-12 and abs(wq_formula(0.9) - 9) < 1e-12
    for r, s in zip(sim_rho, sim):
        assert abs(s - wq_formula(r)) / wq_formula(r) < 0.15, (r, s)
    print("ALL CHECKS PASSED")
```
{% endraw %}
