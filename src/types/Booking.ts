import { Moment } from "moment";

export type ScheduleBlock = {
  date: Moment | null;
  start: Moment | null;
  end: Moment | null;
};
