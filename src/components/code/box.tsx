import { Box } from "@mantine/core";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function Codebox({ children }: Props) {
	return (
		<Box
			w={"100%"}
			sx={{
				backgroundColor: "transparent",
				fontFamily: "monospace",
				whiteSpace: "pre-wrap",
			}}
		>
			{children}
		</Box>
	);
}
