import type ClusteringController from '@/app/controllers/clustering_controller';
import { InferPageProps } from '@adonisjs/inertia/types';
import { Head } from '@inertiajs/react';
import { Scatter } from 'react-chartjs-2';
import Tabs, { Tab } from '~/components/common/tabs/tabs';
import ContentLayout from '~/layout/content_layout';
import { generateSectionGraphOptions } from '~/lib/generate_chart_options';

type ClusteringPageProps = InferPageProps<ClusteringController, 'index'>;

export default function PredictionsPage({
  data
}: ClusteringPageProps) {
  const opts = generateSectionGraphOptions({ title: 'Clustering' });

  const tabs: Tab[] = [
    {
      title: 'Modèle Kmeans',
      content: <Scatter options={opts} data={data.kmeans} />,
    },
    {
      title: 'Modèle Kmeans sans outliers',
      content: <Scatter options={opts} data={data.kmeans_outliers} />,
    },
    {
      title: 'Modèle Kmeans Été',
      content: <Scatter options={opts} data={data.kmeans_summer} />,
    },
    {
      title: 'Modèle Kméans Hiver',
      content: <Scatter options={opts} data={data.kmeans_winter} />,
    },
    {
      title: 'Modèle GMM',
      content: <Scatter options={opts} data={data.gmm} />,
    },
    {
      title: 'Modèle DBSCAN',
      content: <Scatter options={opts} data={data.dbscan} />,
    },
  ];
  return (
    <ContentLayout>
      <Head title="Nos prédictions" />
      <h1>Clusterisation</h1>
      <Tabs tabs={tabs} />
    </ContentLayout>
  );
}
