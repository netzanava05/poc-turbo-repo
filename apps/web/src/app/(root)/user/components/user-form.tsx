"use client";

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { ADD_USER } from "../../../../lib/graphql/mutations";
import { GET_ALL_USERS } from "../../../../lib/graphql/queries";
// import { Props } from "next/script";

interface Props {
  onAddUser: (user: { firstname: string; lastname: string }) => void;
}

export default function UserForm({ onAddUser }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [addUser] = useMutation(ADD_USER, {
    update(cache, { data }) {
      if (!data?.saveUser) return;

      const existing: any = cache.readQuery({ query: GET_ALL_USERS });

      cache.writeQuery({
        query: GET_ALL_USERS,
        data: {
          getAllUsers: [...(existing?.getAllUsers || []), data.saveUser],
        },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;
  
    const formattedFirst = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const formattedLast = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
  
    try {
      await addUser({ variables: { firstName: formattedFirst, lastName: formattedLast } });
      setFirstName("");
      setLastName("");
      alert("User added successfully!");
    
    } catch (error) {
      console.error("Error in addUser:", error);
    }

    if (!/^[A-Z][a-z]*$/.test(firstName)) {
      alert("First name must start with uppercase and contain only lowercase letters after.");
      return;
    }
  };
  
  return (
    <div className="flex justify-center mt-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 shadow-md rounded-lg border border-gray-200"
      >
        <div className="flex flex-col">
          <label
            htmlFor="first_name"
            className="mb-1 font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="last_name" className="mb-1 font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors mt-4 md:mt-6 md:ml-4"
        >
          Add user
        </button>
      </form>
    </div>
  );
}
