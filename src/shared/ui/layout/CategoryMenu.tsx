'use client'

import { useId } from 'react'

import { CATALOG_NAVIGATION } from '@/shared/config'
import { useDictionary, useLocalizePath, usePagePathname } from '@/shared/i18n'
import { useCategoryMenu } from '@/shared/ui/hooks/useCategoryMenu'
import { useHydrated } from '@/shared/ui/hooks/useHydrated'
import { Icon, Link } from '@/shared/ui/kit'

import styles from './CategoryMenu.module.css'
import { NavLink } from './NavLink'
import navStyles from './NavLink.module.css'

import type { NavigationNode } from '@/shared/config'

interface CategoryMenuProps {
  label: string
  nodes: NavigationNode[]
}

const buildColumns = (nodes: NavigationNode[], openPath: string[]) => {
  const columns = [nodes]
  openPath.forEach((id, level) => {
    const children = columns[level]?.find((node) => node.id === id)?.children
    if (children) columns.push(children)
  })
  return columns
}

export const CategoryMenu = ({ label, nodes }: CategoryMenuProps) => {
  const isHydrated = useHydrated()
  const t = useDictionary()
  const isActive = usePagePathname().startsWith(useLocalizePath()(CATALOG_NAVIGATION.href))
  const panelId = useId()
  const { isOpen, openPath, rootRef, buttonRef, panelRef, close, toggle, openBranch, onKeyDown } =
    useCategoryMenu()

  if (!isHydrated) return <NavLink href={CATALOG_NAVIGATION.href} label={label} />

  return (
    <div ref={rootRef} onKeyDown={onKeyDown} className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
        data-testid="layout-category-menu-toggle"
        className={`${navStyles.link} ${styles.toggle}`}
        data-active={isActive || undefined}
      >
        {label}
        <Icon name="chevron-down" />
      </button>
      <div
        ref={panelRef}
        id={panelId}
        hidden={!isOpen}
        data-testid="layout-category-menu"
        className={styles.panel}
      >
        <Link
          href={CATALOG_NAVIGATION.href}
          onClick={close}
          data-testid="layout-category-link"
          className={`bui-link ${styles.all}`}
        >
          {t.layout.wholeCatalog}
        </Link>
        <div className={styles.columns}>
          {buildColumns(nodes, openPath).map((column, level) => (
            <ul key={level} className={styles.column}>
              {column.map((node) => {
                const hasChildren = node.children.length > 0
                return (
                  <li key={node.id}>
                    <Link
                      href={node.href}
                      data-level={level}
                      aria-expanded={hasChildren ? openPath[level] === node.id : undefined}
                      onMouseEnter={() => openBranch(level, node.id, hasChildren)}
                      onFocus={() => openBranch(level, node.id, hasChildren)}
                      onClick={close}
                      data-testid="layout-category-link"
                      className={styles.item}
                    >
                      {node.label}
                      {hasChildren && <Icon name="chevron-right" size={16} />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
