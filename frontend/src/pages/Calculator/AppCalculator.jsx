import React from "react";
import Container from "@/components/ui/Container";
import ReportDetailByPeriod from "@/components/ReportDetailByPeriod/ReportDetailByPeriod";
import { useQuery } from "@tanstack/react-query";

const AppCalculator = () => {
  const {data:authUser, isLoading: authUserLoading, isError: authUserError} = useQuery({queryKey:['authUser']})
  return (
    <Container>
      <div>
        <ReportDetailByPeriod authUser={authUser} authUserLoading={authUserLoading} authUserError={authUserError} calcApiKey={authUser?.calcApiKey} />
      </div>
    </Container>
  );
};

export default AppCalculator;
