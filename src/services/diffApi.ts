import type { DiffHighlightData, DiffMetadata, CommitInfo, FileChange } from '../types/diff';

const API_BASE = '/api';

export const diffApi = {
  // Get diff metadata for all files
  async getDiffData(): Promise<DiffHighlightData> {
    const response = await fetch(`${API_BASE}/diff/metadata`);
    if (!response.ok) {
      throw new Error('Failed to fetch diff data');
    }
    return response.json();
  },

  // Get diff metadata for a specific file
  async getFileDiff(filePath: string): Promise<DiffMetadata | null> {
    const response = await fetch(`${API_BASE}/diff/file?path=${encodeURIComponent(filePath)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch file diff');
    }
    return response.json();
  },

  // Get list of changed files
  async getChangedFiles(): Promise<FileChange[]> {
    const response = await fetch(`${API_BASE}/diff/files`);
    if (!response.ok) {
      throw new Error('Failed to fetch changed files');
    }
    return response.json();
  },

  // Get commit information
  async getCommitInfo(commitHash?: string): Promise<CommitInfo> {
    const url = commitHash 
      ? `${API_BASE}/diff/commit/${commitHash}`
      : `${API_BASE}/diff/commit/latest`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch commit info');
    }
    return response.json();
  },

  // Get file content at specific commit
  async getFileContent(filePath: string, commitHash?: string): Promise<string> {
    const url = commitHash
      ? `${API_BASE}/files/content?path=${encodeURIComponent(filePath)}&commit=${commitHash}`
      : `${API_BASE}/files/content?path=${encodeURIComponent(filePath)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch file content');
    }
    return response.text();
  },

  // Generate diff metadata for specific commits
  async generateDiff(fromCommit: string, toCommit?: string): Promise<DiffHighlightData> {
    const response = await fetch(`${API_BASE}/diff/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fromCommit, toCommit }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate diff');
    }
    return response.json();
  },
};