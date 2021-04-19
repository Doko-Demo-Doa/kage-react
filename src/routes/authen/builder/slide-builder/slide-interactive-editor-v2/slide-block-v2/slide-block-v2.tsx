import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { Table } from "antd";
import { AppDefaults, MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

type SlideBlockComponentType = SlideBlockType & {
  selected?: boolean;
  onSelect: (id: string) => void | undefined;
};

export const SlideBlock: React.FC<SlideBlockComponentType> = ({ type, assetName, size }) => {
  const assetUrl = `${RESOURCE_PROTOCOL}${fileUtils.getCacheDirectory()}/${assetName}`;

  const initW = AppDefaults.DEFAULT_IMAGE_SCALE * (size?.w ?? 0);
  const initH = AppDefaults.DEFAULT_IMAGE_SCALE * (size?.h ?? 0);

  const [blockW, setBlockW] = useState(initW);
  const [blockH, setBlockH] = useState(initH);

  const getMainComponent = () => {
    if (type === MediaType.IMAGE) {
      return (
        <Rnd
          bounds="parent"
          onDragStop={(e, d) => {
            const topLeftX = d.x;
            const topLeftY = d.y;
            if (!size) return;
            const centerOriginW = topLeftX + blockW / 2;
            const centerOriginH = topLeftY + blockH / 2;
            console.log("Origin: ", centerOriginW, centerOriginH);
          }}
          onResizeStop={(mouseEvent, direction, element, delta) => {
            setBlockW(blockW + delta.width);
            setBlockH(blockH + delta.height);
          }}
          enableResizing={{
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          default={{
            x: 0,
            y: 0,
            width: AppDefaults.DEFAULT_IMAGE_SCALE * (size?.w ?? 0),
            height: AppDefaults.DEFAULT_IMAGE_SCALE * (size?.h ?? 0),
          }}
          style={{
            zIndex: 0,
            background: `url(${assetUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      );
    }

    if (type === MediaType.TABLE) {
      return (
        <Rnd
          onDragStop={(e, d) => {
            console.log(d);
            console.log(size);
          }}
          default={{
            x: 0,
            y: 0,
            width: 320,
            height: 200,
          }}
        >
          <Table columns={columns} dataSource={data} />
        </Rnd>
      );
    }

    return <div>Alt Text</div>;
  };

  return <>{getMainComponent()}</>;
};
