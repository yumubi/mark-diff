import React from 'react';
import type { DiffMetadata } from '../../types/diff';
import Icon from '../common/Icon';

interface DiffSummaryProps {
  diffMetadata: DiffMetadata;
  className?: string;
}

const DiffSummary: React.FC<DiffSummaryProps> = ({ diffMetadata, className = '' }) => {
  const stats = diffMetadata.segments.reduce(
    (acc, segment) => {
      acc[segment.type] = (acc[segment.type] || 0) + 1;
      acc.total++;
      return acc;
    },
    { added: 0, removed: 0, modified: 0, total: 0 } as Record<string, number>
  );

  return (
    <div className={`card card-hover p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon name="info" size={18} className="text-muted-foreground" />
        <h3 className="font-display text-base font-semibold text-foreground">
          变更摘要
        </h3>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-[hsl(var(--diff-added-bg))] rounded-lg border-l-2 border-[hsl(var(--diff-added))]">
          <div className="text-lg font-bold text-[hsl(var(--diff-added))]">
            +{stats.added}
          </div>
          <div className="text-xs text-muted-foreground">新增</div>
        </div>
        
        <div className="text-center p-3 bg-[hsl(var(--diff-removed-bg))] rounded-lg border-l-2 border-[hsl(var(--diff-removed))]">
          <div className="text-lg font-bold text-[hsl(var(--diff-removed))]">
            -{stats.removed}
          </div>
          <div className="text-xs text-muted-foreground">删除</div>
        </div>
        
        <div className="text-center p-3 bg-[hsl(var(--diff-modified-bg))] rounded-lg border-l-2 border-[hsl(var(--diff-modified))]">
          <div className="text-lg font-bold text-[hsl(var(--diff-modified))]">
            ~{stats.modified}
          </div>
          <div className="text-xs text-muted-foreground">修改</div>
        </div>

        <div className="text-center p-3 bg-accent rounded-lg border">
          <div className="text-lg font-bold text-accent-foreground">
            {stats.total}
          </div>
          <div className="text-xs text-muted-foreground">总计</div>
        </div>
      </div>

      {/* Commit Information */}
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Icon name="git-commit" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">提交:</span>
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
              {diffMetadata.commitHash.substring(0, 8)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Icon name="git-branch" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">时间:</span>
            <span className="text-foreground">
              {new Date(diffMetadata.lastUpdated).toLocaleString('zh-CN')}
            </span>
          </div>
        </div>

        {diffMetadata.author && (
          <div className="flex items-center gap-2">
            <Icon name="user" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">作者:</span>
            <span className="text-foreground">{diffMetadata.author}</span>
          </div>
        )}

        {diffMetadata.message && (
          <div className="flex items-start gap-2">
            <Icon name="edit" size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <span className="text-muted-foreground">提交信息:</span>
              <div className="text-foreground mt-1 bg-muted p-2 rounded text-xs font-mono break-words">
                {diffMetadata.message}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiffSummary;