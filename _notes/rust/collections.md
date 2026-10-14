---
layout: "note"
title: "컬렉션"
display_title: "컬렉션 (Collections)"
kind: "concept"
kind_label: "자료구조"
num: "13"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Collections", "Vec", "벡터", "HashMap", "BTreeMap", "HashSet", "VecDeque", "용량", "Capacity", "with_capacity", "entry API", "SipHash", "HashDoS", "분할상환", "Amortized"]
description: "값을 여러 개 담는 그릇이다. 줄 세워 담는 Vec, 이름표로 찾는 HashMap, 이름표를 가나다순으로 늘어놓는 BTreeMap, 양쪽 끝에서 넣고 빼는 VecDeque가 대표다. 대부분은 Vec과 HashMap으로 충분하다. 다만 HashMap은 꺼내는 순서가 정해져 있지 않아…"
prev_url: "/studies/rust/option-result/"
prev_title: "Option과 Result"
next_url: "/studies/rust/type-driven-design/"
next_title: "타입으로 잘못된 상태 막기"
math: true
mermaid: false
code_count: 1
permalink: "/studies/rust/collections/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

값을 여러 개 담는 그릇이다. 줄 세워 담는 `Vec`, 이름표로 찾는 `HashMap`, 이름표를 가나다순으로 늘어놓는 `BTreeMap`, 양쪽 끝에서 넣고 빼는 `VecDeque`가 대표다. 대부분은 `Vec`과 `HashMap`으로 충분하다. 다만 `HashMap`은 꺼내는 순서가 정해져 있지 않아서, 순서가 결과에 드러나면 `BTreeMap`을 쓰거나 따로 정렬해야 한다.

</div>


## 예시로 보기

파이썬에서는 리스트와 딕셔너리 둘로 거의 모든 일을 한다([딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)). Rust도 출발점은 같다. 하나 다른 점은 그릇이 원소를 소유한다는 것이다. `String`을 맵에 넣으면 맵으로 옮겨 가고, 넣은 쪽 변수는 더 못 쓴다[^1].

std 문서는 고르는 기준을 이렇게 준다[^2].

| 하고 싶은 일 | 그릇 |
|---|---|
| 모아 뒀다 나중에 처리, 끝에만 추가, 스택, 크기가 변하는 배열 | `Vec` |
| 양 끝에서 넣고 빼기, 큐 | `VecDeque` |
| 키로 값 찾기, 캐시 | `HashMap` |
| 키 순서로 늘어놓기, 범위로 찾기, 가장 작은·큰 키 | `BTreeMap` |
| 중복 없는 모음 | `HashSet` / `BTreeSet` |

`LinkedList`도 있지만, std 문서는 "정말로 이중 연결 리스트가 필요하다고 확신할 때"만 쓰라고 한다[^2].

## Vec: 늘어나는 배열

`Vec`은 [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/)를 그대로 구현한 것이다. 원소 개수(길이)와 별개로 미리 잡아 둔 칸 수(용량, capacity)가 있다. 길이가 용량을 넘으면 더 큰 자리를 잡고 원소를 옮긴다[^3].

```
v: Vec<u64>  (스택에 세 칸)          힙
┌──────────┐
│ ptr ─────┼──────────────▶ [ 0 | 1 | 2 | 3 | 4 | _ | _ | _ ]
│ len  5   │                 ← 길이 5 →
│ cap  8   │                 ←──────── 용량 8 ────────→
└──────────┘
```

이 기계에서 빈 `Vec<u64>`에 1,000번 `push`하면 용량은 0 → 4 → 8 → 16 → … → 1024로 아홉 번 바뀐다. 이 수열은 관찰한 것일 뿐이다. std는 어떤 비율로 늘린다고 약속하지 않는다. 약속하는 것은 `push`가 분할상환 $$O(1)$$이라는 것 하나다[^3]. 분할상환 $$O(1)$$은 "가끔 한 번은 원소 수만큼 오래 걸리지만, 처음부터 합쳐서 횟수로 나누면 한 번에 상수 시간"이라는 뜻이다.

몇 개를 넣을지 알면 `Vec::with_capacity(n)`으로 처음부터 그만큼 잡는다. std는 `with_capacity(n)`이 원소 정확히 n개 크기를 할당기에 요청한다고 보장하고, 용량이 남아 있으면 `push`가 다시 잡지 않는다고 보장한다[^3]. 1,000개를 넣을 걸 알고 `with_capacity(1000)`으로 만들면 다시 잡기가 0번이다.

### 원소를 빌린 채로 push하면

