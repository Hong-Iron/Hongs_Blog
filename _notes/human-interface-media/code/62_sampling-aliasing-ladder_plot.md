---
layout: "note"
title: "62_sampling-aliasing-ladder_plot.py"
display_title: "62_sampling-aliasing-ladder_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "62"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/sampling-aliasing-ladder/"
parent_title: "표본화와 에일리어싱 예제 사다리"
description: "휴먼 인터페이스 미디어 · 표본화와 에일리어싱 예제 사다리 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/62_sampling-aliasing-ladder_plot/"
---
{% raw %}
[표본화와 에일리어싱 예제 사다리](/Hongs_Blog/studies/human-interface-media/sampling-aliasing-ladder/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 표본화와 에일리어싱 예제 사다리의 그림을 만든다: 62_sampling-aliasing-ladder_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 62_sampling-aliasing-ladder_plot.py  (matplotlib, numpy 필요)
#   fig1: 문제 1. 6000 Hz 코사인을 8000 Hz로 잰 표본이 2000 Hz 코사인 위에 그대로 놓인다
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "62_sampling-aliasing-ladder"
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


fs = 8000.0
t_ms = np.linspace(0, 1.5, 3001)                         # 0 ~ 1.5 ms
t = t_ms / 1000
n = np.arange(0, 13)
tn = n / fs
fig, ax = plt.subplots(figsize=(7, 3.2))
ax.plot(t_ms, np.cos(2 * np.pi * 6000 * t), color=INK, lw=1.0, label="6000 Hz (실제 성분)")
ax.plot(t_ms, np.cos(2 * np.pi * 2000 * t), color=C[0], lw=1.8, ls="--", label="2000 Hz (보이는 성분)")
ax.vlines(tn * 1000, 0, np.cos(2 * np.pi * 6000 * tn), color=C[1], lw=1.6)
ax.plot(tn * 1000, np.cos(2 * np.pi * 6000 * tn), "o", color=C[1], ms=5, label="8000 Hz로 잰 표본")
ax.axhline(0, color=INK, lw=0.8)
ax.set_xlabel("시간 (ms), 표본 간격 0.125 ms")
ax.set_yticks([-1, 0, 1])
ax.set_ylim(-1.25, 1.9)
ax.legend(loc="upper center", ncol=3, fontsize=10)
save(fig, 1)

if __name__ == "__main__":
    s6 = np.cos(2 * np.pi * 6000 * tn)
    s2 = np.cos(2 * np.pi * 2000 * tn)
    assert np.max(np.abs(s6 - s2)) < 1e-9                  # 표본이 2000 Hz 곡선 위에 그대로 놓인다
    assert abs(1 / fs * 1000 - 0.125) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
