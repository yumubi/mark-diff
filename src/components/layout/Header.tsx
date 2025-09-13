import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../common/Icon';
import ThemeToggle from '../common/ThemeToggle';

const Header: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: '文档列表', path: '/', icon: 'file-diff' },
    { name: '提交历史', path: '/commits', icon: 'git-commit' },
    { name: '设置', path: '/settings', icon: 'settings' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold text-foreground">
            <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--diff-added))] to-[hsl(var(--diff-modified))] rounded-lg flex items-center justify-center">
              <Icon name="git-branch" size={18} className="text-white" />
            </div>
            Markdown Diff
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <button 
              className="btn btn-primary"
              onClick={() => window.open('https://github.com/your-repo/markdown-diff', '_blank')}
            >
              <Icon name="git-branch" size={16} />
              GitHub
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;