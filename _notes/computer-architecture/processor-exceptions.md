---
layout: "note"
title: "예외 처리"
display_title: "예외 처리 (Exceptions)"
kind: "concept"
kind_label: "모델"
num: "32"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Exceptions", "예외", "Exception", "인터럽트", "Interrupt", "EPC", "Exception Program Counter", "Cause 레지스터", "Cause Register", "예외 처리기", "Exception Handler", "산술 넘침", "Arithmetic Overflow", "정의되지 않은 명령어", "Undefined Instruction", "정밀한 예외", "Precise Exception"]
description: "명령어를 실행하다가 계속할 수 없는 일이 생기면, 프로세서는 하던 일을 멈추고 미리 정해 둔 주소로 건너가 운영체제에 맡긴다. 계산대 직원이 처리할 수 없는 일이 생기면 그 손님에서 멈추고 어디까지 했는지 적어 둔 뒤 매니저를 부르는 것과 같다. 이때 문제를 일으킨 명령어가 어디 …"
prev_url: "/studies/computer-architecture/control-hazard-branch-prediction/"
prev_title: "제어 해저드와 분기 예측"
next_url: "/studies/computer-architecture/single-cycle-vs-pipeline/"
next_title: "단일 사이클과 파이프라인 비교"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-architecture/processor-exceptions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

명령어를 실행하다가 계속할 수 없는 일이 생기면, 프로세서는 하던 일을 멈추고 미리 정해 둔 주소로 건너가 운영체제에 맡긴다. 계산대 직원이 처리할 수 없는 일이 생기면 그 손님에서 멈추고 어디까지 했는지 적어 둔 뒤 매니저를 부르는 것과 같다. 이때 문제를 일으킨 명령어가 어디 있었는지와 무슨 일인지를 적어 둬야 돌아와서 이어 갈 수 있다. 여러 명령어가 겹쳐 흐르는 프로세서에서는 문제의 명령어보다 앞선 것은 끝내고 뒤따르던 것은 버려야 해서 일이 까다롭다.

</div>


## 예시로 보기

`add`는 두 수를 더한 결과가 32비트에 들어가지 않으면(넘침) 예외를 일으킨다. `$s3`에 32비트로 적을 수 있는 가장 큰 양수 `0x7FFFFFFF`가 들어 있다. `$s1` = 9, `$s2` = 5, `$t1` = 123이다.

```asm
 0: sub $t0, $s1, $s2     # 4
 4: add $t1, $s3, $s3     # 넘친다
 8: and $t2, $s1, $s2
12: or  $t3, $s1, $s2
16: slt $t4, $s1, $s2
```

넘친 결과를 그대로 `$t1`에 쓰고 다음으로 가면, 프로그램은 틀린 값을 들고 계속 달린다. 그래서 `add`가 아무것도 고치지 못하게 막고 운영체제의 처리 코드로 간다.

| 명령어 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| `sub $t0, $s1, $s2` | IF | ID | EX | MEM | WB |
| `add $t1, $s3, $s3` | | IF | ID | EX | 버림 |
| `and $t2, $s1, $s2` | | | IF | ID | 버림 |
| `or  $t3, $s1, $s2` | | | | IF | 버림 |

