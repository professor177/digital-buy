export function safeEmbedUrl(input: string | null) {
  if (!input) return null;
  try {
    const u = new URL(input);
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (["www.youtube.com","youtube.com"].includes(u.hostname)) {
      if (u.pathname === "/watch") { const id = u.searchParams.get("v"); return id ? `https://www.youtube.com/embed/${id}` : null; }
      if (u.pathname.startsWith("/embed/")) return `https://www.youtube.com${u.pathname}`;
    }
    if (["vimeo.com","www.vimeo.com"].includes(u.hostname)) { const id = u.pathname.split("/").filter(Boolean)[0]; return id ? `https://player.vimeo.com/video/${id}` : null; }
    if (u.hostname === "player.vimeo.com" && u.pathname.startsWith("/video/")) return input;
  } catch { return null; }
  return null;
}
