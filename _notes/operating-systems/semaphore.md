---
layout: "note"
title: "세마포어"
display_title: "세마포어 (Semaphore)"
kind: "concept"
kind_label: "모델"
num: "23"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
aliases: ["Semaphore", "계수 세마포어", "Counting Semaphore", "일반 세마포어", "General Semaphore", "이진 세마포어", "Binary Semaphore", "뮤텍스", "Mutex", "semWait", "semSignal", "P", "V", "강한 세마포어", "약한 세마포어"]
description: "세마포어는 \"남은 자리 수\"를 적은 계수기와 대기 줄을 묶은 것이다. 주차장 입구의 전광판처럼, 들어갈 때 수를 하나 줄이고 나올 때 하나 늘린다. 자리가 없으면 들어오려던 프로세스는 문 앞에서 계속 확인하지 않고 잠들어 줄을 선다. 그래서 바쁜 대기가 없다. 대신 줄이기와 늘리기…"
prev_url: "/studies/operating-systems/hardware-mutual-exclusion/"
prev_title: "상호 배제의 하드웨어 지원"
next_url: "/studies/operating-systems/producer-consumer/"
next_title: "생산자-소비자 문제"
math: true
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/semaphore/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

세마포어는 "남은 자리 수"를 적은 계수기와 대기 줄을 묶은 것이다. 주차장 입구의 전광판처럼, 들어갈 때 수를 하나 줄이고 나올 때 하나 늘린다. 자리가 없으면 들어오려던 프로세스는 문 앞에서 계속 확인하지 않고 잠들어 줄을 선다. 그래서 바쁜 대기가 없다. 대신 줄이기와 늘리기를 짝 맞춰 써야 하는 책임이 프로그래머에게 있고, 하나만 빠뜨리거나 순서를 바꿔도 교착상태나 상호 배제 실패가 생긴다.

</div>


## 예시로 보기

자원 하나를 프로세스 A, B, C가 함께 쓰고, 세마포어 `lock`의 처음 값은 1이다. 모두 `semWait(lock)`으로 들어가고 `semSignal(lock)`으로 나온다[^1].

| 순서 | 일 | lock 값 | 줄 | 임계 구역 안 |
|---|---|---|---|---|
| 1 | A가 semWait | 0 | | A |
| 2 | B가 semWait → 막힘 | −1 | B | A |
| 3 | C가 semWait → 막힘 | −2 | B, C | A |
| 4 | A가 semSignal → B를 깨움 | −1 | C | B |
| 5 | B가 semSignal → C를 깨움 | 0 | | C |
| 6 | C가 semSignal | 1 | | |

값이 음수일 때 그 절댓값은 줄에서 기다리는 프로세스 수다. 3번에서 −2이면 둘이 기다린다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 값과 깨어나는 순서를 그림 5.3의 정의대로 재현 — [23_semaphore_impl.py](/Hongs_Blog/studies/operating-systems/code/23_semaphore_impl/)</div>

</div>


## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

세마포어는 프로세스끼리 신호를 주고받는 데 쓰는 정수 값이다. 할 수 있는 연산은 셋뿐이고, 모두 원자적이다(중간에 끊기지 않는다)[^2].
1. 0 이상의 정수로 초기화한다.
2. **semWait**: 값을 1 줄인다. 음수가 되면 semWait을 부른 프로세스를 막는다. 그렇지 않으면 계속 실행한다.
3. **semSignal**: 값을 1 늘린다. 결과가 0 이하이면 semWait으로 막혀 있던 프로세스 하나를 깨운다.

</div>


**기호로 쓰면.** 세마포어 $$s$$를 정수 `count`와 대기 큐 `queue`로 쓴다(Stallings 그림 5.3)[^3].

```c
struct semaphore { int count; queueType queue; };

void semWait(semaphore s) {
    s.count--;
    if (s.count < 0) {
        /* 이 프로세스를 s.queue에 넣는다 */;
        /* 이 프로세스를 막는다 */;
    }
}

void semSignal(semaphore s) {
    s.count++;
    if (s.count <= 0) {
        /* s.queue에서 프로세스 P를 꺼낸다 */;
        /* P를 준비 목록에 넣는다 */;
    }
}
```

`count`가 0 이상이면 그 값은 막히지 않고 semWait을 할 수 있는 프로세스 수다. 음수이면 그 절댓값은 큐에서 기다리는 프로세스 수다[^s1].

