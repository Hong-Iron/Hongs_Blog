---
layout: "note"
title: "에러와 메모리 연습"
display_title: "에러와 메모리 연습"
kind: "practice"
kind_label: "연습"
num: "30"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "5단원(에러 처리)에서 두 문제, 6단원(메모리)에서 두 문제다. p1은 unwrap투성이 함수를 에러 타입과 ?로 고치고, p2는 anyhow 에러가 어떻게 찍히는지 예측한다. p3은 Rc가 만든 누수를 Drop 횟수로 찾아 Weak로 고치고, p4는 컴파일은 되는데 실행 중에 …"
prev_url: "/studies/rust/capstone-1/"
prev_title: "캡스톤 1 도메인 타입과 에러"
next_url: "/studies/rust/concurrency-practice/"
next_title: "동시성 연습"
math: false
mermaid: false
code_count: 4
permalink: "/studies/rust/errors-memory-practice/"
---
{% raw %}
5단원(에러 처리)에서 두 문제, 6단원(메모리)에서 두 문제다. p1은 `unwrap`투성이 함수를 에러 타입과 `?`로 고치고, p2는 anyhow 에러가 어떻게 찍히는지 예측한다. p3은 `Rc`가 만든 누수를 `Drop` 횟수로 찾아 `Weak`로 고치고, p4는 컴파일은 되는데 실행 중에 터지는 `RefCell` 버그를 고친다. 각 문제의 코드는 의존성(thiserror, anyhow)을 `Cargo.toml`에 넣은 패키지에서 `cargo run`으로 돌려 볼 수 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답과 변형 문제를 코드로 확인했다. p1은 원래 코드가 다섯 입력 중 몇 개에서 panic하는지 `catch_unwind`로 셌고, p3은 `Drop` 횟수를, p4는 panic 메시지를 실제로 받아 비교했다 — [p1](/Hongs_Blog/studies/rust/code/30_errors-memory-practice_p1/) · [p2](/Hongs_Blog/studies/rust/code/30_errors-memory-practice_p2/) · [p3](/Hongs_Blog/studies/rust/code/30_errors-memory-practice_p3/) · [p4](/Hongs_Blog/studies/rust/code/30_errors-memory-practice_p4/)</div>

</div>


## p1 · unwrap투성이 CSV 파서 고치기

`"이름, 나이"` 한 줄을 읽어 사용자를 만드는 함수가 있다.

```rust
pub struct User { pub name: String, pub age: u8 }

pub fn parse_user_unwrap(line: &str) -> User {
    let mut parts = line.split(',');
    let name = parts.next().unwrap().trim().to_string();
    let age = parts.next().unwrap().trim().parse().unwrap();
    User { name, age }
}
```

- (가) 다섯 입력 `"kim"`, `", 3"`, `"lee, -1"`, `"park, 300"`, `"choi, x"` 가운데 이 함수가 panic하는 것은 몇 개인가? panic하지 않는 입력에서는 무엇이 잘못 들어가는가?
- (나) thiserror로 에러 enum `UserError`를 만들고 `parse_user(line: &str) -> Result<User, UserError>`로 고쳐라. 필드가 없으면 ``missing field `age` ``처럼 어느 필드인지, 이름이 비면 `name is empty`, 나이를 숫자로 못 읽으면 `invalid age`를 메시지로 하고, 나이 해석 에러는 원인(`source()`)으로 남긴다.
- (다) 고친 함수에 다섯 입력을 넣었을 때 메시지와 `source()`를 쓰라.

사용 개념: [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)의 `?`와 `ok_or`, [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)의 thiserror와 `#[from]`.

풀이 전략: `unwrap()` 하나하나가 "여기서 실패할 수 있다"는 표시다. 자리마다 무엇이 실패하는지 이름을 붙이면 그것이 variant가 된다. 타입이 막아 주지 못하는 조건(빈 이름)은 따로 검사한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *실패하는 자리 찾기:* `parts.next().unwrap()` 두 개는 필드가 모자랄 때, `parse().unwrap()`은 나이가 `u8`이 아닐 때 터진다. `"kim"`은 두 번째 `next()`가 `None`이라 panic. `"lee, -1"`은 `u8`에 부호가 없어서, `"park, 300"`은 255를 넘어서, `"choi, x"`는 숫자가 아니어서 panic이다. 네 개다. `", 3"`은 panic하지 않고 이름이 빈 문자열인 사용자를 만든다. 이쪽이 더 나쁘다. 잘못된 값이 조용히 들어간다.
2. *variant 붙이기:* 실패 셋에 이름을 붙인다. 나이 해석 에러는 `#[from]`으로 받으면 `?`가 저절로 바꿔 주고, `source()`로도 이어진다.

