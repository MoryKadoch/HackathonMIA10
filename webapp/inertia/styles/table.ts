import { css } from '@emotion/react';

export const tableStyle = css({
  table: {
    height: 'auto',
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '3px',
    overflow: 'hidden',
  },

  'thead th': {
    textAlign: 'center',
    fontWeight: 500,
    backgroundColor: '#dadce0',
  },

  'td, th': {
    padding: '0.45em',
  },

  'th, td': {
    whiteSpace: 'nowrap',
  },

  'tbody > tr:nth-of-type(even)': {
    backgroundColor: '#dadce0',
  },

  'tfoot th': {
    textAlign: 'right',
    fontWeight: 500,
  },
});
