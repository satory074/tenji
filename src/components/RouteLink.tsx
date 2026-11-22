import type { MouseEvent, ReactNode } from 'react';
import { routeHref, type Route } from '../lib/routes';

// サイト内のページへのリンク。本物の <a href> なので、クローラーも新しいタブで開く操作もそのまま使える。
// 普通のクリックだけ横取りして、ページを読み直さずに切り替える (history.pushState)。
export function RouteLink({
  to,
  current,
  onNavigate,
  className,
  children,
}: {
  to: Route;
  current: boolean;
  onNavigate: (to: Route) => void;
  className?: string;
  children: ReactNode;
}) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavigate(to);
  }
  return (
    <a href={routeHref(to)} onClick={onClick} aria-current={current ? 'page' : undefined} className={className}>
      {children}
    </a>
  );
}
