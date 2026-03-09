import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoriesQuery = trpc.categories.list.useQuery();
  const photosQuery = trpc.photos.list.useQuery({
    categoryId: selectedCategory,
    limit: 24,
    offset: 0,
  });

  useEffect(() => {
    if (photosQuery.data) {
      setPhotos(photosQuery.data);
      setLoading(false);
    }
  }, [photosQuery.data]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Gallery</h1>
          <p className="text-gray-600">Explore our collection of beautiful photography</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === undefined
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-red-500"
              }`}
            >
              All
            </button>
            {categoriesQuery.data?.map((category: any) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedCategory === category.id
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-red-500"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No photos found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-end p-4">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition">
                    <h3 className="font-semibold text-lg">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-sm text-gray-200 line-clamp-2">{photo.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
