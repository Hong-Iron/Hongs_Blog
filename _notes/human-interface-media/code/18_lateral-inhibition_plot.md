---
layout: "note"
title: "18_lateral-inhibition_plot.py"
display_title: "18_lateral-inhibition_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "18"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/lateral-inhibition/"
parent_title: "측면 억제"
description: "휴먼 인터페이스 미디어 · 측면 억제 그림 생성 코드"
permalink: "/studies/human-interface-media/code/18_lateral-inhibition_plot/"
---
{% raw %}
[측면 억제](/Hongs_Blog/studies/human-interface-media/lateral-inhibition/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 측면 억제 문서의 그림을 만든다: 18_lateral-inhibition_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 18_lateral-inhibition_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "18_lateral-inhibition"
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

K = 0.1


def gain(w, k=K):
    return 1 - 2 * k * np.cos(w)


# 그림 1: 커널 (-k, 1, -k)의 주파수별 이득. 고른 빛은 줄이고 촘촘한 줄무늬는 키운다
w = np.linspace(0, np.pi, 400)
marks = [(0, "고른 빛"), (np.pi / 3, None), (np.pi / 2, "중간 줄무늬"), (np.pi, "가장 촘촘한 줄무늬")]
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.plot(w, gain(w), color=C[0], lw=2)
ax.axhline(1, color=INK, lw=0.8, ls=":")
ax.text(0.05, 1.01, "이득 1 (그대로)", fontsize=9, va="bottom")
for wm, lab in marks:
    ax.plot(wm, gain(wm), "o", color=C[1])
    ax.annotate(f"{gain(wm):.1f}" + (f"  {lab}" if lab else ""), (wm, gain(wm)),
                xytext=(6, -14) if wm < 3 else (-8, 6), textcoords="offset points",
                fontsize=9, ha="left" if wm < 3 else "right")
ax.set_xticks([0, np.pi / 3, np.pi / 2, np.pi])
ax.set_xticklabels(["0", r"$\pi/3$", r"$\pi/2$", r"$\pi$"])
ax.set_ylim(0.7, 1.3)
ax.set_xlabel(r"줄무늬의 촘촘함 $\omega$")
ax.set_ylabel(r"이득 $1 - 2k\cos\omega$")
save(fig, 1)

if __name__ == "__main__":
    # 문서 표의 이득: 0.8 / 0.9 / 1.0 / 1.2, 그리고 실제 합성곱과 일치
    for wm, want in zip([0, np.pi / 3, np.pi / 2, np.pi], [0.8, 0.9, 1.0, 1.2]):
        assert abs(gain(wm) - want) < 1e-12
        n = np.arange(50)
        x = np.cos(wm * n)
        y = x[1:-1] - K * (x[:-2] + x[2:])
        assert np.allclose(y, want * x[1:-1])
    print("ALL CHECKS PASSED")
```
{% endraw %}
