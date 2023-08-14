import { Button, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { allRoutes } from 'routers/routingsUrl';
import { usePathUrlSettor } from 'globalStates/config';

export default function FinanceConfig() {
  const navigate = useNavigate();
  const location = useLocation();

  const { routes, setCustomRoutes } = usePathUrlSettor();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };
  return (
    <Stack direction="row" alignItems="center" className="config-filter-buttons">
      {/* <Button
        className={isActive(`${`/config/${allRoutes?.activityType?.url}`}`)}
        onClick={() => {
          setCustomRoutes({
            backendUrl: allRoutes?.activityType?.backendUrl,
          });
          navigate(`${`/config/${allRoutes?.activityType?.url}`}`);
        }}>
        Activity Types
      </Button> */}

      <Button
        className={isActive(`${`/config/${allRoutes?.activityStatus?.url}`}`)}
        onClick={() => {
          setCustomRoutes({
            backendUrl: allRoutes?.activityStatus?.backendUrl,
          });
          navigate(`${`/config/${allRoutes?.activityStatus?.url}`}`);
        }}>
        Activity Status
      </Button>
    </Stack>
  );
}
