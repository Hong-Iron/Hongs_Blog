---
layout: "note"
title: "23_markov-chains_plot.py"
display_title: "23_markov-chains_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "23"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/markov-chains/"
parent_title: "마르코프 연쇄"
description: "확률과 통계 · 마르코프 연쇄 그림 생성 코드"
permalink: "/studies/probability-statistics/code/23_markov-chains_plot/"
---
{% raw %}
[마르코프 연쇄](/Hongs_Blog/studies/probability-statistics/markov-chains/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 마르코프 연쇄 문서의 그림을 만든다: 23_markov-chains_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 23_markov-chains_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "23_markov-chains"
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


def Phi(z):
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def log_ticks(ax, axis="y"):
    """로그 눈금 글자를 수식 글꼴로 쓴다(한글 글꼴에 없는 마이너스 기호를 피한다)."""
    from matplotlib.ticker import FuncFormatter
    f = FuncFormatter(lambda v, _: f"$10^{{{int(round(math.log10(v)))}}}$" if v > 0 else "")
    (ax.yaxis if axis == "y" else ax.xaxis).set_major_formatter(f)


P = np.array([[0.9, 0.1], [0.5, 0.5]])                  # 상태 0 = 맑음, 1 = 비
PI = np.array([5 / 6, 1 / 6])
T = 15
paths = {}
for name, start in [("비에서 출발", [0.0, 1.0]), ("맑음에서 출발", [1.0, 0.0])]:
    d = np.array(start)
    hist = [d]
    for _ in range(T):
        d = d @ P
        hist.append(d)
    paths[name] = np.array(hist)

# 그림 1: 왼쪽 맑을 확률이 출발점과 상관없이 5/6로 간다. 오른쪽 정상분포와의 차이는 매일 0.4배 (로그 눈금)
fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.5, 3))
days = np.arange(T + 1)
for i, (name, h) in enumerate(paths.items()):
    a1.plot(days, h[:, 0], "o-", color=C[i], ms=3.5, lw=1.2, label=name)
    a2.plot(days, np.abs(h[:, 0] - PI[0]), "o-", color=C[i], ms=3.5, lw=1.2)
a1.axhline(PI[0], color=INK, lw=0.8, ls="--")
a1.text(T, PI[0] - 0.04, "5/6", ha="right", va="top", fontsize=10)
a1.set_ylim(-0.03, 1.05)
a1.set_xlabel("날")
a1.set_title("맑을 확률", fontsize=11)
a1.legend(loc="lower right", fontsize=9)
a2.set_yscale("log")
log_ticks(a2)
a2.set_xlabel("날")
a2.set_title("|맑을 확률 - 5/6|", fontsize=11)
a2.text(8, 1e-1, "매일 × 0.4", fontsize=10)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    h = paths["비에서 출발"]
    assert np.allclose(h[1:4, 0], [0.5, 0.7, 0.78])
    assert np.allclose(PI @ P, PI)
    err = np.abs(h[:, 0] - PI[0])
    assert np.allclose(err[1:] / err[:-1], 0.4)
    assert sorted(np.round(np.linalg.eigvals(P).real, 12).tolist()) == [0.4, 1.0]
    print("ALL CHECKS PASSED")
```
{% endraw %}
