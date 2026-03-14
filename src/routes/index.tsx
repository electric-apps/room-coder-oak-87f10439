import {
	Badge,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Spinner,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todosCollection.preload();
		return null;
	},
	component: TodoPage,
});

type Filter = "all" | "active" | "completed";

function TodoPage() {
	const [newTitle, setNewTitle] = useState("");
	const [filter, setFilter] = useState<Filter>("all");
	const { data: allTodos, isLoading } = useLiveQuery(
		(q) =>
			q
				.from({ todo: todosCollection })
				.orderBy(({ todo }) => todo.created_at, "desc"),
		[],
	);

	const activeTodos = allTodos.filter((t) => !t.completed);
	const completedTodos = allTodos.filter((t) => t.completed);

	const displayed =
		filter === "active"
			? activeTodos
			: filter === "completed"
				? completedTodos
				: allTodos;

	const handleAdd = () => {
		const title = newTitle.trim();
		if (!title) return;
		const now = new Date();
		todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			created_at: now,
			updated_at: now,
		});
		setNewTitle("");
	};

	const handleToggle = (id: string, completed: boolean) => {
		todosCollection.update(id, (draft) => {
			draft.completed = !completed;
			draft.updated_at = new Date();
		});
	};

	const handleDelete = (id: string) => {
		todosCollection.delete(id);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleAdd();
	};

	if (isLoading) {
		return (
			<Container size="2" py="9">
				<Flex align="center" justify="center">
					<Spinner size="3" />
				</Flex>
			</Container>
		);
	}

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				{/* Header */}
				<Flex justify="between" align="center">
					<Flex direction="column" gap="1">
						<Heading size="7">Todos</Heading>
						<Text size="2" color="gray">
							{activeTodos.length} task{activeTodos.length !== 1 ? "s" : ""}{" "}
							remaining
						</Text>
					</Flex>
					{completedTodos.length > 0 && (
						<Badge color="green" variant="soft" size="2">
							{completedTodos.length} done
						</Badge>
					)}
				</Flex>

				{/* Add Todo */}
				<Flex gap="2">
					<TextField.Root
						placeholder="What needs to be done?"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						onKeyDown={handleKeyDown}
						style={{ flex: 1 }}
						size="3"
					/>
					<Button size="3" onClick={handleAdd} disabled={!newTitle.trim()}>
						<Plus size={16} />
						Add
					</Button>
				</Flex>

				{/* Filter Tabs */}
				{allTodos.length > 0 && (
					<Flex gap="2">
						{(["all", "active", "completed"] as Filter[]).map((f) => (
							<Button
								key={f}
								variant={filter === f ? "solid" : "ghost"}
								color={filter === f ? "violet" : "gray"}
								size="2"
								onClick={() => setFilter(f)}
								style={{ textTransform: "capitalize" }}
							>
								{f}
								{f === "all" && (
									<Badge size="1" variant="soft" color="gray" ml="1">
										{allTodos.length}
									</Badge>
								)}
								{f === "active" && activeTodos.length > 0 && (
									<Badge size="1" variant="soft" color="orange" ml="1">
										{activeTodos.length}
									</Badge>
								)}
								{f === "completed" && completedTodos.length > 0 && (
									<Badge size="1" variant="soft" color="green" ml="1">
										{completedTodos.length}
									</Badge>
								)}
							</Button>
						))}
					</Flex>
				)}

				{/* Todo List */}
				{displayed.length === 0 ? (
					<Flex direction="column" align="center" gap="3" py="9">
						<ClipboardList size={48} strokeWidth={1} color="var(--gray-8)" />
						<Text size="4" color="gray">
							{filter === "completed"
								? "No completed tasks yet"
								: filter === "active"
									? "All tasks completed!"
									: "No tasks yet. Add one above!"}
						</Text>
					</Flex>
				) : (
					<Flex direction="column" gap="2">
						{displayed.map((todo) => (
							<Card key={todo.id} variant="surface">
								<Flex align="center" gap="3">
									<Checkbox
										checked={todo.completed}
										onCheckedChange={() =>
											handleToggle(todo.id, todo.completed)
										}
										size="3"
									/>
									<Text
										size="3"
										weight="medium"
										style={{
											flex: 1,
											textDecoration: todo.completed ? "line-through" : "none",
											color: todo.completed ? "var(--gray-9)" : undefined,
										}}
									>
										{todo.title}
									</Text>
									<IconButton
										size="2"
										variant="ghost"
										color="red"
										onClick={() => handleDelete(todo.id)}
									>
										<Trash2 size={14} />
									</IconButton>
								</Flex>
							</Card>
						))}
					</Flex>
				)}
			</Flex>
		</Container>
	);
}
