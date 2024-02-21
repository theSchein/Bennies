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
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-light-primary dark:bg-dark-primary text-light-quaternary dark:text-dark-quaternary p-8 rounded-lg shadow space-y-4">
            <h2 className="text-2xl font-bold text-center">Create News Item</h2>
            {message && <p className="text-center text-red-500">{message}</p>}
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-light-tertiary dark:border-dark-tertiary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium ">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-light-tertiary dark:border-dark-tertiary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="4"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="viewingGroup" className="block text-sm font-medium ">Viewing Group</label>
                <select
                    id="viewingGroup"
                    value={viewingGroup}
                    onChange={(e) => setViewingGroup(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-light-tertiary dark:border-dark-tertiary rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="public">Public</option>
                    <option value="holders">Holders Only</option>
                    <option value="collectors">Collectors of 5 or More Only</option>
                    {/* <option value="10xholders">Only Holders of 10 or More</option> */}
                </select>
            </div>
            <button type="submit" disabled={isSubmitting} className={`btn text-center`}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
    
};

export default MakeNews;
