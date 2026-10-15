---
layout: "note"
title: "물음표 연산자와 에러 전파"
display_title: "물음표 연산자와 에러 전파 (Error Propagation)"
kind: "concept"
kind_label: "기법"
num: "23"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Error Propagation", "Question Mark Operator", "? operator", "Try Operator", "Box<dyn Error>", "Error source chain"]
description: "함수 안에서 실패한 일을 그 자리에서 처리하지 않고 부른 쪽에 그대로 넘기는 일을 에러 전파라고 한다. Rust에서는 실패할 수 있는 값 뒤에 ? 한 글자를 붙이면 된다. 성공이면 안의 값을 꺼내 계속 가고, 실패면 함수를 바로 끝내며 에러를 돌려준다. 이때 에러 타입을 함수가 약…"
prev_url: "/studies/rust/standard-traits/"
prev_title: "꼭 구현할 표준 트레이트"
next_url: "/studies/rust/library-errors/"
next_title: "라이브러리 에러 설계"
math: true
mermaid: false
code_count: 1
permalink: "/studies/rust/error-propagation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

함수 안에서 실패한 일을 그 자리에서 처리하지 않고 부른 쪽에 그대로 넘기는 일을 에러 전파라고 한다. Rust에서는 실패할 수 있는 값 뒤에 `?` 한 글자를 붙이면 된다. 성공이면 안의 값을 꺼내 계속 가고, 실패면 함수를 바로 끝내며 에러를 돌려준다. 이때 에러 타입을 함수가 약속한 타입으로 바꿔 주는데, 바꾸는 방법이 미리 정의돼 있지 않으면 컴파일되지 않는다. 그리고 `?`는 결과를 돌려주는 함수 안에서만 쓸 수 있다.

</div>


## 예시로 보기

설정 글에서 `port=8080` 줄을 찾아 숫자로 바꾸는 함수를 짠다. 실패할 수 있는 곳이 두 군데다. 줄이 없을 수 있고, 숫자가 아닐 수 있다. 실패할 때마다 `match`로 "실패면 돌려주고 끝"을 쓰면 본래 하려던 일이 묻힌다.

```rust
fn read_port(text: &str) -> Result<u16, ConfigError> {
    let raw = find_port(text).ok_or(ConfigError::Missing("port"))?;
    let port: u16 = raw.parse()?;
    Ok(port)
}
```

두 줄 모두 끝에 `?`가 있다. 첫 줄의 `ok_or`는 "없음"(`None`)을 "에러"(`Err`)로 바꾸고, `?`가 실패면 바로 돌려준다. 둘째 줄의 `parse()`는 실패하면 `ParseIntError`를 준다. 그런데 이 함수는 `ConfigError`를 돌려주기로 했다. `?`는 그 사이를 `From` 변환으로 잇는다. `impl From<ParseIntError> for ConfigError`가 있으니 저절로 바뀐다[^1].

같은 함수를 `match`로 풀면 이렇게 된다. 검증 코드에서 다섯 가지 입력(`port=8080`, 둘째 줄의 `port=443`, `port=http`, port 줄 없음, `port=70000`)에 대해 두 버전이 똑같은 결과를 냈다.

```rust
let port: u16 = match raw.parse::<u16>() {
    Ok(v) => v,
    Err(e) => return Err(From::from(e)),   // ? 가 하는 일
};
```

`Option`에도 `?`를 쓸 수 있다. `None`이면 함수가 바로 `None`을 돌려준다[^1].

