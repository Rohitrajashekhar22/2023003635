export function Log(stack, level, packageName, message) {
  console.log(
    "[frontend]",
    String(stack || "").toLowerCase(),
    String(level || "").toLowerCase(),
    String(packageName || "").toLowerCase(),
    message
  );
}