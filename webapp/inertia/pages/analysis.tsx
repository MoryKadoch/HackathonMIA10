import type AnalysisController from '@/app/controllers/analysis_controller';
import { InferPageProps } from '@adonisjs/inertia/types';
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

export default function AnalysisPage({
  dataAnalysis,
}: AnalysisPageProps) {
  const tabs: Tab[] = [
    {
      title: 'Participation par athlète',
      content: (
        <SectionGraphBar
          title="Nombre de participations aux Jeux Olympiques par athlète"
          data={dataAnalysis.participation_athlete}
        />
      ),
    },
    {
      title: 'Médailles par type',
      content: (
        <SectionGraphBar
          title="Répartition des médailles par type"
          data={dataAnalysis.medals_type_count}
        />
      ),
    },
    {
      title: 'Médailles par pays',
      content: (
        <SectionGraphBar
          title="Nombre de médailles par pays"
          data={dataAnalysis.medals_country}
        />
      ),
    },
    {
      title: 'Nombre de médaille',
      content: (
        <SectionGraphBar
          title="Évolution du nombre de médaille au fil du temps"
          data={dataAnalysis.medals_count_evolution}
        />
      ),
    },
    {
      title: 'Performances par saison',
      content: (
        <SectionGraphBar
          title="Comparaison des performances par saison"
          data={dataAnalysis.season_perfomance}
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
  <Bar
    options={generateSectionGraphOptions(options)}
    data={data}
    css={{ width: '100%!important' }}
  />
);

const SectionGraphLine = ({
  data,
  ...options
}: {
  data: ChartData<'line'>;
} & SectionGraphOptions) => (
  <Line
    options={generateSectionGraphOptions(options)}
    data={data}
    css={{ width: '100%!important' }}
  />
);