semWait과 semSignal은 다익스트라가 처음 쓴 이름 P(네덜란드어 proberen, 시험하다)와 V(verhogen, 늘리다)로도 불린다[^s1].

### 이진 세마포어와 뮤텍스

**이진 세마포어**는 값이 0과 1만 될 수 있다[^4].

- semWaitB: 값이 1이면 0으로 바꾸고 계속한다. 0이면 프로세스를 큐에 넣고 막는다.
- semSignalB: 큐가 비어 있으면 값을 1로 바꾼다. 아니면 큐에서 하나를 깨운다.

**뮤텍스**도 0과 1의 잠금이지만 다른 점이 하나 있다. 잠근(값을 0으로 만든) 프로세스만 풀 수 있다. 이진 세마포어는 한 프로세스가 잠그고 다른 프로세스가 풀어도 된다[^4].

### 강한 세마포어와 약한 세마포어

막힌 프로세스를 큐에서 어떤 순서로 꺼내는가에 따라 나뉜다[^5].

| | 꺼내는 순서 | 기아 |
|---|---|---|
| 강한 세마포어 | 가장 오래 기다린 것부터(FIFO) | 없다 |
| 약한 세마포어 | 정하지 않음 | 생길 수 있다[^s1] |

### 상호 배제

임계 구역 앞뒤를 semWait와 semSignal로 감싸고, 세마포어를 1로 시작한다. 그러면 처음 semWait한 프로세스는 바로 들어가고 값은 0이 된다. 다음 프로세스부터는 값이 음수가 되어 막힌다. 들어가 있던 프로세스가 나오며 semSignal하면 하나가 깨어나 들어간다[^1].

```c
const int n = /* 프로세스 수 */;
semaphore s = 1;
void P(int i) {
    while (true) {
        semWait(s);
        /* 임계 구역 */;
        semSignal(s);
        /* 나머지 */;
    }
}
```

## 스스로 설명해 보기

1. semWait에서 값을 먼저 줄이고 그다음 음수인지 본다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   줄이는 것이 "자리 하나 쓰겠다"는 신청이다. 신청한 결과 남은 자리가 음수면 실제로는 자리가 없었다는 뜻이므로 막힌다.
   </details>
2. semSignal에서 "0 이하"일 때 하나를 깨운다. "0 미만"이 아니다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   늘리기 전 값이 음수였다면 기다리는 프로세스가 있었다. 늘린 뒤 0 이하라는 것은 늘리기 전 −1 이하였다는 뜻이다. 예: −1 → 0이면 한 명이 기다리고 있었으므로 깨워야 한다.
   </details>
3. 바쁜 대기가 없다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   막힌 프로세스는 대기 상태가 되어 큐에 들어간다. 프로세서를 쓰지 않고, semSignal이 준비 목록으로 옮겨 줄 때까지 실행되지 않는다.
   </details>
- 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  남은 자원 수를 정수 하나로 세고, 모자라면 잠재운다. 세는 일과 잠재우는 일을 끊기지 않는 연산으로 묶는다.
  </details>
- 이 방법을 쓸 수 있는 다른 상황은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  자원이 n개인 경우(초기값 n). 순서 맞추기(초기값 0으로 두고 "B는 A가 끝난 뒤"를 semWait/semSignal로). 둘 다 [생산자-소비자 문제](/Hongs_Blog/studies/operating-systems/producer-consumer/)에 쓰인다.
  </details>

## 활용

- POSIX의 `sem_wait`, `sem_post`, 파이썬의 `threading.Semaphore`, 자바의 `java.util.concurrent.Semaphore`가 세마포어다[^s1].
- 데이터베이스 연결을 10개까지만 동시에 쓰게 하는 연결 풀은 초기값 10인 계수 세마포어로 만들 수 있다[^s1].
- semWait과 semSignal 자체도 원자적이어야 한다. 운영체제는 이 두 연산 안쪽을 [하드웨어 지원](/Hongs_Blog/studies/operating-systems/hardware-mutual-exclusion/)(인터럽트 금지나 compare&swap)으로 보호한다. 연산이 짧아서 그 안의 바쁜 대기는 짧다[^s1].

## 연결

