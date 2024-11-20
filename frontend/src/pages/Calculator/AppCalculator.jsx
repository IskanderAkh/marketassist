import React from "react";
import Container from "@/components/ui/Container";
import ReportDetailByPeriod from "@/components/ReportDetailByPeriod/ReportDetailByPeriod";

const AppCalculator = () => {
  return (
    <Container>
      <div className="flex flex-col">
         <h1 className="uppercase font-rfBlack page-title gradient-color mx-auto mt-24 mb-10">Калькулятор прибыли</h1>
        <ReportDetailByPeriod/>
      </div>
    </Container>
  );
};

export default AppCalculator;
