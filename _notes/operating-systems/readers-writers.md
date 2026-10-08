---
layout: "note"
title: "독자-저자 문제"
display_title: "독자-저자 문제 (Readers-Writers Problem)"
kind: "concept"
kind_label: "기법"
num: "27"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
aliases: ["Readers-Writers Problem", "독자 우선", "Readers Have Priority", "저자 우선", "Writers Have Priority", "읽기-쓰기 잠금", "Read-Write Lock"]
description: "도서관 열람실의 게시판을 생각하자. 읽기만 하는 사람은 여럿이 함께 봐도 괜찮다. 하지만 누가 게시물을 고치는 동안에는 아무도 읽거나 고치면 안 된다. 독자끼리는 함께, 저자는 혼자 들어가게 하면 단순한 상호 배제보다 훨씬 많은 사람이 동시에 일할 수 있다. 대신 독자를 너무 우대…"
prev_url: "/studies/operating-systems/message-passing/"
prev_title: "메시지 전달"
next_url: "/studies/operating-systems/deadlock/"
next_title: "교착상태"
math: false
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/readers-writers/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

도서관 열람실의 게시판을 생각하자. 읽기만 하는 사람은 여럿이 함께 봐도 괜찮다. 하지만 누가 게시물을 고치는 동안에는 아무도 읽거나 고치면 안 된다. 독자끼리는 함께, 저자는 혼자 들어가게 하면 단순한 상호 배제보다 훨씬 많은 사람이 동시에 일할 수 있다. 대신 독자를 너무 우대하면 독자가 끊이지 않는 동안 저자가 영원히 못 들어가고(기아), 저자를 우대하면 반대가 된다.

</div>


## 예시로 보기

게시판에 독자 R1, R2와 저자 W가 접근한다. 독자 우선 방식에서 다음 순서가 생길 수 있다[^s1].

| 시점 | 일 | 안에 있는 사람 |
|---|---|---|
| 1 | R1 들어옴 (첫 독자 → 저자를 막음) | R1 |
| 2 | W 도착 → 막힘 | R1 |
| 3 | R2 들어옴 (이미 독자가 있으니 바로) | R1, R2 |
| 4 | R1 나감 | R2 |
| 5 | R3 들어옴 | R2, R3 |
| 6 | R2 나감, … | R3 |

독자가 겹치며 계속 들어오면 마지막 독자가 나가는 순간이 오지 않는다. W는 계속 기다린다.

## 정확히 말하면

여러 프로세스가 한 데이터 영역을 함께 쓴다. 일부는 읽기만 하고(독자), 일부는 쓰기만 한다(저자). 지켜야 할 조건은 셋이다[^1].

1. 여러 독자가 동시에 읽을 수 있다.
2. 한 번에 한 저자만 쓸 수 있다.
3. 저자가 쓰는 동안에는 어떤 독자도 읽을 수 없다.

### 독자 우선

`readcount`는 지금 읽고 있는 독자 수, `x`는 `readcount`를 보호하는 세마포어, `wsem`은 쓰기 권한이다[^2].

```c
int readcount = 0;
semaphore x = 1, wsem = 1;

void reader() {                       void writer() {
    while (true) {                        while (true) {
        semWait(x);                           semWait(wsem);
        readcount++;                          WRITEUNIT();
        if (readcount == 1) semWait(wsem);    semSignal(wsem);
        semSignal(x);                     }
        READUNIT();                       }
        semWait(x);
        readcount--;
        if (readcount == 0) semSignal(wsem);
        semSignal(x);
    }
}
```

첫 독자만 `wsem`을 잡고, 마지막 독자만 놓는다. 그 사이의 독자들은 `wsem`을 거치지 않고 바로 들어간다. 그래서 독자가 하나라도 남아 있는 한 저자는 들어갈 수 없다. 저자가 굶을 수 있다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 독자 4·저자 2 스레드로 돌려 저자 둘이 함께 쓰거나 저자와 독자가 겹친 적이 한 번도 없고, 독자 4명이 함께 읽은 적은 있음 — [27_readers-writers_verify.py](/Hongs_Blog/studies/operating-systems/code/27_readers-writers_verify/)</div>

