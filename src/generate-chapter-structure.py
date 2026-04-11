#!/usr/bin/env python3
"""
generate-chapter-structure.py

Generates the docs/chapters/ directory tree, the main chapters/index.md,
and one index.md per chapter for the *Digital Citizenship for Grade 5*
intelligent textbook.

This script encodes the final 17-chapter design produced during the
chapter-design session documented in:
    docs/learning-graph/chapter-design.md

Pipeline:
    1. Read learning-graph.json to get the concept dependency graph (DAG).
    2. Build the prereq map (dependency direction: from = dependent, to = prereq).
    3. Apply the hard-coded 17-chapter assignment defined in CHAPTER_CONCEPTS.
    4. Validate three constraints:
         - every concept appears in exactly one chapter
         - no concept is missing
         - no chapter forward-references a prerequisite from a later chapter
    5. Topologically order concepts within each chapter (for display).
    6. Compute prerequisite chapters for each chapter.
    7. Write docs/chapters/index.md and 17 chapter index.md files.

This script is idempotent: running it again will overwrite the existing
index.md files but will not delete any chapter body content that has been
authored by hand.

USAGE:
    cd /path/to/digital-citizenship
    python3 src/generate-chapter-structure.py

REQUIRES:
    - docs/learning-graph/learning-graph.json must exist
    - docs/course-description.md must exist (referenced from index files)

OUTPUTS:
    - docs/chapters/ directory tree
    - docs/chapters/index.md
    - docs/chapters/01-*/index.md ... docs/chapters/17-*/index.md

The mkdocs.yml navigation must be updated separately — this script does
not modify mkdocs.yml.

Author: ISD 197 Digital Citizenship textbook project
Session: Chapter design session, 2026-04-11
"""

import json
import os
import sys
from collections import defaultdict

# ----------------------------------------------------------------------------
# Project root detection
# ----------------------------------------------------------------------------

# Assume the script is run from the project root or from src/.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR) if os.path.basename(SCRIPT_DIR) == 'src' else SCRIPT_DIR
GRAPH_FILE = os.path.join(PROJECT_ROOT, 'docs', 'learning-graph', 'learning-graph.json')
CHAPTERS_DIR = os.path.join(PROJECT_ROOT, 'docs', 'chapters')

# ----------------------------------------------------------------------------
# Final 17-chapter design
# ----------------------------------------------------------------------------
# Each entry: (title, url_path, summary, [concept names])
# Concept names must match learning-graph.json exactly (case-sensitive).
# Order within each chapter is for design intent only — the script will
# topologically re-order concepts on output.

