# Brand (12 Nov 2026)

Built on `marketing.md` (positioning v1: *for Indian B2B traders and distributors who lose orders because quotes go out slowly, ShapeKraft turns enquiries into quotes in minutes*), `idea.md`, `competitors.md` and the brand already live on shapekraft.co (`BRAND_DESIGN.md`). No buyer panel has run, so "why buyers buy" is a hypothesis from the board and one client.

## 1. The name

**Recommendation: keep "ShapeKraft".** You already own shapekraft.co and shapekraft.in, have a live site, a logo system, a LinkedIn page and client work under it. Renaming costs more than it fixes. The real problem is **search confusion** (a Google search for "ShapeKraft" currently returns unrelated "ShapeCraft" results), which is fixed with disambiguation, not a new name. The new focus also gets a **product name** so buyers remember what they're buying.

### Ten candidates considered (business name or product line)

| # | Name | Style | What it says | Out loud / on an icon | Risk |
|---|---|---|---|---|---|
| 1 | **ShapeKraft** (keep) | Invented | Crafted, shaped, built | Clear; "Kraft" needs spelling once | Confused with "ShapeCraft" in search |
| 2 | **ShapeKraft RFQ Desk** | Descriptive product | The desk that answers RFQs | Plain; says the job | "RFQ" jargon outside B2B |
| 3 | **QuoteFast by ShapeKraft** | Descriptive product | Speed of quoting | Easy to say; generic-sounding | Very likely used by others; weak trademark |
| 4 | Kraft Quote | Invented | Quoting, from the Kraft family | Short | "Kraft" is a large food brand — confusion and trademark risk |
| 5 | TradeDesk Studio | Descriptive | For traders | Clear | "The Trade Desk" is a big ad-tech company — avoid |
| 6 | Enquiry2Order | Descriptive | Enquiry to order | Clumsy out loud | Numbers in names read badly |
| 7 | Bharat B2B Web | Place | Indian B2B | Clear in India | Generic; can't be protected; limits global |
| 8 | Ankit/Aniket Studio | Founder's name | Personal | — | **Ruled out:** no founder identity in public |
| 9 | Sitewright | Evocative | A maker of sites | Nice ring | Doesn't say B2B or quotes; new name from zero |
| 10 | Quoteline | Evocative | A line straight to the quote | Easy, 2 syllables | Likely taken in insurance/software |

**Shortlist:** (1) **ShapeKraft** as the studio, (2) **ShapeKraft RFQ Desk** as the product name for the RFQ Launch Kit's automation, (3) QuoteFast by ShapeKraft as a backup product name.

### Checks you must finish yourself

I can only run public searches; a trademark lawyer confirms availability, and nothing is protected until you register it.

