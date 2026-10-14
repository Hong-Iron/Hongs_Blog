---
layout: "note"
title: "47_performance-measurement_bench.rs"
display_title: "47_performance-measurement_bench.rs"
kind: "code"
kind_label: "코드 · 실험"
num: "47"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/performance-measurement/"
parent_title: "성능 측정과 최적화"
description: "Rust · 성능 측정과 최적화 실험 코드"
sitemap: false
permalink: "/studies/rust/code/47_performance-measurement_bench/"
---
{% raw %}
[성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/) 문서의 실험 코드다.

```rust
//! 측정 먼저: 할당 횟수(결정적)와 걸린 시간(이 기계 기준)을 잰다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/47_performance-measurement_bench.rs"
//!
//! rs_check는 디버그 빌드로 실행한다. 최적화한 빌드의 숫자가 필요하면 아래 `release_vs_debug`처럼
//! 같은 코드를 rustc로 `-C opt-level=3`(= -O 이상)과 `-C opt-level=0`으로 따로 컴파일해 돌린다.
//! 시간 숫자는 이 기계(aarch64-apple-darwin)에서 잰 한 번의 값이다. 다른 기계에서는 다르다.

use std::alloc::{GlobalAlloc, Layout, System};
use std::fmt::Write as _;
use std::hint::black_box;
use std::process::Command;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::{Duration, Instant};

/// 할당 횟수를 세는 전역 할당자. 시간과 달리 몇 번을 돌려도 같은 값이 나온다.
struct Counting;

static ALLOCS: AtomicUsize = AtomicUsize::new(0);

// SAFETY: 실제 일은 System에 그대로 맡기고 횟수만 센다.
unsafe impl GlobalAlloc for Counting {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        ALLOCS.fetch_add(1, Ordering::Relaxed);
        // SAFETY: 호출자가 지킨 Layout 계약을 그대로 넘긴다.
        unsafe { System.alloc(layout) }
    }
    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        // SAFETY: ptr은 위 alloc(=System.alloc)이 준 것이다.
        unsafe { System.dealloc(ptr, layout) }
    }
    unsafe fn realloc(&self, ptr: *mut u8, layout: Layout, new_size: usize) -> *mut u8 {
        ALLOCS.fetch_add(1, Ordering::Relaxed);
        // SAFETY: ptr과 layout은 이전 alloc의 것이다.
        unsafe { System.realloc(ptr, layout, new_size) }
    }
}

#[global_allocator]
static GLOBAL: Counting = Counting;

fn count_allocs<R>(f: impl FnOnce() -> R) -> (R, usize) {
    let before = ALLOCS.load(Ordering::Relaxed);
    let r = f();
    (r, ALLOCS.load(Ordering::Relaxed) - before)
}

fn push_n(n: u64) -> Vec<u64> {
    let mut v = Vec::new();
    for i in 0..n {
        v.push(i);
    }
    v
}

fn push_n_reserved(n: u64) -> Vec<u64> {
    let mut v = Vec::with_capacity(n as usize);
    for i in 0..n {
        v.push(i);
    }
    v
}

/// 줄마다 format!으로 새 String을 만든다.
fn render_alloc_each(items: &[(u32, &str)]) -> usize {
    let mut total = 0;
    for (id, name) in items {
        let line = format!("{id}:{name}\n");
        total += line.len();
    }
    total
}

/// 버퍼 하나를 바깥에 두고 clear로 다시 쓴다.
fn render_reuse(items: &[(u32, &str)]) -> usize {
    let mut total = 0;
    let mut line = String::with_capacity(64);
    for (id, name) in items {
        line.clear();
        writeln!(line, "{id}:{name}").unwrap();
        total += line.len();
    }
    total
}

fn capacities(n: usize) -> Vec<usize> {
    let mut v: Vec<u64> = Vec::new();
    let mut caps = vec![v.capacity()];
    for i in 0..n {
        v.push(i as u64);
        if *caps.last().unwrap() != v.capacity() {
            caps.push(v.capacity());
        }
    }
    caps
}

/// 가장 짧은 시간을 고른다. 다른 일이 끼어든 회차는 길어지기만 하므로 최솟값이 잡음이 적다.
fn best_of(runs: usize, mut f: impl FnMut()) -> Duration {
    (0..runs)
        .map(|_| {
            let t = Instant::now();
            f();
            t.elapsed()
        })
        .min()
        .unwrap()
}

const SUM_PROGRAM: &str = r#"
use std::hint::black_box;
fn main() {
    let n: u64 = black_box(30_000_000);
    let mut acc: u64 = 0;
    for i in 0..n {
        acc = acc.wrapping_add(black_box(i) ^ (i >> 3));
    }
    println!("{acc}");
}
"#;

fn build_and_time(opt: &str, dir: &std::path::Path) -> (String, Duration) {
    let src = dir.join("sum.rs");
    std::fs::write(&src, SUM_PROGRAM).unwrap();
    let exe = dir.join(format!("sum_o{opt}"));
    let st = Command::new("rustc")
        .args(["--edition", "2024", "-C"])
        .arg(format!("opt-level={opt}"))
        .arg("-o")
        .arg(&exe)
        .arg(&src)
        .status()
        .expect("rustc 실행");
    assert!(st.success());
    let mut out = String::new();
    let d = best_of(3, || {
        let o = Command::new(&exe).output().unwrap();
        out = String::from_utf8(o.stdout).unwrap();
    });
    (out, d)
}

fn release_vs_debug() -> (Duration, Duration) {
    let dir = std::env::temp_dir().join(format!("vr47_{}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let (out0, d0) = build_and_time("0", &dir);
    let (out3, d3) = build_and_time("3", &dir);
    assert_eq!(out0, out3, "최적화해도 결과는 같다");
    let _ = std::fs::remove_dir_all(&dir);
    (d0, d3)
}

fn main() {
    // 1) Vec이 자라는 모양
    let caps = capacities(100);
    println!("Vec<u64> 용량 변화: {caps:?}");
    assert_eq!(caps, vec![0, 4, 8, 16, 32, 64, 128]);

    // 2) 할당 횟수: with_capacity
    let (v1, a1) = count_allocs(|| push_n(1000));
    let (v2, a2) = count_allocs(|| push_n_reserved(1000));
    assert_eq!(v1, v2);
    println!("push 1000번: Vec::new {a1}번 할당, with_capacity {a2}번 할당");
    assert_eq!(a2, 1);
    assert!(a1 >= 9, "4→8→…→1024로 커지며 여러 번 다시 잡는다");

    // 3) 할당 횟수: 버퍼 다시 쓰기
    let items: Vec<(u32, &str)> = (0..1000).map(|i| (i, "item")).collect();
    let (t1, b1) = count_allocs(|| render_alloc_each(black_box(&items)));
    let (t2, b2) = count_allocs(|| render_reuse(black_box(&items)));
    assert_eq!(t1, t2);
    println!("1000줄 만들기: format! {b1}번 할당, 버퍼 재사용 {b2}번 할당");
    assert!(b1 >= 1000, "줄마다 적어도 한 번, 길어지면 realloc까지");
    assert_eq!(b2, 1);

    // 4) 시간: 디버그 빌드에서 잰 값(참고용)
    let d_new = best_of(20, || {
        black_box(push_n(black_box(100_000)));
    });
    let d_cap = best_of(20, || {
        black_box(push_n_reserved(black_box(100_000)));
    });
    println!("디버그 빌드, push 100,000번 최솟값: Vec::new {d_new:?}, with_capacity {d_cap:?}");

    // 5) 같은 프로그램을 opt-level 0과 3으로
    let (d0, d3) = release_vs_debug();
    let ratio = d0.as_secs_f64() / d3.as_secs_f64();
    println!("합 계산 3천만 번: opt-level=0 {d0:?}, opt-level=3 {d3:?}, {ratio:.1}배");
    assert!(ratio > 1.5, "최적화 빌드가 확실히 빠르다");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn same_output_either_way() {
        let items = [(1, "a"), (22, "bb")];
        assert_eq!(render_alloc_each(&items), render_reuse(&items));
        assert_eq!(render_reuse(&items), "1:a\n".len() + "22:bb\n".len());
    }
}
```
{% endraw %}
