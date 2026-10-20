---
layout: "note"
title: "캡스톤 6 테스트·CI·배포"
display_title: "캡스톤 6 테스트·CI·배포"
kind: "practice"
kind_label: "연습"
num: "50"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "서비스 코드는 5단계와 같다. 이 단계는 그 코드를 \"믿고 내보낼 수 있는 상태\"로 만든다."
prev_url: "/studies/rust/release-readiness-practice/"
prev_title: "배포 준비 연습"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "50_capstone-6_p1.rs", "u": "/studies/rust/code/50_capstone-6_p1/", "r": "문제 1 풀이"}]
permalink: "/studies/rust/capstone-6/"
---
{% raw %}
## 목표

서비스 코드는 5단계와 같다. 이 단계는 그 코드를 "믿고 내보낼 수 있는 상태"로 만든다.

- 테스트를 층으로 나눈다: 순수 함수(unit) → 메모리 SQLite 저장소(store) → 소켓 없는 라우터(router_level) → 진짜 소켓 하나(e2e).
- 이 문서에 CI 워크플로, `deny.toml`, 릴리스 프로필, 다단계 Dockerfile을 적는다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">이 문서의 YAML·TOML·Dockerfile은 이 저장소에서 실행하지 않았다</div>

이 과목의 실행 환경은 단일 파일 하네스라서 GitHub Actions, cargo-deny, Docker를 돌리지 않는다. 각 설정은 출처 문서의 예를 바탕으로 쓴 초안이다. 실제 저장소에 넣을 때 한 번 돌려 확인한다. 직접 실행해 확인한 것은 `.rs` 파일의 테스트와 이 문서에 적은 측정값뿐이다.

</div>


이 단계가 없을 때 깨지는 것은 구체적이다. 5단계까지의 테스트는 대부분 "이 입력에서 이 결과"였다. 그런 테스트로는 6단계가 찾아낸 구멍 두 가지가 안 보인다. 하나는 하위목표 2의 성질 테스트(property-based testing)가 사실은 아무것도 확인하지 않았다는 것이다. 다른 하나는 5단계의 시간 제한이 메모리 DB를 지울 수 있다는 것이다(5단계 하위목표 6). 배포 쪽에서는 개발 빌드를 이미지에 넣으면 릴리스 빌드보다 10~100배 느릴 수 있고[^1], 4단계의 기본 바인드 `127.0.0.1`을 그대로 두면 컨테이너 밖에서 닿지 않는다 [확인필요].

## 사용 개념

- [테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/): 층마다 잡는 버그가 다르다. 성질 테스트와 축소(shrinking).
- [CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/): fmt, clippy, test, cargo-deny를 병합 전에 돌린다.
- [빌드와 배포](/Hongs_Blog/studies/rust/build-deploy/): 릴리스 프로필, 다단계 이미지.
- [panic을 쓸 때](/Hongs_Blog/studies/rust/panic-policy/): `panic = "abort"`가 서버에서 무엇을 바꾸는가.
- [모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/): 실제 프로젝트에서는 `lib.rs`와 얇은 `main.rs`로 나눈다.

## 설계 결정

