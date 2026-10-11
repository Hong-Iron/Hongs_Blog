---
layout: "note"
title: "37_digital-transmission_plot.py"
display_title: "37_digital-transmission_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "37"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/digital-transmission/"
parent_title: "디지털 전송"
description: "컴퓨터 통신 · 디지털 전송 그림 생성 코드"
permalink: "/studies/computer-communication/code/37_digital-transmission_plot/"
---
{% raw %}
[디지털 전송](/Hongs_Blog/studies/computer-communication/digital-transmission/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 디지털 전송 문서의 그림을 만든다: 37_digital-transmission_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 37_digital-transmission_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "37_digital-transmission"
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

BITS = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1]
SPB = 40               # 비트 하나에 점 40개
LOSS = 0.3             # 구간 하나를 지나면 신호가 30%로 약해진다
NOISE = 0.09           # 구간마다 섞이는 잡음의 크기 (표준편차, 약해진 신호 0.3에 견줌)
HOPS = 5


def clean(bits):
    return np.repeat(np.where(np.array(bits) == 1, 1.0, -1.0), SPB)


def one_span(x, rng):
    return LOSS * x + rng.normal(0, NOISE, x.size)


def amplifier_chain(bits, hops, rng):
    """구간마다 약해지고 잡음이 섞인 뒤, 앰프가 1/LOSS배로 통째로 키운다"""
    x = clean(bits)
    out = []
    for _ in range(hops):
        x = one_span(x, rng) / LOSS
        out.append(x.copy())
    return out


def repeater_chain(bits, hops, rng):
    """구간마다 약해지고 잡음이 섞인 뒤, 리피터가 칸 가운데를 기준선 0과 비교해 0과 1을 정하고 새로 만든다"""
    x = clean(bits)
    out, decided = [], []
    for _ in range(hops):
        y = one_span(x, rng)
        mid = y.reshape(-1, SPB)[:, SPB // 2]
        b = [1 if v > 0 else 0 for v in mid]
        x = clean(b)
        out.append(x.copy())
        decided.append(b)
    return out, decided


rng = np.random.default_rng(7)
AMP = amplifier_chain(BITS, HOPS, rng)
REP, DECIDED = repeater_chain(BITS, HOPS, rng)
t = np.arange(len(BITS) * SPB) / SPB

# 그림 1: 다섯 번 중계한 뒤의 신호. 위는 앰프, 아래는 리피터
fig, axes = plt.subplots(2, 1, figsize=(6.5, 4.0), sharex=True)
ax = axes[0]
ax.plot(t, AMP[0], color=C[0], lw=0.8, label="앰프 1번 뒤")
ax.plot(t, AMP[-1], color=C[1], lw=0.8, label="앰프 5번 뒤")
ax.plot(t, clean(BITS), color=INK, lw=1.2, ls="--", label="보낸 신호")
ax.set_title("앰프: 잡음도 같이 키워서 중계할수록 쌓인다", fontsize=10, loc="left", color=INK)
ax.legend(loc="upper right", fontsize=8, ncol=3, bbox_to_anchor=(1.0, 1.42))
ax = axes[1]
ax.plot(t, REP[-1], color=C[2], lw=1.6, label="리피터 5번 뒤")
ax.plot(t, clean(BITS), color=INK, lw=1.2, ls="--")
ax.set_title("리피터: 0과 1을 정해 새로 만들어서 잡음이 사라진다", fontsize=10, loc="left", color=INK)
for ax in axes:
    ax.set_ylim(-2.6, 2.6)
    ax.set_yticks([-1, 0, 1], ["0", "", "1"])
    ax.axhline(0, color=INK, lw=0.5, ls=":")
axes[1].set_xlabel("시간 (비트 칸 단위)")
axes[1].set_xticks(range(0, 17, 2))
fig.subplots_adjust(hspace=0.45)
save(fig, 1)

if __name__ == "__main__":
    # 리피터는 다섯 번 모두 보낸 비트 그대로를 되살렸다
    assert all(b == BITS for b in DECIDED)
    # 앰프 뒤 잡음의 크기는 중계 횟수의 제곱근에 비례해 커진다: k번 뒤 약 sqrt(k) * NOISE / LOSS
    for k in (1, HOPS):
        resid = np.std(AMP[k - 1] - clean(BITS))
        expect = math.sqrt(k) * NOISE / LOSS
        assert abs(resid - expect) / expect < 0.15, (k, resid, expect)
    assert np.std(AMP[-1] - clean(BITS)) > 2 * np.std(AMP[0] - clean(BITS))
    print("ALL CHECKS PASSED")
```
{% endraw %}