```rust
let mut v = vec![1, 2, 3];
let first = &v[0];
v.push(4);          // error[E0502]
println!("{first}");
```

"읽기만 하는데 왜 막지?" `push`가 용량을 넘기면 원소가 새 자리로 옮겨 가고 옛 자리는 돌려준다. 그러면 `first`는 돌려준 자리를 가리킨다[^4]. C에서 `realloc` 뒤 옛 포인터를 쓰는 실수([동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/))를 빌림 규칙이 컴파일 때 막는 것이다.

### 인덱스와 get

`v[100]`은 범위를 벗어나면 패닉한다. `v.get(100)`은 `None`을 돌려준다[^4]. 사용자 입력처럼 벗어나는 게 정상일 수 있는 번호에는 `get`을 쓴다.

## HashMap: 키로 찾기

### entry로 한 번에

"키가 없으면 넣고, 있으면 고친다"를 `contains_key` 다음 `insert`로 쓰면 해시를 두 번 계산한다. `entry`는 키 자리를 한 번 찾아 그 자리를 돌려준다. `or_insert`는 값이 없으면 넣고, 어느 쪽이든 값의 `&mut` 참조를 돌려준다[^1].

```rust
let mut map = HashMap::new();
for word in "hello world wonderful world".split_whitespace() {
    *map.entry(word).or_insert(0) += 1;
}
// map["world"] == 2
```

`contains_key` 뒤 `insert`를 쓰면 clippy의 `map_entry`(기본으로 켜짐)가 `entry`로 바꾸라고 경고한다[^5]. 있을 때 고칠 일과 없을 때 넣을 값이 다르면 `and_modify(…).or_insert(…)`를 잇는다.

### 해시 함수와 공격 막기

std의 `HashMap`은 기본으로 HashDoS 공격에 버티도록 고른 해시 함수를 쓴다. 지금은 SipHash 1-3이고, 맵마다 무작위 씨앗(seed)으로 시작한다[^6]. HashDoS는 공격자가 같은 칸으로 몰리는 키만 골라 보내서 찾기를 $$O(1)$$에서 $$O(n)$$으로 떨어뜨리는 공격이다([해시 테이블의 홈 버킷과 충돌](/Hongs_Blog/studies/data-structures/hash-table-terms/)). 씨앗을 모르면 공격자가 그런 키를 고를 수 없다.

대가는 속도다. std 문서는 정수 같은 작은 키나 긴 문자열 키에서는 다른 해시 함수가 더 빠르지만, 그런 함수는 보통 HashDoS를 막지 못한다고 적는다[^6]. 바깥 사용자의 입력을 키로 넣는 서버에서는 기본값을 그대로 쓴다. 해시 함수를 바꿀 때는 `with_hasher`로 맵마다 바꾼다. 씨앗을 손으로 고정하면 공격 통로가 열린다는 경고가 std 문서에 있다[^6].

### 순서는 약속하지 않는다

`keys()`, `values()`, `iter()`는 모두 "임의의 순서"로 돈다[^6]. 씨앗이 맵마다 달라서, 같은 키 50개를 넣은 `HashMap` 20개를 만들어 보면 20개가 모두 다른 순서로 돌았다. 파이썬 3.7부터의 딕셔너리처럼 넣은 순서를 지킨다고 기대하면 안 된다. 같은 프로그램을 두 번 돌려도 출력 순서가 바뀐다.

- 출력·테스트·JSON처럼 순서가 드러나면 `BTreeMap`을 쓰거나, 꺼낸 뒤 정렬한다.
- 현재 구현에서 순회는 원소 수가 아니라 용량에 비례하는 시간이 걸린다. 빈칸도 들르기 때문이다[^6].

### 무엇을 키로 쓸 수 있나

키 타입은 `Eq`와 `Hash`를 구현해야 한다. 직접 구현할 때는 `a == b`이면 `hash(a) == hash(b)`여야 한다. 이 약속을 어겨도 메모리 안전은 깨지지 않지만, 결과가 틀리거나 패닉하는 등 그 맵의 동작은 정해지지 않는다[^6]. `#[derive(PartialEq, Eq, Hash)]`로 만들면 이 약속이 지켜진다.

## BTreeMap, HashSet, VecDeque

**`BTreeMap`**은 키 순서로 정렬된 맵이다. 순회가 늘 키 순서이고, `range(a..b)`로 구간만 꺼내고, `first_key_value()`로 가장 작은 키를 꺼낸다[^7]. 이진 탐색 트리([트리 순회와 이진 탐색 트리](/Hongs_Blog/studies/algorithms/tree-traversal-bst/))를 쓰지 않고 B-트리를 쓴다. 이진 탐색 트리는 원소마다 노드를 따로 할당해서, 넣을 때마다 할당이 생기고 비교할 때마다 캐시를 놓칠 수 있다. B-트리는 노드 하나에 원소 여러 개를 배열로 붙여 담아 할당 횟수를 줄이고 캐시를 잘 쓴다[^7].

