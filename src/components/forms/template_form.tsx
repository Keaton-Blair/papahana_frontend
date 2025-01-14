import React, { } from "react"
import { Template, OBComponent, OBSeqNames, TemplateParameter, OBSequence } from "../../typings/papahana"
import { ISubmitEvent } from "@rjsf/core";
import Form from '@rjsf/material-ui'
import { JSONSchema7 } from 'json-schema'
import { Items, JsonSchema, JSProperty, OBJsonSchemaProperties } from "../../typings/ob_json_form";
import { makeStyles, Theme } from "@material-ui/core";
import * as schemas from './schemas'
import { get_template } from "../../api/utils";
import { UiSchema } from "react-jsonschema-form";


export const useStyles = makeStyles((theme: Theme) => ({
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

interface Props {
  obComponent: OBComponent
  updateOB: Function
  id: string
}
export const log = (type: any) => console.log.bind(console, type);

const getUiSchema = (id: string): UiSchema => {
  let uiSchema: UiSchema
  if (id === 'target') {
    uiSchema = schemas.uiTargetSchema
  }
  else if (id === 'acquisition') {
    uiSchema = schemas.uiAcquisitionSchema
  }
  else if (id.includes('science')) {
    uiSchema = schemas.uiScienceSchema
  }
  else {
    console.log(`component ${id} has undefined schema`)
    uiSchema = {}
  }
  return uiSchema
}

const to_schema_type = (tpl_param: string): string => {
  let type: string
  switch (tpl_param) {
    case 'float': {
      type = 'number'
      break;
    }
    case 'string': {
      type = 'string'
      break;
    }
    case 'integer': {
      type = 'number'
      break;
    }
    case 'array': {
      type = 'array'
      break;
    }
    case 'boolean': {
      type = 'boolean'
      break;
    }
    default: {
      type = 'string'
      break;
    }
  }
  return type
}

const template_parameter_to_schema_properties = (param: TemplateParameter): OBJsonSchemaProperties => {
  let property: Partial<JSProperty> = {}
  property.title = param.ui_name
  property.type = to_schema_type(param.type)
  if (param.default) {
    property.default = param.default
  }
  property.readonly = false // todo: need to verify if this will allways be the case
  if (param.option === "range") {
    property.minimum = param.allowed[0] as any
    property.maximum = param.allowed[1] as any
  }
  if (param.option === "list") {
    property.enum = param.allowed
  }
  if (property.type === 'array') {
    let schema = {} as any //todo make this a function
    schema.title = 'dither item'
    schema.type = 'object'
    schema.properties = {}
    param.allowed.forEach((param: any) => {
      const dkey = Object.keys(param)[0]
      const dvalue = param[dkey]
      schema.properties[dkey] = template_parameter_to_schema_properties(dvalue as TemplateParameter)
    })
    schema.required = Object.keys(schema.properties)
    property.items = schema
  }
  return property
}

const template_to_schema = (template: Template): JSONSchema7 => {
  let schema: Partial<JsonSchema> = {}
  schema.title = template.metadata.ui_name
  schema.type = 'object'
  let required: string[] = []
  let properties = {} as Partial<OBJsonSchemaProperties>
  Object.entries(template.parameters).forEach(([key, param]) => {
    const prop = template_parameter_to_schema_properties(param)
    if (param.optionality === 'required') required.push(key)
    properties[key] = prop
  })
  schema.properties = properties
  schema.required = required
  return schema as JSONSchema7
}

export default function TemplateForm(props: Props): JSX.Element {
  const classes = useStyles()
  const [schema, setSchema] = React.useState({} as JSONSchema7)
  const uiSchema = getUiSchema(props.id)
  let formData: { [key: string]: any } = {}
  const ref = React.useRef(null)

  if (props.id === 'target') {
    formData = props.obComponent
  }
  else {
    const seq = props.obComponent as OBSequence
    formData = seq.parameters
  }

  let height = 0 //monitor the height of the form

  React.useEffect(() => {
    const curr = ref.current as any;
    height = curr.clientHeight;

    if (props.id === 'target') {
      setSchema(schemas.targetSchema as JSONSchema7)
    }
    else {
      const seq = props.obComponent as OBSequence
      var md = seq.metadata
      if (md) {
        get_template(md.name).then((templates: Template) => {
          const sch = template_to_schema(templates)
          setSchema(sch as JSONSchema7)
        }).catch(err => {
          console.log(`TemplateForm err: ${err}`)
        })
      }
    }
  }, [])

  const handleChange = (evt: ISubmitEvent<OBComponent>): void => {
    const curr = ref.current as any
    //todo how to tell if change is from array size changing
    // console.log('form changed')
    // console.log(evt)
    // console.log(`height ${height} vs current height of ${curr.clientHeight}`)
    // console.log('updating form')
    let newFormData = { ...evt.formData }
    // check if form changed heights
    let newHeight: number = height!==curr.clientHeight? curr.clientHeight : undefined
    props.updateOB(props.id, newFormData, newHeight)
    height = curr.clientHeight
  }


  return (
    <div ref={ref} className={classes.root}>
      <Form className={classes.form}
        schema={schema}
        uiSchema={uiSchema as any}
        formData={formData}
        onChange={handleChange}
        onError={log("errors")} ><div></div></Form>
    </div>
  )
}