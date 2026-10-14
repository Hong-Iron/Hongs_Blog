---
layout: "note"
title: "취소·타임아웃·select"
display_title: "취소·타임아웃·select"
kind: "concept"
kind_label: "모델"
num: "38"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Cancellation", "취소", "Timeout", "타임아웃", "tokio::time::timeout", "select!", "tokio::select", "biased", "취소 안전성", "Cancel Safety", "Cancellation Safety", "CancellationToken", "abort"]
description: "async Rust에서 일을 멈추는 방법은 하나뿐이다. 그 일을 하던 퓨처를 버린다. 버리면 퓨처는 멈춰 있던 .await 자리에서 다시는 깨어나지 않고, 들고 있던 값은 정리된다. 시간 제한(timeout)과 \"먼저 끝나는 쪽만 고르기\"(select!)도 모두 이 방법으로 나머지…"
prev_url: "/studies/rust/tokio-runtime-tasks/"
prev_title: "tokio 런타임과 태스크"
next_url: "/studies/rust/backpressure/"
next_title: "백프레셔와 큐 제한"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/cancellation-timeouts-select/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

async Rust에서 일을 멈추는 방법은 하나뿐이다. 그 일을 하던 퓨처를 버린다. 버리면 퓨처는 멈춰 있던 `.await` 자리에서 다시는 깨어나지 않고, 들고 있던 값은 정리된다. 시간 제한(timeout)과 "먼저 끝나는 쪽만 고르기"(`select!`)도 모두 이 방법으로 나머지를 멈춘다. 그래서 어느 `.await`에서 멈춰도 데이터를 잃지 않게 짜야 하고, `.await` 없이 도는 코드는 아무도 멈출 수 없다.

</div>


## 예시로 보기

외부 API를 부르는데 가끔 응답이 오지 않는다. 기다림에 끝이 없으면 요청 하나가 연결과 메모리를 영원히 붙잡는다. 그래서 "1초 안에 안 오면 포기"가 필요하다. 스레드였다면 다른 스레드를 밖에서 강제로 멈출 안전한 방법이 마땅치 않다. 퓨처는 다르다. 퓨처는 누군가 `poll`해 줘야만 움직이므로, 그만 `poll`하고 버리면 그것으로 멈춘다[^1][^5].

```rust
match timeout(Duration::from_secs(1), call_api()).await {
    Ok(v) => v,                  // 1초 안에 끝났다
    Err(_elapsed) => fallback(), // 시간이 지나 call_api() 퓨처를 버렸다
}
```

버린 퓨처 안에서는 무슨 일이 생길까. 200ms를 기다리는 일에 20ms 제한을 걸고, 일 안에 "버려지면 깃발을 세우는" 값을 넣어 확인했다.

```rust
async fn slow_job(dropped: Arc<AtomicBool>, after_await: Arc<AtomicBool>) -> u32 {
    let _g = Guard(dropped);                     // Drop 때 깃발을 세운다
    sleep(Duration::from_millis(200)).await;     // ← 여기서 멈춘 채 버려진다
    after_await.store(true, Ordering::SeqCst);   // 끝내 돌지 않는다
    1
}
```

출력은 `timeout 결과 is_err=true, Guard 정리됨=true, .await 뒤 코드 실행됨=false`였다. 퓨처 안의 지역 변수는 보통 값처럼 `Drop`으로 정리되고, 멈춘 `.await` 뒤의 코드는 실행되지 않는다. Java라면 `finally`에 둘 정리 코드를 Rust에서는 `Drop`에 둔다([try-catch-finally](/Hongs_Blog/studies/java/java-try-catch/)).

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: timeout이 지나면 안쪽 퓨처가 버려지는 것, 이미 끝난 퓨처는 시간 0이어도 `Ok`인 것, `.await` 없는 100ms 계산에 10ms 제한이 듣지 않는 것, `select!`의 무작위·biased 순서(1000번), 취소에 안전한 읽기와 아닌 읽기의 메시지 손실, `CancellationToken`의 부모·자식 관계를 확인했다 — [38_cancellation-timeouts-select_impl.rs](/Hongs_Blog/studies/rust/code/38_cancellation-timeouts-select_impl/)</div>

</div>


## 퓨처를 멈추는 네 가지 길

Async Book은 퓨처를 취소하는 길을 이렇게 꼽는다[^5]. 모두 결국 퓨처를 버리는 것이다.

