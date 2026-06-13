'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '../lib/api';

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => Promise<void>;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reset confirmation state after 3 seconds if not clicked again
  useEffect(() => {
    if (confirmDelete) {
      const timer = setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmDelete]);

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop click from navigating
    e.stopPropagation();

    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      setIsDeleting(true);
      try {
        await onDelete(post.id);
      } catch {
        setIsDeleting(false);
        setConfirmDelete(false);
      }
    }
  };

  // Truncate content helper
  const getContentExcerpt = (text?: string | null) => {
    if (!text) return 'No content provided.';
    return text.length > 150 ? `${text.substring(0, 150)}...` : text;
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-850 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 hover:border-zinc-800 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
      <div>
        {/* Post Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              post.published 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {post.published ? 'Published' : 'Draft'}
            </span>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            aria-label="Delete post"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold border transition-all ${
              confirmDelete
                ? 'bg-red-950 border-red-800 text-red-200 hover:bg-red-900'
                : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-950/20'
            }`}
          >
            {isDeleting ? (
              <svg className="animate-spin h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            <span>{confirmDelete ? 'Delete?' : ''}</span>
          </button>
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-white transition-colors">
          {post.title}
        </h4>

        {/* Content Excerpt */}
        <p className="text-sm text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
          {getContentExcerpt(post.content)}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-zinc-850 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            {post.author?.name ? post.author.name.charAt(0) : (post.author?.email ? post.author.email.charAt(0) : '?')}
          </div>
          <div className="text-left">
            <p className="text-[11px] font-semibold text-zinc-300 leading-none">
              {post.author?.name || 'Anonymous'}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              {post.author?.email || 'No Email'}
            </p>
          </div>
        </div>

        <Link
          href={`/post/${post.id}`}
          className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-1 transition-all"
        >
          View Post
          <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
