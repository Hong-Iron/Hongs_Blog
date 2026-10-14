---
layout: "note"
title: "33_type-system_verify.py"
display_title: "33_type-system_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "33"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/type-system/"
parent_title: "타입과 타입 시스템"
description: "컴파일러 · 타입과 타입 시스템 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/33_type-system_verify/"
---
{% raw %}
[타입과 타입 시스템](/Hongs_Blog/studies/compilers/type-system/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 33_type-system_verify.py
# 타입과 타입 시스템 문서의 수치를 확인한다. 슬라이드 L10 p.10의 요점
# "덧셈 명령은 레지스터에 든 비트를 그냥 더할 뿐, 그 비트가 정수인지 실수인지 모른다"를
# 3.5의 비트로 직접 보인다. 표준 라이브러리만 쓴다.
# 실행: python3 33_type-system_verify.py
import struct


def float_bits(x):
    """32비트 float x의 비트를 부호 없는 정수로 읽는다."""
    return struct.unpack("<I", struct.pack("<f", x))[0]


def bits_float(n):
    return struct.unpack("<f", struct.pack("<I", n & 0xFFFFFFFF))[0]


if __name__ == "__main__":
    # 3.5의 비트는 0x40600000. 정수로 읽으면 1,080,033,280이다
    assert float_bits(3.5) == 0x40600000 == 1080033280
    # 정수 1과 '3.5의 비트'를 정수 덧셈하면 4.5가 아니라 3.5보다 아주 조금 큰 수가 된다
    s = (1 + float_bits(3.5)) & 0xFFFFFFFF
    assert s == 0x40600001
    assert bits_float(s) != 4.5 and abs(bits_float(s) - 3.5) < 1e-6
    # 같은 덧셈이 두 피연산자가 모두 정수일 때는 맞는 답을 낸다 (int a = 0; int b = 1; a + b)
    assert (0 + 1) & 0xFFFFFFFF == 1
    # 같은 32비트라도 타입에 따라 뜻이 다르다: 0x41 은 int로 65, char로 'A'
    assert 0x41 == 65 and chr(0x41) == "A"
    # C의 선언 예(p.6)에서 int a[32]는 int 32칸
    assert struct.calcsize("<32i") == 32 * struct.calcsize("<i") == 128
    print("ALL CHECKS PASSED")
```
{% endraw %}
