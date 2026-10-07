/**
 * Injects Cloudinary's auto-quality/auto-format transform into an
 * existing Cloudinary URL. No-op for any non-Cloudinary URL.
 * e.g. .../upload/v123/foo.jpg -> .../upload/q_auto,f_auto/v123/foo.jpg
 */
export function optimizedImageUrl(url: string, extra?: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/"))
    return url;
  const transform = extra ? `q_auto,f_auto,${extra}` : "q_auto,f_auto";
  return url.replace("/upload/", `/upload/${transform}/`);
}

/**
 * Derives a poster-frame thumbnail URL for a Cloudinary video — same
 * delivery path, just swap the video extension for an image one and
 * Cloudinary auto-extracts a frame. No-op for any non-Cloudinary URL.
 * e.g. .../video/upload/v123/foo.mp4 -> .../video/upload/v123/foo.jpg
 */
export function videoThumbnail(url: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/video/upload/"))
    return url;
  return url.replace(/\.[a-zA-Z0-9]+(\?.*)?$/, ".jpg");
}
