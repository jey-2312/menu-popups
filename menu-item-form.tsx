/*
Name:Siva Jeyanth
Date:16/7/25
*/

import { useState } from "react";

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

/*
tommorow to do list
1)fill placeholders in fields
2)make bestseller,trending checkboxes
3)form validation if possible
4)make video uploader field
5)add x button in form
6)add comments in the code for readablity
7)toggle button
*/
const types: string[] = ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain"];

interface AddMenuItemFormProps {
  onSave: (item: MenuItem) => void;
  categories: string[];
}

const AddMenuItemForm = ({ onSave, categories }: AddMenuItemFormProps) => {
  const initialState: MenuItem = {
    itemName: '',
    price:0.00,
    discount:0.00,
    category: '',
    itemType: '',
    description: '',
    backstory: '',
    ingredients: '',
    itemImage: null,
    isBestseller: false,
    isTrending: false,
    itemVideo: null,
    allergens:{
        hasNuts:false,
        hasDiary:false,
        hasSeafood:false,
        hasGluten:false
    },
    spiceLevel:"Mild",
    availability:false,
  };

const [ItemData, setItemData] = useState<MenuItem>(initialState);            {/*Form data state */}
const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); {/*Error state */}

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setItemData((prev) => ({
    ...prev,
    [name]: name === "price" || name === "discount"
      ? value === '' ? '' : parseFloat(value)
      : value
  }));

  setFormErrors((prev) => ({ ...prev, [name]: '' }));
};


const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; //to check if the user has given a file
    setItemData((prev) => ({
      ...prev, itemImage: file,  //storing file
    }));
  };

const handleDragFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setItemData((prev) => ({
      ...prev, itemImage: file,
    }));
  };

 const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setItemData((prev) => ({ ...prev, itemVideo: file }));
  };

const handleVideoURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemData((prev) => ({ ...prev, itemVideo: e.target.value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  const handleAllergens =(e:React.ChangeEvent<HTMLInputElement>)=> {
    const{name,checked}=e.target;
    setItemData((prev)=> ({
        ...prev,allergens:{
            ...prev.allergens,[name]:checked
        }
    }))
  }
  const handleSpiceLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
  const level = parseInt(e.target.value);
  const spiceLevels: ('Mild' | 'Medium' | 'Hot' | 'Very Hot')[] = ['Mild', 'Medium', 'Hot', 'Very Hot'];{/*mapping number in slider to spice level */}
  setItemData((prev) => ({
    ...prev,
    spiceLevel: spiceLevels[level],
  }));
  };
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setItemData((prev) => ({
    ...prev,
    availability: e.target.checked,
  }));
};

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!ItemData.itemName.trim()) errors.itemName = "Item name is required.";
    if (isNaN(Number(ItemData.price)) || Number(ItemData.price) <= 0) errors.price = "Price is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlesubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onSave(ItemData);
    setItemData(initialState);
    setFormErrors({});
  };

  const handleCancel = () => {
    setItemData(initialState);
  };

  return (
   <div className="fixed inset-0 bg-gray-600 bg-opacity-40 z-50 flex items-center justify-center px-4">
    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl">
        {/* Header with Title and X Button */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Add New Menu Item</h2>
          <button 
            type="button" 
            onClick={handleCancel} 
            className="text-gray-400 hover:text-gray-600 text-2xl font-normal leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Item Name*</label>
                <input
                  type="text"
                  name="itemName"
                  value={ItemData.itemName}
                  onChange={handleChange}
                  placeholder="Enter item name"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formErrors.itemName && <p className="text-red-600 text-sm mt-1">{formErrors.itemName}</p>}
              </div>

              {/* Price and Discount */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Price ($)*</label>