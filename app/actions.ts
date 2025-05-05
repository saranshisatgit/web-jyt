'use server'

import { getAllBlogs, getCategories, getAPost, getBlockByType, fetchFooter, fetchPage } from "@/medu/queries"

/**
 * Fetch all blogs with caching
 */
export async function fetchAllBlogs() {
  const blogs = getAllBlogs('jaalyantra.com', '')
  return blogs
}

/**
 * Fetch all categories with caching
 */
export async function getAllCategories() {
  const cats = getCategories()
  return cats
}

/**
 * Fetch a single post with caching
 */
export async function getSinglePost(slug: string) {
  const post = getAPost(slug)
  return post
}

/**
 * Fetch footer data with caching
 * This data changes infrequently, so we can cache it for longer periods
 */
export async function getFooter() {
  const footer = await fetchFooter('home')
  const footerBlock = getBlockByType(footer?.blocks, "Footer")
  
  return footerBlock
}

/**
 * Fetch page data with caching
 * @param slug - The page slug to fetch
 */
export async function fetchPagefromAPI(slug: string) {
  const pageBlocks = await fetchPage('jaalyantra.com', slug)
  return pageBlocks
}

/**
 * Helper function to fetch both page and footer data in parallel
 * This prevents waterfall requests and enables data sharing
 * @param slug - The page slug to fetch
 */
export async function fetchPageAndFooter(slug: string) {
  const [pageData, footerData] = await Promise.all([
    fetchPagefromAPI(slug),
    getFooter()
  ])
  
  return {
    page: pageData,
    footer: footerData
  }
}
  