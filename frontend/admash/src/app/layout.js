
import * as React from 'react';
import "../../styles/remixicon.css";
import "react-tabs/style/react-tabs.css";
import "swiper/css";
import "swiper/css/bundle";
 
// Chat Styles
import "../../styles/chat.css";
 
// Globals Styles
import "../../styles/globals.css";
 
// Rtl Styles
import "../../styles/rtl.css";
 
// Dark Mode Styles
import "../../styles/dark.css";
 
// Theme Styles
import theme from '@/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LayoutProvider from '@/providers/LayoutProvider';
import { FormProvider } from "../context/FormContext"; // ✅ Import FormProvider

export const metadata = {
    title: 'Admash - Material Design React Nextjs Admin Dashboard Template',
    description: 'Material Design React Nextjs Admin Dashboard Template',
};
 
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <LayoutProvider>
                            <FormProvider> {/* ✅ Wrap everything with FormProvider */}
                                {children}
                            </FormProvider>
                        </LayoutProvider>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}