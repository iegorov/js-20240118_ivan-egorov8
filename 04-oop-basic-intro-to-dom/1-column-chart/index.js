export default class ColumnChart {
  chartHeight = 50;
  element;
  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = (value) => value,
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = this.createElement(this.createTemplate());
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;

    return this.data.map((item) => {
      return {
        percent: ((item / maxValue) * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale)),
      };
    });
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createLinkTemplate() {
    if (!this.link) {
      return '';
    }
    return `
      <a href="${this.link}" class="column-chart__link">View all</a>
    `;
  }

  createChartBodyTemplate() {
    return this.getColumnProps()
      .map(({ value, percent }) => {
        return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
      })
      .join('');
  }

  createChartClasses() {
    return this.data.length
      ? 'column-chart'
      : 'column-chart column-chart_loading';
  }

  createTemplate() {
    return `
    <div class="${this.createChartClasses()}" style="--chart-height: 50">
      <div class="column-chart__title">
        ${this.label}
        ${this.createLinkTemplate()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.createChartBodyTemplate()}
        </div>
      </div>
    </div>
    `;
  }

  update(newData) {
    this.data = newData;
    this.element.querySelector('[data-element="body"]').innerHTML = this.createChartBodyTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
