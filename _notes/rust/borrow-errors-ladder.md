---
layout: "note"
title: "빌림 오류 고치기 예제 사다리"
display_title: "빌림 오류 고치기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "09"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: 빌림과 참조의 \"가변 하나 또는 공유 여럿\" 규칙과 NLL, 수명의 지역 값 참조, 슬라이스와 String·&str."
prev_url: "/studies/rust/rust-basics-practice/"
prev_title: "Rust 첫걸음 연습"
next_url: "/studies/rust/data-modeling-practice/"
next_title: "데이터 모델링 연습"
math: false
mermaid: false
code_count: 4
code_files: [{"t": "09_borrow-errors-ladder_p1.rs", "u": "/studies/rust/code/09_borrow-errors-ladder_p1/", "r": "문제 1 풀이"}, {"t": "09_borrow-errors-ladder_p2.rs", "u": "/studies/rust/code/09_borrow-errors-ladder_p2/", "r": "문제 2 풀이"}, {"t": "09_borrow-errors-ladder_p3.rs", "u": "/studies/rust/code/09_borrow-errors-ladder_p3/", "r": "문제 3 풀이"}, {"t": "09_borrow-errors-ladder_p4.rs", "u": "/studies/rust/code/09_borrow-errors-ladder_p4/", "r": "문제 4 풀이"}]
permalink: "/studies/rust/borrow-errors-ladder/"
---
{% raw %}
사용 개념: [빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)의 "가변 하나 또는 공유 여럿" 규칙과 NLL, [수명](/Hongs_Blog/studies/rust/lifetimes/)의 지역 값 참조, [슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/).

빌림 검사기(borrow checker)가 거절한 코드를 고치는 일은 같은 하위목표의 되풀이다.

1. *오류 코드 읽기:* 오류 코드와 첫 줄을 읽고, 컴파일러가 밑줄로 짚은 자리(빌림이 시작된 곳, 부딪힌 곳, 빌림이 다시 쓰인 곳)를 코드에서 찾는다.
2. *누가 언제 빌렸나:* 빌림마다 시작한 줄과 마지막으로 쓰인 줄을 적어, 겹치는 구간을 찾는다. 빌림은 만든 곳부터 마지막으로 쓴 곳까지 살아 있다[^1].
3. *고치는 방법 고르기:* 겹침을 없앤다. 값을 베끼기, 순서 바꾸기, 겹치지 않게 쪼개기, 빌리는 범위를 필드 하나로 좁히기, 소유한 값을 돌려주기 가운데 고른다.
4. *확인:* 컴파일되는지 보고, 보통 입력과 경계 입력(빈 것, 하나짜리)에서 결과를 확인한다.

아래 오류 메시지는 rustc 1.99.0의 출력이다. 파일 위치를 적은 `-->` 줄은 생략했다.

## 문제 1 · 완전한 풀이

`Vec`에 값을 하나 넣고, 넣기 전의 첫 값을 돌려주는 함수다. 컴파일되지 않는다.

```rust
pub fn push_and_report(v: &mut Vec<i32>, x: i32) -> i32 {
    let first = &v[0];
    v.push(x);
    *first
}
```

1. *오류 코드 읽기:* E0502다. 공유 빌림이 살아 있는데 가변으로 빌렸다는 뜻이다.

```text
error[E0502]: cannot borrow `*v` as mutable because it is also borrowed as immutable
  |
2 |     let first = &v[0];
  |                  - immutable borrow occurs here
3 |     v.push(x);
  |     ^^^^^^^^^ mutable borrow occurs here
4 |     *first
  |     ------ immutable borrow later used here
```

{: start="2"}
2. *누가 언제 빌렸나:*

| 줄 | 코드 | `first`(공유 빌림) | 가변 빌림 |
|---|---|---|---|
| 2 | `let first = &v[0];` | 시작 | |
| 3 | `v.push(x);` | 살아 있음 | `push`의 `&mut self` |
| 4 | `*first` | 마지막 사용 | |

3번 줄에서 둘이 겹친다. 이 겹침이 실제로 위험한 이유가 있다. `Vec`은 원소를 붙여서 놓으므로, 자리가 모자라면 `push`가 더 큰 자리를 새로 잡아 원소를 옮긴다. 그러면 `first`는 돌려준 옛 자리를 가리킨다[^2].

