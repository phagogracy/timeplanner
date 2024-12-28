"use client";

import { useAppDispatch, useAppSelector } from "@/core/redux/clientStore";
import { RootState } from "@/core/redux/store";
import { PaginatedResponseType } from "@/core/types/responseTypes";
import AlertDialog from "@/core/ui/components/AlertDialog";
import PaginationNav from "@/core/ui/components/Pagination";
import { Button, TableCard, tableStyles } from "@/core/ui/zenlots/src";
import userApi from "@/modules/users/usersApi";
import { UserResponse } from "@/modules/users/usersType";
import { Edit2, Eye, Trash } from "iconsax-react";
import { useEffect, useState } from "react";

const UserTableListing = () => {
  const dispatch = useAppDispatch();
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);

  const [onDelete, setOnDelete] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch(userApi.endpoints.getUser.initiate(pageIndex));
  }, [dispatch, pageIndex]);

  const userData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getUser`]
        ?.data as PaginatedResponseType<UserResponse>
  );

  return (
    <>
      <AlertDialog
        isOpen={deleteModelOpen}
        deleteContent={onDelete}
        onClickNo={() => {
          toggleDeleteModel(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                userApi.endpoints.deleteUser.initiate(onDelete as string)
              )
            );
          }
          toggleDeleteModel(false);
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          userData && userData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={pageIndex < userData.pagination.total_page - 1}
              pageCount={userData.pagination.total_page}
              pageIndex={userData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead>
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>S.N.</th>
            <th className={tableStyles.table_th}>Username</th>
            <th className={tableStyles.table_th}>Email</th>
            <th className={tableStyles.table_th}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {userData?.results.map((users, index) => {
            return (
              <tr key={index} className={tableStyles.table_tbody_tr}>
                <td className={tableStyles.table_td}>{index + 1}</td>
                <td className={tableStyles.table_td}>{users.username}</td>
                <td className={tableStyles.table_td}>{users.email}</td>
                <td className={tableStyles.table_td + ` flex gap-2 max-w-xs`}>
                  <Button
                    className="h-8 w-8"
                    type="link"
                    href={`/users/${users.username}`}
                    buttonType="bordered"
                    prefix={<Eye size={18} variant="Bold" />}
                  />
                  <Button
                    className="h-8 w-8"
                    type="link"
                    href={`/users/mutate/${users.username}/`}
                    prefix={<Edit2 size={18} variant="Bold" />}
                  />
                  <Button
                    className="h-8 w-8"
                    kind="danger"
                    type="button"
                    href=""
                    prefix={<Trash size={18} variant="Bold" />}
                    onClick={() => {
                      setOnDelete(users.username);
                      toggleDeleteModel(true);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableCard>
    </>
  );
};

export default UserTableListing;
