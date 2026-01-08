import { LitElement, html, css } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'

@customElement('a-tabs')
export class TabsElement extends LitElement {
  @property()
  value = ''

  @queryAssignedElements({ selector: 'a-tab' })
  tabs!: HTMLElement[]

  static styles = css`
    :host {
      display: block;
    }

    .list {
      position: relative;
      display: inline-flex;
      gap: 0.25rem;
      padding: 0.25rem;
      border-radius: var(--radius);
      background: color-mix(in oklch, var(--background) 75%, transparent);
      backdrop-filter: blur(12px);
    }

    .indicator {
      position: absolute;
      inset: 0 auto 0 0;
      height: calc(100% - 0.5rem);
      margin: 0.25rem;
      border-radius: calc(var(--radius) - 0.125rem);
      background: var(--primary);
      transition:
        transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
        width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 0;
    }

    ::slotted(a-tab) {
      position: relative;
      z-index: 1;
    }
  `

  updated() {
    if (!this.value && this.tabs.length) {
      this.value = this.tabs[0].value
    }
    this.updateIndicator()
    this.updatePanels()
  }

  updateIndicator() {
    const active = this.tabs.find((t) => t.value === this.value)
    const indicator = this.renderRoot.querySelector('.indicator') as HTMLElement
    if (!active || !indicator) return

    indicator.style.width = `${active.offsetWidth}px`
    indicator.style.transform = `translateX(${active.offsetLeft}px)`
  }

  updatePanels() {
    const panels = this.querySelectorAll('a-tab-panel')
    panels.forEach((p) => p.toggleAttribute('active', p.value === this.value))
  }

  render() {
    return html`
      <div class="list">
        <div class="indicator"></div>
        <slot @click=${this.onClick}></slot>
      </div>
      <slot name="panel"></slot>
    `
  }

  onClick(e: Event) {
    const tab = (e.target as HTMLElement).closest('a-tab') as any
    if (tab?.value) this.value = tab.value
  }
}

@customElement('a-tab')
export class TabElement extends LitElement {
  @property()
  value = ''

  static styles = css`
    button {
      height: 2rem;
      padding: 0 0.75rem;
      border-radius: calc(var(--radius) - 0.125rem);
      background: transparent;
      color: var(--muted-foreground);
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    :host([active]) button {
      color: var(--primary-foreground);
    }
  `

  render() {
    return html`<button><slot></slot></button>`
  }
}

@customElement('a-tab-panel')
export class TabPanelElement extends LitElement {
  @property()
  value = ''

  static styles = css`
    :host {
      display: block;
    }

    .panel {
      opacity: 0;
      transform: translateY(4px);
      pointer-events: none;
      transition:
        opacity 0.2s ease,
        transform 0.2s ease;
    }

    :host([active]) .panel {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  `

  render() {
    return html`
      <div class="panel">
        <slot></slot>
      </div>
    `
  }
}
