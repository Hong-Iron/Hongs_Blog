---
layout: "note"
title: "02_chi-square-correlation_plot.py"
display_title: "02_chi-square-correlation_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "02"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/chi-square-correlation/"
parent_title: "카이제곱 상관 분석"
description: "데이터 과학 · 카이제곱 상관 분석 코드 코드"
permalink: "/studies/data-science/code/02_chi-square-correlation_plot/"
---
{% raw %}
[카이제곱 상관 분석](/Hongs_Blog/studies/data-science/chi-square-correlation/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 카이제곱 상관 분석 문서의 그림을 만든다: 02_chi-square-correlation_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 02_chi-square-correlation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "02_chi-square-correlation"
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

OBS = [[250, 200], [50, 1000]]                          # 행: 소설, 비소설 / 열: 남, 여


def chi2_stat(obs):
    rows = [sum(r) for r in obs]; cols = [sum(c) for c in zip(*obs)]; n = sum(rows)
    return sum((obs[i][j] - rows[i] * cols[j] / n) ** 2 / (rows[i] * cols[j] / n)
               for i in range(len(rows)) for j in range(len(cols)))


def pdf1(x):                                            # 자유도 1인 카이제곱 분포의 확률밀도
    return x ** -0.5 * np.exp(-x / 2) / math.sqrt(2 * math.pi)


def sf1(x):                                             # 자유도 1에서 x보다 클 확률
    return math.erfc(math.sqrt(x / 2))


CRIT = 10.828

# 그림 1: 독립일 때 카이제곱 값이 따르는 분포(자유도 1)와 임계값, 그리고 이 예의 값
x = np.linspace(0.04, 16, 600)
fig, ax = plt.subplots(figsize=(6, 3.3))
ax.plot(x, pdf1(x), color=C[0], lw=2)
ax.axvline(CRIT, color=C[1], lw=1.2, ls="--")
ax.text(CRIT + 0.25, 0.42, "임계값 10.828\n독립이면 이보다 클\n확률이 0.001", fontsize=10, color=C[1], va="top")
ax.annotate("이 예의 값 507.93은\n그림 밖, 훨씬 오른쪽", xy=(16, 0.08), xytext=(11.3, 0.17), fontsize=10,
            arrowprops=dict(arrowstyle="->", color=INK, lw=1))
ax.set_xlim(0, 16)
ax.set_ylim(0, 0.6)
ax.set_xlabel(r"$\chi^2$ 값")
ax.set_ylabel("확률밀도")
ax.text(1.3, 0.5, "두 속성이 독립일 때\n나오는 값의 분포", fontsize=10, color=C[0])
save(fig, 1)

if __name__ == "__main__":
    assert abs(chi2_stat(OBS) - 507.93) < 0.01            # 정확히는 507.937
    assert abs(sf1(CRIT) - 0.001) < 2e-6
    assert sf1(chi2_stat(OBS)) < 1e-100
    print("ALL CHECKS PASSED")
```
{% endraw %}
