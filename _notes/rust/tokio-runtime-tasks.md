---
layout: "note"
title: "tokio 런타임과 태스크"
display_title: "tokio 런타임과 태스크"
kind: "concept"
kind_label: "모델"
num: "37"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Tokio Runtime", "tokio", "런타임", "Runtime", "태스크", "Task", "tokio::spawn", "JoinHandle", "JoinSet", "spawn_blocking", "#[tokio::main]", "current_thread", "multi_thread", "작업 훔치기", "Work Stealing", "tokio::sync::Mutex"]
description: "표준 라이브러리에는 퓨처를 돌려 줄 실행기가 없다. tokio가 그 실행기다. 운영체제 스레드 몇 개 위에서 수만 개의 가벼운 작업(태스크)을 번갈아 돌린다. 태스크는 .await에서만 스스로 차례를 넘기므로, 한 태스크가 기다리지 않고 스레드를 붙잡으면 같은 스레드의 다른 태스크…"
prev_url: "/studies/rust/futures-async-await/"
prev_title: "Future와 async·await"
next_url: "/studies/rust/cancellation-timeouts-select/"
next_title: "취소·타임아웃·select"
math: false
mermaid: false
code_count: 2
permalink: "/studies/rust/tokio-runtime-tasks/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

표준 라이브러리에는 퓨처를 돌려 줄 실행기가 없다. tokio가 그 실행기다. 운영체제 스레드 몇 개 위에서 수만 개의 가벼운 작업(태스크)을 번갈아 돌린다. 태스크는 `.await`에서만 스스로 차례를 넘기므로, 한 태스크가 기다리지 않고 스레드를 붙잡으면 같은 스레드의 다른 태스크가 모두 멈춘다. 오래 붙잡는 일은 따로 마련된 블로킹 전용 스레드로 보내야 한다.

</div>


## 예시로 보기

[Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/)에서 만든 `block_on`은 퓨처 하나만 돌린다. 서버는 연결마다 퓨처가 하나씩 생기고, 그것들을 동시에 돌려야 한다. 그래서 퓨처를 실행기에 맡겨 독립적으로 돌게 한다. 실행기에 맡긴 퓨처를 태스크(task)라 부른다[^3].

```rust
#[tokio::main]
async fn main() {
    let h = tokio::spawn(async { 6 * 7 });   // 태스크를 띄운다. 바로 돌기 시작한다
    let v = h.await.unwrap();                 // JoinHandle을 await하면 결과가 온다
    assert_eq!(v, 42);
}
```

`#[tokio::main]`은 `main`을 보통 함수로 바꾸고, 그 안에서 런타임을 만들어 본문을 `block_on`으로 돌린다. tokio 문서가 밝힌 펼친 모양은 이렇다[^2].

```rust
tokio::runtime::Builder::new_multi_thread()
    .enable_all()
    .build()
    .unwrap()
    .block_on(async { /* 본문 */ })
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 런타임 두 종류의 스레드, `JoinHandle`의 값·panic·abort, `JoinHandle`을 버린 태스크, `JoinSet`의 순서와 버릴 때 동작, 블로킹이 다른 태스크를 멈추는 시간, `tokio::sync::Mutex`를 확인했다 — [37_tokio-runtime-tasks_impl.rs](/Hongs_Blog/studies/rust/code/37_tokio-runtime-tasks_impl/). `spawn`의 `'static` 경계 오류(E0373)는 [37_tokio-runtime-tasks_verify.rs](/Hongs_Blog/studies/rust/code/37_tokio-runtime-tasks_verify/)</div>

</div>


## 런타임 두 종류

| | multi_thread (기본) | current_thread |
|---|---|---|
| 스레드 | CPU 코어 수만큼 작업 스레드(worker)를 띄운다[^1] | 새 스레드를 띄우지 않는다. `block_on`을 부른 스레드에서 모두 돈다[^1] |
| 태스크 분배 | 할 일이 없는 작업 스레드가 다른 스레드의 줄에서 태스크 절반을 가져온다(작업 훔치기, work stealing)[^1] | 줄 하나 |
| `spawn`할 퓨처 | `Send`여야 한다 | `tokio::spawn`은 여전히 `Send`를 요구한다. `Send`가 아닌 퓨처는 `LocalSet` 안에서 `tokio::task::spawn_local`로 띄운다[^9] |
| 고르는 법 | `#[tokio::main]` | `#[tokio::main(flavor = "current_thread")]`[^2] |
| 쓰는 곳 | 서버 | 테스트, 작은 도구, 결과가 흔들리면 안 되는 실험 |