- **Trademark — India (main market):** IP India public search, https://tmrsearch.ipindia.gov.in/ — classes **42** (website design and software services) and **35** (business/marketing services). Also check **9** if the RFQ Desk becomes downloadable software.
- **Trademark — US:** USPTO search, https://tmsearch.uspto.gov/ — classes 42 and 35.
- **Trademark — UK/EU (only if you sell there):** UKIPO https://trademarks.ipo.gov.uk/ and EUIPO https://euipo.europa.eu/eSearch/ — classes 42 and 35.
- **Domains:** shapekraft.co and shapekraft.in are yours. For the product, check rfqdesk.in / shapekraft.in/rfq (a sub-path costs nothing and is the safest choice).
- **Handles:** check "shapekraft" on LinkedIn (company page exists), Instagram, X, YouTube; claim the same handle everywhere even if unused.
- **Confusion:** no overlap with competitor names in `competitors.md` (they're categories, not named firms). Main confusion is the unrelated "ShapeCraft" names; avoid "Craft" spelling anywhere.

## 2. Voice and promise

**One-line promise:** *Every enquiry gets a fast, correct answer — and the site that brings it in is built to last.*

**Tagline options:**
1. **Engineered, not just designed.** (current; keep for the studio)
2. **From enquiry to quote in minutes.** (for the RFQ Desk / B2B pages and outreach)
3. Fast sites. Faster quotes.

**Voice: three adjectives**

| Adjective | Do | Don't |
|---|---|---|
| **Plain-spoken** | "Quotes go out in minutes." | "Leverage AI-driven synergies." |
| **Precise** | Use their real numbers: load time, enquiries, hours saved | Vague promises ("boost your growth") |
| **Respectful of the trade** | Speak like a supplier who understands RFQs, MOQs, price lists | Talk down, or use startup slang with a 30-year-old trading firm |

**Before / after** (homepage hero line):
- Before: "We don't design websites. We engineer them."
- After (B2B pages): "Your buyers send RFQs. We make sure every one gets a quote the same day."
(The current line stays on the studio homepage; the "after" line leads B2B landing pages and outreach.)

## 3. The look (brief)

Keep the existing system from `BRAND_DESIGN.md`; it's distinct from the plain blue/white of most Indian B2B sites and from "ShapeCraft" products. Contrast was checked (WCAG ratios computed from the hex values):

| Colour | Hex | Job | Text on it | Contrast | AA? |
|---|---|---|---|---:|---|
| Burnt Sienna | `#E97451` | Dominant: page, hero, nav | Obsidian `#0B0B0F` | 6.62 | ✅ |
| | | | Obsidian-700 `#26262D` (muted) | 5.07 | ✅ |
| | | | Cream `#FFFDF9` | 2.92 | ❌ never cream text on sienna |
| | | | Teal-600 `#0B646C` | 2.32 | ❌ never teal text on sienna (use teal-900 `#04282B`, 5.27 ✅) |
| Cream Linen | `#FAF0E6` | Content bands, cards, PDFs | Obsidian | 17.47 | ✅ |
| | | | Teal-600 (labels) | 6.11 | ✅ |
| Royal Teal | `#0B646C` | Accent: buttons, highlights | Cream `#FFFDF9` | 6.77 | ✅ |

**Type:** Syne (display) + Inter (text), both free under the SIL Open Font License via Google Fonts; already loaded with `next/font`. Note: `layout.tsx` also loads Black Ops One (OFL, free) — use it nowhere public unless it has a clear job, or drop it to save load time.

**Logo brief:** the existing mark (square + diamond + cross, with a corner bracket) stays. It must:
- read at **32px** (favicon, WhatsApp/LinkedIn avatar): use the symbol only, no wordmark, 2px minimum strokes
- work in **one colour** (obsidian on cream, cream on teal) for PDFs and invoices
- sit next to "ShapeKraft — web engineering studio" wherever the name could be confused
- avoid: gradients, 3D, anything that looks like 3D-modelling software (feeds the ShapeCraft confusion)

If you want new concepts for an RFQ Desk sub-mark, I can draft SVG concepts; they'd be concepts, not a finished logo.

**The first five touchpoints**

1. **Homepage / B2B landing page:** sienna hero, the "after" line above, the live chemical-trading case study (with permission) as the first proof, one button: "Get a free speed scan".
2. **The outreach message + speed-scan report** (our "packaging"): one-page cream PDF, their real score, three fixes ranked by money, studio logo, signed "— ShapeKraft".
3. **The quote PDF / confirmation:** already branded (cream, obsidian, teal labels); add "Prepared for {name}" (done in PR #1) and the 40/30/30 schedule.
4. **The first LinkedIn post:** hook 3 from `marketing.md` ("WhatsApp is where the RFQ arrives. It's also where it gets lost.") on a sienna card with the RFQ demo screenshot.
5. **The reply to the first complaint:** same day, plain words, what went wrong, what we're doing, by when — no excuses, no jargon. Template: "You're right — {what happened}. We've {fix} and will confirm by {time}. Sorry for the hassle."

---
*Not legal advice on trademarks.*
