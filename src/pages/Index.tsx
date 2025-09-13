import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/common/Icon';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--diff-added))] to-[hsl(var(--diff-modified))] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon name="git-branch" size={32} className="text-white" />
        </div>
        
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">
          Markdown Diff 高亮器
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          无侵入式的文档变更可视化工具。基于Git提交自动检测和高亮Markdown文档差异，
          让您直观地查看文档的变更历史和内容对比。
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn btn-primary">
            <Icon name="git-branch" size={16} />
            开始使用
          </Link>
          <Link to="/settings" className="btn btn-secondary">
            <Icon name="settings" size={16} />
            设置
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <Icon name="git-commit" size={24} className="text-[hsl(var(--diff-added))] mx-auto mb-3" />
            <h3 className="font-display font-semibold text-foreground mb-2">自动检测</h3>
            <p className="text-sm text-muted-foreground">
              基于Git提交自动分析文档变更
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <Icon name="eye" size={24} className="text-[hsl(var(--diff-modified))] mx-auto mb-3" />
            <h3 className="font-display font-semibold text-foreground mb-2">可视化</h3>
            <p className="text-sm text-muted-foreground">
              直观展示新增、删除、修改内容
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <Icon name="file-diff" size={24} className="text-[hsl(var(--diff-removed))] mx-auto mb-3" />
            <h3 className="font-display font-semibold text-foreground mb-2">无侵入</h3>
            <p className="text-sm text-muted-foreground">
              不修改源文档，保持文档纯净性
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
