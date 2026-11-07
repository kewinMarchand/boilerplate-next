import type { Article } from '@/modules/blog/domain/article'
import type { components } from '@/shared/api/client'

type ArticleDto = components['schemas']['Article']

export const toArticle = (dto: ArticleDto): Article.Entity => ({
  id: String(dto.id),
  title: dto.title,
  excerpt: dto.excerpt,
  publishedAt: dto.publishedAt,
  image: dto.image,
})
