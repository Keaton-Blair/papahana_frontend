import React, { useEffect }  from "react";
import { OBComponent, ObservationBlock, Instrument, InstrumentPackage, Science, Acquisition } from "../../typings/papahana";
import { Box, makeStyles, Theme } from "@material-ui/core";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { AppBar } from '@material-ui/core';
import * as obt from '../../typings/ob_json_form';
import { UiSchema  } from "@rjsf/core";

import TargetForm from "./target_form";
import AcquisitionForm from "./acquisition_form";
import ScienceForm from "./science_form";
import OverviewForm from "./overview_form";

import { get_instrument_package } from './../../api/utils';
import TemplateForm from './template_form';

export const useStyles = makeStyles( (theme: Theme) => ({
    root: {
        textAlign: 'left',
        margin: theme.spacing(0),
        display: 'flex',
        flexWrap: 'wrap',
    },
    form: {
        margin: theme.spacing(0),
        padding: theme.spacing(0)
    },
    tab: {
      minWidth: theme.spacing(15),
      width: 'flex' 
    }
}))


export const createUISchema = (formData: OBComponent, schema: obt.JsonSchema, title: string): UiSchema => {
  // Generate a UI schema based on complete form schema of a complete OB component
  let uiSchema = {} as UiSchema
  // first define readonly values
  for (const [key, property] of Object.entries(schema.properties as object)) {
    uiSchema[key] = {}  
    if (property.readonly) {
      uiSchema[key]["ui:readonly"] = true
    }
  }
  // Hide form widgets that are not included in OB
  for (const key in Object.keys(formData)) {
    if (!Object.keys(uiSchema).includes(key)) {
        uiSchema[key]['ui:widget'] = 'hidden'
    }
  }
  return uiSchema
}


export interface FormProps extends Props {
    schema: object,
    uiSchema: object,
}

interface Props {
    ob: ObservationBlock,
    setOB: Function
}

type FormData = Science[] | Acquisition | undefined

export const log = (type: any) => console.log.bind(console, type);

export function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
}

export default function OBForm(props: Props) {
  const classes = useStyles()
  let instrument: Instrument = props.ob.signature?.instrument
  const [ value, setValue ] = React.useState(0);
  const [ instrumentPackage, setInstrumentPackage ] = React.useState<InstrumentPackage | undefined>(undefined)

  useEffect(() => {
    instrument = props.ob.signature?.instrument
    if (instrument) {
      get_instrument_package(instrument).then( (instPak: InstrumentPackage) => {
        setInstrumentPackage(instPak)
      },
      (error: any) => {
        console.error(error)
      }
      )
    }
  }, [props.ob])
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const setOBPortions = ( dataForm: FormData, type: keyof ObservationBlock) => {
    let newOB = {...props.ob}
    newOB[type] = dataForm
    props.setOB(newOB)
  }

  const setAcquisition = ( acq: Acquisition ) => {
    setOBPortions(acq, 'acquisition')
  }

  const setScience = (sci: Science[]) => {
    setOBPortions(sci, 'science')
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} 
              onChange={handleChange} 
              aria-label="simple tabs example"
              centered={true}
        >
          <Tab className={classes.tab} label="Overview" {...a11yProps(0)} />
          <Tab className={classes.tab} label="Target" {...a11yProps(1)} />
          <Tab className={classes.tab} label="Acquistion" {...a11yProps(2)} />
          <Tab className={classes.tab} label="Science" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <OverviewForm ob={props.ob} setOB={props.setOB} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TargetForm ob={props.ob} setOB={props.setOB} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* <AcquisitionForm ob={props.ob} setOB={props.setOB} /> */}
        { instrumentPackage? 
          <TemplateForm 
          dataForm={props.ob.acquisition} 
          sendToOB={setAcquisition} 
          templates={instrumentPackage.templates.acquisition}
          type={'acqisition' as keyof ObservationBlock}
          /> : <h1> Loading </h1>
        }
      </TabPanel>
      <TabPanel value={value} index={3}>
        {/* <ScienceForm ob={props.ob} setOB={props.setOB} /> */}
        { instrumentPackage? 
        <TemplateForm 
        dataForm={props.ob.science} 
        sendToOB={setAcquisition} 
        templates={instrumentPackage.templates.science}
        type={'science'}
        /> : <h1> Loading </h1>
        }
      </TabPanel>
    </div>
  )
}