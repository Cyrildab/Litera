import { useQuery } from "@apollo/client";
import clsx from "clsx";
import { GET_RECENT_ACTIVITIES } from "../../graphql/queries/getRecentActivities";
import { GET_FRIEND_IDS } from "../../graphql/queries/getFriendIds";
import { useUser } from "../../context/userContext";
import { RefreshIcon } from "../../utils/iconList";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import "./Feed.scss";

const Feed = () => {
  const { user, loading: userLoading } = useUser();
  const [page, setPage] = useState(1);
  const [activities, setActivities] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  const { data: friendData } = useQuery(GET_FRIEND_IDS, {
    skip: userLoading || !user,
    fetchPolicy: "network-only",
  });

  const rawFriendIds = friendData?.getFriendIds || [];
  const friendIds = rawFriendIds.filter((id: number) => id !== user?.id);

  const { data, loading, refetch } = useQuery(GET_RECENT_ACTIVITIES, {
    variables: { userIds: friendIds, skip: 0 },
    skip: userLoading || friendIds.length === 0,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("highlight");
          setTimeout(() => el.classList.remove("highlight"), 2000);
        }
      }, 300);
    }
  }, []);

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

  const loadMore = useCallback(() => {
    if (!data?.getRecentActivities) return;
    const all = data.getRecentActivities;
    const nextChunk = all.slice((page - 1) * 10, page * 10);

    setActivities((prev) => [...prev, ...nextChunk]);
    setPage((prev) => prev + 1);
    if (nextChunk.length < 10) setHasMore(false);
  }, [data, page]);

  useEffect(() => {
    if (page === 1 && data?.getRecentActivities?.length) {
      loadMore();
    }
  }, [data, loadMore, page]);

  useEffect(() => {
    const currentLoader = loader.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loading, loadMore]);

  const handleRefresh = async () => {
    setPage(1);
    setActivities([]);
    setHasMore(true);
    await refetch();
  };

  if (userLoading || loading) return <p>Chargement du fil d’actualité...</p>;

  return (
    <div className="feedpage">
      <div className="feedpage__titlebar">
        <h1 className="feedpage__title">Fil d’actualité</h1>
        <button className="feedpage__refresh" onClick={handleRefresh}>
          <RefreshIcon fontSize="1.3em" />
          <span>Rafraîchir</span>
        </button>
      </div>

      {activities.length === 0 ? (
        <p>Aucune activité récente de tes amis.</p>
      ) : (
        <div className="feedpage__list">
          {activities.map((activity: any) => (
            <div key={activity.id} className="feedpage__card">
              <div className="feedpage__header">
                <Link to={`/users/${activity.user.id}`}>
                  {activity.user.image ? (
                    <img src={activity.user.image} alt="avatar" className="feedpage__avatar" />
                  ) : (
                    <div className="feedpage__avatar--initial">{activity.user.username.charAt(0).toUpperCase()}</div>
                  )}
                </Link>
                <div className="feedpage__info">
                  <p className="feedpage__text">
                    <Link to={`/users/${activity.user.id}`} className="feedpage__userlink">
                      <strong>{activity.user.username}</strong>
                    </Link>{" "}
                    {activity.type === "STATUS" && (
                      <>
                        a changé le statut de <Link to={`/books/${activity.googleBookId}`}>{activity.title || "un livre"}</Link> en
                        <em> {getStatusLabel(activity.status)}</em>
                      </>
                    )}
                    {activity.type === "RATING" && (
                      <>
                        a noté <Link to={`/books/${activity.googleBookId}`}>{activity.title || "un livre"}</Link> :
                        <span className="feedpage__rating"> {activity.rating} ★</span>
                      </>
                    )}
                    {activity.type === "REVIEW" && (
                      <>
                        a commenté{" "}
                        <Link to={{ pathname: `/books/${activity.googleBookId}`, hash: `#review-${activity.user.id}` }}>{activity.title || "un livre"}</Link>
                      </>
                    )}
                  </p>
                  <span className="feedpage__date">
                    {new Date(activity.createdAt).toLocaleString("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>

                  {activity.type === "REVIEW" && activity.review && (
                    <ReviewExcerpt review={activity.review} userId={activity.user.id} bookId={activity.googleBookId} />
                  )}
                </div>
                {activity.cover && (
                  <Link to={`/books/${activity.googleBookId}`}>
                    <img src={activity.cover} alt="cover" className="feedpage__cover" />
                  </Link>
                )}
              </div>
            </div>
          ))}
          {hasMore && (
            <div ref={loader} className="feedpage__loading">
              Chargement...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReviewExcerpt = ({ review, userId, bookId }: { review: string; userId: number; bookId: string }) => {
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 200;
  const isLong = review.length > MAX_LENGTH;

  const displayText = useMemo(() => {
    if (!isLong || expanded) return review;
    return review.slice(0, MAX_LENGTH) + "…";
  }, [isLong, expanded, review]);

  return (
    <Link to={{ pathname: `/books/${bookId}`, hash: `#review-${userId}` }}>
      <blockquote
        className={clsx("feedpage__review clickable-review", {
          "feedpage__review--collapsed": isLong && !expanded,
        })}
      >
        « {displayText} »
        {isLong && (
          <span
            className="feedpage__toggle"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
          >
            {expanded ? " Voir moins" : " Voir plus"}
          </span>
        )}
      </blockquote>
    </Link>
  );
};

export default Feed;
