---
layout: "note"
title: "56_custom-interrupt-handler_verify.py"
display_title: "56_custom-interrupt-handler_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "56"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/custom-interrupt-handler/"
parent_title: "인터럽트 핸들러 바꿔 끼우기"
description: "어셈블리어 · 인터럽트 핸들러 바꿔 끼우기 검증 코드"
permalink: "/studies/assembly-language/code/56_custom-interrupt-handler_verify/"
---
{% raw %}
[인터럽트 핸들러 바꿔 끼우기](/Hongs_Blog/studies/assembly-language/custom-interrupt-handler/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 56.인터럽트 핸들러 바꿔 끼우기 문서의 확인. 실행: python3 56_custom-interrupt-handler_verify.py
# TSR을 실제로 올리지 않는다. 바이트 배열로 만든 인터럽트 벡터 표에서 "옛 주소 저장 -> 새 주소 넣기 ->
# 새 처리기가 옛 처리기로 넘기기"를 흉내 내고, No_Reset의 비트 검사를 전수로 확인한다.

mem = bytearray(0x400)       # 인터럽트 벡터 표


def w16(a, v):
    mem[a], mem[a + 1] = v & 0xFF, v >> 8


def r16(a):
    return mem[a] | (mem[a + 1] << 8)


def get_vector(n):           # INT 21h 함수 35h: ES:BX
    return r16(n * 4 + 2), r16(n * 4)


def set_vector(n, seg, off):  # INT 21h 함수 25h: DS:DX
    w16(n * 4, off)
    w16(n * 4 + 2, seg)


# 키보드 상태 바이트의 비트 (wk14-17 p.27 그림)
RT_SHIFT, LEFT_SHIFT, CTRL_KEY, ALT_KEY = 0x01, 0x02, 0x04, 0x08
DEL_KEY = 0x53               # 스캔 코드 표 (wk14-16 p.10)


def int9_handler(flag_byte, scan):
    """wk14-17 p.28~31의 L1~L5. (새 플래그 바이트, 재시작을 막았는가)를 돌려준다."""
    ah = flag_byte
    if ah & CTRL_KEY == 0:           # L2: test ah,ctrl_key / jz L5
        return ah, False
    if ah & ALT_KEY == 0:            # test ah,alt_key / jz L5
        return ah, False
    if scan != DEL_KEY:              # L3: cmp al,del_key / jne L5
        return ah, False
    if ah & RT_SHIFT:                # test ah,rt_shift / jnz L5
        return ah, False
    ah &= (~CTRL_KEY) & 0xFF         # L4: and ah,NOT ctrl_key
    return ah, True                  # mov es:[di],ah


if __name__ == "__main__":
    # 처음: INT 9 칸에 BIOS 처리기 0DAD:2BAD (wk14-17 p.22 그림)
    set_vector(9, 0x0DAD, 0x2BAD)
    assert 9 * 4 == 0x24
    # 1) 옛 주소 저장: int9Save에 오프셋, int9Save+2에 세그먼트 (wk14-17 p.20)
    es, bx = get_vector(9)
    int9save = bytearray(4)
    int9save[0:2] = bx.to_bytes(2, "little")
    int9save[2:4] = es.to_bytes(2, "little")
    assert bytes(int9save) == bytes([0xAD, 0x2B, 0xAD, 0x0D])
    assert bytes(int9save) == bytes(mem[0x24:0x28])      # 벡터 표의 칸과 같은 배치
    # 2) 새 주소 넣기: 우리 처리기 10B2:0020
    set_vector(9, 0x10B2, 0x0020)
    assert get_vector(9) == (0x10B2, 0x0020)
    assert bytes(mem[0x24:0x28]) == bytes([0x20, 0x00, 0xB2, 0x10])
    # 3) 키가 눌리면: 표 -> 우리 처리기 -> 저장해 둔 옛 주소로 점프
    path = [get_vector(9)]
    old = (int.from_bytes(int9save[2:4], "little"), int.from_bytes(int9save[0:2], "little"))
    path.append(old)
    assert path == [(0x10B2, 0x0020), (0x0DAD, 0x2BAD)]
    # 옛 주소를 저장하지 않고 덮어쓰면 되찾을 수 없다
    assert (0x0DAD, 0x2BAD) != get_vector(9)

    # Ctrl-Break 예제: INT 23h 칸은 008Ch (wk14-17 p.24~25)
    assert 0x23 * 4 == 0x008C

    # NOT ctrl_key = 11111011b
    assert (~CTRL_KEY) & 0xFF == 0b11111011
    # No_Reset: 플래그 256가지 × 스캔 코드 256가지 전수
    blocked = 0
    for fb in range(256):
        for sc in range(256):
            new, stop = int9_handler(fb, sc)
            want = bool(fb & CTRL_KEY) and bool(fb & ALT_KEY) and sc == DEL_KEY and not (fb & RT_SHIFT)
            assert stop == want
            if stop:
                blocked += 1
                assert new == fb & 0xFB and new & CTRL_KEY == 0
                assert new | CTRL_KEY == fb          # Ctrl 비트만 바뀐다
            else:
                assert new == fb
    assert blocked == 32                             # 나머지 5비트의 조합
    # 예: Ctrl+Alt+Del (0Ch) -> 08h로 바뀜. 오른쪽 Shift까지(0Dh) -> 그대로
    assert int9_handler(0x0C, DEL_KEY) == (0x08, True)
    assert int9_handler(0x0D, DEL_KEY) == (0x0D, False)
    assert int9_handler(0x0C, 0x1E) == (0x0C, False)
    # 카드 C3: 플래그 2Ch(Num Lock + Alt + Ctrl), Del -> 28h
    assert int9_handler(0x2C, DEL_KEY) == (0x28, True)
    print("ALL CHECKS PASSED")
```
{% endraw %}