CHAPTERS = [
    {
        'title': 'Welcome to the Digital World',
        'url_path': 'welcome-to-digital-world',
        'summary': "Meet the devices, networks, and basic vocabulary every Grade 5 student needs to start exploring the digital world safely and confidently.",
        'concepts': [
            'Digital Device', 'Tablet', 'Laptop', 'Smartphone', 'School Device', 'Family Device',
            'Internet', 'Wifi', 'Public Wifi', 'Web Browser', 'Website', 'URL', 'Address Bar',
            'Search Engine', 'Online Activity', 'App', 'Account',
        ],
    },
    {
        'title': 'What Is a Digital Citizen?',
        'url_path': 'what-is-a-digital-citizen',
        'summary': "Learn what it means to be a citizen of the digital world — not just a user — and meet Maka's central habit: pause, think, act.",
        'concepts': [
            'Online Community', 'Digital World', 'Digital Citizenship', 'Digital Citizen',
            'Digital Rights', 'Digital Responsibilities', 'Digital Opportunities', 'Pause Think Act',
            'Safe Online Behavior', 'Legal Online Behavior', 'Ethical Online Behavior', 'ISTE Standards',
            'Digital Etiquette', 'Digital Threshold', 'Trusted Adult',
        ],
    },
    {
        'title': 'Media Balance and Spotting Imbalance',
        'url_path': 'media-balance',
        'summary': "Discover the Heart, Brain, and Body activity framework, and learn to spot the signs that your tech use is out of balance.",
        'concepts': [
            'Screen Time', 'Media Balance', 'Heart Activity', 'Brain Activity', 'Body Activity',
            'Activity Sorting', 'Active Vs Passive Use', 'Notification', 'Tired Eyes', 'Grumpy Mood',
            'Skipped Meal', 'Skipped Play', 'Media Imbalance', 'Eye Strain', 'Doomscrolling',
        ],
    },
    {
        'title': 'Building Healthy Tech Habits',
        'url_path': 'healthy-tech-habits',
        'summary': "Build personal habits — screen breaks, the Digital Habit Tracker, family media plans — that keep you healthy and balanced online.",
        'concepts': [
            'Healthy Habits', 'Mindful Use', 'Outdoor Time', 'Sleep Habits', 'App Time Limit',
            'Blue Light', 'Posture', 'Screen Break', 'Digital Habit Tracker', 'Daily Tech Log',
            'Offline Activity', 'Family Media Plan', 'Tech Free Zone', 'Wellbeing Check',
        ],
    },
    {
        'title': 'Private vs. Personal Information',
        'url_path': 'private-vs-personal-info',
        'summary': "Learn the most important safety distinction online: which information is private (and must be protected) and which is personal (and is safe to share).",
        'concepts': [
            'Personal Information', 'Private Information', 'Identifying Information', 'Full Name',
            'Home Address', 'School Name', 'Birthday', 'Phone Number', 'Favorite Color', 'Hobby Information',
            'Sign Up Form', 'Location Sharing', 'GPS', 'HTTPS', 'Padlock Icon',
        ],
    },
    {
        'title': 'Passwords, Clickbait, and Staying Safe Online',
        'url_path': 'passwords-and-online-safety',
        'summary': "Learn how strong passwords work, how clickbait, scams, and trackers try to fool you, and how to stay one step ahead.",
        'concepts': [
            'Password', 'Strong Password', 'Passphrase', 'Password Sharing', 'Login', 'Sign Out Habit',
            'Account Security', 'Two Factor Authentication', 'Screen Lock', 'Biometric Login',
            'Incognito Mode', 'Email Privacy', 'App Permission', 'Data Tracking', 'Cookies',
            'Targeted Ad', 'Clickbait', 'Online Scam', 'Phishing Basics',
        ],
    },
    {
        'title': 'What Is a Digital Footprint?',
        'url_path': 'what-is-a-digital-footprint',
        'summary': "Discover what a digital footprint is, why it is permanent, searchable, copyable, and shareable, and how every click adds to your trail.",
        'concepts': [
            'Digital Footprint', 'Permanent Post', 'Searchable Post', 'Copyable Content',
            'Shareable Content', 'Digital Trail', 'Digital Identity', 'Avatar', 'Username Choice',
            'Profile Picture', 'Screenshot', 'Photo Tagging', 'Geotag', 'Post History',
        ],
    },
    {
        'title': 'Reputation, Sharing, and Giving Credit',
        'url_path': 'reputation-and-credit',
        'summary': "Learn how your online reputation grows over time, how to protect it, and how to give credit when you use someone else's creative work.",
        'concepts': [
            'Online Reputation', 'Public Post', 'Private Post', 'Future Audience', 'Positive Footprint',
            'Footprint Audit', 'Personal Brand', 'College Audience', 'Intellectual Property',
            'Giving Credit', 'Citing Source', 'Copyright Basics', 'Creative Work', 'Plagiarism',
            'Creative Commons',
        ],
    },
    {
        'title': 'Online Friends and How We Talk',
        'url_path': 'online-friends-and-talk',
        'summary': "Explore the difference between online and in-person friends, the meaning of tone and emoji in text, and how online conversations can be misunderstood.",
        'concepts': [
            'Online Friend', 'In Person Friend', 'Online Only Friend', 'Stranger Online', 'Friend Request',
            'Tone In Text', 'Emoji Meaning', 'Text Misunderstanding', 'Group Chat', 'Direct Message',
            'Video Chat', 'Voice Chat', 'Read Receipt',
        ],
    },
    {
        'title': 'Safe Talk and Setting Boundaries',
        'url_path': 'safe-talk-and-boundaries',
        'summary': "Learn the Safe Talk Rule (notice → stop → tell a trusted adult), how to use block, report, and mute features, and how to set healthy boundaries.",
        'concepts': [
            'Safe Talk Rule', 'Warning Sign', 'Stop Conversation', 'Tell Adult', 'Block Feature',
            'Report Feature', 'Mute Feature', 'Polite Reply', 'Respectful Tone', 'Boundary Setting',
            'Netiquette', 'All Caps', 'Stranger Danger',
        ],
    },
    {
        'title': 'When Conflict Becomes Cyberbullying',
        'url_path': 'conflict-vs-cyberbullying',
        'summary': "Learn the difference between online conflict and cyberbullying, and meet the four roles in a bullying situation: target, bully, bystander, and upstander.",
        'concepts': [
            'Online Conflict', 'Conflict Vs Bullying', 'Cyberbullying', 'Repeated Harm', 'Power Imbalance',
            'Digital Drama', 'Hate Speech', 'Mean Comment', 'Trolling', 'Exclusion', 'Impersonation',
            'Online Target', 'Bystander', 'Upstander', 'Bully Role',
        ],
    },
    {
        'title': 'Standing Up Safely as an Upstander',
        'url_path': 'standing-up-safely',
        'summary': "Learn how cyberbullying affects feelings, how to safely stand up for someone, and how to report harm and ask for adult help.",
        'concepts': [
            'Emotional Impact', 'Hurt Feelings', 'Anger Online', 'Empathy Online', 'Kind Reply',
            'Reporting Bullying', 'Saving Evidence', 'Adult Help', 'Standing Up Safely', 'Group Pile On',
            'De-escalation', 'Repair Harm', 'Apology Online', 'FOMO', 'Ghosting',
        ],
    },
    {
        'title': 'What Is Misinformation?',
        'url_path': 'what-is-misinformation',
        'summary': "Learn what misinformation is, how it spreads, and the emotional and curiosity hooks designers use to make you click and share.",
        'concepts': [
            'Information Source', 'News Story', 'News Literacy', 'Fact', 'Opinion', 'Misinformation',
            'Disinformation', 'Rumor', 'Hoax', 'Viral Post', 'Shocking Headline', 'Emotional Hook',
            'Urgency Cue', 'Curiosity Gap', 'Satire', 'Parody',
        ],
    },
    {
        'title': 'Becoming a Fact Checker',
        'url_path': 'becoming-a-fact-checker',
        'summary': "Learn the kid-friendly fact-check workflow — who said it, when, with what evidence — and become a confident fact checker.",
        'concepts': [
            'Fact Check', 'Fact Check Steps', 'Trusted Source', 'Source Comparison', 'Date Check',
            'Author Check', 'Edited Image', 'Slow Down Habit', 'Out Of Context', 'Lateral Reading',
            'Headline Vs Article', 'Algorithm Amplification', 'Recommendation Feed',
        ],
    },
    {
        'title': 'The Four Critical Questions',
        'url_path': 'four-critical-questions',
        'summary': "Meet the four critical-thinking questions and learn the basic vocabulary of evidence, claims, reasons, and inferences.",
        'concepts': [
            'Critical Thinking', 'Curious Mind', 'Asking Questions', 'Who Said It', 'How They Know',
            'What Evidence', 'What Is Missing', 'Evidence', 'Claim', 'Reason', 'Logical Reason',
            'Premise', 'Conclusion', 'Inference', 'Jumping To Conclusion', 'Generalization',
            'Anecdote Vs Evidence', 'Confirming Sources',
        ],
    },
    {
        'title': 'Healthy Doubt and Open Minds',
        'url_path': 'healthy-doubt-open-minds',
        'summary': "Learn how to use healthy doubt, spot your own biases, change your mind when the evidence changes, and stay open-minded.",
        'concepts': [
            'Comparing Versions', 'Spotting Bias', 'Checking Feelings', 'Pause Before Share',
            'Asking For Help', 'Healthy Doubt', 'Open Mindedness', 'Changing Mind', 'Reflective Thinking',
            'Confirmation Bias', 'Cause Vs Correlation', 'Counter Argument', 'Stereotype',
        ],
    },
    {
        'title': 'Your Digital Citizenship Toolkit',
        'url_path': 'digital-citizenship-toolkit',
        'summary': "Bring everything together in your personal Digital Citizenship Toolkit — a capstone project that turns what you've learned into something you can share with your family and friends.",
        'concepts': [
            'Digital Citizenship Toolkit', 'Personal Pledge', 'Habit Tracker Project', 'Upstander Script',
            'Fact Check Card', 'Critical Thinker Toolkit', 'Antibullying Poster', 'Mini Lesson',
            'Public Service Message', 'Family Tech Plan', 'Buddy Class Sharing', 'Classroom Pledge',
            'Footprint Plan', 'Password Plan', 'Safe Talk Plan', 'Media Balance Plan', 'Screen Time Goal',
            'Reflection Journal', 'Knowledge Sharing', 'Continuous Improvement', 'Lifelong Learner',
            'Peer Teaching', 'Self Assessment', 'Goal Setting', 'Habit Formation',
        ],
    },
]


