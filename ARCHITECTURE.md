# Dev.Lair Architecture & Technical Documentation

## 1. Overview
**Dev.Lair** is a highly interactive, tactile web portfolio designed to mimic a vintage, neon-lit record shop floating in deep space. Instead of scrolling through standard text grids, users interact with the developer's work by physically sifting through 3D "Crates" of "Vinyl Records." Each record represents a discrete piece of content (an "About Me" profile, a featured project, or a work experience). 

By leveraging heavy physics and gestural interactions, users can physically tear a record out of a crate and throw it onto the right-hand dashboard to "play" it, bringing the portfolio to life with rich glassmorphism aesthetics and pixel-art elements.

---

## 2. Tech Stack
- **Framework:** Next.js (App Router paradigm) with React.
- **Styling:** Tailwind CSS combined with raw CSS for complex gradients and glassmorphism.
- **Animation & Physics:** `framer-motion` (powers the 3D stacking, elastic dragging, layout transitions, peek drawer, and physics-based gestural controls).
- **State Management:** `zustand` (provides a lightweight, globally accessible store without React Context boilerplate).
- **Icons:** `lucide-react`.
- **Background Renderer:** HTML5 Canvas (`CosmicRainCanvas`) for the deep-space environment with diagonal meteors and gentle rainfall.

---

## 3. Visual Theme
- **Primary Background:** Deep-space gradient rendered via Canvas (indigo/midnight blue with animated meteors and rain particles).
- **Accent Colors:** Warm amber/gold palette (`#D97706`, `#FBBF24`, `#CBB368`).
- **Glass Aesthetic:** Frosted glass panels using `bg-black/30 backdrop-blur-md border-white/10` for the header and main UI containers.
- **Record Player:** Solid opaque plinth (`linear-gradient(135deg, #2a2438, #171322)`) — intentionally NOT transparent so it reads as a physical 3D object.
- **Crate Shelves:** Metallic gray acrylic front panels with brushed steel gradients and neutral inner glow.
- **Pixel Art:** Calico sleeping cat GIF rests on top of the record player; 8-bit cat sticker sits on the plinth base.

---

## 4. Core Interaction Flow

The interaction model is built entirely around **gestures** rather than traditional clicking. 

1. **Sifting (Drag Left):** When a user grabs the front record of a Crate and drags it to the left (surpassing a `-100px` threshold), dropping it will trigger an array mutation. The front item is cycled to the back of the stack, and the next record visually floats to the front. 
2. **Playing (Drag Right):** When the user drags a record far to the right (surpassing a `200px` threshold—simulating tossing it onto the dashboard) and releases it:
   - The global `zustand` state is instantly updated to reflect this item as the newly active content.
   - The record triggers a sift mechanism to get out of the way for the next item in the Crate.
   - The right-hand dashboard instantly mounts the item's details.
3. **Vinyl Extraction (Hover):** When a user hovers over a record within the crate, the vinyl disc peeks out of its sleeve. The disc only slides out on explicit hover — it stays tucked in when merely "active" in the store.
4. **Peek Drawer (Proximity):** The left-hand record library is hidden by default, showing only a 40px vertical tab with a spinning disc icon and "CRATES" label. When the user moves their mouse near the left edge, the drawer smoothly springs open to 280px revealing the full crate library. Moving the mouse away causes it to retract after a 300ms grace period.

---

## 5. Application Architecture & File Structure

The codebase is contained entirely within the `src/` directory.

### `/src/app/`
- `layout.tsx`: HTML setup and Next.js metadata.
- `page.tsx`: The root mounting point. It imports the heavy UI components dynamically (`ssr: false`) to bypass server hydration mismatches with heavy window-based animations.
- `globals.css`: Contains CSS reset rules, raw keyframe animations (floating cats, twinkling stars, spinning vinyl), and global typography imports (Space Grotesk, JetBrains Mono, Press Start 2P). Custom scrollbar styles for the library drawer.

### `/src/store/`
- `musicStore.ts`: The central nervous system. Uses `zustand` to track:
  - Which section is currently active (`activeSection`: 'about' | 'projects' | 'bestsellers' | 'experience').
  - The array index of the currently active item, avoiding passing massive object data across components.
  - Global playback state (e.g., `isPlaying`, `muted`).
  - Drag state (`isDragging`) — consumed by the NowPlayingPanel to react to cross-boundary record drags.

### `/src/data/`
- `projects.ts` & `experience.ts`: Static arrays containing the content payload (titles, descriptions, tech stacks, theme colors, glowing accents, and designated pixel-art emojis).

### `/src/components/`
The UI is broken down into distinct, heavily isolated React components to prevent massive re-renders:

