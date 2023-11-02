import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import PageLayout from "../PageLayout/PageLayout";

export default function DefaultLayout() {
  return (
    <>
      <Header />
      <PageLayout>
        <Outlet />
      </PageLayout>
    </>
  );
}
