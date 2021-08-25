import React, { useState, useRef } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton } from '@material-ui/core';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { ObservationBlock } from "../../typings/papahana"

export type FormNames = keyof ObservationBlock 

interface Size {
    width: number,
    height: number
}

interface withHeightWidthProps {
    size?: Size
}
interface AccordianProps extends withHeightWidthProps {
    id: string
    handleResize: Function
    name: string
    children?: React.ReactNode
    expanded?: boolean
}


const rowHeight: number = 45 

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'relative',
            justifyContent: 'center',
        },
        heading: {
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: '1.25rem',
            marginTop: theme.spacing(1)
        },
        cell: {
            margin: theme.spacing(0),
            padding: theme.spacing(0),
            minHeight: rowHeight
        },
        templateAccordian: {
            padding: theme.spacing(0),
            margin: theme.spacing(0),
            alignItems: 'center',
            backgroundColor: theme.palette.divider,
        },
        accordianSummary: {
            height: theme.spacing(3),
            padding: theme.spacing(0),
        },
    }),
);

export const AccordionForm = (props: AccordianProps) => {
    const transitionTime: number = 0 //ms
    const defaultExpanded: boolean = true 
    const classes = useStyles()
    const ref = useRef(null)
    const [height, setHeight] = useState(0)

    React.useEffect( () => {
        if (ref) {
            setTimeout( () => {
                const curr = ref.current as any
                const init = true
                // console.log(`${props.id} initHeight: ${curr.clientHeight}`)
                props.handleResize(props.id, curr.clientHeight, defaultExpanded, init)
            }, 30 + transitionTime)
        }
    }, [props, defaultExpanded])

    const handleOpenClose = (e: any, expanded: boolean) => {
        setTimeout(() => { // wait for animation
            const curr = ref.current as any
            setHeight(curr.clientHeight) // carefull, height takes time to set
            // console.log(`component ${props.name} ${props.id} expanded: ${expanded} height of ${props.id}: ${height}`)
            props.handleResize(props.id, curr.clientHeight, expanded, false)
        }, 30+transitionTime)
    }

    return (
        <Accordion className={classes.cell} ref={ref}
            defaultExpanded={defaultExpanded}
            onChange={handleOpenClose}
            TransitionProps={{timeout: transitionTime}}
        >
            <AccordionSummary
                className={classes.accordianSummary}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                aria-label="Expand"
            >
                <IconButton 
                  className="dragme"
                  aria-label='open'
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                >
                    <OpenWithIcon />
                </IconButton>
                <Typography variant={"h6"} className={classes.heading}>{props.name}</Typography>
            </AccordionSummary>
            <AccordionDetails >
                {props.children}
            </AccordionDetails>
        </Accordion>)
}