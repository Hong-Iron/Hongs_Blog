---
layout: "note"
title: "47_range-of-hearing_plot.py"
display_title: "47_range-of-hearing_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "47"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/range-of-hearing/"
parent_title: "가청 대역"
description: "휴먼 인터페이스 미디어 · 가청 대역 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/47_range-of-hearing_plot/"
---
{% raw %}
[가청 대역](/Hongs_Blog/studies/human-interface-media/range-of-hearing/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 가청 대역 문서의 그림을 만든다: 47_range-of-hearing_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 47_range-of-hearing_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "47_range-of-hearing"
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


def threshold_db(f_hz):
    """조용할 때 들리기 시작하는 문턱의 근사 (dB SPL). Terhardt (1979)."""
    k = np.asarray(f_hz, dtype=float) / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * np.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


FEEL = 120.0                     # 아프게 느끼는 문턱 (어림값)
SOLID_TOP = 15000.0              # 근사식을 믿을 만한 위쪽 끝
POINTS = [(30, 40), (100, 40), (1000, 40)]

# 그림 1: 주파수-크기 평면에서 들리는 영역
f_all = np.logspace(math.log10(20), math.log10(19000), 600)
t_all = threshold_db(f_all)
fig, ax = plt.subplots(figsize=(7.2, 4.0))
mask = t_all < FEEL
ax.fill_between(f_all[mask], t_all[mask], FEEL, color=C[0], alpha=0.12, lw=0)
solid = f_all <= SOLID_TOP
ax.plot(f_all[solid], t_all[solid], color=C[0], lw=2)
dash = (f_all >= SOLID_TOP) & (t_all < 135)
ax.plot(f_all[dash], t_all[dash], color=C[0], lw=2, ls="--")
ax.axhline(FEEL, color=C[1], lw=2, ls="--")
ax.text(25, FEEL + 3, "아프게 느끼는 문턱 (약 120 dB)", color=C[1], fontsize=10)
ax.text(280, 14, "들리기 시작하는 문턱", color=C[0], fontsize=10)
ax.text(1400, 70, "들리는 영역", color=C[0], fontsize=11, ha="center")
for f in (20, 20000):
    ax.axvline(f, color=INK, lw=0.8, ls=":")
ax.text(21, -17, "20 Hz", fontsize=10)
ax.text(19500, -17, "20 kHz", fontsize=10, ha="right")
labels = ["30 Hz", "100 Hz", "1 kHz"]
offsets = [(0.75, -12), (1.12, 3), (1.12, 3)]
for (f, db), lab, c, (dx, dy) in zip(POINTS, labels, [C[3], C[2], C[2]], offsets):
    ax.plot([f], [db], "o", color=c, ms=7)
    ax.text(f * dx, db + dy, f"{lab}, 40 dB", color=c, fontsize=10)
ax.set_xscale("log")
ax.set_xlim(18, 22000)
ax.set_ylim(-20, 135)
ax.set_xticks([20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000])
ax.set_xticklabels(["20", "50", "100", "200", "500", "1k", "2k", "5k", "10k", "20k"])
ax.set_xlabel("주파수 (Hz, 로그 눈금)")
ax.set_ylabel("음압 레벨 (dB SPL)")
save(fig, 1)

if __name__ == "__main__":
    t = threshold_db(np.array([30.0, 100.0, 1000.0]))
    assert t[0] > 40 > t[1] and 40 > t[2], t              # 30 Hz 는 문턱 아래, 나머지는 위
    fmin = f_all[np.argmin(t_all)]
    assert 3000 < fmin < 4000 and -5.2 < t_all.min() < -4.8, (fmin, t_all.min())
    assert threshold_db(SOLID_TOP) < FEEL                   # 실선 구간은 120 dB 아래
    print("ALL CHECKS PASSED")
```
{% endraw %}
