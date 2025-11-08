# Content Page Usage Guide

## Overview
This guide explains how to use the new content page system for displaying textual content like privacy policies, terms of service, and other static pages.

## Components Created

### 1. MainContent Component
**Location**: `components/main-content.tsx`

**Purpose**: Reusable component for rendering textual content with beautiful typography.

**Features**:
- HTML content rendering
- Configurable max-width
- Prose styling for typography
- Responsive design

### 2. Generic Content Page
**Location**: `app/content/[slug]/page.tsx`

**Purpose**: Dynamic route for any content page.

**Features**:
- Fetches data from CMS by slug
- Consistent header/footer design
- Error handling
- SEO metadata generation

## How to Use

### Method 1: Using the Generic Content Route (Recommended)

#### Step 1: Create Content in CMS
Create a new page in your CMS with the following structure:

**Page Slug**: `privacy-policy` (or any slug you want)

**Required Blocks**:

1. **Header Block**:
```json
{
  "name": "Header",
  "type": "Header",
  "content": {
    "title": "Privacy Policy",
    "subtitle": "How we handle your data and protect your privacy",
    "announcement": ""
  }
}
```

2. **MainContent Block**:
```json
{
  "name": "MainContent",
  "type": "MainContent",
  "content": {
    "content_type": "html",
    "content": "<h2>Introduction</h2><p>Your privacy is important to us...</p>",
    "max_width": "medium",
    "show_toc": false
  }
}
```

#### Step 2: Access the Page
The page will be automatically available at:
```
https://yoursite.com/content/privacy-policy
```

### Method 2: Create a Custom Page

If you need more control, create a custom page:

```tsx
// app/privacy-policy/page.tsx
import { GradientBackground } from '@/components/gradient'
import { HeroSection } from '@/components/hero-section'
import { SimpleMainContent } from '@/components/main-content'

export default function PrivacyPolicyPage() {
  const htmlContent = `
    <h2>Introduction</h2>
    <p>Your privacy is important to us...</p>
    
    <h2>Information We Collect</h2>
    <p>We collect the following information...</p>
    
    <h2>How We Use Your Information</h2>
    <p>We use your information to...</p>
  `

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <HeroSection 
        headerBlock={{
          content: {
            title: "Privacy Policy",
            subtitle: "How we handle your data",
            announcement: "",
            buttons: []
          }
        }}
        announcementBlock={{
          content: { announcement: "" }
        }}
      />
      <SimpleMainContent html={htmlContent} maxWidth="medium" />
    </main>
  )
}
```

## Content Block Configuration

### content_type Options
- `"html"`: Renders HTML content (default)
- `"text"`: Renders plain text with preserved whitespace
- `"markdown"`: (Future) Will support Markdown rendering

### max_width Options
- `"narrow"`: max-w-2xl (672px) - Best for long-form reading
- `"medium"`: max-w-3xl (768px) - Default, good balance
- `"wide"`: max-w-5xl (1024px) - For wider content
- `"full"`: max-w-none - Full container width

### Example Content Structures

#### Simple Privacy Policy
```json
{
  "content_type": "html",
  "content": "<h2>Privacy Policy</h2><p>Content here...</p>",
  "max_width": "medium"
}
```

#### Terms of Service with Wide Layout
```json
{
  "content_type": "html",
  "content": "<h2>Terms of Service</h2><p>Content here...</p>",
  "max_width": "wide"
}
```

#### Plain Text Content
```json
{
  "content_type": "text",
  "content": "This is plain text content\nWith line breaks preserved",
  "max_width": "narrow"
}
```

## Design Elements Inherited

The content pages automatically inherit:

### 1. Header/Navigation
- **Navbar**: Fetches navigation from home page
- **Logo**: Links to homepage
- **Mobile menu**: Responsive navigation
- **Announcement banner**: Optional banner slot

### 2. Hero Section
- **Gradient background**: Visual consistency
- **Large title**: From Header block
- **Subtitle**: From Header block
- **Responsive typography**: Scales on different screens

### 3. Footer
- **Call-to-action**: From footer block
- **Sitemap**: Multiple columns
- **Social links**: Facebook, Twitter, LinkedIn
- **Copyright**: Automatic year update

### 4. Typography (Prose Styling)
The content uses Tailwind's prose classes:
- Automatic heading hierarchy
- Proper paragraph spacing
- List styling (ordered and unordered)
- Link styling
- Blockquote styling
- Code block styling

