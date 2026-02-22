import { Navbar, RequireAuth } from "@/components/index";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <Navbar />
      {children}
    </RequireAuth>
  );
}