| 결정 | 고른 것 | 까닭과 다른 길 |
|---|---|---|
| 층 드러내기 | 테스트 모듈 이름을 `unit`, `store`, `router_level`, `e2e`로 | 실제 프로젝트라면 `tests/` 폴더에 통합 테스트를 둔다. 그러려면 `src/lib.rs`가 있어야 한다. `src/main.rs`만 있는 바이너리 크레이트는 `tests/`에서 가져다 쓸 수 없다[^2]. 이 과목은 한 파일 규칙이라 모듈 이름으로 층을 보인다 |
| e2e 수 | 하나 | 나머지 8개는 합쳐 0.05~0.06초, e2e 하나는 0.37초 걸린다(세 번 재서 같았다). 진짜 소켓으로만 확인할 수 있는 것(새 연결 거절, 처리 중인 요청 마무리)만 e2e에 둔다 |
| 라우터 테스트 | 표 하나에 요청 9개와 기대 상태 코드 | 상태 코드 약속이 한 곳에 모인다. 응답 모양이 바뀌면 이 표 한 곳만 고친다 |
| 성질 테스트의 입력 | 스킴 + 보이는 ASCII + 아무 글자 하나 | 아무 문자열(`.{0,64}`)이면 검사를 통과하는 입력이 256개 중 0개다. 하위목표 2 |
| CI 단계 | fmt → clippy → test(`--locked`) → cargo-deny | `--locked`는 `Cargo.lock`이 없거나 바뀌어야 하면 실패한다. CI처럼 같은 결과가 필요한 곳에 쓰라고 Cargo 문서가 적는다[^3] |
| 릴리스 프로필 | `lto = "thin"`, `codegen-units = 1`, `debug = "line-tables-only"`, `panic`은 기본값 | `panic = "abort"`는 패닉 한 번에 프로세스 전체가 끝난다[^4]. 변형 2 |
| 이미지 | `rust:1.99-slim-trixie`에서 빌드, `debian:trixie-slim`에서 실행 | 두 태그 모두 Docker Hub의 공식 목록에 있다[^5][^6]. 빌드 도구는 최종 이미지에 들어가지 않는다[^7]. 더 작게 하려면 정적 링크(musl)나 distroless를 쓰지만 이 문서 범위 밖이다 |
| SQLite 라이브러리 | 실행 이미지에 설치하지 않음 | sqlx의 `sqlite` 기능은 SQLite를 묶어 정적으로 링크한다[^8] |
| 헬스 체크 | 오케스트레이터가 `/health`를 부른다 | `/health`는 DB를 묻지 않으니 "살아 있는가"(liveness)에 맞다. "요청을 받을 준비가 됐는가"(readiness)로 쓰려면 DB 확인을 더해야 한다[^9] |

## 코드 설명

**하위목표 1: 순수 함수는 촘촘하게.** `unit::url_rules`는 1단계 규칙마다 기대하는 에러 변형을 정확히 적는다.

```rust
let bad = [
    ("", DomainError::EmptyUrl),
    ("javascript:alert(1)", DomainError::UnsupportedScheme),
    ("https://", DomainError::MissingHost),
    ("https://bank.com@evil.example/", DomainError::UserInfo),
    ("https://a b", DomainError::InvalidCharacter { index: 9 }),
];
```

`"https://a b"`의 공백은 0부터 세어 9번째 바이트다. 에러 변형뿐 아니라 위치(`index`)까지 비교한다. `unit::config_and_secret`는 4·5단계 설정을 한 번에 본다: `Debug` 출력에 `pw-1`이 없는지, 기본 시간 제한이 5초인지, `hunter2`가 에러 메시지에 없는지, `MAX_IN_FLIGHT=0`이 거절되는지.

**하위목표 2: 성질 테스트가 정말 무언가를 확인하는지 본다.** 1단계의 약속은 "검사를 통과한 주소는 언제나 `Location` 헤더에 들어간다"다. 이 약속을 성질로 적었다.

```rust
// 아무 문자열(".{0,64}")이면 256개 중 0개가 검사를 통과해 속성이 늘 참이 된다.
// 스킴을 붙이고 끝에 아무 글자 하나를 덧붙여 절반쯤 통과하게 만든다.
#[test]
fn accepted_urls_fit_in_a_location_header(s in "(?i:https?)://[ -~]{0,40}(?s:.)?") {
    if let Ok(u) = Url::parse(&s) {
        prop_assert!(axum::http::HeaderValue::from_str(u.as_str()).is_ok());
    }
}
```

`if let Ok`로 걸러 내는 성질은 걸러진 뒤 남는 입력이 있어야 의미가 있다. 처음 쓴 전략 `".{0,64}"`는 아무 유니코드 문자열을 만든다. `http://`로 시작할 일이 거의 없어서, 세어 보면 입력 256개 중 `Url::parse`를 통과한 것이 0개였다. 그 테스트는 언제나 통과했고, 아무것도 확인하지 않았다.

