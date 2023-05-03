import { Box } from "@mantine/core";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function Codebox({ children }: Props) {
	return (
		<Box
			w={"100%"}
			sx={(theme) => ({
				backgroundColor:
					theme.colorScheme === "dark"
						? theme.colors.dark[6]
						: theme.colors.gray[0],
				padding: theme.spacing.xl,
				borderRadius: theme.radius.md,
				fontFamily: "monospace",
				whiteSpace: "pre-wrap",
			})}
		>
			{children}
		</Box>
	);
}
