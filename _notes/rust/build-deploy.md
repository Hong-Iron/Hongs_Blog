---
layout: "note"
title: "빌드와 배포"
display_title: "빌드와 배포 (Build and Deploy)"
kind: "concept"
kind_label: "기법"
num: "50"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Build and Deploy", "Release Build", "배포 빌드", "strip", "musl", "glibc", "Static Linking", "정적 링크", "crt-static", "Cross Compilation", "교차 컴파일", "Dockerfile", "Multi-stage Build", "다단계 빌드", "cargo-chef", "HEALTHCHECK", "Health Check", "Liveness Probe", "Readiness Probe", "env!", "option_env!", "cfg!", "build.rs", "--locked"]
description: "배포는 다 만든 요리를 도시락에 담아 보내는 일이다. 주방(컴파일러, 소스, 빌드 캐시)은 두고 요리(실행 파일 하나)만 담으면 작고 가벼운데, 실행 파일 하나로 나오는 Rust는 이 일이 쉬운 편이다. 다만 그 파일도 운영체제의 C 라이브러리나 인증서 파일 같은 바깥의 것에 기댄…"
prev_url: "/studies/rust/api-design/"
prev_title: "API 설계 원칙"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "50_build-deploy_verify.rs", "u": "/studies/rust/code/50_build-deploy_verify/", "r": "검증"}]
permalink: "/studies/rust/build-deploy/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

배포는 다 만든 요리를 도시락에 담아 보내는 일이다. 주방(컴파일러, 소스, 빌드 캐시)은 두고 요리(실행 파일 하나)만 담으면 작고 가벼운데, 실행 파일 하나로 나오는 Rust는 이 일이 쉬운 편이다. 다만 그 파일도 운영체제의 C 라이브러리나 인증서 파일 같은 바깥의 것에 기댄다. 그리고 "지금 도는 것이 어느 커밋인가", "살아 있는가"를 밖에서 물을 수 있게 해 두지 않으면, 장애가 났을 때 아무것도 답할 수 없다.

</div>


## 예시로 보기

새벽에 단축 URL 서비스가 이상하다는 연락이 왔다. 가장 먼저 물을 것은 "지금 도는 실행 파일은 어느 판, 어느 커밋에서 만들었나"다. 서버에 들어가 실행 파일을 들여다봐도 그 답은 없다. 그래서 빌드할 때 그 정보를 실행 파일 안에 넣어 둔다.

```rust
const VERSION: &str = env!("CARGO_PKG_VERSION");          // Cargo.toml의 version
const GIT_HASH: Option<&str> = option_env!("GIT_HASH");   // 빌드할 때 있었으면 Some
```

`env!`와 `option_env!`는 프로그램이 돌 때가 아니라 **컴파일할 때** 환경 변수를 읽어 그 글자를 실행 파일에 박는다[^2][^3]. 버전 `1.4.2`, build.rs가 대상 플랫폼을 넣어 주는 작은 패키지로 확인한 결과는 이렇다.

| 명령 | 출력 |
|---|---|
| `cargo run` | `buildinfo-demo 1.4.2 (unknown) target=aarch64-apple-darwin debug_assertions=true` |
| `GIT_HASH=abc1234 cargo run` | `buildinfo-demo 1.4.2 (abc1234) target=aarch64-apple-darwin debug_assertions=true` |
| `GIT_HASH=abc1234 cargo run --release` | `buildinfo-demo 1.4.2 (abc1234) target=aarch64-apple-darwin debug_assertions=false` |

둘째 줄에서 코드는 그대로인데 환경 변수만 바꿨다. 그래도 cargo가 알아채고 다시 컴파일했다. 소스의 `env!`·`option_env!`가 읽는 변수는 1.46부터 cargo가 저절로 지켜본다[^4]. 반대로 실행할 때 준 값은 아무 효과가 없다. 검증 코드에서 `APP_GIT_HASH=abc1234`로 컴파일한 실행 파일은, 실행할 때 `APP_GIT_HASH=zzz`를 줘도 `abc1234`를 찍었다. 값은 이미 파일 안에 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `env!`의 컴파일 오류와 사용자 메시지, `option_env!`, `cfg!` 갈래의 E0425, build.rs의 `cargo::rustc-env`, 환경 변수가 바뀌면 다시 빌드되는 것, `--locked`가 lock 파일을 만들거나 고치려 할 때 멈추는 것, release 빌드에 cargo가 넘기는 `-C strip=` 값, musl 타깃의 기본 `crt-static`을 rustc 1.99.0과 cargo로 실행해 확인했다. 아래 Dockerfile과 쿠버네티스 설정은 실행하지 않았다. Dockerfile은 필요한 줄이 있는지만 글자로 점검했다 — [50_build-deploy_verify.rs](/Hongs_Blog/studies/rust/code/50_build-deploy_verify/). 상태 확인 엔드포인트와 커밋 해시 build.rs는 [배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/)의 p3·p4에서 실행해 확인했다.</div>

