---
layout: "note"
title: "60_four-fourier-representations_plot.py"
display_title: "60_four-fourier-representations_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "60"
course: "휴먼 인터페이스 미디어"
course_slug: "human-interface-media"
course_url: "/studies/human-interface-media/"
track: "사람과 심리"
parent_url: "/studies/human-interface-media/four-fourier-representations/"
parent_title: "푸리에 표현 네 가지 비교"
description: "휴먼 인터페이스 미디어 · 푸리에 표현 네 가지 비교 그림 생성 코드"
sitemap: false
permalink: "/studies/human-interface-media/code/60_four-fourier-representations_plot/"
---
{% raw %}
[푸리에 표현 네 가지 비교](/Hongs_Blog/studies/human-interface-media/four-fourier-representations/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 푸리에 표현 네 가지 비교 문서의 그림을 만든다: 60_four-fourier-representations_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 60_four-fourier-representations_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "60_four-fourier-representations"
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


def pulse_ft(w, T1=1.0):
    w = np.asarray(w, dtype=float)
    out = np.full_like(w, 2 * T1)
    ok = np.abs(w) > 1e-12
    out[ok] = 2 * np.sin(w[ok] * T1) / w[ok]
    return out


def rect_dtft(w, N1=2):
    w = np.asarray(w, dtype=float)
    s = np.sin(w / 2)
    out = np.full_like(w, 2 * N1 + 1.0)
    ok = np.abs(s) > 1e-12
    out[ok] = np.sin(w[ok] * (N1 + 0.5)) / s[ok]
    return out


def stem(ax, x, y, col, ms=3.5, lw=1.4):
    ml, sl, bl = ax.stem(x, y, basefmt=" ")
    plt.setp(sl, color=col, lw=lw)
    plt.setp(ml, color=col, ms=ms)


T, T1, N, N1 = 4.0, 1.0, 10, 2
w0 = 2 * np.pi / T
fig, axes = plt.subplots(4, 2, figsize=(7.4, 9.0), gridspec_kw={"width_ratios": [1, 1.25]})
titles_t = ["연속·주기 (푸리에 급수)", "연속·비주기 (푸리에 변환)",
            "이산·주기 (이산 시간 푸리에 급수)", "이산·비주기 (이산 시간 푸리에 변환)"]
titles_f = ["띄엄띄엄, 되풀이 없음", "이어짐, 되풀이 없음", "띄엄띄엄, 2π마다 되풀이", "이어짐, 2π마다 되풀이"]

# 1행: 주기 사각파와 계수 a_k (w = k w0)
t = np.linspace(-7, 7, 2801)
sq = np.where(np.abs(((t + T / 2) % T) - T / 2) < T1, 1.0, 0.0)
axes[0, 0].plot(t, sq, color=C[0], lw=1.6)
k = np.arange(-12, 13)
wk = k * w0
axes[0, 1].plot(np.linspace(-19.5, 19.5, 1201), pulse_ft(np.linspace(-19.5, 19.5, 1201)) / T, color=INK, lw=1, ls="--")
stem(axes[0, 1], wk, pulse_ft(wk) / T, C[0])

# 2행: 펄스 하나와 이어진 스펙트럼
pulse = np.where(np.abs(t) < T1, 1.0, 0.0)
axes[1, 0].plot(t, pulse, color=C[1], lw=1.6)
ww = np.linspace(-19.5, 19.5, 2001)
axes[1, 1].plot(ww, pulse_ft(ww), color=C[1], lw=1.6)

# 3행: 주기 10 수열과 계수 a_k (w = 2 pi k / N)
n = np.arange(-15, 16)
xp = np.where(((n + N1) % N) <= 2 * N1, 1.0, 0.0)
stem(axes[2, 0], n, xp, C[2])
kk = np.arange(-15, 16)
wd = np.linspace(-3 * np.pi, 3 * np.pi, 2001)
axes[2, 1].plot(wd, rect_dtft(wd) / N, color=INK, lw=1, ls="--")
stem(axes[2, 1], 2 * np.pi * kk / N, rect_dtft(2 * np.pi * kk / N) / N, C[2])

# 4행: 1이 5개인 수열 하나와 이어진 주기 스펙트럼
xs = np.where(np.abs(n) <= N1, 1.0, 0.0)
stem(axes[3, 0], n, xs, C[3])
axes[3, 1].plot(wd, rect_dtft(wd), color=C[3], lw=1.6)

for r in range(4):
    a0, a1 = axes[r, 0], axes[r, 1]
    a0.set_title(titles_t[r], fontsize=10.5)
    a1.set_title(titles_f[r], fontsize=10.5)
    for a in (a0, a1):
        a.axhline(0, color=INK, lw=0.6)
    a0.set_xlabel("$t$" if r < 2 else "$n$")
    a1.set_xlabel(r"$\omega$")
    if r >= 2:
        a1.set_xticks([-2 * np.pi, 0, 2 * np.pi], ["-2π", "0", "2π"])
        a1.axvspan(-np.pi, np.pi, color=INK, alpha=0.08, lw=0)
    a0.set_ylim(-0.15, 1.3)
axes[0, 1].set_ylim(-0.2, 0.6)
axes[1, 1].set_ylim(-0.6, 2.3)
axes[2, 1].set_ylim(-0.2, 0.6)
axes[3, 1].set_ylim(-1.8, 5.6)
fig.tight_layout()
save(fig, 1)

if __name__ == "__main__":
    # 그림에 쓴 값 확인
    a_sq = np.array([np.trapezoid(np.exp(-1j * kk_ * w0 * np.linspace(-T1, T1, 20001)), np.linspace(-T1, T1, 20001)) / T
                     for kk_ in k])
    assert np.allclose(a_sq, pulse_ft(wk) / T, atol=1e-8)                   # 1행: a_k = X(j k w0)/T
    a_d = np.fft.fft(xp[(n >= 0) & (n < N)]) / N                             # 3행: 한 주기 n = 0..9
    assert np.allclose(a_d, rect_dtft(2 * np.pi * np.arange(N) / N) / N, atol=1e-12)
    assert np.allclose(rect_dtft(wd + 2 * np.pi), rect_dtft(wd))             # 4행: 주기 2pi
    assert abs(pulse_ft(np.array([0.0]))[0] - 2) < 1e-12 and abs(rect_dtft(np.array([0.0]))[0] - 5) < 1e-12
    print("ALL CHECKS PASSED")
```
{% endraw %}
