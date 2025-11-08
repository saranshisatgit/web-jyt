import { type Metadata } from 'next'
import { GradientBackground } from '@/components/gradient'
import { HeroSection, type HeaderBlock, type AnnouncementBlock } from '@/components/hero-section'
import { SimpleMainContent } from '@/components/main-content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Jaal Yantra Textiles collects, uses, and protects your personal information.',
}

/**
 * Privacy Policy Page
 * 
 * This is an example implementation of a content page using the
 * SimpleMainContent component with hardcoded content.
 * 
 * For CMS-driven content, use the /content/[slug] route instead.
 */
export default function PrivacyPolicyPage() {
  // Header configuration
  const heroHeaderBlock: HeaderBlock = {
    content: {
      title: 'Privacy Policy',
      subtitle: 'How we collect, use, and protect your personal information',
      announcement: '',
      buttons: [],
    },
  }

  const heroAnnouncementBlock: AnnouncementBlock = {
    content: {
      announcement: '',
    },
  }

  // HTML content for the privacy policy
  const privacyPolicyContent = `
    <h3>Introduction</h3>
    <p>
      At Jaal Yantra Textiles, we are committed to protecting your privacy and ensuring the security 
      of your personal information. This Privacy Policy explains how we collect, use, disclose, and 
      safeguard your information when you visit our website or use our services.
    </p>
    <p>
      Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
      policy, please do not access the site or use our services.
    </p>

    <h2>Information We Collect</h2>
    <p>We collect information that you provide directly to us, including:</p>
    <ul>
      <li><strong>Personal Information:</strong> Name, email address, phone number, and mailing address</li>
      <li><strong>Business Information:</strong> Company name, industry, and business requirements</li>
      <li><strong>Account Information:</strong> Username, password, and preferences</li>
      <li><strong>Communication Data:</strong> Messages, inquiries, and feedback you send to us</li>
      <li><strong>Transaction Information:</strong> Order details, payment information, and shipping data</li>
    </ul>

    <h3>Automatically Collected Information</h3>
    <p>When you visit our website, we automatically collect certain information about your device, including:</p>
    <ul>
      <li>IP address and browser type</li>
      <li>Operating system and device information</li>
      <li>Pages visited and time spent on pages</li>
      <li>Referring website and search terms</li>
      <li>Cookies and similar tracking technologies</li>
    </ul>

    <h2>How We Use Your Information</h2>
    <p>We use the information we collect for various purposes, including:</p>
    <ol>
      <li><strong>Service Delivery:</strong> To process orders, fulfill requests, and provide customer support</li>
      <li><strong>Communication:</strong> To send you updates, newsletters, and promotional materials</li>
      <li><strong>Personalization:</strong> To customize your experience and recommend relevant products</li>
      <li><strong>Analytics:</strong> To understand how our website is used and improve our services</li>
      <li><strong>Security:</strong> To protect against fraud, unauthorized access, and other security issues</li>
      <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
    </ol>

    <h2>Information Sharing and Disclosure</h2>
    <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:</p>

    <h3>Service Providers</h3>
    <p>
      We may share your information with third-party service providers who perform services on our behalf, 
      such as payment processing, shipping, email delivery, and analytics. These providers are contractually 
      obligated to protect your information and use it only for the purposes we specify.
    </p>

    <h3>Business Transfers</h3>
    <p>
      If we are involved in a merger, acquisition, or sale of assets, your information may be transferred 
      as part of that transaction. We will notify you of any such change and the choices you may have.
    </p>

    <h3>Legal Requirements</h3>
    <p>
      We may disclose your information if required by law, court order, or governmental regulation, or if 
      we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
    </p>

    <h2>Data Security</h2>
    <p>
      We implement appropriate technical and organizational measures to protect your personal information 
      against unauthorized access, alteration, disclosure, or destruction. These measures include:
    </p>
    <ul>
      <li>Encryption of data in transit and at rest</li>
      <li>Regular security assessments and audits</li>
      <li>Access controls and authentication mechanisms</li>
      <li>Employee training on data protection</li>
      <li>Incident response and breach notification procedures</li>
    </ul>
    <p>
      However, no method of transmission over the internet or electronic storage is 100% secure. While we 
      strive to protect your information, we cannot guarantee absolute security.
    </p>

    <h2>Your Rights and Choices</h2>
    <p>You have certain rights regarding your personal information:</p>

    <h3>Access and Correction</h3>
    <p>
      You have the right to access, update, or correct your personal information. You can do this by 
      logging into your account or contacting us directly.
    </p>

    <h3>Data Deletion</h3>
    <p>
      You may request that we delete your personal information, subject to certain legal obligations 
      that may require us to retain certain data.
    </p>

    <h3>Marketing Communications</h3>
    <p>
      You can opt out of receiving promotional emails by clicking the unsubscribe link in any email 
      or by contacting us. Note that you may still receive transactional emails related to your orders 
      or account.
    </p>

    <h3>Cookies and Tracking</h3>
    <p>
      You can control cookies through your browser settings. However, disabling cookies may affect 
      your ability to use certain features of our website.
    </p>

    <h2>Children's Privacy</h2>
    <p>
      Our services are not intended for children under the age of 13. We do not knowingly collect 
      personal information from children. If we become aware that we have collected information from 
      a child under 13, we will take steps to delete that information.
    </p>

    <h2>International Data Transfers</h2>
    <p>
      Your information may be transferred to and processed in countries other than your country of 
      residence. These countries may have data protection laws that differ from those in your country. 
      We ensure appropriate safeguards are in place to protect your information in accordance with 
      this privacy policy.
    </p>

    <h2>Changes to This Privacy Policy</h2>
    <p>
      We may update this privacy policy from time to time to reflect changes in our practices or legal 
      requirements. We will notify you of any material changes by posting the new policy on our website 
      and updating the "Last Updated" date.
    </p>
    <p>
      We encourage you to review this privacy policy periodically to stay informed about how we protect 
      your information.
    </p>

    <h2>Contact Us</h2>
    <p>
      If you have questions, concerns, or requests regarding this privacy policy or our data practices, 
      please contact us:
    </p>
    <ul>
      <li><strong>Email:</strong> privacy@jaalyantra.com</li>
      <li><strong>Address:</strong> Kotwali Bazaar Road, Dharamshala, HP 176215, INDIA</li>
    </ul>

    <p className="text-sm text-gray-500 mt-8">
      <strong>Last Updated:</strong> January 2025
    </p>
  `

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      
      {/* Hero Section with Navbar */}
      <HeroSection 
        headerBlock={heroHeaderBlock} 
        announcementBlock={heroAnnouncementBlock} 
      />

      {/* Main Content */}
      <SimpleMainContent 
        html={privacyPolicyContent} 
        maxWidth="medium" 
      />
    </main>
  )
}
