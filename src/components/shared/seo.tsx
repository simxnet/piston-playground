import type { NextComponentType, NextPageContext } from "next";

interface Props {
	website: string;
}

const SEO: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
	return (
		<>
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
			<meta property="og:url" content={props.website} />
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
			<meta property="twitter:url" content={props.website} />
			<meta
				property="twitter:title"
				content="Piston UI React — React based interface for Piston"
			/>
			<meta
				property="twitter:description"
				content="A React based interface for Piston where you can share code with links!"
			/>
		</>
	);
};

export default SEO;
