import { PistonRuntime } from "@/lib/types";
import { api } from "@/utils/api";
import { Alert, Button, Input, Modal, Select, Typography } from "@supabase/ui";
import { useEffect, useState } from "react";
import { Link } from "lucide-react";
import { GetServerSideProps } from "next";
import { MONACO_OPTIONS } from "@/lib/constants";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

interface HomeProps {
	link: string | null;
}

export default function Home({ link }: HomeProps) {
	const [languages, setLanguages] = useState<PistonRuntime[] | undefined>();
	const [language, setLanguage] = useState<string | undefined>();
	const [code, setCode] = useState<string | undefined>();
	const [args, setArgs] = useState<string | undefined>();
	const [error, setError] = useState<string | undefined>();
	const [linkId, setLinkId] = useState<string | null>(null);
	const [createdLink, setCreatedLink] = useState(false);

	const {
		data: runtimes,
		error: runtimesError,
		isLoading: loadingRuntimes,
	} = api.piston.getRuntimes.useQuery();

	const {
		mutate: run,
		data: runResults,
		isLoading: runLoading,
	} = api.piston.execute.useMutation();

	const {
		data: dataLink,
		error: errorLink,
		isLoading: loadingLink,
	} = api.link.getLink.useQuery({
		id: linkId ?? "",
	});

	const {
		mutate: createLink,
		data: createLinkData,
		isLoading: createLinkLoading,
	} = api.link.addLink.useMutation();

	const SelectOptions = languages?.map((l) => (
		<Select.Option value={l.language}>{l.language}</Select.Option>
	));

	const requiredFields: (string | undefined)[] = [language, code];

	const handleRun = () => {
		const isMissingFields = requiredFields.some((field) => !field);

		if (isMissingFields)
			return setError("You are missing some fields, don't you?");

		setError(undefined);

		run({
			args: args ? args.split(" ") : [],
			language: language as string,
			code: code as string,
		});
	};

	const handleLink = () => {
		const isMissingFields = requiredFields.some((field) => !field);

		if (isMissingFields)
			return setError(
				"To submit a link you must select language and write some code",
			);

		setError(undefined);

		createLink({
			content: Buffer.from(code as string, "utf-8").toString("base64"),
			language: language as string,
		});
	};

	useEffect(() => {
		if (runtimes) return setLanguages(runtimes);

		return setError(runtimesError?.message);
	}, [runtimes, runtimesError, loadingRuntimes]);

	useEffect(() => {
		if (link) setLinkId(link);
	}, [link]);

	useEffect(() => {
		if (dataLink) {
			setCode(Buffer.from(dataLink.content, "base64").toString("utf-8"));
			setLanguage(dataLink.language);
			return;
		}

		return;
	}, [dataLink, loadingLink, errorLink]);

	useEffect(() => {
		if (createLinkData) return setCreatedLink(true);
	}, [createLink, createLinkData, createLinkLoading]);
	return (
		<>
			<Typography.Title className="font-bold">Piston UI react</Typography.Title>
			{createdLink && (
				<Alert title="Link created!" className="mt-5">
					Here is your link, share it with the world!{" "}
					<Typography.Link
						href={`https://piston-ui-react.vercel.app/?l=${createLinkData?.id}`}
					>
						https://piston-ui-react.vercel.app/?l={createLinkData?.id}
					</Typography.Link>
				</Alert>
			)}
			<div className="bg-gray-900 text-gray-200 p-5 my-5 rounded-xl flex flex-col gap-4">
				<div className="flex w-full justify-between items-center">
					<Typography.Title level={3}>
						Piston UI Code Execution
					</Typography.Title>
					<Button
						loading={createLinkLoading}
						onClick={handleLink}
						icon={<Link className="w-4 h-4" />}
					>
						Share
					</Button>
				</div>
				{!loadingRuntimes && (
					<div className="flex gap-10">
						<label>Language</label>
						<Select
							value={language}
							onChange={(e) => setLanguage(e.target.value)}
							className="w-full"
						>
							{SelectOptions}
						</Select>
					</div>
				)}
				<div className="flex gap-[4.5em]">
					<label>Code</label>
					<Editor
						className="rounded-md"
						theme="vs-dark"
						onChange={(value) => setCode(value)}
						options={MONACO_OPTIONS}
						height={"25rem"}
						language={language}
						value={code}
						defaultValue={code}
					/>
				</div>
				<div className="flex gap-[4.9em]">
					<label>Args</label>
					<Input className="w-full" onChange={(e) => setArgs(e.target.value)} />
				</div>
				<Button loading={runLoading} onClick={handleRun} block>
					Run
				</Button>
				{error && (
					<Typography.Text className="!text-red-500">{error}</Typography.Text>
				)}
			</div>
			{runResults && (
				<div className="w-full bg-gray-900 p-4 rounded-xl">
					{runResults.run.stderr ? (
						<code className="text-red-400">{runResults.run.stderr}</code>
					) : (
						<code className="text-white">{runResults.run.output}</code>
					)}
				</div>
			)}
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { l } = context.query;

	return {
		props: {
			link: l ?? null,
		},
	};
};
