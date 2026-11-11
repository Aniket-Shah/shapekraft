# Pricing curve (Van Westendorp)

**Not run.** The consumer panel (`/founder-consumer`) has not been run for ShapeKraft, so there are no buyer price answers (too cheap / bargain / expensive / too expensive) and no acceptable price range. No range is invented here.

To get one: run `/founder-consumer --quick` (20 simulated B2B trader buyers) for a first look, or better, ask 5–10 real prospects the four questions and save them as a CSV with columns `too_cheap, cheap, expensive, too_expensive`, then:

```bash
python3 <founder-pricing>/van_westendorp.py founder/panel/answers.csv --price 60000 --out founder/pricing-curve.md
```