| 방법 | 누가 버리나 | 쓰는 곳 |
|---|---|---|
| 퓨처를 그냥 `drop` | 내가 | 가장 단순한 경우 |
| `tokio::time::timeout(d, fut)` | 시간이 지나면 timeout이 | 외부 호출 시간 제한 |
| `tokio::select!` | 먼저 끝난 가지가 나머지를 | 여러 일 중 먼저 오는 것 |
| `JoinHandle::abort()` | 런타임이 그 태스크를 | 띄워 둔 태스크 멈추기 |
| `CancellationToken` | 태스크가 신호를 보고 **스스로** | 정리할 시간을 주며 끝내기 |

마지막 줄만 성격이 다르다. 앞의 넷은 밖에서 버린다. 토큰은 "멈춰 달라"는 신호만 보내고, 태스크가 그 신호를 보고 정리한 뒤 스스로 끝난다[^5].

## timeout

`timeout(d, fut)`는 `Result<T, Elapsed>`를 주는 퓨처다. 시간이 지나면 안쪽 퓨처를 버리고 `Err(Elapsed)`를 낸다[^3]. 경계에서의 동작이 둘 있다.

- **이미 끝난 퓨처는 시간이 0이어도 `Ok`다.** timeout은 안쪽 퓨처를 먼저 `poll`하고 나서 시계를 본다[^3]. `timeout(Duration::ZERO, async { 5 }).await`는 `Ok(5)`였다.
- **`.await` 없이 도는 코드는 끊지 못한다.** 같은 이유로, 안쪽 퓨처가 한 번의 `poll` 안에서 오래 돌면 timeout은 그동안 끼어들 기회가 없다[^3]. `std::thread::sleep(100ms)`를 하는 퓨처에 10ms 제한을 걸었더니 결과가 `Ok("다 돌았다")`였다.

## select!

`tokio::select!`는 여러 퓨처를 같은 태스크에서 함께 `poll`하다가, 처음 끝난 가지의 코드를 돌리고 **나머지 퓨처는 버린다**[^2].

```rust
tokio::select! {
    m = rx.recv() => handle(m),            // 메시지가 먼저 오면
    _ = sleep(Duration::from_secs(5)) => { // 5초가 먼저 지나면 recv() 퓨처는 버려진다
        heartbeat();
    }
}
```

- 모든 가지가 같은 태스크에서 돈다. 그래서 `spawn`과 달리 지역 변수를 빌려도 된다[^1].
- 둘 이상이 동시에 준비돼 있으면 **무작위로** 고른다. 한 가지가 늘 준비돼 있어도 다른 가지가 굶지 않게 하려는 것이다[^2]. 맨 위에 `biased;`를 쓰면 위에서부터 차례로 본다. 이때 공정함은 내 책임이고, 종료 신호처럼 놓치면 안 되는 가지를 위에 둔다[^2].
- 가지에 `, if 조건`을 붙이면 조건이 거짓일 때 그 가지를 끈다. 모든 가지가 꺼졌는데 `else` 가지가 없으면 panic한다[^2].

두 가지가 모두 바로 준비된 `select!`를 1000번 돌려 첫 가지가 뽑힌 횟수를 셌다. 기본은 528번, `biased`는 1000번이었다.

## 취소 안전성

`select!`를 루프 안에서 돌리면 지는 가지의 퓨처가 매번 버려진다. 그 퓨처가 일을 반쯤 해 둔 상태였다면 그 반은 사라진다. tokio 문서는 기준을 이렇게 정한다. **아직 끝나지 않은 퓨처를 버렸다가 다시 만들어도 아무 일이 없으면** 그 퓨처는 취소에 안전하다(cancel safe)[^2].

30ms마다 메시지를 하나씩 보내는 생산자에게서 6개를 받으며, 매번 10ms 타이머와 경쟁시켰다.

```rust
// 안전하지 않다: 첫 메시지를 지역 변수에 받아 둔 채 둘째를 기다린다
async fn read_two(rx: &mut mpsc::Receiver<u32>) -> Option<(u32, u32)> {
    let a = rx.recv().await?;
    let b = rx.recv().await?;   // 여기서 버려지면 a는 사라진다
    Some((a, b))
}

// 안전하다: 받아 둔 첫 메시지를 퓨처 밖에 둔다
async fn read_two_safe(rx: &mut mpsc::Receiver<u32>, pending: &mut Option<u32>) -> Option<(u32, u32)> {
    if pending.is_none() {
        *pending = Some(rx.recv().await?);
    }
    let b = rx.recv().await?;
    Some((pending.take().unwrap(), b))
}
```

