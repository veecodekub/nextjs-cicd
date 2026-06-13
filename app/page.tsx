import React from 'react';
import { api, Post } from '../lib/api';
import HomeClient from './HomeClient';

export default async function Home() {
  let initialPosts: Post[] = [];
  let initialApiConnected = false;
  let initialError: string | null = null;

  try {
    initialPosts = await api.getFeed();
    initialApiConnected = true;
  } catch (err: unknown) {
    initialError = err instanceof Error ? err.message : 'Failed to connect to the API.';
    initialApiConnected = false;
  }

  return (
    <HomeClient
      initialPosts={initialPosts}
      initialApiConnected={initialApiConnected}
      initialError={initialError}
    />
  );
}
