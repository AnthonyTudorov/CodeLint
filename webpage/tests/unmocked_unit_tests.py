import unittest
from unittest.mock import patch
import sys
import os
sys.path.insert(1, os.getcwd())
import app as wholeApp
from app import app
from app import socketio
import mock_methods
import mock_github_responses
import lint
import re

class unmocked(unittest.TestCase):
    def test_disconnect(self):
        flask_test_client = app.test_client()
        socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
        with patch('models.Users') as mock_models_data, \
                patch('app.db.session') as mock_add_db:
            mock_models_data.return_value = None
            mock_add_db.return_value = None
            wholeApp.states = set()
            socketio_test_client.disconnect()
            self.assertEqual(len(wholeApp.states), 0)

    def test_store_state(self):
        flask_test_client = app.test_client()
        socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
        socketio_test_client.emit('store state', {
            'state': '123456789'
        })
        self.assertEqual(len(wholeApp.states), 1)
        self.assertEqual('123456789' in wholeApp.states, True)
        wholeApp.states = set()

    def test_auth_user(self):
        flask_test_client = app.test_client()
        socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
        socketio_test_client.emit('auth user', {
            'state': '123456789',
            'code': '987654321'
        })
        res = socketio_test_client.get_received()[1]["args"][0]["message"]
        self.assertEqual(res, 'state: 123456789 does not match any waiting states')

    def test_on_get_repos(self):
        flask_test_client = app.test_client()
        socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
        with patch('app.get_user_repos') as mock_method:
            mock_method.return_value = None
            socketio_test_client.emit('get repos')
            res = socketio_test_client.get_received()[1]
            self.assertEqual(res["name"], 'repos')
            self.assertEqual(res["args"], [])

    def test_get_repo_tree(self):
        flask_test_client = app.test_client()
        socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
        expected_res = {'path': '.babelrc', 'mode': '100644', 'type': 'blob',
                        'sha': '13a92d0084ce3312cb0150d0229fb9fa823a8f6d',
                        'size': 65,
                        'url': 'https://api.github.com/repos/rudra-desai/Codelint/git/blobs/'
                               '13a92d0084ce3312cb0150d0229fb9fa823a8f6d'}
        with patch('app.get_user_repo_tree') as mock_method:
            mock_method.return_value = mock_github_responses.tree_return
            socketio_test_client.emit('get repo tree', {
                'repo_url': 'https://api.github.com/repos/AnthonyTudorov/BST-and-AVL-Tree-Comparison',
                'default_branch': 'master'
            })
            res = socketio_test_client.get_received()[1]["args"][0]["tree"][0]
            self.assertEqual(res, expected_res)

    def test_get_file_contents(self):
        flask_test_client = app.test_client()
        socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
        expected_res = mock_github_responses.content_return["contents"]
        with patch('app.get_user_file_contents') as mock_method:
            mock_method.return_value = mock_github_responses.content_return
            socketio_test_client.emit('get file contents', {
                'content_url': 'https://api.github.com/repos/rudra-desai/Codelint/git/blobs/209fc8690da1f2ab44168430793af982b56e7db1'
            })
            res = socketio_test_client.get_received()[1]["args"][0]["contents"]
            self.assertEqual(res, expected_res)

    def test_lint_code_js(self):
        with patch('lint.eslint') as mock_eslint:
            mock_eslint.return_value = None
            res = lint.lint_code({
                'linter': 'eslint',
                'code': 'function test(){\nconsole.log("Hello")\n}',
                'uuid': 'testfile'
            })
            here = os.path.dirname(os.path.abspath(__file__))
            here = re.sub(r'tests\/.*', "", here).replace("tests", "")
            subdir = "userfiles"
            filepath = os.path.join(here, subdir, "testfile.js")
            file = open(filepath, "r")
            self.assertEqual(file.read(), 'function test(){\nconsole.log("Hello")\n}')

            flask_test_client = app.test_client()
            socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
            with patch('app.lint_code') as mock_method:
                mock_method.return_value = {
                    'filename': 'testfile.js'
                }
                socketio_test_client.emit('lint', {})
                res = socketio_test_client.get_received()[1]['args'][0]['filename']
                self.assertEqual(res, 'testfile.js')

    def test_lint_code_py(self):
        with patch('lint.pylint') as mock_pylint:
            mock_pylint.return_value = None
            res = lint.lint_code({
                'linter': 'pylint',
                'code': 'def func():\n  print("Hello")',
                'uuid': 'testfile'
            })
            here = os.path.dirname(os.path.abspath(__file__))
            here = re.sub(r'tests\/.*', "", here).replace("tests", "")
            subdir = "userfiles"
            filepath = os.path.join(here, subdir, "testfile.py")
            file = open(filepath, "r")
            self.assertEqual(file.read(), 'def func():\n  print("Hello")')

            flask_test_client = app.test_client()
            socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
            with patch('app.lint_code') as mock_method:
                mock_method.return_value = {
                    'filename': 'testfile.py'
                }
                socketio_test_client.emit('lint', {})
                res = socketio_test_client.get_received()[1]['args'][0]['filename']
                self.assertEqual(res, 'testfile.py')

    def test_pylint(self):
        with patch('lint.subprocess') as mock_sub:
            mock_sub.return_value = None
            res = lint.pylint("pylint", "testfile.py")
            self.assertEqual(res["linter"], "pylint")

    def test_eslint(self):
        with patch('lint.subprocess') as mock_sub, \
             patch("lint.re.sub") as mock_re_sub:
            mock_sub.return_value = None
            mock_re_sub = None
            res = lint.eslint("eslint", "testfile.js")
            self.assertEqual(res["linter"], "eslint")


if __name__ == '__main__':
    unittest.main()
