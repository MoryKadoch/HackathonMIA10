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
const PredictionController = () => import('#controllers/prediction_controller');
const ClusteringController = () => import('#controllers/clustering_controller');

router.on('/').renderInertia('home').as('home');
router.get('/olympic-analysis', [AnalysisController, 'index']).as('analysis');
router.get('/olympic-prediction', [PredictionController, 'index']).as('predictions');
router.get('/olympic-clustering', [ClusteringController, 'index']).as('clustering');
router.on('/faq').renderInertia('faq').as('faq');