```rust
#[derive(Debug, thiserror::Error, PartialEq)]
#[non_exhaustive]
pub enum UserError {
    #[error("missing field `{0}`")]
    Missing(&'static str),
    #[error("name is empty")]
    EmptyName,
    #[error("invalid age")]
    BadAge(#[from] ParseIntError),
}
```

{: start="3"}
3. *`?` 붙이기:* `Option`은 `ok_or`로 `Result`로 바꾼 뒤 `?`를 붙인다. 빈 이름은 `return Err(...)`로 일찍 끝낸다.

```rust
pub fn parse_user(line: &str) -> Result<User, UserError> {
    let mut parts = line.split(',');
    let name = parts.next().ok_or(UserError::Missing("name"))?.trim();
    if name.is_empty() {
        return Err(UserError::EmptyName);
    }
    let age = parts.next().ok_or(UserError::Missing("age"))?.trim().parse()?;
    Ok(User { name: name.to_string(), age })
}
```

{: start="4"}
4. *결과 확인:*

| 입력 | 메시지 | `source()` |
|---|---|---|
| `"kim"` | ``missing field `age` `` | `None` |
| `", 3"` | `name is empty` | `None` |
| `"lee, -1"` | `invalid age` | `invalid digit found in string` |
| `"park, 300"` | `invalid age` | `number too large to fit in target type` |
| `"choi, x"` | `invalid age` | `invalid digit found in string` |

`"kim"`에서 이름은 있으니 `Missing("name")`이 아니라 `Missing("age")`다. 메시지 `invalid age`에 원인을 다시 쓰지 않은 것은, 원인을 `source()`로 내보낼 때는 메시지에 되풀이하지 않는다는 관례 때문이다([물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)).

</details>


**변형.** 고친 함수에 `""`(빈 줄)과 `"a,1,zzz"`를 넣으면 각각 무엇이 나오는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`""`은 `Err(EmptyName)`이다. `"".split(',')`는 빈 조각 하나를 주므로 `Missing("name")`이 아니라 빈 이름 검사에 걸린다. `"a,1,zzz"`는 `Ok`이고 나이는 1이다. 이 함수는 세 번째 조각을 아예 보지 않는다. 필드가 남는 것도 에러로 하고 싶다면 `parts.next()`가 `None`인지 한 번 더 확인하는 variant를 더한다.

</details>


## p2 · anyhow 에러 출력 예측하기

설정 글을 읽는 애플리케이션 코드다.

```rust
use anyhow::{Context, Result, bail, ensure};

fn load(text: &str) -> Result<Settings> {
    let workers: u32 = get(text, "workers")
        .context("`workers` is missing")?
        .parse()
        .context("`workers` must be a number")?;
    ensure!((1..=64).contains(&workers), "`workers` must be 1..=64, got {workers}");
    let db_url = get(text, "db_url").unwrap_or("sqlite::memory:").to_string();
    if !db_url.starts_with("sqlite:") {
        bail!("only sqlite is supported: {db_url}");
    }
    Ok(Settings { workers, db_url })
}

fn start(text: &str) -> Result<String> {
    let s = load(text).context("failed to load settings")?;
    Ok(format!("{} workers on {}", s.workers, s.db_url))
}
```

`get(text, key)`는 `key=값` 줄을 찾아 값을 `Option<&str>`로 돌려준다. `start("workers=4")`는 `Ok("4 workers on sqlite::memory:")`다.

- (가) `start("workers=four")`의 에러를 `{}`, `{:#}`, `{:?}`로 찍은 결과를 쓰라.
- (나) `start("workers=0")`, `start("db_url=postgres://x")`, `start("workers=2\ndb_url=postgres://x")`를 `{:#}`로 찍은 결과를 쓰라.
- (다) 이 프로그램의 운영 규칙은 "설정 값을 숫자로 읽지 못했으면 종료 코드 78, 그 밖의 실패는 1"이다. `fn exit_code(e: &anyhow::Error) -> i32`를 써라.

사용 개념: [애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/)의 `context`, `bail!`, `ensure!`, 세 출력 형식과 `chain()`.

