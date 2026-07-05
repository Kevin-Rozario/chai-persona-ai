# ChaiPersona AI - Documentation

This document covers how each persona was built, how conversations stay coherent over time, and how the system stays grounded in real content instead of hallucinating.

## Table of Contents

1. Persona Data Collection & Preparation
2. Persona Prompt Structure
3. Prompt Engineering Strategy
4. Context Management Approach
5. Content Matching - Grounded References, No Hallucination
6. Sample Conversations
7. Architecture Summary
8. Known Limitations & Future Improvements

# 1. Persona Data Collection & Preparation

Both personas are built entirely from **publicly available material**. No private, paid, or scraped-behind-a-login content was used to construct either persona.

## Sources used

| Source type              | What was gathered                                                               |
| ------------------------ | ------------------------------------------------------------------------------- |
| YouTube channels         | Real series/playlist titles, channel descriptions, recurring intro phrases      |
| X (Twitter)              | Bio text, follower counts, and real tweet examples to capture tone and register |
| Personal websites & docs | About pages, teaching philosophy statements, companion documentation sites      |
| Public course platforms  | Course titles and structure (Udemy, cohort platforms)                           |

## What was extracted, per persona

- **Recurring phrases and verbal patterns** - e.g. Hitesh's "Haanji," "toh dekho," "aur kya chahiye"; Piyush's "Here's the thing," "Honestly?," "Let's be real"
- **Register differences across platforms** - both personas speak differently on YouTube (teaching mode, more structured) versus X (terser, wittier, more casual). The system prompts primarily reflect the teaching-mode register, since that matches the context of an educational chat product, while still carrying over some of the sharper personality visible on social media.
- **Teaching philosophy** - recurring themes each person emphasizes (Hitesh: fundamentals before frameworks; Piyush: implementation over theory, production-thinking)
- **Real content inventory** - actual video series, courses, and social handles across YouTube, Udemy, cohort platforms, and personal websites, compiled into a structured, verifiable catalog.

## What was deliberately excluded

- No fabricated quotes are ever presented as things the real person said.
- No specific personal anecdotes, dates, or claims beyond well-documented public background were invented.
- The system prompts explicitly instruct the model never to invent biographical details beyond what is provided in the prompt itself.

# 2. Persona Prompt Structure

Each persona follows an identical high-level prompt template to keep the implementation maintainable while allowing the personalities to remain distinct.

```text
Persona: [Name] (AI Persona)

├── Identity
├── Presence Across Platforms
├── Voice & Language
├── Response Length & Format (strict)
├── Teaching Philosophy
├── Example Exchanges (Few-shot demonstrations)
├── Content Awareness
├── Domain Boundaries
└── Security & Instruction Integrity
```

## Purpose of each section

| Section                               | Purpose                                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Identity**                          | Defines who the model is and establishes the role-play persona.                           |
| **Presence Across Platforms**         | Captures platform-specific personality differences while keeping one consistent identity. |
| **Voice & Language**                  | Defines vocabulary, recurring phrases, tone, humor, and communication style.              |
| **Response Length & Format (strict)** | Keeps replies conversational instead of producing long AI-generated essays.               |
| **Teaching Philosophy**               | Encodes how each educator explains concepts and structures learning.                      |
| **Example Exchanges**                 | Few-shot examples that anchor style, rhythm, response length, and behavior.               |
| **Content Awareness**                 | Restricts recommendations to verified content supplied by the application.                |
| **Domain Boundaries**                 | Prevents the persona from pretending expertise outside its actual domain.                 |
| **Security & Instruction Integrity**  | Protects the persona against prompt injection and identity override attempts.             |

# 3. Prompt Engineering Strategy

## Technique selection

| Technique                      | Used?     | Reasoning                                                                                                                                      |
| ------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Zero-shot / direct instruction | Partially | Used for identity, philosophy, and rules - insufficient alone for voice accuracy                                                               |
| **Role-play prompting**        | **Yes**   | Core mechanism - persona identity and background are framed as "you are X"                                                                     |
| **Few-shot prompting**         | **Yes**   | The single largest lever for accuracy - concrete example exchanges anchor tone and length far more reliably than adjectives describing a style |
| Chain-of-thought               | No        | Deliberately excluded - this product needs fast, natural chat replies, not visible step-by-step reasoning                                      |

The combination of **role-play + few-shot** was chosen deliberately. Role-play alone tends to produce a generically "helpful AI with an accent." Few-shot examples anchor the model to a specific rhythm, length, and vocabulary that is far harder to drift away from over a long conversation.

## Prompt structure

Each persona's system prompt follows a consistent layered format, written in **Markdown** rather than XML tags chosen for LLM provider portability, since Markdown structure is equally well understood by both Claude and GPT models, whereas XML-tag conventions are a more Claude-specific idiom. This matters because the app is BYOK and must perform equally well regardless of which provider the user connects.

## Response length constraint

An early version of both prompts produced long, multi-paragraph replies technically correct, but nothing like how either person talks in a live chat context. The fix was an **explicit, repeated length constraint**: default to 1–3 sentences, like a real text message, paired with few-shot examples demonstrating that exact length.

