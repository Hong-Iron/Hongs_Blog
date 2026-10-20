---
layout: "note"
title: "모니터 ↔ Mutex"
display_title: "모니터 ↔ Mutex: 데이터와 잠금을 한 몸으로 묶기"
kind: "concept"
kind_label: "브리지"
num: "33"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Monitor vs Mutex", "Condvar", "조건 변수", "Condition Variable", "유한 버퍼", "Bounded Buffer", "wait_while", "notify_one", "notify_all"]
description: "운영체제 수업의 모니터는 공유 데이터와 그것을 다루는 함수를 한 방에 넣고, 방에는 한 번에 한 프로세스만 들어가게 한 언어 구조다. Rust에는 모니터라는 문법이 없다. 대신 데이터를 Mutex 안에 넣고 조건 변수 Condvar를 곁에 두면 거의 같은 것이 된다. 깨어난 뒤 조…"
prev_url: "/studies/rust/mutex-rwlock/"
prev_title: "Mutex와 RwLock"
next_url: "/studies/rust/atomics-memory-ordering/"
next_title: "원자적 연산과 메모리 순서"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "33_monitor-vs-mutex_impl.rs", "u": "/studies/rust/code/33_monitor-vs-mutex_impl/", "r": "구현"}]
permalink: "/studies/rust/monitor-vs-mutex/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

운영체제 수업의 모니터는 공유 데이터와 그것을 다루는 함수를 한 방에 넣고, 방에는 한 번에 한 프로세스만 들어가게 한 언어 구조다. Rust에는 모니터라는 문법이 없다. 대신 데이터를 `Mutex` 안에 넣고 조건 변수 `Condvar`를 곁에 두면 거의 같은 것이 된다. 깨어난 뒤 조건을 다시 봐야 하는 메사 방식이라는 점까지 같다. 다만 조건 변수와 잠금이 타입으로 묶여 있지 않고, 같은 스레드가 다시 들어올 수 없다는 점은 다르다.

</div>


## 먼저 비교해 보기

아래 두 코드는 같은 유한 버퍼다. 표를 펴기 전에, 왼쪽의 각 줄이 오른쪽의 어느 줄이 되었는지 먼저 짝지어 적어 본다. 모니터의 "한 번에 한 프로세스만 안에 있다"는 규칙이 오른쪽에서는 어디에 숨어 있는지도 찾아본다.

| 운영체제: 모니터 `boundedbuffer`[^1] | Rust: `Mutex` + `Condvar` 두 개 |
|---|---|
| `monitor boundedbuffer;` | `struct BoundedBuffer<T> { inner: Mutex<State<T>>, not_full: Condvar, not_empty: Condvar, cap: usize }` |
| `char buffer[N]; int nextin, nextout, count;` | `State { buf: VecDeque<T> }` (Mutex 안) |
| `cond notfull, notempty;` | `not_full: Condvar, not_empty: Condvar` |
| `void append(char x) {` | `fn append(&self, x: T) { let guard = self.inner.lock().unwrap();` |
| `if (count == N) cwait(notfull);` | `let mut st = self.not_full.wait_while(guard, \|st\| st.buf.len() == self.cap).unwrap();` |
| `buffer[nextin] = x; … count++;` | `st.buf.push_back(x);` |
| `csignal(notempty); }` | `drop(st); self.not_empty.notify_one(); }` |
| `void take(char x) { if (count == 0) cwait(notempty);` | `let mut st = self.inner.lock().unwrap(); while st.buf.is_empty() { st = self.not_empty.wait(st).unwrap(); }` |
| `x = buffer[nextout]; … csignal(notfull); }` | `let x = st.buf.pop_front(); drop(st); self.not_full.notify_one(); x` |

