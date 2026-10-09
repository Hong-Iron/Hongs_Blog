---
layout: "note"
title: "29_cross-correlation_plot.py"
display_title: "29_cross-correlation_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "29"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/cross-correlation/"
parent_title: "교차 상관"
description: "휴먼 인터페이스 미디어 · 교차 상관 코드 코드"
permalink: "/studies/human-interface-media/code/29_cross-correlation_plot/"
---
{% raw %}
[교차 상관](/Hongs_Blog/studies/human-interface-media/cross-correlation/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 교차 상관 문서의 그림을 만든다: 29_cross-correlation_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 29_cross-correlation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "29_cross-correlation"
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


# 그림 1: 신호, 곱의 합(정규화 안 함), 정규화 점수
s = np.array([0, 0, 1, 3, 2, 0, 0, 9, 9, 9, 0, 0], float)
tpl = np.array([1, 3, 2], float)
m = len(tpl)
pos = np.arange(len(s) - m + 1)
raw = np.array([np.dot(tpl, s[n:n + m]) for n in pos])
def ncc(w):
    a, b = tpl - tpl.mean(), w - w.mean()
    d = np.linalg.norm(a) * np.linalg.norm(b)
    return 0.0 if d == 0 else float(np.dot(a, b) / d)
nc = np.array([ncc(s[n:n + m]) for n in pos])
fig, axs = plt.subplots(3, 1, figsize=(6.5, 5.2), sharex=True)
axs[0].bar(np.arange(len(s)), s, color=INK, width=0.6)
axs[0].bar([2, 3, 4], s[2:5], color=C[0], width=0.6)
axs[0].set_ylabel("신호 $s$")
axs[0].text(3, 4.2, "틀과 같은 모양", ha="center", fontsize=9, color=C[0])
axs[0].text(8, 9.8, "그냥 밝은 구간", ha="center", fontsize=9)
axs[0].set_ylim(0, 12)
axs[1].stem(pos, raw, linefmt=C[1], markerfmt="o", basefmt=" ")
axs[1].set_ylabel("곱의 합")
axs[1].annotate("최대 54", (7, 54), (8.3, 50), fontsize=9, color=C[1])
axs[1].set_ylim(0, 65)
axs[2].stem(pos, nc, linefmt=C[2], markerfmt="o", basefmt=" ")
axs[2].axhline(0, color=INK, lw=0.5)
axs[2].set_ylabel("정규화 점수")
axs[2].annotate("최대 1", (2, 1), (3.0, 0.95), fontsize=9, color=C[2])
axs[2].set_ylim(-1.15, 1.3)
axs[2].set_xlabel("틀을 놓은 위치 $n$")
axs[2].set_xticks(range(len(s)))
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert int(np.argmax(raw)) == 7 and raw[7] == 54
    assert int(np.argmax(nc)) == 2 and abs(nc[2] - 1) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
