'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, Post } from '../lib/api';

interface PostActionsProps {
  post: Post;
}

export default function PostActions({ post }: PostActionsProps) {
  const router = useRouter();

  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Reset confirmation state after 3 seconds if not clicked again
  useEffect(() => {
    if (confirmDelete) {
      const timer = setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmDelete]);

  // Publish Draft Post
  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.publishPost(post.id);
      showToast('Post published successfully!');
      router.refresh(); // Refresh server component data
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish post';
      showToast(msg, 'error');
    } finally {
      setPublishing(false);
    }
  };

  // Delete Post
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    try {
      await api.deletePost(post.id);
      showToast('Post deleted successfully');
      setTimeout(() => {
        router.push('/');
        router.refresh(); // Refresh feed page state
      }, 1000);
    } catch (err: unknown) {
      setDeleting(false);
      setConfirmDelete(false);
      const msg = err instanceof Error ? err.message : 'Failed to delete post';
      showToast(msg, 'error');
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-55 max-w-sm rounded-xl border border-zinc-850 bg-zinc-900/90 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                ✓
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                ✕
              </div>
            )}
            <p className="text-sm font-medium text-zinc-200">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Actions Panel */}
      <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4 w-full">
        {/* Delete button (Left) */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold cursor-pointer transition-all ${
            confirmDelete
              ? 'bg-red-950 border-red-800 text-red-200 hover:bg-red-900/60'
              : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-950/10'
          }`}
        >
          {deleting ? (
            <svg className="animate-spin h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
          <span>{confirmDelete ? 'Confirm Delete' : 'Delete Post'}</span>
        </button>

        {/* Publish button (Right) */}
        {!post.published && (
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-650 hover:to-violet-750 active:scale-95 disabled:opacity-50 disabled:pointer-events-none px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-550/20 cursor-pointer transition-all flex items-center justify-center"
          >
            {publishing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Publishing...
              </>
            ) : (
              'Publish Post'
            )}
          </button>
        )}
      </div>
    </>
  );
}