<details class="callout callout-example" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| 모니터 | Rust | 공통 구조 |
|---|---|---|
| 모니터의 지역 데이터 | `Mutex<T>` 안의 `T` | 지켜야 할 데이터는 잠금 안에만 있다 |
| 모니터 함수(`append`, `take`) | `&self`를 받고 맨 처음 `lock()`하는 메서드 | 데이터에 닿는 길은 정해진 함수뿐이다 |
| 한 번에 한 프로세스만 안에 있다 | `MutexGuard`가 살아 있는 동안 다른 `lock()`은 기다린다 | 상호 배제 |
| 입구 큐 | `lock()`에서 잠든 스레드들 | 들어갈 차례를 기다리는 줄 |
| 함수를 마치고 나간다 | 가드가 범위를 벗어나 `Drop`된다 | 나갈 때 자리를 비운다 |
| 조건 변수 `notfull`, `notempty` | `Condvar` 두 개 | 조건마다 따로 기다리는 줄 |
| `cwait(c)`: 멈추고 모니터를 비운다 | `c.wait(guard)`: 잠금을 풀고 잠든다. 깨면 다시 잠근다 | 기다리는 동안 남이 들어올 수 있게 한다 |
| `csignal(c)` / 메사의 `cnotify(c)` | `notify_one()` | 기다리는 하나를 깨운다 |
| `cbroadcast(c)` | `notify_all()` | 기다리는 모두를 깨운다 |
| 메사 방식이라 `if` 대신 `while` | `while … { wait }` 또는 `wait_while` | 깨어나면 조건을 다시 본다 |
| 기다리는 프로세스가 없으면 `csignal`은 사라진다 | `notify_*`는 "어떤 식으로도 쌓이지 않는다" | 신호는 저장되지 않는다 |

</details>


`Condvar::wait`은 가드를 받아 잠금을 풀고 잠들었다가, 깨어나면 다시 잠근 가드를 돌려준다[^2]. 이것이 모니터의 `cwait`이 "부른 프로세스를 멈추고 모니터를 다른 프로세스에 내준다"는 것과 같은 일이다. `wait_while(guard, 조건)`은 조건이 참인 동안 `wait`을 되풀이하는 함수다[^2]. 메사 방식에서 쓰는 `while (count == N) cwait(notfull);` 반복을 한 줄로 쓴 것이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 용량 4, 생산자 3, 소비자 2가 30,000개를 주고받아 모든 값이 한 번씩 나오고 버퍼가 4를 넘지 않는 것, 용량 1에서도 같은 것, 아무도 기다리지 않을 때의 `notify_one` 뒤 `wait_timeout`이 시간 초과로 끝나는 것(신호가 쌓이지 않는다), 전이 문제의 주차장(자리 3개, 차 8대 × 2,000번)에서 안에 있던 차가 3대를 넘지 않고 `leave` 다음의 `enter`가 기다리지 않는 것을 실행해 확인했다 — [33_monitor-vs-mutex_impl.rs](/Hongs_Blog/studies/rust/code/33_monitor-vs-mutex_impl/)</div>

</div>


## 어디까지 같은가

**같은 것.**

- 상호 배제는 둘 다 공짜로 얻는다. 모니터는 언어가, Rust는 `Mutex<T>`의 타입이 "잠그지 않으면 데이터에 못 닿는다"를 강제한다[^3].
- 둘 다 메사 방식이다. `notify_one`을 받은 스레드는 바로 실행되지 않고 잠금을 다시 얻을 때까지 기다린다. 그사이 다른 스레드가 먼저 들어와 조건을 바꿀 수 있다. 그래서 `if`가 아니라 `while`로 다시 본다([모니터](/Hongs_Blog/studies/operating-systems/monitor/)의 C2).
- 신호가 쌓이지 않는다. 기다리는 스레드가 없을 때의 `notify_one`은 아무 흔적도 남기지 않는다[^2]. 세마포어의 `semSignal`과 다른 점이 그대로 이어진다.

**Rust에서 더 엄격해지는 것.**