지금 전략은 대소문자를 섞은 `http://`·`https://` 뒤에 보이는 ASCII와 공백을 0~40개 붙이고, 끝에 줄바꿈을 포함한 아무 글자를 하나 붙일 수도 있다. 세 번 돌려 보면 256개 중 114~119개가 검사를 통과한다. 테스트가 제 몫을 하는지는 일부러 버그를 넣어 확인한다. `Url::parse`에서 글자 검사(`0x21..=0x7E`)를 지운 사본으로 돌리면, 옛 전략은 그대로 통과하고 새 전략은 실패한다. 한 번 돌렸을 때 축소(shrinking)가 찾은 가장 작은 실패 입력은 `"HTtP://$\u{7f}"`였다. 끝의 `\u{7f}`(DEL)는 보이는 글자가 아니라서 헤더 값이 될 수 없다.

`generated_codes_always_parse`는 1단계에서 그대로 가져왔다. 씨앗 하나마다 코드 20개를 뽑아 모두 다시 읽히는지 본다.

**하위목표 3: 저장소는 메모리 SQLite로.** `store`의 두 테스트는 DB가 실제로 내는 에러를 쓴다.

- `collision_is_retried_and_db_errors_are_mapped`: 씨앗 7이 낼 코드를 미리 넣어 기본 키 위반을 일으킨다. `Duplicate`로 바뀌는지, `shorten`이 다른 코드로 재시도하는지 본다. 그다음 풀을 닫고 `Storage(Backend(_))`가 나오는지 본다.
- `dropped_queries_keep_memory_db`: 5단계에서 더한 테스트다. 퓨처를 버려도 메모리 DB가 남는지 본다.

**하위목표 4: 라우터는 소켓 없이.** `router_level::status_codes`는 요청 9개를 표로 넣는다.

```rust
(req("GET", "/abcdefg", "", ""), 307),
(req("GET", "/zzzzzzz", "", ""), 404),
(req("GET", "/a/b/c", "", ""), 404),
(req("GET", "/links", "", ""), 405),
(req("GET", "/health", "", ""), 200),
(req("POST", "/links", "application/json", r#"{"url":"https://x.y"}"#), 201),
(req("POST", "/links", "text/plain", r#"{"url":"https://x.y"}"#), 415),
(req("POST", "/links", "application/json", r#"{"url":"#), 400),
(req("POST", "/links", "application/json", r#"{"url":"ftp://x.y"}"#), 422),
```

요청마다 `app(0, &[])`로 새 라우터를 만들어서 앞 요청의 상태가 뒤 요청에 새지 않는다. `timeout_gives_503_with_no_socket_needed`는 300ms 걸리는 저장소에 50ms 제한을 걸어 503을 본다. 시간 제한은 레이어이고 레이어는 라우터의 일부라서 소켓 없이 확인된다.

**하위목표 5: 진짜 소켓은 하나만.** `e2e::real_socket_round_trip_and_graceful_shutdown`은 5단계의 `self_check`를 그대로 부른다. `127.0.0.1:0`에 서버를 띄우고, 만들기·통계·413·처리 중 종료·새 연결 거절을 차례로 본다. `with_graceful_shutdown`과 TCP 연결 거절은 `oneshot`으로는 볼 수 없어서 이 층에 둔다.

전체 실행 결과는 `test result: ok. 9 passed; 0 failed; … finished in 0.37s`, 자체 실행 출력은 `종료 중에도 끝난 요청: 307 (253.22075ms 걸려 종료)`다.

**하위목표 6: CI 워크플로(실행하지 않음).** Cargo 문서의 GitHub Actions 예[^10]에 Clippy 문서의 경고 처리[^11], rustfmt의 `--check`[^12], 캐시[^13], cargo-deny 액션의 권장 구성[^14]을 합쳤다.

