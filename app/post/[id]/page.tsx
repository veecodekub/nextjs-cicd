'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Post } from '../../../lib/api';

interface PostDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailsPage({ params }: PostDetailsPageProps) {
  const { id: rawId } = use(params);
  const id = Number(rawId);
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function loadPost() {
      if (isNaN(id)) {
        setError('Invalid Post ID');
        setLoading(false);
        return;
      }
      try {
        const data = await api.getPostById(id);
        setPost(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load post.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

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
    if (!post) return;
    setPublishing(true);
    try {
      const updatedPost = await api.publishPost(post.id);
      setPost(updatedPost);
      showToast('Post published successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish post';
      showToast(msg, 'error');
    } finally {
      setPublishing(false);
    }
  };

  // Delete Post
  const handleDelete = async () => {
    if (!post) return;
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
      }, 1000);
    } catch (err: unknown) {
      setDeleting(false);
      setConfirmDelete(false);
      const msg = err instanceof Error ? err.message : 'Failed to delete post';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-zinc-100 flex flex-col antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-55 max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
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

      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-all group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Feed
          </Link>
          <div className="flex items-center gap-3">
            <span className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">
              NP
            </span>
            <span className="text-sm font-bold text-zinc-200">NestPost</span>
          </div>
        </div>
      </header>

      {/* Post container */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full flex flex-col items-center justify-center">
        
        {loading && (
          <div className="w-full max-w-2xl bg-zinc-900/10 border border-zinc-850 rounded-2xl p-8 space-y-6 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-16" />
            <div className="h-8 bg-zinc-800 rounded w-3/4" />
            <div className="h-4 bg-zinc-800 rounded w-1/3" />
            <div className="border-t border-zinc-900 pt-6 space-y-3">
              <div className="h-3.5 bg-zinc-800 rounded w-full" />
              <div className="h-3.5 bg-zinc-800 rounded w-11/12" />
              <div className="h-3.5 bg-zinc-800 rounded w-5/6" />
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl bg-red-950/20 border border-red-900/50 p-8 text-center max-w-md my-12">
            <div className="h-12 w-12 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              ⚠
            </div>
            <h3 className="font-bold text-red-300 mb-1">Could not find post</h3>
            <p className="text-sm text-red-400/80 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-zinc-800 hover:border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Return to Home Feed
            </Link>
          </div>
        )}

        {post && !loading && (
          <article className="w-full max-w-2xl bg-zinc-900/20 border border-zinc-850/80 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-md">
            
            {/* Header badges / Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                post.published 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {post.published ? 'Published Post' : 'Draft Post'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Post ID:</span>
                <span className="text-xs font-mono text-zinc-400 bg-zinc-950 border border-zinc-905 px-1.5 py-0.5 rounded">
                  {post.id}
                </span>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Author Profile */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-900">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm uppercase">
                {post.author?.name ? post.author.name.charAt(0) : (post.author?.email ? post.author.email.charAt(0) : '?')}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-zinc-200">
                  {post.author?.name || 'Anonymous Developer'}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {post.author?.email || 'No email provided'}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-4 text-base whitespace-pre-wrap">
              {post.content || <em className="text-zinc-650">No content provided for this post.</em>}
            </div>

            {/* Actions Panel */}
            <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4">
              
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
          </article>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/20 py-8 text-center text-xs text-zinc-550">
        <p>© 2026 NestPost Hub. Full-Stack CI/CD Sandbox environment.</p>
      </footer>
    </div>
  );
}
