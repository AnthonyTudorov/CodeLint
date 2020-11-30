/* eslint-disable react/prop-types */
import React from 'react';
import 'react-dropdown/style.css';
import './top.css';
import Dropmenu from './Dropmenu';
import loadingGif from "./loading.gif";

export default function Top({
  handleLinter, handleSelectedRepo, linter, repos, handleRepoTree, repoTreeFiles,
  selectedRepo, selectedFile, handleStyleguide, styleguide, loading
}) {
  return (
    <>
      <div className="top">
        <h2>{loading ? <img height={25} width={25} src={loadingGif} alt="loading"/> : 'Codelint'}</h2>
        <Dropmenu
          handleDropdown={handleLinter}
          value={linter}
          className="dropdown"
          placeholder="Select a linter"
          options={['pylint', 'eslint']}
        />
        <Dropmenu
          handleDropdown={handleStyleguide}
          value={styleguide}
          className="dropdown"
          placeholder="Select a styling guide"
          options={['airbnb', 'standard', 'google']}
        />
        {repos.length !== 0
          ? (
            <Dropmenu
              handleDropdown={handleSelectedRepo}
              value={selectedRepo}
              className="dropdown"
              placeholder="Select a repo after GitHub Auth"
              options={repos}
            />
          ) : ''}
        {repoTreeFiles.length !== 0
          ? (
            <div className="files">
              <Dropmenu
                handleDropdown={handleRepoTree}
                value={selectedFile}
                className="allfiles"
                placeholder="Select a file after selecting Repo"
                options={repoTreeFiles}
              />
            </div>
          ) : ''}
      </div>
    </>
  );
}