```yaml
name: ci
on:
  push:
  pull_request:

env:
  CARGO_TERM_COLOR: always
  RUSTFLAGS: "-Dwarnings"   # clippy 경고까지 실패로 만든다

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: rustup update stable && rustup default stable
      - run: rustup component add rustfmt clippy
      - uses: Swatinem/rust-cache@v2          # 툴체인을 고른 뒤에 둔다
      - run: cargo fmt --all -- --check
      - run: cargo clippy --all-targets --all-features --locked
      - run: cargo test --all-features --locked

  deny:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        checks: [advisories, bans licenses sources]
    # 새 보안 권고가 올라온 날 모든 PR이 막히지 않게, advisories만 실패를 허용한다
    continue-on-error: ${{ matrix.checks == 'advisories' }}
    steps:
      - uses: actions/checkout@v6
      - uses: EmbarkStudios/cargo-deny-action@v2
        with:
          command: check ${{ matrix.checks }}
```

`RUSTFLAGS: "-Dwarnings"`는 Clippy 문서가 쓰는 방식이다. rustc 경고와 clippy 린트를 모두 에러로 만든다[^11]. rust-cache는 의존성 빌드 결과와 `~/.cargo`를 캐시하고, 캐시 키에 rustc 버전을 쓰므로 툴체인을 먼저 골라야 한다[^13].

**하위목표 7: `deny.toml` 초안(실행하지 않음).** cargo-deny는 라이선스, 금지·중복 크레이트, 보안 권고, 출처 네 가지를 본다[^15]. cargo-deny 문서의 예[^16]에서 출발해 한 군데를 바꿨다.

```toml
[graph]
targets = ["x86_64-unknown-linux-gnu", "aarch64-unknown-linux-gnu"]
all-features = true

[advisories]
unmaintained = "all"
unsound = "all"
ignore = []

[licenses]
confidence-threshold = 0.93
allow = ["Apache-2.0", "Apache-2.0 WITH LLVM-exception", "BSD-3-Clause", "MIT", "ISC", "Unicode-3.0", "Zlib"]

[bans]
multiple-versions = "warn"   # 문서 예는 "deny"

[sources]
unknown-registry = "deny"
unknown-git = "deny"
```

`multiple-versions`를 `"warn"`으로 낮춘 까닭은 숫자로 보인다. 이 과목 하네스의 `Cargo.lock`에는 패키지가 204개 있고, 그중 7개 이름(`block-buffer`, `cpufeatures`, `crypto-common`, `digest`, `hashbrown`, `sha2`, `syn`)이 두 버전씩 들어 있다. `"deny"`로 두면 첫날부터 CI가 빨갛다. 라이선스 쪽은 레지스트리 크레이트 203개 중 로컬에서 찾은 201개의 `license` 필드를 모아 보았다. 107개가 `MIT OR Apache-2.0`, 36개가 `MIT`, 18개가 `Unicode-3.0`이고, 나머지도 `Zlib`, `MIT AND BSD-3-Clause`처럼 위 허용 목록으로 채워지는 조합이었다.

**하위목표 8: 릴리스 프로필(실행하지 않음).**

```toml
[profile.release]
lto = "thin"                  # 크레이트 사이 최적화, "fat"보다 훨씬 빨리 끝난다
codegen-units = 1             # 병렬 컴파일을 포기하고 더 빠른 코드를 얻는다
debug = "line-tables-only"    # 백트레이스에 파일·줄 번호만 남긴다
# panic = "abort"는 넣지 않는다(변형 2)
```

릴리스 기본값은 `opt-level = 3`, `lto = false`, `codegen-units = 16`, `debug = false`다[^4]. `lto = "thin"`은 "fat"과 비슷한 이득을 훨씬 짧은 시간에 얻는다. `codegen-units`가 많으면 병렬로 컴파일하지만 코드가 느려질 수 있다[^4]. `codegen-units = 1`은 실행 속도를 올리고 컴파일을 늦춘다[^1]. 장애 때 패닉 위치를 보려면 줄 번호가 필요해서 `line-tables-only`를 켰다[^4]. 이 조합이 이 서비스에서 얼마나 빨라지는지는 재지 않았다. 바꾸기 전과 뒤를 [성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)의 방법으로 잰 뒤에 고른다.

