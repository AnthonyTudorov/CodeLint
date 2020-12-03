'''Main backend server file for Codelint!'''
# pylint: disable=subprocess-run-check,missing-function-docstring,no-member
import subprocess
import os
import flask
import flask_socketio
from flask import request, session, redirect, url_for
from markupsafe import escape
from githubOauth import auth_user, logout_user, get_user_data, get_user_repos
from githubOauth import get_user_repo_tree, get_user_file_contents
from settings import db, app
from lint import lint_code, make_file

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

states = set()
# pylint: disable=wrong-import-position
import models
@app.route('/')
def main():
    github_code = request.args.get('code')
    state = request.args.get('state')
    if state is not None and github_code is not None:
        if state not in states:
            print(f'state: {state} does not match any waiting states')
        else:
            auth_user(github_code, state)
    return flask.render_template('index.html')


@socketio.on('connect')
def on_connect():
    print(f"{request.sid} connected")
    socketio.emit('test', {'message': 'Server is up!'})


@socketio.on('disconnect')
def on_disconnect():
    print(f"{request.sid} disconnected")

@socketio.on('is logged in')
def on_is_logged_in():
    if 'user_id' in session:
        user_id = escape(session.get('user_id'))
        if models.Users.query.filter_by(user_id=user_id).first() is not None:
            socketio.emit('logged in status', {'logged_in': True, 'user_info': get_user_data(user_id)}, request.sid)
    else:
        socketio.emit('logged in status', {'logged_in': False, 'user_info': None}, request.sid)

@socketio.on('logout')
def on_logout():
    logout_user(escape(session['user_id']))

@socketio.on('store state')
def on_store_state(data):
    states.add(data['state'])


@socketio.on('get repos')
def on_get_repos():
    socketio.emit('repos', get_user_repos(escape(session['user_id'])), request.sid)


@socketio.on('get repo tree')
def on_get_repo_tree(data):
    socketio.emit('repo tree', get_user_repo_tree(escape(session['user_id']),
                                                  data['repo_url'], data['default_branch']), request.sid)

@socketio.on('get file contents')
def on_get_file_contents(data):
    socketio.emit('file contents',
                  get_user_file_contents(escape(session['user_id']), data['content_url']), request.sid)


@socketio.on('lint')
def code(data):
    file = make_file(data)
    if 'fix' in data:
        res = lint_code(file, data,True)
        res['tab'] = data['index']
        socketio.emit('fixed', res, request.sid)
    else:
        res = lint_code(file, data)
        res['tab'] = data['index']
        socketio.emit('output', res, request.sid)
    subprocess.run(['rm', '-r', f'./userfiles/{res["filename"]}'])
    subprocess.run(['rm', '-r', f'./userfiles/.{res["filename"]}'])

if __name__ == '__main__':
    models.db.create_all()
    socketio.run(app,
                 host=os.getenv('IP', '0.0.0.0'),
                 port=int(os.getenv('PORT', '3000')))