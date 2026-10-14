---
layout: "note"
title: "CI 품질 게이트"
display_title: "CI 품질 게이트 (CI Quality Gates)"
kind: "concept"
kind_label: "기법"
num: "48"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["CI", "Continuous Integration", "지속적 통합", "Quality Gate", "GitHub Actions", "cargo fmt", "clippy", "cargo-nextest", "cargo-deny", "cargo-audit", "cargo-semver-checks", "MSRV", "rust-version", "rust-toolchain.toml"]
description: "공항 보안 검색대처럼, 코드가 main에 들어가기 전에 반드시 지나야 하는 검사 줄을 세운다. 서식, 린트, 테스트, 지원하는 최소 Rust 버전, 의존성의 보안·라이선스, 공개 API 호환성을 사람 대신 기계가 매번 똑같이 본다. 사람이 \"깜빡\"할 일이 없어지는 대신, 검사가 느…"
prev_url: "/studies/rust/performance-measurement/"
prev_title: "성능 측정과 최적화"
next_url: "/studies/rust/api-design/"
next_title: "API 설계 원칙"
math: true
mermaid: false
code_count: 1
permalink: "/studies/rust/ci-quality-gates/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

공항 보안 검색대처럼, 코드가 main에 들어가기 전에 반드시 지나야 하는 검사 줄을 세운다. 서식, 린트, 테스트, 지원하는 최소 Rust 버전, 의존성의 보안·라이선스, 공개 API 호환성을 사람 대신 기계가 매번 똑같이 본다. 사람이 "깜빡"할 일이 없어지는 대신, 검사가 느리거나 자주 헛걸리면 모두가 우회하기 시작한다. 그래서 빠르고, 실패하면 이유가 분명한 검사만 막는 게이트로 둔다.

</div>


## 예시로 보기

팀원 셋이 각자 PR을 올린다. 한 명은 `cargo fmt`를 안 돌렸고, 한 명은 clippy 경고를 남겼고, 한 명은 문서 예제(doctest)를 깨뜨렸다. 리뷰어가 이걸 눈으로 찾으면 리뷰 시간 대부분이 여기에 들어간다. PR마다 자동으로 도는 작업(CI, continuous integration)이 이 셋을 막으면 리뷰어는 설계만 본다.

각 검사가 "통과 아니면 실패"를 종료 코드로 알려 주기 때문에 이것이 가능하다. 예를 들어 `rustfmt --check`는 고칠 것이 없으면 0, 있으면 1로 끝난다[^1]. 검증 코드에서 서식이 다른 파일과 맞는 파일에 돌리니 각각 1과 0이 나왔다. CI는 0이 아닌 종료 코드를 보면 그 작업을 실패로 표시한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `rustfmt --check`의 종료 코드, `-D warnings`가 경고를 실패로 바꾸는 것, `must_use`와 `deny`, `forbid` 아래 `allow`가 E0453이 되는 것, `rust-version`보다 낮은 rustc에서 cargo가 멈추는 것을 이 기계의 rustc 1.99.0과 cargo로 실행해 확인했다. 아래 워크플로는 GitHub에서 실행하지 않았다. 대신 필요한 게이트가 모두 들어 있는지를 글자로 점검했다 — [48_ci-quality-gates_verify.rs](/Hongs_Blog/studies/rust/code/48_ci-quality-gates_verify/)</div>

</div>


## 워크플로 전체

`.github/workflows/ci.yml`에 둔다. job은 서로 따로 돌아서, 어느 게이트가 막혔는지 이름으로 바로 보인다.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

env:
  CARGO_TERM_COLOR: always
  RUSTFLAGS: "-Dwarnings"

