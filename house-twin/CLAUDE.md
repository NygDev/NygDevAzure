# Mallingsrudveien 30 – digital twin

A 3D model of our house (1349 Rykkinn) built from the Anticimex plan sketches and the listing photos. It is a web viewer (three.js) plus a `.glb` for Blender. It is an approximation until we measure on site: treat numbers as estimates and say so.

- This project lives in `house-twin/` in the NygDevAzure repo, which is public on GitHub. Before September 2026 it was a separate, unversioned folder.
- **Some data is local only.** `.gitignore` keeps these out of git: the source photos, the plan sketches, the drawings and the map in `source/`, and the sales prospectus PDF. They are not ours to publish. The build still needs them, so they exist only on the owner's disk; keep a backup elsewhere. `source/photos/match.json` is tracked. A fresh clone can't build until `source/` is copied back in.
- Live page: https://claude.ai/artifact/E8JoapBerM672tRUuS9L6b. Republish `out/mallingsrudveien-30.html` to this URL; don't create a new one.
- Public page: the Azure Static Web App `nygdevhouse` (Free tier). It serves `../house/`, the built output.
  - To update it, run `python3 tools/site.py` after `shot.py export`. It writes `../house/index.html` and the `.glb`. Then commit on a branch.
  - Merging to master deploys it through `deploy-house.yml`. That workflow only watches `house/`, so changes here in `house-twin/` don't redeploy anything.
  - The site is served with `noindex`, so search engines skip it; anyone with the link can open it.
- Owner: Theodor. He prefers short answers and good approximations now over perfect data later.

## Build

Run everything from `house-twin/`:

```
python3 tools/extract.py      # plan scans -> wall masks (build/*.npy)
python3 tools/build.py        # masks -> build/model.json (walls, openings, rooms, stair, metres)
python3 tools/overlays.py     # plan crops -> build/plans.json
python3 tools/make.py         # web/head.part + web/body.part + build/*.json -> out/*.html
python3 tools/shot.py export  # headless screenshots -> build/shots/, and out/*.glb
python3 tools/check_glb.py    # reload the .glb in a plain viewer -> build/shots/glb_*.png
python3 tools/match.py        # fit a camera to 3 photos, overlay the model -> build/shots/match_*.png
python3 tools/site.py         # standalone index.html + .glb into ../house for the public site (or pass a folder)
```

On Windows, use `.venv\Scripts\python.exe` instead of `python3`. To set it up in `house-twin/`: `python -m venv .venv`, then `pip install opencv-python-headless numpy playwright`, then `playwright install chromium`. The tools create `build/` and `out/` themselves.

Always look at `build/shots/` after a change and compare against `source/photos/`. The GLB check matters because the .glb is what goes to Blender. For exterior changes, check `match_aerial.png` first. The drone camera fits to about 0.1 m, so it is the best plan check. The south and front matches are good for heights. The south camera's depth rests on one deck corner, so don't trust lounge positions there to better than about 0.5 m.

## Where things live