</div>


## 빌드할 때 값 넣기

| 도구 | 언제 읽나 | 값이 없으면 | 쓰는 곳 |
|---|---|---|---|
| `env!("X")` | 컴파일 | 컴파일 오류[^2] | 반드시 있어야 하는 값. 예: `CARGO_PKG_VERSION` |
| `option_env!("X")` | 컴파일 | `None`, 빌드는 된다[^3] | 있을 수도 없을 수도 있는 값. 예: 커밋 해시 |
| `std::env::var("X")` | 실행 | `Err` | 배포마다 다른 설정. 예: DB 주소 |

`env!`가 실패하면 이렇게 나온다. 두 번째 인자로 메시지를 바꿀 수 있다[^2].

```text
error: environment variable `APP_GIT_HASH` not defined at compile time
  = help: use `std::env::var("APP_GIT_HASH")` to read the variable at run time
```

cargo는 컴파일하는 크레이트에 `CARGO_PKG_NAME`, `CARGO_PKG_VERSION` 같은 변수를 넣어 준다. `Cargo.toml`에 적지 않은 항목은 빈 문자열이다[^1]. 그 밖의 값은 패키지 맨 위의 `build.rs`(빌드 스크립트)가 만든다. 빌드 스크립트는 컴파일 전에 cargo가 먼저 돌리는 작은 프로그램이다. `cargo::rustc-env=이름=값`을 찍으면 그 값을 `env!`로 읽을 수 있다. Cargo 문서도 git HEAD의 해시나 CI 빌드 번호를 넣는 데 쓴다고 적는다[^4].

```rust
// build.rs
fn main() {
    println!("cargo::rerun-if-changed=build.rs");
    let target = std::env::var("TARGET").expect("cargo가 TARGET을 준다");
    println!("cargo::rustc-env=BUILD_TARGET={target}");
}
```

`TARGET`은 cargo가 빌드 스크립트에만 주는 변수로, 무엇을 위해 컴파일하는지(대상 플랫폼 이름)를 알려 준다[^1]. `cargo::` 두 콜론 문법은 Cargo 1.77부터다. 더 낮은 판을 지원하려면 `cargo:`를 쓴다[^4]. 빌드 스크립트가 직접 환경 변수를 읽으면 `cargo::rerun-if-env-changed=이름`을 찍어야 그 변수가 바뀔 때 다시 돈다. 자동으로 지켜보는 것은 소스의 `env!`·`option_env!`뿐이다[^4]. git이 없는 곳에서도 깨지지 않는 커밋 해시 build.rs는 [배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/) p4에서 만든다.

DB 주소, 비밀 키처럼 배포마다 다른 값은 `env!`로 넣지 않는다. 실행 파일에 박히면 바꿀 때마다 다시 빌드해야 하고, 비밀값이 파일 안에 글자로 남는다. 실행할 때 읽는 법은 [설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/)에 있다.

### cfg!와 #[cfg]

`cfg!(조건)`은 컴파일할 때 `true`나 `false`가 될 뿐 코드를 지우지 않는다. 그래서 `if cfg!(windows)`의 두 갈래는 모두 모든 플랫폼에서 컴파일되어야 한다[^5]. 검증 코드에서 `#[cfg(windows)]`로 만든 함수를 `if cfg!(windows) { only_windows() }` 안에서 부르니, macOS에서 `error[E0425]: cannot find function only_windows in this scope`로 멈췄다. `#[cfg(windows)]`는 조건이 거짓이면 그 코드를 아예 지우므로, 갈래를 `#[cfg]`로 나누니 통과했다. 플랫폼마다 다른 코드는 `#[cfg]`로, 같은 코드 안에서 값만 바꿀 때는 `cfg!`로 쓴다. `cfg!(debug_assertions)`는 위 표처럼 dev에서 `true`, release에서 `false`다.

