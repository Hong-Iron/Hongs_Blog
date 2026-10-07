# 홍철's lines

One file per course slug (same slugs as `_data/study_courses.yml`) plus
`default.yml` for every other page. On a course page the course's chats and
talk lines are mixed with the ones in `default.yml`. Everything reaches the
browser as `assets/robot-data.json`, loaded the first time the bubble opens.

| key | what it is |
|---|---|
| `greeting` | first line when the bubble opens (a list = one at random) |
| `again`, `chat_prompt`, `ask` | lines shown when returning home, opening 대화하기, opening 질문하기 (default.yml supplies them everywhere) |
| `questions` | the 질문하기 menu: `q` (button), `a` (answer) |
| `chats` | the 대화하기 threads: `q` is what the visitor says, `a` is 홍철's answer, `next` lists what the visitor can say after that, nested as deep as you like |
| `welcome_back` | default.yml only: the first line on a return visit (`same_day`, `days`, `long`, `visits`, `last_course`, `resume`); {days} {visits} {last_course} {topic} are filled in |
| `talk` | the 아무 얘기나 pool: `text`; one at random, no repeats until it runs out |

Any `a` or `text` can be a list of variants (one is picked at random).
An entry with `action: forget` clears the visitor's memory before answering.
Any entry can carry `link` (a site path without the baseurl) and `link_label`.
`{concepts}` `{practices}` `{codes}` `{heavy}` fill in from the course numbers,
`{courses}` `{notes}` from the whole site.

Personal small talk only uses what is already written in the Pensées posts;
course facts come from the study notes. 홍철 speaks casual 해요체, in the first
person as 철민's pixel double.

## Memory

`assets/js/robot.js` keeps a small record in the visitor's own browser
(`localStorage` key `robot-memory`): visit count, last visit time, last page,
threads started, and whether the last thread was finished. It never leaves the
browser; another device or a private window starts fresh.
