import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPhotos } from "../api/picsum";
import PhotoGrid from "../components/PhotoGrid";
import Loading from "../components/Loading";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const PAGE_SIZE = 30;
const STORAGE_KEY = "picsum_photos_state";

export default function PhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  // ⭐ helper: lưu state vào sessionStorage
  const persistState = useCallback(() => {
    const payload = {
      photos,
      page,
      hasMore,
      scrollY: window.scrollY,
      ts: Date.now()
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [photos, page, hasMore]);

  // ⭐ helper: khôi phục state (return true nếu khôi phục được)
  const restoreState = useCallback(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    try {
      const s = JSON.parse(raw);

      // (tuỳ chọn) Invalidate cache nếu quá cũ, ví dụ > 30 phút
      const THIRTY_MIN = 30 * 60 * 1000;
      if (!s.ts || Date.now() - s.ts > THIRTY_MIN) return false;

      if (Array.isArray(s.photos) && s.photos.length > 0) {
        setPhotos(s.photos);
        setPage(s.page || 1);
        setHasMore(typeof s.hasMore === "boolean" ? s.hasMore : true);
        setInitialLoading(false);

        // Khôi phục scroll
        setTimeout(() => {
          window.scrollTo(0, s.scrollY || 0);
        }, 0);

        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const loadPage = useCallback(
    async (nextPage) => {
      setError(null);

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const data = await fetchPhotos(nextPage, PAGE_SIZE, controller.signal);
        if (data.length === 0) {
          setHasMore(false);
          return;
        }

        if (nextPage === 1 && photos.length === 0) {
          // chỉ replace khi thật sự là “first real load”
          setPhotos(data);
        } else {
          setPhotos((prev) => [...prev, ...data]);
        }

        setPage(nextPage);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Không tải được ảnh");
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [photos.length]
  );

  // ⭐ Khi mount: cố khôi phục state; nếu không được thì mới fetch trang đầu
  useEffect(() => {
    const restored = restoreState();
    if (!restored) {
      loadPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chỉ chạy 1 lần

  // ⭐ Khi unmount: lưu state + scroll
  useEffect(() => {
    return () => {
      persistState();
    };
  }, [persistState]);

  // ⭐ (tuỳ chọn) Lưu state mỗi khi list/pages thay đổi
  useEffect(() => {
    persistState();
  }, [photos, page, hasMore, persistState]);

  const onLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => loadPage(page + 1), 80);
  }, [loadingMore, hasMore, loadPage, page]);

  const sentinelRef = useInfiniteScroll(
    onLoadMore,
    initialLoading || loadingMore || !hasMore
  );

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <header className="mb-2 flex justify-center flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Photo Gallery</h1>
        <p className="text-gray-600 mt-1">Cuộn xuống để tải thêm…</p>
      </header>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {initialLoading ? (
        <Loading text="Đang tải ảnh..." />
      ) : photos.length === 0 ? (
        <div className="py-12 text-center text-gray-600">Không có ảnh.</div>
      ) : (
        <>
          <PhotoGrid photos={photos} />
          <div ref={sentinelRef} className="h-1" />
          {loadingMore && <Loading text="Đang tải thêm..." />}
          {!hasMore && (
            <div className="py-6 text-center text-gray-500">
              Bạn đã xem hết danh sách 🎉
            </div>
          )}
        </>
      )}
    </div>
  );
}
