/// <reference path="../../adonisrc.ts" />

import { hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers';

createInertiaApp({
  progress: { color: '#5468FF' },

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
