import PhotoCard from "./PhotoCard";

export default function PhotoGrid({ photos = []}) {
    if (photos.length === 0 ) return null;
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {photos.map(photo => (
                <PhotoCard key={`${photo.id}-${photo.download_url}`} photo={photo}/>
            ))}
        </div>
    )
}