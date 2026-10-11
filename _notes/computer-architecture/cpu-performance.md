---
layout: "note"
title: "성능과 실행 시간"
display_title: "성능과 실행 시간 (Performance and Execution Time)"
kind: "concept"
kind_label: "정의"
num: "02"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Performance", "Execution Time", "응답 시간", "Response Time", "처리량", "Throughput", "상대 성능", "Relative Performance", "경과 시간", "Elapsed Time", "CPU 시간", "CPU Time", "사용자 CPU 시간", "시스템 CPU 시간"]
description: "컴퓨터가 빠르다는 말에는 두 가지 뜻이 있다. 일 하나가 빨리 끝난다는 뜻과, 정해진 시간에 일을 많이 끝낸다는 뜻이다. 택배로 치면 내 상자 하나가 도착하는 데 걸리는 시간과 하루에 배달하는 상자 수다. 이 과목은 앞의 것을 기준으로 삼고, 걸린 시간이 짧을수록 성능이 높다고 정…"
prev_url: "/studies/computer-architecture/computer-abstraction-layers/"
prev_title: "컴퓨터 구조와 추상화 계층"
next_url: "/studies/computer-architecture/cpu-time-equation/"
next_title: "CPU 시간 식"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/cpu-performance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

컴퓨터가 빠르다는 말에는 두 가지 뜻이 있다. 일 하나가 빨리 끝난다는 뜻과, 정해진 시간에 일을 많이 끝낸다는 뜻이다. 택배로 치면 내 상자 하나가 도착하는 데 걸리는 시간과 하루에 배달하는 상자 수다. 이 과목은 앞의 것을 기준으로 삼고, 걸린 시간이 짧을수록 성능이 높다고 정한다. 다만 같은 프로그램을 돌린 시간끼리만 견줄 수 있고, 프로그램이 바뀌면 어느 컴퓨터가 빠른지도 바뀔 수 있다.

</div>


## 예시로 보기

"A가 B보다 빠르다"는 말만으로는 무엇을 쟀는지 알 수 없다. 숫자로 견주려면 먼저 재는 것을 정해야 한다.

같은 프로그램을 컴퓨터 A는 12초에, B는 18초에 끝낸다. 걸린 시간을 나누면 $$18 \div 12 = 1.5$$다. "A는 B보다 1.5배 빠르다"고 말한다. 나누는 순서를 조심한다. 느린 쪽 시간을 빠른 쪽 시간으로 나눈다.

이번에는 A에서 스톱워치로 잰 20초를 뜯어 본다.

| 무엇을 하는 시간 | 초 |
|---|---|
| 프로세서가 내 프로그램의 명령을 실행 | 11 |
| 프로세서가 내 프로그램 때문에 운영체제의 명령을 실행 | 3 |
| 디스크를 기다리거나 다른 프로그램에 차례를 내줌 | 6 |
| 합계 | 20 |

스톱워치로 잰 20초 가운데 프로세서가 이 프로그램을 위해 일한 시간은 14초, 열에 일곱이다. 프로세서만 더 빠른 것으로 바꿔도 나머지 6초는 줄지 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 1.5배, 20초의 나눔, 처리량 300·450·600, 카드 C2·C3 — [02_cpu-performance_verify.py](/Hongs_Blog/studies/computer-architecture/code/02_cpu-performance_verify/)</div>

</div>


## 정의

**두 가지 빠르기.**

- 일 하나를 시작해서 끝낼 때까지 걸린 시간(응답 시간). 실행 시간이라고도 부른다[^1].
- 정해진 시간에 끝낸 일의 수(처리량)[^1].

**성능.** 실행 시간이 짧을수록 높은 값이 되도록, 성능을 실행 시간의 역수로 정한다[^2].

$$\text{성능}_X = \frac{1}{\text{실행 시간}_X}$$


아래 첨자 $$X$$는 컴퓨터의 이름이다. 12초 걸리는 컴퓨터의 성능은 $$\frac{1}{12}$$, 18초 걸리는 컴퓨터의 성능은 $$\frac{1}{18}$$이다.

**상대 성능.** "X가 Y보다 $$n$$배 빠르다"는 두 성능을 나눈 값이 $$n$$이라는 뜻이다. 성능이 시간의 역수라서, 시간으로 쓰면 위아래가 뒤집힌다[^2].

$$n = \frac{\text{성능}_X}{\text{성능}_Y} = \frac{\text{실행 시간}_Y}{\text{실행 시간}_X}$$


위 예에서 $$X$$ = A, $$Y$$ = B이면 $$n = \frac{18}{12} = 1.5$$다.

**어느 시간을 재는가.** 실행 시간에도 두 가지가 있다[^3].

| 이름 | 재는 것 | 위 예 |
|---|---|---|
| 경과 시간 (elapsed time) | 시작부터 끝까지 벽시계로 잰 시간. 입출력을 기다린 시간, 운영체제가 한 일, 다른 프로그램에 내준 시간이 다 들어간다 | 20초 |
| CPU 시간 (CPU time) | 프로세서가 이 프로그램을 위해 일한 시간만 | 14초 |

CPU 시간은 다시 둘로 나뉜다. 프로그램 자신의 명령을 실행한 시간(사용자 CPU 시간, 11초)과 그 프로그램을 위해 운영체제가 일한 시간(시스템 CPU 시간, 3초)이다[^1]. 프로세서를 견줄 때는 CPU 시간을 쓴다. 이 시간을 셋으로 쪼개는 식이 [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/)이다.