**하위목표 9: 다단계 Dockerfile(실행하지 않음).** 실제 프로젝트 이름을 `shortener`라고 둔다.

```dockerfile
# 1단계: 컴파일러가 있는 이미지에서 빌드
FROM rust:1.99-slim-trixie AS build
WORKDIR /src
COPY . .
RUN cargo build --release --locked

# 2단계: 바이너리만 담는 실행 이미지
FROM debian:trixie-slim
RUN mkdir /data && chown 10001:10001 /data
COPY --from=build /src/target/release/shortener /usr/local/bin/shortener
USER 10001:10001
ENV SERVE=1 BIND_ADDR=0.0.0.0:3000 DATABASE_URL=sqlite:///data/links.db LOG_FORMAT=json RUST_LOG=info
EXPOSE 3000
VOLUME /data
CMD ["/usr/local/bin/shortener"]
```

- `FROM … AS build`와 `COPY --from=build`가 두 단계를 잇는다. 최종 이미지에는 빌드 도구가 하나도 없다[^7].
- `BIND_ADDR=0.0.0.0:3000`이 핵심이다. 4단계 기본값 `127.0.0.1`은 컨테이너 안의 루프백이라, 밖에서 들어오는 연결이 닿지 않는다 [확인필요]. `EXPOSE`는 문서 역할만 하고 포트를 열지 않는다. 실제로 열려면 `docker run -p 3000:3000`이 필요하다[^17].
- `DATABASE_URL=sqlite:///data/links.db`의 슬래시 셋은 루트부터의 경로라는 뜻이다[^18]. 2단계의 `create_if_missing(true)` 덕분에 처음 뜰 때 파일이 생긴다. `/data`를 볼륨으로 두어 컨테이너를 바꿔도 링크가 남는다.
- `USER 10001:10001`로 root가 아닌 사용자로 돈다. `USER`는 이후의 `RUN`과 실행 때의 `CMD`에 적용된다[^17]. 사용자를 따로 만들지 않고 숫자로 주었고, `/data`의 주인만 그 숫자로 바꿨다.
- 빌드와 실행 이미지를 같은 Debian 판(trixie)으로 맞췄다. 바이너리는 빌드 이미지의 C 라이브러리(glibc)에 맞춰 링크되므로, 실행 이미지의 glibc가 더 오래되면 실행되지 않을 수 있다 [확인필요].
- `COPY . .`는 로컬의 `target/`까지 복사하므로 `.dockerignore`에 `target`을 적는다. 소스 한 줄만 바꿔도 의존성을 다시 빌드하는 문제는 cargo-chef가 의존성 빌드를 따로 캐시해서 푼다[^19].
- 5단계가 SIGTERM을 받으므로 `docker stop`이 안전한 종료로 이어진다. 유예 시간 맞추기는 5단계 변형 2를 따른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: rustfmt·clippy(`-D warnings`)·테스트 9개(unit 4, store 2, router_level 2, e2e 1)·자체 실행 통과, `ALL CHECKS PASSED` — [50_capstone-6_p1.rs](/Hongs_Blog/studies/rust/code/50_capstone-6_p1/). 성질 테스트의 통과 수, 버그를 넣은 사본의 결과, 층별 시간, `Cargo.lock`의 중복·라이선스 수는 직접 실행해 센 값이다. CI·`deny.toml`·프로필·Dockerfile은 실행하지 않았다.</div>

</div>


## 변형 문제

**변형 1.** 아래 세 버그를 하나씩 넣으면 9개 테스트 중 무엇이 가장 먼저 잡는가? 아무것도 못 잡는 버그가 있다면 어떤 테스트를 더해야 하는가?

1. `Url::parse`에서 `MissingHost` 검사를 지운다.
2. `router()`에서 `.fallback(not_found)` 줄을 지운다.
3. `Running::shutdown`에서 `self.tracker.close();`를 지운다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

각 버그를 넣은 사본으로 돌린 결과다.

