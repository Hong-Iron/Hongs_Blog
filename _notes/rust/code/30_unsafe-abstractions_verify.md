---
layout: "note"
title: "30_unsafe-abstractions_verify.rs"
display_title: "30_unsafe-abstractions_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "30"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/unsafe-abstractions/"
parent_title: "unsafe와 안전한 감싸기"
description: "Rust · unsafe와 안전한 감싸기 검증 코드"
sitemap: false
permalink: "/studies/rust/code/30_unsafe-abstractions_verify/"
---
{% raw %}
[unsafe와 안전한 감싸기](/Hongs_Blog/studies/rust/unsafe-abstractions/) 문서의 검증 코드다.

```rust
//! unsafe 규칙을 컴파일러로 확인한다: 원시 포인터 역참조는 unsafe 밖에서 E0133,
//! unsafe여도 빌림 검사는 그대로(E0499), 2024 에디션의 unsafe_op_in_unsafe_fn 경고,
//! `unsafe` 없는 extern 블록은 오류, std::env::set_var는 unsafe 함수(E0133),
//! clippy::undocumented_unsafe_blocks와 not_unsafe_ptr_arg_deref가 실제로 걸리는 것,
//! 안전한 Rust만으로 쓴 split_at_mut이 E0499인 것, 2024 에디션의 static mut 참조 금지와 #[unsafe(no_mangle)],
//! clippy 기본 설정에서 걸리는 것(missing_safety_doc 경고, not_unsafe_ptr_arg_deref 오류)과 안 걸리는 것,
//! unsafe impl Send가 필요한 것(E0200), #![forbid(unsafe_code)]가 unsafe 블록을 막는 것.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/30_unsafe-abstractions_verify.rs"

use std::process::Command;

/// 조각을 컴파일한다. `extra`에 `--edition`이 없으면 2024 에디션으로 한다
/// (rustc는 `--edition`이 두 번 오면 오류를 내므로 한 번만 넘긴다).
fn run(tool: &str, tag: &str, code: &str, extra: &[&str]) -> String {
    let dir = std::env::temp_dir().join(format!("vr30_{}_{}", std::process::id(), tag));
    std::fs::create_dir_all(&dir).expect("임시 폴더");
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).expect("쓰기");
    let mut cmd = Command::new(tool);
    if !extra.contains(&"--edition") {
        cmd.args(["--edition", "2024"]);
    }
    let out = cmd
        .args(["--crate-type=lib", "--emit=metadata", "--out-dir"])
        .arg(&dir)
        .args(extra)
        .arg(&file)
        .output()
        .expect("컴파일러 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn rustc(tag: &str, code: &str) -> String {
    run("rustc", tag, code, &[])
}

fn main() {
    // 1. 원시 포인터를 만드는 것은 안전, 역참조는 unsafe
    let e = rustc(
        "deref",
        "pub fn f() -> i32 { let x = 5; let p = &raw const x; *p }\n",
    );
    assert!(e.contains("error[E0133]"), "{e}");
    assert!(
        e.contains("dereference of raw pointer is unsafe and requires unsafe block"),
        "{e}"
    );
    let ok = rustc(
        "deref_ok",
        "pub fn f() -> i32 { let x = 5; let p = &raw const x; unsafe { *p } }\n",
    );
    assert!(ok.is_empty(), "{ok}");
    println!("1. 원시 포인터 역참조: unsafe 밖 E0133");

    // 2. unsafe 블록 안에서도 빌림 검사는 그대로
    let e = rustc(
        "borrowck",
        "pub fn f() { let mut v = vec![1]; unsafe { let a = &mut v; let b = &mut v; a.push(1); b.push(2); } }\n",
    );
    assert!(e.contains("error[E0499]"), "{e}");
    println!("2. unsafe 안의 &mut 두 개: E0499");

    // 3. 2024 에디션: unsafe fn 몸통의 unsafe 연산에 경고
    let e = rustc("op_in_fn", "pub unsafe fn f(p: *const i32) -> i32 { *p }\n");
    assert!(e.contains("warning[E0133]"), "{e}");
    assert!(e.contains("unsafe_op_in_unsafe_fn"), "{e}");
    assert!(
        e.contains("an unsafe function restricts its caller, but its body is safe by default"),
        "{e}"
    );
    let e2021 = run(
        "rustc",
        "op_in_fn_2021",
        "pub unsafe fn f(p: *const i32) -> i32 { *p }\n",
        &["--edition", "2021"],
    );
    // 2021에서는 오류도 경고도 없이 컴파일된다
    assert!(e2021.is_empty(), "{e2021}");
    println!("3. unsafe_op_in_unsafe_fn: 2024 경고, 2021 조용");

    // 4. extern 블록에는 unsafe가 필요하다
    let e = rustc("extern", "extern \"C\" { pub fn abs(x: i32) -> i32; }\n");
    assert!(e.contains("extern blocks must be unsafe"), "{e}");
    let ok = rustc(
        "extern_ok",
        "unsafe extern \"C\" { pub safe fn abs(x: i32) -> i32; }\npub fn g() -> i32 { abs(-3) }\n",
    );
    assert!(ok.is_empty(), "{ok}");
    println!("4. extern 블록: unsafe extern 필요, safe fn은 그냥 부를 수 있다");

    // 5. set_var는 2024에서 unsafe
    let e = rustc(
        "setvar",
        "pub fn f() { std::env::set_var(\"K\", \"V\"); }\n",
    );
    assert!(e.contains("error[E0133]"), "{e}");
    assert!(e.contains("call to unsafe function `set_var`"), "{e}");
    println!("5. std::env::set_var: E0133");

    // 6. clippy
    let e = run(
        "clippy-driver",
        "clippy",
        "pub fn f(v: &[i32]) -> i32 { unsafe { *v.get_unchecked(0) } }\n\
         pub fn g(p: *const i32) -> i32 { // SAFETY: 없음\n unsafe { *p } }\n",
        &["-W", "clippy::undocumented_unsafe_blocks"],
    );
    assert!(e.contains("unsafe block missing a safety comment"), "{e}");
    assert!(e.contains("#undocumented_unsafe_blocks"), "{e}");
    assert!(
        e.contains(
            "this public function might dereference a raw pointer but is not marked `unsafe`"
        ),
        "{e}"
    );
    assert!(e.contains("#not_unsafe_ptr_arg_deref"), "{e}");
    let ok = run(
        "clippy-driver",
        "clippy_ok",
        "/// 첫 원소.\n///\n/// # Panics\n/// 비어 있으면 panic한다.\npub fn f(v: &[i32]) -> i32 {\n    assert!(!v.is_empty());\n    // SAFETY: 바로 위에서 길이가 1 이상임을 확인했다.\n    unsafe { *v.get_unchecked(0) }\n}\n",
        &["-W", "clippy::undocumented_unsafe_blocks"],
    );
    assert!(ok.is_empty(), "{ok}");
    println!("6. clippy: SAFETY 주석 없는 블록, 포인터 인자를 역참조하는 안전한 pub fn");

    // 6-1. clippy 기본 설정: undocumented_unsafe_blocks는 꺼져 있고, not_unsafe_ptr_arg_deref는 오류(deny)
    let e = run(
        "clippy-driver",
        "clippy_default",
        "pub fn f(v: &[i32]) -> i32 { unsafe { *v.get_unchecked(0) } }\n\
         pub fn g(p: *const i32) -> i32 { unsafe { *p } }\n",
        &[],
    );
    assert!(!e.contains("undocumented_unsafe_blocks"), "{e}");
    assert!(
        e.contains("error: this public function might dereference a raw pointer"),
        "{e}"
    );
    assert!(
        e.contains("`#[deny(clippy::not_unsafe_ptr_arg_deref)]` on by default"),
        "{e}"
    );
    // pub unsafe fn에 # Safety 문서가 없으면 기본 경고
    let e = run(
        "clippy-driver",
        "safety_doc",
        "pub unsafe fn f(p: *const i32) -> i32 { unsafe { *p } }\n",
        &[],
    );
    assert!(
        e.contains("unsafe function's docs are missing a `# Safety` section"),
        "{e}"
    );
    assert!(
        e.contains("`#[warn(clippy::missing_safety_doc)]` on by default"),
        "{e}"
    );
    println!(
        "   기본 설정: undocumented_unsafe_blocks 꺼짐, not_unsafe_ptr_arg_deref 오류, missing_safety_doc 경고"
    );

    // 7. 안전한 Rust만으로는 split_at_mut을 쓸 수 없다
    let e = rustc(
        "naive_split",
        "pub fn split_at_mut(values: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {\n\
         let len = values.len(); assert!(mid <= len); (&mut values[..mid], &mut values[mid..]) }\n",
    );
    assert!(e.contains("error[E0499]"), "{e}");
    assert!(
        e.contains("cannot borrow `*values` as mutable more than once at a time"),
        "{e}"
    );
    println!("7. 안전한 코드로 쓴 split_at_mut: E0499");

    // 8. static mut: unsafe 밖에서 쓰면 E0133, 2024에서는 참조를 만드는 것 자체가 오류
    let e = rustc(
        "smut_noblock",
        "static mut COUNT: u32 = 0;\npub fn f() { COUNT += 1; }\n",
    );
    assert!(e.contains("error[E0133]"), "{e}");
    assert!(e.contains("use of mutable static is unsafe"), "{e}");
    let e = rustc(
        "smut_ref",
        "static mut COUNT: u32 = 0;\npub fn f() -> u32 { unsafe { COUNT += 1; let r = &COUNT; *r } }\n",
    );
    assert!(
        e.contains("error: creating a shared reference to mutable static"),
        "{e}"
    );
    assert!(e.contains("static_mut_refs"), "{e}");
    // 2021에서는 같은 코드가 경고로 끝난다
    let e2021 = run(
        "rustc",
        "smut_ref_2021",
        "static mut COUNT: u32 = 0;\npub fn f() -> u32 { unsafe { COUNT += 1; let r = &COUNT; *r } }\n",
        &["--edition", "2021"],
    );
    assert!(
        e2021.contains("warning: creating a shared reference to mutable static"),
        "{e2021}"
    );
    assert!(!e2021.contains("error"), "{e2021}");
    let ok = rustc(
        "smut_raw",
        "static mut COUNT: u32 = 0;\npub fn f() -> u32 { unsafe { COUNT += 1; *(&raw const COUNT) } }\n",
    );
    assert!(ok.is_empty(), "{ok}");
    println!("8. static mut: unsafe 밖 E0133, &COUNT는 2024 오류·2021 경고, &raw const는 통과");

    // 9. 2024: no_mangle은 unsafe(...)로 감싸야 한다
    let e = rustc(
        "nomangle",
        "#[no_mangle]\npub extern \"C\" fn vault_add(a: i32, b: i32) -> i32 { a + b }\n",
    );
    assert!(
        e.contains("error: unsafe attribute used without unsafe"),
        "{e}"
    );
    let ok = rustc(
        "nomangle_ok",
        "#[unsafe(no_mangle)]\npub extern \"C\" fn vault_add(a: i32, b: i32) -> i32 { a + b }\n",
    );
    assert!(ok.is_empty(), "{ok}");
    println!("9. #[no_mangle]: 2024에서 오류, #[unsafe(no_mangle)]는 통과");

    // 10. unsafe trait 구현에는 unsafe impl이 필요하다
    let e = rustc(
        "send_impl",
        "pub struct X(pub *const u8);\nimpl Send for X {}\n",
    );
    assert!(e.contains("error[E0200]"), "{e}");
    assert!(
        e.contains("the trait `Send` requires an `unsafe impl` declaration"),
        "{e}"
    );
    let ok = rustc(
        "send_impl_ok",
        "pub struct X(pub *const u8);\n// SAFETY: 예시\nunsafe impl Send for X {}\n",
    );
    assert!(ok.is_empty(), "{ok}");
    println!("10. impl Send: E0200, unsafe impl은 통과");

    // 11. #![forbid(unsafe_code)]: unsafe 블록이 있으면 오류
    let e = rustc(
        "forbid",
        "#![forbid(unsafe_code)]\npub fn f(v: &[i32]) -> i32 { unsafe { *v.get_unchecked(0) } }\n",
    );
    assert!(e.contains("error: usage of an `unsafe` block"), "{e}");
    println!("11. #![forbid(unsafe_code)]: unsafe 블록 오류");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
