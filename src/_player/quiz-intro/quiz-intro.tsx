import "~/_player/quiz-intro/quiz-intro.scss";

interface Props {
  id: string;
}

export const QuizIntro: React.FC<Props> = ({ id }) => {
  return (
    <div className="quiz-intro">
      <h1>問題三</h1>
      <h2>Bộ câu hỏi số 3</h2>
      <h6>{id}</h6>
    </div>
  );
};
