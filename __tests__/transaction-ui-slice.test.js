const {
  transactionUiSlice,
  openTransactionActionSheet,
  closeTransactionActionSheet,
  clearSelectedTransaction,
} = require("../store/transactionUiSlice");

const { reducer } = transactionUiSlice;

describe("transactionUiSlice", () => {
  const initial = reducer(undefined, { type: "@@INIT" });

  it("starts with no selection and closed sheet", () => {
    expect(initial).toEqual({
      selectedTransactionId: null,
      isActionSheetOpen: false,
    });
  });

  it("openTransactionActionSheet stores id only and opens sheet", () => {
    const state = reducer(
      initial,
      openTransactionActionSheet("abc123"),
    );
    expect(state).toEqual({
      selectedTransactionId: "abc123",
      isActionSheetOpen: true,
    });
  });

  it("coerces transaction id to string", () => {
    const state = reducer(initial, openTransactionActionSheet(42));
    expect(state.selectedTransactionId).toBe("42");
  });

  it("closeTransactionActionSheet clears id and closes sheet", () => {
    const open = reducer(initial, openTransactionActionSheet("x"));
    const closed = reducer(open, closeTransactionActionSheet());
    expect(closed).toEqual({
      selectedTransactionId: null,
      isActionSheetOpen: false,
    });
  });

  it("clearSelectedTransaction resets to initial", () => {
    const open = reducer(initial, openTransactionActionSheet("x"));
    const cleared = reducer(open, clearSelectedTransaction());
    expect(cleared).toEqual({
      selectedTransactionId: null,
      isActionSheetOpen: false,
    });
  });
});
