---
layout: "note"
title: "Rust 첫걸음 연습"
display_title: "Rust 첫걸음 연습"
kind: "practice"
kind_label: "연습"
num: "04"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
description: "1단원의 세 가지, 정수 넘침, 값을 내는 match, 값을 내는 loop와 레이블 블록을 손으로 써 보는 네 문제다. 각 문제의 코드를 직접 cargo new로 만든 패키지의 src/main.rs에 옮겨 cargo run으로 돌려 본다."
next_url: "/studies/rust/borrow-errors-ladder/"
next_title: "빌림 오류 고치기 예제 사다리"
math: true
mermaid: false
code_count: 4
permalink: "/studies/rust/rust-basics-practice/"
---
{% raw %}
1단원의 세 가지, 정수 넘침, 값을 내는 `match`, 값을 내는 `loop`와 레이블 블록을 손으로 써 보는 네 문제다. 각 문제의 코드를 직접 `cargo new`로 만든 패키지의 `src/main.rs`에 옮겨 `cargo run`으로 돌려 본다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답과 변형 문제를 코드로 확인했다. p1은 `u8` 65,536쌍 전부, p4는 합 1~120에서 브루트포스와 비교했다 — [p1](/Hongs_Blog/studies/rust/code/04_rust-basics-practice_p1/) · [p2](/Hongs_Blog/studies/rust/code/04_rust-basics-practice_p2/) · [p3](/Hongs_Blog/studies/rust/code/04_rust-basics-practice_p3/) · [p4](/Hongs_Blog/studies/rust/code/04_rust-basics-practice_p4/)</div>

</div>


## p1 · 두 u8의 평균

다음 함수는 밝기 값 두 개(`u8`)의 평균을 구한다.

```rust
fn average(a: u8, b: u8) -> u8 {
    (a + b) / 2
}
```

- (가) `average(100, 50)`과 `average(200, 100)`을 `cargo run`(dev)에서 부르면 각각 어떻게 되는가?
- (나) 같은 코드를 `cargo run --release`로 돌리면 `average(200, 100)`은 무엇을 돌려주는가?
- (다) 모든 `u8` 쌍에서 넘치지 않고 올바른 평균(소수점 버림)을 돌려주도록 고쳐라. 두 가지 방법을 써 보라.

사용 개념: [값·변수·타입](/Hongs_Blog/studies/rust/values-variables-types/)의 정수 넘침과 `From`, [cargo와 패키지 구조](/Hongs_Blog/studies/rust/cargo-packages/)의 프로필.

풀이 전략: 넘침은 "중간 결과"에서 생긴다. 최종 답은 `u8`에 들어가도 `a + b`가 255를 넘을 수 있다. 중간 결과를 담을 칸을 넓히거나, 중간 결과가 커지지 않게 계산 순서를 바꾼다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 중간 결과 보기:* $$100 + 50 = 150$$은 `u8`에 들어가므로 75를 돌려준다. $$200 + 100 = 300$$은 255를 넘어 dev 빌드에서 panic `attempt to add with overflow`다.
2. *(나) 감기 계산:* release는 넘침 검사가 꺼져 있다. $$300 \bmod 256 = 44$$, $$44 / 2 = 22$$를 돌려준다. panic보다 나쁘다. 틀린 값이 조용히 나간다.
3. *(다) 넓혀서 더하기:* `u16`으로 바꿔 더하면 최대 $$255 + 255 = 510$$이라 넘치지 않는다.

```rust
fn average_widen(a: u8, b: u8) -> u8 {
    let sum = u16::from(a) + u16::from(b);
    u8::try_from(sum / 2).expect("두 u8의 평균은 u8 범위 안이다")
}
```

{: start="4"}
4. *(다) 넓히지 않고 반씩:* 각각 2로 나눈 몫을 더하고, 둘 다 홀수면 버려진 0.5 두 개를 합쳐 1을 더한다.

```rust
fn average_halves(a: u8, b: u8) -> u8 {
    a / 2 + b / 2 + ((a % 2) & (b % 2))
}
```

`average(200, 100)`은 두 방법 모두 150, `average(255, 255)`는 255, `average(3, 5)`는 4다.

</details>


