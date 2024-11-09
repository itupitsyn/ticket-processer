import { HelpPage } from "@/components/HelpPage";
import { DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";

export default function Home() {
  return (
    <main className="container flex min-h-screen flex-col gap-2">
      <Navbar fluid rounded>
        <NavbarBrand>
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            Какой-то заголовок
          </span>
        </NavbarBrand>
        <DarkThemeToggle />
      </Navbar>
      <HelpPage />
    </main>
  );
}