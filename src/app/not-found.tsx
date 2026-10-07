import type { Metadata } from "next";
import NotFoundPanel from "@/components/NotFoundPanel";

export const metadata: Metadata = {
  title: "Η σελίδα δεν βρέθηκε · Ο Συνήθης Θεατής",
};

export default function NotFound() {
  return <NotFoundPanel />;
}
