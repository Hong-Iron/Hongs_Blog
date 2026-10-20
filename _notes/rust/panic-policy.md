---
layout: "note"
title: "panic을 쓸 때"
display_title: "panic을 쓸 때 (Panic Policy)"
kind: "concept"
kind_label: "기법"
num: "26"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Panic Policy", "panic!", "unwrap", "expect", "catch_unwind", "panic = abort", "JoinError", "clippy unwrap_used"]
description: "panic은 \"이 프로그램은 지금 고칠 수 없는 상태에 빠졌으니 멈춘다\"는 비상 정지 버튼이다. 버튼을 누르면 부른 쪽은 손쓸 기회를 잃는다. 그래서 일어날 수 있는 실패(잘못된 입력, 네트워크 끊김)에는 Result를 돌려주고, panic은 코드의 약속이 깨진 버그에만 쓴다. 그…"
prev_url: "/studies/rust/application-errors/"
prev_title: "애플리케이션 에러 처리"
next_url: "/studies/rust/box-heap/"
next_title: "Box와 힙"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "26_panic-policy_verify.rs", "u": "/studies/rust/code/26_panic-policy_verify/", "r": "검증"}]
permalink: "/studies/rust/panic-policy/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

panic은 "이 프로그램은 지금 고칠 수 없는 상태에 빠졌으니 멈춘다"는 비상 정지 버튼이다. 버튼을 누르면 부른 쪽은 손쓸 기회를 잃는다. 그래서 일어날 수 있는 실패(잘못된 입력, 네트워크 끊김)에는 `Result`를 돌려주고, panic은 코드의 약속이 깨진 버그에만 쓴다. 그리고 panic은 잡아서 이어 가는 장치가 아니다. 빌드 설정에 따라 잡을 기회 없이 프로세스가 바로 죽을 수도 있다.

</div>


## 예시로 보기

사용자가 보낸 나이를 읽는 코드에 `age.parse::<u8>().unwrap()`을 썼다. 누군가 `"abc"`를 보내면 요청 하나 때문에 그 스레드가 멈춘다. 이것은 예상할 수 있는 실패이므로 `Result`로 돌려줘야 한다.

반대로 코드에 적어 둔 상수 주소 `"127.0.0.1"`을 해석하는 것은 실패할 수 없다. 컴파일러는 그것을 모르지만 사람은 안다. 이때는 `expect`에 "왜 실패할 수 없는지"를 적는다[^2].

```rust
let home: IpAddr = "127.0.0.1"
    .parse()
    .expect("Hardcoded IP address should be valid");
```

메시지에 "hardcoded"라고 적어 두면, 나중에 누가 이 값을 설정 파일에서 읽게 바꿀 때 이 `expect`도 고쳐야 한다는 것이 보인다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `catch_unwind`가 잡는 payload(`&str` 또는 `String`), 스레드 panic이 `join()`의 `Err`로 오는 것, tokio 태스크 panic과 취소가 `JoinError`로 오는 것, 같은 프로그램을 `-C panic=unwind`와 `-C panic=abort`로 빌드했을 때의 차이, clippy 린트 이름을 실행해 확인했다 — [26_panic-policy_verify.rs](/Hongs_Blog/studies/rust/code/26_panic-policy_verify/)</div>

</div>


## 언제 panic하는가

책의 기준을 정리하면 이렇다[^2].

| 상황 | 쓰는 것 |
|---|---|
| 실패가 예상되는 일: 사용자 입력 해석, 파일·네트워크, 남이 보낸 데이터 | `Result` |
| 부른 쪽이 약속을 어김(계약 위반): 범위 밖 번호, 비어 있으면 안 되는 목록 | panic. 문서에 `# Panics`로 적는다 |
| 이후 코드가 "이 상태는 아니다"에 기대고 있고, 계속 가면 위험하거나 결과가 틀림 | panic |
| 예제 코드, 시제품, 테스트 | `unwrap`·`expect` 허용 |

panic하기 전에 먼저 타입으로 막을 수 있는지 본다. 값이 늘 있어야 하면 `Option`이 아닌 타입을, 음수가 없어야 하면 `u32`를 쓴다. 1~100만 받는 값이면 검사를 생성자 한 곳에 두는 타입을 만든다[^2]. 이 방법은 [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)에서 다룬다.

표준 라이브러리의 배열 번호 접근 `v[i]`가 범위를 넘으면 panic하는 것도 같은 생각이다. 범위 밖 메모리를 읽게 두면 보안 문제가 되므로 멈춘다[^2]. 실패를 값으로 받고 싶으면 `v.get(i)`가 `Option`을 준다.

## panic이 나면 무슨 일이 생기나

