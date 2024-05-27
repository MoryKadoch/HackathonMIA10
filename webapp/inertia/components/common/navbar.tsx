import styled from '@emotion/styled';
import { Link } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import ExternalLink from '~/components/common/external_link';
import UnstyledList from '~/components/common/unstyled_list';
import { GITHUB_REPO } from '~/constants/links';

type NavbarListDirection = {
  right?: boolean;
};

const Nav = styled.nav({
  width: '100%',
  padding: '0.75em 0',
  display: 'flex',
  alignItems: 'center',
});

const NavList = styled(UnstyledList)<NavbarListDirection>(({ right }) => ({
  display: 'flex',
  flex: 1,
  gap: '1.5em',
  justifyContent: right ? 'flex-end' : 'flex-start',
  transition: '0.15s',

  '& li': {
    display: 'flex',
    alignItems: 'center',
  },
}));

const Navbar = () => (
  <Nav>
    <NavList>
      <li>
        <Link href={route('home').url} css={{ fontSize: '24px' }}>
          Hackathon MIA10
        </Link>
      </li>
    </NavList>
    <NavList right>
      <li>
        <ExternalLink href={GITHUB_REPO}>GitHub</ExternalLink>
      </li>
    </NavList>
  </Nav>
);

export default Navbar;
