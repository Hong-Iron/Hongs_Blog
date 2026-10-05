---
title: sharpCouncil
subtitle: An Obsidian plugin where the people you write into a note debate an agenda, each played by a local LLM.
date: 2026-07-27
role: Developer
stack:
  - TypeScript
  - Obsidian API
  - LM Studio
  - esbuild
  - Python (CLI)
status: Prototype
repo: https://github.com/Hong-Iron/sharpCouncil
demo:
summary: Write a few people into a note and give them an agenda. Local models argue it out in rounds, question each other, vote, and leave live meeting minutes in your vault.
cover: /assets/img/uploads/sharpcouncil-cover.png
cover_alt: "Diagram: four people from a note, each assigned a local model, move through opening statements, rebuttal rounds, a consensus check, a vote, and a final resolution."
tags:
  - obsidian
  - local-llm
  - multi-agent
---

**Council** puts a question to several people instead of one model. You describe them in a note: an optimist, a skeptic, a practitioner, an outsider. Each of them gets a local model from LM Studio, and they debate the agenda while the minutes fill in live, one callout per speaker.

```
person note  →  [setup window: models and parameters]  →  live minutes + progress panel
```

## How a session runs

**1. Write the people.** The format is loose: a `## Name` heading and a few lines about who they are. Optional lines pin a model (`모델:`), a temperature (`온도:`), a context length, or thinking on/off for that person. An `## 안건` section holds the agenda.

**2. Adjust in the setup window.** Models are assigned three ways: *diversity* gives each person a different model, *uniform* gives everyone the same one, and *manual* keeps your picks. Parameters can be set for everyone at once or per person. The window also estimates how many turns the debate will take and how many times a model will have to be swapped in.

**3. Watch it live.** The minutes open in a new tab and grow as each person speaks. A side panel shows the current stage, each person's status, the live stream, and the vote. A model's `<think>` reasoning is kept in a collapsible callout under its speech.

## The procedure

1. **Opening statements.** Each person states a position without seeing the others, to avoid anchoring, and must name the weakest point of their own position.
2. **Rebuttal rounds.** Each turn acknowledges the opponent's strongest argument, attacks the weakest one, and declares *hold*, *revise*, or *withdraw*. The turn ends with a question to one named person, who must answer it first on their next turn.
3. **Consensus check.** After every round a chair model rules on what is still disputed, using structured output, and ends the debate early when another round would add nothing.
4. **Vote.** Each person returns a verdict, a confidence, a final position, the biggest risk, and whether they changed their mind, as JSON.
5. **Final resolution.** The chair writes up the conclusion, points of agreement, open issues, minority opinions, and recommended actions.

When the transcript outgrows the context budget, the chair compresses earlier rounds into a summary, so a small-context model can follow the whole debate.

## Redo one turn

Put the cursor inside a speech you don't like, right-click, and choose **🔁 regenerate**. The new speech streams into the same spot. It sees only what came before it, exactly as the original did. For that one turn you can change the model, the temperature, or add an instruction ("shorter, and demand numbers"). Everything a regeneration needs is saved in the minutes as a hidden comment, so a months-old transcript can still be regenerated.

## Many models, one machine

A local machine can't hold several 12B models in memory at once, so the default is *serial* mode. Only the current speaker's model is loaded, and the rest are unloaded with `lms unload`. Swapping models costs time, which is why the setup window counts swaps before you start. Two settings keep that number down: *uniform* assignment, and an order that groups people who share a model.

## Status

Desktop only, because it drives the `lms` CLI. The build type-checks clean, and the logic smoke test passes all 70 checks. If a model can't follow the JSON schema, its vote falls back to a text heuristic. A Python CLI version of the same procedure lives in `cli/`.
