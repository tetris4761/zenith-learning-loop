import React, { useState } from 'react';
import { Folder, FolderOpen, Plus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFolders } from '@/hooks/useFolders';
import { cn } from '@/lib/utils';

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface FolderTreeProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  isLoading: boolean;
  level?: number;
  parentId?: string;
}

export function FolderTree({
  folders,
  selectedFolderId,
  onFolderSelect,
  isLoading,
  level = 0,
  parentId,
}: FolderTreeProps) {
  const { createFolder, updateFolder, deleteFolder } = useFolders();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  const currentLevelFolders = folders.filter(folder => 
    (parentId === undefined && !folder.parentId) || folder.parentId === parentId
  );

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleStartEdit = (folder: Folder) => {
    setEditingFolder(folder.id);
    setEditName(folder.name);
  };

  const handleSaveEdit = async () => {
    if (editingFolder && editName.trim()) {
      await updateFolder({ id: editingFolder, name: editName.trim() });
      setEditingFolder(null);
      setEditName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingFolder(null);
    setEditName('');
  };

  const handleStartCreate = (parentId?: string) => {
    setCreatingFolder(parentId || 'root');
    setNewFolderName('New Folder');
  };

  const handleSaveCreate = async () => {
    if (newFolderName.trim()) {
      const parentFolderId = creatingFolder === 'root' ? undefined : creatingFolder;
      await createFolder({ name: newFolderName.trim(), parentId: parentFolderId });
      setCreatingFolder(null);
      setNewFolderName('');
    }
  };

  const handleCancelCreate = () => {
    setCreatingFolder(null);
    setNewFolderName('');
  };

  const handleDelete = async (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this folder? This will also delete all documents inside it.')) {
      await deleteFolder(folderId);
    }
  };

  const hasChildren = (folderId: string) => 
    folders.some(folder => folder.parentId === folderId);

  return (
    <div className="space-y-1">
      {currentLevelFolders.map(folder => {
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;
        const isEditing = editingFolder === folder.id;
        const children = hasChildren(folder.id);

        return (
          <div key={folder.id}>
            <div
              className={cn(
                "group flex items-center gap-1 px-2 py-1 text-sm rounded-md hover:bg-muted/50 transition-colors",
                isSelected && "bg-muted text-primary font-medium",
                level > 0 && "ml-4"
              )}
            >
              {children ? (
                <button
                  onClick={() => toggleExpanded(folder.id)}
                  className="p-0.5 hover:bg-muted-foreground/10 rounded-sm"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              ) : (
                <div className="w-4" />
              )}

              <button
                onClick={() => onFolderSelect(folder.id)}
                className="flex items-center gap-2 flex-1 min-w-0"
              >
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Folder className="h-4 w-4 flex-shrink-0" />
                )}
                
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="h-6 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{folder.name}</span>
                )}
              </button>

              <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStartCreate(folder.id)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStartEdit(folder)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(folder.id)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {creatingFolder === folder.id && (
              <div className={cn("flex items-center gap-2 px-2 py-1", level > 0 && "ml-4")}>
                <div className="w-4" />
                <Folder className="h-4 w-4" />
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={handleSaveCreate}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveCreate();
                    if (e.key === 'Escape') handleCancelCreate();
                  }}
                  className="h-6 text-sm flex-1"
                  autoFocus
                />
              </div>
            )}

            {isExpanded && (
              <FolderTree
                folders={folders}
                selectedFolderId={selectedFolderId}
                onFolderSelect={onFolderSelect}
                isLoading={isLoading}
                level={level + 1}
                parentId={folder.id}
              />
            )}
          </div>
        );
      })}

      {level === 0 && creatingFolder === 'root' && (
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-4" />
          <Folder className="h-4 w-4" />
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onBlur={handleSaveCreate}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveCreate();
              if (e.key === 'Escape') handleCancelCreate();
            }}
            className="h-6 text-sm flex-1"
            autoFocus
          />
        </div>
      )}

      {level === 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleStartCreate()}
          className="w-full justify-start gap-2 h-8 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          New Folder
        </Button>
      )}
    </div>
  );
}