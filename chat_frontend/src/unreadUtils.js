import _fetch from './fetch.js';

// Mark a room as read
export const markRoomAsRead = async (userId, roomId) => {
    try {
        const response = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/unread/markRead`, 'POST', {
            userId,
            roomId
        });
        return await response.json();
    } catch (error) {
        console.error('Error marking room as read:', error);
        throw error;
    }
};

// Get unread counts for all user's rooms
export const getUnreadCounts = async (userId) => {
    try {
        const response = await _fetch(`${import.meta.env.VITE_BACKEND_URL}/unread/counts?userId=${userId}`, 'GET');
        return await response.json();
    } catch (error) {
        console.error('Error getting unread counts:', error);
        throw error;
    }
};