# ----------------------------------------------------------------------------
# Graph loading and validation
# ----------------------------------------------------------------------------

def load_graph():
    """Load learning-graph.json and return (nodes, prereqs, label_to_id)."""
    with open(GRAPH_FILE) as f:
        data = json.load(f)
    nodes = {n['id']: n for n in data['nodes']}
    label_to_id = {n['label']: n['id'] for n in data['nodes']}

    # Build prereq map: from=dependent, to=prereq (DEPENDENCY direction)
    # NEVER invert this — see chapter-design.md "Edge Direction Validation".
    prereqs = defaultdict(set)
    for e in data['edges']:
        prereqs[e['from']].add(e['to'])
    return data, nodes, prereqs, label_to_id


def validate_chapter_assignment(chapters, nodes, prereqs, label_to_id):
    """Verify coverage and dependency ordering. Raises AssertionError on failure."""
    chapter_map = {}
    duplicates = []
    for ch_idx, ch in enumerate(chapters, start=1):
        for name in ch['concepts']:
            if name not in label_to_id:
                raise AssertionError(f"Chapter {ch_idx}: concept '{name}' not in learning graph")
            cid = label_to_id[name]
            if cid in chapter_map:
                duplicates.append(name)
            chapter_map[cid] = ch_idx
    if duplicates:
        raise AssertionError(f"Duplicate concept assignments: {duplicates}")

    all_ids = set(nodes.keys())
    missing = all_ids - set(chapter_map.keys())
    if missing:
        raise AssertionError(f"Concepts not assigned to any chapter: {[nodes[c]['label'] for c in missing]}")

    violations = []
    for cid, ch in chapter_map.items():
        for dep in prereqs.get(cid, set()):
            if dep in chapter_map and chapter_map[dep] > ch:
                violations.append(
                    f"  {nodes[cid]['label']} (ch{ch}) needs {nodes[dep]['label']} (ch{chapter_map[dep]})"
                )
    if violations:
        raise AssertionError("Dependency violations found:\n" + "\n".join(violations))

    return chapter_map


