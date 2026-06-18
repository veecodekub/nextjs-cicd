'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api, Post } from '../lib/api';
import PostCard from '../components/PostCard';
import UserSignupModal from '../components/UserSignupModal';
import CreatePostModal from '../components/CreatePostModal';

interface HomeClientProps {
  initialPosts: Post[];
  initialApiConnected: boolean;
  initialError: string | null;
}

export default function HomeClient({
  initialPosts,
  initialApiConnected,
  initialError,
}: HomeClientProps) {
  const router = useRouter();
  const isFirstMount = useRef(true);
  
  // App States initialized with server props
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  
  // Modals & User Registry
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [recentEmails, setRecentEmails] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem('registered_emails');
    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  
  // Connection check
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(initialApiConnected);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Fetch Feed
  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFeed();
      setPosts(data);
      setIsApiConnected(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to the API.';
      setError(msg);
      setIsApiConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Search Results
  const performSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.searchPosts(query);
      setPosts(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch search results.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (searchQuery.trim() === '') {
      const delayDebounce = setTimeout(() => {
        fetchFeed();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }

    const delayDebounce = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchFeed, performSearch]);

  // Handle post deletion
  const handleDeletePost = async (id: number) => {
    try {
      await api.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast('Post deleted successfully');
      router.refresh(); // Refresh server state
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete post';
      showToast(msg, 'error');
      throw err;
    }
  };

  // Add registered email to local cache
  const handleSignupSuccess = (email: string, name: string) => {
    const updated = Array.from(new Set([email, ...recentEmails]));
    setRecentEmails(updated);
    localStorage.setItem('registered_emails', JSON.stringify(updated));
    showToast(`Registered user: ${name || email}`);
  };

  // Handle draft creation success
  const handleCreateDraftSuccess = (id: number) => {
    showToast('Draft created successfully! Redirecting...');
    // Wait for the toast to be readable, then redirect
    setTimeout(() => {
      router.push(`/post/${id}`);
    }, 1500);
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

      {/* Header / Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black tracking-wider shadow-md">
              NP
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-100">
                NestPost Hub
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono leading-none">basePath: /nextjs-cicd</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection Status indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 text-xs border border-zinc-850">
              <span className={`h-2 w-2 rounded-full ${
                isApiConnected === null 
                  ? 'bg-zinc-600 animate-pulse' 
                  : isApiConnected 
                    ? 'bg-emerald-500 shadow-sm shadow-emerald-400/50' 
                    : 'bg-red-500 animate-pulse shadow-sm shadow-red-400/50'
              }`} />
              <span className="text-[11px] font-medium text-zinc-400">
                {isApiConnected === null 
                  ? 'Connecting...' 
                  : isApiConnected 
                    ? 'API Connected' 
                    : 'API Disconnected'}
              </span>
            </div>

            <button
              onClick={() => setIsSignupOpen(true)}
              className="rounded-lg border border-zinc-850 hover:border-zinc-700 px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/30 hover:bg-zinc-900/80 transition-all cursor-pointer"
            >
              Sign Up User
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/15 transition-all cursor-pointer"
            >
              New Draft
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Hero Section */}
        <div className="text-center md:text-left mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Developer Feed
            </h2>
            <p className="mt-2 text-base text-zinc-400 max-w-xl">
              Publish drafts, search through existing posts, and keep track of user-driven content.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search posts by title or content"
              placeholder="Search posts by title or body content..."
              className="w-full rounded-xl border border-zinc-850 bg-zinc-900/20 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-zinc-900/40 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-xl bg-red-950/20 border border-red-900/50 p-6 text-center max-w-2xl mx-auto my-12">
            <div className="h-10 w-10 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              ⚠
            </div>
            <h3 className="font-bold text-red-300 mb-1">API Error Occurred</h3>
            <p className="text-sm text-red-400/80 mb-4">{error}</p>
            <button
              onClick={fetchFeed}
              className="inline-flex items-center rounded-lg border border-red-900/60 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-950/50 transition-all cursor-pointer"
            >
              Try Reconnecting
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-zinc-850 bg-zinc-900/10 p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-zinc-800 rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-5 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded w-5/6" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
                <div className="pt-4 border-t border-zinc-900 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-zinc-800 rounded-full" />
                    <div>
                      <div className="h-3 bg-zinc-800 rounded w-16" />
                      <div className="h-2 bg-zinc-800 rounded w-20 mt-1" />
                    </div>
                  </div>
                  <div className="h-3 bg-zinc-800 rounded w-14" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feed List */}
        {!loading && !error && (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-20 max-w-md mx-auto">
                <div className="h-16 w-16 bg-zinc-900 border border-zinc-850 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-500 text-2xl">
                  📝
                </div>
                <h3 className="text-lg font-bold text-zinc-200 mb-1">
                  {searchQuery ? 'No matching posts found' : 'No posts published yet'}
                </h3>
                <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                  {searchQuery
                    ? `We couldn't find any posts matching "${searchQuery}". Try editing your search query.`
                    : 'Get started by creating a new post. It will start as a draft that you can review and publish.'}
                </p>
                {!searchQuery ? (
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="inline-flex items-center rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
                  >
                    Create Your First Post
                  </button>
                ) : (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center rounded-lg border border-zinc-800 hover:border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    Clear Search Query
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/20 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 NestPost Hub. Full-Stack CI/CD Sandbox environment. Version 0.0.1</p>
      </footer>

      {/* Modals */}
      <UserSignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSuccess={handleSignupSuccess}
      />
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateDraftSuccess}
        recentEmails={recentEmails}
      />
    </div>
  );
}
