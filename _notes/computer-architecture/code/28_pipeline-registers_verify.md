---
layout: "note"
title: "28_pipeline-registers_verify.py"
display_title: "28_pipeline-registers_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/pipeline-registers/"
parent_title: "파이프라인 레지스터와 제어"
description: "컴퓨터 구조 · 파이프라인 레지스터와 제어 검증 코드"
sitemap: false
permalink: "/studies/computer-architecture/code/28_pipeline-registers_verify/"
---
{% raw %}
[파이프라인 레지스터와 제어](/Hongs_Blog/studies/computer-architecture/pipeline-registers/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 파이프라인 레지스터가 실어 나르는 것과 제어 신호가 쓰이는 단계 확인
# 실행: python3 28_pipeline-registers_verify.py
# 칸의 구성과 비트 수는 이 문서의 설계(27_mips-pipeline_impl.py의 흉내기)를 기준으로 센 것이다.
STAGES = ["IF", "ID", "EX", "MEM", "WB"]
# 제어 신호가 쓰이는 단계: 그 신호가 움직이는 부품이 있는 곳
USED_IN = {"RegDst": "EX", "ALUOp1": "EX", "ALUOp0": "EX", "ALUSrc": "EX",
           "Branch": "MEM", "MemRead": "MEM", "MemWrite": "MEM",
           "RegWrite": "WB", "MemtoReg": "WB"}
FIELDS = {
    "IF/ID":  {"PC+4": 32, "명령어": 32},
    "ID/EX":  {"PC+4": 32, "읽은 값 1": 32, "읽은 값 2": 32, "부호 확장한 값": 32, "rs": 5, "rt": 5, "rd": 5},
    "EX/MEM": {"분기 목표 주소": 32, "Zero": 1, "ALU 결과": 32, "읽은 값 2": 32, "쓸 레지스터 번호": 5},
    "MEM/WB": {"메모리에서 읽은 값": 32, "ALU 결과": 32, "쓸 레지스터 번호": 5},
}


def control_bits_in(reg):
    """그 레지스터를 지난 뒤에도 쓰일 신호만 싣는다."""
    after = {"IF/ID": 0, "ID/EX": 2, "EX/MEM": 3, "MEM/WB": 4}[reg]
    if reg == "IF/ID":
        return []                 # 아직 해독 전이라 신호가 없다
    return [s for s, st in USED_IN.items() if STAGES.index(st) >= after]


def stage_at(i, cycle):
    """쉬거나 버리는 일이 없을 때, i번째(1부터) 명령어가 cycle번째 사이클에 있는 단계."""
    k = cycle - i
    return STAGES[k] if 0 <= k < 5 else None


if __name__ == "__main__":
    assert len(control_bits_in("ID/EX")) == 9 and len(control_bits_in("EX/MEM")) == 5 and len(control_bits_in("MEM/WB")) == 2
    assert control_bits_in("EX/MEM") == ["Branch", "MemRead", "MemWrite", "RegWrite", "MemtoReg"]
    assert control_bits_in("MEM/WB") == ["RegWrite", "MemtoReg"]
    data = {k: sum(v.values()) for k, v in FIELDS.items()}
    assert data == {"IF/ID": 64, "ID/EX": 143, "EX/MEM": 102, "MEM/WB": 69}
    total = {k: data[k] + len(control_bits_in(k)) for k in FIELDS}
    assert total == {"IF/ID": 64, "ID/EX": 152, "EX/MEM": 107, "MEM/WB": 71}
    # 1번 명령어가 WB에 있는 5번째 사이클에 ID에는 4번 명령어가 있다
    assert stage_at(1, 5) == "WB" and stage_at(4, 5) == "ID" and [stage_at(i, 5) for i in range(1, 6)] == ["WB", "MEM", "EX", "ID", "IF"]
    # 그래서 쓸 레지스터 번호를 IF/ID에서 바로 가져오면 3칸 뒤 명령어의 번호가 된다
    assert 4 - 1 == 3
    # 예: lw $t0 / add $t1 / sub $t2 / and $t3 -> 5번째 사이클의 IF/ID에는 and가 있고, 그 rt 칸은 lw의 $t0가 아니다
    prog = [("lw", dict(rt=8)), ("add", dict(rt=18)), ("sub", dict(rt=20)), ("and", dict(rt=22))]
    in_id = [p for i, p in enumerate(prog, 1) if stage_at(i, 5) == "ID"][0]
    assert in_id[0] == "and" and in_id[1]["rt"] != prog[0][1]["rt"]
    print("ALL CHECKS PASSED")
```
{% endraw %}
