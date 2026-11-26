---
layout: "note"
title: "46_loudness-pitch_plot.py"
display_title: "46_loudness-pitch_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "46"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/loudness-pitch/"
parent_title: "소리의 크기와 높이"
description: "휴먼 인터페이스 미디어 · 소리의 크기와 높이 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/46_loudness-pitch_plot/"
---
{% raw %}
[소리의 크기와 높이](/Hongs_Blog/studies/human-interface-media/loudness-pitch/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 소리의 크기와 높이 문서의 그림을 만든다: 46_loudness-pitch_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 46_loudness-pitch_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "46_loudness-pitch"
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


# 그림 1: 40 dB를 1로 놓은 세기 비와 느끼는 크기 (세로축 로그)
L = np.linspace(40, 110, 200)
I_ratio = 10 ** ((L - 40) / 10)
N = 2 ** ((L - 40) / 10)
fig, ax = plt.subplots(figsize=(7.0, 3.6))
ax.semilogy(L, I_ratio, color=C[1], lw=2)
ax.semilogy(L, N, color=C[0], lw=2)
ax.text(101, 10 ** 6.6, "세기 비\n(10 dB마다 ×10)", color=C[1], fontsize=10.5, ha="right", va="center")
ax.text(110.5, 128, "느끼는 크기\n(10 dB마다 ×2)", color=C[0], fontsize=10.5, ha="left", va="center")
for x in (40, 50):
    ax.plot([x, x], [0.6, 2 ** ((x - 40) / 10)], color=C[0], lw=0.8, ls="--")
ax.plot(50, 2, "o", color=C[0], ms=5)
ax.plot(40, 1, "o", color=C[0], ms=5)
ax.text(51.5, 1.6, "50 dB에서 2", color=C[0], fontsize=10, va="top")
ax.set_xlim(38, 112)
ax.set_ylim(0.6, 3e7)
ax.set_xticks(range(40, 111, 10))
ax.set_yticks([1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7])
ax.set_yticklabels(["1", "10", "$10^2$", "$10^3$", "$10^4$", "$10^5$", "$10^6$", "$10^7$"])
ax.set_xlabel("소리 수준 (dB)")
ax.set_ylabel("40 dB일 때를 1로 놓은 값")
fig.tight_layout()
save(fig, 1)

# 그림 2: 1+2+3+4차와 기본파를 뺀 2+3+4차 (기본 주파수 200 Hz)
F0 = 200.0
t = np.linspace(0, 20e-3, 4000)
ms = t * 1e3
y_all = sum(np.sin(2 * np.pi * k * F0 * t) for k in (1, 2, 3, 4))
y_mis = sum(np.sin(2 * np.pi * k * F0 * t) for k in (2, 3, 4))
fig, axes = plt.subplots(2, 2, figsize=(7.4, 3.8), gridspec_kw={"width_ratios": [2.4, 1]})
for row, (y, ks, col, name) in enumerate(((y_all, (1, 2, 3, 4), C[0], "200 + 400 + 600 + 800 Hz"),
                                          (y_mis, (2, 3, 4), C[1], "400 + 600 + 800 Hz"))):
    axw, axs = axes[row]
    axw.plot(ms, y, color=col, lw=1.3)
    for m in range(1, 4):
        axw.axvline(m * 5, color=INK, lw=0.7, ls=":")
    axw.axhline(0, color=INK, lw=0.5)
    axw.set_ylim(-4, 4.3)
    axw.set_yticks([])
    axw.set_xlim(0, 20)
    axw.set_xticks([0, 5, 10, 15, 20])
    axw.set_title(name, fontsize=10.5, loc="left", color=col)
    axs.vlines([k * F0 for k in ks], 0, 1, color=col, lw=2.2)
    axs.set_xlim(0, 1000)
    axs.set_ylim(0, 1.2)
    axs.set_yticks([])
    axs.set_xticks([0, 200, 400, 600, 800, 1000])
    axs.tick_params(axis="x", labelsize=9.5)
    if row == 0:
        axw.set_xticklabels([])
        axs.set_xticklabels([])
axes[1][0].set_xlabel("시간 (ms)  (점선: 5 ms 간격)")
axes[1][1].set_xlabel("주파수 (Hz)")
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    assert abs(2 ** ((50 - 40) / 10) - 2) < 1e-12 and abs(2 ** ((110 - 40) / 10) - 128) < 1e-9
    assert abs(10 ** ((110 - 40) / 10) - 1e7) < 1e-3
    shift = 5e-3
    for ks, y in (((1, 2, 3, 4), y_all), ((2, 3, 4), y_mis)):
        ys = sum(np.sin(2 * np.pi * k * F0 * (t + shift)) for k in ks)
        assert np.max(np.abs(ys - y)) < 1e-9
    y_half = sum(np.sin(2 * np.pi * k * F0 * (t + 2.5e-3)) for k in (2, 3, 4))
    assert np.max(np.abs(y_half - y_mis)) > 1.0
    for k in (1, 2):
        assert os.path.exists(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"))
    print("ALL CHECKS PASSED")
```
{% endraw %}