```rust
fn find_port(text: &str) -> Option<&str> {
    let line = text.lines().find(|l| l.starts_with("port="))?;
    Some(line.trim_start_matches("port="))
}
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `?` 버전과 `match` 버전이 같은 결과, `Box<dyn Error + Send + Sync>`로 `&str`·`String`·`ParseIntError`가 모두 들어가는 것, 원인 사슬, `main`이 `Err`를 돌려줄 때 종료 코드 1과 stderr 출력, 컴파일 오류 세 가지(E0277)를 실행해 확인했다 — [23_error-propagation_verify.rs](/Hongs_Blog/studies/rust/code/23_error-propagation_verify/)</div>

</div>


## 정의

`?`는 `Result`나 `Option` 값 뒤에 붙는다. `Ok(v)`나 `Some(v)`면 식의 값이 `v`가 된다. `Err(e)`면 `e`를 `From::from`으로 바꿔 `Err`로 돌려주며 함수를 끝낸다. `None`이면 `None`을 돌려주며 끝낸다[^2].

기호로 쓰면, 반환 타입이 `Result<U, F>`인 함수 안에서 `expr: Result<T, E>`일 때

$$
\texttt{expr?} \;\equiv\; \texttt{match expr \{ Ok(v) => v, Err(e) => return Err(From::from(e)) \}}
$$


이고, 이 식이 컴파일되려면 `F: From<E>`여야 한다. 여기서 `T`는 성공 값의 타입, `E`는 `expr`의 에러 타입, `F`는 함수가 약속한 에러 타입이다. `E`와 `F`가 같으면 표준 라이브러리의 `impl<T> From<T> for T`가 있어 그대로 지나간다[^s1].

조건은 셋이다.

- `?`를 쓰는 함수의 반환 타입이 `Result`, `Option`, 또는 `FromResidual`을 구현한 타입이어야 한다[^1]. `main`도 예외가 아니다.
- `Result`에 쓴 `?`는 `Result`를 돌려주는 함수에서, `Option`에 쓴 `?`는 `Option`을 돌려주는 함수에서만 쓴다. 섞으려면 `ok_or`나 `ok()`로 먼저 바꾼다[^1].
- `Result`라면 `F: From<E>`가 있어야 한다.

<details class="callout callout-example" markdown="1">
<summary class="callout-title" markdown="span">참조서가 적은 더 정확한 모양</summary>

참조서는 `?`를 "대략" 다음과 같다고 적는다. `Try::branch`가 값을 "계속"(`Continue`)과 "멈춤"(`Break`)으로 나누고, 멈춤이면 `FromResidual::from_residual`로 반환값을 만든다[^2].

```rust
match core::ops::Try::branch(expr) {
    core::ops::ControlFlow::Continue(val) => val,
    core::ops::ControlFlow::Break(residual) =>
        return core::ops::FromResidual::from_residual(residual),
}
```

`Try` 트레이트는 아직 불안정(unstable)이라 사용자 타입에 구현할 수 없다[^2]. 그래서 안정판 Rust에서 `?`를 쓸 수 있는 것은 사실상 `Result`, `Option`, 그리고 표준 라이브러리가 준비해 둔 몇몇 타입이다.

</details>


### 조건을 어기면

검증 코드에서 세 경우를 컴파일해 보았다. 모두 E0277이다.

| 어긴 조건 | 컴파일러 메시지(앞부분) |
|---|---|
| 반환 타입이 `()`인 함수에서 `?` | ``the `?` operator can only be used in a function that returns `Result` or `Option` `` |
| `Result`를 돌려주는 함수에서 `Option`에 `?` | ``the `?` operator can only be used on `Result`s ... in a function that returns `Result` `` |
| `From` 구현이 없음 | ``` `?` couldn't convert the error to `MyErr` ``` |

마지막 오류에는 컴파일러가 이유를 직접 적는다. "the question mark operation (`?`) implicitly performs a conversion on the error value using the `From` trait".

## 어떤 에러 타입으로 모을까

### 직접 만든 enum

실패 방식이 몇 가지로 정해져 있으면 enum을 만들고 원인 타입마다 `From`을 구현한다. 예시의 `ConfigError`가 그렇다. 부른 쪽이 `match`로 종류를 가를 수 있다. 손으로 쓰는 일은 [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)의 thiserror가 줄여 준다.

### `Box<dyn Error + Send + Sync>`

어떤 에러든 담는 상자다. 책은 `Box<dyn Error>`를 우선 "어떤 종류의 에러든"으로 읽으라고 한다[^1]. 표준 라이브러리에는 `Error + Send + Sync`인 모든 타입, `&str`, `String`에서 이 상자로 가는 `From`이 있다[^3]. 그래서 한 함수 안에서 서로 다른 에러에 모두 `?`를 쓸 수 있다.

```rust
type BoxError = Box<dyn Error + Send + Sync>;

fn parse_pair(s: &str) -> Result<(i32, i32), BoxError> {
    let (a, b) = s.split_once(',').ok_or("no comma")?;    // &str
    let a: i32 = a.trim().parse()?;                       // ParseIntError
    let b: i32 = b.trim().parse()?;
    if b == 0 {
        return Err(format!("second value must not be zero: {s}").into()); // String
    }
    Ok((a, b))
}
```

