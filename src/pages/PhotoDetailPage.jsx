import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPhotoById, largeUrl } from "../api/picsum";

export default function PhotoDetailPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetchPhotoById(id, controller.signal)
      .then(setPhoto)
      .catch(e => { if (e.name !== "AbortError") setErr(e.message || "Failed to load"); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading photo…</div>;
  if (err) return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <Link to="/photos" className="text-blue-600 hover:underline">&larr; Back</Link>
      <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">{err}</div>
    </div>
  );
  if (!photo) return null;

  const { id: pid, author, width, height, download_url } = photo;
  const title = `Untitled #${pid}`;
  const description = "No description available.";

  return (
<div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 py-6">
  <div className="max-w-4xl w-full text-center">
          <h1 className="text-2xl sm:text-3xl font-bold justify-center">{title}</h1>
          <p className="text-gray-600 mt-1">By <span className="font-medium">{author}</span> • {width}×{height}px</p>

          <div className="mt-5 rounded-xl overflow-hidden bg-gray-100">
            <img src={largeUrl(pid, 1600, 1000)} alt={`Photo ${pid} by ${author}`} className="w-full h-auto object-contain" />
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-gray-700 mt-1">{description}</p>
          </div>

          <div className="mt-4">
            <a href={download_url} target="_blank" rel="noreferrer" className="inline-block rounded-lg border px-4 py-2 hover:bg-gray-50">
              Open original
            </a>
          </div>
      </div>

    </div>
  );
}