| `select!` 가지 | 받은 메시지 |
|---|---|
| `rx.recv()` | `[1, 2, 3, 4, 5, 6]` |
| `read_two(&mut rx)` | `[]` (모두 잃었다) |
| `read_two_safe(&mut rx, &mut pending)` | `[1, 2, 3, 4, 5, 6]` |

`read_two`는 첫 메시지를 받고 30ms 뒤의 둘째를 기다리는 사이, 10ms 타이머가 이겨 퓨처가 버려진다. 그 안의 `a`가 함께 사라진다. 매번 같은 일이 생겨 하나도 받지 못했다.

tokio 문서가 꼽는 예[^2][^6]:

| 취소에 안전하다 | 안전하지 않다 |
|---|---|
| `mpsc::Receiver::recv`, `watch::Receiver::changed`, `TcpListener::accept`, `AsyncReadExt::read`, `JoinSet::join_next`, `CancellationToken::cancelled` | `AsyncReadExt::read_exact`·`read_to_end`·`read_to_string`, `AsyncWriteExt::write_all`(데이터를 잃을 수 있다), `mpsc::Sender::send`(보내려던 값이 버려진다), `Mutex::lock`·`Semaphore::acquire`(줄 선 자리를 잃는다) |

안전하지 않은 퓨처를 루프에서 계속 쓰려면 두 방법이 있다. 퓨처를 루프 밖에서 한 번 만들고 `tokio::pin!`으로 고정한 뒤 `&mut fut`로 `select!`에 넣어 다음 바퀴에도 같은 퓨처를 이어 쓴다[^1]. 또는 `read_two_safe`처럼 중간 상태를 퓨처 밖에 둔다. 종료 직전처럼 반쯤 읽은 데이터를 잃어도 괜찮은 때라면 안전하지 않은 퓨처를 버려도 된다[^2].

## CancellationToken

`tokio_util::sync::CancellationToken`은 "이제 그만"을 여러 태스크에 알리는 깃발이다[^4].

- `cancel()`: 토큰과 그 자식 토큰을 모두 취소하고, 기다리던 태스크를 깨운다.
- `cancelled()`: 취소되면 끝나는 퓨처. 취소에 안전하다.
- `child_token()`: 부모가 취소되면 같이 취소된다. 자식을 취소해도 부모는 그대로다.
- `run_until_cancelled(fut)`: `fut`가 먼저 끝나면 `Some(값)`, 토큰이 먼저 취소되면 `fut`를 버리고 `None`.

```rust
let worker = tokio::spawn(async move {
    loop {
        tokio::select! {
            biased;                        // 종료 신호를 먼저 본다
            _ = token.cancelled() => break,
            _ = do_one_unit_of_work() => {}
        }
    }
    flush_buffers().await;                 // 버려지는 대신 스스로 정리한다
});
```

`abort()`는 태스크를 멈춘 `.await` 자리에서 그냥 버린다. 토큰은 태스크가 정리 코드를 돌릴 기회를 준다. 여러 태스크를 질서 있게 끝내는 방법은 [안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/)에서 잇는다.

## 보장하는 것과 보장하지 않는 것

| 보장한다 | 보장하지 않는다 |
|---|---|
| 버린 퓨처는 다시 `poll`되지 않는다. 멈춘 `.await` 뒤 코드는 돌지 않는다 | 버린 퓨처가 시작해 둔 바깥 일(다른 태스크, 이미 보낸 요청)이 멈추는 것 |
| 퓨처 안의 지역 변수는 `Drop`으로 정리된다 | `.await` 사이에서 도는 코드가 멈추는 것. timeout도 abort도 다음 `.await`까지 기다린다 |
| `select!`는 한 가지의 코드만 돌린다 | 기본 `select!`에서 어느 가지가 이길지. 둘 다 준비돼 있으면 무작위다 |
| 취소에 안전한 퓨처는 버려도 데이터를 잃지 않는다 | 취소에 안전하지 않은 퓨처의 반쯤 한 일 |

**실패 장면 — 바깥 일은 남는다.** 요청 핸들러가 `tokio::spawn(write_audit_log())`를 띄우고 `.await` 중에 timeout으로 버려졌다. 핸들러 퓨처는 사라졌지만 띄운 태스크는 계속 돈다([tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)에서 `JoinHandle`을 버린 태스크가 끝까지 돈 것과 같다). 함께 멈춰야 한다면 `CancellationToken`을 넘기거나 `JoinSet`에 넣어 둔다. tokio 튜토리얼은 `oneshot::Receiver`가 버려질 때 `Sender`에 알리는 기능을 써서 바깥 일을 멈추는 예를 든다[^1].

