import { PlusGrid, PlusGridItem, PlusGridRow } from '@/components/plus-grid'
import { Button } from './button'
import { Container } from './container'
import { Link } from './link'
import { Logo } from './logo'
import { Subheading, Text } from './text'

function CallToAction({
  subheading,
  content,
  actionline,
  button
}: { subheading: string; content: string; actionline: string; button: string }) {
  const [beforeQuestion, afterQuestion] = content.split('?');
  return (
    <div className="relative pt-20 pb-16 text-center sm:py-24">
      <hgroup>
        <Subheading>{subheading}</Subheading>
        <p className="mt-6 font-display text-3xl font-medium tracking-tight text-olive-950 sm:text-5xl dark:text-white">
          {beforeQuestion}?
          <br />
          {afterQuestion}
        </p>
      </hgroup>
      <Text size="md" className="mx-auto mt-6 max-w-xs text-pretty">
        {actionline}
      </Text>
      <div className="mt-6">
        <Button className="w-full sm:w-auto" href="#">
          {button}
        </Button>
      </div>
    </div>
  )
}

function SitemapHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm/6 font-medium text-olive-950/50 dark:text-white/50">{children}</h3>
}

function SitemapLinks({ children }: { children: React.ReactNode }) {
  return <ul className="mt-6 space-y-4 text-sm/6">{children}</ul>
}

function SitemapLink(props: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <li>
      <Link
        {...props}
        className="font-medium text-olive-950 hover:text-olive-950/75 dark:text-white dark:hover:text-white/75"
      />
    </li>
  )
}

function Sitemap() {
  return (
    <>
      <div>
        <SitemapHeading>Product</SitemapHeading>
        <SitemapLinks>
          <SitemapLink href="/pricing">Pricing</SitemapLink>
          <SitemapLink href="/analysis">Analysis</SitemapLink>
          <SitemapLink href="/api">API</SitemapLink>
        </SitemapLinks>
      </div>
      <div>
        <SitemapHeading>Company</SitemapHeading>
        <SitemapLinks>
          <SitemapLink href="/careers">Careers(Not yet hiring)</SitemapLink>
          <SitemapLink href="/blog">Blog</SitemapLink>
          <SitemapLink href="/about">About</SitemapLink>
          <SitemapLink href="/terms-of-service">Terms of service</SitemapLink>
          <SitemapLink href="/privacy-policy">Privacy policy</SitemapLink>
        </SitemapLinks>
      </div>
      <div>
        <SitemapHeading>Support</SitemapHeading>
        <SitemapLinks>
          <SitemapLink href="#">Help center</SitemapLink>
          <SitemapLink href="#">Community</SitemapLink>
        </SitemapLinks>
      </div>
    </>
  )
}

function SocialIconX(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M12.6 0h2.454l-5.36 6.778L16 16h-4.937l-3.867-5.594L2.771 16H.316l5.733-7.25L0 0h5.063l3.495 5.114L12.6 0zm-.86 14.376h1.36L4.323 1.539H2.865l8.875 12.837z" />
    </svg>
  )
}

function SocialIconFacebook(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 8.05C16 3.603 12.418 0 8 0S0 3.604 0 8.05c0 4.016 2.926 7.346 6.75 7.95v-5.624H4.718V8.05H6.75V6.276c0-2.017 1.194-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.62-1.304 1.257v1.51h2.219l-.355 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.95z"
      />
    </svg>
  )
}

function SocialIconLinkedIn(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.52-.106 1.377 1.377 0 01-.527.103l.007.003zm10.075 8.683h-2.375V9.921c0-.885-.015-2.025-1.234-2.025-1.218 0-1.425.966-1.425 1.968v3.775H6.233V5.997H8.51v1.05h.032c.317-.601 1.09-1.235 2.246-1.235 2.405-.005 2.851 1.578 2.851 3.63v4.197z" />
    </svg>
  )
}

function SocialIconInstagram(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 0C5.829 0 5.556.01 4.702.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.908 3.908 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.931 3.931 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
    </svg>
  )
}

function SocialLinks() {
  return (
    <>
      <Link
        href="https://facebook.com/cicilabelbyjyt"
        target="_blank"
        aria-label="Visit us on Facebook"
        className="text-olive-950 hover:text-olive-950/75 dark:text-white dark:hover:text-white/75"
      >
        <SocialIconFacebook className="size-4" />
      </Link>
      <Link
        href="https://x.com/cici_label"
        target="_blank"
        aria-label="Visit us on X"
        className="text-olive-950 hover:text-olive-950/75 dark:text-white dark:hover:text-white/75"
      >
        <SocialIconX className="size-4" />
      </Link>
      <Link
        href="https://instagram.com/cici_label"
        target="_blank"
        aria-label="Visit us on instagram"
        className="text-olive-950 hover:text-olive-950/75 dark:text-white dark:hover:text-white/75"
      >
        <SocialIconInstagram className="size-4" />
      </Link>
      <Link
        href="https://linkedin.com"
        target="_blank"
        aria-label="Visit us on LinkedIn"
        className="text-olive-950 hover:text-olive-950/75 dark:text-white dark:hover:text-white/75"
      >
        <SocialIconLinkedIn className="size-4" />
      </Link>
    </>
  )
}

function Copyright({ company }: { company: string }) {
  return (
    <div className="text-sm/6 text-olive-950 dark:text-white">
      &copy; {new Date().getFullYear()} {company}
    </div>
  )
}

interface FooterBlockCta {
  subheading: string
  content: string
  actionline: string
  button: string
}

export function Footer({ data }: { data: Record<string, unknown> }) {
  if (!data) return null
  const { subheading, content, actionline, button } = data.cta as FooterBlockCta
  
  return (
    <footer className="border-t border-olive-950/10 dark:border-white/10">
      <div className="relative">
        <div className="absolute inset-2 rounded-4xl bg-white/80 dark:bg-olive-900/30" />
        <Container>
          <CallToAction subheading={subheading} content={content} actionline={actionline} button={button} />
          <PlusGrid className="pb-16">
            <PlusGridRow>
              <div className="grid grid-cols-2 gap-y-10 pb-6 lg:grid-cols-6 lg:gap-8">
                <div className="col-span-2 flex lg:col-span-2">
                  <PlusGridItem className="pt-6 lg:pb-6">
                    <Logo className="h-9" />
                  </PlusGridItem>
                </div>
                <div className="col-span-2 lg:col-span-4 lg:col-start-3">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-3 lg:pt-6 lg:ml-auto lg:w-fit">
                    <Sitemap />
                  </div>
                </div>
              </div>
            </PlusGridRow>
            
            <PlusGridRow className="flex justify-between">
              <div>
                <PlusGridItem className="py-3">
                  <div className="flex items-center gap-x-2 text-sm text-olive-600 dark:text-olive-400">
                    <Copyright company={'Jaal Yantra Textiles Pvt. Ltd.'} />
                    <span>|</span>
                    <p>Was Part of Hatch Digital Ocean</p>
                  </div>
                </PlusGridItem>
              </div>
              <div className="flex">
                <PlusGridItem className="flex items-center gap-8 py-3">
                  <SocialLinks />
                </PlusGridItem>
              </div>
            </PlusGridRow>
          </PlusGrid>
        </Container>
      </div>
    </footer>
  )
}
