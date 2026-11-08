// Guide articles. Plain data so the site, the prerenderer and the sitemap
// all read the same source. Body uses a tiny markdown subset:
//   "## Heading", "- list item", "> tip", blank line = new paragraph.
// Keep everything factual and about tobacco/legal herbal blends only (18+).

export interface Guide {
  slug: string;
  title: string;
  description: string;
  updated: string; // ISO date
  readMins: number;
  body: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "how-to-fill-a-pre-rolled-cone",
    title: "How to Fill a Pre-Rolled Cone: A Simple Step-by-Step Guide",
    description: "Pre-rolled cones take the hard part out of rolling. Here's how to fill, pack and close a cone in 6 easy steps — plus the mistakes that cause an uneven burn.",
    updated: "2026-11-09",
    readMins: 4,
    body: `Pre-rolled cones are already shaped and tipped, so you skip the rolling. All you do is fill, pack and close. Here's how to get a neat, even result every time.

> This guide is for adults (18+) using tobacco or legal herbal blends.

## What you need

- A pre-rolled cone
- Your blend, broken up evenly — no big clumps or stems
- A packing stick, or anything thin like a pen refill or a clean toothpick
- A sheet of paper or a small funnel (optional, but less mess)

## Step 1: Prepare your blend

Break the blend into small, even pieces. Fine, even material packs better and burns more steadily than chunky bits.

## Step 2: Open the cone

Gently open the wide end of the cone. Hold it by the tip, wide end up.

## Step 3: Fill a little at a time

Add a small amount of blend through the wide end. A folded sheet of paper works as a simple funnel.

## Step 4: Pack gently

Tap the tip lightly on a table and use your packing stick to press the blend down. Don't pack too hard — the cone still needs air to draw. Repeat steps 3 and 4 until the cone is about three-quarters full.

## Step 5: Leave room at the top

Leave a little empty paper at the wide end. You'll need it to close the cone.

## Step 6: Twist to close

Pinch the empty paper at the top and twist it closed, like a sweet wrapper. It's ready.

## Common mistakes

- **Packing too tight** — hard to draw.
- **Packing too loose** — burns fast and unevenly.
- **Uneven filling** — air pockets cause "canoeing", where one side burns ahead.
- **Overfilling** — no paper left to twist closed.

Ready to try? [Get Jotah pre-rolled cones](/product) — ₹15 a cone.`,
  },
  {
    slug: "pre-rolled-cones-vs-rolling-papers",
    title: "Pre-Rolled Cones vs Rolling Papers: Which Should You Choose?",
    description: "Cones or papers? A simple comparison of pre-rolled cones and rolling papers — ease, consistency, speed, cost — so you can pick what suits you.",
    updated: "2026-11-09",
    readMins: 4,
    body: `Both cones and papers do the same job, but they suit different people. Here's an honest comparison.

## What's the difference?

- **Rolling papers** are flat sheets. You shape, roll and seal them yourself.
- **Pre-rolled cones** come already rolled into a cone shape, usually with a tip inside. You just fill and twist.

## Ease of use

Cones win for beginners. Rolling a neat smoke takes practice; filling a cone takes a minute. If you've ever struggled with a loose or lumpy roll, a cone solves that.

## Consistency

A cone has the same shape every time, so it burns more predictably. Hand-rolled papers depend on your technique and mood.

## Speed

Cones are faster, especially when you're out or don't have a flat surface to roll on.

## Control

Papers give you more control over size and shape. Some experienced rollers enjoy the ritual.

## Cost

Papers usually cost less per sheet, but cones save time and wasted papers from failed rolls. Jotah cones are ₹15 each.

## Which should you choose?

- **New to it, or want it quick and neat?** Go for cones.
- **Love the ritual and want full control?** Papers are for you.

Try a cone: [Jotah pre-rolled cones](/product). Learn more: [how to fill a cone](/guides/how-to-fill-a-pre-rolled-cone).`,
  },
  {
    slug: "pre-rolled-cone-sizes-explained",
    title: "Pre-Rolled Cone Sizes Explained: Which Size Is Right for You?",
    description: "Cone sizes like 70 mm, 1¼ (84 mm) and king size (109 mm) explained simply — what they mean and how to choose the right one.",
    updated: "2026-11-09",
    readMins: 3,
    body: `Cones come in a few standard lengths. The names can be confusing, so here's a quick guide.

## Common cone sizes

- **Small / mini (around 70 mm)** — a short, quick smoke.
- **1¼ (around 84 mm)** — the most popular everyday size.
- **98 mm** — a little bigger, good for a longer session.
- **King size (around 109 mm)** — the largest common size, often used for sharing.

Exact sizes vary by brand, so always check the pack.

## How to choose

- **Just you?** A smaller or 1¼ cone is usually enough.
- **Sharing?** Go bigger.
- **New to cones?** Start small — they're easier to fill evenly.

## Size isn't thickness

Size is the length of the cone. Thickness is the paper weight, measured in GSM — see [what 13.8 GSM means](/guides/what-does-13-8-gsm-mean). A big cone can still use ultra-thin paper.

## Filling tip

Whatever the size, fill a little at a time and pack gently. See our [step-by-step filling guide](/guides/how-to-fill-a-pre-rolled-cone).`,
  },
  {
    slug: "what-does-13-8-gsm-mean",
    title: "What Does 13.8 GSM Mean on a Cone or Rolling Paper?",
    description: "GSM is paper weight — and it decides how thin your cone is. What the number means, how it affects taste and burn, and why thin 13.8 GSM paper is popular.",
    updated: "2026-11-09",
    readMins: 3,
    body: `If you've seen "13.8 GSM" on the side of a Jotah pack, it's telling you how thin the paper is.

## GSM = grams per square metre

GSM stands for **grams per square metre** — the standard way to measure paper weight. Office printer paper is usually 70–80 GSM. Smoking papers are far lighter.

Lower GSM means lighter, thinner paper.

## Why thin paper matters

- **Cleaner taste.** Less paper burning means you taste your blend, not the paper.
- **Slower, steadier burn** when the cone is packed evenly.
- **Less ash.**

## The trade-off

Thin paper is more delicate and more sensitive to humidity. Store your cones dry — see [how to store cones in monsoon](/guides/how-to-store-pre-rolled-cones).

## Where 13.8 GSM sits

At 13.8 GSM, Jotah cones use thin, fine paper from France — light enough for a clean taste and slow burn, while staying firm enough to hold their shape.

[Try Jotah cones →](/product)`,
  },
  {
    slug: "slow-burn-cones",
    title: "Slow Burn Cones: What Makes a Cone Burn Evenly?",
    description: "Why do some cones burn fast or 'canoe'? The real reasons a cone burns slow and even — paper, packing, moisture and how you light it.",
    updated: "2026-11-09",
    readMins: 3,
    body: `"Slow burn" is printed on our pack. But a slow, even burn depends on both the cone and how you fill it.

## 1. Thin paper

Thinner paper (lower GSM) has less material to burn and leaves less ash. Jotah cones use 13.8 GSM paper from France.

## 2. Even packing

This is the biggest factor you control. Clumps and air pockets make one side burn faster. Fill a little at a time and pack gently all the way down.

## 3. Not too tight, not too loose

- Too loose → burns fast and hot
- Too tight → hard to draw
- Firm and even → slow, steady burn

## 4. Moisture

Very dry blends burn fast; damp cones burn unevenly. Keep cones sealed and dry, especially in monsoon.

## 5. An even light

Rotate the cone while lighting so the whole top catches at once. Lighting one spot is a common cause of canoeing.

## Fixing a canoe

If one side races ahead, touch the slow side with the flame to even it out.

[Get Jotah slow burn cones →](/product)`,
  },
  {
    slug: "how-to-store-pre-rolled-cones",
    title: "How to Store Pre-Rolled Cones (Especially in Monsoon Humidity)",
    description: "Humidity makes cones soft, wrinkled and slow to light. Simple ways to keep pre-rolled cones dry and fresh — even during the Indian monsoon.",
    updated: "2026-11-09",
    readMins: 3,
    body: `Thin paper tastes clean because it's light and absorbent — which also makes humidity its biggest enemy. In the Indian monsoon, cones left out can go soft in days.

## What humidity does to cones

- The cone softens and loses its shape
- The paper wrinkles
- Damp cones light badly and burn unevenly

## How to store them

- **Keep cones in their pack until you use them.** The pack also protects the shape.
- **Use a zip bag or an airtight tin** in monsoon months.
- **Keep away from heat and direct sun** — no car dashboards or window sills.
- **Don't carry them in a back pocket** — they get crushed and damp.
- **Avoid bathrooms and kitchens**, the most humid rooms.

## Buying tip

In humid months, buying smaller quantities more often keeps them fresh. If you buy a [Box of 25](/product), keep the unopened packs sealed together in a dry place.

## Already soft?

Let the cone sit somewhere dry and airy (not in direct heat) for a few hours before using it.`,
  },
  {
    slug: "pre-rolled-cones-india-buying-guide",
    title: "Pre-Rolled Cones in India: A Simple Buying Guide (2026)",
    description: "What to look for when buying pre-rolled cones in India — paper thickness, size, tip, burn, price and where to buy, including Gurgaon delivery.",
    updated: "2026-11-09",
    readMins: 4,
    body: `Pre-rolled cones are now easy to find in India — imported and Indian. Here's what actually matters when choosing.

> Cones are for adults (18+) only.

## 1. Paper thickness (GSM)

Thinner paper gives a cleaner taste and less ash. Lower GSM = thinner. Read: [what 13.8 GSM means](/guides/what-does-13-8-gsm-mean).

## 2. Size

1¼ is the everyday favourite; king size is for sharing. See [cone sizes explained](/guides/pre-rolled-cone-sizes-explained).

## 3. The tip

A firm tip keeps the cone's shape, gives a clean draw and makes it easier to hold.

## 4. Burn

"Slow burn" on the pack is a good sign, but packing matters too — see [what makes a cone burn evenly](/guides/slow-burn-cones).

## 5. Price

Imported cones often carry an import mark-up. Jotah cones are ₹15 each, inclusive of all taxes.

## 6. Freshness

Cones kept open in humid shops can go soft. Buy where stock moves fast, and store them dry at home — see [how to store cones](/guides/how-to-store-pre-rolled-cones).

## Where to buy cones in India

- **Paan and tobacco shops** in big cities
- **Quick-commerce apps** in some cities — search the brand name
- **Directly from the brand** — [order Jotah cones online](/product)

## Why an Indian brand?

Better prices, fresher stock, and you support a local business. Jotah is marketed and packed by Jotah Pvt. Ltd. in Gurugram.`,
  },
  {
    slug: "where-to-buy-pre-rolled-cones-gurgaon",
    title: "Where to Buy Pre-Rolled Cones in Gurgaon (Gurugram)",
    description: "Looking for pre-rolled cones in Gurgaon? Where to find Jotah cones in Gurugram — paan shops, online delivery, WhatsApp orders and bulk for shops.",
    updated: "2026-11-09",
    readMins: 3,
    body: `Jotah is packed in Gurugram, and Gurgaon is where you'll find us most easily.

> 18+ only. Not for sale to minors.

## 1. Paan and tobacco shops

Jotah cones are stocked in paan and tobacco shops across Gurgaon. If you don't see them on the counter, just ask for **Jotah** by name.

## 2. Order online

[Order Jotah cones on our website](/product) — a single cone, 5-Pack, 10-Pack or Box of 25. Pay by cash or UPI on delivery.

## 3. Order on WhatsApp

Message **"What The Fun"** to **+91 92056 17375** on WhatsApp and we'll help you order.

## For shop owners

Want to stock Jotah in your shop? We supply retailers across Gurugram. WhatsApp us at +91 92056 17375 for retailer pricing.

## Outside Gurgaon?

We're working on reaching more of Delhi NCR. Meanwhile you can [order online](/product) or WhatsApp us to check delivery to your area.`,
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
