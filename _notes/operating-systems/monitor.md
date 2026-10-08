---
layout: "note"
title: "모니터"
display_title: "모니터 (Monitor)"
kind: "concept"
kind_label: "모델"
num: "25"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
aliases: ["Monitor", "조건 변수", "Condition Variable", "cwait", "csignal", "호어 모니터", "Hoare Monitor", "메사 모니터", "Mesa Monitor", "cnotify", "cbroadcast"]
description: "모니터는 공유 데이터와 그 데이터를 다루는 함수들을 한 방에 넣고, 방에는 한 번에 한 프로세스만 들어가게 한 프로그래밍 언어 구조다. 세마포어처럼 semWait과 semSignal을 코드 곳곳에 흩어 놓지 않아도, 방에 들어가는 것만으로 상호 배제가 된다. 그래서 짝을 빠뜨리는 …"
prev_url: "/studies/operating-systems/producer-consumer/"
prev_title: "생산자-소비자 문제"
next_url: "/studies/operating-systems/message-passing/"
next_title: "메시지 전달"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/monitor/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

모니터는 공유 데이터와 그 데이터를 다루는 함수들을 한 방에 넣고, 방에는 한 번에 한 프로세스만 들어가게 한 프로그래밍 언어 구조다. 세마포어처럼 semWait과 semSignal을 코드 곳곳에 흩어 놓지 않아도, 방에 들어가는 것만으로 상호 배제가 된다. 그래서 짝을 빠뜨리는 실수가 줄어든다. 다만 "버퍼가 빌 때까지 기다리기" 같은 조건 맞추기는 여전히 프로그래머가 조건 변수로 직접 해야 한다.

</div>


## 예시로 보기

세마포어로 생산자-소비자를 풀면 `semWait(s)`, `semSignal(s)`가 생산자와 소비자 코드에 흩어진다. 한 곳만 틀려도 전체가 깨진다. 모니터로 풀면 버퍼와 `append`, `take` 함수를 한 모니터에 넣는다. 생산자와 소비자는 그냥 `append(x)`, `take(x)`를 부른다. 모니터 안에는 한 번에 한 프로세스만 있을 수 있으므로 버퍼 상호 배제는 저절로 된다[^1].

```c
monitor boundedbuffer;
char buffer[N];
int nextin, nextout, count;
cond notfull, notempty;           /* 조건 변수 */

void append(char x) {
    if (count == N) cwait(notfull);      /* 가득 참: 빈 칸이 생길 때까지 */
    buffer[nextin] = x;
    nextin = (nextin + 1) % N;
    count++;
    csignal(notempty);                   /* 기다리는 소비자 하나를 깨움 */
}

void take(char x) {
    if (count == 0) cwait(notempty);     /* 비어 있음: 물건이 생길 때까지 */
    x = buffer[nextout];
    nextout = (nextout + 1) % N;
    count--;
    csignal(notfull);                    /* 기다리는 생산자 하나를 깨움 */
}
```

## 정확히 말하면

모니터는 세마포어와 같은 일을 하면서 다루기 쉬운 언어 구조다. Concurrent Pascal, Pascal-Plus, Modula-2, Modula-3, Java에 있다[^2]. 세 가지 특징이 있다[^3].

1. 모니터의 지역 데이터는 모니터의 함수만 만질 수 있다.
2. 프로세스는 모니터의 함수 하나를 불러서 모니터에 들어간다.
3. 한 번에 한 프로세스만 모니터 안에서 실행될 수 있다. 다른 프로세스는 입구에서 기다린다.

**조건 변수.** 모니터 안에서만 쓰는 특별한 변수로 순서를 맞춘다[^4].

| 연산 | 하는 일 |
|---|---|
| `cwait(c)` | 부른 프로세스를 조건 c에서 멈춘다. 모니터는 다른 프로세스가 쓸 수 있게 풀린다 |
| `csignal(c)` | 같은 조건에서 cwait으로 멈춘 프로세스 하나를 다시 실행시킨다. 기다리는 프로세스가 없으면 아무 일도 하지 않는다 |

