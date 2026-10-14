---
layout: "note"
title: "49_internet-checksum_plot.py"
display_title: "49_internet-checksum_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "49"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/internet-checksum/"
parent_title: "인터넷 체크섬"
description: "컴퓨터 통신 · 인터넷 체크섬 그림 생성 코드"
permalink: "/studies/computer-communication/code/49_internet-checksum_plot/"
---
{% raw %}
[인터넷 체크섬](/Hongs_Blog/studies/computer-communication/internet-checksum/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 인터넷 체크섬 문서의 그림을 만든다: 49_internet-checksum_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 49_internet-checksum_plot.py  (matplotlib, numpy 필요)
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.colors import to_rgb
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "49_internet-checksum"
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


def cksum(words):
    """슬라이드 50의 C 코드를 그대로 옮긴 것."""
    s = 0
    for w in words:
        s += w
        if s & 0xFFFF0000:                     # 자리올림이 생기면 맨 아래로 되돌려 더한다
            s &= 0xFFFF
            s += 1
    return ~s & 0xFFFF


def ones_sum(words, width=16):
    """width비트 1의 보수 덧셈: 넘친 자리올림을 맨 아래에 다시 더한다."""
    mask = (1 << width) - 1
    s = 0
    for w in words:
        s += w
        s = (s & mask) + (s >> width)
    return s


def plain_sum(words):
    """자리올림을 버리는 보통의 16비트 덧셈."""
    return sum(words) & 0xFFFF


W1, W2 = 0xF0F0, 0x1234                       # 본문 예시 (카드 C2의 0x8000, 0x8001과 다른 값)
RAW = W1 + W2                                 # 17비트로 넘친 합
FOLD = (RAW & 0xFFFF) + (RAW >> 16)           # 넘친 1을 맨 아래에 더한 값
CK = ~FOLD & 0xFFFF                           # 체크섬
RECV = ones_sum([W1, W2, CK])                 # 받는 쪽 합


def bits(v, n=16):
    return format(v, f"0{n}b")


# 그림 1: 16비트 세로셈, 넘친 17번째 비트, 맨 아래로 되돌리기, 뒤집기, 받는 쪽 합
fig, ax = plt.subplots(figsize=(6.8, 4.3))
fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
CH = 0.82


def x_of(k):
    """k = 0이 맨 아래(가장 오른쪽) 비트, k = 16이 넘친 자리. 4비트마다 틈을 둔다."""
    col = 16 - k                               # 0이 맨 왼쪽(넘친 자리)
    return col + 0.25 * ((col + 3) // 4)


def draw(y, value, n, label, right, color=INK, hi=(), face=None, bold=False):
    s = bits(value, n)
    ax.text(-0.4, y + CH / 2, label, ha="right", va="center", fontsize=10)
    for idx, b in enumerate(s):
        k = n - 1 - idx
        fc = face if face else "none"
        ec = INK
        if k in hi:
            fc, ec = (*to_rgb(C[1]), 0.30), C[1]
        ax.add_patch(Rectangle((x_of(k), y), 1, CH, facecolor=fc, edgecolor=ec, lw=1.6 if k in hi else 0.6))
        ax.text(x_of(k) + 0.5, y + CH / 2, b, ha="center", va="center", fontsize=10,
                color=C[1] if k in hi else color, fontweight="bold" if (bold or k in hi) else "normal")
    ax.text(x_of(0) + 1.4, y + CH / 2, right, ha="left", va="center", fontsize=9.5, color=color)


Y = [10.0, 9.0, 7.6, 6.2, 5.0, 2.65, 1.65]
ax.text(x_of(0) + 1.4, Y[0] + CH + 0.3, "16진수", ha="left", va="bottom", fontsize=9)
ax.text(-4.4, Y[0] + CH + 0.3, "보내는 쪽", ha="left", va="bottom", fontsize=10, fontweight="bold")
draw(Y[0], W1, 16, "워드 1", "0xF0F0")
draw(Y[1], W2, 16, "+ 워드 2", "0x1234")
ax.plot([x_of(15) - 0.1, x_of(0) + 1.1], [Y[1] - 0.25, Y[1] - 0.25], color=INK, lw=0.9)
draw(Y[2], RAW, 17, "더한 값", "0x10324 (17비트로 넘침)", hi=(16,))
# 넘친 1을 맨 아래로: 넘침 칸 아래 → 줄 사이 틈을 따라 오른쪽 → 맨 아래 칸으로
gap_y = Y[2] - 0.29
ax.plot([x_of(16) + 0.5, x_of(16) + 0.5, x_of(0) + 0.5], [Y[2], gap_y, gap_y], color=C[1], lw=1.3)
ax.annotate("", (x_of(0) + 0.5, Y[3] + CH), xytext=(x_of(0) + 0.5, gap_y - 0.01),
            arrowprops=dict(arrowstyle="->", color=C[1], lw=1.3))
draw(Y[3], FOLD, 16, "접은 합", "0x0325 (넘친 1을 맨 아래에 더함)", hi=(0,))
draw(Y[4], CK, 16, "체크섬", "0xFCDA (모든 비트를 뒤집음)", color=C[0], face=(*to_rgb(C[0]), 0.15), bold=True)
ax.plot([-4.4, x_of(0) + 9.5], [4.55, 4.55], color=INK, lw=0.5, ls=":")
ax.text(-4.4, 4.4, "받는 쪽", ha="left", va="top", fontsize=10, fontweight="bold")
draw(Y[5], FOLD, 16, "워드 1 + 워드 2", "0x0325 (보내는 쪽과 같다)")
draw(Y[6], CK, 16, "+ 체크섬", "0xFCDA", color=C[0], face=(*to_rgb(C[0]), 0.15), bold=True)
ax.plot([x_of(15) - 0.1, x_of(0) + 1.1], [Y[6] - 0.25, Y[6] - 0.25], color=INK, lw=0.9)
draw(Y[6] - 1.2, RECV, 16, "받는 쪽 합", "0xFFFF: 모두 1 → 오류 없음", color=C[2], bold=True)
ax.set_xlim(-4.5, 25.5)
ax.set_ylim(Y[6] - 1.6, Y[0] + CH + 0.9)
ax.set_aspect("equal")
ax.set_axis_off()
save(fig, 1)

if __name__ == "__main__":
    # 본문 예시: 0xF0F0 + 0x1234
    assert RAW == 0x10324 and RAW >> 16 == 1
    assert FOLD == 0x0325 and CK == 0xFCDA and cksum([W1, W2]) == 0xFCDA
    assert RECV == 0xFFFF and ones_sum([W1, W2]) == FOLD
    assert bits(W1) == "1111000011110000" and bits(W2) == "0001001000110100"
    assert bits(FOLD) == "0000001100100101" and bits(CK) == "1111110011011010"
    # 접은 합과 체크섬은 자리마다 1이 꼭 하나 → 자리올림 없이 모두 1
    assert all(a != b for a, b in zip(bits(FOLD), bits(CK)))
    # 카드 C2(0x8000, 0x8001)는 그림에 쓰지 않는다
    assert (W1, W2) != (0x8000, 0x8001)
    # 4비트 작은 예: 0101을 뒤집으면 1010, 1011 + 0110 = 10001 → 0001 + 1 = 0010 → 체크섬 1101
    assert ~0b0101 & 0xF == 0b1010
    assert 0b1011 + 0b0110 == 0b10001 and ones_sum([0b1011, 0b0110], 4) == 0b0010
    assert ~ones_sum([0b1011, 0b0110], 4) & 0xF == 0b1101
    assert ones_sum([0b1011, 0b0110, 0b1101], 4) == 0b1111
    # 어떤 x든 x + ~x는 모두 1 (4비트 전수)
    assert all(x + (~x & 0xF) == 0xF for x in range(16))
    # 넘친 1을 맨 아래로 더하는 것은 65535로 나눈 나머지를 지키는 것: 4비트면 15
    assert all(ones_sum([a, b], 4) % 15 == (a + b) % 15 for a in range(16) for b in range(16))
    # 더하는 순서는 결과를 바꾸지 않는다
    assert ones_sum([W2, CK, W1]) == ones_sum([CK, W1, W2]) == 0xFFFF
    # 흔한 실수: 보내는 쪽이 자리올림을 버리면 0x0324 → 체크섬 0xFCDB, 표준대로 더하는 받는 쪽은 0x0001
    bad_ck = ~plain_sum([W1, W2]) & 0xFFFF
    assert plain_sum([W1, W2]) == 0x0324 and bad_ck == 0xFCDB
    assert ones_sum([W1, W2, bad_ck]) == 0x0001
    # 자리올림을 버리면 맨 윗자리 두 비트가 함께 0→1로 뒤집힌 오류도 놓친다
    assert plain_sum([0x8000, 0x8000]) == plain_sum([0x0000, 0x0000])
    assert ones_sum([0x8000, 0x8000]) == 0x0001 != ones_sum([0x0000, 0x0000])
    # 비트 하나가 뒤집히면 합은 2^k만큼 변하고, 2^k는 65535의 배수가 아니다 → 받는 쪽 합은 0xFFFF가 아니다
    for k in range(16):
        assert (1 << k) % 65535 != 0
        assert ones_sum([W1 ^ (1 << k), W2, CK]) != 0xFFFF and ones_sum([W1, W2 ^ (1 << k), CK]) != 0xFFFF
    # 약점 1: 워드 순서가 바뀌어도 합이 같다
    assert cksum([W2, W1]) == cksum([W1, W2])
    # 약점 2: 같은 자리(4의 자리)에서 0xF0F0은 0→1(+4), 0x1234는 1→0(-4)
    assert (W1 >> 2) & 1 == 0 and (W2 >> 2) & 1 == 1
    assert cksum([0xF0F4, 0x1230]) == cksum([W1, W2])
    print("ALL CHECKS PASSED")
```
{% endraw %}
