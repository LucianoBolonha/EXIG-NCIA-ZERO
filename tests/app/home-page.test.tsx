import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders upload instructions and submit action", () => {
    render(<HomePage />);

    expect(screen.getByText(/envie um pdf, png ou jpg/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /processar documento/i }),
    ).toBeInTheDocument();
  });
});
