import { useQuery } from "@apollo/client";
import { GET_RECENT_ACTIVITIES } from "../../graphql/queries/getRecentActivities";
import { GET_FRIEND_IDS } from "../../graphql/queries/getFriendIds";
import { useUser } from "../../context/userContext";
import { useEffect, useState } from "react";
import "./Feed.scss";

const Feed = () => {
  const { user, loading: userLoading } = useUser();

  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (!userLoading && user) {
      setShouldFetch(true);
    }
  }, [userLoading, user]);

  const {
    data: friendData,
    loading: loadingFriends,
    error: errorFriends,
  } = useQuery(GET_FRIEND_IDS, {
    skip: !shouldFetch,
    fetchPolicy: "network-only",
  });

  const rawFriendIds = friendData?.getFriendIds || [];
  const friendIds = rawFriendIds.filter((id: number) => id !== user?.id);

  const { data, loading, error } = useQuery(GET_RECENT_ACTIVITIES, {
    variables: { userIds: friendIds },
    skip: !shouldFetch || friendIds.length === 0,
    fetchPolicy: "network-only",
  });

  if (userLoading || loadingFriends || loading) return <p>Chargement du fil d’actualité...</p>;
  if (errorFriends || error) return <p>Erreur de chargement du fil d’actualité.</p>;

  const activities = data?.getRecentActivities || [];

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

  return (
    <div className="feed">
      <h3>Activités récentes</h3>
      {activities.length === 0 ? (
        <p>Aucune activité récente de tes amis.</p>
      ) : (
        <ul className="feed__list">
          {activities.map((activity: any) => (
            <li key={activity.id} className="feed__item">
              <div className="feed__avatar">
                {activity.user.image ? <img src={activity.user.image} alt="avatar" /> : <div className="feed__initial">{activity.user.username.charAt(0)}</div>}
              </div>
              <div className="feed__content">
                <p>{getActivityText(activity)}</p>
                <span className="feed__date">
                  {new Date(activity.createdAt).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              {activity.cover && <img src={activity.cover} alt="cover" className="feed__cover" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feed;
