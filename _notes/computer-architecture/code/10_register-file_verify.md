---
layout: "note"
title: "10_register-file_verify.py"
display_title: "10_register-file_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/register-file/"
parent_title: "레지스터 파일과 메모리 소자"
description: "컴퓨터 구조 · 레지스터 파일과 메모리 소자 검증 코드"
permalink: "/studies/computer-architecture/code/10_register-file_verify/"
---
{% raw %}
[레지스터 파일과 메모리 소자](/Hongs_Blog/studies/computer-architecture/register-file/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 10.레지스터 파일과 메모리 소자: 읽기 포트 2개(멀티플렉서), 쓰기 포트 1개(디코더)인 레지스터 파일을
# 흉내 내어 문서의 추적 표와 성질을 확인한다.
# 실행: python3 10_register-file_verify.py  (표준 라이브러리만 쓴다)
# 실제 하드웨어가 아니라 파이썬 흉내다. 클록의 상승 에지 하나를 clock_edge() 호출 하나로 본다.
import random


def decoder(k, n):
    """번호 k -> 2^n개 가운데 k번만 1"""
    return [int(i == k) for i in range(2 ** n)]


def mux(data, sel):
    """디코더 + AND + OR로 고르는 멀티플렉서(값은 정수로 다룬다)"""
    out = 0
    for hot, d in zip(decoder(sel, (len(data) - 1).bit_length()), data):
        out |= d if hot else 0
    return out


class RegisterFile:
    def __init__(self, nreg=32, width=32, zero_reg=True, init=None):
        self.nbits = (nreg - 1).bit_length()
        self.mask = (1 << width) - 1
        self.reg = list(init) if init else [0] * nreg
        self.zero_reg = zero_reg

    def read(self, r1, r2):
        """읽기는 조합 회로다. 번호만 주면 클록과 상관없이 지금 들어 있는 값이 나온다."""
        return mux(self.reg, r1), mux(self.reg, r2)

    def clock_edge(self, write_reg, write_data, reg_write):
        """상승 에지: 디코더 출력 AND RegWrite가 1인 레지스터 하나만 새 값을 잡는다."""
        enable = [hot & reg_write for hot in decoder(write_reg, self.nbits)]
        if self.zero_reg:
            enable[0] = 0                      # MIPS: 0번 레지스터는 늘 0
        assert sum(enable) <= 1
        self.reg = [write_data & self.mask if en else old for en, old in zip(enable, self.reg)]


if __name__ == "__main__":
    # 문서의 추적 표: 레지스터 4개 x 8비트, 처음 값 R0..R3 = 0, 7, 0, 0
    rf = RegisterFile(nreg=4, width=8, zero_reg=False, init=[0, 7, 0, 0])
    steps = [  # (읽기1, 읽기2, 쓰기 번호, 쓰기 값, RegWrite)
        (1, 2, 2, 25, 1),
        (2, 1, 3, 32, 1),
        (3, 2, 1, 99, 0),
        (1, 3, 1, 57, 1),
    ]
    seen, after = [], []
    for r1, r2, wr, wd, we in steps:
        seen.append(rf.read(r1, r2))           # 사이클 동안 보이는 값(에지 전)
        rf.clock_edge(wr, wd, we)
        after.append(list(rf.reg))
    assert seen == [(7, 0), (25, 7), (32, 25), (7, 32)], seen
    assert after == [[0, 7, 25, 0], [0, 7, 25, 32], [0, 7, 25, 32], [0, 57, 25, 32]], after
    assert 25 + 32 == 57
    # 같은 사이클에 같은 레지스터를 읽고 쓰면 읽히는 것은 옛값이다(첫 줄: R2를 읽으며 R2에 25를 쓴다)
    assert seen[0][1] == 0 and after[0][2] == 25
    # 디코더: 32개 가운데 하나만 켜진다. 쓰기 번호 5비트, 읽기 멀티플렉서는 32입력
    for k in range(32):
        d = decoder(k, 5)
        assert len(d) == 32 and sum(d) == 1 and d[k] == 1
    # 32 x 32 레지스터 파일을 사전 하나로 만든 본보기와 무작위 20,000사이클 비교
    rnd = random.Random(10)
    rf = RegisterFile()
    model = [0] * 32
    for _ in range(20000):
        r1, r2, wr = rnd.randrange(32), rnd.randrange(32), rnd.randrange(32)
        wd, we = rnd.getrandbits(32), rnd.randint(0, 1)
        assert rf.read(r1, r2) == (model[r1], model[r2])
        rf.clock_edge(wr, wd, we)
        if we and wr != 0:
            model[wr] = wd
        assert rf.reg == model and rf.reg[0] == 0
    # 플립플롭 수: 32 x 32 = 1,024개. 문서의 작은 예는 4 x 8 = 32개
    assert 32 * 32 == 1024 and 4 * 8 == 32
    # 카드 C2: R1 = 7, R2 = 25에서 한 사이클에 (읽기 R2, R2 / 쓰기 R2 <- 50, RegWrite 1)
    rf = RegisterFile(nreg=4, width=8, zero_reg=False, init=[0, 7, 25, 0])
    assert rf.read(2, 2) == (25, 25)
    rf.clock_edge(2, 50, 1)
    assert rf.read(2, 2) == (50, 50)
    # 카드 C3: RegWrite = 0이면 쓰기 번호와 값이 무엇이든 그대로다
    before = list(rf.reg)
    rf.clock_edge(1, 123, 0)
    assert rf.reg == before
    print("ALL CHECKS PASSED")
```
{% endraw %}
