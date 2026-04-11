# Chapter 1 — Token Cost Report

This report measures the actual token usage required to generate
**Chapter 1: Welcome to the Digital World** in `ultrathink` mode using
`claude-opus-4-6` with the 1M context window. The data below comes from
the Claude Code session log at:

```
~/.claude/projects/-Users-dan-Documents-ws-digital-citizenship/9717fbff-f141-4296-909a-9d257bb4869f.jsonl
```

The session covered four user prompts. Token totals are split per prompt
so the cost of the chapter generation itself can be isolated from the
meta-discussion about token tracking that followed.

## Pro plan rate limit context

The Claude **Pro plan** allows approximately **200,000 tokens of
"weighted" usage per 5-hour rolling window**. Anthropic does not publish
the exact weighting formula, but community measurements and the
published API pricing strongly suggest the following ratios for Opus:

| Token category | Approximate weight |
|---|---|
| New input tokens | 1.0× |
| Cache **read** tokens (replays of cached context) | 0.1× |
| Cache **creation** tokens (first time content is sent) | 1.25× |
| Output tokens | 5.0× |

Cache reads are heavily discounted, which is why the raw token count
balloons into the millions while the *weighted* count is far smaller.
Grand totals below report both numbers so you can see what is actually
charged against the Pro limit.

## Per-prompt breakdown

| Window | Turns | New input | Cache create | Cache read | Output | Raw total | Weighted |
|---|---:|---:|---:|---:|---:|---:|---:|
| Q1: explain thinking modes | 1 | 6 | 18,309 | 15,554 | 1 | 33,870 | 24,452 |
| **Q2: PLAN + WRITE chapter 1** | **67** | **97** | **265,878** | **5,933,239** | **42,514** | **6,241,728** | **1,138,338** |
| Q3: token-cost discussion | 2 | 12 | 2,233 | 252,408 | 997 | 255,650 | 33,029 |
| Q4: current /cost follow-up | 15 | 25 | 12,186 | 1,954,121 | 4,041 | 1,970,373 | 230,874 |
| **SESSION TOTAL** | **85** | **140** | **298,606** | **8,155,322** | **47,553** | **8,501,621** | **1,426,694** |

The row that matters for chapter cost is **Q2** — the single
`ultrathink` prompt that produced the plan file, the chapter content,
and the verification pass.

## Chapter 1 in isolation (Q2)

| Metric | Value |
|---|---:|
| Wall-clock time | ~18 minutes (10:17:47 → 10:35:54 local) |
| Assistant turns | 67 |
| New input tokens (uncached, sent fresh) | 97 |
| Cache **creation** tokens (full price) | 265,878 |
| Cache **read** tokens (discounted replays) | 5,933,239 |
| Output tokens (Maka content + plan + verification) | 42,514 |
| **Raw token total** (input + create + read + output) | **6,241,728** |
| **Weighted total** (Pro-plan style estimate) | **~1,138,000** |
| Output equivalent in words | ~32,000 words of Claude output across the whole pass |
| Words actually written to `index.md` | 3,495 words |

### Why the raw total is so high

Each assistant turn replays the entire growing conversation from cache.
With 67 turns and cumulative file reads (CLAUDE.md, the 17 chapter
stubs, the learning graph, the chapter-design log, mascot CSS,
mkdocs.yml, two parallel Explore subagent reports, the plan file, the
chapter file), the per-turn cache footprint grew to ~125,000 tokens by
the end of the run. The top 10 most expensive turns were all in the
verification phase, each replaying ~125K tokens of cached context to do
a single grep.

The two parallel `Explore` subagents that ran in the planning phase
each pulled in the full set of project files, contributing roughly
40–60K tokens of fresh cache creation between them.

### Comparison to the 200K / 5h Pro plan limit

| Measurement | vs. Pro 200K/5h limit |
|---|---|
| Raw total (6.24M) | **31× over** the limit if Anthropic counted everything equally |
| Weighted total (1.14M) | **5.7× over** the limit at the estimated weighting |
| Just fresh content (`new input + cache create + output` = 308,489) | **1.5× over** the limit even ignoring all cache replays |

**A teacher on the Pro plan cannot generate a single chapter this way
inside one 5-hour window.** Even if cache reads were charged at zero
cost, the new context plus the output alone (~308K tokens) is more than
the Pro window allows.

## Drivers of cost (highest to lowest)

1. **`ultrathink` mode** — extended-thinking output is invisible to the
   user but is billed as output tokens. A non-trivial fraction of the
   42K output tokens above are extended-thinking tokens, not visible
   chapter content.
2. **Plan mode with parallel Explore subagents** — the two parallel
   Explore agents in the planning phase each pulled in dozens of files
   and produced multi-thousand-word reports. Each agent has its own
   context, which becomes cache for the parent.
3. **Verification grep/awk loop** — each verification step replays the
   full ~125K cached context for what is essentially a one-line bash
   command. 10+ verification turns × 125K = ~1.3M cache reads on
   their own.
