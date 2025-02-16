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
import { Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    uploadImage(
      { file, folderId: parentId },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success('Image uploaded successfully');
        },
        onError: (error) => {
          if(error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Failed to upload image");
          } else {
            toast.error("Failed to upload image");
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Image</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload an introduction</DialogTitle>
          <p className="text-sm text-muted-foreground">
            For best results, image uploads should be at least 1080p (1920 x 1080 pixels) in JPG format.
          </p>
        </DialogHeader>
        <div
          className={`
            mt-4 p-12 border-2 border-dashed rounded-lg
            ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
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
            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              {isPending
                ? "Uploading..."
                : "Drag and drop image files to upload"}
            </p>
            <Button
              onClick={() => document.getElementById('image-upload')?.click()}
              variant="outline"
              className="mt-4"
              disabled={isPending}
            >
              Select files
            </Button>
          </label>
        </div>
        <div className="mt-4">
          <h3 className="font-medium mb-2">Step-by-step guide</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>1. Click "Select files" or drag and drop your image</p>
            <p>2. Choose a image that best represents you</p>
            <p>3. Your image will be private until you publish your profile</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 