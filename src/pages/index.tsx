import { MONACO_OPTIONS, defaultMessage } from "@/lib/constants";
import {
	ActionIcon,
	Badge,
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
import { Bug, Code, Link, Play, Settings2, Terminal } from "lucide-react";
import { useLocalStorage, useSetState } from "@mantine/hooks";
import { ExecuteOptions, Options, PistonExecuteResult } from "@/lib/types";
import { modals } from "@mantine/modals";
import { api } from "@/lib/utils";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useClipboard } from "@mantine/hooks";
import { loadTheme } from "@/lib/utils";
import Coderesult from "@/components/code/result";

export default function Home({ share }: { share: string | null }) {
	const [error, setError] = useState<string | undefined>();
	const clipboard = useClipboard();
	const [options, setOptions] = useLocalStorage<Options>({
		key: "options",
		defaultValue: {
			vim: false,
			args: false,
			theme: "vs-theme",
			language: "typescript",
			legacyResult: false,
		},
	});
	const [executeOptions, setExecuteOptions] = useSetState<ExecuteOptions>({
		code: defaultMessage,
		args: [],
	});

	const runtimes = api.piston.getRuntimes.useQuery();
	const execute = api.piston.execute.useMutation();
	const link = api.links.getLink.useQuery(
		{ id: share },
		{
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
	);
	const publish = api.links.addLink.useMutation();

	const languages = runtimes.data?.map((l) => l.language);

	const requiredFields: (string | undefined)[] = [
		options.language,
		executeOptions.code,
	];

	function handleExecute() {
		const isMissingFields = requiredFields.some((field) => !field);

		if (isMissingFields)
			return setError("You are missing some fields, don't you?");

		setError(undefined);

		execute.mutate({
			args: executeOptions.args ?? [],
			language: options.language,
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
			language: options.language,
		});
	}

	const openLinkModal = (link: string) =>
		modals.openConfirmModal({
			title: "Link created 🎉",
			centered: true,
			children: (
				<Text size="sm">
					Your link has been created, press "Copy and close" button and pase it
					anywhere!
					<br />
					<br />
					<Text underline weight={700} color="cyan">
						{link}
					</Text>
				</Text>
			),
			labels: {
				cancel: "Close",
				confirm: "Copy and close",
			},
			onConfirm: () => clipboard.copy(link),
		});

	useEffect(() => {
		if (link.data) {
			setExecuteOptions({
				code: Buffer.from(link.data.content, "base64").toString("utf-8"),
			});
			setOptions({
				...options,
				language: link.data.language,
			});
		}
	}, [link.isLoading, link.data]);

	useEffect(() => {
		if (publish.data)
			return openLinkModal(`https://pstn.vercel.app/?share=${publish.data.id}`);
	}, [publish.isLoading, publish.data]);

	useEffect(() => {
		loadTheme();
	}, []);
	return (
		<Flex
			direction={"column"}
			gap={40}
			sx={{
				padding: "2rem",
			}}
		>
			<Flex direction={"column"} gap={5}>
				<div>
					<Badge>BETA</Badge>
				</div>
				<Title>Piston Playground</Title>
			</Flex>
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
								value={options.language}
								defaultValue={options.language}
								onChange={(v) =>
									setOptions({
										...options,
										language: v as string,
									})
								}
								data={[...new Set(languages).keys()]}
							/>
						)}
						<Menu position="bottom-end" withArrow shadow="md" width={200}>
							<Menu.Target>
								<ActionIcon size={"lg"} variant="filled">
									<Settings2 size="1.125rem" />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Label>SETTINGS</Menu.Label>
								<Menu.Item
									onClick={() =>
										setOptions({
											...options,
											legacyResult: !options.legacyResult,
										})
									}
									icon={<Terminal size={14} />}
									rightSection={
										<Switch size="xs" checked={options.legacyResult} />
									}
								>
									Legacy results
								</Menu.Item>
								<Menu.Item
									onClick={() =>
										setOptions({
											...options,
											vim: !options.vim,
										})
									}
									icon={<Code size={14} />}
									rightSection={<Switch size="xs" checked={options.vim} />}
								>
									Vim mode
								</Menu.Item>
								<Menu.Item
									onClick={() =>
										setOptions({
											...options,
											args: !options.args,
										})
									}
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
					theme="twilight"
					options={MONACO_OPTIONS}
					height={"35rem"}
					language={options.language}
					onChange={(v) =>
						setExecuteOptions({
							code: v,
						})
					}
					value={executeOptions.code}
					defaultValue={executeOptions.code}
				/>
				{options.args && (
					<Input
						onChange={(e) =>
							setExecuteOptions({
								args: e.target.value.split(" "),
							})
						}
						placeholder="Args here"
					/>
				)}
				<Coderesult
					execute={execute.data as PistonExecuteResult}
					loading={execute.isLoading}
					error={error}
					legacy={options.legacyResult}
				/>
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
