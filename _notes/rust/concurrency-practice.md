---
layout: "note"
title: "동시성 연습"
display_title: "동시성 연습"
kind: "practice"
kind_label: "연습"
num: "35"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "7단원의 네 가지, 스레드에 넘길 수 있는 타입, 잠금 순서, 채널의 닫힘, 메모리 순서를 손으로 고쳐 보는 네 문제다. 문제마다 먼저 컴파일러나 실행 결과를 예측해 적고, 그다음 코드를 돌려 맞춰 본다."
prev_url: "/studies/rust/errors-memory-practice/"
prev_title: "에러와 메모리 연습"
next_url: "/studies/rust/async-practice/"
next_title: "async 연습"
math: true
mermaid: false
code_count: 4
permalink: "/studies/rust/concurrency-practice/"
---
{% raw %}
7단원의 네 가지, 스레드에 넘길 수 있는 타입, 잠금 순서, 채널의 닫힘, 메모리 순서를 손으로 고쳐 보는 네 문제다. 문제마다 먼저 컴파일러나 실행 결과를 예측해 적고, 그다음 코드를 돌려 맞춰 본다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답과 변형을 코드로 확인했다. 컴파일 오류는 rustc 1.99.0으로 직접 컴파일해 오류 코드를 대조했고, 교착상태는 진짜로 멈추지 않도록 `Barrier`와 `try_lock`으로 순환 대기만 확인했다 — [p1](/Hongs_Blog/studies/rust/code/35_concurrency-practice_p1/) · [p2](/Hongs_Blog/studies/rust/code/35_concurrency-practice_p2/) · [p3](/Hongs_Blog/studies/rust/code/35_concurrency-practice_p3/) · [p4](/Hongs_Blog/studies/rust/code/35_concurrency-practice_p4/)</div>

</div>


## p1 · 컴파일되지 않는 병렬 글자 세기

글 여러 개에서 소문자 a~z가 몇 번씩 나오는지 스레드로 나눠 센다.

```rust
use std::cell::RefCell;
use std::rc::Rc;
use std::thread;

pub fn letter_counts(texts: &[&str]) -> [usize; 26] {
    let counts = Rc::new(RefCell::new([0usize; 26]));
    let mut handles = Vec::new();
    for t in texts {
        let counts = Rc::clone(&counts);
        handles.push(thread::spawn(move || {
            for b in t.bytes().filter(u8::is_ascii_lowercase) {
                counts.borrow_mut()[(b - b'a') as usize] += 1;
            }
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
    *counts.borrow()
}
```

- (가) 어떤 오류 코드로 막히는가? 이유는?
- (나) `Rc`를 `Arc`로, `RefCell`을 `Mutex`로만 바꾸면(`borrow_mut()`도 `lock().unwrap()`으로) 컴파일되는가?
- (다) 두 가지 방법으로 고쳐라. 하나는 잠금 없이, 하나는 `Mutex`로. `["hello world", "rust threads", "abc xyz", ""]`에서 `l`의 개수와 글자 수 합을 구하라.

사용 개념: [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)의 `Send`와 `spawn`의 `'static` 조건, `thread::scope`, [Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/).

풀이 전략: `spawn`이 요구하는 것은 두 가지다. 클로저가 다른 스레드로 가도 되는가(`Send`), 클로저가 빌린 것이 함수보다 오래 사는가(`'static`). 오류를 하나 고치면 다음 오류가 드러날 수 있으니 두 조건을 모두 확인한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 첫 오류 읽기:* `error[E0277]: Rc<RefCell<[usize; 26]>> cannot be sent between threads safely`. `Rc`의 참조 개수는 원자적이지 않게 고치므로 `Send`가 아니다. 컴파일러는 `spawn`의 `Send` 조건에서 멈춘다.
2. *(나) 다음 오류 읽기:* 여전히 안 된다. 이번에는 `error[E0521]: borrowed data escapes outside of function`이다. 클로저 안의 `t`는 `texts`에서 빌린 `&&str`인데, `spawn`은 함수보다 오래 살 수 있는 스레드를 띄우므로 `'static`이 아닌 빌림을 받지 않는다. `Send` 문제가 풀리자 숨어 있던 수명 문제가 보인 것이다.
3. *(다) 수명 문제 풀기:* `thread::scope`를 쓰면 범위가 끝나기 전에 스레드가 모두 끝나므로 `texts`를 빌려도 된다.
4. *(다) 방법 A, 잠금 없이:* 스레드마다 자기 배열을 세어 돌려주고, `join`한 쪽이 더한다. 공유하는 것이 없으니 `Mutex`도 `Arc`도 필요 없다.

