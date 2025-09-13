import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { diffApi } from '../services/diffApi';
import DiffViewer from '../components/diff/DiffViewer';
import Icon from '../components/common/Icon';

const FileView: React.FC = () => {
  const { filePath } = useParams<{ filePath: string }>();
  const navigate = useNavigate();

  const decodedFilePath = filePath ? decodeURIComponent(filePath) : '';

  const { data: diffMetadata, isLoading: diffLoading, error: diffError } = useQuery({
    queryKey: ['fileDiff', decodedFilePath],
    queryFn: () => diffApi.getFileDiff(decodedFilePath),
    enabled: !!decodedFilePath,
    staleTime: 5 * 60 * 1000,
  });

  const { data: currentContent, isLoading: contentLoading } = useQuery({
    queryKey: ['fileContent', decodedFilePath],
    queryFn: () => diffApi.getFileContent(decodedFilePath),
    enabled: !!decodedFilePath,
    staleTime: 5 * 60 * 1000,
  });

  const { data: originalContent } = useQuery({
    queryKey: ['fileContent', decodedFilePath, 'original'],
    queryFn: () => diffApi.getFileContent(decodedFilePath, diffMetadata?.previousCommitHash),
    enabled: !!decodedFilePath && !!diffMetadata?.previousCommitHash,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = diffLoading || contentLoading;

  if (!decodedFilePath) {
    return (
      <div className="text-center py-12">
        <Icon name="x" size={48} className="text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">文件路径无效</h2>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          返回首页
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-ghost"
          >
            <Icon name="chevron-left" size={16} />
            返回
          </button>
          <div className="h-6 bg-muted rounded w-96"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-64"></div>
          <div className="card p-6">
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (diffError || !diffMetadata || !currentContent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-ghost"
          >
            <Icon name="chevron-left" size={16} />
            返回
          </button>
          <h1 className="font-display text-xl font-semibold text-foreground">
            {decodedFilePath}
          </h1>
        </div>

        <div className="text-center py-12 card">
          <Icon name="file-diff" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {diffError ? '加载失败' : '无变更记录'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {diffError instanceof Error 
              ? diffError.message 
              : '此文件没有检测到变更记录'
            }
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            返回文档列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="btn btn-ghost"
        >
          <Icon name="chevron-left" size={16} />
          返回
        </button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-semibold text-foreground mb-1">
            文档差异查看器
          </h1>
          <p className="text-sm text-muted-foreground">
            查看 <span className="font-mono bg-muted px-1 rounded">{decodedFilePath}</span> 的变更详情
          </p>
        </div>
      </div>

      {/* Diff Viewer */}
      <DiffViewer
        filePath={decodedFilePath}
        currentContent={currentContent}
        originalContent={originalContent}
        diffMetadata={diffMetadata}
      />
    </div>
  );
};

export default FileView;