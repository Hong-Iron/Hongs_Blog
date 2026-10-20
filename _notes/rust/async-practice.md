---
layout: "note"
title: "async 연습"
display_title: "async 연습"
kind: "practice"
kind_label: "연습"
num: "40"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "8단원의 네 가지, 퓨처가 언제 움직이는지, 실행기를 막는 코드, 동시 실행과 시간 제한, 큐를 비우고 끝내기를 시간으로 재 보는 네 문제다. 시간이 답인 문제는 먼저 몇 ms일지 적고 나서 돌린다."
prev_url: "/studies/rust/concurrency-practice/"
prev_title: "동시성 연습"
next_url: "/studies/rust/service-basics-practice/"
next_title: "서비스 기초 연습"
math: false
mermaid: false
code_count: 4
code_files: [{"t": "40_async-practice_p1.rs", "u": "/studies/rust/code/40_async-practice_p1/", "r": "문제 1 풀이"}, {"t": "40_async-practice_p2.rs", "u": "/studies/rust/code/40_async-practice_p2/", "r": "문제 2 풀이"}, {"t": "40_async-practice_p3.rs", "u": "/studies/rust/code/40_async-practice_p3/", "r": "문제 3 풀이"}, {"t": "40_async-practice_p4.rs", "u": "/studies/rust/code/40_async-practice_p4/", "r": "문제 4 풀이"}]
permalink: "/studies/rust/async-practice/"
---
{% raw %}
8단원의 네 가지, 퓨처가 언제 움직이는지, 실행기를 막는 코드, 동시 실행과 시간 제한, 큐를 비우고 끝내기를 시간으로 재 보는 네 문제다. 시간이 답인 문제는 먼저 몇 ms일지 적고 나서 돌린다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답과 변형을 tokio로 실행해 확인했다. 시간은 이 Mac(aarch64)의 디버그 빌드에서 잰 값이고, p1은 흔들림을 지우려고 100ms 단위로 반올림했다 — [p1](/Hongs_Blog/studies/rust/code/40_async-practice_p1/) · [p2](/Hongs_Blog/studies/rust/code/40_async-practice_p2/) · [p3](/Hongs_Blog/studies/rust/code/40_async-practice_p3/) · [p4](/Hongs_Blog/studies/rust/code/40_async-practice_p4/)</div>

</div>


## p1 · 일은 언제 시작되나

`fetch`는 100ms를 기다린 뒤 `id * 10`을 돌려준다.

```rust
async fn fetch(id: u32) -> u32 {
    sleep(Duration::from_millis(100)).await;
    id * 10
}
```

다섯 경우에 걸리는 시간을 100ms 단위로 예측하라.

```rust
// (가) 만들어 두고 차례로 await
let a = fetch(1);
let b = fetch(2);
let sum = a.await + b.await;

// (나) join!으로 같이 기다리기
let (x, y) = tokio::join!(fetch(1), fetch(2));

// (다) spawn한 뒤 다른 일 100ms, 그다음 await
let h1 = tokio::spawn(fetch(1));
let h2 = tokio::spawn(fetch(2));
sleep(Duration::from_millis(100)).await;
let s = h1.await.unwrap() + h2.await.unwrap();

// (라) 퓨처를 만들고 다른 일 100ms, 그다음 await
let f = fetch(1);
sleep(Duration::from_millis(100)).await;
let v = f.await;

// (마) 둘 다 만들어 둔 뒤 join!에 넘기기
let (a, b) = (fetch(1), fetch(2));
let (x, y) = tokio::join!(a, b);
```

사용 개념: [Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/)의 게으른 퓨처, [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)의 `spawn`.

