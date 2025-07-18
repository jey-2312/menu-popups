/*
Name:Siva Jeyanth
*/
//This file Contains the all the attributes and its types used in the form
export interface MenuItem {
  itemName: string;
  price: number;
  discount?: number;
  category: string;
  itemType: string;
  description: string;
  backstory: string;
  ingredients: string;
  itemImage: File | null;
  isBestseller?: boolean;
  isTrending?: boolean;
  itemVideo: File | null | string;
  allergens:{
    hasNuts:boolean;
    hasDiary:boolean;
    hasSeafood:boolean;
    hasGluten:boolean;
    [key: string]: boolean; //using this so that we can dynamically access the allergens
  }
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Very Hot';
  availability: boolean;
}

//All props required for the Form component

export interface AddMenuItemFormProps {
  onSave: (item: MenuItem) => void;
  categories: string[];
  onClose:() =>void;
}