export default defineEventHandler((event) => {
  const data = getQuery(event);

  console.log(data);

  return `Pong! ${data["pong"] ?? ""}`;
});
