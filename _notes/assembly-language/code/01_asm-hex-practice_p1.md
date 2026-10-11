---
layout: "note"
title: "01_asm-hex-practice_p1.py"
display_title: "01_asm-hex-practice_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "01"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/asm-hex-practice/"
parent_title: "16진 계산과 2의 보수 연습"
description: "어셈블리어 · 16진 계산과 2의 보수 연습 문제 1 풀이 코드"
permalink: "/studies/assembly-language/code/01_asm-hex-practice_p1/"
---
{% raw %}
[16진 계산과 2의 보수 연습](/Hongs_Blog/studies/assembly-language/asm-hex-practice/) 문서의 문제 1 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""16진 계산과 2의 보수 연습: 문제 1~6의 답 확인.

문서: 01.16진 계산과 2의 보수 연습 (이 파일 하나가 여섯 문제의 답을 모두 확인한다)
출처: 어셈블리어 2주차 2-1 p.13, 19~21 / 2-2 p.1~4, 23 / 3주차 3-3 p.18
또한 다음 문서의 "어셈블리어 (2-1학기)" 단락과 카드의 값도 여기서 확인한다:
  공학수학/대학수학 10.진법과 자릿수, 자료와 정보 02.정수의 2진 표현과 2의 보수, 04.부호와 부호화.
