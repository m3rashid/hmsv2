import { Select } from "antd";
import Input from "rc-input";
import React from "react";
import { Form } from "react-router-dom";
import PropTypes from "prop-types"

const RenderFormFields = ({ formFields, isEdit, required, data, form }) => {
  return (
    <React.Fragment>
      {formFields.map((f) => (
        <Form.Item
          key={f.key}
          name={f.key}
          label={f.label}
          {...(required && {
            rules: [
              {
                required: true,
                message: `Please ${
                  f.inputType === "select" ? "Select" : "Enter"
                } a ${f.label}`,
              },
              ...f.otherRules,
            ],
          })}
        >
          {f.inputType === "select" ? (
            <Select
              {...(isEdit && { defaultValue: data[f.key] })}
              {...(f.multiple && { mode: "multiple" })}
              placeholder={`Select ${f.label}`}
            >
              {f.options.map((o) => (
                <Select.Option key={o.key} value={o.key}>
                  {o.label}
                </Select.Option>
              ))}
            </Select>
          ) : f.inputType === "textarea" ? (
            <Input.TextArea
              {...(isEdit && { defaultValue: data[f.key] })}
              placeholder={f.label}
              rows={3}
            />
          ) : f.inputType === "custom" ? (
            <React.Fragment>
              <f.component
                {...(isEdit && { defaultValue: data[f.key] })}
                form={form}
              />
            </React.Fragment>
          ) : (
            <Input
              {...(isEdit && { defaultValue: data[f.key] })}
              placeholder={f.label}
              type={f.inputType ?? "text"}
            />
          )}
        </Form.Item>
      ))}
    </React.Fragment>
  );
};

RenderFormFields.propTypes = {
    formFields: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        inputType: PropTypes.string,
        otherRules: PropTypes.array,
        options: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }))
    })).isRequired,
    isEdit: PropTypes.bool,
    required: PropTypes.bool,
    data: PropTypes.object,
    form: PropTypes.object.isRequired,
}

export default RenderFormFields;