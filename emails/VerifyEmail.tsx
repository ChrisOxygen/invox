import { Link, Section, Text } from '@react-email/components'
import { EmailLayout, colors } from './layout/EmailLayout'

const font =
  "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

interface VerifyEmailProps {
  name: string
  verificationUrl: string
}

export function VerifyEmail({ name, verificationUrl }: VerifyEmailProps) {
  return (
    <EmailLayout preview="One click and you're in — takes 10 seconds.">
      {/* Blue accent bar */}
      <Section
        style={{
          backgroundColor: colors.blue600,
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
            color: colors.blue600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: '0 0 16px',
          }}
        >
          Email verification
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
          Confirm your email address, {name}.
        </Text>

        {/* Body */}
        <Text
          style={{
            fontFamily: font,
            fontSize: '15px',
            fontWeight: 400,
            color: '#3D3D6B',
            lineHeight: '1.65',
            margin: '0 0 32px',
          }}
        >
          You're almost there. Click the button below to verify your email and activate your Invox
          account. Once confirmed, you can start creating professional invoices right away.
        </Text>

        {/* CTA Button */}
        <Section style={{ textAlign: 'center', margin: '0 0 32px' }}>
          <Link
            href={verificationUrl}
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
            Confirm email address
          </Link>
        </Section>

        {/* Expiry notice */}
        <Section
          style={{
            backgroundColor: '#F7F7FB',
            borderRadius: '8px',
            border: '1px solid #E3E3EE',
            padding: '16px 20px',
            marginBottom: '32px',
          }}
        >
          <Text
            style={{
              fontFamily: font,
              fontSize: '13px',
              color: colors.ink400,
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            <strong style={{ color: colors.ink900 }}>This link expires in 24 hours.</strong> After
            that, you can request a new one from the login page.
          </Text>
        </Section>

        {/* Not you note */}
        <Text
          style={{
            fontFamily: font,
            fontSize: '13px',
            color: colors.ink400,
            lineHeight: '1.6',
            margin: '0 0 24px',
          }}
        >
          If you didn't create an Invox account, you can safely ignore this email — nothing will
          happen to your inbox.
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
              href={verificationUrl}
              style={{
                color: colors.blue600,
                wordBreak: 'break-all',
                fontSize: '11px',
              }}
            >
              {verificationUrl}
            </Link>
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  )
}

// Preview props for react-email dev server
VerifyEmail.PreviewProps = {
  name: 'Chidi',
  verificationUrl: 'https://invox.app/api/v1/auth/callback?code=abc123',
} satisfies VerifyEmailProps

export default VerifyEmail
