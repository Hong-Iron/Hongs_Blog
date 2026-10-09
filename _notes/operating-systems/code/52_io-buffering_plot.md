---
layout: "note"
title: "52_io-buffering_plot.py"
display_title: "52_io-buffering_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "52"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/io-buffering/"
parent_title: "입출력 버퍼링"
description: "운영체제 · 입출력 버퍼링 그림 생성 코드"
permalink: "/studies/operating-systems/code/52_io-buffering_plot/"
---
{% raw %}
[입출력 버퍼링](/Hongs_Blog/studies/operating-systems/io-buffering/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 입출력 버퍼링 문서의 그림을 만든다: 52_io-buffering_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 52_io-buffering_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "52_io-buffering"
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


T, CC, M = 10, 4, 1     # 읽기, 계산, 옮기기 (ms). 문서 예와 같다
NB = 5                  # 그릴 블록 수


def plan(kind, n=NB):
    """(장치 막대, 프로세스 막대) 목록. 막대 = (시작, 길이, 종류, 블록 번호)."""
    dev, proc = [], []
    if kind == "none":
        for i in range(n):
            s = i * (T + CC)
            dev.append((s, T, "읽기", i + 1)); proc.append((s + T, CC, "계산", i + 1))
    elif kind == "single":
        dev.append((0, T, "읽기", 1)); proc.append((T, M, "옮기기", 1))
        s = T + M
        for i in range(1, n + 1):
            proc.append((s, CC, "계산", i))
            if i < n:
                dev.append((s, T, "읽기", i + 1)); proc.append((s + max(CC, T), M, "옮기기", i + 1))
            s += max(CC, T) + M
    else:
        for i in range(n):
            dev.append((i * T, T, "읽기", i + 1)); proc.append(((i + 1) * T, CC, "계산", i + 1))
    return dev, proc


KIND = [("버퍼 없음", "none"), ("단일 버퍼", "single"), ("이중 버퍼", "double")]
FC = {"읽기": C[0], "계산": C[1], "옮기기": C[4]}
XMAX = 50

# 그림 1: 블록을 차례로 읽어 계산할 때 장치와 프로세스가 일하는 구간
fig, ax = plt.subplots(figsize=(6.5, 3.4))
plans = {}
labels = []
for r, (label, kind) in enumerate(KIND):
    dev, proc = plans[kind] = plan(kind)
    base = (len(KIND) - 1 - r) * 3
    for lane, bars in ((base + 1, dev), (base, proc)):
        for s, d, what, b in bars:
            if s >= XMAX:
                continue
            ax.broken_barh([(s, min(d, XMAX - s))], (lane - 0.38, 0.76), facecolors=FC[what], edgecolor="white", lw=0.8)
            if what != "옮기기" and s + 2 < XMAX:
                ax.text(s + min(d, XMAX - s) / 2, lane, str(b), ha="center", va="center", color="white", fontsize=8)
    labels += [(base + 1, f"{label}  장치"), (base, "프로세스")]
ax.set_yticks([y for y, _ in labels])
ax.set_yticklabels([t for _, t in labels], fontsize=9)
for what, col in FC.items():
    ax.broken_barh([(0, 0)], (0, 0), facecolors=col, label=what)
ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.18), ncol=3, fontsize=9)
ax.set_xlim(0, XMAX)
ax.set_ylim(-0.6, 3 * len(KIND) - 0.9)
ax.set_xlabel("시각 (ms)")
ax.spines["left"].set_visible(False)
ax.tick_params(axis="y", length=0)
save(fig, 1)

if __name__ == "__main__":
    # 정상 상태에서 블록 하나가 끝나는 간격: 14, 11, 10 ms (문서 표)
    for kind, per in (("none", 14), ("single", 11), ("double", 10)):
        ends = sorted(s + d for s, d, what, _ in plans[kind][1] if what == "계산")
        gaps = {b - a for a, b in zip(ends, ends[1:])}
        assert gaps == {per}, (kind, gaps)
    print("ALL CHECKS PASSED")
```
{% endraw %}
