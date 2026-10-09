---
layout: "note"
title: "45_burst-prediction_plot.py"
display_title: "45_burst-prediction_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "45"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/burst-prediction/"
parent_title: "실행 시간 예측"
description: "운영체제 · 실행 시간 예측 코드 코드"
permalink: "/studies/operating-systems/code/45_burst-prediction_plot/"
---
{% raw %}
[실행 시간 예측](/Hongs_Blog/studies/operating-systems/burst-prediction/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 실행 시간 예측 문서의 그림을 만든다: 45_burst-prediction_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 45_burst-prediction_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "45_burst-prediction"
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


from fractions import Fraction as Fr


def expo(T, alpha, S1):
    S, out = Fr(S1), [Fr(S1)]
    for t in T:
        S = alpha * t + (1 - alpha) * S     # S_{n+1} = a T_n + (1-a) S_n
        out.append(S)
    return out


def simple(T):
    return [Fr(sum(T[:k]), k) for k in range(1, len(T) + 1)]     # S_{k+1} = (T_1 + ... + T_k) / k


T = [6, 4, 6, 4, 13, 13, 13]
n_actual = np.arange(1, len(T) + 1)
n_pred = np.arange(1, len(T) + 2)

# 그림 1: 실제 버스트와 α별 지수 평균, 단순 평균
fig, ax = plt.subplots(figsize=(6, 3.6))
ax.plot(n_actual, T, "o", color=INK, ms=7, label="실제 $T_n$", zorder=5)
for i, a in enumerate([Fr(1, 5), Fr(1, 2), Fr(4, 5)]):
    S = [float(x) for x in expo(T, a, 10)]
    ax.plot(n_pred, S, "-", marker=".", color=C[i], lw=1.6, label=f"지수 평균 α = {float(a):.1f}")
ax.plot(n_pred[1:], [float(x) for x in simple(T)], "--", marker=".", color=C[3], lw=1.4, label="단순 평균")
ax.set_xlabel("$n$ (몇 번째 버스트)")
ax.set_ylabel("시간")
ax.set_xticks(n_pred)
ax.set_ylim(2, 15)
ax.legend(loc="center left", bbox_to_anchor=(1.01, 0.5), fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    assert expo(T, Fr(1, 2), 10) == [10, 8, 6, 6, 5, 9, 11, 12]          # 문서 표
    S08 = expo(T, Fr(4, 5), 10)
    S02 = expo(T, Fr(1, 5), 10)
    # 13으로 뛴 뒤 α가 클수록 빨리 따라간다: n = 8에서 0.8 > 0.5 > 0.2 > 단순 평균
    assert S08[7] > 12 > S02[7] > simple(T)[-1]
    assert simple(T)[-1] == Fr(59, 7)
    print("ALL CHECKS PASSED")
```
{% endraw %}
