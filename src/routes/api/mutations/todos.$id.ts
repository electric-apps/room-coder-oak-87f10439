import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { todoPatchSchema } from "@/db/zod-schemas";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos/$id")({
	server: {
		handlers: {
			PATCH: async ({ request, params }) => {
				const raw = parseDates(await request.json());
				const result = todoPatchSchema.safeParse(raw);
				if (!result.success) {
					return Response.json({ error: "Invalid input" }, { status: 400 });
				}
				let txid = 0;
				await db.transaction(async (tx) => {
					await tx
						.update(todos)
						.set({
							title: result.data.title,
							completed: result.data.completed,
							updated_at: new Date(),
						})
						.where(eq(todos.id, params.id));
					txid = await generateTxId(tx);
				});
				return Response.json({ txid });
			},
			DELETE: async ({ params }) => {
				let txid = 0;
				await db.transaction(async (tx) => {
					await tx.delete(todos).where(eq(todos.id, params.id));
					txid = await generateTxId(tx);
				});
				return Response.json({ txid });
			},
		},
	},
});
