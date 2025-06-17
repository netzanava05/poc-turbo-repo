"use client";

import { useGetAllUsersQuery } from "@/lib/graphql/generated";
import Table, { User } from "./components/table";
import UserForm from "./components/user-form";
import { useMemo } from "react";

export default function Home() {
  const addUser = (saveUser: { firstname: string; lastname: string }) => {
    // const newId = users.length + 1;
    // setUsers([...users, { id: newId, ...newUser }]);
  };

  const deleteUser = (id: number) => {
    // setUsers(users.filter((user) => user.id !== id));
  };

  // const { data, loading, error } = useQuery(GET_ALL_USERS, { client });
  const { data, loading, error } = useGetAllUsersQuery();
  const allUsers: User[] = useMemo(() => {
    if (!data?.getAllUsers) return [];
    return data?.getAllUsers.map((user) => ({
      id: parseInt(user.id ?? ""),
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      transactions: user.transactions.map((tran) => ({
        id: parseInt(tran.id ?? ""),
        amount: tran.amount,
        userId: parseInt(tran.userId ?? ""),
        transactionType: tran.transactionType ?? "",
      })),
    }));
  }, [data?.getAllUsers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users: {error.message}</p>;

  return (
    <div className="p-8 text-black flex flex-col gap-8">
      <UserForm onAddUser={addUser} />
      <Table user={allUsers} onDeleteUser={deleteUser} />
    </div>
  );
}
