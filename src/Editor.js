/* eslint-disable react/prop-types */
import React from 'react';
import AceEditor from 'react-ace';
import './editor.css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';

export default function Editor({ handleChange, code }) {
  return (
    <AceEditor
      mode="javascript"
      theme="tomorrow_night"
      onChange={handleChange}
      value={code}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
      }}
      name="ace-editor"
    />
  );
}
