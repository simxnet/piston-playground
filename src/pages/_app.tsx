import { type AppType } from "next/app";
import { Inter as NextFont } from "next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const font = NextFont({
	subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<main className={font.className}>
			<Component {...pageProps} />
		</main>
	);
};

export default api.withTRPC(MyApp);
