import { styled } from '../../stitches.config';

export const Layout = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#F5F5F5',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
});

export const Header = styled('header', {
  backgroundColor: '#FFFFFF',
  padding: '0 24px',
  height: '100px',
  borderBottom: '1px solid #E0E0E0',
  fontSize: '24px',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const Main = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px',
  gap: '16px',
  flex: 1,
});
