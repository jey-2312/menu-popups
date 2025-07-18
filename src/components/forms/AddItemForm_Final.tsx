/*
Name:Siva Jeyanth
Date:16/7/25
*/

import React from "react";
import { useState, useEffect,useRef } from "react";
import { ITEM_TYPES, SPICE_LEVELS } from "../utils/constants";
import { MenuItem, AddMenuItemFormProps } from "../types/menuTypes";
import { Image as ImageIcon, Video as VideoIcon, ChevronDown,CloudUpload} from "lucide-react";


//AddMenuItemForm Component

const AddMenuItemForm: React.FC<AddMenuItemFormProps> = ({ onSave, categories, onClose }) => { //Three props
  const initialState: MenuItem = {   //initial State
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

//Item data state
const [ItemData, setItemData] = useState<MenuItem>(initialState);  

//Error handling
const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); 

//Dropdown menu custom
const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//Image preview state
const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); 

//video preview
const [videoPreview, setVideoPreview] = useState<string | null>(null);


const dropdownRef = useRef<HTMLDivElement>(null);

// Autofocus on item name when popup opens
useEffect(() => {
  const itemNameInput = document.getElementById('itemNameInput');
  if (itemNameInput) {
    itemNameInput.focus();
  }
}, []);


//Custom Drop Down so its  functionality
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsDropdownOpen(false);
    }
  };
  
  if (isDropdownOpen) {
    document.addEventListener('click', handleClickOutside);
  }
  
  return () => document.removeEventListener('click', handleClickOutside);
}, 
[isDropdownOpen]);
//--------------------------------------FORM HANDLING------------------------------------------------------

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setIsDropdownOpen(false);                                 //for handling and updating the input into Itemdata object
  setItemData((prev) => ({
    ...prev,                                              
    [name]: name === "price" || name === "discount"
      ? value === '' ? '' : parseFloat(value)
      : value
  }));

  setFormErrors((prev) => ({ ...prev, [name]: '' }));      //errror handling
};

//---------------------------------------Category Field handling -----------------------------------------------------------------------
const handleCategorySelect = (category: string) => {
  setItemData((prev) => ({
    ...prev,
    category: category
  }));
  setFormErrors((prev) => ({ ...prev, category: '' }));
  setIsDropdownOpen(false);                            //custom dropdown so tracking its state
};
//---------------------------------------File Handling -----------------------------------------------------------------------

const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);   //preview image rendering
    };
    reader.readAsDataURL(file);
  }
  setItemData((prev) => ({                  //updatin the item data
    ...prev,
    itemImage: file,
  }));
  setFormErrors((prev) => ({ ...prev, itemImage: '' }));
};


const handleDragFile = (e: React.DragEvent<HTMLDivElement>) => {          //for drag and drop
  e.preventDefault();
  const file = e.dataTransfer.files?.[0] || null;
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
  setItemData((prev) => ({
    ...prev,
    itemImage: file,
  }));
  setFormErrors((prev) => ({ ...prev, itemImage: '' }));
};
//---------------------------------------Video Handling -----------------------------------------------------------------------

 const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  if (file) {
    const url = URL.createObjectURL(file);
    setVideoPreview(url); // For preview
    setItemData((prev) => ({ ...prev, itemVideo: file }));
  }
};

const handleVideoURL = (e: React.ChangeEvent<HTMLInputElement>) => {
  const link = e.target.value;
  setItemData((prev) => ({ ...prev, itemVideo: link }));
  setVideoPreview(null); // No preview, just show text
};


const handleVideoPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {    //Video url handling
  const pastedText = e.clipboardData.getData('text');
  if (pastedText.startsWith('http://') || pastedText.startsWith('https://')) {
    e.preventDefault();
    setItemData((prev) => ({ ...prev, itemVideo: pastedText }));
    setVideoPreview(null);
  }
};

//---------------------------------------CheckBox Handling -----------------------------------------------------------------------
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

//---------------------------------------Allergens Field Handling -----------------------------------------------------------------------  
  const handleAllergens =(e:React.ChangeEvent<HTMLInputElement>)=> {
    const{name,checked}=e.target;
    setItemData((prev)=> ({
        ...prev,allergens:{
            ...prev.allergens,[name]:checked
        }
    }))
  };


 //---------------------------------------Spice Level Slider Handling ----------------------------------------------------------------------- 
  const handleSpiceLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
  const level = parseInt(e.target.value);
  const spiceLevels: ('Mild' | 'Medium' | 'Hot' | 'Very Hot')[] = ['Mild', 'Medium', 'Hot', 'Very Hot'];{/*mapping number in slider to spice level */}
  setItemData((prev) => ({
    ...prev,
    spiceLevel: spiceLevels[level],
  }));
  };

//---------------------------------------Availablity Toggle Handling -----------------------------------------------------------------------  
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setItemData((prev) => ({
    ...prev,
    availability: e.target.checked,
  }));
};

