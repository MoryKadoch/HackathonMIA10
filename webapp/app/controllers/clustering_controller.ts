import RestsController from '#controllers/rests_controller';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class ClusteringController {
  constructor(protected restController: RestsController) {}

  async index({ inertia }: HttpContext) {
    const data = await this.clustering();

    return inertia.render('clustering', {
      data
    });
  }

  protected async clustering() {
    let data = await this.restController.makeRequest({ path: '/clustering' });

    return data;
  }
}