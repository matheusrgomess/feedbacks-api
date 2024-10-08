import { authentication } from '@/http/auth.ts';
import { Elysia, t } from "elysia"
import { prisma } from "@/lib/prisma.ts"
import type { Prisma } from "@prisma/client"

export const getParticipants = new Elysia({
	tags: ["General"],
	detail: {
		description: "Get all participants in the system",
	},
}).use(authentication).get(
	"/list-participants",
	async ({ query, set }) => {
		const { email } = query

		const where: Prisma.ParticipantsWhereInput = {}

		if (email) {
			where.email = {
				not: email,
			}
		} else {
			where.email = {}
		}

		const participants = await prisma.participants.findMany({
			orderBy: {
				name: "asc",
			},
			where,
		})

		if (!participants) {
			set.status = 400
			return { message: "Não há participantes" }
		}

		set.status = 200
		return { participants }
	},
	{
		query: t.Object({
			email: t.Optional(t.String({ minLength: 1, format: "email" })),
		}),
	},
)
