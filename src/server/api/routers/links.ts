import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const linksRouter = createTRPCRouter({
	getLink: publicProcedure
		.input(
			z.object({
				id: z.nullable(z.string()),
			}),
		)
		.query(({ ctx, input }) => {
			if (!input.id) return;

			return ctx.prisma.link.findUnique({
				where: {
					id: input.id,
				},
			});
		}),

	addLink: publicProcedure
		.input(
			z.object({
				content: z.string(),
				language: z.string(),
			}),
		)
		.mutation(({ ctx, input }) => {
			return ctx.prisma.link.create({
				data: {
					content: input.content,
					language: input.language,
				},
			});
		}),
});
