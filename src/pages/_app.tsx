import { type AppType } from "next/app";
import { MantineProvider } from "@mantine/core";
import Head from "next/head";
import { ModalsProvider } from "@mantine/modals";

import { api } from "@/lib/utils";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
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
	);
};

export default api.withTRPC(MyApp);
