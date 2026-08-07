# SKIPPIES Coming Soon Landing Page — Requirements

## 1. Project Overview

Create a single-page **“Coming Soon” landing page** for **SKIPPIES** that builds anticipation for launch, communicates the brand clearly, and captures email signups.

The page should combine:
- a **clean, on-brand landing page concept**
- **strong visual direction and layout**
- **clear messaging that builds anticipation**
- a **lead capture element** for email signup

This aligns with the attached task brief and must adhere to the existing SKIPPIES brand guidelines. The brief specifically calls for a clean on-brand concept, strong layout, anticipation-building messaging, and an email signup element. The brand guidelines define the core brand character, messaging, colour hierarchy, logo usage, and typography. fileciteturn0file0L1-L20

---

## 2. Core Creative Concept

The landing page should be built around a large, interactive **hourglass system** that occupies most of the viewport.

### Concept behaviour
- The **top and bottom bulbs of the hourglass** should extend beyond the viewport so they are **cropped by the top and bottom edges of the screen**.
- The hourglass should act as the main visual focal point and dominate the composition.
- Users should be able to **click in the upper half of the hourglass** to spawn one of the brand “characters”.
- Characters should also **spawn automatically at timed intervals** from the upper section.
- Spawned characters should **fall under gravity**, collide with each other and the boundaries of the hourglass, and pass through the **central neck/gap** into the lower half.
- The simulation should feel **playful, calming, and satisfying**, rather than chaotic or aggressive.
- The interaction should support the brand’s values of being **encouraging, warm, science-informed, calm, and trustworthy** rather than overly clinical or overstimulating. The brand guidelines describe Skippies as warm, clear, reassuring, and playful in a controlled way. fileciteturn0file0L53-L77 fileciteturn0file0L84-L99

### Visual intent
The hourglass should feel:
- premium but playful
- minimal and uncluttered
- soft, rounded, and child-friendly
- elegant enough to fit a premium DTC brand
- interactive in a way that builds curiosity and anticipation

### Character system
- The project will include multiple **PNG character assets** in the project directory.
- The initial reference asset is the SKIPPIES blob/smiley “character” shape.
- The system should be able to **cycle through multiple PNG character files** rather than using just one image.
- Each character should maintain its image identity while behaving like a physics-driven object.
- The implementation should be written so new character PNGs can be added easily by dropping files into the asset folder and updating a single asset list/config.

---

## 3. Primary Objectives

1. **Communicate that the brand is launching soon**.
2. **Create a memorable branded interaction** that reflects SKIPPIES’ personality.
3. **Encourage visitors to sign up for updates**.
4. **Maintain strict visual consistency** with the brand book.
5. **Provide a responsive, performant, single-page experience** across desktop and mobile.

---

## 4. Brand Requirements

All design and development decisions should follow the brand guidelines.

### 4.1 Brand personality and tone
The landing page should feel:
- innovative
- trendy
- timeless
- refined
- prestigious
- slightly rebellious
- international

The tone of voice should remain:
- clear
- caring
- trustworthy
- approachable
- practical
- lightly playful, but not snarky or over-casual

These qualities are defined in the brand personality and tone of voice sections of the brand book. fileciteturn0file0L78-L99

### 4.2 Brand messaging
Preferred messaging territory should align with the brand book.

#### Primary brand messages
Use or adapt messaging inspired by:
- **“Made for big kid moments”**
- **“For learning, growing, and going”**

#### Secondary message territory
Potential supporting lines can draw from:
- “Everyday underwear with purpose.”
- “Healthy foundations for growing bodies.”
- “Supporting children’s development from the start.”
- “Support that grows with your child.”

These are the official primary and secondary brand messages in the guidelines. fileciteturn0file0L100-L115

### 4.3 Colour system
Define all major colours as CSS custom properties in `:root`.

Required palette:
- `--color-tangerine: #F37942`
- `--color-bubblegum: #FED3CD`
- `--color-lavender: #C1B7FE`
- `--color-forest-green: #1C6257`
- `--color-blue: #196ED5`
- `--color-cream: #FCF1E4`
- `--color-sunshine: #FFC500`
- `--color-navy: #1A2449`

The brand book identifies **Cream** as the primary base/background colour, **Navy** as the primary text/logo colour, and the remaining colours as supporting accents. fileciteturn0file0L116-L136

#### Recommended website colour weighting
- Primary page background: **Cream** by default
- Primary text and linework: **Navy**
- Interactive accents: selected supporting palette colours, used sparingly
- Character art: preserve original brand colours from supplied PNG assets
- Avoid visually overwhelming multi-colour usage across the full page at once

