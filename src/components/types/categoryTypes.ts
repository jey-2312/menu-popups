/*
Name: Siva Jeyanth
*/
//Interface/types used in Manage Categories Pop-Up
export interface Category {
  id: string;
  name: string;
}

// Props interface for the Manage Categories component
export interface ManageCategoriesProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categories: Category[]) => void;
  initialCategories?: Category[];
}