`Send + Sync`를 붙이는 이유는 스레드 때문이다. `Send`가 없으면 `thread::spawn`으로 띄운 스레드에서 에러를 돌려받을 수 없다[^4]. 검증 코드는 다른 스레드에서 `parse_pair("a,b")`를 부르고 `join`으로 에러를 받아 왔다.

값을 잃는 것은 아니다. `downcast_ref::<ParseIntError>()`로 상자 안의 진짜 타입을 다시 꺼낼 수 있다. 하지만 함수 시그니처만 보고는 어떤 에러가 올지 알 수 없다. 부른 쪽이 종류별로 다르게 처리해야 한다면 enum이 낫다.

### 원인 사슬: `source()`

낮은 층의 에러를 높은 층의 에러로 감쌀 때, 원인을 버리지 않고 `source()`로 내보낸다. 표준 문서는 아래 층 모듈의 에러가 위 층 모듈의 에러로 올라갈 때 이렇게 하라고 한다[^3]. 기본 구현은 `None`이다.

```rust
impl Error for ConfigError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            ConfigError::Missing(_) => None,
            ConfigError::BadNumber(e) => Some(e),
        }
    }
}
```

`source()`를 끝까지 따라가면 사슬이 나온다. `port=-1`이면 `["port is not a number", "invalid digit found in string"]`이다.

원인을 `source()`로 내보냈다면 바깥 에러의 메시지(`Display`)에는 원인을 다시 쓰지 않는다. 표준 문서는 둘 중 하나만 하라고 적는다[^3]. 둘 다 하면 사슬을 출력할 때 같은 문장이 두 번 찍힌다.

메시지는 소문자로 시작하고 끝에 마침표를 찍지 않는 짧은 문장이 관례다[^3][^4]. 사슬을 `: `로 이어 한 줄에 찍을 때 자연스럽게 읽히기 때문이다.

### `main`이 `Result`를 돌려줄 때

`main`의 반환 타입을 `Result<(), E>`로 하면 `main` 안에서도 `?`를 쓸 수 있다. `Ok(())`면 종료 코드 0, `Err`면 0이 아닌 값으로 끝난다[^1]. 검증 코드에서 실제로 돌려 보니 다음과 같았다.

```rust
fn main() -> Result<(), std::num::ParseIntError> {
    println!("start");
    let n: i32 = "12a".parse()?;
    println!("never {n}");
    Ok(())
}
```

```
stdout: start
stderr: Error: ParseIntError { kind: InvalidDigit }
종료 코드: 1
```

stderr에는 `Display`가 아니라 `Debug` 형식이 찍힌다. 사람에게 보여 줄 메시지가 필요하면 `main`에서 직접 `eprintln!("{e}")`를 하거나 [애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/)의 anyhow를 쓴다.

## 증명

`?` 버전과 `match` 버전이 같다는 것은 참조서의 정의에서 바로 나온다[^2]. 두 함수의 각 줄이 같은 분기를 같은 순서로 밟는다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. *첫 줄.* `find_port(text).ok_or(Missing("port"))`는 `Some(v)`면 `Ok(v)`, `None`이면 `Err(Missing("port"))`다(`ok_or`의 정의). `?`는 `Ok(v)`면 `v`를, `Err(e)`면 `return Err(From::from(e))`를 한다. `e`가 이미 `ConfigError`이므로 `From::from(e)`는 `e` 자신이다(`impl<T> From<T> for T`). 이것은 `match` 버전의 `None => return Err(Missing("port"))`와 같다.
2. *둘째 줄.* `raw.parse::<u16>()`의 결과에 대해 `?`는 정의 그대로 `match` 버전의 둘째 `match`와 같은 일을 한다.
3. *마지막 줄.* 두 버전 모두 `Ok(port)`다.
4. 각 줄이 같은 값을 내거나 같은 값으로 함수를 끝내므로, 두 함수는 모든 입력에서 같은 값을 돌려준다. 검증 코드는 이것을 다섯 가지 입력으로 다시 확인했다(실험).

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`let port: u16 = raw.parse()?;`에서 `parse`는 무엇을 근거로 `u16`을 만들려고 하는가?</summary>

왼쪽의 타입 표기 `u16` 때문이다. `?`는 `Result<T, E>`에서 `T`를 꺼내므로 `T = u16`으로 정해지고, `parse::<u16>`이 고른다. 그래서 `"70000"`은 `u16` 범위를 넘어 "number too large to fit in target type" 에러가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`From` 구현이 없는 에러에 `?`를 쓰면 왜 실행 중이 아니라 컴파일할 때 걸리는가?</summary>

