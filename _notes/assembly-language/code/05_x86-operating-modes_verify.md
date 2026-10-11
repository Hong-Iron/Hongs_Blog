---
layout: "note"
title: "05_x86-operating-modes_verify.py"
display_title: "05_x86-operating-modes_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/x86-operating-modes/"
parent_title: "x86 동작 모드"
description: "어셈블리어 · x86 동작 모드 검증 코드"
permalink: "/studies/assembly-language/code/05_x86-operating-modes_verify/"
---
{% raw %}
[x86 동작 모드](/Hongs_Blog/studies/assembly-language/x86-operating-modes/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""x86 동작 모드 검증.

문서: 05.x86 동작 모드
출처: 어셈블리어 3주차 3-2 p.5, 7 / 3-3 p.8, 11~12 / 13주차 2-1 p.4, 6
주장:
  1. 주소가 20비트면 2^20 = 1,048,576바이트 = 1MB, 주소는 00000h ~ FFFFFh.
  2. 주소가 32비트면 2^32 = 4,294,967,296바이트 = 4GB, 주소는 00000000h ~ FFFFFFFFh.
  3. 4GB는 1MB의 4,096배다.
  4. 페이지 하나는 4,096바이트 = 2^12. 4GB는 1,048,576쪽이다.
  5. 카드: 24비트 주소면 16MB.
"""


def main():
    assert 2 ** 20 == 1_048_576 == 1024 * 1024
    assert 2 ** 20 - 1 == 0xFFFFF
    print("[OK] 20비트 주소: 1,048,576바이트 = 1MB, 끝 주소 FFFFFh")

    assert 2 ** 32 == 4_294_967_296 == 4 * 1024 ** 3
    assert 2 ** 32 - 1 == 0xFFFFFFFF
    print("[OK] 32비트 주소: 4GB, 끝 주소 FFFFFFFFh")

    assert 2 ** 32 // 2 ** 20 == 4096
    assert 4096 == 2 ** 12 and 2 ** 32 // 4096 == 1_048_576
    print("[OK] 4GB = 1MB × 4,096, 페이지 4,096바이트면 1,048,576쪽")

    assert 2 ** 24 == 16 * 1024 * 1024
    print("[OK] 카드: 24비트 주소 → 16MB")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
