// Guide articles. Plain data so the site, the prerenderer and the sitemap
// all read the same source. Body uses a tiny markdown subset:
//   "## Heading", "- list item", "> tip", blank line = new paragraph.
// Keep everything factual and about tobacco/herbal rolling only (18+).

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
    slug: "how-to-roll-with-rolling-paper",
    title: "How to Roll with Rolling Paper: A Step-by-Step Guide for Beginners",
    description: "Learn how to roll a neat, even smoke with rolling paper in 7 simple steps — plus the common mistakes that make a roll loose, lumpy or burn unevenly.",
    updated: "2026-11-08",
    readMins: 5,
    body: `Rolling your own looks tricky the first time, but it comes down to a few simple habits. Here's a clear, beginner-friendly method that works with any standard rolling paper.

> This guide is for adults (18+) rolling tobacco or legal herbal blends.

## What you need

- A rolling paper (thin papers like 13.8 GSM are easier to tuck and burn more evenly)
- Your blend, broken up evenly — no big clumps or stems
- A filter tip or roach (optional, but it makes the roll easier to hold and smoke)
- A clean, flat surface

## Step 1: Prepare your blend

Break the blend into small, even pieces. Most uneven burns start here — clumps create air pockets, and stems can tear the paper.

## Step 2: Hold the paper the right way

Hold the paper with the gum strip at the top, facing you. Crease the paper gently down the middle to create a small channel for the blend.

## Step 3: Add the tip (if using one)

Place the tip at one end of the paper. It gives you something firm to roll against and keeps the mouth end clean.

## Step 4: Fill evenly

Spread the blend evenly along the crease. Don't overfill — about two-thirds full is plenty for beginners. Even spread = even burn.

## Step 5: Shape it

Pinch the paper between your thumbs and index fingers and roll it back and forth. This packs the blend into a cylinder. Take your time here; this is what makes a roll firm instead of floppy.

## Step 6: Tuck and roll

Tuck the side of the paper nearest to you (the side without gum) over the blend and under the far edge. Then roll upward, using your thumbs to keep it tight, until only the gum strip is showing.

## Step 7: Seal

Lightly lick the gum strip and finish the roll to seal it. Press gently along the seam. Twist the open end closed or pack it lightly with a pen tip.

## Common mistakes

- **Overfilling** — makes the paper hard to tuck and the roll loose.
- **Uneven filling** — causes "canoeing", where one side burns faster.
- **Too much saliva on the gum** — the seam stays wet and peels open.
- **Rolling too loose** — burns fast and hot.

## Practice tips

Your first few rolls won't be perfect, and that's normal. Thin papers are less forgiving of rough handling but reward you with a cleaner, slower burn once you get the feel.

Want to practise? [Get a 5-Pack of Jotah](/product) — enough papers to get really good at it.`,
  },
  {
    slug: "what-is-gsm-in-rolling-paper",
    title: "What Does GSM Mean in Rolling Paper? Why 13.8 GSM Matters",
    description: "GSM is the weight — and thickness — of rolling paper. Here's what the number means, how it changes taste and burn, and why thin papers like 13.8 GSM are popular.",
    updated: "2026-11-08",
    readMins: 4,
    body: `If you've seen "13.8 GSM" printed on a pack of rolling papers, it's telling you how thin the paper is. Here's what that number actually means and why it matters.

## GSM = grams per square metre

GSM stands for **grams per square metre**. It's the standard way to measure paper weight. A sheet of regular office printer paper is usually around 70–80 GSM. Rolling papers are much lighter — most sit somewhere in the low-to-mid teens.

The lower the GSM, the lighter and thinner the paper.

## Why thin paper matters

- **Cleaner taste.** Less paper means less paper burning, so you taste more of your blend and less of the paper.
- **Slower, more even burn.** Thin papers tend to burn more steadily when the roll is packed well.
- **Less ash.** Lighter paper leaves less behind.

## The trade-off

Ultra-thin papers need a little more care. They can tear if handled roughly, and they're more sensitive to humidity. That's why storage matters — especially during the Indian monsoon. (See our guide on [how to store rolling papers](/guides/how-to-store-rolling-papers).)

## Where 13.8 GSM sits

At 13.8 GSM, Jotah papers are on the thin side — light enough for a clean taste and slow burn, while still being easy to roll for everyday use.

## Quick summary

- GSM = paper weight per square metre
- Lower GSM = thinner paper
- Thinner paper = cleaner taste, less ash, steadier burn (if rolled well)
- Thin papers need dry storage

Try it yourself: [Jotah rolling papers, 13.8 GSM](/product).`,
  },
  {
    slug: "rolling-paper-sizes-explained",
    title: "Rolling Paper Sizes Explained: Single Wide, 1¼ and King Size",
    description: "Single wide, 1¼, king size slim — what do rolling paper sizes mean and which one should you choose? A simple guide with a size comparison.",
    updated: "2026-11-08",
    readMins: 4,
    body: `Walk into any paan shop and you'll see rolling papers in different lengths. The names can be confusing, so here's a simple breakdown.

## The common sizes

- **Single wide (regular)** — the classic small size, roughly 68–70 mm long. Good for a short, single smoke.
- **1¼ (one and a quarter)** — a little longer and wider, around 76–79 mm. A popular middle ground.
- **1½** — slightly bigger again.
- **King size** — long papers, around 105–110 mm. King size **slim** papers are narrower, which helps them burn more evenly.

Exact measurements vary a little by brand, so always check the pack.

## How to choose

- **New to rolling?** Start with a mid size like 1¼. It's long enough to be forgiving but not so big that it's hard to handle.
- **Sharing?** Longer papers like king size are the usual choice.
- **Want a slower burn?** Narrower ("slim") papers usually burn more evenly than wide ones.

## Size vs thickness

Size is length and width. Thickness is measured in GSM (see [what GSM means](/guides/what-is-gsm-in-rolling-paper)). A long paper can still be ultra-thin — the two are separate choices.

## Don't overfill

Whatever the size, the most common mistake is overfilling. A bigger paper doesn't mean you should pack in more than you can roll neatly. See our [step-by-step rolling guide](/guides/how-to-roll-with-rolling-paper).`,
  },
  {
    slug: "slow-burn-rolling-papers",
    title: "Slow Burn Rolling Papers: What Makes a Paper Burn Evenly?",
    description: "Why do some rolls burn fast, run or 'canoe'? The real reasons a rolling paper burns slow and even — paper thickness, packing, humidity and technique.",
    updated: "2026-11-08",
    readMins: 4,
    body: `"Slow burn" is printed on a lot of packs — including ours. But a slow, even burn depends on both the paper and how you roll it. Here's what actually makes the difference.

## 1. Paper thickness

Thinner papers (lower GSM) have less material to burn. When rolled well, they tend to burn more steadily and leave less ash. Jotah papers are 13.8 GSM.

## 2. How evenly the roll is packed

This is the biggest factor you control. Air pockets and clumps make one part burn faster than the rest. Break your blend up evenly and spread it along the full length of the paper.

## 3. How tight you roll

- Too loose → burns fast and hot
- Too tight → hard to draw
- Firm and even → slow, steady burn

## 4. Moisture

Very dry blends burn fast. Damp papers or blends burn unevenly and can go out. In humid months, keep papers sealed and dry.

## 5. Lighting it properly

Light the tip evenly by rotating the roll as you light, instead of holding the flame in one spot. A lopsided light is one of the main causes of "canoeing" — when one side burns ahead of the other.

## Fixing a run or canoe

If one side starts burning faster, gently lick or dab the fast side with a little moisture, or touch the slow side with the flame to even it out.

## The short version

Good paper + even packing + a firm roll + an even light = slow burn. The paper does its part; technique does the rest.

[Try Jotah slow burn papers →](/product)`,
  },
  {
    slug: "how-to-store-rolling-papers",
    title: "How to Store Rolling Papers (Especially in Indian Monsoon Humidity)",
    description: "Humidity makes rolling papers stick, curl and burn badly. Simple ways to store rolling papers so they stay dry and fresh — even during the monsoon.",
    updated: "2026-11-08",
    readMins: 3,
    body: `Rolling paper is thin, light and absorbent — which is exactly why it tastes clean. It's also why humidity is its biggest enemy. In much of India, the monsoon can ruin a pack in days if it's left lying around.

## What humidity does to rolling papers

- The gum strip turns tacky, so papers stick together
- Papers curl or crinkle
- Damp paper burns unevenly and can go out

## How to store them properly

- **Keep the pack closed.** Don't leave it open on a table.
- **Use a zip bag or airtight tin** during the monsoon. Even a simple zip-lock bag makes a big difference.
- **Keep away from heat and direct sun** — no car dashboards, no window sills.
- **Don't keep them in your back pocket** for days. Body heat and sweat add moisture.
- **Avoid the bathroom and kitchen** — they're the most humid rooms.

## Buying tip

In humid months, buying smaller quantities more often keeps your papers fresh. If you buy in bulk — like a [Box of 25](/product) — keep the unopened packs sealed together in a dry place and open one at a time.

## Already damp?

Lay the papers flat somewhere dry and airy (not in direct heat) for a few hours. If the gum has already stuck sheets together, it's usually best to replace them.`,
  },
  {
    slug: "rolling-papers-india-buying-guide",
    title: "Rolling Papers in India: A Simple Buying Guide (2026)",
    description: "What to look for when buying rolling papers in India — thickness, size, burn, price and where to buy, including quick-commerce apps and paan shops.",
    updated: "2026-11-08",
    readMins: 5,
    body: `There are more rolling paper options in India today than ever — imported brands, Indian brands, and everything in between. Here's what actually matters when you're choosing.

> Rolling papers are for adults (18+) only.

## 1. Thickness (GSM)

Thinner papers give a cleaner taste and less ash. Look for the GSM on the pack — lower is thinner. Read more: [what GSM means](/guides/what-is-gsm-in-rolling-paper).

## 2. Size

Single wide, 1¼ and king size are the most common. If you're not sure, start with a mid size. See [rolling paper sizes explained](/guides/rolling-paper-sizes-explained).

## 3. Burn

A good paper burns slowly and evenly when rolled well. "Slow burn" on the pack is a good sign, but technique matters too — see [what makes a paper burn evenly](/guides/slow-burn-rolling-papers).

## 4. Gum strip

The gum should hold the seal without needing much moisture, and shouldn't overpower the taste.

## 5. Price

Imported papers often carry an import mark-up. Indian brands can offer the same quality at a lower price. Jotah, for example, has an MRP of ₹15 per pack, inclusive of all taxes.

## 6. Freshness and storage

Papers kept open in humid shops can go stale. Buy from places with good turnover, and store them properly at home — see [how to store rolling papers](/guides/how-to-store-rolling-papers).

## Where to buy rolling papers in India

- **Paan and tobacco shops** — the most common place, especially in big cities.
- **Quick-commerce apps** — some apps list rolling papers in some cities; search the brand name.
- **Directly from the brand** — many brands, including Jotah, sell online. [Order Jotah here](/product).

## Why choose an Indian brand?

Buying Indian supports local businesses and usually means better prices and fresher stock. Jotah is marketed and packed by Jotah Pvt. Ltd. in Gurugram.`,
  },
  {
    slug: "where-to-buy-rolling-papers-gurgaon",
    title: "Where to Buy Rolling Papers in Gurgaon (Gurugram)",
    description: "Looking for rolling papers in Gurgaon? Where to find Jotah and other rolling papers in Gurugram — paan shops, online delivery and bulk orders.",
    updated: "2026-11-08",
    readMins: 3,
    body: `Jotah is packed in Gurugram, and Gurgaon is where you'll find us most easily. Here are the quickest ways to get rolling papers in the city.

> 18+ only. Rolling papers are not for sale to minors.

## 1. Paan and tobacco shops

Jotah is stocked in paan and tobacco shops across Gurgaon. If you don't see it on the counter, just ask for **Jotah** by name — many shops keep papers behind the counter.

## 2. Order online, delivered in Gurgaon

You can [order Jotah directly on our website](/product) — single packs, 5-Packs, 10-Packs or a Box of 25. Pay by cash or UPI on delivery.

## 3. Order on WhatsApp

Message **"What The Fun"** to **+91 92056 17375** on WhatsApp and we'll help you order.

## For shop owners in Gurgaon

Want to stock Jotah in your shop? We supply retailers across Gurugram. WhatsApp us at +91 92056 17375 for retailer pricing.

## Outside Gurgaon?

We're working on reaching more of Delhi NCR. Meanwhile you can [order online](/product), or message us on WhatsApp to check delivery to your area.`,
  },
  {
    slug: "rolling-paper-glossary",
    title: "Rolling Paper Glossary: Terms Every Roller Should Know",
    description: "GSM, tips, roach, canoeing, king size slim, gum strip and more — a simple A–Z glossary of rolling paper terms.",
    updated: "2026-11-08",
    readMins: 3,
    body: `New to rolling? Here are the words you'll hear most, explained simply.

## A–Z

- **1¼ (one and a quarter)** — a popular mid-size paper, a little longer than single wide.
- **Booklet** — the small folded pack that holds the papers.
- **Canoeing** — when one side of a roll burns faster than the other, leaving a "canoe" shape.
- **Crutch / tip / roach** — a small piece of firm card rolled into the mouth end for structure and grip.
- **Gum strip** — the thin line of natural adhesive along one edge used to seal the roll.
- **GSM** — grams per square metre; how heavy (and thick) the paper is. Lower = thinner. [Read more](/guides/what-is-gsm-in-rolling-paper).
- **King size** — long papers, around 105–110 mm.
- **King size slim** — king size but narrower, for a more even burn.
- **Run** — when the burn shoots up one side of the roll.
- **Single wide** — the classic, shortest standard size.
- **Slow burn** — paper designed to burn steadily rather than quickly.
- **Tuck** — folding the non-gummed edge of the paper under the blend before rolling up.

## Keep learning

- [How to roll step by step](/guides/how-to-roll-with-rolling-paper)
- [Rolling paper sizes explained](/guides/rolling-paper-sizes-explained)
- [What makes a paper burn evenly](/guides/slow-burn-rolling-papers)`,
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
