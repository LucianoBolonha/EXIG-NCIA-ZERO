import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the upload flow shell", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /analise sua nota devolutiva/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /selecionar documento/i }),
    ).toBeInTheDocument();
  });
});
