const { applyDocumentTheme } = require("../lib/applyDocumentTheme");

describe("applyDocumentTheme", () => {
  let mockRoot;

  beforeEach(() => {
    mockRoot = {
      classList: {
        _classes: new Set(),
        toggle(className, force) {
          if (force) {
            this._classes.add(className);
          } else {
            this._classes.delete(className);
          }
        },
        contains(className) {
          return this._classes.has(className);
        },
      },
      _attributes: {},
      _style: {},
      setAttribute(name, value) {
        this._attributes[name] = value;
      },
      getAttribute(name) {
        return this._attributes[name];
      },
      removeAttribute(name) {
        delete this._attributes[name];
      },
    };

    mockRoot.style = mockRoot._style;

    global.document = {
      documentElement: mockRoot,
    };
  });

  afterEach(() => {
    delete global.document;
  });

  it("applies light theme with data-theme light and no theme-dark class", () => {
    applyDocumentTheme("light");

    expect(mockRoot.classList.contains("theme-dark")).toBe(false);
    expect(mockRoot.getAttribute("data-theme")).toBe("light");
    expect(mockRoot.style.colorScheme).toBe("light");
  });

  it("applies dark theme with theme-dark class and dark color-scheme", () => {
    applyDocumentTheme("dark");

    expect(mockRoot.classList.contains("theme-dark")).toBe(true);
    expect(mockRoot.getAttribute("data-theme")).toBe("light");
    expect(mockRoot.style.colorScheme).toBe("dark");
  });
});