## 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`read_two`가 메시지를 잃는 과정을 시간 순서로 말해 보라. 어느 줄에서 무엇이 사라지나?</summary>

0ms에 `select!`가 `read_two`와 10ms 타이머를 함께 `poll`한다. 30ms쯤 메시지 1이 와서 `let a = …`가 끝나고 `a = 1`이 퓨처 안에 저장된다. 둘째 `recv().await`에서 다시 멈춘다. 그 새 바퀴의 타이머가 40ms쯤 먼저 끝나 `select!`가 `read_two` 퓨처를 버린다. 퓨처 안의 `a = 1`이 함께 버려진다. 다음 바퀴의 새 `read_two`는 메시지 2부터 받는다. 같은 일이 되풀이된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`read_two_safe`는 무엇을 바꿔서 안전해졌나? 이 방법을 쓸 수 있는 다른 상황은?</summary>

반쯤 한 일(받아 둔 첫 메시지)을 퓨처 안이 아니라 호출한 쪽의 변수 `pending`에 둔다. 퓨처가 버려져도 `pending`은 남으므로 다시 만든 퓨처가 이어서 쓴다. 바이트를 조금씩 읽어 한 줄을 모으는 파서, 여러 번에 나눠 보내는 쓰기도 진행 상태를 퓨처 밖 버퍼에 두면 같은 방식으로 안전해진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">10ms 제한을 건 `timeout`이 100ms짜리 `std::thread::sleep`을 끊지 못한 근거는?</summary>

timeout은 안쪽 퓨처를 `poll`하고 돌아온 뒤에야 시계를 본다. 안쪽 퓨처는 `poll` 한 번 안에서 100ms를 자고 `Ready`를 낸다. timeout 쪽에 차례가 돌아왔을 때는 이미 결과가 나와 있으므로 `Ok`를 낸다. 퓨처를 버리는 일은 퓨처가 `Pending`으로 멈춰 있을 때만 의미가 있다.

</details>


## 활용

- **외부 호출에는 항상 시간 제한.** HTTP 클라이언트, DB 질의, 다른 서비스 호출을 `timeout`으로 감싼다. 서버 쪽에서는 tower의 `TimeoutLayer`나 tower-http의 timeout 미들웨어로 요청 전체에 건다([axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)).
- **`select!` 루프.** 메시지 받기, 주기적 작업, 종료 신호를 한 루프에서 다룬다. 종료 가지는 `biased;`로 맨 위에 둔다.
- **테스트의 시간.** `tokio::time::pause()`나 `#[tokio::test(start_paused = true)]`로 가짜 시계를 쓰면 실제로 기다리지 않고 시간 관련 코드를 시험할 수 있다. `test-util` 기능과 current_thread 런타임이 필요하다[^7]. 이 과목의 harness에는 `test-util`이 없어 검증 코드는 실제 시간을 넉넉한 간격으로 쓴다.
- **흔한 실수.**
  - 루프 안 `select!`에 `send`, `read_exact`, `lock`처럼 취소에 안전하지 않은 퓨처를 넣는다.
  - timeout을 걸었으니 CPU를 오래 쓰는 계산도 끊긴다고 믿는다. `.await`가 없으면 끊지 못한다. 계산은 `spawn_blocking`으로 보내고 그 `JoinHandle`에 timeout을 건다. 이때도 시간이 지나면 기다리기만 그만둘 뿐, 블로킹 스레드의 계산은 계속 돈다.
  - `select!`에서 `biased;` 없이 종료 가지를 두고, 종료가 곧바로 처리되리라 믿는다. 무작위라 다른 가지가 먼저 뽑힐 수 있다.

## 연결