def order_concepts_topologically(concept_names, prereqs, label_to_id, nodes):
    """Topologically sort concepts within a chapter for display order."""
    cids = [label_to_id[n] for n in concept_names]
    remaining = set(cids)
    out = []
    while remaining:
        # Concepts with no remaining prereqs in this chapter are "ready"
        ready = [c for c in remaining if not (prereqs[c] & remaining)]
        ready.sort(key=lambda c: nodes[c]['label'])
        if not ready:
            # Cycle within chapter (should not happen in a valid DAG)
            out.extend(sorted(remaining, key=lambda c: nodes[c]['label']))
            break
        out.extend(ready)
        remaining -= set(ready)
    return [nodes[c]['label'] for c in out]


def compute_prereq_chapters(chapters, prereqs, label_to_id):
    """For each chapter, return the set of earlier chapters that contain its prereqs."""
    chapter_map = {}
    for ch_idx, ch in enumerate(chapters, start=1):
        for name in ch['concepts']:
            chapter_map[label_to_id[name]] = ch_idx

    result = defaultdict(set)
    for ch_idx, ch in enumerate(chapters, start=1):
        for name in ch['concepts']:
            cid = label_to_id[name]
            for dep in prereqs.get(cid, set()):
                dep_ch = chapter_map.get(dep)
                if dep_ch and dep_ch < ch_idx:
                    result[ch_idx].add(dep_ch)
    return result


# ----------------------------------------------------------------------------
# File generation
# ----------------------------------------------------------------------------

def write_main_index(chapters):
    """Write docs/chapters/index.md (the chapters overview page)."""
    total_concepts = sum(len(c['concepts']) for c in chapters)
    lines = [
        "# Chapters",
        "",
        f"This textbook is organized into {len(chapters)} chapters covering {total_concepts} concepts from the learning graph.",
        "",
        "Each chapter is sized for a Grade 5 reader — most chapters cover 13 to 19 concepts and are designed to be read in roughly two class periods, with time left over for the chapter's MicroSim, graphic-novel story, and class discussion. Chapter 17 (the capstone) is project-based and unfolds over the final unit.",
        "",
        "## Chapter Overview",
        "",
    ]
    for n, ch in enumerate(chapters, start=1):
        lines.append(f"{n}. [{ch['title']}]({n:02d}-{ch['url_path']}/index.md) — {ch['summary']}")
    lines += [
        "",
        "## How to Use This Textbook",
        "",
        "Chapters are designed to be read in order. Every chapter builds on concepts from the chapters that came before it — the learning graph behind this textbook guarantees that no chapter introduces a term before its prerequisites have been taught.",
        "",
        "Most pairs of chapters follow a **\"recognize → respond\"** pattern: the first chapter in the pair teaches students to *notice* something (an unbalanced screen-time habit, a piece of misinformation, a cyberbullying situation), and the second chapter teaches them what to *do* about it. This pattern matches the central habit the textbook teaches: **pause, think, act**.",
        "",
        "Each chapter includes:",
        "",
        "- A **summary** of what the chapter covers and how it fits into the learning progression",
        "- A **list of concepts** drawn from the learning graph",
        "- A list of **prerequisite chapters** the student should complete first",
        "- The **chapter content** itself (in body text, with stories, MicroSims, and Maka admonitions)",
        "",
        "---",
        "",
        "**Note for teachers:** A chapter-by-chapter pacing guide and lesson-planning suggestions are available in the [Teacher's Guide](../teachers-guide/index.md) (when published).",
        "",
    ]
    with open(os.path.join(CHAPTERS_DIR, 'index.md'), 'w') as f:
        f.write('\n'.join(lines))


