import { styled } from "../../stitches.config";

export const Button = styled('button', {
  backgroundColor: '$buttonBg',
  color: '$buttonText',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '8px',
  boxShadow: '$button',
  border: 'none',
  cursor: 'pointer',
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
});
