import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './index'
import './theme-provider'

@customElement('my-element')
export class MyElement extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    return html`
      <a-container>
        <a-head>Buttons</a-head>
        <a-text>Declare and use buttons like this</a-text>
        <a-button>Hello World</a-button>
        <a-button variant="secondary">Hello World</a-button>
        <a-button color="secondary">Hello World</a-button>

        <a-card variant="glass">
          <div>
            <div slot="header">Card title</div>
            <div slot="description">Muted supporting text</div>
            <div slot="footer">
              <a-button size="sm">Action</a-button>
            </div>
          </div>
        </a-card>

        <a-card>
          <div slot="header">Sign in</div>

          <a-input placeholder="Email"></a-input>
          <a-input type="password" placeholder="Password"></a-input>

          <div slot="footer">
            <a-button size="sm">Login</a-button>
          </div>
        </a-card>

        <a-tabs>
          <a-tab value="account">Account</a-tab>
          <a-tab value="security">Security</a-tab>
          <a-tab value="billing">Billing</a-tab>

          <a-tab-panel slot="panel" value="account"> Account content </a-tab-panel>

          <a-tab-panel slot="panel" value="security"> Security content </a-tab-panel>

          <a-tab-panel slot="panel" value="billing"> Billing content </a-tab-panel>
        </a-tabs>
        <a-separator></a-separator>
      </a-container>
    `
  }

  static styles = css``
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
