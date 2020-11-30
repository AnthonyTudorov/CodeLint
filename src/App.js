import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import Top from './Top';
import Editor from './Editor';
import GithubOauth from './GithubOauth';
import Socket from './Socket';
import './styles.css';

export default function App() {
  const [code, setCode] = useState('');
  const [linter, setLinter] = useState('');
  const [errors, setErrors] = useState('');
  const [promptError, setPromptError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [allRepoInfo, setAllRepoInfo] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [repoTree, setRepoTree] = useState([]);
  const [repoTreeFiles, setRepoTreeFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [styleguide, setStyleguide] = useState('')

  useEffect(() => {
    Socket.on('logged in status', ({ logged_in, user_info}) => {
      console.log(`Logged in: ${logged_in}`);
      console.log(`user_info: ${user_info}`);
      if (logged_in === true) {
        setUser(user_info['login']);
        setIsLoggedIn(true);
        Socket.emit('get repos');
      }
      else {
        setIsLoggedIn(false);
      }
    });
    
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

     Socket.on('fixed', ({ linter, output, file_contents }) => {
      setLoading(false);
      setCode(file_contents)
      if (linter === 'eslint') setErrors(parse(output));
      if (linter === 'pylint') setErrors(parse(output));
    });

    Socket.emit('is logged in');
    window.history.replaceState({}, document.title, '/');

    return () => {
      Socket.close();
    };
  }, []);

  const handleChange = (newValue) => {
    setCode(newValue);
  };

  const handleClick = () => {
    if (linter === '') {
      setPromptError('Please select a linter!');
      return;
    }
    if (styleguide === '') {
      setPromptError('Please select a style guide!');
      return;
    }
    setLoading(true);
    Socket.emit('lint', {
      code,
      linter,
      uuid: uuidv4(),
      styleguide
    });
  };

  const handleLinter = ({ value }) => {
    setLinter(value);
    setPromptError('');
  };

  const handleSelectedRepo = ({ value }) => {
    setSelectedRepo(value);
    allRepoInfo.forEach(([repo_name, url, default_branch]) => {
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

  const handleFix = () => {
     if (linter === '') {
      setPromptError('Please select a linter!');
      return;
     }
     if (styleguide === '') {
      setPromptError('Please select a style guide!');
      return;
    }
    setLoading(true);
    Socket.emit('lint', {
      code,
      linter,
      uuid: uuidv4(),
      fix: true
    });
  }

  const handleStyleguide = ({ value }) => {
    setStyleguide(value)
    setPromptError('');
  }

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
        handleStyleguide={handleStyleguide}
        styleguide={styleguide}
        loading={loading}
      />

      <div className={loading ? ""
          : "div-error"}>
        <p className="error">{promptError}</p>
      </div>

      <Editor
        handleChange={handleChange}
        code={code}
      />
      <button type="submit" className="lintbutton" onClick={handleClick}>Lint!</button>
      <button type="submit" className="lintbutton" onClick={handleFix}>Fix!</button>

      <br />
      <div className="code">
        {errors}
      </div>
    </div>
  );
}
