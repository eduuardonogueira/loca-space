import { ToastContainer } from "react-toastify";
import "./global.css";
import { Toaster } from "sonner";
import { ThemeInit } from "../../.flowbite-react/init";

export const metadata = {
  title: "Loca Space",
  description: "Sistema de reserva de salas comerciais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans" suppressHydrationWarning>
        <ThemeInit />
        <ToastContainer position="top-right" autoClose={3000} />
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
