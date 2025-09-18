import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Advertisement } from '../../types';
import { Plus, Edit, Trash2, Upload, Power, PowerOff, CheckCircle } from 'lucide-react';
import Spinner from '../../components/Spinner';

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
  >
    <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
  </button>
);

const ManageAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [selectedAds, setSelectedAds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initialFormState = {
    title: '',
    ad_description: '',
    image_url: '',
    ad_link: '',
    status: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('advertisements').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching ads:', error);
      setError('Failed to fetch advertisements.');
    } else {
      setAdvertisements(data as Advertisement[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `ads/${fileName}`;
    
    setIsUploading(true);
    setError(null);
    const { data, error } = await supabase.storage.from('advertisement-images').upload(filePath, file);
    if (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image.');
    } else if (data) {
      const { data: { publicUrl } } = supabase.storage.from('advertisement-images').getPublicUrl(data.path);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    }
    setIsUploading(false);
  };

  const handleEditClick = (ad: Advertisement) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingAd(ad);
    setFormData({
        title: ad.title,
        ad_description: ad.ad_description,
        image_url: ad.image_url,
        ad_link: ad.ad_link,
        status: ad.status,
    });
  };

  const resetForm = () => {
    setEditingAd(null);
    setFormData(initialFormState);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url || !formData.ad_link) {
        setError("Please fill in all required fields: Title, Image, and Link.");
        return;
    }
    setIsSubmitting(true);
    setError(null);

    const postData = {
        title: formData.title,
        ad_description: formData.ad_description,
        image_url: formData.image_url,
        ad_link: formData.ad_link,
        status: formData.status
    };

    let error;
    if (editingAd) {
      ({ error } = await supabase.from('advertisements').update(postData).eq('id', editingAd.id));
    } else {
      ({ error } = await supabase.from('advertisements').insert(postData));
    }

    if (error) {
      console.error('Error saving ad:', error);
      setError(`Failed to save advertisement: ${error.message}`);
    } else {
      resetForm();
      fetchAds();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      const { error } = await supabase.from('advertisements').delete().eq('id', id);
      if (error) {
        console.error('Error deleting ad:', error);
        setError('Failed to delete advertisement.');
      } else {
        fetchAds();
      }
    }
  };
  
  const handleSelect = (id: number) => {
    setSelectedAds(prev => 
        prev.includes(id) ? prev.filter(adId => adId !== id) : [...prev, id]
    );
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
        setSelectedAds(advertisements.map(ad => ad.id));
    } else {
        setSelectedAds([]);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
      if(selectedAds.length === 0) return;

      if(action === 'delete') {
          if (!window.confirm(`Are you sure you want to delete ${selectedAds.length} advertisements?`)) return;
          const { error } = await supabase.from('advertisements').delete().in('id', selectedAds);
          if (error) setError(`Failed to delete ads: ${error.message}`);
      } else {
          const newStatus = action === 'activate';
          const { error } = await supabase.from('advertisements').update({ status: newStatus }).in('id', selectedAds);
          if (error) setError(`Failed to update ads: ${error.message}`);
      }
      setSelectedAds([]);
      fetchAds();
  };


  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Website Advertisement</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Ad Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
              <label className="block text-sm font-medium">Redirect Link (URL)</label>
              <input type="url" name="ad_link" value={formData.ad_link} onChange={handleInputChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium">Ad Description</label>
              <textarea name="ad_description" value={formData.ad_description} onChange={handleInputChange} rows={3} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
          </div>
           <div className="flex items-center gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Ad Image</label>
                    <input type="file" id="imageUpload" onChange={handleImageUpload} className="hidden" accept="image/*" />
                    <label htmlFor="imageUpload" className="cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 inline-flex items-center">
                        <Upload className="w-4 h-4 mr-2"/> {isUploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                    {formData.image_url && <img src={formData.image_url} alt="preview" className="h-16 w-auto object-contain rounded-md mt-2"/>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <div className="flex items-center gap-2">
                      <ToggleSwitch checked={formData.status} onChange={checked => setFormData(p => ({...p, status: checked}))} />
                      <span className="text-sm">{formData.status ? "Active" : "Inactive"}</span>
                    </div>
                </div>
           </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4">
            {editingAd && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>}
            <button type="submit" disabled={isSubmitting || isUploading} className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 disabled:bg-primary-300">
              {isSubmitting ? <Spinner/> : <><Plus className="mr-2 h-5 w-5"/> {editingAd ? 'Update Ad' : 'Save Ad'}</>}
            </button>
          </div>
        </form>
      </div>
      
      {selectedAds.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-900/50 p-3 rounded-lg flex items-center justify-between mb-4">
              <p className="text-sm font-medium">{selectedAds.length} ad(s) selected</p>
              <div className="flex items-center space-x-2">
                  <button onClick={() => handleBulkAction('activate')} className="inline-flex items-center text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"><Power className="w-3 h-3 mr-1"/> Activate</button>
                  <button onClick={() => handleBulkAction('deactivate')} className="inline-flex items-center text-xs px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"><PowerOff className="w-3 h-3 mr-1"/> Deactivate</button>
                  <button onClick={() => handleBulkAction('delete')} className="inline-flex items-center text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 className="w-3 h-3 mr-1"/> Delete</button>
              </div>
          </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        {loading ? <div className="flex justify-center p-8"><Spinner /></div> : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3"><input type="checkbox" onChange={handleSelectAll} checked={selectedAds.length > 0 && selectedAds.length === advertisements.length}/></th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {advertisements.map(ad => (
                <tr key={ad.id}>
                  <td className="px-6 py-4"><input type="checkbox" checked={selectedAds.includes(ad.id)} onChange={() => handleSelect(ad.id)} /></td>
                  <td className="px-6 py-4"><img src={ad.image_url} alt={ad.title} className="w-24 h-12 object-contain rounded"/></td>
                  <td className="px-6 py-4 text-sm font-medium">{ad.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.status ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                      {ad.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-4">
                      <button onClick={() => handleEditClick(ad)} className="text-primary-600 hover:text-primary-900"><Edit className="w-5 h-5"/></button>
                      <button onClick={() => handleDelete(ad.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageAdvertisements;