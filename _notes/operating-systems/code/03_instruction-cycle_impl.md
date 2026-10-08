---
layout: "note"
title: "03_instruction-cycle_impl.py"
display_title: "03_instruction-cycle_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "03"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/instruction-cycle/"
parent_title: "명령어 사이클"
description: "운영체제 · 명령어 사이클 구현 코드"
permalink: "/studies/operating-systems/code/03_instruction-cycle_impl/"
---
{% raw %}
[명령어 사이클](/Hongs_Blog/studies/operating-systems/instruction-cycle/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""명령어 사이클 시뮬레이터: Stallings 그림 1.3의 가상 기계.

- 명령어와 데이터는 16비트. 앞 4비트가 연산 코드, 뒤 12비트가 주소다.
- 연산 코드: 0x1 = 메모리에서 AC로 읽기, 0x2 = AC를 메모리에 쓰기, 0x5 = 메모리 값을 AC에 더하기.
- 주소와 값은 모두 16진수다. 메모리는 dict로 둔다.
"""

LOAD, STORE, ADD = 0x1, 0x2, 0x5


def run(memory, pc, steps):
    """steps번의 명령어 사이클을 돌리고, 단계마다 (단계, PC, IR, AC, 바뀐 메모리)를 기록한다."""
    mem = dict(memory)
    ac, ir = None, None
    trace = []
    for _ in range(steps):
        # 인출 단계: PC가 가리키는 명령어를 IR에 싣고 PC를 1 늘린다
        ir = mem[pc]
        pc += 1
        trace.append(("fetch", pc, ir, ac, None))
        # 실행 단계: IR의 앞 4비트로 할 일을, 뒤 12비트로 주소를 정한다
        op, addr = ir >> 12, ir & 0xFFF
        changed = None
        if op == LOAD:
            ac = mem[addr]
        elif op == ADD:
            ac = (ac + mem[addr]) & 0xFFFF
        elif op == STORE:
            mem[addr] = ac
            changed = (addr, ac)
        else:
            raise ValueError(f"모르는 연산 코드 {op:X}")
        trace.append(("execute", pc, ir, ac, changed))
    return mem, pc, ac, trace


def show(trace):
    for i, (stage, pc, ir, ac, changed) in enumerate(trace, 1):
        acs = "----" if ac is None else f"{ac:04X}"
        ch = "" if changed is None else f"  M[{changed[0]:03X}]={changed[1]:04X}"
        print(f"{i}단계 {stage:7s} PC={pc:03X} IR={ir:04X} AC={acs}{ch}")


if __name__ == "__main__":
    # 슬라이드 그림 1.4: 940번지 값에 941번지 값을 더해 941번지에 저장한다
    program = {0x300: 0x1940, 0x301: 0x5941, 0x302: 0x2941, 0x940: 0x0003, 0x941: 0x0002}
    mem, pc, ac, trace = run(program, 0x300, 3)
    show(trace)
    assert mem[0x941] == 0x0005 and pc == 0x303 and ac == 0x0005
    assert [t[1] for t in trace] == [0x301, 0x301, 0x302, 0x302, 0x303, 0x303]

    # 카드 C3: 같은 프로그램, 940번지 = 6, 941번지 = A
    mem, pc, ac, trace = run({**program, 0x940: 0x0006, 0x941: 0x000A}, 0x300, 3)
    show(trace)
    assert mem[0x941] == 0x0010 and ac == 0x0010 and pc == 0x303

    # 주소 칸이 12비트라 바로 가리킬 수 있는 칸은 2^12 = 4096개, 연산 코드는 2^4 = 16가지
    assert 2 ** 12 == 4096 and 2 ** 4 == 16
    print("ALL CHECKS PASSED")
```
{% endraw %}
