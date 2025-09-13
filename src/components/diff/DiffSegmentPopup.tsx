import React, { useEffect, useRef } from 'react';
import type { DiffSegment } from '../../types/diff';
import Icon from '../common/Icon';

interface DiffSegmentPopupProps {
  segment: DiffSegment;
  position: { x: number; y: number };
  onClose: () => void;
}

const DiffSegmentPopup: React.FC<DiffSegmentPopupProps> = ({
  segment,
  position,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const typeLabels = {
    added: '新增内容',
    removed: '删除内容',
    modified: '修改内容',
  };

  const typeIcons = {
    added: 'plus',
    removed: 'minus',
    modified: 'edit',
  };

  const typeColors = {
    added: 'text-[hsl(var(--diff-added))]',
    removed: 'text-[hsl(var(--diff-removed))]',
    modified: 'text-[hsl(var(--diff-modified))]',
  };

  // Calculate position to keep popup on screen
  const popupStyle: React.CSSProperties = {
    position: 'fixed',
    top: Math.min(position.y + 10, window.innerHeight - 300),
    left: Math.min(position.x + 10, window.innerWidth - 400),
    zIndex: 1000,
  };

  return (
    <div
      ref={popupRef}
      className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-96 min-w-80"
      style={popupStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon 
            name={typeIcons[segment.type]} 
            size={16} 
            className={typeColors[segment.type]}
          />
          <span className="font-display font-semibold text-sm text-foreground">
            {typeLabels[segment.type]}
          </span>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost p-1 text-muted-foreground hover:text-foreground"
          title="关闭"
        >
          <Icon name="x" size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon name="info" size={14} />
          <span>行号: {segment.startLine}-{segment.endLine}</span>
        </div>

        <div>
          <div className="text-muted-foreground mb-1">当前内容:</div>
          <pre className="bg-muted p-3 rounded text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto border">
            {segment.content}
          </pre>
        </div>

        {segment.originalContent && (
          <div>
            <div className="text-muted-foreground mb-1">原始内容:</div>
            <pre className="bg-[hsl(var(--diff-removed-bg))] border-l-2 border-[hsl(var(--diff-removed))] p-3 rounded text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
              {segment.originalContent}
            </pre>
          </div>
        )}

        {segment.timestamp && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
            <Icon name="clock" size={12} />
            <span>时间: {new Date(segment.timestamp).toLocaleString('zh-CN')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiffSegmentPopup;
