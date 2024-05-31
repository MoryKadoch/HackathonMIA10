import { ChartOptions } from 'chart.js';

export interface SectionGraphOptions {
  title: string;
  horizontal?: boolean;
}

export const generateSectionGraphOptions = ({
  title,
  horizontal = false,
}: SectionGraphOptions): ChartOptions<any> => ({
  plugins: {
    title: {
      display: true,
      text: title,
    },
    legend: {
      display: false,
    },
  },
  responsive: true,
  indexAxis: horizontal ? 'y' : 'x',
});
