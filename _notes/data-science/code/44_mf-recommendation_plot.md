---
layout: "note"
title: "44_mf-recommendation_plot.py"
display_title: "44_mf-recommendation_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "44"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/mf-recommendation/"
parent_title: "행렬 분해 추천"
description: "데이터 과학 · 행렬 분해 추천 그림 생성 코드"
permalink: "/studies/data-science/code/44_mf-recommendation_plot/"
---
{% raw %}
[행렬 분해 추천](/Hongs_Blog/studies/data-science/mf-recommendation/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 행렬 분해 추천 문서의 그림을 만든다: 44_mf-recommendation_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 44_mf-recommendation_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "44_mf-recommendation"
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

R = np.array([[5, 3, 0, 1], [4, 0, 0, 1], [1, 1, 0, 5], [1, 0, 0, 4], [0, 1, 5, 4]], float)  # 0은 빈칸
U, s, Vt = np.linalg.svd(R)
d = 2
Pu = U[:, :d] * np.sqrt(s[:d])                         # 사용자 숨은 벡터
Qi = Vt[:d].T * np.sqrt(s[:d])                         # 아이템 숨은 벡터
Rh = Pu @ Qi.T
sg = np.sign(Pu[:, 0].sum())                            # 축 방향(부호)은 마음대로라 보기 좋게 맞춘다
Pu, Qi = Pu * sg, Qi * sg

# 그림 1: PureSVD(d = 2)가 사용자와 아이템을 놓은 숨은 공간
fig, ax = plt.subplots(figsize=(5.5, 4.2))
ax.plot(*Pu.T, "o", color=C[0], ms=8, label="사용자 U1~U5")
ax.plot(*Qi.T, "s", color=C[1], ms=8, label="아이템 I1~I4")
for u, (x, y) in enumerate(Pu):
    ax.annotate(f"U{u + 1}", (x, y), xytext=(-8, 6), textcoords="offset points", fontsize=9, color=C[0])
for i, (x, y) in enumerate(Qi):
    ax.annotate(f"I{i + 1}", (x, y), xytext=(7, -4), textcoords="offset points", fontsize=9, color=C[1])
ax.axhline(0, color=INK, lw=0.5); ax.axvline(0, color=INK, lw=0.5)
ax.set_aspect("equal")
ax.set_xlabel("숨은 축 1"); ax.set_ylabel("숨은 축 2")
ax.legend(loc="upper left", bbox_to_anchor=(1.02, 1), fontsize=10)
ax.margins(0.25)
save(fig, 1)

if __name__ == "__main__":
    assert np.allclose(Pu @ Qi.T, Rh)
    errs = [float(((R - (U[:, :k] * s[:k]) @ Vt[:k]) ** 2).sum()) for k in range(1, 5)]
    assert all(a >= b - 1e-9 for a, b in zip(errs, errs[1:])) and errs[-1] < 1e-8
    assert abs(errs[1] - (s[2:] ** 2).sum()) < 1e-9
    assert [round(e, 3) for e in errs[:3]] == [56.428, 17.624, 3.382]          # 44_mf-recommendation_impl.py 출력과 같다
    assert [round(v, 2) for v in Rh[1]] == [3.43, 1.28, -0.46, 1.09]
    print("     d = 2 재구성의 사용자 2:", Rh[1].round(2), "/ 재구성 오차", [round(e, 3) for e in errs])
    print("ALL CHECKS PASSED")
```
{% endraw %}
