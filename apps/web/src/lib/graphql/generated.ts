import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type CreateTransactionInput = {
  amount: Scalars['Float']['input'];
  transactionType?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type CreateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteUser?: Maybe<ResponseMsg>;
  saveTransaction?: Maybe<Transaction>;
  saveUser?: Maybe<User>;
  updateUser?: Maybe<User>;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSaveTransactionArgs = {
  transactionData: CreateTransactionInput;
};


export type MutationSaveUserArgs = {
  userData: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  userData: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  asyncGetTransactions: Array<Transaction>;
  asyncGetUser?: Maybe<User>;
  getAllUsers: Array<User>;
  getTransaction?: Maybe<Transaction>;
  getTransactions: Array<Transaction>;
  getUser?: Maybe<User>;
};


export type QueryAsyncGetTransactionsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAsyncGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type ResponseMsg = {
  __typename?: 'ResponseMsg';
  additional?: Maybe<Scalars['JSON']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  transactionType: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type UpdateUserInput = {
  firstName: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  lastName: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  transactions: Array<Transaction>;
};

export type SaveUserMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
}>;


export type SaveUserMutation = { __typename?: 'Mutation', saveUser?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null } | null };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: { __typename?: 'ResponseMsg', message?: string | null, additional?: any | null } | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, transactions: Array<{ __typename?: 'Transaction', id: string, amount: number, userId: string }> } | null };

export type SaveTransactionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  transactionType: Scalars['String']['input'];
}>;


export type SaveTransactionMutation = { __typename?: 'Mutation', saveTransaction?: { __typename?: 'Transaction', amount: number, transactionType: string, userId: string, id: string } | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, transactions: Array<{ __typename?: 'Transaction', id: string, amount: number, userId: string, transactionType: string }> }> };


export const SaveUserDocument = gql`
    mutation SaveUser($firstName: String!, $lastName: String!) {
  saveUser(userData: {firstName: $firstName, lastName: $lastName}) {
    id
    firstName
    lastName
  }
}
    `;
export type SaveUserMutationFn = Apollo.MutationFunction<SaveUserMutation, SaveUserMutationVariables>;

/**
 * __useSaveUserMutation__
 *
 * To run a mutation, you first call `useSaveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveUserMutation, { data, loading, error }] = useSaveUserMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *   },
 * });
 */
export function useSaveUserMutation(baseOptions?: Apollo.MutationHookOptions<SaveUserMutation, SaveUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveUserMutation, SaveUserMutationVariables>(SaveUserDocument, options);
      }
export type SaveUserMutationHookResult = ReturnType<typeof useSaveUserMutation>;
export type SaveUserMutationResult = Apollo.MutationResult<SaveUserMutation>;
export type SaveUserMutationOptions = Apollo.BaseMutationOptions<SaveUserMutation, SaveUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    message
    additional
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: ID!, $firstName: String!, $lastName: String!) {
  updateUser(userData: {id: $id, firstName: $firstName, lastName: $lastName}) {
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
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const SaveTransactionDocument = gql`
    mutation SaveTransaction($userId: String!, $amount: Float!, $transactionType: String!) {
  saveTransaction(
    transactionData: {amount: $amount, transactionType: $transactionType, userId: $userId}
  ) {
    amount
    transactionType
    userId
    id
  }
}
    `;
export type SaveTransactionMutationFn = Apollo.MutationFunction<SaveTransactionMutation, SaveTransactionMutationVariables>;

/**
 * __useSaveTransactionMutation__
 *
 * To run a mutation, you first call `useSaveTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveTransactionMutation, { data, loading, error }] = useSaveTransactionMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      amount: // value for 'amount'
 *      transactionType: // value for 'transactionType'
 *   },
 * });
 */
export function useSaveTransactionMutation(baseOptions?: Apollo.MutationHookOptions<SaveTransactionMutation, SaveTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveTransactionMutation, SaveTransactionMutationVariables>(SaveTransactionDocument, options);
      }
export type SaveTransactionMutationHookResult = ReturnType<typeof useSaveTransactionMutation>;
export type SaveTransactionMutationResult = Apollo.MutationResult<SaveTransactionMutation>;
export type SaveTransactionMutationOptions = Apollo.BaseMutationOptions<SaveTransactionMutation, SaveTransactionMutationVariables>;
export const GetAllUsersDocument = gql`
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

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;