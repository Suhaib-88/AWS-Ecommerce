import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { RepositoryFactory } from '../../../repositories/RepositoryFactory';
import { capitalize } from '../../../util/capitalize';

const ProductsRepository = RepositoryFactory.get('products');

// Define the shape of the state
interface Category {
  name: string;
}

interface CategoriesState {
  categories: Category[] | null;
}

// Define action types
type Action =
  | { type: 'SET_CATEGORIES'; payload: Category[] | null };

// Create the context
const CategoriesContext = createContext<{
  state: CategoriesState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Reducer function to handle state changes
function categoriesReducer(state: CategoriesState, action: Action): CategoriesState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Provider component
export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(categoriesReducer, { categories: null });

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch({ type: 'SET_CATEGORIES', payload: null });
      const categories = await ProductsRepository.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoriesContext.Provider>
  );
};

// Custom hook to use the categories context
export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

// Selector for formatted categories
export const useFormattedCategories = () => {
  const { state } = useCategories();
  return state.categories?.map(({ name }) => capitalize(name));
};
