---
layout: "note"
title: "44_decibel_plot.py"
display_title: "44_decibel_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "44"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/decibel/"
parent_title: "데시벨"
description: "휴먼 인터페이스 미디어 · 데시벨 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/44_decibel_plot/"
---
{% raw %}
[데시벨](/Hongs_Blog/studies/human-interface-media/decibel/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 데시벨 문서의 그림을 만든다: 44_decibel_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 44_decibel_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "44_decibel"
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
})


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


# 원본 표: 소리, 상대 진폭(음압 비), dB
SOUNDS = [
    ("겨우 들림", 1, 0),
    ("나뭇잎 소리", 10, 20),
    ("조용한 주택가", 100, 40),
    ("보통 대화", 1_000, 60),
    ("급행 지하철", 100_000, 100),
    ("프로펠러기 이륙", 1_000_000, 120),
    ("제트 엔진 (통증)", 10_000_000, 140),
]

# 그림 1: dB, 음압 비, 세기 비를 나란히 놓은 세 눈금자
fig, ax = plt.subplots(figsize=(7.4, 3.7))
Y = {"db": 2.0, "p": 1.0, "i": 0.0}
COL = {"db": INK, "p": C[0], "i": C[1]}
for key, y in Y.items():
    ax.plot([0, 140], [y, y], color=COL[key], lw=1.6)
for d in range(0, 141, 20):
    for key, y in Y.items():
        ax.plot([d, d], [y - 0.07, y + 0.07], color=COL[key], lw=1.2)
    ax.text(d, Y["db"] - 0.13, f"{d}", ha="center", va="top", fontsize=10)
    e_p, e_i = d // 20, d // 10
    ax.text(d, Y["p"] - 0.13, "1" if e_p == 0 else ("10" if e_p == 1 else f"$10^{{{e_p}}}$"),
            ha="center", va="top", fontsize=10, color=C[0])
    ax.text(d, Y["i"] - 0.13, "1" if e_i == 0 else ("10" if e_i == 1 else f"$10^{{{e_i}}}$"),
            ha="center", va="top", fontsize=10, color=C[1])
ax.text(-6, Y["db"], "dB SPL", ha="right", va="center", fontsize=10.5)
ax.text(-6, Y["p"], "음압 비\n$P_o / P_r$", ha="right", va="center", fontsize=10.5, color=C[0])
ax.text(-6, Y["i"], "세기 비\n$I_o / I_r$", ha="right", va="center", fontsize=10.5, color=C[1])

for name, amp, d in SOUNDS:
    ax.plot(d, Y["db"], "o", color=C[2], ms=5)
    ax.text(d, Y["db"] + 0.16, name, rotation=35, ha="left", va="bottom", fontsize=9.5, color=C[2])

# 40 dB -> 60 dB 한 칸: 음압 10배, 세기 100배
ax.annotate("", xy=(60, Y["p"] + 0.22), xytext=(40, Y["p"] + 0.22),
            arrowprops=dict(arrowstyle="->", color=C[0], lw=1.1))
ax.text(50, Y["p"] + 0.27, "×10", ha="center", va="bottom", fontsize=10, color=C[0])
ax.annotate("", xy=(60, Y["i"] + 0.22), xytext=(40, Y["i"] + 0.22),
            arrowprops=dict(arrowstyle="->", color=C[1], lw=1.1))
ax.text(50, Y["i"] + 0.27, "×100", ha="center", va="bottom", fontsize=10, color=C[1])

ax.set_xlim(-30, 152)
ax.set_ylim(-0.45, 3.3)
ax.axis("off")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    for name, amp, d in SOUNDS:
        assert abs(20 * math.log10(amp) - d) < 1e-9                 # 음압 비 -> dB SPL
        assert abs(10 * math.log10(amp ** 2) - d) < 1e-9            # 세기 비 = 음압 비의 제곱
    assert abs(20 * math.log10(10) - 20) < 1e-12 and abs(10 * math.log10(100) - 20) < 1e-12
    assert os.path.exists(os.path.join(HERE, f"{PREFIX}_fig1.svg"))
    print("ALL CHECKS PASSED")
```
{% endraw %}
