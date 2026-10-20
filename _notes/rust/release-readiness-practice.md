---
layout: "note"
title: "배포 준비 연습"
display_title: "배포 준비 연습"
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
description: "9단원 끝의 네 가지를 손으로 해 보는 문제다. 공개 API를 리뷰하고(p1), 바뀐 내용으로 다음 버전 번호를 정하고(p2), 컨테이너가 물어볼 상태 확인 엔드포인트를 만들고(p3), 커밋 해시를 실행 파일에 넣는 build.rs를 쓴다(p4)."
prev_url: "/studies/rust/capstone-5/"
prev_title: "캡스톤 5 안전한 종료와 부하 조절"
next_url: "/studies/rust/capstone-6/"
next_title: "캡스톤 6 테스트·CI·배포"
math: false
mermaid: false
code_count: 4
code_files: [{"t": "50_release-readiness-practice_p1.rs", "u": "/studies/rust/code/50_release-readiness-practice_p1/", "r": "문제 1 풀이"}, {"t": "50_release-readiness-practice_p2.rs", "u": "/studies/rust/code/50_release-readiness-practice_p2/", "r": "문제 2 풀이"}, {"t": "50_release-readiness-practice_p3.rs", "u": "/studies/rust/code/50_release-readiness-practice_p3/", "r": "문제 3 풀이"}, {"t": "50_release-readiness-practice_p4.rs", "u": "/studies/rust/code/50_release-readiness-practice_p4/", "r": "문제 4 풀이"}]
permalink: "/studies/rust/release-readiness-practice/"
---
{% raw %}
9단원 끝의 네 가지를 손으로 해 보는 문제다. 공개 API를 리뷰하고(p1), 바뀐 내용으로 다음 버전 번호를 정하고(p2), 컨테이너가 물어볼 상태 확인 엔드포인트를 만들고(p3), 커밋 해시를 실행 파일에 넣는 build.rs를 쓴다(p4).

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답과 변형을 코드로 확인했다. p1은 고치기 전 API에 rustc·clippy가 내는 경고를 모으고, 고친 API를 라이브러리로 따로 컴파일해 pedantic까지 경고 0을 확인했다. p2는 라이브러리 두 판과 쓰는 쪽 크레이트를 rustc로 컴파일했다. p3는 oneshot과 127.0.0.1:0의 진짜 소켓으로, p4는 임시 cargo 패키지와 임시 git 저장소로 돌렸다 — [p1](/Hongs_Blog/studies/rust/code/50_release-readiness-practice_p1/) · [p2](/Hongs_Blog/studies/rust/code/50_release-readiness-practice_p2/) · [p3](/Hongs_Blog/studies/rust/code/50_release-readiness-practice_p3/) · [p4](/Hongs_Blog/studies/rust/code/50_release-readiness-practice_p4/)</div>

</div>


## p1 · 공개 API 리뷰

동료가 단축 URL 라이브러리의 첫 판을 리뷰해 달라고 보냈다.

```rust
pub struct shortLink {
    pub URL: String,
    code: String,
}

impl shortLink {
    pub fn get_code(&self) -> &str {
        &self.code
    }

    pub fn as_url(&self) -> String {
        self.URL.clone()
    }

    pub fn into_parts(&self) -> (String, String) {
        (self.code.clone(), self.URL.clone())
    }
}

pub fn parse_code(s: &str) -> Result<String, ()> {
    if !s.is_empty() && s.chars().all(|c| c.is_ascii_alphanumeric()) {
        Ok(s.to_string())
    } else {
        Err(())
    }
}

pub fn shorten(url: &str, permanent: bool) -> shortLink {
    let code = if permanent { "p1" } else { "t1" };
    shortLink { URL: url.to_string(), code: code.to_string() }
}
```

- (가) Rust API 지침에 어긋나는 곳을 아홉 개 찾아라.
- (나) 각각을 누가 잡는가? rustc 기본 경고, 켜야 하는 rustc 린트, clippy 기본, 설정을 바꾼 clippy, 아무도 못 잡음(사람이 본다) 가운데서 고르라.
- (다) 고친 API를 써라.

사용 개념: [API 설계 원칙](/Hongs_Blog/studies/rust/api-design/)의 이름 규칙, 닫힌 필드, `#[must_use]`, [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)의 에러 타입.

