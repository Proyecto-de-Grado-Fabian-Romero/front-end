import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/utils/theme";
import { CssBaseline } from "@mui/material";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { UserType } from "@/utils/constants/user-constants";
import ClientWrapper from "@/components/ClientWrapper";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spacio",
  description: "Encuentra el ambiente ideal para ti",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable}`}>
        <ClientWrapper>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Header userType={UserType.UNLOGGED} />
              {children}
              <BottomNav />
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
