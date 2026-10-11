---
layout: "note"
title: "55_hardware-interrupt-irq_verify.py"
display_title: "55_hardware-interrupt-irq_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "55"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/hardware-interrupt-irq/"
parent_title: "하드웨어 인터럽트와 IRQ"
description: "어셈블리어 · 하드웨어 인터럽트와 IRQ 검증 코드"
permalink: "/studies/assembly-language/code/55_hardware-interrupt-irq_verify/"
---
{% raw %}
[하드웨어 인터럽트와 IRQ](/Hongs_Blog/studies/assembly-language/hardware-interrupt-irq/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 55.하드웨어 인터럽트와 IRQ 문서의 확인. 실행: python3 55_hardware-interrupt-irq_verify.py
# 8259 칩을 실제로 다루지 않는다. 슬라이드 표의 번호 계산과, "우선순위가 낮은 요청은 기다린다",
# "IF가 0이면 받지 않는다"는 규칙을 작은 흉내기로 확인한다.

# wk14-16 p.12 / wk14-17 p.7 표: INT 8~0Fh가 IRQ0~7
IRQ_TO_INT = {0: 0x08, 1: 0x09, 2: 0x0A, 3: 0x0B, 4: 0x0C, 5: 0x0D, 6: 0x0E, 7: 0x0F}


class Pic:
    """우선순위(숫자가 작을수록 높다고 두었다)가 있는 인터럽트 중재기 흉내."""

    def __init__(self):
        self.pending = set()
        self.in_service = []     # 처리 중인 IRQ 스택
        self.if_flag = 1
        self.log = []

    def request(self, irq):
        self.pending.add(irq)
        self.dispatch()

    def dispatch(self):
        if not self.if_flag or not self.pending:
            return
        best = min(self.pending)
        if self.in_service and best >= self.in_service[-1]:
            return               # 낮은(또는 같은) 우선순위는 끼어들지 못한다
        self.pending.remove(best)
        self.in_service.append(best)
        self.log.append(("start", best))

    def finish(self):
        self.log.append(("end", self.in_service.pop()))
        self.dispatch()

    def cli(self):
        self.if_flag = 0

    def sti(self):
        self.if_flag = 1
        self.dispatch()


if __name__ == "__main__":
    # IRQ n -> INT (8 + n), 벡터 칸의 오프셋 = (8 + n) × 4
    for irq, n in IRQ_TO_INT.items():
        assert n == 8 + irq
    assert IRQ_TO_INT[0] * 4 == 0x20 and IRQ_TO_INT[1] * 4 == 0x24 and IRQ_TO_INT[7] * 4 == 0x3C
    # IRQ 배정 표는 0~15, 16줄 (wk14-17 p.16~17)
    irq_names = ["System timer", "Keyboard", "Programmable Interrupt Controller", "COM2", "COM1", "LPT2",
                 "Floppy disk controller", "LPT1", "CMOS real-time clock",
                 "modem, video, network, sound, USB", "(available)", "(available)", "mouse",
                 "Math coprocessor", "Hard disk controller", "(available)"]
    assert len(irq_names) == 16 and irq_names[1] == "Keyboard" and irq_names[14] == "Hard disk controller"
    # 타이머는 초당 18.2번 (wk14-16 p.12 표): 한 번에 약 55ms
    assert round(1000 / 18.2) == 55

    # 낮은 우선순위는 높은 우선순위 처리를 끊지 못한다
    p = Pic()
    p.request(1)                 # 키보드 처리 시작
    p.request(6)                 # 플로피: 기다린다
    assert p.in_service == [1] and p.pending == {6}
    p.request(0)                 # 타이머: 끼어든다
    assert p.in_service == [1, 0]
    p.finish()                   # 타이머 끝 -> 키보드로 돌아간다 (6은 아직 대기)
    assert p.in_service == [1] and p.pending == {6}
    p.finish()                   # 키보드 끝 -> 플로피 시작
    assert p.in_service == [6]
    assert p.log == [("start", 1), ("start", 0), ("end", 0), ("end", 1), ("start", 6)]
    # 동시에 온 요청은 우선순위 순서로 하나씩
    p = Pic()
    p.cli()
    for irq in (4, 1, 3):
        p.request(irq)
    assert p.in_service == [] and p.pending == {1, 3, 4}   # CLI 동안은 아무것도 시작하지 않는다
    p.sti()
    order = [p.in_service[-1]]
    p.finish(); order.append(p.in_service[-1])
    p.finish(); order.append(p.in_service[-1])
    assert order == [1, 3, 4]
    print("ALL CHECKS PASSED")
```
{% endraw %}
