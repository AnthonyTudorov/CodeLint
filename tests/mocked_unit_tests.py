import unittest
from unittest import mock
from unittest.mock import patch
import sys
import os
currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)
import mock_methods
import mock_github_responses
import githubOauth
import models
import app as wholeApp
from app import app
from app import socketio

class mocked(unittest.TestCase):
    def test_connect(self):
        client = socketio.test_client(app)
        res = client.get_received()
        self.assertEqual(res[0]["args"][0]["message"], "Server is up!")

    def test_home_page(self):
        user = app.test_client(self)
        response = user.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)
        
    def test_auth_user(self):
        INPUT = {
            'code': 1234,
            'state': 4321
        }
        
        with patch('requests.post', mock_methods.mock_success_request_post), patch('requests.get', mock_methods.mock_success_request_get), patch('settings.db.session', mock_methods.mock_db_session), patch('models.Users', mock_methods.mock_users_bad_query), patch('githubOauth.token_hex', mock_methods.mock_token_hex), patch('githubOauth.session', mock_methods.mock_session):
            githubOauth.auth_user(**INPUT)
            
    def test_get_user_data(self):
        INPUT = {
            'user_id': 1234
        }
        OUTPUT = {
            'login': 'AnthonyTudorov',
            'profile_image': 'https://avatars0.githubusercontent.com/u/12437954?v=4'
        }
        with patch('models.Users', mock_methods.mock_users):
            response = githubOauth.get_user_data(**INPUT)
        self.assertDictEqual(response, OUTPUT)
        
    def test_success_get_user_repos(self):
        INPUT = {
            'user_id': 1234
        }
        OUTPUT = mock_github_responses.repos_return
        with patch('models.Users', mock_methods.mock_users), patch('requests.get', mock_methods.mock_success_request_get), patch('githubOauth.Fernet', mock_methods.mock_fernet):
            response = githubOauth.get_user_repos(**INPUT)
        self.assertDictEqual(response, OUTPUT)
        
    def test_failure_get_user_repos(self):
        INPUT = {
            'user_id': 1234
        }
        OUTPUT = {'repos': None, 'error': 'bad github token'}
        with patch('models.Users', mock_methods.mock_users), patch('requests.get', mock_methods.mock_failure_request_get), patch('githubOauth.Fernet', mock_methods.mock_fernet):
            response = githubOauth.get_user_repos(**INPUT)
        self.assertDictEqual(response, OUTPUT)
        
    def test_success_get_user_repo_tree(self):
        INPUT = {
            'user_id': 1234,
            'repo_url': 'https://api.github.com/repos/rudra-desai/Codelint',
            'default_branch': 'master'
        }
        OUTPUT = mock_github_responses.tree_return
        with patch('models.Users', mock_methods.mock_users), patch('requests.get', mock_methods.mock_success_request_get), patch('githubOauth.Fernet', mock_methods.mock_fernet):
            response = githubOauth.get_user_repo_tree(**INPUT)
        self.assertDictEqual(response, OUTPUT)
        
    def test_failure_get_user_repo_tree(self):
        INPUT = {
            'user_id': 1234,
            'repo_url': 'https://api.github.com/repos/rudra-desai/Codelint',
            'default_branch': 'master'
        }
        OUTPUT = {'tree': None, 'error': 'bad github token'}
        with patch('models.Users', mock_methods.mock_users), patch('requests.get', mock_methods.mock_failure_request_get), patch('githubOauth.Fernet', mock_methods.mock_fernet), patch('githubOauth.get_prev_commit', mock_methods.mock_get_prev_commit):
            response = githubOauth.get_user_repo_tree(**INPUT)
        self.assertDictEqual(response, OUTPUT)

    def test_success_get_user_file_contents(self):
        INPUT = {
            'user_id': 1234,
            'content_url': 'https://api.github.com/repos/rudra-desai/Codelint/git/blobs/a9150ca05f13ad4e0d79311b7ba9da09227553da'
        }
        OUTPUT = mock_github_responses.content_return
        with patch('models.Users', mock_methods.mock_users), patch('requests.get', mock_methods.mock_success_request_get), patch('githubOauth.Fernet', mock_methods.mock_fernet):
            response = githubOauth.get_user_file_contents(**INPUT)
        self.assertDictEqual(response, OUTPUT)
        
    def test_failure_get_user_file_contents(self):
        INPUT = {
            'user_id': 1234,
            'content_url': 'https://api.github.com/repos/rudra-desai/Codelint/git/blobs/a9150ca05f13ad4e0d79311b7ba9da09227553da'
        }
        OUTPUT = {'contents': None, 'error': 'bad github token'}
        with patch('models.Users', mock_methods.mock_users), patch('requests.get', mock_methods.mock_failure_request_get), patch('githubOauth.Fernet', mock_methods.mock_fernet):
            response = githubOauth.get_user_file_contents(**INPUT)
        self.assertDictEqual(response, OUTPUT)
        
    def test_failure_get_user_file_contents(self):
        INPUT = {
            'user_id': 1234,
        }
        with patch('settings.db.session', mock_methods.mock_db_session), patch('models.Users', mock_methods.mock_users):
            githubOauth.logout_user(**INPUT)
        
    def test_sucess_commit_changes(self):
        INPUT = {
            'user_id': 1234,
            'repo_url': 'https://api.github.com/repos/rudra-desai/Codelint',
            'default_branch': 'main',
            'files': [{'path': 'src/App.js', 'content': 'test'}],
            'commit_message': 'testing'
        }
        OUTPUT = None
        with patch('models.Users', mock_methods.mock_users), patch('githubOauth.Fernet', mock_methods.mock_fernet), patch('githubOauth.get_prev_commit', mock_methods.mock_get_prev_commit), patch('requests.get', mock_methods.mock_success_request_get), patch('githubOauth.dumps', mock_methods.mock_dumps), patch('requests.post', mock_methods.mock_success_request_post), patch('requests.patch', mock_methods.mock_success_request_patch):
            response = githubOauth.commit_changes(**INPUT)
        self.assertEqual(response, OUTPUT)
        
    def test_models(self):
        INPUT = {
            'login': 'test',
            'name': 'tester',
            'email': 'tester@test.com',
            'profile_image': 'test.png',
            'user_id': 1234,
            'access_token': 4321
        }
        OUTPUT = str({
            'login': 'test',
            'name': 'tester',
            'email': 'tester@test.com',
            'profile_image': 'test.png',
            'user_id': 1234,
            'access_token': 4321
        })
        with patch('settings.db.Column', mock_methods.mock_coloumn), patch('settings.db.String', mock_methods.mock_string):
            response = models.Users(**INPUT).__repr__()
        self.assertEqual(response, OUTPUT)

if __name__ == '__main__':
    unittest.main()