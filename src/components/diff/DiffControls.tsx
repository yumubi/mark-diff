import React from 'react';
import type { DiffMetadata } from '../../types/diff';
import { useDiffStore } from '../../stores/diffStore';
import Icon from '../common/Icon';

interface DiffControlsProps {
  diffMetadata: DiffMetadata;
  className?: string;
}

const DiffControls: React.FC<DiffControlsProps> = ({ diffMetadata, className = '' }) => {
  const { visibleTypes, toggleDiffType, setAllDiffTypes } = useDiffStore();

  const getSegmentCount = (type: string) => {
    return diffMetadata.segments.filter((s) => s.type === type).length;
  };

  const allTypesVisible = ['added', 'removed', 'modified'].every(type => visibleTypes.has(type));
  const noTypesVisible = visibleTypes.size === 0;

  const handleToggleAll = () => {
    setAllDiffTypes(!allTypesVisible);
  };

  return (
    <div className={`diff-controls ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <h3 className="font-display text-sm font-semibold text-foreground">
          文档变更高亮
        </h3>
        <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {diffMetadata.commitHash.substring(0, 8)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <button
          className={`diff-toggle ${visibleTypes.has('added') ? 'active' : ''}`}
          onClick={() => toggleDiffType('added')}
          title="切换新增内容显示"
        >
          <span className="diff-indicator diff-added-indicator"></span>
          <span className="flex-1 text-left">新增</span>
          <span className="text-xs text-muted-foreground">({getSegmentCount('added')})</span>
        </button>

        <button
          className={`diff-toggle ${visibleTypes.has('removed') ? 'active' : ''}`}
          onClick={() => toggleDiffType('removed')}
          title="切换删除内容显示"
        >
          <span className="diff-indicator diff-removed-indicator"></span>
          <span className="flex-1 text-left">删除</span>
          <span className="text-xs text-muted-foreground">({getSegmentCount('removed')})</span>
        </button>

        <button
          className={`diff-toggle ${visibleTypes.has('modified') ? 'active' : ''}`}
          onClick={() => toggleDiffType('modified')}
          title="切换修改内容显示"
        >
          <span className="diff-indicator diff-modified-indicator"></span>
          <span className="flex-1 text-left">修改</span>
          <span className="text-xs text-muted-foreground">({getSegmentCount('modified')})</span>
        </button>

        <button 
          className="btn btn-primary w-full mt-3" 
          onClick={handleToggleAll}
          title={allTypesVisible ? "隐藏全部" : "显示全部"}
        >
          <Icon name={allTypesVisible ? 'eye-off' : 'eye'} size={16} />
          {allTypesVisible ? '隐藏全部' : '显示全部'}
        </button>
      </div>

      <div className="pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            <span className="font-medium">更新时间:</span>
            <br />
            {new Date(diffMetadata.lastUpdated).toLocaleString('zh-CN')}
          </div>
          {diffMetadata.author && (
            <div>
              <span className="font-medium">作者:</span> {diffMetadata.author}
            </div>
          )}
          {diffMetadata.message && (
            <div>
              <span className="font-medium">提交信息:</span>
              <br />
              <span className="text-xs break-words">{diffMetadata.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiffControls;