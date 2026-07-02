import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from '@react-email/components';

export const WelcomeEmail = () => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to Koyitech Africa! 🚀</Heading>
          
          <Section style={section}>
            <Text style={text}>
              Hi there,
            </Text>
            <Text style={text}>
              Thank you for joining our waitlist. You are now on the priority list for our upcoming cohort and have claimed your exclusive 50% early-bird discount on all courses.
            </Text>

            <Text style={text}>
              We're thrilled to have you onboard. Keep an eye on your inbox, as we'll notify you as soon as the cohort officially opens!
            </Text>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            Koyitech Africa - Master high-demand skills, build real-world projects, and get mentored by industry experts.
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

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#181059',
  padding: '17px 0 0',
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
