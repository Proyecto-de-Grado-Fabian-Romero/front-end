import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export type NotificationType = "Info" | "Success" | "Alert" | "Error";

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  at: number;
  data?: Record<string, string>;
  unread?: boolean;
}

interface State {
  queue: InAppNotification[];
  list: InAppNotification[];
  open: boolean;
  current?: InAppNotification;
}

const initialState: State = {
  queue: [],
  list: [],
  open: false,
};

const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    enqueue(
      state,
      action: PayloadAction<
        Omit<InAppNotification, "id" | "at"> & { id?: string; at?: number }
      >,
    ) {
      const n: InAppNotification = {
        id: action.payload.id ?? nanoid(),
        at: action.payload.at ?? Date.now(),
        title: action.payload.title,
        message: action.payload.message,
        type: action.payload.type ?? "Info",
        data: action.payload.data,
        unread: true,
      };
      state.queue.push(n);
      state.list.unshift(n);
      if (!state.open && !state.current) {
        state.current = state.queue.shift();
        state.open = !!state.current;
      }
    },
    close(state) {
      state.open = false;
    },
    exited(state) {
      state.current = state.queue.shift();
      state.open = !!state.current;
    },
    markAllRead(state) {
      state.list.forEach((n) => (n.unread = false));
    },
    clear(state) {
      state.list = [];
      state.queue = [];
      state.current = undefined;
      state.open = false;
    },
  },
});

export const { enqueue, close, exited, markAllRead, clear } = slice.actions;
export default slice.reducer;
