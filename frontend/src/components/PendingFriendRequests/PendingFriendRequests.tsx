import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useEffect } from "react";
import { GET_PENDING_FRIEND_REQUESTS_RECEIVED } from "../../graphql/queries/getPendingFriendRequestsReceived";
import { ACCEPT_FRIEND_REQUEST } from "../../graphql/mutations/acceptFriendRequest";
import { CANCEL_FRIEND_REQUEST } from "../../graphql/mutations/cancelFriendRequest";
import { GET_FRIENDSHIP_WITH_USER } from "../../graphql/queries/getFriendshipWithUser";
import "./PendingFriendRequests.scss";

const PendingFriendRequests = ({ user }: { user: any }) => {
  const client = useApolloClient();

  const { data, loading, refetch } = useQuery(GET_PENDING_FRIEND_REQUESTS_RECEIVED, {
    notifyOnNetworkStatusChange: true,
    skip: !user,
  });

  useEffect(() => {
    if (user) refetch();
  }, [user, refetch]);

  const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
    onCompleted: () => refetch(),
    refetchQueries: ["GetFriends"],
  });

  const [cancelRequest] = useMutation(CANCEL_FRIEND_REQUEST, {
    onCompleted: () => refetch(),
  });

  const handleAccept = async (userId: number) => {
    const id = await fetchFriendshipId(userId);
    if (id !== null) {
      await acceptRequest({ variables: { friendshipId: id } });
    }
  };

  const handleRefuse = async (userId: number) => {
    const id = await fetchFriendshipId(userId);
    if (id !== null) {
      await cancelRequest({ variables: { friendshipId: id } });
    }
  };

  const fetchFriendshipId = async (userId: number): Promise<number | null> => {
    const result = await client.query({
      query: GET_FRIENDSHIP_WITH_USER,
      variables: { userId },
      fetchPolicy: "network-only",
    });

    const id = result.data?.getFriendshipWithUser?.id;
    return id !== undefined && id !== null ? Number(id) : null;
  };

  if (loading) return <p className="pending-requests__loader">Chargement...</p>;
  if (!data?.getPendingFriendRequestsReceived?.length) return <p className="pending-requests__empty">Aucune demande en attente.</p>;

  return (
    <div className="pending-requests">
      <h2 className="pending-requests__title">📨 Demandes en attente</h2>
      <ul className="pending-requests__list">
        {data.getPendingFriendRequestsReceived.map((request: any) => {
          const requestId = Number(request.id);
          return (
            <li key={requestId} className="pending-requests__card">
              {request.image ? (
                <img src={request.image} alt="avatar" className="pending-requests__avatar" />
              ) : (
                <div className="pending-requests__avatar--initial">{request.username[0].toUpperCase()}</div>
              )}
              <span className="pending-requests__username">{request.username}</span>
              <div className="pending-requests__buttons">
                <button className="pending-requests__button accept" onClick={() => handleAccept(requestId)}>
                  ✅
                </button>
                <button className="pending-requests__button refuse" onClick={() => handleRefuse(requestId)}>
                  ❌
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PendingFriendRequests;
