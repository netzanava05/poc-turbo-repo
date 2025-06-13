"use client";

import { useGetAllUsersQuery } from '@/lib/graphql/generated';
import Table from "./components/table";
import UserForm from "./components/user-form";

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


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading users: {error.message}</p>;

  return (
    <div className="p-8 text-black flex flex-col gap-8">
      <UserForm onAddUser={addUser} />
      <Table user={data?.getAllUsers} onDeleteUser={deleteUser} />
    </div>
  );
}
