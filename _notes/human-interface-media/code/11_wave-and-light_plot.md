---
layout: "note"
title: "11_wave-and-light_plot.py"
display_title: "11_wave-and-light_plot.py"
kind: "code"
kind_label: "코드 · 코드"
num: "11"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "컴퓨터 과학"
parent_url: "/studies/human-interface-media/wave-and-light/"
parent_title: "파동과 빛"
description: "휴먼 인터페이스 미디어 · 파동과 빛 코드 코드"
permalink: "/studies/human-interface-media/code/11_wave-and-light_plot/"
---
{% raw %}
[파동과 빛](/Hongs_Blog/studies/human-interface-media/wave-and-light/) 문서의 코드 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 파동과 빛 문서의 그림을 만든다: 11_wave-and-light_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 11_wave-and-light_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "11_wave-and-light"
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



def wave(t, A=1.0, f=1.0, phi=0.0):
    return A * np.sin(2 * np.pi * f * t + phi)


# 그림 1: 기준 파동(회색)에서 세 값 중 하나만 바꾼다
t = np.linspace(0, 2, 801)
cases = [("진폭 $A$ = 2", dict(A=2.0)), ("주파수 $f$ = 2", dict(f=2.0)), (r"위상 $\phi = \pi/2$", dict(phi=np.pi / 2))]
fig, axes = plt.subplots(1, 3, figsize=(6.5, 2.2), sharey=True)
for i, (ax, (name, kw)) in enumerate(zip(axes, cases)):
    ax.plot(t, wave(t), color=INK, lw=1.2)
    ax.plot(t, wave(t, **kw), color=C[i], lw=1.8)
    ax.axhline(0, color=INK, lw=0.5)
    ax.set_title(name, fontsize=10, color=C[i])
    ax.set_xlabel("$t$ (주기)")
    ax.set_xticks([0, 1, 2])
axes[0].set_yticks([-2, -1, 0, 1, 2])
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 위상 pi/2만큼 밀린 사인 = 코사인, 한 주기 평균 제곱 = A^2/2
    assert np.allclose(wave(t, phi=np.pi / 2), np.cos(2 * np.pi * t))
    tt = np.linspace(0, 1, 100_000, endpoint=False)
    assert abs(np.mean(wave(tt, A=2.0) ** 2) - 2.0) < 1e-9
    print("ALL CHECKS PASSED")
```
{% endraw %}
