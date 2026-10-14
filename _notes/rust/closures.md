---
layout: "note"
title: "클로저"
display_title: "클로저 (Closures)"
kind: "concept"
kind_label: "정의"
num: "20"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Closures", "Closure", "Fn", "FnMut", "FnOnce", "move 클로저", "Move Closure", "잡기", "Capture", "캡처", "함수 포인터", "Function Pointer", "범위 스레드", "thread::scope", "async 클로저", "Async Closure", "AsyncFn", "AsyncFnMut", "AsyncFnOnce"]
description: "이름 없이 그 자리에서 만드는 작은 함수다. 보통 함수와 달리 만든 자리 둘레의 변수를 그대로 가져다 쓸 수 있어서, 정렬 기준이나 \"원소마다 할 일\"을 한 줄로 넘길 때 쓴다. 둘레 변수를 읽기만 하는지, 고치는지, 아예 가져가서 내보내는지에 따라 몇 번 부를 수 있는지가 정해지…"
prev_url: "/studies/rust/generics-vs-trait-objects/"
prev_title: "제네릭과 트레이트 객체 비교"
next_url: "/studies/rust/iterators/"
next_title: "반복자"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/closures/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

이름 없이 그 자리에서 만드는 작은 함수다. 보통 함수와 달리 만든 자리 둘레의 변수를 그대로 가져다 쓸 수 있어서, 정렬 기준이나 "원소마다 할 일"을 한 줄로 넘길 때 쓴다. 둘레 변수를 읽기만 하는지, 고치는지, 아예 가져가서 내보내는지에 따라 몇 번 부를 수 있는지가 정해지고, 컴파일러가 그것을 검사한다. 만든 함수보다 오래 살 수 있는 곳(따로 도는 실행 흐름인 스레드 등)에 넘길 때는 둘레 변수를 빌리지 말고 통째로 가져가게 해야 한다.

</div>


## 예시로 보기

숫자 목록을 10에서 가까운 순서로 늘어놓고 싶다. 정렬 함수에 "원소 하나를 받아 정렬 키를 돌려주는 함수"를 넘기면 된다. 그런데 기준값 10이 실행 중에 정해진다면? `fn`으로 만든 함수는 자기 몸통 밖의 지역 변수를 볼 수 없다. 기준값을 매개변수로 더 받으면 정렬 함수가 요구하는 모양(원소 하나 → 키 하나)과 어긋난다. 파이썬이라면 `sorted(v, key=lambda x: abs(x - origin))`처럼 람다를 쓸 자리다.

```rust
let origin: i32 = 10;
let mut near = vec![3, 14, 9, 12];
near.sort_by_key(|&x| (x - origin).abs());
// near == [9, 12, 14, 3]   (10까지의 거리 1, 2, 4, 7)
```

<code>&#124;&amp;x&#124; (x - origin).abs()</code>가 클로저다. 세로 막대 사이가 매개변수이고 그 뒤가 몸통이다. 몸통이 둘레의 `origin`을 쓰는 것을 "잡는다(capture)"고 부른다. `fn` 함수는 이렇게 둘레를 잡지 못한다[^1].

타입은 대개 적지 않는다. 컴파일러가 처음 부르는 모습을 보고 매개변수와 반환 타입을 정하고, 정한 타입은 굳는다. <code>let c = &#124;x&#124; x;</code>를 `String`으로 부른 뒤 `5`로 다시 부르면 `error[E0308]: mismatched types`다[^1].

### 잡는 방식 세 가지

컴파일러는 몸통이 잡은 값으로 무엇을 하는지 보고 잡는 방식을 고른다. 함수가 인자를 받는 세 방식, 빌려 읽기·빌려 고치기·가져가기와 같다[^1].

```rust
let name = String::from("kim");
let greet = || name.len();               // 읽기만 한다 → &name을 잡는다

let mut count = 0;
let mut inc = || { count += 1; count };  // 고친다 → &mut count를 잡는다

let owned = String::from("moved");
let give = move || owned;                // 잡은 값을 밖으로 내보낸다 → owned 자체를 가져간다
```

