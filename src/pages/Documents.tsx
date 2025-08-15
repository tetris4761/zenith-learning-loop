import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentsSidebar } from '@/components/documents/DocumentsSidebar';
import { DocumentList } from '@/components/documents/DocumentList';
import { EditorView } from '@/components/documents/EditorView';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useDocuments } from '@/hooks/useDocuments';
import { useFolders } from '@/hooks/useFolders';

interface Document {
  id: string;
  title: string;
  content: any;
  folderId?: string;
  wordCount: number;
  updatedAt: string;
  createdAt: string;
}

export default function Documents() {
  const { user } = useAuth();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { documents, isLoading: documentsLoading } = useDocuments({
    folderId: selectedFolderId,
    searchQuery
  });
  
  const { folders, isLoading: foldersLoading } = useFolders();

  const selectedDocument = selectedDocumentId 
    ? documents?.find(doc => doc.id === selectedDocumentId)
    : null;

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Please sign in to access documents.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border px-6 py-3 bg-card">
        <h1 className="text-xl font-semibold text-foreground">Documents</h1>
      </header>
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <DocumentsSidebar
            folders={folders || []}
            selectedFolderId={selectedFolderId}
            onFolderSelect={setSelectedFolderId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onDocumentSelect={setSelectedDocumentId}
            isLoading={foldersLoading}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={75}>
          {selectedDocument ? (
            <EditorView
              document={selectedDocument}
              onClose={() => setSelectedDocumentId(null)}
            />
          ) : (
            <DocumentList
              documents={documents || []}
              onDocumentSelect={setSelectedDocumentId}
              selectedFolderId={selectedFolderId}
              searchQuery={searchQuery}
              isLoading={documentsLoading}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}