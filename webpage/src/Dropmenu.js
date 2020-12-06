/* eslint-disable react/prop-types */
import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './top.css';

export default function Dropmenu({
  handleDropdown, value, options, placeholder,
}) {
  return (
    <Dropdown
      className="dropdown"
      options={options}
      onChange={handleDropdown}
      value={value}
      placeholder={placeholder}
    />
  );
}
