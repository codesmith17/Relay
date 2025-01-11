import { Box } from "@mui/material";
interface TabPanelProps {
  value: string,
  index: string,
  children?: React.ReactNode
}
const TabPanel = (props: TabPanelProps) => {
  const { value, index, children } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};
export default TabPanel;