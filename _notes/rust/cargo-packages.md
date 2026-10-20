---
layout: "note"
title: "cargo와 패키지 구조"
display_title: "cargo와 패키지 구조 (Cargo)"
kind: "concept"
kind_label: "모델"
num: "02"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Cargo", "Cargo.toml", "Cargo.lock", "매니페스트", "Manifest", "에디션", "Edition", "프로필", "Profile", "rust-toolchain.toml", "기능", "Feature", "크레이트", "Crate", "패키지", "Package"]
description: "cargo는 Rust 프로젝트의 집사다. 새 프로젝트 뼈대를 만들고, 남이 만든 라이브러리를 받아 오고, 컴파일하고, 테스트하고, 문서를 만든다. 설정은 Cargo.toml 한 파일에 적고, 실제로 받은 라이브러리의 정확한 판 번호는 Cargo.lock에 자동으로 적힌다. 같은 코…"
prev_url: "/studies/rust/why-rust/"
prev_title: "Rust가 푸는 문제"
next_url: "/studies/rust/values-variables-types/"
next_title: "값·변수·타입"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "02_cargo-packages_verify.rs", "u": "/studies/rust/code/02_cargo-packages_verify/", "r": "검증"}]
permalink: "/studies/rust/cargo-packages/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

cargo는 Rust 프로젝트의 집사다. 새 프로젝트 뼈대를 만들고, 남이 만든 라이브러리를 받아 오고, 컴파일하고, 테스트하고, 문서를 만든다. 설정은 `Cargo.toml` 한 파일에 적고, 실제로 받은 라이브러리의 정확한 판 번호는 `Cargo.lock`에 자동으로 적힌다. 같은 코드라도 개발용 빌드와 배포용 빌드는 결과가 다르다. 개발용은 정수가 넘치면 멈추고, 배포용은 조용히 감아 돈다.

</div>


## 예시로 보기

C로 과제를 할 때는 `gcc` 옵션을 외우고, 라이브러리를 직접 내려받아 경로를 맞췄다. 파일이 열 개만 넘어도 Makefile이 필요했다. cargo는 이 일을 명령 하나로 한다.

```sh
cargo new hello      # 뼈대 만들기
cd hello
cargo run            # 컴파일하고 실행
```

`cargo new`는 `Cargo.toml` 파일 하나와 `src/main.rs`가 든 `src` 폴더를 만들고, 새 git 저장소와 `.gitignore`도 만든다[^1]. rustc 1.99.0의 cargo가 만든 `Cargo.toml`은 이렇다.

```toml
[package]
name = "hello"
version = "0.1.0"
edition = "2024"

[dependencies]
```

`[package]`에는 이 패키지의 이름·판 번호·에디션을 적고, `[dependencies]`에는 가져다 쓸 라이브러리를 적는다. 처음 빌드하면 `Cargo.lock`이 생긴다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 임시 폴더에서 `cargo new`가 만든 `Cargo.toml`(위와 같음), 첫 빌드 뒤 `Cargo.lock`이 생기는 것, dev·release 빌드의 `debug_assertions`와 넘침 결과, `--features`, `cargo check`가 실행 파일을 만들지 않는 것, 기능 이름 오타 경고, `env!`로 읽은 패키지 이름을 확인했다 — [02_cargo-packages_verify.rs](/Hongs_Blog/studies/rust/code/02_cargo-packages_verify/)</div>

</div>


## 이름 정리: 크레이트와 패키지

- **크레이트(crate)**: 컴파일러가 한 번에 번역하는 단위다. 실행 파일 하나나 라이브러리 하나가 크레이트 하나다.
- **패키지(package)**: `Cargo.toml` 하나로 묶인 크레이트들이다. 라이브러리 크레이트는 많아야 하나, 실행 파일 크레이트는 여러 개 둘 수 있다.

폴더 모양은 정해져 있어서 따로 설정하지 않아도 cargo가 찾는다[^2].

```
hello/
├── Cargo.toml       패키지 설정(매니페스트)
├── Cargo.lock       실제로 고른 의존성 판 번호
├── src/
│   ├── main.rs      기본 실행 파일
│   ├── lib.rs       기본 라이브러리 (있으면)
│   └── bin/         실행 파일을 더 둘 때. 파일 하나가 실행 파일 하나
├── tests/           통합 테스트
├── examples/        예제 프로그램
├── benches/         성능 측정
└── target/          빌드 결과. git에 넣지 않는다
```

## Cargo.toml의 주요 칸

