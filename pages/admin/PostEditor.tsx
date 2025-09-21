

import React, { useState, useEffect } from 'react';
// FIX: Use namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Category, Post } from '../../types';
import { generateArticle, generateSeoSuggestions, generateImageFromPrompt, generateSummary } from '../../services/geminiService';
import { Sparkles, Save, Upload, Image as ImageIcon, FileText, Search } from 'lucide-react';
import Spinner from '../../components/Spinner';

const PostEditor = () => {
    const { id } = ReactRouterDOM.useParams();
    const navigate = ReactRouterDOM.useNavigate();
    const { user } = useAuth();
    const location = ReactRouterDOM.useLocation();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [imageUrl, setImageUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    const isEditing = Boolean(id);
    
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) console.error("Error fetching categories", error);
            else setCategories(data || []);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            setLoading(true);
            const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
            if (error) {
                console.error('Error fetching post:', error);
                navigate('/admin/posts');
            } else if (data) {
                const post = data as Post;
                setTitle(post.title);
                setContent(post.content);
                setCategory(post.category);
                setStatus(post.status);
                setImageUrl(post.image_url || '');
                setSummary(post.summary || '');
                setMetaDescription(post.meta_description || '');
                
                const rawKeywords: any = post.keywords;
                let keywordsArray: string[] = [];
                if (Array.isArray(rawKeywords)) {
                    keywordsArray = rawKeywords;
                } else if (typeof rawKeywords === 'string' && rawKeywords) {
                    keywordsArray = rawKeywords.split(',').map(k => k.trim());
                }
                setKeywords(keywordsArray);
            }
            setLoading(false);
        };

        if (isEditing) {
            fetchPost();
        } else {
            // Reset form for "new post" page, potentially pre-filled from location state
            setTitle(location.state?.initialTitle || '');
            setContent(location.state?.initialContent || '');
            setCategory('');
            setStatus('draft');
            setImageUrl('');
            setSummary('');
            setMetaDescription('');
            setKeywords([]);
        }
    }, [id, isEditing, navigate, location.state]);
    
    const base64ToBlob = (base64: string, mimeType: string): Blob => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        uploadFile(event.target.files[0]);
    };

    const uploadFile = async (file: File | Blob) => {
        const fileName = `${Date.now()}_${'name' in file ? file.name : 'ai_generated.jpg'}`;
        setIsUploading(true);
        const { data, error } = await supabase.storage.from('post-images').upload(fileName, file);
        if (error) {
            console.error('Error uploading image:', error);
            setAiError('Failed to upload image.');
        } else if (data) {
            const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(data.path);
            setImageUrl(publicUrl);
        }
        setIsUploading(false);
    }

    const handleAiAction = async (action: 'article' | 'image' | 'seo' | 'summary') => {
        if(isGenerating) return;
        setIsGenerating(action);
        setAiError(null);
        try {
            switch(action) {
                case 'article':
                    if (!aiTopic) throw new Error("Please enter a topic.");
                    const article = await generateArticle(aiTopic);
                    setTitle(article.title);
                    setContent(article.content);
                    setMetaDescription(article.meta_description);
                    setKeywords(article.keywords);
                    break;
                case 'image':
                    if (!title) throw new Error("Please provide a title for the post first.");
                    const base64Image = await generateImageFromPrompt(title);
                    const imageBlob = base64ToBlob(base64Image, 'image/jpeg');
                    await uploadFile(imageBlob);
                    break;
                case 'seo':
                    if (!content) throw new Error("Content is required to generate SEO.");
                    const suggestions = await generateSeoSuggestions(content);
                    setTitle(suggestions.seoTitle);
                    setMetaDescription(suggestions.metaDescription);
                    setKeywords(suggestions.keywords);
                    break;
                case 'summary':
                    if (!content) throw new Error("Content is required to generate a summary.");
                    const result = await generateSummary(content);
                    setSummary(result);
                    break;
            }
        } catch (error) {
            console.error(error);
            setAiError((error as Error).message);
        }
        setIsGenerating(null);
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const postData = {
            title,
            content,
            category,
            status,
            image_url: imageUrl,
            author: user?.email,
            summary,
            meta_title: title,
            meta_description: metaDescription,
            keywords
        };
        
        let error;
        if (isEditing) {
            ({ error } = await supabase.from('posts').update(postData).eq('id', id));
        } else {
            ({ error } = await supabase.from('posts').insert(postData));
        }

        if (error) {
            console.error('Error saving post:', error);
        } else {
            navigate('/admin/posts');
        }
        setLoading(false);
    };

    if (loading && isEditing) return <div className="flex justify-center p-8"><Spinner /></div>;
    
    const AiButton = ({ action, icon: Icon, text, disabledCondition }: { action: 'article' | 'image' | 'seo' | 'summary', icon: React.ElementType, text: string, disabledCondition?: boolean }) => (
        <button type="button" onClick={() => handleAiAction(action)} disabled={!!isGenerating || disabledCondition} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-300 transition-colors">
            {isGenerating === action ? <Spinner /> : <><Icon className="mr-2 h-5 w-5"/> {text}</>}
        </button>
    );

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
            
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold flex items-center mb-4"><Sparkles className="mr-2 text-primary-500"/> AI Content Suite</h2>
                 <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        placeholder="Enter a topic to generate a full article..."
                        className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                    <AiButton action="article" icon={Sparkles} text="Generate Article" disabledCondition={!aiTopic}/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <AiButton action="image" icon={ImageIcon} text="Gen Thumbnail" disabledCondition={!title}/>
                    <AiButton action="seo" icon={Search} text="Optimize SEO" disabledCondition={!content}/>
                    <AiButton action="summary" icon={FileText} text="Gen Summary" disabledCondition={!content}/>
                </div>
                {aiError && <p className="text-red-500 text-sm mt-4">{aiError}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                 <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Content (Markdown supported)</label>
                    <textarea value={content} onChange={e => setContent(e.target.value)} required rows={15} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 font-mono"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium">AI-Generated Summary</label>
                    <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium">Featured Image</label>
                    <div className="mt-1 flex items-center space-x-4">
                        <input type="file" id="imageUpload" onChange={handleImageUpload} className="hidden" accept="image/*" />
                        <label htmlFor="imageUpload" className="cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                           <Upload className="w-4 h-4 mr-2 inline-block"/> {isUploading ? 'Uploading...' : 'Upload Image'}
                        </label>
                        {imageUrl && <img src={imageUrl} alt="preview" className="h-16 w-auto object-contain rounded-md"/>}
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-md font-semibold border-b pb-2">SEO Details</h3>
                     <div>
                        <label className="block text-sm font-medium">Meta Description</label>
                        <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={2} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Keywords (comma-separated)</label>
                        <input type="text" value={keywords.join(', ')} onChange={e => setKeywords(e.target.value.split(',').map(k => k.trim()))} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="">Select a category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as any)} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 disabled:bg-primary-300">
                        <Save className="mr-2 h-5 w-5"/>
                        {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostEditor;