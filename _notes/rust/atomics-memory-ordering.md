---
layout: "note"
title: "원자적 연산과 메모리 순서"
display_title: "원자적 연산과 메모리 순서 (Atomics and Memory Ordering)"
kind: "concept"
kind_label: "모델"
num: "34"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Atomics", "Atomic Operations", "Memory Ordering", "Ordering", "Relaxed", "Acquire", "Release", "AcqRel", "SeqCst", "happens-before", "먼저 일어남", "compare_exchange", "fetch_add", "스핀락", "Spin Lock", "AtomicBool", "AtomicUsize"]
description: "원자적 연산은 \"반쯤 된 상태\"를 아무도 볼 수 없는, 쪼갤 수 없는 읽기·쓰기다. 잠금 없이 숫자 하나를 여러 스레드가 함께 세는 데 쓰고, 잠금보다 가볍다. 어려운 부분은 변수가 둘 이상일 때다. 컴파일러와 CPU는 속도를 위해 읽기·쓰기 순서를 바꾸므로, \"데이터를 쓰고 나서…"
prev_url: "/studies/rust/monitor-vs-mutex/"
prev_title: "모니터 ↔ Mutex"
next_url: "/studies/rust/channels/"
next_title: "채널"
math: true
mermaid: false
code_count: 1
permalink: "/studies/rust/atomics-memory-ordering/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

원자적 연산은 "반쯤 된 상태"를 아무도 볼 수 없는, 쪼갤 수 없는 읽기·쓰기다. 잠금 없이 숫자 하나를 여러 스레드가 함께 세는 데 쓰고, 잠금보다 가볍다. 어려운 부분은 변수가 둘 이상일 때다. 컴파일러와 CPU는 속도를 위해 읽기·쓰기 순서를 바꾸므로, "데이터를 쓰고 나서 깃발을 세웠다"는 순서가 다른 스레드에서 거꾸로 보일 수 있다. 그 순서를 지키게 하는 꼬리표가 메모리 순서(Ordering)이고, 잘못 고르면 테스트는 통과하는데 다른 기계에서 틀리는 버그가 된다.

</div>


## 예시로 보기

방문자 수를 세는 카운터가 있다. `Mutex<usize>`로 감싸도 되지만, 숫자 하나에 1을 더하는 데 스레드를 재우고 깨우는 잠금은 무겁다. clippy도 `Mutex<정수>`를 보면 원자 타입을 쓰라고 한다([Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/)).

```rust
use std::sync::atomic::{AtomicUsize, Ordering};

let c = AtomicUsize::new(0);
std::thread::scope(|s| {
    for _ in 0..4 {
        s.spawn(|| for _ in 0..100_000 { c.fetch_add(1, Ordering::Relaxed); });
    }
});
assert_eq!(c.load(Ordering::Relaxed), 400_000);
```

`fetch_add`는 "읽고, 더하고, 쓰기"를 한 번에 쪼갤 수 없게 한다. 다른 스레드는 그 중간을 볼 수 없다[^1]. `&`만으로 고칠 수 있으므로 원자 타입도 내부 가변성의 한 종류다[^1].

그럼 `load`와 `store`를 따로 쓰면 어떨까? 둘 다 원자적이지만 그 사이가 끊긴다.

```rust
let seen = c.load(Ordering::Relaxed); // 두 스레드가 모두 0을 읽는다
c.store(seen + 1, Ordering::Relaxed); // 둘 다 1을 쓴다 → 결과 1
```

검증 코드는 `Barrier`로 두 스레드가 모두 읽은 뒤에 쓰게 해서, 결과가 2가 아니라 1인 것을 20번 모두 확인했다. 운영체제 수업의 `x = x + 1` 문제([경쟁 조건과 임계 구역](/Hongs_Blog/studies/operating-systems/race-condition-critical-section/))가 원자 변수에서도 그대로 생긴다.

이제 변수가 둘이다. 한 스레드가 결과를 `DATA`에 쓰고, 다 됐다는 표시로 `READY`를 `true`로 바꾼다. 다른 스레드는 `READY`가 `true`가 될 때까지 기다렸다가 `DATA`를 읽는다. 두 쓰기에 모두 `Relaxed`를 쓰면, 받는 쪽이 `READY == true`를 보고도 `DATA`에서 옛값 0을 읽을 수 있다[^2]. 깃발 쓰기에 `Release`, 깃발 읽기에 `Acquire`를 쓰면 그런 일이 없다[^2][^3].

