---
title: "Month-end is a pipeline: where AI helps and where it doesn't"
description: "Close is five kinds of work that happen to share a deadline. Each one wants a different tool."
date: 2026-11-23
order: 2
---

"Use AI for month-end" is not a plan. Month-end is not one task. It is several kinds of work that share a deadline, and they respond to automation very differently. When a close automation disappoints, it is usually because someone pointed a language model at a stage that wanted a script, or a script at a stage that wanted a person.

I find it useful to split the close into five stages and ask the same question of each: what is the right tool, and what does the human still do?

| Stage | Best tool | The human's part |
| --- | --- | --- |
| Gather | Integrations and scripts | Decide what counts as complete |
| Match | Deterministic rules, then a model for the residue | Read the exceptions |
| Draft | Language model | Check it against what actually happened |
| Judge | A person, with a model as research assistant | Make the call and record it |
| Sign | A person | Own it |

## Gather

Bank feeds, subledger reports, payroll files, statements. This is plumbing. It wants an API call or a scheduled export, and it wants to fail loudly when a file is missing.

A language model adds almost nothing here, with one exception: reading documents that have no structure. Pulling the amount, date and counterparty out of a PDF invoice is a good use, provided the extracted fields are validated afterwards like any other untrusted input.

## Match

Reconciliation is matching, and most matching is arithmetic. Amount equals amount, reference equals reference, date within a window. Write those rules as code. They are fast, free and give the same answer every time, which is a property you want in a reconciliation.

The model earns its place on what is left over: the payment that covers three invoices less a discount, the reference with a typo, the one deposit split across two days. It can propose matches for the residue with a reason attached. A person accepts or rejects them. The order matters. Rules first, model second, human last, and the human only ever looks at the small pile.

## Draft

This is where language models are strongest and where I would start if I were introducing them to a sceptical team. Variance commentary, accrual memos, the first version of a board paper, the email asking a budget holder why their spend moved.

The model is working from numbers it has been given and turning them into prose. The risk is not arithmetic. The risk is a plausible explanation that isn't the real one. "Travel costs rose due to increased activity" is the kind of sentence a model produces when it knows the number and not the reason. The control is simple: whoever knows the business reads the draft, and anything they can't confirm comes out.

## Judge

Is this revenue or a liability? Is this asset impaired? Does this provision meet the recognition criteria? These are judgements, and they are the reason the role exists.

A model is useful here as a research assistant. It can find the relevant paragraphs of a standard, list the indicators for and against, and point out which facts are missing. It should not be the one to conclude. When I use a model this way I ask it for the argument on both sides, and I write the conclusion myself, in my own words, with the reasons. If I can't write the reasons, I haven't made a judgement. I've accepted one.

## Sign

No tool. The sign-off is a person saying they have done enough to stand behind the result. Everything upstream exists to make that statement true with less effort.

## What changes

Run the close this way and the hours move. Gathering and matching shrink towards nothing. Drafting shrinks a lot. Judging and signing take the same time they always did, and now make up most of the work.

That is the right outcome. It also means the skill that matters shifts from being quick with a spreadsheet to knowing what could be wrong and where to look.
