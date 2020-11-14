import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import Top from './Top';
import Editor from './Editor';
import GithubOauth from './GithubOauth';
import Socket from './Socket';
import './styles.css';
import loadingGif from './loading.gif';

export default function App() {
  const [code, setCode] = useState('');
  const [linter, setLinter] = useState('');
  const [errors, setErrors] = useState('');
  const [selectLinterError, setSelectLinterError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [allRepoInfo, setAllRepoInfo] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [repoTree, setRepoTree] = useState([]);
  const [repoTreeFiles, setRepoTreeFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');

  useEffect(() => {
    Socket.on('user data', ({ login }) => {
      setUser(login);
      setIsLoggedIn(true);
      Socket.emit('get repos');
    });

    Socket.on('repos', ({ repos }) => {
      setRepos(repos.map(([elem]) => elem));
      setAllRepoInfo(repos);
    });

    Socket.on('repo tree', (data) => {
      setRepoTree(data);
      const arr = [];
      data.tree.forEach(({ path, type }) => {
        if (type === 'blob') arr.push(path);
      });
      setRepoTreeFiles(arr);
    });

    Socket.on('file contents', (data) => {
      setCode(data.contents);
    });

    Socket.on('output', ({ linter, output }) => {
      setLoading(false);
      if (linter === 'eslint') setErrors(parse(output));
      if (linter === 'pylint') setErrors(parse(output));
    });

    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (code !== null && state !== null) {
      window.history.replaceState({}, document.title, '/');
      Socket.emit('auth user', {
        code,
        state,
      });
    }

    return () => {
      Socket.close();
    };
  }, []);

  const handleChange = (newValue) => {
    setCode(newValue);
  };

  const handleClick = () => {
    if (linter === '') {
      setSelectLinterError('Please select a linter!');
      return;
    }
    setLoading(true);
    Socket.emit('lint', {
      code,
      linter,
      uuid: uuidv4(),
    });
  };

  const handleLinter = ({ value }) => {
    setLinter(value);
    setSelectLinterError('');
  };

  const handleSelectedRepo = ({ value }) => {
    setSelectedRepo(value);
    allRepoInfo.forEach(([repo_name, url, default_branch]) => {
      console.log(repo_name);
      console.log(url);
      console.log(default_branch);
      if (value === repo_name) {
        if (url.includes(user)) {
          console.log(default_branch);
          Socket.emit('get repo tree', {
            repo_url: url,
            default_branch: default_branch,
          });
        }
      }
    });
  };

  const handleRepoTree = ({ value }) => {
    setSelectedFile(value);
    repoTree.tree.forEach(({ path, url }) => {
      if (path === value) {
        Socket.emit('get file contents', {
          content_url: url,
        });
        if (value.includes('.py')) setLinter('pylint');

        if (value.includes('.js') || value.includes('.jsx')) setLinter('eslint');
      }
    });
  };

  return (
    <div className="body">
      <div className="github">
        <div className="user">{user}</div>
        {!isLoggedIn && <GithubOauth />}
      </div>
      <Top
        handleSelectedRepo={handleSelectedRepo}
        selectedRepo={selectedRepo}
        handleLinter={handleLinter}
        linter={linter}
        repos={repos}
        handleRepoTree={handleRepoTree}
        repoTreeFiles={repoTreeFiles}
        selectedFile={selectedFile}
      />

      <div className="div-error">
        <p className="error">{selectLinterError}</p>
      </div>

      <Editor
        handleChange={handleChange}
        code={code}
      />
      <button type="submit" className="lintbutton" onClick={handleClick}>{loading ? <img src={loadingGif} alt="loading" value="Lint!" /> : 'Lint!'}</button>

      <br />
      <div className="code">
        {errors}
      </div>
    </div>
  );
}
