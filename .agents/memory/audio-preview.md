---
name: Event audio previews
description: Rules for the optional event atmosphere audio layer in Have Fun.
---

Event audio is an intentional detail-page enhancement, not background music: it stays muted until tapped, uses low volume, respects device silent mode, mixes with other audio, and pauses when the detail screen unmounts. Events without audio must render a clear disabled state instead of failing.

**Why:** The app is a discovery experience first; unexpected playback would make browsing disruptive and could create accessibility or battery issues.

**How to apply:** Preserve these constraints whenever audio sources, event metadata, or the detail-page player are changed. Keep short preview assets original or explicitly royalty-free.