# Pricing

**Status: not tested.** The consumer panel has not run, so there is no Van Westendorp range from simulated buyers. What follows is a hypothesis built from public competitor prices ([competitors.md](competitors.md)) and the CFO's margins ([cfo.md](cfo.md)). Run `/founder-consumer` then `/founder-pricing` to test it.

## What the evidence says

- **US:** the packages ($110, $350, $550) sit below the public freelancer range of about $500 to $5,000. The CFO shows the business only needs about 2 projects a month to break even at $1,500 and about 3 at today's blended $740.
- **India:** ₹8,000 / ₹25,000 / ₹40,000 sit inside the freelancer range of ₹10,000 to ₹80,000, so no urgent change.
- **A formula quirk:** the quote builder charges the per-page rate on all pages including the default 5, so a Basic quote with 5 pages is $110 + $150 = $260. Decide whether that is intended.

## Hypothesis to test: a US price ladder (good / better / best)

| Tier | Today | Test |
|---|---:|---:|
| Starter (5 pages, fast, custom) | $110 | $750 |
| Growth (more sections, CMS, animations) | $350 | $1,500 |
| Studio (design system, custom interactions) | $550 | $3,000 |
| B2B (calls, proposals, AMC) | custom | custom, from $3,000 |
| AI automation / integrations | $150 to $350 | quote per workflow; lead with this |

Keep INR prices for the India market unless real India conversations say otherwise.

## What to test first

1. Put the Growth tier at $1,500 on the US quote page and compare the number of quote requests against the $350 version over four weeks.
2. Offer the AI automation or integrations work as a standalone, priced service.
3. Ask five real prospects what they expected to pay before showing a price.

The margin impact at the same volume is in the CFO note. It is an upper bound: higher prices usually mean fewer buyers.
