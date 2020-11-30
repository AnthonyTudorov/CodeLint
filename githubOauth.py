'''handles backend logic for Github OAuth'''
# pylint: disable=subprocess-run-check,missing-function-docstring,no-member, invalid-name
import os
import base64
import requests
from secrets import token_hex
from dotenv import load_dotenv
from flask import request, session
import models
from settings import db

load_dotenv()
github_id = os.getenv('GITHUB_CLIENT_ID')
github_secret = os.getenv('GITHUB_CLIENT_SECRET')
github_redirect_uri = os.getenv('GITHUB_REDIRECT_URI')


def log_user_info(user_access_token):
    headers = {'Authorization': 'token ' + user_access_token}
    user = requests.get('https://api.github.com/user', headers=headers).json()
    login = user['login']
    name = user['name']
    email = user['email']
    profile_image = user['avatar_url']
    user_id = token_hex(16)
    while models.Users.query.filter_by(user_id=user_id).first() is not None:
        user_id = token_hex(16)
    model = models.Users(login, name, email, profile_image, user_id,
                         user_access_token)
    db.session.add(model)
    db.session.commit()
    session.permanent = True
    session['user_id'] = user_id


def auth_user(code, state):
    params = {
        'client_id': github_id,
        'client_secret': github_secret,
        'code': code,
        'redirect_uri': github_redirect_uri,
        'state': state
    }
    headers = {'Accept': 'application/json'}
    res = requests.post('https://github.com/login/oauth/access_token',
                      params=params,
                      headers=headers).json()
    access_token = res['access_token']

    log_user_info(access_token)

def logout_user(user_id):
    query = models.Users.query.filter_by(user_id=user_id).first()
    if query is not None:
        db.session.delete(query)
        db.session.commit()

def get_user_data(user_id):
    query = models.Users.query.filter_by(user_id=user_id).first()
    return {'login': query.login, 'profile_image': query.profile_image}


def get_user_repos(user_id):
    user_access_token = models.Users.query.filter_by(
        user_id=user_id).first().access_token
    headers = {
        'Authorization': 'token ' + user_access_token,
        'Accept': 'application/vnd.github.v3+json'
    }
    params = {'visibility': 'all'}
    repo_url = 'https://api.github.com/user/repos'
    repos = requests.get(repo_url, params=params, headers=headers)
    if repos.status_code == 403:
        return {'repos': None, 'error': 'bad github token'}

    repos = repos.json()
    return {
        'repos': [(repo['name'], repo['url'], repo['default_branch']) for repo in repos],
        'error': None
    }

def get_prev_commit(user_id, repo_url, default_branch):
    user_access_token = models.Users.query.filter_by(
        user_id=user_id).first().access_token
    headers = {
        'Authorization': 'token ' + user_access_token,
        'Accept': 'application/vnd.github.v3+json'
    }
    repo_url = repo_url + '/commits/' + default_branch
    repo = requests.get(repo_url, headers=headers)
    if repo.status_code == 403:
        return {'tree': None, 'error': 'bad github token'}
    repo = repo.json()
    return repo

def get_user_repo_tree(user_id, repo_url, default_branch):
    user_access_token = models.Users.query.filter_by(
        user_id=user_id).first().access_token
    headers = {
        'Authorization': 'token ' + user_access_token,
        'Accept': 'application/vnd.github.v3+json'
    }
    repo = get_prev_commit(user_id, repo_url, default_branch)
    params = {'recursive': True}
    tree = requests.get(repo['commit']['tree']['url'],
                        params=params,
                        headers=headers)
                        
    #test stuff
    files = [{'path': 'README.md', 'content': 'hello there'}]
    commit_message = 'ayy'
    commit_changes(user_id, repo_url, default_branch, files, commit_message)
    
    
                        
    if tree.status_code == 403:
        return {'tree': None, 'error': 'bad github token'}

    tree = tree.json()
    return {'tree': tree['tree'], 'error': None}


def get_user_file_contents(user_id, content_url):
    user_access_token = models.Users.query.filter_by(
        user_id=user_id).first().access_token
    headers = {
        'Authorization': 'token ' + user_access_token,
        'Accept': 'application/vnd.github.v3+json'
    }
    contents = requests.get(content_url, headers=headers)
    if contents.status_code == 403:
        return {'contents': None, 'error': 'bad github token'}
    
    contents = contents.json()
    if 'content' not in contents:
        return {'contents': None, 'error': 'could not determine contents'}
    else:
        return {
            'contents': base64.b64decode(contents['content']).decode("utf-8"),
            'error': None
        }

def create_blob(user_id, repo_url, content):
    user_access_token = models.Users.query.filter_by(
        user_id=user_id).first().access_token
    headers = {
        'Authorization': 'token ' + user_access_token,
        'Accept': 'application/vnd.github.v3+json'
    }
    blob_url = repo_url + '/git/blobs'
    data = {'content': content}
    blob = requests.post(blob_url, headers=headers, content=content)
    if blob.status_code == 403:
        return {'blob_success': False, 'error': 'bad github token'}
        
    blob = blob.json()
    return blob['sha']
    
def create_new_tree(user_id, repo_url, default_branch, files):
    user_access_token = models.Users.query.filter_by(
        user_id=user_id).first().access_token
    headers = {
        'Authorization': 'token ' + user_access_token,
        'Accept': 'application/vnd.github.v3+json'
    }
    repo = get_prev_commit(user_id, repo_url, default_branch)
    params = {'recursive': True}
    tree = requests.get(repo['commit']['tree']['url'],
                        params=params,
                        headers=headers)
    if tree.status_code == 403:
        return {'new_tree_success': False, 'error': 'bad github token'}
        
    tree = tree.json()
    tree_update = []
    for file in files:
        for obj in tree['tree']:
            if obj['path'] == file['path']:
                blob_sha = create_blob(user_id, repo_url, file['content'])
                obj['sha'] = blob_sha
                tree_update.append(obj)
                
    new_tree_url = repo_url + '/git/trees'
    data = {'tree': tree_update, 'base_tree': tree['sha']}
    new_tree = request.post(new_tree_url, headers=headers, data=data)
    if new_tree.status_code == 403:
        return {'new_tree_success': False, 'error': 'bad github token'}
        
    return (new_tree['sha'], last_commit['sha'])

def update_branch_reference(user_id, repo_url, default_branch, commit_sha):
    user_access_token = models.Users.query.filter_by(
        user_id=user_id).first().access_token
    headers = {
        'Authorization': 'token ' + user_access_token,
        'Accept': 'application/vnd.github.v3+json'
    }
    ref_update_url = repo_url + '/git/refs/' + default_branch
    data = {'sha': commit_sha}
    ref = requests.patch(ref_update_url, headers=headers, data=data)
    if ref.status_code == 403:
        return {'commit_success': False, 'error': 'bad github token'}
    
def commit_changes(user_id, repo_url, default_branch, files, commit_message):
    new_tree_sha, old_commit_sha = create_new_tree(user_id, repo_url, default_branch, files)
    user_access_token = models.Users.query.filter_by(
        user_id=user_id).first().access_token
    headers = {
        'Authorization': 'token ' + user_access_token,
        'Accept': 'application/vnd.github.v3+json'
    }
    commit_url = repo_url + 'git/commits'
    data = {'message': commit_message, 'tree': new_tree_sha, 'parent': [old_commit_sha]}
    commit = request.post(commit_url, headers=headers, data=data)
    if commit.status_code == 403:
        return {'commit_success': False, 'error': 'bad github token'}
    commit = commit.json()
    update_branch_reference(user_id, repo_url, default_branch, commit['sha'])
    
    