`?`는 `From::from(e)` 호출로 바뀐다. 트레이트 구현이 있는지는 컴파일러가 타입을 맞출 때 확인한다. 구현이 없으면 호출할 함수가 없으므로 컴파일이 멈춘다. 실행 중에 "변환 실패"라는 상황은 생기지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 기법의 핵심 아이디어는? 다른 어디에 같은 방법을 쓰는가?</summary>

실패를 값(`Err`)으로 만들고, "실패면 일찍 돌려준다"를 한 글자로 줄인 것이다. 타입 변환은 트레이트(`From`)에 맡긴다. `Option`의 `?`, async 함수 안의 `?`(퓨처가 돌려주는 `Result`에 그대로 쓴다)가 같은 구조다.

</details>


## 활용

- **알아보는 신호.** 함수 안에서 `match`나 `if let Err(e) = … { return Err(e.into()) }`가 되풀이되면 `?`로 바꾼다. clippy의 `question_mark` 린트(기본으로 켜짐)가 이런 자리를 알려 준다.
- **대표 문제 1: 파서.** 문자열을 여러 단계로 쪼개고 바꾸는 함수. 단계마다 `?`를 붙이고 에러는 enum으로 모은다. [에러와 메모리 연습](/Hongs_Blog/studies/rust/errors-memory-practice/)의 p1이 이 문제다.
- **대표 문제 2: 입출력 묶음.** 파일 열기, 읽기, 해석하기가 이어지는 함수. 책의 `read_username_from_file`처럼 `File::open(..)?`, `read_to_string(..)?`를 잇는다[^1].
- **`?` 앞에서 맥락 붙이기.** `?`는 에러를 바꿀 뿐 설명을 덧붙이지 않는다. 어느 파일이었는지 같은 정보는 `map_err`나 anyhow의 `context`로 붙인다. 붙이지 않으면 로그에 "No such file or directory"만 남아 어느 파일인지 모른다.
- **성능.** `?`는 `match`와 같은 코드로 바뀌므로 따로 드는 비용이 없다. 다만 에러 타입이 크면 `Result` 전체가 커져 성공할 때도 복사 비용이 늘 수 있다. clippy의 `result_large_err` 린트가 이 경우를 잡는다. 두 린트 모두 기본으로 켜져 있는 것을 검증 코드에서 확인했다.
- **흔한 실수.** `?`를 쓰려고 `main`의 반환 타입을 `Result<(), Box<dyn Error>>`로 바꾼 뒤 그대로 둔다. 동작은 하지만 사용자는 `Error: ParseIntError { kind: InvalidDigit }` 같은 `Debug` 출력을 보게 된다.

## 연결