4. **Long source files** — `CLAUDE.md` (~700 lines), `course-description.md`
   (~140 lines), `chapter-design.md` (long), and the
   `chapter-content-generator` SKILL.md (~800 lines) were all read in
   full during planning, each adding ~5–15K tokens of cache creation.
5. **Opus 4.6 with 1M context** — the 1M context window means
   Anthropic does not aggressively trim, so cache replays carry every
   prior tool result on every turn.

## Recommendations for keeping a chapter under 200K Pro-plan tokens

To bring chapter generation inside the Pro plan's 200K/5h limit, the
following changes should be combined:

1. **Use Sonnet 4.6 instead of Opus 4.6.** Sonnet output is roughly 5×
   cheaper per token and Sonnet's reasoning is more than adequate for
   Grade 5 chapter prose.
2. **Skip `ultrathink`.** Use plain `think` or no extended thinking at
   all. Extended thinking can multiply output tokens by 3–5× on a
   complex task like chapter generation.
3. **Skip plan mode for chapters after the first one.** The first
   chapter benefits from a careful plan because it sets the voice for
   the whole book. Subsequent chapters can imitate Chapter 1 directly.
4. **Skip parallel Explore subagents.** Read the 4–5 specific files you
   need with the `Read` tool directly. Each Explore agent doubles the
   cache footprint of the planning phase.
5. **Skip verification by grep loop.** Run the verification checks
   manually after the chapter is written, or have the user run them.
   Each grep turn currently replays ~125K cached tokens.
6. **Pre-compress CLAUDE.md.** The current `CLAUDE.md` is ~700 lines.
   A condensed "chapter authoring quick reference" of ~100 lines would
   cut planning-phase cache creation by ~15K tokens.

## Estimated cost of an "economy mode" chapter

If the changes above are applied, a single chapter should fall in the
range below:

| Metric | Estimate |
|---|---:|
| New input + cache creation | ~30,000–50,000 |
| Cache read | ~150,000–300,000 |
| Output | ~6,000–9,000 |
| **Raw total** | ~200,000–360,000 |
| **Weighted total** | ~80,000–130,000 |

That weighted estimate (~80K–130K) sits comfortably under the Pro
plan's 200K/5h limit, leaving headroom for the teacher to also do
small follow-up edits in the same window.

## Methodology

- Token data was read from the per-session JSONL file at
  `~/.claude/projects/-Users-dan-Documents-ws-digital-citizenship/9717fbff-f141-4296-909a-9d257bb4869f.jsonl`.
- Each line of the JSONL contains a single conversation event. Events
  with `type: "assistant"` carry a `message.usage` block with
  `input_tokens`, `cache_creation_input_tokens`,
  `cache_read_input_tokens`, and `output_tokens`.
- Turns were bucketed by ISO timestamp into the four user-prompt
  windows shown above. Window boundaries were taken from the
  `~/.claude/activity-logs/prompts.jsonl` log, which is populated by
  the user's local prompt-logging hook.
- Weighted totals are an *estimate*. Anthropic does not publish the
  exact Pro-plan weighting formula. The 1.0 / 0.1 / 1.25 / 5.0 weights
  used here are derived from published Opus pricing ratios for new
  input, cache reads, cache creation, and output. The actual rate
  limit may differ.

## Conclusion

Chapter 1 was written with a "no expense spared" configuration:
ultrathink, Opus 4.6, plan mode with two parallel Explore subagents,
heavy verification, and a 1M-context window. The result is a
high-quality chapter and a reusable plan, but it consumed roughly
**1.14 million weighted tokens** (~6.24 million raw), which is about
**5.7× the Pro plan's 200K/5h limit**.

For ISD 197 teachers using the Pro plan, chapter generation must move
to an "economy mode" configuration (Sonnet, no ultrathink, no plan
mode, direct file reads, lightweight verification) to fit inside one
5-hour window. The first chapter, written under "max effort," can
serve as the style template that all subsequent chapters imitate
cheaply.

## Dollar cost — pay-per-token (Anthropic API rates)

The numbers above describe rate-limit pressure on the Pro plan, where
the user pays a flat monthly fee. The numbers below describe what the
*same work* would cost on **pay-as-you-go API billing** at Anthropic's
published rates.

### Published API rates (USD per million tokens)

| Model | Input | Cache create (1h) | Cache read | Output |
|---|---:|---:|---:|---:|
| **Claude Opus 4.6** (≤200K context tier) | $15.00 | $30.00 | $1.50 | $75.00 |
| **Claude Sonnet 4.6** (≤200K context tier) | $3.00 | $6.00 | $0.30 | $15.00 |

The session JSONL shows all cache creation went into the 1-hour cache
bucket (`ephemeral_1h_input_tokens`), so the 1-hour cache rates are
used throughout. The model used for this session was `claude-opus-4-6`
in standard context tier (no individual request exceeded the 200K
input threshold that triggers the 1M-context premium pricing).

### Chapter 1 cost — split into Plan phase and Execute phase

The Q2 window is split at the `ExitPlanMode` call (15:25:23 UTC):