</div>


### 저자 우선

저자가 쓰겠다고 알리면, 그 뒤로는 새 독자가 들어오지 못하게 한다. 독자 쪽에 `rsem`(저자가 하나라도 기다리면 독자를 막는 세마포어)을 더하고, 저자 쪽에 `writecount`와 이를 보호하는 `y`를 더한다. 첫 저자가 `rsem`을 잡고 마지막 저자가 놓는다. 독자 우선과 대칭이다[^3]. 이번에는 저자가 끊이지 않으면 독자가 굶을 수 있다[^s1].

메시지 전달로도 저자 우선을 구현할 수 있다. 공유 데이터에 접근하는 제어 프로세스를 하나 두고, 독자와 저자가 그 프로세스에 요청 메시지를 보낸다[^4].

## 활용

- 데이터베이스, 캐시, 설정값처럼 읽기가 쓰기보다 훨씬 잦은 데이터에 쓴다[^s1].
- 자바의 `ReentrantReadWriteLock`, POSIX의 `pthread_rwlock_t`가 읽기-쓰기 잠금이다. 공평성 옵션으로 기아를 줄인다[^s1].

## 연결

- 선수: [세마포어](/Hongs_Blog/studies/operating-systems/semaphore/)
- 같은 계열의 고전 문제: [생산자-소비자 문제](/Hongs_Blog/studies/operating-systems/producer-consumer/)
- 생산자-소비자와의 차이: 생산자-소비자에서는 소비자도 버퍼를 **바꾼다**(물건을 꺼낸다). 그래서 소비자끼리도 상호 배제가 필요하다. 독자-저자의 독자는 데이터를 바꾸지 않으므로 함께 들어갈 수 있다[^s1].

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 독자-저자 문제가 지켜야 할 세 조건을 쓰라.</summary>


**답:** ① 여러 독자가 동시에 읽을 수 있다 ② 한 번에 한 저자만 쓴다 ③ 저자가 쓰는 동안 어떤 독자도 읽지 못한다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 독자 우선 해법에서 저자가 굶을 수 있는 이유를 코드의 <code>readcount</code>로 설명하라.</summary>


**답:** `wsem`은 `readcount`가 1이 될 때 잡히고 0이 될 때만 풀린다. 앞 독자가 나가기 전에 새 독자가 계속 들어오면 `readcount`가 0이 되지 않는다. 그동안 `wsem`이 풀리지 않아 저자는 영원히 기다린다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 독자 코드에서 <code>semWait(x)</code>와 <code>semSignal(x)</code>를 빼면 어떤 순서에서 저자와 독자가 함께 들어가는가?</summary>


**답:** R1이 읽는 중이라 readcount = 1이고 `wsem`은 잡혀 있다.
1. R1이 다 읽고 `readcount--`를 시작해 1을 읽는다.
2. R2가 도착해 `readcount++`로 1을 읽고 2를 쓴다. 2는 1이 아니므로 `wsem`을 잡지 않고 바로 읽기 시작한다.
3. R1이 아까 읽은 1에서 1을 빼 0을 쓴다. 0이므로 `semSignal(wsem)`.
4. 기다리던 저자 W가 `wsem`을 얻어 쓰기 시작한다. R2는 아직 읽는 중이다.

`readcount`를 고치는 일 자체가 경쟁 조건이 되어 조건 3이 깨진다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/05.Chapter05-new (Google Slides).pdf, p.70
[^2]: 같은 자료, p.71 (그림 5.22)과 발표자 노트
[^3]: 같은 자료, p.72~73 (그림 5.23)과 발표자 노트
[^4]: 같은 자료, p.74~75 (그림 5.24)
[^s1]: 에이전트 보충. 이 장은 교수 자료가 없어 지금 자료와 같은 시리즈(Stallings 6판, Dave Bremer 작성)의 공개 슬라이드를 원본으로 썼다. 해법 코드는 슬라이드 이미지라 Stallings 6판 그림 5.22를 따랐다. 게시판 예시, 저자 우선에서 독자가 굶는다는 점, 라이브러리 예, 생산자-소비자와의 차이, 확인 문제 C3은 슬라이드에 없다.
{% endraw %}
