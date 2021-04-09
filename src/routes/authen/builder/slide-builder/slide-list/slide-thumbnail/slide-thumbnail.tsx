import "./slide-thumbnail.scss";

type SlideThumbnailProps = {
  index: number;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ index }) => {
  return (
    <div className="slide-thumbnail">
      <div className="counter">{index}</div>
      <div className="block-inside">
        <div className="title">Title</div>
        <div className="bord" />
      </div>
    </div>
  );
};
