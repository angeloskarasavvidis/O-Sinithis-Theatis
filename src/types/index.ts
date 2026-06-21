export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readingTime: number;
  genre: string[];
  director: string;
  year: number;
  postType: "Κριτική" | "Αφιέρωμα" | "Νέα" | "Συνέντευξη";
  rating?: number;
  image: string;
  featured: boolean;
  tags: string[];
  badge?: "NEW REVIEW" | "TRENDING" | "EDITORIAL" | "EXCLUSIVE";
}
