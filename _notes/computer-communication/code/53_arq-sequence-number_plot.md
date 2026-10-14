---
layout: "note"
title: "53_arq-sequence-number_plot.py"
display_title: "53_arq-sequence-number_plot.py"
kind: "code"
kind_label: "코드 · 그림 생성"
num: "53"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/arq-sequence-number/"
parent_title: "ARQ와 순서 번호"
description: "컴퓨터 통신 · ARQ와 순서 번호 그림 생성 코드"
sitemap: false
permalink: "/studies/computer-communication/code/53_arq-sequence-number_plot/"
---
{% raw %}
[ARQ와 순서 번호](/Hongs_Blog/studies/computer-communication/arq-sequence-number/) 문서의 그림 생성 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# ARQ와 순서 번호 문서의 그림을 만든다: 53_arq-sequence-number_fig1.svg, fig2.svg
# 실행: ~/.venvs/vault-plots/bin/python 53_arq-sequence-number_plot.py  (matplotlib, numpy 필요)
# 그림의 사건 순서는 손으로 적지 않고, 아래 simulate()가 정지 대기 ARQ를 사건 순서대로 흉내 내어 만든다.
import heapq
import itertools
import math
import os

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
PREFIX = "53_arq-sequence-number"
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


FRAME_C, ACK_C, BAD_C = C[0], C[2], C[1]               # 프레임 파랑, ACK 초록, 분실·중복 주황
LOST_AT = 0.6                                           # 사라지는 메시지는 길의 60% 지점에서 ✕로 끝낸다(그림용)


# ---------------------------------------------------------------- 시뮬레이션
def simulate(n_frames, timeout, frame_loss=(), ack_loss=(), mode="seq", d_frame=1.0, d_ack=1.0):
    """정지 대기 ARQ를 사건 순서대로 흉내 낸다.

    mode: "none"  순서 번호가 없다. 수신자는 오는 프레임을 모두 새 것으로 올리고, 송신자는 어떤 ACK든 받아들인다.
          "seq"   0과 1을 번갈아 붙인다. 수신자는 기다리던 번호만 올리고(중복은 버리되 ACK는 다시 보냄),
                  송신자는 지금 보낸 프레임의 번호와 같은 ACK만 받아들인다.
          "const" 모든 프레임에 같은 번호 0을 붙인다. 수신자는 직전에 받은 번호와 같으면 중복으로 버린다.
    frame_loss / ack_loss: 몇 번째(0부터) 프레임 전송 / ACK 전송이 사라지는가.
    d_frame: 프레임을 싣기 시작해서 수신자가 끝까지 받을 때까지의 시간. d_ack: ACK가 건너가는 시간.
    """
    q, counter = [], itertools.count()

    def push(t, kind, **kw):
        heapq.heappush(q, (t, next(counter), kind, kw))

    msgs, timers, recv, sender_log, delivered = [], [], [], [], []
    st = dict(nf=0, na=0, cur=0, timer=None, expected=0, last=None)

    def seq_of(i):
        return {"none": None, "seq": i % 2, "const": 0}[mode]

    def send(t, why):
        i, seq = st["cur"], seq_of(st["cur"])
        lost = st["nf"] in frame_loss
        msgs.append(dict(kind="frame", i=i, seq=seq, t0=t, t1=t + (LOST_AT * d_frame if lost else d_frame), lost=lost))
        if not lost:
            push(t + d_frame, "frame_arrive", i=i, seq=seq)
        st["nf"] += 1
        timers.append(dict(t0=t, t_end=t + timeout, stop=None))
        st["timer"] = len(timers) - 1
        push(t + timeout, "timeout", tid=st["timer"])
        sender_log.append((t, why, i, seq))

    send(0.0, "first")
    while q:
        t, _, kind, kw = heapq.heappop(q)
        if kind == "frame_arrive":
            i, seq = kw["i"], kw["seq"]
            if mode == "none":
                new = True
            elif mode == "seq":
                new = seq == st["expected"]
            else:                                       # const: 직전 번호와 같으면 중복으로 본다
                new = st["last"] is None
            if new:
                delivered.append(f"F{i}")
                if mode == "seq":
                    st["expected"] ^= 1
                st["last"] = seq
            recv.append((t, i, seq, "deliver" if new else "dup"))
            lost = st["na"] in ack_loss
            msgs.append(dict(kind="ack", i=i, seq=seq, t0=t, t1=t + (LOST_AT * d_ack if lost else d_ack), lost=lost))
            if not lost:
                push(t + d_ack, "ack_arrive", seq=seq)
            st["na"] += 1
        elif kind == "ack_arrive":
            ok = st["timer"] is not None and (mode != "seq" or kw["seq"] == st["cur"] % 2)
            if ok:
                timers[st["timer"]]["stop"] = t
                st["timer"] = None
                sender_log.append((t, "ack", st["cur"], kw["seq"]))
                st["cur"] += 1
                if st["cur"] < n_frames:
                    send(t, "next")
            else:
                sender_log.append((t, "ignored_ack", st["cur"], kw["seq"]))
        elif kind == "timeout":
            if kw["tid"] == st["timer"]:
                st["timer"] = None
                sender_log.append((t, "timeout", st["cur"], None))
                send(t, "resend")
    return dict(msgs=msgs, timers=timers, recv=recv, delivered=delivered, sent=st["nf"], log=sender_log)


