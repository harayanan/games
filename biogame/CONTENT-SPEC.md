# Body Sticks — Content Spec

This file is the contract for every question ("stick") in the game. Use it when
writing the first 500 sticks and when generating the next batch.

## Audience

- Age 10+ (Class 5–8 level, CBSE/NCERT science). Plain English, short sentences.
- Medical words are fine when the stick teaches them (e.g. "alveoli", "insulin"),
  but every term used in an explanation must be explained in kid language.
- No gore, no frightening death framing, no adult sexual content. Reproduction is
  covered at NCERT Class 8 level: organs, cells, what each does, puberty basics.
- First aid follows current guidance (e.g. burns: cool running water ~20 minutes,
  no ice/butter/toothpaste; nosebleed: sit up, lean forward, pinch the soft part).
  Any treatment stick should make clear that a doctor or adult is involved.
- No brand names of medicines. Generic names only when needed (e.g. "insulin").
- Facts must be correct. If unsure about a fact, leave the stick out.

## Files

- Each batch of 500 adds one file per body system: `content/<system>.json` (batch 1),
  `content/<system>-2.json` (batch 2), and so on. Each file is a JSON array of sticks.
- Ids continue the numbering across batches. In batch 2: odd 18–34, taboo 18–34,
  case 17–32 (e.g. `heart-odd-18`). Batch N continues from where batch N−1 ended.
- A new batch must not repeat earlier batches: no reused taboo target word, no
  odd-one-out with the same item set or the same grouping idea, and no case with the
  same scenario and answer. Read the earlier files for the system before writing.
- `node scripts/build.mjs <system>` validates all of that system's files together.
- Run `node scripts/build.mjs` to validate all files and write
  `public/data/sticks.json`. The build fails on any schema error.

## Systems (ids)

| id | Name | Covers |
|---|---|---|
| `cells` | Cells & Genes | cells, cell parts, tissues, organs-to-systems, DNA, genes, microscopes, microbes vs cells |
| `bones` | Bones & Muscles | skeleton, joints, cartilage, muscles (types), tendons/ligaments, posture, fractures, sprains |
| `heart` | Heart & Blood | heart chambers/valves, arteries/veins/capillaries, blood parts, blood groups, pulse, BP, anaemia, clotting |
| `lungs` | Lungs & Breathing | nose to alveoli, diaphragm, gas exchange, asthma, cough/cold, smoking harm, oxygen |
| `digestion` | Food & Digestion | mouth to anus, teeth, enzymes, liver/bile, pancreas juices, nutrients, vitamins/deficiency diseases, balanced diet |
| `brain` | Brain & Nerves | brain parts, spinal cord, neurons, reflexes, sleep, memory, concussion, migraine |
| `senses` | Senses & Skin | eye, ear (hearing + balance), nose, tongue, skin layers, sweat, eczema, myopia, sunburn |
| `hormones` | Hormones & Growing Up | endocrine glands, hormones, diabetes, thyroid, growth, puberty basics, reproductive organs (NCERT level) |
| `cleaning` | Kidneys & Body Cleaning | kidneys, nephrons, bladder, urine, liver detox, sweat, lymph, dehydration, kidney stones |
| `germs` | Germs, Immunity & Medicine | bacteria/viruses/fungi, white blood cells, antibodies, vaccines, antibiotics, common diseases, hygiene, diagnostic tests (X-ray, MRI, blood test, ECG), types of doctors |

Diseases belong to the system they mainly affect (asthma → `lungs`, diabetes →
`hormones`, malaria → `germs`, anaemia → `heart`). Do not write the same target
word or the same case in two systems.

## Three modes

Each system has **50 sticks: 17 `odd`, 17 `taboo`, 16 `case`**.
Difficulty `level`: 1 = easy, 2 = medium, 3 = hard. Aim for ~20 / 20 / 10.

### Common fields (all modes)

```json
{
  "id": "heart-odd-01",          // <system>-<mode>-<2-digit number>, unique
  "system": "heart",
  "mode": "odd",                  // "odd" | "taboo" | "case"
  "level": 1,
  "explain": "2–4 sentences that teach the underlying concept, so a child who got it wrong learns the idea, not just the answer.",
  "fact": "Optional. One surprising, true fact related to the stick."
}
```

`explain` is the most important field. It must teach the *why*: the system,
the function, the mechanism. Bad: "The answer is kidney." Good: "Kidneys belong
to the excretory system. They filter waste out of your blood and make urine. The
ovary, testes, uterus and sperm are all part of the reproductive system, which
makes babies possible."

### `odd` — Odd One Out (green)

Five items; four share a system, function, or category; one does not.

```json
{
  "items": ["Ovary", "Testes", "Uterus", "Kidney", "Sperm"],
  "answer": "Kidney",                     // must exactly equal one of items
  "notes": [                               // 5 short notes, same order as items
    "Female gland that makes eggs",
    "Male glands that make sperm",
    "Where a baby grows",
    "Filters blood and makes urine",
    "Male cell that fertilises an egg"
  ],
  "reason": "Kidney is an excretory organ; the rest are reproductive."
}
```

Rules: exactly one defensible odd item. Avoid items that could be the odd one for
a second reason (e.g. different number of letters, only plural). Notes ≤ 10 words.

### `taboo` — Don't Say It (red)

A target word to explain without four forbidden words. In 2-player mode a child
describes it. In solo mode the app shows clues one at a time and the child picks
from the target + 3 decoys.

```json
{
  "word": "Asthma",
  "forbidden": ["Breathing", "Wheezing", "Airway", "Inhaler"],
  "clues": [                                // exactly 3, hardest first, easiest last
    "This long-lasting condition can flare up with dust, pollen or cold air.",
    "During a flare-up, tubes in the chest get swollen and narrow.",
    "People with it may carry a small puffer to use when their chest feels tight."
  ],
  "decoys": ["Pneumonia", "Allergy", "Tuberculosis"]   // exactly 3, same category, plausible
}
```

Rules: clues must not contain the target word or any forbidden word (or their
obvious forms). Decoys must be clearly wrong once all three clues are read.

### `case` — Doctor's Decision (blue)

A short patient story with a question and four options.

```json
{
  "role": "Endocrinologist",                 // the kind of doctor the child plays
  "scenario": "A patient's body can't make a vital hormone. They must inject it daily to move sugar from the blood into cells for energy. Which hormone is it?",
  "options": ["Adrenaline", "Thyroxine", "Growth hormone", "Insulin"],
  "answer": "Insulin",                        // must exactly equal one of options
  "optionNotes": [                            // 4 notes, same order as options
    "Gets the body ready for 'fight or flight'",
    "Controls how fast the body uses energy",
    "Helps children grow taller",
    "Moves sugar from blood into cells"
  ]
}
```

Rules: scenario ≤ 45 words and ends with a question. Exactly one best answer.
Mix question types: diagnose (which disease?), test (X-ray, blood test, MRI,
ECG, urine test?), first action (what to do first?), which organ/part, which
nutrient/hormone. `role` is a real specialist name (Cardiologist, Pulmonologist,
Neurologist, Orthopaedic Doctor, Dermatologist, Nephrologist, Gastroenterologist,
Ophthalmologist, ENT Doctor, Endocrinologist, Paediatrician, General Physician,
Pathologist, Radiologist, Dentist, Nutritionist, Emergency Doctor, Immunologist, …).