{: start="3"}
3. *고치는 방법 고르기:* 필요한 것은 첫 칸의 **자리**가 아니라 **값**이다. `i32`는 `Copy`라서 `let first = v[0];`로 값을 베끼면 빌림이 그 줄에서 끝난다. 순서를 바꿔 `v.push(x); v[0]`처럼 `push`한 뒤에 읽어도 컴파일된다.

```rust
pub fn push_and_report(v: &mut Vec<i32>, x: i32) -> i32 {
    let first = v[0];
    v.push(x);
    first
}
```

원소가 `String`이면 베끼기가 안 된다. `let first = v[0];`은 E0507(cannot move out of index of `Vec<String>`)이다. 컴파일러의 첫 도움말 "consider borrowing here"(`&v[0]`)를 따르면 처음의 E0502로 돌아간다. 둘째 도움말 "consider cloning the value if the performance cost is acceptable"대로 `v[0].clone()`을 쓰면 컴파일된다. 도움말은 이 줄만 보고 낸 것이라, 고른 뒤에는 다시 컴파일해 봐야 한다.

{: start="4"}
4. *확인:* `vec![10, 20, 30, 40]`에 50을 넣으면 10을 돌려주고 `v`는 `[10, 20, 30, 40, 50]`이 된다. 용량이 1인 `Vec`에 7을 넣어 두고 8을 넣으면 7을 돌려준다. 이 기계에서는 이때 버퍼 주소가 그대로였다(`buffer moved: false`). 할당기가 제자리에서 늘려 줄 때도 있다는 뜻이다. 컴파일러는 버퍼가 옮겨 갈지 미리 모르므로 늘 거절한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: E0502·E0507 메시지와 라벨, 두 고침과 `clone` 판이 컴파일되는 것, 실행 결과 — [09_borrow-errors-ladder_p1.rs](/Hongs_Blog/studies/rust/code/09_borrow-errors-ladder_p1/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

`Vec`의 첫 칸과 끝 칸을 바꾸는 함수다.

```rust
pub fn swap_ends(v: &mut Vec<i32>) {
    let n = v.len();
    let a = &mut v[0];
    let b = &mut v[n - 1];
    std::mem::swap(a, b);
}
```

1. *오류 코드 읽기:* E0499, 같은 값을 가변으로 두 번 빌렸다.

```text
error[E0499]: cannot borrow `*v` as mutable more than once at a time
  |
3 |     let a = &mut v[0];
  |                  - first mutable borrow occurs here
4 |     let b = &mut v[n - 1];
  |                  ^ second mutable borrow occurs here
5 |     std::mem::swap(a, b);
  |                    - first borrow later used here
  |
  = help: use `.split_at_mut(position)` to obtain two mutable non-overlapping sub-slices
```

{: start="2"}
2. *누가 언제 빌렸나:* `a`는 3번 줄에서 시작해 5번 줄까지, `b`는 4번 줄에서 시작해 5번 줄까지 산다. 4~5번 줄에서 `v`를 가리키는 가변 참조가 둘이다. 컴파일러는 `0`과 `n - 1`이 다른 칸인지 모른다. 실제로 원소가 하나면 둘은 같은 칸이다. 그때 두 `&mut`가 한 칸을 함께 가리키게 되니, 거절이 틀린 것도 아니다.
3. *고치는 방법 고르기:* 두 길이 있다.
   - 슬라이스의 `swap(i, j)`를 쓴다. 번호 두 개를 받아 안에서 바꾸므로 밖에서 `&mut`를 둘 만들 일이 없다.
   - 도움말대로 `split_at_mut`로 겹치지 않는 두 조각을 받는다. 이 메서드는 가변 슬라이스 하나를 한 위치에서 둘로 나누고, 위치가 길이보다 크면 panic한다[^3].

길이를 바꾸지 않으므로 인자는 `&mut [i32]`로 받는다([슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/)). 원소가 둘보다 적으면 바꿀 것이 없으니 아무것도 하지 않는다.

```rust
fn swap_ends(v: &mut [i32]) {
    if v.len() >= 2 {
        let n = v.len();
        v.swap(0, n - 1);
    }
}

fn swap_ends_split(v: &mut [i32]) {
    if v.len() >= 2 {
        let n = v.len();
        let (left, right) = v.split_at_mut(n - 1);
        std::mem::swap(&mut left[0], &mut right[0]);
    }
}
```

{: start="4"}
4. *확인:* `[1, 2, 3, 4]`에 `swap_ends`를 부르면 ______가 되고, 이어서 `swap_ends_split`을 부르면 ______가 된다. `[9]`와 빈 배열 `[]`에서는 ______. `if v.len() >= 2` 검사를 빼고 `v.swap(0, n - 1)`만 남기면 `[9]`에서는 ______, `[]`에서는 ______.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`[4, 2, 3, 1]`이 되고, 다시 바꿔 `[1, 2, 3, 4]`로 돌아온다. `[9]`와 `[]`는 그대로이고 panic하지 않는다.

검사를 빼면 `[9]`는 `swap(0, 0)`이라 그대로다. `[]`는 `n - 1`에서 `0 - 1`을 계산하다 dev 빌드에서 "attempt to subtract with overflow"로 panic한다. `usize`는 음수가 없기 때문이다. 빌림 오류를 고치느라 코드 모양을 바꿨으면, 경계 입력을 다시 넣어 봐야 하는 이유다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: E0499 메시지·라벨·도움말, 두 고침의 결과, 검사를 뺀 판의 panic 메시지 — [09_borrow-errors-ladder_p2.rs](/Hongs_Blog/studies/rust/code/09_borrow-errors-ladder_p2/)</div>

</div>


## 문제 3 · 하위목표 절반이 빈칸

글에서 가장 긴 줄을 대문자로 바꿔 돌려주려는 함수다.

```rust
pub fn longest_line_upper(text: &str) -> &str {
    let upper = text.to_uppercase();
    upper.lines().max_by_key(|l| l.len()).unwrap_or("")
}
```

1. *오류 코드 읽기:* E0515, 지역 변수를 가리키는 값을 돌려주려 한다.

```text
error[E0515]: cannot return value referencing local variable `upper`
  |
3 |     upper.lines().max_by_key(|l| l.len()).unwrap_or("")
  |     -----^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |     |
  |     returns a value referencing data owned by the current function
  |     `upper` is borrowed here
```

{: start="2"}
2. *누가 언제 빌렸나:* ______
3. *고치는 방법 고르기:* ______
4. *확인:* 고친 함수에 `"ab\nlonger line\nmid"`를 넣으면 `"LONGER LINE"`이 나와야 한다. 빈 문자열을 넣으면 빈 결과다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. *누가 언제 빌렸나:* `upper`는 함수 안에서 새로 만든 `String`이고, 주인은 이 함수다. `upper.lines()`가 `upper`를 빌리므로, 고른 줄 `&str`은 `upper`의 버퍼 안을 가리킨다. 함수가 끝나면 `upper`가 버려지고, 돌려준 참조는 돌려준 자리를 가리키게 된다. 시그니처는 수명 생략 규칙 2로 "출력은 `text`에서 빌린 것"이라고 약속했지만, 실제 값은 `text`가 아닌 `upper`에서 왔다([수명](/Hongs_Blog/studies/rust/lifetimes/)).
3. *고치는 방법 고르기:* 수명 표시로는 고칠 수 없다. 버려질 값을 더 살게 하는 수명은 없다. 새로 만든 글은 소유한 값으로 돌려준다[^4]. 줄을 먼저 고르고 그 줄만 대문자로 바꾸면, 글 전체 대신 한 줄 몫만 새로 할당한다. 대신 줄을 고르는 기준이 대문자로 바꾸기 전의 바이트 길이가 된다. 영문자는 대문자로 바꿔도 1바이트라서 영어 글에서는 결과가 같다.

```rust
fn longest_line_upper(text: &str) -> String {
    text.lines()
        .max_by_key(|l| l.len())
        .unwrap_or("")
        .to_uppercase()
}
```

대문자가 꼭 필요하지 않다면 다른 길도 있다. 입력에서 잘라 돌려주면 새 할당 없이 `&str`을 돌려줄 수 있다. 돌려받은 `"longer line"`은 입력 버퍼의 3번 바이트를 가리킨다.

```rust
fn longest_line(text: &str) -> &str {
    text.lines().max_by_key(|l| l.len()).unwrap_or("")
}
```

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: E0515 메시지와 라벨, 고친 두 함수의 결과, 돌려받은 슬라이스가 입력 주소 + 3인 것 — [09_borrow-errors-ladder_p3.rs](/Hongs_Blog/studies/rust/code/09_borrow-errors-ladder_p3/)</div>

</div>


## 문제 4 · 독립 문제

창고의 물건마다 기록을 남기는 메서드다.

```rust
pub struct Inventory { items: Vec<String>, log: Vec<String> }

impl Inventory {
    fn record(&mut self, msg: &str) { self.log.push(msg.to_string()); }

    pub fn audit(&mut self) {
        for item in &self.items {
            self.record(item);
        }
    }
}
```

(a) 컴파일러는 어떤 오류 코드를 내고, 무엇과 무엇이 겹친다고 하는가? (b) `items`와 `log`는 서로 다른 필드인데 왜 겹친다고 보는가? (c) 고쳐서 `items`가 `["apple", "pear"]`일 때 `log`가 `["checked apple", "checked pear"]`가 되게 하라. (d) 컴파일러의 도움말은 "consider using an index-based loop instead"라고 한다. `for i in 0..self.items.len() { self.record(&self.items[i]); }`로 바꾸면 컴파일되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) E0502(cannot borrow `*self` as mutable because it is also borrowed as immutable)다. `&self.items`가 공유 빌림을 시작하고, `self.record(item)`이 가변 빌림이다. 컴파일러는 반복문 전체를 짚으며 "this for loop borrows `*self` immutably, preventing mutation within its body"라고 쓴다. 반복자가 다음 바퀴에도 `&self.items`를 쓰므로 공유 빌림이 반복문 끝까지 산다. 컴파일러가 `&self.items`에 "immutable borrow later used here"를 함께 다는 이유다.

