import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Img,
} from '@react-email/components';

interface WelcomeEmailProps {
  name?: string;
  email?: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  name,
  email,
  loginUrl = 'https://koyitech.africa/login',
}: WelcomeEmailProps = {}) => {
  return (
    <Html>
      <Head />
      <Preview>
        Your Cohort I student account is ready — log in to Koyitech Africa and attend your free Computer &amp; IT Fundamentals classes!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://koyitech.africa/Koyitechafrica-logo.jpeg"
            width="180"
            alt="Koyitech Africa"
            style={logoImage}
          />
          <Heading style={heading}>Welcome to Cohort I! 🚀</Heading>

          <Section style={section}>
            <Text style={text}>
              Hi {name ? name : 'there'},
            </Text>
            <Text style={text}>
              Congratulations! Your student account for Koyitech Africa&apos;s <strong>Free Computer &amp; IT Fundamentals</strong> program (Cohort I) has been created.
            </Text>

            <Text style={text}>
              You can now log in anytime using {email ? <strong>{email}</strong> : 'your registered email address'} and the password you created during registration to access your dashboard and attend live classes.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Login &amp; Attend Classes
              </Button>
            </Section>

            <Text style={text}>
              Throughout this 100% free training, you&apos;ll gain hands-on skills in computer operations, office productivity suites, internet &amp; cloud tools, and everyday IT troubleshooting. We&apos;re excited to see you in class!
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Koyitech Africa — Empowering Africa with practical digital and technology skills.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  maxWidth: '600px',
};

const logoImage = {
  margin: '0 auto',
  padding: '0',
  display: 'block',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#181059',
  padding: '0',
  margin: '0',
  marginTop: '-40px',
  textAlign: 'center' as const,
};

const section = {
  padding: '0 48px',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '28px 0',
};

const button = {
  backgroundColor: '#5C4FFF',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};