### 4.4 Typography
- Use **Montserrat** as the primary typeface.
- Use **Montserrat Regular** and **Montserrat Bold**.
- Follow a restrained hierarchy with a minimal number of sizes.
- Ensure legibility and consistent spacing.
- Headline styling should reflect the hierarchy shown in the brand book.

The brand guidelines specify Montserrat as the primary typeface and identify Regular and Bold as the brand weights. They also emphasise a clear hierarchy, restrained number of sizes, and consistent spacing. fileciteturn0file0L137-L154

### 4.5 Logo usage
- Use the **SKIPPIES logotype** in the header.
- Do not redraw, distort, recolour outside the brand palette, rotate, add shadows, or otherwise alter the logo.
- Respect clearspace around the logo.
- Use one of the approved placement conventions from the guidelines.

The guidelines state that the logo must not be altered and should only be placed in approved positions, including top-left, top-right, centred, bottom-left, or bottom-right depending on layout. fileciteturn0file0L68-L77 fileciteturn0file0L155-L174

For this landing page, the logotype should sit **top left** in the fixed or semi-fixed header, which is one of the approved placement positions. fileciteturn0file0L155-L165

---

## 5. Functional Requirements

### 5.1 Page structure
The site should be a **single-page landing page** built with:
- HTML
- CSS
- JavaScript
- p5.js

No CMS is required.

### 5.2 Header
The page should include a persistent top header containing:
- **Left:** SKIPPIES logotype
- **Centre:** “COMING SOON”
- **Right:** bell icon + “Notify me” CTA

#### Header behaviour
- Header should remain readable over the interactive background.
- Header may be fixed or absolutely positioned, depending on the final layout.
- On smaller screens, spacing and scale should adapt responsively.
- The header should feel light and elegant, not heavy or app-like.

### 5.3 Email signup interaction
Clicking **“Notify me”** should trigger an email signup UI.

#### Requirements
- Must open an email capture element such as:
  - modal
  - slide-down panel
  - slide-in drawer
  - inline reveal panel
- Should include:
  - email input field
  - submit button
  - close/dismiss action
  - optional success state / thank-you message
- Should be accessible and keyboard navigable.
- Should feel visually integrated with the landing page.

#### Technical note
The requirements file should stay implementation-agnostic about the backend. The final build can connect to:
- Mailchimp
- ConvertKit
- Klaviyo
- custom API endpoint
- Formspree or similar lightweight solution

For now, the frontend should be structured so the submission endpoint can be swapped easily.

### 5.4 Interactive hourglass simulation
The main interactive system must be built in **p5.js**.

#### Physics requirements
- Gravity acting downward
- Collision detection between characters
- Collision with hourglass walls
- Constraining bodies within the hourglass shape
- Ability for characters to pass through the neck opening naturally
- Stable stacking behaviour in the lower half
- Click-to-spawn interaction in the top region
- Auto-spawn at regular intervals

#### Recommended technical approach
Use one of the following:
1. **p5.js + Matter.js** for robust 2D physics
2. Pure p5.js custom physics only if collision handling remains stable and performant

Preferred approach:
- **p5.js for rendering and interaction**
- **Matter.js for physics simulation**

This is recommended because it will simplify:
- rigid body collisions
- gravity
- static boundary creation
- performant stacking and funnel behaviour

### 5.5 Character asset handling
- Character PNGs should be preloaded at runtime.
- Assets should be managed from a single array/config object.
- Click-spawn and auto-spawn should select assets by cycling or pseudo-random rotation.
- Support transparency in PNGs.
- Preserve aspect ratio.
- Allow size control via config values.

### 5.6 Responsive behaviour
The site must be responsive across:
- desktop
- tablet
- mobile

#### Responsive expectations
- Hourglass remains the dominant visual element on all breakpoints.
- Header adapts without overlapping critical interaction zones.
- Signup form remains usable on small screens.
- Physics canvas scales appropriately to viewport size.
- Character count and spawn rate may be reduced on smaller devices for performance.

### 5.7 Accessibility
Minimum accessibility requirements:
- sufficient colour contrast for text/UI
- keyboard support for signup interaction
- visible focus states
- semantic HTML for header and form elements
- ARIA labelling where needed for buttons and modal/dialog behaviour
- motion should not trigger discomfort; provide a **reduced-motion mode** or toned-down animation option where possible

