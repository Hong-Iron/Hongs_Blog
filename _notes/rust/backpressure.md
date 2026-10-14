---
layout: "note"
title: "백프레셔와 큐 제한"
display_title: "백프레셔와 큐 제한 (Backpressure)"
kind: "concept"
kind_label: "모델"
num: "39"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Backpressure", "백프레셔", "배압", "Bounded Channel", "Unbounded Channel", "크기 제한 채널", "Load Shedding", "부하 버리기", "Semaphore", "tokio::sync::Semaphore", "try_send", "ConcurrencyLimit", "GlobalConcurrencyLimitLayer", "load_shed"]
description: "주방이 요리하는 속도보다 주문이 빨리 들어오면 주문표가 쌓인다. 주문표 꽂이에 칸 수를 정해 두지 않으면 줄이 끝없이 길어져 결국 메모리가 바닥나고, 그 전에 이미 모든 손님이 한참 늦게 받는다. 칸 수를 정해 두면 꽂이가 찼을 때 주문받는 쪽이 기다리거나 새 주문을 거절하게 되어…"
prev_url: "/studies/rust/cancellation-timeouts-select/"
prev_title: "취소·타임아웃·select"
next_url: "/studies/rust/graceful-shutdown/"
next_title: "안전한 종료"
math: true
mermaid: false
code_count: 1
permalink: "/studies/rust/backpressure/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

주방이 요리하는 속도보다 주문이 빨리 들어오면 주문표가 쌓인다. 주문표 꽂이에 칸 수를 정해 두지 않으면 줄이 끝없이 길어져 결국 메모리가 바닥나고, 그 전에 이미 모든 손님이 한참 늦게 받는다. 칸 수를 정해 두면 꽂이가 찼을 때 주문받는 쪽이 기다리거나 새 주문을 거절하게 되어, 뒤쪽의 느린 속도가 앞쪽까지 전해진다(백프레셔). 대신 기다리게 한 요청은 늦어지고 거절한 요청은 누군가 다시 보내야 하니, 어느 쪽을 고를지는 따로 정한다.

</div>


## 예시로 보기

서버가 요청을 받을 때마다 데이터베이스에 쓸 일을 큐에 넣고, 일꾼 태스크 하나가 큐에서 꺼내 처리한다. 평소에는 들어오는 속도보다 처리 속도가 빨라 큐가 거의 비어 있다. 그런데 트래픽이 몰리거나 데이터베이스가 느려지면 어떻게 될까?

생산자가 일감 200개를 쉬지 않고 넣고, 소비자는 하나에 `sleep(1ms)`를 하며 꺼내는 실험으로 쟀다. 소비자는 실제로는 한 개당 평균 2.3ms가 걸렸다. tokio의 `sleep`은 밀리초 단위로 움직이고, 정밀한 시간이 필요한 곳에는 쓰지 말라고 문서에 적혀 있다[^4]. 1ms를 달라고 해도 그보다 길게 잔다.

```rust
let (tx, mut rx) = mpsc::unbounded_channel::<usize>();
// ... 소비자 태스크: while let Some(i) = rx.recv().await { slow_consume(i).await; ... }
for i in 0..N {
    tx.send(i).unwrap();                            // 절대 기다리지 않는다
    let queued = i + 1 - done.load(Ordering::SeqCst); // 보냈지만 아직 처리 안 된 개수
    max_len = max_len.max(queued);
}
```

같은 일을 세 가지 채널로 시켰다.

| 방법 | 큐 최대 길이 | 생산자가 200개를 다 내는 데 | 처리된 일 |
|---|---|---|---|
| `unbounded_channel()` + `send` | 200 / 200 | 한 번도 기다리지 않았다 | 200 |
| `channel(16)` + `send(..).await` | 16 | 415~463ms | 200 |
| `channel(16)` + `try_send` | 16 이하 | 기다리지 않았다 | 42~44 (156~158개는 버렸다) |

**무제한 채널.** 생산자가 200개를 다 넣을 때까지 소비자는 하나도 끝내지 못했다. 무제한 채널의 `send`는 늘 바로 끝나서[^2], 생산자를 늦출 장치가 없다. 일감이 끝없이 들어오는 서버라면 큐도 끝없이 자란다. tokio 튜토리얼은 무제한 큐가 결국 메모리를 모두 채우고 시스템이 예측할 수 없게 무너진다고 경고한다[^1].

