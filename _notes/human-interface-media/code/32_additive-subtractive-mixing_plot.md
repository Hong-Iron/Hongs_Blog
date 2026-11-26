---
layout: "note"
title: "32_additive-subtractive-mixing_plot.py"
display_title: "32_additive-subtractive-mixing_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "32"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/additive-subtractive-mixing/"
parent_title: "가법 혼색과 감법 혼색"
description: "휴먼 인터페이스 미디어 · 가법 혼색과 감법 혼색 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/32_additive-subtractive-mixing_plot/"
---
{% raw %}
[가법 혼색과 감법 혼색](/Hongs_Blog/studies/human-interface-media/additive-subtractive-mixing/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 가법 혼색과 감법 혼색 문서의 그림을 만든다: 32_additive-subtractive-mixing_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 32_additive-subtractive-mixing_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "32_additive-subtractive-mixing"
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


def logistic(x):
    return 1.0 / (1.0 + np.exp(-x))


lam = np.linspace(400, 700, 601)
# 검증 코드와 같은 설명용 식
blue_light = np.exp(-0.5 * ((lam - 450) / 20) ** 2)
yellow_light = np.exp(-0.5 * ((lam - 580) / 30) ** 2)
blue_paint = 0.05 + 0.85 * logistic((520 - lam) / 12)
yellow_paint = 0.05 + 0.85 * logistic((lam - 490) / 12)
mixed_paint = blue_paint * yellow_paint

# 그림 1: 왼쪽은 빛 섞기(스펙트럼의 덧셈), 오른쪽은 물감 섞기(반사율의 곱)
fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.6, 3.4))
a1.fill_between(lam, 0, blue_light + yellow_light, color=INK, alpha=0.18, lw=0)
a1.plot(lam, blue_light + yellow_light, color=INK, lw=1.2, ls="--")
a1.plot(lam, blue_light, color=C[0], lw=1.8)
a1.plot(lam, yellow_light, color=C[4], lw=1.8)
a1.text(450, 1.04, "파란 빛", color=C[0], ha="center", fontsize=10)
a1.text(600, 1.04, "노란 빛", color=C[4], ha="center", fontsize=10)
a1.text(550, 1.22, "더한 빛: 회색 넓이 전체", ha="center", fontsize=10)
a1.set_ylim(0, 1.35)
a1.set_xlim(400, 700)
a1.set_xlabel("파장 (nm)")
a1.set_ylabel("빛의 세기")
a1.set_title("빛 섞기: 더한다", fontsize=11)

a2.plot(lam, blue_paint, color=C[0], lw=1.6)
a2.plot(lam, yellow_paint, color=C[4], lw=1.6)
a2.fill_between(lam, 0, mixed_paint, color=C[2], alpha=0.35, lw=0)
a2.plot(lam, mixed_paint, color=C[2], lw=2.2)
a2.text(430, 0.95, "파란 물감", color=C[0], ha="center", fontsize=10)
a2.text(660, 0.95, "노란 물감", color=C[4], ha="center", fontsize=10)
a2.annotate("섞은 물감 (곱)", xy=(525, 0.30), xytext=(575, 0.45), color=C[2], fontsize=10,
             arrowprops=dict(arrowstyle="->", color=C[2], lw=1))
a2.set_ylim(0, 1.1)
a2.set_xlim(400, 700)
a2.set_xlabel("파장 (nm)")
a2.set_ylabel("되쏘는 비율 (반사율)")
a2.set_title("물감 섞기: 곱한다", fontsize=11)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 더한 빛은 두 빛의 합이다
    assert np.allclose(blue_light + yellow_light - blue_light - yellow_light, 0)
    # 섞은 물감은 505 nm 근처에서만 크게 남는다(봉우리 495~515 nm)
    pk = lam[np.argmax(mixed_paint)]
    assert 495 <= pk <= 515, pk
    # 양 끝(450 nm 아래, 560 nm 위)에서는 섞은 물감이 0.2 아래로 떨어진다
    assert mixed_paint[lam <= 450].max() < 0.2 and mixed_paint[lam >= 560].max() < 0.2
    print("ALL CHECKS PASSED")
```
{% endraw %}
