import { Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import PhotoDetailPage from "./pages/PhotoDetailPage.jsx";
import PhotosPage from "./pages/PhotoPage.jsx";

export default function App() {
  const location = useLocation();
  const showBack = location.pathname.startsWith("/photos/") && location.pathname !== "/photos";

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={() => window.history.back()}
                className="p-1.5 rounded-full hover:bg-gray-100 transition"
                title="Quay lại"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
            )}

            <NavLink to="/photos" className="font-semibold text-gray-800 hover:text-black">
              Photo Gallery
            </NavLink>
          </div>

          <a
            className="text-sm text-gray-600 hover:text-gray-900"
            href="https://picsum.photos/"
            target="_blank"
            rel="noreferrer"
          >
            API Docs
          </a>
        </div>
      </nav>

      <main className="flex-1 w-full flex justify-center items-start">
        <Routes>
          <Route path="/" element={<Navigate to="/photos" replace />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/photos/:id" element={<PhotoDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}





































