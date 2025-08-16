import React, { useState } from 'react'
import { DocumentsSidebar } from '@/components/documents/DocumentsSidebar'
import { DocumentList } from '@/components/documents/DocumentList'
import { EditorView } from '@/components/documents/EditorView'
import { TaskSidebar } from '@/components/tasks/TaskSidebar'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { useDocuments } from '@/hooks/useDocuments'
import { useFolders } from '@/hooks/useFolders'

export function DocumentsModule() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showTaskSidebar, setShowTaskSidebar] = useState(true)
  const [aiSheetOpen, setAiSheetOpen] = useState(false)
  const [taskSheetOpen, setTaskSheetOpen] = useState(false)
  
  const { documents, isLoading: documentsLoading } = useDocuments({
    folderId: selectedFolderId,
    searchQuery
  })
  
  const { folders, isLoading: foldersLoading } = useFolders()

  const selectedDocument = selectedDocumentId 
    ? documents?.find(doc => doc.id === selectedDocumentId)
    : null

  return (
    <div className="h-full flex">
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
        
        <ResizablePanel defaultSize={showTaskSidebar && !aiSheetOpen && !taskSheetOpen ? 60 : 75}>
          {selectedDocument ? (
            <EditorView
              document={selectedDocument}
              onClose={() => setSelectedDocumentId(null)}
              onAISheetOpen={setAiSheetOpen}
              onTaskSheetOpen={setTaskSheetOpen}
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

        {showTaskSidebar && !aiSheetOpen && !taskSheetOpen && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <TaskSidebar />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}