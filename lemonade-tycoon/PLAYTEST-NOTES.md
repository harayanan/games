# Playtest Notes: 10-Year-Old Tester Simulation

**Date:** 2026-03-22
**Method:** AI agent roleplaying as a 10-12 year old walking through every screen of the game, evaluating clarity, fun, bugs, and educational value.

---

## TITLE SCREEN

### Issues Found

**MAJOR: "CLICK TO START" only works on the canvas, not obvious where to click**
The click listener was on the `canvas` element only, but the canvas is 480x320 pixels rendered behind the full UI overlay. A kid clicking anywhere on the UI layer (which covers everything) gets nothing. The `#ui` div has `pointer-events: none` on itself but `pointer-events: auto` on all children, so the UI children intercept clicks in unexpected places.

**Fix applied:** Added click listener to the entire `game-container`.

---

## CUTSCENE SCREEN

### Issues Found

**MAJOR: Cutscene text was WAY too much for a 10-year-old**
Originally 8 screens of text a kid had to click through before they could play. Screen 7 said "Profit = Revenue minus Costs" which is an abstract concept for a 10-year-old.

**Fix applied:** Cut to 4 screens. Replaced abstract definitions with concrete language ("Profit means the money you get to KEEP after buying supplies").

**MINOR: No skip button for cutscene**
If the player has played before and restarts, they had to click through all screens again.

**Fix applied:** Added a "SKIP >>" button.

**MINOR: Cutscene says "$20" but doesn't show it visually**
"You have $20" with no visual of money. A kid would absorb this better with a coin counter.

---

## PLANNING SCREEN

### Issues Found

**CRITICAL: Starting a day with ZERO supplies was allowed**
If a kid hit "Start Day" without buying anything, the day ran with 0 inventory. Every customer saw "OUT?" and left. The day was completely wasted with no warning.

**Fix applied:** Now blocks with "No lemonade to sell!" message and error sound. Button flashes red.

**CRITICAL: "sugar: 0.167 per cup" was incomprehensible**
The internal `SUPPLY_PER_CUP` config used `sugar: 0.167`. When sugar inventory depleted, the HUD showed `Math.floor(state.inventory.sugar * 6)` — converting internal fractional units back to "bags." Meanwhile the planning screen showed raw numbers. A kid seeing "have: 4" (bags) in planning but "28" (cups worth) in simulation would be totally lost.

**Fix applied:** Use `1/6` with rounding. Show consistent bag counts everywhere.

**CRITICAL: Profit calculation was wrong — spoilage was double-counted**
In `endDay()`:
- `spoilageCost = state.inventory.ice * SUPPLY_PRICES.ice` charged for leftover ice
- `profit = revenue - supplyCost - totalSpoilage`
- But `supplyCost` already included the cost of ALL ice purchased!

So buying 10 bags of ice ($2.00) and using only 5 meant being charged $2.00 in supplyCost (all ice) AND $1.00 in spoilage for the leftover 5 bags. Paying $3.00 for $2.00 worth of ice. Same issue with lemons.

**Fix applied:** Changed to `profit = revenue - costOfGoodsSold - spoilage` where COGS only counts supplies actually used in cups sold.

**MAJOR: Day 1 hint math was wrong**
The hint said: "Try buying 15 lemons, 5 sugar, 5 ice, 30 cups. That makes ~10 cups of lemonade!"
Actual math:
- 15 lemons / 0.5 per cup = 30 cups
- 5 sugar / 0.167 per cup = ~30 cups
- 5 ice / 0.2 per cup = 25 cups (bottleneck)
- 30 cups / 1 per cup = 30 cups
The bottleneck was ice at 25 cups, not 10. The "~10 cups" claim was wildly inaccurate.

**Fix applied:** Corrected quantities and cup count.

**MAJOR: No feedback when you can't afford something**
If the total cost exceeded money and you clicked "Start Day," the function just called `sfxFail(); return;` with no visual feedback. A kid would think the game was broken.

**Fix applied:** Button flashes red with "Not enough money!" text for 1.5 seconds.

**MAJOR: "80% accurate" forecast had no explanation**
A 10-year-old sees "80% accurate" and has no idea what to do with it. Does it mean there's a 20% chance it's completely wrong?

**Fix applied:** Changed to "Might change! (80% right)".

