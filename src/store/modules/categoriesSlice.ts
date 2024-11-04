import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Category {
  name: string;
}

interface CategoriesState {
  categories: Category[] | null;
}

const initialState: CategoriesState = {
  categories: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
