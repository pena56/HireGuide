import { createFileRoute } from "@tanstack/react-router";

import { checkAuth } from "@/lib/auth-client";
import { Navbar } from "@/components/auth/navbar";
import { EditProfileForm } from "@/components/profile/edit-profile-form";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
  beforeLoad: checkAuth,
});

function RouteComponent() {
  return (
    <main className="font-poppins">
      <Navbar />

      <div className="px-4 md:px-10 py-6 mx-auto space-y-10">
        <div className="flex items-center gap-2 border-b pb-4">
          <h3 className="text-3xl ">Profile</h3>
        </div>

        <EditProfileForm />
      </div>
    </main>
  );
}
