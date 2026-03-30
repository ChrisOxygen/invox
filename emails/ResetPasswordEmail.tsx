import { Link, Section, Text } from '@react-email/components'
import { EmailLayout, colors } from './layout/EmailLayout'

const font =
  "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

interface ResetPasswordEmailProps {
  email: string
  resetUrl: string
}

export function ResetPasswordEmail({ email, resetUrl }: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="We received your request — follow this link to set a new password.">
      {/* Warning amber accent bar */}
      <Section
        style={{
          backgroundColor: '#F0A020',
          height: '4px',
          width: '100%',
          margin: 0,
        }}
      />

      {/* Content */}
      <Section style={{ padding: '40px 48px 48px' }}>
        {/* Label */}
        <Text
          style={{
            fontFamily: font,
            fontSize: '11px',
            fontWeight: 700,
            color: '#B57200',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
          }}
        >
          Password reset
        </Text>

        {/* Heading */}
        <Text
          style={{
            fontFamily: font,
            fontSize: '26px',
            fontWeight: 800,
            color: colors.ink900,
            letterSpacing: '-0.03em',
            lineHeight: '1.2',
            margin: '0 0 16px',
          }}
        >
          Reset your Invox password.
        </Text>

        {/* Body */}
        <Text
          style={{
            fontFamily: font,
            fontSize: '15px',
            fontWeight: 400,
            color: '#3D3D6B',
            lineHeight: '1.65',
            margin: '0 0 8px',
          }}
        >
          We received a request to reset the password for the Invox account registered to:
        </Text>

        {/* Email display */}
        <Text
          style={{
            fontFamily:
              "'JetBrains Mono', 'Courier New', Courier, monospace",
            fontSize: '14px',
            fontWeight: 500,
            color: colors.blue600,
            backgroundColor: '#ECEFFE',
            padding: '8px 14px',
            borderRadius: '6px',
            margin: '0 0 32px',
            display: 'inline-block',
          }}
        >
          {email}
        </Text>

        {/* CTA Button */}
        <Section style={{ textAlign: 'center', margin: '0 0 32px' }}>
          <Link
            href={resetUrl}
            style={{
              display: 'inline-block',
              backgroundColor: colors.blue600,
              color: '#FFFFFF',
              fontFamily: font,
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              padding: '14px 36px',
              borderRadius: '8px',
              letterSpacing: '-0.01em',
            }}
          >
            Reset my password
          </Link>
        </Section>

        {/* Expiry notice */}
        <Section
          style={{
            backgroundColor: '#FFF7EA',
            borderRadius: '8px',
            border: '1px solid #F0C060',
            padding: '16px 20px',
            marginBottom: '32px',
          }}
        >
          <Text
            style={{
              fontFamily: font,
              fontSize: '13px',
              color: '#7A4A00',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            <strong>This link expires in 1 hour.</strong> After that, you'll need to request a new
            reset from the login page.
          </Text>
        </Section>

        {/* Didn't request section */}
        <Section
          style={{
            borderTop: `1px solid ${colors.borderDefault}`,
            paddingTop: '24px',
            marginBottom: '24px',
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
            Didn't request this?
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
            You can safely ignore this email — your password won't change and your account remains
            secure. Nobody can access your account without clicking this link.
          </Text>
        </Section>

        {/* Help */}
        <Text
          style={{
            fontFamily: font,
            fontSize: '13px',
            color: colors.ink400,
            lineHeight: '1.6',
            margin: '0 0 24px',
          }}
        >
          Locked out or need help?{' '}
          <Link href="mailto:support@invox.app" style={{ color: colors.blue600 }}>
            Reply to this email
          </Link>{' '}
          and we'll sort it out.
        </Text>

        {/* Raw link fallback */}
        <Section
          style={{
            borderTop: `1px solid ${colors.borderDefault}`,
            paddingTop: '24px',
          }}
        >
          <Text
            style={{
              fontFamily: font,
              fontSize: '12px',
              color: colors.ink300,
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Button not working? Copy and paste this link into your browser:
            <br />
            <Link
              href={resetUrl}
              style={{
                color: colors.blue600,
                wordBreak: 'break-all',
                fontSize: '11px',
              }}
            >
              {resetUrl}
            </Link>
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  )
}

// Preview props for react-email dev server
ResetPasswordEmail.PreviewProps = {
  email: 'chidi@example.com',
  resetUrl: 'https://invox.app/api/v1/auth/callback?type=recovery&token=abc123',
} satisfies ResetPasswordEmailProps

export default ResetPasswordEmail
