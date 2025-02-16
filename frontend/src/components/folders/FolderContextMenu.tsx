import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { 
  Pencil, 
  Trash2, 
  FolderOpen, 
  Share, 
  Download 
} from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { RenameDialog } from "@/components/shared/RenameDialog";

interface FolderContextMenuProps {
  children: React.ReactNode;
  folder: {
    _id: string;
    name: string;
  };
  onOpen: () => void;
  onDelete: () => void;
  onRename: () => void;
}

export const FolderContextMenu = ({
  children,
  folder,
  onOpen,
  onDelete,
  onRename,
}: FolderContextMenuProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={onOpen}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Open
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setShowRenameDialog(true)}>
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
        title="Delete Folder"
        description={`Are you sure you want to delete "${folder.name}"? This will also delete all contents inside the folder.`}
        onConfirm={onDelete}
      />

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        title="Rename Folder"
        currentName={folder.name}
        onRename={onRename}
      />
    </>
  );
}; 