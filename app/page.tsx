import { HelpPage } from "@/components/HelpPage";
import { DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";

export default function Home() {
  return (
    <main className="container">
      <Navbar fluid rounded>
        <NavbarBrand>
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            Ассистент специалиста линии поддержки
          </span>
        </NavbarBrand>
        <DarkThemeToggle />
      </Navbar>
      <HelpPage />
    </main>
  );
}
