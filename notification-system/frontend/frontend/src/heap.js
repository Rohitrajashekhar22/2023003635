const weight = {
  Placement: 3,
  Result: 2,
  Event: 1
};

export function normalizeNotification(item) {
  return {
    id: item.ID ?? item.id ?? "",
    type: item.Type ?? item.notification_type ?? "",
    message: item.Message ?? item.message ?? "",
    timestamp: item.Timestamp ?? item.created_at ?? ""
  };
}

export function getTop10(items) {
  return [...items]
    .sort((a, b) => {
      const weightDiff = (weight[b.type] || 0) - (weight[a.type] || 0);
      if (weightDiff !== 0) {
        return weightDiff;
      }

      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    })
    .slice(0, 10);
}