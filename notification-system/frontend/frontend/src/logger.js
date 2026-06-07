export function Log(stack, level, packageName, message) {
  console.log(
    "[notification_app_fe]",
    String(stack || "").toLowerCase(),
    String(level || "").toLowerCase(),
    String(packageName || "").toLowerCase(),
    message
  );
}