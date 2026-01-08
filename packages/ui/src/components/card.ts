import { css, html, LitElement, type CSSResultGroup } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('a-card')
export class CardElement extends LitElement {
  @property()
  variant: 'default' | 'glass' = 'glass'

  static styles: CSSResultGroup = css`
    :host {
      display: block;
    }

    .card {
      --card-bg: color-mix(in oklch, var(--background) 75%, transparent);

      --card-border: color-mix(in oklch, var(--border) 60%, transparent);

      background: var(--card-bg);
      color: var(--foreground);
      border-radius: var(--radius);
      border: 1px solid var(--card-border);
      box-shadow:
        0 1px 2px oklch(0 0 0 / 0.06),
        0 8px 30px oklch(0 0 0 / 0.08);
      padding: 1.25rem;
      transition: all 0.2s ease;
    }

    /* glass variant */
    .card[data-variant='glass'] {
      backdrop-filter: blur(16px) saturate(1.4);
      -webkit-backdrop-filter: blur(16px) saturate(1.4);
    }

    /* solid fallback */
    .card[data-variant='default'] {
      backdrop-filter: none;
      background: var(--background);
    }
  `

  render() {
    return html`
      <div class="card" data-variant=${this.variant}>
        <slot></slot>
      </div>
    `
  }
}
