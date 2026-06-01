import { prisma } from "../config/database.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { getPaginationParams, buildPaginationResult } from "../utils/pagination.js";

export async function getBlogPosts(page?: number, limit?: number, category?: string) {
  const { page: p, limit: l } = getPaginationParams(page, limit);
  const where: Record<string, unknown> = { isPublished: true };

  if (category) where.category = category;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: where as any,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        tags: true,
        publishedAt: true,
        viewCount: true,
      },
      orderBy: { publishedAt: "desc" },
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.blogPost.count({ where: where as any }),
  ]);

  return buildPaginationResult(posts, total, p, l);
}

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({ where: { slug, isPublished: true } });

  if (!post) throw new AppError("Blog post not found", 404, "BLOG_POST_NOT_FOUND");

  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  return post;
}
