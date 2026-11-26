---
layout: "note"
title: "54_temporal-masking_plot.py"
display_title: "54_temporal-masking_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "54"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/temporal-masking/"
parent_title: "시간 가림"
description: "휴먼 인터페이스 미디어 · 시간 가림 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/54_temporal-masking_plot/"
---
{% raw %}
[시간 가림](/Hongs_Blog/studies/human-interface-media/temporal-masking/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 시간 가림 문서의 그림을 만든다: 54_temporal-masking_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 54_temporal-masking_plot.py  (matplotlib, numpy 필요)
# 모양만 보이는 모식도다. 수치는 51~55 문서 공통 모형에서 가져온다.
#   가리는 소리: 1 kHz, 60 dB, 0~200 ms 동안 켜짐
#   동시 가림 문턱(1 kHz 시험 음) M0 = 60 - 10 + SF(0) = 50 dB,  조용할 때의 문턱 Tq(1 kHz) = 3.37 dB
#   앞 가림: 켜지기 20 ms 전부터 오른다  T = Tq + (M0 - Tq)(1 + t/20)^2,          -20 <= t < 0
#   뒤 가림: 꺼진 뒤 150 ms 동안 내려간다 T = Tq + (M0 - Tq)(1 - ln(1 + d/5)/ln(31)),  d = t - 200, 0 <= d <= 150
#   (뒤 가림이 지연 시간의 로그에 거의 비례해 줄어든다는 것은 Jesteadt 등 1982의 관찰을 따른 모양이다)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "54_temporal-masking"
INK = "#888888"
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


# ---- 51~55 공통 식 ----
OFFSET = 10.0


def tq(f):
    k = f / 1000.0
    return 3.64 * k ** -0.8 - 6.5 * math.exp(-0.6 * (k - 3.3) ** 2) + 1e-3 * k ** 4


def spread(dz):
    u = dz + 0.474
    return 15.81 + 7.5 * u - 17.5 * math.sqrt(1.0 + u * u)


TQ = tq(1000.0)
M0 = 60.0 - OFFSET + spread(0.0)
ON, OFF, PRE, POST, TAU = 0.0, 200.0, 20.0, 150.0, 5.0


def threshold(t):
    """1 kHz 시험 음이 들리기 시작하는 레벨 (dB), 시각 t (ms)."""
    if -PRE <= t < ON:
        return TQ + (M0 - TQ) * (1 + t / PRE) ** 2
    if ON <= t <= OFF:
        return M0
    if OFF < t <= OFF + POST:
        d = t - OFF
        return TQ + (M0 - TQ) * (1 - math.log(1 + d / TAU) / math.log(1 + POST / TAU))
    return TQ


def heard_after_off(L):
    """끝난 뒤 몇 ms부터 L dB 시험 음이 들리는가."""
    frac = (L - TQ) / (M0 - TQ)
    return TAU * (math.exp((1 - frac) * math.log(1 + POST / TAU)) - 1)


def heard_until_before_on(L):
    """켜지기 몇 ms 전까지 L dB 시험 음이 들리는가 (그 뒤로는 가려짐)."""
    frac = (L - TQ) / (M0 - TQ)
    return PRE * (1 - math.sqrt(frac))


t = np.linspace(-60, 420, 4801)
y = np.array([threshold(v) for v in t])
TEST = 30.0
fig, ax = plt.subplots(figsize=(7.2, 3.8))
ax.axvspan(ON, OFF, color=C[1], alpha=0.10)
ax.text(100, 60, "가리는 소리 켜짐\n(1 kHz, 60 dB)", color=C[1], fontsize=9.5, ha="center", va="top")
ax.plot(t, y, color=C[1], lw=2)
ax.axhline(TQ, color=C[0], lw=1, ls="--")
ax.text(-58, TQ - 1.2, "조용할 때의 문턱", color=C[0], fontsize=9.5, va="top")
ax.axhline(TEST, color=C[2], lw=1.2, ls=":")
ax.text(345, TEST + 1.5, "30 dB 시험 음", color=C[2], fontsize=9.5)
d_on = heard_until_before_on(TEST)
d_off = heard_after_off(TEST)
for x in (-d_on, OFF + d_off):
    ax.plot([x], [TEST], marker="o", color=C[2], ms=6)
ax.annotate(f"꺼지고 약 {d_off:.0f} ms 뒤부터 들림", xy=(OFF + d_off, TEST), xytext=(250, 42), fontsize=9.5,
            arrowprops=dict(arrowstyle="->", color=INK, lw=0.8))
for x0, x1, lab in ((-PRE, ON, "앞 가림\n약 20 ms"), (ON, OFF, "동시 가림"), (OFF, OFF + POST, "뒤 가림 약 150 ms")):
    ax.annotate("", xy=(x0, -6), xytext=(x1, -6), arrowprops=dict(arrowstyle="<->", color=INK, lw=0.8))
    ax.text((x0 + x1) / 2, -9, lab, fontsize=9.5, ha="center", va="top")
ax.set_xlim(-60, 420)
ax.set_ylim(-20, 62)
ax.set_yticks([0, 10, 20, 30, 40, 50, 60])
ax.set_xlabel("시간 (ms, 가리는 소리가 켜진 순간이 0)")
ax.set_ylabel("들리기 시작하는 레벨 (dB)")
save(fig, 1)

if __name__ == "__main__":
    assert abs(TQ - 3.37) < 0.01 and abs(M0 - 50.0) < 0.01
    # 곡선이 이어져 있다 (켜질 때, 꺼질 때, 뒤 가림 끝)
    assert abs(threshold(-1e-9) - M0) < 1e-3 and abs(threshold(OFF + 1e-9) - M0) < 1e-3
    assert abs(threshold(OFF + POST) - TQ) < 1e-9 and abs(threshold(-PRE) - TQ) < 1e-9
    # 뒤 가림은 처음에 빨리, 나중에 천천히 줄어든다: 처음 10 ms에 약 32 %, 30 ms에 약 57 %
    assert abs((M0 - threshold(OFF + 10)) / (M0 - TQ) - 0.32) < 0.005
    assert abs((M0 - threshold(OFF + 30)) / (M0 - TQ) - 0.567) < 0.005
    # 30 dB 시험 음: 꺼지고 약 17 ms 뒤, 켜지기 약 5 ms 전까지 들림
    assert abs(heard_after_off(30) - 16.8) < 0.1 and abs(heard_until_before_on(30) - 4.9) < 0.1
    # 시험 음이 클수록 빨리 들린다 (40 dB 약 5 ms, 20 dB 약 40 ms)
    assert abs(heard_after_off(40) - 5.4) < 0.1 and abs(heard_after_off(20) - 40.5) < 0.1
    times = [heard_after_off(L) for L in range(5, 50)]
    assert all(a > b for a, b in zip(times, times[1:]))
    print("ALL CHECKS PASSED")
```
{% endraw %}