## 배포용 빌드 명령과 프로필

배포 이미지와 CI에서는 이렇게 빌드한다.

```sh
cargo build --release --locked
```

`--locked`는 `Cargo.lock`에 적힌 판을 그대로 쓰겠다는 다짐이다. lock 파일이 없거나 cargo가 lock 파일을 고쳐야 하면 멈춘다[^8]. 검증 코드에서 lock 파일이 없을 때 `cannot create the lock file`, `Cargo.toml`의 버전을 올려 lock 파일이 바뀌어야 할 때 `cannot update the lock file`로 멈췄다. 개발자 노트북에서 받은 의존성과 배포 이미지의 의존성이 몰래 달라지는 일을 막는다. `--frozen`은 `--locked`에 네트워크 금지(`--offline`)를 더한 것이다[^8].

release 프로필의 최적화 설정(`lto`, `codegen-units`, `panic`)과 효과는 [성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)에 있다. 배포에서 따로 볼 것은 실행 파일에 무엇을 남기느냐다.

`strip`은 실행 파일에서 디버그 정보(`"debuginfo"`)나 심볼까지(`"symbols"`) 떼어 낸다[^6]. Cargo Book의 기본값 표에는 release도 `strip = "none"`으로 적혀 있다[^6]. 그런데 Rust 1.77부터 cargo는 디버그 정보를 켜지 않은 프로필에서 디버그 정보를 저절로 떼어 낸다. 미리 컴파일되어 오는 표준 라이브러리에 디버그 정보가 들어 있기 때문이다[^7]. `cargo build --release -v`로 cargo가 rustc에 넘기는 인자를 보니 실제로 그랬다.

| `[profile.release]` 설정 | cargo가 넘긴 인자 |
|---|---|
| 기본값 | `-C opt-level=3`, `-C strip=debuginfo` |
| `strip = "symbols"` | `-C strip=symbols` |
| `debug = "line-tables-only"` | `-C debuginfo=line-tables-only`, `strip` 없음 |

`"line-tables-only"`는 panic 백트레이스에 파일 이름과 줄 번호를 남길 만큼만 디버그 정보를 넣는다[^6]. 서비스라면 로그에 찍힌 panic 위치가 쓸모 있으니 이것을 켜 두는 경우가 많다. 파일이 조금 커지는 대가다.

## C 라이브러리와 정적 링크: musl

Rust 프로그램도 파일을 열거나 메모리를 받을 때 운영체제의 C 라이브러리(libc)를 거친다. 리눅스용 타깃은 둘로 나뉜다. `x86_64-unknown-linux-gnu`는 glibc를, `x86_64-unknown-linux-musl`은 musl이라는 다른 C 라이브러리를 쓴다.

컴파일러의 타깃은 대개 C 라이브러리를 동적으로 링크한다. 실행 파일 안에 넣지 않고, 실행할 때 그 기계에 깔린 것을 불러 쓴다는 뜻이다. musl 타깃은 예외로, 기본이 정적 링크다. C 라이브러리를 실행 파일 안에 넣는다[^9]. 이것을 정하는 설정이 `crt-static`이다. `-C target-feature=+crt-static`으로 켜고 `-crt-static`으로 끈다[^9]. 이 기계에 musl용 표준 라이브러리는 없지만, 타깃별 기본 설정은 `rustc --print cfg --target ...`으로 볼 수 있다.

| 타깃 | `target_feature="crt-static"` |
|---|---|
| `x86_64-unknown-linux-musl`, `aarch64-unknown-linux-musl` | 있다 |
| `x86_64-unknown-linux-gnu` | 없다 |
| `x86_64-unknown-linux-musl`에 `-C target-feature=-crt-static` | 없다 |

| | glibc (`-gnu`) | musl (`-musl`) |
|---|---|---|
| C 라이브러리 | 실행하는 기계의 것을 쓴다 | 실행 파일 안에 들어 있다 |
| 실행 이미지 | 같은 C 라이브러리가 있는 이미지(예: `debian:trixie-slim`) | 빈 이미지(`scratch`)에서도 돈다 |
| 지원 등급 | Tier 1, "돌아감을 보장"[^10] | Tier 2, "빌드됨을 보장"[^10] |

