import { Link, Section, Text } from '@react-email/components'
import { EmailLayout, colors } from './layout/EmailLayout'

const font =
  "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

interface WelcomeEmailProps {
  name: string
  dashboardUrl: string
}

function FeatureItem({ label, description }: { label: string; description: string }) {
  return (
    <Section style={{ marginBottom: '16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td
              style={{
                width: '28px',
                verticalAlign: 'top',
                paddingTop: '2px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  backgroundColor: '#ECEFFE',
                  borderRadius: '4px',
                  textAlign: 'center',
                  lineHeight: '18px',
                  fontSize: '10px',
                  color: colors.blue600,
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
            </td>
            <td style={{ paddingLeft: '8px', verticalAlign: 'top' }}>
              <Text
                style={{
                  fontFamily: font,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: colors.ink900,
                  margin: '0 0 2px',
                  lineHeight: '1.3',
                }}
              >
                {label}
              </Text>
              <Text
                style={{
                  fontFamily: font,
                  fontSize: '13px',
                  color: colors.ink400,
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                {description}
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  )
}

export function WelcomeEmail({ name, dashboardUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout
      preview="Professional invoices, bank transfer details, client records — all in one place."
      showUnsubscribe
    >
      {/* Hero — branded dark header */}
      <Section
        style={{
          backgroundColor: '#0D0D1A',
          padding: '48px 48px 40px',
          borderRadius: '14px 14px 0 0',
        }}
      >
        {/* Status chip */}
        <Section style={{ marginBottom: '20px' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(61, 82, 232, 0.2)',
              color: '#ACB5F8',
              fontFamily: font,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(61, 82, 232, 0.3)',
            }}
          >
            Account ready
          </span>
        </Section>

        <Text
          style={{
            fontFamily: font,
            fontSize: '32px',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.04em',
            lineHeight: '1.15',
            margin: '0 0 12px',
          }}
        >
          Welcome to Invox,{'\n'}
          {name}.
        </Text>

        <Text
          style={{
            fontFamily: font,
            fontSize: '15px',
            fontWeight: 400,
            color: '#8080A8',
            lineHeight: '1.6',
            margin: '0 0 32px',
          }}
        >
          Your account is live. You're ready to send professional invoices that get paid faster —
          built for Nigerian businesses.
        </Text>

        {/* CTA Button */}
        <Link
          href={dashboardUrl}
          style={{
            display: 'inline-block',
            backgroundColor: colors.blue600,
            color: '#FFFFFF',
            fontFamily: font,
            fontSize: '15px',
            fontWeight: 700,
            textDecoration: 'none',
            padding: '14px 32px',
            borderRadius: '8px',
            letterSpacing: '-0.01em',
          }}
        >
          Set up your profile →
        </Link>
      </Section>

      {/* Features section */}
      <Section style={{ padding: '40px 48px 0' }}>
        <Text
          style={{
            fontFamily: font,
            fontSize: '11px',
            fontWeight: 700,
            color: colors.ink300,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: '0 0 20px',
          }}
        >
          What you can do right now
        </Text>

        <FeatureItem
          label="Set up your business profile"
          description="Add your logo, TIN number, RC number, and bank account details — they'll appear on every invoice automatically."
        />
        <FeatureItem
          label="Add your first client"
          description="Save client details once and select them with one click when creating invoices."
        />
        <FeatureItem
          label="Generate a professional invoice"
          description="Create a branded PDF invoice in under 2 minutes. Share directly via WhatsApp or download for email."
        />
      </Section>

      {/* Nigeria callout */}
      <Section style={{ padding: '24px 48px' }}>
        <Section
          style={{
            backgroundColor: '#F7F7FB',
            borderRadius: '10px',
            border: `1px solid ${colors.borderDefault}`,
            padding: '20px 24px',
          }}
        >
          <Text
            style={{
              fontFamily: font,
              fontSize: '13px',
              fontWeight: 700,
              color: colors.ink900,
              margin: '0 0 6px',
            }}
          >
            Built for how Nigerian businesses get paid
          </Text>
          <Text
            style={{
              fontFamily: font,
              fontSize: '13px',
              color: colors.ink400,
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Your bank transfer details appear on every invoice by default — no more copying account
            numbers. Share directly to WhatsApp in one tap. Default currency is ₦ NGN. WHT support
            included.
          </Text>
        </Section>
      </Section>

      {/* Sign-off */}
      <Section
        style={{
          padding: '0 48px 40px',
          borderTop: `1px solid ${colors.borderDefault}`,
          marginTop: '8px',
        }}
      >
        <Section style={{ paddingTop: '24px' }}>
          <Text
            style={{
              fontFamily: font,
              fontSize: '14px',
              color: colors.ink400,
              lineHeight: '1.6',
              margin: '0 0 4px',
            }}
          >
            Questions? Reply to this email — we read everything.
          </Text>
          <Text
            style={{
              fontFamily: font,
              fontSize: '14px',
              fontWeight: 600,
              color: colors.ink900,
              margin: 0,
            }}
          >
            — The Invox team
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  )
}

// Preview props for react-email dev server
WelcomeEmail.PreviewProps = {
  name: 'Chidi',
  dashboardUrl: 'https://invox.app/onboarding',
} satisfies WelcomeEmailProps

export default WelcomeEmail
