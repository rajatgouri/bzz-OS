import React, { useLayoutEffect } from "react";

import { useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";

import { FullPageLayout } from "@/layout";
import CrudDataTable from "./CrudDataTable";
import WQTableLayout from "./layout";

export default function ProductivityDataTableModule({ config }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(crud.resetState());
  }, []);

  return (
    // <FullPageLayout>
      <WQTableLayout>
        <CrudDataTable config={config} />
      </WQTableLayout>
    // </FullPageLayout>
  );
}
