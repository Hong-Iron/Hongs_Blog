---
layout: "note"
title: "파이프라인 레지스터와 제어"
display_title: "파이프라인 레지스터와 제어 (Pipeline Registers and Pipelined Control)"
kind: "concept"
kind_label: "모델"
num: "28"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Pipeline Registers", "파이프라인 레지스터", "IF/ID", "ID/EX", "EX/MEM", "MEM/WB", "파이프라인 제어", "Pipelined Control", "단계 레지스터"]
description: "이어달리기에서 주자는 바통을 다음 주자에게 넘기고 곧바로 다음 바통을 받으러 돌아간다. 파이프라인의 단계 사이에도 바통 구실을 하는 저장 칸이 있어서, 앞 단계가 만든 값과 \"이 명령어는 무엇을 해야 하는가\"라는 쪽지를 함께 실어 다음 단계로 넘긴다. 이 칸 덕분에 다섯 명령어가 …"
prev_url: "/studies/computer-architecture/mips-pipeline/"
prev_title: "5단계 파이프라인"
next_url: "/studies/computer-architecture/data-hazard-forwarding/"
next_title: "데이터 해저드와 전방 전달"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "28_pipeline-registers_verify.py", "u": "/studies/computer-architecture/code/28_pipeline-registers_verify/", "r": "검증"}]
permalink: "/studies/computer-architecture/pipeline-registers/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

이어달리기에서 주자는 바통을 다음 주자에게 넘기고 곧바로 다음 바통을 받으러 돌아간다. 파이프라인의 단계 사이에도 바통 구실을 하는 저장 칸이 있어서, 앞 단계가 만든 값과 "이 명령어는 무엇을 해야 하는가"라는 쪽지를 함께 실어 다음 단계로 넘긴다. 이 칸 덕분에 다섯 명령어가 한 회로 안에서 섞이지 않는다. 다만 뒤 단계에서 쓸 것을 하나라도 빠뜨리고 넘기면, 그 자리에 엉뚱한 명령어의 값이 들어온다.

</div>


## 예시로 보기

단계 사이에 저장 칸이 없다고 하자. `lw $t0, 0($gp)`가 MEM 단계에서 메모리를 읽고 있을 때, 명령어 메모리는 이미 세 칸 뒤 명령어를 내보내고 있다. `lw`가 "어느 레지스터에 쓸지"를 명령어 메모리 쪽에서 다시 읽으려 하면 남의 명령어를 읽게 된다.

명령어 네 개를 차례로 넣고 5번째 사이클을 본다.

| 명령어 | 5번째 사이클에 있는 단계 |
|---|---|
| `lw  $t0, 0($gp)` | WB (지금 레지스터에 쓴다) |
| `add $t1, $s1, $s2` | MEM |
| `sub $t2, $s3, $s4` | EX |
| `and $t3, $s5, $s6` | ID |

`lw`가 쓸 번호는 `$t0`다. 그런데 이 사이클에 해독 단계의 명령어 칸에 들어 있는 것은 `and`다. 쓸 번호를 거기서 가져오면 메모리에서 읽은 값이 `$t0`가 아닌 엉뚱한 레지스터에 들어간다. 그래서 `lw`는 자기의 쓸 번호를 ID에서 WB까지 직접 들고 가야 한다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 5번째 사이클의 단계 배치, 쓸 번호를 들고 가지 않으면 3칸 뒤 명령어의 번호가 쓰임, 아래 표의 비트 수와 제어 신호 개수(9 → 5 → 2) — [28_pipeline-registers_verify.py](/Hongs_Blog/studies/computer-architecture/code/28_pipeline-registers_verify/)</div>

</div>


## 네 개의 레지스터

단계 사이마다 하나씩, 앞뒤 단계의 이름을 붙여 부른다[^2]. 클록이 올라갈 때마다 앞 단계의 결과를 받아 한 사이클 동안 들고 있다. 따로 쓰기 신호가 없고 사이클마다 새 값을 받는다(멈춰야 할 때만 예외다: [적재-사용 해저드와 스톨](/Hongs_Blog/studies/computer-architecture/load-use-stall/)).

