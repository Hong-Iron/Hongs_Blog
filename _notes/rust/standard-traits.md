---
layout: "note"
title: "꼭 구현할 표준 트레이트"
display_title: "꼭 구현할 표준 트레이트 (Common Standard Traits)"
kind: "concept"
kind_label: "정의"
num: "22"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Standard Traits", "Common Traits", "C-COMMON-TRAITS", "derive", "Debug", "Clone", "Copy", "PartialEq", "Eq", "PartialOrd", "Ord", "Hash", "Default", "Display", "ToString", "From", "Into", "TryFrom", "TryInto", "AsRef", "Send", "Sync", "자동 트레이트", "Auto Trait", "논리 오류", "Logic Error"]
description: "내가 만든 타입을 남이 편하게 쓰도록 미리 붙여 두는 기본 능력 묶음이다. 디버그용 출력, 복제, 같음과 크기 비교, 해시(값을 짧은 수로 줄인 지문), 기본값, 사람에게 보여 줄 출력, 타입 바꾸기가 그렇다. 대부분은 derive 한 줄이면 컴파일러가 만들어 주고, 내 타입을 가…"
prev_url: "/studies/rust/iterators/"
prev_title: "반복자"
next_url: "/studies/rust/error-propagation/"
next_title: "물음표 연산자와 에러 전파"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "22_standard-traits_verify.rs", "u": "/studies/rust/code/22_standard-traits_verify/", "r": "검증"}]
permalink: "/studies/rust/standard-traits/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

내가 만든 타입을 남이 편하게 쓰도록 미리 붙여 두는 기본 능력 묶음이다. 디버그용 출력, 복제, 같음과 크기 비교, 해시(값을 짧은 수로 줄인 지문), 기본값, 사람에게 보여 줄 출력, 타입 바꾸기가 그렇다. 대부분은 `derive` 한 줄이면 컴파일러가 만들어 주고, 내 타입을 가져다 쓰는 다른 패키지는 이것을 나중에 덧붙일 수 없으므로 타입을 만든 쪽이 먼저 붙여 둔다. 손으로 구현할 때는 서로 약속을 맞춰야 한다. 같다고 판단한 두 값은 해시도 같아야 하고, 이것이 어긋나면 해시맵이 넣어 둔 키를 못 찾는다.

</div>


## 예시로 보기

Java의 모든 클래스는 `Object`에서 `toString`, `equals`, `hashCode`를 물려받는다. 그래서 무엇이든 찍고 비교하고 `HashMap`에 넣을 수 있다. 그 대신 `==`는 주소를 비교하고, 내용 비교는 `equals`를 따로 불러야 한다([참조 비교와 null](/Hongs_Blog/studies/java/java-reference-equality/)).

