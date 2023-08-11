// @ts-ignore: BaseCSS isn't actually used as a var anywhere, and TS is complaining.
import { BaseCSS } from 'wired-elements';
import 'wired-elements/lib/wired-card.js';

const HeaderLink = ({ title, href }: { title: string; href: string }) => {
  const { pathname } = window.location;

  return (
    <wired-card class={pathname === href ? "bg-background" : "bg-secondary"}>
      <a href={href} class="font-handlee text-highlight-select font-black text-xl">{title}</a>
    </wired-card>
  )
}

const links = [
  { title: 'About', href: '/about' },
  { title: 'Posts', href: '/posts' },
];

export const Navigation = () => {

  return (
    <div class="gap-1 flex" id="navigation">
      { links.map(l => <HeaderLink title={l.title} href={l.href} />) }
    </div>
  );
};