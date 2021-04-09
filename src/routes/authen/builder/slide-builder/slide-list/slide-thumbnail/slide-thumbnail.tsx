import "./slide-thumbnail.scss";

export const SlideThumbnail: React.FC = () => {
  return (
    <div className="slide-thumbnail">
      <div className="counter">1</div>
      <div className="block-inside">
        <div className="title">Title</div>
        <div className="bord" />
      </div>
    </div>
  );
};
