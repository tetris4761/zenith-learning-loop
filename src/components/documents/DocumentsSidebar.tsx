import React, { useState, useRef } from 'react';
import { Search, Plus, Folder, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderTree } from './FolderTree';
import { useDocuments } from '@/hooks/useDocuments';
import { cn } from '@/lib/utils';

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentsSidebarProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDocumentSelect: (documentId: string) => void;
  isLoading: boolean;
}

export function DocumentsSidebar({
  folders,
  selectedFolderId,
  onFolderSelect,
  searchQuery,
  onSearchChange,
  onDocumentSelect,
  isLoading,
}: DocumentsSidebarProps) {
  const { createDocument, isCreating } = useDocuments();
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleNewDocument = () => {
    createDocument({ 
      title: 'Untitled Document',
      folderId: selectedFolderId || undefined 
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onSearchChange('');
      searchInputRef.current?.blur();
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={handleSearchKeyDown}
            className={cn(
              "pl-10 transition-all duration-200",
              searchFocused && "ring-2 ring-primary/20"
            )}
          />
        </div>
        
        <Button 
          onClick={handleNewDocument}
          disabled={isCreating}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? 'Creating...' : 'New Document'}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="space-y-1">
            <button
              onClick={() => onFolderSelect(null)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted/50 transition-colors",
                selectedFolderId === null && "bg-muted text-primary font-medium"
              )}
            >
              <FileText className="h-4 w-4" />
              All Documents
            </button>
            
            {folders.length > 0 && (
              <FolderTree
                folders={folders}
                selectedFolderId={selectedFolderId}
                onFolderSelect={onFolderSelect}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}