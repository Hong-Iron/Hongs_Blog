---
layout: "note"
title: "트레이트와 반복자 연습"
display_title: "트레이트와 반복자 연습"
kind: "practice"
kind_label: "연습"
num: "22"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "4단원에서 배운 것을 섞어 쓰는 네 문제다. 트레이트와 트레이트 객체로 서로 다른 타입을 한 목록에 담고(p1), next 하나로 반복자를 만들고(p2), 클로저와 어댑터 사슬로 데이터를 세고(p3), 표준 트레이트 다섯 개의 약속을 한 기준으로 맞춘다(p4). 각 문제의 코드를 …"
prev_url: "/studies/rust/data-modeling-practice/"
prev_title: "데이터 모델링 연습"
next_url: "/studies/rust/capstone-1/"
next_title: "캡스톤 1 도메인 타입과 에러"
math: true
mermaid: false
code_count: 4
permalink: "/studies/rust/traits-iterators-practice/"
---
{% raw %}
4단원에서 배운 것을 섞어 쓰는 네 문제다. 트레이트와 트레이트 객체로 서로 다른 타입을 한 목록에 담고(p1), `next` 하나로 반복자를 만들고(p2), 클로저와 어댑터 사슬로 데이터를 세고(p3), 표준 트레이트 다섯 개의 약속을 한 기준으로 맞춘다(p4). 각 문제의 코드를 `cargo new`로 만든 패키지의 `src/main.rs`에 옮겨 `cargo run`으로 돌려 본다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답, 경계 사례 테스트, 변형 문제의 컴파일 오류와 실행 결과를 코드로 확인했다 — [p1](/Hongs_Blog/studies/rust/code/22_traits-iterators-practice_p1/) · [p2](/Hongs_Blog/studies/rust/code/22_traits-iterators-practice_p2/) · [p3](/Hongs_Blog/studies/rust/code/22_traits-iterators-practice_p3/) · [p4](/Hongs_Blog/studies/rust/code/22_traits-iterators-practice_p4/)</div>

</div>


## p1 · 섞인 도형을 넓이 순으로

원(반지름 1), 직사각형(2×3), 삼각형(밑변 4, 높이 2)을 한 목록에 담고 넓이가 큰 것부터 설명을 만든다.

- (가) `area`와 `name`을 요구하고, `describe`는 기본 몸통으로 `"이름 넓이"`(넓이는 소수 둘째 자리까지)를 돌려주는 트레이트 `Shape`를 써라.
- (나) `fn ranked(shapes: &mut [Box<dyn Shape>]) -> Vec<String>`을 써라. 결과는 `["직사각형 6.00", "삼각형 4.00", "원 3.14"]`여야 한다.
- (다) 넓이의 합을 반복자로 구하는 `fn total_area(shapes: &[Box<dyn Shape>]) -> f64`를 써라. 위 목록에서 $$\pi + 10 \approx 13.14159$$이고, 빈 목록이면 0이다.

사용 개념: [트레이트](/Hongs_Blog/studies/rust/traits/)의 기본 메서드, [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/), [반복자](/Hongs_Blog/studies/rust/iterators/)의 `map`과 `sum`.

풀이 전략: 타입이 서로 다른 값을 한 `Vec`에 담아야 하므로 `Box<dyn Shape>`로 감싼다. 넓이가 `f64`라서 `Ord`가 없다. 그래서 키를 뽑는 `sort_by_key` 대신 비교 함수를 직접 주는 `sort_by`를 쓰고, `f64` 두 개를 늘 비교할 수 있는 `total_cmp`로 비교한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *트레이트에 기본 몸통 두기:* `describe`는 필수 메서드 `name`과 `area`만으로 만들 수 있으니 트레이트 안에 몸통을 둔다. 도형마다 `area`와 `name` 두 개만 구현하면 된다.

```rust
trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
    fn describe(&self) -> String {
        format!("{} {:.2}", self.name(), self.area())
    }
}

impl Shape for Circle {
    fn area(&self) -> f64 { PI * self.r * self.r }
    fn name(&self) -> String { "원".into() }
}
// Rect: w * h, Triangle: base * height / 2.0 도 같은 모양이다
```

{: start="2"}
2. *큰 것부터 정렬:* 비교 함수에 `b`를 앞에 두면 내림차순이 된다.
3. *설명으로 바꿔 모으기:* `iter().map(...).collect()`.

```rust
fn ranked(shapes: &mut [Box<dyn Shape>]) -> Vec<String> {
    shapes.sort_by(|a, b| b.area().total_cmp(&a.area()));
    shapes.iter().map(|s| s.describe()).collect()
}

fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}
```

