import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { parseZone } from "@lib/parseZone";

dayjs.extend(utc);

const EXPECTED_DATE_STRING = "2021-06-20T11:59:59+02:00";

it("has the right utcOffset regardless of the local timeZone", async () => {
  expect(parseZone(EXPECTED_DATE_STRING).utcOffset()).toEqual(120);
  expect(parseZone(EXPECTED_DATE_STRING).format()).toEqual(EXPECTED_DATE_STRING);
  expect(dayjs(EXPECTED_DATE_STRING).format()).not.toEqual(EXPECTED_DATE_STRING);
});
