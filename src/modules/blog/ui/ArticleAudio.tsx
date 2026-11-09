import { getDictionary } from '@/shared/i18n/server'

import { formatDuration } from '../domain/article'
import styles from './ArticleAudio.module.css'

import type { Article } from '../domain/article'

interface ArticleAudioProps {
  audio: Article.Audio
  speaker: string
}

/** Version audio de l'article : rien n'est téléchargé avant la lecture, pas d'autolecture. */
export const ArticleAudio = async ({ audio, speaker }: ArticleAudioProps) => {
  const t = await getDictionary()
  return (
    <figure className={styles.audio}>
      <figcaption className="bui-text bui-text--body-sm">
        {t.blog.audio}
        <span data-testid="article-audio-duration">{formatDuration(audio.durationSeconds)}</span>
        {speaker && (
          <>
            {' · '}
            <span data-testid="article-audio-speaker">{speaker}</span>
          </>
        )}
      </figcaption>
      <audio controls preload="none" className={styles.player} data-testid="article-audio">
        <source src={audio.src} type={audio.type} />
      </audio>
    </figure>
  )
}
