import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse topic hubs returned from published lesson data.",
};

export default function RoadmapPage() {
  redirect("/topics");
}
