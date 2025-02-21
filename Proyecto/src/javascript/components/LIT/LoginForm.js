import { getAPIData, API_PORT } from '../../index.shopping-list.js';
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';


export class LoginForm extends LitElement {


  static properties = {
    prueba: {type: String},
  };

  get _email() {
    return this.renderRoot?.querySelector('#email') ?? null;
  }

  get _password() {
    return this.renderRoot?.querySelector('#password') ?? null;
  }

  constructor() {
    super();
  }

  render() {
    return html`
    <slot></slot>
    <form id="loginForm" @submit="${this._onFormSubmit}">
      <label>Usuario (${this.prueba}): <input type="text" id="email" placeholder="email" /></label>
      <label>Contraseña: <input type="password" id="password" placeholder="contraseña" /></label>
      <button type="submit" id="loginButton" title="Login">Login</button>
      <slot name="error"></slot>
    </form>
    `;
  }

  async _onFormSubmit(e) {
    e.preventDefault();
    const email = this._email;
    const password = this._password;
    const loginData = {
      email: email.value,
      password: password.value
    }
    let onFormSubmitEvent
    if (loginData.email !== '' && loginData.password !== '') {
      const payload = JSON.stringify(loginData)
      const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload)
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: apiData
      })
    } else {
      onFormSubmitEvent = new CustomEvent("login-form-submit", {
        bubbles: true,
        detail: null
      })
    }

    this.dispatchEvent(onFormSubmitEvent);
  }
}

customElements.define('login-form', LoginForm);