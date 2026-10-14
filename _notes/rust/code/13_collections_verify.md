---
layout: "note"
title: "13_collections_verify.rs"
display_title: "13_collections_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/collections/"
parent_title: "컬렉션"
description: "Rust · 컬렉션 검증 코드"
permalink: "/studies/rust/code/13_collections_verify/"
---
{% raw %}
[컬렉션](/Hongs_Blog/studies/rust/collections/) 문서의 검증 코드다.

```rust
//! 컬렉션 문서의 주장을 확인한다: Vec 용량이 늘어나는 모습(관찰값)과 with_capacity, 원소 참조를
//! 쥔 채 push하면 E0502, 인덱스와 get의 차이, HashMap entry로 단어 세기, HashMap 순회 순서가
//! 맵마다 다를 수 있음, BTreeMap 정렬 순회와 range, HashSet insert의 반환값, VecDeque 큐, clippy map_entry.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/13_collections_verify.rs"

use std::collections::{BTreeMap, HashMap, HashSet, VecDeque};

fn compile_with(code: &str, tool: &str, tag: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr13_{}_{}", std::process::id(), tag));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new(tool)
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
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn word_count(text: &str) -> HashMap<&str, usize> {
    let mut map = HashMap::new();
    for word in text.split_whitespace() {
        *map.entry(word).or_insert(0) += 1;
    }
    map
}

fn main() {
    // 1. Vec 용량: 늘어나는 모습은 보장이 아니라 관찰값
    let mut v: Vec<u64> = Vec::new();
    let mut caps = vec![v.capacity()];
    let mut reallocs = 0;
    for i in 0..1000u64 {
        let before = v.capacity();
        v.push(i);
        if v.capacity() != before {
            reallocs += 1;
            caps.push(v.capacity());
        }
    }
    println!("Vec<u64> 1000번 push: 용량 변화 {caps:?}, 다시 잡은 횟수 {reallocs}");
    assert_eq!(caps, vec![0, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);

    // with_capacity: 그만큼은 다시 잡지 않는다
    let mut w: Vec<u64> = Vec::with_capacity(10);
    assert!(w.capacity() >= 10);
    let c0 = w.capacity();
    for i in 0..10 {
        w.push(i);
    }
    assert_eq!(w.capacity(), c0);
    w.push(10);
    assert!(w.capacity() > c0);
    println!(
        "with_capacity(10): 처음 {c0}, 11번째 push 뒤 {}",
        w.capacity()
    );
    let mut z: Vec<u64> = Vec::with_capacity(1000);
    let zc = z.capacity();
    for i in 0..1000 {
        z.push(i);
    }
    assert_eq!(z.capacity(), zc);

    // 원소 참조를 쥔 채 push: E0502
    let e = compile_with(
        "pub fn f() -> i32 { let mut v = vec![1, 2, 3]; let first = &v[0]; v.push(4); *first }",
        "rustc",
        "e0502",
    );
    assert!(e.contains("E0502"), "{e}");
    println!("참조를 쥔 채 push: E0502");

    // 2. 인덱스는 패닉, get은 None
    let small = [1, 2, 3, 4, 5];
    assert_eq!(small.get(100), None);
    assert_eq!(small.get(2), Some(&3));
    std::panic::set_hook(Box::new(|_| {}));
    let idx = std::hint::black_box(100usize);
    let p = std::panic::catch_unwind(|| small[idx]);
    let _ = std::panic::take_hook();
    assert!(p.is_err());

    // 3. HashMap entry로 단어 세기
    let counts = word_count("hello world wonderful world");
    assert_eq!(counts["world"], 2);
    assert_eq!(counts["hello"], 1);
    assert_eq!(counts.get("rust"), None);
    // String 키 맵을 &str로 찾는다
    let owned: HashMap<String, u32> = HashMap::from([("ann".to_string(), 1)]);
    assert_eq!(owned.get("ann"), Some(&1));

    // 4. HashMap 순회 순서는 정해지지 않았다: 맵마다 씨앗이 달라 순서가 달라진다(관찰)
    let mut orders = HashSet::new();
    for _ in 0..20 {
        let m: HashMap<u32, ()> = (0..50).map(|k| (k, ())).collect();
        let order: Vec<u32> = m.keys().copied().collect();
        orders.insert(order);
    }
    println!(
        "같은 키 50개를 넣은 HashMap 20개의 서로 다른 순회 순서: {}",
        orders.len()
    );
    assert!(orders.len() > 1);

    // 5. BTreeMap: 키 순서로 순회, range, 가장 작은 키
    let mut scores = BTreeMap::new();
    for (name, s) in [("kim", 70), ("lee", 95), ("ahn", 88), ("park", 60)] {
        scores.insert(name, s);
    }
    let names: Vec<&str> = scores.keys().copied().collect();
    assert_eq!(names, vec!["ahn", "kim", "lee", "park"]);
    let mid: Vec<&str> = scores.range("b".."m").map(|(k, _)| *k).collect();
    assert_eq!(mid, vec!["kim", "lee"]);
    assert_eq!(scores.first_key_value(), Some((&"ahn", &88)));

    // 6. HashSet insert는 새로 넣었는지를 돌려준다
    let mut seen = HashSet::new();
    assert!(seen.insert("a@x.com"));
    assert!(!seen.insert("a@x.com"));
    assert_eq!(seen.len(), 1);

    // 7. VecDeque를 큐로
    let mut q = VecDeque::new();
    q.push_back(1);
    q.push_back(2);
    q.push_front(0);
    assert_eq!(q.pop_front(), Some(0));
    assert_eq!(q.pop_front(), Some(1));
    assert_eq!(q.len(), 1);

    // 8. 확인 문제 C3 실행 추적
    let mut stock: BTreeMap<&str, u32> = BTreeMap::new();
    for item in ["pen", "cup", "pen", "bag", "pen", "cup"] {
        *stock.entry(item).or_insert(0) += 1;
    }
    stock.entry("bag").and_modify(|n| *n += 10).or_insert(100);
    stock.entry("box").and_modify(|n| *n += 10).or_insert(100);
    let line: Vec<String> = stock.iter().map(|(k, v)| format!("{k}={v}")).collect();
    println!("C3: {}", line.join(" "));
    assert_eq!(line.join(" "), "bag=11 box=100 cup=2 pen=3");

    // 9. clippy: contains_key 뒤 insert는 map_entry (기본 켜짐)
    let e = compile_with(
        "use std::collections::HashMap;\npub fn f(m: &mut HashMap<u32, u32>, k: u32) { if !m.contains_key(&k) { m.insert(k, 1); } }",
        "clippy-driver",
        "mapentry",
    );
    assert!(e.contains("clippy::map_entry"), "{e}");
    println!("clippy::map_entry 기본으로 경고");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
