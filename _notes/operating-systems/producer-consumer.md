---
layout: "note"
title: "생산자-소비자 문제"
display_title: "생산자-소비자 문제 (Producer-Consumer Problem)"
kind: "concept"
kind_label: "기법"
num: "24"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Producer-Consumer Problem", "유한 버퍼 문제", "Bounded-Buffer Problem", "원형 버퍼", "Circular Buffer"]
description: "빵집 진열대를 떠올리면 된다. 제빵사(생산자)는 빵을 구워 진열대(버퍼)에 놓고, 손님(소비자)은 하나씩 가져간다. 진열대가 꽉 차면 제빵사는 기다리고, 비어 있으면 손님이 기다린다. 두 사람이 동시에 같은 칸을 만지면 안 된다. 세마포어 셋으로 깔끔하게 풀리지만, semWait …"
prev_url: "/studies/operating-systems/semaphore/"
prev_title: "세마포어"
next_url: "/studies/operating-systems/monitor/"
next_title: "모니터"
math: true
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/producer-consumer/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

빵집 진열대를 떠올리면 된다. 제빵사(생산자)는 빵을 구워 진열대(버퍼)에 놓고, 손님(소비자)은 하나씩 가져간다. 진열대가 꽉 차면 제빵사는 기다리고, 비어 있으면 손님이 기다린다. 두 사람이 동시에 같은 칸을 만지면 안 된다. 세마포어 셋으로 깔끔하게 풀리지만, semWait 두 개의 순서를 바꾸기만 해도 둘 다 영원히 멈춘다.

</div>


## 예시로 보기

버퍼 칸이 4개인 진열대에서 생산자와 소비자가 일한다. 필요한 것은 세 가지다[^1].

1. 한 번에 한 사람만 진열대를 만진다(상호 배제).
2. 가득 차면 생산자가 기다린다.
3. 비어 있으면 소비자가 기다린다.

이 셋을 각각 세마포어 하나로 맡긴다.

| 세마포어 | 처음 값 | 뜻 |
|---|---|---|
| `s` | 1 | 진열대를 만지는 권한 (상호 배제) |
| `n` | 0 | 빵이 놓인 칸 수 |
| `e` | 4 (버퍼 크기) | 빈 칸 수 |

## 정확히 말하면

### 버퍼가 무한할 때

배열 `b`가 끝없이 길다고 하자. 생산자는 `b[in]`에 넣고 `in`을 늘리고, 소비자는 `in > out`일 때만 `b[out]`을 꺼낸다[^2].

```c
/* 생산자 */                     /* 소비자 */
while (true) {                    while (true) {
    /* 물건 v 생산 */;                while (in <= out) /* 기다림 */;
    b[in] = v;                         w = b[out];
    in++;                              out++;
}                                      /* 물건 w 소비 */;
                                   }
```

세마포어로 바꾸면 `n`(놓인 물건 수)이 `in - out` 역할을 한다[^3].

```c
semaphore s = 1, n = 0;
void producer() {                 void consumer() {
    while (true) {                    while (true) {
        produce();                        semWait(n);
        semWait(s);                       semWait(s);
        append();                         take();
        semSignal(s);                     semSignal(s);
        semSignal(n);                     consume();
    }                                 }
}                                 }
```

슬라이드는 이 해답에 이르기 전에, 이진 세마포어와 정수 변수로 만든 **틀린 해답**도 보여 준다. 소비자가 버퍼가 비었는지 확인하는 시점과 그 값을 쓰는 시점 사이에 생산자가 끼어들면, 소비자가 빈 버퍼에서 꺼내게 된다. 확인한 값을 임계 구역 안에서 지역 변수에 저장해 두는 것으로 고친다[^4].

### 버퍼가 유한할 때

버퍼 칸을 $$n$$개로 두고 원형으로 쓴다. 포인터를 $$n$$으로 나눈 나머지로 돌린다. 가득 찬 조건은 `(in + 1) % n == out`, 빈 조건은 `in == out`이다[^5]. 세마포어 해답에는 빈 칸 수 `e`를 더한다[^6].

```
 칸 번호    0     1     2     3     4
         +-----+-----+-----+-----+-----+
 b       |     | 빵  | 빵  |     |     |
         +-----+-----+-----+-----+-----+
                  ^           ^
                 out          in
 out: 소비자가 다음에 꺼낼 칸 / in: 생산자가 다음에 넣을 칸
 4번 칸 다음은 다시 0번 칸이다: in = (in + 1) % 5
```

칸이 5개이고 빵 두 개가 1·2번 칸에 있는 순간이다. 생산자는 `in`을, 소비자는 `out`을 오른쪽으로 밀고, 둘 다 끝에 닿으면 0번 칸으로 돌아온다[^s2].

