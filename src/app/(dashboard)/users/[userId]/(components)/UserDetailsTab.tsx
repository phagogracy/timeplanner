import { UserResponse } from '@/modules/users/usersType';

interface UserDetailsTabProps {
  user: UserResponse | undefined;
}
const UserDetailsTab: React.FC<UserDetailsTabProps> = ({ user }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-4 `}
      >
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-primaryGray-500">Username</div>
          <div className="text-base capitalize">{user?.username}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-primaryGray-500">Email</div>
          <div className="text-base capitalize">{user?.email}</div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsTab;
