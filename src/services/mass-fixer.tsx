import { Modal } from "antd";

import { MassFixerComponent } from "~/components/mass-fixer/mass-fixer";

export const massFixer = {
  openQueueModal: () => {
    Modal.confirm({
      title: "",
      content: <MassFixerComponent />,
      okCancel: false,
      className: "custom-modal custom-modal-long",
      width: 840,
      okType: "ghost",
      closable: true,
      keyboard: true,
      okButtonProps: {
        type: "primary",
        style: {
          display: "none",
        },
      },
      cancelButtonProps: {
        style: {
          display: "none",
        },
      },
    });
  },
};