**크기 제한 채널.** 큐가 16칸에서 멈췄다. 칸이 차면 `send(..).await`가 빈 칸이 날 때까지 기다리기 때문이다[^1][^2]. 생산자는 소비자 속도로 느려졌다. 처음 16개는 바로 들어가고 나머지 184개는 소비자가 하나 꺼낼 때마다 하나씩 들어가니, $$184 \times 2.3\text{ms} \approx 423\text{ms}$$로 실측 415~463ms와 거의 같다. 느린 쪽의 속도가 앞쪽까지 그대로 전해진 것, 이것이 백프레셔다.

**try_send.** 기다리지 않고 넣어 보고, 차 있으면 `Err(Full(값))`으로 그 일을 돌려받는다[^3]. 실험에서는 돌려받은 일을 그냥 버렸다. 받아들인 42~44개는 모두 처리했다. 큐 16칸에, 생산자가 200개를 내는 동안 소비자가 처리한 만큼을 더한 수다. 들어오는 일을 일부러 버려 남은 일을 지키는 이 방법을 부하 버리기(load shedding)라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `channel(2)`의 `try_send` 결과와 남은 칸, 세 채널의 큐 최대 길이와 시간, 소비자 한 개당 2.3ms, `Semaphore(4)`의 최대 동시 실행 4, `try_acquire`의 처리 3·거절 7, axum 서버에 건 두 상한 레이어의 차이를 실행해 확인했다 — [39_backpressure_impl.rs](/Hongs_Blog/studies/rust/code/39_backpressure_impl/). 시간은 이 Mac(aarch64)의 디버그 빌드에서 잰 값이다.</div>

</div>


## 정의

백프레셔는 받는 쪽이 감당하지 못한다는 사실을 보내는 쪽에 전해, 보내는 쪽이 기다리거나 일을 줄이게 하는 것이다. tokio에서는 크기 제한 채널이 이 일을 한다. 칸이 차면 보내는 쪽이 기다리고, 칸이 비면 깨어난다[^1][^2].

큐가 찼을 때 할 수 있는 일은 셋이다.

| 큐가 차면 | tokio 도구 | 보내는 쪽이 겪는 일 | 어울리는 곳 |
|---|---|---|---|
| 기다리게 한다 | `send(..).await`, `reserve().await` | 늦어진다 | 내부 파이프라인, 일을 잃으면 안 될 때 |
| 거절한다 | `try_send` → `Full(값)` | 바로 실패를 알고 값을 돌려받는다 | 바로 답해야 하는 서버(503 응답), 버려도 되는 지표 샘플 |
| 끝없이 받는다 | `unbounded_channel` | 아무 일도 없다. 그동안 메모리가 는다 | 쌓일 양에 다른 상한이 있을 때만 |

크기 제한 채널의 `try_send` 동작을 칸 2개로 보면 다음과 같다.

| 한 일 | 결과 |
|---|---|
| `try_send(1)`, `try_send(2)` | 둘 다 `Ok(())` |
| `try_send(3)` | `Err(Full(..))`, `capacity()`가 0 |
| `recv()` 한 번 | `Some(1)`, `capacity()`가 1 |
| 받는 쪽을 버린 뒤 `try_send(4)` | `Err(Closed(4))` |

`capacity()`는 지금 남은 칸 수이고, `max_capacity()`는 만들 때 정한 칸 수 그대로다[^3].

**큐가 늘리는 기다림.** 칸 수를 정해도 기다림은 생긴다. 소비자가 하나라면 새로 들어온 일은 앞에 줄 선 일이 다 끝나기를 기다린다. 칸 수를 $$C$$, 한 개 처리 시간을 $$s$$라 하면 큐에서 기다리는 시간은 많아야 대략 $$C \times s$$다.

$$W_{\max} \approx C \times s$$


$$W_{\max}$$는 일 하나가 큐 안에서 기다리는 가장 긴 시간이다. 위 실험이면 $$16 \times 2.3\text{ms} \approx 37\text{ms}$$다. 칸 수를 크게 잡을수록 메모리는 더 쓰고 지연은 길어진다. 칸 수를 작게 잡을수록 보내는 쪽이 더 자주 기다리거나 더 자주 거절당한다.

## 동시 실행 수 제한: Semaphore

채널의 칸 수는 "기다리는 일"의 수를 묶는다. "동시에 도는 일"의 수는 따로 묶어야 한다. 요청마다 `tokio::spawn`을 하면 태스크가 끝없이 생기고, 데이터베이스 연결이나 외부 API 호출이 한꺼번에 몰린다. `tokio::sync::Semaphore`는 허가증(permit)을 정해진 수만큼만 내준다. 운영체제 수업의 계수 세마포어([세마포어](/Hongs_Blog/studies/operating-systems/semaphore/))와 같은 것이다.

