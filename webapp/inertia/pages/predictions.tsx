import type PredictionController from '@/app/controllers/prediction_controller';
import { InferPageProps } from '@adonisjs/inertia/types';
import { Head } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import Tabs, { Tab } from '~/components/common/tabs/tabs';
import ContentLayout from '~/layout/content_layout';
import { generateSectionGraphOptions } from '~/lib/generate_chart_options';

type PredictionPageProps = InferPageProps<PredictionController, 'index'>;

export default function PredictionsPage({
  allPrediction
}: PredictionPageProps) {
  const opts = generateSectionGraphOptions({ title: 'Predictions' });

  const tabs: Tab[] = [
    {
      title: 'Modèle Random Forest',
      content: <Bar options={opts} data={allPrediction.data_rf} />,
    },
    {
      title: 'Modèle MLP',
      content: <Bar options={opts} data={allPrediction.data_mlp} />,
    },
    {
      title: 'Modèle SVM',
      content: <Bar options={opts} data={allPrediction.data_svr} />,
    },
    {
      title: 'Modèle pondéré',
      content: <Bar options={opts} data={allPrediction.data_ensemble} />,
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