| 몸통이 하는 일 | 잡는 방식 | 구현하는 트레이트 | 부를 수 있는 횟수 |
|---|---|---|---|
| 읽기만 한다 | 빌림 `&T` | `Fn`, `FnMut`, `FnOnce` | 여러 번, 동시에도 |
| 고친다 | 가변 빌림 `&mut T` | `FnMut`, `FnOnce` | 여러 번, 한 번에 하나씩 |
| 잡은 값을 밖으로 내보낸다 | 가져가기 | `FnOnce`만 | 한 번 |

`greet`를 두 번 부른 뒤에도 `name`은 그대로 쓸 수 있다. `inc`를 세 번 부르면 `count`는 3이 된다. `give()`는 `owned`를 돌려주면서 클로저 안이 비므로 두 번 부를 수 없다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 정렬 결과, 세 잡는 방식, E0525·E0594·E0382·E0502·E0373·E0308, 2018 에디션과의 차이, 클로저 크기, 함수 포인터 변환, 클로저 돌려주기, async 클로저와 `AsyncFn`, clippy `redundant_closure`를 rustc 1.99로 컴파일하고 실행해 확인했다 — [20_closures_verify.rs](/Hongs_Blog/studies/rust/code/20_closures_verify/)</div>

</div>


## Fn·FnMut·FnOnce

클로저를 받는 함수는 이 세 트레이트로 "어떤 클로저를 받을지"를 적는다. 어느 트레이트를 구현하는지는 클로저가 잡은 값으로 무엇을 하느냐가 정한다[^2].

- 모든 클로저는 `FnOnce`다. 부를 수 있는 것은 적어도 한 번은 부를 수 있다.
- 잡은 값을 밖으로 내보내지 않으면 `FnMut`도 구현한다. 여러 번 부를 수 있다.
- 잡은 값을 고치지도 내보내지도 않으면 `Fn`도 구현한다. 여러 번, 여러 스레드에서 동시에 불러도 된다[^1].

받는 함수 쪽에서 보면 경계(트레이트 조건)가 곧 약속이다.

| 함수의 경계 | 함수 안에서 하는 일 | 받을 수 있는 클로저 | 예 |
|---|---|---|---|
| `F: FnOnce() -> T` | 한 번 부른다 | 모든 클로저 | `Option::unwrap_or_else` |
| `F: FnMut(&T) -> K` | 여러 번, 차례로 부른다 | `Fn`, `FnMut` 클로저 | `sort_by_key` |
| `F: Fn()` | 여러 번, 동시에도 부른다 | `Fn` 클로저만 | 여러 스레드가 함께 부르는 콜백 |

`sort_by_key`는 원소마다 한 번씩 키를 뽑으므로 `FnMut`을 받는다[^1]. 그래서 키를 뽑을 때마다 바깥의 `calls += 1`을 하는 클로저도 넘길 수 있다. `unwrap_or_else`는 값이 없을 때 한 번만 부르므로, 잡은 `String`을 꺼내 써 버리는 `FnOnce` 클로저도 받는다. 경계가 느슨할수록 받는 클로저가 많다.

컴파일러는 이 약속을 검사한다.

```rust
fn call_twice<F: Fn()>(f: F) { f(); f(); }

let mut n = 0;
let c = || n += 1;      // n을 고친다 → FnMut
call_twice(c);
```

```
error[E0525]: expected a closure that implements the `Fn` trait, but this closure only implements `FnMut`
```

