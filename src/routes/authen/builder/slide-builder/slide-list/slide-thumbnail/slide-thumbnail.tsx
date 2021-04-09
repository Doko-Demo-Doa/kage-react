import "./slide-thumbnail.scss";

type SlideThumbnailProps = {
  index: number;
  title?: string;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ index, title }) => {
  return (
    <div className="slide-thumbnail">
      <div className="counter">{index}</div>
      <div className="block-inside">
        <div className="title">{title}</div>
        <div className="bord" />
      </div>
    </div>
  );
};
