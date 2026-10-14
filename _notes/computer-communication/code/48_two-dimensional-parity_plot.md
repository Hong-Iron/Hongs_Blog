---
layout: "note"
title: "48_two-dimensional-parity_plot.py"
display_title: "48_two-dimensional-parity_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "48"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/two-dimensional-parity/"
parent_title: "2차원 패리티"
description: "컴퓨터 통신 · 2차원 패리티 그림 생성 코드"
permalink: "/studies/computer-communication/code/48_two-dimensional-parity_plot/"
---
{% raw %}
[2차원 패리티](/Hongs_Blog/studies/computer-communication/two-dimensional-parity/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 2차원 패리티 문서의 그림을 만든다: 48_two-dimensional-parity_fig1.svg ~ fig3.svg
# 실행: ~/.venvs/vault-plots/bin/python 48_two-dimensional-parity_plot.py  (matplotlib, numpy 필요)
# 줄(행)과 칸(열) 번호는 코드에서 0부터 센다. 문서 본문은 사람이 세는 대로 첫째, 둘째, …로 쓴다.
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.colors import to_rgb
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "48_two-dimensional-parity"
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


# 슬라이드 49의 데이터 6바이트(7비트씩), 슬라이드에 적힌 위에서 아래 순서 그대로
ROWS = ["0101001", "1101001", "1011110", "0001110", "0110100", "1011111"]


def encode(rows):
    m = [[int(c) for c in r] for r in rows]
    m = [r + [sum(r) % 2] for r in m]                    # 가로 패리티: 줄마다 1의 개수를 짝수로
    m.append([sum(col) % 2 for col in zip(*m)])          # 세로 패리티 바이트(마지막 칸이 모서리 비트)
    return m


def check(m):
    bad_rows = [i for i, r in enumerate(m) if sum(r) % 2]
    bad_cols = [j for j, c in enumerate(zip(*m)) if sum(c) % 2]
    return bad_rows, bad_cols


def flipped(m, cells):
    r = [row[:] for row in m]
    for i, j in cells:
        r[i][j] ^= 1
    return r


M = encode(ROWS)
NR, NC = len(M), len(M[0])                               # 7줄, 8칸 (패리티 포함)
ERR1 = [(4, 0)]                                          # 그림 2: 다섯째 줄 첫째 비트 (카드 C2와 다른 자리)
ERR2 = [(1, 2), (1, 5)]                                  # 그림 3: 같은 줄의 두 비트
M1, M2 = flipped(M, ERR1), flipped(M, ERR2)
GAP = 0.3                                                # 데이터와 패리티 사이 틈


def cx(j):
    return j + (GAP if j == NC - 1 else 0)


def cy(i):
    return -(i + (GAP if i == NR - 1 else 0))


def tint(c, a):
    return (*to_rgb(c), a)


def draw_grid(ax, m, flips=(), bad_rows=(), bad_cols=()):
    for i in bad_rows:                                   # 틀린 줄과 칸에 옅은 띠
        ax.add_patch(Rectangle((-0.12, cy(i) - 0.06), cx(NC - 1) + 1.24, 1.12, facecolor=tint(C[1], 0.10),
                               edgecolor="none"))
    for j in bad_cols:
        ax.add_patch(Rectangle((cx(j) - 0.06, cy(NR - 1) - 0.12), 1.12, cy(0) - cy(NR - 1) + 1.24,
                               facecolor=tint(C[1], 0.10), edgecolor="none"))
    for i in range(NR):
        for j in range(NC):
            corner = i == NR - 1 and j == NC - 1
            parity = i == NR - 1 or j == NC - 1
            face = tint(C[3], 0.28) if corner else tint(C[0], 0.18) if parity else "none"
            hit = (i, j) in flips
            ax.add_patch(Rectangle((cx(j), cy(i)), 1, 1, facecolor=tint(C[1], 0.30) if hit else face,
                                   edgecolor=C[1] if hit else INK, lw=1.8 if hit else 0.7))
            ax.text(cx(j) + 0.5, cy(i) + 0.5, str(m[i][j]), ha="center", va="center", fontsize=11,
                    color=C[1] if hit else INK, fontweight="bold" if hit else "normal")


def finish(ax, x0, x1, y0, y1):
    ax.set_xlim(x0, x1)
    ax.set_ylim(y0, y1)
    ax.set_aspect("equal")
    ax.set_axis_off()


RIGHT = cx(NC - 1) + 1.35                                # 오른쪽 글자 시작
BOTTOM = cy(NR - 1) - 0.25                               # 아래 글자 시작

# 그림 1: 슬라이드의 표, 가로·세로 패리티와 모서리 비트, 1의 개수
fig, ax = plt.subplots(figsize=(6.6, 4.6))
fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
draw_grid(ax, M)
for i in range(NR - 1):
    k = sum(M[i][:-1])
    ax.text(RIGHT, cy(i) + 0.5, f"1이 {k}개 → {M[i][-1]}", va="center", fontsize=9.5)
for j in range(NC - 1):
    k = sum(M[i][j] for i in range(NR - 1))
    ax.text(cx(j) + 0.5, BOTTOM, f"{k}개", ha="center", va="top", fontsize=9)
ax.text(-0.35, BOTTOM - 0.18, "세로 1의 개수", ha="right", va="center", fontsize=9)
ax.text(cx(NC - 1) + 0.5, cy(0) + 1.15, "가로\n패리티", ha="center", va="bottom", fontsize=9.5, color=C[0])
ax.text(3.5, cy(0) + 1.15, "데이터 6바이트 (7비트씩)", ha="center", va="bottom", fontsize=10)
ax.text(-0.35, cy(NR - 1) + 0.5, "세로 패리티 바이트", ha="right", va="center", fontsize=9.5, color=C[0])
ax.annotate("모서리 비트:\n가로 패리티 6개의 패리티\n= 세로 패리티 7개의 패리티", (cx(NC - 1) + 1.0, cy(NR - 1) + 0.5),
            xytext=(RIGHT + 0.25, cy(NR - 1) + 0.1), fontsize=9, color=C[3], va="center",
            arrowprops=dict(arrowstyle="-", color=C[3], lw=0.7))
finish(ax, -4.2, 15.2, BOTTOM - 0.8, cy(0) + 2.4)
save(fig, 1)


def checks_text(ax, m, bad_rows, bad_cols):
    for i in range(NR):
        bad = i in bad_rows
        ax.text(RIGHT, cy(i) + 0.5, f"{sum(m[i])}개 " + ("홀수 → 틀림" if bad else "짝수"), va="center",
                fontsize=9.5, color=C[1] if bad else INK, fontweight="bold" if bad else "normal")
    for j in range(NC):
        bad = j in bad_cols
        k = sum(m[i][j] for i in range(NR))
        ax.text(cx(j) + 0.5, BOTTOM, f"{k}", ha="center", va="top", fontsize=9.5,
                color=C[1] if bad else INK, fontweight="bold" if bad else "normal")
        ax.text(cx(j) + 0.5, BOTTOM - 0.5, "틀림" if bad else "", ha="center", va="top", fontsize=8.5,
                color=C[1], fontweight="bold")
    ax.text(-0.35, BOTTOM - 0.18, "칸마다 1의 개수", ha="right", va="center", fontsize=9)
    ax.text(RIGHT, cy(0) + 1.15, "줄마다 1의 개수", va="bottom", fontsize=9)


# 그림 2: 1비트 오류. 틀린 줄과 틀린 칸이 오류 비트에서 만난다
br1, bc1 = check(M1)
fig, ax = plt.subplots(figsize=(6.6, 4.4))
fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
draw_grid(ax, M1, flips=ERR1, bad_rows=br1, bad_cols=bc1)
checks_text(ax, M1, br1, bc1)
(ei, ej), = ERR1
ax.annotate("두 띠가 만나는 칸\n= 뒤집힌 비트\n(다시 뒤집어 고친다)", (cx(ej), cy(ei) + 0.5), xytext=(-0.7, cy(ei) + 0.5),
            fontsize=9, color=C[1], ha="right", va="center", arrowprops=dict(arrowstyle="->", color=C[1], lw=0.8))
finish(ax, -4.6, 14.6, BOTTOM - 1.2, cy(0) + 1.9)
save(fig, 2)

# 그림 3: 같은 줄의 2비트 오류. 가로 검사는 모두 짝수, 세로 검사 두 칸만 틀린다
br2, bc2 = check(M2)
fig, ax = plt.subplots(figsize=(6.6, 4.4))
fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
draw_grid(ax, M2, flips=ERR2, bad_rows=br2, bad_cols=bc2)
checks_text(ax, M2, br2, bc2)
ax.text(-0.6, cy(1) + 0.5, "같은 줄에서\n두 비트가 뒤집힘\n(받는 쪽은 줄을 모른다)", fontsize=9, color=C[1],
        ha="right", va="center")
ax.text(-0.6, cy(4) + 0.2, "가로 검사: 모두 짝수\n세로 검사: 두 칸 틀림\n→ 오류는 있다,\n   어느 줄인지는 모른다",
        fontsize=9, ha="right", va="center")
finish(ax, -4.6, 14.6, BOTTOM - 1.2, cy(0) + 1.9)
save(fig, 3)

if __name__ == "__main__":
    # 슬라이드 49의 패리티 비트와 패리티 바이트
    assert [r[-1] for r in M[:-1]] == [1, 0, 1, 1, 1, 0]
    assert "".join(map(str, M[-1][:-1])) == "1111011" and M[-1][-1] == 0
    assert check(M) == ([], [])
    # 본문의 계산: 첫 줄 0101001은 1이 3개 → 1, 첫 칸은 0, 1, 1, 0, 0, 1 → 3개 → 1
    assert sum(M[0][:-1]) == 3 and M[0][-1] == 1
    assert [M[i][0] for i in range(6)] == [0, 1, 1, 0, 0, 1] and M[-1][0] == 1
    # 모서리 비트: 가로 패리티 6개의 패리티 = 세로 패리티 7개의 패리티 = 데이터 전체 1의 개수의 패리티
    total = sum(sum(r[:-1]) for r in M[:-1])
    assert total == 24
    assert sum(r[-1] for r in M[:-1]) % 2 == sum(M[-1][:-1]) % 2 == total % 2 == M[-1][-1] == 0
    # 덧붙는 비트 수 m + n + 1 = 6 + 7 + 1 = 14, 데이터 42비트
    assert NR * NC - 6 * 7 == 6 + 7 + 1 == 14
    # 그림 2: 다섯째 줄(번호 4)과 첫째 칸(번호 0)만 틀린다. 카드 C2의 자리 (2, 5)와 다르다
    assert check(M1) == ([4], [0]) and ERR1[0] != (2, 5)
    assert ROWS[4] == "0110100" and M1[4][:7] == [1, 1, 1, 0, 1, 0, 0]
    assert sum(M1[4]) == 5 and sum(M1[i][0] for i in range(7)) == 5
    assert flipped(M1, ERR1) == M
    # 그림 3: 같은 줄 2비트 오류는 가로 검사를 모두 통과하고 세로 두 칸만 틀린다
    assert check(M2) == ([], [2, 5])
    # 같은 증상을 내는 다른 오류: 다른 줄의 같은 두 칸 → 위치를 하나로 정할 수 없다
    assert check(flipped(M, [(3, 2), (3, 5)])) == ([], [2, 5])
    # 서로 다른 줄·칸의 2비트 오류: 줄 둘, 칸 둘이 틀리고 대각선 쌍 두 가지가 같은 증상
    a = check(flipped(M, [(0, 1), (3, 6)]))
    b = check(flipped(M, [(0, 6), (3, 1)]))
    assert a == b == ([0, 3], [1, 6])
    print("ALL CHECKS PASSED")
```
{% endraw %}
