---
layout: "note"
title: "반복자"
display_title: "반복자 (Iterators)"
kind: "concept"
kind_label: "정의"
num: "21"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Iterators", "Iterator", "이터레이터", "next", "IntoIterator", "iter", "iter_mut", "into_iter", "어댑터", "Iterator Adapter", "소비 메서드", "Consuming Adapter", "collect", "FromIterator", "터보피시", "Turbofish", "게으른 계산", "Lazy Evaluation", "비용 없는 고수준 기능", "Zero-Cost Abstraction"]
description: "목록의 원소를 하나씩 꺼내 주는 장치다. \"다음 것 줘\"라는 요청 하나만 만들어 두면, 거르기·바꾸기·짝짓기 같은 수십 가지 일을 줄줄이 이어 붙여 쓸 수 있다. 이어 붙이기만 해서는 아무 일도 일어나지 않고, 마지막에 결과를 모으거나 더할 때 비로소 원소가 하나씩 끝까지 흘러간다…"
prev_url: "/studies/rust/closures/"
prev_title: "클로저"
next_url: "/studies/rust/standard-traits/"
next_title: "꼭 구현할 표준 트레이트"
math: false
mermaid: false
code_count: 2
code_files: [{"t": "21_iterators_bench.rs", "u": "/studies/rust/code/21_iterators_bench/", "r": "실험"}, {"t": "21_iterators_verify.rs", "u": "/studies/rust/code/21_iterators_verify/", "r": "검증"}]
permalink: "/studies/rust/iterators/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

목록의 원소를 하나씩 꺼내 주는 장치다. "다음 것 줘"라는 요청 하나만 만들어 두면, 거르기·바꾸기·짝짓기 같은 수십 가지 일을 줄줄이 이어 붙여 쓸 수 있다. 이어 붙이기만 해서는 아무 일도 일어나지 않고, 마지막에 결과를 모으거나 더할 때 비로소 원소가 하나씩 끝까지 흘러간다. 최적화를 켜고 빌드하면 손으로 짠 반복문과 거의 같은 속도가 나지만, 마지막 단계를 빼먹으면 아무 일도 하지 않은 채 지나간다.

</div>


## 예시로 보기

"짝수만 골라 제곱해서 더하기"를 `for` 문으로 쓰면 합을 담을 변수와 `if`가 필요하다. 할 일이 늘수록 반복문 안에 조건과 임시 변수가 쌓이고, 무엇을 하는 코드인지 읽기 어려워진다. 반복자로 쓰면 할 일이 한 줄에 하나씩 차례로 놓인다.

```rust
fn sum_for(v: &[u64]) -> u64 {
    let mut s = 0u64;
    for &x in v { if x % 2 == 0 { s = s.wrapping_add(x * x); } }
    s
}

fn sum_iter(v: &[u64]) -> u64 {
    v.iter()                          // 원소를 하나씩 빌려 준다
        .filter(|&&x| x % 2 == 0)     // 짝수만 통과시킨다
        .map(|&x| x * x)              // 제곱한다
        .fold(0u64, |a, b| a.wrapping_add(b))   // 0에서 시작해 차례로 더한다
}
```

`wrapping_add`는 `u64`를 넘으면 0부터 다시 도는 덧셈이다([값·변수·타입](/Hongs_Blog/studies/rust/values-variables-types/)). `iter()`가 원소의 참조 `&u64`를 내주고 `filter`는 그 참조를 또 빌려 클로저에 넘기므로, 패턴 `&&x`로 두 겹을 벗겨 숫자를 꺼낸다. 두 함수는 원소 천만 개에서 같은 값 1,661,670,000,000을 냈다. `filter`나 `map`처럼 반복자를 받아 새 반복자를 돌려주는 메서드를 어댑터(adapter)라고 부른다. `fold`, `sum`, `collect`처럼 원소를 끝까지 꺼내 쓰는 메서드는 반복자를 소비한다(consume)고 한다[^1].

