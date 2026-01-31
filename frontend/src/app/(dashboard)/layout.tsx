import { Navbar, ProfileModal } from "@/components/index";
import { ProfileModalProvider } from "@/contexts/profileModal/profileModal.provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileModalProvider>
      <Navbar />
      <ProfileModal />
      {children}
    </ProfileModalProvider>
  );
}