(b) 메서드를 부를 때 컴파일러는 시그니처만 본다. `record(&mut self)`는 "`self` 전체를 가변으로 빌린다"는 뜻이고, 그 안에 `items`도 들어 있다. 몸통이 `log`만 고친다는 사실은 부르는 쪽 검사에 쓰이지 않는다([빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)의 "필드는 따로 빌린다").

(c) 빌리는 범위를 필드로 좁힌다. 반복문 안에서 `self.log.push(item.clone())`처럼 필드를 직접 쓰면 컴파일러가 `self.items`와 `self.log`가 겹치지 않는다는 것을 안다. 기록하는 일을 함수로 두고 싶으면 `log` 필드만 받는 함수로 뺀다.

```rust
fn record(log: &mut Vec<String>, msg: &str) {
    log.push(format!("checked {msg}"));
}

impl Inventory {
    fn audit(&mut self) {
        for item in &self.items {
            record(&mut self.log, item);
        }
    }
}
```

(d) 안 된다. 여전히 E0502이고, 이번에는 `&self.items[i]`에 "immutable borrow later used by call"이 붙는다. 번호로 돌아도 인자 `&self.items[i]`가 `self`를 빌린 채로 `&mut self` 메서드에 들어가기 때문이다. `let item = self.items[i].clone(); self.record(&item);`처럼 먼저 베끼면 컴파일되지만, 물건마다 할당이 하나씩 늘어난다. 도움말은 출발점일 뿐이고, 필드를 나눠 빌리는 (c)가 할당 없이 고치는 길이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 E0502 메시지와 라벨·도움말, 필드를 직접 쓴 판과 `clone` 판이 컴파일되는 것, 고친 `audit`의 결과 — [09_borrow-errors-ladder_p4.rs](/Hongs_Blog/studies/rust/code/09_borrow-errors-ladder_p4/)</div>

</div>


[^1]: The Rust Programming Language, 4.2 References and Borrowing (Mutable References, The Rules of References) — https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html
[^2]: The Rust Programming Language, 8.1 Storing Lists of Values with Vectors (Listing 8-6: 첫 원소의 참조를 쥔 채 `push`) — https://doc.rust-lang.org/book/ch08-01-vectors.html
[^3]: std 문서, Primitive Type `slice`, `split_at_mut` — https://doc.rust-lang.org/std/primitive.slice.html
[^4]: The Rust Programming Language, 10.3 Validating References with Lifetimes, Relationships (지역 값의 참조 대신 소유한 값을 돌려준다) — https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html
{% endraw %}