## Styling Customization

### Override Prose Styles
```tsx
<MainContent 
  block={contentBlock} 
  className="prose-headings:text-pink-600 prose-a:text-blue-600"
/>
```

### Custom Container Padding
```tsx
<Container className="py-24 sm:py-32">
  <MainContent block={contentBlock} />
</Container>
```

## Example Pages You Can Create

### 1. Privacy Policy
**URL**: `/content/privacy-policy`
**Slug**: `privacy-policy`
**Content**: Legal privacy information

### 2. Terms of Service
**URL**: `/content/terms-of-service`
**Slug**: `terms-of-service`
**Content**: Terms and conditions

### 3. Cookie Policy
**URL**: `/content/cookie-policy`
**Slug**: `cookie-policy`
**Content**: Cookie usage information

### 4. Shipping Policy
**URL**: `/content/shipping-policy`
**Slug**: `shipping-policy`
**Content**: Shipping terms and conditions

### 5. Return Policy
**URL**: `/content/return-policy`
**Slug**: `return-policy`
**Content**: Return and refund information

### 6. About Our Process
**URL**: `/content/our-process`
**Slug**: `our-process`
**Content**: Detailed process description

### 7. Sustainability
**URL**: `/content/sustainability`
**Slug**: `sustainability`
**Content**: Sustainability practices

## HTML Content Guidelines

### Recommended HTML Structure
```html
<h2>Main Section Heading</h2>
<p>Introduction paragraph with <strong>important</strong> information.</p>

<h3>Subsection Heading</h3>
<p>More detailed information here.</p>

<ul>
  <li>List item one</li>
  <li>List item two</li>
  <li>List item three</li>
</ul>

<h3>Another Subsection</h3>
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<blockquote>
  <p>Important quote or note that stands out.</p>
</blockquote>

<p>For more information, visit our <a href="/contact">contact page</a>.</p>
```

### Supported HTML Elements
- Headings: `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`
- Paragraphs: `<p>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Text formatting: `<strong>`, `<em>`, `<code>`
- Links: `<a href="">`
- Blockquotes: `<blockquote>`
- Tables: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`, `<th>`
- Images: `<img src="" alt="">`

## SEO Considerations

### Metadata Generation
The page automatically generates metadata from the Header block:
- **Title**: From `header.content.title`
- **Description**: From `header.content.subtitle`

### Custom Metadata
For custom pages, add metadata export:
```tsx
export const metadata = {
  title: 'Privacy Policy - JYT',
  description: 'Our privacy policy and data handling practices',
  openGraph: {
    title: 'Privacy Policy',
    description: 'Our privacy policy and data handling practices',
  }
}
```

## Error Handling

The content page includes built-in error handling:

1. **Page Not Found**: Returns 404 if page doesn't exist in CMS
2. **Missing Content Block**: Shows "Content Not Found" message
3. **Loading Error**: Shows "Error Loading Page" message

## Best Practices

### 1. Content Organization
- Use clear heading hierarchy (h2 → h3 → h4)
- Keep paragraphs concise (3-5 sentences)
- Use lists for multiple items
- Add links to related pages

### 2. Accessibility
- Use semantic HTML elements
- Provide alt text for images
- Ensure sufficient color contrast
- Use descriptive link text

### 3. Performance
- Keep HTML content reasonably sized
- Optimize images before adding
- Use lazy loading for images if needed

### 4. Maintenance
- Store content in CMS for easy updates
- Use consistent formatting across pages
- Review and update content regularly

## Migration from Existing Pages

If you have existing static content pages, migrate them:

1. **Extract Content**: Copy HTML content from existing page
2. **Create CMS Entry**: Add new page with Header and MainContent blocks
3. **Test**: Verify page renders correctly at `/content/[slug]`
4. **Update Links**: Update navigation and internal links
5. **Redirect**: Set up redirects from old URLs if needed

## Future Enhancements

Planned features for content pages:

1. **Table of Contents**: Auto-generated TOC from headings
2. **Markdown Support**: Direct Markdown rendering
3. **Search Integration**: Full-text search within content
4. **Print Styles**: Optimized print layout
5. **PDF Export**: Download content as PDF
6. **Last Updated**: Show last modification date
7. **Reading Time**: Estimated reading time
8. **Related Pages**: Suggest related content

## Support

For questions or issues:
- Check existing pages for examples
- Review component documentation
- Contact development team