# 그림 1: 순서 번호가 없을 때의 네 경우. 편도 1, 타임아웃 2.5(왕복 2보다 김), (d)만 1.5(왕복보다 짧음)
D, TO, TO_SHORT = 1.0, 2.5, 1.5
CASES = [
    ("(a) 정상", simulate(1, TO, mode="none"), TO),
    ("(b) 프레임 분실", simulate(1, TO, frame_loss=(0,), mode="none"), TO),
    ("(c) ACK 분실", simulate(1, TO, ack_loss=(0,), mode="none"), TO),
    ("(d) ACK가 타임아웃보다 늦게 옴", simulate(1, TO_SHORT, mode="none"), TO_SHORT),
]
# 그림 2: 실행 추적. F0(번호 0), F1(번호 1). 첫 ACK 0이 사라진다
TRACE = simulate(2, TO, ack_loss=(0,), mode="seq")


# ---------------------------------------------------------------- 그리기 도구
def text_angle(ax, p0, p1):
    a = ax.transData.transform(p0)
    b = ax.transData.transform(p1)
    ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
    if ang > 90:
        ang -= 180
    if ang < -90:
        ang += 180
    return ang, a, b


def draw_msg(ax, m, label, frac=0.33, off=7, fs=9):
    """메시지 하나를 비스듬한 화살표로 그린다. 사라진 메시지는 ✕로 끝난다."""
    color = FRAME_C if m["kind"] == "frame" else ACK_C
    x0, x1 = (0.0, 1.0) if m["kind"] == "frame" else (1.0, 0.0)
    total = m["t1"] - m["t0"]
    if m["lost"]:
        total = total / LOST_AT                     # 원래 걸릴 시간
        xe = x0 + (x1 - x0) * LOST_AT
        ye = m["t1"]
        ax.plot([x0, xe], [m["t0"], ye], color=color, lw=1.5)
        ax.plot([xe], [ye], marker="x", ms=11, mew=2.2, color=BAD_C)
    else:
        ax.annotate("", xy=(x1, m["t1"]), xytext=(x0, m["t0"]),
                    arrowprops=dict(arrowstyle="-|>", color=color, lw=1.5, shrinkA=0, shrinkB=0, mutation_scale=11))
    p0 = (x0, m["t0"])
    p1 = (x1, m["t0"] + total)
    ang, a, b = text_angle(ax, p0, p1)
    mx = x0 + (x1 - x0) * frac
    my = m["t0"] + total * frac
    # 선 위쪽(화면에서 위)으로 띄운다
    vx, vy = b[0] - a[0], b[1] - a[1]
    n = np.array([-vy, vx]) / math.hypot(vx, vy)
    if n[1] < 0:
        n = -n
    ax.annotate(label, (mx, my), xytext=(n[0] * off, n[1] * off), textcoords="offset points",
                rotation=ang, rotation_mode="anchor", ha="center", va="center", fontsize=fs, color=color)


def draw_bracket(ax, tmr, x=-0.09, w=0.04, dashed_rest=True):
    """타이머 구간을 송신자 줄 왼쪽의 괄호로 그린다. 실선은 타이머가 돌던 동안, 점선은 ACK로 멈춘 뒤 남은 시간."""
    end = tmr["stop"] if tmr["stop"] is not None else tmr["t_end"]
    ax.plot([x + w, x, x, x + w], [tmr["t0"], tmr["t0"], end, end], color=INK, lw=1.2)
    if tmr["stop"] is not None and dashed_rest:
        ax.plot([x, x, x + w], [end, tmr["t_end"], tmr["t_end"]], color=INK, lw=1.0, ls=(0, (2, 2)))


