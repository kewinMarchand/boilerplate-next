import type { Article } from '@/modules/blog/domain/article'
import type { components } from '@/shared/api/client'

type ArticleDto = components['schemas']['Article']
type ArticleDetailDto = components['schemas']['ArticleDetail']
type ArticleTermDto = components['schemas']['ArticleTerm']

export const toArticleTerm = ({ slug, name }: ArticleTermDto): Article.Term => ({ slug, name })

export const toArticle = (dto: ArticleDto): Article.Entity => ({
  id: String(dto.id),
  slug: dto.slug,
  title: dto.title,
  excerpt: dto.excerpt,
  publishedAt: dto.publishedAt,
  image: dto.image,
  section: dto.section && toArticleTerm(dto.section),
})

export const toArticleDetail = (dto: ArticleDetailDto): Article.Detail => ({
  ...toArticle(dto),
  html: dto.html,
  format: dto.format && toArticleTerm(dto.format),
  audio: dto.audio,
  speaker: dto.speaker,
  metaTitle: dto.metaTitle,
  metaDescription: dto.metaDescription,
})