| 칸 | 뜻 |
|---|---|
| `name`, `version` | 패키지 이름과 판 번호 |
| `edition` | 어느 Rust 에디션의 문법 규칙으로 컴파일할지 |
| `rust-version` | 이 패키지가 지원하는 가장 낮은 Rust 판 |
| `description`, `license`, `repository` | crates.io에 올릴 때 보이는 정보 |
| `publish = false` | 실수로 crates.io에 올리지 않게 막는다 |

이 표는 Cargo Book의 매니페스트 장에서 고른 것이다[^3].

### 에디션

Rust는 하위 호환을 깨는 변경을 다음 에디션으로 미룬다. 에디션은 골라서 켜는 것이라, 옛 크레이트는 직접 옮기지 않는 한 영향을 받지 않는다. 에디션이 다른 크레이트끼리도 문제없이 섞어 쓸 수 있어야 한다는 것이 가장 중요한 규칙이다[^4].

`edition` 칸을 빼면 하위 호환을 위해 2015 에디션으로 컴파일한다[^3]. `cargo new`는 지금 2024를 적어 주므로[^3] 손으로 만든 `Cargo.toml`에서만 조심하면 된다. 이 과목은 2024 에디션을 쓴다.

### 패키지가 자기 정보를 읽기

cargo는 컴파일할 때 `Cargo.toml`의 정보를 환경 변수로 넣어 준다. 코드에서는 `env!` 매크로로 읽는다. 값은 컴파일할 때 문자열로 박힌다. `Cargo.toml`에 없는 칸은 빈 문자열 `""`이다[^5].

```rust
println!("{} {}", env!("CARGO_PKG_NAME"), env!("CARGO_PKG_VERSION"));
// 검증 코드가 빌드되는 패키지에서는 "vault-rust 0.1.0"
```

`--version` 출력을 만들 때 판 번호를 두 곳에 적지 않아도 된다.

## Cargo.lock: 넣을까 말까

`Cargo.toml`에는 `serde = "1.0"`처럼 "1.0 이상이면서 호환되는 판"을 적는다. 실제로 1.0.229를 받았는지 1.0.230을 받았는지는 `Cargo.lock`에 적힌다. lock 파일 덕분에 다른 날, 다른 컴퓨터에서도 똑같은 의존성으로 빌드된다[^6].

Cargo Book의 현재 입장은 "필요에 따라"다. `cargo new`는 기본으로 `Cargo.lock`을 git에 넣는 설정으로 만든다. 넣으면 `git bisect`로 버그 원인을 찾기 쉽고, CI가 외부 판 변화 때문이 아니라 새 커밋 때문에만 실패한다. 다만 라이브러리를 쓰는 사람에게는 `Cargo.lock`이 아무 영향이 없다. 그 사람의 빌드는 `Cargo.toml`만 본다. 그래서 lock 파일만 믿으면 최신 의존성과 맞는지 모르는 채 지나갈 수 있다[^6].

실무에서 정리하면 이렇다.

- 서비스·명령줄 도구처럼 실행 파일을 배포한다: 넣는다. 배포한 바이너리가 어떤 판으로 만들어졌는지 남는다.
- 라이브러리: 넣어도 되지만, CI에서 최신 의존성으로도 한 번 빌드해 본다[^6].

## 프로필: 개발용 빌드와 배포용 빌드

cargo에는 기본 프로필이 넷 있다: `dev`, `release`, `test`, `bench`[^7]. `cargo build`는 `dev`, `cargo build --release`는 `release`를 쓴다. release 빌드는 `target/release`에 만들어지고 최적화 때문에 컴파일이 더 오래 걸린다[^1].

| 설정 | `dev` 기본값 | `release` 기본값 | 뜻 |
|---|---|---|---|
| `opt-level` | 0 | 3 | 최적화 정도 |
| `debug` | true | false | 디버거용 정보 |
| `debug-assertions` | true | false | `debug_assert!`와 `cfg!(debug_assertions)` |
| `overflow-checks` | true | false | 정수 넘침을 검사해 panic |
| `incremental` | true | false | 바뀐 부분만 다시 컴파일 |
| `codegen-units` | 256 | 16 | 나눠서 병렬로 번역할 조각 수 |

표의 값은 Cargo Book의 기본값 표에서 옮겼다[^7].

가장 눈에 띄는 차이는 `overflow-checks`다. 같은 코드가 프로필에 따라 다르게 돈다.

```rust
let x: u8 = black_box(255);
println!("{}", x + 1);
```

| 명령 | 결과 |
|---|---|
| `cargo run` | panic: `attempt to add with overflow` |
| `cargo run --release` | `0`을 찍는다 |
| `[profile.release]`에 `overflow-checks = true`를 넣고 `cargo run --release` | panic |

