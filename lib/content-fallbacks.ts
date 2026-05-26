// Fallback content for routes that flow through /content/[slug] when the
// CMS doesn't (yet) have a page registered for that slug. Once admin
// creates the page in TipTap, the CMS content takes over automatically
// (the route prefers fetched data over this registry).
//
// Keep these strings as plain HTML — they get fed to dangerouslySetInnerHTML
// inside a <article className="prose prose-navy"> wrapper, so basic
// semantic markup (h2/h3/p/ul/ol/li/strong/em) is all that's needed.

export type ContentFallback = {
  title: string
  subtitle: string
  html: string
}

const PRIVACY_POLICY_HTML = `
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

  <p><strong>Last Updated:</strong> January 2025</p>
`

const TERMS_OF_SERVICE_HTML = `
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
  <p>To report content, please send an email to: <strong>report@jaalyantra.com</strong></p>
  <p>Please include the following information in your report:</p>
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
  <p>When using our website and services, you agree to:</p>
  <ul>
    <li>Provide accurate and truthful information</li>
    <li>Maintain the security of your account credentials</li>
    <li>Not engage in any fraudulent or illegal activities</li>
    <li>Not attempt to gain unauthorized access to our systems</li>
    <li>Not use our services to harm others or violate their rights</li>
    <li>Comply with all applicable laws and regulations</li>
  </ul>

  <h2>Prohibited Activities</h2>
  <p>You are expressly prohibited from:</p>
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
  <p>We reserve the right to:</p>
  <ul>
    <li>Modify or discontinue products without notice</li>
    <li>Limit quantities available for purchase</li>
    <li>Refuse or cancel orders at our discretion</li>
    <li>Correct pricing errors</li>
    <li>Update product information as needed</li>
  </ul>

  <h2>Limitation of Liability</h2>
  <p>To the fullest extent permitted by law, Jaal Yantra Textiles Pvt. Ltd. shall not be liable for:</p>
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
  <p>We encourage you to review these Terms and Conditions periodically to stay informed of any changes.</p>

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
  <p>If you have any questions, concerns, or feedback regarding these Terms and Conditions, please contact us:</p>
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

  <p><strong>Last Updated:</strong> January 2025</p>
`

export const CONTENT_FALLBACKS: Record<string, ContentFallback> = {
  "privacy-policy": {
    title: "Privacy policy.",
    subtitle: "How we collect, use, and protect your personal information.",
    html: PRIVACY_POLICY_HTML,
  },
  "terms-of-service": {
    title: "Terms and conditions.",
    subtitle: "Please read these terms carefully before using our services.",
    html: TERMS_OF_SERVICE_HTML,
  },
}

export function getContentFallback(slug: string): ContentFallback | null {
  return CONTENT_FALLBACKS[slug] ?? null
}
