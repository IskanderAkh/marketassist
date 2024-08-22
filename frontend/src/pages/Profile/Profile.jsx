import React from "react";
import AuthorizedProfile from "@/components/Profile/AuthorizedProfile/AuthorizedProfile";
import UnauthorizedProfile from "@/components/Profile/UnauthorizedProfile/UnauthorizedProfile";
import Container from "@/components/ui/Container";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { data: authUser, isLoading } = useQuery({ queryKey: ['authUser'] });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-8">
      <Container>
        <div className="text-2xl font-semibold mb-4 mx-auto">Profile</div>
        {authUser ? (
          <AuthorizedProfile firstName={authUser?.firstName} />
        ) : (
          <UnauthorizedProfile />
        )}
      </Container>
    </section>
  );
}