풀이 전략: `context`는 에러 바깥에 한 겹씩 덧씌운다. 그러니 사슬은 맨 나중에 씌운 것부터 읽는다. 사슬을 먼저 종이에 그리고, 형식마다 그중 무엇을 찍는지 적용한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *사슬 그리기:* `"four".parse::<u32>()`가 `ParseIntError`(`invalid digit found in string`)를 낸다. `load`가 그 위에 `` `workers` must be a number ``를, `start`가 그 위에 `failed to load settings`를 씌운다. 사슬은 바깥부터 세 겹이다.
2. *형식 적용하기:* `{}`는 맨 바깥만, `{:#}`는 바깥부터 원인까지 `: `로 잇고, `{:?}`는 바깥 메시지 뒤에 `Caused by:` 목록을 붙인다[^1].

```
{}:   failed to load settings
{:#}: failed to load settings: `workers` must be a number: invalid digit found in string
{:?}:
failed to load settings

Caused by:
    0: `workers` must be a number
    1: invalid digit found in string
```

{: start="3"}
3. *검사 순서 따라가기:* `load`는 `workers`를 먼저, `db_url`을 나중에 본다.
   - `workers=0`: 숫자 해석은 되고 `ensure!`에서 걸린다. ``failed to load settings: `workers` must be 1..=64, got 0``
   - `db_url=postgres://x`: `workers` 줄이 없어 첫 `context`에서 끝난다. `db_url`은 보지도 않는다. ``failed to load settings: `workers` is missing``
   - `workers=2\ndb_url=postgres://x`: `bail!`에서 걸린다. ``failed to load settings: only sqlite is supported: postgres://x``
4. *종료 코드 고르기:* 사슬을 돌며 `ParseIntError`가 있는지 `downcast_ref`로 찾는다. `context`를 씌운 뒤에도 사슬 안의 원래 에러는 그대로 있다.

```rust
fn exit_code(e: &anyhow::Error) -> i32 {
    if e.chain().any(|c| c.downcast_ref::<std::num::ParseIntError>().is_some()) {
        78
    } else {
        1
    }
}
```

`workers=four`는 78, `workers=0`은 1이다.

</details>


**변형.** `start("workers=x")`와 `start("workers=0")`의 `chain().count()`는 각각 얼마인가? 그리고 `workers=0`도 설정 문제인데 `exit_code`가 1을 돌려주는 까닭은?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

3과 2다. `workers=x`는 원인 `ParseIntError`, `load`의 context, `start`의 context로 세 겹이다. `workers=0`은 `ensure!`가 만든 에러 하나에 `start`의 context가 씌워진 두 겹이다. `ensure!`와 `bail!`은 메시지 글자만 가진 에러를 만든다. 사슬에 `ParseIntError`가 없고, 꺼내 볼 다른 타입도 없다. 그래서 1이다. 종류에 따라 갈라야 하는 실패라면, 범위 초과도 글자가 아니라 이름 있는 에러 타입으로 만들어 `downcast_ref`로 찾을 수 있게 한다([라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)).

</details>


## p3 · 폴더 트리의 누수 찾기

폴더마다 부모와 자식을 기억하는 트리다. 부모 칸도 `Rc`로 만들었다.

```rust
struct LeakyDir {
    name: String,
    parent: RefCell<Option<Rc<LeakyDir>>>,
    children: RefCell<Vec<Rc<LeakyDir>>>,
}

fn leaky_mkdir(parent: &Rc<LeakyDir>, name: &str) -> Rc<LeakyDir> {
    let child = Rc::new(LeakyDir {
        name: name.into(),
        parent: RefCell::new(Some(Rc::clone(parent))),
        children: RefCell::new(vec![]),
    });
    parent.children.borrow_mut().push(Rc::clone(&child));
    child
}
```

블록 안에서 루트 `/`(변수 `r`)를 만들고 `home`, `kim`, `docs`를 차례로 그 아래에 만든 뒤 블록을 끝낸다. `LeakyDir`에는 `Drop`을 구현해 몇 번 치워지는지 센다.

- (가) 블록이 끝나기 직전 `Rc::strong_count`는 `/`, `home`, `kim` 각각 얼마인가? 블록이 끝난 뒤 `Drop`은 몇 번 돌았는가?
- (나) `Weak`로 고친 `Dir`과 `mkdir`을 써라. 고친 뒤 블록 끝에서 `Drop`은 몇 번인가?
- (다) `docs`에서 부모를 따라 올라가 `"/home/kim/docs"`를 만드는 `fn path(d: &Rc<Dir>) -> String`을 써라. 루트의 경로는 `"/"`다.

사용 개념: [Rc·Arc·Weak](/Hongs_Blog/studies/rust/rc-arc-weak/)의 strong 개수와 `Weak`, [내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/)의 `RefCell`(만든 뒤에 부모·자식 칸을 채우려고 쓴다).

