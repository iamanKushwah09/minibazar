export const metadata = {
  title: 'Terms & Conditions - Matrixmeta Shoes',
  description: 'Read our terms and conditions governing the use of our platform, purchases, shipping, and return requests.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms & Conditions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              By using our platform, you agree to our Terms & Conditions. These terms govern your purchases, shipping, and return requests.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using the Matrixmeta Shoes website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700">
                These Terms & Conditions constitute a legally binding agreement between you and Matrixmeta Shoes regarding your use of our website and services.
              </p>
            </div>

            {/* Eligibility */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Eligibility</h2>
              <p className="text-gray-700 mb-4">
                You must be at least 18 years old to use our services and make purchases. By using our website, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity to enter into binding agreements</li>
                <li>You will use our services in accordance with these Terms & Conditions</li>
                <li>All information you provide is accurate and complete</li>
              </ul>
            </div>

            {/* Product Descriptions */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Product Descriptions</h2>
              <p className="text-gray-700 mb-4">
                We strive to provide accurate and detailed product descriptions, images, and specifications. However, we do not warrant that product descriptions, colors, information, or other content available on our website is accurate, complete, reliable, current, or error-free.
              </p>
              <p className="text-gray-700 mb-4">
                Product images are for illustrative purposes only. Actual products may vary slightly in appearance due to manufacturing variations, lighting conditions, or display settings.
              </p>
              <p className="text-gray-700">
                If a product offered by Matrixmeta Shoes is not as described, your sole remedy is to contact us for a return or exchange in accordance with our return policy.
              </p>
            </div>

            {/* Pricing & Payment */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Pricing & Payment</h2>
              <p className="text-gray-700 mb-4">
                All prices are displayed in US Dollars (USD) unless otherwise stated. Prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time.
              </p>
              <p className="text-gray-700 mb-4">
                Payment must be made at the time of order placement. We accept the following payment methods:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Credit cards (Visa, MasterCard, American Express, Discover)</li>
                <li>Debit cards</li>
                <li>PayPal</li>
                <li>Apple Pay</li>
                <li>Google Pay</li>
              </ul>
              <p className="text-gray-700">
                All transactions are processed securely through our payment partners. We do not store your complete payment information on our servers.
              </p>
            </div>

            {/* Shipping & Delivery */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Shipping & Delivery</h2>
              <p className="text-gray-700 mb-4">
                We offer various shipping options to meet your needs:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Standard Shipping:</strong> 3-5 business days - $5.99</li>
                <li><strong>Express Shipping:</strong> 1-2 business days - $12.99</li>
                <li><strong>Free Shipping:</strong> Available on orders over $50</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Delivery times are estimates and may vary based on your location, product availability, and shipping method selected. We are not responsible for delays caused by circumstances beyond our control, including but not limited to weather conditions, customs delays, or carrier issues.
              </p>
              <p className="text-gray-700">
                Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.
              </p>
            </div>

            {/* Returns & Refunds */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Returns & Refunds</h2>
              <p className="text-gray-700 mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your order, you may return it within 30 days of delivery for a full refund or exchange.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Return Conditions:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Items must be unused and in original condition</li>
                <li>Original packaging must be intact</li>
                <li>Return authorization must be obtained before shipping</li>
                <li>Return shipping costs are the responsibility of the customer unless the item is defective</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Refund Process:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Refunds will be processed within 5-7 business days of receiving your return</li>
                <li>Refunds will be issued to the original payment method</li>
                <li>Shipping costs are non-refundable unless the item is defective</li>
              </ul>
              <p className="text-gray-700">
                To initiate a return, please contact our customer service team or use the return portal in your account.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by applicable law, Matrixmeta Shoes shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p className="text-gray-700 mb-4">
                Our total liability to you for any claims arising from the use of our services shall not exceed the amount you paid for the specific product giving rise to the claim.
              </p>
              <p className="text-gray-700">
                This limitation of liability applies to all causes of action, whether based in contract, tort, or any other legal theory.
              </p>
            </div>

            {/* Modification of Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Modification of Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new terms.
              </p>
              <p className="text-gray-700">
                We will notify users of any material changes to these terms via email or through a notice on our website. It is your responsibility to review these terms periodically for any changes.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms & Conditions shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700 mb-4">
                Any disputes arising from these terms or your use of our services shall be resolved in the courts of New York County, New York, and you consent to the personal jurisdiction of such courts.
              </p>
              <p className="text-gray-700">
                If any provision of these terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these terms will otherwise remain in full force and effect.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12 bg-gray-50 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@matrixmetashoes.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Shoe Street, Fashion District, New York, NY 10001</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-gray-500 border-t pt-8">
              <p><strong>Last Updated:</strong> December 2024</p>
              <p className="mt-2">
                These terms are effective as of the date listed above and apply to all users of our website and services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
