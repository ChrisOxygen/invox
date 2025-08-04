import InnerPageHeader from "@/components/InnerPageHeader";

export default function PrivacyPolicyPage() {
  return (
    <main className="">
      <InnerPageHeader
        title="Privacy Policy"
        description="Learn how we collect, use, and protect your personal information"
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
                Welcome to Invox (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                &ldquo;us&rdquo;). We are committed to protecting your privacy
                and ensuring the security of your personal information. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our invoicing
                application and related services.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                By using our app, you agree to the collection and use of
                information in accordance with this Privacy Policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Information We Collect
              </h2>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Personal Information
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                    We may collect the following types of personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4">
                    <li>
                      <strong className="text-gray-900">
                        Account Information:
                      </strong>{" "}
                      Name, email address, phone number, and password
                    </li>
                    <li>
                      <strong className="text-gray-900">
                        Business Information:
                      </strong>{" "}
                      Company name, business address, tax identification
                      numbers, and business contact details
                    </li>
                    <li>
                      <strong className="text-gray-900">
                        Profile Information:
                      </strong>{" "}
                      Professional title, business logo, and other profile
                      customization data
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Invoice and Business Data
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4">
                    <li>
                      <strong className="text-gray-900">
                        Client Information:
                      </strong>{" "}
                      Names, addresses, email addresses, and contact details of
                      your clients
                    </li>
                    <li>
                      <strong className="text-gray-900">
                        Invoice Details:
                      </strong>{" "}
                      Invoice numbers, amounts, dates, descriptions of
                      goods/services, payment terms
                    </li>
                    <li>
                      <strong className="text-gray-900">
                        Financial Information:
                      </strong>{" "}
                      While we don&apos;t process payments directly, we may
                      store invoice amounts and payment status information
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Technical Information
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4">
                    <li>
                      <strong className="text-gray-900">
                        Device Information:
                      </strong>{" "}
                      Device type, operating system, browser type, and version
                    </li>
                    <li>
                      <strong className="text-gray-900">Usage Data:</strong> How
                      you interact with our app, features used, time spent, and
                      navigation patterns
                    </li>
                    <li>
                      <strong className="text-gray-900">Log Data:</strong> IP
                      addresses, access times, pages viewed, and technical error
                      information
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Communications
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4">
                    <li>
                      <strong className="text-gray-900">
                        Support Communications:
                      </strong>{" "}
                      Messages, emails, and other communications you send to us
                    </li>
                    <li>
                      <strong className="text-gray-900">
                        App Communications:
                      </strong>{" "}
                      Messages and notifications sent through our platform
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                How We Use Your Information
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                We use the collected information for the following purposes:
              </p>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Core App Functionality
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4">
                    <li>Creating and managing your account</li>
                    <li>
                      Enabling invoice creation, customization, and management
                    </li>
                    <li>Facilitating invoice delivery to your clients</li>
                    <li>Tracking invoice status and payment information</li>
                    <li>Providing customer support and technical assistance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Service Improvement
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4">
                    <li>Analyzing usage patterns to improve our app</li>
                    <li>Developing new features and functionality</li>
                    <li>Fixing bugs and technical issues</li>
                    <li>Conducting security monitoring and fraud prevention</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Communications
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4">
                    <li>Sending service-related notifications and updates</li>
                    <li>Responding to your inquiries and support requests</li>
                    <li>
                      Providing important account and security information
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Information Sharing and Disclosure */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Information Sharing and Disclosure
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    With Your Consent
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    We will share information when you explicitly authorize us
                    to do so.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Service Providers
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                    We may share information with trusted third-party service
                    providers who assist us in:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4 mb-4">
                    <li>Cloud hosting and data storage</li>
                    <li>Email delivery services</li>
                    <li>Analytics and performance monitoring</li>
                    <li>Customer support tools</li>
                  </ul>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    These providers are contractually bound to protect your
                    information and use it only for specified purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Legal Requirements
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                    We may disclose information if required by law or in
                    response to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4">
                    <li>Court orders or legal processes</li>
                    <li>Government requests or regulatory requirements</li>
                    <li>Protection of our rights, property, or safety</li>
                    <li>Investigation of fraud or security issues</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Business Transfers
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    In the event of a merger, acquisition, or sale of assets,
                    your information may be transferred to the new entity,
                    subject to this Privacy Policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Continue with more sections... */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Data Security
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security
                measures to protect your information against unauthorized
                access, alteration, disclosure, or destruction. These measures
                include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure server infrastructure</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                However, no method of transmission over the internet or
                electronic storage is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-8 sm:mb-12 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Contact Information
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-base sm:text-lg text-gray-700">
                <p>
                  <strong className="text-gray-900">Email:</strong>{" "}
                  privacy@invox.com
                </p>
                <p>
                  <strong className="text-gray-900">Address:</strong> [Your
                  Business Address]
                </p>
                <p>
                  <strong className="text-gray-900">Phone:</strong> [Your Phone
                  Number]
                </p>
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mt-4">
                For data protection inquiries specifically, you may also contact
                our Data Protection Officer at dpo@invox.com.
              </p>
            </div>

            {/* Footer Note */}
            <div className="pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-sm sm:text-base italic text-gray-600 text-center">
                This Privacy Policy was last updated on August 04, 2025. Please
                review it regularly for any updates or changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
