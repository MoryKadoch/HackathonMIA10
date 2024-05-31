import AvatarAL from '@/public/assets/avatars/antoine_lecoffre.png';
import AvatarCJ from '@/public/assets/avatars/clement_julia.svg';
import AvatarMK from '@/public/assets/avatars/mory_kadoch.png';
import AvatarNT from '@/public/assets/avatars/nicky_thaing.svg';
import AvatarSL from '@/public/assets/avatars/sonny_lallier.svg';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Antoine LECOFFRE',
    avatarUrl: AvatarAL,
    networks: [
      {
        type: 'github',
        url: 'https://github.com/YukiLand',
      },
      {
        type: 'linkedin',
        url: 'https://www.linkedin.com/in/antoine-lecoffre/',
      },
    ],
  },
  {
    name: 'Clement JULIA',
    avatarUrl: AvatarCJ,
    networks: [
      {
        type: 'github',
        url: 'https://github.com/Clement-Julia',
      },
    ],
  },
  {
    name: 'MORY KADOCH',
    avatarUrl: AvatarMK,
    networks: [
      {
        type: 'github',
        url: 'https://github.com/MoryKadoch',
      },
    ],
  },
  {
    name: 'Nicky THAING',
    avatarUrl: AvatarNT,
    networks: [
      {
        type: 'github',
        url: 'https://github.com/Yikkme',
      },
    ],
  },
  {
    name: 'Sonny LALLIER',
    avatarUrl: AvatarSL,
    networks: [
      {
        type: 'github',
        url: 'https://github.com/Sonny93',
      },
      { type: 'personnal_website', url: 'https://www.sonny.dev/' },
      { type: 'linkedin', url: 'https://www.linkedin.com/in/sonnylallier/' },
    ],
  },
];