검증 코드에서 current_thread 런타임의 태스크는 main 스레드에서 돌았고, multi_thread 런타임의 태스크는 main이 아닌 `tokio-rt-worker`라는 스레드에서 돌았다. 작업 스레드 수는 `#[tokio::main(worker_threads = 2)]`로 바꾼다[^2].

## spawn의 두 조건: 'static과 Send

`tokio::spawn`에 넘기는 퓨처는 `'static`이고 `Send`여야 한다[^3].

- **`'static`.** 태스크는 띄운 함수보다 오래 살 수 있다. 그래서 그 함수의 지역 변수를 빌릴 수 없다. 값을 `async move`로 옮겨 넣거나, 여러 태스크가 같이 보려면 `Arc`로 나눠 준다[^3]. `'static`은 "영원히 산다"가 아니다. 남의 것을 빌리지 않았다는 뜻이고, 옮겨 넣은 `String`은 태스크가 끝나면 버려진다[^3].
- **`Send`.** multi_thread 런타임은 `.await`에서 멈춘 태스크를 다른 스레드로 옮길 수 있다. `.await`를 건너 들고 있는 값이 모두 `Send`여야 한다[^3].

```rust
let v = vec![1, 2];
tokio::spawn(async { println!("{v:?}"); });
// error[E0373]: async block may outlive the current function, but it borrows `v`,
//               which is owned by the current function
```

`async move { … }`로 바꾸면 통과한다.

## JoinHandle과 JoinSet

| 일 | 결과 |
|---|---|
| `h.await` | `Ok(값)` |
| 태스크 안에서 panic | panic은 그 태스크 안에 갇히고, `h.await`가 `Err(JoinError)`, `is_panic() == true`[^3] |
| `h.abort()` 뒤 `h.await` | `Err(JoinError)`, `is_cancelled() == true` |
| `JoinHandle`을 버린다 | 태스크는 **계속 돈다**. 떼어 놓았을(detach) 뿐이다 |

검증 코드에서 `JoinHandle`을 곧바로 버린 태스크가 20ms 뒤 끝까지 돌아 깃발을 세웠다.

태스크 여러 개를 띄우고 모두 기다릴 때는 `JoinSet`을 쓴다. 결과는 띄운 순서가 아니라 끝난 순서로 온다[^6]. 30ms, 10ms, 20ms짜리를 차례로 띄우면 `join_next()`는 10, 20, 30 순서로 돌려준다. `JoinSet`을 버리면 남은 태스크가 모두 즉시 abort된다[^6]. `JoinHandle`과 반대다.

## 실행기를 막지 마라

tokio 태스크는 운영체제가 아니라 런타임이 번갈아 돌린다. 태스크는 스스로 차례를 넘길(yield) 때까지 계속 돈다[^4]. 운영체제 스케줄링으로 치면 비선점(nonpreemptive) 방식이다([스케줄링 알고리즘](/Hongs_Blog/studies/operating-systems/scheduling-algorithms/)). 그래서 tokio 문서는 태스크 안에서 스레드를 막는 시스템 호출을 하지 말라고 한다[^4].

10ms마다 깨어나는 "심장 박동" 태스크를 돌리면서, 같은 current_thread 런타임에서 300ms짜리 일을 세 가지 방법으로 시켜 박동 사이 간격의 최댓값을 쟀다.

| 300ms 동안 하는 일 | 박동 최대 간격 |
|---|---|
| `std::thread::sleep(300ms)` (스레드를 붙잡는다) | 309ms |
| `spawn_blocking(\|\| std::thread::sleep(300ms)).await` | 14ms |
| `tokio::time::sleep(300ms).await` (기다리는 동안 차례를 넘긴다) | 13ms |

