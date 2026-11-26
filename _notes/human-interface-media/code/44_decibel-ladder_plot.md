---
layout: "note"
title: "44_decibel-ladder_plot.py"
display_title: "44_decibel-ladder_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "44"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/decibel-ladder/"
parent_title: "데시벨 예제 사다리"
description: "휴먼 인터페이스 미디어 · 데시벨 예제 사다리 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/44_decibel-ladder_plot/"
---
{% raw %}
[데시벨 예제 사다리](/Hongs_Blog/studies/human-interface-media/decibel-ladder/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 데시벨 예제 사다리의 그림을 만든다: 44_decibel-ladder_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 44_decibel-ladder_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "44_decibel-ladder"
INK = "#888888"                                         # 밝은 테마와 어두운 테마 모두에서 보이는 회색
C = ["#3b82c4", "#d9622b", "#3a9a5b", "#9b59b6", "#c49a1b"]
_fonts = {f.name for f in font_manager.fontManager.ttflist}
FONT = next((n for n in ["Apple SD Gothic Neo", "NanumGothic", "Noto Sans CJK KR"] if n in _fonts), "DejaVu Sans")
plt.rcParams.update({
    "font.family": FONT, "mathtext.fontset": "dejavusans",
    "font.size": 10.5, "axes.unicode_minus": False, "svg.fonttype": "path", "svg.hashsalt": PREFIX,
    "axes.edgecolor": INK, "axes.labelcolor": INK, "xtick.color": INK, "ytick.color": INK,
    "text.color": INK, "legend.frameon": False,
    "axes.facecolor": "none", "figure.facecolor": "none", "savefig.transparent": True,
    "axes.spines.top": False, "axes.spines.right": False,
})


def save(fig, k):
    fig.savefig(os.path.join(HERE, f"{PREFIX}_fig{k}.svg"), bbox_inches="tight", metadata={"Date": None})
    plt.close(fig)


def bump(d):
    """큰 쪽보다 d dB 작은 소리를 (서로 상관없이) 더할 때 큰 쪽에 얹히는 양, dB."""
    return 10 * np.log10(1 + 10 ** (-np.asarray(d) / 10))


# 그림 1: 두 소리의 차이 d와, 합칠 때 큰 쪽에 더해지는 양
d = np.linspace(0, 20, 400)
fig, ax = plt.subplots(figsize=(6.8, 3.3))
ax.plot(d, bump(d), color=C[0], lw=2)
MARKS = (0, 6, 10)
for x in MARKS:
    y = float(bump(x))
    ax.plot(x, y, "o", color=C[1], ms=5)
    ax.plot([x, x], [0, y], color=C[1], lw=0.8, ls="--")
    ax.text(x + 0.4, y + 0.08, f"{x} dB 차이 → +{y:.2f} dB", color=C[1], fontsize=10, va="bottom")
ax.set_xlim(0, 20)
ax.set_ylim(0, 3.4)
ax.set_xticks(range(0, 21, 2))
ax.set_xlabel("두 소리의 차이 (큰 쪽 dB - 작은 쪽 dB)")
ax.set_ylabel("큰 쪽에 더해지는 양 (dB)")
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    assert abs(float(bump(0)) - 3.0103) < 1e-4
    assert abs(float(bump(6)) - 0.9732) < 1e-4
    assert abs(float(bump(10)) - 0.4139) < 1e-4
    # 직접 더한 값과 같은지
    for big, small in ((80, 74), (60, 50), (70, 70)):
        direct = 10 * math.log10(10 ** (big / 10) + 10 ** (small / 10))
        assert abs(direct - (big + float(bump(big - small)))) < 1e-9
    assert os.path.exists(os.path.join(HERE, f"{PREFIX}_fig1.svg"))
    print("ALL CHECKS PASSED")
```
{% endraw %}
