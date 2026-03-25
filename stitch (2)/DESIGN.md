```markdown
# Design System Specification: Editorial Keepsake

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Digital Curator."** 

Moving away from the utilitarian "utility-first" look of standard apps, this system treats every screen like a high-end lifestyle magazine or a bespoke physical scrapbook. It prioritizes emotional resonance over dense information architecture. We achieve this through **intentional asymmetry**, where white space is not just "empty" but acts as a structural element, and **typographic tension**, contrasting the romanticism of Noto Serif KR with the modern precision of Plus Jakarta Sans.

The goal is to make the user feel they are not just using an app, but leafing through a private, shared gallery of their relationship.

---

## 2. Color & Surface Philosophy
This system uses a "Natural Light" approach to UI, where depth is created by light and texture rather than lines.

### The "No-Line" Rule
**Strict Mandate:** Prohibit the use of 1px solid borders for sectioning or containment. 
Boundaries must be defined solely through background color shifts. For instance, a `surface-container-low` (#f9f3eb) card should sit on a `background` (#fff8f1) canvas. If you feel the need for a line, use a `3.5` (1.2rem) unit of white space instead.

### Surface Hierarchy
We treat the UI as stacked sheets of fine, semi-translucent paper.
- **Base Layer:** `surface` (#fff8f1) - The canvas of the app.
- **Interaction Layer:** `surface-container-low` (#f9f3eb) - For subtle grouping.
- **Emphasis Layer:** `surface-container-highest` (#e8e1da) - For navigation bars or headers.
- **The Signature "Coral" Glow:** Use `primary_container` (#ff6b6b) sparingly for moments of high emotion (anniversaries, significant alerts) to create a "warm heart" within the neutral palette.

### Glassmorphism & Texture
Floating elements, specifically the bottom navigation and top headers, must use **Backdrop Blur (20px-30px)** with a 70% opacity of `surface_container_lowest` (#ffffff). This ensures the "Modern Magazine" feel, allowing content to bleed softly behind the navigation as the user scrolls.

---

## 3. Typography: The Editorial Voice
The typography is a dialogue between function and feeling.

*   **Emotional Anchors (Noto Serif KR):** Use `display` and `headline` scales for D-days, names, and journal titles. This font carries the weight of "The Keepsake."
*   **Functional Clarity (Plus Jakarta Sans):** Use `title`, `body`, and `label` scales for navigation, settings, and timestamps.

**Key Rule:** Never center-align long blocks of text. Use **flush-left, ragged-right** alignment to mimic editorial layouts. Use `display-lg` (3.5rem) for significant milestones (e.g., "1000 Days") to create a high-contrast visual "hero" on the screen.

---

## 4. Elevation & Depth
We reject the standard Material "drop shadow." Instead, we use **Tonal Layering.**

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a soft, natural lift.
*   **Ambient Shadows:** If a shadow is required for a floating CTA, use:
    - Blur: 24px
    - Color: `on_surface` (#1e1b17) at **4% opacity**.
    - Offset: Y: 8px.
*   **The Ghost Border:** For accessibility in input fields, use `outline_variant` (#e0bfbd) at **20% opacity**. It should be felt, not seen.

---

## 5. Signature Components

### The Keepsake Card
*   **Shape:** `xl` (3rem) corner radius.
*   **Background:** `surface_container_lowest` (#ffffff).
*   **Layout:** Intentional padding using the `6` (2rem) spacing unit. Photos should often bleed to one edge (asymmetric) while text stays inset.
*   **Shadow:** None. Defined by its contrast against the `background`.

### Buttons (The "Soft Touch" CTA)
*   **Primary:** `primary` (#ae2f34) background with `on_primary` (#ffffff) text. Use a `full` (9999px) radius for a modern, pebble-like feel.
*   **Secondary:** `surface_container_high` (#eee7df) background. No border.
*   **States:** On press, scale the button down to **0.97** rather than changing the color significantly.

### Bottom Navigation (The Floating Bar)
*   **Style:** A floating island container, not edge-to-edge.
*   **Material:** Glassmorphism (70% White + Blur).
*   **Radius:** `lg` (2rem).
*   **Margins:** `5` (1.7rem) from the screen edges.

### Inputs & Fields
*   **Style:** Underline-only style using `outline_variant` at 40% opacity, or a fully filled `surface_container_low` box with `md` (1.5rem) corners.
*   **Label:** Always use `label-md` in `on_surface_variant` (#584140).

---

## 6. Do's and Don'ts

### Do
*   **Use Asymmetry:** Place a photo on the left and a serif title on the right with different vertical offsets to create a "scrapbook" feel.
*   **Exaggerate White Space:** Use the `12` (4rem) and `16` (5.5rem) spacing tokens to separate major emotional sections.
*   **Tint Your Shadows:** If using a shadow on a warm cream background, ensure the shadow has a hint of the primary coral or warm brown to avoid "dirty" grey looks.

### Don't
*   **No Dividers:** Never use horizontal rules (`<hr>`). If content needs to be separated, use a background color change or `2.5` (0.85rem) of empty space.
*   **No High Contrast Borders:** Avoid 100% black or 100% `outline` colors. Keep the interface "soft."
*   **No Default Grids:** Don't force every image into a perfect square. Mix `xl` (3rem) and `md` (1.5rem) rounded corners to create visual interest.
*   **No Crowding:** If you can't fit it with at least `3` (1rem) of padding, move it to a sub-page. The atmosphere must remain "breezy."```