표준 라이브러리만 쓴다.
"""


def hex_add_steps(a, b, width):
    """오른쪽 자리부터: 두 글자와 올림을 더해 16으로 나눈 몫이 올림, 나머지가 그 자리 글자."""
    x, y = a.zfill(width), b.zfill(width)
    carry, digits, carries = 0, [], []
    for i in range(width - 1, -1, -1):
        t = int(x[i], 16) + int(y[i], 16) + carry
        carry, d = divmod(t, 16)
        digits.append("0123456789ABCDEF"[d])
        carries.append(carry)
    return "".join(reversed(digits)), carries, carry


def hex_sub_steps(a, b, width):
    """오른쪽 자리부터: 모자라면 16을 빌려 오고 왼쪽 자리에서 1을 뺀다."""
    x, y = a.zfill(width), b.zfill(width)
    borrow, digits, borrows = 0, [], []
    for i in range(width - 1, -1, -1):
        t = int(x[i], 16) - int(y[i], 16) - borrow
        borrow = 1 if t < 0 else 0
        if borrow:
            t += 16
        digits.append("0123456789ABCDEF"[t])
        borrows.append(borrow)
    return "".join(reversed(digits)), borrows, borrow


def twos(v, bits):
    return ((~v) + 1) & ((1 << bits) - 1)


def signed(v, bits):
    return v - (1 << bits) if v >> (bits - 1) else v


def main():
    # ---- 문제 1: 16진 덧셈 (2-1 p.19)
    for a, b, want in (("36", "42", "78"), ("28", "45", "6D"), ("28", "58", "80"), ("6A", "4B", "B5")):
        got, carries, out = hex_add_steps(a, b, 2)
        assert got == want and out == 0
        assert int(a, 16) + int(b, 16) == int(want, 16)
    assert 0xA + 0xB == 21 and divmod(21, 16) == (1, 5)          # 슬라이드의 "21 / 16 = 1, rem 5"
    assert hex_add_steps("6A", "4B", 2)[1] == [1, 0]             # 아래 자리에서만 올림
    assert hex_add_steps("28", "58", 2)[1] == [1, 0] and 8 + 8 == 16
    # 변형
    assert hex_add_steps("7C", "39", 2)[0] == "B5" and 0x7C + 0x39 == 0xB5
    got, carries, out = hex_add_steps("00400020", "0000004A", 8)
    assert got == "0040006A"
    got, carries, out = hex_add_steps("1A2B", "0F9E", 4)
    assert got == "29C9" and 0x1A2B + 0x0F9E == 0x29C9 and carries == [1, 0, 1, 0]
    print("[OK] 문제 1: 36+42=78, 28+45=6D, 28+58=80, 6A+4B=B5, 변형 7C+39=B5, 1A2B+0F9E=29C9")

    # ---- 문제 2: 16진 뺄셈 (2-1 p.20)
    for a, b, want in (("C6", "A2", "24"), ("75", "47", "2E")):
        got, borrows, out = hex_sub_steps(a, b, 2)
        assert got == want and out == 0
    assert hex_sub_steps("75", "47", 2)[1] == [1, 0] and 16 + 5 == 21 and 21 - 7 == 14 == 0xE
    got, borrows, out = hex_sub_steps("0040006A", "00400020", 8)
    assert got == "0000004A" and int(got, 16) == 74
    assert 0x0040006A - 0x00400020 == 74
    assert hex_sub_steps("B5", "4B", 2)[0] == "6A" and hex_sub_steps("0100", "001C", 4)[0] == "00E4"
    assert 0x00402030 - 0x00402000 == 0x30 == 48 and 48 // 4 == 12
    print("[OK] 문제 2: C6-A2=24, 75-47=2E, 0040006A-00400020=4Ah=74바이트, 변형 B5-4B=6A, 100-1C=E4, 30h=48")

    # ---- 문제 3: 저장 크기 (2-1 p.13, 2-2 p.4)
    assert 2 ** 20 - 1 == 1_048_575 == 0xFFFFF
    assert 2 ** 19 - 1 == 524_287 == 0x7FFFF and -(2 ** 19) == -524_288
    sizes = {"byte": 8, "word": 16, "doubleword": 32, "quadword": 64}
    assert [2 ** b - 1 for b in sizes.values()] == [255, 65_535, 4_294_967_295, 18_446_744_073_709_551_615]
    assert [(-(2 ** (b - 1)), 2 ** (b - 1) - 1) for b in sizes.values()] == [
        (-128, 127), (-32_768, 32_767), (-2_147_483_648, 2_147_483_647),
        (-9_223_372_036_854_775_808, 9_223_372_036_854_775_807)]
    assert 2 ** 12 - 1 == 4095 and 2 ** 11 - 1 == 2047
    print("[OK] 문제 3: 20비트 부호 없는 최댓값 1,048,575, 부호 있는 최댓값 524,287, 표 1-4와 부호 있는 범위 표")

    # ---- 문제 4: 2진 뺄셈 = 2의 보수 덧셈 (2-2 p.1~2)
    assert twos(0b00000001, 8) == 0b11111111 and (0b00000001 + 0b11111111) & 0xFF == 0
    assert twos(0b00000011, 8) == 0b11111101
    assert (0b00001100 + 0b11111101) & 0xFF == 0b00001001 == 12 - 3
    assert twos(0b0101, 4) == 0b1011
    assert (0b1001 + 0b1011) == 0b10100 and (0b1001 + 0b1011) & 0xF == 0b0100 == 9 - 5
    assert signed(0b1001, 4) == -7 and -7 - 5 == -12 < -8        # 부호 있는 4비트로는 범위 밖
    assert twos(0b0110, 4) == 0b1010 and (0b1100 + 0b1010) & 0xF == 0b0110 == 12 - 6
    for a in range(256):                                          # 8비트 전수 검사
        for b in range(256):
            assert (a + twos(b, 8)) & 0xFF == (a - b) & 0xFF
    print("[OK] 문제 4: 00001100-00000011=00001001, 1001-0101=0100, 8비트 65,536쌍에서 A-B = A+(B의 2의 보수)")

    # ---- 문제 5: 다섯 가지 바꾸기 (2-2 p.3, 2-1 p.21)
    assert twos(0x6A3D, 16) == 0x95C3 and (0x6A3D ^ 0xFFFF) == 0x95C2
    assert signed(0b11110000, 8) == -16 and twos(0b11110000, 8) == 0b00010000
    assert (-43) & 0xFF == 0b11010101 == 0xD5 and 43 == 0b00101011 and (43 ^ 0xFF) == 0b11010100
    assert signed(0xD5, 8) == -43
    assert [signed(v, 8) for v in (0x8A, 0xC5, 0xA2, 0x9D)] == [-118, -59, -94, -99]
    assert [twos(v, 8) for v in (0x8A, 0xC5, 0xA2, 0x9D)] == [0x76, 0x3B, 0x5E, 0x63]
    assert all(int(d, 16) > 7 for d in "8CA9") and signed(0x7F, 8) == 127 and signed(0x80, 8) == -128
    assert twos(0x00FF, 16) == 0xFF01 and signed(0xFF01, 16) == -255
    assert (-100) & 0xFF == 0x9C and signed(0x9C, 8) == -100
    assert signed(0xFFFF, 16) == -1 and signed(0x8000, 16) == -32768
    print("[OK] 문제 5: 6A3Dh→95C3h, 11110000b=-16, -43=11010101b=D5h, 8A/C5/A2/9D = -118/-59/-94/-99")

    # ---- 문제 6: 16진수로 적힌 글자 읽기 (2-2 p.23, 3-3 p.18)
    assert bytes.fromhex("54 68 65 20 45 6E 64").decode("ascii") == "The End"
    assert bytes.fromhex("42 69 6E 61 72 79").decode("ascii") == "Binary"
    assert "Hi!".encode("ascii").hex(" ").upper() == "48 69 21"
    assert ord("A") == 0x41 == 65 and ord("a") == 0x61 and ord("a") - ord("A") == 0x20 and ord(" ") == 0x20
    assert ord("0") == 0x30 == 48
    print('[OK] 문제 6: "The End", "Binary", "Hi!" = 48 69 21')

    # ---- 합친 문서의 값
    assert 0b1011001010011100 >> 15 == 1 and 0b1011001010011100 & 1 == 0          # 2-1 p.8 그림
    assert int("000101101010011110010100", 2) == 0x16A794                          # 2-1 p.15
    assert 0x1234 == 4660 and 0x3BA4 == 15268 and 422 == 0x1A6 and 37 == 0b100101   # p.16, 18, 11
    assert 0b00001001 == 9 and 4 + 7 == 11 == 0b00001011                           # p.10, 12
    assert "65".encode("ascii").hex() == "3635" and bytes([65]) == b"A"
    assert "9C".encode("ascii").hex().upper() == "3943" and len("01010101") == 8
    assert "ABC".encode("ascii") + b"\x00" == bytes.fromhex("41 42 43 00")
    assert 0xFFFF == 65_535 and 0x10FFFF == 1_114_111
    print("[OK] 합친 문서의 값: 비트 번호, 16A794h, 4,660, 15,268, 1A6h, 숫자 65의 세 가지 담기, 널 종료 문자열")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
