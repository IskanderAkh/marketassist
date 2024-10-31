import React from "react";
import AuthorizedProfile from "@/components/Profile/AuthorizedProfile/AuthorizedProfile";
import UnauthorizedProfile from "@/components/Profile/UnauthorizedProfile/UnauthorizedProfile";
import Container from "@/components/ui/Container";
import { useQuery } from "@tanstack/react-query";
import UnverifiedUser from "../../components/Profile/UnverifiedUser/UnverifiedUser";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { data: authUser, isLoading, isError } = useQuery({ queryKey: ['authUser'] });

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <section className="py-8">
      <Container>
        {!authUser.isVerified ? (
          <UnverifiedUser authUser={authUser} />
        ) : (
          <AuthorizedProfile authUser={authUser} />
        )}
      </Container>
    </section>
  );
}
