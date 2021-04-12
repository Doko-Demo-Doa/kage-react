import clsx from "clsx";
import "./slide-thumbnail.scss";

type SlideThumbnailProps = {
  index: number;
  title?: string;
  inactive?: boolean;
  onClick: (idx: number) => void | undefined;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ index, title, inactive, onClick }) => {
  return (
    <div
      className={clsx("slide-thumbnail", inactive ? "slide-thumbnail-inactive" : "")}
      onClick={() => onClick(index)}>
      <div className="counter">{index}</div>
      <div className="block-inside">
        <div className="title">{title}</div>
        <div className="bord" />
      </div>
    </div>
  );
};
