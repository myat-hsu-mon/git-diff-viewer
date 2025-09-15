import { useDiffViewerContext } from '@/features/main-diff-viewer/contexts/DiffViewerContext';
import { AlertCircle, FileText, Loader2, Upload } from 'lucide-react';
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export default function FileUpload() {
  const { loadDiffs, loading, error } = useDiffViewerContext();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file && file.type === 'application/json') {
      await loadDiffs(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.type === 'application/json');

    if (jsonFile) {
      handleFileSelect(jsonFile);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
        dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        loading && 'pointer-events-none opacity-50'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type='file'
        accept='.json'
        onChange={handleFileInputChange}
        className='hidden'
      />

      {loading ? (
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-12 w-12 animate-spin text-primary' />
          <div>
            <h3 className='text-lg font-semibold'>Loading diff data...</h3>
            <p className='text-sm text-muted-foreground'>Please wait while we process your file</p>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <div className='rounded-full bg-primary/10 p-4'>
            <Upload className='h-8 w-8 text-primary' />
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-2'>
              Drop your diff file here, or click to browse
            </h3>
            <p className='text-sm text-muted-foreground mb-4'>Supports JSON format diff files</p>

            <Button onClick={() => fileInputRef.current?.click()}>
              <FileText className='h-4 w-4 mr-2' />
              Choose File
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className='mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md'>
          <div className='flex items-center justify-center gap-2 text-destructive'>
            <AlertCircle className='h-4 w-4 text-red-500' />
            <p className='text-sm font-medium text-center text-red-500'>Error loading file</p>
          </div>
          <p className='text-sm text-destructive/80 mt-1'>{error}</p>
        </div>
      )}
    </div>
  );
}
