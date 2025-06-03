"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Moment } from "moment";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { UserRole } from "@/types/Users";
import { PageRoutes } from "@/utils/constants/page-routes";
import OwnerDailyReservations from "@/components/list/OwnerDailyReservations";
import BlockedEnvironments from "@/components/list/BlockedEnvironments";

const OwnerBlockedCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const role = useSelector((state: RootState) => state.user.role);
  const router = useRouter();

  useEffect(() => {
    if (!role || role !== UserRole.Owner) {
      router.push(PageRoutes.Home);
    }
  }, [role, router]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          mx: "auto",
          mt: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
          />
        </LocalizationProvider>
      </Box>
      {selectedDate && (
        <>
          <Box mt={4}>
            <OwnerDailyReservations date={selectedDate} />
          </Box>
          <Box mt={4}>
            <BlockedEnvironments date={selectedDate} />
          </Box>
        </>
      )}
    </>
  );
};

export default OwnerBlockedCalendar;
