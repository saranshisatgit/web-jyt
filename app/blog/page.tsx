import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { getBlogsWithMeta } from '@/medu/queries'
import { ChevronLeftIcon, ChevronRightIcon, RssIcon } from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCategories } from '../actions'
import type { BlogPost } from '@/types/blog'
import { getAuthors, getMainImageUrl } from '@/types/blog'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Field notes, product updates, and thinking out loud from the JaalYantra team.',
}

const POSTS_PER_PAGE = 5

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Blog({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams
  const pageRaw = resolvedParams.page
  let page = 1
  if ('page' in resolvedParams) {
    if (typeof pageRaw === 'string') {
      const parsed = parseInt(pageRaw, 10)
      if (parsed > 1) page = parsed
      else notFound()
    } else {
      notFound()
    }
  }
  const category =
    typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined

  return (
    <main>
      <Navbar />
      <Hero />
      {page === 1 && !category && <FeaturedPosts />}
      <section className="kt-section" id="journal">
        <div className="container">
          <Categories selected={category} />
          <Posts page={page} category={category} />
          <Pagination page={page} category={category} />
        </div>
      </section>
    </main>
  )
}

function Hero() {
  return (
    <section className="kt-hero">
      <div className="container">
        <div className="kt-hero-grid">
          <div>
            <span className="kt-eyebrow">
              <span className="dot" aria-hidden />
              Journal
            </span>
            <h1 className="kt-display xl" style={{ marginTop: '32px', marginBottom: '24px' }}>
              Field notes from the <em>workshop floor</em>.
            </h1>
            <p
              className="muted"
              style={{ fontSize: '21px', maxWidth: '680px', lineHeight: 1.45, margin: 0 }}
            >
              Stories from the makers, product updates, and how we think about provenance, production,
              and platform — out loud.
            </p>
          </div>
          <aside className="kt-hero-side">
            <div className="row"><span className="k">Format</span><span className="v">Long-form</span></div>
            <div className="row"><span className="k">Cadence</span><span className="v">~1 / mo</span></div>
            <div className="row"><span className="k">Topics</span><span className="v">Craft · Tech · Brand</span></div>
            <div className="row"><span className="k">RSS</span><span className="v">Available</span></div>
          </aside>
        </div>
      </div>
    </section>
  )
}

async function FeaturedPosts() {
  try {
    const response = await getBlogsWithMeta('jaalyantra.com', { is_featured: true, limit: 3 })
    const featuredPosts = response?.data || []
    if (featuredPosts.length === 0) return null

    return (
      <section className="kt-section">
        <div className="container">
          <div className="kt-section-head">
            <div className="kt-eyebrow">Featured</div>
            <h2 className="kt-display m">What we&apos;re thinking <em>about</em>.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post: BlogPost) => {
              const imageUrl = getMainImageUrl(post)
              const authors = getAuthors(post)
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="kt-card hover"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    className={`kt-card-img${imageUrl ? ' photo' : ''}`}
                    style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
                    data-label="featured"
                  />
                  <div className="kt-meta" style={{ marginBottom: '8px' }}>
                    {dayjs(post.published_at).format('MMM D, YYYY')}
                  </div>
                  <h3 className="kt-card-title l">{post.title}</h3>
                  <p className="kt-card-body" style={{ marginTop: '8px' }}>{post.content}</p>
                  {authors.length > 0 && (
                    <div className="kt-meta" style={{ marginTop: '24px', color: 'var(--ink-soft)' }}>
                      {authors.join(', ')}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return null
  }
}

async function Categories({ selected }: { selected?: string }) {
  const categories = await getAllCategories()
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <CategoryChip href="/blog" active={!selected}>All</CategoryChip>
        {categories.map((cat) => (
          <CategoryChip
            key={cat.slug}
            href={`/blog?category=${cat.slug}`}
            active={cat.slug === selected}
          >
            {cat.title}
          </CategoryChip>
        ))}
      </div>
      <a
        href="/blog/feed.xml"
        className="kt-pill"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
      >
        <RssIcon className="size-3" />
        RSS
      </a>
    </div>
  )
}

function CategoryChip({
  href,
  active,
  children,
}: {
  href: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-pressed={active}
      className={`kt-pill${active ? ' solid' : ''}`}
      style={{ textDecoration: 'none' }}
    >
      {children}
    </Link>
  )
}

async function Posts({ page, category }: { page: number; category?: string }) {
  try {
    const response = await getBlogsWithMeta('jaalyantra.com', {
      category,
      limit: POSTS_PER_PAGE,
      page,
    })
    const posts = response?.data || []

    if (posts.length === 0 && page > 1) notFound()
    if (posts.length === 0) {
      return (
        <p className="muted" style={{ marginTop: '24px' }}>
          No posts found{category ? ` in ${category}` : ''}.
        </p>
      )
    }

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--rule)' }}>
        {posts.map((post: BlogPost) => {
          const authors = getAuthors(post)
          return (
            <li
              key={post.slug}
              style={{ padding: '32px 0', borderBottom: '1px solid var(--rule-soft)' }}
            >
              <article
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                style={{ alignItems: 'start' }}
              >
                <div>
                  <div className="kt-meta">
                    {dayjs(post.published_at).format('dddd · MMM D, YYYY')}
                  </div>
                  {authors.length > 0 && (
                    <div
                      className="kt-meta"
                      style={{ marginTop: '8px', color: 'var(--ink-soft)', letterSpacing: '0.06em' }}
                    >
                      {authors.join(', ')}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <h3 className="serif" style={{ fontSize: '28px', margin: 0, lineHeight: 1.15, fontWeight: 400 }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="muted" style={{ fontSize: '16px', lineHeight: 1.55, marginTop: '12px' }}>
                    {post.content}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="kt-meta"
                    style={{
                      marginTop: '16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--accent-deep)',
                      textDecoration: 'none',
                    }}
                  >
                    Read more
                    <ChevronRightIcon className="size-3" />
                  </Link>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    return (
      <p className="muted" style={{ marginTop: '24px', color: 'var(--accent-deep)' }}>
        Error loading posts. Please try again later.
      </p>
    )
  }
}

async function Pagination({ page, category }: { page: number; category?: string }) {
  function url(p: number) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (p > 1) params.set('page', p.toString())
    return params.size !== 0 ? `/blog?${params.toString()}` : '/blog'
  }

  try {
    const response = await getBlogsWithMeta('jaalyantra.com', {
      category,
      limit: POSTS_PER_PAGE,
      page,
    })
    const meta = response?.meta || { total_pages: 1 }
    const pageCount = meta.total_pages
    if (pageCount < 2) return null

    const previousPageUrl = page > 1 ? url(page - 1) : undefined
    const nextPageUrl = page < pageCount ? url(page + 1) : undefined

    return (
      <div
        style={{
          marginTop: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {previousPageUrl ? (
          <Link href={previousPageUrl} className="kt-btn ghost sm">
            <ChevronLeftIcon className="size-3" />
            Previous
          </Link>
        ) : (
          <span className="kt-btn ghost sm is-disabled">
            <ChevronLeftIcon className="size-3" />
            Previous
          </span>
        )}
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: pageCount }, (_, i) => {
            const p = i + 1
            const active = p === page
            return (
              <Link
                key={p}
                href={url(p)}
                className="kt-meta"
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  width: '28px',
                  height: '28px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--r-sm)',
                  textDecoration: 'none',
                  color: active ? 'var(--ink)' : 'var(--ink-soft)',
                  border: active ? '1px solid var(--rule)' : '1px solid transparent',
                  background: active ? 'var(--cream)' : 'transparent',
                }}
              >
                {p}
              </Link>
            )
          })}
        </div>
        {nextPageUrl ? (
          <Link href={nextPageUrl} className="kt-btn ghost sm">
            Next
            <ChevronRightIcon className="size-3" />
          </Link>
        ) : (
          <span className="kt-btn ghost sm is-disabled">
            Next
            <ChevronRightIcon className="size-3" />
          </span>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching pagination metadata:', error)
    return null
  }
}
