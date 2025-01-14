import React from 'react';
import { makeStyles } from "@material-ui/core"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import SkyView from './PlanningTool/sky_view';
import OBTView from './OBT/observation_data_tool_view';
import { ThemeKeys } from 'react-json-view';
import { PlanningToolView } from './PlanningTool/planning_tool_view';

const useStyles = makeStyles(theme => ({
    moduleMain: {
        width: '100%'
    },
    tabs: {
        marginTop: theme.spacing(9),
        // height: theme.spacing(10),
        position: "absolute",
        display: "flex",
        width: '100%',
        // padding: theme.spacing(2),
    },
    items: {
        marginTop: theme.spacing(12),
        position: "relative",
        // height: '100%',
        display: "flex"
    }
}))

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const classes = useStyles();
    const { children, value, index, ...other } = props;
    return (
        <div className={classes.items}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
        {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
        </div>
    );
}

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface ModuleMenuProps {
    observer_id: string;
    jsonTheme: ThemeKeys | undefined;
}

export const ModuleMenu = (props: ModuleMenuProps) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className={classes.moduleMain}>
            <AppBar position="static" className={classes.tabs}>
                <Tabs
                    value={value}
                    onChange={handleChange as any}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="OBT" {...a11yProps(0)} />
                    <Tab label="Planning Tool" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <OBTView observer_id={props.observer_id} theme={props.jsonTheme} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <PlanningToolView/>
            </TabPanel>
        </ div >
    )
}