```rust
// 보내는 쪽
data.store(expected, Ordering::Relaxed);
ready.store(true, Ordering::Release);   // 이 앞의 모든 쓰기를 내보낸다

// 받는 쪽
while !ready.load(Ordering::Acquire) { std::hint::spin_loop(); }
assert_eq!(data.load(Ordering::Relaxed), expected); // 반드시 보인다
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `Relaxed` 카운터 400,000, 따로 한 load·store가 갱신을 잃는 것, `fetch_add`가 옛값을 돌려주고 254→255→0으로 감기는 것, `compare_exchange` 승자가 8개 스레드 중 정확히 하나인 것, `Release`/`Acquire` 깃발 2,000번, 스핀락 카운터 200,000, 잘못된 Ordering이 컴파일 오류인 것을 실행·컴파일해 확인했다 — [34_atomics-memory-ordering_verify.rs](/Hongs_Blog/studies/rust/code/34_atomics-memory-ordering_verify/). 단, 메모리 순서에 관한 부분은 이 Mac(aarch64) 한 대에서 본 실험이다. 실험 통과는 순서가 옳다는 증명이 아니다.</div>

</div>


## 정의

**원자적 연산.** 끝까지 다 되었거나 아직 시작하지 않았거나 둘 중 하나로만 보이는 연산이다[^1]. `std::sync::atomic`에 `AtomicBool`, `AtomicI32`, `AtomicUsize`, `AtomicPtr<T>` 등이 있다. 모두 `Sync`라서 `&`로 여러 스레드가 함께 쓰고, `Arc`에 넣거나 `static`으로 둔다[^4].

| 연산 | 하는 일 | 돌려주는 것 |
|---|---|---|
| `load(o)` / `store(v, o)` | 읽기 / 쓰기 | 읽은 값 / 없음 |
| `swap(v, o)` | 쓰고 옛값을 받는다 | 옛값 |
| `fetch_add(v, o)` 등 | 읽고 바꾸고 쓰기를 한 번에 | 옛값. 넘치면 감긴다(panic 없음)[^1] |
| `compare_exchange(기대, 새값, 성공 o, 실패 o)` | 지금 값이 기대와 같을 때만 새값으로 바꾼다 | `Ok(옛값)` 또는 `Err(지금 값)` |
| `compare_exchange_weak(…)` | 같아도 가끔 실패할 수 있다. 반복문 안에서 쓴다 | 위와 같다[^1] |

**먼저 일어남(happens-before).** 메모리 모델은 연산 사이의 순서를 이 관계로 정한다. 같은 스레드 안에서는 코드에 적힌 순서대로 먼저 일어난다. 스레드 사이에서는 특별한 경우에만 생긴다. `spawn`과 `join`, `Mutex`의 풀기와 그다음 잠그기, 그리고 `Relaxed`가 아닌 원자적 연산이다[^2]. Rust의 원자 타입은 C++20 메모리 모델을 따른다(consume 순서는 없다)[^4].

기호로 쓰면 다음과 같다. $$a \to b$$는 "$$a$$가 $$b$$보다 먼저 일어난다"이다. $$\mathrm{sb}$$는 같은 스레드 안의 코드 순서(sequenced-before), $$\mathrm{sw}$$는 아래의 동기화 관계(synchronizes-with)다.

$$a \to b \iff (a, b) \in (\mathrm{sb} \cup \mathrm{sw})^{+}$$


$$^{+}$$는 "화살표를 한 번 이상 이어 붙인다"는 뜻이다. 즉 코드 순서와 동기화를 몇 번이고 이어서 $$a$$에서 $$b$$로 갈 수 있으면 $$a$$가 먼저다. 이것은 C++ 표준 정의를 단순하게 줄인 모양이다 [확인필요: C++20 표준 `intro.races`의 정확한 정의는 열어 보지 않았다. 위 식은 Mara Bos 3장의 설명을 따라 단순화한 것이다].

**Release와 Acquire의 동기화.** `Release`로 쓴 값을 `Acquire`로 읽은 순간, 그 쓰기와 읽기 사이에 먼저 일어남이 생긴다[^2]. 그래서 쓰기 스레드가 `Release` 쓰기 **앞에서** 한 모든 일은, 읽기 스레드가 `Acquire` 읽기 **뒤에서** 하는 모든 일보다 먼저 일어난 것이 된다.

| Ordering | 뜻(std 문서)[^3] | 어디에 쓸 수 있나 |
|---|---|---|
| `Relaxed` | 순서 제약이 없다. 원자성만 있다 | 모든 연산 |
| `Release` | 쓰기에 붙인다. 이 앞의 연산들이 이 값을 `Acquire`로 읽는 쪽보다 먼저가 된다 | 쓰기를 하는 연산 |
| `Acquire` | 읽기에 붙인다. 읽은 값이 `Release` 쓰기에서 왔다면, 이 뒤의 연산들이 그 쓰기보다 뒤가 된다 | 읽기를 하는 연산 |
| `AcqRel` | 읽기 부분은 `Acquire`, 쓰기 부분은 `Release` | 읽고 쓰는 연산(`fetch_add`, `swap`, `compare_exchange`) |
| `SeqCst` | `AcqRel`에 더해, 모든 스레드가 `SeqCst` 연산들을 같은 하나의 순서로 본다 | 모든 연산 |

`Relaxed`도 아무것도 보장하지 않는 것은 아니다. 한 변수에 대한 모든 고침은 모든 스레드가 같은 순서로 본다(변수별 전체 고침 순서)[^2]. 그래서 `fetch_add` 카운터는 `Relaxed`로도 정확하다. 보장하지 않는 것은 **서로 다른 변수 사이**의 순서다.

`load(Release)`나 `store(Acquire)`처럼 맞지 않는 짝은 실행하면 panic하는데, rustc가 컴파일할 때 `invalid_atomic_ordering`(기본이 deny)으로 막는다[^5].

```text
error: atomic loads cannot have `Release` or `AcqRel` ordering
```

## 증명

Mara Bos 4장의 가장 작은 스핀락이 상호 배제를 지키고, 앞 사람이 고친 값이 다음 사람에게 보인다는 것을 보인다[^6].

```rust
pub fn with<R>(&self, f: impl FnOnce(&mut T) -> R) -> R {
    while self.locked.swap(true, Ordering::Acquire) { std::hint::spin_loop(); } // (1)
    let r = f(unsafe { &mut *self.value.get() });                              // (2)
    self.locked.store(false, Ordering::Release);                                // (3)
    r
}
```

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

**상호 배제.** `locked`의 모든 고침은 하나의 전체 순서를 갖는다(변수별 전체 고침 순서, `Relaxed`에서도 맞다). `swap`은 읽고 쓰기를 한 번에 하는 원자적 연산이다. 그래서 그 순서에서 `false`를 읽고 `true`를 쓴 `swap`은, 그다음 `false`를 쓰는 (3)이 오기 전까지 하나뿐이다. 두 스레드가 동시에 (2)에 있을 수 없다.

**앞 사람의 고침이 보인다.** 스레드 A가 (2)에서 값을 고치고 (3)에서 `false`를 `Release`로 쓴다. 스레드 B의 (1)이 `Acquire`로 그 `false`를 읽어 빠져나온다. Release-Acquire 규칙에 따라 A의 (3) 앞의 모든 일, 곧 A의 (2)는 B의 (1) 뒤의 모든 일, 곧 B의 (2)보다 먼저 일어난다. 그래서 B는 A가 쓴 값을 본다.

**(1)이 `Relaxed`라면.** 상호 배제는 그대로다. 하지만 두 번째 단계의 먼저 일어남이 사라진다. B는 잠금을 얻고도 A가 고친 값 대신 옛값을 볼 수 있다. Mara Bos는 이렇게 `Relaxed`로 만든 스핀락으로 카운터를 돌렸더니 x86-64에서는 맞고, Apple M1에서는 약 0.4% 모자랐다고 보고한다[^7].

</details>


검증 코드는 4 스레드 × 50,000번을 이 스핀락으로 보통 `u64`에 더해 200,000을 얻었다. 이것은 증명을 거드는 실험이다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">증명의 "상호 배제" 단계는 왜 `Acquire`가 아니라 `swap`이 원자적이라는 데서 나오는가?</summary>

두 스레드가 동시에 `false`를 읽는 일을 막는 것은 읽기와 쓰기가 쪼개지지 않는다는 성질이다. 순서 꼬리표는 다른 변수(여기서는 `value`)가 언제 보이는지만 정한다. 그래서 `Relaxed`로 바꿔도 상호 배제는 남고, 데이터가 보이는 것만 깨진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`fetch_add` 카운터가 `Relaxed`로 충분한데 깃발은 왜 `Release`/`Acquire`가 필요한가?</summary>

카운터는 변수 하나만 본다. 한 변수의 고침 순서는 `Relaxed`에서도 모두가 같게 본다. 깃발은 "깃발이 섰다면 다른 변수 `DATA`도 준비됐다"는 두 변수 사이의 약속이다. 두 변수 사이의 순서는 `Relaxed`가 보장하지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는? 다른 어디에 쓸 수 있나?</summary>

"풀 때 `Release`, 잡을 때 `Acquire`"로 앞 사람의 임계 구역 전체를 뒷사람보다 먼저 일어나게 만든다. `Mutex`의 풀기·잠그기가 먼저 일어남을 만드는 이유도 같다[^2]. 한 번만 초기화하기, 참조 개수(`Arc`의 마지막 해제) 같은 곳에서도 같은 짝을 쓴다.

</details>


## 활용

- **실제 쓰임.** 통계·진행률 카운터(`Relaxed`), 멈춤 깃발(`Relaxed`로 충분한 경우가 많다. 깃발로 다른 데이터를 넘기지 않을 때), 일을 넘기는 깃발(`Release`/`Acquire`), 한 번만 정하기(`compare_exchange`), `static`으로 둔 전역 카운터[^1][^4]. `Arc`의 참조 개수, `Mutex`의 내부, 채널의 구현이 모두 원자적 연산 위에 서 있다.
- **고르는 법.** 대부분은 원자 타입을 직접 쓰지 않고 `Mutex`·채널·`OnceLock`을 쓴다. 직접 쓸 때 Mara Bos의 권고는 `SeqCst`가 실제로 필요한 경우는 거의 없고, `SeqCst`를 보면 오히려 더 의심해서 읽으라는 것이다[^2].
- **스핀락은 거의 쓰지 않는다.** 보통 `Mutex`는 기다리는 스레드를 재워 CPU를 아낀다. 스핀락은 아주 짧게 쥐고 다른 코어에서 동시에 돌 때만 지연을 줄일 수 있고, 그것도 직접 재 봐야 안다[^6].
- **이식성.** 모든 원자 타입이 모든 플랫폼에 있지는 않다. 32비트 PowerPC·MIPS에는 `AtomicU64`가 없다. `#[cfg(target_has_atomic = "64")]`로 가른다[^4]. 있는 원자 타입은 모두 잠금 없이(lock-free) 동작한다[^4].
- **성능.** x86-64에서는 모든 메모리 연산이 이미 acquire·release 의미를 갖는다. 그래서 `Acquire`/`Release`가 `Relaxed`보다 비싸지 않다. ARM64 같은 약한 순서 구조에서는 다르다[^7].
- **흔한 실수.**
  - `load` 다음 `store`로 "읽고 고치고 쓰기"를 짠다. `fetch_*`나 `compare_exchange` 반복문을 쓴다.
  - 깃발 하나에 `Relaxed`를 쓰고 데이터를 넘긴다. x86-64에서는 우연히 맞을 수 있어 테스트로 잡히지 않는다[^7].
  - "최적화를 끄면 순서가 바뀌지 않는다"고 믿는다. 최적화를 꺼도 모든 변형이 꺼지지 않는다[^2].
  - 데이터 경쟁 없이 순서만 틀린 코드는 안전한 Rust에서도 컴파일된다. 정의되지 않은 동작은 아니지만 결과가 틀린다. 원자 변수를 `unsafe` 코드의 근거로 쓸 때 순서가 틀리면 그때는 정의되지 않은 동작이 된다: [unsafe와 안전한 감싸기](/Hongs_Blog/studies/rust/unsafe-abstractions/).

