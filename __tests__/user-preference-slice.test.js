const reducer = require("../store/userPreferenceSlice").default;
const { setTheme } = require("../store/userPreferenceSlice");

describe("userPreferenceSlice", () => {
  const initial = reducer(undefined, { type: "@@INIT" });

  it("defaults theme to light when localStorage is empty", () => {
    expect(initial.theme).toBe("light");
  });

  it("setTheme updates state", () => {
    const next = reducer(initial, setTheme("dark"));
    expect(next.theme).toBe("dark");
  });

  it("setTheme writes skledger-theme to localStorage when window exists", () => {
    const setItem = jest.fn();
    global.window = {
      localStorage: { setItem, getItem: jest.fn(() => null) },
    };
    reducer(initial, setTheme("dark"));
    expect(setItem).toHaveBeenCalledWith("skledger-theme", "dark");
  });
});
