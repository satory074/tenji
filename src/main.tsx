import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { LESSON_ROUTE, routeFromPathname } from './lib/routes';
import './index.css';

const container = document.getElementById('root')!;
const route = routeFromPathname(location.pathname);
const app = (
  <StrictMode>
    <App initialTab={(route ?? LESSON_ROUTE).tab} initialCategory={(route ?? LESSON_ROUTE).category} />
  </StrictMode>
);

// 事前描画した HTML があり、URL が事前描画したページのどれかに当たるときだけ hydrate する。
// それ以外 (npm run dev の空の index.html など) は普通に描く。
if (route && container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
