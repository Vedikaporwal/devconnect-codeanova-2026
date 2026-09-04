import { prisma } from "@workspace/db";
import type { BlogPost, CreateBlogRequest, UpdateBlogRequest } from "@workspace/shared";
import { AppError } from "../utils/appError";

const authorSelect = { id: true, name: true, username: true, avatarUrl: true } as const;
const blogInclude = { author: { select: authorSelect } } as const;

type BlogWithAuthor = Awaited<ReturnType<typeof prisma.blogPost.findUnique>> & {
  author: { id: string; name: string; username: string; avatarUrl: string | null };
};

const toBlog = (blog: BlogWithAuthor): BlogPost => ({
  id: blog.id,
  title: blog.title,
  slug: blog.slug,
  content: blog.content,
  excerpt: blog.excerpt,
  published: blog.published,
  authorId: blog.authorId,
  author: blog.author,
  createdAt: blog.createdAt.toISOString(),
  updatedAt: blog.updatedAt.toISOString(),
});

const slugBase = (title: string) => title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "untitled-post";

const uniqueSlug = async (title: string, currentId?: string) => {
  const base = slugBase(title);
  let slug = base;
  let suffix = 2;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === currentId) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
};

const getBlogOrThrow = async (id: string) => {
  const blog = await prisma.blogPost.findUnique({ where: { id }, include: blogInclude });
  if (!blog) throw new AppError(404, "Blog post not found");
  return blog;
};

const assertOwner = (blog: { authorId: string }, userId: string) => {
  if (blog.authorId !== userId) throw new AppError(403, "You can only manage your own blog posts");
};

export const listBlogs = async (userId?: string): Promise<BlogPost[]> => {
  const blogs = await prisma.blogPost.findMany({
    where: userId ? { OR: [{ published: true }, { authorId: userId }] } : { published: true },
    include: blogInclude,
    orderBy: [{ createdAt: "desc" }],
  });
  return blogs.map(toBlog);
};

export const getBlog = async (id: string, userId?: string): Promise<BlogPost> => {
  const blog = await getBlogOrThrow(id);
  if (!blog.published && blog.authorId !== userId) throw new AppError(404, "Blog post not found");
  return toBlog(blog);
};

export const createBlog = async (authorId: string, input: CreateBlogRequest): Promise<BlogPost> => {
  const blog = await prisma.blogPost.create({
    data: { authorId, title: input.title, slug: await uniqueSlug(input.title), content: input.content, excerpt: input.excerpt ?? null, published: input.published ?? false },
    include: blogInclude,
  });
  return toBlog(blog);
};

export const updateBlog = async (id: string, authorId: string, input: UpdateBlogRequest): Promise<BlogPost> => {
  const existing = await getBlogOrThrow(id);
  assertOwner(existing, authorId);
  const blog = await prisma.blogPost.update({
    where: { id },
    data: { ...(input.title !== undefined ? { title: input.title, slug: await uniqueSlug(input.title, id) } : {}), ...(input.content !== undefined ? { content: input.content } : {}), ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}), ...(input.published !== undefined ? { published: input.published } : {}) },
    include: blogInclude,
  });
  return toBlog(blog);
};

export const deleteBlog = async (id: string, authorId: string) => {
  const existing = await getBlogOrThrow(id);
  assertOwner(existing, authorId);
  await prisma.blogPost.delete({ where: { id } });
};