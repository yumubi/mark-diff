import { http, HttpResponse } from 'msw';
import { mockDiffData, mockCommitInfo, mockFileChanges, mockFileContents } from './diffData';

export const handlers = [
  // Get all diff metadata
  http.get('/api/diff/metadata', () => {
    return HttpResponse.json(mockDiffData);
  }),

  // Get diff for specific file
  http.get('/api/diff/file', ({ request }) => {
    const url = new URL(request.url);
    const filePath = url.searchParams.get('path');
    
    if (!filePath || !mockDiffData[filePath]) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(mockDiffData[filePath]);
  }),

  // Get changed files list
  http.get('/api/diff/files', () => {
    return HttpResponse.json(mockFileChanges);
  }),

  // Get commit info
  http.get('/api/diff/commit/:hash', ({ params }) => {
    return HttpResponse.json(mockCommitInfo);
  }),

  http.get('/api/diff/commit/latest', () => {
    return HttpResponse.json(mockCommitInfo);
  }),

  // Get file content
  http.get('/api/files/content', ({ request }) => {
    const url = new URL(request.url);
    const filePath = url.searchParams.get('path');
    const commit = url.searchParams.get('commit');
    
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
  http.post('/api/diff/generate', async ({ request }) => {
    const { fromCommit, toCommit } = await request.json() as { fromCommit: string; toCommit?: string };
    
    // Simulate diff generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return HttpResponse.json(mockDiffData);
  }),
];