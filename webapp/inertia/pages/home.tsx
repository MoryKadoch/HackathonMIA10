import styled from '@emotion/styled';
import { Head } from '@inertiajs/react';
import OurTeam from '~/components/home/our_team';
import ContentLayout from '~/layout/content_layout';
import { media } from '~/styles/media_queries';

const Hero = styled.div({
  marginInline: 'auto',
  display: 'flex',
  justifyContent: 'center',

  [`@media (max-width: ${media.mobile})`]: {
    width: '100%',
    paddingInline: '1em',
  },
});

const HeroImage = styled.img({
  height: 'auto',
  width: '45%',

  [`@media (max-width: ${media.mobile})`]: {
    width: '85%',
  },
});

export default function HomePage() {
  return (
    <ContentLayout>
      <Head title="Homepage" />
      <Hero>
        <HeroImage src="/assets/jo_2024.webp" />
      </Hero>
      <div css={{ marginBlock: '2rem' }}>
        <h2>Hackathon</h2>
        <p css={{ fontSize: '1.15rem' }}>
          L'objectif de ce hackathon organisé par l'école IPSSI est d'analyser
          les données des JO depuis 1896 à 2020 dans l'optique de pouvoir en
          tirer des conclusions. <br /> Dans un second temps, nous devions faire
          des prédictions à l'aide de modèles d'Intelligence Artificielle (Deep
          Learning et Machine Learning).
        </p>
      </div>
      <OurTeam />
    </ContentLayout>
  );
}
