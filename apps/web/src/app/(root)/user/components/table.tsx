'use client'

import { useState } from "react";
import { DELETE_USER, EDIT_USER, SAVE_TRANSACTION } from "../../../../lib/graphql/mutations";
import { useMutation } from "@apollo/client";
import { GET_ALL_USERS } from "../../../../lib/graphql/queries";

export interface Transaction {
  id: number;
  amount: number;
  userId: number;
  transactionType: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  transactions: Transaction[];
}

interface Props {
  user: User[];
  onDeleteUser: (id: number) => void;
}

export default function Table({ user, onDeleteUser }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = user.filter((u) =>
    `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const usersToShow = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const openViewDialog = (user: User) => {
    console.log("selectedUser", selectedUser);
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setIsEditDialogOpen(true);
  };

  const confirmDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsConfirmDeleteDialogOpen(true);
  };

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });

  const [editUser] = useMutation(EDIT_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });

  const handleDelete = async (userId: number) => {
    try {
      const variables = { id: userId };
      await deleteUser({ variables });
      onDeleteUser(userId);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = async (
    userId: number,
    firstName: String,
    lastName: String
  ) => {
    try {
      const variables = { id: userId, firstName, lastName };
      await editUser({ variables });
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  const [saveTransaction] = useMutation(SAVE_TRANSACTION, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });

  const handleSaveTransaction = async (
    userId: number,
    amount: string,
    transactionType: string
  ) => {
    const parsedAmount = parseFloat(amount);
    if (!userId || !transactionType || isNaN(parsedAmount)) return;
    try {
      const { data } = await saveTransaction({
        variables: {
          userId,
          amount: parsedAmount,
          transactionType,
        },
      });

      const newTxn = data?.saveTransaction;

      if (newTxn && selectedUser) {
        
        setSelectedUser((prev: any) => ({
          ...prev,
          transactions: [...(prev.transactions || []), newTxn],
        }));

        //clear form
        setAmount("");
        setTransactionType("");
        setShowAddTransaction(false);
      }
    } catch (error) {
      console.error("Save transaction failed:", error);
    }
  };
  

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <span className="text-gray-700 font-medium">
          Total users: {filteredUsers.length}
        </span>

        {/* 🔍 Search */}
        <div className="flex-1 md:flex-none">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page
            }}
            className="border border-gray-300 rounded px-3 py-1 text-sm w-full md:w-64"
          />
        </div>

        {/* 🔢 Items per page */}
        <div>
          <label htmlFor="itemsPerPage" className="text-sm text-gray-700 mr-2">
            Show
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <table className="min-w-full border  text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {usersToShow.map((u: User) => (
            <tr key={u.id}>
              <td
                className="border border-black px-4 py-2 text-blue-600 underline cursor-pointer hover:text-blue-800 transition"
                onClick={() => openViewDialog(u)}
                // onClick={() => router.push(`/user/${u.id}`)}
              >
                {u.firstName}
              </td>
              <td className="border px-4 py-2">{u.lastName}</td>
              <td className="border px-4 py-2">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => openEditDialog(u)}
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDeleteDialog(u)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-2">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border text-sm ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* View Dialog */}
      {}
      {isViewDialogOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 p-6 border border-gray-200 
              max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              User Detail
            </h2>
            {/* Form */}
            <div className="flex flex-col gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={selectedUser.firstName}
                  disabled
                  className="w-full border border-gray-300 bg-gray-50 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={selectedUser.lastName}
                  disabled
                  className="w-full border border-gray-300  bg-gray-50  rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {selectedUser?.transactions &&
              selectedUser.transactions.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Transactions:</h3>
                  <ul className="space-y-2">
                    {selectedUser.transactions.map((txn) => (
                      <li key={txn.id} className="p-2 border rounded">
                        <div>
                          <strong>ID:</strong> {txn.id}
                        </div>
                        <div>
                          <strong>Amount:</strong> {txn.amount}
                        </div>
                        <div>
                          <strong>User ID:</strong> {txn.userId}
                        </div>
                        <div>
                          <strong>Transaction Type:</strong> {txn.transactionType}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No transactions found.</p>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsViewDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {isEditDialogOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 p-6 border border-gray-200 
              max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Edit User
            </h2>

            {/* Form */}
            <div className="flex flex-col gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  defaultValue={selectedUser.firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedUser.lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter last name"
                />
              </div>

              {/* Transaction Section */}
              {selectedUser?.transactions &&
              selectedUser.transactions.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Transactions:</h3>
                  <ul className="space-y-2">
                    {selectedUser.transactions.map((txn) => (
                      <li key={txn.id} className="p-2 border rounded">
                        <div>
                          <strong>ID:</strong> {txn.id}
                        </div>
                        <div>
                          <strong>Amount:</strong> {txn.amount}
                        </div>
                        <div>
                          <strong>User ID:</strong> {txn.userId}
                        </div>
                        <div>
                          <strong>Transaction Type:</strong> {txn.transactionType}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No transactions found.</p>
              )}

              {/* Add Transaction Section */}
              <div className="border-t pt-4 mt-6">
                <h4 className="text-md font-semibold mb-2">Add Transaction</h4>

                {!showAddTransaction && (
                  <button
                    onClick={() => {
                      setShowAddTransaction(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    + Add Transaction
                  </button>
                )}

                {showAddTransaction && (
                  <div className="flex flex-col gap-2 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Type
                      </label>
                      <input
                        type="text"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        placeholder="Enter transaction type"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          console.log("✅ New transaction:", {
                            amount: amount,
                            type: transactionType,
                            userId: selectedUser?.id,
                          });
                          handleSaveTransaction(
                            selectedUser?.id,
                            amount,
                            transactionType
                          );
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Save Transaction
                      </button>
                      <button
                        onClick={() => {
                          setShowAddTransaction(false);
                          setAmount("");
                          setTransactionType("");
                        }}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setShowAddTransaction(false);
                  setAmount("");
                  setTransactionType("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleEdit(selectedUser.id, firstName, lastName);
                  setIsEditDialogOpen(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {isConfirmDeleteDialogOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 p-6 border border-gray-200 
              max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete{" "}
              <strong>
                {selectedUser.firstName} {selectedUser.lastName} ?{" "}
              </strong>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsConfirmDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={async () => {
                  await handleDelete(selectedUser.id);
                  setIsConfirmDeleteDialogOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
