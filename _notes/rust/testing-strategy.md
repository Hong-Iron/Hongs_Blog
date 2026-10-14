---
layout: "note"
title: "테스트 전략"
display_title: "테스트 전략 (Testing Strategy)"
kind: "concept"
kind_label: "기법"
num: "42"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Testing Strategy", "Unit Test", "단위 테스트", "Integration Test", "통합 테스트", "Doc Test", "doc 테스트", "should_panic", "Property-based Testing", "성질 테스트", "proptest", "Shrinking", "축소", "cargo-nextest", "tokio::test", "Snapshot Test", "Golden Test", "골든 테스트"]
description: "테스트는 그물을 여러 겹 치는 일이다. 작은 함수 하나를 보는 촘촘한 그물(단위 테스트), 바깥 사용자처럼 공개된 문만 두드리는 그물(통합 테스트), 문서의 예제가 아직 맞는지 보는 그물(doc 테스트), 입력을 수백 개 지어내 규칙이 깨지는지 보는 그물(성질 테스트)이 있다. 겹…"
prev_url: "/studies/rust/modules-workspaces/"
prev_title: "모듈과 워크스페이스"
next_url: "/studies/rust/tracing-observability/"
next_title: "tracing으로 관측하기"
math: true
mermaid: false
code_count: 1
permalink: "/studies/rust/testing-strategy/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

테스트는 그물을 여러 겹 치는 일이다. 작은 함수 하나를 보는 촘촘한 그물(단위 테스트), 바깥 사용자처럼 공개된 문만 두드리는 그물(통합 테스트), 문서의 예제가 아직 맞는지 보는 그물(doc 테스트), 입력을 수백 개 지어내 규칙이 깨지는지 보는 그물(성질 테스트)이 있다. 겹마다 잡는 버그가 다르다. 테스트가 통과해도 시험하지 않은 입력에 대해서는 아무것도 말해 주지 않는다. 그래서 "이 입력에서 이 값"보다 "어떤 입력에서도 이 규칙"을 적을 수 있으면 그쪽이 더 많이 잡는다.

</div>


## 예시로 보기

단축 주소 서비스는 숫자 ID를 짧은 62진 문자열로 바꾼다. `encode(62)`가 `"10"`인지 손으로 하나 확인해도, `u64::MAX`에서 넘치는지, 어떤 수에서 `decode(encode(n))`이 `n`으로 돌아오지 않는지는 모른다. 검증 코드는 여기에 테스트 다섯 종류를 붙였다.

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;

    #[test]
    fn encodes_small_numbers() {
        assert_eq!(encode(10), "A");
        assert_eq!(encode(3843), "zz"); // 62*62 - 1
    }

    #[test]
    #[should_panic(expected = "whole must be positive")]
    fn percent_of_zero_panics() {
        percent(1, 0);
    }

    proptest! {
        #[test]
        fn roundtrip(n in any::<u64>()) {
            prop_assert_eq!(decode(&encode(n)), Some(n));
        }
    }

    #[tokio::test]
    async fn retry_gives_up() {
        assert_eq!(with_retry(10, 3).await, Err("gave up after 3 attempts".into()));
    }
}
```

`roundtrip` 하나가 손으로 쓴 예 수백 개 몫을 한다. proptest는 기본으로 입력 256개를 지어낸다[^5].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 테스트들과 골든 비교, 축소 결과, 임시 cargo 패키지에서 돌린 단위·통합·doc 테스트 결과를 실제로 실행해 확인했다 — [42_testing-strategy_verify.rs](/Hongs_Blog/studies/rust/code/42_testing-strategy_verify/)</div>

</div>


## 테스트 종류와 위치

| 종류 | 위치 | 볼 수 있는 것 | 실행 |
|---|---|---|---|
| 단위 테스트 | 같은 파일의 `#[cfg(test)] mod tests` | private 함수까지 | `cargo test` |
| 통합 테스트 | 패키지 맨 위 `tests/` 폴더 | 라이브러리의 `pub`만 | `cargo test --test 이름` |
| doc 테스트 | `///` 문서 주석의 코드 블록 | `pub`만 | `cargo test --doc` |