### 5.8 Performance
- Keep initial page load light.
- Optimise PNG assets.
- Lazy-load nonessential assets if appropriate.
- Avoid excessive simultaneous physics bodies.
- Implement a cap on active character count.
- Ensure smooth performance on modern mobile devices.

---

## 6. Layout Requirements

### 6.1 Overall composition
The layout should feel minimal and editorial, with the interactive hourglass as the central experience.

#### Recommended structure
- Header overlaid at top
- Full-screen or near-full-screen hero section
- p5 canvas positioned as the main hero artwork layer
- Optional supporting copy placed subtly so it does not compete with the hourglass
- Email signup interaction layered above content when triggered

### 6.2 Hourglass placement
- Hourglass should be centered horizontally.
- It should extend beyond the viewport vertically so the top and bottom are cropped.
- The neck of the hourglass should sit around the visual midline of the screen.
- The geometry should be elegant and readable immediately.
- The sides should feel soft and organic, aligned with the brand’s rounded character style.

### 6.3 Copy placement
Possible copy arrangement:
- Main message integrated subtly near the centre or lower third
- Supporting line beneath, if used
- Copy should not compete with the header or overwhelm the interaction

Because the brief calls for a clean concept and strong visual layout, copy should remain concise. The social and shortform brand applications in the guidelines also suggest a restrained amount of text paired with strong visuals. fileciteturn0file0L145-L154

---

## 7. Content Requirements

### 7.1 Required visible content
- SKIPPIES logotype
- COMING SOON
- Notify me CTA with bell icon
- Email signup interface
- Interactive hourglass with brand character assets

### 7.2 Suggested messaging options
Potential combinations:

#### Option A
- COMING SOON
- Made for big kid moments
- Be the first to know when we launch

#### Option B
- COMING SOON
- For learning, growing, and going
- Join the list for launch updates

#### Option C
- COMING SOON
- Everyday underwear with purpose
- Notify me when Skippies launches

### 7.3 Copy principles
Copy should be:
- concise
- calm
- trustworthy
- optimistic
- family-facing rather than tech-facing

This matches the tone of voice direction in the brand book. fileciteturn0file0L84-L99

---

## 8. Visual Style Requirements

### 8.1 General art direction
The overall page should reflect a blend of:
- premium children’s brand
- playful illustration system
- calm, minimal interface design
- nostalgic warmth with modern execution

This aligns with the brand values “Science with Soul,” “Calm You Can Trust,” and “Nostalgic, Not Dated.” fileciteturn0file0L53-L77

### 8.2 Illustration behaviour
The uploaded character assets should feel like a living extension of the brand’s symbol and illustrations. The guidelines describe the illustration style as bold, elevated, dimensional, and defined by negative space and perspective, while the secondary symbol is described as symmetrical and balanced. fileciteturn0file0L68-L86

For the landing page, this means:
- preserve their simplicity and recognisability
- avoid applying visual effects that make them feel off-brand
- do not add heavy shadows, gradients, or textures unless specifically approved
- allow motion to create personality rather than over-styling the artwork

### 8.3 Background treatment
Recommended default:
- **Cream** page background or a very light brand background
- Hourglass outline/walls in **Navy** or a subtle tonal treatment
- Characters provide the main colour accents

Alternative approved direction:
- subtle colour-blocking using brand palette accents, while keeping the hierarchy led by Cream and Navy

### 8.4 Bell icon styling
- Should match the brand language: simple, rounded, friendly
- Use a clean outlined or minimal filled style
- Should harmonise with the icon system direction in the brand book rather than feeling generic or overly sharp. The guidelines state that icons should provide conceptual clarity and visual interest through simple shapes and forms. fileciteturn0file0L87-L91

---

## 9. Technical Specification

### 9.1 Stack
- `index.html`
- `style.css`
- `script.js`
- `p5.min.js`
- optional `matter.min.js`
- local font files for Montserrat
- local PNG assets for characters and icons

### 9.2 Suggested directory structure
```text
/project-root
  index.html
  /css
    style.css
  /js
    script.js
    p5.min.js
    matter.min.js            # optional but recommended
  /assets
    /fonts
      Montserrat-Regular.ttf
      Montserrat-Bold.ttf
    /images
      logo-skippies.svg|png
      bell-icon.svg|png
      hourglass-mask.svg|png # optional reference asset
      characters/
        calm-1.png
        calm-2.png
        ...additional PNGs
```

### 9.3 CSS variables
At minimum define variables for:
- colour palette
- font family
- header height
- spacing scale
- z-index layers
- canvas sizing helpers
- modal widths / radii / shadows if used

