---
layout: "note"
title: "06_malloc-free-vs-ownership_verify.rs"
display_title: "06_malloc-free-vs-ownership_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/malloc-free-vs-ownership/"
parent_title: "malloc·free ↔ 소유권과 Drop"
description: "Rust · malloc·free ↔ 소유권과 Drop 검증 코드"
sitemap: false
permalink: "/studies/rust/code/06_malloc-free-vs-ownership_verify/"
---
{% raw %}
[malloc·free ↔ 소유권과 Drop](/Hongs_Blog/studies/rust/malloc-free-vs-ownership/) 문서의 검증 코드다.

```rust
//! malloc·free ↔ 소유권과 Drop 브리지의 주장을 확인한다.
//! C의 네 실수(누수, 해제 뒤 사용, 이중 해제, 지역 변수 주소 돌려주기)가 Rust에서 어떤 컴파일 오류가 되는지,
//! 할당 횟수와 해제 횟수를 세는 전역 할당자로 "보통은 받은 만큼 돌려준다"와 "안전한 코드로도 샐 수 있다"
//! (Rc 순환, mem::forget, Box::leak)를 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/06_malloc-free-vs-ownership_verify.rs"

use std::alloc::{GlobalAlloc, Layout, System};
use std::cell::RefCell;
use std::process::Command;
use std::rc::Rc;
use std::sync::atomic::{AtomicUsize, Ordering};

/// 받은 횟수와 돌려준 횟수를 세는 할당자. 실제 일은 System에 맡긴다.
struct Counting;

static ALLOCS: AtomicUsize = AtomicUsize::new(0);
static FREES: AtomicUsize = AtomicUsize::new(0);

// SAFETY: 모든 일을 System에 그대로 넘기고 횟수만 센다.
unsafe impl GlobalAlloc for Counting {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        ALLOCS.fetch_add(1, Ordering::SeqCst);
        // SAFETY: 호출자가 GlobalAlloc::alloc의 조건을 지킨다.
        unsafe { System.alloc(layout) }
    }
    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        FREES.fetch_add(1, Ordering::SeqCst);
        // SAFETY: ptr은 이 할당자가 같은 layout으로 준 것이다.
        unsafe { System.dealloc(ptr, layout) }
    }
}

#[global_allocator]
static GLOBAL: Counting = Counting;

/// f를 돌리는 동안 (받은 횟수, 돌려준 횟수)를 잰다. f 안에서는 출력하지 않는다.
fn count<F: FnOnce()>(f: F) -> (usize, usize) {
    let a0 = ALLOCS.load(Ordering::SeqCst);
    let f0 = FREES.load(Ordering::SeqCst);
    f();
    (
        ALLOCS.load(Ordering::SeqCst) - a0,
        FREES.load(Ordering::SeqCst) - f0,
    )
}

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

fn compile_errors(code: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::SeqCst);
    let dir = std::env::temp_dir().join(format!("vr06_{}_{n}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = Command::new("rustc")
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
        .expect("rustc 실행");
    let _ = std::fs::remove_dir_all(&dir);
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn expect_error(code: &str, err: &str, phrase: &str) {
    let stderr = compile_errors(code);
    assert!(
        stderr.contains(&format!("error[{err}]")),
        "{err} 기대, 실제:\n{stderr}"
    );
    assert!(stderr.contains(phrase), "'{phrase}' 기대, 실제:\n{stderr}");
    println!("{err} 확인: {phrase}");
}

fn compile_checks() {
    // 이중 해제: drop(b) 두 번
    expect_error(
        r#"pub fn f(){ let b=Box::new(5); drop(b); drop(b); }"#,
        "E0382",
        "use of moved value: `b`",
    );
    // 해제 뒤 사용: 주인을 버린 뒤 그 값을 읽기
    expect_error(
        r#"pub fn f()->i32{ let b=Box::new(5); drop(b); *b }"#,
        "E0382",
        "use of moved value: `b`",
    );
    // 해제 뒤 사용: 참조가 살아 있는데 주인을 버리기
    expect_error(
        r#"pub fn f()->i32{ let b=Box::new(5); let r=&*b; drop(b); *r }"#,
        "E0505",
        "cannot move out of `b` because it is borrowed",
    );
    // 함수 안 변수의 주소를 돌려주기
    expect_error(
        r#"pub fn f<'a>(_x:&'a i32)->&'a i32{ let y=5; &y }"#,
        "E0515",
        "cannot return reference to local variable `y`",
    );
    // realloc 뒤 옛 주소: Vec가 커지는 동안 앞 칸의 참조를 들고 있기
    expect_error(
        r#"pub fn f(){ let mut v=vec![10,20,30,40]; let q=&v[0]; v.push(50); println!("{q}"); }"#,
        "E0502",
        "cannot borrow `v` as mutable because it is also borrowed as immutable",
    );
}

struct Node {
    _other: RefCell<Option<Rc<Node>>>,
    _payload: Vec<u8>,
}

fn alloc_checks() {
    // Box 하나: 받기 1, 돌려주기 1
    let (a, f) = count(|| {
        let b = Box::new(41);
        assert_eq!(*b, 41);
    });
    assert_eq!((a, f), (1, 1));

    // 함수 안에서 만든 Vec를 함수 밖으로 옮겨도 받기와 돌려주기는 한 번씩
    fn make(n: usize) -> Vec<f64> {
        vec![0.0; n]
    }
    let (a, f) = count(|| {
        let nums = make(8);
        assert_eq!(nums.len(), 8);
    });
    assert_eq!((a, f), (1, 1));

    // C 문서의 problem(100)을 세 번: Rust에서는 함수가 끝날 때 돌려준다
    fn problem(n: usize) {
        let mut nums = vec![0.0f32; n];
        nums[0] = 1.0;
        assert_eq!(nums[0], 1.0);
    }
    let (a, f) = count(|| {
        for _ in 0..3 {
            problem(100);
        }
    });
    assert_eq!((a, f), (3, 3));

    // 새 값을 대입하면 옛 버퍼는 그 자리에서 돌려준다
    let (a, f) = count(|| {
        let mut s = String::from("hello");
        assert_eq!(s.len(), 5);
        s = String::from("ahoy");
        assert_eq!(s.len(), 4);
    });
    assert_eq!((a, f), (2, 2));

    // Rc 순환: 안전한 코드인데 샌다
    let (a, f) = count(|| {
        let x = Rc::new(Node {
            _other: RefCell::new(None),
            _payload: vec![1, 2, 3],
        });
        let y = Rc::new(Node {
            _other: RefCell::new(Some(Rc::clone(&x))),
            _payload: vec![4, 5, 6],
        });
        *x._other.borrow_mut() = Some(Rc::clone(&y));
        assert_eq!((Rc::strong_count(&x), Rc::strong_count(&y)), (2, 2));
    });
    assert!(a == 4 && f == 0, "Rc 순환: 받기 {a}, 돌려주기 {f}");

    // mem::forget: 안전한 코드인데 샌다
    let (a, f) = count(|| {
        let v = vec![1u8; 64];
        std::mem::forget(v);
    });
    assert_eq!((a, f), (1, 0));

    // Box::leak: 일부러 새게 하고 &'static mut를 받는다
    let (a, f) = count(|| {
        let r: &'static mut i32 = Box::leak(Box::new(41));
        *r += 1;
        assert_eq!(*r, 42);
    });
    assert_eq!((a, f), (1, 0));
    // 실패를 값으로 받기
    let mut big: Vec<u8> = Vec::new();
    assert!(big.try_reserve(usize::MAX).is_err());
    println!("counts: box 1/1, problem x3 3/3, reassign 2/2, rc cycle 4/0, forget 1/0, leak 1/0");
}

fn main() {
    compile_checks();
    alloc_checks();
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