```rust
fn letter_counts_join(texts: &[&str]) -> [usize; 26] {
    thread::scope(|s| {
        let hs: Vec<_> = texts.iter().map(|t| s.spawn(|| count_one(t))).collect();
        let mut total = [0usize; 26];
        for h in hs {
            for (sum, x) in total.iter_mut().zip(h.join().unwrap()) {
                *sum += x;
            }
        }
        total
    })
}
```

{: start="5"}
5. *(다) 방법 B, Mutex로:* 공유 배열을 `Mutex`로 감싼다. 글자마다 잠그지 않고, 각 스레드가 다 센 뒤 한 번만 잠가 더한다.

```rust
fn letter_counts_mutex(texts: &[&str]) -> [usize; 26] {
    let total = Mutex::new([0usize; 26]);
    thread::scope(|s| {
        for t in texts {
            let total = &total;
            s.spawn(move || {
                let local = count_one(t);
                let mut g = total.lock().unwrap();
                for (sum, x) in g.iter_mut().zip(local) {
                    *sum += x;
                }
            });
        }
    });
    total.into_inner().unwrap()
}
```

`count_one`은 글 하나의 글자를 세는 보통 함수다. 두 방법 모두 한 스레드로 센 결과와 같았다. `l`은 3개("hello world"에 셋), 글자 수 합은 27이다. "hello world" 10자, "rust threads" 11자, "abc xyz" 6자, 빈 글 0자를 더한 값이다.

</details>


**변형.** 방법 A에는 왜 잠금이 하나도 필요 없는가? 방법 B에서 `total.lock()`을 글자 하나마다 부르도록 바꾸면 결과와 잠금 횟수는 어떻게 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

방법 A의 스레드는 자기 지역 배열만 고치고, 그 배열을 `join`의 돌려준 값으로 넘긴다. 두 스레드가 같은 칸을 만지는 순간이 없다. `join`이 끝난 뒤에 더하므로 순서 문제도 없다. 방법 B를 글자마다 잠그게 바꿔도 결과는 27 그대로다. 잠금은 스레드 수(4번)에서 글자 수(27번)만큼으로 는다. 글자가 많아질수록 스레드들이 같은 잠금 앞에서 서로를 기다리는 시간이 늘어난다.

</details>


## p2 · 엇갈린 잠금 순서

가게에 재고와 현금이 따로 잠겨 있다.

```rust
struct Shop {
    inventory: Mutex<i64>, // 재고 개수
    ledger: Mutex<i64>,    // 현금
}

fn sell(shop: &Shop, price: i64) {
    let mut inv = shop.inventory.lock().unwrap();
    let mut cash = shop.ledger.lock().unwrap();
    *inv -= 1;
    *cash += price;
}

fn restock(shop: &Shop, cost: i64) {
    let mut cash = shop.ledger.lock().unwrap();
    let mut inv = shop.inventory.lock().unwrap();
    *cash -= cost;
    *inv += 1;
}
```

- (가) 한 스레드는 `sell`만, 다른 스레드는 `restock`만 계속 부른다. 프로그램이 멈출 수 있는 실행 순서를 적어라.
- (나) 한 줄의 순서만 바꿔 고쳐라.
- (다) 재고 100, 현금 0에서 시작해, 스레드 4개 중 짝수 번호는 `sell(3)`을, 홀수 번호는 `restock(2)`를 10,000번씩 부른다. 끝난 뒤 재고와 현금은?

사용 개념: [Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/)의 잠금 순서, [교착상태](/Hongs_Blog/studies/operating-systems/deadlock/)의 순환 대기.

풀이 전략: 교착상태는 "서로가 서로의 잠금을 기다리는" 원이 생길 때 난다. 잠금 둘을 함께 쥐는 함수들을 모두 모아, 같은 순서로 잡는지 본다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 원 찾기:* `sell`이 `inventory`를 쥔 순간 `restock`이 `ledger`를 쥔다. `sell`은 `ledger`를, `restock`은 `inventory`를 기다린다. 둘 다 상대가 놓기를 기다리므로 영원히 멈춘다. 검증 코드는 진짜로 멈추지 않도록, `Barrier`로 "둘 다 첫 잠금을 쥔 순간"을 만든 뒤 두 번째 잠금을 `try_lock`으로 시도했다. 양쪽 모두 `WouldBlock`이었다. 순환 대기가 실제로 생긴다는 뜻이다.
2. *(나) 순서 맞추기:* `restock`도 `inventory`를 먼저 잠그게 두 줄을 바꾼다. 이제 모든 함수가 `inventory` → `ledger` 순서로 잡으므로 원이 생길 수 없다.

