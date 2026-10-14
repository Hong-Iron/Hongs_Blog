---
layout: "note"
title: "46_framing-compared_plot.py"
display_title: "46_framing-compared_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "46"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/framing-compared/"
parent_title: "프레이밍 방식 비교"
description: "컴퓨터 통신 · 프레이밍 방식 비교 그림 생성 코드"
permalink: "/studies/computer-communication/code/46_framing-compared_plot/"
---
{% raw %}
[프레이밍 방식 비교](/Hongs_Blog/studies/computer-communication/framing-compared/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 프레이밍 방식 비교 문서의 그림을 만든다: 46_framing-compared_fig1.svg
# 실행: ~/.venvs/vault-plots/bin/python 46_framing-compared_plot.py  (matplotlib, numpy 필요)
# 프레임 네 개를 이어 보낸 줄에서 첫 프레임의 끝 표시(또는 Count)가 깨질 때, 받는 쪽이 어디서 자르는지 규칙대로 계산해 그린다.
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import Rectangle

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "46_framing-compared"
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


SYN, SOH, STX, ETX, DLE, CLASS = 0x16, 0x01, 0x02, 0x03, 0x10, 0x81
FLAG = "01111110"
BODIES = [[0x41, 0x42, 0x43, 0x44, 0x45], [0x46, 0x47, 0x48], [0x49, 0x4A, 0x4B, 0x4C], [0x4D, 0x4E]]


def crc16(data):
    """CRC-16/ARC. 예시의 CRC 두 바이트를 만드는 데만 쓴다."""
    crc = 0
    for b in data:
        crc ^= b
        for _ in range(8):
            crc = (crc >> 1) ^ 0xA001 if crc & 1 else crc >> 1
    return crc


def crc_bytes(body):
    c = crc16(body)
    return [c >> 8, c & 0xFF]


# ---------------------------------------------------------------- 보내는 쪽: 프레임 네 개를 이어 붙인 줄
def bisync_stream():
    s, frames, marks = [], [], []
    for i, body in enumerate(BODIES):
        st = len(s)
        s += [SYN, SYN, SOH, 0x31 + i, STX]
        for b in body:
            if b in (ETX, DLE):
                s.append(DLE)
            s.append(b)
        marks.append((len(s), 1)); s.append(ETX)
        s += crc_bytes(body)
        frames.append((st, len(s)))
    return s, frames, marks


def ddcmp_stream():
    s, frames, marks = [], [], []
    for i, body in enumerate(BODIES):
        st = len(s)
        s += [SYN, SYN, CLASS]
        marks.append((len(s), 1)); s.append(len(body))
        s += [0x31 + i] + body + crc_bytes(body)
        frames.append((st, len(s)))
    return s, frames, marks


def bits_of(data):
    return "".join(f"{b:08b}" for b in data)


def stuff(bits):
    out, run = [], 0
    for b in bits:
        out.append(b); run = run + 1 if b == "1" else 0
        if run == 5:
            out.append("0"); run = 0
    return "".join(out)


def hdlc_stream():
    s, frames, marks = "", [], []
    for i, body in enumerate(BODIES):
        st = len(s)
        marks.append((len(s), 8)); s += FLAG
        s += stuff(bits_of([0x31 + i] + body + crc_bytes(body)))
        marks.append((len(s), 8)); s += FLAG
        frames.append((st, len(s)))
    return s, frames, marks


# ---------------------------------------------------------------- 받는 쪽: 규칙대로 잘라 (시작, 끝, 상태) 목록을 만든다. 상태는 ok | bad | skip
def bisync_receive(s):
    out, i = [], 0
    while i < len(s):
        if s[i:i + 3] != [SYN, SYN, SOH]:
            j = i
            while j < len(s) and s[j:j + 3] != [SYN, SYN, SOH]:
                j += 1
            out.append((i, j, "skip")); i = j; continue
        st, j = i, i + 3
        while s[j] != STX:                                   # 헤더
            j += 1
        j += 1
        body = []
        while True:                                          # 본문: DLE 다음은 데이터, DLE 없는 ETX에서 끝
            if s[j] == DLE:
                body.append(s[j + 1]); j += 2
            elif s[j] == ETX:
                j += 1; break
            else:
                body.append(s[j]); j += 1
        ok = s[j:j + 2] == crc_bytes(body)
        j += 2
        out.append((st, j, "ok" if ok else "bad")); i = j
    return out


def ddcmp_receive(s):
    out, i = [], 0
    while i < len(s):
        if s[i:i + 2] != [SYN, SYN]:
            j = i
            while j < len(s) and s[j:j + 2] != [SYN, SYN]:
                j += 1
            out.append((i, j, "skip")); i = j; continue
        st, n = i, s[i + 3]
        body = s[i + 5:i + 5 + n]
        j = i + 5 + n
        ok = s[j:j + 2] == crc_bytes(body)
        j += 2
        out.append((st, j, "ok" if ok else "bad")); i = j
    return out


def hdlc_receive(s):
    """깃발 사이를 한 프레임으로 본다. 깃발 하나는 앞 덩어리의 끝이자 다음 덩어리의 시작이다. 빈 덩어리(깃발 두 개가 붙음)는 건너뛴다."""
    out = []
    first = s.index(FLAG)
    pos = first + 8
    cur_start = first
    while pos < len(s):
        data, run, j = [], 0, pos
        while True:
            b = s[j]
            data.append(b); run = run + 1 if b == "1" else 0
            if run == 5:
                if s[j + 1] == "0":
                    j += 2; run = 0; continue
                if s[j + 1:j + 3] == "10":
                    break
                raise ValueError("1이 일곱 개")
            j += 1
        flag_start, flag_end = j - 5, j + 3
        bits = "".join(data)[:-6]
        if bits:
            nb = len(bits) // 8
            by = [int(bits[8 * k:8 * k + 8], 2) for k in range(nb)]
            ok = len(bits) % 8 == 0 and nb >= 3 and by[-2:] == crc_bytes(by[1:-2])
            # 정상 덩어리는 끝 깃발까지, 버린 덩어리는 그것을 끝낸 깃발(다음 프레임의 앞 깃발) 직전까지 그린다
            out.append((cur_start, flag_end if ok else flag_start, "ok" if ok else "bad"))
        cur_start = flag_start
        pos = flag_end
    return out


def lost(frames, chunks):
    """정상으로 받은 덩어리와 시작·끝이 같지 않은 프레임 번호(1부터)."""
    good = {(a, b) for a, b, st in chunks if st == "ok"}
    res = []
    for k, (a, b) in enumerate(frames):
        if not any(a <= ga and gb <= b and gb - ga >= (b - a) - 8 for ga, gb in good):
            res.append(k + 1)
    return res


# ---------------------------------------------------------------- 네 경우
BS, BF, BM = bisync_stream()
B_BAD = list(BS); B_BAD[BM[0][0]] = 0x07                       # 첫 프레임의 ETX 03 → 07 (한 비트 뒤집힘)
B_CH = bisync_receive(B_BAD)

DS, DF, DM = ddcmp_stream()
D_SMALL = list(DS); D_SMALL[DM[0][0]] = 3                      # Count 5 → 3 (101 → 011)
D_BIG = list(DS); D_BIG[DM[0][0]] = 5 ^ 16                     # Count 5 → 21 (다섯 번째 비트 뒤집힘)
DS_CH = ddcmp_receive(D_SMALL)
DB_CH = ddcmp_receive(D_BIG)

HS, HF, HM = hdlc_stream()
h_end = HM[1][0]                                               # 첫 프레임의 끝 깃발
H_BAD = HS[:h_end + 3] + ("0" if HS[h_end + 3] == "1" else "1") + HS[h_end + 4:]   # 깃발의 네 번째 비트 뒤집힘
H_CH = hdlc_receive(H_BAD)

ROWS = [
    ("BISYNC", "첫 프레임의 ETX가 깨짐", BF, BM[:1], B_CH, len(B_BAD)),
    ("DDCMP", "Count가 5에서 3으로", DF, DM[:1], DS_CH, len(D_SMALL)),
    ("DDCMP", "Count가 5에서 21로", DF, DM[:1], DB_CH, len(D_BIG)),
    ("HDLC", "첫 프레임의 끝 깃발이 깨짐", HF, [HM[1]], H_CH, len(H_BAD)),
]

# ---------------------------------------------------------------- 그림 1
W = 10.0
fig, ax = plt.subplots(figsize=(7.0, 5.2))
for r, (name, what, frames, broken, chunks, total) in enumerate(ROWS):
    y = -r * 2.05
    sc = W / total
    ax.text(-0.25, y + 0.12, name, ha="right", va="center", fontsize=10)
    ax.text(-0.25, y - 0.32, what, ha="right", va="center", fontsize=8.5, color=C[1])
    for k, (a, b) in enumerate(frames):
        ax.add_patch(Rectangle((a * sc, y - 0.25), (b - a) * sc, 0.5, facecolor=C[0], alpha=0.10 + 0.08 * (k % 2),
                               edgecolor=INK, lw=0.7))
        inside = [(m - a) / (b - a) for m, _ in broken if a <= m < b]           # 깨진 칸을 피해 이름을 둔다
        f = 0.5 if not inside else (0.36 if inside[0] > 0.5 else 0.66)
        ax.text((a + f * (b - a)) * sc, y, f"프레임 {k + 1}", ha="center", va="center", fontsize=8.5)
    for a, w in broken:
        ax.add_patch(Rectangle((a * sc, y - 0.25), max(w * sc, 0.09), 0.5, facecolor=C[1], alpha=0.9, edgecolor=C[1]))
        ax.text((a + w / 2) * sc, y + 0.33, "깨짐", ha="center", va="bottom", fontsize=8, color=C[1])
    for a, b, st in chunks:
        x0, x1 = a * sc + 0.03, b * sc - 0.03
        col = {"ok": C[2], "bad": C[1], "skip": INK}[st]
        yy = y - 0.42
        ax.plot([x0, x0, x1, x1], [yy + 0.1, yy, yy, yy + 0.1], color=col, lw=1.0, ls="-" if st != "skip" else ":")
        lab = {"ok": "정상", "bad": "버림", "skip": "건너뜀"}[st]
        if st == "skip" and (x1 - x0) < 0.9:
            lab = "건너뜀"
        ax.text((x0 + x1) / 2, yy - 0.08, lab, ha="center", va="top", fontsize=8, color=col)
    n_lost = len(lost(frames, chunks))
    ax.text(W + 0.2, y, f"잃은 프레임\n{n_lost}개", ha="left", va="center", fontsize=9,
            color=C[1] if n_lost > 1 else INK)
ax.text(0, 0.85, "위: 보낸 프레임 네 개(주황 = 깨진 칸)   아래 괄호: 받는 쪽이 자른 덩어리", ha="left", va="bottom",
        fontsize=8.5)
ax.set_xlim(-2.6, W + 1.4)
ax.set_ylim(-3 * 2.05 - 0.95, 1.25)
ax.axis("off")
save(fig, 1)


if __name__ == "__main__":
    # 보낸 줄에 우연한 보초가 없다: BISYNC의 CRC·헤더 바이트에 ETX·DLE가 없고, DDCMP 줄의 본문·CRC에 SYN이 없다
    for body in BODIES:
        assert not set(crc_bytes(body)) & {ETX, DLE, SYN}
    assert DS.count(SYN) == 2 * len(BODIES)
    # 첫 프레임 CRC는 44 문서와 같은 50 2B
    assert crc_bytes(BODIES[0]) == [0x50, 0x2B]
    # 깨지지 않으면 네 방식 모두 네 프레임을 정상으로 받는다
    assert [st for _, _, st in bisync_receive(BS)] == ["ok"] * 4
    assert [st for _, _, st in ddcmp_receive(DS)] == ["ok"] * 4
    assert [st for _, _, st in hdlc_receive(HS)] == ["ok"] * 4
    # BISYNC: ETX가 깨지면 프레임 2의 ETX까지 이어 읽어 1·2를 잃고, 3·4는 정상
    assert [st for _, _, st in B_CH] == ["bad", "ok", "ok"] and B_CH[0][1] == BF[1][1]
    assert lost(BF, B_CH) == [1, 2]
    # DDCMP: Count 3이면 1만 잃는다(진짜 CRC 두 바이트를 건너뛰고 프레임 2의 SYN에서 다시 시작)
    assert [st for _, _, st in DS_CH] == ["bad", "skip", "ok", "ok", "ok"] and DS_CH[1][1] - DS_CH[1][0] == 2
    assert lost(DF, DS_CH) == [1]
    # DDCMP: Count 21이면 프레임 2를 통째로, 프레임 3의 앞부분까지 삼켜 1·2·3을 잃는다
    assert [st for _, _, st in DB_CH] == ["bad", "skip", "ok"] and lost(DF, DB_CH) == [1, 2, 3]
    assert DB_CH[0][1] > DF[2][0]                               # 버린 덩어리가 프레임 3 안에서 끝난다
    # HDLC: 끝 깃발이 깨지면 프레임 2의 앞 깃발에서 끝을 찾고, 그 깃발에서 프레임 2가 시작한다. 1만 잃는다
    assert [st for _, _, st in H_CH] == ["bad", "ok", "ok", "ok"] and lost(HF, H_CH) == [1]
    assert H_BAD[h_end:h_end + 8] == "01101110"
    # Count 21 = 프레임 1 본문 5 + CRC 2 + 프레임 2 전체 10 + 프레임 3 앞 4바이트
    assert DF[1][1] - DF[1][0] == 10 and 5 + 2 + 10 + 4 == 21 and D_BIG[DF[2][0]:DF[2][0] + 4] == [SYN, SYN, CLASS, 4]
    assert 5 ^ (1 << 13) == 8197 and 2 ** 14 - 1 == 16383
    # 깃발의 마지막 0이 1로 뒤집히면 1이 일곱 개 → 받는 쪽은 곧바로 오류
    last = HM[1][0] + 7
    try:
        hdlc_receive(HS[:last] + "1" + HS[last + 1:]); raise RuntimeError
    except ValueError:
        pass
    # 본문 41 03 42: 비트 채우기에서는 끼울 0이 없다(1이 많아야 두 개 이어짐)
    assert bits_of([0x41, 0x03, 0x42]) == "010000010000001101000010"
    assert stuff(bits_of([0x41, 0x03, 0x42])) == bits_of([0x41, 0x03, 0x42])
    # 13비트 본문은 채우면 15비트, 깃발까지 31비트
    assert len(stuff("0111111111110")) == 15
    # 오버헤드의 최악 입력이 서로 다르다: FF 10바이트는 BISYNC에 무해, HDLC에 +16비트(20%)
    # DLE 10바이트는 BISYNC에 +10바이트, HDLC에는 0비트
    ff, dl = [0xFF] * 10, [DLE] * 10
    assert len(stuff(bits_of(ff))) - 80 == 16 and len(stuff(bits_of(dl))) == 80
    bis = lambda d: sum(2 if b in (ETX, DLE) else 1 for b in d)
    assert bis(ff) == 10 and bis(dl) == 20
    print("ALL CHECKS PASSED")
```
{% endraw %}
