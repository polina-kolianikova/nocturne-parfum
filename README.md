# NOCTURNE

An independent niche fragrance concept by Polina Koljanikova. A monochrome interactive website about light, facets and the layers of a scent.

## Run

Serve this folder with a static HTTP server. There is no build process, package installation, CDN, API key or external font request. Publish the folder root as a dedicated GitHub Pages project when authorised. `.nojekyll` is included.

## Working interactions

Native scrolling opens a narrow light slit, reveals the bottle, separates 48 facets and brings the same facets back into their original shape. The fragrance stage buttons change the visual tone and descriptions.

The atelier lets a visitor choose an opening, heart and base from 27 combinations. Their choices generate a named personal portrait, a constellation, a numbered study and a downloadable text selection. An impression slider changes the selection and constellation. Nothing is submitted or purchased.

## Resilience

Native radio and range inputs, visible focus, semantic headings, skip navigation and polite result announcements support keyboard use. Mobile has a dedicated centred composition. Reduced motion fixes the angle and keeps the bottle assembled. Without WebGL, a CSS bottle illustration replaces the canvas and the entire atelier continues to work.

## Performance and diagnostics

48 facets share one InstancedMesh. There are no transmission materials, shadow maps, post-processing or perpetual RAF. One frame is requested when scroll, pointer, a control or viewport size changes. Offscreen and hidden state cancel pending frames. Rendering resumes only on meaningful input or visibility change.

Antialiasing is enabled. Canvas DPR starts at up to 1.5 with a three-million-pixel desktop budget and a 1.2-million-pixel mobile budget. Adaptive reduction ignores the first ten frames and needs 15 slow submissions within 20 consecutive active frames. That duration is not a measurement of GPU completion or FPS.

The document root exposes `data-render-frames`, `data-draw-calls`, `data-triangles`, `data-render-dpr` and `data-render-mode`. These are invisible diagnostics for the integrator. Idle frame counts must remain unchanged.

## Boundaries

NOCTURNE and its products are concepts. The visual material is stylised faceted silver, not a claim of physically accurate refractive glass. The atelier creates a preference selection, not a manufactured formula. It cannot emit or simulate an actual smell.

Dependencies and licenses are listed in `assets/LICENSES.md`. Browser QA belongs to the integrating project. Source checks alone do not establish visual acceptance or physical-device performance.
