import { html, LitElement, type CSSResultGroup, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../components/head'
import '../components/card'

@customElement('cards-section')
export class CardsSectionElement extends LitElement {
  static styles?: CSSResultGroup = css`
    a-card {
      display: flex;
      flex-direction: column;
      gap: var(--md);
    }

    a-text {
      font-weight: 600;
    }

    a-flex {
      margin-top: var(--lg);
    }
  `

  protected render() {
    return html`
      <a-head level="3"> Cards Preview </a-head>

      <a-card variant="default">
        <a-text>Sample card title</a-text>

        <a-input name="firstName" placeholder="Enter your name" label="First Name"></a-input>

        <a-flex gap="4" justify="end">
          <a-button color="destructive"> Reject </a-button>

          <a-button> Accept </a-button>
        </a-flex>
      </a-card>

      <a-head level="3">Glassified Card (Not working, TODO)</a-head>

      <a-card variant="glass">
        <a-text>Sample card title</a-text>

        <a-input name="firstName" placeholder="Enter your name" label="First Name"></a-input>

        <a-flex gap="4" justify="end">
          <a-button color="destructive"> Reject </a-button>

          <a-button> Accept </a-button>
        </a-flex>
      </a-card>
    `
  }
}