```rust
let sem = Arc::new(Semaphore::new(4));
for _ in 0..40 {
    let permit = sem.clone().acquire_owned().await.unwrap(); // 자리가 없으면 여기서 기다린다
    set.spawn(async move {
        do_work().await;   // 10ms
        drop(permit);      // 끝나면 자리를 돌려준다
    });
}
```

10ms짜리 일 40개를 돌렸더니 최대 동시 실행은 4였고, 118~122ms 걸렸다. 이론값은 $$40 / 4 \times 10\text{ms} = 100\text{ms}$$다.

- `acquire_owned`는 `Arc<Semaphore>`를 받아, 태스크 안으로 옮길 수 있는 허가증을 돌려준다. 허가증을 버리면 자리가 돌아간다[^5].
- 허가증은 요청한 순서대로 나간다(FIFO)[^5]. 운영체제 수업의 강한 세마포어이고, 앞에서 기다리는 쪽이 굶지 않는다.
- `try_acquire`는 자리가 없으면 기다리지 않고 `NoPermits` 오류를 돌려준다[^5]. 자리 3개에 동시 요청 10개를 넣었더니 3개를 처리하고 7개를 거절했다. HTTP 서버라면 거절한 요청에 503을 돌려준다.
- 허가증은 **`spawn` 전에** 받는다. 그래야 자리가 없을 때 반복 자체가 멈춰 백프레셔가 생긴다. 태스크를 먼저 띄우고 안에서 `acquire`하면 동시 실행 수는 묶이지만, 기다리는 태스크는 끝없이 쌓인다.
- `acquire`는 취소에 안전하지 않다. `select!`에서 지면 줄 선 자리를 잃는다[^5]([취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/)).

## 서버에 걸기: tower의 상한 레이어

axum 같은 tower 기반 서버에서는 같은 일을 미들웨어(레이어)로 건다.

- `ServiceBuilder::concurrency_limit(n)`: 동시에 처리 중인 요청 수를 묶는다[^6]. 자리가 없으면 요청은 자리가 날 때까지 기다린다.
- `ServiceBuilder::load_shed()`: 다음 레이어가 요청을 받을 준비가 안 됐으면 요청을 버린다[^6][^7]. 버린 요청은 `Overloaded` 오류가 된다[^8]. 크레이트 기능 `load-shed`가 필요하다[^7].
- 레이어는 먼저 추가한 것이 요청을 먼저 받는다[^6]. tower 문서의 예 `ServiceBuilder::new().load_shed().concurrency_limit(64).timeout(Duration::from_secs(10))`에서는 `load_shed`가 바깥에 있다. 그래서 64개가 처리 중일 때 들어온 요청은 기다리지 않고 바로 거절된다.

이 과목의 하네스에는 tower의 `load-shed` 기능이 없어 `load_shed`는 돌려 보지 않았다. 같은 효과는 위의 `try_acquire` 실험에서 확인했다.

**상한이 어디에 걸리는가.** axum 서버에 동시 처리 상한 1을 걸고, 30ms짜리 핸들러 하나(`GET /work`)에 연결 4개로 동시에 요청을 보냈다. 네 요청 모두 같은 라우트다.

| `Router::layer(...)`에 건 레이어 | 핸들러가 함께 돈 최대 수 |
|---|---|
| `ConcurrencyLimitLayer::new(1)` | 4 |
| `GlobalConcurrencyLimitLayer::new(1)` | 1 |

`ConcurrencyLimitLayer`는 레이어를 씌운 서비스마다 상한을 따로 둔다. `GlobalConcurrencyLimitLayer`는 여러 서비스가 세마포어(`Arc<Semaphore>`) 하나를 나눠 쓰고, 레이어를 복제해도 새 세마포어를 만들지 않는다[^9]. axum의 `Router::layer`는 레이어를 라우터의 모든 라우트에 붙인다[^10]. 이 실험에서는 같은 라우트로 온 요청인데도 `ConcurrencyLimitLayer`가 연결 4개를 전혀 묶지 못했다. 라우트마다 상한이 하나씩 생기는 것만이 아니라, 그보다 작은 단위로 상한이 새로 생긴다는 뜻이다 [확인필요: axum이 연결마다 라우터를 다시 준비하는지는 소스를 열어 보지 않았다. 실측 결과만 적는다]. 서버 전체의 상한이 목적이면 `GlobalConcurrencyLimitLayer`를 쓴다. [캡스톤 5](/Hongs_Blog/studies/rust/capstone-5/)의 서버도 그렇게 한다.

