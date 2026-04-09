export function extractGoogleDriveFileId(input = "") {
  const value = String(input || "").trim();
  if (!value) return null;

  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i,
    /drive\.google\.com\/thumbnail\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i,
    /[?&]id=([a-zA-Z0-9_-]{10,})/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }

  try {
    const url = new URL(value);
    const id = url.searchParams.get("id");
    if (id) return id;

    const pathMatch = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/i);
    if (pathMatch?.[1]) return pathMatch[1];
  } catch {
    return null;
  }

  return null;
}

export function normalizeGoogleDriveImageUrl(input = "") {
  const value = String(input || "").trim();
  if (!value) return "";

  const fileId = extractGoogleDriveFileId(value);
  if (!fileId) return value;

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
}

export function normalizeCoverImageUrl(input = "") {
  const value = String(input || "").trim();
  if (!value) return "";

  if (
    value.includes("drive.google.com") ||
    value.includes("docs.google.com")
  ) {
    return normalizeGoogleDriveImageUrl(value);
  }

  return value;
}