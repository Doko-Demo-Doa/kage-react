import { Menu, Dropdown } from "antd";
import clsx from "clsx";
import { Colors } from "~/common/colors";
import { formattingUtils } from "~/utils/utils-formatting";

import "~/routes/authen/builder/slide-builder/slide-list/slide-thumbnail/slide-thumbnail.scss";
import { fileUtils } from "~/utils/utils-files";

type SlideThumbnailProps = {
  id?: string;
  index: number;
  linkedQuizId?: string;
  title?: string;
  inactive?: boolean;
  backgroundAsset?: string;
  onClick: (idx: number) => void | undefined;
  onClickDuplicate?: (idx: number) => void | undefined;
  onClickDelete?: (idx: number) => void | undefined;
};

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  id,
  linkedQuizId,
  index,
  title,
  inactive,
  backgroundAsset,
  onClick,
  onClickDuplicate,
  onClickDelete,
}) => {
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => onClickDuplicate?.(index)}>
        Tạo bản sao
      </Menu.Item>
      <Menu.Item style={{ color: Colors.PALE_RED }} key="2" onClick={() => onClickDelete?.(index)}>
        Xoá
      </Menu.Item>
    </Menu>
  );

  const showingTitle = title?.length ?? 0 > 16 ? title?.substring(0, 15) : title;

  return (
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      <div
        id={id}
        className={clsx("slide-thumbnail", inactive ? "slide-thumbnail-inactive" : "")}
        onMouseDown={() => onClick(index)}
      >
        <div className="counter">{formattingUtils.padZero(index + 1, 2)}</div>

        <div
          className="block-inside"
          style={{
            backgroundImage: backgroundAsset
              ? `url(${fileUtils.getSlideBackgroundUrl(backgroundAsset)})`
              : undefined,
          }}
        >
          {!linkedQuizId ? (
            <>
              <div className="title">{formattingUtils.furiganaToJSX(showingTitle)}</div>
              <div className="bord" />
            </>
          ) : (
            <div className="quiz-set-placeholder">
              <strong>Quiz</strong>
            </div>
          )}
        </div>
      </div>
    </Dropdown>
  );
};
