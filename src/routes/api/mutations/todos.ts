import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { todoInsertSchema } from "@/db/zod-schemas";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const raw = parseDates(await request.json());
				const result = todoInsertSchema.safeParse(raw);
				if (!result.success) {
					return Response.json({ error: "Invalid input" }, { status: 400 });
				}
				const body = result.data;
				let txid = 0;
				await db.transaction(async (tx) => {
					await tx.insert(todos).values({
						id: body.id,
						title: body.title,
						completed: body.completed ?? false,
						created_at: body.created_at,
						updated_at: body.updated_at,
					});
					txid = await generateTxId(tx);
				});
				return Response.json({ txid });
			},
		},
	},
});
