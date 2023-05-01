import Document, { Head, Html, Main, NextScript } from "next/document";

export default class extends Document {
	render() {
		return (
			<Html className="dark" lang="en">
				<Head>
					<meta name="application-TileColor" content="#2ba46e" />
					<meta name="theme-color" content="#2ba46e" />
				</Head>
				<body className="dark:bg-gray-950 bg-gray-200 p-5">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