def lifelines(ax, t_max, top=-0.15):
    for x, name in [(0.0, "송신자"), (1.0, "수신자")]:
        ax.plot([x, x], [top, t_max], color=INK, lw=1.6)
        ax.text(x, top - 0.12, name, ha="center", va="bottom", fontsize=10)


# ---------------------------------------------------------------- 그림 1
fig = plt.figure(figsize=(7.2, 8.0))
T_MAX1 = 5.15
for k, (title, res, tout) in enumerate(CASES):
    r, c = divmod(k, 2)
    ax = fig.add_axes([0.03 + c * 0.5, 0.52 - r * 0.5, 0.46, 0.44])
    ax.set_xlim(-0.62, 1.78)
    ax.set_ylim(T_MAX1 + 0.1, -1.05)
    ax.axis("off")
    ax.text(-0.62, -0.95, title, ha="left", va="center", fontsize=10.5, fontweight="bold")
    for t in range(0, 6):
        ax.plot([0, 1], [t, t], color=INK, lw=0.4, ls=":", alpha=0.6)
        ax.text(-0.5, t, str(t), ha="center", va="center", fontsize=8.5)
    ax.text(-0.5, -0.35, "시각", ha="center", va="bottom", fontsize=8.5)
    lifelines(ax, T_MAX1)
    for tmr in res["timers"]:
        if tmr["stop"] is not None and tmr["stop"] - tmr["t0"] < 1e-9:
            continue
        draw_bracket(ax, tmr)
    first = res["timers"][0]
    ax.text(-0.2, (first["t0"] + first["t_end"]) / 2, "타임아웃", rotation=90, ha="center", va="center", fontsize=8.5)
    for j, m in enumerate(res["msgs"]):
        # (d)에서 다시 보낸 프레임은 원래 ACK와 엇갈리므로 이름을 화살표 뒤쪽에 단다
        frac = 0.6 if (tout < D * 2 and m["kind"] == "frame" and m["t0"] > 0) else 0.33
        draw_msg(ax, m, "프레임" if m["kind"] == "frame" else "ACK", frac=frac)
    n_got = 0
    for (t, i, seq, what) in res["recv"]:
        n_got += 1
        ax.plot([1.0], [t], "o", ms=5, color=FRAME_C if n_got == 1 else BAD_C)
        if n_got == 1:
            ax.text(1.06, t, "받음", ha="left", va="center", fontsize=9)
        else:
            ax.text(1.06, t, "또 받음\n(중복)", ha="left", va="center", fontsize=9, color=BAD_C, linespacing=1.1)
    for (t, why, i, seq) in res["log"]:
        if why == "timeout":
            ax.plot([0.0], [t], "o", ms=4.5, color=INK)
        if why == "resend":
            ax.text(0.04, t - 0.13, "다시 보냄", ha="left", va="bottom", fontsize=8.5)
    if tout < D * 2:
        ack_t = [m["t1"] for m in res["msgs"] if m["kind"] == "ack" and not m["lost"]][0]
        ax.annotate("늦게 온 ACK", (0.0, ack_t), xytext=(0.1, ack_t + 0.3), fontsize=8.5, color=ACK_C,
                    ha="left", va="center",
                    arrowprops=dict(arrowstyle="-", color=ACK_C, lw=0.6, shrinkA=1, shrinkB=1))
save(fig, 1)


# ---------------------------------------------------------------- 그림 2
fig = plt.figure(figsize=(7.4, 6.2))
ax = fig.add_axes([0, 0, 1, 1])
T_MAX2 = 6.75
ax.set_xlim(-1.08, 2.0)
ax.set_ylim(T_MAX2 + 0.15, -0.75)
ax.axis("off")
lifelines(ax, T_MAX2)
# 끝까지 가서 타임아웃이 난 타이머(F0을 처음 보낼 때 건 것)만 괄호로 그린다
fired = [tm for tm in TRACE["timers"] if tm["stop"] is None and tm["t_end"] <= max(m["t1"] for m in TRACE["msgs"])]
for tm in fired:
    draw_bracket(ax, tm)
    ax.text(-0.155, (tm["t0"] + tm["t_end"]) / 2, "타임아웃", rotation=90, ha="center", va="center", fontsize=9)
