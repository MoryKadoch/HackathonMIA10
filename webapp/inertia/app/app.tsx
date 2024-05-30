/// <reference path="../../adonisrc.ts" />

import { resolvePageComponent } from '@adonisjs/inertia/helpers';
import { createInertiaApp } from '@inertiajs/react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { hydrateRoot } from 'react-dom/client';
import { colors } from '~/styles/colors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  PointElement,
  LineElement,
  LineController
);

createInertiaApp({
  progress: { color: colors.primary },

  title: (title) => `${title} - Hackaton MIA10`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx')
    );
  },

  setup({ el, App, props }) {
    hydrateRoot(el, <App {...props} />);
  },
});
