---
layout: "note"
title: "39_digital-modulation_plot.py"
display_title: "39_digital-modulation_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "39"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/digital-modulation/"
parent_title: "진폭·주파수·위상 변조"
description: "컴퓨터 통신 · 진폭·주파수·위상 변조 코드 코드"
permalink: "/studies/computer-communication/code/39_digital-modulation_plot/"
---
{% raw %}
[진폭·주파수·위상 변조](/Hongs_Blog/studies/computer-communication/digital-modulation/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 진폭·주파수·위상 변조 문서의 그림을 만든다: 39_digital-modulation_fig1.svg, 39_digital-modulation_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 39_digital-modulation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "39_digital-modulation"
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

BITS = [1, 0, 1, 1, 0]
SPB = 400                    # 비트 하나에 점 400개
CYC = 3                      # 반송파가 비트 하나 동안 3번 출렁인다 (그림용 값)


def waves(bits):
    t = np.arange(len(bits) * SPB) / SPB             # 비트 칸 단위 시간
    b = np.repeat(bits, SPB)
    carrier = np.sin(2 * np.pi * CYC * t)
    ask = np.where(b == 1, carrier, 0.0)                                   # 1이면 보내고 0이면 끈다
    fsk = np.where(b == 1, np.sin(2 * np.pi * 2 * CYC * t), carrier)        # 1이면 두 배 빠르게
    psk = np.where(b == 1, -carrier, carrier)                              # 1이면 반 바퀴 밀린다
    return t, ask, fsk, psk


T, ASK, FSK, PSK = waves(BITS)

# 그림 1: 같은 비트 1 0 1 1 0을 세 방법으로 실은 모양
fig, axes = plt.subplots(3, 1, figsize=(6.5, 4.4), sharex=True)
for ax, y, name in zip(axes, [ASK, FSK, PSK], ["진폭 변조", "주파수 변조", "위상 변조"]):
    ax.plot(T, y, color=C[0], lw=1.2)
    for k in range(1, len(BITS)):
        ax.axvline(k, color=INK, lw=0.6, ls=":")
    ax.set_ylabel(name, rotation=0, ha="right", va="center", fontsize=10)
    ax.set_yticks([])
    ax.spines["left"].set_visible(False)
    ax.set_ylim(-1.3, 1.3)
for k, b in enumerate(BITS):
    axes[0].text(k + 0.5, 1.55, str(b), ha="center", fontsize=11)
axes[-1].set_xticks([])
axes[-1].set_xlabel("시간 (점선 사이가 비트 한 칸)")
save(fig, 1)

# 그림 2: 같은 잡음이 섞일 때, 높이 2단계와 4단계에서 받은 값의 분포
SIGMA = 0.6
rng = np.random.default_rng(3)
LEVELS2 = [0.0, 5.0]
LEVELS4 = [0.0, 1.5, 3.5, 5.0]                     # 문서의 네 단계 (V)


def received(levels, n=20000):
    sent = rng.integers(0, len(levels), n)
    return sent, np.array(levels)[sent] + rng.normal(0, SIGMA, n)


def error_rate(levels, sent, rx):
    th = [(a + b) / 2 for a, b in zip(levels, levels[1:])]
    guess = np.searchsorted(th, rx)
    return float(np.mean(guess != sent))


S2, R2 = received(LEVELS2)
S4, R4 = received(LEVELS4)
fig, axes = plt.subplots(2, 1, figsize=(6, 3.8), sharex=True)
bins = np.linspace(-2.5, 7.5, 121)
for ax, levels, sent, rx, title in [(axes[0], LEVELS2, S2, R2, "2단계 (0, 5 V)"),
                                    (axes[1], LEVELS4, S4, R4, "4단계 (0, 1.5, 3.5, 5 V)")]:
    for i, lv in enumerate(levels):
        ax.hist(rx[sent == i], bins=bins, color=C[i], alpha=0.7)
    for a, b in zip(levels, levels[1:]):
        ax.axvline((a + b) / 2, color=INK, lw=0.8, ls="--")
    ax.set_title(f"{title}: 잘못 읽은 비율 {error_rate(levels, sent, rx) * 100:.1f}%", fontsize=10,
                 loc="left", color=INK)
    ax.set_yticks([])
    ax.spines["left"].set_visible(False)
axes[1].set_xlabel("받은 높이 (V). 점선은 받는 쪽이 단계를 가르는 기준")
fig.subplots_adjust(hspace=0.5)
save(fig, 2)

if __name__ == "__main__":
    # 그림 1: 칸마다 반송파가 정해진 성질만 바뀐다
    cell = lambda y, k: y[k * SPB:(k + 1) * SPB]
    assert np.allclose(cell(ASK, 1), 0) and np.allclose(cell(ASK, 0), cell(PSK, 1))   # 0 비트의 위상 = 반송파
    assert np.allclose(cell(PSK, 0), -cell(PSK, 1))                                   # 1 비트는 반 바퀴 밀림
    assert np.allclose(cell(FSK, 1), cell(PSK, 1)) and not np.allclose(cell(FSK, 0), cell(FSK, 1))
    # 그림 2: 같은 잡음에서 4단계가 2단계보다 훨씬 자주 틀린다 (2단계 거의 0%, 4단계 약 10%)
    e2, e4 = error_rate(LEVELS2, S2, R2), error_rate(LEVELS4, S4, R4)
    assert e2 < 0.001 and 0.05 < e4 < 0.2, (e2, e4)
    # 4단계는 심볼 하나에 lg 4 = 2비트
    assert math.log2(len(LEVELS4)) == 2
    print("ALL CHECKS PASSED")
```
{% endraw %}
