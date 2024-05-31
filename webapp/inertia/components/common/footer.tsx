import styled from '@emotion/styled';

const FooterStyle = styled.footer({
  fontSize: '0.9em',
  color: '#888888',
  textAlign: 'center',
  paddingBlock: '0.75em',
  '& a:hover': {
    textDecoration: 'underline',
  },
});

const Footer = ({ className }: { className?: string }) => (
  <FooterStyle className={className}>Projet par l'équipe MIA10</FooterStyle>
);

export default Footer;
