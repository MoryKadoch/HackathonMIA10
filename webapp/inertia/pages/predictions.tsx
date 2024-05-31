import { Head } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import Tabs, { Tab } from '~/components/common/tabs/tabs';
import ContentLayout from '~/layout/content_layout';
import { generateSectionGraphOptions } from '~/lib/generate_chart_options';

export default function MedalsPage() {
  const opts = generateSectionGraphOptions({ title: 'Predictions' });
  const labels = Array(10)
    .fill(null)
    .map((_, index) => `Label ${index}`);
  const data = {
    labels,
    datasets: [
      {
        data: Array(10)
          .fill(null)
          .map(() => Math.random() * 100),
        label: 'yes',
      },
    ],
  };

  const tabs: Tab[] = [
    {
      title: 'Modèle IA 1',
      content: <Bar options={opts} data={data} />,
    },
    {
      title: 'Modèle IA 2',
      content: <Bar options={opts} data={data} />,
    },
    {
      title: 'Modèle IA 3',
      content: <Bar options={opts} data={data} />,
    },
    {
      title: 'Modèle IA 4',
      content: <Bar options={opts} data={data} />,
    },
  ];
  return (
    <ContentLayout>
      <Head title="Nos prédictions" />
      <h1>Nos prédictions</h1>
      <p>
        Voici nos prédictions pour les JO Paris 2024, basées sur une analyse
        approfondie des données historiques et l'utilisation de modèles
        d'Intelligence Artificielle.
      </p>
      <Tabs tabs={tabs} />
    </ContentLayout>
  );
}