jobs:
  fmt:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: rustup update stable && rustup default stable
      - run: rustup component add rustfmt
      - run: cargo fmt --all -- --check

  clippy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: rustup update stable && rustup default stable
      - run: rustup component add clippy
      - uses: Swatinem/rust-cache@v2
      - run: cargo clippy --all-targets --all-features

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: rustup update stable && rustup default stable
      - uses: Swatinem/rust-cache@v2
      - uses: taiki-e/install-action@v2
        with:
          tool: cargo-nextest
      - run: cargo nextest run --all-features
      - run: cargo test --doc --all-features

  msrv:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: taiki-e/install-action@cargo-hack
      - run: cargo hack check --rust-version --workspace --all-targets --ignore-private

  deny:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        checks:
          - advisories
          - bans licenses sources
    continue-on-error: ${{ matrix.checks == 'advisories' }}
    steps:
      - uses: actions/checkout@v6
      - uses: EmbarkStudios/cargo-deny-action@v2
        with:
          command: check ${{ matrix.checks }}

  semver:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: obi1kenobi/cargo-semver-checks-action@v2
```

## 게이트 하나씩

| job | 무엇을 막나 | 근거 |
|---|---|---|
| `fmt` | 서식이 다른 코드. `cargo fmt`는 에디션을 `Cargo.toml`에서 읽는다 | [^1] |
| `clippy` | 경고 하나라도. `RUSTFLAGS: "-Dwarnings"`가 rustc 경고를 에러로 바꾸고, clippy 린트도 경고로 나오므로 같이 걸린다 | [^2] |
| `test` | 깨진 테스트와 깨진 문서 예제 | [^3] |
| `msrv` | `rust-version`에 적은 버전에서 컴파일되지 않는 코드 | [^4] |
| `deny` | 알려진 취약점, 허락하지 않은 라이선스, 중복·금지 크레이트, 모르는 저장소에서 온 크레이트 | [^5][^6] |
| `semver` | 라이브러리의 공개 API를 깨는 변경 | [^7] |

### 경고를 에러로: `-D warnings`

`-D warnings`가 없으면 경고만 있는 코드는 빌드가 된다. 같은 코드를 `-D warnings`로 컴파일하니 `error: unused variable`로 실패했다. 공식 clippy 안내서는 `cargo clippy -- -D warnings` 대신 환경 변수 `RUSTFLAGS: "-Dwarnings"`를 워크플로 맨 위에 둔다[^2]. 그러면 clippy뿐 아니라 그 워크플로의 모든 빌드가 같은 기준을 쓴다.

린트 수준은 코드에도 적을 수 있다. 다섯 단계가 있다: `allow`(조용), `expect`(나와야 한다, 안 나오면 경고), `warn`, `deny`(에러), `forbid`(에러이고 안쪽에서 낮출 수 없다)[^8].

```rust
#![forbid(unsafe_code)]
#[allow(unsafe_code)]   // error[E0453]: 위에서 forbid했으니 여기서 풀 수 없다
pub fn f() {}
```

크레이트 전체 설정은 `Cargo.toml`의 `[lints]`에 두면 소스마다 적지 않아도 된다[^9].

```toml
[package]
name = "shortener"
version = "0.3.1"
edition = "2024"
rust-version = "1.88"

