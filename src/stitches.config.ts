import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, theme, config } = createStitches({
  theme: {
    colors: {
      primary: '#007BFF',
      secondary: '#1a202c',
      background: '#f7fafc',
      text: '#343a40',
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
