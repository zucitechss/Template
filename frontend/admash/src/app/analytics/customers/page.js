import Grid from "@mui/material/Grid";
import PageTitle from "@/components/Common/PageTitle";
import AudienceOverview from "@/components/Dashboard/Analytics/AudienceOverview";
import VisitsByDay from "@/components/Analytics/Customers/VisitsByDay";
import NetIncome from "@/components/Analytics/Customers/NetIncome";
import NewSessions from "@/components/Analytics/Customers/NewSessions";
import CustomersDetails from "@/components/Analytics/Customers/CustomersDetails";

export default function Page() {
  return (
    <>
      <PageTitle
        pageTitle="Customers"
        dashboardUrl="/"
        dashboardText="Dashboard"
      />

      {/* AudienceOverview */}
      <AudienceOverview />

      <Grid
        container
        rowSpacing={1}
        justifyContent="center"
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }}
      >
        <Grid item xs={12} md={6} lg={6} xl={4}>
          <VisitsByDay />
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={4}>
          <NetIncome />
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={4}>
          <NewSessions />
        </Grid>
      </Grid>

      {/* CustomersDetails */}
      <CustomersDetails />
    </>
  );
}