[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
unwrap_used = "warn"
```

`priority`는 묶음과 개별 린트가 겹칠 때 누가 이기는지 정한다. 숫자가 작을수록 먼저 적용되고 큰 쪽이 덮어쓴다[^9]. 묶음(pedantic)을 -1로 두면 그 안의 개별 린트를 따로 `allow`할 수 있다. 이 설정은 내 패키지에만 걸리고 의존성에는 걸리지 않는다[^9].

### 테스트: nextest와 doctest

cargo-nextest는 `cargo test` 대신 쓰는 테스트 실행기다. 다만 문서 예제(doctest)는 돌리지 못한다. 공식 안내는 `cargo nextest run` 뒤에 `cargo test --doc`을 따로 돌리라는 것이다[^3]. 워크플로의 `test` job이 두 줄인 까닭이다. nextest는 `taiki-e/install-action`으로 미리 빌드된 파일을 받아 설치한다. 이 액션은 cargo-nextest, cargo-hack, cargo-deny, cargo-audit, cargo-semver-checks를 모두 지원한다[^10].

### 최소 지원 버전: rust-version

`Cargo.toml`의 `rust-version`은 "이 패키지는 Rust 몇 이상에서 돈다"는 약속이다. 버전 숫자만 쓸 수 있고 `^`, `>=` 같은 연산자는 안 된다[^4]. 이보다 낮은 rustc로 빌드하면 cargo가 문법 오류 대신 이 이유로 멈춘다[^4]. 검증 코드에서 `rust-version = "1.200"`으로 두고 1.99.0으로 빌드하니 이렇게 나왔다.

```text
error: rustc 1.99.0 is not supported by the following package:
  msrv-demo@0.1.0 requires rustc 1.200
```

`--ignore-rust-version`을 주면 통과했다[^4]. 이 약속을 말로만 하지 않으려면 CI에서 실제로 그 버전으로 빌드한다. Cargo 안내서는 `cargo hack check --rust-version --workspace --all-targets --ignore-private`를 예로 든다[^11]. clippy의 `incompatible_msrv` 린트는 `rust-version`보다 새 버전에서 생긴 표준 함수를 쓰면 경고한다[^4].

`rust-toolchain.toml`은 다르다. "이 저장소에서는 이 툴체인을 쓴다"고 고정하는 파일이다[^12].

```toml
[toolchain]
channel = "1.99.0"
components = ["rustfmt", "clippy"]
profile = "minimal"
```

rustup은 명령줄의 `+버전`, 환경 변수 `RUSTUP_TOOLCHAIN`, 디렉터리 설정, `rust-toolchain.toml`, 기본 툴체인 순서로 고른다[^12]. 그래서 이 파일이 있으면 워크플로의 `rustup default stable`보다 파일이 이긴다. 팀이 같은 clippy 버전을 쓰게 되어 "내 컴퓨터에선 경고가 없는데"가 사라진다. 대신 버전을 올리는 PR을 정기적으로 만들어야 한다.

| | `rust-version` | `rust-toolchain.toml` |
|---|---|---|
| 뜻 | 이 버전 **이상**이면 된다(바닥) | 이 저장소에서는 **이** 버전을 쓴다(고정) |
| 누가 보나 | 내 크레이트를 쓰는 사람과 cargo | 이 저장소에서 일하는 사람과 rustup |
| 어울리는 곳 | 배포하는 라이브러리 | 서비스, 팀 저장소 |

### 의존성 검사: cargo-deny와 cargo-audit

cargo-audit는 `Cargo.lock`의 크레이트를 RustSec 보안 권고 데이터베이스와 대조한다[^13]. cargo-deny는 그 일(advisories)에 더해 셋을 더 본다: 라이선스(licenses), 금지·중복 크레이트(bans), 크레이트를 받아 온 곳(sources)[^5]. 설정은 `deny.toml`에 둔다[^6].

```toml
[advisories]
unmaintained = "all"
ignore = []

[licenses]
allow = ["Apache-2.0", "MIT", "BSD-3-Clause", "ISC", "Unicode-3.0"]

[bans]
multiple-versions = "deny"

[sources]
unknown-registry = "deny"
unknown-git = "deny"
```

보안 권고는 내 코드가 바뀌지 않아도 어느 날 새로 생긴다. 그래서 cargo-deny-action 안내는 advisories를 따로 돌리고 `continue-on-error`로 PR을 막지 않게 하는 구성을 권한다[^14]. 워크플로의 `deny` job이 이 구성이다. 막지는 않되 빨간불로 알리고, 따로 고친다.

### 공개 API 호환성: cargo-semver-checks

라이브러리의 공개 함수 시그니처를 바꾸거나 트레이트에 메서드를 더하면, 버전을 0.3.1 → 0.3.2로만 올려도 쓰는 사람의 빌드가 깨진다. cargo-semver-checks는 이전 배포본과 비교해 이런 변경을 찾는다[^7]. 모든 위반을 잡지는 못한다. 필드·인자 타입 변경, 제네릭·수명 변경 등은 아직 린트가 없다고 스스로 적는다[^7]. 무엇이 깨는 변경인지는 [API 설계 원칙](/Hongs_Blog/studies/rust/api-design/)에 있다. 실행 파일만 내는 서비스라면 이 job은 빼도 된다.

### 캐시

Rust 빌드는 의존성 컴파일이 대부분이다. `Swatinem/rust-cache@v2`는 `~/.cargo`(받은 크레이트, 설치한 도구)와 `./target`의 의존성 빌드 결과를 저장해 다음 실행에서 다시 쓴다[^15]. 내 워크스페이스 크레이트와 증분 빌드 결과는 저장하지 않는다[^15]. 캐시 키에 rustc 버전이 들어가므로 툴체인을 고른 다음 단계에 둔다[^15].

## 활용

- **로컬에서 먼저.** 같은 명령을 커밋 전에 돌린다: `cargo fmt --all -- --check && cargo clippy --all-targets --all-features -- -D warnings && cargo nextest run && cargo test --doc`. CI는 "잊었을 때"를 잡는 그물이다.
- **규칙은 브랜치 보호와 묶는다.** GitHub 저장소 설정에서 이 job들을 "필수 검사"로 지정해야 실패한 PR을 합칠 수 없다. 워크플로만 있으면 빨간불이어도 합칠 수 있다.
- **흔한 실수.**
  - `cargo test`만 돌리고 nextest로 바꾸며 doctest가 조용히 빠진다.
  - `#[allow(clippy::...)]`를 이유 없이 붙인다. `#[expect(...)]`로 쓰면 그 린트가 더 이상 안 나올 때 경고가 떠서 낡은 예외가 쌓이지 않는다[^8].
  - `rust-version`을 적어 두고 CI에서 그 버전으로 빌드하지 않는다. 약속이 슬그머니 깨진다.
  - 버린 `Result`를 그냥 둔다. 기본은 경고(`unused_must_use`)이고, `-D warnings`면 빌드가 멈춘다. 일부러 버릴 때는 `let _ = ...;`로 적는다[^8]. 검증 코드에서 `deny(unused_must_use)` 아래 `token();`은 에러, `let _ = token();`은 통과였다.

## 연결

- 선수: [모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/), [테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/)
- 무엇이 깨는 변경인가: [API 설계 원칙](/Hongs_Blog/studies/rust/api-design/)
- 게이트를 통과한 코드를 배포 이미지로: [빌드와 배포](/Hongs_Blog/studies/rust/build-deploy/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 서비스 저장소의 CI에 둘 게이트 다섯 가지와 각 명령을 쓰라.</summary>

**답:** 서식 `cargo fmt --all -- --check`, 린트 `cargo clippy --all-targets --all-features`(+ `RUSTFLAGS=-Dwarnings`), 테스트 `cargo nextest run`과 `cargo test --doc`, 최소 버전 `cargo hack check --rust-version ...`, 의존성 `cargo deny check`. 라이브러리면 `cargo semver-checks`를 더한다.<br>
**흔한 오답:** doctest를 빼먹는다. nextest는 doctest를 돌리지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 라이브러리를 배포한다. "1.80 이상이면 쓸 수 있다"를 알리고 지키려면 `rust-version`과 `rust-toolchain.toml` 중 무엇을 쓰고, CI에서 무엇을 하나?</summary>

**답:** `rust-version = "1.80"`을 쓰고, CI에서 1.80으로 실제로 빌드한다(`cargo hack check --rust-version`).<br>
**이유:** `rust-toolchain.toml`은 이 저장소에서 일할 때 쓸 버전을 **고정**한다. 쓰는 사람에게 바닥을 알리는 것은 `rust-version`이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음은 컴파일되는가? 안 되면 왜인가? `#![forbid(unsafe_code)]` 크레이트의 한 함수에 `#[allow(unsafe_code)]`를 붙였다.</summary>

**답:** 안 된다. `error[E0453]`.<br>
**이유:** `forbid`는 `deny`와 같지만 안쪽에서 수준을 낮추는 것까지 막는다. 크레이트 맨 위에서 forbid하면 어느 함수도 unsafe를 몰래 허락할 수 없다. 낮출 여지를 남기려면 `deny`를 쓴다.

</details>


[^1]: rustfmt README — https://github.com/rust-lang/rustfmt (`--check`는 바꿀 것이 없으면 0, 있으면 1로 끝난다, CI 예 `cargo fmt --all -- --check`, `cargo fmt`는 에디션을 `Cargo.toml`에서 읽고 `rustfmt`를 직접 부르면 2015가 기본)
[^2]: Clippy 안내서, GitHub Actions — https://doc.rust-lang.org/clippy/continuous_integration/github_actions.html (`RUSTFLAGS: "-Dwarnings"`로 clippy 린트를 포함한 모든 경고에서 실패, `cargo clippy --all-targets --all-features`)
[^3]: cargo-nextest 첫 쪽 — https://nexte.st/ (doctest는 안정판 Rust의 한계로 아직 지원하지 않는다, `cargo test --doc`을 따로 돌린다, `cargo nextest run`)
[^4]: The Cargo Book, The rust-version field — https://doc.rust-lang.org/cargo/reference/rust-version.html (버전 숫자만, 연산자 불가, 지원하지 않는 툴체인이면 에러, `--ignore-rust-version`, clippy `incompatible_msrv`, `cargo-hack`)
[^5]: cargo-deny 안내서, Checks — https://embarkstudios.github.io/cargo-deny/checks/index.html (licenses, bans, advisories, sources, `cargo deny check`는 모든 검사를 돈다)
[^6]: cargo-deny 안내서, config — https://embarkstudios.github.io/cargo-deny/checks/cfg.html (`deny.toml`의 `[advisories]`·`[licenses]`·`[bans]`·`[sources]` 예)
[^7]: cargo-semver-checks README — https://github.com/obi1kenobi/cargo-semver-checks (배포 전 semver 위반 린트, `cargo semver-checks`, `obi1kenobi/cargo-semver-checks-action@v2`, 아직 린트가 없는 위반들)
[^8]: The Rust Reference, Diagnostic attributes — https://doc.rust-lang.org/reference/attributes/diagnostics.html (`allow`·`expect`·`warn`·`deny`·`forbid`, forbid는 뒤에서 바꿀 수 없다, `must_use`와 `unused_must_use`, `let _ =`은 관례적으로 허용)
[^9]: The Cargo Book, The manifest format, `[lints]` — https://doc.rust-lang.org/cargo/reference/manifest.html#the-lints-section (`[lints.rust]`·`[lints.clippy]`, 수준과 `priority`, 현재 패키지에만 적용)
[^10]: taiki-e/install-action README — https://github.com/taiki-e/install-action 와 TOOLS.md — https://github.com/taiki-e/install-action/blob/main/TOOLS.md (`tool:` 입력, `@<도구 이름>` 태그, 지원 도구 목록에 cargo-nextest(별칭 nextest)·cargo-hack·cargo-deny·cargo-audit·cargo-semver-checks)
[^11]: The Cargo Book, Continuous Integration — https://doc.rust-lang.org/cargo/guide/continuous-integration.html (GitHub Actions 예 `actions/checkout@v6`, `rustup update ... && rustup default ...`, Verifying rust-version의 `cargo hack check --rust-version --workspace --all-targets --ignore-private`)
[^12]: The rustup book, Overrides — https://rust-lang.github.io/rustup/overrides.html (`rust-toolchain.toml`의 `channel`·`components`·`targets`·`profile`, 툴체인을 고르는 순서)
[^13]: cargo-audit README — https://github.com/rustsec/rustsec/tree/main/cargo-audit (RustSec 권고 데이터베이스와 대조, `cargo install cargo-audit`, 믿을 수 있는 프로젝트에서만 돌리라는 경고)
[^14]: cargo-deny-action README — https://github.com/EmbarkStudios/cargo-deny-action (`EmbarkStudios/cargo-deny-action@v2`, `command`·`arguments` 입력, advisories를 matrix로 나누고 `continue-on-error`로 두는 권장 구성)
[^15]: Swatinem/rust-cache README — https://github.com/Swatinem/rust-cache (`~/.cargo`와 `./target`의 의존성 빌드 결과를 저장, 워크스페이스 크레이트·증분 결과는 저장하지 않는다, 툴체인을 먼저 고른다)
{% endraw %}
