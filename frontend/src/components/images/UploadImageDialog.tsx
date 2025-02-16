import { useState } from "react";
import { useUploadImage } from "@/services/image.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImagePlus, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

interface UploadImageDialogProps {
  parentId?: string;
}

export const UploadImageDialog = ({ parentId }: UploadImageDialogProps) => {
  const [open, setOpen] = useState(false);
  const { uploadImage, isPending } = useUploadImage();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    uploadImage(
      { file, folderId: parentId },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Image uploaded successfully");
        },
        onError: () => {
          toast.error("Failed to upload image");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ImagePlus className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-primary" : "border-neutral-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={handleFileChange}
            disabled={isPending}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-8 w-8 mb-2 text-neutral-500" />
            <p className="text-sm text-neutral-600">
              {isPending
                ? "Uploading..."
                : "Drag and drop an image here, or click to select"}
            </p>
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 