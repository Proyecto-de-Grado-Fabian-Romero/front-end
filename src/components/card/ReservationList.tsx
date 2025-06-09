import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemButton,
} from "@mui/material";
import moment from "moment";
import { type ReservationResponse } from "@/types/Reservations";
import { useRouter } from "next/navigation";
import { PageRoutes } from "@/utils/constants/page-routes";
import ReservationStatusChip from "../chip/ReservationStatusChip";
import { ClockIcon } from "@mui/x-date-pickers";

type Props = {
  reservations: ReservationResponse[];
};

const groupReservations = (reservations: ReservationResponse[]) => {
  const grouped: Record<string, Record<string, ReservationResponse>> = {};

  for (const res of reservations) {
    for (const range of res.timeRanges) {
      const date = moment(range.startDate).format("YYYY-MM-DD");
      const env = res.environmentTitle;

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][env]) grouped[date][env] = { ...res, timeRanges: [] };

      grouped[date][env].timeRanges.push(range);
    }
  }

  return grouped;
};

const ReservationList: React.FC<Props> = ({ reservations }) => {
  const router = useRouter();

  if (!reservations.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No tienes reservas en este día.</Typography>
      </Box>
    );
  }

  const grouped = groupReservations(reservations);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <Box>
      {sortedDates.map((date) => (
        <Box key={date} mb={4}>
          <Typography variant="h6" gutterBottom>
            🗕️ {moment(date).format("DD MMMM YYYY")}
          </Typography>

          {Object.entries(grouped[date]).map(([envTitle, res]) => (
            <Box key={envTitle} mb={2} pl={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {envTitle}
              </Typography>
              <List dense>
                {res.timeRanges.map((range, index) => {
                  const start = moment(range.startDate);
                  const end = moment(range.endDate);
                  const isHospedaje = res.rentalUnit === "Días";
                  const rangeText = isHospedaje
                    ? `${start.format("DD MMM")} → ${end.format("DD MMM")}`
                    : `${start.format("HH:mm")} → ${end.format("HH:mm")}`;

                  return (
                    <ListItem
                      key={`${res.publicId}-${range.startDate}-${index}`}
                      disablePadding
                    >
                      <ListItemButton
                        onClick={() =>
                          router.push(`${PageRoutes.Booking}/${res.publicId}`)
                        }
                      >
                        <Box width="100%" px={1}>
                          <Typography
                            variant="body1"
                            display={"flex"}
                            alignItems={"center"}
                          >
                            <ClockIcon style={{ marginRight: 4 }} /> {rangeText}{" "}
                            —{" "}
                            <b style={{ marginLeft: 4 }}>
                              {res.currency} {res.totalPrice.toFixed(2)}
                            </b>
                          </Typography>
                          <ReservationStatusChip reservation={res} />
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              <Divider />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ReservationList;
