import { MILLISECONDS_IN_TWO_HOURS } from "./constants";

export const inThePast = (time: Date) => Date.now() > time.getTime();
export const twoHoursFromNow = () => Date.now() + MILLISECONDS_IN_TWO_HOURS;
