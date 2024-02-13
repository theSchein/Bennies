// components/makeNews.jsx
import React, { useState } from 'react';

const MakeNews = ({ collectionId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [viewingGroup, setViewingGroup] = useState('public'); // Default to public
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('/api/news/createNews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection_id: collectionId,
                    title,
                    content,
                    viewing_group: viewingGroup,
                }),
            });

            if (response.ok) {
                // Reset form on successful submission
                setTitle('');
                setContent('');
                setViewingGroup('public');
                setMessage('News item created successfully.');
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'An error occurred.');
            }
        } catch (error) {
            setMessage('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow space-y-4">
            <h2 className="text-2xl font-bold text-center">Create News Item</h2>
            {message && <p className="text-center text-red-500">{message}</p>}
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="4"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="viewingGroup" className="block text-sm font-medium text-gray-700">Viewing Group</label>
                <select
                    id="viewingGroup"
                    value={viewingGroup}
                    onChange={(e) => setViewingGroup(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="public">Public</option>
                    <option value="holders">Holders Only</option>
                    <option value="collectors">Collectors of 5 or More Only</option>
                    {/* <option value="10xholders">Only Holders of 10 or More</option> */}
                </select>
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
    
};

export default MakeNews;
