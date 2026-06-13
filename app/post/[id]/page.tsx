import React from 'react';
import Link from 'next/link';
import { api, Post } from '../../../lib/api';
import PostActions from '../../../components/PostActions';

interface PostDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailsPage({ params }: PostDetailsPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  let post: Post | null = null;
  let error: string | null = null;

  if (isNaN(id)) {
    error = 'Invalid Post ID';
  } else {
    try {
      post = await api.getPostById(id);
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : 'Failed to load post.';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-zinc-100 flex flex-col antialiased">
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
        {error && (
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

        {post && (
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
              {post.content || <em className="text-zinc-500">No content provided for this post.</em>}
            </div>

            {/* Actions Panel */}
            <PostActions post={post} />
          </article>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/20 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 NestPost Hub. Full-Stack CI/CD Sandbox environment.</p>
      </footer>
    </div>
  );
}