배포용에서도 넘침을 잡고 싶으면 마지막 줄처럼 설정을 바꾼다. 검사 비용이 조금 드는 대신 조용히 틀린 값이 나가는 일을 막는다. 넘침 자체는 [값·변수·타입](/Hongs_Blog/studies/rust/values-variables-types/)에서 다룬다.

## 자주 쓰는 명령

| 명령 | 하는 일 |
|---|---|
| `cargo check` | 컴파일 오류만 검사한다. 실행 파일을 만드는 마지막 단계를 건너뛰어 `cargo build`보다 빠르다[^8] |
| `cargo build` | 컴파일해서 `target/debug`에 실행 파일을 만든다 |
| `cargo run` | 빌드하고 바로 실행한다 |
| `cargo test` | `#[test]` 함수와 `tests/` 폴더의 테스트를 돌린다 |
| `cargo doc --open` | 내 코드와 의존성의 문서를 HTML로 만들어 연다 |
| `cargo clippy` | 흔한 실수와 어색한 코드를 지적한다 |
| `cargo fmt` | 코드 모양을 표준 서식으로 맞춘다 |

`cargo check`에도 한계가 있다. 일부 진단은 코드를 실제로 만드는 단계에서만 나와서 `check`로는 보이지 않는다[^8]. 예를 들어 `let x: u8 = 255 + 1;`은 끝까지 컴파일하면 "this arithmetic operation will overflow" 오류가 나지만, 검사만 하는 단계(`rustc --emit=metadata`, `cargo check`와 같은 단계)에서는 아무 오류가 없었다. 이 차이는 [03_values-variables-types_verify.rs](/Hongs_Blog/studies/rust/code/03_values-variables-types_verify/)에서 확인했다. 그래서 CI에서는 `check`만 하지 않고 `build`나 `test`까지 돌린다.

## rust-toolchain.toml: 팀 전체의 컴파일러 판 맞추기

여러 사람이 한 저장소를 쓰면 각자 컴파일러 판이 다를 수 있다. 저장소 맨 위에 `rust-toolchain.toml`을 두면 rustup이 그 판을 골라 쓴다[^9].

```toml
[toolchain]
channel = "1.99.0"
components = ["rustfmt", "clippy"]
```

rustup은 다음 순서로 판을 고른다. 앞에 있는 것이 이긴다[^9].

1. 명령줄의 `cargo +beta` 같은 표시
2. `RUSTUP_TOOLCHAIN` 환경 변수
3. `rustup override`로 정한 폴더 설정
4. `rust-toolchain.toml` 파일
5. 기본 툴체인

`rust-version`과 헷갈리기 쉽다. `rust-version`은 "이 판보다 낮으면 못 쓴다"는 최소 조건이고, `rust-toolchain.toml`은 "이 저장소에서는 이 판을 쓴다"는 고정이다.

## 기능(feature): 골라서 켜는 코드

라이브러리 하나가 JSON 지원, 압축 지원처럼 선택 기능을 가질 때가 있다. cargo의 기능(feature)은 조건부 컴파일과 선택 의존성을 적는 방법이다[^10].

```toml
[dependencies]
ravif = { version = "0.6.3", optional = true }

[features]
default = []          # 아무것도 적지 않으면 켜지는 기능
fancy = []            # 코드 안의 조건만 켜는 기능
avif = ["dep:ravif"]  # 선택 의존성을 끌어오는 기능
```

```rust
#[cfg(feature = "fancy")]
fn extra() { /* fancy를 켰을 때만 컴파일된다 */ }

println!("{}", cfg!(feature = "fancy")); // cargo run --features fancy 이면 true
```

기능은 덧셈이어야 한다. 기능을 켜서 다른 기능이 꺼지면 안 되고, 어떤 조합으로 켜도 안전해야 한다[^10]. 한 프로그램 안에서 같은 라이브러리를 두 곳이 쓰면, cargo는 두 곳이 요청한 기능을 합쳐서 한 번만 빌드하기 때문이다.

## 활용

- **실제 쓰임.** 이 과목의 검증 코드는 `tokio = { version = "1.53.3", features = ["full"] }`처럼 기능을 골라 켠 의존성 한 벌을 쓴다. tokio, sqlx, axum 모두 기능으로 필요한 부분만 켠다.
- **흔한 실수.**
  - 디버그 빌드로 성능을 재고 "Rust가 느리다"고 결론 내린다. 성능은 `--release`로 잰다([성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)).
  - `#[cfg(feature = "x")]`에 오타를 낸다. rustc 1.99.0의 cargo는 `Cargo.toml`에 없는 기능 이름을 `` unexpected `cfg` condition value `` 경고로 알려 준다. 검증 코드에서 `fanci`라는 오타로 확인했다.
  - 기능으로 동작을 바꾸는 "빼기 기능"(`no_std` 대신 `std`를 끄는 기능 등)을 만든다. 덧셈 규칙을 어긴다.
