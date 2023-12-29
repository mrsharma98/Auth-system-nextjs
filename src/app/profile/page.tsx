"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//
export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("");

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      console.log("Logout response -> ", response.data);
      toast.success("Logout successful");
      router.push("/login");

      //
    } catch (error: any) {
      console.log("logout failed -> ", error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log("User details -> ", res.data);
    setData(res.data.data._id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2 className="p-3 rounded bg-green-500">
        {data === "" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
        onClick={logout}
      >
        Logout
      </button>

      <button
        className="bg-green-800 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
        onClick={getUserDetails}
      >
        Get User Details
      </button>
    </div>
  );
}