같은 이유로 glibc 빌드는 빌드 단계와 실행 단계의 배포판을 맞춘다. gnu 타깃은 glibc 2.17 이상을 요구한다고 적혀 있을 만큼 glibc 판에 기댄다[^10]. 아래 Dockerfile이 두 단계 모두 Debian `trixie`를 쓰는 까닭이다.

`scratch` 이미지에는 정말 아무것도 없다. Docker 문서는 거기서 돌 프로그램에 실행할 때 기댈 것(동적 링크한 C 라이브러리, CA 인증서 등)이 없어야 한다고 적는다[^16]. musl로 C 라이브러리 문제는 풀어도, HTTPS로 바깥 서버를 부른다면 인증서 파일은 따로 넣어야 한다. 공식 Rust 이미지의 alpine 판도 musl을 쓰며, C 라이브러리에 깊이 기대는 소프트웨어는 문제를 겪을 수 있다고 적는다[^17].

## 교차 컴파일

내 컴퓨터와 다른 플랫폼용으로 빌드하는 것을 교차 컴파일이라 부른다. 세 가지가 필요하다.

1. `rustup target add x86_64-unknown-linux-musl`. 이 명령은 그 타깃용 표준 라이브러리만 설치한다[^11].
2. 그 타깃용 링커. rustup은 설치해 주지 않는다[^11]. `.cargo/config.toml`의 `[target.x86_64-unknown-linux-musl]` 아래 `linker = "..."`, 또는 환경 변수 `CARGO_TARGET_<타깃>_LINKER`로 알려 준다[^12].
3. `cargo build --release --target x86_64-unknown-linux-musl`. 결과는 `target/x86_64-unknown-linux-musl/release/`에 생긴다[^13].

`--target`을 주면 빌드 스크립트와 절차 매크로는 내 컴퓨터용으로 따로 빌드되고 `RUSTFLAGS`도 함께 쓰지 않는다[^13]. 이 기계에는 `aarch64-apple-darwin` 표준 라이브러리만 있어서 교차 빌드는 실행하지 않았다. 리눅스 서버에 낼 것이라면 아래처럼 Docker 안의 리눅스에서 빌드하는 편이 링커 설정이 필요 없어 간단하다.

## Dockerfile: 두 단계로 나눠 빌드하기

`FROM`을 여러 번 쓰는 다단계 빌드로 빌드 도구와 실행 파일을 가른다. 앞 단계에 `AS builder`로 이름을 붙이고, 뒤 단계에서 `COPY --from=builder`로 결과만 가져온다. 빌드 도구는 마지막 이미지에 들어가지 않는다[^14]. 아래는 이 과목에서 실행하지 않은 예다.

```dockerfile
# syntax=docker/dockerfile:1

# 1단계: 빌드. 툴체인과 소스가 있는 큰 이미지
FROM rust:1.99-slim-trixie AS builder
WORKDIR /app
COPY . .
ARG GIT_HASH=unknown
ENV GIT_HASH=${GIT_HASH}
RUN cargo build --release --locked --bin shortener

# 2단계: 실행. 실행 파일 하나만 옮긴다
FROM debian:trixie-slim AS runtime
COPY --from=builder /app/target/release/shortener /usr/local/bin/shortener
USER 10001:10001
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD ["/usr/local/bin/shortener", "healthcheck"]
ENTRYPOINT ["/usr/local/bin/shortener"]
```

```text
# .dockerignore
target/
.git/
```

