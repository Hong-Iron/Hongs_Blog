---
title: cft — Cheaper Foreign Tokens
subtitle: Translate a Korean prompt locally before it reaches Claude Code, and read the English reply back in Korean for zero paid tokens.
date: 2026-07-29
role: Developer
stack:
  - Python (standard library only)
  - LM Studio
  - Claude Code plugin & hooks
  - tmux
status: MVP
repo: https://github.com/Hong-Iron/Cheaper-Foreign-Tok/tree/feat/cft-mvp
demo:
summary: Non-English text costs several times the tokens of English. cft translates locally with LM Studio, keeps code byte-for-byte, and never blocks a prompt when the local model fails.
cover: /assets/img/uploads/cft-cover.png
cover_alt: "Diagram: a Korean prompt with a code path is masked, translated by a local model, and sent to Claude Code in English; the English reply is translated back to Korean in a side pane."
tags:
  - claude-code
  - local-llm
  - tokens
---

Korean, Japanese, Russian, or Arabic text takes far more tokens than the same meaning in English, roughly 4–5× by tokenizer estimates. Writing to a coding assistant in your own language means paying that surcharge on every turn, in dollars on the API and in quota on a subscription. The reply costs the most: a reply in your own language is longer in tokens, and output tokens are billed at the higher rate.

So the move is: send English, and let the model answer in English. **cft** does the translating locally, on a model you already run.

```
   you ──/t 한국어──► [slash cmd] ──► cft translate ──┐
                                                     │ mask → LM Studio → unmask
   Claude Code ◄────── English prompt ◄──────────────┘

   session.jsonl ──► cft watch (tmux pane) ──► 한국어 (local only, 0 paid tokens)
```

## Two directions

**Going in: `/t`.** Type `/t 이 함수가 간헐적으로 null을 반환해. src/util.py 확인해줘`. A hook saves the raw prompt to a file, and the slash command runs `cft translate`, which prints only the English. The Korean text never reaches the API.

**Coming back: `cft watch`.** In a second tmux pane, `cft watch` follows Claude Code's session transcript and translates the assistant's text back into your language. It skips tool calls and tool results, which make up most of a coding session's bytes. Press SPACE to translate the newest reply, or switch to automatic.

## The masker

Code must survive translation untouched. Before anything goes to the local model, fenced code, inline code, URLs, and paths are swapped for sentinels (`⟦0⟧`, `⟦1⟧`, …) and restored byte-exact afterwards. Every sentinel has to come back exactly once, or the translation is thrown away. The masker only protects spans it can recognize by pattern, so a bare shell command outside backticks is deliberately left alone. A masker that guessed would be neither testable nor trustworthy.

Masking also shrinks the job: a reply that is 70% code becomes a small translation.

## Fail open, always

If LM Studio is down, slow, or returns something broken, the original text is sent unchanged. The worst case is paying what you would have paid without cft. One failure is worse than an error, though: sending the *previous* prompt. So a saved prompt older than 30 seconds counts as missing, and the file is deleted the moment it is read.

## Decisions

- **Faithful translation, no elaboration.** The first idea had the local model expand vague prompts. Dropped: a small model guessing at intent sends the paid model down the wrong path, and that costs far more than a clarifying question.
- **No proxy.** Intercepting API traffic would be seamless, but it risks breaking subscription login, streaming, and tool-call JSON. It is also the only design that could make things actively worse.
- **A hook instead of a heredoc.** Claude Code pastes a slash command's arguments in as plain text, so a shell command built from them breaks on quotes, `$`, and backticks. A `UserPromptSubmit` hook receives the prompt as JSON on stdin, so there is no shell and nothing to escape.

## Status

114 tests pass against a fake LM Studio server, so the suite needs no GPU and no model. The work lives on the `feat/cft-mvp` branch. The savings ratio above is still an estimate: `tools/measure_savings.py` counts real tokens through Anthropic's token-counting API, and running it on a corpus of real prompts is the next step.