| 레지스터 | 실어 나르는 값 | 누가 쓰나 |
|---|---|---|
| IF/ID | 명령어 32비트, PC + 4 | ID가 해독하고 레지스터를 읽는다 |
| ID/EX | 레지스터에서 읽은 값 둘, 부호 확장한 값, PC + 4, 레지스터 번호 rs·rt·rd | EX의 ALU와 분기용 가산기 |
| EX/MEM | ALU 결과, Zero, 분기 목표, 읽은 값 2(`sw`가 쓸 값), 쓸 레지스터 번호 | MEM의 데이터 메모리 |
| MEM/WB | 메모리에서 읽은 값, ALU 결과, 쓸 레지스터 번호 | WB가 레지스터에 쓴다 |

규칙은 하나다. 뒤 단계에서 한 번이라도 쓸 값은 그 단계에 닿을 때까지 모든 레지스터를 거쳐 실어 보낸다. ALU 결과가 MEM/WB에도 있는 것은 R형이 WB에서 그 값을 쓰기 때문이다. 쓸 레지스터 번호는 EX에서 rt와 rd 가운데 하나로 정해진 뒤 EX/MEM, MEM/WB를 거쳐 WB까지 간다.

IF/ID는 $$32 + 32 = 64$$비트다. 나머지의 크기는 무엇을 싣느냐에 따라 달라진다. 위 표대로면 값만 143, 102, 69비트다[^s1].

## 제어 신호도 함께 간다

제어 신호는 [단일 사이클](/Hongs_Blog/studies/computer-architecture/control-unit/)과 똑같이 ID 단계에서 opcode를 보고 만든다[^3]. 다른 점은 쓰는 때다. 단일 사이클에서는 만든 사이클에 다 썼지만, 여기서는 신호마다 쓰이는 단계가 다르다. 그래서 신호를 쓰이는 단계별로 세 묶음으로 나눠 명령어와 함께 실어 보낸다.

| 묶음 | 신호 | 쓰이는 까닭 |
|---|---|---|
| EX에서 쓴다 | RegDst, ALUOp(2비트), ALUSrc | 쓸 번호 고르기, ALU의 연산과 둘째 입력이 EX에 있다 |
| MEM에서 쓴다 | Branch, MemRead, MemWrite | 데이터 메모리와 분기 판정이 MEM에 있다 |
| WB에서 쓴다 | RegWrite, MemtoReg | 레지스터 쓰기와 쓸 값 고르기가 WB에 있다 |

묶음은 "그 신호가 움직이는 부품이 어느 단계에 있는가"로 정했다[^s2].

쓰고 난 묶음은 버린다. 그래서 실려 가는 신호가 단계를 지날수록 준다.

```
ID에서 만든 9비트
   │
[ID/EX]   EX 묶음 4 + MEM 묶음 3 + WB 묶음 2  = 9비트
   │      EX에서 4비트를 쓰고 버린다
[EX/MEM]              MEM 묶음 3 + WB 묶음 2  = 5비트
   │      MEM에서 3비트를 쓰고 버린다
[MEM/WB]                           WB 묶음 2  = 2비트
```

이 구조 덕분에 "명령어를 없던 일로 만들기"가 쉽다. 그 명령어의 제어 신호를 모두 0으로 바꾸면 된다. RegWrite와 MemWrite가 0이면 아무것도 고치지 않으므로, 나머지 단계를 지나가도 흔적이 없다. 이렇게 속이 빈 채 지나가는 칸을 거품(bubble)이라 부른다[^4].

## 활용

- 해저드를 알아채는 회로는 모두 이 레지스터에 실린 값을 읽는다. "EX/MEM에 있는 명령어의 쓸 번호가 ID/EX에 있는 명령어의 rs와 같은가"처럼 묻는다. 표기는 `EX/MEM.RegisterRd`처럼 "레지스터 이름.칸 이름"으로 쓴다[^5]. → [데이터 해저드와 전방 전달](/Hongs_Blog/studies/computer-architecture/data-hazard-forwarding/)
- 흔한 실수: 제어 신호를 단계마다 다시 만든다고 생각하는 것. ID에서 한 번 만들고 실어 보낸다. 뒤 단계에는 opcode가 없다.
- 흔한 실수: WB에서 쓸 레지스터 번호를 IF/ID에서 가져오는 것. 그 자리에는 세 칸 뒤 명령어가 있다.

