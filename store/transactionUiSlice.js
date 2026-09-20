import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  selectedTransactionId: null,
  isActionSheetOpen: false,
};

export const transactionUiSlice = createSlice({
  name: "transactionUi",
  initialState,
  reducers: {
    openTransactionActionSheet(state, action) {
      state.selectedTransactionId = String(action.payload);
      state.isActionSheetOpen = true;
    },
    closeTransactionActionSheet(state) {
      state.selectedTransactionId = null;
      state.isActionSheetOpen = false;
    },
    clearSelectedTransaction(state) {
      state.selectedTransactionId = null;
      state.isActionSheetOpen = false;
    },
  },
});

export const {
  openTransactionActionSheet,
  closeTransactionActionSheet,
  clearSelectedTransaction,
} = transactionUiSlice.actions;

const transactionUiSelector = (state) => state.transactionUi || initialState;

const selectedTransactionIdSelector = createSelector(
  transactionUiSelector,
  (ui) => ui.selectedTransactionId,
);

const isActionSheetOpenSelector = createSelector(
  transactionUiSelector,
  (ui) => ui.isActionSheetOpen,
);

export const transactionUiSelectors = {
  selectedTransactionIdSelector,
  isActionSheetOpenSelector,
};

export default transactionUiSlice.reducer;
