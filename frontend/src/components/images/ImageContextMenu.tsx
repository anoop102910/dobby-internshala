import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { 
  Pencil, 
  Trash2, 
  Share, 
  Download,
  Eye
} from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { Image } from "@/types/api.types";

interface ImageContextMenuProps {
  children: React.ReactNode;
  image: Image;
  onView: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

export const ImageContextMenu = ({
  children,
  image,
  onView,
  onDelete,
  onRename,
}: ImageContextMenuProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onRename(image.name)}>
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem>
            <Share className="mr-2 h-4 w-4" />
            Share
          </ContextMenuItem>
          <ContextMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Download
          </ContextMenuItem>
          <ContextMenuItem
            className="text-red-600 dark:text-red-400"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Image"
        description={`Are you sure you want to delete "${image.name}"?`}
        onConfirm={onDelete}
      />
    </>
  );
}; 