import { type AppType } from "next/app";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import SEO from "@/components/shared/seo";
import { ModalsProvider } from "@mantine/modals";

import { api } from "@/lib/utils";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<SEO website="https://pstn.vercel.app/" />
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: "dark",
					defaultRadius: "md",
				}}
			>
				<ModalsProvider>
					<Component {...pageProps} />
				</ModalsProvider>
			</MantineProvider>
		</>
	);
};

export default api.withTRPC(MyApp);
