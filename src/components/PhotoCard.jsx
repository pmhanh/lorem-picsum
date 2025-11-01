import { Link } from "react-router-dom";
import { thumbUrl } from "../api/picsum";

export default function PhotoCard({ photo }) {
  const { id, author } = photo;
  return (
    <Link
      to={`/photos/${id}`}
      className="group block rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition"
    >
      <div className="aspect-[3/2] bg-gray-100">
        <img
          src={thumbUrl(id, 600, 400)}
          alt={`Photo ${id} by ${author}`}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-700">By <span className="font-medium">{author}</span></p>
      </div>
    </Link>
  );
}
