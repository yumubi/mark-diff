import React from 'react';
import { useDiffStore } from '../stores/diffStore';
import Icon from '../components/common/Icon';
import ThemeToggle from '../components/common/ThemeToggle';

const Settings: React.FC = () => {
  const { viewMode, setViewMode, visibleTypes, setAllDiffTypes } = useDiffStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          设置
        </h1>
        <p className="text-muted-foreground">
          自定义差异高亮的显示方式和交互行为
        </p>
      </div>

      {/* Theme Settings */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="moon" size={20} />
          主题设置
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">外观主题</h3>
            <p className="text-sm text-muted-foreground">切换浅色或深色模式</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* View Settings */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="eye" size={20} />
          视图设置
        </h2>
        
        <div className="space-y-6">
          {/* View Mode */}
          <div>
            <h3 className="font-medium text-foreground mb-3">默认视图模式</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setViewMode({ type: 'unified' })}
                className={`p-4 rounded-lg border transition-all ${
                  viewMode.type === 'unified'
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border hover:border-border-secondary'
                }`}
              >
                <Icon name="file-diff" size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">统一视图</div>
                <div className="text-xs text-muted-foreground">在单个视图中显示所有变更</div>
              </button>
              
              <button
                onClick={() => setViewMode({ type: 'split' })}
                className={`p-4 rounded-lg border transition-all ${
                  viewMode.type === 'split'
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border hover:border-border-secondary'
                }`}
              >
                <Icon name="columns" size={24} className="mx-auto mb-2" />
                <div className="text-sm font-medium">分屏对比</div>
                <div className="text-xs text-muted-foreground">并排显示原始和当前版本</div>
              </button>
            </div>
          </div>

          {/* Line Numbers */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">显示行号</h3>
              <p className="text-sm text-muted-foreground">在代码视图中显示行号</p>
            </div>
            <button
              onClick={() => setViewMode({ showLineNumbers: !viewMode.showLineNumbers })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                viewMode.showLineNumbers ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  viewMode.showLineNumbers ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Whitespace */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">显示空白字符</h3>
              <p className="text-sm text-muted-foreground">显示空格、制表符等空白字符</p>
            </div>
            <button
              onClick={() => setViewMode({ showWhitespace: !viewMode.showWhitespace })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                viewMode.showWhitespace ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  viewMode.showWhitespace ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Highlight Settings */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="edit" size={20} />
          高亮设置
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground mb-3">默认显示的变更类型</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="diff-indicator diff-added-indicator"></div>
                  <span className="text-sm">新增内容</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {visibleTypes.has('added') ? '显示' : '隐藏'}
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="diff-indicator diff-removed-indicator"></div>
                  <span className="text-sm">删除内容</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {visibleTypes.has('removed') ? '显示' : '隐藏'}
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="diff-indicator diff-modified-indicator"></div>
                  <span className="text-sm">修改内容</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {visibleTypes.has('modified') ? '显示' : '隐藏'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={() => setAllDiffTypes(true)}
              className="btn btn-secondary mr-3"
            >
              全部显示
            </button>
            <button
              onClick={() => setAllDiffTypes(false)}
              className="btn btn-ghost"
            >
              全部隐藏
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="info" size={20} />
          关于
        </h2>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">版本</span>
            <span className="text-foreground font-mono">v1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">构建时间</span>
            <span className="text-foreground">{new Date().toLocaleDateString('zh-CN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">技术栈</span>
            <span className="text-foreground">React + TypeScript + Tailwind</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;