| 줄 | 하는 일 |
|---|---|
| `rust:1.99-slim-trixie`, `debian:trixie-slim` | 공식 이미지의 태그다. slim은 작은 판이다. rust 쪽은 rust를 돌릴 최소 패키지만 넣었고, debian 쪽은 man 페이지 같은 파일을 뺐다[^17][^18]. Rust 버전을 숫자로 못 박아 빌드가 매번 같게 한다 |
| `ARG GIT_HASH` | `docker build --build-arg GIT_HASH=$(git rev-parse --short HEAD) .`로 받는다. 빌드 인자는 `docker history`에 보이므로 비밀값을 넣지 않는다[^15] |
| `.dockerignore`의 `.git/` | 이미지 안에 git 기록이 없다. 그래서 커밋 해시는 git 대신 빌드 인자로 넘긴다 |
| `USER 10001:10001` | 이 단계의 나머지와 실행할 때의 `ENTRYPOINT`가 이 사용자로 돈다[^15]. root로 돌지 않는다 |
| `EXPOSE 8080` | 포트를 열지 않는다. 문서 구실만 하고, 실제로 열려면 `docker run -p`가 필요하다[^15] |
| `HEALTHCHECK ... CMD [...]` | Docker가 주기적으로 이 명령을 돌린다. 종료 코드 0은 건강, 1은 아픔, 2는 예약이라 쓰지 않는다. `retries`번 잇달아 실패하면 `unhealthy`가 된다. 여러 개 적으면 마지막 것만 쓴다[^15] |
| `ENTRYPOINT ["..."]` | 대괄호로 쓰는 exec 형식이다. 셸 형식(`ENTRYPOINT /usr/local/bin/shortener`)은 `/bin/sh -c` 아래에서 돌아서 앱이 PID 1이 아니고 신호를 받지 못한다. 그러면 `docker stop`의 SIGTERM이 앱에 닿지 않는다[^15] |

종료 신호는 `STOPSIGNAL`로 바꾸지 않으면 SIGTERM이다[^15]. 앱이 SIGTERM을 받아 처리 중인 요청을 마치고 끝나는 법은 [안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/)에 있다. `HEALTHCHECK`가 curl 대신 실행 파일 자신을 부르는 것은, 실행 이미지에 도구를 더 넣지 않기 위해서다. 그 `healthcheck` 하위 명령의 구현은 [배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/) p3에 있다.

<details class="callout callout-example" markdown="1">
<summary class="callout-title" markdown="span">cargo-chef로 의존성 층 캐시하기</summary>

위 파일은 `COPY . .` 다음에 바로 빌드하므로 소스 한 줄만 바뀌어도 의존성까지 처음부터 다시 컴파일한다. cargo-chef는 이것을 나눈다. 계획 단계에서 `cargo chef prepare --recipe-path recipe.json`으로 의존성 목록(recipe)을 뽑고, 빌드 단계에서 `cargo chef cook --release --recipe-path recipe.json`으로 의존성만 먼저 빌드한 뒤 소스를 복사해 `cargo build`를 한다. 의존성이 그대로면 recipe도 그대로라 그 층은 캐시에서 나온다[^19].

```dockerfile
FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
WORKDIR /app
FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json
FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release --locked --bin shortener
# 실행 단계는 위와 같다
```

모든 단계에서 같은 Rust 판을 써야 하고, 로컬 컴퓨터에서 직접 돌리는 도구가 아니다[^19].

</details>


## 상태 확인: 살아 있나, 받아도 되나

쿠버네티스 같은 배치 도구는 컨테이너에 두 가지를 따로 묻는다[^20].

| 질문 | 이름 | 실패하면 |
|---|---|---|
| 살아 있나? | liveness 프로브 | 컨테이너를 재시작한다 |
| 요청을 받아도 되나? | readiness 프로브 | 재시작하지 않고 그 Pod로 가는 트래픽만 끊는다[^21] |
| 시작은 끝났나? | startup 프로브 | 컨테이너를 죽이고 재시작 정책을 따른다 |

HTTP로 물을 때는 200 이상 400 미만이면 성공이다[^21]. 두 프로브는 서로를 기다리지 않는다[^21].

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /readyz
    port: 8080
  periodSeconds: 5
