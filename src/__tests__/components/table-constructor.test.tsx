import { render } from "@testing-library/react";
import { TableConstructor } from "~/components/table-constructor/table-constructor";

describe("Table Constructor", () => {
  it("renders without trouble", () => {
    render(<TableConstructor />);
  });
});
