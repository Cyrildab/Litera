import { render, screen } from "@testing-library/react";
import App from "../App";

test("Affiche le texte Hello World", () => {
  render(<App />);
  const element = screen.getByText("Hello World");
  expect(element).toBeInTheDocument();
});
