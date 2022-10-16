import moment from "moment";
import { DatePicker } from "antd";
import PropTypes from "prop-types";
import React, { useCallback } from "react";

import { Days } from "../../utils/constants";

function DoctorTimeSelector({ doctor, onChange, style }) {
  const createRange = useCallback((list = [], last) => {
    const result = [];

    if (!list.length) return result;
    for (let i = 0; i < last; i++) {
      const canAdd = list.every((item) => {
        return i > item[1] || i < item[0];
      });

      if (canAdd) {
        result.push(i);
      }
    }
    return result;
  }, []);

  const isAllowedDate = useCallback(
    (current, isDate) => {
      const day = current?.day();
      const hour = current?.hour();
      const DayArr = Object.values(Days);
      const DayChosen = DayArr[day];

      if (!doctor) return true;

      const availableDay = doctor.profile.availability.find(
        (avail) => avail.day === DayChosen
      );
      if (!availableDay) {
        if (isDate) return true;
        return {};
      }
      if (isDate === true) return false;

      const availableTime = availableDay.range.reduce(
        (acc, range) => {
          if (hour === range?.from?.hour) {
            acc.minute.push([range?.from?.minute, 60]);
          } else if (hour === range?.to?.hour) {
            acc.minute.push([0, range?.to?.minute]);
          }
          acc.hour.push([range?.from?.hour, range?.to?.hour]);

          return acc;
        },
        {
          minute: [],
          hour: [],
        }
      );

      // console.log(availableTime, createRange(availableTime.minute, 60));

      const res = {
        disabledMinutes: () => createRange(availableTime.minute, 60),
        disabledHours: () => createRange(availableTime.hour, 24),
      };

      // console.log(res);
      return res;
    },
    [createRange, doctor]
  );

  return (
    <DatePicker
      showTime={{
        format: "HH:mm",
      }}
      allowClear
      disabled={!doctor}
      disabledDate={(current) => isAllowedDate(current, true)}
      disabledTime={(current) => {
        return isAllowedDate(moment(current), false);
      }}
      onChange={onChange}
      style={style}
    />
  );
}

DoctorTimeSelector.propTypes = {
  doctor: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.string.isRequired,
};

export default DoctorTimeSelector;
