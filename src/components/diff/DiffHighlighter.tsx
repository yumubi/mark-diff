import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { DiffMetadata, DiffSegment } from '../../types/diff';
import { useDiffStore } from '../../stores/diffStore';

export interface DiffHighlighterProps {
  content: string;
  diffMetadata?: DiffMetadata;
  interactive?: boolean;
  className?: string;
  onHighlightClick?: (segment: DiffSegment, event: React.MouseEvent) => void;
}

const DiffHighlighter: React.FC<DiffHighlighterProps> = ({
  content,
  diffMetadata,
  interactive = true,
  className = '',
  onHighlightClick,
}) => {
  const { visibleTypes } = useDiffStore();
  const contentRef = useRef<HTMLDivElement>(null);

  const processContent = useCallback(() => {
    if (!diffMetadata || !diffMetadata.segments.length) {
      return content;
    }

    const lines = content.split('\n');
    const processedLines = [...lines];
    
    // Sort segments by line number to avoid overlaps
    const sortedSegments = [...diffMetadata.segments].sort((a, b) => a.startLine - b.startLine);
    
    for (const segment of sortedSegments) {
      if (!visibleTypes.has(segment.type)) continue;
      
      const startIdx = Math.max(0, segment.startLine - 1);
      const endIdx = Math.min(lines.length - 1, segment.endLine - 1);
      
      for (let i = startIdx; i <= endIdx; i++) {
        if (processedLines[i] && processedLines[i].trim()) {
          processedLines[i] = wrapLineWithHighlight(
            processedLines[i],
            segment,
            `diff-${segment.type}`,
          );
        }
      }
    }
    
    return processedLines.join('\n');
  }, [content, diffMetadata, visibleTypes]);

  const wrapLineWithHighlight = (line: string, segment: DiffSegment, styleClass: string): string => {
    // Avoid double wrapping
    if (line.includes('data-diff-segment')) {
      return line;
    }
    
    const tooltip = getTooltipText(segment.type, segment);
    const escapedTooltip = tooltip.replace(/"/g, '&quot;');
    const escapedLine = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return `<span class="diff-highlight ${styleClass}" 
                  data-diff-segment="${segment.id}"
                  data-diff-type="${segment.type}"
                  title="${escapedTooltip}">
              ${escapedLine}
              <span class="diff-tooltip">${tooltip}</span>
            </span>`;
  };

  const getTooltipText = (type: string, segment: DiffSegment): string => {
    const typeLabels = {
      added: '新增',
      removed: '删除',
      modified: '修改',
    };
    const label = typeLabels[type as keyof typeof typeLabels] || '变更';
    return `${label} (行 ${segment.startLine}-${segment.endLine})`;
  };

  // Handle click events
  useEffect(() => {
    if (!interactive || !contentRef.current) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const highlightElement = target.closest('[data-diff-segment]') as HTMLElement;
      
      if (highlightElement && onHighlightClick) {
        const segmentId = highlightElement.dataset.diffSegment;
        const segment = diffMetadata?.segments.find((s) => s.id === segmentId);
        
        if (segment) {
          onHighlightClick(segment, event as any);
        }
      }
    };

    contentRef.current.addEventListener('click', handleClick);
    return () => {
      contentRef.current?.removeEventListener('click', handleClick);
    };
  }, [interactive, onHighlightClick, diffMetadata]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={contentRef} 
        className="font-mono text-sm leading-relaxed whitespace-pre-wrap p-6 bg-card rounded-lg border" 
        dangerouslySetInnerHTML={{ __html: processContent() }} 
      />
    </div>
  );
};

export default DiffHighlighter;