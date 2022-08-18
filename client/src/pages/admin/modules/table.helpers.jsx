import { Button, Space } from "antd";
import React from "react";

export const formatForTable = (users) => {
  return users.reduce(
    (acc, user) => [
      ...acc,
      {
        id: user.id,
        name: user.Auth[0].name,
        email: user.Auth[0].email,
        permissions: user.Auth[0].permissions,
        address: user.address,
        authorityName: user.authority_name,
        availability: user.availability,
        availableDays: user.available_days,
        bio: user.bio,
        category: user.category,
        contact: user.contact,
        joined: user.createdAt,
        designation: user.designation,
        origin: user.origin,
        role: user.role,
        roomNumber: user.room_number,
        sex: user.sex,
      },
    ],
    []
  );
};

export const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  {
    title: "Joined",
    dataIndex: "joined",
    key: "joined",
    sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  },
  {
    title: "Room Number",
    dataIndex: "roomNumber",
    key: "roomNumber",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (text, record) => (
      <Space>
        <Button> Details </Button>
      </Space>
    ),
  },
];
