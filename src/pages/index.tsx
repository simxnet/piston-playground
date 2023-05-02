import { MONACO_OPTIONS } from "@/lib/constants";
import {
	ActionIcon,
	Box,
	Button,
	Flex,
	Input,
	Menu,
	Select,
	Switch,
	Text,
	Title,
} from "@mantine/core";
import { Editor } from "@monaco-editor/react";
import { Bug, Code, Cog, Link, Play } from "lucide-react";
import { useLocalStorage } from "@mantine/hooks";
import {
	ExecuteOptions,
	ExecuteOptionsKey,
	OptionKey,
	Options,
} from "@/lib/types";
import { modals } from "@mantine/modals";
import { api } from "@/lib/utils";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";

export default function Home({ share }: { share: string | null }) {
	const [error, setError] = useState<string | undefined>();
	const [options, setOptions] = useLocalStorage<Options>({
		key: "options",
		defaultValue: {
			vim: false,
			args: false,
			theme: "vs-theme",
			language: "javascript",
		},
	});
	const [executeOptions, setExecuteOptions] = useState<ExecuteOptions>({
		code: "// hello",
		language: options.language,
		args: [],
	});

	const runtimes = api.piston.getRuntimes.useQuery();
	const execute = api.piston.execute.useMutation();
	const link = api.links.getLink.useQuery(
		{ id: share },
		{
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	);
	const publish = api.links.addLink.useMutation();

	const requiredFields: (string | undefined)[] = [
		executeOptions.language,
		executeOptions.code,
	];

	function handleExecute() {
		const isMissingFields = requiredFields.some((field) => !field);

		if (isMissingFields)
			return setError("You are missing some fields, don't you?");

		setError(undefined);

		execute.mutate({
			args: executeOptions.args ?? [],
			language: executeOptions.language,
			code: executeOptions.code as string,
		});
	}

	function handleLink() {
		const isMissingFields = requiredFields.some((field) => !field);

		if (isMissingFields)
			return setError(
				"To submit a link you must select language and write some code",
			);

		setError(undefined);

		publish.mutate({
			content: Buffer.from(executeOptions.code as string, "utf-8").toString(
				"base64",
			),
			language: executeOptions.language,
		});
	}

	function updateExecuteOption<K extends ExecuteOptionsKey>(
		key: K,
		value: ExecuteOptions[K],
	) {
		setExecuteOptions({
			...executeOptions,
			[key]: value,
		});
	}

	function updateOption<K extends OptionKey>(key: K, value: Options[K]) {
		setOptions({
			...options,
			[key]: value,
		});
	}

	const openLinkModal = (link: string) =>
		modals.openConfirmModal({
			title: "Link created 🎉",
			centered: true,
			children: (
				<Text size="sm">
					Now you are ready to share this link with others! It has no sensitive
					information so is safe to share!
					<br />
					<br />
					<Text underline weight={700} color="cyan">
						{link}
					</Text>
				</Text>
			),
			labels: {
				cancel: "Close",
				confirm: "Confirm",
			},
			onConfirm: () => console.log("closed link modal"),
		});

	useEffect(() => {
		if (link.data) {
			setExecuteOptions({
				...executeOptions,
				code: Buffer.from(link.data.content, "base64").toString("utf-8"),
				language: link.data.language,
			});
		}
	}, [link.isLoading, link.data]);

	useEffect(() => {
		if (publish.data)
			return openLinkModal(`https://pstn.vercel.app/?share=${publish.data.id}`);
	}, [publish.isLoading, publish.data]);
	return (
		<Flex
			direction={"column"}
			gap={40}
			sx={{
				padding: "2rem",
			}}
		>
			<Title>Piston Playground</Title>
			<Flex direction={"column"} gap={10}>
				<Flex align={"center"} justify={"space-between"}>
					<Text>Code editor</Text>
					<Flex gap={5}>
						{runtimes.isLoading ? (
							"loading languages..."
						) : (
							<Select
								placeholder="Select a language"
								searchable
								nothingFound="No language found"
								defaultValue={options.language}
								onChange={(v) => updateOption("language", v ?? "javascript")}
								data={[...new Set(runtimes.data?.map((r) => r.language))]}
							/>
						)}
						<Menu
							closeOnItemClick={false}
							position="bottom-end"
							withArrow
							shadow="md"
							width={200}
						>
							<Menu.Target>
								<ActionIcon size={"lg"} variant="filled">
									<Cog size="1.125rem" />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Label>Settings</Menu.Label>
								<Menu.Item
									onClick={() => updateOption("vim", !options.vim)}
									icon={<Code size={14} />}
									rightSection={<Switch size="xs" checked={options.vim} />}
								>
									Use VIM
								</Menu.Item>
								<Menu.Item
									onClick={() => updateOption("args", !options.args)}
									icon={<Bug size={14} />}
									rightSection={<Switch size="xs" checked={options.args} />}
								>
									Args input
								</Menu.Item>
								<Menu.Item onClick={handleLink} icon={<Link size={14} />}>
									Share code
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
						<Button
							disabled={!executeOptions.code}
							loading={execute.isLoading}
							onClick={handleExecute}
							leftIcon={<Play size={14} />}
						>
							Run
						</Button>
					</Flex>
				</Flex>
				<Editor
					theme="vs-dark"
					options={MONACO_OPTIONS}
					height={"25rem"}
					language={options.language}
					onChange={(v) => updateExecuteOption("code", v)}
					value={executeOptions.code}
					defaultValue={executeOptions.code}
				/>
				{options.args && <Input placeholder="Args here" />}
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
					{execute.isLoading ? (
						"> Loading..."
					) : execute.data ? (
						execute.data.run.stderr ? (
							<Text
								color="red"
								sx={{
									fontFamily: "monospace",
								}}
							>
								{execute.data.run.stderr}
							</Text>
						) : (
							execute.data.run.output && (
								<Text
									sx={{
										fontFamily: "monospace",
									}}
								>
									{execute.data.run.output}
								</Text>
							)
						)
					) : error ? (
						`> ${error}`
					) : (
						"> Write some code and run it and results will show up here"
					)}
				</Box>
			</Flex>
		</Flex>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { share } = context.query;

	return {
		props: {
			share: share ?? null,
		},
	};
};
