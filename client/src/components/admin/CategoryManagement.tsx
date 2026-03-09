import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function CategoryManagement() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [editData, setEditData] = useState<any>({});

  const categoriesQuery = trpc.categories.list.useQuery();
  const createCategoryMutation = trpc.categories.create.useMutation();
  const updateCategoryMutation = trpc.categories.update.useMutation();
  const deleteCategoryMutation = trpc.categories.delete.useMutation();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
      });
      toast.success("Category created successfully");
      setNewCategory({ name: "", slug: "", description: "" });
      setIsAdding(false);
      categoriesQuery.refetch();
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setEditData(category);
  };

  const handleSaveEdit = async () => {
    try {
      await updateCategoryMutation.mutateAsync({
        id: editingId!,
        name: editData.name,
        slug: editData.slug,
        description: editData.description,
      });
      toast.success("Category updated successfully");
      setEditingId(null);
      categoriesQuery.refetch();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategoryMutation.mutateAsync(id);
        toast.success("Category deleted successfully");
        categoriesQuery.refetch();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  if (categoriesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-red-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Categories</h2>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-red-500 hover:bg-red-600"
        >
          <Plus size={16} className="mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add New Category Form */}
      {isAdding && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <Input
                type="text"
                value={newCategory.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setNewCategory({
                    ...newCategory,
                    name,
                    slug: generateSlug(name),
                  });
                }}
                placeholder="e.g., Weddings"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <Input
                type="text"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
                placeholder="e.g., weddings"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
                placeholder="Category description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={handleAddCategory}
              className="bg-green-500 hover:bg-green-600"
            >
              Create Category
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewCategory({ name: "", slug: "", description: "" });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      {categoriesQuery.data && categoriesQuery.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No categories yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Slug</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesQuery.data?.map((category: any) => (
                <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {editingId === category.id ? (
                      <Input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === category.id ? (
                      <Input
                        type="text"
                        value={editData.slug}
                        onChange={(e) =>
                          setEditData({ ...editData, slug: e.target.value })
                        }
                      />
                    ) : (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {category.slug}
                      </code>
                    )}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">
                    {editingId === category.id ? (
                      <textarea
                        value={editData.description || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, description: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        rows={2}
                      />
                    ) : (
                      category.description || "-"
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {editingId === category.id ? (
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
                            onClick={() => handleEdit(category)}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(category.id)}
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
