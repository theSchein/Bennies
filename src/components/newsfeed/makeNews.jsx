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
        <form onSubmit={handleSubmit}>
            <h2>Create News Item</h2>
            {message && <p>{message}</p>}
            <div>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="viewingGroup">Viewing Group</label>
                <select
                    id="viewingGroup"
                    value={viewingGroup}
                    onChange={(e) => setViewingGroup(e.target.value)}
                >
                    <option value="public">Public</option>
                    <option value="holders">Holders Only</option>
                    <option value="3xholders">Only Holders of 3 or More</option>
                    <option value="10xholders">Only Holders of 10 or More</option>

                </select>
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
};

export default MakeNews;