- `tools/build.py` holds all tracing, in plan-pixel coordinates. The scale is 75.35 px/m on both sheets, with the origin at the ground-floor inner NW corner, px (328, 208).
- `web/body.part` holds the viewer and all 3D construction. `web/head.part` holds the CSS.
- `source/plans`: Anticimex order 15085566 (today's layout).
- `source/drawings`:
  - `blockwatne-1993.jpg`: the original building drawing, with plans, sections and facades. It gives the heights and window sizes, but the layout has changed since.
  - `garasje-1994.jpg`: the garage drawing.
  - `va-kart-1-500.png`: the 1:500 map, which ties the house, the garage and the plot together.
- Facts from the Anticimex condition report (September 2026) and the sales prospectus live in the page's checks list and its "From the sales prospectus" section. The measured BRA is in the table under the room areas.
- `source/photos` holds the listing photos:
  - Outside: `front-west`, `northwest`, `terrace-south`, `terrace-dusk`, `garage`, and the top-down drone shot `47_…`. `lounge-inside` is a crop of `terrace-dusk`.
  - Loft: `34_…` (Loftstue looking into the dormer), `37_…` and `38_…` (Soverom 4), `42_…` (Soverom 2).
  - Ground floor: `stue-fireplace` (the Stue looking north at the fireplace) and `fireplace-closeup`.
  - `match.json` holds the reference points for `tools/match.py`.
- `vendor/three.js` is three r147. It is pinned because it's the last version with UMD `examples/js`. The page loads the same version from jsdelivr.

## Coordinates and heights

The unit is metres. x = plan right (roughly ESE), z = plan down (roughly SSW), y = up. Plan-up points 22.9° east of true north (1:500 map; the sketch's compass said 28°). The entrance faces WNW and the terrace faces SSW.

| What | Value | Source |
|---|---|---|
| Ground floor | 0; ceiling 2.36 (measured); walls to 2.63 with the 0.27 floor structure | Anticimex 2026 + 1993 section |
| Loft floor | 2.63; flat ceiling 2.40 at the collar ties (`H.ceilL`); knee walls 0.72 | measured |
| Main roof | 45° (the 1993 drawing says 42°, but the photos measure 45°); top 2.76 at the wall face; 0.5 build-up, 0.25 at the overhangs; ridge about 6.7 | photo + 1993 section |
| Dormer over the entrance | 45°; top 4.85 at its side walls; 0.30 build-up; 0.7 m side overhang; ridge just under the main ridge | front photo + 1993 facade |
| Windows | ground floor 0.9 / 2.1 (1.0 × 1.2 m; the white trims make them look like 0.8–2.2 in photos); front door and sidelights 2.08, terrace door 2.09; south gable 1.05 / 2.25; north gable 0.85 / 2.1, 0.65 wide; dormer 0.85 / 2.05 | 1993 drawing + photos |
| Terrace railing | 0.92 above the deck | measured |
| Garage | 6.0 × 7.0 m inside; walls about 2.0, ridge 2.2 above them; about 10 m west of the house | 1994 drawing + 1:500 map |
| Plot | 76/231, 566 m², from the registered boundary points (±0.3 m) | land registry + 1:500 map |
| Stair | 16 risers, winder at the top | loft sheet |
| Fireplace | Stone column at the sketch's flue square plus the stub east of it (`fire` in `build.py`), floor to ceiling. Corner stove in the corner beside it: 1.45 m tall, ledge at 0.42. Quarter-ellipse hearth plate 0.97 × 0.68. Stone on the north wall to x 5.12. White beam 0.26 × 0.25 from the column to the south wall | sketch + Stue photos |
| Covered lounge | x 6.3 (corner post) to 9.14 (drawn terrace edge); ridge 3.63 at x 6.93; 38° west, 46° east; west eave about 3.1, back wall about 1.2 | drone + south photo |

## Decisions already made (don't redo them)

- **The loft is centred over the ground floor** (`LDX=-60`). The photos show the south gable window dead centre and the dormer flush with the facade.
- **The stair, stair hole and chimney use ground-floor positions** (`LDXS=-100`). The loft sheet draws them about 0.5 m too far east. With this choice the chimney sits on the ridge, as in the photos.
- **Bathroom west windows follow the photo** (two windows of about 1.1 m), not the sketch (1.18 m + 0.57 m).
- **The laundry-room wall under the stair** is cut to the stair's underside (`stairWalls`).
- **The lounge sits inside the drawn terrace** (drone photo). Its back wall is on the terrace's east edge. Before v0.3 it was 1 m wider and ran 1.5 m past that edge.
- **North gable windows follow the Soverom 2 photo** (one 0.65 m sash each), not the sketch (1.18 m). `build.py` closes the sketch's wider gaps in `t2` so the rooms still flood-fill.
- **The model follows today's layout, not the 1993 drawings.** The prospectus lists the changes since then:
  - the bathroom took over a bedroom
  - the laundry room was a storage room
  - the terrace door moved to the south gable
  - the loft storage room moved
  - two loft bedrooms were made from the loft living room

  Use the 1993 drawing for heights and window sizes only.
- **Measured values beat photo estimates.** The heights in the table come from the Anticimex measurements where they exist. Photos decide only where nothing was measured, such as the roof pitch and the lounge.
- **The fireplace has no furniture.** The owner asked for the building only: column, stove, hearth and beam, no sofa, TV or tables.
- **The main roof is cut away only between the dormer walls** (`AK.zN`–`AK.zS`). The dormer's 0.7 m overhang sits above it. The dormer side walls carry on above the main roof to the valley (`ark vegg … over tak`).

## Rules

- **Build real geometry; don't rely on render-time clipping.** Loft, dormer and eave walls are cut to the roof with `trimmedPrism`/`lowerTop`. Clipping planes are only for the "Cut walls at 1.2 m" view. Anything clipped at render time pokes through the roof in the .glb.
- **One material per mesh.** Multi-material meshes lose their materials in the glTF export. `slab()` returns a group of two meshes for this reason.
- **Carve walls in copies.** When you carve walls in `build.py`, work on a copy (see `t1w`/`t1s`). Room areas come from flood-filling the uncarved mask, and carving the original merges rooms.
- **Static meshes get merged.** `mergeStatic()` runs after the walls are painted. It merges meshes that share a group, material and shadow settings into one mesh named after the material. This cut draw calls from about 360 to 50 and the .glb from 637 to 381 KB. Rooms and occluders stay separate. Give every new material a name in `MATNAMES`.
- **The viewer renders on demand.** The render loop sleeps while nothing moves. After you change anything visible outside the camera controls, call `redraw()`, which also wakes the loop. On a GPU that can't keep up (moving frames slower than about 35 fps), the camera moves at a lower resolution and the view is drawn sharp again when it stops.
- **The shadow map is static.** It is redrawn only when `applyFloors()` runs. If you move, show or hide something that casts a shadow anywhere else, set `renderer.shadowMap.needsUpdate=true` before `redraw()`.
- **The 3D is built after the first paint.** The script fills the rooms table, yields one frame, then builds the scene. Code that runs on a click should check `ready`.
- **Condition report pins.** In the "From the sales prospectus" section, each TG2 item that is in one place has a place button (`.spot[data-spot=…]`). `SPOTS` in `web/body.part` holds each pin's position, the view it switches to and its note. Items that cover the whole house (copper pipes, roof, drainage, windows) get no pin. The soot door's position isn't in the report, so its pin marks the chimney.
- **Keep the scene in sync with the checks list.** When something changes, update the checks list in `web/body.part`. Pills: `ok`, `photo`, `warn` (measure on site), `info` (assumed).
- **Network in the cloud sandbox.** npm, PyPI and CDN downloads are blocked, but `git clone` from GitHub works. `vendor/` has what the tests need.

## Still to measure on site

1. Entré length north–south: the dimensions on the drawing don't add up (3.42 + 3.69 + 4.21 ≠ 11.59).
2. The ridge height (about 6.7 m in the model), and the garage's wall and ridge heights. Ceilings and knee walls are now measured.
3. The number of stair steps, and headroom in the laundry room under the stair.
4. The width of the bathroom windows and the north gable windows.
5. Lounge heights: west eave, ridge and back wall. The drone photo already fixes its position in plan.

When the owner gives a measurement, change the constant (in `R`, `H`, `SH` or `GA` in `web/body.part`, or the pixel values in `tools/build.py`). Then switch that check's pill to `ok` and rebuild.
