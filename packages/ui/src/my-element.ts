import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import './index'
import './composables/card-section'
import './composables/dialog-section'
import './composables/grids-section'
import './composables/tabs-section'
import './theme-provider'

@customElement('my-element')
export class MyElement extends LitElement {
  render() {
    return html`
      <a-container>
        <a-head level="1"> Aura UI Design Components Preview </a-head>

        <a-separator></a-separator>

        <cards-section></cards-section>
        <dialog-section></dialog-section>

        <a-separator></a-separator>
        <tabs-section></tabs-section>
        <grids-section></grids-section>
      </a-container>
    `
  }

  static styles = css`

  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
