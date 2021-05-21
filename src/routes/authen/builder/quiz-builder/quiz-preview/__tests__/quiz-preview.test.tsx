import { render } from "@testing-library/react";
import { QuizPreview } from "../quiz-preview";

test.only("it renders", () => {
  const screen = render(<QuizPreview />);

  const textElem = screen.getByRole("quiz-preview");
  expect(textElem).toBeInTheDocument();
});
