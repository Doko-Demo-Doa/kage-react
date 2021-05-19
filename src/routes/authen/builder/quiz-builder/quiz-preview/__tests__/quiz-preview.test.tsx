import { render } from "@testing-library/react";
import { QuizPreview } from "../quiz-preview";

test("it renders", () => {
  const screen = render(<QuizPreview />);
  screen.debug();

  const textElem = screen.getByText("Quiz Intro");
  expect(textElem).toBeInTheDocument();
});
