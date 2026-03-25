# Design System Document: Emotional Minimalism

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Keepsake"**

This design system is crafted to transform a functional utility into a digital sanctuary. Moving away from the rigid, modular grids of standard productivity apps, it adopts an editorial approach that prioritizes "The Breath Between Words." The goal is to create an environment that feels private, tactile, and permanent—like a high-end linen journal.

We achieve this through **Intentional Asymmetry** (placing display text off-center to create a sense of human touch) and **Tonal Depth** (using color shifts rather than lines to define space). By prioritizing generous whitespace and soft transitions, the UI recedes into the background, allowing the couple's shared memories to become the primary visual hero.

---

## 2. Colors
The palette is a sophisticated dialogue between warm, grounding neutrals and a soul-stirring accent.

*   **Primary Accent (`primary` #785254):** Our "Romantic Rose." This is used sparingly for emotional emphasis, active states, and signature CTAs.
*   **Neutral Foundation (`surface` #fcf9f5):** A warm cream that avoids the sterile "app-white" look, providing a cozy, paper-like backdrop.
*   **Secondary Tone (`secondary` #506071):** A muted slate that adds professional weight and stabilizes the warmer tones.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or cards. Hierarchy must be achieved through background shifts. For example, a `surface-container-low` (#f6f3ef) card should sit on a `surface` (#fcf9f5) background. Boundaries are felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-translucent sheets. 
*   **Base:** `surface` (#fcf9f5)
*   **Floating Elements:** Use `surface-container-lowest` (#ffffff) with a 40% opacity and a `backdrop-blur` of 20px to create a glassmorphism effect.
*   **Sunken Elements:** Use `surface-dim` (#dcdad6) for input fields or areas that require a "nested" feel.

---

## 3. Typography
The system uses a "Dual-Voice" typography strategy to balance modern utility with emotional resonance.

*   **The Voice of Utility (Manrope):** A clean, geometric sans-serif used for all UI labels, body text, and navigation. It provides clarity and a modern, premium feel.
*   **The Voice of Emotion (Newsreader):** A delicate, high-contrast serif used for "Display" and "Headline" levels. Use this for quotes, journal entries, and special milestones to evoke the feeling of a handwritten letter.

**Typography Hierarchy:**
- **Display-LG (Newsreader, 3.5rem):** Reserved for anniversary countdowns or high-impact emotional headers.
- **Headline-MD (Newsreader, 1.75rem):** Used for section titles (e.g., "Our First Winter").
- **Title-SM (Manrope, 1rem):** Standard UI headings and sub-headers.
- **Body-MD (Manrope, 0.875rem):** The primary reading font for chat messages and descriptions.

---

## 4. Elevation & Depth
We eschew traditional Material Design "Elevation" in favor of **Tonal Layering.**

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. To make a card pop, use `surface-container-lowest` (#ffffff) against a `surface-container` (#f0ede9) background.
*   **Ambient Shadows:** For floating action buttons or modal sheets, use a hyper-diffused shadow:
    - *Shadow Color:* `#785254` (Primary) at 5% opacity.
    - *Blur:* 40px to 60px.
    - *Offset:* Y: 10px.
    - This creates a "glow" rather than a "drop shadow," making the element feel as if it’s floating in light.
*   **The "Ghost Border" Fallback:** If accessibility requires a border (e.g., in high-contrast modes), use `outline-variant` (#d4c2c2) at 15% opacity. Never use a 100% opaque border.

---

## 5. Components

### Buttons
- **Primary:** Filled with `primary` (#785254). Use `xl` (3rem) corner radius. Typography should be `Title-SM` in `on-primary` (#ffffff).
- **Secondary:** Use `secondary-container` (#d3e4f8). This provides a soft "Indigo" touchpoint that complements the Rose.
- **Glass CTA:** For hero sections, use a `surface-container-lowest` background at 50% opacity with a heavy backdrop blur.

### Input Fields
- **Styling:** Avoid outlines. Use `surface-container-high` (#ebe8e4) as a solid background fill. 
- **Corners:** `md` (1.5rem) radius for a friendly, approachable feel.
- **Interaction:** On focus, the background should shift to `surface-container-lowest` (#ffffff) with a subtle `primary` shadow glow.

### Cards & Lists
- **The "No-Divider" Rule:** Forbid 1px dividers between list items. Use the `spacing-6` (2rem) gap to separate content.
- **Visual Separation:** Use subtle background alternating colors (`surface` vs `surface-container-low`) only if absolutely necessary for dense data.

### Special Component: "The Memory Capsule"
A unique card type for this system. It uses a `primary-container` (#936a6c) background with a Newsreader `Headline-SM` font. It features a larger-than-standard corner radius (`xl` / 3rem) and is used exclusively for shared photos or milestones.

---

## 6. Do's and Don'ts

### Do
*   **Do** use `spacing-16` (5.5rem) or `spacing-20` (7rem) for top-level margins. High-end design requires space to "breathe."
*   **Do** mix the fonts in the same section. A Newsreader Headline paired with a Manrope Label creates an editorial, curated look.
*   **Do** use asymmetrical layouts (e.g., a left-aligned image with a right-aligned caption) to feel more "organic."

### Don't
*   **Don't** use pure black (#000000). Always use `on-surface` (#1c1c1a) for text to maintain the soft, "Emotional Minimalism" mood.
*   **Don't** use standard 4px or 8px corners. Our minimum radius is `sm` (0.5rem), but the default should always be `DEFAULT` (1rem) or higher.
*   **Don't** use high-speed, "snappy" animations. Transitions should be slightly slower (300ms–500ms) with a soft `cubic-bezier(0.4, 0, 0.2, 1)` easing to mimic a calm, intimate pace.