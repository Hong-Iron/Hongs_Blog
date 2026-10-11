---
layout: "note"
title: "15_parzen-window_plot.py"
display_title: "15_parzen-window_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "15"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "확률과 데이터"
parent_url: "/studies/data-and-information/parzen-window/"
parent_title: "파젠 창"
description: "자료와 정보 · 파젠 창 그림 생성 코드"
permalink: "/studies/data-and-information/code/15_parzen-window_plot/"
---
{% raw %}
[파젠 창](/Hongs_Blog/studies/data-and-information/parzen-window/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 파젠 창 문서의 그림을 만든다: 15_parzen-window_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 15_parzen-window_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "15_parzen-window"
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

DATA = np.array([3, 4, 5, 5, 6, 7, 12, 13, 14, 20], dtype=float)


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


def parzen(x, h):
    """상자 창: x를 가운데 둔 폭 h인 구간에 든 표본 수 / (n h)."""
    x = np.atleast_1d(x).astype(float)
    diff = x[:, None] - DATA[None, :]
    inside = (diff > -h / 2 - 1e-12) & (diff < h / 2 - 1e-12)   # 경계 한 점에서만 생기는 뾰족한 선을 그리지 않는다
    return inside.sum(axis=1) / (len(DATA) * h)


def fig1():
    xs = np.linspace(-4, 28, 6401)
    notes = {1: "창이 너무 작다: 표본마다 뾰족한 기둥", 4: "두 무리와 그 사이 골짜기가 보인다", 10: "창이 너무 크다: 골짜기가 메워진다"}
    fig, axes = plt.subplots(3, 1, figsize=(7.2, 6.6), sharex=True)
    for ax, h, c in zip(axes, (1, 4, 10), C):
        ax.step(xs, parzen(xs, h), where="mid", color=c, lw=1.8)
        ax.plot(DATA, np.full_like(DATA, -0.012), "|", color=INK, ms=9, mew=1.5, clip_on=False)
        ax.set_ylim(-0.02, 0.33)
        ax.set_ylabel("추정한 밀도")
        ax.text(0.99, 0.9, f"창 폭 h = {h}\n{notes[h]}", transform=ax.transAxes, ha="right", va="top", color=c)
        for q in (5.2, 9.6):
            v = parzen(q, h)[0]
            ax.plot([q], [v], "o", color=c, ms=5)
            ax.annotate(f"{v:.3g}", (q, v), textcoords="offset points", xytext=(6, 8), color=c, fontsize=10)
    axes[-1].set_xlabel("머리카락 길이 x (cm). 아래 세로 눈금이 표본 10개")
    fig.tight_layout()
    save(fig, 1)


if __name__ == "__main__":
    # 그림에 쓴 핵심 값 확인
    assert np.allclose(parzen(5.2, 1), 0.2) and np.allclose(parzen(5.2, 4), 0.125) and np.allclose(parzen(5.2, 10), 0.06)
    assert np.allclose(parzen(9.6, 1), 0) and np.allclose(parzen(9.6, 4), 0) and np.allclose(parzen(9.6, 10), 0.07)
    xs = np.linspace(-10, 40, 500001)
    for h in (1, 4, 10):
        area = parzen(xs, h).sum() * (xs[1] - xs[0])
        assert abs(area - 1) < 2e-3, (h, area)
    fig1()
    print("ALL CHECKS PASSED")
```
{% endraw %}
