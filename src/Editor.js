/* eslint-disable react/prop-types */
import React from 'react';
import AceEditor from 'react-ace';
import './editor.css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';

export default function Editor({
  handleChange, code, theme, fontSize, linter,
}) {
  return (
    <AceEditor
      mode={linter && linter === 'eslint' && 'javascript' || 'python'}
      theme={theme}
      onChange={handleChange}
      value={code}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
      }}
      name="ace-editor"
      tabSize={2}
      fontSize={parseInt(fontSize)}
    />
  );
}
