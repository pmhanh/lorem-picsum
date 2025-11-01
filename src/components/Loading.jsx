export default function Loading({ text = "Đang tải..." }) {
  return (
    <div className="py-6 text-center text-sm text-gray-600 animate-pulse">
      {text}
    </div>
  );
}