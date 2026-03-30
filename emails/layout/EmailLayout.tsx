import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

// Brand tokens (inline — CSS variables don't work in email clients)
export const colors = {
  blue600: '#3D52E8',
  blue700: '#3246D4',
  ink900: '#0D0D1A',
  ink400: '#5A5A8A',
  ink300: '#8080A8',
  ink100: '#D5D5E8',
  surfacePage: '#F7F7FB',
  surfaceBase: '#FFFFFF',
  borderDefault: '#E3E3EE',
}

const font =
  "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
  /** Show unsubscribe link — true for marketing emails like Welcome */
  showUnsubscribe?: boolean
}

export function EmailLayout({ preview, children, showUnsubscribe = false }: EmailLayoutProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://invox.app'

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; }
          a { color: ${colors.blue600}; }
        `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: colors.surfacePage,
          fontFamily: font,
          margin: 0,
          padding: 0,
        }}
      >
        {/* Outer wrapper */}
        <Section style={{ padding: '32px 16px' }}>
          {/* Logo wordmark */}
          <Section style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Link href={appUrl} style={{ textDecoration: 'none' }}>
              <Text
                style={{
                  fontFamily: font,
                  fontSize: '22px',
                  fontWeight: 800,
                  color: colors.ink900,
                  letterSpacing: '-0.04em',
                  margin: 0,
                  display: 'inline-block',
                }}
              >
                inv
                <span style={{ color: colors.blue600 }}>ox</span>
              </Text>
            </Link>
          </Section>

          {/* Main card */}
          <Container
            style={{
              backgroundColor: colors.surfaceBase,
              borderRadius: '16px',
              border: `1px solid ${colors.borderDefault}`,
              maxWidth: '560px',
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            {children}
          </Container>

          {/* Footer */}
          <Section
            style={{
              maxWidth: '560px',
              margin: '24px auto 0',
              padding: '0 8px',
            }}
          >
            <Hr style={{ borderColor: colors.ink100, margin: '0 0 16px' }} />

            {/* Spam note — prominent */}
            <Text
              style={{
                fontFamily: font,
                fontSize: '12px',
                color: colors.ink400,
                textAlign: 'center',
                lineHeight: '1.6',
                margin: '0 0 12px',
              }}
            >
              <strong style={{ color: colors.ink900 }}>Can't find this email?</strong> It may have
              landed in your <strong>Spam</strong> or <strong>Promotions</strong> folder. Mark it as
              "Not spam" to ensure you don't miss important account emails.
            </Text>

            <Text
              style={{
                fontFamily: font,
                fontSize: '12px',
                color: colors.ink300,
                textAlign: 'center',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} Invox. All rights reserved.
              {showUnsubscribe && (
                <>
                  {' · '}
                  <Link
                    href={`${appUrl}/settings`}
                    style={{ color: colors.ink300, textDecoration: 'underline' }}
                  >
                    Email preferences
                  </Link>
                </>
              )}
              {' · '}
              <Link
                href={`mailto:support@invox.app`}
                style={{ color: colors.ink300, textDecoration: 'underline' }}
              >
                support@invox.app
              </Link>
            </Text>
          </Section>
        </Section>
      </Body>
    </Html>
  )
}
