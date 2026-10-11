---
layout: "note"
title: "16_knn-density_plot.py"
display_title: "16_knn-density_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "16"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/data-and-information/knn-density/"
parent_title: "k-이웃 밀도 추정"
description: "자료와 정보 · k-이웃 밀도 추정 그림 생성 코드"
permalink: "/studies/data-and-information/code/16_knn-density_plot/"
---
{% raw %}
[k-이웃 밀도 추정](/Hongs_Blog/studies/data-and-information/knn-density/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# k-이웃 밀도 추정 문서의 그림을 만든다: 16_knn-density_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 16_knn-density_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "16_knn-density"
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

DATA = np.array([3, 4, 5, 5, 6, 7, 12, 13, 14, 20], dtype=float)


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


def knn(x, k):
    """x에서 k번째로 가까운 표본까지 거리 r → (k/n)/(2r)."""
    x = np.atleast_1d(x).astype(float)
    r = np.sort(np.abs(x[:, None] - DATA[None, :]), axis=1)[:, k - 1]
    with np.errstate(divide="ignore"):
        return k / (len(DATA) * 2 * r)


def fig1():
    xs = np.linspace(-4, 30, 6801)
    fig, ax = plt.subplots(figsize=(7.2, 3.8))
    for k, c in ((3, C[1]), (5, C[0])):
        ax.plot(xs, knn(xs, k), color=c, lw=1.8)
    ax.plot(DATA, np.full_like(DATA, -0.012), "|", color=INK, ms=9, mew=1.5, clip_on=False)
    ax.set_ylim(-0.02, 0.42)
    ax.set_xlabel("머리카락 길이 x (cm). 아래 세로 눈금이 표본 10개")
    ax.set_ylabel("추정한 밀도")
    ax.text(6.6, 0.33, "k = 3: 뾰족하다", color=C[1])
    ax.annotate("k = 5: 더 완만하다", (16.5, knn(16.5, 5)[0]), textcoords="offset points",
                xytext=(0, 34), color=C[0], arrowprops={"arrowstyle": "-", "color": C[0], "lw": 0.8})
    ax.annotate("표본이 없는 곳도 0이 아니다", (9.6, knn(9.6, 3)[0]), textcoords="offset points",
                xytext=(-10, 78), color=INK, arrowprops={"arrowstyle": "-", "color": INK, "lw": 0.8})
    ax.annotate("멀리 가도 천천히 준다", (27, knn(27, 5)[0]), textcoords="offset points",
                xytext=(-40, 60), color=INK, arrowprops={"arrowstyle": "-", "color": INK, "lw": 0.8})
    fig.tight_layout()
    save(fig, 1)


if __name__ == "__main__":
    # 그림에 쓴 핵심 값 확인
    assert np.allclose(knn(5.2, 3), 0.1875) and np.allclose(knn(5.2, 5), 5 / 36)
    assert np.allclose(knn(9.6, 3), 3 / 68) and np.allclose(knn(9.6, 5), 5 / 88)
    xs = np.linspace(-4, 30, 6801)
    assert (knn(xs, 3) > 0).all() and (knn(xs, 5) > 0).all()
    assert knn(xs, 3).max() > knn(xs, 5).max()             # k = 3이 더 뾰족하다
    assert np.allclose(knn(30, 3), 3 / 340)
    fig1()
    print("ALL CHECKS PASSED")
```
{% endraw %}
