import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatFileSize } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  image: {
    imageUrl: string;
    name: string;
    size: number;
    type: string;
    createdAt: string;
  };
}

export const ImagePreview = ({ image }: ImagePreviewProps) => {
  const [open, setOpen] = useState(false);
  const createdDate = new Date(image.createdAt).toLocaleDateString();

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {image.imageUrl ? (
            <img
              src={image.imageUrl}
              alt={image.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-neutral-400" />
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{image.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video relative bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
              <img
                src={image.imageUrl}
                alt={image.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500">Size</p>
                <p className="font-medium">{formatFileSize(image.size)}</p>
              </div>
              <div>
                <p className="text-neutral-500">Type</p>
                <p className="font-medium">{image.type}</p>
              </div>
              <div>
                <p className="text-neutral-500">Created</p>
                <p className="font-medium">{createdDate}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 