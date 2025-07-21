import Grid from "@mui/material/Grid";
import PageTitle from "@/components/Common/PageTitle";
import RevenueReport from "@/components/Dashboard/Analytics/RevenueReport";
import AvarageReport from "@/components/Analytics/Reports/AvarageReport";
import SessionsByCountries from "@/components/Dashboard/Analytics/SessionsByCountries";
import BrowserUsedAndTrafficReports from "@/components/Analytics/Reports/BrowserUsedAndTrafficReports";

export default function Page() {
  return (
    <>
      <PageTitle
        pageTitle="Reports"
        dashboardUrl="/"
        dashboardText="Dashboard"
      />

      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        <Grid item xs={12} md={12} lg={12} xl={5}>
          <RevenueReport />
        </Grid>

        <Grid item xs={12} md={12} lg={12} xl={3}>
          <AvarageReport />
        </Grid>

        <Grid item xs={12} md={12} lg={12} xl={4}>
          <SessionsByCountries />
        </Grid>
      </Grid>

      <BrowserUsedAndTrafficReports />
    </>
  );
}
