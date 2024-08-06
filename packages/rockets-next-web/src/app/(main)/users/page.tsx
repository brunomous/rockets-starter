"use client";

import { UsersModule } from "@concepta/react-material-ui";
import { toast } from "react-toastify";

const PageUsers = () => {
  return (
    <UsersModule
      onEditError={() => {
        toast.error(
          "We encountered an error while updating the user. Please try again later."
        );
      }}
      onEditSuccess={() => {
        toast.success("User successfully updated.");
      }}
      onCreateError={() => {
        toast.error(
          "We encountered an error while updating the user. Please try again later."
        );
      }}
      onCreateSuccess={() => {
        toast.success("User successfully updated.");
      }}
      cacheApiPath="/cache/user"
    />
  );
};

export default PageUsers;
