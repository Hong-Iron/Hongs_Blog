---
layout: "note"
title: "40_nrz-clock-recovery_plot.py"
display_title: "40_nrz-clock-recovery_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "40"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/nrz-clock-recovery/"
parent_title: "NRZ와 클럭 복구"
description: "컴퓨터 통신 · NRZ와 클럭 복구 코드 코드"
permalink: "/studies/computer-communication/code/40_nrz-clock-recovery_plot/"
---
{% raw %}
[NRZ와 클럭 복구](/Hongs_Blog/studies/computer-communication/nrz-clock-recovery/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# NRZ와 클럭 복구 문서의 그림을 만든다: 40_nrz-clock-recovery_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 40_nrz-clock-recovery_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "40_nrz-clock-recovery"
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

SENT = "0010111101000010"
W = 15 / 16                    # 받는 쪽이 믿는 비트 폭 (보낸 쪽 = 1)


def read_times(n, w=W):
    return [(k + 0.5) * w for k in range(n)]


def read_bits(bits, w=W):
    return "".join(bits[int(math.floor(t))] for t in read_times(len(bits), w))


TIMES = read_times(len(SENT))
GOT = read_bits(SENT)

# 그림 1: NRZ 신호(보낸 칸)와 받는 쪽이 읽는 시각. 9번째 읽기가 8번째 칸을 한 번 더 읽는다
fig, ax = plt.subplots(figsize=(6.5, 3.3))
levels = [int(b) for b in SENT]
ax.step(np.arange(len(SENT) + 1), levels + [levels[-1]], where="post", color=C[0], lw=1.6)
for k in range(len(SENT) + 1):
    ax.axvline(k, color=INK, lw=0.4, ls=":")
for k, b in enumerate(SENT):
    ax.text(k + 0.5, 1.55, b, ha="center", fontsize=10, color=C[0])
ax.text(-0.3, 1.55, "보낸 비트", ha="right", fontsize=9, color=C[0])
ax.text(-0.3, -0.6, "읽은 비트", ha="right", fontsize=9, color=C[1])
for k, t in enumerate(TIMES):
    dup = k == 8
    ax.plot([t, t], [-0.25, 1.25], color=C[1], lw=1.6 if dup else 0.8, alpha=1 if dup else 0.7)
    ax.text(t, -0.6, GOT[k], ha="center", fontsize=10, color=C[1], fontweight="bold" if dup else "normal")
ax.annotate("9번째 읽기가 8번째 칸을 한 번 더 읽는다", (TIMES[8], 1.27), xytext=(8.6, 2.15),
            fontsize=9, color=C[1], va="center", arrowprops=dict(arrowstyle="-", color=C[1], lw=0.6))
ax.set_xlim(-0.2, 16.2)
ax.set_ylim(-0.9, 2.35)
ax.set_yticks([0, 1], ["낮음", "높음"])
ax.set_xticks(range(0, 17, 2))
ax.set_xlabel("시간 (보낸 쪽 비트 칸 단위). 주황 세로선은 받는 쪽이 읽는 시각")
save(fig, 1)

if __name__ == "__main__":
    # 문서 표의 값: 9번째 읽기 시각 7.97(8번째 칸), 받은 열 0010111110100001, 첫 중복은 k = 8
    assert abs(TIMES[8] - 7.96875) < 1e-12 and math.floor(TIMES[8]) == 7 and math.floor(TIMES[7]) == 7
    assert GOT == "0010111110100001"
    first_dup = next(k for k in range(1, 16) if math.floor(TIMES[k]) == math.floor(TIMES[k - 1]))
    assert first_dup == 8
    # 식 k > 1/(2ε) - 1/2, ε = 1/16 → k > 7.5 → k = 8
    eps = 1 - W
    assert min(k for k in range(100) if (k + 0.5) * eps > 0.5) == 8
    print("ALL CHECKS PASSED")
```
{% endraw %}