```c
const int sizeofbuffer = /* 버퍼 크기 */;
semaphore s = 1, n = 0, e = sizeofbuffer;
void producer() {                 void consumer() {
    while (true) {                    while (true) {
        produce();                        semWait(n);
        semWait(e);                       semWait(s);
        semWait(s);                       take();
        append();                         semSignal(s);
        semSignal(s);                     semSignal(e);
        semSignal(n);                     consume();
    }                                 }
}                                 }
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 칸 4개 버퍼, 생산자 2·소비자 1 스레드로 4,000개를 옮김 — 넣은 순서대로 빠짐없이 꺼냈고 버퍼는 4칸을 넘지 않음. 생산자가 s를 쥔 채 e를 기다리면 소비자가 s를 얻지 못해 멈추는 상황도 재현 — [24_producer-consumer_verify.py](/Hongs_Blog/studies/operating-systems/code/24_producer-consumer_verify/)</div>

</div>


### 순서가 중요한 곳, 상관없는 곳

| 바꾼 것 | 결과 |
|---|---|
| 생산자의 `semSignal(s)`와 `semSignal(n)` | 상관없다. 둘 다 막히지 않는 연산이다[^3] |
| 소비자의 `semWait(n)`과 `semWait(s)` | 교착상태가 생긴다. 버퍼가 비었을 때 소비자가 `s`를 쥔 채 `n`을 기다리면, 생산자는 `s`를 얻지 못해 물건을 넣을 수 없다[^3] |
| 생산자의 `semWait(e)`와 `semWait(s)` | 같은 이유로 교착상태. 버퍼가 가득 찼을 때 생산자가 `s`를 쥔 채 `e`를 기다리면 소비자가 꺼낼 수 없다[^s1] |

## 활용

- 운영체제 안의 키보드 입력 버퍼, 프린터 스풀러, 네트워크 패킷 큐가 생산자-소비자 구조다[^s1].
- 파이썬 `queue.Queue(maxsize=n)`, 자바 `BlockingQueue`는 이 해답을 미리 만들어 둔 것이다. 가득 차면 `put`이, 비면 `get`이 기다린다[^s1].
- 유닉스 파이프(<code>ls &#124; grep</code>)도 앞 프로그램이 생산자, 뒤 프로그램이 소비자인 유한 버퍼다[^s1].

## 연결

- 선수: [세마포어](/Hongs_Blog/studies/operating-systems/semaphore/)
- 같은 문제를 다르게 푼 것: [모니터](/Hongs_Blog/studies/operating-systems/monitor/), [메시지 전달](/Hongs_Blog/studies/operating-systems/message-passing/)
- 순서를 바꾸면 생기는 것: [교착상태](/Hongs_Blog/studies/operating-systems/deadlock/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 유한 버퍼 해답의 세마포어 세 개와 각각의 처음 값, 뜻을 쓰라.</summary>


**답:** `s` = 1(버퍼 접근 상호 배제), `n` = 0(찬 칸 수), `e` = 버퍼 크기(빈 칸 수).

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 소비자가 <code>semWait(s)</code>를 먼저 하고 <code>semWait(n)</code>을 나중에 하면 버퍼가 비었을 때 무슨 일이 생기는가?</summary>


**답:** 소비자가 `s`를 얻고(0), `n`에서 막힌다. 생산자는 물건을 넣으려고 `semWait(s)`를 하지만 `s`가 0이라 막힌다. 생산자는 소비자가 `s`를 풀기를, 소비자는 생산자가 `n`을 올리기를 기다린다. 교착상태다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 칸이 5개인 원형 버퍼에서 in = 3, out = 4다. 버퍼는 가득 찼는가, 비었는가, 둘 다 아닌가? 이 방식으로 실제로 쓸 수 있는 칸은 몇 개인가?</summary>


**답:** $$(3 + 1) \bmod 5 = 4 = $$ out이므로 가득 찼다. 이 방식은 in == out을 "빔"으로 쓰므로 가득 찬 상태와 구별하려고 한 칸을 비워 둔다. 실제로는 4칸만 쓴다.

</details>

[^1]: 운영체제 5회 강의 자료 「Chapter05-new (Google Slides)」, p.37
[^2]: 같은 자료, p.38~39
[^3]: 같은 자료, p.43 (그림 5.11)과 발표자 노트
[^4]: 같은 자료, p.40~42 (그림 5.9, 5.10)와 발표자 노트
[^5]: 같은 자료, p.44, 46
[^6]: 같은 자료, p.45 (그림 5.13)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 장은 교수 자료가 없어 지금 자료와 같은 시리즈(Stallings 6판, Dave Bremer 작성)의 공개 슬라이드를 원본으로 썼다. 빵집 비유, 생산자의 semWait 순서 문제, 운영체제·라이브러리 예, 확인 문제 C3은 슬라이드에 없다. 그림 속 코드는 슬라이드 이미지라 Stallings 6판 그림 5.11, 5.13을 따랐다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 다이어그램 1개는 원본에 없다. "버퍼가 유한할 때" 문단(p.44, 46)의 원형 버퍼를 ASCII로 그렸다. 칸 수 5와 in·out 값은 보기를 위해 고른 값이다.
{% endraw %}
