# Game thumbnails

Drop game cover images in this folder, then in `src/lib/catalog.ts` set the
matching game's `image` field to `/games/<filename>`.

Example:

```
image: "/games/forza-horizon-5.jpg",
```

If a game has no `image` set, the site automatically falls back to the
generated color-art thumbnail — so you can add photos gradually, one game
at a time.
