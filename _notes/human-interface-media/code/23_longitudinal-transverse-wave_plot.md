---
layout: "note"
title: "23_longitudinal-transverse-wave_plot.py"
display_title: "23_longitudinal-transverse-wave_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "23"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/longitudinal-transverse-wave/"
parent_title: "종파와 횡파"
description: "휴먼 인터페이스 미디어 · 종파와 횡파 코드 코드"
permalink: "/studies/human-interface-media/code/23_longitudinal-transverse-wave_plot/"
---
{% raw %}
[종파와 횡파](/Hongs_Blog/studies/human-interface-media/longitudinal-transverse-wave/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 종파와 횡파 문서의 그림을 만든다: 23_longitudinal-transverse-wave_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 23_longitudinal-transverse-wave_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "23_longitudinal-transverse-wave"
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


# 그림 1: 같은 물결이 지나갈 때 입자가 움직이는 방향. 위는 종파(소리), 아래는 횡파(빛을 줄에 빗댄 모습)
N = 25                                  # 한 줄의 입자 수
X0 = np.linspace(0, 12, N)              # 쉬는 자리 (간격 0.5)
AMP = 0.3                               # 흔들림의 크기
K = 2 * np.pi / 6                       # 파장 6
disp = AMP * np.sin(K * X0)             # 각 입자가 쉬는 자리에서 벗어난 양

long_x, long_y = X0 + disp, np.zeros(N)         # 종파: 나아가는 방향(x)으로만 밀린다
trans_x, trans_y = X0.copy(), disp * 2.5        # 횡파: 나아가는 방향에 수직(y)으로만 밀린다

fig, axes = plt.subplots(2, 1, figsize=(7, 4.2))
for ax, xs, ys, title, osc in [
    (axes[0], long_x, long_y, "소리 (종파): 앞뒤로 흔들린다", "h"),
    (axes[1], trans_x, trans_y, "빛 (횡파): 나아가는 방향에 수직으로 흔들린다", "v"),
]:
    for row in ([-0.35, 0, 0.35] if osc == "h" else [0]):
        ax.plot(xs, ys + row, "o", color=C[0], ms=5)
    ax.annotate("", xy=(12.6, -1.5), xytext=(9.6, -1.5),
                arrowprops=dict(arrowstyle="->", color=C[1], lw=1.6))
    ax.text(9.6, -1.3, "나아가는 방향", color=C[1], fontsize=10)
    if osc == "h":
        ax.annotate("", xy=(1.9, 0.85), xytext=(0.9, 0.85), arrowprops=dict(arrowstyle="<->", color=C[2], lw=1.6))
        ax.text(2.1, 0.85, "입자가 흔들리는 방향", color=C[2], fontsize=10, va="center")
        ax.text(long_x[np.argmin(np.diff(long_x))] + 0.2, -0.75, "빽빽한 곳", fontsize=9, ha="center")
        ax.text(long_x[np.argmax(np.diff(long_x))] + 0.2, -0.75, "성긴 곳", fontsize=9, ha="center")
    else:
        ax.annotate("", xy=(0.6, 0.95), xytext=(0.6, -0.95), arrowprops=dict(arrowstyle="<->", color=C[2], lw=1.6))
        ax.text(0.85, 0.95, "흔들리는 방향", color=C[2], fontsize=10, va="center")
    ax.set_title(title, fontsize=11, loc="left")
    ax.set_xlim(-0.3, 13)
    ax.set_ylim(-1.65, 1.2)
    ax.axis("off")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 종파는 x로만, 횡파는 y로만 움직인다
    assert np.allclose(long_y, 0) and not np.allclose(long_x, X0)
    assert np.allclose(trans_x, X0) and not np.allclose(trans_y, 0)
    # 종파에서는 입자 간격이 쉬는 간격 0.5보다 좁은 곳(빽빽)과 넓은 곳(성김)이 함께 생긴다
    gaps = np.diff(long_x)
    assert gaps.min() < 0.5 - 0.1 and gaps.max() > 0.5 + 0.1
    print("ALL CHECKS PASSED")
```
{% endraw %}
