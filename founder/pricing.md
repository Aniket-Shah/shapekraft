# Pricing (12 Nov 2026)

**Status: a hypothesis to test, not proven.** No buyer panel has run, so there is no Van Westendorp range (`pricing-curve.md`). This price is set from what competitors charge (`competitors.md`), what the business needs (`cfo.md`, `numbers.json`) and the board's conditions (`board.md`). Simulated or real buyer answers should decide between the test prices below.

## What changed and why

The board (3 FUND IF, 4.3/10) said the pitch prices make ShapeKraft a commodity, and that **the automation should carry the price, not the pages**. It also said to focus on one buyer for 90 days: **Indian B2B traders and distributors who need a catalogue + RFQ flow**. So pricing now leads with that offer. The generic site tiers stay on the website as secondary options.

## 1. The price

**"RFQ Launch Kit" (India, the headline offer): ₹60,000 setup + ₹5,000 a month.**

- What it includes: a fast catalogue site (up to 15 pages) + **RFQ → auto-quote** workflow (enquiry captured, quote drafted from the client's price list, sent on email/WhatsApp, logged) + enquiry alerts on WhatsApp. The monthly plan runs and maintains the automation, hosting, backups and 2 hours of changes.
- **Against competitors:** Indian agencies charge about ₹50,000–₹2,00,000+ for a business site alone; automation agencies commonly charge $1,500–$12,000 per workflow. ₹60,000 for both sits at the low end of the agency range for the site and well below the automation range, which is right for a studio with one case study.
- **Against what the business needs:** using the founder pack's cost estimates converted at an **assumed ₹85 per $1** (fixed costs about ₹1,59,000 a month, of which ₹1,27,500 is the *placeholder* founder draw), each ₹60,000 kit leaves about ₹54,500 after direct costs. **Break-even ≈ 3 kits a month** with the draw, or **under 1 a month** without it. Ten clients on the monthly plan bring ₹50,000 a month of recurring revenue, enough to cover all non-draw costs about 1.5 times over.
  - At ₹35,000 (a site-only Growth package) break-even is about 5 a month with the draw. That's why the generic tier can't be the headline.
- **Open question:** the ₹1,27,500 founder draw is a placeholder from the earlier CFO model. With a full-time salary, the real number the business must pay the founder decides everything; confirm it in `/founder-cfo`.

## 2. The ladder (India B2B)

| Rung | What | Price | Reason to step up |
|---|---|---|---|
| Good | **Catalogue Site**: up to 10 pages, enquiry → WhatsApp alert | ₹35,000 + optional ₹1,500/mo care | Gets them online and getting enquiries |
| **Better (headline)** | **RFQ Launch Kit**: site + RFQ → auto-quote + monthly automation plan | **₹60,000 + ₹5,000/mo** | Quotes go out in minutes, not hours; nobody retypes RFQs |
| Best | **Sales Desk**: Kit + CRM/ERP or Tally integration, proposal/deck templates, follow-up reminders | from ₹1,00,000 + ₹10,000/mo | The whole enquiry-to-order flow in one place |

**US/global (secondary, no outreach for 90 days):** keep the site tiers live on shapekraft.co for inbound only. Starter $750, Growth $1,500, Studio $3,000; automation from $1,500. At $900 the CFO tool shows break-even 3 projects/month and year 1 profit $17,580; at $1,500 break-even is 2/month and year 1 profit $46,380 (an upper bound; both at the assumed volume).

## 3. The opening offer

**Founding 5 (India B2B):** the first 5 RFQ Launch Kit clients get **₹15,000 off setup (₹45,000) and the first month of the plan free**, in exchange for a written case study with real numbers. **Ends 31 January 2027 or after 5 clients, whichever comes first.** The monthly price is never discounted, so buyers aren't trained to wait for deals.

- No fake anchors: the site must not show a struck-through "was" price that was never charged. Show "Founding rate, 3 of 5 left, until 31 Jan" and the standard price as the price from client 6.

## 4. What to test with real buyers

No panel range exists, so the two test prices come from the competitor range and the CFO's break-even:

- **Test A: ₹60,000 setup + ₹5,000/mo** vs **Test B: ₹75,000 setup + ₹5,000/mo** (Founding 5 discount applies to both).
- **How:** alternate batches of 10 IndiaMART outreach messages; each batch quotes one price after the speed scan. Track reply → call → advance paid per price. After 20 calls, keep the price with the higher **advance-paid count × price**.
- Also ask every prospect the four Van Westendorp questions on the call and log them as CSV for `pricing-curve.md`.

## 5. Top price objections

None recorded: the buyer panel hasn't run and no real objections are logged yet. Run `/founder-consumer --quick` or collect them from the first 10 calls; marketing needs the top three.

---
*Projections from estimated inputs; not financial, legal or tax advice.*
