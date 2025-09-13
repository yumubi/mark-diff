import type { DiffHighlightData, DiffMetadata, CommitInfo, FileChange } from '../types/diff';

export const mockCommitInfo: CommitInfo = {
  hash: 'a1b2c3d4e5f6789012345678901234567890abcd',
  shortHash: 'a1b2c3d',
  author: 'Zhang San',
  message: 'feat: 添加新的文档差异高亮功能\n\n- 实现无侵入式差异检测\n- 支持多种变更类型展示\n- 优化用户交互体验',
  timestamp: '2024-01-15T10:30:00.000Z',
  filesChanged: 3,
};

export const mockFileChanges: FileChange[] = [
  {
    filePath: 'docs/api/authentication.md',
    status: 'modified',
    diffStats: { added: 12, removed: 3, modified: 5, total: 20 },
    lastModified: '2024-01-15T10:30:00.000Z',
  },
  {
    filePath: 'docs/guide/getting-started.md',
    status: 'modified',
    diffStats: { added: 8, removed: 1, modified: 2, total: 11 },
    lastModified: '2024-01-15T10:25:00.000Z',
  },
  {
    filePath: 'docs/examples/diff-demo.md',
    status: 'added',
    diffStats: { added: 45, removed: 0, modified: 0, total: 45 },
    lastModified: '2024-01-15T10:20:00.000Z',
  },
];

export const mockDiffData: DiffHighlightData = {
  'docs/api/authentication.md': {
    filePath: 'docs/api/authentication.md',
    commitHash: 'a1b2c3d4e5f6789012345678901234567890abcd',
    previousCommitHash: 'f6e5d4c3b2a1987654321098765432109876543f',
    lastUpdated: '2024-01-15T10:30:00.000Z',
    author: 'Zhang San',
    message: 'feat: 添加新的身份认证文档',
    segments: [
      {
        id: 'seg-1',
        startLine: 5,
        endLine: 8,
        type: 'added',
        content: '## JWT Token 认证\n\n我们的API使用JWT (JSON Web Token) 进行身份认证。每个请求都需要在header中包含有效的token。\n\n### 获取Token',
        timestamp: '2024-01-15T10:30:00.000Z',
      },
      {
        id: 'seg-2',
        startLine: 15,
        endLine: 17,
        type: 'modified',
        content: '请求示例：\n```bash\ncurl -H "Authorization: Bearer YOUR_JWT_TOKEN" https://api.example.com/data\n```',
        originalContent: '请求示例：\n```bash\ncurl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/data\n```',
        timestamp: '2024-01-15T10:30:00.000Z',
      },
      {
        id: 'seg-3',
        startLine: 25,
        endLine: 27,
        type: 'removed',
        content: '## 已废弃的API Key认证\n\n> ⚠️ 此认证方式已在v2.0中废弃，请使用JWT认证。',
        originalContent: '## API Key认证\n\n传统的API Key认证方式，在header中传入`X-API-Key`。',
        timestamp: '2024-01-15T10:30:00.000Z',
      },
    ],
  },
  'docs/guide/getting-started.md': {
    filePath: 'docs/guide/getting-started.md',
    commitHash: 'a1b2c3d4e5f6789012345678901234567890abcd',
    previousCommitHash: 'f6e5d4c3b2a1987654321098765432109876543f',
    lastUpdated: '2024-01-15T10:25:00.000Z',
    author: 'Zhang San',
    message: 'docs: 更新快速开始指南',
    segments: [
      {
        id: 'seg-4',
        startLine: 12,
        endLine: 15,
        type: 'added',
        content: '### 使用npm安装\n\n```bash\nnpm install @example/diff-highlighter\n```',
        timestamp: '2024-01-15T10:25:00.000Z',
      },
      {
        id: 'seg-5',
        startLine: 20,
        endLine: 22,
        type: 'modified',
        content: '### 基础用法\n\n```typescript\nimport { DiffHighlighter } from "@example/diff-highlighter";\n```',
        originalContent: '### 基础用法\n\n```javascript\nimport { DiffHighlighter } from "@example/diff-highlighter";\n```',
        timestamp: '2024-01-15T10:25:00.000Z',
      },
    ],
  },
  'docs/examples/diff-demo.md': {
    filePath: 'docs/examples/diff-demo.md',
    commitHash: 'a1b2c3d4e5f6789012345678901234567890abcd',
    lastUpdated: '2024-01-15T10:20:00.000Z',
    author: 'Zhang San',
    message: 'docs: 新增差异高亮演示文档',
    segments: [
      {
        id: 'seg-6',
        startLine: 1,
        endLine: 50,
        type: 'added',
        content: `# Diff 高亮演示

这个文档展示了如何使用差异高亮功能来可视化文档变更。

## 功能特性

- ✅ 无侵入式高亮
- ✅ 支持多种变更类型
- ✅ 交互式控制面板
- ✅ 响应式设计

## 变更类型

### 新增内容
使用绿色背景和左边框标识新增的内容。

### 删除内容  
使用红色背景和删除线标识被删除的内容。

### 修改内容
使用黄色背景标识被修改的内容。

## 交互功能

点击任何高亮区域可以查看详细的变更信息，包括：
- 变更类型
- 行号范围  
- 原始内容对比
- 时间戳信息

## 技术实现

本功能基于Git diff分析，自动检测文档变更并生成高亮元数据。`,
        timestamp: '2024-01-15T10:20:00.000Z',
      },
    ],
  },
};

export const mockFileContents = {
  'docs/api/authentication.md': `# API 认证文档

本文档介绍如何对API请求进行身份认证。

## JWT Token 认证

我们的API使用JWT (JSON Web Token) 进行身份认证。每个请求都需要在header中包含有效的token。

### 获取Token

访问 \`/auth/login\` 端点获取JWT token：

请求示例：
\`\`\`bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" https://api.example.com/data
\`\`\`

### Token 格式

Token应该在Authorization header中以"Bearer "为前缀。

## 已废弃的API Key认证

> ⚠️ 此认证方式已在v2.0中废弃，请使用JWT认证。

## 错误处理

当认证失败时，API会返回401状态码。`,

  'docs/guide/getting-started.md': `# 快速开始

欢迎使用我们的diff高亮工具！本指南将帮助您快速上手。

## 安装

### 使用npm安装

\`\`\`bash
npm install @example/diff-highlighter
\`\`\`

### 基础用法

\`\`\`typescript
import { DiffHighlighter } from "@example/diff-highlighter";
\`\`\`

## 配置

配置您的项目以使用diff高亮功能。`,

  'docs/examples/diff-demo.md': mockDiffData['docs/examples/diff-demo.md'].segments[0].content,
};