---
layout: "note"
title: "55_psychoacoustic-model_plot.py"
display_title: "55_psychoacoustic-model_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "55"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/psychoacoustic-model/"
parent_title: "심리음향 모델"
description: "휴먼 인터페이스 미디어 · 심리음향 모델 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/55_psychoacoustic-model_plot/"
---
{% raw %}
[심리음향 모델](/Hongs_Blog/studies/human-interface-media/psychoacoustic-model/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 심리음향 모델 문서의 그림을 만든다: 55_psychoacoustic-model_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 55_psychoacoustic-model_plot.py  (matplotlib, numpy 필요)
# 51~55 문서 공통 식 (설명용 모형). 계산은 55_psychoacoustic-model_impl.py와 같다 (파일끼리 import하지 않고 복사).
#   Tq(f): Terhardt(1979),  z(f): Zwicker & Terhardt(1980),  SF(dz): Schroeder(1979)
#   성분 하나의 가림 문턱 = L - 10 dB + SF(z(f) - z(fi)),  전체 가림 문턱 = 세기로 더한 합
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "55_psychoacoustic-model"
INK = "#888888"
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


# ---- 51~55 공통 식 ----
OFFSET = 10.0


def tq(f):
    k = np.asarray(f, dtype=float) / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * np.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


def bark(f):
    f = np.asarray(f, dtype=float)
    return 13.0 * np.arctan(0.00076 * f) + 3.5 * np.arctan((f / 7500.0) ** 2)


def spread(dz):
    u = np.asarray(dz, dtype=float) + 0.474
    return 15.81 + 7.5 * u - 17.5 * np.sqrt(1.0 + u * u)


def global_threshold(f, comps, skip=None):
    total = 10.0 ** (tq(f) / 10.0)
    for i, (fi, Li) in enumerate(comps):
        if i != skip:
            total = total + 10.0 ** ((Li - OFFSET + spread(bark(f) - bark(fi))) / 10.0)
    return 10.0 * np.log10(total)


EXAMPLE = [(60, 45), (150, 15), (500, 40), (1000, 80), (1200, 60),
           (1600, 40), (2000, 50), (2500, 25), (8000, 15), (15000, 40)]


def verdicts(comps):
    out = []
    for i, (f, L) in enumerate(comps):
        t_all = float(global_threshold(f, comps, skip=i))
        out.append("남김" if L > t_all else ("작아서" if L <= float(tq(f)) else "가려져서"))
    return out


V = verdicts(EXAMPLE)
f = np.logspace(np.log10(20), np.log10(20000), 3000)
G = global_threshold(f, EXAMPLE)
fig, (a1, a2) = plt.subplots(2, 1, figsize=(7, 6.4), sharex=True)
for ax in (a1, a2):
    ax.plot(f, tq(f), color=C[0], lw=1.3, ls="--")
    ax.set_xscale("log")
    ax.set_xlim(20, 20000)
    ax.set_ylim(-20, 90)
    ax.set_ylabel("dB SPL")
a1.fill_between(f, -20, G, color=C[1], alpha=0.10)
a1.plot(f, G, color=C[1], lw=1.8)
for (fi, Li), v in zip(EXAMPLE, V):
    col = C[2] if v == "남김" else INK
    a1.plot([fi, fi], [-20, Li], color=col, lw=3 if v == "남김" else 2, ls="-" if v == "남김" else ":")
    a1.plot([fi], [Li], marker="o", ms=5, color=col, markerfacecolor=col if v == "남김" else "none")
a1.text(25, 80, "1. 성분들과 전체 가림 문턱", fontsize=10)
a1.text(110, 42, "전체 가림 문턱", color=C[1], fontsize=9.5)
a1.text(2750, -13, "조용할 때의\n문턱", color=C[0], fontsize=9.5, va="center")
a1.text(2600, 88, "굵은 막대: 문턱 위\n점선 막대: 문턱 아래", fontsize=9.5, va="top")
for (fi, Li), v in zip(EXAMPLE, V):
    if v == "남김":
        a2.plot([fi, fi], [-20, Li], color=C[2], lw=3)
        a2.plot([fi], [Li], marker="o", ms=5, color=C[2])
a2.text(25, 80, "2. 남기는 성분 (10개 중 5개)", fontsize=10)
a2.set_xticks([20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000])
a2.set_xticklabels(["20", "50", "100", "200", "500", "1k", "2k", "5k", "10k", "20k"])
a2.set_xlabel("주파수 (Hz, 로그 눈금)")
save(fig, 1)

if __name__ == "__main__":
    assert V == ["남김", "작아서", "남김", "남김", "가려져서", "가려져서", "남김", "가려져서", "남김", "작아서"], V
    assert V.count("남김") == 5
    # 전체 문턱은 어디서나 조용할 때의 문턱 이상이다
    assert np.all(G >= tq(f) - 1e-9)
    # 1 kHz 80 dB 성분 바로 위(1.2 kHz)에서 전체 문턱이 60 dB를 넘는다
    assert float(global_threshold(1200.0, EXAMPLE, skip=4)) > 64.0
    print("ALL CHECKS PASSED")
```
{% endraw %}