for m in TRACE["msgs"]:
    lab = f"F{m['i']} ({m['seq']})" if m["kind"] == "frame" else f"ACK {m['seq']}"
    draw_msg(ax, m, lab, frac=0.36, fs=9.5)
lost_ack = [m for m in TRACE["msgs"] if m["kind"] == "ack" and m["lost"]][0]
ax.text(1.0 - LOST_AT + 0.06, lost_ack["t1"] + 0.06, "ACK 0 분실", ha="left", va="top", fontsize=9, color=BAD_C)


def step_mark(x, y, n):
    ax.text(x, y, str(n), ha="center", va="center", fontsize=8.5, color=INK,
            bbox=dict(boxstyle="circle,pad=0.25", fc="none", ec=INK, lw=0.8))


SENDER_TXT = {"first": "F0(번호 0) 보냄, 타이머 시작", "resend": "타임아웃 → F0(0) 다시 보냄",
              "next": "ACK 0 받음 → F1(번호 1) 보냄"}
step_of = {"first": 1, "resend": 3, "next": 4}
for (t, why, i, seq) in TRACE["log"]:
    if why in SENDER_TXT:
        ax.text(-0.25, t, SENDER_TXT[why], ha="right", va="center", fontsize=9.5)
        step_mark(-1.02, t, step_of[why])
    if why == "ack" and i == 1:
        ax.text(-0.25, t, "ACK 1 받음 → 다음 프레임으로", ha="right", va="center", fontsize=9.5)
step_mark(1.0 - LOST_AT - 0.08, lost_ack["t1"] - 0.25, 2)
RECV_TXT = {("deliver", 0): "0번 받음 → 위로 올림, ACK 0\n이제 1번을 기다림",
            ("dup", 0): "0번 또 옴 → 중복이라 버림\nACK 0은 다시 보냄",
            ("deliver", 1): "1번 받음 → 위로 올림, ACK 1\n이제 0번을 기다림"}
for (t, i, seq, what) in TRACE["recv"]:
    ax.plot([1.0], [t], "o", ms=5, color=BAD_C if what == "dup" else FRAME_C)
    ax.text(1.07, t, RECV_TXT[(what, seq)], ha="left", va="center", fontsize=9.5, linespacing=1.25,
            color=BAD_C if what == "dup" else INK)
for (t, why, i, seq) in TRACE["log"]:
    if why == "timeout":
        ax.plot([0.0], [t], "o", ms=4.5, color=INK)
save(fig, 2)


