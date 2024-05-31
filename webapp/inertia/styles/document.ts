import { css } from '@emotion/react';
import { colors } from '~/styles/colors';

const documentStyle = css({
  'html, body, #app': {
    height: '100svh',
    width: '100%',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px',
    color: colors.font,
    backgroundColor: colors.background,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    scrollbarGutter: 'stable both-edges',
  },
});

export default documentStyle;
