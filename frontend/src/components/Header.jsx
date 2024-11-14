import * as React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import UnauthHeader from "./Header/UnauthHeader";
import { useFetchUser } from "@/store/useUserStore";
import AuthHeader from "./Header/AuthHeader";
import { useQuery } from "@tanstack/react-query";

const Header = () => {

  const { data: authUser, isLoading, isError, error } = useQuery({
    queryKey: ['authUser'],
    retry: false,
  });

  if (isLoading) {
    return <div className="header flex justify-center items-center z-20 bg-white"></div>
  }
  return (
    <div className="header flex justify-center items-center z-20 bg-white">
      <Container>
        {
          authUser && !isLoading ?
            <AuthHeader />
            :
            <UnauthHeader />
        }

      </Container>
    </div>
  );
};




export default Header;
