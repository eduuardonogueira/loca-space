import { ToastContainer } from "react-toastify";
import { Roboto } from "next/font/google";
import "./global.css";
import { ThemeInit } from "../../.flowbite-react/init";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

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
      <body className={roboto.className}>
        <ThemeInit />
        <ToastContainer position="top-right" autoClose={3000} />
        {children}
      </body>
    </html>
  );
}