기본 동작은 풀기(unwinding)다. 스택을 거슬러 올라가며 함수마다 값들을 정리(`Drop`)한다[^1]. 다른 동작은 중단(abort)이다. 정리 없이 프로세스를 바로 끝내고 메모리는 운영체제가 회수한다[^1]. `Cargo.toml`의 프로필에서 고른다.

```toml
[profile.release]
panic = "abort"
```

`dev`와 `release` 프로필의 기본값은 모두 `"unwind"`다[^6]. 테스트와 벤치마크는 이 설정을 따르지 않고 늘 풀기로 돈다[^6]. 그래서 `abort`로 내보내는 실행 파일과 테스트의 동작이 다를 수 있다.

같은 프로그램을 두 방식으로 빌드해 돌려 보았다. `catch_unwind` 안에서 `Drop`을 구현한 값을 만든 뒤 panic한다.

| 빌드 | 종료 | stdout |
|---|---|---|
| `-C panic=unwind` | 코드 0 | `drop guard`, `caught = true` |
| `-C panic=abort` | 신호 6(SIGABRT) | 없음 |

`abort`에서는 `Drop`도 돌지 않았고 `catch_unwind`도 잡지 못했다. `catch_unwind` 문서도 풀기 panic만 잡고 프로세스를 끝내는 panic은 잡지 못한다고 적는다[^3]. 버퍼에 남은 로그를 `Drop`에서 비우는 코드가 있다면 `abort`에서는 그 로그가 사라진다.

## panic을 잡는 곳들

### `catch_unwind`

