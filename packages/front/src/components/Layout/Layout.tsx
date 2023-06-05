import { styled } from '../../stitches.config';

export const Layout = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#F5F5F5',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  padding: '$2',
  '@tablet': {
    padding: '$3',
  },
  '@desktop': {
    padding: '$4',
  },
});

export const Header = styled('header', {
  backgroundColor: '#FFFFFF',
  padding: '24px',
  borderBottom: '1px solid #E0E0E0',
  fontSize: '24px',
  fontWeight: 'bold',
});

export const Main = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px',
  flex: 1,
});
