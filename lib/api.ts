export interface User {
  id: number;
  email: string;
  name?: string | null;
}

export interface Post {
  id: number;
  title: string;
  content?: string | null;
  published: boolean;
  authorId?: number | null;
  author?: User | null;
}

export interface CreateDraftDto {
  title: string;
  content?: string;
  authorEmail: string;
}

export interface SignupUserDto {
  name?: string;
  email: string;
}

const getApiBase = () => {
  if (typeof window === 'undefined') {
    const backendUrl = process.env.API_URL || 'http://localhost:3000';
    return `${backendUrl}/api/v1`;
  }
  return '/nextjs-cicd/api/v1';
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.message) {
        errorMessage = Array.isArray(parsed.message)
          ? parsed.message.join(', ')
          : parsed.message;
      }
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }
  
  // Some endpoints might return empty response on success (e.g. delete / 204 status codes)
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

export const api = {
  // GET /api/v1/feed
  getFeed: async (): Promise<Post[]> => {
    const res = await fetch(`${getApiBase()}/feed`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<Post[]>(res);
  },

  // GET /api/v1/post/{id}
  getPostById: async (id: number): Promise<Post> => {
    const res = await fetch(`${getApiBase()}/post/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<Post>(res);
  },

  // DELETE /api/v1/post/{id}
  deletePost: async (id: number): Promise<{ success: boolean }> => {
    const res = await fetch(`${getApiBase()}/post/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // GET /api/v1/filtered-posts/{searchString}
  searchPosts: async (searchString: string): Promise<Post[]> => {
    const res = await fetch(`${getApiBase()}/filtered-posts/${encodeURIComponent(searchString)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<Post[]>(res);
  },

  // POST /api/v1/post
  createDraft: async (dto: CreateDraftDto): Promise<Post> => {
    const res = await fetch(`${getApiBase()}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return handleResponse<Post>(res);
  },

  // POST /api/v1/user
  signupUser: async (dto: SignupUserDto): Promise<User> => {
    const res = await fetch(`${getApiBase()}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return handleResponse<User>(res);
  },

  // PUT /api/v1/publish/{id}
  publishPost: async (id: number): Promise<Post> => {
    const res = await fetch(`${getApiBase()}/publish/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<Post>(res);
  },
};
