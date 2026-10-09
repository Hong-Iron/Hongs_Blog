---
layout: "note"
title: "32_root-finding-compared_plot.py"
display_title: "32_root-finding-compared_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "32"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/root-finding-compared/"
parent_title: "근 찾기 방법 비교"
description: "수치해석 · 근 찾기 방법 비교 그림 생성 코드"
permalink: "/studies/numerical-analysis/code/32_root-finding-compared_plot/"
---
{% raw %}
[근 찾기 방법 비교](/Hongs_Blog/studies/numerical-analysis/root-finding-compared/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 근 찾기 방법 비교 문서의 그림을 만든다: 32_root-finding-compared_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 32_root-finding-compared_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "32_root-finding-compared"
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


f = lambda x: math.exp(-x) - x
df = lambda x: -math.exp(-x) - 1
ROOT = 0.56714329040978387


def errors(step, state, tol=1e-10, limit=100):
    out = []
    for _ in range(limit):
        state = step(state)
        out.append(abs(state[0] - ROOT))
        if out[-1] < tol:
            break
    return out


# 검증 코드와 같은 시작값: 이분법 [0, 1], 뉴턴 0, 할선 0과 1, 고정점 0
bis = lambda s: (lambda m: ((m, s[1], m) if f(s[1]) * f(m) < 0 else (m, m, s[2])))((s[1] + s[2]) / 2)
E = {
    "이분법": errors(bis, (0.5, 0.0, 1.0)),
    "뉴턴": errors(lambda s: (s[0] - f(s[0]) / df(s[0]),), (0.0,)),
    "할선": errors(lambda s: (s[0] - f(s[0]) * (s[0] - s[1]) / (f(s[0]) - f(s[1])), s[0]), (1.0, 0.0)),
    "고정점": errors(lambda s: (math.exp(-s[0]),), (0.0,)),
}
fig, ax = plt.subplots(figsize=(6, 3.6))
for i, (name, e) in enumerate(E.items()):
    e = np.maximum(e, 1e-17)
    ax.semilogy(range(1, len(e) + 1), e, "o-", color=C[i], ms=3, lw=1.4, label=f"{name} ({len(e)}번)")
ax.axhline(1e-10, color=INK, lw=0.6, ls="--")
ax.text(9, 5e-11, "목표 오차 $10^{-10}$", fontsize=9, ha="left", va="top")
ax.set_yticks([1e-16, 1e-12, 1e-8, 1e-4, 1])
ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"$10^{{{round(math.log10(v))}}}$"))
ax.set_ylim(1e-17, 3)
ax.set_xlabel("반복 횟수")
ax.set_ylabel("참 근과의 차이")
ax.legend(loc="upper right", fontsize=9)
save(fig, 1)

if __name__ == "__main__":
    # 표: 오차 1e-10까지 이분법 33, 뉴턴 4, 할선 5, 고정점 40번
    assert [len(E[k]) for k in ("이분법", "뉴턴", "할선", "고정점")] == [33, 4, 5, 40]
    print("ALL CHECKS PASSED")
```
{% endraw %}