- 선수: [상호 배제의 하드웨어 지원](/Hongs_Blog/studies/operating-systems/hardware-mutual-exclusion/), [프로세스 상태](/Hongs_Blog/studies/operating-systems/process-states/) (막힌 프로세스 = 대기 상태)
- 쓰임새: [생산자-소비자 문제](/Hongs_Blog/studies/operating-systems/producer-consumer/), [독자-저자 문제](/Hongs_Blog/studies/operating-systems/readers-writers/)
- 더 다루기 쉬운 대안: [모니터](/Hongs_Blog/studies/operating-systems/monitor/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"세마포어 값은 늘 0 이상이다"</div>

틀렸다. 이진 세마포어나 일상 비유(남은 자리 수)만 보면 음수가 이상해 보인다. Stallings의 정의(그림 5.3)에서는 semWait이 먼저 값을 줄이므로 음수가 될 수 있고, 그 절댓값이 기다리는 프로세스 수다. 다만 교재마다 구현이 달라서, 값을 0 아래로 내리지 않고 0이면 기다리게 하는 정의도 있다(예: POSIX `sem_wait`). 어느 정의인지 확인한다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"이진 세마포어와 뮤텍스는 같다"</div>

반만 맞다. 둘 다 0과 1로 상호 배제를 한다. 하지만 뮤텍스는 잠근 프로세스만 풀 수 있고, 이진 세마포어는 다른 프로세스가 풀 수 있다. 그래서 이진 세마포어는 "A가 끝나면 B를 깨운다" 같은 신호 주고받기에도 쓰인다[^4].

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 세마포어에 할 수 있는 세 연산과 semWait, semSignal이 하는 일을 쓰라.</summary>


**답:** 초기화, semWait, semSignal. semWait: 값을 1 줄이고 음수면 부른 프로세스를 막는다. semSignal: 값을 1 늘리고 0 이하면 막힌 프로세스 하나를 깨운다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 하드웨어 명령어로 만든 잠금(스핀락)과 비교해 세마포어가 프로세서를 덜 낭비하는 이유는?</summary>


**답:** 스핀락은 들어가지 못한 프로세스가 계속 값을 확인하며 프로세서를 쓴다(바쁜 대기). 세마포어는 들어가지 못한 프로세스를 대기 상태로 큐에 넣어 프로세서를 내준다. semSignal이 깨울 때까지 실행되지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 다음 상황에 이진 세마포어와 뮤텍스 중 무엇이 맞는가? "스레드 A가 데이터를 다 읽어 오면, 기다리던 스레드 B가 처리를 시작한다."</summary>


**답:** 이진 세마포어(초기값 0). B가 semWait으로 기다리고 A가 semSignal로 깨운다. 잠그는 쪽(B)과 푸는 쪽(A)이 다르므로, 잠근 쪽만 풀 수 있는 뮤텍스는 맞지 않는다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 세마포어를 3으로 초기화했다. 프로세스 A, B, C, D, E가 차례로 semWait한 뒤, 한 번 semSignal한다. 마지막 값, 깨어난 프로세스, 아직 큐에 있는 프로세스는? (강한 세마포어)</summary>


**답:** 값 −1. 깨어난 것은 D. 큐에는 E.<br>
**이유:** semWait 다섯 번으로 3 → −2. A, B, C는 들어가고 D, E가 큐에 선다. semSignal로 −1이 되고, 0 이하이므로 맨 앞의 D를 깨운다.

</details>

<details markdown="1"><summary markdown="span"><b>C5</b> 상호 배제용 세마포어를 1이 아니라 2로 초기화하면 무엇이 깨지는가? 구체적인 순서로 보여라.</summary>


**답:** A가 semWait → 1, 들어감. B가 semWait → 0, 막히지 않고 들어감. A와 B가 동시에 임계 구역에 있다. 상호 배제가 깨진다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/05.Chapter05-new (Google Slides).pdf, p.35~36 (그림 5.6, 5.7)
[^2]: 같은 자료, p.29
[^3]: 같은 자료, p.30 (그림 5.3)
[^4]: 같은 자료, p.31 (그림 5.4)와 발표자 노트
[^5]: 같은 자료, p.32
[^s1]: 에이전트 보충. 이 장은 교수 자료가 없어 지금 자료와 같은 시리즈(Stallings 6판, Dave Bremer 작성)의 공개 슬라이드를 원본으로 썼다. 세마포어 값의 해석, P·V 이름, 약한 세마포어의 기아, 라이브러리 이름과 연결 풀 예, semWait·semSignal 자체의 보호, 확인 문제 C3~C5는 Stallings 6판 5.3절을 바탕으로 보탰다. 그림 속 코드는 슬라이드 이미지라 글로 추출되지 않아 교재 그림 5.3, 5.4, 5.6을 따랐다.
{% endraw %}