1. `unit::url_rules`가 잡는다: `assertion left == right failed: "https://"`, `left: Ok(Url("https://"))`, `right: Err(MissingHost)`. 0.01초짜리 테스트가 원인을 바로 가리킨다.
2. 아무것도 못 잡는다. 9개가 모두 통과한다. fallback이 없어도 axum이 `/a/b/c`에 404를 주기 때문이다. 다만 본문이 비어 있다(헤더도 없음). `status_codes`는 상태 코드만 보므로 놓친다. 404 경우에 `content-type`이 `application/json`이고 `error.kind`가 `not_found`인지도 보는 줄을 더해야 한다. 3단계 변형 1과 같은 교훈이다. 상태 코드만 보는 테스트는 응답 모양의 회귀를 놓친다.
3. `e2e`가 잡는다. 트래커가 닫히지 않으면 `wait()`가 끝나지 않으므로[^20] 10초 유예를 다 쓰고 `graceful shutdown timed out`으로 실패한다. 실행 시간이 10.13초로 늘어나는 것도 신호다. 이 버그는 진짜 서버와 진짜 종료를 거쳐야만 드러난다. e2e를 하나 남겨 둔 까닭이다.

</details>


**변형 2.** 릴리스 프로필에 `panic = "abort"`를 넣으면 바이너리가 조금 작아진다. 이 서비스의 핸들러 하나가 패닉하면 무엇이 달라지는가? 테스트로 이 차이를 알 수 있는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

기본값 `unwind`에서는 패닉이 그 태스크에서 멈춘다. tokio는 패닉한 태스크를 `JoinError`로 돌려주고(`is_panic()`이 `true`)[^21], 다른 태스크는 계속 돈다. 5단계 파일 사본에 패닉하는 라우트를 하나 더해 진짜 소켓으로 보내 보면, 그 연결은 응답 없이 닫혔고(읽은 바이트 0) 바로 뒤의 `GET /health`는 `200 {"links":0,"status":"ok"}`를 받았다. `abort`에서는 패닉 한 번에 프로세스가 끝난다[^4]. 처리 중이던 다른 요청도 모두 끊기고, 안전한 종료도 일어나지 않는다. 테스트로는 이 차이를 볼 수 없다. Cargo는 테스트·벤치마크 빌드에서 이 설정을 무시하기 때문이다[^4]. 그래서 이 설정은 테스트가 아니라 리뷰에서 막아야 한다.

</details>


**변형 3.** 하위목표 2의 옛 전략 `".{0,64}"`를 그대로 두고 `if let Ok(u)`만 `let u = Url::parse(&s).unwrap();`로 바꾸면 어떻게 되는가? 이 경험에서 성질 테스트를 쓸 때 지킬 규칙 하나를 말하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

바로 실패한다. 실행하면 `called Result::unwrap() on an Err value: EmptyUrl`과 함께 `minimal failing input: s = ""`, `successes: 0`이 찍힌다. 처음 만난 실패 입력을 축소가 빈 문자열까지 줄였고, 성공한 입력은 하나도 없었다. 이 바꾼 테스트는 성질로는 틀렸지만, "걸러진 뒤 남는 입력이 없다"는 사실은 바로 드러낸다. 규칙은 이렇다. 조건으로 걸러 내는 성질 테스트는 걸러진 뒤 남는 입력이 충분한지 확인한다. 통과 수를 한 번 세어 보거나, 일부러 버그를 넣어 테스트가 실패하는지 본다.

</details>


