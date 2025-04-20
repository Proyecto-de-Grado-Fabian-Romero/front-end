import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

const FilterModal = () => {
  const areas = useSelector((state: RootState) => state.options.areas);
  const services = useSelector((state: RootState) => state.options.services);
  return <div>FilterModal</div>;
};

export default FilterModal;