## 보장하는 것과 보장하지 않는 것

| 보장한다 | 보장하지 않는다 |
|---|---|
| 크기 제한 채널에는 칸 수보다 많은 값이 쌓이지 않는다(실측 최대 16) | 기다리는 보내는 쪽의 수. `send(..).await` 중인 태스크는 따로 늘어날 수 있다 |
| tokio `send`와 `reserve`는 부른 순서대로 끝난다[^3] | 버린 일이 다시 시도된다는 것. 그것은 부른 쪽이 정한다 |
| 세마포어는 허가증을 정한 수보다 많이 내주지 않는다(실측 최대 4) | 지연이 짧다는 것. 큐 안에서 대략 $$C \times s$$까지 기다린다 |
| `try_send`·`try_acquire`는 기다리지 않는다 | 무제한 채널이 언제 메모리를 다 쓸지 |

**실패 장면 1 — 느린 디스크와 무제한 로그 큐.** 로그 줄을 무제한 채널로 쓰기 태스크에 보낸다. 디스크가 느려지자 큐가 자라고, 메모리가 바닥나 프로세스 전체가 죽는다. 로그 하나 때문에 모든 요청을 잃는다. 크기 제한 채널에 `try_send`를 쓰고, 버린 줄 수를 지표로 세면 로그 일부만 잃는다.

**실패 장면 2 — `select!` 안의 `send`.** 크기 제한 채널의 `send(..).await`를 `select!` 가지에 넣고 다른 가지가 이기면, 보내려던 값이 버려진다[^3]. 먼저 `reserve().await`로 칸을 잡고, 받은 허가(`Permit`)로 보낸다[^3]([취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/)).

## 활용

- **칸 수 고르기.** tokio 튜토리얼은 감당할 수 있는 칸 수를 고르라고 하고, 좋은 상한을 고르는 것이 믿을 만한 tokio 프로그램을 짜는 일의 큰 부분이며 알맞은 값은 프로그램마다 다르다고 한다[^1]. 출발점은 위의 식이다. 견딜 수 있는 대기 시간을 한 개 처리 시간으로 나눈다. 예를 들어 처리에 5ms가 걸리고 큐에서 100ms까지 기다려도 된다면 칸은 20개 안팎이다.
- **여러 층에 상한을 둔다.** 연결 수(tokio 튜토리얼은 TCP accept 반복에서 열린 소켓 수를 묶는 예를 든다[^1]), 동시 처리 수(`Semaphore`, `GlobalConcurrencyLimitLayer`), 큐 길이(크기 제한 채널), 시간(`timeout`, [취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/)). 어느 한 층이라도 무제한이면 그 층에서 쌓인다.
- **거절은 빨리, 분명하게.** 거절할 거면 기다리게 하지 않고 바로 503을 돌려준다. 기다리다 시간 초과로 실패하는 것보다 클라이언트가 빨리 다른 서버로 가거나 나중에 다시 시도할 수 있다. axum에서 오류를 응답으로 바꾸는 법은 [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)에서 다룬다.
- **흔한 실수.**
  - 아무 생각 없이 `unbounded_channel`을 쓴다. 요청마다 상한 없이 `tokio::spawn`하는 것도 같은 문제다. 태스크 하나하나가 줄 선 일이다.
  - 태스크를 띄운 뒤 그 안에서 `acquire`한다. 동시 실행은 묶여도 기다리는 태스크가 끝없이 쌓인다.
  - `Router::layer(ConcurrencyLimitLayer::new(n))`이 서버 전체를 묶는다고 믿는다. 위 실험에서는 전혀 묶지 못했다.
  - 버린 일을 세지 않는다. `try_send`가 `Full`을 돌려줄 때마다 지표를 올려야 언제부터 부하를 버리기 시작했는지 안다([tracing으로 관측하기](/Hongs_Blog/studies/rust/tracing-observability/)).

## 연결

- 선수: [채널](/Hongs_Blog/studies/rust/channels/)(`sync_channel`이 같은 일을 스레드에서 한다), [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/), [취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/)
- 운영체제: 크기 제한 채널은 유한 버퍼([생산자-소비자 문제](/Hongs_Blog/studies/operating-systems/producer-consumer/))이고, `Semaphore`는 계수 세마포어([세마포어](/Hongs_Blog/studies/operating-systems/semaphore/))다.
- 다음: 부하를 받던 서버를 질서 있게 끝내기는 [안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/)
- 연습: [async 연습](/Hongs_Blog/studies/rust/async-practice/) p3(동시 3개, 일마다 시간 제한)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 출력을 예측하라.</summary>

