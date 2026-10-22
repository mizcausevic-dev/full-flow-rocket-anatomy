# Safeguards

Reviewed against the page as shipped.

- Static export. No server, no database, no account.
- No form and no lead capture. A contact form would need a stated purpose, notice, and retention rule. This page does not collect personal data.
- No analytics tag and no third-party runtime script. Fonts are self-hosted by `next/font` at build time.
- Outbound links use `rel="noopener noreferrer"`.
- The frame index from the scrubber is clamped to 0-1019.
- The canvas has no executable content from the network. Drawing is a function of the frame.
- Chapter text is real HTML beside the canvas, with a polite live region on stage changes only.
- The plate pauses when it leaves the viewport and when the tab is hidden.
- `prefers-reduced-motion` prevents autoplay. Playback still works if the viewer presses play.
- No secrets, tokens, or environment files are part of the site.
- Operating numbers are omitted rather than filled in. That is the accuracy control, not only a style choice.
