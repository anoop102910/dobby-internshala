import { FolderDot, Folder as FolderIcon, HardDrive } from "lucide-react";
import { useDeleteFolder, useFolders, useRenameFolder } from "@/services/folder.service";
import { Button } from "@/components/ui/button";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { ImageGrid } from "../images/ImageGrid";
import { UploadImageDialog } from "../images/UploadImageDialog";
import { FolderBreadcrumb } from "./FolderBreadcrumb";
import { formatFileSize } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/shared/SearchBar";
import { useState, useMemo } from "react";
import { SortDropdown } from "@/components/shared/SortDropdown";
import { sortItems } from "@/lib/utils";
import { FolderContextMenu } from "./FolderContextMenu";
import { toast } from "react-hot-toast";
import type { Folder } from "@/types/folder";
import type { Sortable, SortDirection, SortField } from "@/types/sort";
import { Link } from "react-router-dom";

interface FolderListProps {
  parentId?: string;
  onFolderClick?: (folderId: string) => void;
  folderPath: string[];
  onNavigate: (folderId: string | undefined) => void;
}

export const FolderList = ({ 
  parentId, 
  onFolderClick, 
  folderPath,
  onNavigate 
}: FolderListProps) => {
  const { foldersData, isLoading } = useFolders(parentId);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState("name_asc");
  const { deleteFolder } = useDeleteFolder();
  const { renameFolder } = useRenameFolder();
  const data = foldersData?.data;
  const {folders, images} = data || {folders: [], images: []};
  console.log(images);


  const sortedAndFilteredFolders = useMemo(() => {
    let items = folders || [];
    
    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((folder: Folder) => 
        folder.name.toLowerCase().includes(query)
      );
    }

    // Sort
    const [field, direction] = sortConfig.split('_') as [SortField, SortDirection];
    return sortItems(items, field, direction);
  }, [foldersData, searchQuery, sortConfig]);

  const sortOptions = [
    { label: "Name (A to Z)", value: "name_asc" },
    { label: "Name (Z to A)", value: "name_desc" },
    { label: "Size (Smallest first)", value: "size_asc" },
    { label: "Size (Largest first)", value: "size_desc" },
    { label: "Newest first", value: "createdAt_desc" },
    { label: "Oldest first", value: "createdAt_asc" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <FolderBreadcrumb path={folderPath} onNavigate={onNavigate} />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            <h2 className="text-xl font-semibold">
              {parentId ? "Folder Contents" : "My Drive"}
            </h2>
          </div>
          <div className="flex gap-2">
            <UploadImageDialog parentId={parentId} />
            <CreateFolderDialog parentId={parentId} />
          </div>
        </div>
        <div className="flex gap-4">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Search folders and images..."
            className="max-w-md"
          />
          <SortDropdown
            options={sortOptions}
            value={sortConfig}
            onChange={setSortConfig}
          />
        </div>
      </div>
      
      {/* Folders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAndFilteredFolders.map((folder: Folder ) => (
          <FolderContextMenu
            key={folder._id}
            folder={folder}
            onOpen={() => onFolderClick?.(folder._id)}
            onDelete={() => {
              deleteFolder(folder._id, {
                onSuccess: () => {
                  toast.success(`Deleted folder "${folder.name}"`);
                },
                onError: () => {
                  toast.error(`Failed to delete folder "${folder.name}"`);
                },
              });
            }}
            onRename={() => {
              renameFolder({
                folderId: folder._id,
                name: folder.name,
              }, {
                onSuccess: () => {
                  toast.success(`Renamed folder "${folder.name}"`);
                },
                onError: () => {
                  toast.error(`Failed to rename folder "${folder.name}"`);
                },
              });
            }}
          >
          <Link to={`/folder/${folder._id}`}>
              <Button
                variant="outline"
                className="h-auto p-4 flex items-start space-x-3 w-full"
              >
                <FolderIcon className="h-5 w-5 shrink-0" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{folder.name}</div>
                  <div className="text-sm text-neutral-500 flex justify-between">
                    <span>{folder.itemsCount} items</span>
                    <span>{formatFileSize(folder.size)}</span>
                  </div>
                </div>
              </Button>
          </Link>
          </FolderContextMenu>
        ))}
      </div>

      {/* Images */}
      <div>
        <h3 className="text-lg font-medium mb-4">Images</h3>
        <ImageGrid 
          images={images}
          folderId={parentId} 
          searchQuery={searchQuery}
          sortConfig={sortConfig}
        />
      </div>
    </div>
  );
}; 