import type AnalysisController from '@/app/controllers/analysis_controller';
import { InferPageProps } from '@adonisjs/inertia/types';
import styled from '@emotion/styled';
import { Head } from '@inertiajs/react';
import { ChartData } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import Tabs, { Tab } from '~/components/common/tabs/tabs';
import ContentLayout from '~/layout/content_layout';
import {
  SectionGraphOptions,
  generateSectionGraphOptions,
} from '~/lib/generate_chart_options';

type AnalysisPageProps = InferPageProps<AnalysisController, 'index'>;

const Section = styled.section({
  marginBlock: '1em',
  borderBottom: '#dadce0',
});

export default function AnalysisPage({
  totalParticipations,
  medalDistribution,
  medalsByCountry,
  evolutionOfMedalsTimeline,
}: AnalysisPageProps) {
  const tabs: Tab[] = [
    {
      title: 'Médailles par pays',
      content: (
        <SectionGraphBar
          title="Nombre de médailles par pays (Top 10)"
          data={medalsByCountry}
          horizontal
        />
      ),
    },
    {
      title: 'Médailles par type',
      content: (
        <SectionGraphBar
          title="Répartition des médailles par type"
          data={medalDistribution}
        />
      ),
    },
    {
      title: 'Participations par athlète',
      content: (
        <SectionGraphBar
          title="Nombre de participations aux Jeux Olympiques par athlète"
          data={totalParticipations}
        />
      ),
    },
    {
      title: 'Section 4',
      content: (
        <SectionGraphLine
          title="Évolution du nombre de médailles au fil du temps"
          data={evolutionOfMedalsTimeline}
        />
      ),
    },
  ];

  return (
    <ContentLayout>
      <Head title="Analyses de données" />
      <h1>Analyses de données</h1>
      <p>Liste des données après analyse</p>
      <Tabs tabs={tabs} />
    </ContentLayout>
  );
}

const SectionGraphBar = ({
  data,
  ...options
}: {
  data: ChartData<'bar'>;
} & SectionGraphOptions) => (
  <Section>
    <Bar
      options={generateSectionGraphOptions(options)}
      data={data}
      css={{ width: '100%!important' }}
    />
  </Section>
);

const SectionGraphLine = ({
  data,
  ...options
}: {
  data: ChartData<'line'>;
} & SectionGraphOptions) => (
  <Section>
    <Line
      options={generateSectionGraphOptions(options)}
      data={data}
      css={{ width: '100%!important' }}
    />
  </Section>
);
