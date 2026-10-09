---
layout: "note"
title: "24_complex-wave_plot.py"
display_title: "24_complex-wave_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "24"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/complex-wave/"
parent_title: "파동의 복소수 표현"
description: "휴먼 인터페이스 미디어 · 파동의 복소수 표현 그림 생성 코드"
permalink: "/studies/human-interface-media/code/24_complex-wave_plot/"
---
{% raw %}
[파동의 복소수 표현](/Hongs_Blog/studies/human-interface-media/complex-wave/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 파동의 복소수 표현 문서의 그림을 만든다: 24_complex-wave_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 24_complex-wave_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "24_complex-wave"
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


# 그림 1: 원 위를 도는 점(왼쪽)과 그 세로 위치를 시간에 따라 적은 사인 곡선(오른쪽)
A = 1.0
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.2, 3.0), gridspec_kw={"width_ratios": [1, 2.2]})
th = np.linspace(0, 2 * np.pi, 300)
ax1.plot(A * np.cos(th), A * np.sin(th), color=INK, lw=1)
ax1.axhline(0, color=INK, lw=0.5)
ax1.axvline(0, color=INK, lw=0.5)
marks = [np.pi / 6, 2 * np.pi / 3, 5 * np.pi / 4]
for k, a in enumerate(marks):
    ax1.plot([0, np.cos(a)], [0, np.sin(a)], color=C[k], lw=1.4)
    ax1.plot(np.cos(a), np.sin(a), "o", color=C[k], ms=5)
ax1.annotate("", xy=(0.0, 1.18), xytext=(0.55, 1.05),
             arrowprops=dict(arrowstyle="->", color=INK, connectionstyle="arc3,rad=0.25"))
ax1.set_xlim(-1.3, 1.3)
ax1.set_ylim(-1.3, 1.3)
ax1.set_aspect("equal")
ax1.set_xlabel("실수부 (cos)")
ax1.set_ylabel("허수부 (sin)")
ax1.set_xticks([-1, 0, 1])
ax1.set_yticks([-1, 0, 1])
t = np.linspace(0, 1, 400)
ax2.plot(t, A * np.sin(2 * np.pi * t), color=INK, lw=2, label=r"$\sin(2\pi t)$ (허수부)")
ax2.plot(t, A * np.cos(2 * np.pi * t), color=INK, lw=1, ls="--", label=r"$\cos(2\pi t)$ (실수부)")
for k, a in enumerate(marks):
    tt = a / (2 * np.pi)
    ax2.plot(tt, np.sin(a), "o", color=C[k], ms=5)
    ax2.axvline(tt, color=C[k], lw=0.6, ls=":")
ax2.axhline(0, color=INK, lw=0.5)
ax2.set_xlabel("$t$ (주기 $T = 1$)")
ax2.set_yticks([-1, 0, 1])
ax2.legend(loc="lower left", fontsize=9)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    for a in marks:
        z = np.exp(1j * a)
        assert abs(z.imag - np.sin(a)) < 1e-12 and abs(z.real - np.cos(a)) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
