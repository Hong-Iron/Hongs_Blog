---
layout: "note"
title: "30_unsafe-abstractions_impl.rs"
display_title: "30_unsafe-abstractions_impl.rs"
kind: "code"
kind_label: "코드 · 구현"
num: "30"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/unsafe-abstractions/"
parent_title: "unsafe와 안전한 감싸기"
description: "Rust · unsafe와 안전한 감싸기 구현 코드"
sitemap: false
permalink: "/studies/rust/code/30_unsafe-abstractions_impl/"
---
{% raw %}
[unsafe와 안전한 감싸기](/Hongs_Blog/studies/rust/unsafe-abstractions/) 문서의 구현 코드다.

```rust
//! unsafe를 안전한 함수로 감싸는 예: 슬라이스를 겹치지 않는 두 &mut로 나누는 split_at_mut,
//! 경계 검사를 미리 해 두고 검사 없이 읽는 sum_pairs. 모든 unsafe 블록에 // SAFETY: 주석을 달고
//! clippy::undocumented_unsafe_blocks와 unsafe_op_in_unsafe_fn을 deny로 켠다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/30_unsafe-abstractions_impl.rs"

#![deny(clippy::undocumented_unsafe_blocks)]
#![deny(unsafe_op_in_unsafe_fn)]

use std::slice;

/// `values`를 `[0, mid)`와 `[mid, len)` 두 조각으로 나눠 둘 다 고칠 수 있게 돌려준다.
///
/// # Panics
/// `mid > values.len()`이면 panic한다.
pub fn split_at_mut<T>(values: &mut [T], mid: usize) -> (&mut [T], &mut [T]) {
    let len = values.len();
    // 불변식의 핵심: 이 검사가 아래 두 포인터 계산을 모두 범위 안에 묶는다.
    assert!(mid <= len, "mid {mid} > len {len}");
    let ptr = values.as_mut_ptr();
    // SAFETY:
    // - ptr은 `values`에서 왔으므로 len개의 T에 대해 유효하고 정렬되어 있다.
    // - mid <= len을 위에서 확인했으므로 ptr.add(mid)는 같은 할당 안(끝 포함)에 있다.
    // - 두 조각 [0, mid)와 [mid, len)은 겹치지 않으므로 두 &mut가 같은 원소를 가리키지 않는다.
    // - 반환 수명은 `values`의 빌림에 묶이므로, 조각이 살아 있는 동안 원본을 다른 곳에서 쓸 수 없다.
    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

/// 인덱스 검사 없이 읽는다. 부르는 쪽이 조건을 지켜야 한다.
///
/// # Safety
/// `i < v.len()`이어야 한다.
pub unsafe fn get_unchecked_copy(v: &[u32], i: usize) -> u32 {
    // SAFETY: 이 함수의 안전 조건(i < v.len())을 부르는 쪽이 지킨다고 약속했다.
    unsafe { *v.get_unchecked(i) }
}

/// 짝을 이룬 원소의 합. 겉보기는 안전한 함수다: 경계는 한 번만 확인하고 안쪽에서는 검사하지 않는다.
pub fn sum_pairs(a: &[u32], b: &[u32]) -> Vec<u32> {
    let n = a.len().min(b.len());
    (0..n)
        .map(|i| {
            // SAFETY: i < n <= a.len()이고 i < n <= b.len()이다.
            unsafe { get_unchecked_copy(a, i) + get_unchecked_copy(b, i) }
        })
        .collect()
}

fn main() {
    let mut v = [1, 2, 3, 4, 5, 6];
    let (left, right) = split_at_mut(&mut v, 2);
    left[0] = 10;
    right[0] = 30;
    right[3] = 60;
    assert_eq!(left.len() + right.len(), 6);
    assert_eq!(v, [10, 2, 30, 4, 5, 60]);
    println!("split_at_mut(2): {v:?}");

    // 경계 사례: mid = 0, mid = len
    let mut w = [7u8; 3];
    let (a, b) = split_at_mut(&mut w, 0);
    assert_eq!((a.len(), b.len()), (0, 3));
    let (a, b) = split_at_mut(&mut w, 3);
    assert_eq!((a.len(), b.len()), (3, 0));

    // 표준 라이브러리 버전과 같은 결과
    for mid in 0..=6 {
        let mut x: Vec<i32> = (0..6).collect();
        let mut y = x.clone();
        {
            let (p, q) = split_at_mut(&mut x, mid);
            p.iter_mut().for_each(|e| *e *= 2);
            q.iter_mut().for_each(|e| *e += 100);
        }
        {
            let (p, q) = y.split_at_mut(mid);
            p.iter_mut().for_each(|e| *e *= 2);
            q.iter_mut().for_each(|e| *e += 100);
        }
        assert_eq!(x, y, "mid = {mid}");
    }

    // mid > len이면 unsafe에 닿기 전에 panic
    std::panic::set_hook(Box::new(|_| {}));
    let r = std::panic::catch_unwind(|| {
        let mut z = [0; 2];
        let _ = split_at_mut(&mut z, 3);
    });
    let _ = std::panic::take_hook();
    assert!(r.is_err());
    println!("mid > len: unsafe 블록 전에 panic");

    assert_eq!(sum_pairs(&[1, 2, 3], &[10, 20]), vec![11, 22]);
    assert_eq!(sum_pairs(&[], &[1]), Vec::<u32>::new());

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn halves_are_independent() {
        let mut v = vec![0u64; 10];
        let (a, b) = split_at_mut(&mut v, 4);
        a.fill(1);
        b.fill(2);
        assert_eq!(v.iter().filter(|&&x| x == 1).count(), 4);
        assert_eq!(v.iter().filter(|&&x| x == 2).count(), 6);
    }

    #[test]
    #[should_panic(expected = "mid 5 > len 4")]
    fn mid_past_end_panics() {
        let mut v = [0; 4];
        let _ = split_at_mut(&mut v, 5);
    }

    #[test]
    fn works_with_non_copy_types() {
        let mut v = vec![String::from("a"), String::from("b")];
        let (a, b) = split_at_mut(&mut v, 1);
        std::mem::swap(&mut a[0], &mut b[0]);
        assert_eq!(v, ["b", "a"]);
    }
}
```
{% endraw %}