```rust
let (tx, mut rx) = tokio::sync::mpsc::channel::<u32>(2);
let r = [tx.try_send(1), tx.try_send(2), tx.try_send(3)];
println!("{:?} {:?} {:?} {}", r[0], r[1], r[2], tx.capacity());
rx.recv().await;
println!("{}", tx.capacity());
drop(rx);
println!("{:?}", tx.try_send(4));
```
**답:** `Ok(()) Ok(()) Err("Full(..)") 0`, 그다음 `1`, 마지막은 `Err("Closed(..)")`.<br>
**이유:** 칸이 2개라 세 번째는 `Full`이고 남은 칸은 0이다. 하나를 꺼내면 칸 하나가 빈다. 받는 쪽이 사라지면 `Closed`다. 두 오류 모두 넣으려던 값(`3`, `4`)을 품고 있지만 `Debug` 출력에서는 `..`로 가려진다. 검증 코드 출력과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 둘에 크기 제한 채널과 `Semaphore` 중 무엇을 쓰나? (가) 데이터베이스 연결이 10개뿐이라 질의를 동시에 10개까지만 보내야 한다. (나) 요청 핸들러가 감사 기록을 쓰기 태스크 하나에 넘기는데, 쓰기가 밀려도 기록이 1,000개 넘게 쌓이면 안 된다.</summary>

**답:** (가) `Semaphore::new(10)`. 묶을 것은 동시에 도는 질의 수다. (나) `mpsc::channel(1000)`. 묶을 것은 기다리는 기록 수다. 다 차면 `send(..).await`로 기다릴지 `try_send`로 버릴지를 정한다.<br>
**흔한 오답:** "(가)도 크기 10 채널." 채널은 쌓이는 수를 묶을 뿐이다. 받는 쪽이 꺼낸 뒤 동시에 몇 개를 돌릴지는 채널이 정하지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "axum 라우터에 `.layer(ConcurrencyLimitLayer::new(100))`를 걸었으니, 서버 전체에서 동시에 도는 요청은 100개를 넘지 않는다." 이 주장의 반례를 실험으로 들라. 어떻게 고치나?</summary>

**답:** 상한을 1로 걸고 연결 4개로 30ms짜리 핸들러에 동시에 요청하면, 핸들러 4개가 함께 돈다. `GlobalConcurrencyLimitLayer::new(1)`로 바꾸면 최대 1개다.<br>
**이유:** `ConcurrencyLimitLayer`는 레이어를 씌운 서비스마다 따로 상한을 둔다. `GlobalConcurrencyLimitLayer`는 세마포어 하나를 모든 서비스가 나눠 쓴다.

</details>


[^1]: Tokio Tutorial, Channels — Backpressure and bounded channels — https://tokio.rs/tokio/tutorial/channels
[^2]: tokio 문서, Module `tokio::sync::mpsc` (Bounded channel, Unbounded channel) — https://docs.rs/tokio/latest/tokio/sync/mpsc/index.html
[^3]: tokio 문서, Struct `tokio::sync::mpsc::Sender` — `try_send`, `send`의 Cancel safety와 순서, `reserve`, `capacity`, `max_capacity` — https://docs.rs/tokio/latest/tokio/sync/mpsc/struct.Sender.html
[^4]: tokio 문서, Function `tokio::time::sleep` ("Sleep operates at millisecond granularity") — https://docs.rs/tokio/latest/tokio/time/fn.sleep.html
[^5]: tokio 문서, Struct `tokio::sync::Semaphore` — Fairness, `acquire`, `try_acquire`, `acquire_owned`, Limit the number of outgoing requests — https://docs.rs/tokio/latest/tokio/sync/struct.Semaphore.html
[^6]: tower 문서, Struct `tower::ServiceBuilder` — `concurrency_limit`, `load_shed`, Order — https://docs.rs/tower/latest/tower/struct.ServiceBuilder.html
[^7]: tower 문서, Module `tower::load_shed` — https://docs.rs/tower/latest/tower/load_shed/index.html
[^8]: tower 문서, Struct `tower::load_shed::error::Overloaded` — https://docs.rs/tower/latest/tower/load_shed/error/struct.Overloaded.html
[^9]: tower 문서, Struct `tower::limit::concurrency::GlobalConcurrencyLimitLayer` — https://docs.rs/tower/latest/tower/limit/concurrency/struct.GlobalConcurrencyLimitLayer.html
[^10]: axum 문서, Struct `axum::Router` — `layer` — https://docs.rs/axum/latest/axum/struct.Router.html
{% endraw %}
