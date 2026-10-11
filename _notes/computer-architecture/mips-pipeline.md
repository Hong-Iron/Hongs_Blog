---
layout: "note"
title: "5단계 파이프라인"
display_title: "5단계 파이프라인 (MIPS 5-Stage Pipeline)"
kind: "concept"
kind_label: "모델"
num: "27"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["MIPS Pipeline", "5-Stage Pipeline", "파이프라이닝", "Pipelining", "IF", "ID", "EX", "MEM", "WB", "Instruction Fetch", "Instruction Decode", "Execute", "Memory Access", "Write Back", "처리량", "Throughput", "해저드", "Hazard", "구조 해저드", "Structural Hazard"]
description: "명령어 하나를 다섯 걸음으로 나누고, 앞 명령어가 둘째 걸음으로 넘어가면 곧바로 다음 명령어를 첫 걸음에 넣는다. 김밥집에서 한 사람이 김밥 한 줄을 다 말고 나서 다음 줄을 시작하는 대신, 밥 펴기·속 넣기·말기·썰기·담기를 다섯 사람이 나란히 하는 것과 같다. 한 줄이 완성되는…"
prev_url: "/studies/computer-architecture/single-cycle-timing/"
prev_title: "단일 사이클의 클록 주기"
next_url: "/studies/computer-architecture/pipeline-registers/"
next_title: "파이프라인 레지스터와 제어"
math: true
mermaid: true
code_count: 1
permalink: "/studies/computer-architecture/mips-pipeline/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

명령어 하나를 다섯 걸음으로 나누고, 앞 명령어가 둘째 걸음으로 넘어가면 곧바로 다음 명령어를 첫 걸음에 넣는다. 김밥집에서 한 사람이 김밥 한 줄을 다 말고 나서 다음 줄을 시작하는 대신, 밥 펴기·속 넣기·말기·썰기·담기를 다섯 사람이 나란히 하는 것과 같다. 한 줄이 완성되는 데 드는 시간은 줄지 않지만, 같은 시간에 나오는 줄 수가 크게 는다. 다만 다섯 걸음의 길이가 고르지 않으면 가장 긴 걸음에 모두가 맞춰야 하고, 뒤 명령어가 앞 명령어의 결과를 기다려야 할 때는 줄이 밀린다.

</div>


## 예시로 보기

[단일 사이클](/Hongs_Blog/studies/computer-architecture/single-cycle-timing/)에서는 `lw` 하나가 950 ps 동안 회로 전체를 차지했다. 그런데 `lw`가 데이터 메모리를 읽는 동안 명령어 메모리와 레지스터 파일은 할 일이 없다. 그 빈 부품에 다음 명령어를 넣는다.

서로 상관없는 명령어 다섯 개를 넣으면 이렇게 된다. 가로는 사이클, 세로는 명령어다.

| 명령어 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| `lw $t0, 0($gp)` | IF | ID | EX | MEM | WB | | | | |
| `add $t1, $s1, $s2` | | IF | ID | EX | MEM | WB | | | |
| `sub $t2, $s3, $s4` | | | IF | ID | EX | MEM | WB | | |
| `and $t3, $s5, $s6` | | | | IF | ID | EX | MEM | WB | |
| `sw $t4, 4($gp)` | | | | | IF | ID | EX | MEM | WB |