풀이 전략: 경우마다 "`fetch`의 본문이 처음 `poll`되는 순간"을 찾는다. 그 순간부터 100ms 뒤에 끝난다. 퓨처를 만드는 것만으로는 아무 일도 시작되지 않는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 차례로:* `a.await`가 `a`를 처음 `poll`하고 100ms 뒤 끝난다. 그다음 `b.await`가 `b`를 처음 `poll`한다. 100 + 100 = **200ms**.
2. *(나) 함께:* `join!`은 두 퓨처를 같은 태스크에서 번갈아 `poll`한다. 두 잠이 동시에 흐르므로 **100ms**.
3. *(다) spawn:* `spawn`은 퓨처를 런타임에 넘겨 바로 돌게 한다. `main`이 100ms 자는 동안 두 태스크도 각자 100ms를 잔다. `await`할 때는 이미 끝나 있다. **100ms**.
4. *(라) 만들기만:* `f`를 만든 뒤 100ms 동안 아무도 `f`를 `poll`하지 않는다. `f.await`에서야 시작해 100ms가 더 든다. **200ms**. (다)와 가장 크게 다른 점이다.
5. *(마) 만든 뒤 join!:* 만든 순간에는 시작하지 않았지만, `join!`이 둘을 함께 `poll`하므로 (나)와 같다. **100ms**.

실측은 (가) 200, (나) 100, (다) 100, (라) 200, (마) 100ms였고, 합은 모두 30, (라)의 값은 10이었다.

</details>


**변형.** (라)의 `let f = fetch(1);`을 `let f = tokio::spawn(fetch(1));`로 바꾸고 `f.await.unwrap()`으로 받으면 몇 ms인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

약 100ms다(실측 100ms). `spawn`한 순간 태스크가 돌기 시작하므로, `main`이 다른 일을 하는 100ms 동안 `fetch`의 잠도 함께 흐른다. (다)와 같은 원리다. "나중에 기다릴 일은 미리 `spawn`해 둔다"가 이 차이를 쓰는 방법이다. 단, `spawn`은 `'static`과 `Send` 조건이 붙는다.

</details>


## p2 · 실행기를 막는 계산

current_thread 런타임에서 10ms마다 응답해야 하는 가벼운 작업(ping)이 돈다. 그 옆에서 요청 하나가 체크섬을 계산한다. 계산은 `.await` 없이 약 200ms 동안 CPU를 붙잡는다.

```rust
fn heavy_hash(data: &[u8]) -> u64 { /* FNV-1a 해시, 약 200ms 동안 CPU를 쓴다 */ }

async fn checksum_bad(data: Vec<u8>) -> u64 {
    heavy_hash(&data)
}
```

- (가) 계산하는 동안 ping이 예정보다 가장 많이 늦은 시간은 대략 몇 ms인가?
- (나) ping이 늦지 않게 `checksum`을 고쳐라. 함수의 겉모양(`async fn(Vec<u8>) -> u64`)은 그대로 둔다.
- (다) 고친 판이 고치기 전과 같은 값을 내는지 어떻게 확인하나?

사용 개념: [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)의 "실행기를 막지 마라"와 `spawn_blocking`.

풀이 전략: tokio의 태스크는 `.await`에서만 차례를 넘긴다. `.await` 없이 200ms를 도는 코드가 있으면, 같은 스레드의 다른 태스크는 그동안 한 번도 `poll`되지 못한다. 무거운 일을 다른 스레드로 보내고, 그 결과를 `.await`로 기다리게 바꾼다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 막히는 시간:* 계산이 끝날 때까지 런타임의 유일한 스레드를 붙잡으므로 ping은 약 200ms 늦는다. 실측 최대 지연 200ms였다.
2. *(나) 다른 스레드로:* `spawn_blocking`은 블로킹해도 되는 별도 스레드 풀에서 클로저를 돌리고, 그 결과를 `.await`할 수 있는 핸들을 돌려준다. 기다리는 동안 이 태스크는 차례를 넘긴다.

```rust
async fn checksum_good(data: Vec<u8>) -> u64 {
    tokio::task::spawn_blocking(move || heavy_hash(&data))
        .await
        .expect("계산 태스크가 panic하지 않는다")
}
```

`data`를 `move`로 옮겨 넣는 것은 `spawn_blocking`도 `'static` 클로저를 받기 때문이다. 실측 최대 지연은 2ms로 줄었다.

{: start="3"}
3. *(다) 같은 값:* 같은 입력(`vec![7u8; 4096]`)으로 두 함수를 불러 `assert_eq!`로 비교한다. 검증 코드에서 같았다.

</details>


**변형.** `checksum_good`에서 `spawn_blocking`의 핸들을 `.await`하지 않고 버리면 계산은 멈추는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

