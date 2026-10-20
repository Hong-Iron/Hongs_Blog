---
layout: "note"
title: "60_sliding-window-algorithm_impl.py"
display_title: "60_sliding-window-algorithm_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "60"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-communication/sliding-window-algorithm/"
parent_title: "슬라이딩 윈도우 세부 알고리즘"
description: "컴퓨터 통신 · 슬라이딩 윈도우 세부 알고리즘 구현 코드"
sitemap: false
permalink: "/studies/computer-communication/code/60_sliding-window-algorithm_impl/"
---
{% raw %}
[슬라이딩 윈도우 세부 알고리즘](/Hongs_Blog/studies/computer-communication/sliding-window-algorithm/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 슬라이딩 윈도우(Go-Back-N) 세부 알고리즘을 송신 쪽과 수신 쪽으로 나눠 구현하고 시험한다.
# 실행: python3 60_sliding-window-algorithm_impl.py  (표준 라이브러리만 씀)
#
# 다음 약속을 따른다.
# - 데이터 n을 받으면 ACK n+1을 보낸다("n까지 잘 받았고, 다음은 n+1"). 누적 ACK다.
# - LAR(last acknowledgment received)은 마지막으로 받은 ACK에 적힌 번호다. 그래서 LAR은 아직 확인 안 된 첫 프레임이고,
#   확인을 기다리는 프레임은 LAR, LAR+1, …, LFS다. 그 개수가 LFS - LAR + 1이다.
# - 수신 쪽은 창 안에서 순서가 어긋난 프레임을 저장만 하고 ACK는 보내지 않는다. NFE보다 작은 번호가 오면 버리고 ACK를 다시 보낸다.
# 순서 번호는 순환하지 않는 일련번호(0, 1, 2, …)로 센다.
import heapq


class Sender:
    """송신 쪽 SWP. 상태 변수는 SWS, LAR, LFS 세 개뿐이고, 사건이 올 때마다 정해진 동작을 한다."""

    def __init__(self, sws, timeout, link):
        self.SWS, self.LAR, self.LFS = sws, 0, -1
        self.timeout, self.link = timeout, link
        self.buf = {}                       # 재전송 버퍼: 번호 → 데이터 사본
        self.timer = {}                     # 번호 → 이 타이머가 끝나는 시각
        self.waiting = []                   # 창이 꽉 차서 기다리는 위층의 전송 요청

    def invariant(self):
        assert self.LFS - self.LAR + 1 <= self.SWS
        assert set(self.buf) == set(range(self.LAR, self.LFS + 1)) == set(self.timer)

    # 사건 1: 위층에서 전송 요청이 옴
    def on_request(self, t, data):
        self.waiting.append(data)
        self._send_waiting(t)

    def _send_waiting(self, t):
        while self.waiting and self.LFS - self.LAR + 1 < self.SWS:   # 창이 꽉 찼으면 기다린다
            self.LFS += 1                                          # 1) LFS를 늘리고
            self.buf[self.LFS] = self.waiting.pop(0)
            start = self.link.send_frame(t, self.LFS, self.buf[self.LFS])  # 3) 아래 계층(링크)에 넘긴다
            self._set_timer(self.LFS, start)                       # 2) 타임아웃을 건다(링크가 실제로 싣기 시작한 때부터)
        self.invariant()

    # 사건 2: ACK가 옴
    def on_ack(self, t, ack):
        if ack <= self.LAR:                                        # 이미 받은 번호: 할 일이 없다
            return
        while self.LAR < ack:                                      # 1) LAR을 늘리며
            del self.timer[self.LAR]                               # 2) 타임아웃을 풀고 버퍼를 비운다
            del self.buf[self.LAR]
            self.LAR += 1
        self._send_waiting(t)                                      # 3) 창이 열린 만큼 보낸다

    # 사건 3: 타임아웃
    def on_timeout(self, t, seq):
        if self.timer.get(seq) != t:                               # 이미 풀렸거나 다시 걸린 타이머
            return
        start = self.link.send_frame(t, seq, self.buf[seq])        # 2) 버퍼의 사본을 다시 보내고
        self._set_timer(seq, start)                                # 1) 타임아웃을 다시 건다
        self.invariant()

    def _set_timer(self, seq, start):
        self.timer[seq] = start + self.timeout
        self.link.push(start + self.timeout, "timeout", seq)


class Receiver:
    """수신 쪽 SWP. 상태 변수는 RWS, NFE, LFA(= NFE + RWS - 1) 세 개다."""

    def __init__(self, rws, link, upper, ack_old=True):
        self.RWS, self.NFE = rws, 0
        self.link, self.upper, self.ack_old = link, upper, ack_old
        self.buf = {}                       # 순서가 어긋나 저장해 둔 프레임

    @property
    def LFA(self):
        return self.NFE + self.RWS - 1

    def invariant(self):
        assert self.LFA - self.NFE + 1 <= self.RWS
        assert all(self.NFE < k <= self.LFA for k in self.buf)

    # 사건: 프레임이 옴
    def on_frame(self, t, seq, data):
        if seq < self.NFE:                                         # 이미 받은 번호: 버리고 ACK를 다시
            if self.ack_old:
                self.link.send_ack(t, self.NFE)
            return "old"
        if seq > self.LFA:                                         # 창 밖: 버림
            return "outside"
        self.buf[seq] = data                                       # 창 안: 일단 저장
        if seq == self.NFE:
            while self.NFE in self.buf:                            # 빈틈없이 이어진 만큼 위층으로 올리고 NFE를 옮긴다
                self.upper.append(self.buf.pop(self.NFE))
                self.NFE += 1
            self.link.send_ack(t, self.NFE)                        # 누적 ACK(NFE 값으로)
            self.invariant()
            return "deliver"
        self.invariant()
        return "stored"                                            # 순서가 어긋남: 저장만, ACK는 안 보냄


class Link:
    """점대점 링크. 프레임은 싣는 시간 tf가 걸리고(한 번에 하나씩), 전파 시간 tp 뒤 마지막 비트가 닿는다.
    ACK는 짧아서 싣는 시간 없이 tp 뒤에 닿는다. fault로 정한 전송은 사라진다."""

    def __init__(self, tf, tp, frame_fault=None, ack_fault=None):
        self.tf, self.tp = tf, tp
        self.frame_fault, self.ack_fault = frame_fault or set(), ack_fault or set()
        self.q, self.tick, self.free = [], 0, 0.0
        self.tries, self.nack, self.log = {}, 0, []

    def push(self, t, kind, *data):
        self.tick += 1
        heapq.heappush(self.q, (t, self.tick, kind, data))

    def send_frame(self, t, seq, data):
        start = max(t, self.free)
        self.free = start + self.tf
        k = self.tries[seq] = self.tries.get(seq, 0) + 1
        lost = (seq, k) in self.frame_fault
        self.log.append((start, "S", f"F{seq}" + (" 다시" if k > 1 else "") + (" (사라짐)" if lost else "")))
        if not lost:
            self.push(start + self.tf + self.tp, "frame", seq, data)
        return start

    def send_ack(self, t, val):
        j = self.nack
        self.nack += 1
        lost = j in self.ack_fault
        self.log.append((t, "R", f"ACK {val}" + (" (사라짐)" if lost else "")))
        if not lost:
            self.push(t + self.tp, "ack", val)


def run(n, sws, rws, tf, tp, timeout, frame_fault=None, ack_fault=None, ack_old=True, t_max=1e4, trace=None):
    link = Link(tf, tp, frame_fault, ack_fault)
    upper = []
    s = Sender(sws, timeout, link)
    r = Receiver(rws, link, upper, ack_old)
    for i in range(n):                                             # 위층이 처음에 n개를 한꺼번에 맡긴다
        s.on_request(0.0, f"D{i}")
    done = None
    while link.q:
        t, _, kind, data = heapq.heappop(link.q)
        if t > t_max:
            break
        if kind == "frame":
            what = r.on_frame(t, *data)
        elif kind == "ack":
            s.on_ack(t, *data)
            what = "ack"
            if s.LAR == n and done is None:
                done = t
        else:
            s.on_timeout(t, *data)
            what = "timeout"
        if trace is not None:
            trace.append((t, kind, data[0], what, s.LAR, s.LFS, r.NFE, r.LFA, sorted(r.buf)))
        if done is not None and not link.q:
            break
    return upper, done, s, r, link


if __name__ == "__main__":
    # 문서의 예: SWS = RWS = 4, 프레임 6개, F2가 처음 보낼 때 사라짐, 싣기 1 ms, 전파 3 ms, 타임아웃 9 ms
    tr = []
    upper, done, s, r, link = run(6, 4, 4, 1.0, 3.0, 9.0, frame_fault={(2, 1)}, trace=tr)
    assert upper == [f"D{i}" for i in range(6)] and done == 18.0
    print("시각  사건          결과      LAR LFS NFE LFA 저장")
    for t, kind, x, what, lar, lfs, nfe, lfa, buf in tr:
        if what == "timeout" and not any(l[0] == t and l[1] == "S" for l in link.log):
            continue
        print(f"{t:4g}  {kind:7} {x!s:>4}  {what:8}  {lar:3} {lfs:3} {nfe:3} {lfa:3} {buf}")
    rows = {(t, kind, x): (what, lar, lfs, nfe, lfa, buf) for t, kind, x, what, lar, lfs, nfe, lfa, buf in tr}
    assert rows[(4.0, "frame", 0)] == ("deliver", 0, 3, 1, 4, [])
    assert rows[(7.0, "frame", 3)] == ("stored", 0, 3, 2, 5, [3])
    assert rows[(7.0, "ack", 1)] == ("ack", 1, 4, 2, 5, [3])
    assert rows[(8.0, "ack", 2)] == ("ack", 2, 5, 2, 5, [3])
    assert rows[(11.0, "timeout", 2)][1:3] == (2, 5)
    assert rows[(15.0, "frame", 2)] == ("deliver", 2, 5, 6, 9, [])
    assert rows[(18.0, "ack", 6)][1:3] == (6, 5)
    sent = [x for t, who, x in link.log if who == "S"]
    assert sent == ["F0", "F1", "F2 (사라짐)", "F3", "F4", "F5", "F2 다시", "F3 다시", "F4 다시", "F5 다시"], sent

    # 중복 프레임에 ACK를 다시 보내지 않으면: 마지막 ACK 6이 사라졌을 때 송신 쪽은 F2~F5를 끝없이 다시 보낸다
    upper, done, s, r, link = run(6, 4, 4, 1.0, 3.0, 9.0, frame_fault={(2, 1)}, ack_fault={2}, ack_old=False,
                                  t_max=200.0)
    assert upper == [f"D{i}" for i in range(6)] and done is None and s.LAR == 2
    again = sum(1 for t, who, x in link.log if who == "S" and x.endswith("다시"))
    assert again > 50                                              # 200 ms 동안 수십 번 다시 보낸다
    upper, done, s, r, link = run(6, 4, 4, 1.0, 3.0, 9.0, frame_fault={(2, 1)}, ack_fault={2}, ack_old=True)
    assert done is not None and s.LAR == 6                         # ACK를 다시 보내면 끝난다

    # 카드 C2: SWS = RWS = 3, LAR = 2, LFS = 4, NFE = 3, F4 저장 중에 F3이 도착
    class Dummy:
        def __init__(self):
            self.acks, self.frames = [], []

        def send_ack(self, t, v):
            self.acks.append(v)

        def send_frame(self, t, seq, data):
            self.frames.append(seq)
            return t

        def push(self, *a):
            pass
    d, up = Dummy(), []
    rcv = Receiver(3, d, up)
    rcv.NFE, rcv.buf = 3, {4: "D4"}
    assert rcv.on_frame(0.0, 3, "D3") == "deliver" and up == ["D3", "D4"]
    assert (rcv.NFE, rcv.LFA, d.acks) == (5, 7, [5])
    snd = Sender(3, 9.0, d)
    snd.LAR, snd.LFS = 2, 4
    snd.buf = {2: "D2", 3: "D3", 4: "D4"}
    snd.timer = {2: 9.0, 3: 10.0, 4: 11.0}
    snd.waiting = ["D5", "D6", "D7", "D8"]
    snd.on_ack(1.0, 5)
    assert snd.LAR == 5 and d.frames == [5, 6, 7] and snd.LFS == 7     # 새로 3개를 보낸다

    # 무작위 손실 시험: 프레임과 ACK가 사라져도 위층은 D0, D1, …을 순서대로 한 번씩 받고, 두 항등식은 늘 맞다
    import random
    rng = random.Random(3)
    for _ in range(3000):
        n = rng.randint(1, 10)
        sws = rng.randint(1, 5)
        rws = rng.randint(1, sws)
        tf, tp = rng.choice([0.5, 1.0, 2.0]), rng.choice([0.5, 1.0, 3.0])
        timeout = rng.choice([0.7, 1.2, 2.0]) * (tf + 2 * tp)
        p = rng.choice([0.0, 0.2, 0.4])
        ff = {(i, k) for i in range(n) for k in range(1, 5) if rng.random() < p}
        af = {j for j in range(40) if rng.random() < p}
        upper, done, s, r, link = run(n, sws, rws, tf, tp, timeout, ff, af)
        assert upper == [f"D{i}" for i in range(n)] and done is not None
    print("random tests: 3000 cases, all delivered in order exactly once, invariants held")
    print("ALL CHECKS PASSED")
```
{% endraw %}
