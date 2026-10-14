---
layout: "note"
title: "09_slices-strings_verify.rs"
display_title: "09_slices-strings_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/slices-strings/"
parent_title: "슬라이스와 String·&str"
description: "Rust · 슬라이스와 String·&str 검증 코드"
sitemap: false
permalink: "/studies/rust/code/09_slices-strings_verify/"
---
{% raw %}
[슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/) 문서의 검증 코드다.

```rust
//! 슬라이스와 String·&str 문서의 주장을 확인한다: 크기(String 3칸, &str·&[T] 2칸), 바이트 길이와 글자 수,
//! 글자 경계가 아닌 곳을 자르면 panic, get은 None, chars·bytes·char_indices, 정수 인덱스 금지(E0277),
//! 슬라이스가 원본을 빌리는 것(E0502·E0505), 리터럴은 &'static str이라 &String 자리에 못 넣는 것(E0308),
//! 슬라이스로는 길이를 못 바꾸는 것(E0599), clippy의 ptr_arg·char_indices_as_byte_indices,
//! 앞 n글자 자르기(prefix_chars)와 확인 문제 C1의 출력.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/09_slices-strings_verify.rs"

use std::process::Command;
use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

/// 코드 조각을 tool(rustc 또는 clippy-driver)로 컴파일해 stderr를 돌려준다.
fn compile_with(tool: &str, code: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::SeqCst);
    let dir = std::env::temp_dir().join(format!("vr09_{}_{n}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = Command::new(tool)
        .args([
            "--edition",
            "2024",
            "--crate-type=lib",
            "--emit=metadata",
            "--out-dir",
        ])
        .arg(&dir)
        .arg(&file)
        .output()
        .expect("컴파일러 실행");
    let _ = std::fs::remove_dir_all(&dir);
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn expect_error(code: &str, err: &str, phrase: &str) {
    let stderr = compile_with("rustc", code);
    assert!(
        stderr.contains(&format!("error[{err}]")),
        "{err} 기대, 실제:\n{stderr}"
    );
    assert!(stderr.contains(phrase), "'{phrase}' 기대, 실제:\n{stderr}");
    println!("{err} 확인: {phrase}");
}

fn expect_lint(code: &str, lint: &str) {
    let stderr = compile_with("clippy-driver", code);
    assert!(stderr.contains(lint), "{lint} 기대, 실제:\n{stderr}");
    println!("clippy 확인: {lint}");
}

fn compile_checks() {
    expect_error(
        r#"pub fn f(){ let s=String::from("hi"); let _c=s[0]; }"#,
        "E0277",
        "the type `str` cannot be indexed by `{integer}`",
    );
    expect_error(
        r#"pub fn f(){ let s=String::from("hi"); let _c=s[0]; }"#,
        "E0277",
        "you can use `.chars().nth()` or `.bytes().nth()`",
    );
    expect_error(
        r#"fn first_word(s:&str)->&str{ s.split(' ').next().unwrap_or("") }
           pub fn f(){ let mut s=String::from("hello world"); let w=first_word(&s); s.clear(); println!("{w}"); }"#,
        "E0502",
        "cannot borrow `s` as mutable because it is also borrowed as immutable",
    );
    for label in [
        "immutable borrow occurs here",
        "mutable borrow occurs here",
        "immutable borrow later used here",
    ] {
        expect_error(
            r#"fn first_word(s:&str)->&str{ s.split(' ').next().unwrap_or("") }
           pub fn f(){ let mut s=String::from("hello world"); let w=first_word(&s); s.clear(); println!("{w}"); }"#,
            "E0502",
            label,
        );
    }
    expect_error(
        r#"pub fn f(){ let v=vec![1,2,3]; let sl:&[i32]=&v[1..]; drop(v); println!("{sl:?}"); }"#,
        "E0505",
        "cannot move out of `v` because it is borrowed",
    );
    // 리터럴은 &'static str이라 &String 인자에 넣을 수 없다
    expect_error(
        r#"fn n(s:&String)->usize{ s.len() }
           pub fn f()->usize{ n("hi") }"#,
        "E0308",
        "found reference `&'static str`",
    );
    // 부분 슬라이스도 &str이라 &String 인자에 넣을 수 없다
    expect_error(
        r#"fn n(s:&String)->usize{ s.len() }
           pub fn f(o:&String)->usize{ n(&o[1..]) }"#,
        "E0308",
        "expected `&String`, found `&str`",
    );
    // 슬라이스는 길이를 바꾸는 메서드가 없다
    expect_error(
        r#"pub fn f(xs:&mut [i32]){ xs.push(1); }"#,
        "E0599",
        "no method named `push` found for mutable reference `&mut [i32]`",
    );
    // &String·&Vec 인자는 기본 clippy가 경고한다
    expect_lint(
        r#"pub fn n(s:&String)->usize{ s.len() }"#,
        "clippy::ptr_arg",
    );
    expect_lint(
        r#"pub fn n(s:&String)->usize{ s.len() }"#,
        "writing `&String` instead of `&str` involves a new object where a slice will do",
    );
    expect_lint(r#"pub fn n(v:&Vec<i32>)->i32{ v[0] }"#, "clippy::ptr_arg");
    // 글자 번호를 바이트 위치로 쓰면 경고한다
    expect_lint(
        r#"pub fn n(s:&str)->Option<&str>{ for (i,c) in s.chars().enumerate(){ if c==' ' { return Some(&s[..i]); } } None }"#,
        "clippy::char_indices_as_byte_indices",
    );
    expect_lint(
        r#"pub fn n(s:&str)->Option<&str>{ for (i,c) in s.chars().enumerate(){ if c==' ' { return Some(&s[..i]); } } None }"#,
        "#[deny(clippy::char_indices_as_byte_indices)]` on by default",
    );
    expect_lint(
        r#"pub fn n(s:&str)->Option<&str>{ for (i,c) in s.chars().enumerate(){ if c==' ' { return Some(&s[..i]); } } None }"#,
        "consider using `.char_indices()` instead",
    );
}