멈추지 않는다. 이미 시작한 `spawn_blocking` 작업은 abort할 수 없고, 핸들을 버려도 끝까지 돈다([tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)). 결과만 받지 못한다. 런타임을 버릴 때도 이런 작업은 끝날 때까지 기다린다([안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/)).

</details>


## p3 · 동시 3개, 일마다 60ms 제한

일감 12개를 처리한다. 번호가 4의 배수인 일은 200ms, 나머지는 20ms가 걸린다. 동시에 최대 3개만 돌리고, 일마다 60ms가 지나면 포기하고 `TimedOut`으로 적는다. 결과는 번호 순으로 돌려준다.

```rust
async fn run_all(ids: Vec<u32>, limit: usize, per_job: Duration) -> Vec<(u32, Outcome)> {
    let sem = Arc::new(Semaphore::new(limit));
    let mut set = JoinSet::new();
    for id in ids {
        let permit = sem.clone().acquire_owned().await.expect("세마포어를 닫지 않는다");
        set.spawn(async move {
            let r = match timeout(per_job, job(id)).await {
                Ok(v) => Outcome::Done(v),
                Err(_) => Outcome::TimedOut,
            };
            drop(permit);
            (id, r)
        });
    }
    // join_next로 모두 모은 뒤 번호 순으로 정렬한다
}
```

- (가) 어느 일이 `TimedOut`이 되는가? 3번의 결과는?
- (나) 동시에 돈 일의 최대 수는? 그것을 재려면 `job` 안에 무엇을 둬야 하나?
- (다) `job` 안에서 "지금 도는 일의 수"를 올렸다 내리는데, `timeout`으로 버려진 일에서도 수가 내려가게 하려면?

사용 개념: [백프레셔와 큐 제한](/Hongs_Blog/studies/rust/backpressure/)의 `Semaphore`, [취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/)의 timeout과 버려진 퓨처의 `Drop`.

풀이 전략: 허가증을 `spawn` 전에 받으므로 줄 서는 시간은 timeout 밖이다. timeout이 재는 것은 일 자체의 시간뿐이다. 버려진 퓨처 안에서는 `.await` 뒤의 코드가 돌지 않으니, "끝날 때 꼭 할 일"은 `Drop`에 둔다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 시간 비교:* 200ms짜리 4, 8, 12번은 60ms를 넘기므로 `TimedOut`이다. 나머지는 20ms라 `Done(id * id)`다. 3번은 `Done(9)`.
2. *(나) 최대 동시 실행:* 3이다. `job`이 시작할 때 `fetch_add`로 수를 올리고 그 값으로 최댓값을 `fetch_max`한다.
3. *(다) Drop에 두기:* 수를 내리는 코드를 `.await` 뒤에 두면, timeout으로 버려진 4·8·12번에서는 그 줄이 돌지 않는다. 대신 `Drop`에서 내리는 값을 `job` 안에 둔다. 퓨처가 버려질 때 지역 변수는 `Drop`으로 정리되기 때문이다.

```rust
struct Leave(Arc<AtomicUsize>);
impl Drop for Leave {
    fn drop(&mut self) {
        self.0.fetch_sub(1, Ordering::SeqCst);
    }
}
let _leave = Leave(in_flight); // 끝나든 버려지든 수가 내려간다
```

실행 결과는 1~12번 중 `[4, 8, 12]`가 `TimedOut`, 최대 동시 실행 3이었다.

</details>


**변형.** 일을 모두 먼저 `spawn`하고, 각 태스크가 `timeout(60ms, async { 허가증 받기; job(id).await })`처럼 허가증 기다리기까지 시간 제한 안에 넣으면 무엇이 달라지나?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

