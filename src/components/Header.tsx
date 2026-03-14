import { Flex, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { ThemePicker } from "./ThemePicker";

export function Header() {
	return (
		<header style={{ borderBottom: "1px solid var(--gray-4)" }}>
			<Flex align="center" justify="between" py="3" px="4">
				<Link to="/" style={{ textDecoration: "none" }}>
					<Flex align="center" gap="2">
						<span
							aria-hidden="true"
							style={{
								display: "inline-block",
								width: 8,
								height: 8,
								borderRadius: "50%",
								background: "var(--electric-teal)",
								boxShadow: "0 0 6px var(--electric-teal)",
							}}
						/>
						<Text size="4" weight="bold" style={{ letterSpacing: "-0.02em" }}>
							Electric Todos
						</Text>
					</Flex>
				</Link>
				<Flex gap="4" align="center">
					<ThemePicker />
				</Flex>
			</Flex>
		</header>
	);
}
