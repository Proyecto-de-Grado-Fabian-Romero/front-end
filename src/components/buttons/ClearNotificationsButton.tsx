import { useState } from "react";
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { clearAllNotifications } from "@/services/notificationsService";

interface ClearNotificationsButtonProps {
  userPublicId: string;
  onCleared?: () => void;
}

export const ClearNotificationsButton: React.FC<
  ClearNotificationsButtonProps
> = ({ userPublicId, onCleared }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleClear = async () => {
    if (!userPublicId) return;
    setLoading(true);
    try {
      const deleted = await clearAllNotifications(userPublicId);
      setFeedback({
        type: "success",
        message: `${deleted} notificaciones eliminadas.`,
      });
      onCleared?.();
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: "No se pudo eliminar las notificaciones.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        onClick={handleClear}
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={18} color="inherit" /> : undefined
        }
        sx={{ marginTop: 16 }}
      >
        {loading ? "Eliminando..." : "Borrar todas"}
      </Button>

      <Snackbar
        open={!!feedback}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {feedback ? (
          <Alert
            onClose={() => setFeedback(null)}
            severity={feedback.type}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
};
