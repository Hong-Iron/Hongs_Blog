---
layout: "note"
title: "47_error-detecting-code_plot.py"
display_title: "47_error-detecting-code_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "47"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/error-detecting-code/"
parent_title: "오류 검출 코드"
description: "컴퓨터 통신 · 오류 검출 코드 그림 생성 코드"
sitemap: false
permalink: "/studies/computer-communication/code/47_error-detecting-code_plot/"
---
{% raw %}
[오류 검출 코드](/Hongs_Blog/studies/computer-communication/error-detecting-code/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 오류 검출 코드 문서의 그림을 만든다: 47_error-detecting-code_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 47_error-detecting-code_plot.py  (matplotlib, numpy 필요)
# 비트 자리 번호는 왼쪽부터 0, 1, 2, … (0-based). 문서 본문은 사람이 세는 대로 첫째, 둘째, …로 쓴다.
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "47_error-detecting-code"
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


DATA = "1011001"


def even_parity(bits):
    """1의 개수를 짝수로 맞추는 비트: 1이 홀수 개면 1, 짝수 개면 0."""
    return str(bits.count("1") % 2)


SENT = DATA + even_parity(DATA)
FLIPS = [(4,), (2, 5), (1, 3, 6)]       # 1·2·3비트 오류. 카드 C3의 답(첫 두 비트)은 피한다


def flip(bits, positions):
    out = list(bits)
    for p in positions:
        out[p] = "1" if out[p] == "0" else "0"
    return "".join(out)


def verdict(bits):
    return "검출" if bits.count("1") % 2 else "놓침"


RECEIVED = [flip(SENT, f) for f in FLIPS]

# 그림 1: 짝수 패리티 붙이기와 1·2·3비트 오류
fig, ax = plt.subplots(figsize=(6.8, 2.7))
fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
ax.set_axis_off()
CW, CH = 1.0, 0.78                       # 칸 너비와 높이


def draw_row(y, bits, label, flipped=(), parity_col=None):
    ax.text(-0.35, y + CH / 2, label, ha="right", va="center", fontsize=10)
    for k, b in enumerate(bits):
        x = k * CW + (0.25 if k == 7 else 0)            # 패리티 칸은 살짝 띄운다
        face = "none"
        if k == parity_col:
            face = (*matplotlib.colors.to_rgb(C[0]), 0.18)
        if k in flipped:
            face = (*matplotlib.colors.to_rgb(C[1]), 0.28)
        ax.add_patch(Rectangle((x, y), CW, CH, facecolor=face,
                               edgecolor=C[1] if k in flipped else INK, lw=1.6 if k in flipped else 0.8))
        ax.text(x + CW / 2, y + CH / 2, b, ha="center", va="center", fontsize=11,
                color=C[1] if k in flipped else INK, fontweight="bold" if k in flipped else "normal")


rows_y = [6.2, 4.7, 2.75, 1.4, 0.05]
# 위: 데이터와 보낸 열
draw_row(rows_y[0], DATA, "데이터")
ax.text(9.0, rows_y[0] + CH / 2, f"1이 {DATA.count('1')}개(짝수) → 패리티 {even_parity(DATA)}",
        va="center", fontsize=10)
draw_row(rows_y[1], SENT, "보낸 8비트", parity_col=7)
ax.text(9.0, rows_y[1] + CH / 2, f"1이 {SENT.count('1')}개(짝수)", va="center", fontsize=10)
ax.text(7.25 + CW / 2, rows_y[1] + CH + 0.1, "패리티 비트", ha="center", va="bottom", fontsize=9, color=C[0])
ax.plot([-3.3, 16.2], [4.15, 4.15], color=INK, lw=0.5, ls=":")
ax.text(-3.3, 4.0, "받은 8비트 (주황 칸이 도중에 뒤집힌 비트)", ha="left", va="top", fontsize=9)

# 아래: 뒤집힌 수에 따라
names = ["1비트 뒤집힘", "2비트 뒤집힘", "3비트 뒤집힘"]
for y, f, r, name in zip(rows_y[2:], FLIPS, RECEIVED, names):
    draw_row(y, r, name, flipped=f, parity_col=7)
    steps = []
    for p in f:
        delta = "+1" if SENT[p] == "0" else "-1"
        steps.append(delta)
        ax.text(p * CW + CW / 2 + (0.25 if p == 7 else 0), y - 0.05, delta, ha="center", va="top",
                fontsize=8, color=C[1])
    cnt = r.count("1")
    odd = cnt % 2 == 1
    ax.text(9.0, y + CH / 2, f"4 {' '.join(steps)} = {cnt}개({'홀수' if odd else '짝수'})",
            va="center", fontsize=10)
    v = verdict(r)
    ax.text(15.0, y + CH / 2, v, va="center", ha="left", fontsize=11, fontweight="bold",
            color=C[2] if v == "검출" else C[3])
ax.set_xlim(-3.4, 16.3)
ax.set_ylim(-0.55, 7.1)
ax.set_aspect("equal")
save(fig, 1)

if __name__ == "__main__":
    # 문서 본문의 값
    assert DATA.count("1") == 4 and even_parity(DATA) == "0" and SENT == "10110010"
    # XOR로 보면 패리티는 모든 비트의 XOR
    x = 0
    for b in DATA:
        x ^= int(b)
    assert str(x) == even_parity(DATA)
    # 홀수 개 1인 예: 1011000 → 패리티 1 → 10110001
    assert even_parity("1011000") == "1" and ("1011000" + even_parity("1011000")).count("1") == 4
    # 그림의 받은 열과 판정
    assert RECEIVED == ["10111010", "10010110", "11100000"]
    assert [r.count("1") for r in RECEIVED] == [5, 4, 3]
    assert [verdict(r) for r in RECEIVED] == ["검출", "놓침", "검출"]
    assert FLIPS[1] != (0, 1)                             # 카드 C3의 답과 다른 자리
    # 뒤집을 때마다 1의 개수는 정확히 1만큼 변한다 → k번 뒤집으면 짝홀이 k번 바뀐다
    for f, r in zip(FLIPS, RECEIVED):
        assert (r.count("1") - SENT.count("1")) % 2 == len(f) % 2
    # 7비트 데이터마다 1비트를 붙이면 보내는 비트의 1/8 = 12.5%가 패리티
    assert 1 / 8 == 0.125
    # CRC-32를 1500바이트 프레임에 붙이면 32 / 12000 ≈ 0.27%
    assert round(32 / (1500 * 8) * 100, 2) == 0.27
    # 비둘기집: 7비트 데이터 128가지가 패리티 값 2가지를 나눠 가진다 → 64가지씩
    groups = {}
    for v in range(128):
        d = format(v, "07b")
        groups.setdefault(even_parity(d), []).append(d)
    assert sorted(len(g) for g in groups.values()) == [64, 64]
    # 10진 비유(슬라이드 p.52): 젯수 11, 331 → 3311, 2211은 놓침
    assert 3311 % 11 == 0 and 3310 % 11 != 0 and 2311 % 11 != 0 and 2211 % 11 == 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
