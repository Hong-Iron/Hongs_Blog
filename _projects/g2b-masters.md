---
title: G2B Masters
subtitle: One search for public tenders scattered across 나라장터 and 국방전자조달, with AI that reads the documents for you.
date: 2026-08-05
role: Backend, data pipeline & AI (everything except frontend and deployment)
stack:
  - Python
  - PostgreSQL
  - MySQL / MariaDB
  - REST API
  - LLM summarization
status: Live
repo:
demo: https://electerior.co.kr
summary: A public procurement platform that brings bids from 나라장터 (KONEPS) and 국방전자조달 (D2B) into one search, and uses AI to summarize the notices behind them.
cover: /assets/img/uploads/g2b-masters-cover.png
cover_alt: "Diagram: tenders from 나라장터 and 국방전자조달 flow into one database, are summarized by several AI models that are checked against each other, and come out as one search."
tags:
  - procurement
  - data-pipeline
  - llm
---

Companies that sell goods, services, and construction to public agencies have to watch two separate systems: **나라장터** (KONEPS, the national e-procurement system) and **국방전자조달** (D2B, the defense e-procurement system). Opportunities slip through the gap between them. And the notices and pre-specifications behind each bid are long and come in every format, so just checking one takes a long time.

G2B Masters puts both systems in one search, and AI pulls the key points out of each document. It is running at [electerior.co.kr](https://electerior.co.kr).

## My role

Everything except the frontend and deployment: the server and data pipeline, the logic that collects and analyzes bids, and the AI summary feature, including how its output is compared and validated across models.

## What I built

**Domain analysis.** Mapped the document types and fields of both systems (bid notices, order plans, pre-specifications, bid results) and built the service's data structure on that map.

**Database design.** Designed the schema for bid notices, items, eligibility requirements, and company information on relational databases (PostgreSQL, MySQL, MariaDB).

**API design and spec.** Designed the REST API between the frontend and the data, and wrote its specification so search and analysis connect reliably.

**AI summaries.** Bid notices and pre-specifications run to dozens of pages. The summary feature reads them and keeps only what matters, so the person in charge gets the content in seconds without reading the whole document.

**Model comparison and validation.** The service does not trust a single model's output. I designed and ran a process that compares the outputs of several models against each other, and that is what made the summaries reliable.

**Analysis logic.** Filters by item, participation eligibility, and likelihood of winning, so the service helps with the decision, not just the search.

## Result

Both systems are searchable from one screen, and the AI-organized key points make it quick to review which bids are worth pursuing. The service is in production with real users.

**Focus:** domain analysis · database design · API design and spec · AI summaries · model comparison and validation