- 선수: [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/), [채널](/Hongs_Blog/studies/rust/channels/)
- 바탕: 퓨처는 `poll`되어야만 움직인다([Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/)). 그래서 버리면 멈춘다.
- 다음: [백프레셔와 큐 제한](/Hongs_Blog/studies/rust/backpressure/), [안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"timeout이 지나면 그 일은 즉시 멈춘다"</div>

틀렸다. 그럴듯한 이유는 이름이 "시간 초과"이고, 대부분의 실험에서 정말 바로 멈추기 때문이다. 실제로는 timeout이 할 수 있는 일은 안쪽 퓨처를 버리는 것뿐이고, 버리는 일은 퓨처가 `.await`에서 멈춰 있을 때만 효과가 있다[^3]. `.await` 없이 100ms를 자는 퓨처에 10ms 제한을 걸었더니 100ms를 다 돌고 `Ok`가 나왔다. 그리고 퓨처가 띄워 둔 다른 태스크나 `spawn_blocking` 작업은 퓨처를 버려도 계속 돈다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"select!에서 진 쪽은 다음 바퀴에 이어서 돈다"</div>

틀렸다. 진 쪽 퓨처는 버려지고, 다음 바퀴에서는 새 퓨처가 처음부터 시작한다[^2]. `recv()`처럼 아직 아무것도 하지 않은 상태로 버려지는 퓨처는 괜찮지만, 반쯤 일한 퓨처는 그 반을 잃는다. `read_two`는 6개 중 하나도 받지 못했다. 이어서 돌게 하려면 퓨처를 루프 밖에서 만들어 `&mut`로 넣는다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 두 줄의 결과를 예측하라.</summary>

```rust
let a = timeout(Duration::ZERO, async { 5 }).await;
let b = timeout(Duration::from_millis(10), async {
    std::thread::sleep(Duration::from_millis(100));
    "다 돌았다"
}).await;
```
**답:** `a`는 `Ok(5)`, `b`는 `Ok("다 돌았다")`.<br>
**이유:** timeout은 안쪽 퓨처를 먼저 `poll`한다. 둘 다 첫 `poll`에서 `Ready`를 내므로 시계를 볼 필요도 없이 `Ok`다. `b`는 `.await`가 없어 그 사이에 끼어들 수 없다. 검증 코드 출력과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** "`select!` 루프에서 퓨처가 버려져도 데이터는 잃지 않는다"는 주장의 반례를 만들라.</summary>

**답:** 첫 메시지를 받아 지역 변수에 둔 뒤 둘째를 기다리는 `read_two`를 짧은 타이머와 함께 `select!` 루프에 넣는다. 메시지가 30ms 간격, 타이머가 10ms면 첫 메시지를 받은 뒤 타이머가 이겨 그 메시지가 사라진다. 실측으로 6개 중 0개를 받았다.<br>
**이유:** 퓨처를 버리면 퓨처 안에 저장된 지역 변수도 버려진다. 취소에 안전하려면 버리고 다시 만들어도 아무 일이 없어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 작업 태스크를 멈추고 싶다. 작업 중이던 버퍼를 디스크에 써야 한다. `JoinHandle::abort()`와 `CancellationToken` 중 무엇을 쓰나?</summary>

**답:** `CancellationToken`. 태스크가 `select!`에서 `token.cancelled()`를 보고 루프를 빠져나와 버퍼를 쓴 뒤 스스로 끝난다.<br>
**이유:** `abort()`는 태스크를 멈춘 `.await` 자리에서 버린다. `Drop`은 돌지만 async 정리 코드(디스크에 `.await`로 쓰기)는 돌릴 수 없다.<br>
**흔한 오답:** "abort해도 Drop이 도니 거기서 쓰면 된다." `Drop`은 동기 함수라 `.await`를 쓸 수 없고, 거기서 블로킹 입출력을 하면 실행기를 막는다.

</details>


[^1]: Tokio Tutorial, Select — Cancellation, Borrowing, Loops, Resuming an async operation, Per-task concurrency — https://tokio.rs/tokio/tutorial/select
[^2]: tokio 문서, Macro `tokio::select` — Fairness, Cancellation safety — https://docs.rs/tokio/latest/tokio/macro.select.html
[^3]: tokio 문서, Function `tokio::time::timeout` — Cancellation, Panics 위 본문(즉시 완료, 양보하지 않는 퓨처) — https://docs.rs/tokio/latest/tokio/time/fn.timeout.html
[^4]: tokio-util 문서, Struct `tokio_util::sync::CancellationToken` — `cancel`, `cancelled`, `child_token`, `run_until_cancelled` — https://docs.rs/tokio-util/latest/tokio_util/sync/struct.CancellationToken.html
[^5]: Asynchronous Programming in Rust (Async Book), More async/await topics — Cancellation — https://rust-lang.github.io/async-book/part-guide/more-async-await.html
[^6]: tokio 문서, Struct `tokio::sync::mpsc::Sender` — `send`의 Cancel safety, `reserve` — https://docs.rs/tokio/latest/tokio/sync/mpsc/struct.Sender.html
[^7]: tokio 문서, Function `tokio::time::pause` — https://docs.rs/tokio/latest/tokio/time/fn.pause.html
{% endraw %}
