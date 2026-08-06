import AdminGuard from "../../../components/AdminGuard";
import AdminGoogleCalendarPrep from "../../../components/AdminGoogleCalendarPrep";

export const metadata = { title: "Google Calendar", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminGuard><main><section className="section"><div className="container"><div className="eyebrow">Panel administrador</div><h1>Preparación Google Calendar</h1><AdminGoogleCalendarPrep /></div></section></main></AdminGuard>;
}
