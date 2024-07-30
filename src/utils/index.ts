import { createClient } from "@supabase/supabase-js";

export const supabaseClient = async (supabaseAccessToken: string) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "",
    {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    }
  );

  return supabase;
};

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract parts of the date
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Pad minutes and seconds with leading zeros if necessary
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secondsStr = seconds < 10 ? "0" + seconds : seconds;

  // Construct the formatted string
  const formattedTime = `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
  const formattedDate = `${month} ${day}, ${year} - ${formattedTime}`;

  return formattedDate;
}
