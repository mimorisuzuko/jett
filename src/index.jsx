import { createRoot } from 'react-dom/client';

const { default: App } = require('./components/App');
const root = createRoot(document.querySelector('main'));

root.render(<App />);
