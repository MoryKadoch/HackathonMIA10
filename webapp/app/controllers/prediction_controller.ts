import RestsController from '#controllers/rests_controller';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class PredictionController {
  constructor(protected restController: RestsController) {}

  async index({ inertia }: HttpContext) {
    const allPrediction = await this.predict();

    return inertia.render('predictions', {
      allPrediction
    });
  }

  protected async predict() {
    let data = await this.restController.makeRequest({ path: '/predict' });

    return data;
  }
}