## 연결

- 선수: [5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/), [제어 장치와 제어 신호](/Hongs_Blog/studies/computer-architecture/control-unit/)
- 클록이 올라갈 때 값을 붙잡는 소자: [클록과 순차 회로](/Hongs_Blog/studies/computer-architecture/clocked-sequential-logic/)
- 이 레지스터의 값을 견줘 해저드를 푸는 법: [데이터 해저드와 전방 전달](/Hongs_Blog/studies/computer-architecture/data-hazard-forwarding/), [적재-사용 해저드와 스톨](/Hongs_Blog/studies/computer-architecture/load-use-stall/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 제어 신호를 쓰이는 단계별 세 묶음으로 나눠 쓰라. ID/EX, EX/MEM, MEM/WB에 실리는 제어 신호는 각각 몇 비트인가?</summary>

**답:** EX: RegDst, ALUOp(2비트), ALUSrc. MEM: Branch, MemRead, MemWrite. WB: RegWrite, MemtoReg. 실리는 비트는 9, 5, 2.<br>
**이유:** 쓰고 난 묶음은 다음 레지스터에 싣지 않는다. $$4 + 3 + 2 = 9$$, $$3 + 2 = 5$$, $$2$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `add`는 데이터 메모리를 쓰지 않는데도 ALU 결과를 EX/MEM과 MEM/WB 두 레지스터에 실어 보낸다. 왜인가?</summary>

**답:** `add`가 결과를 레지스터에 쓰는 것은 두 단계 뒤인 WB에서다. 그 사이 EX 단계에는 다음 명령어가, MEM 단계에는 그다음 명령어가 들어와 ALU 출력이 바뀐다. 자기 결과를 들고 가지 않으면 WB에서 남의 결과를 쓰게 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `sw $t0, 12($s3)`가 지나갈 때, EX/MEM 레지스터의 칸 가운데 이 명령어가 실제로 쓰는 값 둘과 MEM 묶음 신호의 값을 쓰라.</summary>

**답:** 값: ALU 결과(주소 = `$s3` + 12)와 읽은 값 2(`$t0`의 값, 메모리에 쓸 값). 신호: Branch 0, MemRead 0, MemWrite 1.<br>
**이유:** `sw`는 레지스터에 쓰지 않으므로 쓸 레지스터 번호 칸은 실려 가지만 쓰이지 않는다(WB 묶음의 RegWrite가 0).

</details>


[^1]: 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 25~26 (WB for Load: 틀린 레지스터 번호, Corrected Datapath for Load), https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf
[^2]: 같은 슬라이드, 19 (Pipeline registers: 앞 사이클에 만든 정보를 들고 있을 레지스터가 단계 사이에 필요하다). Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor"
[^3]: 같은 슬라이드, 33~35 (Pipelined Control: 제어 신호는 단일 사이클 구현처럼 명령어에서 만든다)
[^4]: 같은 슬라이드, 47 (How to Stall the Pipeline: ID/EX의 제어 값을 0으로 만들면 EX·MEM·WB가 아무 일도 하지 않는다)
[^5]: 같은 슬라이드, 38 (Detecting the Need to Forward: ID/EX.RegisterRs 같은 표기)
[^s1]: 143, 102, 69비트는 위 표의 칸을 그대로 더한 값이고 교재의 수치가 아니다. 전방 전달에 쓰는 rs 번호까지 실었기 때문에 교재의 그림과 다를 수 있다.
[^s2]: 단일 사이클 데이터패스에서 각 신호가 닿는 부품이 다섯 단계 가운데 어디에 놓이는지로 정했다. Branch를 MEM 묶음에 둔 것은 분기를 MEM 단계에서 정하는 기본 설계를 따른 것이다. 분기를 ID에서 정하도록 고친 설계([제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/))에서는 Branch가 ID에서 쓰인다.
{% endraw %}