```

엔드포인트 둘이 답하는 것을 다르게 둔다.

- `/healthz`(살아 있나)는 프로세스가 답할 수 있으면 200이다. DB를 보지 않는다. DB가 죽었을 때 이것이 실패하면 모든 Pod가 재시작된다. 재시작해도 DB는 살아나지 않으니 일만 커진다.
- `/readyz`(받아도 되나)는 시작 준비(DB 연결, 설정 읽기)가 끝나야 200이고, 종료를 시작하면 다시 503으로 바꾼다. 그러면 새 요청은 다른 Pod로 가고, 이 Pod는 처리 중인 요청만 마치고 끝난다.
- `/version`은 위에서 넣은 이름·버전·커밋 해시를 JSON으로 돌려준다.

p3의 코드에서 종료를 시작하자 `/readyz`는 503, `/healthz`는 200이었다. 서버가 꺼진 뒤 `healthcheck` 하위 명령은 1을 돌려줬다.

## 활용

- **배포 전 점검.** `cargo build --release --locked`로 빌드한다. 버전과 커밋 해시가 실행 파일에 들어 있다(`--version` 플래그나 `/version`). 컨테이너는 root가 아니고, `ENTRYPOINT`는 exec 형식이고, 앱은 SIGTERM을 처리한다. `/healthz`와 `/readyz`가 따로 있다. 빌드와 실행 이미지의 배포판이 같다.
- **CI와 같은 명령.** [CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/)를 통과한 커밋만 이미지로 만든다. 이미지 태그에 커밋 해시를 쓰면 `/version`의 값과 이미지가 바로 이어진다.
- **흔한 실수.**
  - 이미지 안에서 `cargo run`이나 dev 빌드로 돌린다. 최적화가 꺼져 열 배 느릴 수 있다([성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)).
  - 셸 형식 `ENTRYPOINT`나 `CMD`를 쓴다. SIGTERM이 앱에 닿지 않아 안전한 종료 코드가 돌지 않는다.
  - liveness가 DB나 다른 서비스까지 확인한다. 바깥 장애가 내 Pod의 연쇄 재시작으로 번진다.
  - 비밀값을 `ARG`나 `env!`로 넣는다. `docker history`나 실행 파일 안에 글자로 남는다.
  - build.rs가 `git`을 `unwrap()`으로 부른다. `.git`이 없는 Docker 빌드에서 빌드가 깨진다(p4).
  - `panic = "abort"`를 켜고 "panic이 나도 요청 하나만 실패한다"고 기대한다. 프로세스가 통째로 끝난다([panic을 쓸 때](/Hongs_Blog/studies/rust/panic-policy/)).

## 연결

- 선수: [cargo와 패키지 구조](/Hongs_Blog/studies/rust/cargo-packages/)(프로필, 기능), [성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)(release 설정), [CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/)
- SIGTERM을 받아 끝내기: [안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/)
- 실행할 때 읽는 설정: [설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/)
- 상태 확인 엔드포인트를 얹을 라우터: [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)
- 링커가 목적 파일과 라이브러리를 합치는 과정: [어셈블·링크·실행 과정](/Hongs_Blog/studies/assembly-language/assemble-link-execute/). 정적 링크는 라이브러리 코드를 실행 파일에 넣고, 동적 링크는 실행할 때 운영체제가 찾아 붙인다.
- 직접 만들어 보기: [배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"Rust 실행 파일은 혼자 도니까 어떤 이미지에 넣어도 된다"</div>

틀렸다. 리눅스 기본 타깃(`-gnu`)은 C 라이브러리를 동적으로 링크한다. 실행할 때 그 이미지에 맞는 glibc가 있어야 하고, 빈 `scratch` 이미지에서는 돌지 않는다. "혼자 돈다"는 말은 파이썬이나 JVM 같은 런타임이 따로 필요 없다는 뜻이지, 운영체제의 C 라이브러리까지 필요 없다는 뜻이 아니다. musl 타깃으로 정적 링크하면 C 라이브러리 문제는 사라지지만 HTTPS용 인증서 같은 파일은 여전히 바깥에서 와야 한다. 확인은 `rustc --print cfg --target <타깃>`에 `crt-static`이 있는지, 그리고 실행 이미지에서 실제로 실행해 보는 것이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** Dockerfile 마지막 줄이 `ENTRYPOINT /usr/local/bin/shortener`다. 앱에는 SIGTERM을 받으면 처리 중인 요청을 마치고 끝나는 코드가 있다. 그런데 `docker stop` 때 그 코드가 돌지 않는다. 왜인가? 어떻게 고치나?</summary>

**답:** 셸 형식이라 앱이 `/bin/sh -c`의 자식으로 돈다. 앱이 PID 1이 아니고, 셸이 신호를 넘겨주지 않아 SIGTERM이 앱에 닿지 않는다. `ENTRYPOINT ["/usr/local/bin/shortener"]`처럼 exec 형식으로 쓴다.<br>
**흔한 오답:** "앱의 신호 처리 코드가 틀렸다." 로컬에서 `kill -TERM`으로 보내면 잘 도는 코드도 셸 형식 아래에서는 신호를 받지 못한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 값을 `env!`, `option_env!`, `std::env::var` 중 무엇으로 읽나? (가) 패키지 버전 (나) 커밋 해시. CI에서는 넘겨주지만 개발자 노트북에서는 없을 수 있다 (다) DB 주소</summary>

**답:** (가) `env!("CARGO_PKG_VERSION")` (나) `option_env!("GIT_HASH").unwrap_or("unknown")` (다) `std::env::var("DATABASE_URL")`<br>
**이유:** 버전은 cargo가 늘 넣어 주므로 없으면 오류가 맞다. 커밋 해시는 없을 수 있으니 `env!`로 쓰면 노트북 빌드가 깨진다. DB 주소는 배포마다 다르고 비밀일 수 있으니 실행할 때 읽는다. `env!`로 읽으면 빌드한 기계의 값이 파일에 박힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 위의 build.rs(`BUILD_TARGET`을 넣는다)와 `main.rs`(이름, 버전, `GIT_HASH`, `BUILD_TARGET`, `cfg!(debug_assertions)`를 찍는다)가 있는 버전 1.4.2 패키지 `buildinfo-demo`를 aarch64 macOS에서 (가) `cargo run` (나) 이어서 `GIT_HASH=abc1234 cargo run --release`로 돌린다. 출력은?</summary>

**답:** (가) `buildinfo-demo 1.4.2 (unknown) target=aarch64-apple-darwin debug_assertions=true` (나) `buildinfo-demo 1.4.2 (abc1234) target=aarch64-apple-darwin debug_assertions=false`<br>
**이유:** (가)에는 `GIT_HASH`가 없어 `option_env!`가 `None`이다. (나)는 release라 `debug_assertions`가 꺼지고, 컴파일할 때 `GIT_HASH`가 있었으므로 그 값이 박힌다. 검증 코드에서 찍힌 값이다.

</details>


[^1]: The Cargo Book, Environment Variables — https://doc.rust-lang.org/cargo/reference/environment-variables.html (크레이트에 주는 `CARGO_PKG_VERSION`·`CARGO_PKG_NAME`, `env!`로 읽는 예, 매니페스트에 없으면 빈 문자열, 빌드 스크립트에 주는 `TARGET`·`HOST`·`OUT_DIR`, `PROFILE`은 권하지 않는다)
[^2]: std 문서, macro `env!` — https://doc.rust-lang.org/std/macro.env.html (컴파일할 때 읽어 `&'static str`이 된다, 없으면 컴파일 오류, 두 번째 인자로 메시지, 실행 중에는 `std::env::var`)
[^3]: std 문서, macro `option_env!` — https://doc.rust-lang.org/std/macro.option_env.html (컴파일할 때 읽어 `Option<&'static str>`, 없으면 `None`)
[^4]: The Cargo Book, Build Scripts — https://doc.rust-lang.org/cargo/reference/build-scripts.html (`cargo::rustc-env`로 `env!`에 값 넘기기, git HEAD 해시나 CI 식별자를 넣는 데 쓴다, `rerun-if-changed`, `rerun-if-env-changed`, 1.46부터 `env!`·`option_env!`의 변수는 저절로 지켜본다, `cargo::` 문법은 1.77부터)
[^5]: std 문서, macro `cfg!` — https://doc.rust-lang.org/std/macro.cfg.html (`#[cfg]`와 달리 코드를 지우지 않고 true/false만 낸다, if/else의 모든 갈래가 유효해야 한다)
[^6]: The Cargo Book, Profiles — https://doc.rust-lang.org/cargo/reference/profiles.html (`strip`의 `"none"`·`"debuginfo"`·`"symbols"`, 기본값 표의 `strip = "none"`, `debug = "line-tables-only"`는 백트레이스에 파일·줄 번호를 남길 최소 정보)
[^7]: Rust 블로그, Announcing Rust 1.77.0, "Enable strip in release profiles by default" — https://blog.rust-lang.org/2024/03/21/Rust-1.77.0/ (디버그 정보를 켜지 않은 프로필은 `strip = "debuginfo"`가 기본, 미리 컴파일된 표준 라이브러리에 디버그 정보가 있어서)
[^8]: The Cargo Book, cargo build — https://doc.rust-lang.org/cargo/commands/cargo-build.html (`--locked`: lock 파일이 없거나 바뀌어야 하면 오류, CI처럼 같은 빌드가 필요한 곳 / `--frozen` = `--locked` + `--offline` / `--target`)
[^9]: The Rust Reference, Linkage — Static and dynamic C runtimes — https://doc.rust-lang.org/reference/linkage.html (타깃은 대개 C 런타임을 동적 링크, `x86_64-unknown-linux-musl` 등은 기본이 정적, `crt-static` 타깃 기능과 `-C target-feature=+crt-static`)
[^10]: The rustc book, Platform Support — https://doc.rust-lang.org/rustc/platform-support.html (Tier 1 "guaranteed to work", Tier 2 "guaranteed to build", `x86_64-unknown-linux-gnu`은 glibc 2.17+, `x86_64-unknown-linux-musl`은 musl 1.2.5)
[^11]: The rustup book, Cross-compilation — https://rust-lang.github.io/rustup/cross-compilation.html (`rustup target add`는 표준 라이브러리만 설치, `cargo build --target`, 링커는 따로 준비)
[^12]: The Cargo Book, Configuration — https://doc.rust-lang.org/cargo/reference/config.html (`target.<triple>.linker`, `CARGO_TARGET_<triple>_LINKER`, `build.target`)
[^13]: The Cargo Book, Build Cache — https://doc.rust-lang.org/cargo/reference/build-cache.html (`--target`이면 `target/<triple>/release/`, 빌드 스크립트·절차 매크로는 따로 빌드되고 `RUSTFLAGS`를 함께 쓰지 않는다)
[^14]: Docker 문서, Multi-stage builds — https://docs.docker.com/build/building/multi-stage/ (`FROM`을 여러 번, `AS <이름>`, `COPY --from=`, 빌드 도구는 결과 이미지에 들어가지 않는다)
[^15]: Docker 문서, Dockerfile reference — https://docs.docker.com/reference/dockerfile/ (`USER`, `EXPOSE`는 포트를 열지 않는다, `ARG`와 `--build-arg`, 비밀값은 `docker history`에 보여 권하지 않는다, `HEALTHCHECK`의 형식·기본값·종료 코드 0/1/2·`retries`·마지막 하나만, `ENTRYPOINT` 셸 형식은 신호를 받지 못한다, `STOPSIGNAL` 기본 SIGTERM)
[^16]: Docker 문서, Base images — https://docs.docker.com/build/building/base-images/ (`scratch`에서 돌 프로그램은 동적 링크 C 라이브러리·CA 인증서 같은 실행 때 의존성이 없어야 한다)
[^17]: Docker 공식 이미지 문서, rust — https://github.com/docker-library/docs/blob/master/rust/README.md (태그 `1.99-slim-trixie` 등, slim은 최소 패키지, alpine은 musl을 쓰며 libc에 기대는 소프트웨어는 문제를 겪을 수 있다)
[^18]: Docker 공식 이미지 문서, debian — https://github.com/docker-library/docs/blob/master/debian/README.md (태그 `trixie-slim`, slim은 man 페이지·문서 같은 파일을 뺀다)
[^19]: cargo-chef README — https://github.com/LukeMathWalker/cargo-chef (`cargo chef prepare`·`cargo chef cook`, 의존성이 그대로면 recipe가 그대로라 층이 캐시된다, 모든 단계에서 같은 Rust 판, 로컬에서 돌리는 도구가 아니다)
[^20]: Kubernetes 문서, Liveness, Readiness, and Startup Probes — https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/ (세 프로브의 뜻과 실패했을 때의 동작)
[^21]: Kubernetes 문서, Configure Liveness, Readiness and Startup Probes — https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/ (`httpGet`의 `path`·`port`·`periodSeconds` 예, 200 이상 400 미만이면 성공, readiness가 실패하면 트래픽을 받지 않는다, 두 프로브는 서로를 기다리지 않는다)
{% endraw %}
