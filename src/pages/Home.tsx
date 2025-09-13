import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { diffApi } from '../services/diffApi';
import { useDiffStore } from '../stores/diffStore';
import Icon from '../components/common/Icon';

const Home: React.FC = () => {
  const { setDiffData, setCurrentFile } = useDiffStore();

  const { data: changedFiles, isLoading, error } = useQuery({
    queryKey: ['changedFiles'],
    queryFn: diffApi.getChangedFiles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: commitInfo } = useQuery({
    queryKey: ['commitInfo'],
    queryFn: () => diffApi.getCommitInfo(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: diffData } = useQuery({
    queryKey: ['diffData'],
    queryFn: diffApi.getDiffData,
    staleTime: 5 * 60 * 1000,
  });

  // Update store when data changes
  React.useEffect(() => {
    if (diffData) {
      setDiffData(diffData);
    }
  }, [diffData, setDiffData]);

  const handleFileClick = (filePath: string) => {
    setCurrentFile(filePath);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'added': return 'plus';
      case 'removed': return 'minus';
      case 'modified': return 'edit';
      default: return 'file-diff';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'added': return 'text-[hsl(var(--diff-added))]';
      case 'removed': return 'text-[hsl(var(--diff-removed))]';
      case 'modified': return 'text-[hsl(var(--diff-modified))]';
      default: return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="loading-spinner mx-auto" />
          <p className="text-muted-foreground">加载文档变更数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Icon name="x" size={48} className="text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">加载失败</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : '未知错误'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 border-b border-border">
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">
          Markdown 差异高亮
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          无侵入式的文档变更可视化工具，基于Git提交自动检测和高亮文档差异，
          让您直观地查看文档的变更历史和内容对比。
        </p>
        
        {commitInfo && (
          <div className="inline-flex items-center gap-4 bg-card border border-border rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon name="git-commit" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">最新提交:</span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {commitInfo.shortHash}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="user" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{commitInfo.author}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="clock" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {new Date(commitInfo.timestamp).toLocaleString('zh-CN')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Changed Files */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            变更文档
          </h2>
          <span className="text-sm text-muted-foreground">
            共 {changedFiles?.length || 0} 个文件
          </span>
        </div>

        {!changedFiles || changedFiles.length === 0 ? (
          <div className="text-center py-12 card">
            <Icon name="file-diff" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">暂无变更</h3>
            <p className="text-muted-foreground">
              当前没有检测到文档变更
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {changedFiles.map((file) => (
              <Link
                key={file.filePath}
                to={`/file/${encodeURIComponent(file.filePath)}`}
                onClick={() => handleFileClick(file.filePath)}
                className="card card-hover p-6 transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-start gap-3">
                  <Icon 
                    name={getStatusIcon(file.status)} 
                    size={20} 
                    className={getStatusColor(file.status)}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-sm font-medium text-foreground mb-1 truncate">
                      {file.filePath}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 capitalize">
                      {file.status === 'added' && '新增文件'}
                      {file.status === 'removed' && '删除文件'}
                      {file.status === 'modified' && '修改文件'}
                      {file.status === 'renamed' && '重命名文件'}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs">
                      {file.diffStats.added > 0 && (
                        <span className="text-[hsl(var(--diff-added))]">
                          +{file.diffStats.added}
                        </span>
                      )}
                      {file.diffStats.removed > 0 && (
                        <span className="text-[hsl(var(--diff-removed))]">
                          -{file.diffStats.removed}
                        </span>
                      )}
                      {file.diffStats.modified > 0 && (
                        <span className="text-[hsl(var(--diff-modified))]">
                          ~{file.diffStats.modified}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="py-12 border-t border-border">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-8 text-center">
          功能特性
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="card p-6 text-center">
            <Icon name="git-branch" size={32} className="text-[hsl(var(--diff-added))] mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">无侵入式</h3>
            <p className="text-sm text-muted-foreground">
              不修改源文档，基于Git diff自动生成高亮信息
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <Icon name="eye" size={32} className="text-[hsl(var(--diff-modified))] mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">可视化对比</h3>
            <p className="text-sm text-muted-foreground">
              直观展示新增、删除、修改内容，支持交互式查看
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <Icon name="settings" size={32} className="text-[hsl(var(--diff-removed))] mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">灵活配置</h3>
            <p className="text-sm text-muted-foreground">
              支持多种视图模式，可自定义高亮样式和交互行为
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;