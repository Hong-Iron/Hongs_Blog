---
layout: "note"
title: "52_int21h-file-disk-functions_verify.py"
display_title: "52_int21h-file-disk-functions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "52"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/int21h-file-disk-functions/"
parent_title: "INT 21h 파일·디스크 함수"
description: "어셈블리어 · INT 21h 파일·디스크 함수 검증 코드"
sitemap: false
permalink: "/studies/assembly-language/code/52_int21h-file-disk-functions_verify/"
---
{% raw %}
[INT 21h 파일·디스크 함수](/Hongs_Blog/studies/assembly-language/int21h-file-disk-functions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 52.INT 21h 파일·디스크 함수 문서의 계산 확인. 실행: python3 52_int21h-file-disk-functions_verify.py
# 파일을 실제로 만들거나 섹터를 읽지 않는다. 문서에 적힌 상수와 구조체 크기만 계산한다.
import struct

if __name__ == "__main__":
    # 716Ch: AX 전체가 함수 번호다. AH = 71h, AL = 6Ch
    ax = 0x716C
    assert (ax >> 8, ax & 0xFF) == (0x71, 0x6C)
    # 동작 값은 더해서 쓴다: create(10h) + truncate(02h) = 12h
    assert 0x10 + 0x02 == 0x12 == (0x10 | 0x02)
    # 속성 값이 비트 깃발이라면 3 = 1(read only) OR 2(hidden)
    assert 1 | 2 == 3
    assert [1 << k for k in range(6)] == [1, 2, 4, 8, 0x10, 0x20]
    # 문서 표의 속성 값: 0이 아닌 값은 모두 비트 하나이고 서로 겹치지 않는다.
    # 시스템은 4(FAT 명세의 ATTR_SYSTEM = 0x04). 3은 시스템이 아니라 읽기 전용 + 숨김이다
    attrs = {"normal": 0, "read only": 1, "hidden": 2, "system": 4, "volume": 8, "archive": 0x20}
    bits = [v for v in attrs.values() if v]
    assert all(v & (v - 1) == 0 for v in bits) and len(set(bits)) == len(bits)
    acc = 0
    for v in bits:
        assert acc & v == 0
        acc |= v
    assert attrs["read only"] | attrs["hidden"] == 3 != attrs["system"]

    # DISKIO 구조체: DWORD + WORD + WORD + WORD = 10바이트, 리틀 엔디언
    fmt = "<IHHH"
    assert struct.calcsize(fmt) == 10
    raw = struct.pack(fmt, 0, 1, 0x0000, 0x1234)   # startSector 0, numSectors 1
    assert raw[:4] == b"\x00\x00\x00\x00" and raw[4:6] == b"\x01\x00"
    offsets = {"startSector": 0, "numSectors": 4, "bufferOfs": 6, "bufferSeg": 8}
    assert offsets["bufferSeg"] + 2 == 10
    # 버퍼 512바이트 = 섹터 하나
    assert 512 == 0x200
    # 7305h: AH = 73h, AL = 05h. CX는 늘 0FFFFh
    assert (0x7305 >> 8, 0x7305 & 0xFF) == (0x73, 0x05) and 0xFFFF == 65535
    # 7303h, 5706h도 AX 전체가 번호
    assert (0x7303 >> 8, 0x5706 >> 8) == (0x73, 0x57)

    # 경로 문자열은 0으로 끝난다: "\ASM",0 은 5바이트, 'C:\ASM',0 은 7바이트
    assert len(b"\\ASM\x00") == 5 and len(b"C:\\ASM\x00") == 7

    # 성공·실패 갈림: jc failed. CF=1이면 AX는 핸들이 아니라 오류 코드
    def after_open(cf, ax):
        return ("error", ax) if cf else ("handle", ax)
    assert after_open(0, 5) == ("handle", 5) and after_open(1, 2) == ("error", 2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
