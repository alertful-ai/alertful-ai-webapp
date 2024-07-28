import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "@/src/components/Layout";

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
    </ClerkProvider>
  );
}
