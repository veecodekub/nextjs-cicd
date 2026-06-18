import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "../page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      prefetch: () => null,
    };
  },
}));

// Mock the API library
vi.mock("../../lib/api", () => {
  return {
    api: {
      getFeed: vi.fn().mockResolvedValue([
        {
          id: 1,
          title: "Test Post 1",
          content: "Test Body 1",
          published: true,
          author: { id: 10, email: "author1@test.com", name: "Author One" },
        },
        {
          id: 2,
          title: "Test Post 2",
          content: "Test Body 2",
          published: true,
          author: { id: 11, email: "author2@test.com", name: "Author Two" },
        },
      ]),
      searchPosts: vi.fn().mockResolvedValue([]),
      createDraft: vi.fn().mockResolvedValue({}),
      deletePost: vi.fn().mockResolvedValue({ success: true }),
      signupUser: vi.fn().mockResolvedValue({}),
      publishPost: vi.fn().mockResolvedValue({}),
    },
  };
});


describe("Home Page", () => {
  it("renders the welcome heading", async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    const heading = screen.getByRole("heading", {
      name: /NestPost Hub/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the description text", async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    const description = screen.getByText("basePath: /nextjs-cicd");
    expect(description).toBeInTheDocument();
  });

  it("renders the sign up and new draft buttons", async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    const signupBtn = screen.getByRole("button", { name: /Sign Up User/i });
    const draftBtn = screen.getByRole("button", { name: /New Draft/i });
    expect(signupBtn).toBeInTheDocument();
    expect(draftBtn).toBeInTheDocument();
  });

  it("renders the mock posts", async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    const post1 = await screen.findByText("Test Post 1");
    const post2 = await screen.findByText("Test Post 2");
    expect(post1).toBeInTheDocument();
    expect(post2).toBeInTheDocument();
  });
});
