'use client';

import React, { useState } from 'react';
import { api } from '../lib/api';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (postId: number) => void;
  recentEmails: string[];
}

export default function CreatePostModal({ isOpen, onClose, onSuccess, recentEmails }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required');
      return;
    }
    if (!authorEmail) {
      setError('Author email is required');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const draft = await api.createDraft({
        title,
        content: content || undefined,
        authorEmail,
      });
      onSuccess(draft.id);
      setTitle('');
      setContent('');
      setAuthorEmail('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create draft. Please check your inputs.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-create-title"
        className="relative w-full max-w-lg transform overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 text-left shadow-2xl backdrop-blur-xl transition-all duration-300"
      >
        
        {/* Close button */}
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
        >
          ✕
        </button>

        <div className="mb-6">
          <h3 id="modal-create-title" className="text-2xl font-bold text-zinc-100">
            Create Draft Post
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Write a draft. You can publish it once it is saved.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-950/50 border border-red-800/50 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Post Title <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Getting Started with CI/CD"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="authorEmail" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Author Email <span className="text-indigo-400">*</span>
            </label>
            <input
              type="email"
              id="authorEmail"
              list="recent-emails"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              required
              placeholder="Select or type author's email"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
            <datalist id="recent-emails">
              {recentEmails.map((email) => (
                <option key={email} value={email} />
              ))}
            </datalist>
            {recentEmails.length > 0 && (
              <p className="mt-1 text-xs text-zinc-500">
                You can choose from your recently registered users list.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="content" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Write your post content here..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-650 hover:to-violet-750 active:scale-95 disabled:opacity-50 disabled:pointer-events-none px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-550/20 transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Draft...
                </>
              ) : (
                'Save Draft'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
