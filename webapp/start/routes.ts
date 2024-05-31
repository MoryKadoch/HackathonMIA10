/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';

const AnalysisController = () => import('#controllers/analysis_controller');

router.on('/').renderInertia('home').as('home');

router
  .on('/olympic-predictions')
  .renderInertia('predictions')
  .as('predictions');
router.get('/olympic-analysis', [AnalysisController, 'index']).as('analysis');
router.on('/faq').renderInertia('faq').as('faq');