fn first_word(s: &str) -> &str {
    s.split(' ').next().unwrap_or("")
}

/// 앞의 n글자를 복사 없이 잘라 준다. 글자 경계에서만 자르므로 panic하지 않는다.
fn prefix_chars(s: &str, n: usize) -> &str {
    s.char_indices().nth(n).map_or(s, |(i, _)| &s[..i])
}

fn sum(xs: &[i32]) -> i32 {
    xs.iter().sum()
}

fn panic_message(f: impl FnOnce() + std::panic::UnwindSafe) -> String {
    let err = std::panic::catch_unwind(f).expect_err("panic 기대");
    if let Some(s) = err.downcast_ref::<String>() {
        s.clone()
    } else {
        (*err.downcast_ref::<&str>().unwrap()).to_string()
    }
}

fn runtime_checks() {
    let w = std::mem::size_of::<usize>();
    assert_eq!(std::mem::size_of::<String>(), 3 * w);
    assert_eq!(std::mem::size_of::<&str>(), 2 * w);
    assert_eq!(std::mem::size_of::<&[i32]>(), 2 * w);
    assert_eq!(std::mem::size_of::<&String>(), w);
    assert_eq!(std::mem::size_of::<Box<str>>(), 2 * w);
    println!(
        "sizes: String {} / &str {} / &[i32] {} / &String {}",
        3 * w,
        2 * w,
        2 * w,
        w
    );

    // 슬라이스는 원본 버퍼를 가리킨다 (복사하지 않는다)
    let s = String::from("hello world");
    let world = &s[6..];
    assert_eq!(world.as_ptr(), s[6..].as_ptr());
    assert_eq!(world.as_ptr() as usize - s.as_ptr() as usize, 6);
    assert_eq!((s.len(), s.capacity(), world.len()), (11, 11, 5));

    // 리터럴은 &'static str이다. 끝 표시 없이 길이를 따로 든다
    let lit: &'static str = "hello world";
    assert_eq!(first_word(lit), "hello");
    assert_eq!("a\0b".len(), 3);

    // 바이트 길이와 글자 수
    assert_eq!(("Hola".len(), "Hola".chars().count()), (4, 4));
    let hello = "Здравствуйте";
    assert_eq!((hello.len(), hello.chars().count()), (24, 12));
    let ko = "안녕";
    assert_eq!((ko.len(), ko.chars().count()), (6, 2));
    let hi = "नमस्ते";
    assert_eq!((hi.len(), hi.chars().count()), (18, 6));
    assert_eq!(&hello[0..4], "Зд");
    let bytes: Vec<u8> = "Зд".bytes().collect();
    assert_eq!(bytes, [208, 151, 208, 180]);
    let chars: Vec<char> = "Зд".chars().collect();
    assert_eq!(chars, ['З', 'д']);
    let idx: Vec<(usize, char)> = "a안b".char_indices().collect();
    assert_eq!(idx, [(0, 'a'), (1, '안'), (4, 'b')]);

    // 글자 경계가 아닌 곳을 자르면 panic, get은 None
    std::panic::set_hook(Box::new(|_| {}));
    let msg = panic_message(|| {
        let h = String::from("Здравствуйте");
        let _ = &h[0..1];
    });
    let msg_ko = panic_message(|| {
        let h = String::from("안녕");
        let _ = &h[..1];
    });
    let _ = std::panic::take_hook();
    println!("panic: {msg}");
    println!("panic: {msg_ko}");
    assert!(msg.contains(
        "end byte index 1 is not a char boundary; it is inside 'З' (bytes 0..2 of string)"
    ));
    assert!(msg_ko.contains(
        "end byte index 1 is not a char boundary; it is inside '안' (bytes 0..3 of string)"
    ));
    let hi_bytes: Vec<usize> = hi.chars().map(char::len_utf8).collect();
    assert_eq!(hi_bytes, [3, 3, 3, 3, 3, 3]);
    assert_eq!(hello.get(0..1), None);
    assert_eq!(hello.get(0..2), Some("З"));
    assert!(!ko.is_char_boundary(1) && ko.is_char_boundary(3));

    // &str 인자는 String·리터럴·부분 슬라이스를 모두 받는다
    let owned = String::from("hello world");
    assert_eq!(first_word(&owned), "hello");
    assert_eq!(first_word("hi there"), "hi");
    assert_eq!(first_word(&owned[6..]), "world");

    // 배열·Vec의 슬라이스
    let a = [1, 2, 3, 4, 5];
    let v: Vec<i32> = (1..=5).collect();
    assert_eq!(&a[1..3], &[2, 3]);
    assert_eq!(&v[1..3], &a[1..3]);

    // 앞의 n글자: 바이트가 아니라 chars로
    let first_two: String = hello.chars().take(2).collect();
    assert_eq!(first_two, "Зд");
    assert_eq!(prefix_chars("안녕하세요", 2), "안녕");
    assert_eq!(prefix_chars("hi", 5), "hi");
    assert_eq!("안녕하세요".chars().nth(2), Some('하'));

    // &[T] 인자는 Vec·배열·부분 슬라이스를 모두 받는다
    assert_eq!((sum(&v), sum(&a), sum(&v[1..3])), (15, 15, 5));
    // &mut [T]로는 칸을 고칠 수 있다 (길이는 그대로)
    let mut w = vec![5, 4, 3, 2, 1];
    w[1..4].sort();
    assert_eq!(w, [5, 2, 3, 4, 1]);

    // 확인 문제 C1
    let t = "a안b";
    let starts: Vec<usize> = t.char_indices().map(|(i, _)| i).collect();
    let c1 = format!("{} {} {:?}", t.len(), t.chars().count(), starts);
    println!("C1: {c1}");
    assert_eq!(c1, "5 3 [0, 1, 4]");
    println!("runtime: lengths, panic on boundary, get None ok");
}

fn main() {
    compile_checks();
    runtime_checks();
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn first_word_cases() {
        assert_eq!(first_word(""), "");
        assert_eq!(first_word("one"), "one");
        assert_eq!(first_word("안녕 세상"), "안녕");
    }

    #[test]
    fn prefix_chars_never_panics() {
        let samples = [
            "",
            "a",
            "héllo",
            "안녕하세요",
            "Здравствуйте",
            "नमस्ते",
            "a안b",
        ];
        for s in samples {
            for n in 0..15 {
                let p = prefix_chars(s, n);
                assert_eq!(p.chars().count(), n.min(s.chars().count()));
                assert!(s.starts_with(p));
            }
        }
    }
}
```
{% endraw %}