```rust
fn restock(shop: &Shop, cost: i64) {
    let mut inv = shop.inventory.lock().unwrap(); // 원래는 ledger를 먼저 잠갔다
    let mut cash = shop.ledger.lock().unwrap();
    *cash -= cost;
    *inv += 1;
}
```

{: start="3"}
3. *(다) 결과 세기:* 판매는 스레드 2개 × 10,000 = 20,000번, 입고도 20,000번이다. 재고는 $$100 - 20{,}000 + 20{,}000 = 100$$, 현금은 $$20{,}000 \times 3 - 20{,}000 \times 2 = 20{,}000$$이다. 고친 코드로 40,000번을 돌려 멈추지 않고 이 값이 나왔다. 멈추지 않은 것은 실험일 뿐이고, 교착상태가 없다는 근거는 "모두 같은 순서로 잡으면 순환 대기가 생길 수 없다"는 논증이다([교착상태 예방](/Hongs_Blog/studies/operating-systems/deadlock-prevention/)).

</details>


**변형.** 두 잠금을 `Mutex<(i64, i64)>` 하나로 합치면 교착상태가 날 수 있는가? 얻는 것과 잃는 것은?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

날 수 없다. 잠금이 하나뿐이면 "다른 잠금을 쥔 채 기다리는" 일이 없어 원이 생기지 않는다. 대신 재고만 보면 되는 작업도 현금까지 함께 잠그게 되어, 서로 상관없는 일끼리 기다리게 된다. 잠금을 쪼갤수록 동시에 할 수 있는 일은 늘지만 순서를 지킬 책임도 는다.

</details>


## p3 · sync_channel 파이프라인

세 단계로 일을 흘린다. 1단계는 1부터 `n`까지를 보내고, 2단계의 일꾼 `w`명이 제곱하고, 3단계가 더한다. 단계 사이 채널은 둘 다 `sync_channel(4)`다.

```rust
const CAP: usize = 4;

fn pipeline(n: u64, w: usize) -> u64 {
    let (num_tx, num_rx) = mpsc::sync_channel::<u64>(CAP);
    let (sq_tx, sq_rx) = mpsc::sync_channel::<u64>(CAP);
    let num_rx = Arc::new(Mutex::new(num_rx));
    let producer = thread::spawn(move || {
        for x in 1..=n {
            num_tx.send(x).unwrap(); // 큐가 차면 여기서 기다린다
        }
    });
    let workers: Vec<_> = (0..w)
        .map(|_| {
            let num_rx = Arc::clone(&num_rx);
            let sq_tx = sq_tx.clone();
            thread::spawn(move || loop {
                let next = num_rx.lock().unwrap().recv();
                let Ok(x) = next else { break };
                sq_tx.send(x * x).unwrap();
            })
        })
        .collect();
    drop(sq_tx);
    let sum = sq_rx.iter().sum();
    producer.join().unwrap();
    for h in workers { h.join().unwrap(); }
    sum
}
```

- (가) `pipeline(1_000, 3)`은 무엇을 돌려주는가?
- (나) 1단계가 보내기 시작했지만 2단계가 아직 꺼내 가지 않은 일감은 최대 몇 개까지 생길 수 있는가? 검증 코드는 `send` 직전에 개수를 올리고 일꾼이 꺼낸 직후 내린다.
- (다) `drop(sq_tx);` 줄을 지우면 어떻게 되는가?

사용 개념: [채널](/Hongs_Blog/studies/rust/channels/)의 `sync_channel`, 닫힘 규칙, fan-out.

풀이 전략: (가)는 공식으로 확인한다. (나)는 일감이 "센 상태"로 머무를 수 있는 자리를 모두 꼽는다. (다)는 3단계의 `iter()`가 언제 끝나는지, 곧 `sq_tx`의 복제본이 언제 모두 사라지는지 따라간다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 공식:* $$\sum_{x=1}^{n} x^2 = \dfrac{n(n+1)(2n+1)}{6}$$이고, $$n = 1000$$이면 $$\dfrac{1000 \cdot 1001 \cdot 2001}{6} = 333{,}833{,}500$$이다. 실행 결과도 같았다.
2. *(나) 머무를 자리 꼽기:* 채널 칸 4개, 1단계가 `send`에서 기다리는 1개, 일꾼이 꺼냈지만 아직 개수를 내리지 않은 것 최대 3개(일꾼마다 하나)다. 합쳐 $$4 + 1 + 3 = 8$$개를 넘지 않는다. 실측 최댓값은 두 번 다 6이었다. 채널 자체에는 4개보다 많이 쌓이지 않는다. 단계 사이 큐가 4칸이라 1단계는 2단계 속도에 맞춰 기다린다.
3. *(다) 닫힘 따라가기:* 일꾼들이 끝나면 각자 쥔 `sq_tx` 복제본은 사라진다. 그러나 `pipeline`이 쥔 원본 `sq_tx`가 살아 있으므로 3단계의 `sq_rx.iter()`는 더 올 값이 있다고 보고 영원히 기다린다. 검증 코드는 같은 상황을 `recv_timeout(50ms)`로 만들어 값 셋을 받은 뒤 `Timeout`, 원본을 `drop`한 뒤 `Disconnected`를 확인했다.

