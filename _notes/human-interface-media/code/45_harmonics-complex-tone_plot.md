---
layout: "note"
title: "45_harmonics-complex-tone_plot.py"
display_title: "45_harmonics-complex-tone_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "45"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/harmonics-complex-tone/"
parent_title: "고조파와 복합음"
description: "휴먼 인터페이스 미디어 · 고조파와 복합음 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/45_harmonics-complex-tone_plot/"
---
{% raw %}
[고조파와 복합음](/Hongs_Blog/studies/human-interface-media/harmonics-complex-tone/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 고조파와 복합음 문서의 그림을 만든다: 45_harmonics-complex-tone_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 45_harmonics-complex-tone_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "45_harmonics-complex-tone"
INK = "#888888"                                         # 밝은 테마와 어두운 테마 모두에서 보이는 회색
C = ["#3b82c4", "#d9622b", "#3a9a5b", "#9b59b6", "#c49a1b"]
_fonts = {f.name for f in font_manager.fontManager.ttflist}
FONT = next((n for n in ["Apple SD Gothic Neo", "NanumGothic", "Noto Sans CJK KR"] if n in _fonts), "DejaVu Sans")
plt.rcParams.update({
    "font.family": FONT, "mathtext.fontset": "dejavusans",
    "font.size": 10.5, "axes.unicode_minus": False, "svg.fonttype": "path", "svg.hashsalt": PREFIX,
    "axes.edgecolor": INK, "axes.labelcolor": INK, "xtick.color": INK, "ytick.color": INK,
    "text.color": INK, "legend.frameon": False,
    "axes.facecolor": "none", "figure.facecolor": "none", "savefig.transparent": True,
    "axes.spines.top": False, "axes.spines.right": False,
})


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


F0 = 200.0                      # 기본 주파수, Hz
T0_MS = 1e3 / F0                # 5 ms
AMPS = {1: 1.0, 2: 0.6, 3: 0.4}  # 차수별 진폭 (설명용)
t = np.linspace(0, 15e-3, 3000)
ms = t * 1e3


def partial(K):
    return sum(AMPS[k] * np.sin(2 * np.pi * k * F0 * t) for k in range(1, K + 1))


# 그림 1: 1차, 1+2차, 1+2+3차 (왼쪽 파형, 오른쪽 스펙트럼)
fig, axes = plt.subplots(3, 2, figsize=(7.4, 5.0), gridspec_kw={"width_ratios": [2.4, 1]})
for row, K in enumerate((1, 2, 3)):
    axw, axs = axes[row]
    axw.plot(ms, partial(K), color=C[0], lw=1.6)
    for m in (1, 2):
        axw.axvline(m * T0_MS, color=INK, lw=0.7, ls=":")
    axw.axhline(0, color=INK, lw=0.5)
    axw.set_ylim(-1.9, 1.9)
    axw.set_yticks([])
    axw.set_xlim(0, 15)
    label = " + ".join(f"{k}차" for k in range(1, K + 1))
    axw.text(14.9, 1.85, label, fontsize=10.5, va="top", ha="right", color=C[0])
    freqs = [k * F0 for k in range(1, K + 1)]
    axs.vlines(freqs, 0, [AMPS[k] for k in range(1, K + 1)], color=C[1], lw=2.2)
    axs.plot(freqs, [AMPS[k] for k in range(1, K + 1)], "o", color=C[1], ms=4)
    axs.set_xlim(0, 1000)
    axs.set_ylim(0, 1.15)
    axs.set_yticks([])
    axs.set_xticks([0, 200, 400, 600, 800, 1000])
    axs.tick_params(axis="x", labelsize=9.5)
    if row < 2:
        axw.set_xticklabels([])
        axs.set_xticklabels([])
axes[0][0].annotate("", xy=(T0_MS, -1.55), xytext=(0, -1.55), arrowprops=dict(arrowstyle="<->", color=INK, lw=1))
axes[0][0].text(T0_MS / 2, -1.45, "5 ms", ha="center", va="bottom", fontsize=10)
axes[2][0].set_xlabel("시간 (ms)")
axes[2][1].set_xlabel("주파수 (Hz)")
axes[0][1].set_title("성분 (스펙트럼)", fontsize=10.5)
axes[0][0].set_title("합친 파형", fontsize=10.5)
fig.tight_layout()
save(fig, 1)

# 그림 2: 정수배 성분의 합(화음)과 정수배가 아닌 성분의 합
t2 = np.linspace(0, 30e-3, 6000)
ms2 = t2 * 1e3
HARM = (200.0, 400.0, 600.0)
NONH = (200.0, 200.0 * math.sqrt(2), 200.0 * math.sqrt(5))
yh = sum(np.sin(2 * np.pi * f * t2) for f in HARM)
yn = sum(np.sin(2 * np.pi * f * t2) for f in NONH)
fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.4, 3.9), sharex=True)
a1.plot(ms2, yh, color=C[0], lw=1.3)
a2.plot(ms2, yn, color=C[1], lw=1.3)
for ax in (a1, a2):
    for m in range(1, 6):
        ax.axvline(m * T0_MS, color=INK, lw=0.7, ls=":")
    ax.axhline(0, color=INK, lw=0.5)
    ax.set_ylim(-3.4, 3.4)
    ax.set_yticks([])
a1.set_title("200 + 400 + 600 Hz", fontsize=10.5, loc="left", color=C[0])
a2.set_title("200 + 283 + 447 Hz", fontsize=10.5, loc="left", color=C[1])
a2.set_xlabel("시간 (ms)  (점선: 5 ms 간격)")
a2.set_xlim(0, 30)
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    n5 = int(round(len(t) * (5 / 15)))
    full = partial(3)
    # 5 ms 뒤 같은 값 (표본 간격 15 ms / 2999)
    shift = 5e-3
    y_shift = sum(AMPS[k] * np.sin(2 * np.pi * k * F0 * (t + shift)) for k in (1, 2, 3))
    assert np.max(np.abs(y_shift - full)) < 1e-9
    yh_shift = sum(np.sin(2 * np.pi * f * (t2 + shift)) for f in HARM)
    yn_shift = sum(np.sin(2 * np.pi * f * (t2 + shift)) for f in NONH)
    assert np.max(np.abs(yh_shift - yh)) < 1e-9
    assert np.max(np.abs(yn_shift - yn)) > 1.0
    assert abs(NONH[1] - 282.84) < 0.01 and abs(NONH[2] - 447.21) < 0.01
    for k in (1, 2):
        assert os.path.exists(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"))
    print("ALL CHECKS PASSED")
```
{% endraw %}