## 예제

**응답 시간과 처리량은 같이 움직이는가.** 작업 하나가 12초 걸리는 서버가 작업을 쉬지 않고 받는다. 한 시간에 $$3600 \div 12 = 300$$개를 끝낸다.

- 프로세서를 1.5배 빠른 것으로 바꾼다. 작업 하나가 8초로 줄고, 한 시간에 450개를 끝낸다. 응답 시간과 처리량이 둘 다 좋아진다.
- 같은 프로세서를 하나 더 단다. 작업 하나는 여전히 12초다. 두 프로세서가 따로 일하므로 한 시간에 600개를 끝낸다. 처리량만 좋아진다.

어? 둘째 경우에도 내 작업이 빨리 끝나는 것처럼 느낄 때가 있다. 작업이 몰려 줄을 서 있었다면 그렇다. 줄에서 기다리는 시간이 줄기 때문이고, 작업을 실행하는 12초는 그대로다[^3].

## 활용

- 리눅스·맥의 `time` 명령은 세 숫자를 준다. `real`이 경과 시간, `user`가 사용자 CPU 시간, `sys`가 시스템 CPU 시간이다. `real`이 `user + sys`보다 훨씬 크면 프로그램이 대부분 기다리고 있었다는 뜻이다.
- **흔한 실수 1.** "A가 1.5배 빠르다"를 "B가 50% 느리다"로 바꿔 말하는 것. 위 예에서 B는 A보다 시간이 50% 더 걸리고($$\frac{18 - 12}{12}$$), A는 B보다 시간이 33% 덜 걸린다($$\frac{18 - 12}{18}$$). 기준이 무엇인지에 따라 수가 달라지므로 "몇 배 빠르다" 한 가지로만 말한다[^2].
- **흔한 실수 2.** 프로그램 하나로 잰 값을 모든 프로그램에 그대로 쓰는 것. 컴퓨터마다 잘하는 일이 달라서, 다른 프로그램에서는 순서가 뒤집힐 수 있다. 그래서 여러 프로그램을 묶은 벤치마크로 잰다[^1].

## 연결

- 선수: [컴퓨터 구조와 추상화 계층](/Hongs_Blog/studies/computer-architecture/computer-abstraction-layers/)
- CPU 시간을 쪼개기: [CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/). 일부만 빨라질 때: [암달의 법칙](/Hongs_Blog/studies/computer-architecture/amdahls-law/)
- 응답 시간은 그대로 두고 처리량을 올리는 대표 기법: [5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 성능의 정의와 "X가 Y보다 $$n$$배 빠르다"의 뜻을 식으로 쓰라.</summary>

**답:** 성능 = 1 ÷ 실행 시간. $$n$$ = 성능X ÷ 성능Y = 실행 시간Y ÷ 실행 시간X.<br>
**이유:** 시간이 짧을수록 좋으므로 역수를 써서 "클수록 좋은" 값으로 바꾼다. 그래서 시간으로 쓰면 분자와 분모가 뒤집힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 같은 프로그램이 X에서 45초, Y에서 30초 걸린다. 어느 쪽이 몇 배 빠른가?</summary>

**답:** Y가 $$45 \div 30 = 1.5$$배 빠르다.<br>
**흔한 오답:** $$30 \div 45 = 0.67$$배라고 쓰는 것. 빠른 쪽을 주어로 하고 느린 쪽 시간을 위에 둔다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 어떤 프로그램의 경과 시간이 50초이고 그 가운데 CPU 시간이 20초다. 프로세서를 두 배 빠른 것으로 바꾸면 경과 시간은 몇 초가 되고 전체는 몇 배 빨라지는가? "두 배 빨라진다"가 틀린 이유는?</summary>

**답:** CPU 시간만 10초로 줄어 $$10 + 30 = 40$$초가 된다. $$50 \div 40 = 1.25$$배다.<br>
**이유:** 프로세서가 빨라져도 디스크와 네트워크를 기다리는 30초는 그대로다. 두 배가 되는 것은 CPU 시간이지 경과 시간이 아니다. 이 생각을 일반 식으로 쓴 것이 [암달의 법칙](/Hongs_Blog/studies/computer-architecture/amdahls-law/)이다.

</details>


[^1]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 1장 "Computer Abstractions and Technology" (응답 시간과 처리량, 경과 시간과 CPU 시간, 사용자·시스템 CPU 시간, 벤치마크). 책을 직접 열지 못해 장까지만 적는다.
[^2]: 같은 책 1장의 강의 슬라이드를 쓴 University of Crete HY225, "Chapter 1 — Computer Abstractions and Technology" 슬라이드 28 "Relative Performance" (Performance = 1/Execution Time, "X is n time faster than Y", "we do NOT say that B is 33.3% slower than A"라는 손글씨 메모), https://www.csd.uoc.gr/~hy225/22a/10a_cpi.pdf
[^3]: KFUPM ICS 233 "Performance" 슬라이드 4 "Response Time and Throughput", 슬라이드 6 "What do we mean by Execution Time?" (응답 시간 = CPU 시간 + 기다린 시간, 프로세서 수를 늘리면 처리량이 늘고 줄 서는 시간이 줄어든다는 설명), https://faculty.kfupm.edu.sa/COE/aimane/coe301/07-Performance.pdf
{% endraw %}