<code>std::panic::catch_unwind(&#124;&#124; ..)</code>는 클로저 안의 풀기 panic을 `Err(payload)`로 바꾼다. 하지만 문서는 이것을 일반적인 try/catch로 쓰지 말라고 한다. 자주 실패할 수 있는 함수에는 `Result`가 맞다[^3]. 주로 쓰는 곳은 경계다. C 같은 다른 언어에서 부르는 함수, 플러그인을 돌리는 호스트, 스레드 풀이 작업 하나의 panic 때문에 같이 죽지 않게 하는 곳이다.

payload는 `Box<dyn Any + Send>`다. 검증 코드에서 `panic!("literal message")`는 `&str`, 실행 중 값을 넣은 `panic!("formatted {n}")`은 `String`이었다. 그런데 `panic!("worker {} failed", 3)`처럼 인자가 상수면 컴파일러가 문장을 미리 합쳐 `&str`이 됐다. 그래서 payload를 꺼낼 때는 둘 다 시도한다.

### 스레드

다른 스레드에서 난 panic은 그 스레드만 끝낸다. `JoinHandle::join()`이 `Err`에 `panic!`의 인자를 담아 돌려준다[^4]. 검증 코드에서 panic한 스레드의 `join()`은 `Err("worker 3 failed")`였고, 옆 스레드의 `join()`은 `Ok(42)`였다. 스레드 이야기는 [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)에서 이어진다.

### tokio 태스크

`tokio::spawn`으로 띄운 태스크가 panic하면, 그 핸들을 `await`한 쪽이 `JoinError`를 받는다. `is_panic()`이 참이고 `into_panic()`으로 payload를 꺼낸다[^5]. 태스크를 `abort()`로 취소한 경우에도 `JoinError`가 오지만 `is_cancelled()`가 참이다[^5]. 검증 코드에서 panic한 태스크 옆의 다른 태스크는 정상 값 5를 돌려줬다. 자세한 것은 [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/).

## `unwrap`·`expect`를 코드에서 막기

clippy의 `unwrap_used`와 `expect_used`는 restriction 묶음이라 기본으로 꺼져 있다[^7]. 켜면 `Option`·`Result`의 `unwrap()`·`expect()`를 모두 경고한다. 검증 코드에서 clippy를 직접 돌려 두 이름이 실제로 걸리는 것을 확인했다.

```
warning: used `unwrap()` on an `Option` value
  = help: ... index.html#unwrap_used
```

정책은 보통 이렇게 둔다. 제품 코드에서는 `unwrap`을 금지하고, `expect`는 이유를 적어 허용하며, 테스트에서는 둘 다 허용한다. 크레이트 맨 위에 한 줄로 적을 수 있다.

```rust
#![cfg_attr(not(test), deny(clippy::unwrap_used))]
```

테스트 빌드(`cfg(test)`)에서는 이 줄이 빠지므로 테스트 안의 `unwrap`은 통과한다. 이 파일의 검증 코드가 이 설정으로 clippy를 통과했다. CI에 넣는 법은 [CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/)에서 다룬다.

## 활용

- **서버.** 요청 하나의 실패로 프로세스 전체가 죽으면 안 된다. 요청 처리 경로에서는 `Result`만 쓰고, 그래도 생기는 panic(버그)은 tokio가 태스크 단위로 가둬 준다. 다만 `panic = "abort"`로 빌드하면 이 가둠도 없다. 서버에 `abort`를 쓰려면 "버그면 프로세스를 재시작한다"는 운영 전제가 있어야 한다.
- **`abort`를 고르는 이유.** 실행 파일을 가능한 한 작게 만들 때 쓴다고 책은 적는다[^1]. 버그 상태에서 정리 코드를 돌리는 것 자체가 위험하다고 볼 때도 쓴다.
- **백트레이스.** `RUST_BACKTRACE=1`이면 panic 지점까지의 호출 목록을 찍는다[^1]. 위에서부터 읽다가 내가 쓴 파일이 처음 나오는 곳이 문제 지점이다[^1].
- **흔한 실수.** `expect("failed")`처럼 아무 정보 없는 메시지. "무엇이 왜 성공해야 했는지"를 적는다.
- **흔한 실수.** `catch_unwind`로 panic을 잡은 뒤 같은 데이터로 계속 일한다. panic이 난 순간 데이터가 반쯤 바뀐 상태일 수 있다. 그래서 `catch_unwind`는 클로저가 붙잡은 값들이 그래도 괜찮다는 표시(`UnwindSafe`)를 요구한다[^3].

## 연결

- 선수: [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)
- 복구할 수 있는 실패의 처리: [애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/)
- Java의 `RuntimeException`(검사하지 않는 예외)이 비슷한 자리다. 다만 Java는 그것도 `catch`로 잡아 이어 가는 것이 흔하고, Rust는 잡는 것을 경계에서만 한다: [예외와 예외 클래스](/Hongs_Blog/studies/java/java-exception/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 각각에 `Result`와 panic 중 무엇을 쓰는가? (가) JSON 요청 본문 해석 (나) 함수 문서에 "`k`는 0보다 커야 한다"고 적었는데 0이 들어옴 (다) 상수 정규식 문자열의 컴파일 (라) 디스크가 가득 차 로그 쓰기 실패</summary>

**답:** (가) `Result`. (나) panic(계약 위반, `# Panics`에 적는다). (다) `expect`로 panic(실패할 수 없음을 메시지에 적는다). (라) `Result`.<br>
**이유:** (가)(라)는 정상 운영 중에도 일어나는 실패다. (나)는 부른 쪽의 버그다. (다)는 코드가 맞으면 절대 실패하지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `catch_unwind`로 감싼 클로저 안에서 panic이 났다. 개발용 빌드에서는 `Err`로 잡혔는데 배포용 빌드에서는 프로세스가 죽었다. 무엇이 다른가?</summary>

**답:** 배포용 프로필에 `panic = "abort"`가 있다. 중단 방식에서는 panic이 스택을 풀지 않고 프로세스를 바로 끝내므로 `catch_unwind`가 잡을 기회가 없다. `Drop`도 돌지 않는다.<br>
**흔한 오답:** "배포용은 최적화 때문에 panic이 사라진다." panic은 사라지지 않는다. 처리 방식이 바뀐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 스레드 두 개를 띄운다. 하나는 `panic!("worker {worker_id} failed")`(`worker_id`는 실행 중 값 3), 다른 하나는 `40 + 2`를 돌려준다. 두 `join()`의 결과와 첫 payload의 타입은?</summary>

**답:** 첫째는 `Err(payload)`, payload는 `String`이고 내용은 `"worker 3 failed"`. 둘째는 `Ok(42)`.<br>
**이유:** panic은 그 스레드만 끝낸다. 실행 중 값을 넣어 만든 메시지는 `String`이 된다. 검증 코드의 실행 결과와 같다.

</details>


[^1]: The Rust Programming Language, 9.1 Unrecoverable Errors with panic! — "Unwinding the Stack or Aborting in Response to a Panic", "Using a panic! Backtrace" — https://doc.rust-lang.org/book/ch09-01-unrecoverable-errors-with-panic.html
[^2]: The Rust Programming Language, 9.3 To panic! or Not to panic! — https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html
[^3]: Rust 표준 라이브러리 문서, Function `std::panic::catch_unwind` — https://doc.rust-lang.org/std/panic/fn.catch_unwind.html
[^4]: Rust 표준 라이브러리 문서, Struct `std::thread::JoinHandle` — `join` — https://doc.rust-lang.org/std/thread/struct.JoinHandle.html
[^5]: tokio 1.53.3 문서(docs.rs), Struct `tokio::task::JoinError` — https://docs.rs/tokio/latest/tokio/task/struct.JoinError.html
[^6]: The Cargo Book, Profiles — panic — https://doc.rust-lang.org/cargo/reference/profiles.html
[^7]: Clippy Lints, `expect_used`(restriction) 항목 — https://rust-lang.github.io/rust-clippy/master/index.html#expect_used . `unwrap_used`는 같은 목록의 restriction 묶음 린트로, 검증 코드에서 clippy 1.99로 이름과 경고문을 확인했다.
{% endraw %}
