const fetch = require('cross-fetch');

class SistemaLoginClient {
  /**
   * Inicializa o cliente usando apenas a API Key (sem login/senha).
   */
  static async initWithApiKey({ apiUrl = 'http://localhost:5000', apiKey }) {
    const client = new SistemaLoginClient({ apiUrl, apiKey });
    // Busca metadados da chave
    const record = await client._request(`/api/keys/${apiKey}`, { method: 'GET', auth: false });
    client.keyRecord = record;
    // Popula informações do usuário/site
    client.profile = {
      id: record.userId,
      email: record.clientEmail,
    };
    client.projectName = record.projectName;
    client.siteLabel = record.siteLabel;
    return client;
  }

  constructor({ apiUrl = 'http://localhost:5000', apiKey }) {
    if (!apiKey) throw new Error('apiKey é obrigatório');
    this.apiUrl = apiUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
    this.headers = {
      'Content-Type': 'application/json',
      'x-organization-key': this.apiKey
    };
    this.token = null;
  }

  async _request(path, { method = 'GET', body = null, auth = true } = {}) {
    const headers = { ...this.headers };
    if (auth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const response = await fetch(`${this.apiUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (!response.ok) {
      throw new Error(data.message || `HTTP error ${response.status}`);
    }
    return data;
  }

  register({ name, email, password }) {
    return this._request('/api/auth/register', { method: 'POST', body: { name, email, password }, auth: false });
  }

  login({ email, password }) {
    return this._request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false })
      .then(data => { this.token = data.token; return data; });
  }

  logout() {
    return this._request('/api/auth/logout', { method: 'POST' });
  }

  getProfile() {
    return this._request('/api/auth/profile');
  }

  updateProfile({ name, email }) {
    return this._request('/api/auth/update-profile', { method: 'POST', body: { name, email } });
  }

  requestPasswordReset(email) {
    return this._request('/api/auth/forgot-password-request', { method: 'POST', body: { email }, auth: false });
  }

  resetPassword({ email, token, newPassword }) {
    return this._request('/api/auth/forgot-password', { method: 'POST', body: { email, token, newPassword }, auth: false });
  }

  generateApiKey({ email, project, site }) {
    return this._request('/api/keys', { method: 'POST', body: { email, project, site } });
  }

  listApiKeys() {
    return this._request('/api/keys');
  }

  deleteApiKey(key) {
    return this._request(`/api/keys/${key}`, { method: 'DELETE' });
  }

  createSecureData(data) {
    return this._request('/api/secure-data', { method: 'POST', body: { data } });
  }

  getSecureData() {
    return this._request('/api/secure-data');
  }

  deleteSecureData(id) {
    return this._request(`/api/secure-data/${id}`, { method: 'DELETE' });
  }
}

module.exports = { SistemaLoginClient };
