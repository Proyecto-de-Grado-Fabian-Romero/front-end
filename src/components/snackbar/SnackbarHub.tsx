import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { close } from "@/store/slices/notificationSlice";
import { Alert, Slide, Snackbar } from "@mui/material";
// import { usePushSetup } from "@/hooks/usePushSetUp";

export function SnackbarHub() {
  // usePushSetup();
  const dispatch = useAppDispatch();
  const { open, current } = useAppSelector((s) => s.notifications);

  const severity =
    current?.type === "Success"
      ? "success"
      : current?.type === "Alert"
        ? "warning"
        : current?.type === "Error"
          ? "error"
          : "info";

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={(_, reason) => {
        if (reason !== "clickaway") dispatch(close());
      }}
      TransitionComponent={(p) => <Slide {...p} direction="left" />}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={() => dispatch(close())}
        sx={{ width: "100%" }}
      >
        <strong>{current?.title}</strong>
        {current?.message ? (
          <div style={{ fontSize: 13 }}>{current.message}</div>
        ) : null}
      </Alert>
    </Snackbar>
  );
}
