import axios from 'axios';

class Service {
  constructor() {
    const service = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  setHeader(name, value) {
    this.service.defaults.headers.common[name] = value;
  }

  removeHeader(name) {
    delete this.service.defaults.headers.common[name];
  }

  handleSuccess(response) {
    return response;
  }

  handleError = error => {
    switch (error.response.status) {
      case 401:
        this.redirectTo(document, '/login');
        localStorage.removeItem(process.env.TOKEN);
        break;
      default:
        return Promise.reject(error);
    }
    return error;
  };

  redirectTo = (document, path) => {
    document.location = path;
  };

  get(endpoint, params) {
    return this.service.get(endpoint, { params });
  }

  post(endpoint, payload) {
    return this.service.request({
      method: 'POST',
      url: endpoint,
      responseType: 'json',
      data: payload,
    });
  }

  put(endpoint, payload) {
    return this.service.request({
      method: 'PUT',
      url: endpoint,
      responseType: 'json',
      data: payload,
    });
  }

  delete(endpoint, payload) {
    return this.service.request({
      method: 'DELETE',
      url: endpoint,
      responseType: 'json',
      data: payload,
    });
  }
}

export default new Service();
