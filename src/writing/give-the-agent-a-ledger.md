---
title: "Give the agent a ledger, not a spreadsheet export"
description: "Most disappointing AI results in accounting come from what the model was allowed to see. Fix the access before you blame the model."
date: 2026-11-23
order: 5
---

The usual way to try AI on accounting work is to export a report, paste it into a chat window and ask a question. The answer is often poor, and people conclude that the model isn't ready.

Usually the model is fine and the export is the problem.

## An export is a photograph

A trial balance pasted into a chat is a picture of the ledger at one moment, with most of the detail removed. The model can't open the transaction behind a balance or check whether an invoice was paid. It can't see last month. Ask it why receivables went up and it has two options: say it doesn't know, or produce something plausible. Models are trained to be helpful, so you tend to get the second.

A person given the same printout and no system access would do no better. We would not call that person a bad accountant. We would give them a login.

## Let it query

The alternative is to connect the model to the accounting system so that it can ask its own questions. The Model Context Protocol is a standard way of doing this: a small server sits in front of the ledger and offers the model a set of tools, such as listing invoices, reading the trial balance, or fetching a contact's history.

I maintain a fork of the open-source [Xero MCP server](https://github.com/XeroAPI/xero-mcp-server) for this purpose, with changes that include tools for Australian payroll. With it, "why did receivables go up?" becomes a short investigation. The model pulls the aged receivables, sees which customers moved, looks at their recent invoices and reports what it found, with the invoice numbers. That answer can be checked. The answer from the export could only be believed.

## Access is a control decision

Giving software a way into the ledger should make any accountant slightly nervous. That instinct is right, and it should shape the design.

**Read by default.** Most of the value is in reading. An agent that can see everything and change nothing can do no damage, and it is useful straight away.

**Draft by exception.** Where the agent does write, it writes drafts: a draft invoice, a draft journal. A person approves and posts. The approval step already exists in the accounting system, and it should be used.

**Narrow tools.** A tool that lists invoices for one contact is safer than a tool that runs any query. Each tool should do one job, and the agent should only have the ones the job needs.

**Validate what the model sends.** Model output is untrusted input. One of my changes to that server was small and typical: an employee identifier is checked to be a properly formed GUID before it goes anywhere near a query filter. A model can be confused, or manipulated by text in a document it has read, into sending something else. The check costs one line.

These are the questions you would ask before giving a new team member system access: what do they need to see, what may they change, and who approves it. The answers carry over.

## The procedure matters more than the model

The last piece is the least glamorous. Access lets the model see. It does not tell the model how the work is done.

A reconciliation has an order: which report to pull first, what to tie it to, which differences are expected, what to do with the ones that aren't. If that sequence lives in someone's head, a model will improvise a different one each time. If it is written down as a reusable skill with the steps, the checks and the definition of done, the model follows it. A new team member could follow it too.

I have come to think this is the main benefit of bringing agents into finance work. You have to write the procedure down precisely enough for something with no context to follow it, and plenty of procedures have never been written at that level. Getting them there is useful whether or not a model ever runs them.

So the order I'd suggest is access first, then permissions, then procedure. Which model you choose comes last and matters least.
