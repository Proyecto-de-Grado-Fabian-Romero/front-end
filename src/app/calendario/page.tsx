"use client";

import React, { useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
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
// import BlockedEnvironments from "@/components/list/BlockedEnvironments";
import BlockTimeDialog from "@/components/modal/BlockTimeDialog";
import { BlockedDate } from "@/types/Availability";
import moment from "moment";

const StyledCalendar = styled(DateCalendar)(({ theme }) => ({
  "& .MuiPickersCalendarHeader-root": {
    fontSize: "1.2rem",
    padding: theme.spacing(2),
  },
  "& .MuiPickersDay-root": {
    fontSize: "1rem",
    margin: theme.spacing(0.5),
    width: 44,
    height: 44,
  },
  "& .MuiPickersDay-dayWithMargin": {
    fontSize: "1rem",
  },
  "& .MuiPickersCalendarHeader-label": {
    fontWeight: "bold",
  },
  "& .MuiPickersCalendarHeader-switchViewButton": {
    fontSize: "1.2rem",
  },
  "& .MuiDayCalendar-weekDayLabel": {
    fontSize: "0.9rem",
    fontWeight: 500,
  },
}));

const OwnerBlockedCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(moment());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockedItems, setBlockedItems] = useState<BlockedDate[]>([]);

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
          mt: 12,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <StyledCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            views={["day", "month"]}
            showDaysOutsideCurrentMonth
            disablePast={false}
            reduceAnimations={false}
          />
        </LocalizationProvider>
      </Box>
      {selectedDate && (
        <>
          <Box mt={4}>
            <OwnerDailyReservations date={selectedDate} />
          </Box>
          <Box mt={4}>
            {/* <BlockedEnvironments
              date={selectedDate}
              onLoad={(items) => setBlockedItems(items)}
            /> */}
          </Box>
        </>
      )}
      {selectedDate && (
        <Box mt={2} display="flex" justifyContent="center">
          {/* <Button
            onClick={() => setDialogOpen(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            variant="outlined"
          >
            Bloquear Fecha/Horario de Ambiente
          </Button> */}
        </Box>
      )}
      {selectedDate && (
        <BlockTimeDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          selectedDate={selectedDate}
          existingBlocks={blockedItems}
        />
      )}
    </>
  );
};

export default OwnerBlockedCalendar;
