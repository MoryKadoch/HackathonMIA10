import styled from '@emotion/styled';
import { Head } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import ButtonLink from '~/components/common/button_link';
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
  width: '65%',

  [`@media (max-width: ${media.mobile})`]: {
    width: '85%',
  },
});

export default function HomePage() {
  return (
    <ContentLayout>
      <Head title="Homepage" />
      <Hero>
        <HeroImage src="/assets/jo_2024.png" />
      </Hero>
      <div css={{ marginTop: '3rem', textAlign: 'center' }}>
        <ButtonLink
          css={{ marginRight: '.25em' }}
          href={route('predictions').url}
        >
          Découvrir nos prédictions
        </ButtonLink>{' '}
        pour les JO Paris 2024
      </div>
      <div css={{ marginBlock: '2rem' }}>
        <h2>Hackathon</h2>
        <p>
          L'objectif de ce hackathon est d'analyser les données historiques des
          Jeux Olympiques de 1896 à 2020. À partir de cette analyse, nous allons
          utiliser des modèles d'Intelligence Artificielle (Deep Learning et
          Machine Learning) pour prédire les performances des pays et déterminer
          le vainqueur des Jeux Olympiques de Paris 2024.
        </p>
        <br />
        <p>
          Nous espérons que ce projet mettra en lumière les tendances
          historiques et les facteurs clés qui influencent les performances aux
          JO, tout en démontrant la puissance des technologies de l'IA pour
          réaliser des prédictions précises.
        </p>
      </div>
      <OurTeam />
    </ContentLayout>
  );
}
