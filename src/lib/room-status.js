const DAY_IN_MS = 24 * 60 * 60 * 1000;

const FREQUENCY_MS = {
  daily: 1 * DAY_IN_MS,
  weekly: 7 * DAY_IN_MS,
  monthly: 30 * DAY_IN_MS,
};

export const ROOM_STATUS_ORDER = {
  overdue: 0,
  due: 1,
  clean: 2,
};

export const ROOM_STATUS_META = {
  clean: {
    key: "clean",
    label: "Nyligen städat",
    emoji: "🟢",
  },
  due: {
    key: "due",
    label: "Snart dags",
    emoji: "🟡",
  },
  overdue: {
    key: "overdue",
    label: "Behöver städas",
    emoji: "🔴",
  },
};

function toTimestamp(value) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function getRoomStatus(room, now = new Date()) {
  const frequency = room?.cleaning_frequency;

  if (frequency === "on_demand") {
    return "clean";
  }

  const frequencyMs = FREQUENCY_MS[frequency];
  if (!frequencyMs) {
    return "clean";
  }

  const lastCleanedTs = toTimestamp(room?.last_cleaned);
  if (!lastCleanedTs) {
    return "overdue";
  }

  const nowTs = now.getTime();
  const nextCleaningTs = lastCleanedTs + frequencyMs;
  const bufferMs = frequencyMs * 0.2;

  if (nowTs > nextCleaningTs) {
    return "overdue";
  }

  if (nowTs > nextCleaningTs - bufferMs) {
    return "due";
  }

  return "clean";
}

export function buildLastCleanedMap(cleaningLogs = []) {
  const lastCleanedByRoom = new Map();

  for (const log of cleaningLogs) {
    if (!log?.room_id || !log.cleaned_at) continue;

    const currentTs = toTimestamp(lastCleanedByRoom.get(log.room_id));
    const candidateTs = toTimestamp(log.cleaned_at);

    if (!candidateTs) continue;
    if (!currentTs || candidateTs > currentTs) {
      lastCleanedByRoom.set(log.room_id, log.cleaned_at);
    }
  }

  return lastCleanedByRoom;
}

export function annotateRoomsWithStatus(rooms = [], lastCleanedByRoom = new Map(), now = new Date()) {
  return rooms.map((room) => {
    const last_cleaned = lastCleanedByRoom.get(room.id) ?? null;
    const status = getRoomStatus({ ...room, last_cleaned }, now);
    return {
      ...room,
      last_cleaned,
      status,
    };
  });
}

export function getRoomStatusCounts(rooms = []) {
  return rooms.reduce(
    (acc, room) => {
      const status = room.status ?? getRoomStatus(room);
      acc.total += 1;
      acc[status] += 1;
      return acc;
    },
    { clean: 0, due: 0, overdue: 0, total: 0 },
  );
}

export function sortRoomsByStatus(rooms = []) {
  return [...rooms].sort((a, b) => {
    const aOrder = ROOM_STATUS_ORDER[a.status] ?? ROOM_STATUS_ORDER.clean;
    const bOrder = ROOM_STATUS_ORDER[b.status] ?? ROOM_STATUS_ORDER.clean;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return a.name.localeCompare(b.name, "sv");
  });
}

export function formatRelativeTime(value, now = new Date(), locale = "sv-SE") {
  const ts = toTimestamp(value);
  if (!ts) return "Aldrig";

  const diffMs = ts - now.getTime();
  const absDiffMs = Math.abs(diffMs);

  const units = [
    { unit: "year", ms: 365 * DAY_IN_MS },
    { unit: "month", ms: 30 * DAY_IN_MS },
    { unit: "week", ms: 7 * DAY_IN_MS },
    { unit: "day", ms: DAY_IN_MS },
    { unit: "hour", ms: 60 * 60 * 1000 },
    { unit: "minute", ms: 60 * 1000 },
  ];

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const { unit, ms } of units) {
    if (absDiffMs >= ms) {
      const valueForUnit = Math.round(diffMs / ms);
      return formatter.format(valueForUnit, unit);
    }
  }

  return formatter.format(Math.round(diffMs / 1000), "second");
}
