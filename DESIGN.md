# Current visual implementation, October 2026

The product scene now uses generated photographic assets and DOM transforms driven by native scroll. This supersedes geometry and material details in the historical design notes below. Typography is defined in typography.css; generated product media is styled in product-art.css and positioned by product-story.js. Source generation prompts and full QA evidence are kept in the parent delivery workspace.

## Earlier direction

# NOCTURNE direction

## A different opening

The object lives at the centre of a grey-black space. A vertical light slit reveals it, rather than placing a headline beside a model. A whisper of the oversized house name remains behind the object. Bodoni Moda gives the typography a restrained fashion character; DM Sans handles coordinates and the atelier.

## Four chapters

| Stage | Object event | Reader route |
| --- | --- | --- |
| Introduction | A dark faceted bottle intersects a narrow light slit | Reveal the object |
| Form | The slit opens. Independent faces move apart from their actual original positions | Understand the architecture |
| Notes | The same facets rearrange in space and begin to return | Explore opening, heart and trace |
| Signature | The object is complete again | Create a personal scent portrait |

Each of 48 triangular faces retains a fixed original transform and centre. Scroll controls outward displacement and rotation, so reverse scrolling returns the same identity to its original surface. There is one instanced triangle draw call for all faces. The ring lines, cap, collar and printed plaque supply scale and construction detail.

## Material and light

Silver and dark graphite materials use an original small studio reflection map. Broad strips create contrasting facets. There is no expensive transmission buffer or full-screen glow filter. The look is an intentional silver sculpture, not a simulated clear bottle. The light slit and floor light are lightweight CSS gradients.

## Useful interaction

27 opening, heart and base selections generate a repeatable study number, title, description and constellation. The impression slider changes the final selection. The export includes all current choices and states that this is a preference portrait. No checkout or invented production claim is present.

## Motion and performance contract

The browser owns scroll position. One progress coordinate updates canvas and chapter indicator. There is no automatic narrative, inertial wheel interception or idle orbit. RequestAnimationFrame is only queued when a visible scene is invalidated. Hidden and offscreen states cancel it. Diagnostics expose actual renderer submissions, draw calls, triangles, DPR and mode.

Review initial frame, quarter transitions, reverse scroll, the 48-face reconstruction, note controls, keyboard radios and slider, portrait export, mobile viewport, reduced motion and WebGL fallback. A JavaScript submission duration is not GPU time. The integrator must inspect the actual browser frames before accepting the design.
