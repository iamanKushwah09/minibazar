export const metadata = {
  title: 'Privacy Policy - Matrixmeta Shoes',
  description: 'We value your privacy. Your data is protected and will never be sold to third parties. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              We value your privacy. Your data is protected and will never be sold to third parties.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
              <p className="text-gray-700 mb-4">
                At Matrixmeta Shoes, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make purchases, or interact with our services.
              </p>
              <p className="text-gray-700">
                By using our website and services, you consent to the data practices described in this policy. We encourage you to read this policy carefully and contact us if you have any questions about our privacy practices.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect various types of information to provide and improve our services:
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li><strong>Name:</strong> Your full name for order processing and account management</li>
                <li><strong>Email Address:</strong> For order confirmations, updates, and customer support</li>
                <li><strong>Phone Number:</strong> For delivery coordination and customer service</li>
                <li><strong>Address:</strong> Shipping and billing addresses for order fulfillment</li>
                <li><strong>Payment Information:</strong> Credit card details, billing information (processed securely through our payment partners)</li>
                <li><strong>Account Information:</strong> Username, password, and account preferences</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on site, click patterns, search queries</li>
                <li><strong>Location Data:</strong> General location information (city/country level) for shipping calculations</li>
                <li><strong>Cookies and Tracking:</strong> Information stored on your device to enhance your browsing experience</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Information from Third Parties</h3>
              <p className="text-gray-700">
                We may receive information about you from third-party sources, such as social media platforms (if you connect your account), payment processors, and shipping partners.
              </p>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect for various purposes to provide and improve our services:
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Processing</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Handle returns and refunds</li>
                <li>Provide customer support</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Communication</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li>Send marketing emails (with your consent)</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Send important updates about our services</li>
                <li>Provide personalized recommendations</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Website Improvement</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li>Analyze website usage and performance</li>
                <li>Improve user experience and site functionality</li>
                <li>Develop new features and services</li>
                <li>Conduct research and analytics</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security and Legal</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Protect against fraud and unauthorized access</li>
                <li>Comply with legal obligations</li>
                <li>Enforce our terms and policies</li>
                <li>Resolve disputes and troubleshoot problems</li>
              </ul>
            </div>

            {/* Cookies & Tracking */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies & Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience and provide personalized content.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality and security</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Used for advertising and marketing purposes</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h3>
              <p className="text-gray-700 mb-4">
                You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.
              </p>
              <p className="text-gray-700">
                To opt out of marketing cookies and tracking, you can use the opt-out tools provided by our advertising partners or contact us directly.
              </p>
            </div>

            {/* Third-Party Services */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We work with trusted third-party service providers to help us deliver our services. These partners may collect and process your information on our behalf:
              </p>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li><strong>Payment Processors:</strong> Stripe, PayPal for secure payment processing</li>
                <li><strong>Shipping Partners:</strong> FedEx, UPS, USPS for order delivery</li>
                <li><strong>Analytics Services:</strong> Google Analytics for website performance analysis</li>
                <li><strong>Email Services:</strong> Mailchimp for marketing communications</li>
                <li><strong>Customer Support:</strong> Zendesk for help desk services</li>
              </ul>

              <p className="text-gray-700 mb-4">
                These third-party services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of these external services.
              </p>
              <p className="text-gray-700">
                We only share your information with third parties as necessary to provide our services, and we require them to protect your information in accordance with this policy.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security Measures</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through PCI-compliant partners</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication measures</li>
                <li>Data backup and disaster recovery procedures</li>
                <li>Employee training on data protection practices</li>
              </ul>

              <p className="text-gray-700 mb-4">
                While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to maintaining the highest standards of data protection.
              </p>
              <p className="text-gray-700">
                In the event of a data breach, we will notify affected users and relevant authorities as required by law.
              </p>
            </div>

            {/* User Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Restriction:</strong> Request limitation of how we process your information</li>
                <li><strong>Objection:</strong> Object to certain types of processing</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
              </ul>

              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us using the information provided below. We will respond to your request within 30 days, unless additional time is required.
              </p>
              <p className="text-gray-700">
                We may need to verify your identity before processing certain requests. We will not discriminate against you for exercising your privacy rights.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
              </p>
              
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li><strong>Account Information:</strong> Retained while your account is active and for a reasonable period after deactivation</li>
                <li><strong>Order Information:</strong> Retained for 7 years for tax and accounting purposes</li>
                <li><strong>Marketing Data:</strong> Retained until you opt out or request deletion</li>
                <li><strong>Analytics Data:</strong> Retained for up to 2 years for website improvement</li>
              </ul>

              <p className="text-gray-700">
                When we no longer need your information, we will securely delete or anonymize it in accordance with our data retention policies.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our website and services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
              </p>
              <p className="text-gray-700">
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. We will take steps to remove such information from our records.
              </p>
            </div>

            {/* International Transfers */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws.
              </p>
              <p className="text-gray-700">
                When we transfer data internationally, we implement appropriate safeguards such as standard contractual clauses and adequacy decisions to protect your information.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a notice on our website</li>
              </ul>
              <p className="text-gray-700">
                Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12 bg-gray-50 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact for Privacy Requests</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or would like to exercise your privacy rights, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@matrixmetashoes.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Shoe Street, Fashion District, New York, NY 10001</p>
                <p><strong>Data Protection Officer:</strong> dpo@matrixmetashoes.com</p>
              </div>
              <p className="text-gray-700 mt-4">
                We will respond to your inquiry within 30 days and work with you to resolve any privacy concerns.
              </p>
            </div>

            {/* Last Updated */}
            <div className="text-center text-gray-500 border-t pt-8">
              <p><strong>Last Updated:</strong> December 2024</p>
              <p className="mt-2">
                This Privacy Policy is effective as of the date listed above and applies to all users of our website and services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