- **가짜 깨어남(spurious wakeup).** std는 `wait`이 아무도 `notify`하지 않았는데 돌아올 수 있다고 적는다. 그래서 조건을 다시 보는 이유가 하나 더 있다[^2]. 메사 모니터의 "그사이 상황이 바뀌었을 수 있다"에 "신호 자체가 없었을 수 있다"가 더해진다.

**대응이 깨지는 지점.**

- **조건 변수와 잠금이 타입으로 묶이지 않는다.** 모니터의 조건 변수는 그 모니터 안에서만 쓴다. Rust의 `Condvar`는 독립된 값이라, 서로 다른 `Mutex` 두 개의 가드를 한 `Condvar`에 번갈아 주는 코드가 컴파일된다. std는 이때 실행 중에 panic할 수 있다고만 적는다[^2]. 구조체 하나에 `Mutex`와 `Condvar`를 함께 넣고 필드를 비공개로 두어 사람이 이 짝을 지킨다.
- **모니터 함수만 데이터에 닿는다는 규칙은 모듈이 지킨다.** `Mutex`는 "잠그면 누구나 만질 수 있다"까지만 보장한다. "정해진 함수로만 만진다"는 필드를 비공개로 두는 것([모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/)의 가시성)으로 지킨다.
- **같은 스레드가 다시 들어오지 못한다.** Java의 `synchronized`는 이미 쥔 모니터에 같은 스레드가 다시 들어갈 수 있다 [확인필요: Java 문서를 이 묶음에서 열어 보지 않았다]. Rust `Mutex`는 같은 스레드가 다시 잠그면 멈추거나 panic할 수 있다[^4]. 모니터 함수가 같은 모니터의 다른 함수를 부르는 설계를 그대로 옮기면 멈춘다. 잠근 뒤 쓰는 내부 함수는 가드나 `&mut T`를 받게 나눈다.
- **호어 방식은 없다.** 깨운 스레드에게 바로 자리를 넘기는 호어 방식은 std에 없다.
- **독(poisoning).** 모니터 안에서 프로세스가 죽는 경우를 모니터는 다루지 않는다. Rust는 가드를 쥔 채 panic하면 `Mutex`에 독을 남긴다. `wait`도 `LockResult`를 돌려주는 이유다[^2][^4].

## 이 연결로 얻는 것

- **운영체제 수업의 모니터 풀이를 그대로 Rust로 옮길 수 있다.** 생산자-소비자, 독자-저자, 식사하는 철학자의 모니터 풀이에서 `cwait`을 `wait_while`로, `csignal`을 `notify_one`으로 바꾸면 된다. 조건식은 `wait_while`의 클로저에 "기다려야 하는 조건"으로 들어간다. 모니터의 `if (count == N)`이 그대로 <code>&#124;st&#124; st.buf.len() == cap</code>이 된다.
- **Rust에서 배운 것을 모니터 쪽에도 쓴다.** "조건을 고친 쪽이 신호를 보낸다", "조건마다 조건 변수를 따로 둔다", "신호 전에 잠금을 놓아도 맞다"는 규칙은 Java의 `wait`/`notify`나 파이썬 `threading.Condition`에도 그대로다.
- **조건 변수가 필요 없는 경우를 알아본다.** "물건을 넘긴다"가 본질이면 `sync_channel(N)`이 바로 유한 버퍼다: [채널](/Hongs_Blog/studies/rust/channels/). 메시지 전달과 모니터가 같은 문제의 두 풀이라는 운영체제 수업의 이야기([메시지 전달](/Hongs_Blog/studies/operating-systems/message-passing/))가 Rust에서는 `Mutex+Condvar`와 채널로 나타난다.

## 전이 문제

