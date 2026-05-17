import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const DashboardPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  const firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
  const lastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);

  return (
    <div>
      <h1>DashboardPage</h1>
      <div>Welcome {`${firstName} ${lastName}`}</div>
    </div>
  );
};

export default DashboardPage;