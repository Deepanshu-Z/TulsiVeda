"use client";
import axios from "axios";
import { useEffect } from "react";

const page = () => {
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("/api/admin/users/get_all");
      if (response.data.success) console.log(response.data.users);
      else console.log("error getting users", response.data.message);
    };
    fetchUsers();
  }, []);
  return <div>page</div>;
};

export default page;
