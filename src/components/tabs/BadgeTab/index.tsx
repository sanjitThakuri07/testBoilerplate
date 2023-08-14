import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import badgeTabTheme from './badgeTabTheme';
interface BadgeTabProps {
  labels: { label: string; count: number }[];
  activeTab: number;
  onTabChange: (v: any) => void;
}

const BadgeTab: React.FC<BadgeTabProps> = ({
  labels,
  onTabChange,
  activeTab
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <ThemeProvider theme={badgeTabTheme}>
          <Tabs
            value={activeTab}
            onChange={handleChange}
            TabIndicatorProps={{ className: 'badge-tab-indicator' }}>
            {labels.map((item, i) => (
              <Tab
                label={
                  <div className="chip-tab-labels">
                    <div>{item.label}</div>
                    <Chip label={item.count || 0} />
                  </div>
                }
                key={i}
              />
            ))}
          </Tabs>
        </ThemeProvider>
      </Box>
    </Box>
  );
};
export default BadgeTab;