**변형.** `as`로 고친 `((a as u16 + b as u16) / 2) as u8`도 답은 맞다. 그런데 clippy pedantic을 켜면 마지막 `as u8`에 어떤 린트가 걸리고, `try_from` 판은 왜 그 걱정이 없는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`cast_possible_truncation`이 걸린다. `u16`을 `u8`로 `as` 하면 잘릴 수 있기 때문이다. 함께 `cast_lossless`(넓히는 `as`는 `u16::from`으로 쓰라)와 `manual_midpoint`(표준 라이브러리의 `a.midpoint(b)`를 쓰라)도 걸린다. `u8::midpoint`는 65,536쌍 모두에서 위 두 풀이와 같은 값을 냈다. 이 경우 평균은 255를 넘지 않아 실제로는 잘리지 않지만, 린트는 그 사실을 모른다. `u8::try_from`은 잘릴 상황이면 `Err`를 돌려주므로, "절대 안 잘린다"는 생각이 틀렸을 때 조용한 오답 대신 `expect`의 메시지와 함께 멈춘다.

</details>


## p2 · match 하나로 쓰는 FizzBuzz

1부터 `n`까지에 대해, 3의 배수면 `Fizz`, 5의 배수면 `Buzz`, 둘 다면 `FizzBuzz`, 아니면 수 자체를 돌려주는 함수 `fn fizzbuzz(n: u32) -> String`을 `if`를 쓰지 않고 `match` 하나로 써라. 1부터 15까지의 출력은 다음과 같아야 한다.

```
1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz
```

사용 개념: [표현식과 제어 흐름](/Hongs_Blog/studies/rust/expressions-control-flow/)의 `match`와 갈래 순서.

풀이 전략: 두 가지 조건을 한꺼번에 보려면 두 값을 튜플 `(n % 3, n % 5)`로 묶어 `match`한다. 갈래는 위에서부터 맞춰 보므로 가장 좁은 경우를 맨 위에 둔다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *두 조건 묶기:* 나머지 두 개를 튜플로 만들면 네 경우가 패턴 네 개가 된다.
2. *좁은 것부터:* `(0, 0)`이 `(0, _)`보다 좁으므로 먼저 둔다.

```rust
fn fizzbuzz(n: u32) -> String {
    match (n % 3, n % 5) {
        (0, 0) => "FizzBuzz".to_string(),
        (0, _) => "Fizz".to_string(),
        (_, 0) => "Buzz".to_string(),
        _ => n.to_string(),
    }
}
```

{: start="3"}
3. *함수의 값:* `match` 전체가 꼬리 표현식이라 `return`이 필요 없다. 1부터 100까지 돌리면 `FizzBuzz` 6개, `Fizz` 27개, `Buzz` 14개가 나온다. 3의 배수 33개 중 15의 배수 6개를 빼면 27개다.

</details>


**변형.** `(0, 0)` 갈래를 맨 아래(`_` 바로 위)로 옮기면 컴파일되는가? 15는 무엇이 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

컴파일은 된다. 하지만 `warning: unreachable pattern`과 함께 "no value can reach this"가 나온다. `(0, 0)`인 값은 위의 `(0, _)`에 먼저 걸리기 때문이다. 15는 `Fizz`가 된다. 경고를 그냥 넘기면 안 되는 이유다. CI에서는 `-D warnings`로 경고를 오류로 바꿔 막는다.

</details>


## p3 · 콜라츠 단계 수

양의 정수 `n`이 짝수면 2로 나누고, 홀수면 $$3n + 1$$로 바꾼다. 1이 될 때까지 몇 번 바꾸는지 세는 함수 `fn collatz_steps(n: u32) -> Option<u32>`를 써라.

- `loop`의 `break 값`으로 결과를 돌려준다.
- `n = 0`이면 영원히 0이므로 `None`을 돌려준다.
- 중간에 $$3n + 1$$이 `u32`를 넘으면 panic 대신 `None`을 돌려준다.

예: `collatz_steps(1) = Some(0)`, `collatz_steps(6) = Some(8)`, `collatz_steps(27) = Some(111)`.

사용 개념: [표현식과 제어 흐름](/Hongs_Blog/studies/rust/expressions-control-flow/)의 `loop`와 `break 값`, [값·변수·타입](/Hongs_Blog/studies/rust/values-variables-types/)의 `checked_*` 메서드.

