export interface DiffMetadata {
  filePath: string;
  segments: DiffSegment[];
  lastUpdated: string;
  commitHash: string;
  previousCommitHash?: string;
  author?: string;
  message?: string;
}

export interface DiffSegment {
  id: string;
  startLine: number;
  endLine: number;
  type: 'added' | 'removed' | 'modified';
  content: string;
  originalContent?: string;
  timestamp?: string;
}

export interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  total: number;
}

export interface FileChange {
  filePath: string;
  status: 'added' | 'removed' | 'modified' | 'renamed';
  diffStats: DiffStats;
  lastModified: string;
}

export interface CommitInfo {
  hash: string;
  shortHash: string;
  author: string;
  message: string;
  timestamp: string;
  filesChanged: number;
}

export interface DiffViewMode {
  type: 'unified' | 'split';
  showLineNumbers: boolean;
  showWhitespace: boolean;
}

export interface DiffHighlightData {
  [filePath: string]: DiffMetadata;
}