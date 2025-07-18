/*
Name:Siva Jeyanth
*/
//This page was purely made for testing and understanding the usage of the popup components 


"use client";
import React,{useState} from "react";
import AddMenuItemForm from "../components/forms/AddItemForm_Final";
import { MenuItem } from "../components/types/menuTypes";
import ManageCategories from "@/components/forms/ManageCategories";



const Page = () => {
  //State for Manage Categories PopUp
  const [showManagePopup, setShowManagePopup] = useState(false);
 
  //State for AddItem PopUp
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);

  //State to hold categories as it will be changed dynamically
  const [categories, setCategories] = useState<string[]>(['Appetizers', 'Main Course', 'Desserts', 'Beverages']);

  //this is the callback function used on using save button
  //this is where the all the categories list will come to this function
  const handleSaveCategories = (newCategories: { id: string, name: string }[]) => {
    setCategories(newCategories.map(cat => cat.name));
    setShowManagePopup(false);
    
  };
  //this is where all the itemdata is received on clicking submit
  const handleSaveItem = (item: MenuItem) => {
    console.log('Saved Item:', item);
    setShowAddItemPopup(false);
  };
 //Testing page for the understanding of the components
  return (
  <div className="relative p-8 space-y-4">
    <h1 className="text-2xl font-bold mb-4">Popups </h1>

    <div className="flex space-x-4">
      <button
        onClick={() => setShowManagePopup(true)}
        className="px-4 py-2 bg-[#463ee4] text-white rounded-md hover:bg-[#3d35d1]"
      >
        Manage Categories
      </button>

      <button
        onClick={() => setShowAddItemPopup(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Add Menu Item
      </button>
    </div>

    {/*  Render backdrop */}  
    {(showManagePopup || showAddItemPopup) && (
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"></div>
    )}

    
    {showManagePopup && (
      <div className="z-50 fixed inset-0 flex items-center justify-center">
        <ManageCategories                                             
          isOpen={showManagePopup}
          onClose={() => setShowManagePopup(false)}
          onSave={handleSaveCategories}
          initialCategories={categories.map((name, i) => ({ id: String(i), name }))}
        />
      </div>
    )}

    {showAddItemPopup && (
      <div className="z-50 fixed inset-0 flex items-center justify-center">
        <AddMenuItemForm
          onSave={handleSaveItem}
          categories={categories}
          onClose={() => setShowAddItemPopup(false)}
        />
      </div>
    )}
  </div>
);


};

export default Page;