- **단위 테스트.** `#[cfg(test)]`가 붙은 모듈은 `cargo test` 때만 컴파일된다. `cargo build` 결과물에는 들어가지 않는다[^2]. 테스트 모듈도 그냥 자식 모듈이라 `use super::*;`로 부모의 private 함수를 부를 수 있다([모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/)의 "private은 자손에게 보인다")[^2].
- **통합 테스트.** `tests/`의 파일 하나하나가 따로 된 크레이트다. 그래서 바깥 사용자처럼 `use 패키지이름::…`으로 공개 API만 쓴다[^2]. 바이너리 크레이트(`main.rs`만 있는 패키지)는 가져다 쓸 수 없으니, 코드를 `lib.rs`에 두고 `main.rs`를 얇게 둔다[^2].
- **공유 도우미.** `tests/common.rs`로 두면 그것도 테스트 크레이트로 취급돼 "running 0 tests" 칸이 생긴다. `tests/common/mod.rs`에 두고 각 테스트 파일에서 `mod common;`으로 부른다[^2].
- **doc 테스트.** 문서 주석의 코드 블록은 그대로 테스트가 된다. `fn main`이 없으면 rustdoc이 감싸 준다. `#`로 시작하는 줄은 문서에는 안 보이고 컴파일에는 들어간다[^3].

검증 코드는 `lib.rs`(단위 테스트 1개, doc 예제 2개)와 `tests/api.rs`, `tests/common/mod.rs`를 가진 임시 패키지를 만들고 `cargo test`를 돌렸다. 결과 묶음이 넷 나왔다.

```text
Running unittests src/lib.rs        test tests::private_helper_is_testable_here ... ok
Running tests/api.rs                test doubles_public_api ... ok
Doc-tests shortcode                 test src/lib.rs - double (line 3) ... ok
                                    test src/lib.rs - double (line 7) - compile fail ... ok
```

`tests/common/mod.rs`는 따로 묶음을 만들지 않았다. doc 테스트가 두 묶음으로 나온 것은 2024 에디션 때문이다. 2024 에디션부터 rustdoc은 합칠 수 있는 doc 테스트를 하나로 합쳐 컴파일한다. `compile_fail`처럼 합칠 수 없는 것은 따로 돈다[^3].

### doc 테스트 표시

| 표시 | 뜻 |
|---|---|
| `should_panic` | 컴파일은 되고 실행 중에 panic해야 통과[^3] |
| `no_run` | 컴파일만 하고 실행하지 않는다. 네트워크가 필요한 예제에 쓴다[^3] |
| `compile_fail` | 컴파일이 실패해야 통과. 다음 Rust 버전에서 컴파일될 수도 있다는 점은 주의[^3] |
| `ignore` | 아예 건너뛴다. 거의 쓸 일이 없다[^3] |

## 실패를 기대하는 테스트

`#[should_panic]`은 함수가 panic해야 통과한다. 이유가 다른 panic도 통과시키므로 `expected = "…"`로 메시지 일부를 적는다. 메시지에 그 글자가 없으면 실패한다[^1].

테스트 함수가 `Result<(), E>`를 돌려주게 할 수도 있다. 그러면 몸통에서 `?`를 쓸 수 있고, `Err`가 나오면 실패다. 이런 테스트에는 `#[should_panic]`을 붙일 수 없다. `Err`를 기대할 때는 `assert!(value.is_err())`를 쓴다[^1].

## 성질 테스트와 축소

성질 테스트(property-based testing)는 "모든 입력에서 맞아야 하는 규칙"을 적고, 도구가 입력을 지어내 규칙을 깨려 한다[^4]. 서비스 코드에서 잘 통하는 규칙은 이렇다.

| 규칙 모양 | 예 |
|---|---|
| 왕복 | `decode(encode(n)) == Some(n)`, 직렬화 후 역직렬화 |
| 불변식 | 고르게 나눈 몫의 합은 전체와 같고, 최댓값과 최솟값의 차는 1 이하 |
| 기준 구현과 비교 | 빠른 구현의 결과가 느리지만 확실한 구현과 같다 |
| 멱등 | 경로 정리를 두 번 해도 한 번 한 것과 같다 |

규칙이 깨지면 proptest는 실패한 입력을 더 작은 입력으로 줄여 가며 여전히 실패하는 가장 작은 것을 찾는다. 이것을 축소(shrinking)라 부른다[^4].

검증 코드에 일부러 틀린 `buggy_encode`를 넣었다. 글자 3칸짜리 버퍼를 써서, 62진 네 자리 이상인 수($$62^3 = 238328$$ 이상)에서 앞자리를 잃는다. `0..1_000_000`에서 처음 찾은 실패 입력은 아무 큰 수지만, 축소를 마친 결과는 정확히 `238328`이다. 바로 그 수가 버그가 시작되는 경계다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">축소는 "국소적으로 가장 작은" 반례를 준다</div>

