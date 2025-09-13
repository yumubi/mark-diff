import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { diffApi } from '../services/diffApi';
import Icon from '../components/common/Icon';

const Commits: React.FC = () => {
  const { data: commitInfo, isLoading } = useQuery({
    queryKey: ['commitInfo'],
    queryFn: () => diffApi.getCommitInfo(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="loading-spinner mx-auto" />
          <p className="text-muted-foreground">加载提交信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          提交历史
        </h1>
        <p className="text-muted-foreground">
          查看文档变更的提交历史和详细信息
        </p>
      </div>

      {commitInfo && (
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[hsl(var(--diff-added))] rounded-lg flex items-center justify-center">
              <Icon name="git-commit" size={20} className="text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-display font-semibold text-foreground">
                  {commitInfo.message.split('\n')[0]}
                </h3>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {commitInfo.shortHash}
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground mb-3">
                <span>{commitInfo.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(commitInfo.timestamp).toLocaleString('zh-CN')}</span>
              </div>

              {commitInfo.message.includes('\n') && (
                <div className="text-sm text-foreground bg-muted p-3 rounded font-mono whitespace-pre-wrap">
                  {commitInfo.message.split('\n').slice(1).join('\n').trim()}
                </div>
              )}

              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Icon name="file-diff" size={16} />
                  <span>{commitInfo.filesChanged} 个文件变更</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for more commits */}
      <div className="text-center py-12 card">
        <Icon name="git-branch" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">更多功能开发中</h3>
        <p className="text-muted-foreground">
          完整的提交历史浏览功能即将推出
        </p>
      </div>
    </div>
  );
};

export default Commits;