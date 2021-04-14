import clsx from "clsx";
import "./slide-thumbnail.scss";

type SlideThumbnailProps = {
  id?: string;
  index: number;
  title?: string;
  inactive?: boolean;
  onClick: (idx: number) => void | undefined;
}

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ id, index, title, inactive, onClick }) => {
  return (
    <div
      id={id}
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
