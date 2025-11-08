# Content Page Architecture Analysis

## Overview
This document analyzes the existing page structure in the JYT web application to create a reusable content page template for displaying textual content like privacy policies, terms of service, etc.

## Common Design Elements

### 1. Header/Hero Section
**Component**: `HeroSection` from `@/components/hero-section`
**Used in**: Home, Contact, About pages

**Structure**:
```tsx
<HeroSection 
  headerBlock={{
    content: {
      title: string,
      subtitle: string,
      announcement: string,
      buttons: ButtonDef[]
    }
  }}
  announcementBlock={{
    content: {
      announcement: string
    }
  }}
/>
```

**Features**:
- Includes Navbar with navigation links
- Gradient background
- Large title and subtitle
- Optional announcement banner
- Optional CTA buttons
- Responsive design

### 2. Navbar
**Component**: `Navbar` from `@/components/navbar`
**Included in**: HeroSection

**Features**:
- Fetches navigation links from CMS (home page Header block)
- Desktop and mobile responsive navigation
- Logo with home link
- Optional banner slot for announcements

### 3. Footer
**Component**: `Footer` from `@/components/footer`
**Included in**: Root layout (app/layout.tsx)

**Features**:
- Call-to-action section
- Sitemap with multiple columns
- Social media links
- Copyright information
- Gradient background

### 4. Layout Wrapper
**Component**: `Container` from `@/components/container`
**Used in**: All pages

**Purpose**: Provides consistent max-width and padding

### 5. Background
**Component**: `GradientBackground` from `@/components/gradient`
**Used in**: Most pages

**Purpose**: Provides visual consistency with gradient effects

## Page Patterns Analysis

### Home Page Pattern
```tsx
- GradientBackground
- HeroSection (includes Navbar)
- Multiple content sections (Features, Bento, Testimonials, etc.)
- Footer (from layout)
```

### About Page Pattern
```tsx
- GradientBackground
- Container > Navbar
- Header section with title, subtitle, mission
- Team section
- Investors section
- Careers section
- Footer (from layout)
```

### Contact Page Pattern
```tsx
- GradientBackground
- HeroSection (includes Navbar)
- Container with two-column grid:
  - Left: Contact information (prose styling)
  - Right: Contact form
- Footer (from layout)
```

### Pricing Page Pattern
```tsx
- GradientBackground
- Container > Navbar
- Header section
- Pricing cards
- Pricing table
- Testimonial
- FAQ section
- Footer (from layout)
```

## Block-Based Content System

### Current Block Types
1. **Hero Block**: Title, subtitle, announcement, buttons
2. **Header Block**: Navigation links, announcement
3. **Feature Section Block**: Title, subtitle, screenshot/slides
4. **Bento Section Block**: Title, subtitle, cards array
5. **Dark Bento Section Block**: Similar to Bento but dark theme
6. **Logo Section Block**: Array of logo objects
7. **Testimonials Block**: Testimonials data
8. **Team Block**: Team members, story, CTA
9. **Investors Block**: Investor groups, testimonial
10. **Careers Block**: Perks, open positions, CTA
11. **Contact Info Block**: Contact details, links
12. **Footer Block**: CTA, sitemap data

### Block Fetching Pattern
```tsx
// Server-side data fetching
const pageData = await fetchPagefromAPI('slug')
const specificBlock = getBlockByName(pageData.blocks, "BlockName")
```

## Content Display Components

### Text Components
- `Heading`: Main headings with size variants
- `Subheading`: Section subheadings
- `Lead`: Lead paragraphs with larger text
- From `@/components/text`

### Prose Styling
Used in Contact page for rich text content:
```tsx
<div className="prose prose-lg max-w-none lg:prose-xl">
  {/* Content */}
</div>
```

### Main Content Rendering
For blog posts, uses `PostMainContentArea`:
- Handles TipTap JSON content
- Renders HTML with proper styling
- Supports images, drawers, and rich formatting
- Uses `prose` classes for typography

## Recommended Content Page Architecture

### For Simple Text Content (Privacy Policy, Terms, etc.)

**Structure**:
1. **GradientBackground**: Visual consistency
2. **HeroSection**: Title, subtitle, no buttons
3. **Container**: Main content wrapper
4. **Content Block**: 
   - Option A: Simple HTML/Markdown rendering with prose styling
   - Option B: Block-based content from CMS
5. **Footer**: Automatic from layout

**Content Block Options**:

#### Option 1: Simple HTML Content
```tsx
interface ContentBlock {
  content: {
    html: string; // Raw HTML content
  }
}
```

#### Option 2: Structured Sections
```tsx
interface ContentBlock {
  content: {
    sections: Array<{
      heading?: string;
      content: string; // HTML or plain text
      order: number;
    }>
  }
}
```

#### Option 3: TipTap JSON (Rich Content)
```tsx
interface ContentBlock {
  content: {
    tiptap_json: TipTapJsonStructure; // Same as blog posts
  }
}
```

## Proposed Implementation

### 1. Create Generic Content Page Component
**File**: `app/content/[slug]/page.tsx`

**Features**:
- Dynamic routing for any content page
- Fetches page data by slug
- Renders header from CMS
- Renders main content block
- Supports multiple content formats

### 2. Create MainContent Component
**File**: `components/main-content.tsx`

**Purpose**: Reusable component for displaying textual content
**Features**:
- Accepts HTML, Markdown, or TipTap JSON
- Applies prose styling
- Handles images and formatting
- Responsive design

### 3. CMS Block Structure
**Block Name**: "MainContent" or "ContentSection"
**Fields**:
- `content_type`: "html" | "markdown" | "tiptap"
- `content`: The actual content
- `max_width`: Optional max-width class
- `show_toc`: Boolean for table of contents

## Styling Guidelines

### Typography Classes
```tsx
// For main content
className="prose prose-gray prose-lg max-w-none lg:prose-xl"

// For headings
className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"

// For body text
className="text-base leading-7 text-gray-600"
```

### Container Classes
```tsx
// Standard container
<Container className="py-16 sm:py-24">

// Narrower content
<div className="max-w-3xl mx-auto">
```

### Spacing
- Section spacing: `mt-32 sm:mt-40`
- Content spacing: `py-16 sm:py-24`
- Element spacing: `mt-6`, `mt-8`, `mt-12`

## Data Fetching Pattern

### Server Component Pattern
```tsx
export default async function ContentPage({ params }: { params: { slug: string } }) {
  const pageData = await fetchPagefromAPI(params.slug)
  const headerBlock = getBlockByName(pageData.blocks, "Header")
  const contentBlock = getBlockByName(pageData.blocks, "MainContent")
  
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <HeroSection headerBlock={headerBlock} />
      <Container className="py-16 sm:py-24">
        <MainContent content={contentBlock} />
      </Container>
    </main>
  )
}
```

## Summary

The JYT web application follows a consistent pattern:
1. **GradientBackground** for visual consistency
2. **HeroSection** with Navbar for header
3. **Container** for content sections
4. **Block-based CMS** for dynamic content
5. **Footer** from root layout

For content pages, we can create a simple, reusable template that:
- Uses the same header/footer structure
- Accepts a "MainContent" block from CMS
- Renders content with proper prose styling
- Supports multiple content formats (HTML, Markdown, TipTap)
- Maintains design consistency with existing pages
