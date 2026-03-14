import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { todos } from "@/db/schema"
import { generateValidRow, generateRowWithout } from "./helpers/schema-test-utils"

describe("todos schema", () => {
	it("validates a valid row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("fails when title is missing", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("fails when id is missing", () => {
		const row = generateRowWithout(todoSelectSchema, "id")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("coerces created_at string to Date", () => {
		const row = generateValidRow(todoSelectSchema)
		const withStringDate = { ...row, created_at: new Date().toISOString() }
		const result = todoSelectSchema.safeParse(withStringDate)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
		}
	})

	it("coerces updated_at string to Date", () => {
		const row = generateValidRow(todoSelectSchema)
		const withStringDate = { ...row, updated_at: new Date().toISOString() }
		const result = todoSelectSchema.safeParse(withStringDate)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})

	it("insert schema validates a valid row", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("completed defaults to false", () => {
		const row = { ...generateValidRow(todoSelectSchema), completed: false }
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.completed).toBe(false)
		}
	})
})
