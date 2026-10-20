---
layout: "note"
title: "Mutex와 RwLock"
display_title: "Mutex와 RwLock"
kind: "concept"
kind_label: "모델"
num: "32"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Mutex", "RwLock", "MutexGuard", "뮤텍스", "읽기-쓰기 잠금", "Reader-Writer Lock", "독", "Poisoning", "PoisonError", "잠금 순서", "Lock Ordering"]
description: "공용 금고에 물건을 넣고 열쇠를 하나만 두면, 열쇠를 쥔 사람만 물건을 만질 수 있다. Rust의 Mutex는 물건을 아예 금고 안에 넣어 두어서, 열쇠 없이 물건에 손댈 방법이 처음부터 없다. 열쇠는 쓰고 나면 저절로 돌아간다. 대신 열쇠 두 개를 서로 다른 순서로 쥐는 사람들이…"
prev_url: "/studies/rust/threads-send-sync/"
prev_title: "스레드와 Send·Sync"
next_url: "/studies/rust/monitor-vs-mutex/"
next_title: "모니터 ↔ Mutex"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "32_mutex-rwlock_verify.rs", "u": "/studies/rust/code/32_mutex-rwlock_verify/", "r": "검증"}]
permalink: "/studies/rust/mutex-rwlock/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

공용 금고에 물건을 넣고 열쇠를 하나만 두면, 열쇠를 쥔 사람만 물건을 만질 수 있다. Rust의 `Mutex`는 물건을 아예 금고 안에 넣어 두어서, 열쇠 없이 물건에 손댈 방법이 처음부터 없다. 열쇠는 쓰고 나면 저절로 돌아간다. 대신 열쇠 두 개를 서로 다른 순서로 쥐는 사람들이 있으면 서로를 영원히 기다릴 수 있고, 이것은 컴파일러가 막아 주지 않는다.

</div>


## 예시로 보기

여러 스레드가 함께 세는 카운터를 만든다. C의 pthread라면 `int count`와 `pthread_mutex_t lock`을 따로 두고, "count를 만지기 전에 lock을 잡는다"는 약속을 사람이 지킨다. 한 곳에서 잊어도 컴파일된다. Rust의 `Mutex<T>`는 지킬 데이터를 자기 안에 넣는다. 데이터에 닿는 길은 `lock()`이 돌려주는 가드(guard)뿐이다[^1][^2].

```rust
use std::sync::{Arc, Mutex};
use std::thread;

let total = Arc::new(Mutex::new(0usize));
let handles: Vec<_> = (0..4)
    .map(|_| {
        let total = Arc::clone(&total);
        thread::spawn(move || {
            for _ in 0..10_000 {
                *total.lock().unwrap() += 1; // 가드는 이 문장이 끝나면 사라지고 잠금이 풀린다
            }
        })
    })
    .collect();
for h in handles { h.join().unwrap(); }
assert_eq!(*total.lock().unwrap(), 40_000);
```

