import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";

import { api } from "@/lib/convex";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

const statusColors = {
  active: "text-green-500",
  invited: "text-blue-500",
  inactive: "text-yellow-500",
  terminated: "text-red-500",
};

export function CompaniesList() {
  const data = useQuery(api.memberships.getUserMemberships);

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

  if (data?.length === 0)
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center gap-3">
        <img
          src="/empty.svg"
          alt="empty"
          className="w-1/2 aspect-square object-contain"
        />

        <p className="text-center text-2xl">
          You don't belong to any company at the moment
        </p>
        <Link to="/company/new">
          <Button variant={"link"}>Create a new company</Button>
        </Link>

        <Link to="/">
          <Button variant={"link"}>Join an existing company</Button>
        </Link>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {data?.map((company) => (
          <Link to="/company/new" key={company._id}>
            <div className="flex flex-col items-center justify-center p-6 bg-accent rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer">
              <Avatar className="w-24 h-24 rounded-full aspect-square ring-4 ring-white dark:ring-gray-700">
                <AvatarImage
                  src={company?.companyLogo ?? ""}
                  className="object-cover"
                />
                <AvatarFallback className="uppercase bg-amber-400 text-black font-bold text-2xl">
                  {company?.companyName?.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 text-center">
                <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {company?.companyName}
                </p>
                <p className="text-sm capitalize text-gray-600 dark:text-gray-400">
                  Role: {company?.role}
                </p>
                <p
                  className={`text-sm capitalize font-semibold ${
                    statusColors[company?.status] || "text-gray-500"
                  }`}
                >
                  Status: {company?.status}
                </p>
                <p className="text-sm capitalize text-gray-500 dark:text-gray-500">
                  Joined:{" "}
                  {new Date(company?._creationTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
