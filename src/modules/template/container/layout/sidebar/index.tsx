import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Grid from '@mui/material/Grid';
import { v4 as uuidv4 } from 'uuid';
import Responses from 'assets/template/icons/sidebar/Responses';
import Internal from 'assets/template/icons/sidebar/Internal';
import External from 'assets/template/icons/sidebar/External';
import Custom from 'assets/template/icons/sidebar/Custom';
import Status from 'assets/template/icons/sidebar/Status';
import ResponseTab from 'containers/template/components/ResponseTab/ResponseTab';

const sidebarTabData = [
  {
    id: uuidv4(),
    title: 'Responses',
    icon: <Responses />,
    value: 'default',
  },
  {
    id: uuidv4(),
    title: 'Status Attributes',
    icon: <Status />,
    value: 'multiple',
  },
  {
    id: uuidv4(),
    title: 'Custom Attributes',
    icon: <Custom />,
    value: 'global',
  },
  {
    id: uuidv4(),
    title: 'Internal Attributes',
    icon: <Internal />,
    value: 'internal',
  },
  {
    id: uuidv4(),
    title: 'External Attributes',
    icon: <External />,
    value: 'external',
  },
];

export default function TemporaryDrawer({ setCollapseSidebar }: any) {
  const [sidebarActive, setSidebarActive] = React.useState('default');

  const componentList: any = {
    multiple: <ResponseTab activeTab="multiple" />,
    global: <ResponseTab activeTab="global" />,
    internal: <ResponseTab activeTab="internal" />,
    external: <ResponseTab activeTab="external" />,
    default: <ResponseTab activeTab="default" />,
  };

  return (
    <Box className="sidebar__container sidebar__container-grid" sx={{ flexGrow: '1' }}>
      <Grid container spacing={2} style={{ marginTop: '0' }}>
        <div className="block__container">
          <div className="sidebar__tab-item custom-template-sidebar-padding-tb">
            {sidebarTabData?.map((data: any, index: number) => {
              return (
                <button
                  className={`sidebar__tab-button ${sidebarActive === data?.value ? 'active' : ''}`}
                  id="defaultOpen"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSidebarActive(data?.value);
                    setCollapseSidebar?.(false);
                  }}>
                  <div className="icon">{data?.icon}</div>
                  <p>{data?.title}</p>
                </button>
              );
            })}
          </div>
        </div>
        <div className="sidebar__body-container">
          <div className="sidebar__body tabcontent">
            {componentList?.[sidebarActive || 'default']}
          </div>
        </div>
      </Grid>
    </Box>
  );
}
