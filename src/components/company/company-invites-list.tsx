import { useMutation, useQuery } from "convex/react";
import type { Id } from "convex/_generated/dataModel";

import { api } from "@/lib/convex";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar, Check, User, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { formatDate, showErrorMessage } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function CompanyInvitesList() {
  const data = useQuery(api.memberships.getMembershipInvites);
  const acceptInvite = useMutation(api.memberships.acceptInvite);
  const declineInvite = useMutation(api.memberships.declineInvite);

  const navigate = useNavigate();

  const [openAcceptModal, setOpenAcceptModal] = useState(false);
  const [openDeclineModal, setOpenDeclineModal] = useState(false);

  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const [decliningInvite, setDecliningInvite] = useState(false);

  const handleAcceptInvite = async (membershipId: string) => {
    setAcceptingInvite(true);

    try {
      const company = await acceptInvite({
        membershipId: membershipId as Id<"memberships">,
      });

      setOpenAcceptModal(false);

      toast.success("Invite successfully accepted");

      navigate({
        to: "/company/$companyId",
        params: {
          companyId: company?.companyId,
        },
      });
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setAcceptingInvite(false);
    }
  };

  const handleDeclineInvite = async (membershipId: string) => {
    setDecliningInvite(true);

    try {
      await declineInvite({
        membershipId: membershipId as Id<"memberships">,
      });

      toast.success("Invite successfully declined");

      setOpenDeclineModal(false);
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setDecliningInvite(false);
    }
  };

  if (!data)
    return (
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {new Array(3).fill(0).map((_, index) => (
            <Skeleton
              className="flex flex-col items-center justify-center p-6 rounded-xl shadow-lg h-[252px]"
              key={index}
            ></Skeleton>
          ))}
        </div>
      </div>
    );

  if (data?.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 border-b pb-4">
        <h3 className="text-3xl ">Invites</h3>

        <Badge variant="secondary" className="text-sm">
          {data?.length} pending
        </Badge>
      </div>

      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-4">
          {data?.map((company) => (
            <Card
              key={company?._id}
              className="transition-colors hover:bg-muted/50"
            >
              <CardHeader className="">
                <div className="flex flex-col md:flex-row items-start justify-between relative">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={company?.companyLogo || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {company?.companyName?.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {company?.companyName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        Invited by {company?.invitedBy}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs capitalize absolute md:relative -top-4 md:top-0 -right-2 md:right-0"
                  >
                    {company?.role}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                  <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Invited {formatDate(company?._creationTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      {company?.invitedByEmail}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog
                      open={openDeclineModal}
                      onOpenChange={setOpenDeclineModal}
                    >
                      <DialogTrigger asChild>
                        <Button
                          isLoading={decliningInvite}
                          variant="outline"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="font-poppins">
                        <DialogHeader>
                          <DialogTitle>Decline Invitation?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to decline the invitation to
                            join{" "}
                            <span className="font-semibold">
                              {company?.companyName}
                            </span>
                            ? You will have to request for another invitation
                            from your manager if you change your mind.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            isLoading={decliningInvite}
                            onClick={() => handleDeclineInvite(company?._id)}
                            type="submit"
                            variant={"destructive"}
                          >
                            Decline invitation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={openAcceptModal}
                      onOpenChange={setOpenAcceptModal}
                    >
                      <DialogTrigger asChild>
                        <Button isLoading={acceptingInvite} size="sm">
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="font-poppins">
                        <DialogHeader>
                          <DialogTitle>Accept Invitation?</DialogTitle>
                          <DialogDescription>
                            You're about to join{" "}
                            <span className="font-semibold">
                              {company?.companyName}
                            </span>{" "}
                            as a{" "}
                            <span className="font-semibold capitalize">
                              {company?.role}
                            </span>
                            . You'll have access to the company and its
                            resources immediately.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            type="submit"
                            onClick={() => handleAcceptInvite(company?._id)}
                            isLoading={acceptingInvite}
                          >
                            Join workspace
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