늦은 일이 훨씬 많아진다. 세 번 돌려 `[4, 5, 8, 9, 10, 11, 12]`, `[4, 7, 8, 9, 10, 11, 12]`, `[3, 4, 6, 8, 9, 10, 11, 12]`가 나왔다. 앞의 200ms짜리 일들이 자리를 오래 쥐는 동안 줄 선 20ms짜리 일들의 60ms가 흘러 버린다. 어느 일이 먼저 자리를 받는지는 태스크가 뜨는 순서에 따라 실행마다 다르다. 그래서 시간 제한을 "어디서부터 재는가"를 먼저 정한다. 줄 선 시간을 빼고 일만 재려면 허가증을 timeout 밖에서 받는다. [캡스톤 5](/Hongs_Blog/studies/rust/capstone-5/)의 서버 코드에도 요청 시간 제한이 동시 처리 상한에서 줄 선 시간은 재지 않는다는 주석이 있다.

</details>


## p4 · 큐를 비우고 끝나는 작업자

메시지 20개가 미리 큐(`mpsc::channel(32)`)에 들어 있다. 작업자는 메시지 하나에 5ms를 쓴다. 22ms에 종료 신호(`CancellationToken`)가 온다.

```rust
async fn worker_bad(mut rx: mpsc::Receiver<u32>, token: CancellationToken) -> Vec<u32> {
    let mut done = Vec::new();
    loop {
        tokio::select! {
            biased;
            _ = token.cancelled() => break,
            m = rx.recv() => match m {
                Some(m) => { sleep(Duration::from_millis(5)).await; done.push(m); }
                None => break,
            },
        }
    }
    done
}
```

- (가) `worker_bad`는 메시지를 몇 개 처리하고 끝나는가? 나머지는 어떻게 되는가?
- (나) 신호가 오면 새 메시지는 막고, 이미 큐에 들어온 메시지는 모두 처리한 뒤 끝나게 고쳐라.
- (다) 고친 작업자가 끝난 뒤 보내는 쪽이 `send(99)`를 하면?

사용 개념: [안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/)의 받기 중단 → 마무리 순서, [채널](/Hongs_Blog/studies/rust/channels/)의 닫힘 규칙.

풀이 전략: "받기를 멈춘다"와 "받은 것을 버린다"를 떼어 놓는다. tokio의 `Receiver::close()`는 받는 쪽을 버리지 않고 닫는다. 그 뒤로 `send`는 실패하지만, 이미 들어온 메시지는 그대로 꺼낼 수 있다. `recv()`는 닫혔고 남은 메시지가 없을 때 `None`을 낸다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 잃는 것:* 신호를 받은 시점에 하던 메시지까지 처리하고 다음 바퀴에서 멈춘다. 실측 4개였다. 큐에 남은 16개는 작업자와 함께 버려진다.
2. *(나) 닫고 비우기:* 신호 가지에서 반복을 빠져나온 뒤, `close()`로 새 메시지를 막고 남은 것을 다 꺼낸다.

```rust
async fn worker_good(mut rx: mpsc::Receiver<u32>, token: CancellationToken) -> Vec<u32> {
    let mut done = Vec::new();
    loop {
        tokio::select! {
            biased;
            _ = token.cancelled() => break,
            m = rx.recv() => match m {
                Some(m) => { sleep(Duration::from_millis(5)).await; done.push(m); }
                None => return done,
            },
        }
    }
    rx.close(); // 이제 send는 실패한다. 이미 들어온 것은 남아 있다
    while let Some(m) = rx.recv().await {
        sleep(Duration::from_millis(5)).await;
        done.push(m);
    }
    done
}
```

실측으로 1부터 20까지 20개를 순서대로 모두 처리했다.

{: start="3"}
3. *(다) 늦은 send:* `Err`가 온다. 받는 쪽이 닫혔다가 작업자가 끝나며 사라졌기 때문이다. 보내는 쪽은 이 `Err`를 "더는 받지 않는다"로 보고 멈춘다.

</details>


**변형.** (나)에서 `rx.close();` 줄만 지우면 어떻게 되는가? 보내는 쪽 `tx`는 아직 살아 있다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

작업자가 끝나지 않는다. 남은 메시지를 다 꺼낸 뒤에도 `tx`가 살아 있어 채널이 열려 있으므로, `recv()`는 `None`을 내지 않고 다음 메시지를 기다린다. 검증 코드에서 이 판은 100ms 안에 끝나지 않았다. 닫힘을 알리는 길은 둘이다. 받는 쪽이 `close()`하거나, 보내는 쪽이 모두 사라지거나.

</details>
{% endraw %}
