import { Link } from 'react-router-dom';
import logo from '../../assets/images/plainb-logo.svg';
import { PageContainer } from '../common/PageContainer.tsx';

const groups: Array<{ title: string; links: Array<[string, string]> }> = [
  { title: 'Shop', links: [['All products', '/search'], ['Cart', '/cart'], ['Wishlist', '/account/wishlist']] },
  { title: 'Help', links: [['Support', '/support'], ['How to buy', '/how-to-buy'], ['FAQ', '/faq'], ['Complaints', '/complaints']] },
  { title: 'Policies', links: [['Terms', '/terms'], ['Privacy', '/privacy'], ['Refund policy', '/refund'], ['About', '/about']] },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-navy-950 text-navy-200">
      <PageContainer className="grid gap-10 py-14 md:grid-cols-[1.4fr_2fr]">
        <div>
          <img src={logo} alt="PlainB" className="h-10 brightness-0 invert" />
          <p className="mt-5 max-w-sm text-sm leading-7">A focused ecommerce experience for discovering products and managing orders. Verified company contact details are pending approval.</p>
          <div className="mt-5 rounded-xl border border-navy-700 bg-navy-900 p-4 text-xs">
            Payments are securely processed through the configured Stripe Checkout flow.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="font-extrabold text-white">{group.title}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {group.links.map(([label, to]) => <li key={to}><Link className="hover:text-brand-400" to={to}>{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </PageContainer>
      <div className="border-t border-navy-800 py-5 text-center text-xs">© {new Date().getFullYear()} PlainB. All rights reserved.</div>
    </footer>
  );
}
