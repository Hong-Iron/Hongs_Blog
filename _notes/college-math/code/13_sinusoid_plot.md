---
layout: "note"
title: "13_sinusoid_plot.py"
display_title: "13_sinusoid_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "13"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/sinusoid/"
parent_title: "사인파"
description: "대학수학 · 사인파 그림 생성 코드"
permalink: "/studies/college-math/code/13_sinusoid_plot/"
---
{% raw %}
[사인파](/Hongs_Blog/studies/college-math/sinusoid/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 사인파 문서의 그림을 만든다: 13_sinusoid_fig1.svg, 13_sinusoid_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 13_sinusoid_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "13_sinusoid"
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

F = 440.0

# 그림 1: 440 Hz 사인파(회색)에서 진폭, 주파수, 위상을 하나씩 바꾼 것
t = np.linspace(0, 5e-3, 1000)
ms = t * 1e3
base = np.sin(2 * np.pi * F * t)
fig, axs = plt.subplots(1, 3, figsize=(6.5, 2.6), sharey=True)
variants = [("진폭 2배", 2 * np.sin(2 * np.pi * F * t)),
            ("주파수 2배", np.sin(2 * np.pi * 2 * F * t)),
            ("위상 $\\pi/2$", np.sin(2 * np.pi * F * t + np.pi / 2))]
for i, (ax, (title, y)) in enumerate(zip(axs, variants)):
    ax.plot(ms, base, color=INK, lw=1.6)
    ax.plot(ms, y, color=C[i], lw=1.6)
    ax.set_title(title, fontsize=11)
    ax.axhline(0, color=INK, lw=0.5)
    ax.set_xlabel("시간 (ms)")
    ax.set_xticks([0, 2.5, 5])
axs[0].set_yticks([-2, -1, 0, 1, 2])
fig.tight_layout()
save(fig, 1)

# 그림 2: 8 kHz로 잰 7 kHz 사인파(파랑)의 표본은 −1 kHz 사인파(주황)의 표본과 같다
FS = 8000
t = np.linspace(0, 1e-3, 2000)
n = np.arange(0, 9)
tn = n / FS
fig, ax = plt.subplots(figsize=(6.5, 3))
ax.plot(t * 1e3, np.sin(2 * np.pi * 7000 * t), color=C[0], lw=1.2, label="7 kHz")
ax.plot(t * 1e3, -np.sin(2 * np.pi * 1000 * t), color=C[1], lw=2, label="$-$1 kHz (부호만 반대)")
ax.plot(tn * 1e3, np.sin(2 * np.pi * 7000 * tn), "o", color=INK, ms=7, label="8 kHz 표본")
ax.axhline(0, color=INK, lw=0.5)
ax.set_xlabel("시간 (ms)")
ax.set_ylim(-1.2, 1.2)
ax.legend(loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=10)
save(fig, 2)

if __name__ == "__main__":
    # 주기 1/440 s ≈ 2.27 ms, 위상 π/2는 1/1760 s 앞섬, 표본 2,000개 일치
    assert round(1000 / F, 2) == 2.27
    assert abs((np.pi / 2) / (2 * np.pi * F) - 1 / 1760) < 1e-15
    k = np.arange(2000)
    assert np.allclose(np.sin(2 * np.pi * 7000 * k / FS), -np.sin(2 * np.pi * 1000 * k / FS), atol=1e-9)
    print("ALL CHECKS PASSED")
```
{% endraw %}
