import { Menu } from "electron";

const template = [
  {
    label: "Edit",
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
