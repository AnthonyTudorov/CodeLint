import React, { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import Top from './Top';
import Editor from './Editor';
import Socket from './Socket';
import './styles.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

export default function OneTab({
  index, currentTab, updateUser, updateLoggedIn, user, theme, fontSize, changeFontSize, mode, handleProfilePhoto
}) {
  console.log(`from repos: ${user}`);
  const [code, setCode] = useState(localStorage.getItem(`code${index}` || ''));
  const [linter, setLinter] = useState(localStorage.getItem(`linter${index}`) || '');
  const [promptError, setPromptError] = useState('');
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [allRepoInfo, setAllRepoInfo] = useState(localStorage.getItem('allRepoInfo')
                                       && JSON.parse(localStorage.getItem('allRepoInfo')) || []);
  const [selectedRepo, setSelectedRepo] = useState(localStorage.getItem(`selectedRepo${index}`) || '');
  const [repoTree, setRepoTree] = useState(localStorage.getItem('repo_tree')
                                       && JSON.parse(localStorage.getItem('repo_tree')) || []);
  const [repoTreeFiles, setRepoTreeFiles] = useState(localStorage.getItem('repo_tree_files')
                                       && JSON.parse(localStorage.getItem('repo_tree_files')) || []);
  const [selectedFile, setSelectedFile] = useState(localStorage.getItem(`selectedFile${index}`) || '');
  const [styleguide, setStyleguide] = useState(localStorage.getItem(`styleguide${index}`) || '');
  const [currentTabErrors, setCurrentTabErrors] = useState(localStorage.getItem(`errors${index}`)
                                       && parse(localStorage.getItem(`errors${index}`)) || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const commitMessage = useRef('');

  useEffect(() => {
    if (mode === "dark") {
      applyDarkMode()
    }
    Socket.on('logged in status', ({ logged_in, user_info }) => {
      if (logged_in === true) {
        updateUser(user_info.login);
        handleProfilePhoto(user_info.profile_image)
        setUsername((username) => user_info.login);
        updateLoggedIn(true);
        Socket.emit('get repos', { index });
      } else {
        updateLoggedIn(false);
      }
    });

    Socket.on('user data', ({ login, profile_image }) => {
      setUsername((username) => login);
      updateUser(login);
      console.log(profile_image)
      handleProfilePhoto(profile_image)
      updateLoggedIn(true);
      Socket.emit('get repos', { index });
    });

    Socket.on('repos', ({ repos }) => {
      const usr = localStorage.getItem('username');
      const arr = [];
      repos.forEach(([elem, link]) => {
        if (link.includes(usr)) {
          arr.push(elem);
        }
      });
      setRepos(arr);
      setAllRepoInfo(repos);
      localStorage.setItem('allRepoInfo', JSON.stringify(repos));
    });

    Socket.on('repo tree', (data) => {
      localStorage.setItem('repo_tree', JSON.stringify(data));
      setRepoTree(data);
      const arr = [];
      data.tree.forEach(({ path, type }) => {
        if (type === 'blob') arr.push(path);
      });
      setRepoTreeFiles(arr);
      localStorage.setItem('repo_tree_files', JSON.stringify(arr));
    });

    Socket.on('file contents', ({ contents, tab }) => {
      localStorage.setItem(`code${tab}`, contents);
      if (index === tab) { setCode(contents); }
    });

    Socket.on('output', ({ linter, output, tab }) => {
      localStorage.setItem(`errors${tab}`, output);
      setLoading(false);
      if (index === tab) {
        if (mode === 'dark') {
          setCurrentTabErrors(parse(output));
          applyDarkMode()
        }
        else {
          setCurrentTabErrors(parse(output));
        }
      }
    });

    Socket.on('fixed', ({
      linter, output, file_contents, tab,
    }) => {
      localStorage.setItem(`code${tab}`, file_contents);
      localStorage.setItem(`errors${tab}`, output);
      setLoading(false);
      if (index === tab) {
        setCode(file_contents);
        if (mode === 'dark') {
          setCurrentTabErrors(parse(output));
          applyDarkMode()
        }
        else {
          setCurrentTabErrors(parse(output));
        }
      }
    });

    Socket.emit('is logged in');
    window.history.replaceState({}, document.title, '/');

    return () => {
      Socket.close();
    };
  }, []);

  const applyDarkMode = () => {
    document.body.style.backgroundColor = "#242526"
    if (localStorage.getItem(`errors${index}`) && localStorage.getItem(`errors${index}`).includes('ESLint Report')) {
      const x = document.getElementsByTagName("tr");
      if (x) {
        const byclass = document.getElementsByClassName('f-0')
        for (let i of byclass) {
          i.children.item(2).style.color = "white"
          i.children.item(3).getElementsByTagName('a')[0].style.color = '#0496FF'
        }
        if (localStorage.getItem(`errors${index}`)) {
          const newColors = document.getElementsByClassName('code')[0].innerHTML
          localStorage.setItem(`errors${index}`, newColors);
          if (currentTab === index) {
            setCurrentTabErrors(parse(newColors))
          }
        }
      }
    }
  }
  const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  }));
  const classes = useStyles();

  const handleChange = (newValue) => {
    localStorage.setItem(`code${index}`, newValue);
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
      styleguide,
      index,
    });
  };

  const handleLinter = ({ value }) => {
    setLinter(value);
    localStorage.setItem(`linter${index}`, value);
    setPromptError('');
    setStyleguide('');
  };

  const handleSelectedRepo = ({ value }) => {
    setSelectedRepo(value);
    localStorage.setItem(`selectedRepo${index}`, value);
    let found = false;
    allRepoInfo.forEach(([repo_name, url, default_branch]) => {
      if (value === repo_name && !found) {
        if (url.includes(username)) {
          Socket.emit('get repo tree', {
            repo_url: url,
            default_branch,
            index,
          });
          found = true;
        }
      }
    });
  };

  const handleRepoTree = ({ value }) => {
    setSelectedFile(value);
    localStorage.setItem(`selectedFile${index}`, value);
    repoTree.tree.forEach(({ path, url }) => {
      if (path === value) {
        Socket.emit('get file contents', {
          content_url: url,
          index,
        });
        if (value.includes('.py')) {
          setLinter('pylint');
          localStorage.setItem(`linter${index}`, 'pylint');
        }
        if (value.includes('.js') || value.includes('.jsx')) {
          setLinter('eslint');
          localStorage.setItem(`linter${index}`, 'eslint');
        }
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
      fix: true,
      styleguide,
      index,
    });
  };

  const handleStyleguide = ({ value }) => {
    localStorage.setItem(`styleguide${index}`, value);
    setStyleguide(value);
    setPromptError('');
  };

  const handleCommit = () => {
    commitMessage.current.focus();
    if (commitMessage.current.value && code) {
      let found = false;
      allRepoInfo.forEach(([repo_name, url, default_branch]) => {
        if (selectedRepo === repo_name && !found) {
          Socket.emit('commit changes', {
            repo_url: url,
            default_branch,
            files: [{
              path: selectedFile,
              content: code,
            }],
            commit_message: commitMessage.current.value,
          });
          commitMessage.current.value = '';
          found = true;
        }
      });
    }
  };

  const element = () => (
    <div className={mode === 'light' ? "body_light" : 'body_dark'}>
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
        changeFontSize={changeFontSize}
        fontSize={fontSize}
      />

      <div className={loading ? ''
        : 'div-error'}
      >
        <p className="error">{promptError}</p>
      </div>
      <div className="middle_content">
      <Editor
        handleChange={handleChange}
        code={code}
        theme={theme}
        fontSize={fontSize}
        linter={linter}
      />
        <div style={{'display': 'flex', 'justifyContent': 'flex-end'}} className={classes.root}>
             <Button onClick={handleClick} type="submit" variant="contained" style={{ 'backgroundColor': '#0496FF', 'color': 'white'}}>
              Lint
            </Button>
            <Button onClick={handleFix} type="submit" variant="contained" style={{ 'backgroundColor': '#0496FF', 'color': 'white'}}>
              Fix
            </Button>
            <Button onClick={handleCommit} type="submit" variant="contained" style={{ 'backgroundColor': '#0496FF', 'color': 'white'}}>
              Commit
            </Button>
        </div>
      </div>
      {/*<input type="text" ref={commitMessage} />*/}
      <br />
      { currentTab === index ? (
        <div className="code">
          {currentTabErrors}
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {currentTab === index ? element() : null}
    </>
  );
}
