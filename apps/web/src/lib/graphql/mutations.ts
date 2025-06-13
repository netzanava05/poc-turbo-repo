import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation SaveUser($firstName: String!, $lastName: String!) {
    saveUser(userData: { firstName: $firstName, lastName: $lastName }) {
      id
      firstName
      lastName
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      message
      additional
    }
  }
`;

export const EDIT_USER = gql`
  mutation UpdateUser($id: ID!, $firstName: String!, $lastName: String!) {
    updateUser(
      userData: { id: $id, firstName: $firstName, lastName: $lastName }
    ) {
      transactions {
        id
        amount
        userId
      }
      id
      firstName
      lastName
    }
  }
`;

export const SAVE_TRANSACTION = gql`
  mutation SaveTransaction ($userId: String!, $amount: Float!, $transactionType: String!){
    saveTransaction(
        transactionData: { amount: $amount, transactionType: $transactionType, userId: $userId }
        ) {
        amount
        transactionType
        userId
        id
    }
}
`;
