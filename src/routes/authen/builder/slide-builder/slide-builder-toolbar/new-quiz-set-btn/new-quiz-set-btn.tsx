import React, { useContext, useState } from "react";
import { Button, Popover, Input, Space } from "antd";
import { FileAddFilled } from "@ant-design/icons";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/slide-builder/slide-builder-toolbar/new-quiz-set-btn/new-quiz-set-btn.scss";

export const NewQuizSetBtn: React.FC = observer(() => {
  const [newQuizId, setNewQuizId] = useState("");
  const [errNewQuizId, setErrNewQuizId] = useState(false);
  const [popVisible, setPopVisible] = useState(false);

  const store = useContext(StoreContext);
  const { list, newQuizSet } = store.slideListStore;
  const { setIndex, selectedIndex } = store.slideBuilderStore;

  const content = (
    <div className="new-quiz-set-popover">
      <div className="inner">
        <Space>
          <Input
            maxLength={40}
            onChange={(e) => {
              const val = e.target.value;
              setNewQuizId(val);
              setErrNewQuizId(list.map((n) => n.linkedQuizId).includes(val));
            }}
            value={newQuizId}
            placeholder="VD: quiz bunpou renshuu 21-3"
          />
          <Button
            disabled={errNewQuizId}
            onClick={() => {
              if (!errNewQuizId) {
                newQuizSet(newQuizId);
                setNewQuizId("");
                setPopVisible(false);

                if (selectedIndex === -1) {
                  setIndex(0);
                }
              }
            }}
          >
            OK
          </Button>
        </Space>
      </div>
      <br />
      {errNewQuizId && <div className="warn">ID này trùng với một quiz khác.</div>}
    </div>
  );

  return (
    <Popover
      visible={popVisible}
      trigger={["click"]}
      content={content}
      title="Đặt tên định danh cho bộ quiz"
    >
      <Button icon={<FileAddFilled />} type="primary" ghost onClick={() => setPopVisible(true)}>
        Thêm trang Quiz mới
      </Button>
    </Popover>
  );
});