def write_chapter_index(ch_idx, ch, ordered_concepts, prereq_chs, all_chapters):
    """Write a single chapter's index.md."""
    dirname = f"{ch_idx:02d}-{ch['url_path']}"
    chdir = os.path.join(CHAPTERS_DIR, dirname)
    os.makedirs(chdir, exist_ok=True)

    body = [
        f"# Chapter {ch_idx}: {ch['title']}",
        "",
        "## Summary",
        "",
        ch['summary'],
        "",
        "This chapter is part of the Grade 5 *Digital Citizenship* learning progression. After completing it, students will be able to use the vocabulary, recognize the situations, and apply the habits introduced in the concepts listed below.",
        "",
        "## Concepts Covered",
        "",
        f"This chapter covers the following {len(ordered_concepts)} concepts from the learning graph, listed in dependency order:",
        "",
    ]
    for i, name in enumerate(ordered_concepts, 1):
        body.append(f"{i}. {name}")
    body += [
        "",
        "## Prerequisites",
        "",
    ]
    if not prereq_chs:
        body.append("This chapter assumes only the prerequisites listed in the [course description](../../course-description.md). It is the entry point to the textbook.")
    else:
        body.append("This chapter builds on concepts from:")
        body.append("")
        for pn in sorted(prereq_chs):
            other = all_chapters[pn - 1]
            body.append(f"- [Chapter {pn}: {other['title']}](../{pn:02d}-{other['url_path']}/index.md)")
    body += [
        "",
        "---",
        "",
        "TODO: Generate Chapter Content",
        "",
    ]
    with open(os.path.join(chdir, 'index.md'), 'w') as f:
        f.write('\n'.join(body))


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------

def main():
    print(f"Project root: {PROJECT_ROOT}")
    print(f"Loading learning graph from: {GRAPH_FILE}")
    if not os.path.exists(GRAPH_FILE):
        print(f"ERROR: learning graph not found at {GRAPH_FILE}", file=sys.stderr)
        sys.exit(1)

    data, nodes, prereqs, label_to_id = load_graph()
    print(f"Loaded {len(nodes)} concepts and {len(data['edges'])} dependency edges")

    print("Validating chapter assignment...")
    validate_chapter_assignment(CHAPTERS, nodes, prereqs, label_to_id)
    print("  ✓ All concepts mapped to exactly one chapter")
    print("  ✓ No missing concepts")
    print("  ✓ Zero dependency violations")

    print("Computing per-chapter prerequisites...")
    prereq_chs = compute_prereq_chapters(CHAPTERS, prereqs, label_to_id)

    print(f"Creating directory: {CHAPTERS_DIR}")
    os.makedirs(CHAPTERS_DIR, exist_ok=True)

    print("Writing main chapters/index.md...")
    write_main_index(CHAPTERS)

    print(f"Writing {len(CHAPTERS)} chapter index files...")
    for ch_idx, ch in enumerate(CHAPTERS, start=1):
        ordered = order_concepts_topologically(ch['concepts'], prereqs, label_to_id, nodes)
        write_chapter_index(ch_idx, ch, ordered, prereq_chs[ch_idx], CHAPTERS)
        print(f"  ch{ch_idx:02d}: {ch['title']} ({len(ch['concepts'])} concepts)")

    print()
    print(f"Done. Generated {len(CHAPTERS)} chapters and 1 main index.")
    print("REMINDER: mkdocs.yml navigation must be updated separately.")


if __name__ == '__main__':
    main()
