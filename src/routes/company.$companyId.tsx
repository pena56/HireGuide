import { NewEmployeeForm } from "@/components/company/new-employee-form";
import { DashboardLayout } from "@/components/dashboard-layout";
import { SectionCards } from "@/components/section-cards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { checkAuth } from "@/lib/auth-client";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { CircleCheckIcon, ListTodoIcon } from "lucide-react";

export const Route = createFileRoute("/company/$companyId")({
  component: RouteComponent,
  beforeLoad: checkAuth,
});

function RouteComponent() {
  const { companyId } = useParams({ from: "/company/$companyId" });

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col py-5 relative">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2 border-b pb-4">
            <h3 className="text-3xl ">Dashboard</h3>
          </div>

          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} /> */}
          </div>
        </div>

        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button
              className="w-fit fixed right-5 bottom-5 rounded-full text-xs"
              size={"sm"}
              variant={"default"}
            >
              Setup Task (0/3)
            </Button>
          </PopoverTrigger>

          <PopoverContent className="font-poppins space-y-3">
            <div>
              <p className="text-base">0/3 tasks done</p>

              <p className="text-xs">
                Complete your account setup to begin using SHIFTLY
              </p>
            </div>

            <div className="text-xs flex flex-col space-y-2">
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <Button
                      className="justify-start w-full"
                      variant={"ghost"}
                      size={"sm"}
                    >
                      <ListTodoIcon className="w-4 h-4" />

                      <p>Add your first Employee</p>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] font-poppins">
                    <DialogHeader>
                      <DialogTitle>Invite Employee</DialogTitle>
                      <DialogDescription>
                        Send an email invite to invite an employee to this
                        company.
                      </DialogDescription>
                    </DialogHeader>

                    <NewEmployeeForm />
                  </DialogContent>
                </form>
              </Dialog>

              <Button
                className="justify-start"
                disabled
                variant={"ghost"}
                size={"sm"}
              >
                <CircleCheckIcon className="w-4 h-4" />

                <p>Create your first shift</p>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </DashboardLayout>
  );
}