주차장에 자리가 $$N$$개 있다. 차는 들어올 때 자리가 없으면 기다리고, 나갈 때 자리 하나를 돌려준다. 이것은 운영체제 수업의 계수 세마포어([세마포어](/Hongs_Blog/studies/operating-systems/semaphore/))다. 위의 대응표만 써서 `Mutex<usize>`와 `Condvar` 하나로 `enter()`와 `leave()`를 설계하라. 모니터 함수 둘, 조건 변수 하나, 그리고 각 함수에서 기다리는 조건과 신호를 보내는 자리를 적는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

- 데이터: `free: Mutex<usize>`(남은 자리 수), 조건 변수: `has_space: Condvar`.
- `enter()`: <code>let mut f = has_space.wait_while(free.lock().unwrap(), &#124;f&#124; *f == 0).unwrap(); *f -= 1;</code>. 모니터라면 `while (free == 0) cwait(has_space); free--;`이다.
- `leave()`: `*free.lock().unwrap() += 1; has_space.notify_one();`. 모니터라면 `free++; csignal(has_space);`이다.
- 세마포어의 `semSignal`은 기다리는 차가 없어도 값을 1 늘려 둔다. 여기서는 그 "늘려 둠"을 `free` 숫자가 맡는다. 신호(`notify_one`)는 사라져도 숫자는 남으므로 나중에 온 차는 기다리지 않는다. 조건 변수에는 기억이 없고 데이터에 기억이 있다는 것이 이 대응의 핵심이다.

</details>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 모니터 코드 `if (count == 0) cwait(notempty);`를 Rust로 옮겨라. 왜 `if`를 그대로 옮기면 안 되는가?</summary>

**답:** <code>let mut st = not_empty.wait_while(inner.lock().unwrap(), &#124;st&#124; st.buf.is_empty()).unwrap();</code> 또는 `while st.buf.is_empty() { st = not_empty.wait(st).unwrap(); }`.<br>
**이유:** `Condvar`는 메사 방식이라 깨어난 뒤 다른 소비자가 먼저 물건을 가져갔을 수 있다. 게다가 가짜 깨어남도 있다. 그래서 조건을 다시 본다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 아무 스레드도 기다리지 않을 때 (가) `Condvar::notify_one`을 부르고 그다음 스레드가 `wait`하는 경우와, (나) 위 전이 문제의 `leave()`를 부르고 그다음 차가 `enter()`하는 경우, 각각 뒤에 온 스레드는 기다리는가?</summary>

**답:** (가)는 기다린다. 신호가 쌓이지 않는다. (나)는 기다리지 않는다. `free`가 1 늘어 있어 `wait_while`의 조건이 처음부터 거짓이다.<br>
**흔한 오답:** "둘 다 notify를 불렀으니 같다." 기억은 조건 변수가 아니라 잠금 안의 데이터에 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** Java 모니터에서 `synchronized` 메서드 `a()`가 같은 객체의 `synchronized` 메서드 `b()`를 부르는 설계를 Rust의 `Mutex`로 그대로 옮기면 무엇이 문제인가?</summary>

**답:** `a()`가 잠금을 쥔 채 `b()`가 같은 `Mutex`를 다시 `lock()`한다. std는 이 경우 돌아오지 않는다고만 정했다(멈추거나 panic). `b()`의 본문을 가드나 `&mut State`를 받는 내부 함수로 떼어 내고, 바깥 함수만 잠근다.

</details>


[^1]: 운영체제 노트 [모니터](/Hongs_Blog/studies/operating-systems/monitor/)의 `boundedbuffer` 코드(Stallings 6판 그림 5.16을 따른 것)
[^2]: std 문서, `std::sync::Condvar` (`wait`, `wait_while`, `notify_one`, `notify_all`) — https://doc.rust-lang.org/std/sync/struct.Condvar.html
[^3]: The Rust Programming Language, 16.3 Shared-State Concurrency (The API of Mutex<T>) — https://doc.rust-lang.org/book/ch16-03-shared-state.html
[^4]: std 문서, `std::sync::Mutex` (Poisoning, `lock`) — https://doc.rust-lang.org/std/sync/struct.Mutex.html
{% endraw %}
