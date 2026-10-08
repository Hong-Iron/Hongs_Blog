---
layout: "note"
title: "버퍼 오버플로 방어"
display_title: "버퍼 오버플로 방어 (Buffer Overflow Defenses)"
kind: "concept"
kind_label: "모델"
num: "68"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-08"
status: "verified"
aliases: ["Buffer Overflow", "Stack Buffer Overflow", "스택 버퍼 오버플로", "컴파일 시간 방어", "Compile-Time Defenses", "실행 시간 방어", "Run-Time Defenses", "스택 보호", "Stack Protection", "카나리", "Canary", "실행 불가 메모리", "NX", "주소 공간 무작위화", "ASLR", "Address Space Randomization", "가드 페이지", "Guard Pages"]
description: "버퍼 오버플로는 프로그램이 정해진 크기의 칸(버퍼)에 그보다 긴 입력을 넣어 옆 칸까지 덮어쓰는 오류다. 스택에서는 함수가 끝나고 돌아갈 주소까지 덮을 수 있어, 공격자가 그 주소를 자기 코드로 바꿔 놓으면 프로그램을 빼앗는다. 막는 방법은 두 갈래다. 프로그램을 만들 때 애초에 …"
prev_url: "/studies/operating-systems/malware-countermeasures/"
prev_title: "악성 코드 대응"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/buffer-overflow-defenses/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

버퍼 오버플로는 프로그램이 정해진 크기의 칸(버퍼)에 그보다 긴 입력을 넣어 옆 칸까지 덮어쓰는 오류다. 스택에서는 함수가 끝나고 돌아갈 주소까지 덮을 수 있어, 공격자가 그 주소를 자기 코드로 바꿔 놓으면 프로그램을 빼앗는다. 막는 방법은 두 갈래다. 프로그램을 만들 때 애초에 넘치지 않게 하는 것(컴파일 시간 방어)과, 이미 있는 프로그램이 공격받아도 공격이 통하지 않게 메모리 관리를 바꾸는 것(실행 시간 방어)이다.

</div>


## 예시로 보기

C 함수 안에 8바이트 배열이 있고, 입력 길이를 확인하지 않고 복사한다[^s1].

```c
void greet(char *input) {
    char buf[8];
    strcpy(buf, input);   /* input 길이를 확인하지 않음 */
}
```

스택에는 대략 이렇게 놓인다(위가 높은 주소).

```
| 돌아갈 주소 (return address) |  ← 덮이면 함수가 끝날 때 공격자가 정한 곳으로 간다
| 이전 프레임 포인터          |
| buf[0..7]                  |  ← 여기서부터 위로 채워 나간다
```

입력이 20바이트면 `buf` 8바이트를 넘어 프레임 포인터와 돌아갈 주소까지 덮는다. 공격자가 입력 안에 기계어를 넣고 돌아갈 주소를 그 기계어의 위치로 바꾸면, 함수가 끝나는 순간 공격자의 코드가 실행된다.

## 정확히 말하면

스택 버퍼 오버플로에 대한 방어는 크게 둘이다[^1].

### 컴파일 시간 방어

새 프로그램을 공격에 견디게 단단히 만든다[^2].

| 방법 | 내용 |
|---|---|
| 프로그래밍 언어 선택 | 안전하지 않은 코딩을 허락하지 않는 언어(배열 경계를 검사하는 자바, 파이썬 등)를 쓴다 |
| 안전한 코딩과 감사 | 프로그래머가 코드를 검사해 안전하지 않은 구조를 안전하게 다시 쓴다. 대대적인 코드 감사를 하기도 한다[^3] |
| 언어 확장과 안전한 라이브러리 | 컴파일러가 배열 참조에 범위 검사를 자동으로 넣게 하거나, `strcpy` 대신 길이를 받는 함수를 쓴다[^3] |
| 스택 보호 기법 | 함수 진입 때 돌아갈 주소 앞에 임의의 값(카나리)을 두고, 함수가 끝날 때 그 값이 그대로인지 확인한다. 바뀌었으면 넘침으로 보고 프로그램을 멈춘다[^s1] |

### 실행 시간 방어

프로세스 가상 주소 공간의 메모리 관리를 바꾼다. 메모리 영역의 속성을 바꾸거나, 노리는 버퍼의 위치를 예측하기 어렵게 만들어 많은 공격을 막는다[^4].

