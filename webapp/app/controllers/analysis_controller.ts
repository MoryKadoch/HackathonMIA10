import RestsController from '#controllers/rests_controller';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class AnalysisController {
  constructor(protected restController: RestsController) {}

  async index({ inertia }: HttpContext) {
    const dataAnalysis = await this.analysis();

    return inertia.render('analysis', {
      dataAnalysis,
    });
  }

  protected async analysis() {
    return await this.restController.makeRequest({ path: '/analysis' });
  }
}