[^1]: Nicholas Nethercote, The Rust Performance Book, "Build Configuration"(릴리스 빌드는 개발 빌드보다 10~100배 빠른 일이 흔하다, `codegen-units = 1`은 실행 속도를 올리고 컴파일을 늦춘다) — https://nnethercote.github.io/perf-book/build-configuration.html
[^2]: The Rust Programming Language, 11.3 Test Organization(단위·통합 테스트, `src/main.rs`만 있는 바이너리 크레이트는 `tests/`에서 쓸 수 없다, `lib.rs` + 얇은 `main.rs`) — https://doc.rust-lang.org/book/ch11-03-test-organization.html
[^3]: The Cargo Book, `cargo test`의 Manifest Options `--locked`("such as in CI pipelines") — https://doc.rust-lang.org/cargo/commands/cargo-test.html
[^4]: The Cargo Book, Profiles(릴리스 기본값, `lto`, `codegen-units`, `debug = "line-tables-only"`, `panic = "abort"`는 패닉 때 프로세스 종료, 테스트·벤치마크는 `panic` 설정을 무시) — https://doc.rust-lang.org/cargo/reference/profiles.html
[^5]: Docker Hub, 공식 이미지 `rust`의 Supported tags(`1.99-slim-trixie` 등) — https://hub.docker.com/_/rust
[^6]: Docker Hub, 공식 이미지 `debian`의 Supported tags(`trixie-slim`, trixie는 Debian 13) — https://hub.docker.com/_/debian
[^7]: Docker 문서, Multi-stage builds(`FROM … AS <NAME>`, `COPY --from`, 최종 이미지에 빌드 도구가 없다) — https://docs.docker.com/build/building/multi-stage/
[^8]: sqlx README, Cargo Feature Flags(`sqlite`: "SQLite bundled and statically-linked", `sqlite-unbundled`는 시스템 라이브러리) — https://github.com/launchbadge/sqlx/blob/main/README.md
[^9]: Kubernetes 문서, Liveness, Readiness, and Startup Probes(liveness는 재시작 판단, readiness는 트래픽을 받을 준비) — https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/
[^10]: The Cargo Book, Continuous Integration의 GitHub Actions 예(`actions/checkout@v6`, `rustup update … && rustup default …`) — https://doc.rust-lang.org/cargo/guide/continuous-integration.html
[^11]: Clippy 문서, Continuous Integration — GitHub Actions(`RUSTFLAGS: "-Dwarnings"`, `cargo clippy --all-targets --all-features`) — https://doc.rust-lang.org/clippy/continuous_integration/github_actions.html
[^12]: rustfmt README, CI 사용(`cargo fmt --all -- --check`, 바꿀 것이 있으면 종료 코드 1) — https://github.com/rust-lang/rustfmt
[^13]: Swatinem/rust-cache README(`~/.cargo`와 의존성 빌드 결과 캐시, 캐시 키에 rustc 버전을 쓰므로 툴체인을 먼저 고른다) — https://github.com/Swatinem/rust-cache
[^14]: EmbarkStudios/cargo-deny-action README(`command: check …`, advisories만 `continue-on-error`로 두는 권장 구성) — https://github.com/EmbarkStudios/cargo-deny-action
[^15]: cargo-deny 문서, Checks(licenses, bans, advisories, sources) — https://embarkstudios.github.io/cargo-deny/checks/index.html
[^16]: cargo-deny 문서, Config(`deny.toml` 예: `[graph]`, `[advisories]`, `[licenses]`, `[bans] multiple-versions = "deny"`, `[sources]`) — https://embarkstudios.github.io/cargo-deny/checks/cfg.html
[^17]: Docker 문서, Dockerfile reference의 `EXPOSE`("doesn't actually publish the port")와 `USER` — https://docs.docker.com/reference/dockerfile/
[^18]: sqlx 0.9.0 문서, struct `SqliteConnectOptions`의 URL 예(`sqlite:///data.db`는 루트 디렉터리부터) — https://docs.rs/sqlx/0.9.0/sqlx/sqlite/struct.SqliteConnectOptions.html
[^19]: cargo-chef README(`cargo chef prepare`·`cook`으로 의존성 빌드 층을 캐시) — https://github.com/LukeMathWalker/cargo-chef
[^20]: tokio-util 0.7.20 문서, struct `TaskTracker`의 `wait`(닫히고 비었을 때만 끝난다) — https://docs.rs/tokio-util/0.7.20/tokio_util/task/task_tracker/struct.TaskTracker.html
[^21]: tokio 문서, struct `JoinError`(`is_panic`, 패닉한 태스크를 기다리면 `JoinError`를 받는 예) — https://docs.rs/tokio/latest/tokio/task/struct.JoinError.html
{% endraw %}
