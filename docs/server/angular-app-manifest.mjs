
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Import_Export_Angular/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/Import_Export_Angular/products",
    "route": "/Import_Export_Angular"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-F2NAIEHT.js"
    ],
    "route": "/Import_Export_Angular/products"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 846, hash: '38e3b1a8cc1898de3427531d339f5efbbd35898a1f8b9a2994160507fb585da2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1013, hash: 'd3adf4cf7e5e522c1341b3dee9c58881deaa0ad64bb3ae3c5f1b8c58d550dd78', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'products/index.html': {size: 65108, hash: 'c28bf351771f0e8e40357c9c007b4553d32523fcbc4f942706635ffdb095b55d', text: () => import('./assets-chunks/products_index_html.mjs').then(m => m.default)},
    'styles-DA2JKJB5.css': {size: 13281, hash: 'URSn8VCJVUw', text: () => import('./assets-chunks/styles-DA2JKJB5_css.mjs').then(m => m.default)}
  },
};
