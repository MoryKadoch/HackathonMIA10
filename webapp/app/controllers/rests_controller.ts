// import type { HttpContext } from '@adonisjs/core/http'

export default class RestsController {
  private apiBaseUrl = 'http://127.0.0.1:5000';

  async makeRequest({
    method = 'GET',
    path,
    body,
  }: {
    method?: RequestInit['method'];
    path: string;
    body?: object | any[];
  }): Promise<any> {
    const url = this.apiBaseUrl + this.pathNormalize(path);
    const request = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: any = await request.json();
    return request.ok ? data : Promise.reject(data?.error);
  }

  private pathNormalize(path: string) {
    if (!path.startsWith('/')) {
      return '/' + path;
    }

    return path;
  }
}