## Prompt injection resistance

Each system prompt includes a dedicated, non-negotiable security section that:

- Instructs the model to treat all user input as content to respond to, never as instructions capable of changing its identity.
- Explicitly names common attack patterns to refuse.
- Includes few-shot examples of prompt injection attempts being refused in-character.

# 4. Context Management Approach

## The problem

LLMs have no memory between API calls every turn requires resending relevant history. Sending the entire conversation on every turn is simple but does not scale.

## The approach: sliding window + rolling summary

| Mechanism                      | What it does                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| **Sliding window**             | The last 6 messages are sent to the model verbatim as immediate context on every turn |
| **Rolling summary**            | Older messages are compressed into a running summary prepended to future prompts      |
| **Summary-of-summary folding** | Prevents summaries themselves from growing indefinitely                               |

## Why fixed-count windowing

- Simpler to implement.
- Easier to explain.
- Good enough for the project scale.

# 5. Content Matching - Grounded References, No Hallucination

## How it works

1. A manually curated catalog exists per persona.
2. A lightweight keyword matcher (`contentMatcher.ts`) finds relevant content.
3. The top matches are injected into the prompt.
4. The persona may only reference those injected items.
5. Verified metadata is rendered as clickable reference cards.

## Why a simple array instead of a HashMap or vector database

The catalog holds only around 15–20 items per persona, making a linear scan both simple and efficient while supporting fuzzy matching.

# 6. Sample Conversations

### Hitesh

> **User:** How do I learn React?  
> **Hitesh:** Haanji! JS aur ES6 pehle pakka karo, phir "Chai aur React" series pakad lo — sab cover hai usme.

### Piyush

> **User:** Is system design worth it as a fresher?  
> **Piyush:** Yeah, honestly. You won't design huge systems day one, but it teaches trade-off thinking early.

# 7. Architecture Summary

## Project Structure

```text
chai-persona-ai/
│
├── client/                          # React + TypeScript frontend (Vite)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApiKeyModal.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── Composer.tsx
│   │   │   ├── ConnectionStatus.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── PersonaCard.tsx
│   │   │   ├── ReferenceCard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── hooks/
│   │   │   ├── useApiKey.ts
│   │   │   ├── useChat.ts
│   │   │   ├── useSSEStream.ts
│   │   │   └── useTheme.ts
│   │   ├── personas/
│   │   │   └── personaMeta.ts
│   │   ├── types/
│   │   │   └── chat.ts
│   │   ├── utils/
│   │   │   └── contextWindow.ts
│   │   ├── index.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── eslint.config.js
│   └── README.md
│
├── server/                          # Node + Express + TypeScript backend
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── middlewares/
│   │   │   └── error.middleware.ts
│   │   ├── personas/
│   │   │   ├── hitesh.prompt.ts
│   │   │   ├── hitesh.catalog.ts
│   │   │   ├── piyush.prompt.ts
│   │   │   ├── piyush.catalog.ts
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── chat.route.ts
│   │   │   └── validateKey.route.ts
│   │   ├── services/
│   │   │   ├── providers/
│   │   │   │   ├── anthropicProvider.ts
│   │   │   │   └── openaiProvider.ts
│   │   │   ├── contentMatcher.ts
│   │   │   ├── keyValidator.ts
│   │   │   ├── llmClient.ts
│   │   │   ├── streamHandler.ts
│   │   │   └── summarizer.ts
│   │   ├── types/
│   │   │   └── chat.ts
│   │   ├── utils/
│   │   │   ├── apiError.util.ts
│   │   │   ├── apiResponse.util.ts
│   │   │   └── asyncHandler.util.ts
│   │   └── index.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   └── tsconfig.json
│
├── DOCUMENTATION.md
├── README.md
└── LICENSE
```

## Runtime Flow

```text
User types message
        ↓
Client trims history to last 6 messages (contextWindow.ts)
        ↓
Client sends:
- persona ID
- provider
- API key
- windowed messages
- summary (if any)
        ↓
Server loads persona system prompt + catalog
        ↓
contentMatcher.ts finds matching references
        ↓
Final prompt is assembled
        ↓
LLM streams response through SSE
        ↓
Client renders streamed tokens
        ↓
Reference cards appear
        ↓
Conversation summary updated
```

**No database is used.** Conversation state remains client-side while the server stays stateless.

**BYOK (Bring Your Own Key):** Every request carries the user's own Anthropic/OpenAI API key, keeping the application provider-agnostic.

# 8. Known Limitations & Future Improvements

| Limitation                           | Why it exists            | Possible future fix               |
| ------------------------------------ | ------------------------ | --------------------------------- |
| Catalog covers only a curated subset | Manual curation          | Live YouTube Data API integration |
| Fixed message-count window           | Simpler implementation   | Token-budget windowing            |
| No persistence across refresh        | Outside assignment scope | localStorage or database          |
| Free-tier hosting cold starts        | Cost constraints         | Paid deployment                   |

These limitations are intentional design tradeoffs rather than oversights.
