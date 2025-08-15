import React from 'react';
import { FileText, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDocuments } from '@/hooks/useDocuments';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  content: any;
  folderId?: string;
  wordCount: number;
  updatedAt: string;
  createdAt: string;
}

interface DocumentListProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
  selectedFolderId: string | null;
  searchQuery: string;
  isLoading: boolean;
}

export function DocumentList({
  documents,
  onDocumentSelect,
  selectedFolderId,
  searchQuery,
  isLoading,
}: DocumentListProps) {
  const { createDocument, isCreating } = useDocuments();

  const handleCreateDocument = () => {
    createDocument({ 
      title: 'Untitled Document',
      folderId: selectedFolderId || undefined 
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          {searchQuery ? (
            <>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                No documents match your search for "{searchQuery}". Try adjusting your search terms.
              </p>
              <Button onClick={() => window.location.reload()}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Start with a note</h3>
              <p className="text-muted-foreground mb-4">
                Create your first document to begin writing and organizing your thoughts.
              </p>
              <Button 
                onClick={handleCreateDocument}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Document'}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-foreground mb-2">
            {searchQuery 
              ? `Search results for "${searchQuery}"` 
              : selectedFolderId 
                ? 'Documents in folder' 
                : 'All Documents'
            }
          </h2>
          <p className="text-sm text-muted-foreground">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid gap-3">
          {documents.map((document) => (
            <Card
              key={document.id}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200",
                "hover:bg-muted/50 hover:shadow-sm hover:border-primary/20",
                "focus-within:ring-2 focus-within:ring-primary/20"
              )}
              onClick={() => onDocumentSelect(document.id)}
            >
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate mb-1">
                    {document.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    {document.wordCount > 0 && (
                      <span>{document.wordCount} words</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}