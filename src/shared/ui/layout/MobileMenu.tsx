'use client'

import { useId } from 'react'

import { Button, Drawer, IconButton } from '@kewinmarchand/boilerplates-ui/react'

import { CATALOG_NAVIGATION } from '@/shared/config'
import { format, useDictionary } from '@/shared/i18n'
import { useHydrated } from '@/shared/ui/hooks/useHydrated'
import { useMobileMenu } from '@/shared/ui/hooks/useMobileMenu'
import { Icon, Link } from '@/shared/ui/kit'

import styles from './MobileMenu.module.css'

import type { NavigationItem, NavigationNode } from '@/shared/config'

interface MobileMenuProps {
  navigation: NavigationItem[]
  categoryMenu: NavigationNode[]
}

const findLevel = (tree: NavigationNode[], levels: string[]) => {
  let nodes = tree
  const trail: NavigationNode[] = []
  for (const id of levels) {
    const node = nodes.find((item) => item.id === id)
    if (!node) break
    trail.push(node)
    nodes = node.children
  }
  return { nodes, trail }
}

export const MobileMenu = ({ navigation, categoryMenu }: MobileMenuProps) => {
  const t = useDictionary()
  const isHydrated = useHydrated()
  const drawerId = useId()
  const { isOpen, levels, open, close, descend, back } = useMobileMenu()

  if (!isHydrated) {
    return (
      <Link
        href="/plan-du-site"
        aria-label={t.layout.menu}
        className="bui-button bui-button--nav bui-button--icon"
      >
        <Icon name="menu" />
      </Link>
    )
  }

  const { nodes, trail } = findLevel(categoryMenu, levels ?? [])
  const current = trail.at(-1)
  const catalogLabel = t.nav[CATALOG_NAVIGATION.key]
  const title = levels === null ? t.layout.menu : (current?.label ?? catalogLabel)
  const parentName = levels?.length ? (trail.at(-2)?.label ?? catalogLabel) : t.layout.menu

  return (
    <>
      <IconButton
        variant="nav"
        label={t.layout.menu}
        icon="menu"
        aria-expanded={isOpen}
        aria-controls={drawerId}
        onClick={open}
        data-testid="layout-mobile-menu-toggle"
      />
      <Drawer
        id={drawerId}
        title={title}
        open={isOpen}
        onClose={close}
        side="start"
        closeLabel={t.layout.closeMenu}
        focusTitle
        data-testid="layout-mobile-menu"
      >
        {levels !== null && (
          <Button
            variant="ghost"
            icon="arrow-left"
            onClick={back}
            data-testid="layout-mobile-menu-back"
          >
            {format(t.layout.back, { parent: parentName })}
          </Button>
        )}

        <ul className={styles.list}>
          {levels === null ? (
            navigation.map((item) => (
              <li key={item.href}>
                {item.href === CATALOG_NAVIGATION.href ? (
                  <button
                    type="button"
                    onClick={() => descend()}
                    data-testid="layout-mobile-menu-descend-catalogue"
                    className={styles.row}
                  >
                    {item.label}
                    <Icon name="chevron-right" />
                  </button>
                ) : (
                  <Link href={item.href} onClick={close} className={styles.row}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))
          ) : (
            <>
              <li>
                <Link
                  href={current?.href ?? CATALOG_NAVIGATION.href}
                  onClick={close}
                  className={`${styles.row} ${styles.all}`}
                >
                  {t.layout.wholeCategory}
                </Link>
              </li>
              {nodes.map((node) => (
                <li key={node.id}>
                  {node.children.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => descend(node.id)}
                      data-testid={`layout-mobile-menu-descend-${node.id}`}
                      className={styles.row}
                    >
                      {node.label}
                      <Icon name="chevron-right" />
                    </button>
                  ) : (
                    <Link
                      href={node.href}
                      onClick={close}
                      data-testid="layout-category-link"
                      className={styles.row}
                    >
                      {node.label}
                    </Link>
                  )}
                </li>
              ))}
            </>
          )}
        </ul>
      </Drawer>
    </>
  )
}