| 방법 | 내용 |
|---|---|
| 실행 가능 주소 공간 보호 | 많은 공격이 기계어를 버퍼에 복사한 뒤 그리로 실행을 옮긴다. 스택(과 힙)의 코드 실행을 막으면 이 공격이 통하지 않는다. 페이지 표 항목에 실행 금지 비트를 두어 하드웨어로 막는다[^4] |
| 주소 공간 무작위화 | 스택, 힙, 라이브러리의 위치를 실행할 때마다 무작위로 바꿔, 공격자가 돌아갈 주소에 넣을 위치를 알 수 없게 한다[^s1] |
| 가드 페이지 | 중요한 메모리 영역 사이에 접근 금지 페이지를 끼워, 넘친 쓰기가 그 페이지에 닿으면 바로 오류가 나게 한다[^s1] |

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 슬라이드 43 "Protection from stack buffer overflows can be broadly classified into two categories: Compile-time defenses … Stack protection mechanisms: Aims to detect and abort attacks in existing programs" / 문제점: 두 번째 범주의 이름이 "스택 보호 기법"인데, 슬라이드 44는 스택 보호 기법을 컴파일 시간 방어의 하나로 넣고, 슬라이드 45는 두 번째 범주를 "실행 시간 방어"라고 부른다 / 수정안: 두 번째 범주는 "실행 시간 방어(Run-time defenses): 기존 프로그램에 대한 공격을 찾아 중단시킴" / 근거: 같은 자료 슬라이드 44는 "Stack Protection Mechanisms"를 컴파일 시간 방어 목록에 넣고, 슬라이드 45의 제목은 "Run Time Defenses"다

</div>


## 활용

- 리눅스와 Windows는 실행 금지(NX, DEP), 주소 공간 무작위화(ASLR), 스택 카나리(gcc의 `-fstack-protector`)를 기본으로 켠다[^s1].
- 실행 금지 비트는 [페이지 표 항목](/Hongs_Blog/studies/operating-systems/page-table-structure/)의 보호 비트 하나다. 가상 메모리 하드웨어가 보안에도 쓰인다.
- Rust 같은 언어는 컴파일 시간에 메모리 안전성을 검사해 이 부류의 오류를 대부분 없앤다[^s1].

## 연결

- 선수: [악성 소프트웨어](/Hongs_Blog/studies/operating-systems/malware/), [가상 메모리](/Hongs_Blog/studies/operating-systems/virtual-memory/) (페이지 보호, 주소 공간)
- 2-1학기 어셈블리어의 스택 프레임과 CALL/RET이 돌아갈 주소가 스택에 놓이는 이유다.

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 스택 버퍼 오버플로가 단순한 프로그램 오류를 넘어 공격자가 코드를 실행하는 데까지 이어지는 이유는?</summary>


**답:** 스택에는 지역 버퍼 바로 위에 함수가 끝나고 돌아갈 주소가 있다. 버퍼를 넘친 입력이 이 주소를 덮으면, 함수가 끝날 때 프로세서는 공격자가 넣은 주소로 점프한다. 그 주소에 공격자의 기계어를 두면 그 코드가 실행된다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 다음 방어는 컴파일 시간 방어인가 실행 시간 방어인가? ① 스택 영역을 실행 금지로 표시 ② strcpy를 strncpy로 바꿈 ③ 실행할 때마다 스택 시작 주소를 무작위로 ④ 함수 끝에서 카나리 값 확인</summary>


**답:** ① 실행 시간 ② 컴파일 시간(안전한 라이브러리) ③ 실행 시간 ④ 컴파일 시간(컴파일러가 확인 코드를 넣는 스택 보호).

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 스택 실행 금지만으로는 모든 버퍼 오버플로 공격을 막지 못한다. 공격자가 돌아갈 주소에 무엇을 넣으면 우회할 수 있는가? 이를 막는 다른 방어는?</summary>


**답:** 스택의 자기 코드 대신, 이미 실행 가능한 영역에 있는 라이브러리 함수(예: 셸을 띄우는 함수)의 주소를 넣으면 된다. 실행 금지는 스택의 코드 실행만 막기 때문이다. 주소 공간 무작위화가 그 라이브러리 함수의 위치를 예측하기 어렵게 만들어 이를 막는다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/15.Chapter15-new.pptx, 슬라이드 43
[^2]: 같은 자료, 슬라이드 44
[^3]: 같은 자료, 슬라이드 43의 발표자 노트
[^4]: 같은 자료, 슬라이드 45와 슬라이드 44의 발표자 노트
[^s1]: 에이전트 보충. 버퍼 오버플로의 동작 원리와 C 예, 스택 그림, 카나리·주소 공간 무작위화·가드 페이지의 설명, NX·ASLR·Rust 연결, 확인 문제는 슬라이드에 없다. Stallings 7판의 버퍼 오버플로 절(컴파일 시간·실행 시간 방어)을 바탕으로 보탰다. 이 강의 자료는 6판 슬라이드라 이 주제를 방어 쪽만 다룬다.
{% endraw %}