풀이 전략: 점검표를 위에서부터 한 줄씩 대 본다. 이름(대소문자, `get_`, `as_`·`to_`·`into_`), 흔한 트레이트, 필드 공개 여부, 인자 타입, 에러 타입 순서다. 린트가 무엇을 볼 수 있는지 생각하면 (나)가 풀린다. 린트는 모양(이름, `self`를 받는 방식, 타입)만 보고, 뜻(비용, 의도)은 모른다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *타입 이름:* `shortLink` → `ShortLink`(C-CASE). rustc 기본 경고 `should have an upper camel case name`이 잡는다.
2. *필드 이름:* `URL` → `url`(C-CASE). rustc 기본 경고 `should have a snake case name`이 잡는다.
3. *흔한 트레이트:* `Debug`가 없다(C-DEBUG). rustc의 `missing_debug_implementations`가 잡지만 기본으로 꺼져 있다. `-W missing_debug_implementations`를 주니 `type does not implement Debug`가 나왔고, 주지 않으니 나오지 않았다.
4. *필드 공개:* `pub URL`이면 누구나 바꿀 수 있고, 나중에 표현을 바꾸거나 검사를 넣을 수 없다(C-STRUCT-PRIVATE). 사람이 본다.
5. *getter 이름:* `get_code` → `code`(C-GETTER). 사람이 본다.
6. *`as_`의 비용:* `as_url`은 `String`을 새로 만든다. `as_`는 공짜여야 한다. `&str`을 빌려주는 `url()`로 바꾼다(C-CONV). 사람이 본다. `wrong_self_convention`은 `as_`가 `&self`를 받는지만 보는데, 이 메서드는 `&self`를 받는다.
7. *`into_`의 소유권:* `into_parts(&self)`는 가진 것을 넘기지 않는다. `self`를 받게 한다(C-CONV). clippy의 `wrong_self_convention`이 잡는다. 단 공개 메서드라서 `clippy.toml`에 `avoid-breaking-exported-api = false`를 둬야 나온다. 기본 설정에서는 조용했다.
8. *에러 타입:* `Result<String, ()>`(C-GOOD-ERR). clippy 기본 `result_unit_err`(`this returns a Result<_, ()>`)가 잡는다.
9. *`bool` 인자:* `shorten(url, true)`만 보고는 `true`가 무슨 뜻인지 모른다. 열거형으로 받는다(C-CUSTOM-TYPE). 사람이 본다.

10. *고친 API:* 새 값을 돌려주는 getter와 `shorten`에는 `#[must_use]`도 붙였다. 지침의 항목은 아니지만 clippy pedantic이 권한다(변형).

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct ShortLink {
    url: String,
    code: String,
}