**MAJOR: Units were inconsistent across the interface**
- Supplies showed "ea" (each) for purchase units
- "2 cups/lemon" means each lemon makes 2 cups
- "6 cups/bag" for sugar, "5 cups/bag" for ice
- The "have:" showed raw unit counts that sometimes were fractional internally
- The sim HUD converted sugar and ice to different numbers than the planning screen

A kid didn't know if they were buying bags, individual cubes, or what.

**Fix applied:** Consistent units everywhere. Added per-item descriptions showing price and yield.

**MAJOR: Cost/cup was static and misleading**
The cost per cup shown was a constant `$0.39` calculated from theoretical perfect usage. But if you over-buy ice that melts, your actual cost per cup is higher.

**Partially addressed:** Still shows theoretical cost but with the spoilage bug fixed, the mismatch is smaller.

**MINOR: +5/-5 buttons clamp silently**
Clicking +5 three times could stop at 12 instead of 15 with no explanation of why.

**MINOR: Price range of $0.25-$5.00 not shown**
A kid might try to go below $0.25 and be confused when it stops.

---

## SIMULATION SCREEN

### Issues Found

**MAJOR: Zero interactivity during simulation**
A 10-year-old is just watching. Only control is speed (1x/2x/5x). No ability to change price mid-day or interact at all. At 1x speed, the sim runs ~50 seconds of passive watching.

**Fix applied:** Default speed set to 2x to reduce boredom.

**MAJOR: 1x speed was boring and too slow**
`SIM_TICK_RATE = 0.5`, with 4 ticks per game-hour, 10 game-hours = 40 ticks = 20 real seconds at 1x. Combined with slow customer walking, it felt sluggish.

**MINOR: Speed keyboard shortcuts (1/2/5) not shown on UI**
Kids wouldn't discover these.

**MINOR: Customers walking off-screen felt abrupt**
Customers who said "$$$!" immediately turned and walked away with no pause.

---

## SUMMARY SCREEN

### Issues Found

**MAJOR: Star rating was based on margin, not absolute profit**
Stars used profit/revenue ratio. A kid who made $2 profit on $3 revenue (67% margin) got 4 stars, while a kid who made $10 profit on $30 revenue (33% margin) got only 2 stars. The second kid objectively did better.

**Fix applied:** Stars now based on absolute profit thresholds ($0→1star, $3→2, $7→3, $12→4, $18→5).

**MAJOR: Profit number was inflated by the double-counting bug**
After the spoilage double-counting was fixed, this resolved itself.

---

## GAME FLOW / ECONOMY

### Issues Found

**CRITICAL: Economy was unbalanced — $50 in 7 days nearly impossible**
Math analysis:
- Need ~$7.14/day average
- Cost per cup: ~$0.39, at $1.00 price = $0.61 profit/cup
- Need ~12 cups/day
- Customer rate on sunny: ~20/day, rainy: ~7/day
- With spoilage double-counting, actual profit was even lower
- 2+ rainy days made $50 nearly impossible for a first-time 10-year-old

**Fix applied:** Boosted customer generation rates. Fixed the double-counting bug. Economy now achievable.

**MAJOR: No bankruptcy protection**
If you spent all $20, sold nothing (rainy day), and spoilage ate leftovers, money hit $0. Then you could start Day 2 with $0, buy nothing, and waste the rest of the game. Slow death over 7 days.

**Fix applied:** If money drops below $2, parents lend $5 with a message: "You were running low, so your parents lent you $5! Make it count!"

**MAJOR: "Chapter 2 coming soon" sets false expectations**
A kid who beats Chapter 1 expects more content but there is none.

**Noted for future:** Either remove "Chapter" framing or build Chapter 2.

**CRITICAL: Floating point error with sugar (1/6 = 0.167)**
When buying 1 bag of sugar and using across 6 cups: `1 - (6 * 0.167) = 1 - 1.002 = -0.002`. After 6 cups, sugar went slightly negative. The `canServeCup()` check would fail. Over 7 days, 1-2 cups worth of sugar lost to rounding.

**Fix applied:** Changed to `1/6` exact fraction with `Math.round(x * 1000) / 1000` after each serve.

---

## READABILITY

### Issues Found

**CRITICAL: All text was too small across every screen**
Font sizes ranged from 6-10px in "Press Start 2P" (which renders even smaller than regular fonts). On a 960x640 container, most text was nearly unreadable.

Specific problem sizes:
- Supply row labels: 8px
- Stock indicators: 7px
- Weather description: 8px
- Forecast accuracy: 6px
- Tip boxes: 7px
- Sim HUD: 8px
- Speed buttons: 7px
- Cutscene text: 9px
- Summary lines: 9px

