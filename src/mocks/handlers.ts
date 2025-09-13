import { http, HttpResponse } from 'msw';
import { mockDiffData, mockCommitInfo, mockFileChanges, mockFileContents } from './diffData';

const API_BASE = '/api';

export const handlers = [
  // Get all diff metadata
  http.get(`${API_BASE}/diff/metadata`, () => {
    console.log('🔶 MSW: Handling /api/diff/metadata');
    return HttpResponse.json(mockDiffData);
  }),

  // Get diff for specific file
  http.get(`${API_BASE}/diff/file`, ({ request }) => {
    const url = new URL(request.url);
    const filePath = url.searchParams.get('path');
    
    console.log('🔶 MSW: Handling /api/diff/file for path:', filePath);
    
    if (!filePath || !mockDiffData[filePath]) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(mockDiffData[filePath]);
  }),

  // Get changed files list
  http.get(`${API_BASE}/diff/files`, () => {
    console.log('🔶 MSW: Handling /api/diff/files');
    return HttpResponse.json(mockFileChanges);
  }),

  // Get commit info
  http.get(`${API_BASE}/diff/commit/:hash`, ({ params }) => {
    console.log('🔶 MSW: Handling /api/diff/commit/:hash for hash:', params.hash);
    return HttpResponse.json(mockCommitInfo);
  }),

  http.get(`${API_BASE}/diff/commit/latest`, () => {
    console.log('🔶 MSW: Handling /api/diff/commit/latest');
    return HttpResponse.json(mockCommitInfo);
  }),

  // Get file content
  http.get(`${API_BASE}/files/content`, ({ request }) => {
    const url = new URL(request.url);
    const filePath = url.searchParams.get('path');
    const commit = url.searchParams.get('commit');
    
    console.log('🔶 MSW: Handling /api/files/content for path:', filePath, 'commit:', commit);
    
    if (!filePath || !mockFileContents[filePath as keyof typeof mockFileContents]) {
      return new HttpResponse('File not found', { status: 404 });
    }
    
    // Simulate different content for different commits
    let content = mockFileContents[filePath as keyof typeof mockFileContents];
    
    if (commit && commit !== mockCommitInfo.hash) {
      // Return original content for previous commits
      content = content
        .replace('JWT Token 认证', 'API Key认证')
        .replace('YOUR_JWT_TOKEN', 'YOUR_API_KEY')
        .replace('已废弃的API Key认证', 'API Key认证')
        .replace('typescript', 'javascript');
    }
    
    return HttpResponse.text(content);
  }),

  // Generate diff
  http.post(`${API_BASE}/diff/generate`, async ({ request }) => {
    const { fromCommit, toCommit } = await request.json() as { fromCommit: string; toCommit?: string };
    
    console.log('🔶 MSW: Handling /api/diff/generate for commits:', fromCommit, toCommit);
    
    // Simulate diff generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return HttpResponse.json(mockDiffData);
  }),
];