import React from "react";
import AuthorizedProfile from "@/components/Profile/AuthorizedProfile/AuthorizedProfile";
import UnauthorizedProfile from "@/components/Profile/UnauthorizedProfile/UnauthorizedProfile";
import Container from "@/components/ui/Container";
import { useQuery } from "@tanstack/react-query";
import UnverifiedUser from "../../components/Profile/UnverifiedUser/UnverifiedUser";
import LoadingPage from "../../components/LoadingPage/LoadingPage";

export default function Profile() {
  const { data: authUser, isLoading } = useQuery({ queryKey: ['authUser'] });

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <section className="py-8">
      <Container>
        {/* Conditional Rendering */}
        {!authUser ? (
          <UnauthorizedProfile />
        ) : !authUser.isVerified ? (
          <UnverifiedUser authUser={authUser} />
        ) : (
          <AuthorizedProfile authUser={authUser} />
        )}
      </Container>
    </section>
  );
}
