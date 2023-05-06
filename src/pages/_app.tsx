import { type AppType } from "next/app";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Montserrat as NextFont } from "next/font/google";

import { api } from "@/lib/utils";

const font = NextFont({
	subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: "dark",
				defaultRadius: "md",
				primaryColor: "green",
				fontFamily: font.style.fontFamily,
			}}
		>
			<ModalsProvider>
				<Component {...pageProps} />
			</ModalsProvider>
		</MantineProvider>
	);
};

export default api.withTRPC(MyApp);
