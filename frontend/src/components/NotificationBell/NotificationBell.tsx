import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useQuery } from "@apollo/client";
import { GET_FRIEND_IDS } from "../../graphql/queries/getFriendIds";
import { GET_RECENT_ACTIVITIES } from "../../graphql/queries/getRecentActivities";
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.scss";

const LOCAL_STORAGE_KEY = "lastSeenNotifications";

const NotificationBell = () => {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setLastSeen(new Date(stored));
    }
  }, []);

  const { data: friendData } = useQuery(GET_FRIEND_IDS, {
    fetchPolicy: "network-only",
  });

  const friendIds = (friendData?.getFriendIds || []).filter((id: number) => id !== user?.id);

  const { data: activityData } = useQuery(GET_RECENT_ACTIVITIES, {
    variables: { userIds: friendIds },
    skip: friendIds.length === 0,
    fetchPolicy: "network-only",
  });

  const activities = useMemo(() => activityData?.getRecentActivities || [], [activityData]);

  const newNotificationsCount = useMemo(() => {
    if (!lastSeen) return activities.length;
    return activities.filter((a: any) => new Date(a.createdAt) > lastSeen).length;
  }, [activities, lastSeen]);

  const hasNew = newNotificationsCount > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    const now = new Date();
    setLastSeen(now);
    localStorage.setItem(LOCAL_STORAGE_KEY, now.toISOString());
  };

  const getActivityText = (activity: any) => {
    const username = activity.user.username;
    const title = activity.title || "un livre";

    switch (activity.type) {
      case "STATUS":
        return `${username} a changé le statut de "${title}" en "${getStatusLabel(activity.status)}"`;
      case "RATING":
        return `${username} a noté "${title}" : ${activity.rating} ★`;
      case "REVIEW":
        return `${username} a commenté "${title}"`;
      default:
        return `${username} a interagi avec "${title}"`;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "TO_READ":
        return "À lire";
      case "IN_PROGRESS":
        return "En cours";
      case "ABANDONED":
        return "Abandonné";
      case "READ":
        return "Lu";
      default:
        return status;
    }
  };

  const handleClickNotification = (activity: any) => {
    const base = `/books/${activity.googleBookId}`;
    const path = activity.type === "REVIEW" ? `${base}#review-${activity.user.id}` : base;
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button className="notification-button" onClick={toggleDropdown}>
        <Icon icon="ph:bell-ringing" fontSize="1.5em" color="currentColor" />
        {hasNew && <span className="notification-badge">{newNotificationsCount > 9 ? "9+" : newNotificationsCount}</span>}
      </button>

      {dropdownOpen && (
        <div className="notification-dropdown">
          <h4>Activités de tes amis</h4>
          {activities.length === 0 ? (
            <p>Aucune activité récente.</p>
          ) : (
            <ul className="notification-list">
              {activities.slice(0, 10).map((activity: any) => (
                <li key={activity.id} className="notification-item" onClick={() => handleClickNotification(activity)}>
                  <span>{getActivityText(activity)}</span>
                  <small>
                    {new Date(activity.createdAt).toLocaleString("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