#### A. The Environment (`PixelRoom.tsx`)
The master layout orchestrator. 
- Renders `CosmicRainCanvas` as a full-viewport background layer.
- Uses a sticky, frosted-glass top-header (`DEV.LAIR`) with a dynamic "NOW PLAYING" status indicator that shows the active section name (ABOUT ME, FEATURED, EXPERIENCE, or PROJECT).
- Implements the **PeekDrawer + Full-Width Player** layout:
   - **PeekDrawer (Left):** An absolutely positioned drawer overlaying the left edge. Collapsed to 40px by default; expands to 280px on mouse proximity. Contains all the Crate stacks. Uses framer-motion spring animation (`stiffness: 400, damping: 35`) for the open/close transition.
   - **NowPlayingPanel (Right):** Takes the full viewport width. The player dashboard is always visible and the drawer overlays it when open.

#### B. The Peek Drawer (`PeekDrawer` in `PixelRoom.tsx`)
An internal component that manages the sliding library sidebar:
- **Proximity Detection:** An invisible 70px hit zone at the left edge triggers drawer open on `mouseEnter`.
- **Collapsed State (40px):** Shows a slowly rotating `Disc3` icon, vertical "CRATES" pixel text, a chevron indicator with breathing animation, and a glowing accent edge line.
- **Expanded State (280px):** Frosted glass backdrop (`rgba(5,3,10,0.75)` + `backdrop-blur-xl`). Content fades in with a 100ms stagger and slides in from -20px.
- **Scroll Handling:** Uses the same virtual-scroll mechanism as the old `LibraryPane` — records can be dragged out of the pane without clipping via `clipPath: 'inset(0 -100vw 0 0)'`.
- **Close Delay:** 300ms timeout prevents flicker when moving between drawer elements.

#### C. The Library (`Crate.tsx` & `VinylRecord.tsx`)
- **`Crate.tsx`**: A 3D spatial viewport with `perspective: 1200px`. Records are stacked using absolute positioning with decreasing `scale` and `translateY` offsets by array index. Each crate is wrapped in an **acrylic bin container** with:
  - A back wall gradient providing depth
  - A cool neutral inner glow at the base  
  - The records wrapper (absolute positioned, 160x160px)
  - A metallic gray front glass panel (`linear-gradient(135deg, ...)`) with brushed steel rim, glass glare, and a metal handle indent
- **`VinylRecord.tsx`**: The aesthetic unit. Renders the grooved disc (via complex linear/radial CSS gradients) and manages its own hover/press visual behaviors (sliding horizontally on hover only — not on active state).

#### D. The Background (`CosmicRainCanvas.tsx`)
- A standalone `<canvas>` element spanning the full viewport behind all content.
- Renders on a separate animation loop (independent of React state) using `requestAnimationFrame`.
- Paints: deep indigo/midnight gradient, diagonal meteor shower (white streaks with tails), and slow-falling rain particles.

#### E. The Outputs (`NowPlayingPanel.tsx`)
- The main full-width dashboard. Subscribes to `zustand`. When the active ID changes, it gracefully mounts the new content's metadata, long-form descriptions, tech stack chips, and spinning turntable visualizer.
- Contains an embedded music player bar at the bottom of the turntable plinth (play/pause, skip, waveform bars).
- Two decorative cat GIFs: sleeping calico on top of turntable, pixel cat sticker on the plinth corner.
- Uses `AnimatePresence` with `mode="popLayout"` for smooth crossfade transitions between different active records.

---

## 6. CSS & Z-Index Management Reference
Because the application relies heavily on cross-boundary dragging, z-index hierarchy is strictly guarded:
- **`CosmicRainCanvas`**: `z-index: 0` — deepest layer, full viewport canvas.
- **`Floor Glow`**: `z-index: 0` — gradient overlay at viewport bottom.
- **`NowPlayingPanel`**: `z-index: 0` (relies on its own container constraints).
- **`Top Header`**: `z-index: 60` — frosted glass header strip.
- **`PeekDrawer`**: `z-index: 90` — overlays the player when open.
- **`Proximity Zone`**: `z-index: 100` — invisible hit area, disabled when drawer is open.
- **`Dragged Record`**: `z-index: 9999` — via `whileDrag` prop, ensures dragged records float above everything.

## 7. Crate Sections
The library contains four crate categories, each with its own accent color:
| Crate | Store Key | Accent |
|-------|-----------|--------|
| ABOUT ME | `about` | `#D97706` |
| FEATURED PROJECTS | `bestsellers` | `#FBBF24` |
| EXPERIENCE | `experience` | Per-item from data |
| PROJECTS | `projects` | Per-item from data |

## 8. How to Extend
To add new records to a bucket, simply append a new object to the related array (e.g., `PROJECTS` in `projects.ts`).
To add a new entirely separate section (e.g., "Blog Posts"), you would:
1. Define the type interface in `musicStore.ts`.
2. Construct a new `<Crate />` row block inside the PeekDrawer's content area in `PixelRoom.tsx`.
3. Map the data cleanly into `<VinylRecord />` children.
