import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import type { DiffMetadata, DiffHighlightData, DiffViewMode } from '../types/diff';

interface DiffState {
  diffData: DiffHighlightData;
  currentFile: string | null;
  visibleTypes: Set<string>;
  viewMode: DiffViewMode;
  isLoading: boolean;
  error: string | null;
}

interface DiffActions {
  setDiffData: (data: DiffHighlightData) => void;
  setCurrentFile: (filePath: string | null) => void;
  toggleDiffType: (type: string) => void;
  setAllDiffTypes: (visible: boolean) => void;
  setViewMode: (mode: Partial<DiffViewMode>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type DiffStore = DiffState & DiffActions;

const initialState: DiffState = {
  diffData: {},
  currentFile: null,
  visibleTypes: new Set(['added', 'removed', 'modified']),
  viewMode: {
    type: 'unified',
    showLineNumbers: true,
    showWhitespace: false,
  },
  isLoading: false,
  error: null,
};

export const useDiffStore = create<DiffStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,
        
        setDiffData: (data) =>
          set((state) => {
            state.diffData = data;
            state.error = null;
          }),

        setCurrentFile: (filePath) =>
          set((state) => {
            state.currentFile = filePath;
          }),

        toggleDiffType: (type) =>
          set((state) => {
            if (state.visibleTypes.has(type)) {
              state.visibleTypes.delete(type);
            } else {
              state.visibleTypes.add(type);
            }
          }),

        setAllDiffTypes: (visible) =>
          set((state) => {
            if (visible) {
              state.visibleTypes = new Set(['added', 'removed', 'modified']);
            } else {
              state.visibleTypes = new Set();
            }
          }),

        setViewMode: (mode) =>
          set((state) => {
            state.viewMode = { ...state.viewMode, ...mode };
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
            state.isLoading = false;
          }),

        reset: () =>
          set((state) => {
            Object.assign(state, initialState);
          }),
      })),
      { 
        name: 'diff-store',
        partialize: (state) => ({
          visibleTypes: Array.from(state.visibleTypes),
          viewMode: state.viewMode,
        }),
      }
    ),
    { name: 'diff-store' }
  )
);