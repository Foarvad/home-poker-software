import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, theme, config } = createStitches({
  theme: {
    colors: {
      primary: '#0070f3',
      secondary: '#1a202c',
      background: '#f7fafc',
      text: '#2d3748',
      buttonBg: '#007BFF',
      buttonText: '#FFFFFF',
    },
    space: {
      1: '2px',
      2: '4px',
      3: '6px',
      4: '8px',
      5: '12px',
      6: '16px',
      7: '24px',
      8: '32px',
      9: '40px',
      10: '48px',
      11: '72px',
      12: '96px',
      13: '160px',
    },
    fontSizes: {
      1: '12px',
      2: '14px',
      3: '16px',
      4: '18px',
      5: '24px',
      6: '32px',
    },
    shadows: {
      card: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
      button: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
    },
  },
  media: {
    mobile: '(max-width: 640px)',
    tablet: '(min-width: 641px) and (max-width: 1024px)',
    desktop: '(min-width: 1025px)',
  },
});
