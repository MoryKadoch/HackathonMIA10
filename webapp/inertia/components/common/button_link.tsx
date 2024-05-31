import styled from '@emotion/styled';
import { Link } from '@inertiajs/react';
import { colors } from '~/styles/colors';

const ButtonLink = styled(Link)({
  fontSize: '.9rem',
  borderRadius: '3px',
  color: colors.white,
  padding: '0.35rem .75rem',
  display: 'inline-block',
  backgroundColor: colors.primary,
  transition: '.15s',

  '&:hover': {
    textDecoration: 'none',
    boxShadow: '3px 5px 15px -4px rgba(102, 102, 102, 0.75)',
    transform: 'scale(1.05)',
  },
});

export default ButtonLink;
