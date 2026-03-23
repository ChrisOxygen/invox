import InnerPageHeader from "@/components/InnerPageHeader";

export default function TermsOfServicePage() {
  return (
    <>
      <InnerPageHeader
        title="Terms of Service"
        description="Please read our terms of service carefully before using our website."
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
                &ldquo;us&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;)
                govern your use of our invoicing application and related
                services (collectively, the &ldquo;Service&rdquo;). By accessing
                or using our Service, you agree to be bound by these Terms.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                If you do not agree to these Terms, please do not use our
                Service.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Acceptance of Terms
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                By creating an account, accessing, or using Invox, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms and our Privacy Policy. These Terms apply
                to all users of the Service, including without limitation users
                who are browsers, vendors, customers, merchants, and
                contributors of content.
              </p>
            </div>

            {/* Eligibility */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Eligibility
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                You must be at least 18 years old to use our Service. By using
                our Service, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700">
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>
                  You will use the Service in compliance with all applicable
                  laws and regulations
                </li>
                <li>All information you provide is accurate and current</li>
              </ul>
            </div>

            {/* Description of Service */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Description of Service
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                Invox is a free invoicing application that allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-4">
                <li>Create, customize, and manage invoices</li>
                <li>Send invoices to clients via email</li>
                <li>Track invoice status and payment information</li>
                <li>Store client and business information</li>
                <li>Generate reports and analytics</li>
              </ul>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                The Service is provided free of charge. We reserve the right to
                modify, suspend, or discontinue any part of the Service at any
                time.
              </p>
            </div>

            {/* User Accounts */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                User Accounts
              </h2>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Account Creation
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                To use our Service, you must create an account by providing
                accurate and complete information. You are responsible for
                maintaining the confidentiality of your account credentials and
                for all activities that occur under your account.
              </p>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Account Security
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                <li>Keep your login credentials secure and confidential</li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
                <li>
                  Take responsibility for all activities under your account
                </li>
                <li>Log out of your account at the end of each session</li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Account Termination
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                You may terminate your account at any time by contacting us or
                using the account deletion feature. We may terminate or suspend
                your account immediately, without prior notice, if you breach
                these Terms.
              </p>
            </div>

            {/* Acceptable Use */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Acceptable Use
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700">
                <li>
                  In any way that violates any applicable federal, state, local,
                  or international law or regulation
                </li>
                <li>
                  To create, send, or manage invoices for illegal goods or
                  services
                </li>
                <li>
                  To harass, abuse, insult, harm, defame, slander, disparage,
                  intimidate, or discriminate
                </li>
                <li>To submit false, inaccurate, or misleading information</li>
                <li>
                  To engage in any fraudulent activity or impersonate any person
                  or entity
                </li>
                <li>
                  To interfere with or circumvent the security features of the
                  Service
                </li>
                <li>
                  To introduce any viruses, trojans, worms, logic bombs, or
                  other malicious material
                </li>
                <li>
                  To attempt to gain unauthorized access to any portion of the
                  Service
                </li>
                <li>
                  To use the Service to spam or send unsolicited communications
                </li>
                <li>To violate the privacy rights of others</li>
              </ul>
            </div>

            {/* User Content */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                User Content
              </h2>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Your Content
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                You retain ownership of all content you create, upload, or
                submit to the Service (&ldquo;User Content&rdquo;), including
                invoices, client information, and business data. By using our
                Service, you grant us a limited, non-exclusive, royalty-free
                license to use, store, and process your User Content solely to
                provide and improve the Service.
              </p>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Content Responsibility
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                You are solely responsible for your User Content and the
                consequences of posting or publishing it. You represent and
                warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                <li>
                  You own or have the necessary rights to use your User Content
                </li>
                <li>
                  Your User Content does not violate any third-party rights
                </li>
                <li>Your User Content is accurate and not misleading</li>
                <li>
                  Your User Content complies with these Terms and applicable
                  laws
                </li>
              </ul>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Content Removal
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We reserve the right to remove or disable any User Content that
                violates these Terms or is otherwise objectionable, without
                prior notice.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Intellectual Property
              </h2>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Our Intellectual Property
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                Invox and its licensors. The Service is protected by copyright,
                trademark, and other laws. Our trademarks and trade dress may
                not be used without our prior written consent.
              </p>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                Limited License
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable,
                revocable license to use the Service for your personal or
                business purposes in accordance with these Terms.
              </p>
            </div>

            {/* Privacy */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Privacy
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the Service, to
                understand our practices.
              </p>
            </div>

            {/* Disclaimers */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Disclaimers
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 font-semibold uppercase">
                The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis. We expressly disclaim all warranties of
                any kind, whether express, implied, or statutory, including the
                implied warranties of merchantability, fitness for a particular
                purpose, title, and non-infringement.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 font-semibold">
                We make no warranty that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700">
                <li>The Service will meet your requirements</li>
                <li>
                  The Service will be uninterrupted, timely, secure, or
                  error-free
                </li>
                <li>
                  The results obtained from the Service will be accurate or
                  reliable
                </li>
                <li>Any errors in the Service will be corrected</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Limitation of Liability
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 font-semibold uppercase">
                To the fullest extent permitted by applicable law, in no event
                shall Invox, its affiliates, officers, directors, employees,
                agents, or licensors be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other
                intangible losses, resulting from your use of the Service.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-semibold uppercase">
                In no event shall our total liability to you for all damages
                exceed one hundred dollars ($100) or the amount you paid us in
                the last twelve months, whichever is greater.
              </p>
            </div>

            {/* Indemnification */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Indemnification
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                You agree to defend, indemnify, and hold harmless Invox and its
                affiliates, officers, directors, employees, and agents from and
                against any claims, liabilities, damages, judgments, awards,
                losses, costs, expenses, or fees (including reasonable
                attorneys&apos; fees) arising out of or relating to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg text-gray-700">
                <li>Your use of the Service</li>
                <li>Your User Content</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of a third party</li>
              </ul>
            </div>

            {/* Third-Party Services */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Third-Party Services
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                Our Service may contain links to third-party websites or
                services that are not owned or controlled by Invox. We have no
                control over and assume no responsibility for the content,
                privacy policies, or practices of any third-party websites or
                services.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                You acknowledge and agree that we shall not be responsible or
                liable for any damage or loss caused by your use of any
                third-party services.
              </p>
            </div>

            {/* Modifications to Service */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Modifications to Service
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the
                Service (or any part thereof) at any time, with or without
                notice. We shall not be liable to you or any third party for any
                modification, suspension, or discontinuance of the Service.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Changes to Terms
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                By continuing to access or use our Service after those revisions
                become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Governing Law
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of
                [Your State/Country], without regard to its conflict of law
                provisions. Our failure to enforce any right or provision of
                these Terms will not be considered a waiver of those rights.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Dispute Resolution
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Any disputes arising out of or relating to these Terms or the
                Service shall be resolved through binding arbitration in
                accordance with the rules of [Arbitration Organization] in [Your
                City, State/Country]. The arbitration shall be conducted in
                English, and the arbitrator&apos;s decision shall be final and
                binding.
              </p>
            </div>

            {/* Severability */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Severability
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                If any provision of these Terms is held to be invalid or
                unenforceable by a court, the remaining provisions of these
                Terms will remain in effect. These Terms constitute the entire
                agreement between us regarding our Service.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Contact Information
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">Email:</strong>{" "}
                  legal@invox.com
                  <br />
                  <strong className="text-gray-900">Address:</strong> [Your
                  Business Address]
                  <br />
                  <strong className="text-gray-900">Phone:</strong> [Your Phone
                  Number]
                </p>
              </div>
            </div>

            {/* Effective Date */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Effective Date
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                These Terms are effective as of August 04, 2025, and will remain
                in effect until terminated in accordance with these Terms.
              </p>
            </div>

            {/* Footer Note */}
            <div className="pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-600 italic">
                These Terms of Service were last updated on August 04, 2025.
                Please review them regularly for any updates or changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
