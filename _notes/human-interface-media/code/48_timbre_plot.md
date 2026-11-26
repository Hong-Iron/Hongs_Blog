---
layout: "note"
title: "48_timbre_plot.py"
display_title: "48_timbre_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "48"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/timbre/"
parent_title: "음색"
description: "휴먼 인터페이스 미디어 · 음색 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/48_timbre_plot/"
---
{% raw %}
[음색](/Hongs_Blog/studies/human-interface-media/timbre/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 음색 문서의 그림을 만든다: 48_timbre_fig1.svg, 48_timbre_fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 48_timbre_plot.py  (matplotlib, numpy 필요)
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "48_timbre"
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


F0 = 200.0                                    # 두 소리의 기본 주파수 (Hz)
AMP_A = [1 / k for k in range(1, 11)]         # 고조파가 고르게 많은 소리
AMP_B = [1.0, 0.3, 0.1]                       # 기본음이 대부분인 소리


def power_scale(a):
    """평균 전력을 단위 사인파와 같은 1/2 로 맞추는 배율."""
    return math.sqrt(0.5 / (sum(v * v for v in a) / 2))


def wave(a, t):
    s = power_scale(a)
    return sum(s * v * np.sin(2 * np.pi * (k + 1) * F0 * t) for k, v in enumerate(a))


# 그림 1: 같은 높이(200 Hz), 같은 평균 전력, 다른 고조파 비율. 왼쪽 파형, 오른쪽 스펙트럼
t = np.linspace(0, 0.010, 2001)               # 10 ms = 두 주기
fig, axes = plt.subplots(2, 2, figsize=(7.6, 4.6), gridspec_kw={"width_ratios": [1.25, 1]})
for row, (a, c, name) in enumerate([(AMP_A, C[0], "소리 A"), (AMP_B, C[1], "소리 B")]):
    ax = axes[row, 0]
    ax.plot(t * 1000, wave(a, t), color=c, lw=1.6)
    ax.axhline(0, color=INK, lw=0.6)
    ax.set_xlim(0, 10)
    ax.set_ylim(-1.9, 1.9)
    ax.text(0.2, 1.55, name, color=c, fontsize=11)
    for x0 in (5, 10):
        ax.axvline(x0, color=INK, lw=0.6, ls=":")
    ax.set_ylabel("압력 변화")
    ax = axes[row, 1]
    s = power_scale(a)
    freqs = [(k + 1) * F0 for k in range(len(a))]
    ax.vlines(freqs, 0, [s * v for v in a], color=c, lw=3)
    ax.set_xlim(0, 2200)
    ax.set_ylim(0, 1.05)
    ax.set_xticks([200, 600, 1000, 1400, 1800])
    ax.set_ylabel("진폭")
axes[1, 0].set_xlabel("시간 (ms)")
axes[1, 1].set_xlabel("주파수 (Hz)")
axes[0, 0].text(5.1, -1.75, "한 주기 5 ms", fontsize=10)
fig.tight_layout()
save(fig, 1)

# 그림 2: 시간에 따른 변화(모형). 왼쪽은 두 포락선, 오른쪽은 튕긴 소리의 고조파별 크기
tt = np.linspace(0, 1.0, 801)


def env_pluck(x):
    """5 ms 만에 솟고 시간 상수 0.25 s 로 사라지는 포락선."""
    return np.where(x < 0.005, x / 0.005, np.exp(-(x - 0.005) / 0.25))


def env_bow(x):
    """120 ms 동안 천천히 솟고 0.6 s 까지 0.8 로 이어지다 0.08 s 시간 상수로 사라지는 포락선."""
    rise = 0.8 * 0.5 * (1 - np.cos(np.pi * np.clip(x / 0.12, 0, 1)))
    return np.where(x < 0.6, rise, 0.8 * np.exp(-(x - 0.6) / 0.08))


fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.6, 3.4))
for env, c, lab, y in [(env_pluck, C[0], "튕긴 소리", 0.93), (env_bow, C[1], "천천히 커지는 소리", 0.66)]:
    e = env(tt)
    ax1.fill_between(tt, -e, e, color=c, alpha=0.15, lw=0)
    ax1.plot(tt, e, color=c, lw=1.8)
    ax1.plot(tt, -e, color=c, lw=1.8)
ax1.text(0.03, 1.05, "튕긴 소리: 바로 솟고 곧 줄어든다", color=C[0], fontsize=10)
ax1.text(0.13, -1.02, "천천히 커지는 소리: 솟는 데 0.12초", color=C[1], fontsize=10)
ax1.axhline(0, color=INK, lw=0.6)
ax1.set_xlim(0, 1.0)
ax1.set_ylim(-1.15, 1.2)
ax1.set_xlabel("시간 (s)")
ax1.set_ylabel("진폭의 테두리")
for k, c in zip([1, 2, 4, 8], C[:4]):
    lv = 20 * np.log10(np.exp(-tt / (0.6 / k)))           # k 번째 고조파: 시간 상수 0.6/k 초
    ax2.plot(tt, lv, color=c, lw=1.8)
    t_lab = {1: 0.8, 2: 0.78, 4: 0.55, 8: 0.25}[k]              # 이름표를 둘 곡선 위 시각
    ax2.text(t_lab + 0.02, 20 * math.log10(math.exp(-t_lab / (0.6 / k))) + 1.5, f"{k}번째", color=c, fontsize=10)
ax2.text(0.25, 2.5, "높은 고조파일수록 빨리 사라진다", fontsize=10)
ax2.set_xlim(0, 1.0)
ax2.set_ylim(-45, 6)
ax2.set_xlabel("시간 (s)")
ax2.set_ylabel("처음보다 몇 dB")
fig.tight_layout()
save(fig, 2)

if __name__ == "__main__":
    s_a, s_b = power_scale(AMP_A), power_scale(AMP_B)
    assert abs(s_a - 0.8033) < 1e-3 and abs(s_b - 0.9535) < 1e-3
    tp = np.linspace(0, 1 / F0, 4000, endpoint=False)            # 한 주기의 평균 전력
    for a in (AMP_A, AMP_B):
        assert abs(np.mean(wave(a, tp) ** 2) - 0.5) < 1e-6
    assert abs(20 * math.log10(math.exp(-0.3 / 0.6)) + 4.34) < 0.01          # 기본음, 0.3초 뒤
    assert abs(20 * math.log10(math.exp(-0.3 / (0.6 / 8))) + 34.74) < 0.01   # 8번째, 0.3초 뒤
    assert abs(env_bow(np.array([0.12]))[0] - 0.8) < 1e-9 and env_pluck(np.array([0.005]))[0] == 1.0
    print("ALL CHECKS PASSED")
```
{% endraw %}
