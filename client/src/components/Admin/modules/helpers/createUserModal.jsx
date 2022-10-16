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
import { useSetRecoilState } from "recoil";

import useGetUserDetail from "./getUserDetail";
import { instance } from "../../../../api/instance";
import Availability from "./InputTypes/Availablity";
import { showGender, toSentenceCase } from "../../../../utils/strings";
import { UserSlotManagerAtom } from "../../../../atoms/UserSlotManager";
import { supportedUserRoles, Category } from "../../../../utils/constants";

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
    key: "roomNumber",
    label: "Room Number",
    inputType: "number",
    otherRules: [{}],
  },
  {
    key: "role",
    label: "Role",
    inputType: "select",
    multiple: false,
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
    multiple: false,
    otherRules: [{}],
    options: ["m", "f", "o"].map((gender) => ({
      key: gender,
      label: showGender(gender),
    })),
  },
];

const otherFormFields = [
  { key: "bio", label: "Introduction", inputType: "textarea" },
  { key: "designation", label: "Designation", inputType: "text" },
  { key: "contact", label: "Contact", inputType: "number" },
  { key: "address", label: "Address", inputType: "text" },
  {
    key: "availability",
    label: "Availability",
    inputType: "custom",
    component: Availability,
  },
  { key: "authorityName", label: "Authority Name", inputType: "text" },
  {
    key: "category",
    label: "Category",
    inputType: "select",
    multiple: "true",
    options: Object.entries(Category).map(([key, value]) => ({
      key: key,
      label: value,
    })),
  },
  { key: "origin", label: "Origin", inputType: "text" },
];

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

const CreateUserModal = ({ isEdit, data }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const setUserAtom = useSetRecoilState(UserSlotManagerAtom);
  const { getUsers } = useGetUserDetail({
    userType: "doctors",
    userRole: "DOCTOR",
  });

  const handleOk = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    setUserAtom(null);
  };

  const onFinish = async (values) => {
    try {
      message.loading({ content: "Loading...", key: "auth/createUser" });
      if (isEdit) {
        await instance.post("/admin/update-user", {
          userId: data.id,
          profileId: data.profileId,
          ...values,
        });
      } else {
        await instance.post("/auth/signup", { ...values });
      }
      message.success({
        content: `User ${isEdit ? "edited" : "created"} Successfully`,
        key: "auth/createUser",
      });
    } catch (error) {
      message.error({
        content: `User ${isEdit ? "updation" : "creation"} failed`,
        key: "auth/createUser",
      });
    } finally {
      await getUsers();
      handleCancel();
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error({
      content: "User creation Failed",
      key: "auth/createUser",
    });
  };

  return (
    <React.Fragment>
      <Space>
        <Button
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          {isEdit ? "Edit User" : "Register New User"}
        </Button>
      </Space>

      <Modal
        title="Create"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        style={{ maxHeight: "70vh", overflowY: "auto", paddingBottom: 0 }}
      >
        <Form
          name="Create User"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="horizontal"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          form={form}
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
                form={form}
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
            <Button
              type="primary"
              htmlType="submit"
              onClick={(e) => {
                e.preventDefault();
                form.submit();
              }}
            >
              {isEdit ? "Update User" : "Create User"}
            </Button>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default CreateUserModal;