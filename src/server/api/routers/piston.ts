import { endpoints } from "@/lib/constants";
import { PistonExecuteResult, PistonRuntime } from "@/lib/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { FetchMethods, FetchResultTypes, fetch } from "@sapphire/fetch";

export const pistonRouter = createTRPCRouter({
	getRuntimes: publicProcedure.query(async () => {
		return await fetch<PistonRuntime[]>(
			endpoints.runtimes,
			{
				method: FetchMethods.Get,
			},
			FetchResultTypes.JSON,
		);
	}),

	execute: publicProcedure
		.input(
			z.object({
				args: z.array(z.string()),
				language: z.string(),
				code: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const execution = await fetch<PistonExecuteResult>(
				endpoints.execute,
				{
					method: FetchMethods.Post,
					body: JSON.stringify({
						args: input.args,
						language: input.language,
						version: "*",
						files: [
							{
								content: input.code,
							},
						],
					}),
				},
				FetchResultTypes.JSON,
			);

			return execution;
		}),
});
