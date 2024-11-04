import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  openModal: any | null;
}

const initialState: ModalState = {
  isOpen: false,
  openModal: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleModal(state) {
      state.isOpen = !state.isOpen;
    },
    setOpenModal(state, action: PayloadAction<any | null>) {
      state.openModal = action.payload;
    },
  },
});

export const { toggleModal, setOpenModal } = modalSlice.actions;
export default modalSlice.reducer;
