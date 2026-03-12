export function getCrowdLevel(count) {

  if (count <= 2) {
    return { label: "Low Crowd", color: "green", emoji: "🟢" };
  }

  if (count <= 5) {
    return { label: "Medium Crowd", color: "orange", emoji: "🟡" };
  }

  return { label: "Very Busy", color: "red", emoji: "🔴" };
}