**Fix applied:** All fonts bumped 40-80%. New range: 10-15px for body text, 14-20px for headers.

---

## SUGGESTIONS (Not Yet Implemented)

These are ideas for making the game more fun and educational:

1. **Recipe/quality mechanic** — Let kids adjust sugar/lemon ratio. More sugar = sweeter, more lemon = tangier. Adds decision-making beyond bulk buying.

2. **Upgrade system between days** — Buy a sign ($5), better pitcher ($10), umbrella for rain ($15). Gives progression and a reason to save money.

3. **Visual feedback on planning screen** — Show yesterday's profit prominently. *(Partially implemented: now shows "Yesterday: +$X.XX")*

4. **Customer variety or random events** — Group of 5 friends arrives at once, "rush hour" at lunchtime highlighted, special customer who tips extra.

5. **"Quick day" skip option** — Let the kid skip the simulation and just see results. Many management games do this.

6. **Trend chart across days** — Simple bar chart of daily profits to see improvement over time.

7. **Mobile/touch support** — Game container is 1200x800px. On phones, buttons would be nearly impossible to press. Many 10-year-olds play on tablets.

8. **Weather tooltips with numbers** — "Sunny = lots of thirsty customers!" is good, but advanced players might want to see: "Expected customers: 25-35."

9. **Post-day "What if?" replay** — "What if you'd charged $0.50 more?" Shows alternate outcome. Teaches opportunity cost.

10. **Save/load to localStorage** — Currently no persistence between browser sessions.

---

## Summary Table

| # | Severity | Issue | Status |
|---|----------|-------|--------|
| C-01 | CRITICAL | Can start day with 0 supplies | FIXED |
| C-02 | CRITICAL | Sugar 0.167 per cup — inconsistent units | FIXED |
| C-03 | CRITICAL | Spoilage double-counts costs | FIXED |
| C-04 | CRITICAL | Economy unbalanced — $50 nearly impossible | FIXED |
| C-05 | CRITICAL | Floating point error loses sugar inventory | FIXED |
| C-06 | CRITICAL | All text too small to read | FIXED |
| M-01 | MAJOR | Cutscene is 8 screens before playing | FIXED (4 screens + skip) |
| M-02 | MAJOR | Day 1 hint math wrong ("~10 cups") | FIXED |
| M-03 | MAJOR | No feedback when Start Day fails | FIXED |
| M-04 | MAJOR | "80% accurate" unexplained | FIXED |
| M-05 | MAJOR | Units inconsistent planning vs sim | FIXED |
| M-06 | MAJOR | Cost/cup static, doesn't reflect waste | NOTED |
| M-07 | MAJOR | Star rating based on margin | FIXED |
| M-08 | MAJOR | No bankruptcy protection | FIXED |
| M-09 | MAJOR | Zero interactivity during sim | PARTIALLY (default 2x speed) |
| M-10 | MAJOR | 1x speed too slow/boring | FIXED (default 2x) |
| M-11 | MAJOR | "Chapter 2 coming soon" misleading | NOTED |
| M-12 | MAJOR | Title click only on canvas | FIXED |
| N-01 | MINOR | No skip button for cutscene | FIXED |
| N-02 | MINOR | Cutscene doesn't visualize $20 | NOTED |
| N-03 | MINOR | +5/-5 buttons clamp silently | NOTED |
| N-04 | MINOR | Weather types no gameplay explanation | FIXED |
| N-05 | MINOR | Price min/max not shown | NOTED |
| N-06 | MINOR | Speed shortcuts not shown on UI | NOTED |
| N-07 | MINOR | "have:" label doesn't explain units | PARTIALLY FIXED |
| N-08 | MINOR | Duplicate CSS rule | FIXED |
| S-01 | SUGGESTION | Recipe/quality mechanic | FOR CHAPTER 2 |
| S-02 | SUGGESTION | Upgrade shop between days | FOR CHAPTER 2 |
| S-03 | SUGGESTION | Show yesterday's results | FIXED |
| S-04 | SUGGESTION | Customer variety/events | FOR CHAPTER 2 |
| S-05 | SUGGESTION | Quick day skip option | NOTED |
| S-06 | SUGGESTION | Trend chart across days | FOR CHAPTER 2 |
| S-07 | SUGGESTION | Mobile/touch support | NOTED |
