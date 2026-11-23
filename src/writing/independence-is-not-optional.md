---
title: "Independence is not optional: what audit teaches about AI review"
description: "Accounting worked out long ago that you cannot check your own work. AI agents are relearning it from scratch."
date: 2026-11-23
order: 3
---

Ask an AI agent to review the code it has just written and it will usually tell you the code is good. Ask it again and it may find a problem, fix it, and introduce another. People who build with agents call this grading your own homework.

Accountants have a longer name for the cure. We call it independence, and the profession has spent more than a century working out what it takes.

## The preparer can't be the reviewer

Every finance control worth having is some version of one idea: the person who does a thing should not be the only person who checks it. Whoever raises the payment doesn't approve it. Whoever keeps the books doesn't audit them. Maker and checker are different people.

The reason isn't that preparers are dishonest. It is that everyone is blind to their own assumptions. If I misread a contract while preparing a schedule, I will misread it the same way when I look the schedule over. The error is in how I understood the problem, and I carry that understanding into the review.

A model has the same weakness, more consistently. A second pass by the same model, with the same context, shares every blind spot of the first. It can catch slips. It cannot catch what it never considered.

## What I built around this

I wrote an open-source workflow for AI coding agents called [AFK](/projects/#afk), and most of its design comes from this one observation. When an agent finishes a piece of work, a different model reviews it. The reviewer comes from a different model family, sees the real change, and has read-only access. If the reviewer would be the same model that wrote the work, it steps aside for one that isn't.

Three ideas in it are lifted directly from audit practice.

**Independence in fact.** The reviewer must be a different mind from the author. Running the author twice does not qualify. In audit terms, you do not get assurance from the client's own staff.

**Evidence over assertion.** A reviewer's finding is treated as a hypothesis until someone demonstrates the consequence: a failing test, a traced path to a wrong result. An auditor who says "this balance looks wrong" has raised a query. They have not found a misstatement. Requiring the demonstration is what stops review turning into an endless exchange of opinions.

**A record that outlives the conversation.** Every finding gets an identifier and a disposition: fixed, refuted with evidence, or deferred with a reason. Nothing is closed by silence. Anyone who has worked through an audit query list will recognise the shape.

## The same applies to finance work

The lesson travels back the other way. If a model prepares a reconciliation, a second prompt to the same model asking "is this right?" is not a review. It is the preparer initialling their own work.

Real independence in an AI finance workflow looks like one of these:

- A different model checks the output, with no access to the first model's reasoning.
- A deterministic check does. A script that confirms the schedule ties to the ledger is perfectly independent, because it has no opinions at all.
- A person does, with the evidence in front of them and enough time to look.

The second is underrated. The most reliable reviewer of a model's arithmetic is twenty lines of code, and it costs nothing to run.

## Independence costs something

Independent review is slower and costs more than self-review. That's the point. An audit that cost nothing and never disagreed would be worth exactly that.

The useful question is how much assurance a piece of work needs. A draft email needs none. A journal that moves profit needs a lot. Controls should scale with what goes wrong if the work is wrong, and that has always been true. The only new part is that one of the workers is a model.
