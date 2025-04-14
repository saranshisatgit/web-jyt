'use server'

import { getAllBlogs, getCategories , getAPost, getBlockByType, fetchFooter, fetchPage} from "@/medu/queries"
 
export async function fetchAllBlogs() {
  const blogs = getAllBlogs('jaalyantra.com', '')
  return blogs
}

export async function getAllCategories() {
  const cats = getCategories()
  return cats
}

export async function getSinglePost(slug: string) {
  const post = getAPost(slug)
  return post
}

export async function getFooter() {
  const footer = await fetchFooter('home')
  const footerBlock = getBlockByType(footer?.blocks, "Footer");
  return footerBlock
}

export async function fetchPagefromAPI(slug: string) {
  const pageBlocks = await fetchPage('jaalyantra.com', slug)
  return pageBlocks
}
  