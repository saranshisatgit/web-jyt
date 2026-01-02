'use server'

import { getAllBlogs, getCategories, getAPost, fetchPage } from "@/medu/queries"
import { headers } from "next/headers"
import { getSiteData } from "./site-data"

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
  const siteData = await getSiteData()
  return siteData.footerBlock
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
  const [pageData, siteData] = await Promise.all([
    fetchPagefromAPI(slug),
    getSiteData(),
  ])

  return {
    page: pageData,
    footer: siteData.footerBlock,
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

  if (!name || !email || !message) {
    return { success: false, message: 'Name, Email, and Message are required.' };
  }

  const apiBase =
    (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
      'http://localhost:9000/web') ?? 'http://localhost:9000/web';
  const formDomain =
    process.env.NEXT_PUBLIC_CONTACT_FORM_DOMAIN ||
    process.env.CONTACT_FORM_DOMAIN ||
    'jaalyantra.com';
  const formHandle =
    process.env.NEXT_PUBLIC_CONTACT_FORM_HANDLE ||
    process.env.CONTACT_FORM_HANDLE ||
    'contact';

  if (!formDomain || !formHandle) {
    return {
      success: false,
      message: 'Contact form configuration is missing. Please contact support.',
    };
  }

  const endpoint = `${apiBase}/website/${formDomain}/forms/${formHandle}`;
  const hdrs = headers();
  const referer = (await hdrs).get('referer') || undefined;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        email,
        data: {
          name,
          company: company || '',
          role: role || '',
          message,
        },
        page_url: referer,
        metadata: {
          source: 'contact-page',
        },
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null);
      const errorMessage =
        errorPayload?.message ||
        errorPayload?.error ||
        'Something went wrong while submitting the form.';

      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    };
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return {
      success: false,
      message: 'Unable to submit the form right now. Please try again later.',
    };
  }
}