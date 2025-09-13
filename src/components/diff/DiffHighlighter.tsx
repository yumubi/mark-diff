import React, { useEffect, useRef, useCallback } from 'react';
import type { DiffMetadata, DiffSegment } from '../../types/diff';
import { useDiffStore } from '../../stores/diffStore';

// 辅助函数：转义HTML以防止XSS
const escapeHtml = (unsafe: string) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 词语差异对比函数 (保持不变)
function diffWords(oldText: string, newText: string): string {
    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);

    const dp = Array(newWords.length + 1).fill(null).map(() => Array(oldWords.length + 1).fill(0));

    for (let i = 1; i <= newWords.length; i++) {
        for (let j = 1; j <= oldWords.length; j++) {
            if (newWords[i - 1] === oldWords[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    let i = newWords.length;
    let j = oldWords.length;
    const result: string[] = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && newWords[i - 1] === oldWords[j - 1]) {
            result.unshift(escapeHtml(newWords[i - 1]));
            i--;
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] <= dp[i - 1][j])) {
            result.unshift(`<ins>${escapeHtml(newWords[i - 1])}</ins>`);
            i--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] > dp[i - 1][j])) {
            result.unshift(`<del>${escapeHtml(oldWords[j - 1])}</del>`);
            j--;
        } else {
            break;
        }
    }
    return result.join('');
}


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
        //
        // 关键修复点 1：处理左侧面板（无 diff 元数据）的情况
        //
        if (!diffMetadata || !diffMetadata.segments.length) {
            // 直接用 <pre> 标签包裹转义后的原始内容，完美保留格式
            return `<pre>${escapeHtml(content)}</pre>`;
        }

        let processedContent = content;
        const sortedSegments = [...diffMetadata.segments].sort((a, b) => b.startLine - a.startLine);

        for (const segment of sortedSegments) {
            if (!visibleTypes.has(segment.type)) continue;

            let replacementHtml = '';
            const originalSegmentContent = segment.content;

            switch(segment.type) {
                case 'added':
                    replacementHtml = `<ins data-diff-segment="${segment.id}">${escapeHtml(originalSegmentContent)}</ins>`;
                    break;
                case 'removed':
                    // 在分屏视图中，删除的内容应在左侧显示，右侧不显示。
                    // 在统一视图中，我们才需要显示它。
                    // 这里的替换逻辑对于分屏视图是不完美的，但我们首先要保证格式正确。
                    replacementHtml = `<del data-diff-segment="${segment.id}">${escapeHtml(originalSegmentContent)}</del>`;
                    break;
                case 'modified':
                    if (segment.originalContent) {
                        const diffHtml = diffWords(segment.originalContent, segment.content);
                        replacementHtml = `<span data-diff-segment="${segment.id}">${diffHtml}</span>`;
                    } else {
                        replacementHtml = `<ins data-diff-segment="${segment.id}">${escapeHtml(originalSegmentContent)}</ins>`;
                    }
                    break;
            }

            if (segment.type !== 'removed') {
                processedContent = processedContent.replace(originalSegmentContent, replacementHtml);
            } else {
                // 简化处理：在分屏视图下，我们不应在当前内容（右侧）中插入已删除的文本。
                // 这个逻辑需要根据视图模式（统一/分屏）来调整，但为了修复格式，我们暂时不做插入。
            }
        }

        //
        // 关键修复点 2：处理右侧面板，同样用 <pre> 包裹最终结果
        //
        return `<pre>${processedContent}</pre>`;

    }, [content, diffMetadata, visibleTypes]);

    // Click handler (保持不变)
    useEffect(() => {
        if (!interactive || !contentRef.current) return;
        const element = contentRef.current;

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

        element.addEventListener('click', handleClick);
        return () => {
            element.removeEventListener('click', handleClick);
        };
    }, [interactive, onHighlightClick, diffMetadata]);

    // 移除了 prose 类，因为它可能添加不必要的样式
    return (
        <div
            ref={contentRef}
            className="font-mono text-sm leading-relaxed p-6 bg-card rounded-lg border max-w-none"
            dangerouslySetInnerHTML={{ __html: processContent() }}
        />
    );
};

export default DiffHighlighter;