풀이 전략: 노드마다 "강한 화살표가 몇 개 들어오는가"를 센다. 변수, 부모의 `children`, 자식의 `parent`가 화살표의 출처다. 블록이 끝나면 변수에서 오는 화살표만 사라진다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *들어오는 화살표 세기:* `/`는 변수 `r`과 `home.parent`에서 2. `home`은 변수, `/`의 `children`, `kim.parent`에서 3. `kim`도 같은 이유로 3이다. 실행 결과도 `strong_count(/)=2, (home)=3, (kim)=3`이었다.
2. *블록이 끝나면:* 변수 네 개가 사라져 각 노드에서 1씩 준다. 그래도 모든 노드에 부모나 자식에서 오는 화살표가 남는다. 0이 되는 노드가 없으니 `Drop`은 0번이다. 이웃한 두 노드가 서로를 강하게 쥐는 고리가 세 개 생겼다.
3. *방향 정하기:* 부모는 자식을 가진다(`Rc`). 자식은 부모를 가리키기만 한다(`Weak`).

```rust
struct Dir {
    name: String,
    parent: RefCell<Weak<Dir>>,
    children: RefCell<Vec<Rc<Dir>>>,
}

fn mkdir(parent: &Rc<Dir>, name: &str) -> Rc<Dir> {
    let child = Rc::new(Dir {
        name: name.into(),
        parent: RefCell::new(Rc::downgrade(parent)),
        children: RefCell::new(vec![]),
    });
    parent.children.borrow_mut().push(Rc::clone(&child));
    child
}
```

{: start="4"}
4. *다시 세기:* 이제 `/`의 strong은 변수 하나뿐이라 1, weak는 `home.parent`의 1이다. `home`의 strong은 변수와 `/`의 `children`으로 2다. 블록이 끝나면 `/`가 0이 되어 치워지고, 그 `children`이 drop되며 `home`이 0이 되고, 차례로 `kim`, `docs`까지 치워진다. `Drop`은 4번이다.
5. *경로 만들기:* `upgrade()`가 `Some`인 동안 부모로 올라가며 이름을 모은 뒤 뒤집어 `/`로 잇는다. 루트의 이름을 빈 문자열로 두었으므로 이어 붙이면 맨 앞에 `/`가 생긴다.

```rust
fn path(d: &Rc<Dir>) -> String {
    let mut parts = vec![d.name.clone()];
    let mut cur = d.parent.borrow().upgrade();
    while let Some(p) = cur {
        parts.push(p.name.clone());
        cur = p.parent.borrow().upgrade();
    }
    parts.reverse();
    let joined = parts.join("/");
    if joined.is_empty() { "/".into() } else { joined }
}
```

`path(&docs)`는 `"/home/kim/docs"`, `path(&r)`은 `"/"`다.

</details>


**변형.** 고친 트리를 블록 안에서 만들되 `docs`만 블록 밖으로 돌려준다. 블록이 끝난 뒤 `Drop`은 몇 번이고 `path(&docs)`는 무엇인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`Drop` 3번, `path(&docs)`는 `"docs"`다. 블록이 끝나면 `/`를 강하게 쥔 것이 없어 치워진다. 그 `children`과 함께 `home`, 이어서 `kim`이 치워진다. `docs`는 돌려받은 변수가 쥐고 있어 남는다. 하지만 `docs.parent.upgrade()`는 `None`이라 경로가 자기 이름뿐이다. `Weak`는 부모를 살려 두지 않는다[^2]. 실제 파일 시스템처럼 "자식을 쥐고 있으면 조상도 살아 있어야" 한다면, 루트를 쥐는 쪽(트리 전체를 가진 구조체)을 따로 두고 노드는 그 안에서만 다룬다.

</details>


## p4 · 이벤트 버스의 RefCell panic 고치기

핸들러를 등록해 두고 이벤트가 오면 차례로 부르는 버스다. 컴파일은 된다.

```rust
type Handler = Rc<dyn Fn(&Bus, &str)>;

#[derive(Default)]
struct Bus {
    handlers: RefCell<Vec<Handler>>,
    log: RefCell<Vec<String>>,
}

impl Bus {
    fn subscribe(&self, h: Handler) {
        self.handlers.borrow_mut().push(h);
    }
    fn emit_buggy(&self, ev: &str) {
        for h in self.handlers.borrow().iter() {
            h(self, ev);
        }
    }
}

fn logger() -> Handler {
    Rc::new(|bus: &Bus, ev: &str| bus.log.borrow_mut().push(format!("log {ev}")))
}

fn auto_subscriber() -> Handler {   // "login"을 받으면 logger를 하나 더 등록한다
    Rc::new(|bus: &Bus, ev: &str| {
        if ev == "login" {
            bus.subscribe(logger());
        }
    })
}
```