세마포어의 semSignal과 달리 `csignal`은 기다리는 프로세스가 없으면 그냥 사라진다. 나중에 cwait하는 프로세스를 위해 저장되지 않는다[^s1].

### 호어 방식과 메사 방식

| | 호어(Hoare) 방식 | 메사(Mesa) 방식 (Lampson·Redell) |
|---|---|---|
| 신호 연산 | `csignal(x)`: 깨운 프로세스가 **바로** 실행된다. 신호를 보낸 프로세스는 나가거나 멈춘다 | `cnotify(x)`: 깨운 프로세스는 모니터가 빌 때 실행된다. 보낸 프로세스는 계속 실행한다 |
| 깨어난 쪽이 할 일 | 조건이 그대로 맞으므로 `if`로 한 번 확인하면 된다 | 그사이 다른 프로세스가 끼어들어 조건이 바뀌었을 수 있으므로 `while`로 다시 확인한다 |
| 그 밖에 | Concurrent Pascal은 csignal 뒤에 아무 코드도 두지 않게 한다 | 모든 대기자를 깨우는 `cbroadcast`를 쓸 수 있다 |

이 표는 슬라이드 내용과 발표자 노트를 정리한 것이다[^5].

## 활용

- 자바의 `synchronized` 메서드와 `wait()`, `notify()`, `notifyAll()`이 메사 방식 모니터다. 그래서 자바에서는 `wait()`를 `while` 반복 안에서 부르라고 한다[^s1].
- 파이썬 `threading.Condition`도 메사 방식이다[^s1].

## 연결

- 선수: [세마포어](/Hongs_Blog/studies/operating-systems/semaphore/), [생산자-소비자 문제](/Hongs_Blog/studies/operating-systems/producer-consumer/)
- 다른 동기화 방법: [메시지 전달](/Hongs_Blog/studies/operating-systems/message-passing/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 모니터의 세 가지 특징을 쓰라.</summary>


**답:** ① 지역 데이터는 모니터 함수만 접근 ② 함수를 불러서 들어감 ③ 한 번에 한 프로세스만 안에서 실행.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 메사 방식에서는 <code>if (count == 0) cwait(notempty);</code>를 <code>while</code>로 바꿔야 하는 이유는?</summary>


**답:** cnotify를 받은 소비자는 바로 실행되지 않고, 모니터가 빌 때까지 기다린다. 그사이 다른 소비자가 먼저 들어와 물건을 가져갈 수 있다. 깨어났을 때 버퍼가 다시 비어 있을 수 있으므로 조건을 다시 확인해야 한다.<br>
**흔한 오답:** "신호를 놓칠 수 있어서". 문제는 신호를 놓치는 것이 아니라 신호 이후 상황이 바뀌는 것이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 세마포어 semSignal과 모니터 csignal은 기다리는 프로세스가 없을 때 각각 어떻게 다른가?</summary>


**답:** semSignal은 세마포어 값을 1 늘려 둔다. 나중에 semWait하는 프로세스는 막히지 않고 지나간다. csignal은 기다리는 프로세스가 없으면 아무 효과도 남기지 않는다. 나중에 cwait하는 프로세스는 막힌다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/05.Chapter05-new (Google Slides).pdf, p.53~54 (그림 5.16)와 발표자 노트
[^2]: 같은 자료, p.49
[^3]: 같은 자료, p.50
[^4]: 같은 자료, p.51~52 (그림 5.15)
[^5]: 같은 자료, p.54~55 (그림 5.17)와 발표자 노트
[^s1]: 에이전트 보충. 이 장은 교수 자료가 없어 지금 자료와 같은 시리즈(Stallings 6판, Dave Bremer 작성)의 공개 슬라이드를 원본으로 썼다. 모니터 코드는 슬라이드 이미지라 Stallings 6판 그림 5.16을 따랐다. csignal이 흔적을 남기지 않는다는 설명, 자바·파이썬 연결, 확인 문제 C3은 슬라이드에 없고 교재 5.4절을 바탕으로 보탰다.
{% endraw %}
