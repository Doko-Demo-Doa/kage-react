import ReactDOM from "react-dom";
import { Component } from "react";

interface Props {
  onClose: () => void | undefined;
}

export class NewWindowShell extends Component<Props> {
  private containerEl = document.createElement("div");

  // This will keep a reference of the window
  private externalWindow: Window | null;

  constructor(props: Props) {
    super(props);

    // The second argument in window.open is optional and can be set to whichever
    // value you want. You will notice the use of this value when we modify the main
    // electron.js file
    this.externalWindow = window.open("", "NewWindowShell");
  }

  componentDidMount() {
    // Append the container div and register the event that will get fired when the
    // window is closed
    if (this.externalWindow) {
      this.externalWindow.document.body.appendChild(this.containerEl);
      this.externalWindow.onunload = () => this.props.onClose();
    }
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}
