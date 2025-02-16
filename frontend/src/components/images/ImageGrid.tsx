import { useDeleteImage } from "@/services/image.service";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatFileSize } from "@/lib/utils";
import { ImagePreview } from "./ImagePreview";
import { useMemo } from "react";
import { sortItems } from "@/lib/utils";
import { Sortable, SortDirection, SortField } from "@/types/sort";
import { Image } from "@/types/api.types";
interface ImageGridProps {
  searchQuery?: string;
  sortConfig?: string;
  images: Image[];
}

export const ImageGrid = ({ 
  searchQuery = "",
  sortConfig = "name_asc",
  images
}: ImageGridProps) => {
  const { deleteImage } = useDeleteImage();

  const sortedAndFilteredImages = useMemo(() => {
    let items = images || [];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((image: any) => 
        image.name.toLowerCase().includes(query)
      );
    }

    // Sort
    const [field, direction] = sortConfig.split('_') as [SortField, SortDirection];
    return sortItems(items as unknown as Sortable[], field, direction);
  }, [images, searchQuery, sortConfig]);

  const handleDelete = (imageId: string) => {
    deleteImage(imageId, {
      onSuccess: () => {
        toast.success("Image deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete image");
      },
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedAndFilteredImages.map((image: any) => (
        <div key={image._id} className="group relative">
          <ImagePreview image={image} />
          <div className="mt-2">
            <p className="font-medium truncate">{image.name}</p>
            <p className="text-sm text-neutral-500">{formatFileSize(image.size)}</p>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this image? This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(image._id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
      {sortedAndFilteredImages.length === 0 && (
        <div className="col-span-full text-center py-8 text-neutral-500">
          No images found
        </div>
      )}
    </div>
  );
}; 