5번째 사이클을 세로로 읽으면 다섯 단계가 모두 차 있다. 첫 명령어가 끝나는 데 5사이클이 들고, 그 뒤로는 사이클마다 하나씩 끝난다. 다섯 개에 9사이클이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 명령어 1·10·100·1,000개에서 사이클 수 = 명령어 수 + 4, 무작위 프로그램 4,000개 × 설정 4가지에서 레지스터·메모리·끝낸 순서가 단일 사이클 흉내기와 같음 — [27_mips-pipeline_impl.py](/Hongs_Blog/studies/computer-architecture/code/27_mips-pipeline_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 다섯 단계

[단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/)를 큰 부품 하나씩 다섯 토막으로 자른다[^1].

| 단계 | 이름 | 하는 일 | 쓰는 부품 |
|---|---|---|---|
| IF | 가져오기 (instruction fetch) | PC의 주소에서 명령어를 꺼내고 PC + 4를 구한다 | 명령어 메모리 |
| ID | 해독 (instruction decode) | 명령어를 풀어 제어 신호를 만들고 레지스터 둘을 읽는다 | 레지스터 파일 (읽기) |
| EX | 실행 (execute) | ALU로 계산하거나 주소를 구한다 | ALU |
| MEM | 메모리 (memory access) | 데이터 메모리를 읽거나 쓴다 | 데이터 메모리 |
| WB | 되쓰기 (write back) | 결과를 레지스터에 쓴다 | 레지스터 파일 (쓰기) |

```mermaid
flowchart LR
    IF["IF: 명령어 메모리"] --> R1["IF/ID"]
    R1 --> ID["ID: 레지스터 읽기"]
    ID --> R2["ID/EX"]
    R2 --> EX["EX: ALU"]
    EX --> R3["EX/MEM"]
    R3 --> MEM["MEM: 데이터 메모리"]
    MEM --> R4["MEM/WB"]
    R4 --> WB["WB: 레지스터 쓰기"]
    WB -.->|"쓸 값과 번호"| ID
```

단계 사이의 좁은 상자는 [파이프라인 레지스터](/Hongs_Blog/studies/computer-architecture/pipeline-registers/)다. 앞 단계가 만든 값을 한 사이클 동안 붙잡아 다음 단계에 건넨다. 점선은 오른쪽에서 왼쪽으로 거슬러 가는 선이다. WB가 쓰는 레지스터 파일은 ID가 읽는 그 부품이기 때문이다[^2].

모든 명령어가 다섯 단계를 다 지난다. `add`는 메모리를 쓰지 않지만 MEM 단계에서 한 사이클을 그냥 보낸다. 건너뛰게 하면 두 명령어가 같은 사이클에 WB에 닿을 수 있어서다[^s1].

레지스터 파일은 한 사이클의 앞 절반에 쓰고 뒤 절반에 읽는다고 놓는다. 그러면 WB가 쓴 값을 같은 사이클의 ID가 읽을 수 있다[^s2].

## 얼마나 빨라지나

**클록 주기.** 한 사이클은 한 단계만 끝내면 된다. 주기는 다섯 단계 가운데 가장 오래 걸리는 것으로 정한다.

$$T_c^{\text{파이프}} = \max(t_{IF}, t_{ID}, t_{EX}, t_{MEM}, t_{WB})$$


$$t_{IF}$$는 IF 단계가 걸리는 시간이고 나머지도 같다. 앞 문서의 부품 시간(250, 150, 200, 250, 100 ps)을 그대로 쓰면 주기는 250 ps다[^s3].

**명령어 하나가 끝나는 시간**은 $$5 \times 250 = 1250$$ ps다. 단일 사이클의 950 ps보다 오히려 길다. 짧은 단계도 250 ps를 채워야 하기 때문이다.

**명령어 사이의 간격**은 950 ps에서 250 ps로 준다. 다섯 단계의 시간이 똑같다면 간격은 정확히 5분의 1이 된다[^3].

$$\text{파이프라인의 명령어 간격} = \frac{\text{파이프라인 없을 때의 명령어 간격}}{\text{단계 수}} \quad (\text{단계가 고를 때})$$


이 예는 단계가 고르지 않아 $$950 \div 250 = 3.8$$배다. 다섯 단계가 똑같이 190 ps였다면 5배가 됐을 것이다.

**명령어 $$n$$개에 드는 시간.** 쉬거나 버리는 일이 없으면 $$n + 4$$사이클이다. 첫 명령어가 5사이클, 나머지 $$n - 1$$개가 1사이클씩이다.

| 명령어 수 | 단일 사이클 ($$n \times 950$$) | 파이프라인 ($$(n + 4) \times 250$$) | 몇 배 |
|---|---|---|---|
| 5 | 4,750 ps | 2,250 ps | 2.11 |
| 100 | 95,000 ps | 26,000 ps | 3.65 |
| 1,000 | 950,000 ps | 251,000 ps | 3.78 |

명령어가 많을수록 3.8배에 가까워진다. 처음 4사이클은 관이 채워지는 시간이라 명령어가 적으면 비중이 크다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표와 3.8배, 190 ps — [26_single-cycle-timing_verify.py](/Hongs_Blog/studies/computer-architecture/code/26_single-cycle-timing_verify/)</div>

</div>


### 왜 결과가 같은가

**주장.** 뒤 명령어가 앞 명령어의 결과를 쓰지 않고 분기도 없으면, 파이프라인은 명령어를 하나씩 차례로 실행한 것과 같은 결과를 낸다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">이유 펼치기</summary>

1. **한 명령어의 계산은 그대로다.** 다섯 단계를 차례로 지나며 하는 계산은 단일 사이클의 한 사이클에 하던 계산을 토막 낸 것이다. 토막 사이의 값은 파이프라인 레지스터가 그 명령어 몫으로 들고 간다. — 단계 사이 레지스터
2. **부품을 두고 다투지 않는다.** 같은 사이클에 다섯 명령어는 서로 다른 단계에 있고, 단계마다 쓰는 부품이 다르다. 명령어 메모리와 데이터 메모리가 따로 있어서 IF와 MEM이 부딪치지 않는다. 레지스터 파일은 ID가 읽고 WB가 쓰지만 읽는 구멍과 쓰는 구멍이 따로다. — 부품 목록
3. **읽는 값이 옳다.** 가정에 따라 뒤 명령어는 앞 명령어가 쓰는 레지스터를 읽지 않는다. 그러니 ID에서 읽은 값은 차례로 실행했을 때 읽었을 값과 같다. — 가정
4. **쓰는 순서가 같다.** 명령어는 들어온 순서대로 MEM과 WB에 닿는다. 메모리와 레지스터가 고쳐지는 순서가 원래 순서와 같다. — 모든 명령어가 같은 수의 단계를 지난다
5. 1~4에서 최종 레지스터와 메모리가 같다. ∎

3의 가정이 깨지면 [데이터 해저드](/Hongs_Blog/studies/computer-architecture/data-hazard-forwarding/), 분기가 있으면 [제어 해저드](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/)가 생긴다. 그때도 결과가 같도록 회로를 보태는 것이 뒤 문서들의 내용이다. 보탠 뒤의 파이프라인이 단일 사이클과 같은 결과를 내는지는 흉내기로 확인했다(실험이지 증명은 아니다).

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 2에서 메모리가 하나뿐이라면 무슨 일이 생기는가?</summary>

`lw`가 MEM 단계에서 데이터를 읽는 사이클에, 세 칸 뒤 명령어가 IF 단계에서 같은 메모리로 명령어를 꺼내려 한다. 둘 중 하나는 기다려야 한다. 부품이 모자라 생기는 이 막힘을 구조 해저드라 부른다[^4].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 4에서 "모든 명령어가 같은 수의 단계를 지난다"가 왜 필요한가?</summary>

`add`가 MEM을 건너뛰어 4단계만 지난다면, `lw` 바로 뒤의 `add`가 `lw`와 같은 사이클에 WB에 닿는다. 쓰는 구멍은 하나라 둘이 부딪친다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 명령어 하나가 끝나는 시간이 950 ps에서 1,250 ps로 늘었는데 왜 빨라졌다고 하는가?</summary>

프로그램의 실행 시간은 명령어 하나의 시간이 아니라 "모든 명령어가 끝나는 시각"이 정한다. 명령어가 250 ps마다 하나씩 끝나므로 $$n$$개가 끝나는 시각은 $$(n + 4) \times 250$$ ps다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 논증의 핵심 아이디어는?</summary>

"계산은 그대로 두고 시간만 겹친다." 겹쳐도 되는 조건은 두 가지다. 같은 사이클에 같은 부품을 쓰지 않을 것, 아직 쓰이지 않은 값을 읽지 않을 것.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

공장의 조립 줄, 유닉스 셸의 파이프(<code>a &#124; b &#124; c</code>에서 세 프로그램이 동시에 돌며 앞의 출력을 뒤가 받는다)가 같은 꼴이다. 둘 다 단계 사이에 물건을 잠깐 쌓아 두는 자리가 있다.

</details>


## 해저드 세 가지

다음 명령어를 다음 사이클에 바로 시작하지 못하게 하는 상황을 해저드(hazard)라 부른다[^4].

| 종류 | 무엇이 문제인가 | 다루는 문서 |
|---|---|---|
| 구조 해저드 | 두 명령어가 같은 사이클에 같은 부품을 쓰려 한다 | 메모리를 둘로 나눠 없앤다 (위 2) |
| 데이터 해저드 | 앞 명령어가 아직 쓰지 않은 값을 뒤 명령어가 읽으려 한다 | [데이터 해저드와 전방 전달](/Hongs_Blog/studies/computer-architecture/data-hazard-forwarding/), [적재-사용 해저드와 스톨](/Hongs_Blog/studies/computer-architecture/load-use-stall/) |
| 제어 해저드 | 분기가 어디로 갈지 정해지기 전에 다음 명령어를 가져와야 한다 | [제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/) |

## 활용

- **MIPS가 파이프라인에 잘 맞는 이유.** 명령어가 모두 32비트라 한 사이클에 꺼낼 수 있다. 형식이 몇 가지뿐이고 레지스터 번호의 자리가 같아서, 무슨 명령어인지 알기 전에 레지스터부터 읽을 수 있다. 메모리는 `lw`와 `sw`만 건드려서 주소 계산(EX)과 메모리 접근(MEM)이 차례로 놓인다. x86은 명령어 길이가 1~17바이트라 어디서 끊을지부터 알아내야 한다[^5]. → [RISC와 CISC 비교](/Hongs_Blog/studies/computer-architecture/risc-vs-cisc/)
- **단계를 더 잘게 자르면.** 주기는 더 짧아지지만 단계 사이 레지스터가 쓰는 시간은 줄지 않고, 분기를 틀렸을 때 버리는 명령어가 는다. 본문의 예에서 레지스터가 20 ps를 쓰면 주기는 270 ps, 3.52배가 된다[^s3].
- 흔한 실수: 사이클 수를 $$5n$$으로 세는 것. 겹쳐서 흐르므로 $$n + 4$$다.
- 흔한 실수: 파이프라인 주기를 "단일 사이클 주기 ÷ 5"로 구하는 것. 가장 긴 단계가 정한다.
- 구현: [27_mips-pipeline_impl.py](/Hongs_Blog/studies/computer-architecture/code/27_mips-pipeline_impl/). 연습: [파이프라인 해저드 예제 사다리](/Hongs_Blog/studies/computer-architecture/pipeline-hazard-ladder/)

## 연결

- 선수: [단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/), [단일 사이클의 클록 주기](/Hongs_Blog/studies/computer-architecture/single-cycle-timing/)
- 걸음 수 $$k$$와 명령어 수 $$n$$으로 쓴 일반식 $$k + (n - 1)$$: [파이프라인과 슈퍼스칼라](/Hongs_Blog/studies/assembly-language/instruction-pipeline/). 이 문서는 $$k = 5$$인 경우다.
- 처리량과 응답 시간의 구분: [성능과 실행 시간](/Hongs_Blog/studies/computer-architecture/cpu-performance/)
- 두 설계를 나란히: [단일 사이클과 파이프라인 비교](/Hongs_Blog/studies/computer-architecture/single-cycle-vs-pipeline/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"5단계 파이프라인은 명령어 하나를 다섯 배 빨리 실행한다"</div>

틀렸다. 명령어 하나가 끝나는 데 드는 시간은 줄지 않고 오히려 는다. 본문의 예에서 950 ps가 1,250 ps가 됐다. 프로그램이 몇 배 빨라졌다는 말을 듣고 명령어 하나하나가 빨라졌다고 받아들이기 쉬워서 그럴듯해 보인다. 실제로 줄어드는 것은 명령어와 명령어 사이의 간격이다. 950 ps마다 하나씩 끝나던 것이 250 ps마다 하나씩 끝난다. 그것도 단계가 고르지 않으면 5배가 아니라 3.8배다. 확인하는 법: 명령어를 딱 하나만 넣으면 단일 사이클은 950 ps, 파이프라인은 $$5 \times 250 = 1250$$ ps가 든다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다섯 단계의 이름과 각 단계가 쓰는 큰 부품을 차례로 쓰라.</summary>

**답:** IF(명령어 메모리) → ID(레지스터 파일 읽기) → EX(ALU) → MEM(데이터 메모리) → WB(레지스터 파일 쓰기).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 서로 상관없는 명령어 I1~I7을 차례로 넣는다. 6번째 사이클에 각 단계에 있는 명령어는? 일곱 개가 모두 끝나는 것은 몇 번째 사이클인가?</summary>

**답:** 6번째 사이클: IF에 I6, ID에 I5, EX에 I4, MEM에 I3, WB에 I2. 모두 끝나는 것은 $$7 + 4 = 11$$번째 사이클.<br>
**이유:** $$i$$번째 명령어는 $$i$$번째 사이클에 IF에 들어가 $$i + 4$$번째 사이클에 WB를 지난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 단계 사이에 놓인 레지스터가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 앞 단계가 이번 사이클에 만든 값을 붙잡아 두었다가 다음 사이클에 다음 단계로 넘겨, 앞 단계가 곧바로 다음 명령어를 받아도 값이 섞이지 않게 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 다섯 단계가 각각 300, 100, 250, 300, 100 ps 걸린다. 단일 사이클 주기, 파이프라인 주기, 명령어가 아주 많을 때의 빠르기 비를 구하라.</summary>

**답:** 단일 사이클 1,050 ps, 파이프라인 300 ps, 3.5배.<br>
**이유:** 단일 사이클은 다섯을 더하고 파이프라인은 가장 큰 것을 고른다. $$1050 \div 300 = 3.5$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 단계가 다섯 개인데 왜 빨라지는 폭이 5배보다 작은가? 두 가지 이유를 대라.</summary>

**답:** ① 단계의 시간이 고르지 않다. 주기를 가장 긴 단계에 맞추므로 짧은 단계는 시간을 남긴다. ② 해저드 때문에 쉬거나 버리는 사이클이 생긴다. (단계 사이 레지스터가 쓰는 시간과, 처음 4사이클 동안 관이 채워지는 시간도 있다.)

</details>


[^1]: 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 1 (MIPS Pipeline: 다섯 단계의 이름과 하는 일), https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor"
[^2]: 같은 슬라이드, 18~19 (§4.6 Pipelined Datapath and Control: 오른쪽에서 왼쪽으로 가는 흐름이 해저드를 만든다, 단계 사이에 레지스터가 필요하다)
[^3]: 같은 슬라이드, 2~4 (Pipeline Performance, Pipeline Speedup: 단계가 고르면 간격이 단계 수로 나뉜다, 고르지 않으면 덜 빨라진다, 명령어 하나의 시간은 줄지 않는다)
[^4]: 같은 슬라이드, 6~7 (Hazards, Structure Hazards)
[^5]: 같은 슬라이드, 5 (Pipelining and ISA Design)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> "건너뛰면 WB에서 부딪친다"는 설명은 연 자료에 글로 없다. 단계 수가 다른 두 명령어가 같은 사이클에 WB에 닿는 경우를 직접 따져 적었다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 앞 절반에 쓰고 뒤 절반에 읽는다는 약속은 교재 4장의 것으로 기억하지만 연 자료에서 글로 확인하지 못했다[확인필요]. 흉내기는 이 약속대로 만들었다.
[^s3]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 부품 시간과 그것으로 계산한 수치(250 ps, 1,250 ps, 3.8배, 표의 값, 270 ps)는 [단일 사이클의 클록 주기](/Hongs_Blog/studies/computer-architecture/single-cycle-timing/)에서 직접 정한 값에서 나온 것이다. 교재의 수치가 아니다.
{% endraw %}
