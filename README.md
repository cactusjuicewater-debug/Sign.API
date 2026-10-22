# Artist Signature API (BitChord compatible)

BitChord's "Artist signatures" setting expects this layout:

- `GET /v1/health` -> `{ "ok": true }` (the app only saves your URL if this works)
- `GET /v1/signatures?artist=NAME` -> `{ artist, signatures[] }`, or `{ matches[] }` if several artists fit
- `GET /v1/name/NAME` -> same as above
- `GET /v1/search?q=TEXT` -> `{ results[], next }`
- Errors look like `{ "error": { "code", "message" } }`

## In the app
Settings -> Appearance -> Artist signatures ON -> close and reopen Settings -> enter your site address
(like `https://your-site.vercel.app`, no `/` on the end) -> Save.

## Add an artist
1. Put the picture in `public/signatures/` (SVG with a transparent background is best).
2. Copy a block in `data/signatures.json` and change it. `file` must match the picture's file name.
3. Fill in `license` and `source` honestly. Only add signatures you drew or have permission to use.
4. Redeploy with `vercel --prod`.

The two artists included are fake placeholders.
