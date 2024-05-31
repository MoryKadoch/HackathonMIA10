import styled from '@emotion/styled';
import { Link } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import ExternalLink from '~/components/common/external_link';
import UnstyledList from '~/components/common/unstyled_list';
import { GITHUB_REPO, NOTION, TRELLO } from '~/constants/links';
import { media } from '~/styles/media_queries';

type NavbarListDirection = {
  right?: boolean;
};

const Nav = styled.nav({
  width: '100%',
  padding: '0.75em 0',
  display: 'flex',
  gap: '0.5em',
  alignItems: 'center',
  justifyContent: 'space-between',

  [`@media (max-width: ${media.mobile})`]: {
    padding: 0,
    alignItems: 'flex-start',
  },
});

const NavList = styled(UnstyledList)<NavbarListDirection>(({ right }) => ({
  display: 'flex',
  gap: '1.5em',
  justifyContent: right ? 'flex-end' : 'flex-start',
  transition: '0.15s',

  '& li': {
    display: 'flex',
    alignItems: 'center',
  },

  [`@media (max-width: ${media.mobile})`]: {
    gap: '0.5em',
    alignItems: right ? 'flex-end' : 'flex-start',
    flexDirection: 'column',
  },
}));

const BrandItem = styled(Link)({
  fontSize: '1.5rem',

  [`@media (max-width: ${media.mobile})`]: {
    fontSize: '1.25rem',
  },
});

const Navbar = () => (
  <Nav>
    <NavList>
      <li>
        <BrandItem href={route('home').url}>Hackathon MIA10</BrandItem>
      </li>
      <li>
        <Link href={route('predictions').url}>Nos prédictions</Link>
      </li>
      <li>
        <Link href={route('clustering').url}>Clustering</Link>
      </li>
      <li>
        <Link href={route('analysis').url}>Analyses de données</Link>
      </li>
      <li>
        <Link href={route('faq').url}>FAQ</Link>
      </li>
    </NavList>
    <NavList right>
      <li>
        <ExternalLink href={GITHUB_REPO}>GitHub</ExternalLink>
      </li>
      <li>
        <ExternalLink href={NOTION}>Notion</ExternalLink>
      </li>
      <li>
        <ExternalLink href={TRELLO}>Trello</ExternalLink>
      </li>
    </NavList>
  </Nav>
);

export default Navbar;