실패 범위가 이어져 있지 않으면 전체에서 가장 작은 반례가 아닐 수 있다. 검증 코드의 첫 시도에서는 62진 글자표의 61번 글자를 잘못 적은 버그를 썼다. 가장 작은 반례는 61인데, 축소 결과는 `772581`이었다. 이 수에서 더 줄인 후보들은 모두 통과했기 때문이다.

</div>


- 기본 입력 개수는 256개이고 환경 변수 `PROPTEST_CASES`로 바꾼다[^5].
- 실패한 입력은 기본으로 `proptest-regressions` 폴더에 기록된다. 기록을 끄려면 환경 변수 `PROPTEST_DISABLE_FAILURE_PERSISTENCE`를 쓴다[^5].

## async 코드 테스트

`#[tokio::test]`는 테스트마다 새 런타임을 만들고 async 함수를 돌린다. 기본은 스레드 하나짜리 런타임(current_thread)이다[^6]. 여러 스레드에서 돌아야 드러나는 문제를 보려면 `#[tokio::test(flavor = "multi_thread", worker_threads = 2)]`로 쓴다[^6]. 시간을 멈춘 채 시작하는 `start_paused = true`는 tokio의 `test-util` 기능이 켜져 있어야 한다[^6]. 이 과목의 harness는 `full`만 켜서 `test-util`이 없으므로 쓰지 않았다.

## 골든·스냅샷 테스트

출력이 긴 함수(보고서, 오류 메시지, JSON 응답)는 기대 출력을 통째로 적어 두고 비교한다. 이것을 골든(golden) 테스트라 부른다. 검증 코드의 `render_report`는 세 줄짜리 표를 만들고, 테스트는 `GOLDEN_REPORT` 상수와 글자 하나까지 같은지 본다. 출력 모양을 일부러 바꿨으면 상수도 함께 고쳐 리뷰에 드러나게 한다.

기대 출력을 파일로 관리해 주는 도구가 insta다. `assert_debug_snapshot!`은 값의 `Debug` 출력을 저장해 두고 비교한다. 새 출력은 `.new`가 붙은 파일로 옆에 생기고, `cargo insta review`로 하나씩 받아들이거나 버린다[^7]. harness에는 insta가 없어 코드에서는 상수 비교로 같은 생각만 보였다.

## cargo-nextest

cargo-nextest는 `cargo test` 대신 쓰는 실행기다. `cargo nextest run`으로 돌린다[^8]. 테스트 하나마다 프로세스 하나를 띄운다. 한 테스트가 전역 상태를 망가뜨리거나 죽어도 다른 테스트에 번지지 않는다. 대신 테스트끼리 메모리 속 상태를 나눠 쓸 수 없다[^9].

nextest는 doc 테스트를 돌리지 못한다. 안정판 Rust의 제약 때문이고, doc 테스트는 `cargo test --doc`으로 따로 돌리라고 안내한다[^8]. CI에서 nextest로 바꿀 때 이 단계를 빠뜨리면 doc 예제가 깨져도 아무도 모른다.

## 활용

- **어느 층에 무엇을.** 순수 함수(인코딩, 검증, 계산)는 단위 테스트와 성질 테스트로 촘촘히 본다. HTTP 라우터는 `tower::ServiceExt::oneshot`으로 소켓 없이 요청을 넣어 본다([axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)). 진짜 소켓과 DB까지 거치는 테스트는 몇 개만 둔다. 느리고 깨지기 쉽기 때문이다.
- **설정은 함수 인자로.** 환경 변수를 테스트에서 바꾸는 `std::env::set_var`는 2024 에디션에서 `unsafe`다. 테스트는 여러 스레드에서 동시에 돌므로 서로 간섭한다. 설정을 읽는 함수가 "이름 → 값" 함수를 받게 하면 테스트에서 `HashMap`을 넘긴다([설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/)).
- **흔한 실수.** 같은 임시 파일·포트·DB 이름을 여러 테스트가 쓴다. `cargo test`는 테스트를 스레드 여러 개로 동시에 돌린다. 이름에 프로세스 ID나 테스트 이름을 넣고, 포트는 `127.0.0.1:0`으로 운영체제에 맡긴다.
- **흔한 실수.** `#[should_panic]`에 `expected`를 빼서, 엉뚱한 줄의 `unwrap()` panic에도 테스트가 통과한다.
- **CI.** `cargo clippy --all-targets -- -D warnings`로 테스트 코드도 린트한다. 이 과목의 검사기도 `--tests`로 한 번 더 clippy를 돌린다([CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/)).

