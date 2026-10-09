---
layout: "note"
title: "20_pigeonhole_plot.py"
display_title: "20_pigeonhole_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "20"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/pigeonhole/"
parent_title: "비둘기집 원리"
description: "이산수학 · 비둘기집 원리 코드 코드"
permalink: "/studies/discrete-math/code/20_pigeonhole_plot/"
---
{% raw %}
[비둘기집 원리](/Hongs_Blog/studies/discrete-math/pigeonhole/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 비둘기집 원리 문서의 그림을 만든다: 20_pigeonhole_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 20_pigeonhole_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "20_pigeonhole"
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


def p_shared(k, days=365):
    q = 1.0
    for i in range(k):
        q *= (days - i) / days
    return 1 - q


# 그림 1: k명 중 생일이 같은 두 사람이 있을 확률 (1년 365일, 모든 날이 똑같이 나온다고 본다)
ks = np.arange(1, 81)
fig, ax = plt.subplots(figsize=(6, 3.4))
ax.plot(ks, [p_shared(k) for k in ks], color=C[0], lw=2)
ax.axhline(0.5, color=INK, lw=0.6, ls=":")
ax.plot([23], [p_shared(23)], "o", color=C[1], ms=6)
ax.annotate(f"23명: {p_shared(23):.3f}", (23, p_shared(23)), textcoords="offset points", xytext=(10, -14), fontsize=10)
ax.plot([57], [p_shared(57)], "o", color=C[2], ms=6)
ax.annotate(f"57명: {p_shared(57):.3f}", (57, p_shared(57)), textcoords="offset points", xytext=(6, -18), fontsize=10)
ax.set_xlabel("사람 수")
ax.set_ylabel("생일이 겹칠 확률")
ax.set_ylim(0, 1.05)
save(fig, 1)

if __name__ == "__main__":
    # 22명은 절반 미만, 23명은 0.507, 57명은 0.99 넘음
    assert p_shared(22) < 0.5 < p_shared(23)
    assert abs(p_shared(23) - 0.5073) < 1e-4
    assert p_shared(57) > 0.99
    assert p_shared(366) == 1.0
    print("ALL CHECKS PASSED")
```
{% endraw %}