- (가) `logger()`, `auto_subscriber()` 순서로 등록하고 `emit_buggy("login")`을 부르면 무슨 일이 생기는가? 그 순간 `log`에는 무엇이 들어 있는가?
- (나) 핸들러가 `emit` 도중에 `subscribe`를 불러도 되도록 `emit`을 고쳐라.
- (다) 고친 `emit`으로 `"login"`, `"click"`을 차례로 보낸 뒤 등록된 핸들러 수와 `log`를 쓰라.

사용 개념: [내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/)의 실행 중 빌림 검사, [Rc·Arc·Weak](/Hongs_Blog/studies/rust/rc-arc-weak/)의 `Rc::clone` 비용.

풀이 전략: `Ref`가 어디서 만들어져 어디까지 사는지 표시하고, 그 안에서 같은 `RefCell`에 `borrow_mut()`가 오는 길을 찾는다. 찾았으면 빌림을 짧게 끊는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *빌림이 사는 범위:* `for h in self.handlers.borrow().iter()`의 `Ref`는 반복문이 끝날 때까지 산다. 반복문 전체가 "읽기 빌림 1개" 상태다.
2. *충돌 지점:* 첫 핸들러 `logger`는 다른 `RefCell`(`log`)을 빌리므로 괜찮다. `log`에 `"log login"`이 들어간다. 둘째 핸들러가 `bus.subscribe(...)`를 부르면 `handlers.borrow_mut()`가 온다. 읽기 빌림이 살아 있으니 panic이다. 메시지는 `RefCell already borrowed`였고, 그때 `log`는 `["log login"]`이었다. `borrow_mut`는 이미 빌려져 있으면 panic한다고 문서에 적혀 있다[^3].
3. *빌림 끊기:* 목록을 복사한 뒤 빌림을 끝내고 부른다. 원소가 `Rc`이므로 복사는 개수만 올린다. 핸들러 본체는 복사되지 않는다.

```rust
fn emit(&self, ev: &str) {
    let snapshot: Vec<Handler> = self.handlers.borrow().clone();   // 이 줄 끝에서 빌림이 끝난다
    for h in snapshot {
        h(self, ev);
    }
}
```

{: start="4"}
4. *결과 확인:* `"login"` 때 `auto_subscriber`가 셋째 핸들러를 등록한다. 등록된 핸들러는 3개다. 하지만 복사본은 등록 전에 만들었으므로 새 핸들러는 `"login"`을 받지 않는다. `log`는 `["log login"]`이다. `"click"` 때는 `logger` 두 개가 모두 받는다. 최종 `log`는 `["log login", "log click", "log click"]`이다.

</details>


**변형.** `subscribe`가 panic 대신 "지금은 등록할 수 없음"을 알리게 하려면 `borrow_mut()` 대신 무엇을 쓰는가? 다른 곳에서 `handlers`를 빌린 채 그것을 부르면 무엇이 오는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`try_borrow_mut()`를 쓴다. 다른 곳에서 빌리고 있으면 `Err(BorrowMutError)`가 오고, 그 빌림이 끝난 뒤에는 `Ok`가 온다. 검증 코드에서 `handlers.borrow()`를 쥔 채 부르면 `is_err()`, 그 `Ref`를 `drop`한 뒤에는 `is_ok()`였다. 다만 이 경우 등록 요청을 잃지 않으려면 대기 목록에 넣었다가 `emit`이 끝날 때 옮기는 식의 처리가 따로 필요하다. 복사본 방식(풀이)이 더 단순하다.

</details>


[^1]: anyhow 문서, Struct `anyhow::Error` — Display representations(`{}`, `{:#}`, `{:?}`), `chain` — https://docs.rs/anyhow/latest/anyhow/struct.Error.html
[^2]: The Rust Programming Language, 15.6 Reference Cycles Can Leak Memory — Creating a Tree Data Structure, Visualizing Changes to `strong_count` and `weak_count` — https://doc.rust-lang.org/book/ch15-06-reference-cycles.html
[^3]: std 문서, Struct `std::cell::RefCell` — `borrow_mut`(Panics), `try_borrow_mut` — https://doc.rust-lang.org/std/cell/struct.RefCell.html
{% endraw %}
