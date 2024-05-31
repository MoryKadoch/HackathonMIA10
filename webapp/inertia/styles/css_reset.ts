import { css } from '@emotion/react';

const cssReset = css({
  '*': {
    boxSizing: 'border-box',
    outline: 0,
    margin: 0,
    padding: 0,
    scrollBehavior: 'smooth',
  },

  '.reset': {
    backgroundColor: 'inherit',
    color: 'inherit',
    padding: 0,
    margin: 0,
    border: 0,
  },

  a: {
    width: 'fit-content',
    color: 'purple',
    textDecoration: 'none',
    borderBottom: '1px solid transparent',

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  b: {
    fontWeight: 600,
    letterSpacing: '0.5px',
  },

  'h1, h2, h3, h4, h5, h6': {
    fontWeight: '500',
    color: 'purple',
    marginBottom: '0.5rem',
  },

  h1: {
    fontSize: '2em',
  },

  h2: {
    fontSize: '1.75em',
  },

  h3: {
    fontSize: '1.5em',
  },

  kbd: {
    textShadow: '0 1px 0 #fff',
    fontSize: '12px',
    color: 'rgb(51, 51, 51)',
    backgroundColor: 'rgb(247, 247, 247)',
    padding: '0.25em 0.5em',
    borderRadius: '3px',
    border: '1px solid rgb(204, 204, 204)',
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.2), 0 0 0 2px #ffffff inset',
    display: 'inline-block',
  },

  hr: {
    color: 'purple',
    width: '100%',
    marginBlock: '1em',
  },
});

export default cssReset;