</details>


**변형.** `pipeline(0, 2)`, `pipeline(3, 1)`, `pipeline(100, 8)`은 각각 무엇을 돌려주는가? 일꾼 수가 결과를 바꾸는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

0, 14($$1 + 4 + 9$$), 338,350이다. 일꾼 수는 결과를 바꾸지 않는다. 덧셈은 순서와 상관없으므로, 어느 일꾼이 어느 수를 제곱했든 합은 같다. `n = 0`이면 1단계가 아무것도 보내지 않고 끝나 `num_tx`가 사라지고, 일꾼들의 `recv`가 곧바로 `Err`를 받아 끝난다.

</details>


## p4 · 멈춤 깃발과 Ordering 고르기

- (가) 일꾼 넷이 `stop: AtomicBool`이 켜질 때까지 일하며 `progress: AtomicU64`를 1씩 올린다. `main`은 `progress`가 1,000을 넘으면 `stop`을 켠다. 일꾼마다 처리한 개수는 `join`의 돌려준 값으로 받는다. `stop`과 `progress`에 쓸 가장 약한 `Ordering`은?
- (나) 이번에는 한 스레드가 결과 42를 `result: AtomicUsize`에 쓰고 `ready: AtomicBool`을 켠다. 다른 스레드는 `ready`가 켜질 때까지 기다렸다가 `result`를 읽는다. 각 연산의 `Ordering`은?

사용 개념: [원자적 연산과 메모리 순서](/Hongs_Blog/studies/rust/atomics-memory-ordering/)의 `Relaxed`, `Release`/`Acquire`, 먼저 일어남.

풀이 전략: 깃발이 "다른 변수에 쓴 값이 준비됐다"는 약속을 함께 나르는지 본다. 나르지 않으면 `Relaxed`로 충분하다. 나르면 깃발 쓰기에 `Release`, 깃발 읽기에 `Acquire`를 붙인다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 깃발이 나르는 것:* `stop`은 "그만"이라는 사실 하나만 알린다. 일꾼이 `stop`을 본 뒤 읽어야 할 다른 데이터가 없다. `progress`는 변수 하나의 카운터이고, 한 변수의 고침 순서는 `Relaxed`에서도 모두가 같게 본다. 그래서 둘 다 `Relaxed`다. 일꾼별 개수는 `join`으로 받는데, `join`이 그 스레드의 모든 쓰기보다 뒤에 일어남을 보장한다.
2. *(가) 확인:* 일꾼별 개수의 합이 `progress`와 같았고, `progress`는 1,000 이상이었다.
3. *(나) 깃발이 나르는 것:* 이번 깃발은 "`result`가 준비됐다"는 약속을 나른다. 두 변수 사이의 순서는 `Relaxed`가 보장하지 않는다. 쓰는 쪽은 `result.store(42, Relaxed)` 다음 `ready.store(true, Release)`, 읽는 쪽은 `while !ready.load(Acquire) {}` 다음 `result.load(Relaxed)`다. `Release` 쓰기를 `Acquire`로 읽으면 그 앞의 `result` 쓰기가 그 뒤의 `result` 읽기보다 먼저 일어난다.
4. *(나) 확인:* 1,000번 돌려 1,000번 모두 42를 읽었다. 이것은 이 Mac(aarch64) 한 대에서 본 실험이다. 순서가 옳다는 근거는 3의 먼저 일어남 논증이다.

</details>


**변형.** (가)에서 `progress.fetch_add(1, Relaxed)` 대신 `let v = progress.load(Relaxed); progress.store(v + 1, Relaxed);`로 쓰면 "일꾼별 개수의 합 == `progress`"가 계속 맞는가? `Ordering`을 `SeqCst`로 올리면?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

맞지 않을 수 있다. 두 일꾼이 같은 값을 읽은 뒤 각자 1을 더해 쓰면 갱신 하나가 사라져 `progress`가 합보다 작아진다. `SeqCst`로 올려도 같다. `load`와 `store` 사이에 다른 스레드가 끼어드는 것은 순서 꼬리표가 막지 않는다. 읽고 고치고 쓰기를 한 번에 하는 `fetch_add`가 답이다([원자적 연산과 메모리 순서](/Hongs_Blog/studies/rust/atomics-memory-ordering/)의 C4).

</details>
{% endraw %}
