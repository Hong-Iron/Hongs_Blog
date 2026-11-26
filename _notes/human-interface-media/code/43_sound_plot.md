---
layout: "note"
title: "43_sound_plot.py"
display_title: "43_sound_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "43"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/sound/"
parent_title: "소리"
description: "휴먼 인터페이스 미디어 · 소리 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/43_sound_plot/"
---
{% raw %}
[소리](/Hongs_Blog/studies/human-interface-media/sound/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 소리 문서의 그림을 만든다: 43_sound_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 43_sound_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "43_sound"
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


P_R = 20e-6
PEAK60 = P_R * 10 ** (60 / 20) * math.sqrt(2)     # 60 dB SPL 사인파의 봉우리, Pa
F_A, F_B = 440.0, 880.0

# 그림 1: 진폭과 주파수가 다른 단일음 (대기압과의 차를 mPa로)
t = np.linspace(0, 5e-3, 2000)
ms = t * 1e3
pa = lambda A, f: A * np.sin(2 * np.pi * f * t) * 1e3      # mPa
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7.2, 4.6), sharex=True)

ax1.plot(ms, pa(PEAK60, F_A), color=C[0], lw=1.8)
ax1.plot(ms, pa(2 * PEAK60, F_A), color=C[1], lw=1.8)
ax1.text(5.08, 45, "440 Hz\n봉우리 56.6 mPa", color=C[1], fontsize=10, va="center")
ax1.text(5.08, 6, "440 Hz\n봉우리 28.3 mPa", color=C[0], fontsize=10, va="center")
t_peak = 1e3 / (4 * F_A)
ax1.annotate("", xy=(t_peak, PEAK60 * 1e3), xytext=(t_peak, 0),
             arrowprops=dict(arrowstyle="<->", color=C[0], lw=1.2))
ax1.text(t_peak, -6, "진폭", color=C[0], fontsize=10, ha="center", va="top")
ax1.set_title("주파수는 같고 진폭만 다르다", fontsize=10.5, loc="left")

ax2.plot(ms, pa(PEAK60, F_A), color=C[0], lw=1.8)
ax2.plot(ms, pa(PEAK60, F_B), color=C[2], lw=1.8)
ax2.text(5.08, PEAK60 * 1e3 * 0.55, "880 Hz\n봉우리 28.3 mPa", color=C[2], fontsize=10, va="center")
ax2.text(5.08, -PEAK60 * 1e3 * 0.6, "440 Hz\n봉우리 28.3 mPa", color=C[0], fontsize=10, va="center")
T_A = 1e3 / F_A
ax2.annotate("", xy=(T_A * 2 + 0.0, -48), xytext=(T_A * 1 + 0.0, -48),
             arrowprops=dict(arrowstyle="<->", color=C[0], lw=1.2))
ax2.text(T_A * 1.5, -44, "한 주기 2.27 ms", color=C[0], fontsize=10, ha="center", va="bottom")
T_B = 1e3 / F_B
ax2.annotate("", xy=(T_B * 1.25, 40), xytext=(T_B * 0.25, 40),
             arrowprops=dict(arrowstyle="<->", color=C[2], lw=1.2))
ax2.text(T_B * 0.75, 44, "한 주기 1.14 ms", color=C[2], fontsize=10, ha="center", va="bottom")
ax2.set_title("진폭은 같고 주파수만 다르다", fontsize=10.5, loc="left")
ax2.set_xlabel("시간 (ms)")

for ax in (ax1, ax2):
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_ylim(-62, 62)
    ax.set_yticks([-50, 0, 50])
    ax.set_ylabel("대기압과의 차\n(mPa)")
ax2.set_xlim(0, 5)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert abs(PEAK60 - 0.02828) < 1e-5                         # 60 dB SPL 사인파의 봉우리
    assert abs(20 * math.log10((2 * PEAK60 / math.sqrt(2)) / P_R) - 66.02) < 0.01
    assert abs(T_A - 2.2727) < 1e-4 and abs(T_B - 1.1364) < 1e-4
    assert abs(pa(PEAK60, F_A).max() - 28.28) < 0.05
    assert os.path.exists(os.path.join(HERE, f"{PREFIX}_fig1.svg"))
    print("ALL CHECKS PASSED")
```
{% endraw %}
