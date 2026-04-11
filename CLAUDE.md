# Digital Citizenship — Project Instructions

This is the project-specific CLAUDE.md for the **Digital Citizenship for Grade 5**
intelligent textbook, created for **ISD 197** (West St. Paul–Mendota Heights–Eagan
Area Schools) in Minnesota.

The school district sits near **Bdote** — the historically and culturally
significant confluence of the Minnesota and Mississippi rivers, near Fort Snelling,
Mendota, and Pike Island, a site sacred to the Dakota people.

## Learning Mascot: Maka the River Otter

### Character Overview

- **Name**: Maka (pronounced "MAH-kah")
- **Species**: River otter
- **Personality**: Curious, kind, thoughtful, playful
- **Catchphrase**: "Pause, think, act!"
- **Visual**: Warm medium-brown fur with cream belly, large kind dark eyes,
  small round black glasses, a soft river-blue scarf (#2e6f8e), drawn in a
  modern flat cartoon vector style
- **Origin story**: Maka is inspired by the river otters that live at the
  confluence of the Minnesota and Mississippi rivers — the same waters that
  flow past ISD 197 schools. Like the otters of Bdote, Maka is playful,
  observant, and looks out for the rest of the family.

### Why an Otter?

River otters embody the habits this textbook teaches:

- **Curious without being reckless** — they investigate before they act
- **Social and kind to their group** — perfect metaphor for digital community,
  upstander behavior, and citizenship
- **Playful but observant** — matches the "pause, think, act" central habit
- **Native to the local rivers** — gives Grade 5 students at ISD 197 a sense
  of place and connection to where they live

### Voice Characteristics

- Uses simple, encouraging language appropriate for Grade 5 (ages 10–12)
- Refers to students as "friends" or "digital citizens"
- Models the "pause, think, act" habit in dialogue
- Never lectures or shames — always kind and supportive
- Uses occasional otter references ("Let's dive in!", "Let's float this idea")
  but does not overdo them
- Signature phrases:
  - "Pause, think, act!"
  - "Let's dive in, friends!"
  - "Take a slow breath before you click."
  - "You've got this!"

### Mascot Admonition Format

Always place mascot images in the **body** of the admonition, never in the
title bar. The title is clean text only — the default MkDocs icon is hidden
via CSS.

```markdown
!!! mascot-welcome "Title Here"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Maka waving welcome">
    Admonition text goes here, after the img tag.
```

**Image path note**: The `src` path is relative to the rendered page URL, not
the markdown file. For a chapter page at `chapters/01-intro/index.md`, use
`../../img/mascot/`. Count directories from the rendered page to
`docs/img/mascot/` for any other location.

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | `mascot-neutral` | As needed |
| Chapter opening | `mascot-welcome` | Once per chapter |
| Key concept / big idea | `mascot-thinking` | 2–3 per chapter |
| Helpful tip | `mascot-tip` | As needed |
| Common mistake / safety warning | `mascot-warning` | As needed |
| Difficult content | `mascot-encourage` | Where students may struggle |
| Section completion / achievement | `mascot-celebration` | End of major sections |

### Restraint Guidelines

Maka should appear **no more than 5–6 times per chapter**. The mascot is for
emphasis and emotional connection, not decoration.

**Do:**

- Use Maka to introduce new topics warmly at the start of chapters
- Include the catchphrase "Pause, think, act!" in welcome admonitions
- Keep dialogue brief — 1 to 3 sentences per admonition
- Match the pose to the content type (warning pose for warnings, etc.)
- Use simple, direct language Grade 5 students can read independently

**Don't:**

- Use Maka more than 5–6 times in any single chapter
- Place mascot admonitions back-to-back
- Use the mascot for purely decorative purposes
- Change Maka's personality, voice, or visual design
- Use Maka in contexts that require a serious adult tone (e.g., the safety
  rule about telling a trusted adult — that should be plain, direct text)
- Make jokes about the Dakota name "Maka" or the cultural context

## ISD 197 and Bdote — Cultural Context

This textbook was created for ISD 197, located on land near Bdote, a place
sacred to the Dakota people. When generating content:

- Treat the location and its history with respect
- The mascot's name "Maka" is from the Dakota word *makȟá* meaning "earth" —
  it is a respectful nod to the language and place, not a sacred or
  ceremonial term
- Do **not** put Maka in feathered headdresses, war paint, or any imagery
  appropriating Indigenous cultures
- Do **not** use the bald eagle as a mascot in this textbook — eagles are
  sacred to the Dakota and should not be cartooned for this audience
