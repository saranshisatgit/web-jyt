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

export async function handleContactFormSubmission(
  prevState: { message: string; success: boolean; }, // Previous state
  formData: FormData // Form data
) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const company = formData.get('company') as string;
  const role = formData.get('role') as string;
  const message = formData.get('message') as string;

  console.log('Contact Form Submission:');
  console.log({ name, email, company, role, message });

  // Here you would typically:
  // 1. Validate the data
  // 2. Send an email, save to a database, or call an external API
  // For now, we'll just simulate a successful submission.

  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if required fields are present (basic validation)
  if (!name || !email || !message) {
    return { success: false, message: 'Name, Email, and Message are required.' };
  }

  // In a real application, you might want to redirect or return more specific success/error states.
  // For now, returning a simple object.
  return { success: true, message: 'Thank you for your message! We will get back to you soon.' };
}