# ---------------------------------------------------------------- 확인
if __name__ == "__main__":
    a, b, c, d = (res for _, res, _ in CASES)
    # 그림 1 (a): 한 번 보내고 한 번 받는다. ACK는 시각 2에 와서 타이머(2.5)를 멈춘다
    assert a["sent"] == 1 and a["delivered"] == ["F0"] and a["timers"][0]["stop"] == 2.0 and a["recv"][0][0] == 1.0
    # (b): 프레임이 사라져 수신자는 아무것도 모른다. 2.5에 타임아웃, 3.5에 받고, 4.5에 ACK
    assert b["sent"] == 2 and b["delivered"] == ["F0"] and len(b["recv"]) == 1
    assert b["log"][1] == (2.5, "timeout", 0, None) and b["recv"][0][0] == 3.5 and b["timers"][1]["stop"] == 4.5
    # (c): 수신자는 1에 받고 ACK를 보냈지만 ACK가 사라진다. 2.5에 다시 보내고 3.5에 같은 프레임을 또 받는다
    assert c["sent"] == 2 and c["delivered"] == ["F0", "F0"] and [r[0] for r in c["recv"]] == [1.0, 3.5]
    assert c["timers"][1]["stop"] == 4.5
    # (b)와 (c)에서 송신자가 본 것은 똑같다: 2.5까지 아무것도 안 옴 → 다시 보냄
    assert [x[:2] for x in b["log"][:3]] == [x[:2] for x in c["log"][:3]]
    # (d): 타임아웃 1.5 < 왕복 2. 1.5에 다시 보내고, 원래 ACK는 2.0에 온다. 2.5에 중복, 두 번째 ACK는 3.5
    assert d["sent"] == 2 and d["delivered"] == ["F0", "F0"]
    assert d["log"][1] == (1.5, "timeout", 0, None) and d["timers"][1]["stop"] == 2.0
    assert [r[0] for r in d["recv"]] == [1.0, 2.5] and d["log"][-1] == (3.5, "ignored_ack", 1, None)

    # 그림 2 (실행 추적 표): F0(0) → ACK 0 분실 → 2.5 타임아웃, F0(0) 재전송 → 3.5 중복 버림, ACK 0 다시
    #                      → 4.5 ACK 0 받음, F1(1) 보냄 → 5.5 1번 받음 → 6.5 ACK 1
    assert TRACE["delivered"] == ["F0", "F1"] and TRACE["sent"] == 3
    assert [(r[0], r[2], r[3]) for r in TRACE["recv"]] == [(1.0, 0, "deliver"), (3.5, 0, "dup"), (5.5, 1, "deliver")]
    assert [(x[0], x[1]) for x in TRACE["log"]] == [(0.0, "first"), (2.5, "timeout"), (2.5, "resend"),
                                                   (4.5, "ack"), (4.5, "next"), (6.5, "ack")]
    # 카드 C2의 상황(F0 처음 분실, F1의 ACK 분실)은 그리지 않았다
    assert not any(m["kind"] == "frame" and m["lost"] for m in TRACE["msgs"])

    # 본문: 0과 1을 번갈아 쓰면 충분하다. 프레임 3개, 앞 6번의 프레임·ACK 전송 중 어느 것이 사라져도
    # (타임아웃이 왕복보다 길든 짧든) 수신자는 F0, F1, F2를 순서대로 한 번씩만 올린다
    for tout in (TO, TO_SHORT):
        for fl in itertools.product([0, 1], repeat=6):
            for al in itertools.product([0, 1], repeat=6):
                res = simulate(3, tout, frame_loss={k for k in range(6) if fl[k]},
                               ack_loss={k for k in range(6) if al[k]}, mode="seq")
                assert res["delivered"] == ["F0", "F1", "F2"]
    # 본문: 번호가 하나뿐(늘 0)이면 둘 중 하나가 틀린다
    #   같은 번호도 새 것으로 치면 = 번호 없음 → (c)에서 F0이 두 번 올라간다
    assert simulate(2, TO, ack_loss=(0,), mode="none")["delivered"] == ["F0", "F0", "F1"]
    #   같은 번호를 중복으로 치면 → 아무것도 안 사라진 정상 전송에서도 F1이 버려진다
    assert simulate(2, TO, mode="const")["delivered"] == ["F0"]

    # 본문 '시간 진행'의 숫자: 10 Mbps, 1,000 km 광케이블(2×10^8 m/s), 프레임 8,000비트, ACK 싣는 시간은 무시
    t_frame = 8000 / 10e6
    t_prop = 1_000_000 / 2e8
    assert math.isclose(t_frame, 0.0008) and math.isclose(t_prop, 0.005)
    assert math.isclose(512 / 10e6 * 1e3, 0.0512)                         # 64바이트 ACK는 0.05 ms
    rtt_wait = t_frame + 2 * t_prop
    assert math.isclose(rtt_wait, 0.0108)                                  # 10.8 ms
    assert math.isclose(t_frame / rtt_wait, 0.074074, rel_tol=1e-4)        # 약 7.4%
    assert math.isclose(100 * 0.0108, 1.08) and math.isclose(100 * t_frame, 0.08)  # 프레임 100개 → 1.08초, 싣는 시간은 0.08초
    assert 1.0 / rtt_wait > 90                                             # 타임아웃 1초는 10.8 ms의 90배 넘게
    assert math.isclose(8000 / 100e6, 0.00008)                             # 100 Mbps면 0.08 ms
    assert math.isclose(1000 / 2e8, 0.000005)                              # 1 km면 5 µs
    ms = dict(d_frame=(t_frame + t_prop) * 1e3, d_ack=t_prop * 1e3)       # ms 단위
    ok = simulate(3, 15.0, **ms)
    bad = simulate(3, 8.0, **ms)
    assert ok["sent"] == 3 and bad["sent"] == 6                            # 타임아웃 8 ms면 프레임마다 두 번
    assert ok["delivered"] == bad["delivered"] == ["F0", "F1", "F2"]
    assert [round(x[0], 6) for x in bad["log"][:4]] == [0.0, 8.0, 8.0, 10.8]  # 8 ms 재전송, 10.8 ms ACK
    assert math.isclose(bad["recv"][1][0], 13.8)                           # 중복은 13.8 ms에 도착
    assert math.isclose(15.0 - 10.8, 4.2)                                  # NAK이면 4.2 ms 일찍 다시 보냄
    print("ALL CHECKS PASSED")
```
{% endraw %}
