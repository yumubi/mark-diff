import React, { useState } from 'react';
import type { DiffMetadata, DiffSegment } from '../../types/diff';
import DiffHighlighter from './DiffHighlighter';
import DiffControls from './DiffControls';
import DiffSummary from './DiffSummary';
import DiffSegmentPopup from './DiffSegmentPopup';
import { useDiffStore } from '../../stores/diffStore';
import Icon from '../common/Icon';

export interface DiffViewerProps {
  filePath: string;
  currentContent: string;
  originalContent?: string;
  diffMetadata: DiffMetadata;
  className?: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  filePath,
  currentContent,
  originalContent,
  diffMetadata,
  className = '',
}) => {
  const { viewMode, setViewMode } = useDiffStore();
  const [selectedSegment, setSelectedSegment] = useState<DiffSegment | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const handleHighlightClick = (segment: DiffSegment, event: React.MouseEvent) => {
    setSelectedSegment(segment);
    setPopupPosition({ x: event.clientX, y: event.clientY });
  };

  const closePopup = () => {
    setSelectedSegment(null);
    setPopupPosition(null);
  };

  const toggleViewMode = () => {
    setViewMode({ 
      type: viewMode.type === 'unified' ? 'split' : 'unified' 
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* View Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {filePath}
          </h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {diffMetadata.segments.length} 处变更
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="btn btn-secondary"
            onClick={toggleViewMode}
            title={viewMode.type === 'unified' ? '切换到分屏对比' : '切换到统一视图'}
          >
            <Icon 
              name={viewMode.type === 'unified' ? 'file-diff' : 'eye'} 
              size={16} 
            />
            {viewMode.type === 'unified' ? '分屏对比' : '统一视图'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {viewMode.type === 'split' && originalContent ? (
          <div className="diff-grid">
            {/* Original Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-border pb-2">
                <Icon name="git-commit" size={16} />
                <span>原始版本</span>
                {diffMetadata.previousCommitHash && (
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {diffMetadata.previousCommitHash.substring(0, 8)}
                  </span>
                )}
              </div>
              <DiffHighlighter 
                content={originalContent} 
                interactive={false}
                className="diff-original"
              />
            </div>

            {/* Current Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground border-b border-border pb-2">
                <Icon name="git-branch" size={16} />
                <span>当前版本</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {diffMetadata.commitHash.substring(0, 8)}
                </span>
              </div>
              <DiffHighlighter
                content={currentContent}
                diffMetadata={diffMetadata}
                interactive={true}
                onHighlightClick={handleHighlightClick}
                className="diff-current"
              />
            </div>
          </div>
        ) : (
          <DiffHighlighter
            content={currentContent}
            diffMetadata={diffMetadata}
            interactive={true}
            onHighlightClick={handleHighlightClick}
          />
        )}

        {/* Diff Controls */}
        <DiffControls diffMetadata={diffMetadata} />
        
        {/* Summary */}
        <div className="mt-8">
          <DiffSummary diffMetadata={diffMetadata} />
        </div>
      </div>

      {/* Popup */}
      {selectedSegment && popupPosition && (
        <DiffSegmentPopup
          segment={selectedSegment}
          position={popupPosition}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default DiffViewer;