## 연결

- 선수: [내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/), [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/), [Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/)
- 운영체제의 test-and-set, compare-and-swap 명령: [상호 배제의 하드웨어 지원](/Hongs_Blog/studies/operating-systems/hardware-mutual-exclusion/). Rust의 `swap`과 `compare_exchange`가 그 명령들과 같은 일을 한다.
- 왜 CPU마다 순서가 다르게 보이는가(코어마다 캐시가 있다): [캐시 메모리](/Hongs_Blog/studies/operating-systems/cache-memory/)
- 순서를 직접 다룰 일이 없게 해 주는 도구: [채널](/Hongs_Blog/studies/rust/channels/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"내 컴퓨터에서 테스트를 백만 번 돌려 통과했으니 Ordering은 맞다."</div>

틀렸다. 메모리 순서 버그는 기계와 컴파일러에 따라 나타나기도 하고 숨기도 한다. 그럴듯해 보이는 이유는, 보통 버그는 많이 돌릴수록 드러나기 때문이다. 하지만 x86-64는 모든 연산에 이미 acquire·release 의미가 있어 `Relaxed`를 잘못 쓴 코드가 "우연히" 맞게 돈다[^7]. Rust의 메모리 모델은 어떤 실제 CPU와도 같지 않다[^2]. 옳은지는 먼저 일어남 관계로 따져서 보인다. 이 문서의 검증 코드도 aarch64 Mac 한 대에서 돌린 실험일 뿐이다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"원자 변수만 쓰면 경쟁 조건이 없다."</div>

틀렸다. 각 연산이 원자적이라도 연산 둘 사이에는 다른 스레드가 끼어든다. 검증 코드의 따로 한 `load`/`store`는 매번 갱신 하나를 잃었다. 데이터 경쟁은 없지만 경쟁 조건은 있다[^8].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 출력을 예측하라. `let a = AtomicU8::new(254); println!("{} {} {}", a.fetch_add(1, Relaxed), a.fetch_add(1, Relaxed), a.load(Relaxed));`</summary>

**답:** `254 255 0`.<br>
**이유:** `fetch_add`는 옛값을 돌려준다. 255에 1을 더하면 `u8`이 넘쳐 0으로 감긴다. 원자적 연산은 넘쳐도 panic하지 않는다. 검증 코드의 실행 결과와 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `DATA.store(42, Relaxed); READY.store(true, Relaxed);`를 한 스레드가 하고, 다른 스레드가 `while !READY.load(Relaxed) {}` 뒤에 `DATA.load(Relaxed)`를 읽는다. 0을 읽을 수 있는가? 고치려면 어디를 바꾸나?</summary>

**답:** 읽을 수 있다. `READY`의 쓰기를 `Release`로, 읽기를 `Acquire`로 바꾼다. `DATA`는 `Relaxed` 그대로 둬도 된다.<br>
**이유:** `Relaxed`는 서로 다른 변수 사이의 순서를 보장하지 않는다. `Release` 쓰기를 `Acquire`로 읽으면 그 앞의 `DATA` 쓰기가 그 뒤의 `DATA` 읽기보다 먼저 일어난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 셋에 필요한 가장 약한 Ordering을 고르라. (가) 처리한 요청 수를 세는 카운터 (나) 워커가 결과를 `static` 버퍼에 쓴 뒤 세우는 "완료" 깃발 (다) 스핀락의 잠그기 `swap`</summary>

**답:** (가) `Relaxed`, (나) 쓰기 `Release` + 읽기 `Acquire`, (다) `Acquire`(풀기는 `Release`).<br>
**흔한 오답:** "(가)도 다른 스레드가 읽으니 `SeqCst`." 변수 하나의 고침 순서는 `Relaxed`에서도 모두가 같게 본다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "원자적 연산만 쓰면 결과가 항상 맞다"의 반례를 `AtomicUsize` 하나로 만들라.</summary>

**답:** 두 스레드가 `let v = c.load(Relaxed); c.store(v + 1, Relaxed);`를 한다. 둘 다 0을 읽은 뒤 쓰면 결과가 1이다. Ordering을 `SeqCst`로 올려도 같다. `c.fetch_add(1, Relaxed)`로 바꿔야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** 스핀락 증명에서 "B는 A가 쓴 값을 본다"는 단계는 어느 규칙에서 나오는가? 그 규칙이 쓰이려면 무엇이 필요한가?</summary>

**답:** Release-Acquire 동기화 규칙이다. B의 `Acquire` 읽기(`swap`)가 A의 `Release` 쓰기(`store(false)`)가 쓴 값을 읽어야 한다. 그러면 A의 임계 구역이 B의 임계 구역보다 먼저 일어난다.

</details>


[^1]: Mara Bos, Rust Atomics and Locks, 2장 Atomics (Atomic Load and Store Operations, Fetch-and-Modify Operations, Compare-and-Exchange Operations) — https://mara.nl/atomics/atomics.html
[^2]: Mara Bos, Rust Atomics and Locks, 3장 Memory Ordering (Reordering and Optimizations, Happens-Before Relationship, Relaxed Ordering, Release and Acquire Ordering, Sequentially Consistent Ordering, Common Misconceptions) — https://mara.nl/atomics/memory-ordering.html
[^3]: std 문서, `std::sync::atomic::Ordering` — https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html
[^4]: std 문서, `std::sync::atomic` 모듈 (Memory model for atomic accesses, Portability) — https://doc.rust-lang.org/std/sync/atomic/index.html
[^5]: The rustc book, Deny-by-default Lints, `invalid-atomic-ordering` — https://doc.rust-lang.org/rustc/lints/listing/deny-by-default.html
[^6]: Mara Bos, Rust Atomics and Locks, 4장 Building Our Own Spin Lock (A Minimal Implementation) — https://mara.nl/atomics/building-spinlock.html
[^7]: Mara Bos, Rust Atomics and Locks, 7장 Understanding the Processor (Memory Ordering, An Experiment, Summary) — https://mara.nl/atomics/hardware.html
[^8]: The Rustonomicon, Data Races and Race Conditions — https://doc.rust-lang.org/nomicon/races.html
{% endraw %}