첫 줄에서는 박동이 300ms 동안 한 번도 뛰지 못했다. 서버라면 그동안 다른 요청 전부가 응답하지 못한 것이다.

`spawn_blocking`은 블로킹해도 되는 별도 스레드 풀에서 클로저를 돌리고 `JoinHandle`을 돌려준다[^5]. 쓸 때 알아 둘 것이 셋이다.

- 끝이 있는 짧은 블로킹(파일 읽기, 비밀번호 해시, 압축)에 쓴다. 끝없이 도는 일은 `std::thread::spawn`으로 전용 스레드를 만든다[^5].
- 이미 시작한 `spawn_blocking` 작업은 abort할 수 없다[^5].
- 블로킹 스레드 수에는 상한이 있고, 다 차면 작업이 줄을 선다. 기본 상한은 아주 크다[^5].

## 어느 Mutex를 쓰나

tokio 문서의 지침은 이렇다[^7][^8].

- 잠금을 잡고 `.await` 없이 금방 놓는 공유 데이터에는 **`std::sync::Mutex`** 를 쓴다. 경합이 적으면 async 코드 안에서 써도 괜찮다. 무조건 `tokio::sync::Mutex`를 쓰는 것이 흔한 실수다.
- 잠금을 **`.await` 너머로 들고 있어야 할 때**(예: 연결 하나를 여러 태스크가 차례로 쓰기)만 `tokio::sync::Mutex`를 쓴다. 더 비싸다.
- `std::sync::MutexGuard`는 `Send`가 아니라서, 잡은 채 `.await`하는 퓨처는 `tokio::spawn`에 넘길 수 없다. 컴파일러가 막아 준다[^7].
- 공유 자원을 다루는 태스크 하나를 두고 채널로 부탁하는 방법도 있다([채널](/Hongs_Blog/studies/rust/channels/)).

검증 코드에서 `tokio::sync::Mutex` 잠금을 든 채 5ms를 기다리는 태스크 4개를 multi_thread 런타임에 띄워 값 4를 얻었다. `std::sync::Mutex`를 `.await` 없이 잡고 놓는 테스트도 통과했다.

## 활용

- **서버의 기본 구조.** `#[tokio::main]` → 연결을 받는 루프 → 연결마다 `tokio::spawn`. axum도 안에서 이렇게 돈다([axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)).
- **태스크는 가볍다.** tokio 문서는 태스크 하나가 할당 한 번과 64바이트만 쓴다고 밝힌다[^3]. 검증 코드에서 1만 개를 띄우고 모두 기다리는 데 29ms 걸렸다(디버그 빌드).
- **테스트.** `#[tokio::test]`를 붙이면 테스트마다 current_thread 런타임이 생긴다(검증 코드에서 `runtime_flavor()`로 확인).
- **흔한 실수.**
  - async 함수 안에서 `std::thread::sleep`, 동기 파일 입출력, 무거운 계산. 위 표처럼 다른 태스크가 멈춘다.
  - `JoinHandle`을 버리면 태스크가 멈춘다고 믿는다. 계속 돈다. 멈추려면 `abort()`나 취소 신호가 필요하다([취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/)).
  - 런타임 안에서 또 런타임을 만들어 `block_on`한다. 이미 async 문맥이면 그냥 `.await`한다.
- **clippy.** `await_holding_lock`(기본 경고)이 `std::sync::Mutex` 잠금을 든 채 `.await`하는 코드를 잡는다([Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/)).

## 연결

- 선수: [Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/), [Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/)
- 다음: [취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/), [백프레셔와 큐 제한](/Hongs_Blog/studies/rust/backpressure/)
- 운영체제: 런타임은 사용자 수준 스레드 라이브러리와 같은 자리에 있다. 커널은 작업 스레드만 보고, 태스크 사이 전환은 런타임이 한다. 한 태스크가 커널 호출에 막히면 그 작업 스레드의 태스크가 함께 멈추는 약점도 같다([사용자 수준 스레드와 커널 수준 스레드](/Hongs_Blog/studies/operating-systems/ult-klt/)).

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** current_thread 런타임에서 한 태스크가 `std::thread::sleep(Duration::from_millis(300))`을 부른다. 같은 런타임에서 10ms마다 깨어나야 하는 태스크는 어떻게 되는가? 왜인가?</summary>

