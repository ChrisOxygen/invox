import InnerPageHeader from "@/components/InnerPageHeader";

export default function CookiePolicyPage() {
  return (
    <>
      <InnerPageHeader
        title="Cookie Policy"
        description="This Cookie Policy explains how we use cookies and similar technologies on our website. By using our site, you consent to the use of cookies in accordance with this policy."
      />

      {/* Content Section */}
      <section className="bg-white">
        <div className="content-wrapper">
          <div className="max-w-4xl mx-auto prose prose-lg">
            {/* Document Header */}
            <div className="mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm sm:text-base text-gray-600">
                <p>
                  <strong className="text-gray-900">Effective Date:</strong>{" "}
                  August 04, 2025
                </p>
                <p>
                  <strong className="text-gray-900">Last Updated:</strong>{" "}
                  August 04, 2025
                </p>
              </div>
            </div>

            {/* Introduction */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Introduction
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                This Cookie Policy explains how Invox (&ldquo;we,&rdquo;
                &ldquo;our,&rdquo; or &ldquo;us&rdquo;) uses cookies and similar
                technologies when you use our invoicing application and related
                services (collectively, the &ldquo;Service&rdquo;). This policy
                explains what these technologies are, why we use them, and your
                rights to control our use of them.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                By continuing to use our Service, you consent to our use of
                cookies as described in this Cookie Policy.
              </p>
            </div>

            {/* What Are Cookies */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                What Are Cookies
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device
                (computer, tablet, or mobile) when you visit a website or use an
                application. They are widely used to make websites and
                applications work more efficiently and to provide information to
                the owners of the site or app.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Cookies contain information that is transferred to your
                device&apos;s hard drive. They help us recognize your device and
                store some information about your preferences or past actions.
              </p>
            </div>

            {/* Types of Cookies We Use */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Types of Cookies We Use
              </h2>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Essential Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                These cookies are strictly necessary for the operation of our
                Service. They enable core functionality such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-4">
                <li>User authentication and account access</li>
                <li>Security and fraud prevention</li>
                <li>Session management</li>
                <li>Load balancing and service stability</li>
                <li>Remembering your privacy preferences</li>
              </ul>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                These cookies cannot be disabled as they are essential for the
                Service to function properly.
              </p>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Functional Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                These cookies enhance the functionality of our Service and make
                it more convenient for you to use. They help us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                <li>Remember your settings and preferences</li>
                <li>Auto-fill forms with previously entered information</li>
                <li>Provide customized content and features</li>
                <li>Remember your language and region preferences</li>
                <li>Save your invoice templates and customizations</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Analytics Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                These cookies help us understand how users interact with our
                Service by collecting and reporting information anonymously.
                They help us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                <li>Analyze user behavior and usage patterns</li>
                <li>Count visits and traffic sources</li>
                <li>Measure and improve the performance of our Service</li>
                <li>Identify which features are most popular</li>
                <li>Understand how users navigate through our app</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Performance Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                These cookies collect information about how you use our Service
                to help us improve its performance. They help us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700">
                <li>Monitor page load times and response speeds</li>
                <li>Identify and fix technical issues</li>
                <li>Optimize our Service for better user experience</li>
                <li>Test new features and improvements</li>
              </ul>
            </div>

            {/* Third-Party Cookies */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Third-Party Cookies
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                We may use third-party services that place cookies on your
                device. These services help us provide and improve our Service.
                Third-party cookies may be used for:
              </p>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Analytics Services
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                <li>
                  <strong>Google Analytics:</strong> Helps us understand user
                  behavior and improve our Service
                </li>
                <li>
                  <strong>Other Analytics Tools:</strong> Additional tools for
                  measuring app performance and usage
                </li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Support and Communication
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                <li>
                  <strong>Customer Support Tools:</strong> Enable chat support
                  and help desk functionality
                </li>
                <li>
                  <strong>Email Services:</strong> Facilitate invoice delivery
                  and app notifications
                </li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Infrastructure Services
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                <li>
                  <strong>Content Delivery Networks (CDN):</strong> Improve app
                  loading speeds
                </li>
                <li>
                  <strong>Cloud Hosting Services:</strong> Ensure reliable
                  service delivery
                </li>
              </ul>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                These third-party services have their own privacy policies and
                cookie practices. We encourage you to review their policies to
                understand how they use cookies.
              </p>
            </div>

            {/* How Long Do Cookies Last */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                How Long Do Cookies Last
              </h2>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Session Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                These cookies are temporary and are deleted when you close your
                browser or end your app session. They are used for essential
                functions like maintaining your login status during your visit.
              </p>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Persistent Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                These cookies remain on your device for a set period or until
                you delete them. They may last for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700">
                <li>
                  <strong>Short-term (1-30 days):</strong> User preferences and
                  settings
                </li>
                <li>
                  <strong>Medium-term (30 days - 1 year):</strong> Analytics and
                  performance data
                </li>
                <li>
                  <strong>Long-term (1-2 years):</strong> Security and fraud
                  prevention
                </li>
              </ul>
            </div>

            {/* Your Cookie Choices */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Your Cookie Choices
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                You have several options for managing cookies:
              </p>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Browser Settings
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their
                settings. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-4">
                <li>View what cookies are stored on your device</li>
                <li>Delete existing cookies</li>
                <li>Block some or all cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                Please note that disabling certain cookies may affect the
                functionality of our Service.
              </p>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Cookie Preferences
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                You can manage your cookie preferences for our Service through
                our cookie consent banner or by visiting our cookie settings
                page. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                <li>Accept or reject non-essential cookies</li>
                <li>Change your preferences at any time</li>
                <li>View detailed information about specific cookies</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Opt-Out Links
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                For third-party analytics cookies, you can opt out directly:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700">
                <li>
                  <strong>Google Analytics:</strong>{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>
                </li>
                <li>
                  <strong>Other Services:</strong> Check the privacy policies of
                  specific services for opt-out instructions
                </li>
              </ul>
            </div>

            {/* Mobile App Cookies */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Mobile App Cookies
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                If you use our mobile application, we may use similar
                technologies to cookies, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-4">
                <li>
                  <strong>Local Storage:</strong> Store app preferences and
                  settings
                </li>
                <li>
                  <strong>Device Identifiers:</strong> Unique identifiers for
                  analytics and performance
                </li>
                <li>
                  <strong>App Analytics:</strong> Usage tracking within the
                  mobile app
                </li>
              </ul>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                You can manage these through your device settings or app
                preferences.
              </p>
            </div>

            {/* Updates to Cookie Policy */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Updates to Cookie Policy
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. When we make changes, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-4">
                <li>
                  Update the &ldquo;Last Updated&rdquo; date at the top of this
                  policy
                </li>
                <li>Notify you of significant changes through our Service</li>
                <li>
                  Request renewed consent where required by applicable law
                </li>
              </ul>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We encourage you to review this Cookie Policy periodically to
                stay informed about our use of cookies.
              </p>
            </div>

            {/* More Information */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                More Information
              </h2>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                About Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                For more information about cookies in general, you can visit:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                <li>
                  <a
                    href="https://www.allaboutcookies.org"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    All About Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="https://cookiepedia.co.uk"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Cookiepedia
                  </a>
                </li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Data Protection
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                For information about how we handle your personal data, please
                see our Privacy Policy. Cookie data is processed in accordance
                with our privacy practices and applicable data protection laws.
              </p>
            </div>

            {/* Contact Us */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Contact Us
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Cookie Policy or our use of
                cookies, please contact us:
              </p>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 mb-4">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">Email:</strong>{" "}
                  privacy@invox.com
                  <br />
                  <strong className="text-gray-900">Address:</strong> [Your
                  Business Address]
                  <br />
                  <strong className="text-gray-900">Phone:</strong> [Your Phone
                  Number]
                </p>
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                For specific questions about cookies and data protection, you
                can also reach out to our Data Protection Officer at
                dpo@invox.com.
              </p>
            </div>

            {/* Footer Note */}
            <div className="pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-600 italic">
                This Cookie Policy was last updated on August 04, 2025. Please
                review it regularly for any updates or changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