impl ShortLink {
    #[must_use]
    pub fn code(&self) -> &str { &self.code }
    #[must_use]
    pub fn url(&self) -> &str { &self.url }
    #[must_use]
    pub fn into_parts(self) -> (String, String) { (self.code, self.url) }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Lifetime { Permanent, Expiring }

#[derive(Debug, Clone, PartialEq, Eq)]
#[non_exhaustive]
pub enum ParseCodeError { Empty, InvalidChar { at: usize, ch: char } }
// Display와 std::error::Error 구현은 코드 파일에 있다

/// # Errors
///
/// 비어 있으면 `Empty`, ASCII 영숫자가 아닌 글자가 있으면 `InvalidChar`.
pub fn parse_code(s: &str) -> Result<String, ParseCodeError> { /* ... */ }

#[must_use]
pub fn shorten(url: &str, lifetime: Lifetime) -> ShortLink { /* ... */ }
```

이 판을 라이브러리로 컴파일하니 `-W missing_debug_implementations`를 준 rustc, `avoid-breaking-exported-api = false`와 `-W clippy::pedantic`을 준 clippy 모두 경고가 없었다. `parse_code("ab-c")`는 `invalid character '-' at byte 2`를 돌려준다.

정리하면 아홉 가지 가운데 기본 설정의 도구가 잡은 것은 셋(대소문자 둘, `()` 에러)뿐이다. 린트를 켜고 clippy 설정을 바꾸면 둘(`Debug`, `into_`)이 더 잡힌다. 나머지 넷(공개 필드, `get_`, 돈이 드는 `as_`, `bool` 인자)은 사람이 리뷰에서 본다.

</details>


**변형.** 고친 판에서 `#[must_use]` 네 개를 모두 지우고 pedantic을 켜면 경고가 몇 개 나오는가? 그중 `into_parts(self)`도 짚히는 까닭은?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

네 개다. 메서드 셋(`code`, `url`, `into_parts`)에 `this method could have a #[must_use] attribute`, 함수 `shorten`에 `this function could have a #[must_use] attribute`가 나왔다. `must_use_candidate`는 값을 돌려주고, 가변 인자가 없고, 전역 상태를 바꾸지 않는 공개 함수를 모두 후보로 본다. `into_parts`는 `self`를 받지만 가변 참조가 아니므로 후보다. 결과를 버리면 값만 사라지고 아무 일도 일어나지 않으니 표시해 두는 편이 맞다.

</details>


## p2 · 다음 버전 번호 정하기

라이브러리 `store`의 지금 판이 1.3.0이다. 다음 판에 넣을 변경 여섯 가지가 있다.

- (가) 버그 고침. 공개 API는 그대로
- (나) 새 공개 메서드 `Link::hits()` 추가
- (다) 비공개 필드 `code`가 이미 있는 `pub struct Link`에 비공개 필드 `created_at` 추가
- (라) 공개 함수 `resolve`의 이름을 `lookup`으로 바꾸기
- (마) `#[non_exhaustive]`가 없는 `pub enum StoreError`에 경우 추가
- (바) 쓰는 사람이 구현하는 트레이트 `Store`에 몸통 없는 메서드 추가

1. 각 변경만 넣는다면 다음 판은 몇인가? 지금 판이 0.4.2라면?
2. (가)·(나)·(다)를 한 판에 넣으면? (라)까지 넣으면?
3. (라)를 작은 변경으로 내려면 어떻게 하나?
4. 쓰는 쪽이 `store = "1.3.0"`이라고 적었다면 cargo는 어느 판까지 저절로 올려 주는가? `"0.4.2"`라면?

사용 개념: [API 설계 원칙](/Hongs_Blog/studies/rust/api-design/)의 깨는 변경 표와 0.y.z 규칙.

풀이 전략: 변경마다 "쓰는 쪽의 어떤 코드가 깨지는가"를 하나 떠올린다. 떠오르면 큰 변경이다. 쓰는 쪽이 그 코드를 애초에 쓸 수 없었다면(비공개 필드가 있어 리터럴로 못 만든다) 깨질 것이 없다. 번호는 Cargo의 규칙으로 정한다. 왼쪽에서 처음 0이 아닌 자리가 "큰 변경" 자리다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *변경마다 판정:*

| 변경 | 분류 | 1.3.0 다음 | 0.4.2 다음 | 깨지는 쓰는 쪽 코드 |
|---|---|---|---|---|
| (가) | 고침 | 1.3.1 | 0.4.3 | 없음 |
| (나) | 작은 변경 | 1.4.0 | 0.4.3 | 없음 |
| (다) | 작은 변경 | 1.4.0 | 0.4.3 | 없음. 비공개 필드가 이미 있어 밖에서는 리터럴로 못 만들었다 |
| (라) | 큰 변경 | 2.0.0 | 0.5.0 | `store::resolve(..)` → E0425 |
| (마) | 큰 변경 | 2.0.0 | 0.5.0 | 모든 경우를 적은 `match` → E0004 |
| (바) | 큰 변경 | 2.0.0 | 0.5.0 | `impl Store for Mem` → E0046 |

0.y.z에서는 y가 큰 변경 자리이고, 작은 변경과 고침은 모두 z를 올린다. (라)의 E0425는 이 문제의 코드에서, (마)·(바)의 E0004·E0046은 [49번 검증 코드](/Hongs_Blog/studies/rust/code/49_api-design_verify/)에서 컴파일해 확인했다.

{: start="2"}
2. *묶어서 낼 때:* 가장 큰 변경이 번호를 정한다. (가)·(나)·(다)는 1.4.0, (라)까지 넣으면 2.0.0.
3. *이름 바꾸기를 작은 변경으로:* `lookup`을 새로 만들고 옛 이름을 남긴다.

```rust
pub fn lookup(code: &str) -> Option<String> { /* ... */ }

#[deprecated(since = "1.4.0", note = "use `lookup` instead")]
pub fn resolve(code: &str) -> Option<String> { lookup(code) }
```

쓰는 쪽은 `warning: use of deprecated function store::resolve: use lookup instead` 경고만 받고 빌드된다. `resolve`는 다음 큰 판(2.0.0)에서 지운다.

{: start="4"}
4. *Cargo가 올려 주는 범위:* 버전만 적은 의존성은 "왼쪽에서 처음 0이 아닌 자리가 같으면 호환"으로 읽힌다. `"1.3.0"`은 1.3.0 이상 2.0.0 미만, `"0.4.2"`는 0.4.2 이상 0.5.0 미만이다. 그래서 큰 변경에 맨 앞자리를 올리지 않으면, 쓰는 쪽이 `cargo update` 한 번에 깨진다.

</details>


**변형.** 0.0.3에서 버그만 고쳐 0.0.4를 냈다. `store = "0.0.3"`이라고 적은 쪽은 `cargo update`로 0.0.4를 받는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

받지 않는다. 0.0.z는 모든 판이 서로 호환되지 않는 것으로 친다. 왼쪽에서 처음 0이 아닌 자리가 z이기 때문이다. 쓰는 쪽이 `Cargo.toml`을 직접 고쳐야 한다. 그래서 남이 쓰기 시작한 크레이트는 0.1.0부터 내는 편이 낫다. 그래야 고침과 작은 변경을 z 자리로 낼 수 있다.

</details>


## p3 · 상태 확인 엔드포인트

단축 URL 서비스(axum)에 배포용 엔드포인트 셋과 하위 명령 하나를 더한다.

- `GET /healthz`: 프로세스가 답할 수 있으면 200 `ok`.
- `GET /readyz`: 준비 깃발이 켜져 있으면 200 `ready`, 아니면 503 `not ready`. 깃발은 시작 준비가 끝나면 켜고, 종료를 시작하면 끈다.
- `GET /version`: `{"name": ..., "version": ..., "git": ...}`. 이름과 버전은 cargo가 주는 값, `git`은 빌드할 때의 `GIT_HASH`이고 없으면 `"unknown"`.
- `shortener healthcheck`: Docker `HEALTHCHECK`가 부르는 하위 명령. 같은 컨테이너의 `/healthz`에 GET을 보내 200이면 종료 코드 0, 아니면 1로 끝난다. curl 없이 표준 라이브러리만 쓴다.

`tower::ServiceExt::oneshot`과 127.0.0.1:0에 띄운 진짜 서버로 시험한다. 종료를 시작한 뒤 `/readyz`와 `/healthz`가 각각 무엇을 답하는지, 서버가 꺼진 뒤 `healthcheck`가 무엇을 돌려주는지 확인한다.

사용 개념: [빌드와 배포](/Hongs_Blog/studies/rust/build-deploy/)의 상태 확인과 `HEALTHCHECK`, [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)의 `State`와 oneshot, [안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/).

풀이 전략: 두 질문을 섞지 않는다. "살아 있나"는 내 프로세스만, "받아도 되나"는 내가 일할 준비가 됐는지를 본다. 준비 깃발은 여러 요청이 동시에 읽고 종료 코드가 바꾸므로 `Arc<AtomicBool>`로 둔다. `healthcheck`는 HTTP 클라이언트 크레이트 없이 `TcpStream`으로 요청 한 줄을 쓰고 상태 줄의 숫자만 읽는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *준비 깃발과 두 핸들러:*

```rust
#[derive(Clone, Default)]
struct Health { ready: Arc<AtomicBool> }

async fn healthz() -> &'static str { "ok" }

async fn readyz(State(h): State<Health>) -> (StatusCode, &'static str) {
    if h.ready.load(Ordering::Acquire) {
        (StatusCode::OK, "ready")
    } else {
        (StatusCode::SERVICE_UNAVAILABLE, "not ready")
    }
}
```

{: start="2"}
2. *빌드 정보:* `GIT_HASH`를 `const`로 한 번 정한다. `option_env!`가 `None`이면 `"unknown"`이다.

```rust
const GIT_HASH: &str = match option_env!("GIT_HASH") {
    Some(h) => h,
    None => "unknown",
};
// /version: Json(VersionInfo { name: env!("CARGO_PKG_NAME"), version: env!("CARGO_PKG_VERSION"), git: GIT_HASH })
```

{: start="3"}
3. *healthcheck 하위 명령:* 상태 줄 `HTTP/1.1 200 OK`의 두 번째 칸을 숫자로 읽는다.

```rust
fn status_of(addr: SocketAddr, path: &str, timeout: Duration) -> std::io::Result<u16> {
    let mut s = TcpStream::connect_timeout(&addr, timeout)?;
    s.set_read_timeout(Some(timeout))?;
    s.set_write_timeout(Some(timeout))?;
    write!(s, "GET {path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n")?;
    let mut buf = String::new();
    s.read_to_string(&mut buf)?;
    buf.split(' ')
        .nth(1)
        .and_then(|code| code.parse().ok())
        .ok_or_else(|| std::io::Error::other("상태 줄을 읽지 못했다"))
}

fn healthcheck(addr: SocketAddr, timeout: Duration) -> u8 {
    match status_of(addr, "/healthz", timeout) {
        Ok(200) => 0,
        _ => 1,
    }
}
```

`Connection: close`를 보내야 서버가 응답 뒤에 연결을 닫고, `read_to_string`이 끝난다. 종료 코드 2는 Docker가 예약해 두었으므로 쓰지 않는다.

{: start="4"}
4. *진짜 main의 첫머리(실행하지 않은 모양):* 첫 인자가 `healthcheck`면 서버를 띄우지 않고 검사만 한다.

```rust
fn main() -> std::process::ExitCode {
    let args: Vec<String> = std::env::args().collect();
    let args: Vec<&str> = args.iter().map(String::as_str).collect();
    match mode(&args) {
        Mode::HealthCheck => {
            let addr = "127.0.0.1:8080".parse().expect("주소");
            healthcheck(addr, Duration::from_secs(2)).into()
        }
        Mode::Serve => { /* tokio 런타임을 만들어 서버를 돌린다 */ std::process::ExitCode::SUCCESS }
    }
}
```

{: start="5"}
5. *확인:* 시작 직후 `/healthz`는 200, `/readyz`는 503이었다. 깃발을 켜니 `/readyz`도 200, `healthcheck`는 0이었다. 깃발을 끄자(종료 시작) `/readyz`는 503, `/healthz`는 여전히 200이었다. 서버가 꺼진 뒤 `healthcheck`는 연결이 안 되어 1을 돌려줬다. `/version`은 `{"name":"vault-rust","version":"0.1.0","git":"unknown"}`이었다. 이 과목의 실행 환경이 패키지 이름과 버전을 그렇게 정해 두었기 때문이다.

</details>


**변형.** "DB가 죽으면 알고 싶다"며 `/healthz`에서도 DB에 `SELECT 1`을 보내기로 했다. 쿠버네티스에서 DB가 1분 동안 응답하지 않으면 무슨 일이 생기나? DB 확인은 어디에 둬야 하나?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

liveness 프로브가 실패하면 쿠버네티스는 그 컨테이너를 재시작한다. 모든 Pod가 같은 DB를 보므로 모든 Pod가 함께 재시작을 되풀이한다. 재시작해도 DB는 살아나지 않고, DB가 돌아온 순간에도 Pod들이 다시 뜨는 중이라 서비스가 더 늦게 돌아온다. DB 확인은 `/readyz`에 둔다. readiness가 실패하면 재시작 없이 트래픽만 빠진다. 다만 모든 Pod가 같은 DB를 보면 모두 함께 빠지므로, 그 동안은 503을 돌려주는 것과 결과가 같다. 이 경우 DB 상태는 프로브보다 [tracing](/Hongs_Blog/studies/rust/tracing-observability/)의 오류와 지표로 알리는 편이 낫다.

</details>


## p4 · 커밋 해시를 넣는 build.rs

실행 파일이 `env!("GIT_HASH")`로 자기 커밋 해시를 찍게 하려고 한다. 패키지 맨 위의 `build.rs`를 써라.

- 환경 변수 `GIT_HASH`가 있으면 그 값을 쓴다(`.git`이 없는 Docker 빌드에서 `--build-arg`로 넘긴다).
- 없으면 `git rev-parse --short=7 HEAD`의 결과를 쓴다.
- git이 없거나 저장소가 아니면 `"unknown"`. 어떤 경우에도 빌드가 깨지지 않는다.
- 커밋을 새로 하거나 `GIT_HASH`가 바뀌면 다시 돈다.

```rust
// src/main.rs
fn main() {
    println!("{}", env!("GIT_HASH"));
}
```

사용 개념: [빌드와 배포](/Hongs_Blog/studies/rust/build-deploy/)의 `cargo::rustc-env`, `rerun-if-changed`, `rerun-if-env-changed`.

풀이 전략: 우선순위가 셋이니 `Option`을 `or_else`로 잇고 마지막에 `unwrap_or_else`로 기본값을 둔다. `git`은 실패할 수 있는 바깥 명령이라 `?`로 `None`을 만든다. "언제 다시 도나"는 cargo에 알려 줘야 한다. 빌드 스크립트가 읽은 환경 변수는 저절로 지켜보지 않는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *우선순위:* 환경 변수 → git → `"unknown"`.
2. *실패를 None으로:* git이 없으면 `Command::output()`이 `Err`, 저장소가 아니면 종료 코드가 0이 아니다. 둘 다 `None`.
3. *다시 돌 조건:* `GIT_HASH`는 `rerun-if-env-changed`로, 커밋은 `.git/HEAD`와 HEAD가 가리키는 브랜치 파일의 `rerun-if-changed`로 알린다.

```rust
use std::process::Command;

fn main() {
    println!("cargo::rerun-if-env-changed=GIT_HASH");
    let hash = std::env::var("GIT_HASH")
        .ok()
        .filter(|h| !h.is_empty())
        .or_else(git_hash)
        .unwrap_or_else(|| "unknown".to_string());
    println!("cargo::rustc-env=GIT_HASH={hash}");
}

fn git(args: &[&str]) -> Option<String> {
    let dir = std::env::var("CARGO_MANIFEST_DIR").ok()?;
    let out = Command::new("git").args(args).current_dir(dir).output().ok()?;
    if !out.status.success() {
        return None;
    }
    Some(String::from_utf8(out.stdout).ok()?.trim().to_string())
}

fn git_hash() -> Option<String> {
    let hash = git(&["rev-parse", "--short=7", "HEAD"])?;
    let git_dir = git(&["rev-parse", "--git-dir"])?;
    println!("cargo::rerun-if-changed={git_dir}/HEAD");
    if let Some(branch) = git(&["symbolic-ref", "-q", "HEAD"]) {
        println!("cargo::rerun-if-changed={git_dir}/{branch}");
    }
    Some(hash)
}
```

{: start="4"}
4. *확인:* 저장소가 아닌 폴더에서는 `unknown`, `GIT_HASH=deadbee`를 주면 `deadbee`, 변수를 지우면 다시 `unknown`이었다. 저장소에서 첫 커밋을 하니 `git rev-parse --short=7 HEAD`와 같은 7글자가 찍혔고, 다음 커밋을 하니 새 해시로 바뀌었다. 저장소 안에서도 `GIT_HASH=cafe123`을 주면 그것이 이겼다.

`rerun-if-*`를 하나라도 찍으면 cargo는 패키지 전체를 훑어 바뀐 파일을 찾던 기본 동작을 멈추고, 찍은 것만 본다. 그래서 다시 돌 조건을 빠짐없이 적어야 한다.

</details>


**변형.** `git_hash()`에서 브랜치 파일 줄을 빼고 `.git/HEAD`만 지켜보게 하면, 같은 브랜치에서 커밋을 하나 더 했을 때 실행 파일은 무엇을 찍는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

앞 커밋의 해시를 그대로 찍는다. 검증 코드에서 두 번째 커밋 뒤에도 실행 파일은 첫 커밋의 해시를 찍었다. `.git/HEAD`의 내용은 `ref: refs/heads/main` 한 줄이라 커밋해도 바뀌지 않는다. 커밋할 때 바뀌는 것은 `.git/refs/heads/main`이다. 지켜보는 파일이 안 바뀌었으니 cargo는 빌드 스크립트를 다시 돌리지 않고, 실행 파일에는 낡은 해시가 남는다. 브랜치를 바꿀 때만 HEAD가 바뀐다.

</details>
{% endraw %}