### 하나씩 끝까지 흐른다

어댑터를 이어 붙이는 순간에는 아무 계산도 하지 않는다. 소비하는 메서드가 원소를 하나 달라고 할 때마다, 원소 하나가 사슬 전체를 지나간다.

```rust
let mut log = Vec::new();
let it = [1, 2, 3, 4].iter().map(|x| { log.push(format!("map {x}")); x * 10 });
let it = it.filter(|x| *x > 15);
let first: Vec<i32> = it.take(2).collect();
// first == [20, 30]
// log   == ["map 1", "map 2", "map 3"]
```

```
원소 1 ─map→ 10 ─filter→ 탈락
원소 2 ─map→ 20 ─filter→ 통과 ─take→ 1개째
원소 3 ─map→ 30 ─filter→ 통과 ─take→ 2개째, 다 찼다 → 멈춤
원소 4   (map조차 부르지 않았다)
```

반복자는 게으르다(lazy). 소비하는 메서드를 부르기 전에는 아무 효과가 없다[^1]. 그래서 끝이 없는 반복자도 쓸 수 있다. <code>(1u64..).map(&#124;n&#124; n * n).take(5)</code>를 모으면 `[1, 4, 9, 16, 25]`다. `1..`은 끝없이 세지만 `take(5)`가 다섯 개에서 끊는다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 두 함수의 결과, 실행 기록 순서, 쓰지 않은 `map` 경고, 직접 만든 `Counter`, `collect` 결과 여섯 가지, `Result`로 모을 때 멈추는 위치, `iter`·`iter_mut`·`into_iter`의 원소 타입, 배열 `into_iter`의 2018·2024 차이, clippy `needless_range_loop`, 카드 C1·C3 — [21_iterators_verify.rs](/Hongs_Blog/studies/rust/code/21_iterators_verify/). 시간 측정 — [21_iterators_bench.rs](/Hongs_Blog/studies/rust/code/21_iterators_bench/)</div>

</div>


## Iterator 트레이트: next 하나

모든 반복자는 표준 라이브러리의 `Iterator` 트레이트를 구현한다. 구현하는 쪽이 채울 것은 `next` 하나뿐이다. `next`는 원소가 남았으면 `Some(원소)`를, 다 떨어졌으면 `None`을 돌려준다[^1].

```rust
trait Iterator {
    type Item;                                  // 내주는 원소의 타입
    fn next(&mut self) -> Option<Self::Item>;   // 다음 원소, 없으면 None
    // map, filter, zip, sum, collect … 는 모두 기본 메서드다
}
```

`next`가 `&mut self`를 받는 것은 꺼낼 때마다 "어디까지 꺼냈나"가 바뀌기 때문이다. 1부터 `max`까지 세는 반복자를 직접 만들어 본다.

```rust
struct Counter { n: u32, max: u32 }

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.n < self.max { self.n += 1; Some(self.n) } else { None }
    }
}

let total: u32 = Counter { n: 0, max: 5 }
    .zip(Counter { n: 0, max: 5 }.skip(1))   // (1,2) (2,3) (3,4) (4,5)
    .map(|(a, b)| a * b)                     // 2, 6, 12, 20
    .filter(|x| x % 3 == 0)                  // 6, 12
    .sum();                                  // 18
```

`next` 하나만 만들었는데 `zip`, `skip`, `map`, `filter`, `sum`을 쓸 수 있다. 모두 `Iterator`의 기본 메서드라서다([트레이트](/Hongs_Blog/studies/rust/traits/)).

자주 쓰는 메서드는 이렇다.

| 어댑터 (새 반복자, 게으르다) | 하는 일 | 소비 메서드 (끝까지 꺼낸다) | 하는 일 |
|---|---|---|---|
| `map(f)` | 원소마다 `f`를 적용 | `collect()` | 그릇에 모은다 |
| `filter(p)` | 조건을 지키는 것만 | `sum()`, `count()` | 더한다, 센다 |
| `take(n)`, `skip(n)` | 앞 n개만, 앞 n개를 건너뛰고 | `fold(init, f)` | 누적값을 차례로 만든다 |
| `take_while(p)` | 조건이 처음 깨질 때까지 | `last()`, `nth(k)` | 마지막, k번째 |
| `zip(other)`, `enumerate()` | 짝짓기, 번호 붙이기 | `for_each(f)` | 원소마다 `f`를 부른다 |
| `rev()`, `copied()`, `inspect(f)` | 거꾸로, `&T`를 `T`로, 엿보기 | `for x in it` | `for` 문도 소비한다 |

### 쓰지 않은 반복자는 경고가 난다

```rust
v.iter().map(|x| x + 1);    // 사슬을 만들기만 하고 버렸다
```

```
warning: unused `Map` that must be used
  = note: iterators are lazy and do nothing unless consumed
```

`map` 안에 `println!`을 넣어도 아무것도 찍히지 않는다. 원소마다 무언가를 하는 게 목적이면 `for` 문이나 `for_each`를 쓴다[^2].

## iter, iter_mut, into_iter

컬렉션에서 반복자를 얻는 메서드는 셋이다. 원소를 어떤 모양으로 내주느냐가 다르다[^2][^1].

| 메서드 | 내주는 원소 | 원래 컬렉션 | 같은 뜻의 `for` 문 |
|---|---|---|---|
| `v.iter()` | `&T` (빌림) | 그대로 남는다 | `for x in &v` |
| `v.iter_mut()` | `&mut T` (가변 빌림) | 고쳐진 채 남는다 | `for x in &mut v` |
| `v.into_iter()` | `T` (값) | 반복자가 가져가 더는 못 쓴다 | `for x in v` |

`Vec<String>`에서 `iter()`가 내주는 원소의 타입은 `&alloc::string::String`이고, `into_iter()`는 `alloc::string::String`이다(`std::any::type_name`으로 찍은 이름). `iter_mut()`으로 돌며 `n.push('!')`를 하면 `["a", "b"]`가 `["a!", "b!"]`로 바뀐다.

`for` 문은 이 표를 그대로 쓴다. `for x in values`는 컴파일러가 `IntoIterator::into_iter(values)`를 부르고 `None`이 나올 때까지 `next`를 부르는 반복문으로 바꿔 쓴 것이다[^2]. `&v`에 대한 `into_iter`가 `v.iter()`와 같은 반복자를 주므로 `for x in &v`는 빌려서 돈다. clippy의 `explicit_iter_loop`가 `for x in v.iter()`를 `for x in &v`로 쓰라고 권하는 것도 둘이 같기 때문이다[^5].

### 배열의 into_iter (2021 에디션부터)

배열 `[1u8, 2]`에 `.into_iter()`를 부르면 2021 에디션부터 값(`u8`)을 내준다. 그 전 에디션에서는 같은 코드가 `(&array).into_iter()`로 풀려 참조(`&u8`)를 내줬다[^4]. 배열이 `IntoIterator`를 구현한 것은 1.53부터인데, 옛 코드가 깨지지 않도록 2015·2018 에디션에서는 `.into_iter()` 메서드 호출 모양만 옛 뜻으로 남겨 두었다[^4].

```rust
let a = [1u8, 2];
let x: u8 = a.into_iter().next().unwrap();
// 2024 에디션: 통과
// 2018 에디션: error[E0308]: mismatched types  (expected `u8`, found `&u8`)
```

옛 블로그 글의 배열 예제가 지금 에디션에서 다르게 동작하는 이유다. 빌려서 돌고 싶으면 에디션과 상관없이 `a.iter()`를 쓴다[^4].

## collect: 받을 타입이 결과를 정한다

`collect`는 반복자를 가져가 원하는 그릇을 만든다. 반복자는 결과 그릇을 모른다. 무엇을 만들지는 `collect`가 돌려줄 타입, 즉 변수에 적은 타입이나 `collect::<Vec<_>>()`처럼 메서드 뒤에 적은 타입이 정한다[^3]. 메서드 뒤의 `::<>`는 생김새 때문에 터보피시(turbofish)라고 부른다[^3].

같은 단어 목록 `["apple", "bob", "apple", "cat"]`을 여러 그릇에 모아 본다.

| 받을 타입 | 코드 | 결과 |
|---|---|---|
| `Vec<&str>` | `words.iter().filter(\|w\| w.len() > 3).copied().collect()` | `["apple", "apple"]` |
| `String` | `words.iter().map(\|w\| w.chars().next().unwrap()).collect()` | `"abac"` |
| `HashSet<&str>` | `words.iter().copied().collect()` | 원소 3개 |
| `BTreeMap<&str, usize>` | 단어 빈도 `(단어, 횟수)` 쌍을 `collect()` | `{"apple": 2, "bob": 1, "cat": 1}` |
| `Result<Vec<i32>, _>` | `["1", "2", "3"].iter().map(\|s\| s.parse::<i32>()).collect()` | `Ok([1, 2, 3])` |
| `Option<Vec<u32>>` | `["7", "8"].iter().map(\|s\| s.parse().ok()).collect()` | `Some([7, 8])` |

`Result`로 모을 때는 원소를 차례로 꺼내다가 `Err`가 나오면 거기서 더 꺼내지 않고 그 `Err`를 돌려준다. `Err`가 하나도 없으면 값들을 담은 그릇을 `Ok`로 돌려준다[^6]. `["1", "x", "3", "y"]`를 `inspect`로 세면서 모으면 두 원소만 보고 멈춘다. `"x"`에서 실패했기 때문이다. 입력 목록을 검사해 하나라도 틀리면 첫 에러를 알리는 코드가 이 한 줄이다.

## 반복자는 느리지 않다

Rust Book은 반복자를 "쓴다고 실행 비용이 더 들지 않는" 고수준 기능(zero-cost abstraction, [Rust가 푸는 문제](/Hongs_Blog/studies/rust/why-rust/))의 하나로 든다[^7]. 많은 경우 반복자 코드는 손으로 쓴 반복문과 같은 기계어로 번역되고, 반복문 펼치기나 배열 범위 검사 없애기 같은 최적화가 똑같이 적용된다고 적는다[^7]. Book이 직접 잰 예(긴 소설에서 단어 찾기)도 두 방식의 차이가 약 2%였다[^7].

이 기계에서도 재 보았다. 원소 천만 개, `rustc -C opt-level=3`, 9번 잰 것 중 가장 짧은 시간(µs)이다. 측정 프로그램을 네 번 돌려 나온 값의 범위를 적는다.

| 계산 | 번호로 읽는 `for` (`v[i]`) | 참조로 도는 `for` (`for &x in v`) | 반복자 사슬 |
|---|---|---|---|
| 짝수 제곱 합 | 1,984~2,201 | 1,975~2,000 | 1,969~1,990 (`filter`·`map`·`fold`) |
| 두 `f32` 배열의 내적 | 6,740~7,266 | — | 6,751~7,268 (`zip`·`map`·`sum`) |

<div class="callout callout-note" markdown="1">
<div class="callout-title" markdown="span">이 숫자를 읽는 법</div>

이 기계(aarch64 macOS, Apple M3, rustc 1.99.0)에서 이 두 계산을 잰 값이다. 기계, 컴파일러 버전, 데이터 크기가 바뀌면 숫자도 바뀐다. 여기서 볼 것은 "세 방식이 서로 몇 % 안에 붙어 있다"는 모양 하나다. 모든 반복자 사슬이 늘 손으로 쓴 반복문만큼 빠르다는 약속이 아니다. 최적화를 끈 dev 빌드의 숫자로는 비교하지 않는다([성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)).

</div>


## 활용

- **입력 한꺼번에 검사하기.** 요청에 든 문자열 ID 목록을 <code>ids.iter().map(&#124;s&#124; s.parse::&lt;u32&gt;()).collect::&lt;Result&lt;Vec&lt;_&gt;, _&gt;&gt;()?</code>로 바꾸면, 하나라도 틀릴 때 첫 에러가 `?`로 위로 올라간다([물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)).
- **중간 그릇 없이 넘기기.** 함수가 `Vec`을 만들어 돌려주는 대신 `-> impl Iterator<Item = T>`를 돌려주면, 부르는 쪽이 필요한 만큼만 꺼내 쓰고 중간 `Vec`을 만들 필요가 없다([트레이트](/Hongs_Blog/studies/rust/traits/)의 반환 자리 `impl Trait`). 사슬 중간에 `collect`했다가 바로 다시 `iter()`를 부르면 쓸데없는 `Vec`이 하나 생긴다([성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)). clippy의 `needless_collect`가 이런 곳을 찾지만 nursery 묶음이라 기본으로는 꺼져 있다[^5].
- **세기와 묶기.** 빈도표는 `fold`와 `HashMap::entry`로 만든다([컬렉션](/Hongs_Blog/studies/rust/collections/)). 결과 순서가 드러나야 하면 `BTreeMap`으로 `collect`한다.
- **clippy.** `for i in 0..v.len() { t += v[i]; }`처럼 번호를 원소 읽기에만 쓰면 `needless_range_loop`(기본으로 켜짐)가 `` the loop variable `i` is only used to index `v` ``라고 알린다[^5]. `for x in &v`나 `v.iter().enumerate()`로 바꾼다.
- **흔한 실수.**
  - 부수 효과를 `map` 안에 넣고 소비하지 않는다. 경고를 무시하면 코드가 아예 돌지 않는다.
  - `into_iter()`로 돈 뒤에 원래 `Vec`을 다시 쓰려 한다. 반복자가 이미 가져갔다. 다시 쓸 거면 `iter()`나 `&v`로 돈다.
  - `take_while`과 `filter`를 헷갈린다. `take_while`은 조건이 처음 깨지는 순간 끝나고, `filter`는 끝까지 보며 고른다. 끝이 없는 반복자에 `filter`만 걸고 `sum`이나 `collect`로 소비하면 끝나지 않는다.

## 연결

- 선수: [컬렉션](/Hongs_Blog/studies/rust/collections/)(반복자를 내주는 그릇), [트레이트](/Hongs_Blog/studies/rust/traits/)(연관 타입 `Item`, 기본 메서드), [클로저](/Hongs_Blog/studies/rust/closures/)(어댑터가 받는 인자)
- `for` 문의 정체: [표현식과 제어 흐름](/Hongs_Blog/studies/rust/expressions-control-flow/)
- `Option`도 원소가 0개나 1개인 목록처럼 `map`·`filter`를 가진다: [Option과 Result](/Hongs_Blog/studies/rust/option-result/)
- 직접 만든 반복자를 써 보는 문제: [트레이트와 반복자 연습](/Hongs_Blog/studies/rust/traits-iterators-practice/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"반복자 사슬은 단계마다 중간 목록을 만든다"</div>

틀렸다. `map`, `filter`, `take`를 이어 붙여도 중간 목록은 생기지 않는다. 원소 하나가 사슬 끝까지 간 뒤에 다음 원소가 출발한다. 파이썬에서 리스트 컴프리헨션을 여러 번 겹쳐 쓰면 단계마다 리스트가 생기니, 같은 모양일 거라 짐작하기 쉽다. 확인하는 법: `[1, 2, 3, 4].iter().map(...).filter(...).take(2)`의 `map` 안에서 기록을 남기면 `["map 1", "map 2", "map 3"]`만 남는다. 단계마다 목록을 만들었다면 `map 4`까지 먼저 찍혔어야 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 출력을 예측하라.</summary>

```rust
let out: Vec<(usize, char)> = "rust"
    .chars()
    .rev()
    .enumerate()
    .filter(|(i, _)| i % 2 == 0)
    .collect();
println!("{out:?}");
```
**답:** `[(0, 't'), (2, 'u')]`<br>
**이유:** `rev`로 `t s u r` 순서가 된다. `enumerate`는 그 순서대로 0, 1, 2, 3을 붙인다. 번호가 짝수인 `(0, 't')`와 `(2, 'u')`만 남는다.<br>
**흔한 오답:** `[(0, 'r'), (2, 's')]`. `enumerate`가 `rev` 뒤에 있으므로 번호는 뒤집힌 순서로 붙는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** <code>let v = vec![1, 2, 3]; v.iter().map(&#124;x&#124; println!("{x}"));</code>는 컴파일은 되지만 아무것도 찍지 않는다. 왜인가? 원래 뜻대로 고쳐라.</summary>

**답:** 반복자는 게으르다. `map`은 "원소마다 이 클로저를 부를 반복자"를 만들 뿐, `next`를 부르는 소비 메서드가 없으면 클로저를 한 번도 부르지 않는다. 컴파일러도 ``unused `Map` that must be used``와 `iterators are lazy and do nothing unless consumed`로 경고한다. `for x in &v { println!("{x}"); }`나 <code>v.iter().for_each(&#124;x&#124; println!("{x}"));</code>로 고친다.<br>
**흔한 오답:** "`collect()`를 붙인다." 찍히기는 하지만, 쓰지도 않을 `Vec<()>`을 만든다. 부수 효과가 목적이면 `for`나 `for_each`가 맞다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음에서 `seen`은 얼마이고, `r`은 `Ok`인가 `Err`인가?</summary>

```rust
let mut seen = 0;
let r: Result<Vec<i32>, std::num::ParseIntError> = ["1", "x", "3", "y"]
    .iter()
    .inspect(|_| seen += 1)
    .map(|s| s.parse::<i32>())
    .collect();
```
**답:** `seen == 2`, `r`은 `Err`(`"x"`를 숫자로 바꾸지 못한 에러)다.<br>
**이유:** `Result`로 모으는 `collect`는 `Err`를 만나면 더 꺼내지 않는다. `"1"`과 `"x"`까지 두 원소만 사슬을 지났다. 게으른 사슬이라 `inspect`도 꺼낸 원소에 대해서만 불린다.<br>
**흔한 오답:** `seen == 4`. 사슬이 단계마다 목록을 다 만든다고 생각하면 그렇게 답하게 된다.

</details>


[^1]: The Rust Programming Language, 13.2 Processing a Series of Items with Iterators (The `Iterator` Trait and the `next` Method, Methods That Consume the Iterator, Methods That Produce Other Iterators) — https://doc.rust-lang.org/book/ch13-02-iterators.html
[^2]: std 문서, Module `std::iter` (for loops and IntoIterator, The three forms of iteration, Laziness, Infinity, Adapters) — https://doc.rust-lang.org/std/iter/index.html
[^3]: std 문서, Trait `std::iter::Iterator`, `collect` — https://doc.rust-lang.org/std/iter/trait.Iterator.html
[^4]: Rust Edition Guide, Rust 2021: IntoIterator for arrays — https://doc.rust-lang.org/edition-guide/rust-2021/IntoIterator-for-arrays.html
[^5]: Clippy Lints, `needless_range_loop`(style), `needless_collect`(nursery), `explicit_iter_loop` — https://rust-lang.github.io/rust-clippy/master/index.html (`needless_range_loop`가 기본으로 경고하는 것은 rustc 1.99.0의 `clippy-driver`로 확인했다)
[^6]: std 문서, Enum `std::result::Result`, `impl FromIterator<Result<A, E>> for Result<V, E>` — https://doc.rust-lang.org/std/result/enum.Result.html
[^7]: The Rust Programming Language, 13.4 Comparing Performance: Loops vs. Iterators — https://doc.rust-lang.org/book/ch13-04-performance.html
{% endraw %}
