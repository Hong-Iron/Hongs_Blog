---
layout: "note"
title: "24_matrix-calculus_plot.py"
display_title: "24_matrix-calculus_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "24"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/matrix-calculus/"
parent_title: "행렬 미분"
description: "미분적분학 · 행렬 미분 그림 생성 코드"
permalink: "/studies/calculus/code/24_matrix-calculus_plot/"
---
{% raw %}
[행렬 미분](/Hongs_Blog/studies/calculus/matrix-calculus/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 행렬 미분 문서의 그림을 만든다: 24_matrix-calculus_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 24_matrix-calculus_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "24_matrix-calculus"
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


A = np.array([[1.0, 2.0], [0.0, 3.0]])


def q(x, y):
    return A[0, 0] * x * x + (A[0, 1] + A[1, 0]) * x * y + A[1, 1] * y * y


def contour_pt(b):
    # 각도 b 방향으로 가서 높이 1인 등고선과 만나는 점
    d = np.array([math.cos(b), math.sin(b)])
    return d / math.sqrt(d @ A @ d)


ANG = np.linspace(0, 2 * np.pi, 6, endpoint=False) + 0.3
PTS = np.array([contour_pt(a) for a in ANG])

# 그림 1: x^T A x = 1인 등고선 위에서 올바른 기울기 (A + A^T)x(초록)는 등고선에 수직, 틀린 2Ax(주황)는 비스듬하다
fig, ax = plt.subplots(figsize=(5.6, 3.9))
X, Y = np.meshgrid(np.linspace(-1.8, 1.8, 300), np.linspace(-1.3, 1.3, 300))
ax.contour(X, Y, q(X, Y), levels=[0.25, 1, 2.25], colors=INK, linewidths=0.8)
S = 0.12
for i, p in enumerate(PTS):
    good = (A + A.T) @ p
    bad = 2 * A @ p
    ax.annotate("", xy=p + S * good, xytext=p, arrowprops=dict(arrowstyle="-|>", color=C[2], lw=1.6))
    ax.annotate("", xy=p + S * bad, xytext=p, arrowprops=dict(arrowstyle="-|>", color=C[1], lw=1.2, ls="--"))
    ax.plot(*p, "o", ms=3.5, color=INK)
ax.plot([], [], color=C[2], lw=1.6, label=r"$(A+A^\top)\mathbf{x}$ (맞는 기울기)")
ax.plot([], [], color=C[1], lw=1.2, ls="--", label=r"$2A\mathbf{x}$ (틀린 공식)")
ax.legend(loc="upper left", bbox_to_anchor=(1.0, 1.0), fontsize=9)
ax.set_aspect("equal")
ax.set_xlabel("$x_1$")
ax.set_ylabel("$x_2$")
save(fig, 1)

if __name__ == "__main__":
    # 맞는 기울기 = 중앙 차분, 등고선 접선과 수직(내적 0), 틀린 공식은 수직이 아니다
    h = 1e-6
    rng = np.random.default_rng(1)
    for p in rng.normal(size=(50, 2)):
        num = np.array([(q(*(p + h * e)) - q(*(p - h * e))) / (2 * h) for e in np.eye(2)])
        assert np.allclose(num, (A + A.T) @ p, atol=1e-6)
    bad_dots = []
    for a, p in zip(ANG, PTS):
        assert abs(q(*p) - 1) < 1e-12
        tan = (contour_pt(a + h) - contour_pt(a - h)) / (2 * h)
        tan /= np.linalg.norm(tan)
        assert abs(((A + A.T) @ p) @ tan) < 1e-6
        bad_dots.append(abs((2 * A @ p) @ tan))
    assert min(bad_dots) > 0.1
    print("ALL CHECKS PASSED")
```
{% endraw %}
