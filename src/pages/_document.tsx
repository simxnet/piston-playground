import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
	static getInitialProps = getInitialProps;

	render() {
		return (
			<Html>
				<Head>
					<meta name="application-TileColor" content="#2ba46e" />
					<meta name="theme-color" content="#2ba46e" />
					<title>Piston UI React — React based interface for Piston</title>
					<meta
						name="title"
						content="Piston UI React — React based interface for Piston"
					/>
					<meta
						name="description"
						content="A React based interface for Piston where you can share code with links!"
					/>
					{/* Open Graph / Facebook */}
					<meta property="og:type" content="website" />
					<meta property="og:url" content={"https://pstn.vercel.app/"} />
					<meta
						property="og:title"
						content="Piston UI React — React based interface for Piston"
					/>
					<meta
						property="og:description"
						content="A React based interface for Piston where you can share code with links!"
					/>
					<meta property="og:image" content="/logo-mid.png" />
					{/* Twitter */}
					<meta property="twitter:url" content={"https://pstn.vercel.app/"} />
					<meta
						property="twitter:title"
						content="Piston UI React — React based interface for Piston"
					/>
					<meta
						property="twitter:description"
						content="A React based interface for Piston where you can share code with links!"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
