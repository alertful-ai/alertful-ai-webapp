import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";

export default function App({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  return (
    <ClerkProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </ClerkProvider>
  );
}