풀이 전략: 끝나는 조건이 둘(1에 닿음, 넘침)이므로 `while`보다 `loop`가 맞다. 넘칠 수 있는 계산을 `checked_mul`과 `checked_add`로 바꾸고, `None`이 나오면 그 자리에서 `break None`한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *특수한 입력 걸러내기:* `n == 0`이면 바로 `None`.
2. *끝나는 조건 두 개:* 1에 닿으면 `break Some(steps)`, 넘치면 `break None`.
3. *넘칠 수 있는 계산 바꾸기:* `n * 3 + 1`을 <code>n.checked_mul(3).and_then(&#124;m&#124; m.checked_add(1))</code>로 쓴다. 둘 중 하나라도 넘치면 `None`이 된다.

```rust
fn collatz_steps(n: u32) -> Option<u32> {
    if n == 0 {
        return None;
    }
    let mut n = n;
    let mut steps = 0;
    loop {
        if n == 1 {
            break Some(steps);
        }
        n = if n.is_multiple_of(2) {
            n / 2
        } else {
            match n.checked_mul(3).and_then(|m| m.checked_add(1)) {
                Some(next) => next,
                None => break None,
            }
        };
        steps += 1;
    }
}
```

{: start="4"}
4. *따라가 보기:* 6은 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1로 8번 바꾼다. `u32::MAX`는 홀수라 첫 $$3n + 1$$에서 넘쳐 `None`이다.

`n % 2 == 0` 대신 `n.is_multiple_of(2)`를 쓴 것은 rustc 1.99.0의 clippy가 부호 없는 정수의 `n % 2 == 0`을 `manual_is_multiple_of` 경고로 짚기 때문이다.

</details>


**변형.** 1 이상 10000 미만에서 단계 수가 가장 큰 수와 그 단계 수는? 이 범위에서 `None`이 나오는 수가 있는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

6171이고 261단계다. 이 범위에서는 중간값이 `u32`를 넘지 않아 `None`이 하나도 없다.

</details>


## p4 · 레이블 블록으로 피타고라스 세 수 찾기

$$a < b < c$$이고 $$a^2 + b^2 = c^2$$이며 $$a + b + c$$가 주어진 `sum`인 첫 세 수를 찾는 함수 `fn triple(sum: u32) -> Option<(u32, u32, u32)>`를 써라. "첫"은 `a`가 가장 작은 것, 그중 `b`가 가장 작은 것이다. 레이블 블록과 `break '이름 값`을 써서 두 겹 반복을 한 번에 빠져나온다.

예: `triple(12) = Some((3, 4, 5))`, `triple(10) = None`.

사용 개념: [표현식과 제어 흐름](/Hongs_Blog/studies/rust/expressions-control-flow/)의 레이블 블록과 범위.

풀이 전략: `c`는 `sum - a - b`로 정해지므로 반복은 `a`와 `b` 두 겹이면 된다. 찾는 순간 두 겹을 한 번에 나가야 하므로 바깥에 레이블 블록을 두고, 블록의 꼬리를 `None`으로 둬서 못 찾은 경우의 값을 정한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *c 정하기:* `sum.checked_sub(a + b)`로 `c`를 구한다. `a + b`가 `sum`보다 크면 `None`이라 `u32` 빼기 넘침이 없다.
2. *일찍 끊기:* `b`가 커지면 `c`가 작아진다. `c <= b`가 되면 이 `a`에서는 더 볼 것이 없으므로 안쪽 반복만 `break`한다.
3. *두 겹 한 번에 나가기:* 찾으면 `break 'found Some((a, b, c))`.

```rust
fn triple(sum: u32) -> Option<(u32, u32, u32)> {
    'found: {
        for a in 1..sum {
            for b in (a + 1)..sum {
                let Some(c) = sum.checked_sub(a + b) else {
                    break;
                };
                if c <= b {
                    break;
                }
                if a * a + b * b == c * c {
                    break 'found Some((a, b, c));
                }
            }
        }
        None
    }
}
```

`let Some(c) = … else { … };`는 패턴이 맞지 않으면 `else` 블록으로 빠지는 문법이다. 여기서는 "c를 구할 수 없으면 안쪽 반복을 끝낸다"를 짧게 적는 데 썼다. 결과는 `triple(30) = Some((5, 12, 13))`, `triple(1000) = Some((200, 375, 425))`이고 세 수의 곱은 31,875,000이다.

</details>


**변형.** 안쪽의 `break;` 두 개를 `break 'found None;`으로 바꾸면 `triple(1000)`은 무엇이 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`None`이 된다. `a = 1`일 때 `b`가 커지다 `c <= b`가 되는 순간 레이블 블록 전체를 `None`으로 끝내 버려서, `a = 200`까지 가 보지도 못한다. 레이블 없는 `break`는 안쪽 반복만, 레이블 붙은 `break`는 그 레이블까지 한꺼번에 끝낸다는 차이다.

</details>
{% endraw %}
