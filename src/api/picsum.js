const BASE = "https://picsum.photos";
const V2 = `${BASE}/v2`;

// List (you likely already have this)
export async function fetchPhotos(page = 1, limit = 30, signal) {
  const res = await fetch(`${V2}/list?page=${page}&limit=${limit}`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch photos: ${res.status}`);
  return res.json();
}

// Detail by id
export async function fetchPhotoById(id, signal) {
  const res = await fetch(`${BASE}/id/${id}/info`, { signal });
  if (!res.ok) throw new Error(`Photo ${id} not found`);
  return res.json(); // { id, author, width, height, download_url, url }
}

// Image URL helpers
export function thumbUrl(id, w = 600, h = 400) {
  return `${BASE}/id/${id}/${w}/${h}`;
}
export function largeUrl(id, w = 1600, h = 1000) {
  return `${BASE}/id/${id}/${w}/${h}`;
}