//---------------------------------------Form Validation -----------------------------------------------------------------------
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!ItemData.itemName.trim()) errors.itemName = "Item name is required.";

    if (isNaN(Number(ItemData.price)) || Number(ItemData.price) <= 0) errors.price = "Price is required.";

    if (!ItemData.category.trim()) errors.category = "Category is required.";

    if (!ItemData.itemImage) errors.itemImage = "Item image is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
//---------------------------------------Form Submit and Cancel Handling -----------------------------------------------------------------------
  const handlesubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onSave(ItemData);
    setItemData(initialState);
    setFormErrors({});
  };

  const handleCancel = () => {
    setItemData(initialState);
    setImagePreviewUrl(null);
  };

  return (         //Main JSX elements
   <>
  <div className="w-full max-w-4xl my-8">
  <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
   
      <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Title and X Button */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-medium text-gray-900">Add New Menu Item</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl font-normal leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Item Name*</label>
                <input
                  id="itemNameInput"
                  type="text"
                  name="itemName"
                  value={ItemData.itemName}
                  onChange={handleChange}
                  placeholder="Enter item name"
                  className="w-full border border-gray-400 px-3 py-2 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#463ee4] focus:border-transparent"
                />
                {formErrors.itemName && <p className="text-red-600 text-sm mt-1">{formErrors.itemName}</p>}
              </div>

              {/* Price and Discount */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Price ($)*</label>
                  <input
                    type="number"
                    name="price"
                    value={ItemData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full border border-gray-400 px-3 py-2 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#463ee4] focus:border-transparent"
                  />
                  {formErrors.price && <p className="text-red-600 text-sm mt-1">{formErrors.price}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Discount ($)</label>
                  <input
                    type="number"
                    name="discount"
                    placeholder="0.00"
                    value={ItemData.discount}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full border border-gray-400 px-3 py-2 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#463ee4] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category - Custom Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Category*</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full border border-gray-400 px-3 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#463ee4] focus:border-transparent text-left flex items-center justify-between"
                  >
                    <span className={ItemData.category ? 'text-gray-900' : 'text-gray-400'}>
                      {ItemData.category || 'Select a category'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      
                    
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-400 rounded-md shadow-lg max-h-60 overflow-auto">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          className="w-full text-left px-3 py-2 text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {formErrors.category && <p className="text-red-600 text-sm mt-1">{formErrors.category}</p>}
              </div>

              {/* Item Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Item Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {ITEM_TYPES.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="itemType"
                        value={type}
                        checked={ItemData.itemType === type}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#463ee4] text-[#463ee4] border-gray-400 focus:ring-[#463ee4]"
                      />
                      <span className="text-gray-900 text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter item description"
                  value={ItemData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-400 px-3 py-2 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#463ee4] focus:border-transparent resize-none"
                />
              </div>

              {/* Backstory */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Backstory</label>
                <textarea
                  name="backstory"
                  placeholder="Share the story behind this dish"
                  value={ItemData.backstory}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-400 px-3 py-2 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#463ee4] focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
             <div> 
              {/* Item Image */}
              <label className="block text-sm font-medium mb-2 text-gray-700">Item Image*</label>
                            <div
                        className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        onDrop={handleDragFile}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('imageInput')?.click()}
                      >
                        {imagePreviewUrl ? (
                          <div className="space-y-2">
                            <img
                              src={imagePreviewUrl}
                              alt="Preview"
                              className="w-full h-40 object-contain rounded border border-gray-400"
                            />
                            <div className="flex justify-between items-center text-sm text-gray-700">
                              <span className="truncate">{ItemData.itemImage?.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImagePreviewUrl(null);
                                  setItemData((prev) => ({ ...prev, itemImage: null }));
                                }}
                                className="text-red-500 hover:text-red-700 text-lg font-bold px-2 rounded-full"
                                title="Remove Image"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-2">
                           <CloudUpload className="w-12 h-12 text-gray-400" />
                            <div className="text-gray-600">
                              <span className="font-medium">Drag and drop an image, or </span>
                              <span className="font-medium text-[#463ee4]">browse</span>
                            </div>
                            <div className="text-xs text-gray-500">PNG, JPG up to 5MB</div>
                          </div>
                        )}
                        <input
                          id="imageInput"
                          name="itemImage"
                          type="file"
                          accept="image/*"
                          onChange={handleFile}
                          className="hidden"
                        />
                        
                      </div>
                      {formErrors.itemImage && <p className="text-red-600 text-sm mt-1">{formErrors.itemImage}</p>}
                </div>

              {/* Video */}
              <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Video (optional)</label>
              <div
                className="border-2 border-dashed border-gray-400 rounded-md p-6 bg-gray-50 hover:bg-gray-100 text-center relative cursor-pointer"
                onClick={() => document.getElementById('videoInput')?.click()}
                onPaste={handleVideoPaste}
                onMouseEnter={(e) => e.currentTarget.focus()}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    document.getElementById('videoInput')?.click();
                  }
                }}
              >
                {ItemData.itemVideo && ItemData.itemVideo instanceof File && videoPreview ? (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      className="w-full h-40 object-cover rounded border border-gray-400"
                      preload="metadata"
                      muted
                    />
                    <div className="mt-2 text-sm text-gray-700 truncate">{ItemData.itemVideo.name}</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemData((prev) => ({ ...prev, itemVideo: null }));
                        setVideoPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-white text-red-500 hover:text-red-700 text-lg font-bold px-2 rounded-full z-10"
                    >
                      ×
                    </button>
                  </div>
                ) : typeof ItemData.itemVideo === 'string' ? (
                  <div className="flex justify-between items-center text-sm text-gray-700 px-2">
                    <span className="truncate">{ItemData.itemVideo}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemData((prev) => ({ ...prev, itemVideo: null }));
                      }}
                      className="text-red-500 hover:text-red-700 text-lg font-bold px-2 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <VideoIcon className="w-12 h-12 text-gray-400" />
                    <div className="text-gray-600 text-sm">Upload video, browse files, or hover and paste link</div>
                    <div className="text-xs text-gray-500">MP4, MOV up to 20MB | YouTube, Vimeo links supported</div>
                  </div>
                )}
                <input
                  id="videoInput"
                  name="itemVideo"
                  type="file"
                  accept="video/*"
                  onChange={handleVideo}
                  className="hidden"
                />
              </div>
              </div>
              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Ingredients</label>
                <textarea
                  name="ingredients"
                  value={ItemData.ingredients}
                  placeholder="List main ingredients"
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-400 px-3 py-2 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#463ee4] focus:border-transparent resize-none"
                />
              </div>

              {/* Spice Level */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Spice Level</label>
                <div className="flex items-center space-x-4">
                 <input
                        type="range"
                        name="spiceLevel"
                        min="0"
                        max="3"
                        step="1"
                        value={SPICE_LEVELS.indexOf(ItemData.spiceLevel)}
                        onChange={handleSpiceLevel}
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-[#463ee4]"
                        style={{
                          background: `linear-gradient(to right, #463ee4 0%, #463ee4 ${
                            (SPICE_LEVELS.indexOf(ItemData.spiceLevel) / 3) * 100
                          }%, #e5e7eb ${
                            (SPICE_LEVELS.indexOf(ItemData.spiceLevel) / 3) * 100
                          }%, #e5e7eb 100%)`,
                        }}
                      />
                  <span className="text-sm font-medium text-gray-700 min-w-[70px]">{ItemData.spiceLevel}</span>
                </div>
              </div>

              {/* Allergen Warnings */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Allergen Warnings</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasNuts"
                      checked={ItemData.allergens?.hasNuts}
                      onChange={handleAllergens}
                      className="w-4 h-4 accent-[#463ee4] text-[#463ee4] border-gray-400 rounded focus:ring-[#463ee4]"
                    />
                    <span className="text-gray-900 text-sm">Nuts</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasDiary"
                      checked={ItemData.allergens?.hasDiary}
                      onChange={handleAllergens}
                     className="w-4 h-4 accent-[#463ee4] text-[#463ee4] border-gray-400 rounded focus:ring-[#463ee4]"
                    />
                    <span className="text-gray-900 text-sm">Dairy</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasGluten"
                      checked={ItemData.allergens?.hasGluten}
                      onChange={handleAllergens}
                      className="w-4 h-4 accent-[#463ee4] text-[#463ee4] border-gray-400 rounded focus:ring-[#463ee4]"
                    />
                    <span className="text-gray-900 text-sm">Gluten</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasSeafood"
                      checked={ItemData.allergens?.hasSeafood}
                      onChange={handleAllergens}
                     className="w-4 h-4 accent-[#463ee4] text-[#463ee4] border-gray-400 rounded focus:ring-[#463ee4]"
                    />
                    <span className="text-gray-900 text-sm">Seafood</span>
                  </label>
                </div>
              </div>

              {/* Bestseller and Trending */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                      type="checkbox"
                      name="isBestseller"
                      checked={ItemData.isBestseller}
                      onChange={handleCheckbox}
                      className="w-4 h-4 accent-[#463ee4] text-[#463ee4] border-gray-400 rounded focus:ring-[#463ee4]"
                    />
                  <span className="text-gray-900 text-sm">Mark as Bestseller</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isTrending"
                    checked={ItemData.isTrending}
                    onChange={handleCheckbox}
                    className="w-4 h-4 accent-[#463ee4] text-[#463ee4] border-gray-400 rounded focus:ring-[#463ee4]"
                  />
                  <span className="text-gray-900 text-sm">Mark as Trending</span>
                </label>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Availability</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={ItemData.availability}
                    onChange={handleAvailabilityChange}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{
                    backgroundColor: ItemData.availability ? '#463ee4' : '#e5e7eb'
                  }}></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlesubmit}
            className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#463ee4]"
            style={{ backgroundColor: '#463ee4' }}
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  </div>
 </>
  );
};


export default AddMenuItemForm;