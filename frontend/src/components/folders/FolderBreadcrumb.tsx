import { useFolders } from "@/services/folder.service";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader2 } from "lucide-react";

interface FolderBreadcrumbProps {
  path: string[];
  onNavigate: (folderId: string | undefined) => void;
}

export const FolderBreadcrumb = ({ path, onNavigate }: FolderBreadcrumbProps) => {
  const { foldersData, isLoading } = useFolders(path[path.length - 1]);
  const currentFolder = foldersData?.data?.folders?.[0];

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => onNavigate(undefined)}>
            My Drive
          </BreadcrumbLink>
        </BreadcrumbItem>
        {path.length > 0 && <BreadcrumbSeparator />}
        {path.length > 0 && (
          <BreadcrumbItem>
            <BreadcrumbPage>{currentFolder?.name || "..."}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}; 