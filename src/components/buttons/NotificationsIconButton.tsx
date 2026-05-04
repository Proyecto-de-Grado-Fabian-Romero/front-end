import Link from "next/link";
import { IconButton, Badge } from "@mui/material";
import {
  markAllNotificationsRead,
} from "@/services/notificationsService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { PageRoutes } from "@/utils/constants/page-routes";

export function NotificationsIconButton({
  headerItems,
}: {
  headerItems: { label: string; icon: React.ReactNode }[];
}) {
  const router = useRouter();
  const [hasNotifications, setHasNotifications] = useState(false);

  const user = useSelector((state: RootState) => state.user);

  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     if (!user.publicId) return;
  //     const count = await getUnreadCount(user.publicId);
  //     if (mounted) setHasNotifications(count > 0);
  //   })();
  //   return () => {
  //     mounted = false;
  //   };
  // }, [user.publicId]);

  const handleClick = async () => {
    setHasNotifications(false);
    if (user.publicId) {
      try {
        await markAllNotificationsRead(user.publicId);
      } catch {}
    }
    router.push("/notificaciones");
  };

  return (
    <Link href={PageRoutes.Notifications} passHref>
      <IconButton color="secondary" onClick={handleClick}>
        <Badge color="error" variant="dot" invisible={!hasNotifications}>
          {headerItems.find((item) => item.label === "Notificaciones")?.icon}
        </Badge>
      </IconButton>
    </Link>
  );
}
