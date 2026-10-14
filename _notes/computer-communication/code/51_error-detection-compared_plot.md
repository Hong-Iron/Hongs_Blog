---
layout: "note"
title: "51_error-detection-compared_plot.py"
display_title: "51_error-detection-compared_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "51"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/error-detection-compared/"
parent_title: "오류 검출 방식 비교"
description: "컴퓨터 통신 · 오류 검출 방식 비교 그림 생성 코드"
sitemap: false
permalink: "/studies/computer-communication/code/51_error-detection-compared_plot/"
---
{% raw %}
[오류 검출 방식 비교](/Hongs_Blog/studies/computer-communication/error-detection-compared/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 오류 검출 방식 비교 문서의 그림을 만든다: 51_error-detection-compared_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 51_error-detection-compared_plot.py  (matplotlib, numpy 필요)
# 비트 자리는 왼쪽(가장 높은 자리)부터 0, 1, 2, … 로 센다(0-based).
import math
import os
import random
from collections import Counter
from itertools import combinations

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.colors import to_rgb
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "51_error-detection-compared"
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


# 아래 네 함수는 51_error-detection-compared_verify.py와 같은 계산이다
def bits_of(data):
    return [(b >> (7 - i)) & 1 for b in data for i in range(8)]


def two_d(data):
    rows = [sum((b >> i) & 1 for i in range(8)) % 2 for b in data]
    col = 0
    for b in data:
        col ^= b
    return rows, col


def checksum(data):
    words = [(data[i] << 8) | (data[i + 1] if i + 1 < len(data) else 0) for i in range(0, len(data), 2)]
    s = 0
    for w in words:
        s += w
        s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF


def crc16(data, poly=0x8005):
    """CRC-16 (x^16 + x^15 + x^2 + 1), 초깃값 0, 비트 순서를 뒤집지 않는다."""
    r = 0
    for b in data:
        r ^= b << 8
        for _ in range(8):
            r = ((r << 1) ^ poly) & 0xFFFF if r & 0x8000 else (r << 1) & 0xFFFF
    return r


def flip(data, positions):
    d = list(data)
    for p in positions:
        d[p // 8] ^= 1 << (7 - p % 8)
    return d


# 그림의 예: 워드 0xF0F0, 0x1234에서 4의 자리가 서로 반대로 뒤집힌다
BEFORE = [0xF0, 0xF0, 0x12, 0x34]
AFTER = [0xF0, 0xF4, 0x12, 0x30]
ERR = [a ^ b for a, b in zip(BEFORE, AFTER)]             # 뒤집힌 자리만 1인 오류 모양
ERR_POS = [k for k, b in enumerate(bits_of(ERR)) if b]
REM = crc16(ERR)                                          # 받는 쪽 나머지 = 오류 모양만으로 정해진다


def word(data, i):
    return (data[2 * i] << 8) | data[2 * i + 1]


fig, ax = plt.subplots(figsize=(6.8, 2.6))
fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
CH = 0.82


def xw(k):                                                # 16비트 줄: k = 0이 맨 왼쪽
    return k + 0.25 * (k // 4)


def row16(y, value, label, right, hi=(), notes=None, color=INK):
    ax.text(-0.4, y + CH / 2, label, ha="right", va="center", fontsize=10)
    for k in range(16):
        b = (value >> (15 - k)) & 1
        h = k in hi
        ax.add_patch(Rectangle((xw(k), y), 1, CH, facecolor=(*to_rgb(C[1]), 0.30) if h else "none",
                               edgecolor=C[1] if h else INK, lw=1.6 if h else 0.6))
        ax.text(xw(k) + 0.5, y + CH / 2, str(b), ha="center", va="center", fontsize=10,
                color=C[1] if h else color, fontweight="bold" if h else "normal")
        if notes and k in notes:
            ax.text(xw(k) + 0.5, y - 0.06, notes[k], ha="center", va="top", fontsize=8.5, color=C[1])
    ax.text(xw(15) + 1.5, y + CH / 2, right, ha="left", va="center", fontsize=9.5, color=color)


# 위: 체크섬은 16비트 워드를 세로로 맞춰 더한다
col = 15 - 2                                              # 4의 자리 = 오른쪽에서 셋째 칸
ax.text(-4.6, 13.0, "체크섬: 워드를 세로로 맞춰 더한다", ha="left", va="bottom", fontsize=10, fontweight="bold")
row16(11.4, word(AFTER, 0), "받은 워드 1", "0xF0F0 → 0xF0F4", hi=(col,), notes={col: "0→1: +4"})
row16(9.8, word(AFTER, 1), "받은 워드 2", "0x1234 → 0x1230", hi=(col,), notes={col: "1→0: -4"})
ax.text(-4.6, 8.65, "+4와 -4가 지워져 합은 0x10324 그대로, 체크섬도 0xFCDA 그대로 → 놓침",
        ha="left", va="center", fontsize=9.5, color=C[3], fontweight="bold")
ax.plot([-4.6, 27.5], [7.85, 7.85], color=INK, lw=0.5, ls=":")

# 아래: CRC는 32비트 전체를 한 줄로 보고 젯수로 나눈다
ax.text(-4.6, 7.0, "CRC-16: 32비트 전체를 한 줄로 놓고 젯수로 나눈다", ha="left", va="bottom", fontsize=10,
        fontweight="bold")
CW = 0.78


def x32(k):
    return k * CW + 0.15 * (k // 4)


y = 5.0
ax.text(-0.4, y + CH / 2, "오류 모양", ha="right", va="center", fontsize=10)
eb = bits_of(ERR)
for k in range(32):
    h = eb[k] == 1
    ax.add_patch(Rectangle((x32(k), y), CW, CH, facecolor=(*to_rgb(C[1]), 0.30) if h else "none",
                           edgecolor=C[1] if h else INK, lw=1.4 if h else 0.5))
    ax.text(x32(k) + CW / 2, y + CH / 2, str(eb[k]), ha="center", va="center", fontsize=9,
            color=C[1] if h else INK, fontweight="bold" if h else "normal")
for half, name in ((0, "워드 1 자리"), (1, "워드 2 자리")):
    a, b = x32(16 * half), x32(16 * half + 15) + CW
    ax.plot([a, a, b, b], [y + CH + 0.15, y + CH + 0.3, y + CH + 0.3, y + CH + 0.15], color=INK, lw=0.7)
    ax.text((a + b) / 2, y + CH + 0.35, name, ha="center", va="bottom", fontsize=9)
gap = ERR_POS[1] - ERR_POS[0]
ax.text(-4.6, y - 0.6, f"뒤집힌 자리만 1로 적는다(0→1이든 1→0이든 같다). 두 1은 {gap}칸 떨어져 있다.",
        ha="left", va="center", fontsize=9)
ax.text(-4.6, y - 1.45, "젯수 1 1000 0000 0000 0101 (CRC-16)로 이 모양을 XOR 나눗셈하면",
        ha="left", va="center", fontsize=9)
row16(1.85, REM, "나머지", f"0x{REM:04X}: 0이 아님 → 검출", hi=tuple(k for k in range(16) if (REM >> (15 - k)) & 1),
      color=INK)
ax.texts[-1].set_color(C[2])
ax.texts[-1].set_fontweight("bold")
ax.set_xlim(-4.7, 28.0)
ax.set_ylim(1.5, 13.9)
ax.set_aspect("equal")
ax.set_axis_off()
save(fig, 1)


def experiment():
    """51_error-detection-compared_verify.py와 같은 씨앗, 같은 순서로 오류를 만든다."""
    random.seed(51)
    n, trials = 32, 4000
    miss = {2: 0, 4: 0}
    shapes = []                                           # 4비트 놓침마다 자리 값의 변화(+2^c 또는 -2^c)
    for k in (2, 4):
        for _ in range(trials):
            data = [random.randrange(256) for _ in range(n)]
            pos = random.sample(range(8 * n), k)
            if checksum(flip(data, pos)) == checksum(data):
                miss[k] += 1
                if k == 4:
                    b = bits_of(data)
                    shapes.append(sorted((1 << (15 - p % 16)) * (1 if b[p] == 0 else -1) for p in pos))
    return miss, shapes


if __name__ == "__main__":
    # 그림의 값
    assert word(BEFORE, 0) == 0xF0F0 and word(BEFORE, 1) == 0x1234
    assert word(AFTER, 0) == 0xF0F4 and word(AFTER, 1) == 0x1230
    assert checksum(AFTER) == checksum(BEFORE) == 0xFCDA
    assert ERR_POS == [13, 29] and ERR_POS[1] - ERR_POS[0] == 16
    assert REM == 0x0048 and crc16(AFTER) ^ crc16(BEFORE) == REM and crc16(AFTER) != crc16(BEFORE)
    # 표를 읽는 예: 같은 4바이트 F0 F0 12 34에 네 방식
    d = BEFORE
    assert sum(bits_of(d)) == 13 and sum(bits_of(d)) % 2 == 1                    # 패리티 1
    rows, colb = two_d(d)
    assert rows == [0, 0, 0, 1] and colb == 0x26 and format(colb, "08b") == "00100110"
    assert sum(rows) % 2 == bin(colb).count("1") % 2 == 1                          # 모서리 비트 1
    assert len(rows) + 8 + 1 == 13                                                 # 덧붙는 비트 13개
    assert checksum(d) == 0xFCDA and crc16(d) == 0x2053
    # 32바이트(256비트)에 덧붙는 크기: 패리티 1, 2차원 32 + 8 + 1 = 41, 체크섬 16, CRC 16
    assert 32 + 8 + 1 == 41
    # 실험: 2비트 4,000번, 4비트 4,000번, 체크섬이 놓친 수 124 + 8 = 132
    miss, shapes = experiment()
    assert miss == {2: 124, 4: 8} and sum(miss.values()) == 132
    # 4비트 놓침 8번: 7번은 같은 자리 두 쌍이 서로 지움, 1번은 -1 -1 -2 +4
    def two_pairs(sh):
        a, b, c, d = sh
        return (a + b == 0 and c + d == 0) or (a + c == 0 and b + d == 0) or (a + d == 0 and b + c == 0)
    assert len(shapes) == 8 and sum(map(two_pairs, shapes)) == 7 and all(sum(sh) == 0 for sh in shapes)
    assert [-2, -1, -1, 4] in shapes
    assert round(132 / 8000 * 100, 2) == 1.65 and round(8000 / 132) == 61
    # 2비트 오류를 체크섬이 놓칠 확률: 같은 칸(15/255) × 방향이 반대(1/2) ≈ 2.9%
    p2 = 15 / 255 / 2
    assert abs(p2 - 0.0294) < 1e-4 and round(p2 * 4000) == 118
    # 2차원 패리티(32줄 × 8칸)가 무작위 4비트 오류를 놓칠 확률: 직사각형 13,888개 / C(256, 4)
    rect = math.comb(32, 2) * math.comb(8, 2)
    assert rect == 13888 and round(math.comb(256, 4) / rect) == 12586
    # CRC-16: 256비트 안의 1·2·3비트 오류는 모두 검출, 놓치는 4비트 모양은 14,995개
    R = [crc16(flip([0] * 32, [k])) for k in range(256)]
    assert 0 not in R and len(set(R)) == 256                                      # 1비트, 2비트
    idx = {v: k for k, v in enumerate(R)}
    assert not any((R[a] ^ R[b]) in idx for a, b in combinations(range(256), 2))  # 3비트
    cnt = Counter(R[a] ^ R[b] for a, b in combinations(range(256), 2))
    w4 = sum(v * (v - 1) // 2 for v in cnt.values()) // 3
    assert w4 == 14995 and round(math.comb(256, 4) / w4) == 11657
    # 4비트 오류 4,000번에서 기대 횟수: 2차원 약 0.32번, CRC-16 약 0.34번
    assert 0.3 < 4000 * rect / math.comb(256, 4) < 0.35 and 0.3 < 4000 * w4 / math.comb(256, 4) < 0.35
    # 2차원 패리티는 놓치고 CRC-16은 잡는 10비트 버스트: 이웃한 두 줄의 같은 두 칸
    random.seed(0)
    data = [random.randrange(256) for _ in range(32)]
    pos = [3 * 8 + 6, 3 * 8 + 7, 4 * 8 + 6, 4 * 8 + 7]
    assert max(pos) - min(pos) + 1 == 10
    assert two_d(flip(data, pos)) == two_d(data) and crc16(flip(data, pos)) != crc16(data)
    # CRC-16이 놓치는 오류: 젯수 모양 1 1000 0000 0000 0101 그대로 뒤집히면 나머지 0
    shape = [100 + i for i in range(17) if (0x18005 >> (16 - i)) & 1]
    assert len(shape) == 4 and crc16(flip(data, shape)) == crc16(data)
    print("ALL CHECKS PASSED")
```
{% endraw %}