4번째 사이클에 `add`가 EX에서 넘침을 알린다. 그 사이클이 끝날 때 `add`와 뒤따르던 `and`, `or`를 버린다. 앞선 `sub`는 끝까지 간다. 끝나고 나면 `$t0` = 4, `$t1`은 123 그대로, `$t2`와 `$t3`도 그대로다. EPC에 4(`add`의 주소)가, Cause에 넘침을 뜻하는 값이 들어가고, PC는 `0x80000180`이 된다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, `$t0` = 4와 `$t1` = 123, EPC = 4, 버린 명령어 3개, 예외가 있는 단일 사이클 흉내기와 같은 결과 — [27_mips-pipeline_impl.py](/Hongs_Blog/studies/computer-architecture/code/27_mips-pipeline_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 예외와 인터럽트

둘 다 "뜻하지 않게 실행 흐름을 바꿔야 하는 일"이다. 교재는 어디서 생겼느냐로 가른다[^1].

| | 어디서 생기나 | 예 |
|---|---|---|
| 예외(exception) | 프로세서 안, 명령어를 실행하다가 | 정의되지 않은 명령어, 산술 넘침, 시스템 호출 |
| 인터럽트(interrupt) | 프로세서 밖, 입출력 장치가 보낸다 | 키보드 입력, 디스크가 읽기를 끝냄 |

이 낱말은 명령어 집합마다 다르게 쓴다[^1]. [운영체제 과목의 문서](/Hongs_Blog/studies/operating-systems/interrupt/)는 산술 넘침이나 잘못된 기계어처럼 명령어를 실행하다 생기는 것까지 묶어 인터럽트(프로그램 인터럽트)라 부른다.

## 프로세서가 하는 일

MIPS에서는 세 가지를 한다[^2].

1. **어디서 멈췄는지 적는다.** 문제를 일으킨(또는 끼어들기를 당한) 명령어의 주소를 EPC(exception program counter, 예외 프로그램 카운터)라는 레지스터에 넣는다.
2. **무슨 일인지 적는다.** 까닭을 Cause 레지스터에 넣는다.
3. **처리 코드로 건너간다.** PC에 정해진 주소 `0x8000 0180`을 넣는다. 그 주소에 운영체제의 예외 처리기가 있다.

EPC와 Cause는 `$t0` 같은 보통 레지스터가 아니다. 예외를 맡는 별도 장치(시스템 제어 보조 프로세서, CP0)에 들어 있다[^2].

Cause에 적는 값은 MIPS 참조표에 번호로 정해져 있다. 몇 가지만 든다[^3].

| 번호 | 이름 | 까닭 |
|---|---|---|
| 0 | Int | 인터럽트 (하드웨어) |
| 8 | Sys | 시스템 호출 |
| 10 | RI | 정의되지 않은 명령어 |
| 12 | Ov | 산술 넘침 |

**처리기가 하는 일.** Cause를 읽어 까닭에 맞는 코드로 간다. 고칠 수 있는 일이면 고친 뒤 EPC를 써서 프로그램으로 돌아간다. 고칠 수 없으면 프로그램을 끝내고 EPC와 Cause로 무슨 일이 있었는지 알린다[^4].

단일 사이클 데이터패스에 넣으려면 다음 PC를 고르는 멀티플렉서에 `0x8000 0180`을 입력으로 하나 더 주고, EPC와 Cause 레지스터를 달고, 예외가 났을 때 RegWrite와 MemWrite를 0으로 누르는 신호를 만든다[^s1].

## 파이프라인에서

예외는 [제어 해저드](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/)의 한 가지다. 다음에 가져올 명령어가 갑자기 바뀐다는 점에서 예측이 틀린 분기와 같고, 버리는 회로도 거의 그대로 쓴다[^5].

지켜야 할 것은 "차례로 하나씩 실행하다가 딱 그 명령어에서 멈춘 것처럼 보이게" 하는 것이다.

- 문제의 명령어보다 **앞선 명령어는 끝낸다.** 예시의 `sub`.
- **문제의 명령어는 버린다.** 넘친 `add`가 `$t1`을 덮어쓰면 안 된다. `add $t1, $t2, $t1`처럼 읽는 레지스터와 쓰는 레지스터가 같을 때 특히 그렇다. 덮어쓰고 나면 처리기가 원래 값을 볼 수 없다[^5].
- **뒤따르던 명령어도 버린다.** 예시의 `and`, `or`.
- EPC와 Cause를 채우고 처리기 주소에서 다음 명령어를 가져온다.

예시에서 넘침은 EX 단계에서 드러나므로 EX, ID, IF에 있던 세 명령어를 버렸다. 정의되지 않은 명령어는 해독하는 ID 단계에서 드러난다[^s1].

## 활용

- 운영체제가 프로그램 사이를 오가고, 입출력을 기다리지 않고, 잘못된 프로그램을 끝낼 수 있는 것이 모두 이 장치 덕이다. → [인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/)
- 넘침에 예외를 일으키는 것은 `add`, `sub`, `addi`다. `addu`, `subu`처럼 이름 끝에 u가 붙은 명령은 같은 계산을 하되 예외를 일으키지 않는다. C 컴파일러는 보통 u가 붙은 쪽을 쓴다[^s2].
- 흔한 실수: EPC에 처리기의 주소가 들어간다고 쓰는 것. EPC에는 돌아올 곳(문제를 일으킨 명령어의 주소)이 들어가고, 처리기의 주소는 PC에 들어간다.
- 흔한 실수: 예외가 나면 파이프라인 안의 명령어를 모두 버린다고 쓰는 것. 앞선 명령어는 끝낸다.

## 연결

- 선수: [제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/), [제어 장치와 제어 신호](/Hongs_Blog/studies/computer-architecture/control-unit/)
- 넘침을 알아내는 회로: [ALU](/Hongs_Blog/studies/computer-architecture/alu/). x86은 넘침을 예외가 아니라 플래그 1비트로 남긴다: [산술 연산과 상태 플래그](/Hongs_Blog/studies/assembly-language/x86-status-flags/)
- 돌아올 주소를 적어 두고 건너간다는 점은 `jal`과 같다: [MIPS 프로시저 호출](/Hongs_Blog/studies/computer-architecture/mips-procedure-call/). 다른 점은 프로그램이 부른 것이 아니라는 것, 그리고 적는 곳이 `$ra`가 아니라 EPC라는 것이다.
- 운영체제 쪽에서 본 처리 순서와 이득: [인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 예외가 나면 MIPS 프로세서가 하는 세 가지를 레지스터 이름을 넣어 쓰라.</summary>

**답:** ① 문제를 일으킨 명령어의 주소를 EPC에 넣는다. ② 까닭을 Cause 레지스터에 넣는다. ③ PC에 처리기 주소 `0x8000 0180`을 넣어 그곳으로 건너간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 넘친 `add $t1, $t2, $t1`이 결과를 `$t1`에 쓰도록 두면 안 되는 이유는?</summary>

**답:** 쓰는 레지스터가 읽는 레지스터와 같아서, 쓰고 나면 원래의 `$t1` 값이 사라진다. 처리기가 무슨 값끼리 더하다 넘쳤는지 볼 수 없고, 고친 뒤 그 명령어를 다시 실행할 수도 없다. "그 명령어가 시작되기 직전"의 상태를 그대로 남겨야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 본문의 다섯 명령어에서 넘침이 둘째 `add`가 아니라 셋째 자리(8번지)의 명령어에서 났다고 하자. 끝까지 가는 명령어, 버려지는 명령어, EPC의 값은?</summary>

**답:** 0번지와 4번지의 명령어는 끝까지 간다. 8번지(문제의 명령어), 12번지, 16번지의 명령어를 버린다. EPC = 8.<br>
**이유:** 8번지의 명령어가 EX에 있을 때(5번째 사이클) ID에는 12번지, IF에는 16번지의 명령어가 있다. 앞선 둘은 MEM과 WB 단계까지 가 있으므로 그대로 끝난다.

</details>


[^1]: 교재 출판사 강의 슬라이드 "Chapter 4 — The Processor" (Cooper Union 게시본), 슬라이드 63 (§4.9 Exceptions, Exceptions and Interrupts: 예외는 CPU 안에서, 인터럽트는 바깥 입출력 제어기에서. 명령어 집합마다 낱말을 다르게 쓴다), https://ee.cooper.edu/~curro/comparch/pipeline/chapter4_pipelining_END_FA11.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 4장 "The Processor"
[^2]: 같은 슬라이드, 64 (Handling Exceptions: CP0, EPC, Cause 레지스터, 처리기 주소). 슬라이드에는 주소가 "8000 00180"으로 숫자 하나가 더 찍혀 있다. 32비트 주소는 16진수 여덟 자리이므로 `8000 0180`으로 적었다.
[^3]: MIPS Reference Data (교재의 참조표, Univ. of Patras 게시본), EXCEPTION CODES 표, https://eclass.upatras.gr/modules/document/file.php/EE805/MIPS_Instruction_Set/MIPSReferenceData.pdf
[^4]: 같은 슬라이드, 65 (Handler Actions)
[^5]: 같은 슬라이드, 66 (Exceptions in a Pipeline: 제어 해저드의 한 형태, `add $1, $2, $1`의 넘침, 앞선 명령어는 끝내고 그 명령어와 뒤 명령어를 버린다, 예측이 틀린 분기와 비슷하다)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 단일 사이클 데이터패스에 보탤 부품과, 정의되지 않은 명령어가 ID에서 드러난다는 것은 연 슬라이드에 글로 없다. 넘침의 경우만 흉내기로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> MIPS 참조표에서 주석 "(1) May cause overflow exception"이 add·sub·addi에는 붙어 있고 addu·subu에는 없는 것을 확인했다. "C 컴파일러는 보통 u가 붙은 쪽을 쓴다"는 직접 확인하지 못했다[확인필요].
{% endraw %}