## 연결

- 테스트 위치와 가시성 규칙: [모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/)
- panic과 `Result` 중 무엇을 기대할지: [panic을 쓸 때](/Hongs_Blog/studies/rust/panic-policy/), [Option과 Result](/Hongs_Blog/studies/rust/option-result/)
- async 테스트가 쓰는 런타임: [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)
- 연습: [서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/)의 p2

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** private 함수 `fn checksum(code: &str) -> u8`를 시험하고 싶다. `tests/checksum.rs`에 둘까, 같은 파일의 `#[cfg(test)] mod tests`에 둘까? 다른 쪽은 왜 안 되는가?</summary>

**답:** 같은 파일의 `mod tests`에 둔다.<br>
**이유:** `tests/` 파일은 따로 된 크레이트라 라이브러리의 `pub` 항목만 쓴다. private `checksum`은 보이지 않아 E0603이 난다. `mod tests`는 자식 모듈이라 `use super::*;`로 부모의 private 항목을 본다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `vec![total / parts as u64; parts]`로 몫을 나누는 틀린 함수를, 세 성질(길이 = parts, 합 = total, 최대 − 최소 ≤ 1)로 proptest에 넣었다. 입력 범위는 `total ∈ 0..10000`, `parts ∈ 1..50`이다. 축소가 끝난 반례 `(total, parts)`와 그때 함수의 결과를 예측하라.</summary>

**답:** `(1, 2)`, 결과는 `[0, 0]`. 합이 0이라 "합 = total"이 깨진다.<br>
**이유:** 나머지가 0이 아니면 언제나 깨진다. 축소는 두 값을 아래로 줄여 가는데, `total`이 0이면 나머지가 없어 통과하고, `parts`가 1이면 나머지가 늘 0이라 통과한다. 그래서 둘 다 그보다 하나 큰 `(1, 2)`에서 멈춘다. 실행 결과도 `Some((1, 2))`, `Some([0, 0])`이었다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 팀이 CI의 `cargo test`를 `cargo nextest run`으로 바꿨다. 그 뒤로 README와 문서 주석의 예제가 깨져도 CI가 초록색이다. 왜인가? 어떻게 고치는가?</summary>

**답:** nextest는 doc 테스트를 돌리지 않는다. CI에 `cargo test --doc` 단계를 따로 넣는다.<br>
**이유:** nextest 문서는 안정판 Rust의 제약 때문에 doc 테스트를 지원하지 못한다고 적고, 별도 단계로 돌리라고 안내한다.

</details>


[^1]: The Rust Programming Language, 11.1 How to Write Tests (Checking for Panics with should_panic; Using Result<T, E> in Tests) — https://doc.rust-lang.org/book/ch11-01-writing-tests.html
[^2]: The Rust Programming Language, 11.3 Test Organization (Unit Tests, Integration Tests, Submodules in Integration Tests, Integration Tests for Binary Crates) — https://doc.rust-lang.org/book/ch11-03-test-organization.html
[^3]: The rustdoc book, Documentation tests (Pre-processing examples, Hiding portions of the example, Attributes, Merging doctests) — https://doc.rust-lang.org/rustdoc/write-documentation/documentation-tests.html
[^4]: Proptest book, Introduction — https://proptest-rs.github.io/proptest/intro.html
[^5]: proptest 문서, `test_runner::Config` (`cases`, `failure_persistence`) — https://docs.rs/proptest/latest/proptest/test_runner/struct.Config.html
[^6]: tokio 문서, attribute macro `tokio::test` (Multi-threaded runtime, Configure the runtime to start with time paused) — https://docs.rs/tokio/latest/tokio/attr.test.html
[^7]: insta 문서, Quickstart (Reviewing Snapshots) — https://insta.rs/docs/quickstart/
[^8]: cargo-nextest 문서, Running tests (doctests 각주) — https://nexte.st/docs/running/
[^9]: cargo-nextest 문서, Why process-per-test? — https://nexte.st/docs/design/why-process-per-test/
{% endraw %}