`lock()`이 돌려주는 `MutexGuard`는 `Deref`로 안의 값을 보여 주고, `Drop`에서 잠금을 푼다[^1][^3]. 잠금을 푸는 코드를 따로 쓰지 않으므로, 풀기를 잊거나 `return` 길 하나에서 빠뜨리는 일이 없다. `Mutex` 자체는 `&`로만 쥐어도 안을 고칠 수 있다. 그래서 `Arc<Mutex<T>>`는 한 스레드 안의 `Rc<RefCell<T>>`와 같은 모양이다([내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/))[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 4 스레드 × 10,000 = 40,000, 가드가 살아 있는 동안 `try_lock`이 `WouldBlock`인 것, 독과 복구, `RwLock`의 읽기 둘 동시·쓰기 배제, 읽는 쪽 panic은 독을 남기지 않는 것, 반대 방향 이체 40,000번이 멈추지 않는 것, 2024 `if let` 범위, `let _ = m.lock()`과 `.await` 너머 가드가 막히는 것을 실행·컴파일해 확인했다 — [32_mutex-rwlock_verify.rs](/Hongs_Blog/studies/rust/code/32_mutex-rwlock_verify/)</div>

</div>


## 정의

`Mutex<T>`는 한 번에 한 스레드만 안의 `T`를 만지게 하는 잠금이다. 잠금이 이미 잡혀 있으면 `lock()`을 부른 스레드는 잠든 채 기다린다[^2]. `RwLock<T>`는 읽는 쪽 여럿이 함께 들어오거나, 쓰는 쪽 하나만 들어오게 하는 잠금이다[^4]([독자-저자 문제](/Hongs_Blog/studies/operating-systems/readers-writers/)).

| 연산 | Mutex | RwLock |
|---|---|---|
| 잠그고 기다리기 | `lock()` | `read()` / `write()` |
| 기다리지 않고 시도 | `try_lock()` → 잡혀 있으면 `Err(WouldBlock)` | `try_read()` / `try_write()` |
| 잠그지 않고 고치기 | `get_mut(&mut self)` | `get_mut(&mut self)` |
| 꺼내 갖기 | `into_inner(self)` | `into_inner(self)` |
| 다른 스레드와 나누려면 | `T: Send` | 쓰기에 `T: Send`, 함께 읽기에 `T: Sync` |

`get_mut`은 `&mut Mutex`를 받으므로 다른 누구도 동시에 잠글 수 없다는 것을 컴파일러가 이미 안다. 그래서 실제로 잠그지 않는다[^2].

### 독(poisoning)

잠금을 쥔 스레드가 panic하면 그 `Mutex`에 독이 든다. 반쯤 고친 데이터가 남아 불변식이 깨졌을 수 있기 때문이다. 그 뒤의 `lock()`은 `Err(PoisonError)`를 돌려준다. 독은 경고일 뿐이다. `PoisonError::into_inner`로 가드를 꺼내 데이터를 쓸 수 있다[^2].

```rust
let mut g = match shared.lock() {
    Ok(g) => g,
    Err(poisoned) => poisoned.into_inner(), // panic 직전에 쓴 41이 그대로 보인다
};
```

`RwLock`은 쓰기로 잡혀 있을 때의 panic에만 독이 든다. 읽는 쪽의 panic은 독을 남기지 않는다[^4]. 검증 코드가 두 경우를 모두 확인했다. `lock().unwrap()`이 흔한 까닭은, 독이 든 상태를 "다른 스레드가 이미 panic한 버그"로 보고 같이 멈추는 것이 대개 맞기 때문이다.

### 같은 스레드에서 두 번 잠그기

이미 쥔 `Mutex`를 같은 스레드에서 또 `lock()`하면 어떻게 될지 std는 정하지 않았다. 돌아오지 않는다는 것만 정했다. 멈추거나 panic할 수 있다[^2]. `RwLock`도 같은 스레드가 읽기 잠금을 쥔 채 다시 `read()`하면, 그사이 기다리는 쓰는 쪽 때문에 멈출 수 있다[^4].

### 쓰는 쪽이 굶을 수 있는가

`RwLock`이 읽는 쪽과 쓰는 쪽 중 누구를 먼저 들여보낼지는 운영체제 구현에 달렸고, std는 어떤 정책도 보장하지 않는다[^4]. 그래서 "읽기가 끊이지 않으면 쓰는 쪽이 영원히 못 들어온다(기아)"가 생길 수도, 안 생길 수도 있다. 이식성 있는 코드는 둘 다 가정하지 않는다.

## 잠금 순서

잠금 둘을 함께 쥐어야 하는 두 함수가 서로 다른 순서로 잡으면 교착상태가 생길 수 있다. A는 1번을 쥐고 2번을 기다리고, B는 2번을 쥐고 1번을 기다린다([교착상태](/Hongs_Blog/studies/operating-systems/deadlock/)의 순환 대기). 해결책은 모든 코드가 같은 순서로 잡는 것이다. 계좌 이체라면 id가 작은 계좌부터 잠근다.

```rust
fn transfer(from: &Account, to: &Account, amount: i64) {
    let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };
    let mut a = first.balance.lock().unwrap();
    let mut b = second.balance.lock().unwrap();
    // a, b 중 어느 쪽이 from인지 보고 더하고 뺀다
}
```

검증 코드는 4 스레드가 반대 방향으로 10,000번씩 이체해도 멈추지 않고 두 잔액이 1,000 그대로인 것을 확인했다. 이것은 순환 대기를 깨므로 교착상태가 없다는 증명이 있는 방법이다([교착상태 예방](/Hongs_Blog/studies/operating-systems/deadlock-prevention/)). 실행 결과는 그 증명을 거드는 실험일 뿐이다.

## 가드가 언제 사라지는가

잠금이 풀리는 순간은 가드가 사라지는 순간이다. 그래서 가드의 범위를 아는 것이 곧 임계 구역을 아는 것이다.

| 코드 | 가드가 사라지는 때 |
|---|---|
| `let g = m.lock().unwrap();` | `g`의 범위 끝, 또는 `drop(g)` |
| `*m.lock().unwrap() += 1;` | 이 문장의 끝 |
| `let _ = m.lock().unwrap();` | 바로. 컴파일 오류(`let_underscore_lock`, 기본이 deny)[^5] |
| `if let Some(x) = *m.lock().unwrap() { … } else { … }` | 2024 에디션: `else`에 들어가기 전[^6] |
| `match m.lock().unwrap().pop() { … }` | `match` 전체가 끝날 때 |

2021 에디션에서는 `if let`의 임시 가드가 `else`까지 살아 있었다. 그래서 `else`에서 같은 잠금을 다시 잡으면 멈췄다. 2024 에디션은 `else` 앞에서 가드를 버린다[^6]. 검증 코드는 `else` 안의 `try_lock`이 성공하는 것으로 이것을 확인했다. `match`는 바뀌지 않았으므로 여전히 조심한다.

## 활용

- **잠금은 짧게.** 가드를 쥔 채 파일을 읽거나 네트워크를 기다리지 않는다. 필요한 값만 꺼내거나 복사한 뒤 가드를 버리고 느린 일을 한다. clippy의 `significant_drop_tightening`(nursery)이 가드를 더 일찍 버릴 수 있는 곳을 알려 준다[^7].
- **async 코드.** std `MutexGuard`는 `Send`가 아니다. pthread 같은 플랫폼은 잠근 스레드에서 풀어야 하기 때문이다[^8]. 그래서 가드를 쥔 채 `.await`하면 그 퓨처는 `Send`가 아니고, `tokio::spawn`에 넘길 수 없다[^9]. 검증 결과 `.await` 전에 `drop(g)`를 불러도 이 오류는 그대로였고, 가드를 안쪽 블록 `{ … }`에 가둬야 풀렸다. tokio 튜토리얼도 같은 내용을 적는다[^9]. clippy의 `await_holding_lock`(suspicious, 기본 경고)이 이것을 잡는다[^7]. `.await`를 사이에 두고 잠금을 쥐어야 하면 `tokio::sync::Mutex`를 쓴다. 더 비싸므로 코드를 바꿔 피할 수 있으면 피한다[^9]. 자세한 이야기는 [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)와 [취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/)에 있다.
- **더 가벼운 길.** 정수 하나나 `bool` 하나를 지키려고 `Mutex`를 쓰면 원자 타입이 더 싸다: [원자적 연산과 메모리 순서](/Hongs_Blog/studies/rust/atomics-memory-ordering/). clippy `mutex_integer`, `mutex_atomic`(restriction)이 이를 알려 준다[^7].
- **RwLock을 고를 때.** 읽기가 훨씬 많고 임계 구역이 길 때만 이득이 있다. 쓰기 잠금을 잡고 읽기만 하면 clippy `readonly_write_lock`이 알려 준다[^7].
- **std 밖.** `parking_lot` 크레이트가 독 없는 더 작은 `Mutex`·`RwLock`을 제공한다 [확인필요: 하네스에 없어 직접 확인하지 않았다]. std 1.99에는 `std::sync::nonpoison::Mutex`가 있지만 아직 불안정 기능이다(`nonpoison_mutex`, 컴파일해 E0658 확인).

## 연결

- 선수: [내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/), [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)
- 조건 변수와 묶어 모니터 만들기: [모니터 ↔ Mutex](/Hongs_Blog/studies/rust/monitor-vs-mutex/)
- 운영체제 쪽: [세마포어](/Hongs_Blog/studies/operating-systems/semaphore/), [독자-저자 문제](/Hongs_Blog/studies/operating-systems/readers-writers/), [교착상태](/Hongs_Blog/studies/operating-systems/deadlock/)
- 잠금 없이 메시지로: [채널](/Hongs_Blog/studies/rust/channels/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** C의 `pthread_mutex_t`와 비교해, Rust의 `Mutex<T>`가 "잠그지 않고 데이터를 만지는" 실수를 컴파일 단계에서 막는 이유는?</summary>

**답:** 데이터가 `Mutex` 안에 들어 있고, 바깥에서 닿는 길이 `lock()`이 돌려주는 가드뿐이다. 잠그지 않으면 데이터의 참조를 얻을 수 없다.<br>
**흔한 오답:** "Rust 컴파일러가 잠금 순서를 검사해서." 컴파일러는 잠금 순서를 보지 않는다. 교착상태는 막지 못한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 한 스레드가 `RwLock<i32>`의 읽기 가드를 쥔 채 panic했다. 그다음 `rw.is_poisoned()`는? 쓰기 가드를 쥔 채 panic했다면?</summary>

**답:** 읽기 때는 `false`, 쓰기 때는 `true`.<br>
**이유:** `RwLock`은 쓰기로 잡혀 있을 때의 panic만 독으로 친다. 읽는 쪽은 데이터를 고칠 수 없었으니 불변식을 깨지 않았다고 본다. 검증 코드의 실행 결과와 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `Mutex` 두 개와 스레드 두 개로 교착상태가 날 수 있는 코드를 말로 적고, 한 줄만 바꿔 고쳐라.</summary>

**답:** 스레드 1은 `a.lock()` 다음 `b.lock()`, 스레드 2는 `b.lock()` 다음 `a.lock()`을 한다. 둘이 첫 잠금을 동시에 쥐면 서로 기다린다. 스레드 2도 `a`를 먼저 잡게 순서를 바꾸면 순환 대기가 생기지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 아래 async 블록을 `tokio::spawn`에 넘기면 컴파일되는가? `let g = m.lock().unwrap(); *g += 1; drop(g); other().await;`</summary>

**답:** 안 된다. "future cannot be sent between threads safely"가 난다. `drop(g)`를 불러도 컴파일러는 가드가 `.await` 너머까지 있을 수 있다고 본다. `{ let mut g = m.lock().unwrap(); *g += 1; }`처럼 블록으로 가둬야 한다.<br>
**이유:** `MutexGuard`는 `Send`가 아니다. 이 판정은 rustc 1.99.0에서 직접 컴파일해 확인했다.

</details>


[^1]: The Rust Programming Language, 16.3 Shared-State Concurrency (The API of Mutex<T>, Comparing RefCell<T>/Rc<T> and Mutex<T>/Arc<T>) — https://doc.rust-lang.org/book/ch16-03-shared-state.html
[^2]: std 문서, `std::sync::Mutex` (Poisoning, `lock`, `get_mut`) — https://doc.rust-lang.org/std/sync/struct.Mutex.html
[^3]: std 문서, `std::sync::MutexGuard` — https://doc.rust-lang.org/std/sync/struct.MutexGuard.html
[^4]: std 문서, `std::sync::RwLock` (Poisoning, Potential deadlock) — https://doc.rust-lang.org/std/sync/struct.RwLock.html
[^5]: The rustc book, Deny-by-default Lints, `let-underscore-lock` — https://doc.rust-lang.org/rustc/lints/listing/deny-by-default.html
[^6]: The Rust Edition Guide, Rust 2024, `if let` temporary scope — https://doc.rust-lang.org/edition-guide/rust-2024/temporary-if-let-scope.html
[^7]: Clippy Lints, `await_holding_lock`, `significant_drop_tightening`, `mutex_integer`, `mutex_atomic`, `readonly_write_lock` — https://rust-lang.github.io/rust-clippy/master/index.html (rustc 1.99.0의 `cargo clippy --explain`으로 설명을 확인했다)
[^8]: std 문서, `std::marker::Send`, `impl !Send for MutexGuard` — https://doc.rust-lang.org/std/marker/trait.Send.html
[^9]: Tokio Tutorial, Shared state (Holding a MutexGuard across an .await, Use Tokio's asynchronous mutex) — https://tokio.rs/tokio/tutorial/shared-state
{% endraw %}
