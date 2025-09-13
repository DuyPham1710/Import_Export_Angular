
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/import-export/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/import-export/products",
    "route": "/import-export"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-F2NAIEHT.js"
    ],
    "route": "/import-export/products"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 838, hash: 'e2ba1c1e9dad06c42d1a44de935940e6982969f06e0f789daca25a44f310f493', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1005, hash: 'ed1f46843f53499ea2e6a4e23a21fe43035f4b2d8d982eceea6cc578d279f346', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'products/index.html': {size: 65100, hash: '18d97bd73363bd9060d91276215af487794add28dc8bb3be095d7396c10c5b52', text: () => import('./assets-chunks/products_index_html.mjs').then(m => m.default)},
    'styles-DA2JKJB5.css': {size: 13281, hash: 'URSn8VCJVUw', text: () => import('./assets-chunks/styles-DA2JKJB5_css.mjs').then(m => m.default)}
  },
};
