import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function PhotoManagement() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const photosQuery = trpc.photos.list.useQuery({ limit: 100, offset: 0 });
  const categoriesQuery = trpc.categories.list.useQuery();
  const deletePhotoMutation = trpc.photos.delete.useMutation();
  const updatePhotoMutation = trpc.photos.update.useMutation();

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      try {
        await deletePhotoMutation.mutateAsync(id);
        toast.success("Photo deleted successfully");
        photosQuery.refetch();
      } catch (error) {
        toast.error("Failed to delete photo");
      }
    }
  };

  const handleEdit = (photo: any) => {
    setEditingId(photo.id);
    setEditData(photo);
  };

  const handleSaveEdit = async () => {
    try {
      await updatePhotoMutation.mutateAsync({
        id: editingId!,
        title: editData.title,
        description: editData.description,
        categoryId: editData.categoryId,
        featured: editData.featured === 1,
      });
      toast.success("Photo updated successfully");
      setEditingId(null);
      photosQuery.refetch();
    } catch (error) {
      toast.error("Failed to update photo");
    }
  };

  if (photosQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-red-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Photos</h2>

      {photosQuery.data && photosQuery.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No photos uploaded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Image</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Featured</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {photosQuery.data?.map((photo: any) => (
                <tr key={photo.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4">
                    {editingId === photo.id ? (
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      photo.title
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === photo.id ? (
                      <select
                        value={editData.categoryId}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            categoryId: Number(e.target.value),
                          })
                        }
                        className="px-2 py-1 border border-gray-300 rounded"
                      >
                        {categoriesQuery.data?.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      categoriesQuery.data?.find((c: any) => c.id === photo.categoryId)
                        ?.name
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === photo.id ? (
                      <input
                        type="checkbox"
                        checked={editData.featured === 1}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            featured: e.target.checked ? 1 : 0,
                          })
                        }
                        className="h-4 w-4"
                      />
                    ) : (
                      <span className="text-sm">
                        {photo.featured === 1 ? "✓ Yes" : "No"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {editingId === photo.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(photo)}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(photo.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
