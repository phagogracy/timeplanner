"use client";

import { useGetApiResponse } from "@/core/api/getApiResponse";
import { useAppDispatch } from "@/core/redux/clientStore";
import AlertDialog from "@/core/ui/components/AlertDialog";
import { Spinner } from "@/core/ui/zenlots/src";
import Button from "@/core/ui/zenlots/src/components/Button";
import PageBar from "@/core/ui/zenlots/src/components/PageBar";
import userApi from "@/modules/users/usersApi";
import { UserResponse } from "@/modules/users/usersType";
import { CloseSquare, Edit2, Trash } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserDetailsTab from "./(components)/UserDetailsTab";

export default function EachDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    if (params.userId) {
      dispatch(userApi.endpoints.getEachUser.initiate(params.userId));
    }
  }, [dispatch, params.userId]);

  const userData = useGetApiResponse<UserResponse>(
    `getEachUser("${params.userId}")`
  );

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={`Users: ${onDelete}`}
        onClickNo={() => {
          setIsOpen(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await dispatch(userApi.endpoints.deleteUser.initiate(onDelete));
            navigator.push("/users/all");
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        <PageBar
          leading={
            <div className="flex flex-col pt-6 pb-4">
              <div className="text-sm font-medium text-primaryGray-500">#</div>
              <div className="text-base font-bold text-dark-500">
                Profile For
              </div>
              <div className="text-sm font-normal text-primaryGray-500">
                {userData?.username || "Loading..."}
              </div>
            </div>
          }
          bottom={
            <div className="flex gap-4 text-base font-normal text-primaryGray-500 pb-2">
              <button
                className={`${
                  tab === 0 ? "font-semibold" : "font-normal"
                } text-dark-500 relative text-sm`}
                onClick={() => setTab(0)}
              >
                USER DETAILS
                {tab === 0 && (
                  <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                )}
              </button>
            </div>
          }
        >
          <div className="flex gap-2">
            <Button
              className="w-9 h-9"
              buttonType="bordered"
              prefix={<Trash size={20} variant="Bold" />}
              onClick={() => {
                if (params.userId) {
                  setOnDelete(params.userId);
                  setIsOpen(true);
                }
              }}
            />
            <Button
              className="w-9 h-9"
              buttonType="bordered"
              prefix={<Edit2 size={20} variant="Bold" />}
              type="link"
              href={`/users/mutate/${params.userId}`}
            />
            <Button
              className="w-9 h-9"
              buttonType="bordered"
              type="button"
              onClick={() => {
                navigator.push("/users/all");
              }}
              suffix={<CloseSquare size={20} variant="Bold" />}
            />
          </div>
        </PageBar>
        {tab === 0 ? <UserDetailsTab user={userData} /> : null}
        {!userData && (
          <div className="flex justify-center items-center min-h-[calc(100vh-3.25rem)]">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
}
