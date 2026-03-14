import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { todoSelectSchema } from "@/db/zod-schemas";

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		getKey: (row) => row.id,
		shapeOptions: {
			url: new URL(
				"/api/todos",
				typeof window !== "undefined"
					? window.location.origin
					: "http://localhost:8080",
			).toString(),
			parser: {
				timestamptz: (date: string) => new Date(date),
			},
		},
		onInsert: async ({ transaction }) => {
			const { modified: newTodo } = transaction.mutations[0];
			const res = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newTodo),
			});
			if (!res.ok) throw new Error(`Insert failed: ${res.status}`);
			const data = await res.json();
			return { txid: data.txid };
		},
		onUpdate: async ({ transaction }) => {
			const { modified: updated } = transaction.mutations[0];
			const res = await fetch(`/api/mutations/todos/${updated.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updated),
			});
			if (!res.ok) throw new Error(`Update failed: ${res.status}`);
			const data = await res.json();
			return { txid: data.txid };
		},
		onDelete: async ({ transaction }) => {
			const { original: deleted } = transaction.mutations[0];
			const res = await fetch(`/api/mutations/todos/${deleted.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
			const data = await res.json();
			return { txid: data.txid };
		},
	}),
);
