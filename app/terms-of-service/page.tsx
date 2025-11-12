import { type Metadata } from 'next'
import { GradientBackground } from '@/components/gradient'
import { HeroSection, type HeaderBlock, type AnnouncementBlock } from '@/components/hero-section'
import { SimpleMainContent } from '@/components/main-content'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and conditions for using Jaal Yantra Textiles services and website.',
}

/**
 * Terms and Conditions Page
 * 
 * This page outlines the terms and conditions for using the Jaal Yantra Textiles
 * website and services.
 */
export default function TermsOfServicePage() {
  // Header configuration
  const heroHeaderBlock: HeaderBlock = {
    content: {
      title: 'Terms and Conditions',
      subtitle: 'Please read these terms carefully before using our services',
      announcement: '',
      buttons: [],
    },
  }

  const heroAnnouncementBlock: AnnouncementBlock = {
    content: {
      announcement: '',
    },
  }

  // HTML content for the terms and conditions
  const termsContent = `
    <h2>Introduction</h2>
    <p>
      Welcome to Jaal Yantra Textiles. These Terms and Conditions govern your use of our website 
      and services. By accessing or using our website, you agree to be bound by these terms. If you 
      do not agree with any part of these terms, please do not use our website or services.
    </p>

    <h2>Applicable Law</h2>
    <p>
      These Terms and Conditions are governed by and construed in accordance with the laws of the 
      jurisdiction from which you are accessing this website. Your use of this website and any 
      disputes arising from it are subject to the laws applicable in your location.
    </p>
    <p>
      By using our website, you consent to the jurisdiction and venue of the courts in your 
      location for any disputes that may arise from your use of our services.
    </p>

    <h2>Reporting Content</h2>
    <p>
      If you believe that any content on our website violates your rights, infringes on intellectual 
      property, or is otherwise inappropriate, please report it to us immediately. We take all 
      reports seriously and will investigate them promptly.
    </p>
    <p>
      To report content, please send an email to: <strong>report@jaalyantra.com</strong>
    </p>
    <p>
      Please include the following information in your report:
    </p>
    <ul>
      <li>A detailed description of the content in question</li>
      <li>The URL or location of the content on our website</li>
      <li>Your contact information</li>
      <li>The reason for your report</li>
      <li>Any supporting documentation or evidence</li>
    </ul>

    <h2>Intellectual Property Rights</h2>
    <p>
      All content, materials, designs, images, text, graphics, logos, and other intellectual property 
      displayed on this website are the exclusive property of Jaal Yantra Textiles Pvt. Ltd. or our 
      licensors. This includes but is not limited to:
    </p>
    <ul>
      <li>Textile designs and patterns</li>
      <li>Product photographs and images</li>
      <li>Website design and layout</li>
      <li>Written content and descriptions</li>
      <li>Trademarks, service marks, and logos</li>
      <li>Software and code</li>
    </ul>

    <h3>Ownership and Rights</h3>
    <p>
      We reserve all rights to our intellectual property. You may not copy, reproduce, distribute, 
      modify, create derivative works from, publicly display, or otherwise use any of our content 
      without our prior written permission.
    </p>

    <h2>Data Ownership and Storage</h2>
    <p>
      All data collected, stored, and processed through our website and services belongs to Jaal 
      Yantra Textiles Pvt. Ltd. This includes:
    </p>
    <ul>
      <li>User account information</li>
      <li>Order and transaction data</li>
      <li>Communication records</li>
      <li>Usage analytics and behavior data</li>
      <li>Any content you submit or upload</li>
    </ul>

    <h3>Data Usage Rights</h3>
    <p>
      We reserve the right to use, analyze, and process all data collected through our services for 
      the following purposes:
    </p>
    <ul>
      <li>Improving our products and services</li>
      <li>Analyzing user behavior and preferences</li>
      <li>Marketing and promotional activities</li>
      <li>Business analytics and reporting</li>
      <li>Compliance with legal obligations</li>
    </ul>

    <h2>User Responsibilities</h2>
    <p>
      When using our website and services, you agree to:
    </p>
    <ul>
      <li>Provide accurate and truthful information</li>
      <li>Maintain the security of your account credentials</li>
      <li>Not engage in any fraudulent or illegal activities</li>
      <li>Not attempt to gain unauthorized access to our systems</li>
      <li>Not use our services to harm others or violate their rights</li>
      <li>Comply with all applicable laws and regulations</li>
    </ul>

    <h2>Prohibited Activities</h2>
    <p>
      You are expressly prohibited from:
    </p>
    <ul>
      <li>Copying, reproducing, or distributing our content without permission</li>
      <li>Using our website for any unlawful purpose</li>
      <li>Attempting to reverse engineer or decompile our software</li>
      <li>Interfering with or disrupting our services</li>
      <li>Collecting user data without authorization</li>
      <li>Impersonating another person or entity</li>
      <li>Uploading malicious code or viruses</li>
    </ul>

    <h2>Product Information and Orders</h2>
    <p>
      We strive to provide accurate product descriptions, images, and pricing. However, we do not 
      warrant that product descriptions, images, or other content are accurate, complete, or 
      error-free.
    </p>
    <p>
      We reserve the right to:
    </p>
    <ul>
      <li>Modify or discontinue products without notice</li>
      <li>Limit quantities available for purchase</li>
      <li>Refuse or cancel orders at our discretion</li>
      <li>Correct pricing errors</li>
      <li>Update product information as needed</li>
    </ul>

    <h2>Limitation of Liability</h2>
    <p>
      To the fullest extent permitted by law, Jaal Yantra Textiles Pvt. Ltd. shall not be liable for:
    </p>
    <ul>
      <li>Any indirect, incidental, special, or consequential damages</li>
      <li>Loss of profits, revenue, or business opportunities</li>
      <li>Loss of data or information</li>
      <li>Interruption of service or access to our website</li>
      <li>Errors or omissions in content</li>
    </ul>
    <p>
      Our total liability to you for any claims arising from your use of our services shall not 
      exceed the amount you paid to us in the twelve months preceding the claim.
    </p>

    <h2>Indemnification</h2>
    <p>
      You agree to indemnify, defend, and hold harmless Jaal Yantra Textiles Pvt. Ltd., its officers, 
      directors, employees, and agents from any claims, damages, losses, liabilities, and expenses 
      (including legal fees) arising from:
    </p>
    <ul>
      <li>Your use of our website or services</li>
      <li>Your violation of these Terms and Conditions</li>
      <li>Your violation of any rights of another party</li>
      <li>Your breach of any applicable laws or regulations</li>
    </ul>

    <h2>Third-Party Links and Services</h2>
    <p>
      Our website may contain links to third-party websites or services. We are not responsible for 
      the content, privacy practices, or terms of service of these third-party sites. Your use of 
      third-party websites is at your own risk.
    </p>

    <h2>Modifications to Terms</h2>
    <p>
      We reserve the right to modify these Terms and Conditions at any time without prior notice. 
      Changes will be effective immediately upon posting to our website. Your continued use of our 
      services after any modifications constitutes your acceptance of the updated terms.
    </p>
    <p>
      We encourage you to review these Terms and Conditions periodically to stay informed of any 
      changes.
    </p>

    <h2>Account Termination</h2>
    <p>
      We reserve the right to suspend or terminate your account and access to our services at any 
      time, with or without cause, and with or without notice. Reasons for termination may include:
    </p>
    <ul>
      <li>Violation of these Terms and Conditions</li>
      <li>Fraudulent or illegal activity</li>
      <li>Abuse of our services or staff</li>
      <li>Non-payment of fees</li>
      <li>Inactivity for an extended period</li>
    </ul>

    <h2>Dispute Resolution</h2>
    <p>
      In the event of any dispute arising from these Terms and Conditions or your use of our services, 
      we encourage you to contact us first to seek an amicable resolution. If we cannot resolve the 
      dispute informally, it shall be resolved through binding arbitration or in the courts of the 
      jurisdiction applicable to your location.
    </p>

    <h2>Severability</h2>
    <p>
      If any provision of these Terms and Conditions is found to be invalid, illegal, or unenforceable, 
      the remaining provisions shall continue in full force and effect. The invalid provision shall be 
      modified to the minimum extent necessary to make it valid and enforceable.
    </p>

    <h2>Entire Agreement</h2>
    <p>
      These Terms and Conditions, together with our Privacy Policy and any other legal notices 
      published on our website, constitute the entire agreement between you and Jaal Yantra Textiles 
      Pvt. Ltd. regarding your use of our services.
    </p>

    <h2>Contact Information</h2>
    <p>
      If you have any questions, concerns, or feedback regarding these Terms and Conditions, please 
      contact us:
    </p>
    <ul>
      <li><strong>General Inquiries:</strong> info@jaalyantra.com</li>
      <li><strong>Content Reports:</strong> report@jaalyantra.com</li>
      <li><strong>Legal Matters:</strong> legal@jaalyantra.com</li>
      <li><strong>Address:</strong> Kotwali Bazaar Road, Dharamshala, HP 176215, INDIA</li>
    </ul>

    <h2>Acceptance of Terms</h2>
    <p>
      By using our website and services, you acknowledge that you have read, understood, and agree 
      to be bound by these Terms and Conditions. If you do not agree with these terms, you must 
      immediately cease using our website and services.
    </p>

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
        html={termsContent} 
        maxWidth="medium" 
      />
    </main>
  )
}
