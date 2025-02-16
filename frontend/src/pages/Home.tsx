import { useState } from "react";
import { FolderList } from "@/components/folders/FolderList";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useParams } from "react-router-dom";

export const Home = () => {
  const { folderId } = useParams();
  const [currentFolder, setCurrentFolder] = useState<string | undefined>();
  const [folderPath, setFolderPath] = useState<string[]>([]);

  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId);
    setFolderPath([...folderPath, folderId]);
  };

  const handleNavigate = (folderId: string | undefined) => {
    if (!folderId) {
      setCurrentFolder(undefined);
      setFolderPath([]);
    } else {
      const index = folderPath.indexOf(folderId);
      setCurrentFolder(folderId);
      setFolderPath(folderPath.slice(0, index + 1));
    }
  };

  const handleBack = () => {
    const newPath = [...folderPath];
    newPath.pop();
    setFolderPath(newPath);
    setCurrentFolder(newPath[newPath.length - 1]);
  };

  return (
    <div className="space-y-4">
      {currentFolder && (
        <Button
          size="sm"
          onClick={handleBack}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}
      <FolderList
        parentId={folderId}
        onFolderClick={handleFolderClick}
        folderPath={folderPath}
        onNavigate={handleNavigate}
      />
    </div>
  );
}; 