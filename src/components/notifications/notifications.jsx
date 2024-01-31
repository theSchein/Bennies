import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Function to fetch notifications
        const fetchNotifications = async () => {
            try {
                const response = await fetch(
                    "/api/notifications/fetchNotifications",
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch notifications");
                }
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch("/api/notifications/markRead", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notificationId }),
            });

            if (!response.ok) {
                throw new Error("Failed to mark notification as read");
            }

            // Optionally, fetch notifications again to update the UI
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification,
                ),
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Check if there are any unread notifications
    const hasUnreadNotifications = notifications.some(
        (notification) => !notification.read,
    );

    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="relative z-10">
                {hasUnreadNotifications ? (
                    <NotificationAddIcon />
                ) : (
                    <NotificationsIcon />
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-light-secondary dark:bg-dark-secondary text-light-quaternary dark:text-dark-quaternary shadow-lg rounded-md overflow-hidden z-20">
                    {notifications.filter((notification) => !notification.read)
                        .length === 0 ? (
                        <div className="p-4 ">No new notifications</div>
                    ) : (
                        notifications
                            .filter((notification) => !notification.read)
                            .map((notification) => (
                                <div
                                    key={notification.id}
                                    className="notification-item p-4 border-b border-gray-200"
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    {notification.message}
                                </div>
                            ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