Rust의 구조체는 처음에 아무것도 없다. `pub struct V(pub u8);`에 `a == b`를 쓰면 `` error[E0369]: binary operation `==` cannot be applied to type `V` ``이고, `{a:?}`로 찍으면 ``error[E0277]: `V` doesn't implement `Debug` ``다. 필요한 능력을 트레이트로 하나씩 붙인다. 대부분은 `derive`로 붙는다.

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Default)]
struct Version { major: u16, minor: u16, patch: u16 }
```

| 이 줄 덕분에 되는 일 | 결과 |
|---|---|
| `println!("{v:?}")` | `Version { major: 1, minor: 2, patch: 3 }` |
| `let w = v;` 뒤에도 `v`를 쓴다 | `Copy`라서 옮기지 않고 복사한다 |
| `v == w` | `true` (필드가 모두 같다) |
| `[1.10.0, 1.2.9, 0.99.99]`를 `sort()` | `v0.99.99, v1.2.9, v1.10.0` (문자열 순서가 아니라 수 순서) |
| `HashSet`에 `v`와 `w`를 넣는다 | 원소 1개 |
| `Version::default()` | `0.0.0` |

왜 만든 쪽이 붙여야 하나? 트레이트와 타입이 둘 다 남의 것이면 구현할 수 없다는 고아 규칙 때문이다([트레이트](/Hongs_Blog/studies/rust/traits/)). 내 `Version`을 쓰는 다른 크레이트는 `Debug`도 `Version`도 자기 것이 아니라서 `impl Debug for Version`을 못 쓴다. Rust API Guidelines는 그래서 새 타입이 흔한 트레이트를 먼저 구현해 두라고 한다(C-COMMON-TRAITS). 목록은 `Copy`, `Clone`, `Eq`, `PartialEq`, `Ord`, `PartialOrd`, `Hash`, `Debug`, `Display`, `Default`다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 출력, 아무 트레이트도 없는 타입의 E0369·E0277, 막히는 derive(E0277·E0204·E0184), 필드 순서와 정렬, `Display`·`From`·`TryFrom`·`AsRef`, `Rc`의 `Send` 오류, Eq와 Hash가 어긋난 키의 반례와 고친 키, clippy `from_over_into`·`derived_hash_with_manual_eq`·`derive_ord_xor_partial_ord`를 rustc 1.99로 컴파일하고 실행해 확인했다 — [22_standard-traits_verify.rs](/Hongs_Blog/studies/rust/code/22_standard-traits_verify/)</div>

</div>


## 한눈에 보기

| 트레이트 | 주는 것 | `derive` | 조건과 주의 |
|---|---|---|---|
| `Debug` | `{:?}`, `{:#?}` 출력 | 된다 | 모든 공개 타입에 붙인다 |
| `Clone` | `.clone()`으로 명시적 복제 | 된다 | 필드가 모두 `Clone` |
| `Copy` | 대입·전달 때 자동 비트 복사 | 된다 | 필드가 모두 `Copy`, `Drop`이 없다 |
| `PartialEq`, `Eq` | `==`, `!=` | 된다 | `f64` 필드가 있으면 `Eq`는 안 된다 |
| `PartialOrd`, `Ord` | `<`, `sort()`, `BTreeMap` 키 | 된다 | 필드를 선언한 순서대로 비교한다 |
| `Hash` | `HashMap`·`HashSet` 키 | 된다 | `Eq`와 기준이 같아야 한다 |
| `Default` | `Default::default()` | 된다 | 열거형은 `#[default]`로 고른다 |
| `Display` | `{}`, `.to_string()` | 안 된다 | 손으로 쓴다 |
| `From`, `TryFrom` | 타입 바꾸기, `?`의 에러 변환 | 안 된다 | `Into`가 아니라 `From`을 구현한다 |
| `AsRef` | 값싼 참조 바꾸기 | 안 된다 | 실패하면 안 된다 |
| `Send`, `Sync` | 스레드 사이에 넘기기·나눠 쓰기 | 컴파일러가 알아서 | 확인하는 테스트를 둔다 |

## Debug: 개발자용 출력

`Debug`는 개발자가 디버깅할 때 보는 출력이다. 필드가 모두 `Debug`면 `derive`할 수 있고, 구조체 이름, `{`, 필드 이름과 값, `}` 순서로 찍는다[^2]. `{:#?}`로 찍으면 한 필드에 한 줄씩 펼친다[^2].

```
Version {
    major: 1,
    minor: 2,
    patch: 3,
}
```

API Guidelines는 모든 공개 타입이 `Debug`를 구현하라고 한다. 예외는 드물다(C-DEBUG). 비어 있는 값도 `""`, `[]`처럼 무언가를 찍어야 한다(C-DEBUG-NONEMPTY)[^3]. 테스트의 `assert_eq!(a, b)`는 두 값을 `==`로 비교하고, 다르면 `{:?}`로 찍는다. 그래서 `PartialEq`만 있고 `Debug`가 없는 타입에 `assert_eq!`를 쓰면 ``error[E0277]: `V` doesn't implement `Debug` ``다.

`derive`가 만든 `Debug` 형식은 안정된 약속이 아니다. Rust 버전에 따라 바뀔 수 있다[^2]. 그래서 `{:?}` 출력을 파싱하거나 사용자 화면에 그대로 내보내지 않는다. 사람에게 보여 줄 형식은 `Display`로 따로 만든다.

## Clone과 Copy

둘 다 값을 하나 더 만든다. 차이는 누가, 얼마나 싸게 하느냐다. `Copy`는 저절로 일어나는 값싼 비트 복사다. `Clone`은 늘 `.clone()`으로 직접 부르고, 비쌀 수도 있다[^4].

- `Clone`은 필드가 모두 `Clone`이면 `derive`할 수 있다. 만들어진 `clone`은 필드마다 `clone`을 부른다[^4].
- `Copy`는 `Clone`을 전제로 한다. 그래서 `#[derive(Clone, Copy)]`처럼 둘을 같이 붙인다[^5].
- 필드가 모두 `Copy`여야 한다. `String` 필드가 있으면 ``error[E0204]: the trait `Copy` cannot be implemented for this type``이다[^5].
- `Drop`을 구현한 타입은 `Copy`가 될 수 없다. 자기 크기 바깥의 자원을 관리하기 때문이다[^5]. 붙이면 ``error[E0184]: the trait `Copy` cannot be implemented for this type; the type has a destructor``다.

`String`이 `Copy`가 아닌 이유를 std 문서는 이렇게 설명한다. `String`을 비트만 복사하면 힙을 가리키는 포인터만 복사되어, 나중에 같은 힙 칸을 두 번 해제하게 된다[^5]. [소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/)에서 본 "이동"이 이 문제를 막는 장치다.

## PartialEq와 Eq: 같음

`PartialEq`를 `derive`하면 모든 필드가 같을 때 두 값이 같다. 열거형은 같은 변형이고 필드가 모두 같을 때 같다[^6]. Java처럼 주소를 비교하지 않고 내용을 비교한다.

`Eq`는 메서드가 하나도 없는 트레이트다. "`a == a`가 늘 참이다"라는 약속만 더한다. 컴파일러가 이 성질을 검사할 수 없어서 메서드 없이 약속만 적는다[^7]. `f64`는 이 약속을 지키지 못한다. `NaN`(계산 결과가 수가 아님을 뜻하는 값)은 자기 자신과도 같지 않기 때문이다[^7]. 그래서 `f64` 필드가 있는 구조체에 `Eq`를 붙이면 ``error[E0277]: the trait bound `f64: Eq` is not satisfied``다.

<details class="callout callout-example" markdown="1">
<summary class="callout-title" markdown="span">기호로 쓰면</summary>

`PartialEq`는 모든 `a`, `b`, `c`에 대해 다음을 지켜야 한다[^6].
- 대칭: `a == b`이면 `b == a`
- 추이: `a == b`이고 `b == c`이면 `a == c`

`Eq`는 여기에 반사, 즉 모든 `a`에 대해 `a == a`를 더한다[^7]. 세 성질을 모두 갖춘 관계가 이산수학의 동치관계다([동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/)). 그래서 `Eq`인 타입의 값들은 "서로 같은 것끼리" 겹치지 않는 무리로 나뉘고, 해시맵은 무리 하나를 키 하나로 다룬다.

</details>


## PartialOrd와 Ord: 크기 비교와 정렬

`derive`한 순서는 필드를 위에서 아래로 선언한 순서대로 비교하는 사전식 순서다. 첫 필드가 다르면 거기서 정해지고, 같으면 다음 필드를 본다. 열거형은 위에 적은 변형이 작다[^8][^9].

```rust
#[derive(PartialEq, Eq, PartialOrd, Ord)]
struct ByAge { age: u8, name: &'static str }

#[derive(PartialEq, Eq, PartialOrd, Ord)]
struct ByName { name: &'static str, age: u8 }
```

같은 두 사람(kim 30살, lee 20살)이라도 `ByAge`로는 kim이 크고, `ByName`으로는 kim이 작다. 필드 순서를 바꾸기만 했는데 정렬 결과가 뒤집힌다. `Version`이 `1.2.9 < 1.10.0`으로 정렬된 것도 `major`, `minor`, `patch` 순서로 수를 비교했기 때문이다. `enum Level { Low, Mid, High }`는 `Low < Mid < High`다.

`Ord`는 모든 두 값을 비교할 수 있다는 약속(전순서)이다. `PartialOrd`는 비교할 수 없는 쌍을 허락한다. `f64::NAN.partial_cmp(&1.0)`은 `None`이다[^8]. 손으로 둘 다 구현할 때는 서로 맞아야 한다.

- `a == b`일 때, 그리고 그때만 `partial_cmp(a, b) == Some(Equal)`이다[^8].
- `partial_cmp(a, b) == Some(cmp(a, b))`이다[^9]. 그래서 `Ord`를 손으로 쓰면 `partial_cmp`는 `Some(self.cmp(other))` 한 줄로 쓴다[^8].

`PartialOrd`는 `derive`하고 `Ord`만 손으로 쓰면 둘이 어긋나기 쉽다. clippy의 `derive_ord_xor_partial_ord`가 이것을 오류로 막는다(기본이 deny): `` error: you are implementing `Ord` explicitly but have derived `PartialOrd` ``[^10]. 수학에서 말하는 부분순서와 전순서의 차이는 [부분순서와 위상 정렬](/Hongs_Blog/studies/discrete-math/partial-orders/)에 있다.

## Hash: Eq와 기준을 맞춘다

`HashMap`은 키를 찾을 때 먼저 해시로 칸을 고르고, 그 칸 안에서만 `==`로 비교한다([해시 테이블의 홈 버킷과 충돌](/Hongs_Blog/studies/data-structures/hash-table-terms/)). 그래서 `Hash`와 `Eq`를 함께 구현할 때는 다음 약속을 지켜야 한다[^11].

$$k_1 = k_2 \;\Rightarrow\; \mathrm{hash}(k_1) = \mathrm{hash}(k_2)$$


같은 두 키($$k_1$$, $$k_2$$)는 해시도 같아야 한다는 뜻이다. 거꾸로는 필요 없다. 다른 키의 해시가 우연히 같아도 맵은 `==`로 가려낸다. `#[derive(PartialEq, Eq, Hash)]`로 셋을 함께 만들면 이 약속은 저절로 지켜진다[^11].

### 어기면 생기는 일

대소문자를 무시하고 같다고 하는 키를 만들면서, 해시는 원래 문자열 그대로 계산해 본다.

```rust
struct BrokenKey(String);

impl PartialEq for BrokenKey {
    fn eq(&self, other: &Self) -> bool { self.0.eq_ignore_ascii_case(&other.0) }  // 대소문자 무시
}
impl Eq for BrokenKey {}

impl Hash for BrokenKey {
    fn hash<H: Hasher>(&self, state: &mut H) { self.0.hash(state); }  // 대소문자 그대로
}
```

`BrokenKey("Kim") == BrokenKey("KIM")`은 `true`다. 그런데 맵에 `"Kim"`을 넣고 `"KIM"`으로 찾으면 `None`이 나온다. `"KIM"`을 한 번 더 넣으면 "같은" 키가 두 개 들어가 `len()`이 2가 된다. 실행할 때마다 결과가 같도록 해시 씨앗을 고정한 맵(`BuildHasherDefault<DefaultHasher>`)으로 확인했다.

```
insert("Kim")   hash("Kim") ──▶ 칸 ③  [ Kim → 1 ]
get("KIM")      hash("KIM") ──▶ 칸 ⑦  [ 빈칸 ]   → None
                (칸 ③은 보지 않으니 Kim과 == 비교할 일이 없다)
insert("KIM")   hash("KIM") ──▶ 칸 ⑦  [ KIM → 2 ]  → len 2
```

칸 번호는 그림을 위한 예다. 실제 `HashMap`은 이보다 복잡한 방법으로 칸을 찾지만, 해시가 다르면 대개 다른 곳을 본다는 점은 같다. 고치려면 같다고 판단하는 기준으로 해시한다. 소문자로 바꾼 바이트를 하나씩 넣고 끝에 `0xff`를 하나 더 넣는다. 끝 표시는 `("ab", "c")`와 `("a", "bc")`처럼 이어 붙이면 같아지는 값들이 서로 다른 해시를 내게 한다. 표준 라이브러리의 `str`도 같은 방법을 쓴다[^11]. 고친 키로는 `get("KIM")`이 `Some(1)`이고 다시 넣어도 `len()`은 1이다.

이 약속을 어기는 것은 논리 오류(logic error)다. 결과가 어떻게 될지 정해져 있지 않지만, 메모리 안전을 깨뜨리는 정의되지 않은 동작(UB)은 생기지 않는다[^11]. 프로그램이 터지지 않고 조용히 틀린 답을 낸다는 점이 더 위험하다. clippy는 `Hash`만 `derive`하고 `PartialEq`를 손으로 쓴 타입을 오류로 막는다(`derived_hash_with_manual_eq`, 기본이 deny): `` error: you are deriving `Hash` but have implemented `PartialEq` explicitly ``[^10]. 위 `BrokenKey`처럼 둘 다 손으로 쓰면 clippy도 못 잡는다.

## Default

`derive(Default)`는 필드마다 그 타입의 기본값을 쓴다(`u16`은 0)[^12]. 열거형은 어느 변형을 기본으로 할지 `#[default]`로 고른다. 필드가 없는 변형에만 붙일 수 있고, 1.62부터 된다[^12].

```rust
#[derive(Default)]
enum Level { Low, #[default] Mid, High }
// Level::default() == Level::Mid
```

인자 없이 만들 수 있는 타입이면 `Default`와 함께 인자 없는 `new()`도 두라고 API Guidelines는 권한다. 사용자는 `new`가 있으리라 기대하기 때문이다[^1].

## Display: 사람에게 보여 줄 출력

`Display`는 사용자에게 보여 줄 출력이다. 그래서 `derive`할 수 없다[^13]. `#[derive(Display)]`를 쓰면 `` error: cannot find derive macro `Display` in this scope ``다.

```rust
impl fmt::Display for Version {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "v{}.{}.{}", self.major, self.minor, self.patch)
    }
}
// v.to_string() == "v1.2.3"
```

`Display`를 구현하면 `ToString`이 저절로 따라와 `.to_string()`을 쓸 수 있다. 그러니 `ToString`을 직접 구현하지 말고 `Display`를 구현한다[^13]. 에러 타입은 `Debug`와 `Display`가 둘 다 있어야 `std::error::Error`를 구현할 수 있다[^14]. 에러 메시지를 어떻게 쓰는지는 [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)에서 다룬다.

## From·TryFrom·AsRef: 타입 바꾸기

**`From`**은 반드시 성공하는 바꾸기다. 실패할 수 있으면 `From` 안에서 panic하지 말고 `TryFrom`을 쓴다[^15]. `From`을 구현하면 표준 라이브러리의 블랭킷 구현 덕분에 반대 방향의 `Into`가 공짜로 생긴다. 그래서 `Into`를 직접 구현하지 않는다[^15][^1].

```rust
impl From<Celsius> for Fahrenheit {
    fn from(c: Celsius) -> Self { Fahrenheit(c.0 * 9.0 / 5.0 + 32.0) }
}
let f: Fahrenheit = Celsius(100.0).into();   // From만 썼는데 into가 된다 → Fahrenheit(212.0)
```

`impl Into<i32> for W`처럼 `Into`를 직접 쓰면 clippy의 `from_over_into`(기본으로 켜짐)가 `` warning: an implementation of `From` is preferred since it gives you `Into<_>` for free where the reverse isn't true ``라고 알린다[^10]. `?` 연산자도 에러 타입을 바꿀 때 `From::from`을 부른다[^15]. 그래서 내 에러 타입에 `From<io::Error>`를 구현해 두면 `?` 하나로 에러가 바뀐다([물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)).

**`TryFrom`**은 실패할 수 있는 바꾸기다. 실패했을 때 돌려줄 타입을 연관 타입 `Error`로 정한다[^16].

```rust
impl TryFrom<i32> for Percent {
    type Error = String;
    fn try_from(v: i32) -> Result<Self, Self::Error> {
        if (0..=100).contains(&v) { Ok(Percent(v as u8)) } else { Err(format!("0~100 밖의 값: {v}")) }
    }
}
// Percent::try_from(42) == Ok(Percent(42))
// Percent::try_from(150) == Err("0~100 밖의 값: 150")
```

`TryFrom`도 `TryInto`를 따라오게 한다[^16]. 그래서 `let p: Result<Percent, _> = (-1).try_into();`도 된다. 제네릭 함수의 경계에는 `TryInto`를 쓰라고 std 문서가 권한다. `TryInto`만 구현한 타입도 받기 위해서다[^16].

**`AsRef`**는 값싼 참조→참조 바꾸기다. 실패하면 안 되고, 비싼 바꾸기라면 `From`이나 따로 만든 함수를 쓴다[^17]. `AsRef<str>`을 받는 함수는 `String`과 `&str`을 모두 받는다[^17].

```rust
fn shout<S: AsRef<str>>(s: S) -> String { s.as_ref().to_uppercase() }
// shout("abc") == "ABC", shout(String::from("xy")) == "XY"
```

모양이 같은 `Borrow`는 약속이 하나 더 있다. 빌려 온 값의 `Hash`, `Eq`, `Ord`가 원래 값과 같아야 한다[^17]. `HashMap<String, V>`를 `&str`로 찾을 수 있는 것이 이 약속 덕분이다. `String`과 그 `&str`은 같은 해시를 낸다.

## Send와 Sync: 컴파일러가 알아서 붙인다

`Send`(다른 스레드로 넘겨도 된다)와 `Sync`(여러 스레드가 함께 빌려 봐도 된다)는 자동 트레이트(auto trait)다. 직접 구현하지 않아도, 필드가 모두 `Send`인 구조체는 컴파일러가 `Send`로 만든다[^18]. 그래서 `Version`과 `String`은 따로 한 일 없이 `Send + Sync`다. 거꾸로 `Rc<u8>`은 `Send`가 아니어서 `Send`를 요구하는 자리에 넣으면 ``error[E0277]: `Rc<u8>` cannot be sent between threads safely``다.

API Guidelines는 타입이 되도록 `Send`와 `Sync`이게 하고, 그 사실을 확인하는 테스트를 두라고 한다(C-SEND-SYNC)[^1]. 필드 하나를 바꿨다가 모르는 사이에 `Send`가 빠지는 일을 테스트가 잡는다.

```rust
fn assert_send_sync<T: Send + Sync>() {}
assert_send_sync::<Version>();   // 컴파일되면 통과
```

자세한 규칙은 [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)에 있다.

## 활용

- **새 공개 타입을 만들 때.** 먼저 `#[derive(Debug, Clone, PartialEq, Eq, Hash)]`를 붙일 수 있는지 본다. 자연스러운 순서가 있으면 `PartialOrd, Ord`, 빈 값이 자연스러우면 `Default`, 사용자에게 보여 줄 거면 `Display`를 더한다. 다른 타입에서 만들어지면 `From`이나 `TryFrom`을 구현하고, `Send + Sync` 확인 테스트를 하나 둔다.
- **`Copy`는 신중하게.** 작고 단순한 값 타입(`Version`, 좌표)에는 편하다. 하지만 나중에 `String` 필드를 더하면 `Copy`를 빼야 하고, 그러면 그 타입을 복사해 쓰던 사용자 코드가 깨진다. 공개 API에서는 처음부터 붙일지 정한다([API 설계 원칙](/Hongs_Blog/studies/rust/api-design/)).
- **실수 값 필드.** `f64` 필드가 하나라도 있으면 `Eq`, `Ord`, `Hash`를 `derive`할 수 없다(E0277). 돈은 원 단위 정수(`i64`)로 저장하고, 실수를 정렬해야 하면 `f64::total_cmp`를 쓴다([트레이트와 반복자 연습](/Hongs_Blog/studies/rust/traits-iterators-practice/) p1).
- **로그와 비밀값.** `#[derive(Debug)]`는 모든 필드를 찍는다. 비밀번호나 토큰이 든 타입은 `Debug`를 손으로 구현해 값을 가린다([설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/)).
- **clippy 린트.** `from_over_into`(경고), `derived_hash_with_manual_eq`와 `derive_ord_xor_partial_ord`(둘 다 오류)는 기본으로 켜져 있다. `PartialEq`만 붙이고 `Eq`를 빠뜨린 곳을 찾는 `derive_partial_eq_without_eq`는 nursery 묶음이라 기본으로 꺼져 있다[^10].
- **흔한 실수.**
  - 정렬 기준과 다른 순서로 필드를 선언해 놓고 `Ord`를 `derive`한다. 정렬이 첫 필드부터 비교한다는 것을 잊는다.
  - `PartialEq`를 손으로 고치면서 `Hash`는 그대로 둔다. 같은 기준으로 둘 다 고친다.
  - `Display` 대신 `ToString`을, `From` 대신 `Into`를 직접 구현한다.

## 연결

- 선수: [트레이트](/Hongs_Blog/studies/rust/traits/)(고아 규칙, 블랭킷 구현), [컬렉션](/Hongs_Blog/studies/rust/collections/)(`HashMap`·`BTreeMap`의 키 조건)
- 수학의 같음과 순서: [동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/), [부분순서와 위상 정렬](/Hongs_Blog/studies/discrete-math/partial-orders/)
- Java의 `==`와 `equals`: [참조 비교와 null](/Hongs_Blog/studies/java/java-reference-equality/)
- `From`과 `?`: [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/). `Display`와 에러: [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)
- `Send`·`Sync`: [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)
- 대소문자를 무시하는 키를 끝까지 만들어 보기: [트레이트와 반복자 연습](/Hongs_Blog/studies/rust/traits-iterators-practice/) p4

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"같음의 기준만 바꾸면 된다. `Hash`는 원래대로 둬도 맵이 `==`로 알아서 찾는다"</div>

틀렸다. 해시맵은 `==`를 부르기 전에 해시로 칸부터 고른다. 해시가 다르면 대개 다른 칸을 보므로 `==`까지 가지 못한다. "같은지 판단은 결국 `==`가 한다"는 말이 반만 맞아서 생기는 오해다. `==`는 같은 칸 안에서만 일한다. 확인하는 법: 위 `BrokenKey`로 `"Kim"`을 넣고 `"KIM"`으로 찾으면 `None`이고, `"KIM"`을 다시 넣으면 `len()`이 2가 된다. `Hash`도 소문자 기준으로 고치면 `Some(1)`과 1이 나온다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `PartialEq`·`Eq`·`Hash`를 손으로 구현한 키 타입 중, `HashMap`에 넣은 키를 "같은" 키로 찾지 못하게 되는 예를 하나 만들고, 왜 못 찾는지 설명하라.</summary>

**답:** `eq`는 대소문자를 무시해 비교하고(`eq_ignore_ascii_case`), `hash`는 원래 문자열을 그대로 해시하는 `BrokenKey(String)`. `"Kim"`을 넣은 뒤 `"KIM"`으로 찾으면 `None`이다(해시 씨앗을 고정한 맵에서 확인).<br>
**이유:** 두 키는 `==`로 같지만 해시가 다르다. 맵은 해시로 고른 칸 안에서만 `==`를 부르므로, 대개 `"Kim"`이 있는 칸을 보지도 않는다. $$k_1 = k_2 \Rightarrow \mathrm{hash}(k_1) = \mathrm{hash}(k_2)$$를 어긴 것이다. 같은 기준(소문자 바이트)으로 해시하면 고쳐진다.<br>
**흔한 오답:** "해시가 충돌해서 못 찾는다." 충돌은 다른 키의 해시가 같은 경우이고 맵이 `==`로 해결한다. 여기서는 반대로 같은 키의 해시가 다르다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 코드의 출력을 예측하라.</summary>

```rust
#[derive(PartialEq, Eq, PartialOrd, Ord)]
struct ByAge { age: u8, name: &'static str }
#[derive(PartialEq, Eq, PartialOrd, Ord)]
struct ByName { name: &'static str, age: u8 }

let (a1, a2) = (ByAge { age: 30, name: "kim" }, ByAge { age: 20, name: "lee" });
let (n1, n2) = (ByName { name: "kim", age: 30 }, ByName { name: "lee", age: 20 });
println!("ByAge: kim(30) < lee(20)? {}, ByName: kim(30) < lee(20)? {}", a1 < a2, n1 < n2);
```
**답:** `ByAge: kim(30) < lee(20)? false, ByName: kim(30) < lee(20)? true`<br>
**이유:** `derive`한 순서는 선언한 첫 필드부터 비교한다. `ByAge`는 `age`를 먼저 보므로 30 > 20이라 kim이 크다. `ByName`은 `name`을 먼저 보므로 `"kim" < "lee"`라 kim이 작다. 첫 필드에서 결론이 나면 둘째 필드는 보지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `struct Price { amount: f64, currency: String }`에 `derive`할 수 있는 것과 없는 것을 가르고, 없는 것은 이유를 쓰라. 후보: `Debug`, `Clone`, `Copy`, `PartialEq`, `Eq`, `PartialOrd`, `Ord`, `Hash`, `Default`</summary>

**답:** 된다: `Debug`, `Clone`, `PartialEq`, `PartialOrd`, `Default`. 안 된다: `Copy`, `Eq`, `Ord`, `Hash`.<br>
**이유:** `Copy`는 `String` 필드가 `Copy`가 아니라서 막힌다(E0204). `Eq`, `Ord`, `Hash`는 `f64`가 이 트레이트들을 구현하지 않아서 막힌다(E0277). `NaN`이 자기 자신과 같지 않아 `a == a` 약속을 못 지키기 때문이다. `PartialEq`와 `PartialOrd`는 그런 약속이 없어 된다.<br>
**흔한 오답:** "`Hash`는 아무 타입에나 붙는다." 필드가 모두 `Hash`여야 하고, `f64`는 `Hash`가 아니다.

</details>


[^1]: Rust API Guidelines, Interoperability — Types eagerly implement common traits (C-COMMON-TRAITS), Conversions use the standard traits From, AsRef, AsMut (C-CONV-TRAITS), Types are Send and Sync where possible (C-SEND-SYNC) — https://rust-lang.github.io/api-guidelines/interoperability.html
[^2]: std 문서, Trait `std::fmt::Debug` (Derivable, pretty-printing `{:#?}`, Stability) — https://doc.rust-lang.org/std/fmt/trait.Debug.html
[^3]: Rust API Guidelines, Debuggability — All public types implement Debug (C-DEBUG), Debug representation is never empty (C-DEBUG-NONEMPTY) — https://rust-lang.github.io/api-guidelines/debuggability.html
[^4]: std 문서, Trait `std::clone::Clone` — https://doc.rust-lang.org/std/clone/trait.Clone.html
[^5]: std 문서, Trait `std::marker::Copy` (When can my type be Copy?, When can't my type be Copy?, What's the difference between Copy and Clone?) — https://doc.rust-lang.org/std/marker/trait.Copy.html
[^6]: std 문서, Trait `std::cmp::PartialEq` (Derivable, symmetry·transitivity) — https://doc.rust-lang.org/std/cmp/trait.PartialEq.html
[^7]: std 문서, Trait `std::cmp::Eq` — https://doc.rust-lang.org/std/cmp/trait.Eq.html
[^8]: std 문서, Trait `std::cmp::PartialOrd` (Derivable, How can I implement PartialOrd?, consistency with PartialEq) — https://doc.rust-lang.org/std/cmp/trait.PartialOrd.html
[^9]: std 문서, Trait `std::cmp::Ord` (Derivable, consistency with PartialOrd, logic errors) — https://doc.rust-lang.org/std/cmp/trait.Ord.html
[^10]: Clippy Lints, `from_over_into`, `derived_hash_with_manual_eq`(correctness), `derive_ord_xor_partial_ord`(correctness), `derive_partial_eq_without_eq`(nursery) — https://rust-lang.github.io/rust-clippy/master/index.html (앞의 셋이 기본으로 켜진 것은 rustc 1.99.0의 `clippy-driver`로 확인했다)
[^11]: std 문서, Trait `std::hash::Hash` (Hash and Eq, Prefix collisions, logic error) — https://doc.rust-lang.org/std/hash/trait.Hash.html
[^12]: std 문서, Trait `std::default::Default` (Derivable, `#[default]`) — https://doc.rust-lang.org/std/default/trait.Default.html
[^13]: std 문서, Trait `std::fmt::Display` — https://doc.rust-lang.org/std/fmt/trait.Display.html
[^14]: std 문서, Trait `std::error::Error` ("Implementing the Error trait only requires that Debug and Display are implemented too") — https://doc.rust-lang.org/std/error/trait.Error.html
[^15]: std 문서, Trait `std::convert::From` (prefer From over Into, must not fail, `?` and From) — https://doc.rust-lang.org/std/convert/trait.From.html
[^16]: std 문서, Trait `std::convert::TryFrom` (Generic Implementations, `type Error`) — https://doc.rust-lang.org/std/convert/trait.TryFrom.html
[^17]: std 문서, Trait `std::convert::AsRef` (cheap reference-to-reference conversion, Relation to Borrow) — https://doc.rust-lang.org/std/convert/trait.AsRef.html
[^18]: The Rust Reference, Special types and traits — Auto traits — https://doc.rust-lang.org/reference/special-types-and-traits.html
{% endraw %}
