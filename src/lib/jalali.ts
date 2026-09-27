import { toISO } from "./fa";

const fmt = new Intl.DateTimeFormat("en-u-ca-persian", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export interface JParts {
  jy: number;
  jm: number;
  jd: number;
  /** شنبه = ۰ */
  wd: number;
}

export function jParts(date: Date): JParts {
  const parts = fmt.formatToParts(date);
  const get = (t: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === t)?.value ?? "0");
  return {
    jy: get("year"),
    jm: get("month"),
    jd: get("day"),
    wd: (date.getDay() + 1) % 7,
  };
}

export function jToday() {
  return jParts(new Date());
}

export function jMonthOf(iso: string): { jy: number; jm: number } {
  const [y, m, d] = iso.split("-").map(Number);
  const p = jParts(new Date(y, (m ?? 1) - 1, d ?? 1));
  return { jy: p.jy, jm: p.jm };
}

export function jDayOfWeek(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return jParts(new Date(y, (m ?? 1) - 1, d ?? 1)).wd;
}

/** تعداد روزهای یک ماه جلالی */
export function daysInJMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // اسفند: ۳۰ روز در سال کبیسه‌ی جلالی
  const leapRemainder = (jy + 1) % 33;
  const isLeap = [1, 5, 9, 13, 17, 22, 26, 30].includes(leapRemainder);
  return isLeap ? 30 : 29;
}

export interface CalendarCell {
  iso: string;
  jd: number;
  inMonth: boolean;
  isFriday: boolean;
  isToday: boolean;
  wd: number;
}

export interface JMonth {
  jy: number;
  jm: number;
  days: number;
  /** اولین روز ماه در تقویم میلادی */
  firstISO: string;
  cells: CalendarCell[];
}

/** تقریب اولیه‌ی اول ماه جلالی (سپس با Intl دقیق می‌شود) */
function approxFirst(jy: number, jm: number) {
  return new Date(
    jy - 621,
    jm <= 6 ? 2 : 3,
    1 + (jm - 1) * 31 + (jm > 6 ? -1 : 0),
  );
}

function exactFirst(jy: number, jm: number): Date {
  let probe = approxFirst(jy, jm);
  for (let i = 0; i < 8; i++) {
    const p = jParts(probe);
    const delta = (jy - p.jy) * 366 + (jm - p.jm) * 30.5 + (1 - p.jd);
    if (Math.abs(delta) < 1 && p.jy === jy && p.jm === jm && p.jd === 1)
      return probe;
    probe = new Date(probe.getTime() + Math.round(delta) * 86400000);
  }
  // ضمانت: جست‌وجوی خطی کوتاه
  for (let i = 0; i < 4; i++) {
    const p = jParts(probe);
    if (p.jy === jy && p.jm === jm && p.jd === 1) return probe;
    probe = new Date(probe.getTime() + 86400000);
  }
  return probe;
}

/** شبکه‌ی کامل یک ماه جلالی، ردیف‌ها از شنبه */
export function jMonth(
  jy: number,
  jm: number,
  todayISO = toISO(new Date()),
): JMonth {
  const first = exactFirst(jy, jm);
  const offset = jParts(first).wd;
  const days = daysInJMonth(jy, jm);
  const rows = Math.ceil((offset + days) / 7);
  const start = new Date(first.getTime() - offset * 86400000);
  const cells: CalendarCell[] = Array.from({ length: rows * 7 }, (_, i) => {
    const date = new Date(start.getTime() + i * 86400000);
    const p = jParts(date);
    const iso = toISO(date);
    return {
      iso,
      jd: p.jd,
      inMonth: p.jy === jy && p.jm === jm,
      isFriday: p.wd === 6,
      isToday: iso === todayISO,
      wd: p.wd,
    };
  });
  return { jy, jm, days, firstISO: toISO(first), cells };
}

export function shiftMonth(
  { jy, jm }: { jy: number; jm: number },
  delta: number,
) {
  let m = jm + delta;
  let y = jy;
  while (m < 1) {
    m += 12;
    y -= 1;
  }
  while (m > 12) {
    m -= 12;
    y += 1;
  }
  return { jy: y, jm: m };
}

export function isoToJParts(iso: string): JParts {
  const [y, m, d] = iso.split("-").map(Number);
  return jParts(new Date(y, (m ?? 1) - 1, d ?? 1));
}

export function jToISO(jy: number, jm: number, jd: number): string | null {
  const guess = new Date(
    jy - 621,
    jm <= 6 ? 2 : 3,
    (jm - 1) * 31 + jd + (jm > 6 ? -1 : 0),
  );
  for (let i = -3; i <= 3; i++) {
    const date = new Date(guess.getTime() + i * 86400000);
    const p = jParts(date);
    if (p.jy === jy && p.jm === jm && p.jd === jd) return toISO(date);
  }
  return null;
}
