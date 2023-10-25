import { styled } from "../../stitches.config";

export const Button = styled('button', {
  backgroundColor: '#007BFF',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '8px',
  boxShadow: '$button',
  border: 'none',
  cursor: 'pointer',
  variants: {
    variant: {
      positive: {
        backgroundColor: '#4CAF50',
        '&:hover': {
          backgroundColor: '#45a049',
        },
      },
      critical: {
        backgroundColor: '#f44336',
        '&:hover': {
          backgroundColor: '#d32f2f',
        },
      },
      warning: {
        backgroundColor: '#ff9800',
        '&:hover': {
          backgroundColor: '#e68a00',
        },
      },
    },
  },
  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:active': {
    backgroundColor: '#004085',
  },
  '@media $mobile': {
    marginTop: '8px',
    alignSelf: 'flex-end',
  },
  '@media $tablet': {
    marginTop: '0',
    alignSelf: 'center',
  },
  '@media $desktop': {
    marginTop: '0',
    alignSelf: 'center',
  },
  '&[disabled]': {
    backgroundColor: '#c0c0c0',
    cursor: 'not-allowed',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#c0c0c0',
    },
  },
});