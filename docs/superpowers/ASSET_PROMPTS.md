# FourthWallBreaks v5.0.0 Asset Prompts

Generated: 2026-05-01

These prompts are designed for AI image generators (Midjourney, DALL-E 3, Stable Diffusion/FLUX) or human pixel/texture artists. All assets must be **transparent PNGs** meant to be displayed as RPG Maker MZ `Picture` overlays.

---

## Shared Technical Requirements

- **Resolution:** 1920×1080 (or 816×624 if targeting default MV/MZ resolution; 1920×1080 recommended for HD projects)
- **Format:** PNG with alpha transparency
- **Color mode:** RGB
- **Style baseline:** Photorealistic cracked glass / broken LCD screen / digital corruption. High contrast. Works as a screen-space overlay.
- **Naming:** Place in `img/pictures/` as `FourthWall_05_ThinTear.png` etc.

---

## FourthWall_05_ThinTear.png
**Channel:** `cracks` (pack: `deep_fracture`, `digital_split`)
**Purpose:** Stage 1–2 subtle crack. A single hair-thin rupture that looks like the screen itself is splitting at a molecular level.

### Prompt
```
Photorealistic close-up of a single ultra-thin hairline tear in a glass LCD screen, 
dark background, the crack is razor-thin and slightly luminous with faint blue-white 
refraction at the edges, no spiderwebbing, no shards, one clean line with micro-fractures 
branching only at the very end, isolated on pure black, alpha transparency, 
8K texture, macro lens, dramatic side lighting, high contrast.
```

### Notes for Artist
- Keep the crack **centered or slightly off-center**; RPG Maker will center the sprite.
- The tear should look like it goes *through* the glass, not just on the surface.
- Avoid dust, fingerprints, or environmental context—this is a UI overlay, not a scene.

---

## FourthWall_06_DeepFracture.png
**Channel:** `cracks` (pack: `deep_fracture`, `void_tear`)
**Purpose:** Stage 2–3 deep fracture. Heavier than `RealityCrack` but more structured than `ScreenShatter`.

### Prompt
```
Photorealistic deep fracture in a tempered glass monitor screen, thick primary fracture 
line with jagged secondary cracks branching outward, dark void visible inside the crack 
like ink or empty space, subtle chromatic aberration red/blue fringing at fracture edges, 
fine glass dust particles suspended around the break, isolated on pure black background, 
alpha transparency, macro photography, cinematic lighting from below, 8K texture, 
no hands, no environment, just the broken screen surface.
```

### Notes for Artist
- This should feel **structural and deep**, not just surface scratches.
- Include subtle **red/blue chromatic fringe** at the crack edges (the plugin will amplify this).
- The "void" inside the crack should be near-pure black so it reads as depth.

---

## FourthWall_07_StaticVeil.png
**Channel:** `overlays` (pack: `static_veil`, `cosmic_noise`, `hostile_system`)
**Purpose:** A noise/static layer applied over the entire screen. Used at higher presence tiers or hostile stages.

### Prompt
```
Dense analog TV static noise texture, black and white with faint silver and blue 
monochrome grain, heavy scanline interference, occasional horizontal tear lines, 
faint ghost images of random geometric shapes barely visible in the noise, 
full-frame seamless texture, isolated on pure black with alpha transparency 
so static particles float over darkness, retro VHS decay aesthetic, 
no text, no recognizable objects, pure visual noise, 8K resolution.
```

### Notes for Artist
- This needs to tile or cover the full frame evenly.
- Keep it **monochrome** (black/white/gray with subtle blue tint) so it tints well in-engine.
- The plugin will animate flicker and opacity—static frames should be dense enough to read at 15-25% opacity.

---

## FourthWall_08_EdgePressure.png
**Channel:** `overlays` (pack: `edge_pressure`, `void_entity`)
**Purpose:** Vignette/edge-darkening overlay that creates claustrophobic pressure around the screen borders.

### Prompt
```
Dark vignette overlay for a horror game UI, heavy black pressure creeping inward 
from all four edges of the frame, irregular organic border like smoke, mold, or 
burned film edges rather than a smooth gradient, subtle tendrils reaching toward 
center, faint red-brown discoloration at the inner edge of the darkness, 
full-frame composition, pure black in the outer 15% of the frame, 
alpha transparency, cinematic aspect ratio, no center detail—leave the middle 
70% of the frame mostly clear and transparent, 8K texture.
```

### Notes for Artist
- **Critical:** The center ~70% must remain transparent or nearly transparent. This is a border-only effect.
- The edge should feel **organic and threatening**, not a clean gradient.
- Think "closing in on the player" rather than "photo vignette."

---

## FourthWall_09_PresenceMark.png
**Channel:** `overlays` (pack: `presence_mark`, `cosmic_noise`)
**Purpose:** A symbol or mark that suggests the entity is watching. Appears as a subtle watermark or sigil.

### Prompt
```
Single mysterious occult-tech symbol floating in darkness, like a blend of 
circuit-board traces and an impossible geometric sigil, faintly glowing with 
dull amber and violet light, subtle CRT scanline texture across the symbol, 
fine hairline cracks emanating from the symbol edges as if reality fractures 
around it, isolated on pure black background, alpha transparency, 
centered composition, single focal point, no text, no letters, 
abstract glyph aesthetic, 8K resolution, cinematic.
```

### Notes for Artist
- This should read as a **logo or watermark** for the entity—not text, not a face.
- Keep it **subtle and elegant**; it will often render at low opacity.
- The cracks radiating from it help tie it visually to the crack system.
- Avoid overtly religious or culturally specific symbols. Aim for fictional/occult-tech.

---

## Optional Bonus Assets (Future Packs)

If you want to expand the style pack library further, these would slot into the existing channels:

### `FourthWall_10_DigitalSplit.png`
**Channel:** `cracks` (pack: `digital_split`)
```
Glitch-art screen rupture, horizontal and vertical pixel-shifted tear in a digital 
display, RGB channel separation along the crack lines, blocky pixel corruption, 
scanline displacement, isolated on black, alpha transparency, cyberpunk aesthetic.
```

### `FourthWall_11_CosmicDust.png`
**Channel:** `overlays` (pack: `cosmic_noise`)
```
Sparse starfield and nebula dust particles, deep space texture with subtle 
purple and teal gas clouds, very faint, suitable for low-opacity overlay, 
full frame, isolated on pure black, alpha transparency, ethereal and vast.
```

### `FourthWall_12_BloodVignette.png`
**Channel:** `overlays` (pack: `hostile_system`)
```
Dark red-black vignette creeping from screen edges, thick liquid texture 
like drying blood or oil, heavy and visceral, organic drips reaching inward, 
full frame with transparent center, alpha transparency, hostile and biological.
```

---

## Style Consistency Checklist

When reviewing generated or commissioned assets, ensure:

- [ ] **Transparent background** (alpha channel, not black-filled)
- [ ] **No text or recognizable real-world logos**
- [ ] **High contrast** so they read at low opacity (15-40%)
- [ ] **Centered or full-frame** composition as appropriate
- [ ] **Matches the horror/psychological escalation tone** of existing assets
- [ ] **Test at 25%, 50%, 75%, and 100% opacity** in an image viewer—must remain readable

---

## Integration Notes

After adding new assets to `img/pictures/`, update the built-in pack metadata in `js/plugins/FourthWallBreaks.runtime.js` (search for `registerBuiltInStylePacks`) so the plugin references the correct filenames. No code changes are needed beyond updating the string values in the pack registry.
