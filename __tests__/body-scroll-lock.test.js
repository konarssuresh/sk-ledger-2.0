const {
  acquireBodyScrollLock,
  resetBodyScrollLockForTests,
} = require("../lib/bodyScrollLock");

function installDocumentMock() {
  const bodyStyle = { overflow: "" };
  global.document = {
    body: {
      style: bodyStyle,
    },
  };
  return bodyStyle;
}

describe("bodyScrollLock", () => {
  let bodyStyle;

  beforeEach(() => {
    bodyStyle = installDocumentMock();
    resetBodyScrollLockForTests();
    bodyStyle.overflow = "";
  });

  afterEach(() => {
    resetBodyScrollLockForTests();
    delete global.document;
  });

  it("hides body and saves prior overflow on first acquire", () => {
    bodyStyle.overflow = "auto";
    const release = acquireBodyScrollLock();
    expect(bodyStyle.overflow).toBe("hidden");
    release();
    expect(bodyStyle.overflow).toBe("auto");
  });

  it("nested acquire only restores after all releases", () => {
    bodyStyle.overflow = "";
    const releaseSheet = acquireBodyScrollLock();
    const releaseDialog = acquireBodyScrollLock();
    expect(bodyStyle.overflow).toBe("hidden");

    releaseSheet();
    expect(bodyStyle.overflow).toBe("hidden");

    releaseDialog();
    expect(bodyStyle.overflow).toBe("");
  });

  it("does not overwrite saved overflow on second acquire", () => {
    bodyStyle.overflow = "scroll";
    const releaseA = acquireBodyScrollLock();
    bodyStyle.overflow = "hidden";
    const releaseB = acquireBodyScrollLock();
    releaseA();
    expect(bodyStyle.overflow).toBe("hidden");
    releaseB();
    expect(bodyStyle.overflow).toBe("scroll");
  });

  it("release is idempotent", () => {
    const release = acquireBodyScrollLock();
    release();
    release();
    expect(bodyStyle.overflow).toBe("");
  });
});
