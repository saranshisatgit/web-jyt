# Content Page Quick Start Guide

## TL;DR

Create content pages (privacy policy, terms, etc.) in 2 ways:

### Option 1: CMS-Driven (Recommended)
1. Create page in CMS with slug `my-page`
2. Add `Header` and `MainContent` blocks
3. Access at `/content/my-page`

### Option 2: Hardcoded
1. Create `app/my-page/page.tsx`
2. Use `SimpleMainContent` component
3. Access at `/my-page`

## Quick Examples

### Example 1: CMS Block Structure
```json
{
  "slug": "privacy-policy",
  "blocks": [
    {
      "name": "Header",
      "content": {
        "title": "Privacy Policy",
        "subtitle": "How we protect your data"
      }
    },
    {
      "name": "MainContent",
      "content": {
        "content_type": "html",
        "content": "<h2>Section</h2><p>Content here...</p>",
        "max_width": "medium"
      }
    }
  ]
}
```

### Example 2: Hardcoded Page
```tsx
// app/terms/page.tsx
import { GradientBackground } from '@/components/gradient'
import { HeroSection } from '@/components/hero-section'
import { SimpleMainContent } from '@/components/main-content'

export default function TermsPage() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <HeroSection 
        headerBlock={{
          content: {
            title: "Terms of Service",
            subtitle: "Please read carefully",
            announcement: "",
            buttons: []
          }
        }}
        announcementBlock={{ content: { announcement: "" } }}
      />
      <SimpleMainContent 
        html="<h2>Terms</h2><p>Content...</p>" 
        maxWidth="medium" 
      />
    </main>
  )
}
```

## Component API

### MainContent
```tsx
<MainContent 
  block={{
    content: {
      content_type: 'html' | 'text',
      content: string,
      max_width: 'narrow' | 'medium' | 'wide' | 'full'
    }
  }}
  className?: string
/>
```

### SimpleMainContent
```tsx
<SimpleMainContent 
  html={string}
  maxWidth={'narrow' | 'medium' | 'wide' | 'full'}
  className?: string
/>
```

## Max Width Guide
- `narrow` (672px): Long-form reading
- `medium` (768px): Default, balanced
- `wide` (1024px): Wider content
- `full`: Full container width

## What You Get Automatically
✅ Navbar with navigation links  
✅ Responsive header with gradient  
✅ Footer with CTA and sitemap  
✅ Beautiful typography (prose)  
✅ Mobile-responsive design  
✅ SEO metadata  
✅ Error handling  

## HTML Content Tips

### Good Structure
```html
<h2>Main Heading</h2>
<p>Introduction paragraph.</p>

<h3>Subsection</h3>
<ul>
  <li>Point one</li>
  <li>Point two</li>
</ul>

<p>More content with <strong>emphasis</strong>.</p>
```

### Supported Elements
- Headings: `h2`, `h3`, `h4`, `h5`, `h6`
- Text: `p`, `strong`, `em`, `code`
- Lists: `ul`, `ol`, `li`
- Links: `a`
- Quotes: `blockquote`
- Tables: `table`, `thead`, `tbody`, `tr`, `td`, `th`

## Common Pages to Create

| Page | Slug | URL |
|------|------|-----|
| Privacy Policy | `privacy-policy` | `/content/privacy-policy` |
| Terms of Service | `terms-of-service` | `/content/terms-of-service` |
| Cookie Policy | `cookie-policy` | `/content/cookie-policy` |
| Shipping Policy | `shipping-policy` | `/content/shipping-policy` |
| Return Policy | `return-policy` | `/content/return-policy` |
| FAQ | `faq` | `/content/faq` |

## Troubleshooting

### Page Not Found
- Check slug matches exactly
- Verify page exists in CMS
- Check `Header` and `MainContent` blocks exist

### Content Not Displaying
- Verify `content` field has HTML
- Check `content_type` is set to `"html"`
- Inspect browser console for errors

### Styling Issues
- Ensure HTML is valid
- Check prose classes are applied
- Verify no conflicting CSS

## Need Help?

1. Check `docs/CONTENT_PAGE_USAGE.md` for detailed guide
2. See `app/privacy-policy/page.tsx` for example
3. Review `docs/CONTENT_PAGE_ARCHITECTURE.md` for architecture details

## Quick Checklist

Creating a new content page:

- [ ] Decide: CMS-driven or hardcoded?
- [ ] Create page with appropriate slug
- [ ] Add Header block with title/subtitle
- [ ] Add MainContent block with HTML
- [ ] Test page at correct URL
- [ ] Verify responsive design
- [ ] Check navigation works
- [ ] Update sitemap if needed
- [ ] Add to footer links if appropriate

Done! 🎉
