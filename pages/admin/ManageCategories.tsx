
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Category } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Spinner from '../../components/Spinner';

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) console.error('Error fetching categories', error);
    else setCategories(data as Category[]);
    setLoading(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const { error } = await supabase.from('categories').insert({ name: newCategoryName });
    if (error) console.error('Error adding category:', error);
    else {
      setNewCategoryName('');
      fetchCategories();
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    
    const { error } = await supabase
      .from('categories')
      .update({ name: editingCategory.name })
      .eq('id', editingCategory.id);
      
    if (error) console.error('Error updating category:', error);
    else {
      setEditingCategory(null);
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) console.error('Error deleting category:', error);
      else fetchCategories();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Manage Categories</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <form onSubmit={handleAddCategory} className="flex items-center space-x-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700">
            <Plus className="mr-2 h-5 w-5" /> Add
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-8"><Spinner /></div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((cat) => (
              <li key={cat.id} className="p-4 flex items-center justify-between">
                {editingCategory?.id === cat.id ? (
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</span>
                )}
                <div className="flex items-center space-x-4">
                  {editingCategory?.id === cat.id ? (
                    <>
                      <button onClick={handleUpdateCategory} className="text-green-600 hover:text-green-900">Save</button>
                      <button onClick={() => setEditingCategory(null)} className="text-gray-600 hover:text-gray-900">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingCategory(cat)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">
                        <Edit className="w-5 h-5"/>
                      </button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">
                        <Trash2 className="w-5 h-5"/>
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
