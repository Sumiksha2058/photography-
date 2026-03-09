import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function PhotoUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const categoriesQuery = trpc.categories.list.useQuery();
  const createPhotoMutation = trpc.photos.create.useMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !categoryId || !imageFile) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUploading(true);

    try {
      // TODO: Upload image to S3 and get URL
      // For now, using a placeholder URL
      const imageUrl = preview; // In production, upload to S3

      await createPhotoMutation.mutateAsync({
        title,
        description,
        categoryId: Number(categoryId),
        imageUrl,
        featured,
      });

      toast.success("Photo uploaded successfully!");
      setTitle("");
      setDescription("");
      setCategoryId("");
      setFeatured(false);
      setImageFile(null);
      setPreview("");
    } catch (error) {
      toast.error("Failed to upload photo");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Photo</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo Title *
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter photo title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Select a category</option>
              {categoriesQuery.data?.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter photo description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            ></textarea>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 text-red-500 rounded"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Mark as Featured
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition">
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer text-sm font-medium"
                >
                  Change Image
                </label>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="inline-block px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer font-medium"
                >
                  Choose Image
                </label>
                <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setTitle("");
              setDescription("");
              setCategoryId("");
              setFeatured(false);
              setImageFile(null);
              setPreview("");
            }}
          >
            Clear
          </Button>
          <Button
            type="submit"
            disabled={isUploading}
            className="bg-red-500 hover:bg-red-600"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Photo"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
