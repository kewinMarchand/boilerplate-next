'use client'

import { useId } from 'react'

import { Cluster } from '@kewinmarchand/boilerplates-ui/react'

import { AfterHydration, Icon, Picture } from '@/shared/ui/kit'

import styles from './Carousel.module.css'
import { useCarousel } from './hooks/useCarousel'

import type { ResponsiveImage } from '@/shared/ui/kit'

export declare namespace Carousel {
  interface Slide {
    id: string
    title: string
    text: string
    image: ResponsiveImage | null
  }
}

interface CarouselProps {
  title: string
  slides: Carousel.Slide[]
  'data-testid'?: string
}

export const Carousel = ({ title, slides, 'data-testid': testId }: CarouselProps) => {
  const titleId = useId()
  const trackId = useId()
  const {
    viewportRef,
    prevRef,
    nextRef,
    isReady,
    selected,
    snapCount,
    canPrev,
    canNext,
    goPrev,
    goNext,
    goTo,
  } = useCarousel()

  return (
    <section aria-labelledby={titleId} aria-roledescription="carrousel" data-testid={testId}>
      <Cluster justify="between" gap="4">
        <h2 id={titleId} className="bui-text bui-text--h2">
          {title}
        </h2>
        <Cluster gap="2">
          <button
            ref={prevRef}
            type="button"
            className="bui-button bui-button--outline"
            aria-controls={trackId}
            disabled={!canPrev}
            onClick={goPrev}
            data-testid="carousel-prev"
          >
            <Icon name="chevron-left" />
            Précédent
          </button>
          <button
            ref={nextRef}
            type="button"
            className="bui-button bui-button--outline"
            aria-controls={trackId}
            disabled={!canNext}
            onClick={goNext}
            data-testid="carousel-next"
          >
            Suivant
            <Icon name="chevron-right" />
          </button>
        </Cluster>
      </Cluster>

      <div
        ref={viewportRef}
        role="group"
        aria-label="Diapositives"
        tabIndex={0}
        data-embla-ready={isReady || undefined}
        data-testid="carousel-viewport"
        className={styles.viewport}
      >
        <div id={trackId} className={styles.track}>
          {slides.map((slide, position) => {
            const slideImage = slide.image && (
              <Picture
                image={slide.image}
                draggable={false}
                sizes="(min-width: 1440px) 460px, (min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
            )
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="diapositive"
                aria-label={`${position + 1} sur ${slides.length}`}
                data-testid="carousel-slide"
                className={styles.slide}
              >
                {slideImage && (
                  <AfterHydration placeholder={<div className={styles.placeholder} />}>
                    {slideImage}
                  </AfterHydration>
                )}
                <h3 className={`bui-text bui-text--h3 ${styles.slideTitle}`}>{slide.title}</h3>
                <p className="bui-text">{slide.text}</p>
              </div>
            )
          })}
        </div>
      </div>

      {isReady && snapCount > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: snapCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Aller à la diapositive ${index + 1}`}
              aria-current={index === selected ? 'true' : undefined}
              onClick={() => goTo(index)}
              data-testid="carousel-dot"
              className={styles.dot}
            />
          ))}
        </div>
      )}
    </section>
  )
}