**`HashSet<T>`**은 값이 `()`인 `HashMap<T, ()>`이다[^8]. `insert`는 새로 넣었으면 `true`, 이미 있었으면 `false`를 돌려준다. "처음 보는 이메일인가"를 한 줄로 검사할 수 있다.

**`VecDeque`**는 늘어나는 원형 버퍼로 만든 양방향 큐다([원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/)). 큐로 쓸 때는 `push_back`으로 넣고 `pop_front`로 꺼낸다[^9]. `Vec`의 맨 앞 원소를 `remove(0)`으로 빼면 나머지를 한 칸씩 당기느라 $$O(n)$$이다. 앞에서 자주 뺄 거면 `VecDeque`를 쓴다.

## 연산 비용

std 문서의 표를 옮긴다. $$n$$은 원소 수, $$i$$는 번호다. `*`는 분할상환 비용, `~`는 기대 비용(운이 아주 나쁘면 더 걸릴 수 있다)이다[^2].

| 그릇 | 번호로 읽기 | 넣기 | 빼기 | 범위 |
|---|---|---|---|---|
| `Vec` | $$O(1)$$ | $$O(n-i)$$\* | $$O(n-i)$$ | 없음 |
| `VecDeque` | $$O(1)$$ | $$O(\min(i, n-i))$$\* | $$O(\min(i, n-i))$$ | 없음 |
| `HashMap` | $$O(1)$$~ | $$O(1)$$~\* | $$O(1)$$~ | 없음 |
| `BTreeMap` | $$O(\log n)$$ | $$O(\log n)$$ | $$O(\log n)$$ | $$O(\log n)$$ |

`Vec`의 넣기 $$O(n-i)$$는 끝에 넣으면($$i = n$$) $$O(1)$$이라는 뜻이다. 비용이 같으면 `Vec`이 `VecDeque`보다, `VecDeque`가 `LinkedList`보다 보통 빠르다[^2]. 컬렉션은 저절로 줄어들지 않는다. 많이 넣었다 지운 뒤 메모리를 돌려주고 싶으면 `shrink_to_fit`을 부른다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 용량 수열(이 기계, rustc 1.99.0), `with_capacity` 뒤 다시 잡지 않음, E0502, `get`과 인덱스, 단어 세기, `HashMap` 20개의 순서가 서로 다름, `BTreeMap` 순서와 `range`, `HashSet::insert`, `VecDeque`, clippy `map_entry`를 실행해 확인했다 — [13_collections_verify.rs](/Hongs_Blog/studies/rust/code/13_collections_verify/)</div>

</div>


## 활용

- **요청 처리의 임시 버퍼.** 응답에 담을 행 수를 알면 `Vec::with_capacity(rows.len())`로 만든다. 반복자에서 바로 모을 때는 `collect()`를 쓴다: [반복자](/Hongs_Blog/studies/rust/iterators/)
- **메모리 안 캐시.** `HashMap<Key, Value>`를 여러 스레드가 함께 쓰려면 `Mutex`나 `RwLock`으로 감싼다: [Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/)
- **작업 큐.** 한 스레드 안의 대기열은 `VecDeque`로 충분하다. 스레드나 태스크 사이의 큐는 채널을 쓴다: [채널](/Hongs_Blog/studies/rust/channels/)
- **흔한 실수.**
  - `HashMap`을 순회해 만든 문자열을 테스트에서 고정 문자열과 비교한다. 돌릴 때마다 순서가 바뀌어 가끔 실패하는 테스트가 된다.
  - `Vec`의 앞에서 계속 `remove(0)`을 한다. 원소가 많으면 느리다. `VecDeque`를 쓴다.
  - 맵에 키를 넣을 때 매번 `key.clone()`을 한다. 찾기만 할 때는 `map.get(&key)`로 빌려서 찾으면 된다. `String` 키 맵은 `&str`로 찾을 수 있다.

## 연결

