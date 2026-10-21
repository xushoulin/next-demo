import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import CookieConsent from "../components/CookieConsent";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-950 text-slate-200">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CookieConsent />
    </div>
  );
}
