import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import {
  getBlogsWithMeta,
} from '@/medu/queries'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  RssIcon,
} from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getAllCategories } from '../actions'
import type { BlogPost } from '@/types/blog'
import { getAuthors, getMainImageUrl } from '@/types/blog'


export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Stay informed with product updates, company news, and insights on how to sell smarter at jyt.',
}

const postsPerPage = 5

async function FeaturedPosts() {
  try {
    // Use API filtering for featured posts with limit of 3
    const response = await getBlogsWithMeta('jaalyantra.com', {
      is_featured: true,
      limit: 3
    })
    
    const featuredPosts = response?.data || []
    
    if (featuredPosts.length === 0) {
      return
    }

  return (
    <div className="mt-16 bg-linear-to-t from-gray-100 pb-14">
      <Container>
        <h2 className="text-2xl font-medium tracking-tight">Featured</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {featuredPosts.map((post: BlogPost) => {
            const imageUrl = getMainImageUrl(post);
            
            return (
            <div
              key={post.slug}
              className="relative flex flex-col rounded-3xl bg-white p-2 ring-1 shadow-md shadow-black/5 ring-black/5"
            >
              {/* Display main image if available */}
              {imageUrl && (
                <Image
                  alt={post.title || ''}
                  src={imageUrl}
                  width={1170}
                  height={780}
                  priority={true}
                  className="aspect-3/2 w-full rounded-2xl object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-8">
                <div className="text-sm/5 text-gray-700">
                  {dayjs(post.published_at).format('dddd, MMMM D, YYYY')}
                </div>
                <div className="mt-2 text-base/7 font-medium">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </div>
                <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                  {post.content}
                </div>
                {/* Display authors if available */}
                {getAuthors(post).length > 0 && (
                  <div className="mt-6 flex items-center gap-3">
                    <div className="text-sm/5 text-gray-700">
                      {getAuthors(post).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
          })}
        </div>
      </Container>
    </div>
  )
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return null
  }
}

async function Categories({ selected }: { selected?: string }) {
  const categories = await getAllCategories()

  if (categories.length === 0) {
    return
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Menu>
        <MenuButton className="flex items-center justify-between gap-2 font-medium">
          {categories.find(({ slug }) => slug === selected)?.title ||
            'All categories'}
          <ChevronUpDownIcon className="size-4 fill-gray-900" />
        </MenuButton>
        <MenuItems
          anchor="bottom start"
          className="min-w-40 rounded-lg bg-white p-1 ring-1 shadow-lg ring-gray-200 [--anchor-gap:6px] [--anchor-offset:-4px] [--anchor-padding:10px]"
        >
          <MenuItem>
            <Link
              href="/blog"
              data-selected={selected === undefined ? true : undefined}
              className="group grid grid-cols-[1rem_1fr] items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-950/5"
            >
              <CheckIcon className="hidden size-4 group-data-selected:block" />
              <p className="col-start-2 text-sm/6">All categories</p>
            </Link>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.slug}>
              <Link
                href={`/blog?category=${category.slug}`}
                data-selected={category.slug === selected ? true : undefined}
                className="group grid grid-cols-[16px_1fr] items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-950/5"
              >
                <CheckIcon className="hidden size-4 group-data-selected:block" />
                <p className="col-start-2 text-sm/6">{category.title}</p>
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
      <Button variant="outline" href="/blog/feed.xml" className="gap-1">
        <RssIcon className="size-4" />
        RSS Feed
      </Button>
    </div>
  )
}

async function Posts({ page, category }: { page: number; category?: string }) {
  try {
    // Use API filtering and pagination
    const response = await getBlogsWithMeta('jaalyantra.com', {
      category,
      limit: postsPerPage,
      page
    })

    const posts = response?.data || []

    if (posts.length === 0 && page > 1) {
      notFound()
    }

    if (posts.length === 0) {
      return <p className="mt-6 text-gray-500">No posts found.</p>
    }

  return (
    <div className="mt-6">
      {posts.map((post: BlogPost) => (
        <div
          key={post.slug}
          className="relative grid grid-cols-1 border-b border-b-gray-100 py-10 first:border-t first:border-t-gray-200 max-sm:gap-3 sm:grid-cols-3"
        >
          <div>
            <div className="text-sm/5 max-sm:text-gray-700 sm:font-medium">
              {dayjs(post.published_at).format('dddd, MMMM D, YYYY')}
            </div>
            {getAuthors(post).length > 0 && (
              <div className="mt-2.5 flex items-center gap-3">
                <div className="text-sm/5 text-gray-700">
                  {getAuthors(post).join(', ')}
                </div>
              </div>
            )}
          </div>
          <div className="sm:col-span-2 sm:max-w-2xl">
            <h2 className="text-sm/5 font-medium">{post.title}</h2>
            <p className="mt-3 text-sm/6 text-gray-500">{post.content}</p>
            <div className="mt-4">
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-1 text-sm/5 font-medium"
              >
                <span className="absolute inset-0" />
                Read more
                <ChevronRightIcon className="size-4 fill-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
  } catch (error) {
    console.error('Error fetching posts:', error)
    return <p className="mt-6 text-gray-500">Error loading posts. Please try again later.</p>
  }
}

async function Pagination({
  page,
  category,
}: {
  page: number
  category?: string
}) {
  function url(page: number) {
    const params = new URLSearchParams()

    if (category) params.set('category', category)
    if (page > 1) params.set('page', page.toString())

    return params.size !== 0 ? `/blog?${params.toString()}` : '/blog'
  }

  try {
    // Get metadata from API
    const response = await getBlogsWithMeta('jaalyantra.com', {
      category,
      limit: postsPerPage,
      page
    })
    
    const meta = response?.meta || { total: 0, page: 1, limit: postsPerPage, total_pages: 1 }
    
    const hasPreviousPage = page - 1
    const previousPageUrl = hasPreviousPage ? url(page - 1) : undefined
    const hasNextPage = page < meta.total_pages
    const nextPageUrl = hasNextPage ? url(page + 1) : undefined
    const pageCount = meta.total_pages

    if (pageCount < 2) {
      return
    }

  return (
    <div className="mt-6 flex items-center justify-between gap-2">
      <Button
        variant="outline"
        href={previousPageUrl}
        disabled={!previousPageUrl}
      >
        <ChevronLeftIcon className="size-4" />
        Previous
      </Button>
      <div className="flex gap-2 max-sm:hidden">
        {Array.from({ length: pageCount }, (_, i) => (
          <Link
            key={i + 1}
            href={url(i + 1)}
            data-active={i + 1 === page ? true : undefined}
            className={clsx(
              'size-7 rounded-lg text-center text-sm/7 font-medium',
              'data-hover:bg-gray-100',
              'data-active:ring-1 data-active:shadow-sm data-active:ring-black/10',
              'data-active:data-hover:bg-gray-50',
            )}
          >
            {i + 1}
          </Link>
        ))}
      </div>
      <Button variant="outline" href={nextPageUrl} disabled={!nextPageUrl}>
        Next
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  )
  } catch (error) {
    console.error('Error fetching pagination metadata:', error)
    return null
  }
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Blog({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Resolve searchParams if it's a Promise
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams
  
  const page =
    'page' in resolvedParams
      ? typeof resolvedParams.page === 'string' && parseInt(resolvedParams.page) > 1
        ? parseInt(resolvedParams.page)
        : notFound()
      : 1

  const category =
    typeof resolvedParams.category === 'string'
      ? resolvedParams.category
      : undefined

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
        <Subheading className="mt-16">Blog</Subheading>
        <Heading as="h1" className="mt-2">
          What’s happening at JYT.
        </Heading>
        <Lead className="mt-6 max-w-3xl">
          Stay informed with product updates, company news, and insights on how
          to hire independent artisans and sell bespoke designs.
        </Lead>
      </Container>
      {page === 1 && !category && <FeaturedPosts />}
      <Container className="mt-16 pb-24">
        <Categories selected={category} />
        <Posts page={page} category={category} />
        <Pagination page={page} category={category} />
      </Container>
    </main>
  )
}
