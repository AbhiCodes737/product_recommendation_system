"use client";

import { useEffect, useState } from "react";

interface Account {
  cid: String;
  cname: String;
  gender: String;
  password: String;
  avg_sale: number;
}

const AccountPage = () => {
  const [account, setAccount] = useState<Account>();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://127.0.0.1:8080/decrypt/C001`);
        const data = await response.json();
        setAccount(data);
      } catch (error) {
        console.error("Error fetching account:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <table className="table-auto m-4">
        <tbody>
        <tr>
            <td className="p-3 border border-gray-400">Customer Id:</td>
            <td className="p-3 border border-gray-400">{account?.cid}</td>
          </tr>
          <tr>
            <td className="p-3 border border-gray-400">Customer Name:</td>
            <td className="p-3 border border-gray-400">{account?.cname}</td>
          </tr>
          <tr>
            <td className="p-3 border border-gray-400">Gender:</td>
            <td className="p-3 border border-gray-400">{account?.gender}</td>
          </tr>
          <tr>
            <td className="p-3 border border-gray-400">Password:</td>
            <td className="p-3 border border-gray-400">{account?.password}</td>
          </tr>
          <tr>
            <td className="p-3 border border-gray-400">Average Sale:</td>
            <td className="p-3 border border-gray-400">{account?.avg_sale}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AccountPage;
