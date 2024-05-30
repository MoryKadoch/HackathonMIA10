import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { FaExternalLinkAlt, FaGithub, FaLinkedin } from 'react-icons/fa';
import Avatar from '~/components/common/avatar';
import ExternalLink from '~/components/common/external_link';
import InlineList from '~/components/common/inline_list';
import UnstyledList from '~/components/common/unstyled_list';
import { TEAM_MEMBERS } from '~/constants/team';

const TeamList = styled(UnstyledList)({
  margin: '2em !important',
  display: 'flex',
  gap: '3em',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',

  '& svg': {
    transition: '.15s',
  },
  '& svg:hover': {
    transform: 'scale(1.15)',
  },
});

const Name = styled.p({
  fontWeight: 500,
});

const OurTeam = () => (
  <div>
    <h2>Notre équipe</h2>
    <TeamList>
      {TEAM_MEMBERS.map(({ name, avatarUrl, networks }) => (
        <li
          key={name}
          css={{
            display: 'flex',
            gap: '.5rem',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Avatar src={avatarUrl} size={192} />
          <Name>{name}</Name>
          <InlineList>
            {networks?.map((network) => <NetworkItem {...network} />)}
          </InlineList>
        </li>
      ))}
    </TeamList>
  </div>
);

const NetworkItem = ({ url, type }: Network) => (
  <ExternalLink href={url}>{getIconFromType(type)}</ExternalLink>
);

function getIconFromType(type: Network['type']): ReactNode {
  switch (type) {
    case 'github':
      return <FaGithub size={24} />;
    case 'personnal_website':
      return <FaExternalLinkAlt size={20} />;
    case 'linkedin':
      return <FaLinkedin size={24} />;
  }
}

export default OurTeam;