### 9.4 JavaScript responsibilities
`script.js` should handle:
- asset loading configuration
- physics world setup
- canvas resize handling
- click-to-spawn logic
- auto-spawn timing
- header CTA open/close behaviour
- email form submission handler
- accessibility helpers for modal or signup panel
- reduced-motion or performance adjustments

### 9.5 Physics world setup
#### Static bodies
- left/top hourglass wall
- right/top hourglass wall
- neck/funnel geometry
- left/bottom hourglass wall
- right/bottom hourglass wall
- optional invisible world bounds offscreen

#### Dynamic bodies
- character instances

#### Instance properties
- sprite/image reference
- width/height
- physics radius or body polygon
- restitution / bounce
- friction
- air resistance
- spawn timestamp
- state flags if needed

### 9.6 Rendering approach
Two viable approaches:

#### Approach A: image texture on body
- render PNG sprite at Matter.js body position and angle
- simplest for branded asset preservation

#### Approach B: soft proxy collision body + image overlay
- use circle or capsule-like collision body
- draw PNG centred on body with scaling
- recommended if the irregular PNG edges make exact collision too unstable

**Recommended:** use simplified collision shapes while drawing the full PNG image for visual consistency.

### 9.7 Spawn logic
- Automatic spawn every X seconds
- Manual spawn on click/tap in upper half
- Respect max active body count
- Remove offscreen or sleeping bodies only if necessary
- Avoid spawning directly inside other bodies

### 9.8 Breakpoint guidance
Suggested breakpoints:
- desktop: `1200px+`
- tablet: `768px–1199px`
- mobile: `<768px`

Potential adjustments by breakpoint:
- reduce character size slightly on mobile
- reduce spawn frequency on mobile
- simplify header layout if needed
- enlarge CTA tap targets on touch devices

---

## 10. UX Requirements

### 10.1 Desired user journey
1. User lands on page
2. Immediately sees strong branded hourglass interaction
3. Understands that SKIPPIES is launching soon
4. Experiments by clicking/tapping to spawn characters
5. Feels curiosity and delight
6. Clicks “Notify me”
7. Enters email and submits
8. Receives clear confirmation state

### 10.2 Emotional goals
The page should create a feeling of:
- curiosity
- calm delight
- trust
- anticipation
- memorability

### 10.3 Interaction principles
- The experience should be intuitive without instructions, or require only a very subtle cue.
- It should reward interaction but still look attractive if the user does nothing.
- Motion should feel smooth and grounded.
- The interface should never feel cluttered.

---

## 11. Non-Goals / Avoid

Avoid the following:
- overly loud or chaotic animation
- generic startup landing page styling
- dark, harsh, clinical, or tech-heavy visual language
- unbranded UI components that clash with the identity
- excessive copy
- overcomplicated navigation or multi-page structure
- off-brand colour combinations dominating the page
- any logo misuse forbidden by the brand book

The logo misuse section explicitly prohibits adding gradients, rotating, placing in holding shapes, rearranging elements, multiplying the mark, adding shadows, or using non-brand colours. fileciteturn0file0L166-L174

---

## 12. Open Implementation Decisions

These items may still need confirmation during design/development:
- exact hourglass visual style: outline only, translucent fill, or masked shape
- whether the hourglass walls are visible at all times or implied through motion
- exact email platform integration
- whether supporting launch copy appears permanently or only in the signup state
- whether the bell icon is supplied as a brand asset or needs to be drawn
- whether a reduced-motion toggle is explicitly exposed or handled automatically

---

## 13. Acceptance Criteria

The project should be considered successful if:
- it is a single-page responsive website built with HTML, CSS, JavaScript, and p5.js
- the page clearly communicates **SKIPPIES / COMING SOON**
- the header contains the required three-part structure
- clicking **Notify me** opens a working signup interface
- the page includes a large interactive hourglass occupying most of the screen
- users can click to spawn characters in the top half
- characters also auto-spawn and fall under gravity
- characters collide convincingly and move through the hourglass neck
- multiple PNG character assets can be cycled through
- colours are implemented as CSS custom properties
- Montserrat is used throughout
- the design remains aligned with the SKIPPIES brand guidelines
- the experience performs smoothly on modern desktop and mobile browsers

---

## 14. Recommended Next Deliverables

After this requirements document, the logical next outputs would be:
1. a wireframe / layout plan
2. a visual direction board using the approved brand system
3. a technical implementation plan for p5.js + Matter.js
4. the first coded prototype

