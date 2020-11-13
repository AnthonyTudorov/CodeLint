import mock_github_responses

class mock_request:
    sid = None

class mock_success_request_get:
    def __init__(self, url, params=None, headers=None):
        self.url = url
        self.params = params
        self.headers = headers
        self.status_code = 200
        
    def json(self):
        if self.url == 'https://api.github.com/user':
            return mock_github_responses.user_response
        if self.url == 'https://api.github.com/user/repos':
            return mock_github_responses.repos_response
        if self.url == 'https://api.github.com/repos/rudra-desai/Codelint/commits/master':
            return mock_github_responses.repo_response
        if self.url == 'https://api.github.com/repos/rudra-desai/Codelint/git/trees/d0c94eb66a76007743ffa593d0fc9eb756df04c0':
            return mock_github_responses.tree_response
        if self.url == 'https://api.github.com/repos/rudra-desai/Codelint/git/blobs/a9150ca05f13ad4e0d79311b7ba9da09227553da':
            return mock_github_responses.content_response
        
class mock_failure_request_get:
    def __init__(self, url, params=None, headers=None):
        self.url = url
        self.params = params
        self.headers = headers
        self.status_code = 403

class mock_success_request_post:
    def __init__(self, url, params=None, headers=None):
        self.url = url
        self.params = params
        self.headers = headers
        self.status_code = 200
        
    def json(self):
        if self.url == 'https://github.com/login/oauth/access_token':
            return mock_github_responses.token_response
        
class mock_failure_request_post:
    def __init__(self, url, params=None, headers=None):
        self.url = url
        self.params = params
        self.headers = headers
        self.status_code = 403
        
    def json(self):
        if self.url == 'https://github.com/login/oauth/access_token':
            return mock_github_responses.token_response

class mock_db_session:
    @staticmethod
    def add(toAdd):
        pass

    @staticmethod
    def commit():
        pass
        
class mock_users:
    def __init__(self, login, name, email, profile_image, sid, access_token):
        self.login = login
        self.name = name
        self.email = email
        self.profile_image = profile_image
        self.sid = sid
        self.access_token = access_token

    class query:
        @staticmethod
        def filter_by(sid=None):
            return mock_query()
            
class mock_query:
    class new_first:
        def __init__(self):
            self.login = 'AnthonyTudorov'
            self.profile_image = 'https://avatars0.githubusercontent.com/u/12437954?v=4'
            self.access_token = '1234'
            
    def first(self):
        return self.new_first()
        
class mock_string:
    def __init__(self, number=None):
        pass
    
class mock_coloumn:
    def __init__(self, t, primary_key=None, unique=None, nullable=None):
        pass