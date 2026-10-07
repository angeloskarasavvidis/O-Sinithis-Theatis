"use client";

import AdminGate from "@/components/admin/AdminGate";
import PostEditor from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <AdminGate>
      <PostEditor />
    </AdminGate>
  );
}