컴파일러는 ``closure is `FnMut` because it mutates the variable `n` here``라고 원인 자리도 짚는다. 경계를 `F: FnMut()`로 바꾸고 매개변수를 `mut f`로 받으면 통과한다. 같은 클로저를 <code>call_twice(&#124;&#124; n += 1)</code>처럼 인자 자리에 바로 쓰면 오류가 달라진다. 이때는 경계를 보고 클로저를 처음부터 `Fn`으로 만들려다 몸통에서 막힌다: ``error[E0594]: cannot assign to `n`, as it is a captured variable in a `Fn` closure``.

`FnOnce`뿐인 클로저를 두 번 부르면 E0382다. 컴파일러가 이유를 함께 적는다.

```
error[E0382]: use of moved value: `f`
note: closure cannot be invoked more than once because it moves the variable `s` out of its environment
```

가변으로 잡은 클로저가 살아 있는 동안에는 그 변수를 읽지도 못한다. 클로저가 `&mut count`를 쥐고 있는 셈이기 때문이다. <code>let mut inc = &#124;&#124; count += 1; println!("{count}"); inc();</code>는 ``error[E0502]: cannot borrow `count` as immutable because it is also borrowed as mutable``이다. 클로저를 마지막으로 부른 뒤에 읽으면 된다([빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)).

## move와 스레드

`move`를 앞에 붙이면 몸통이 무엇을 하든 둘레 값을 클로저 안으로 가져간다. `Copy` 타입이면 복사해 간다[^1][^3]. 쓰는 곳은 대개 하나다. 클로저가 만든 함수보다 오래 살아야 할 때다[^3].

```rust
let v = vec![1];
let h = std::thread::spawn(|| v.len());   // move가 없다
```

```
error[E0373]: closure may outlive the current function, but it borrows `v`, which is owned by the current function
help: to force the closure to take ownership of `v` (and any other referenced variables), use the `move` keyword
```

새 스레드는 이 함수가 끝난 뒤에도 돌 수 있다. 함수가 끝나며 `v`를 버리면 스레드는 사라진 값을 읽게 된다. 그래서 <code>spawn(move &#124;&#124; v.len())</code>으로 `v`를 스레드에게 넘긴다[^1]. 스레드가 요구하는 조건(`Send`, `'static`)은 [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)에서 다룬다.

스레드가 함수 안에서 반드시 끝난다면 빌려도 된다. `thread::scope`(1.63부터)는 그 안에서 띄운 스레드를 범위가 끝나기 전에 모두 기다린다. 그래서 범위 스레드는 `'static`이 아닌 지역 값을 빌릴 수 있다[^4].

```rust
let words = ["a", "bb", "ccc"];
let total = thread::scope(|s| {
    let h = s.spawn(|| words.iter().map(|w| w.len()).sum::<usize>());
    h.join().unwrap()
});
// total == 6. words를 move 없이 빌렸다
```

## 2021 에디션부터는 필드만 잡는다

몸통이 `p.x`만 쓰면 2021 에디션부터는 `p` 전체가 아니라 `p.x`만 잡는다. 2018 에디션까지는 변수를 통째로 잡았다[^2].

```rust
let mut p = Point { x: 1, y: 2 };
let mut bump_x = || p.x += 1;   // p.x만 가변으로 빌린다
let y = &p.y;                   // p.y는 따로 빌려도 된다
bump_x();
```

이 코드는 2024 에디션에서 통과한다. 같은 코드를 2018 에디션으로 컴파일하면 클로저가 `p` 전체를 가변으로 빌린 것이 되어 ``error[E0502]: cannot borrow `p.y` as immutable because it is also borrowed as mutable``이다.

## 클로저의 속: 잡은 값을 담은 구조체

컴파일러는 클로저마다 이름 없는 타입을 하나씩 만든다. 그 타입은 잡은 값을 필드로 가진 구조체와 거의 같다[^2]. 그래서 클로저의 크기는 잡은 것의 크기다. 아래는 이 기계(aarch64, 포인터 8바이트)에서 `size_of_val`로 잰 값이다.

```
let big = [0u8; 100];

|| 1                 크기   0   [ ]                         잡은 것 없음
|| big.len()         크기   8   [ &big ] ──▶ 스택의 big       참조 하나
move || big.len()    크기 100   [ 0 0 0 … 0 ]  (100바이트)   배열을 복사해 들고 있다
```

이 모양에서 세 가지가 따라 나온다.

1. **클로저마다 타입이 다르다.** 몸통이 똑같아도 그렇다[^3]. 무언가 잡는 클로저 두 개를 한 `Vec`에 넣으면 `error[E0308]: mismatched types`와 함께 `note: no two closures, even if identical, have the same type`이 나온다. 여러 클로저를 한 그릇에 담으려면 `Vec<Box<dyn Fn() -> i32>>`처럼 [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/)로 감싼다.
2. **아무것도 잡지 않으면 함수 포인터가 된다.** 담을 필드가 없으니 보통 함수와 다를 게 없다. <code>let add = &#124;a: i32, b: i32&#124; a + b; let fp: fn(i32, i32) -&gt; i32 = add;</code>는 통과하고 `fp(5, 7)`은 12다[^2]. 무언가 잡은 클로저를 `fn` 타입으로 돌려주면 E0308이고, 컴파일러는 ``closures can only be coerced to `fn` types if they do not capture any variables``라고 알린다.
3. **`Clone`·`Copy`·`Send`·`Sync`는 잡은 값이 정한다.** 예를 들어 잡은 값이 모두 `Sync`면 클로저도 `Sync`다[^2]. `Rc`를 잡은 클로저가 `thread::spawn`에서 막히는 예는 [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)에 있다.

## 클로저를 받고 돌려주기

받는 법은 셋이다.

| 쓰는 법 | 예 | 성질 |
|---|---|---|
| 제네릭 경계 | `fn apply<F: Fn(i32) -> i32>(f: F)` | 넘긴 클로저 타입마다 함수를 따로 컴파일한다. 실행 비용이 더 들지 않는다[^8] |
| 트레이트 객체 | `fn apply(f: &dyn Fn(i32) -> i32)` | 함수는 하나다. 부를 때마다 표를 거쳐 찾아가고, 컴파일러가 인라인하지 못한다[^9] |
| 함수 포인터 | `fn apply(f: fn(i32) -> i32)` | 잡는 클로저는 못 받는다. 클로저가 없는 C 코드와 함수를 주고받을 때 쓴다[^5] |

함수 포인터는 세 `Fn` 트레이트를 모두 구현한다. 그래서 Rust Book은 클로저 트레이트를 경계로 한 제네릭 함수를 권한다. 그러면 함수와 클로저를 모두 받는다[^5]. 셋을 고르는 기준은 [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)에 있다.

돌려줄 때는 클로저 타입의 이름을 적을 수 없다. 그래서 반환 자리 `impl Fn`을 쓴다. 조건에 따라 서로 다른 클로저를 돌려줘야 하면 타입이 둘이 되므로 `Box<dyn Fn>`으로 감싼다[^5].

```rust
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n          // n을 가져가야 함수가 끝난 뒤에도 쓸 수 있다
}

fn make_op(name: &str) -> Box<dyn Fn(i32, i32) -> i32> {
    match name {
        "add" => Box::new(|a, b| a + b),
        _ => Box::new(|a, b| a * b),   // 갈래마다 클로저 타입이 달라 Box로 감싼다
    }
}
// make_adder(5)(1) == 6, make_op("add")(3, 4) == 7, make_op("mul")(3, 4) == 12
```

## async 클로저 (1.85)

<code>async &#124;n&#124; ...</code>처럼 `async`를 붙인 클로저는 부르면 바로 일하지 않는다. 대신 퓨처(future)를 돌려준다[^3]. 퓨처는 "나중에 `.await`로 끝까지 돌릴 계산"이다([Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/)).

```rust
let prefix = String::from("id-");
let tag = async |n: u32| format!("{prefix}{n}");
// block_on(async { (tag(1).await, tag(2).await) }) == ("id-1", "id-2")
```

1.85 전에는 "async 블록을 돌려주는 보통 클로저" <code>&#124;&#124; async { ... }</code>를 썼다. 이 모양에서는 돌려준 퓨처가 클로저가 잡은 값을 빌릴 수 없다[^6].

```rust
let s = String::from("a");
let c = move || async { s.len() };   // 퓨처가 클로저 안의 s를 빌리려 한다
```

```
error: lifetime may not live long enough
  = note: closure implements `Fn`, so references to captured variables can't escape the closure
```

<code>async move &#124;&#124; s.len()</code>으로 쓰면 통과하고, 같은 클로저를 두 번 불러 각각 `.await`할 수 있다. async 클로저가 돌려준 퓨처는 클로저 자신을 빌릴 수 있기 때문이다[^7].

받는 쪽 경계는 `AsyncFn`, `AsyncFnMut`, `AsyncFnOnce`다. 1.85부터 prelude(따로 `use`하지 않아도 보이는 이름 묶음)에 들어 있다[^6]. 셋 중 무엇을 구현하는지는 보통 클로저와 같은 방식, 즉 몸통이 잡은 값을 어떻게 쓰느냐로 정해진다[^2].

```rust
async fn apply_async<F: AsyncFn(u32) -> u32>(f: F) -> u32 {
    f(1).await + f(2).await
}
let factor = 10;
// block_on(apply_async(async |x: u32| x * factor)) == 30
```

## 활용

- **반복자와 Option.** `map`, `filter`, `sort_by_key`, `unwrap_or_else`가 모두 클로저를 받는다([반복자](/Hongs_Blog/studies/rust/iterators/), [Option과 Result](/Hongs_Blog/studies/rust/option-result/)). 필요할 때만 계산할 기본값은 <code>unwrap_or_else(&#124;&#124; ...)</code>로 넘긴다.
- **스레드와 태스크.** 새 스레드나 tokio 태스크에 넘기는 일은 `move` 클로저나 `async move` 블록으로 쓴다([스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/), [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)). 여러 스레드에 같은 값을 주려면 스레드마다 `clone`한 것(함께 쓸 거면 `Arc::clone`한 것)을 `move`로 넘긴다([Rc·Arc·Weak](/Hongs_Blog/studies/rust/rc-arc-weak/)).
- **콜백 목록.** 서로 다른 클로저를 필드에 모아 두려면 `Vec<Box<dyn Fn(i32) -> i32>>`처럼 상자에 넣는다. 다른 스레드와 함께 쓸 목록이면 `Box<dyn Fn(i32) -> i32 + Send + Sync>`로 적는다.
- **성능.** 제네릭으로 받은 클로저는 그 자리에 맞춰 컴파일되어 실행 비용이 더 들지 않는다[^8]. `Box<dyn Fn>`은 부를 때마다 표를 거쳐 찾아가며 인라인되지 않는다[^9]. 무언가 잡은 클로저를 상자에 담으면 힙 할당도 한 번 생긴다. 차이를 잰 결과는 [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)에 있다.
- **clippy.** 받은 인자를 함수에 그대로 넘기기만 하는 클로저 <code>.map(&#124;x&#124; double(x))</code>는 `redundant_closure`(기본으로 켜짐)가 `.map(double)`로 바꾸라고 알린다[^10].
- **흔한 실수.**
  - `thread::spawn`에 `move`를 빠뜨린다(E0373). 컴파일러 도움말대로 `move`를 붙인다.
  - `move`로 넘긴 값을 바깥에서 또 쓴다. 넘기기 전에 `clone`해서 복사본을 넘긴다.
  - 가변으로 잡은 클로저를 만들어 둔 채 그 변수를 읽는다(E0502). 클로저를 다 쓴 뒤 읽거나, 클로저를 짧은 블록 안에 가둔다.

## 연결

- 선수: [소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/)(가져가기), [빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)(빌려 읽기·빌려 고치기), [트레이트](/Hongs_Blog/studies/rust/traits/)(`Fn`·`FnMut`·`FnOnce`도 트레이트다)
- 클로저를 가장 많이 받는 곳: [반복자](/Hongs_Blog/studies/rust/iterators/)
- 받는 법 고르기: [제네릭과 트레이트 경계](/Hongs_Blog/studies/rust/generics-trait-bounds/), [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/), [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)
- 다른 스레드에 넘기기: [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/). 비동기: [Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`move`를 붙이면 그 클로저는 한 번만 부를 수 있다(`FnOnce`)"</div>

틀렸다. `move`는 "어떻게 잡나"만 바꾼다. 몇 번 부를 수 있는지는 "잡은 값으로 무엇을 하나"가 정한다[^2]. 값을 가져가는 것과 그 값을 써서 없애는 것을 같은 일로 보기 쉬워서 생기는 오해다. 가져간 값을 읽기만 하면 값은 클로저 안에 그대로 남아 있으니 몇 번이고 부를 수 있다. 확인하는 법: <code>let data = [1, 2, 3]; let sum = move &#124;&#124; data.iter().sum::&lt;i32&gt;() as usize;</code>를 `F: Fn() -> usize` 경계의 `call_twice`에 넘기면 통과하고 12를 돌려준다. <code>move &#124;&#124; owned</code>처럼 가져간 값을 밖으로 내보낼 때만 `FnOnce`뿐이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음은 컴파일되는가? 안 되면 오류 코드와 이유를 쓰고, 고치는 방법을 하나 들라.</summary>

```rust
fn call_twice<F: Fn()>(f: F) { f(); f(); }
fn g() { let mut n = 0; let c = || n += 1; call_twice(c); }
```
**답:** 안 된다. `` error[E0525]: expected a closure that implements the `Fn` trait, but this closure only implements `FnMut` ``.<br>
**이유:** 몸통이 잡은 `n`을 고치므로 클로저는 `FnMut`까지만 구현한다. `call_twice`는 고치지 않는 클로저(`Fn`)만 받는다고 약속했다. 경계를 `F: FnMut()`로 바꾸고 매개변수를 `mut f: F`로 받으면 통과한다.<br>
**흔한 오답:** "`move`를 붙이면 된다." `move`는 잡는 방식만 바꾼다. 몸통이 여전히 `n`을 고치므로 `Fn`이 되지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 출력을 예측하라.</summary>

```rust
let mut log = Vec::new();
let mut n = 1;
let mut step = |k: i32| { n *= k; log.push(n); };
step(2);
step(3);
step(4);
println!("n = {n}, log = {log:?}");
```
**답:** `n = 24, log = [2, 6, 24]`<br>
**이유:** `step`은 `n`과 `log`를 가변으로 빌려 잡는다. 부를 때마다 `n`에 `k`를 곱하고 그 값을 `log`에 붙인다: 1×2 = 2, 2×3 = 6, 6×4 = 24. `println!`은 `step`을 마지막으로 부른 뒤라 가변 빌림이 끝나서 `n`과 `log`를 읽을 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 세 함수가 받는 클로저에 `Fn`, `FnMut`, `FnOnce` 중 무엇을 요구하겠는가? (가) 값이 없을 때만 기본값을 한 번 만드는 함수 (나) 배열의 원소마다 정렬 키를 뽑는 함수 (다) 여러 스레드가 동시에 불러 요청을 검사하는 함수</summary>

**답:** (가) `FnOnce` (나) `FnMut` (다) `Fn`<br>
**이유:** (가)는 한 번만 부르므로 가장 느슨한 `FnOnce`면 충분하다. 그래야 잡은 값을 꺼내 쓰는 클로저도 받는다(`Option::unwrap_or_else`). (나)는 여러 번 차례로 부르니 `FnMut`이다(`sort_by_key`). (다)는 동시에 여러 번 부르므로 잡은 값을 고치는 클로저를 받으면 안 된다. `Fn`이 필요하고, 스레드 사이에 나눠 쓰려면 `Sync`도 붙는다.

</details>


[^1]: The Rust Programming Language, 13.1 Closures (Capturing the Environment, Inferring and Annotating Closure Types, Capturing References or Moving Ownership, Moving Captured Values Out of Closures) — https://doc.rust-lang.org/book/ch13-01-closures.html
[^2]: The Rust Reference, Closure types (Capture modes, Edition 2021 capture precision, Call traits and coercions, Other traits, Async closure traits) — https://doc.rust-lang.org/reference/types/closure.html
[^3]: The Rust Reference, Closure expressions (`move`, Async closures, "Each closure expression has a unique, anonymous type") — https://doc.rust-lang.org/reference/expressions/closure-expr.html
[^4]: std 문서, Function `std::thread::scope` — https://doc.rust-lang.org/std/thread/fn.scope.html
[^5]: The Rust Programming Language, 20.4 Advanced Functions and Closures (Function Pointers, Returning Closures) — https://doc.rust-lang.org/book/ch20-04-advanced-functions-and-closures.html
[^6]: Rust Blog, Announcing Rust 1.85.0 (Async closures) — https://blog.rust-lang.org/2025/02/20/Rust-1.85.0/
[^7]: std 문서, Trait `std::ops::AsyncFn` (`async_call`: "returning a future which may borrow from the called closure") — https://doc.rust-lang.org/std/ops/trait.AsyncFn.html
[^8]: The Rust Programming Language, 10.1 Generic Data Types (Performance of Code Using Generics) — https://doc.rust-lang.org/book/ch10-01-syntax.html
[^9]: The Rust Programming Language, 18.2 Using Trait Objects to Abstract over Shared Behavior (Trait Objects Perform Dynamic Dispatch) — https://doc.rust-lang.org/book/ch18-02-trait-objects.html
[^10]: Clippy Lints, `redundant_closure` — https://rust-lang.github.io/rust-clippy/master/index.html (rustc 1.99.0의 `clippy-driver`로 기본으로 경고하는 것을 확인했다)
{% endraw %}
