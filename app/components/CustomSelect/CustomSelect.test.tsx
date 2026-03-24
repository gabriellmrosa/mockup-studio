import { fireEvent, render, screen } from "@testing-library/react";
import CustomSelect from "./CustomSelect";

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    value: jest.fn(),
    writable: true,
  });
});

describe("CustomSelect", () => {
  it("renders disabled option badge and does not call onChange when clicked", () => {
    const onChange = jest.fn();

    render(
      <CustomSelect
        ariaLabel="Model"
        value="smartphone"
        onChange={onChange}
        options={[
          {
            value: "smartphone",
            label: "Smartphone",
          },
          {
            value: "video-mp4",
            label: "Video MP4",
            badgeLabel: "Em breve",
            disabled: true,
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Model" }));

    expect(screen.getByText("Em breve")).toBeInTheDocument();

    const disabledOption = screen.getByRole("option", { name: /Video MP4/i });
    expect(disabledOption).toBeDisabled();
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(disabledOption);

    expect(onChange).not.toHaveBeenCalled();
  });
});