- **clippy.** `clippy::cargo` 묶음의 `cargo_common_metadata`는 crates.io에 올릴 정보(`description`, `license` 등)가 빠졌는지 본다. 기본으로는 꺼져 있다[^11].
- **CI에서.** `cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo test`를 차례로 돌리는 것이 기본이다. [CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/)에서 다룬다.

## 연결

- 선수: [Rust가 푸는 문제](/Hongs_Blog/studies/rust/why-rust/)
- 패키지 여러 개를 한 저장소에 두는 법: [모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/)
- 배포용 빌드를 줄이고 컨테이너에 담는 법: [빌드와 배포](/Hongs_Blog/studies/rust/build-deploy/)
- Java는 `javac`가 바이트코드를 만들고 JVM이 실행 중에 기계어로 번역한다([JVM과 바이트코드](/Hongs_Blog/studies/java/jvm-bytecode/)). Rust는 cargo가 처음부터 기계어 실행 파일을 만든다. 그래서 실행할 컴퓨터에 따로 실행 환경을 깔 필요가 없다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `Cargo.toml`과 `Cargo.lock`의 차이를 한 문장씩 쓰라. 실행 파일을 배포하는 서비스라면 `Cargo.lock`을 git에 넣는가?</summary>

**답:** `Cargo.toml`은 사람이 적는 설정이고 의존성은 "호환되는 판의 범위"로 적는다. `Cargo.lock`은 cargo가 실제로 고른 정확한 판을 적는 파일이다. 서비스는 넣는다. 다른 날 다른 컴퓨터에서도 같은 의존성으로 빌드되어야 하기 때문이다.<br>
**흔한 오답:** "`Cargo.lock`을 넣으면 내 라이브러리를 쓰는 사람도 같은 판을 쓴다." 쓰는 사람의 빌드는 `Cargo.toml`만 본다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `let x: u8 = black_box(255); println!("{}", x + 1);`를 (가) `cargo run` (나) `cargo run --release` (다) `[profile.release]`에 `overflow-checks = true`를 넣고 `cargo run --release`로 돌리면 각각 어떻게 되는가?</summary>

**답:** (가) panic `attempt to add with overflow` (나) `0`을 찍는다 (다) panic<br>
**이유:** `dev`의 `overflow-checks`는 기본 true, `release`는 기본 false다. (다)는 release에서도 검사를 켰다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** cargo의 기능(feature)은 왜 "켜기만 하는" 덧셈이어야 하는가?</summary>

**답:** 한 프로그램 안에서 두 라이브러리가 같은 의존성을 서로 다른 기능으로 요청하면, cargo는 요청을 합쳐 그 의존성을 한 번만 빌드한다. 어떤 기능이 다른 기능을 끄면, 한쪽의 요청 때문에 다른 쪽이 기대한 기능이 사라진다.

</details>


[^1]: The Rust Programming Language, 1.3 Hello, Cargo!, Creating a Project with Cargo · Building and Running a Cargo Project · Building for Release — https://doc.rust-lang.org/book/ch01-03-hello-cargo.html
[^2]: The Cargo Book, Package Layout — https://doc.rust-lang.org/cargo/guide/project-layout.html
[^3]: The Cargo Book, The Manifest Format, The `[package]` section, The `edition` field — https://doc.rust-lang.org/cargo/reference/manifest.html
[^4]: The Rust Edition Guide, What are editions? — https://doc.rust-lang.org/edition-guide/editions/index.html
[^5]: The Cargo Book, Environment Variables, Environment variables Cargo sets for crates — https://doc.rust-lang.org/cargo/reference/environment-variables.html
[^6]: The Cargo Book, FAQ, Why have `Cargo.lock` in version control? — https://doc.rust-lang.org/cargo/faq.html
[^7]: The Cargo Book, Profiles, Default profiles(dev, release), overflow-checks — https://doc.rust-lang.org/cargo/reference/profiles.html
[^8]: The Cargo Book, cargo-check, Description — https://doc.rust-lang.org/cargo/commands/cargo-check.html
[^9]: The rustup book, Overrides, The toolchain file — https://rust-lang.github.io/rustup/overrides.html
[^10]: The Cargo Book, Features, The `[features]` section · Optional dependencies · Feature unification — https://doc.rust-lang.org/cargo/reference/features.html
[^11]: Clippy Lints, `cargo_common_metadata`(cargo 묶음, 기본 allow) — https://rust-lang.github.io/rust-clippy/master/index.html
{% endraw %}
