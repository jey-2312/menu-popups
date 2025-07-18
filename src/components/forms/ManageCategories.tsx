"use client";
import React, { useState } from 'react';
import { GripVertical, Plus, X } from 'lucide-react';
import { Category } from '../types/categoryTypes';
import { ManageCategoriesProps } from '../types/categoryTypes';




const ManageCategories: React.FC<ManageCategoriesProps> = ({ //Main Component
  isOpen,
  onClose,
  onSave,
  initialCategories = []
}) => {
  // State for managing categories list
  const [categories, setCategories] = useState<Category[]>(
    initialCategories.length > 0 
      ? initialCategories 
      : [
          { id: '1', name: 'Appetizers' },
          { id: '2', name: 'Main Course' },
          { id: '3', name: 'Desserts' },
          { id: '4', name: 'Beverages' }
        ]
  );

  // State for new category input
  const [newCategoryName, setNewCategoryName] = useState('');

  // State for drag and drop functionality
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Function to add a new category
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),   //for giving unique id for each category
        name: newCategoryName.trim()
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    }
  };

  // Handle Enter key press in input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (editingName.trim() && editingId) {
      setCategories(categories.map(cat => 
        cat.id === editingId ? { ...cat, name: editingName.trim() } : cat
      ));
      setEditingId(null);
      setEditingName('');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Handle edit key press
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Handle delete category
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;
    
    const newCategories = [...categories];
    const draggedItem = newCategories[draggedIndex];
    
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedItem);
    
    setCategories(newCategories);
    setDraggedIndex(null);
  };

  // Handle save and close
  const handleSave = () => {
    onSave(categories);
    onClose();
  };

  // Handle cancel - reset to initial state
  const handleCancel = () => {
    setCategories(initialCategories.length > 0 ? initialCategories : [
      { id: '1', name: 'Appetizers' },
      { id: '2', name: 'Main Course' },
      { id: '3', name: 'Desserts' },
      { id: '4', name: 'Beverages' }
    ]);
    setNewCategoryName('');
    setEditingId(null);
    setEditingName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Main popup container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header section */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Manage Categories
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content section */}
          <div className="p-6">
            {/* Add new category section */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add new category"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#463ee4] focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="px-4 py-2 bg-[#463ee4] text-white rounded-md hover:bg-[#3d35d1] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            {/* Categories list */}
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  draggable={editingId !== category.id}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors ${
                    draggedIndex === index ? 'opacity-50' : ''
                  } ${editingId === category.id ? 'bg-gray-50' : ''}`}
                >
                  {/* 6-dot drag handle */}
                  <div className="flex-shrink-0 cursor-move">
                    <GripVertical size={16} className="text-gray-500" />
                  </div>
                  
                  {/* Category name or edit input */}
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={handleEditKeyPress}
                      onBlur={handleSaveEdit}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#463ee4] focus:border-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 text-gray-900 font-medium">
                      {category.name}
                    </span>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {editingId === category.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 text-green-600 hover:text-green-700 transition-colors"
                          title="Save changes"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Cancel editing"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          title="Edit category"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          title="Delete category"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer section with action buttons */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#463ee4] text-white rounded-md hover:bg-[#3d35d1] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ManageCategories;