- 선수: [Option과 Result](/Hongs_Blog/studies/rust/option-result/)(`ok_or`, `ok`), [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/)(`dyn Error`), [꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/)(`From`, `Display`, `Debug`)
- Java는 예외를 던지면(`throw`) 잡을 때까지 호출 스택을 저절로 거슬러 올라간다. Rust는 거슬러 올라가는 일을 `?`로 줄마다 눈에 보이게 적는다. 함수 시그니처에 실패 타입이 적힌다는 점은 Java의 `throws`와 닮았다: [예외 던지기](/Hongs_Blog/studies/java/java-throw/), [try-catch-finally](/Hongs_Blog/studies/java/java-try-catch/)
- 에러 타입 설계: [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/), [애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/)
- 복구할 수 없는 실패: [panic을 쓸 때](/Hongs_Blog/studies/rust/panic-policy/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`?`는 에러를 무시하고 넘어가는 연산자다"</div>

틀렸다. `?`는 에러를 버리지 않는다. 에러가 나면 그 자리에서 함수를 끝내고 에러를 부른 쪽에 돌려준다. 다른 언어의 안전 호출 연산자(`?.`, 값이 없으면 조용히 넘어감)와 모양이 비슷해서 그렇게 보인다. 실제로는 `return Err(From::from(e))`의 줄임이다. `?` 뒤의 줄이 실행되지 않는 것으로 확인할 수 있다. `main` 예에서 `"12a".parse()?` 다음 줄의 `never`는 찍히지 않았다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`Box<dyn Error>`를 쓰면 원래 에러의 정보가 사라진다"</div>

틀렸다. 상자는 원래 값을 그대로 담고 있다. 시그니처에 타입이 안 보일 뿐이다. `downcast_ref::<ParseIntError>()`로 다시 꺼낼 수 있고, `source()` 사슬도 남는다. 검증 코드에서 `parse_pair("x,1")`의 에러를 `ParseIntError`로 되돌렸다. 잃는 것은 "어떤 에러가 올 수 있는지 컴파일러가 알려 주는 것"이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 함수는 컴파일되는가? 안 되면 왜이고, 어떻게 고치는가? `pub fn f(v: &[i32]) -> Result<i32, String> { let x = v.first()?; Ok(*x) }`</summary>

**답:** 안 된다(E0277). `first`는 `Option`을 돌려주는데 함수는 `Result`를 돌려준다. `Option`에 쓴 `?`는 `Option`을 돌려주는 함수에서만 쓸 수 있다. `.ok_or("empty slice".to_string())?`처럼 `Result`로 먼저 바꾼다.<br>
**흔한 오답:** "`None`을 `Err`로 저절로 바꿔 준다." `?`는 `Result`와 `Option`을 섞어 주지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 본문의 `read_port`에 `"host=a\nport=443"`, `"port=http"`, `"host=a"`를 넣었을 때 각각의 결과(성공 값 또는 에러 메시지와 `source()`)를 쓰라.</summary>

**답:** `Ok(443)`. `Err`로 메시지 "port is not a number", `source()`는 "invalid digit found in string". `Err`로 메시지 "missing key \`port\`", `source()`는 `None`.<br>
**이유:** 둘째 입력에서 `parse`가 `ParseIntError`를 내고 `From`이 `BadNumber`로 감쌌다. 셋째는 `find_port`가 `None`이라 `ok_or`가 `Missing`을 만들었고, `Missing`에는 원인이 없다. 검증 코드의 실행 결과와 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `ConfigError`에서 `impl From<ParseIntError> for ConfigError`를 지우면 `read_port`의 어느 줄이 왜 컴파일되지 않는가? 첫 줄의 `?`는 왜 여전히 괜찮은가?</summary>

**답:** 둘째 줄 `raw.parse()?`가 안 된다. `?`가 `From::from(ParseIntError)`를 불러 `ConfigError`를 만들어야 하는데 그 구현이 없다. 첫 줄은 `ok_or`가 이미 `ConfigError`를 만들었으므로, 필요한 것은 `From<ConfigError> for ConfigError`이고 이것은 표준 라이브러리가 모든 타입에 준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 다음 둘 중 어디에 직접 만든 enum을, 어디에 `Box<dyn Error + Send + Sync>`를 쓰겠는가? (가) 여러 팀이 쓰는 날짜 해석 라이브러리의 공개 함수 (나) 한 번 돌리고 끝나는 데이터 이전 스크립트의 내부 함수</summary>

**답:** (가) enum, (나) `Box<dyn Error + Send + Sync>`.<br>
**이유:** (가)는 부른 쪽이 "형식이 틀림"과 "범위를 넘음"을 갈라 처리할 수 있어야 한다. 시그니처에 종류가 보여야 한다. (나)는 실패하면 메시지를 찍고 멈추면 되므로 종류를 가를 일이 없다. 어떤 에러든 `?`로 넘길 수 있는 쪽이 편하다.

</details>


[^1]: The Rust Programming Language, 9.2 Recoverable Errors with Result — "Propagating Errors", "A Shortcut for Propagating Errors: the ? Operator", "Where The ? Operator Can Be Used" — https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html
[^2]: The Rust Reference, Operator expressions — The try propagation expression — https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-try-propagation-expression
[^3]: Rust 표준 라이브러리 문서, Trait `std::error::Error` (설명, `source`, `From` 구현 목록) — https://doc.rust-lang.org/std/error/trait.Error.html
[^4]: Rust API Guidelines, Interoperability — Error types are meaningful and well-behaved (C-GOOD-ERR) — https://rust-lang.github.io/api-guidelines/interoperability.html
[^s1]: `impl<T> From<T> for T`는 표준 라이브러리의 `From` 문서에 있는 일반 구현이다. 검증 코드에서 `ok_or(ConfigError::Missing(..))?`가 변환 없이 컴파일되는 것으로 확인했다.
{% endraw %}
