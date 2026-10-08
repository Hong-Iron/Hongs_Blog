---
layout: "note"
title: "53_arq_impl.py"
display_title: "53_arq_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "53"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-communication/arq-sequence-number/"
parent_title: "ARQ와 순서 번호"
description: "컴퓨터 통신 · ARQ와 순서 번호 구현 코드"
permalink: "/studies/computer-communication/code/53_arq_impl/"
---
{% raw %}
[ARQ와 순서 번호](/Hongs_Blog/studies/computer-communication/arq-sequence-number/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""ARQ(정지 대기)와 순서 번호 시뮬레이션. 슬라이드 p.62~66의 네 경우 (a)~(d)."""


def run(events, use_seq):
    """events: 송신 시도마다의 결과 'ok' | 'lost_frame' | 'lost_ack' | 'late_ack'.
    받는 쪽이 위로 넘긴 데이터 목록과 보낸 프레임 수를 돌려준다."""
    delivered, expected, sent = [], 0, 0
    data = ["F0", "F1", "F2"]
    i = 0; ev = iter(events)
    while i < len(data):
        e = next(ev, "ok"); sent += 1
        seq = i % 2
        if e == "lost_frame":
            continue                                        # 타임아웃 → 같은 프레임 재전송
        # 받는 쪽: 순서 번호가 있으면 중복을 버린다(ACK는 꼭 보낸다)
        if not use_seq or seq == expected:
            delivered.append(data[i]); expected ^= 1
        if e == "lost_ack":
            continue                                        # ACK가 없어 송신자는 재전송
        if e == "late_ack":
            sent += 1                                       # 타임아웃이 먼저 와서 재전송한 프레임이 하나 더 간다
            if not use_seq:
                delivered.append(data[i])
        i += 1
    return delivered, sent


def main():
    assert run(["ok", "ok", "ok"], True) == (["F0", "F1", "F2"], 3)               # (a)
    assert run(["lost_frame", "ok", "ok", "ok"], True) == (["F0", "F1", "F2"], 4)  # (b)
    # (c) ACK 분실: 순서 번호가 없으면 F0이 두 번 올라간다
    d, _ = run(["lost_ack", "ok", "ok", "ok"], False)
    assert d == ["F0", "F0", "F1", "F2"]
    d, s = run(["lost_ack", "ok", "ok", "ok"], True)
    assert d == ["F0", "F1", "F2"] and s == 4
    # (d) 타임아웃이 너무 짧아 ACK가 늦게 옴: 같은 문제
    d, _ = run(["late_ack", "ok", "ok"], False)
    assert d == ["F0", "F0", "F1", "F2"]
    d, _ = run(["late_ack", "ok", "ok"], True)
    assert d == ["F0", "F1", "F2"]
    # 정지 대기에는 순서 번호 1비트(0, 1)면 충분하다: 위 모두 0/1만 썼다
    # 카드 C2: 프레임 분실 1번, ACK 분실 1번 → 보낸 프레임 수
    assert run(["lost_frame", "ok", "lost_ack", "ok", "ok"], True)[1] == 5
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