| Phase | Turns | New input | Cache create | Cache read | Output | **Opus 4.6** | **Sonnet 4.6** |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Plan phase** (read, Explore agents, write plan, ExitPlanMode) | 33 | 63 | 200,816 | 1,931,488 | 21,823 | **$10.56** | **$2.11** |
| **Execute phase** (write chapter, verify) | 34 | 34 | 65,062 | 4,001,751 | 20,691 | **$9.51** | **$1.90** |
| **Chapter 1 total (Q2)** | **67** | **97** | **265,878** | **5,933,239** | **42,514** | **$20.07** | **$4.01** |

Per-line cost breakdown for the Q2 total on Opus 4.6:

| Token category | Tokens | Rate | Cost |
|---|---:|---:|---:|
| New input | 97 | $15.00 / MTok | $0.0015 |
| Cache creation (1h) | 265,878 | $30.00 / MTok | $7.98 |
| Cache reads | 5,933,239 | $1.50 / MTok | $8.90 |
| Output | 42,514 | $75.00 / MTok | $3.19 |
| **Total** | **6,241,728** | — | **$20.07** |

### What stands out

- The two largest cost categories are roughly equal: **cache creation
  ($7.98)** and **cache reads ($8.90)**. Together they are 84% of the
  total, even though cache reads are billed at 1/10 the input rate.
- **Output is only $3.19** despite ultrathink mode and 42,514 output
  tokens. Output is expensive per token but small in volume.
- The Plan phase ($10.56) and Execute phase ($9.51) are nearly the
  same cost. **Half of the chapter's cost was spent before a single
  word of chapter prose was written.** Most of that came from the two
  parallel Explore subagents and from cache-reading the long source
  files.
- On **Sonnet 4.6**, the same exact workflow would have cost **$4.01**
  instead of $20.07 — a 5× reduction with no other changes. Sonnet
  prices are exactly 1/5 of Opus across every category.

### Whole-session cost (for context)

The full session — including the explanatory Q1 chat, the chapter
generation, and the Q3/Q4 token-tracking discussion that produced this
report — totals roughly:

| Model | Whole session |
|---|---:|
| Opus 4.6 (what actually ran) | **~$28** |
| Sonnet 4.6 (hypothetical) | **~$5.60** |

This means the meta-discussion about token tracking added roughly $8
on top of the $20 chapter generation cost.

### "Standard mode" / "economy mode" cost estimate

If chapter generation is reconfigured per the recommendations earlier
in this report — Sonnet 4.6, no ultrathink, no plan mode, no parallel
Explore subagents, direct file reads, lightweight verification — a
single chapter is estimated to consume:

| Token category | Estimated tokens |
|---|---:|
| New input | ~5,000 |
| Cache create (1h) | ~40,000 |
| Cache read | ~225,000 |
| Output | ~7,500 |

Cost at API rates:

| Model | Cost per chapter (estimated) |
|---|---:|
| **Sonnet 4.6 economy mode** | **~$0.44** |
| **Opus 4.6 economy mode** (same workflow, just bigger model) | ~$2.18 |
| **Opus 4.6 ultrathink mode** (what we just did) | $20.07 |

### Cost-per-chapter at scale

For the full 17-chapter textbook, assuming Chapter 1 was a one-time
"max effort" investment and the remaining 16 chapters are produced in
economy mode on Sonnet 4.6:

| Phase | Chapters | Cost each | Subtotal |
|---|---:|---:|---:|
| Chapter 1 (max effort, Opus 4.6, ultrathink, plan mode) | 1 | $20.07 | $20.07 |
| Chapters 2–17 (economy mode, Sonnet 4.6) | 16 | $0.44 | $7.04 |
| **17-chapter total** | **17** | — | **~$27** |

For comparison, doing all 17 chapters in the same "max effort" mode
that produced Chapter 1 would cost roughly **17 × $20 = $340** on
pay-per-token billing. The economy-mode strategy saves over $300 with
a quality trade-off that should be modest, since chapters 2–17 can
imitate the style and structure of Chapter 1 directly.

### Caveats

- All dollar figures use Anthropic's **published list rates** as of
  the model's release. Enterprise contracts, prompt-caching discounts,
  or batch-API discounts may reduce the actual cost.
- Cache creation is billed at the **1-hour cache rate** ($30/MTok for
  Opus) because the session's `cache_creation` field showed
  `ephemeral_1h_input_tokens > 0` and `ephemeral_5m_input_tokens = 0`.
  Shorter sessions that use the 5-minute cache get a slightly cheaper
  rate ($18.75/MTok for Opus).
- The "economy mode" estimate is a projection, not a measurement.
  The actual cost will not be known until a chapter is generated under
  those constraints. A single empirical measurement of Chapter 2 in
  economy mode would replace this estimate with hard data.
- Pro/Max plan subscribers do not pay these dollar amounts directly —
  they pay a flat monthly fee. The dollar figures are useful for
  comparing the *relative* cost of different generation strategies and
  for understanding why a single high-effort chapter consumes so much
  of the Pro 5-hour rate-limit window.
