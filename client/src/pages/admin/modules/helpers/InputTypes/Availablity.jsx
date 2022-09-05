import { Button, Divider, Select, Space, TimePicker } from "antd";
import React, { useEffect, useReducer } from "react";
import moment from "moment";
import { DeleteFilled } from "@ant-design/icons";

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((item) => item.id !== action.payload.id);
    case "UPDATE":
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    default:
      return state;
  }
}

function Availability({ isEdit, defaultValue, form }) {
  const [Data, dispatch] = useReducer(reducer, defaultValue || []);
  useEffect(() => {
    form.setFields([
      {
        name: "availability",
        value: Data,
      },
    ]);
  }, [Data, form]);
  console.log(Data);

  return (
    <div>
      {Data.map((item) => (
        <div
          key={item.id}
          style={{
            marginTop: 10,
          }}
        >
          <Select
            defaultValue={item.day}
            options={[
              { label: "Monday", value: "MON" },
              { label: "Tuesday", value: "TUE" },
              { label: "Wednesday", value: "WED" },
              { label: "Thursday", value: "THU" },
              { label: "Friday", value: "FRI" },
              { label: "Saturday", value: "SAT" },
              { label: "Sunday", value: "SUN" },
            ]}
            onChange={(value) => {
              console.log("Update Day");
              dispatch({
                type: "UPDATE",
                payload: { ...item, day: value },
              });
            }}
            placeholder="Select Day"
            style={{
              marginBottom: "10px",
            }}
          />

          {item.range.map((rangeItem) => (
            <div
              key={rangeItem.id}
              style={{
                marginTop: 4,
                marginBottom: 4,
              }}
            >
              <Space>
                <TimePicker.RangePicker
                  format={"HH:mm"}
                  defaultValue={[
                    rangeItem?.from
                      ? moment(
                          `${rangeItem?.from?.hour}:${rangeItem?.from?.minute}`,
                          "HH:mm"
                        )
                      : null,
                    rangeItem?.to
                      ? moment(
                          `${rangeItem?.to?.hour}:${rangeItem?.to?.minute}`,
                          "HH:mm"
                        )
                      : null,
                  ]}
                  onChange={(value) => {
                    console.log(
                      moment(value[0]).hour(),
                      moment(value[0]).minute()
                    );

                    dispatch({
                      type: "UPDATE",
                      payload: {
                        ...item,
                        range: item.range.map((_range) => {
                          if (rangeItem.id === _range.id) {
                            return {
                              ...rangeItem,
                              from: {
                                hour: moment(value[0]).hour(),
                                minute: moment(value[0]).minute(),
                              },
                              to: {
                                hour: moment(value[1]).hour(),
                                minute: moment(value[1]).minute(),
                              },
                            };
                          }
                          return rangeItem;
                        }),
                      },
                    });
                  }}
                />
                <Button
                  htmlType="button"
                  color="danger"
                  onClick={() => {
                    console.log("remove", item);
                    dispatch({
                      type: "UPDATE",
                      payload: {
                        ...item,
                        range: item.range.filter(
                          (_range) => rangeItem.id !== _range.id
                        ),
                      },
                    });
                  }}
                >
                  <DeleteFilled />
                </Button>
              </Space>
            </div>
          ))}
          <Button
            htmlType="button"
            style={{
              marginTop: "10px",
            }}
            onClick={() => {
              dispatch({
                type: "UPDATE",
                payload: {
                  ...item,
                  range: [...item.range, { id: Math.random() }],
                },
              });
            }}
          >
            +
          </Button>
          <Divider />
        </div>
      ))}
      <Button
        htmlType="button"
        type="primary"
        style={{
          marginTop: "10px",
        }}
        onClick={() => {
          dispatch({
            type: "ADD",
            payload: { id: Math.random(), range: [] },
          });
        }}
      >
        + Add New Availability
      </Button>
    </div>
  );
}

export default Availability;
