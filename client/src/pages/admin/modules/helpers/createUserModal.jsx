import {
  Modal,
  Button,
  Input,
  Form,
  message,
  Select,
  Collapse,
  Space,
} from "antd";
import React from "react";

import {
  showGender,
  toSentenceCase,
} from "../../../../components/utils/strings";
import { instance } from "../../../../api/instance";
import { supportedUserRoles } from "../../../../components/utils/constants";

const requiredFormFields = [
  { key: "name", label: "Name", inputType: "text", otherRules: [{}] },
  { key: "email", label: "Email", inputType: "email", otherRules: [{}] },
  {
    key: "password",
    label: "Password",
    inputType: "password",
    otherRules: [{}],
  },
  {
    key: "role",
    label: "Role",
    inputType: "select",
    otherRules: [
      {
        validator: (_, value) => {
          if (!supportedUserRoles.includes(value)) {
            return Promise.reject(new Error("Role not supported!"));
          }
          return Promise.resolve();
        },
      },
    ],
    options: supportedUserRoles.map((role) => ({
      key: role,
      label: role
        .split("_")
        .map((r) => toSentenceCase(r))
        .join(" "),
    })),
  },
  {
    key: "sex",
    label: "Gender",
    inputType: "select",
    otherRules: [{}],
    options: ["m", "f", "o"].map((gender) => ({
      key: gender,
      label: showGender(gender),
    })),
  },
];

const otherFormFields = [
  { key: "bio", label: "Introduction", inputType: "textarea" },
  {
    key: "availableDays",
    label: "Available Days",
    inputType: "select",
    options: [
      { key: "MON", label: "Monday" },
      { key: "TUE", label: "Tuesday" },
      { key: "WED", label: "Wednesday" },
      { key: "THU", label: "Thursday" },
      { key: "FRI", label: "Friday" },
      { key: "SAT", label: "Saturday" },
      { key: "SUN", label: "Sunday" },
    ],
  },
  { key: "designation", label: "Designation", inputType: "text" },
  { key: "contact", label: "Contact", inputType: "number" },
  { key: "address", label: "Address", inputType: "text" },
  { key: "availability", label: "Availability", inputType: "text" },
  { key: "roomNumber", label: "Room Number", inputType: "number" },
  { key: "authorityName", label: "Authority Name", inputType: "text" },
  { key: "category", label: "Category", inputType: "text" },
  { key: "origin", label: "Origin", inputType: "text" },
];

const RenderFormFields = ({ formFields, isEdit, required, data }) => {
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

const CreateUserModal = ({ isEdit, data }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleOk = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const onFinish = async (values) => {
    try {
      message.loading({ content: "Loading...", key: "auth/createUser" });
      let res;
      if (isEdit) {
        res = await instance.post("/admin/update-user", {
          userId: data.id,
          profileId: data.profileId,
          ...values,
        });
        console.log({ userEdited: res.data });
      } else {
        res = await instance.post("/auth/signup", { ...values });
        console.log({ userCreated: res.data });
      }
      message.success({
        content: `User ${isEdit ? "edited" : "created"} Successfully`,
        key: "auth/createUser",
      });
      handleCancel();
    } catch (error) {
      message.error({
        content: `User ${isEdit ? "updation" : "creation"} failed`,
        key: "auth/createUser",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error({
      content: "User creation Failed",
      key: "auth/createUser",
    });
  };

  return (
    <React.Fragment>
      <Space>
        <Button onClick={() => setIsModalVisible(true)}>
          {isEdit ? "Edit User" : "Register New User"}
        </Button>
      </Space>

      <Modal
        title="Create"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="Create User"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <RenderFormFields
            isEdit={isEdit}
            formFields={requiredFormFields}
            required={!isEdit}
            data={data}
          />

          <Collapse bordered={false} style={{ padding: 0, margin: 0 }}>
            <Collapse.Panel header="Other Details" key="1">
              <RenderFormFields
                isEdit={isEdit}
                formFields={otherFormFields}
                required={false}
                data={data}
              />
            </Collapse.Panel>
          </Collapse>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              borderTop: "1px solid #f0f0f0",
              margin: "24px -24px -10px -24px",
              padding: "10px 24px 0 24px",
            }}
          >
            <Button style={{ marginRight: "10px" }} onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Update User" : "Create User"}
            </Button>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default CreateUserModal;
