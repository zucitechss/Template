import React from "react";
import Grid from "@mui/material/Grid";
import NewProjects from "@/components/Projects/KanbanBoard/NewProjects";
import ToDo from "@/components/Projects/KanbanBoard/ToDo";
import InReview from "@/components/Projects/KanbanBoard/InReview";

import PageTitle from "@/components/Common/PageTitle";

const KanbanBoard = () => {
  return (
    <>
      <PageTitle
        pageTitle="Kanban Board"
        dashboardUrl="/"
        dashboardText="Dashboard"
      />

      <Grid
        container
        rowSpacing={1}
        justifyContent="center"
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        <Grid item xs={12} md={6} lg={6} xl={4}>
          {/* NewProjects */}
          <NewProjects />
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={4}>
          {/* ToDo */}
          <ToDo />
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={4}>
          {/* InReview */}
          <InReview />
        </Grid>
      </Grid>
    </>
  );
};

export default KanbanBoard;
