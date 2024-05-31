import RestsController from '#controllers/rests_controller';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class AnalysisController {
  constructor(protected restController: RestsController) {}

  async index({ inertia }: HttpContext) {
    const totalParticipations = this.totalParticipations();
    const medalDistribution = this.medalDistribution();
    const medalsByCountry = this.medalsByCountry();
    const evolutionOfMedalsTimeline = this.evolutionOfMedalsTimeline();

    return inertia.render('analysis', {
      totalParticipations,
      medalDistribution,
      medalsByCountry,
      evolutionOfMedalsTimeline,
    });
  }

  protected totalParticipations() {
    return this.generateRandomData(10);
  }

  protected medalDistribution() {
    return this.generateRandomData(3);
  }

  protected medalsByCountry() {
    return this.generateRandomData(10);
  }

  protected evolutionOfMedalsTimeline() {
    return this.generateRandomData(30);
  }

  protected ageDistributionOfAthletes() {}

  private generateRandomData(count: number) {
    const labels = Array(count)
      .fill(null)
      .map((_, index) => `Label ${index}`);

    return {
      labels,
      datasets: [
        {
          data: Array(count)
            .fill(null)
            .map(() => Math.random() * 100),
        },
      ],
    };
  }
}
