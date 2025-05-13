import { gql } from "@apollo/client";

export const GET_RECENT_ACTIVITIES = gql`
  query GetRecentActivities($userIds: [Int!]) {
    getRecentActivities(userIds: $userIds) {
      id
      type
      createdAt
      googleBookId
      title
      author
      cover
      status
      rating
      review
      user {
        id
        username
        image
      }
    }
  }
`;