- 선수: [슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/)(`&v[..]`는 `Vec`의 슬라이스다), [Option과 Result](/Hongs_Blog/studies/rust/option-result/)(`get`, `pop`이 `Option`을 돌려준다)
- 자료구조 과목의 구현과 비교: [배열 두 배 늘리기](/Hongs_Blog/studies/data-structures/array-doubling/), [해시 테이블의 홈 버킷과 충돌](/Hongs_Blog/studies/data-structures/hash-table-terms/), [원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/)
- 파이썬과 비교: [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/), [큐와 덱](/Hongs_Blog/studies/algorithms/queue-deque/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `let first = &v[0]; v.push(4); println!("{first}");`는 E0502로 컴파일되지 않는다. `push`는 끝에 붙이기만 하는데 왜 0번 원소를 읽는 참조가 문제인가?</summary>

**답:** `push`가 용량을 넘기면 원소 전체를 새 자리로 옮기고 옛 자리를 돌려준다. 그러면 `first`는 돌려준 자리를 가리킨다. 컴파일러는 용량이 남았는지 실행 전에 모르므로, 빌림이 살아 있는 동안 `&mut v`가 필요한 `push`를 막는다.<br>
**흔한 오답:** "같은 값을 두 곳에서 쓰면 안 돼서." 문제는 데이터가 옮겨 갈 수 있다는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음에 `HashMap`, `BTreeMap`, `VecDeque`, `Vec` 중 무엇을 쓰는가? (가) 순위표를 점수가 아니라 이름 가나다순으로 매번 출력한다. (나) 들어온 순서대로 처리할 작업 대기열. (다) 세션 ID로 세션 정보를 찾는 서버의 캐시. (라) 로그 줄을 모아 두었다가 한 번에 파일에 쓴다.</summary>

**답:** (가) `BTreeMap` (나) `VecDeque` (다) `HashMap` (라) `Vec`<br>
**이유:** (가)는 키 순서 순회가 필요하다. `HashMap`은 순서를 약속하지 않는다. (나)는 뒤에 넣고 앞에서 빼야 한다. `Vec`의 앞에서 빼기는 $$O(n)$$이다. (다)는 순서가 필요 없고 바깥 입력이 키이므로 HashDoS에 버티는 기본 `HashMap`이 맞다. (라)는 끝에 붙이기만 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 코드는 무엇을 찍는가?</summary>

```rust
let mut stock: BTreeMap<&str, u32> = BTreeMap::new();
for item in ["pen", "cup", "pen", "bag", "pen", "cup"] {
    *stock.entry(item).or_insert(0) += 1;
}
stock.entry("bag").and_modify(|n| *n += 10).or_insert(100);
stock.entry("box").and_modify(|n| *n += 10).or_insert(100);
let line: Vec<String> = stock.iter().map(|(k, v)| format!("{k}={v}")).collect();
println!("{}", line.join(" "));
```
**답:** `bag=11 box=100 cup=2 pen=3`<br>
**이유:** 반복문 뒤 개수는 pen 3, cup 2, bag 1이다. `bag`은 있으므로 `and_modify`가 10을 더해 11이 된다. `box`는 없으므로 `or_insert`가 100을 넣는다. `BTreeMap`은 키 순서로 돈다.

</details>


[^1]: The Rust Programming Language, 8.3 Storing Keys with Associated Values in Hash Maps(Hash Maps and Ownership, Adding a Key and Value Only If a Key Isn't Present, Updating a Value Based on the Old Value) — https://doc.rust-lang.org/book/ch08-03-hash-maps.html
[^2]: std 문서, Module `std::collections`(When Should You Use Which Collection?, Performance, Capacity Management) — https://doc.rust-lang.org/std/collections/index.html
[^3]: std 문서, Struct `std::vec::Vec`(Capacity and reallocation, Guarantees, `push`의 Time complexity) — https://doc.rust-lang.org/std/vec/struct.Vec.html
[^4]: The Rust Programming Language, 8.1 Storing Lists of Values with Vectors — https://doc.rust-lang.org/book/ch08-01-vectors.html
[^5]: Clippy Lints, `map_entry` — https://rust-lang.github.io/rust-clippy/master/index.html (rustc 1.99.0의 `clippy-driver`로 기본으로 경고하는 것을 확인했다)
[^6]: std 문서, Struct `std::collections::HashMap`(설명 본문, `keys`·`iter`의 순서와 시간, `with_hasher`의 경고) — https://doc.rust-lang.org/std/collections/struct.HashMap.html
[^7]: std 문서, Struct `std::collections::BTreeMap`(설명 본문과 `range`, `first_key_value`) — https://doc.rust-lang.org/std/collections/struct.BTreeMap.html
[^8]: std 문서, Struct `std::collections::HashSet` — https://doc.rust-lang.org/std/collections/struct.HashSet.html
[^9]: std 문서, Struct `std::collections::VecDeque` — https://doc.rust-lang.org/std/collections/struct.VecDeque.html
{% endraw %}