**답:** 300ms 동안 한 번도 깨어나지 못한다(실측 최대 간격 309ms). 태스크는 `.await`에서만 차례를 넘기는데, `std::thread::sleep`은 스레드 자체를 재워서 런타임이 다른 태스크를 `poll`할 기회가 없다. `tokio::time::sleep(...).await`나 `spawn_blocking`으로 바꾸면 간격이 13~14ms로 돌아온다.<br>
**흔한 오답:** "multi_thread 런타임이면 괜찮다." 작업 스레드 하나가 막히는 것은 같다. 다른 스레드가 그 줄의 태스크를 훔쳐 갈 수 있어 덜할 뿐, 막힌 스레드 수만큼 처리 능력이 준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음을 실행하면 `order`는? 그리고 마지막 줄 뒤 60ms를 기다렸을 때 `done`은?</summary>

```rust
let mut set = JoinSet::new();
for ms in [30u64, 10, 20] {
    set.spawn(async move { sleep(Duration::from_millis(ms)).await; ms });
}
let mut order = Vec::new();
while let Some(r) = set.join_next().await { order.push(r.unwrap()); }

let done = Arc::new(AtomicBool::new(false));
let d2 = done.clone();
drop(tokio::spawn(async move { sleep(Duration::from_millis(20)).await; d2.store(true, SeqCst); }));
```
**답:** `order`는 `[10, 20, 30]`, `done`은 `true`.<br>
**이유:** `JoinSet`은 끝난 순서로 돌려준다. `JoinHandle`을 버려도 태스크는 abort되지 않고 끝까지 돈다. 검증 코드 출력과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 요청마다 공유 `HashMap`에서 값을 하나 읽고 바로 놓는다. 그다음 데이터베이스를 `.await`한다. `std::sync::Mutex`와 `tokio::sync::Mutex` 중 무엇을 쓰나?</summary>

**답:** `std::sync::Mutex`. 잠금을 `.await` 전에 놓으므로 async 잠금이 필요 없고, 더 싸다. 잠금 범위를 블록으로 묶어 `.await` 전에 확실히 끝낸다.<br>
**흔한 오답:** "async 코드니까 tokio 것을 써야 한다." tokio 문서가 흔한 실수로 꼽는 생각이다. tokio 잠금은 `.await`를 건너 들고 있어야 할 때만 쓴다.

</details>


[^1]: tokio 문서, Module `tokio::runtime` — Multi-Thread Scheduler, Current-Thread Scheduler — https://docs.rs/tokio/latest/tokio/runtime/index.html
[^2]: tokio 문서, Attribute Macro `tokio::main` — Multi-threaded runtime, Current-thread runtime, Usage — https://docs.rs/tokio/latest/tokio/attr.main.html
[^3]: Tokio Tutorial, Spawning — Tasks, `'static` bound, `Send` bound — https://tokio.rs/tokio/tutorial/spawning
[^4]: tokio 문서, Module `tokio::task` — What are Tasks?, Blocking and Yielding — https://docs.rs/tokio/latest/tokio/task/index.html
[^5]: tokio 문서, Function `tokio::task::spawn_blocking` — https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html
[^6]: tokio 문서, Struct `tokio::task::JoinSet` — `join_next`, Drop 동작, `abort_all`, `shutdown` — https://docs.rs/tokio/latest/tokio/task/struct.JoinSet.html
[^7]: Tokio Tutorial, Shared state — On using `std::sync::Mutex` and `tokio::sync::Mutex`, Holding a `MutexGuard` across an `.await` — https://tokio.rs/tokio/tutorial/shared-state
[^8]: tokio 문서, Struct `tokio::sync::Mutex` — Which kind of mutex should you use? — https://docs.rs/tokio/latest/tokio/sync/struct.Mutex.html
[^9]: tokio 문서, Function `tokio::task::spawn_local` — https://docs.rs/tokio/latest/tokio/task/fn.spawn_local.html
{% endraw %}
