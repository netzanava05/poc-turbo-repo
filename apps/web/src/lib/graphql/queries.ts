import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      firstName
      lastName
      transactions {
        id
        amount
        userId
        transactionType
      }
    }
  }
`;

// export const GET_USERS = gql`
//   query GetUser($id: ID!) {
//     getUser($id: ID!) {
//       id
//       firstName
//       lastName
//       transactions {
//         id
//         amount
//         transactionType
//         userId
//       }
//     }
//   }
// `;