{: start="4"}
4. *확인:* 넓이는 원 $$\pi \approx 3.14$$, 직사각형 6, 삼각형 4다. 출력은 `["직사각형 6.00", "삼각형 4.00", "원 3.14"]`, 합은 `13.14159`다. 빈 목록의 `sum()`은 0.0이다.

`s.describe()`는 상자 안의 실제 타입을 실행 중에 찾아가 부른다(동적 디스패치)[^1]. 기본 몸통 안의 `self.name()`과 `self.area()`도 마찬가지다.

</details>


**변형.** (가) `ranked`의 정렬을 <code>shapes.sort_by_key(&#124;s&#124; s.area())</code>로 바꾸면 컴파일되는가? (나) `total_cmp`는 넓이가 `NaN`인 도형이 섞여도 정렬할 수 있는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) 안 된다. ``error[E0277]: the trait bound `f64: Ord` is not satisfied``다. `sort_by_key`는 키가 `Ord`여야 하는데, `f64`는 `NaN` 때문에 `Ord`가 아니다([꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/)).<br>
(나) 된다. `total_cmp`는 IEEE 754의 totalOrder 규칙으로 모든 `f64`에 순서를 매긴다. 음수 NaN이 가장 작고 양수 NaN이 가장 크다[^2]. `f64::NAN`의 부호는 정해져 있지 않다고 std 문서가 적는다[^2]. 이 기계에서는 `[2.0, NaN, -1.0]`을 `total_cmp`로 정렬하니 `NaN`이 맨 끝으로 갔다.

</details>


## p2 · 피보나치 반복자

1, 1, 2, 3, 5, 8, …을 내주는 반복자 `Fib`를 만든다. 다음 항이 `u64`를 넘을 때 panic하지 말고 거기서 끝나야(`None`) 한다.

- (가) 앞 10개를 모으면 `[1, 1, 2, 3, 5, 8, 13, 21, 34, 55]`여야 한다.
- (나) 4,000,000 이하인 항 가운데 짝수의 합을 어댑터 사슬로 구하라.
- (다) `u64`에 들어가는 항은 몇 개이고, 마지막 항은 무엇인가?

사용 개념: [반복자](/Hongs_Blog/studies/rust/iterators/)의 `Iterator` 트레이트와 `take_while`, [Option과 Result](/Hongs_Blog/studies/rust/option-result/)의 `?`, [값·변수·타입](/Hongs_Blog/studies/rust/values-variables-types/)의 `checked_add`.

풀이 전략: 반복자는 "지금 항"과 "다음 항"만 기억하면 된다. 넘칠 수 있는 덧셈을 `checked_add`로 바꾸면 넘칠 때 `None`이 나온다. 이 `None`을 "다음 항이 없다"로 저장해 두면 끝내기가 저절로 된다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *상태 정하기:* 두 칸 모두 `Option<u64>`로 둔다. `None`은 "그 항은 `u64`에 들어가지 않는다"는 뜻이다.
2. *끝내기:* `self.cur?`는 지금 항이 `None`이면 그 자리에서 `None`을 돌려준다.
3. *넘침을 None으로:* 다음다음 항을 `checked_add`로 구한다. 넘치면 `None`이 저장된다.

```rust
struct Fib { cur: Option<u64>, next: Option<u64> }

fn fib() -> Fib { Fib { cur: Some(1), next: Some(1) } }

impl Iterator for Fib {
    type Item = u64;
    fn next(&mut self) -> Option<u64> {
        let out = self.cur?;
        let after = match (self.cur, self.next) {
            (Some(a), Some(b)) => a.checked_add(b),
            _ => None,
        };
        self.cur = self.next;
        self.next = after;
        Some(out)
    }
}
```

{: start="4"}
4. *사슬로 답 구하기:* 4,000,000을 처음 넘는 순간 끝내야 하므로 `take_while`, 짝수만 남기는 `filter`, 더하는 `sum`.

```rust
fn even_sum_below(limit: u64) -> u64 {
    fib().take_while(|&x| x <= limit).filter(|x| x % 2 == 0).sum()
}
```

{: start="5"}
5. *확인:* (나)는 `4613732`다. 작은 한도로 손 계산과 맞춰 본다: `even_sum_below(1) = 0`, `even_sum_below(2) = 2`, `even_sum_below(10) = 2 + 8 = 10`. (다)는 `fib().count()`가 `93`, `fib().last()`가 `12200160415121876738`이다. `fib().nth(92)`는 그 값이고 `fib().nth(93)`은 `None`이다. 94번째 항을 구하는 덧셈이 넘쳐서 반복자가 거기서 끝났다.

</details>


**변형.** (나)의 <code>take_while(&#124;&amp;x&#124; x &lt;= limit)</code>을 <code>filter(&#124;&amp;x&#124; x &lt;= limit)</code>로 바꾸면 답이 달라지는가? 사슬 맨 앞에 `inspect`를 넣어 반복자가 내준 항의 수를 세면 두 판은 각각 몇인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

답은 똑같이 `4613732`다. 하지만 본 항의 수가 다르다. `take_while` 판은 34개, `filter` 판은 93개다. `take_while`은 처음으로 한도를 넘는 34번째 항(5,702,887)을 보고 끝난다. `filter`는 조건이 거짓이어도 계속 다음 항을 달라고 해서 반복자가 끝날 때까지 93개를 다 본다. `Fib`가 넘침에서 스스로 끝나니 이번엔 결과가 같았다. 끝이 없는 반복자였다면 `filter` 판은 끝나지 않는다([반복자](/Hongs_Blog/studies/rust/iterators/)).

</details>


## p3 · 가장 많이 나온 단어 k개

글에서 가장 많이 나온 단어 `k`개를 `(단어, 횟수)`로 돌려주는 `fn top_words(text: &str, k: usize) -> Vec<(String, usize)>`를 써라.

- 글자나 숫자가 아닌 문자에서 끊고, 대소문자는 가리지 않는다(소문자로 바꾼다).
- 횟수가 많은 것부터, 횟수가 같으면 사전 순으로 앞선 단어부터.
- `top_words("The cat and the dog. And THE bird!", 3)`은 `[("the", 3), ("and", 2), ("bird", 1)]`이다.
- 단어가 없는 `"  ... !!"`는 빈 목록, 단어 종류보다 큰 `k`는 있는 만큼만 돌려준다.

사용 개념: [반복자](/Hongs_Blog/studies/rust/iterators/), [컬렉션](/Hongs_Blog/studies/rust/collections/)의 `entry`, [클로저](/Hongs_Blog/studies/rust/closures/).

풀이 전략: 일을 네 단계로 나눈다. 자르기, 세기, 줄 세우기, 앞에서 자르기. 줄 세우기의 두 기준(횟수는 큰 것부터, 단어는 작은 것부터)은 튜플 키 `(Reverse(횟수), 단어)` 하나로 쓸 수 있다. `Reverse`는 비교를 뒤집는 감싸개다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *자르기:* `split`에 클로저를 주면 그 조건이 참인 문자에서 끊는다. `". "`처럼 끊는 문자가 이어지면 그 사이에 빈 문자열이 생기므로 `filter`로 버린다.
2. *세기:* `entry(w).or_insert(0)`에 1을 더한다.
3. *줄 세우기:* `HashMap`을 `Vec`으로 모은 뒤 튜플 키로 정렬한다. 튜플은 앞 원소부터 비교한다.
4. *앞에서 자르기:* `take(k)`. `k`가 더 커도 있는 만큼만 나온다.

```rust
fn top_words(text: &str, k: usize) -> Vec<(String, usize)> {
    let mut freq: HashMap<String, usize> = HashMap::new();
    for w in text
        .split(|c: char| !c.is_alphanumeric())
        .filter(|w| !w.is_empty())
        .map(str::to_lowercase)
    {
        *freq.entry(w).or_insert(0) += 1;
    }
    let mut pairs: Vec<(String, usize)> = freq.into_iter().collect();
    pairs.sort_by_key(|(w, n)| (Reverse(*n), w.clone()));
    pairs.into_iter().take(k).collect()
}
```

횟수는 the 3, and 2, cat·dog·bird 각 1이다. 동점인 셋 중 사전 순으로 `bird`가 앞이라 셋째가 된다.

키 함수 안의 `w.clone()`은 비교할 때마다 `String`을 새로 만든다. `sort_by_key`는 키 함수 비용이 $$O(m)$$일 때 최악 $$O(m \cdot n \log n)$$이다. `sort_by_cached_key`는 원소마다 키를 한 번만 계산해 두므로, 키가 비싸면 이쪽이 낫다[^3].

</details>


**변형.** 정렬 키에서 단어를 빼고 <code>pairs.sort_by_key(&#124;(_, n)&#124; Reverse(*n))</code>만 쓰면 결과의 셋째 자리는 늘 같은가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

같지 않다. 같은 글로 200번 돌린 실행에서 셋째 자리에 `bird`, `cat`, `dog`가 모두 나왔다. `sort_by_key`는 안정 정렬이라 횟수가 같은 원소끼리는 정렬 전 순서를 그대로 둔다[^3]. 그런데 정렬 전 순서는 `HashMap`이 내준 순서이고, 그 순서는 맵마다 달라진다([컬렉션](/Hongs_Blog/studies/rust/collections/)). 결과가 매번 같아야 하는 출력과 테스트에는 동점을 가르는 둘째 기준이 꼭 필요하다.

</details>


## p4 · 대소문자를 가리지 않는 사용자 이름

가입할 때 `"Kim"`과 `"kim"`은 같은 이름으로 봐야 한다. 이름을 감싼 `struct Username(String)`을 만들어 `HashSet`과 `BTreeSet`에서 모두 그렇게 동작하게 하라.

- `PartialEq`, `Eq`, `Hash`, `PartialOrd`, `Ord`를 손으로 구현한다.
- `fn unique_sorted(names: &[&str]) -> Vec<String>`은 처음 나온 표기를 남기고 중복을 없앤 뒤, 대소문자를 무시한 사전 순으로 돌려준다.
- 입력 `["Kim", "kim", "LEE", "Park", "lee", "KIM"]`이면 `["Kim", "LEE", "Park"]`이고, 같은 입력으로 만든 `HashSet<Username>`과 `BTreeSet<Username>`은 둘 다 원소가 3개다.

사용 개념: [꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/)의 Eq·Hash 약속과 Ord·PartialOrd 약속, [반복자](/Hongs_Blog/studies/rust/iterators/).

풀이 전략: 다섯 트레이트가 같은 기준을 쓰게 하는 것이 전부다. 그 기준(소문자로 바꾼 바이트 열)을 메서드 하나로 만들어 두고, 다섯 구현이 모두 그 메서드만 쓰게 한다. 기준이 한 곳에 있으면 어긋날 수가 없다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *기준 하나 만들기:* 소문자로 바꾼 바이트를 내주는 반복자를 돌려준다. 문자열을 새로 만들지 않는다.
2. *같음:* `eq_ignore_ascii_case`로 비교한다. 같은 기준이다.
3. *해시:* 기준 바이트를 하나씩 넣고 끝에 `0xff`를 넣는다. 끝 표시는 `("ab", "c")`와 `("a", "bc")` 같은 묶음이 서로 다른 해시를 내게 한다. 해시에 넣는 값들이 서로의 앞부분이 되면 안 된다는 std 문서의 권고를 따른 것이다[^4].
4. *순서:* 두 기준 반복자를 `Iterator::cmp`로 비교한다. 원소를 앞에서부터 사전식으로 비교하는 메서드다[^5]. `partial_cmp`는 `Some(self.cmp(other))`로 둔다[^6].

```rust
#[derive(Debug, Clone)]
struct Username(String);

impl Username {
    fn key(&self) -> impl Iterator<Item = u8> + '_ {
        self.0.bytes().map(|b| b.to_ascii_lowercase())
    }
}

impl PartialEq for Username {
    fn eq(&self, other: &Self) -> bool { self.0.eq_ignore_ascii_case(&other.0) }
}
impl Eq for Username {}

impl Hash for Username {
    fn hash<H: Hasher>(&self, state: &mut H) {
        for b in self.key() { state.write_u8(b); }
        state.write_u8(0xff);
    }
}

impl Ord for Username {
    fn cmp(&self, other: &Self) -> Ordering { self.key().cmp(other.key()) }
}
impl PartialOrd for Username {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> { Some(self.cmp(other)) }
}
```

{: start="5"}
5. *처음 표기 남기기:* `HashSet::insert`는 처음 넣으면 `true`, 이미 있으면 `false`를 돌려준다. 그래서 <code>filter(&#124;u&#124; seen.insert(u.clone()))</code>는 처음 나온 것만 통과시킨다.

```rust
fn unique_sorted(names: &[&str]) -> Vec<String> {
    let mut seen = HashSet::new();
    let mut kept: Vec<Username> = names
        .iter()
        .map(|n| Username(n.to_string()))
        .filter(|u| seen.insert(u.clone()))
        .collect();
    kept.sort();
    kept.into_iter().map(|u| u.0).collect()
}
```

{: start="6"}
6. *확인:* 결과는 `["Kim", "LEE", "Park"]`, `HashSet` 3개, `BTreeSet` 3개다. 테스트에서 `("Kim", "KIM")`, `("a", "A")`, `("Rust", "rUST")` 세 쌍이 모두 `==`, 같은 해시, `cmp`가 `Equal`인지 확인했다.

</details>


**변형.** 다른 것은 그대로 두고 `Ord`만 `self.0.cmp(&other.0)`(대소문자를 구별하는 원래 문자열 비교)로 바꾼다. 같은 입력으로 만든 `HashSet`과 `BTreeSet`에는 각각 몇 개가 들어가는가? `BTreeSet`을 `collect()`로 만들 때와 빈 집합에 `insert`를 여섯 번 할 때가 같은가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`HashSet`은 그대로 3개다. `Eq`와 `Hash`는 바꾸지 않았기 때문이다. `BTreeSet`은 만드는 방법에 따라 다르게 나왔다(rustc 1.99.0에서 본 결과).

| 만드는 법 | 개수 | 들어간 것 |
|---|---|---|
| `insert` 여섯 번 | 6 | `KIM, Kim, LEE, Park, kim, lee` |
| `collect()` | 5 | `Kim, LEE, Park, kim, lee` |

`insert`는 `Ord`로만 자리를 찾는다[^9]. 대소문자를 구별하는 `Ord`에게 여섯 이름은 모두 다르다. `collect()`는 원소를 먼저 모두 정렬한 뒤 한꺼번에 트리를 만든다[^7]. 그 과정에서 바로 이웃한 두 키가 `!=`가 아니면, 즉 `==`이면 앞의 것을 버리고 뒤의 것만 남긴다[^8]. 정렬 결과 `KIM` 바로 뒤에 `Kim`이 오고, 둘은 `==`로 같으므로 `KIM`이 빠졌다. `kim`과 `Kim`은 서로 떨어져 있어서 둘 다 남았다.

핵심은 개수가 아니다. `Ord`와 `Eq`가 어긋나면 `PartialOrd`의 약속(`a == b`일 때, 그리고 그때만 `partial_cmp`가 `Equal`)이 깨진다[^10]. 이것은 논리 오류이고, 그 결과는 정해져 있지 않다[^6]. 같은 데이터에서 만드는 법만 바꿨는데 답이 달라진 것이 바로 "정해져 있지 않다"의 뜻이다. 다음 버전의 표준 라이브러리에서는 또 다른 답이 나올 수 있다.

</details>


[^1]: The Rust Programming Language, 18.2 Using Trait Objects to Abstract over Shared Behavior (Trait Objects Perform Dynamic Dispatch) — https://doc.rust-lang.org/book/ch18-02-trait-objects.html
[^2]: std 문서, Primitive Type `f64`, `total_cmp` — https://doc.rust-lang.org/std/primitive.f64.html
[^3]: std 문서, Primitive Type `slice`, `sort_by_key`(stable, $$O(m \cdot n \log n)$$), `sort_by_cached_key`(key function called at most once per element) — https://doc.rust-lang.org/std/primitive.slice.html
[^4]: std 문서, Trait `std::hash::Hash` (Hash and Eq, Prefix collisions) — https://doc.rust-lang.org/std/hash/trait.Hash.html
[^5]: std 문서, Trait `std::iter::Iterator`, `cmp` ("Lexicographically compares the elements of this Iterator with those of another") — https://doc.rust-lang.org/std/iter/trait.Iterator.html
[^6]: std 문서, Trait `std::cmp::Ord` (consistency with PartialOrd, logic errors) — https://doc.rust-lang.org/std/cmp/trait.Ord.html
[^7]: 표준 라이브러리 소스, `alloc/collections/btree/set.rs`, `impl FromIterator for BTreeSet` (`inputs.sort()` 뒤 `from_sorted_iter`) — https://doc.rust-lang.org/src/alloc/collections/btree/set.rs.html
[^8]: 표준 라이브러리 소스, `alloc/collections/btree/dedup_sorted_iter.rs` ("only the last key-value pair is yielded", `if next.0 != peeked.0`) — https://doc.rust-lang.org/src/alloc/collections/btree/dedup_sorted_iter.rs.html
[^9]: std 문서, Struct `std::collections::BTreeSet` (원소의 순서는 `Ord`가 정한다, `insert`의 `T: Ord`) — https://doc.rust-lang.org/std/collections/struct.BTreeSet.html
[^10]: std 문서, Trait `std::cmp::PartialOrd` ("`a == b` if and only if `partial_cmp(a, b) == Some(Equal)`") — https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html
{% endraw %}
