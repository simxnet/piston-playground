import { PistonExecuteResult } from "@/lib/types";
import { Box, Code, Flex, Text, Title } from "@mantine/core";
import Codebox from "./box";

interface Props {
	execute: PistonExecuteResult;
	loading: boolean;
	error?: string;
	legacy?: boolean;
}

export default function Coderesult({ execute, loading, error, legacy }: Props) {
	return legacy ? (
		<Box
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
			{loading ? (
				"> Loading..."
			) : execute ? (
				execute.run.stderr ? (
					<Text
						color="red"
						sx={{
							fontFamily: "monospace",
						}}
					>
						{execute.run.stderr}
					</Text>
				) : (
					execute.run.output && (
						<Text
							sx={{
								fontFamily: "monospace",
							}}
						>
							{execute.run.output}
						</Text>
					)
				)
			) : error ? (
				`> ${error}`
			) : (
				"> Write some code and run it and results will show up here"
			)}
		</Box>
	) : (
		<Flex gap={10}>
			<Codebox>
				{loading ? (
					<Code>{"> Loading..."}</Code>
				) : execute ? (
					execute.run.stderr ? (
						<>
							<Title order={5}>Code result:</Title>
							<br />
							<Code block color="red">
								{execute.run.stderr}
							</Code>
						</>
					) : (
						execute.run.output && (
							<>
								<Title order={5}>Code result:</Title>
								<br />
								<Code block>{execute.run.output}</Code>
							</>
						)
					)
				) : error ? (
					<Code color="red">{error}</Code>
				) : (
					<Code>
						{"> Write some code and run it and results will show up here"}
					</Code>
				)}
			</Codebox>
			{execute?.compile?.output && (
				<Codebox>
					<Title order={5}>Compilation result:</Title>
					<br />
					<Code block color="yellow">
						{execute.compile.output}
					</Code>
				</Codebox>
			)}
		</Flex>
	);
}
