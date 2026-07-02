import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface BroadcastEmailProps {
  subject: string;
  body: string;
}

export const BroadcastEmail = ({
  subject = 'Update from Koyitech Africa',
  body = 'Hello there, this is a message from Koyitech Africa.',
}: BroadcastEmailProps) => {
  // Split the body into paragraphs for rendering
  const paragraphs = body.split('\n').filter(p => p.trim() !== '');

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>KOYITECH AFRICA</Text>
          </Section>
          
          <Section style={content}>
            <Heading style={title}>{subject}</Heading>
            
            {paragraphs.map((text, idx) => (
              <Text key={idx} style={paragraph}>
                {text}
              </Text>
            ))}
            
            <Text style={signoff}>
              Best regards,<br />
              The Koyitech Africa Team
            </Text>
          </Section>
          
          <Section style={footer}>
            <Text style={footerText}>
              You received this email because you are on the Koyitech Africa waitlist.
              <br />
              © {new Date().getFullYear()} Koyitech Africa. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

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
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
};

const header = {
  backgroundColor: '#181059',
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: '0',
};

const content = {
  padding: '32px 48px',
};

const title = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#181059',
  marginBottom: '24px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#3c4043',
  marginBottom: '16px',
};

const signoff = {
  ...paragraph,
  marginTop: '32px',
  fontWeight: '600',
};

const footer = {
  padding: '0 48px',
  borderTop: '1px solid #eaeaec',
  paddingTop: '24px',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#8898aa',
};

export default BroadcastEmail;
