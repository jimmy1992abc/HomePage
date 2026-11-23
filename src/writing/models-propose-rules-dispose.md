---
title: "Models propose, rules dispose: lessons from a trading system"
description: "Building software that handles real money teaches you quickly which decisions a model should never be the last word on."
date: 2026-11-23
order: 4
---

For a while now I have been building a personal research and trading platform for US equities. It reads market data, analyses it with language models, manages risk, and keeps a record of what it did. I am not going to describe the strategy, and nothing here is investment advice. What I want to write down is the structure, because it turned out to be the clearest lesson I have had in where a model belongs in a system that touches money.

The short version is in the title. The model proposes. Rules decide.

## Where a wrong answer is cheap

A language model is good at reading. Give it filings, news and price history and it will produce a view faster and more widely than I could. Some of those views are wrong. That is fine, because a wrong research note costs nothing until somebody acts on it.

So research is the right place for the model: high value when it is right, low cost when it is wrong, and easy to compare against other sources.

Order placement is the opposite. A wrong order costs money at once and can't be taken back. That step should not depend on a system that is sometimes confidently mistaken.

## The model does not hold the keys

In my system the limits are ordinary code. How large a position may be, where the stop sits, how much may be at risk at once. A model's output passes through those rules on its way to becoming an order. It cannot edit them, argue with them, or talk its way around them, because they are not written in a language it can negotiate with.

This is the part people get wrong when they put a risk limit in a prompt. "Never risk more than X" in a system prompt is a request. The same limit as an `if` statement before the order is sent is a control. One of them holds on a bad day.

Finance people will recognise the idea. A delegation of authority is not a suggestion to the person holding the card. The system declines the transaction.

## Shadow first

A new idea in my system runs in shadow before it is allowed to trade. It sees live data, makes its decisions, and records what it would have done. Nothing is sent. After enough time I can compare what it would have done with what happened.

A backtest can't give you that. A backtest tells you the idea would have worked on data you have already seen. Shadow running tells you how it behaves on data nobody had seen, including the days when a feed is late or a field comes back empty.

The same approach works for automation in finance. Run the new reconciliation alongside the old one for two closes. Let the model draft the commentary while a person still writes the real one. Compare them. You find out what it gets wrong while nothing depends on it.

## Log the inputs, not just the outcome

Every decision the system makes is written down with what it knew at the time: the data, the model's reasoning, the rule that allowed or blocked it. The morning after, I read the log.

That review is where the system improves. And it only works because the record has the inputs in it. "Sold at this price" tells me nothing. "Sold because of this signal, on this data, allowed by this rule" tells me whether the decision was good and unlucky, or bad and lucky. Those need opposite responses.

An audit trail has always been this: enough of a record that someone who wasn't there can reconstruct why. It matters more when the decision-maker is a model, because you cannot ask it afterwards.

## More than one supplier

One practical lesson. Any model provider will be unavailable at some point, usually at an inconvenient one. The system has a chain of providers and falls through to the next when the first does not answer. No treasurer keeps all the cash at one bank, and the reasoning is the same.

## What it comes down to

Use the model where being wrong is cheap. Put hard rules where being wrong is expensive. Test in shadow, keep the evidence, and read it. None of that is specific to trading. A trading system makes it obvious because the feedback arrives in dollars the next morning.
