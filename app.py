'''Main backend server file for Codelint!'''
# pylint: disable=subprocess-run-check,missing-function-docstring,no-member
import subprocess
import os
import flask
import flask_socketio
from flask import request, session
from markupsafe import escape
from githubOauth import auth_user, get_user_data, get_user_repos
from githubOauth import get_user_repo_tree, get_user_file_contents
from settings import db, app
from lint import lint_code

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

states = set()
# pylint: disable=wrong-import-position
import models
@app.route('/')
def main():
    session.permanent = True
    return flask.render_template('index.html')


@socketio.on('connect')
def on_connect():
    print(f"{request.sid} connected")
    socketio.emit('test', {'message': 'Server is up!'})


@socketio.on('disconnect')
def on_disconnect():
    print(f"{request.sid} disconnected")
    # user = models.Users.query.filter_by(user_id=escape(session['user_id'])).first()
    # if user is not None:
    #     db.session.delete(user)
    #     db.session.commit()
        
@socketio.on('is logged in')
def on_is_logged_in():
    print(session)
    if 'user_id' in session:
        user_id = escape(session['user_id'])
        print(user_id)
        if models.Users.query.filter_by(user_id=user_id).first() is not None:
            socketio.emit('logged in status', {'logged_in': True, 'user_info': get_user_data(user_id)}, request.sid)
    else:
        socketio.emit('logged in status', {'logged_in': False, 'user_info': None}, request.sid)


@socketio.on('store state')
def on_store_state(data):
    states.add(data['state'])


@socketio.on('auth user')
def on_auth_user(data):
    github_code = data['code']
    state = data['state']
    if state not in states:
        print(f'state: {state} does not match any waiting states')
        socketio.emit(
            'failure',
            {'message': f'state: {state} does not match any waiting states'}, request.sid)
    else:
        auth_user(github_code, state)
        socketio.emit('user data', get_user_data(escape(session['user_id'])), request.sid)


@socketio.on('get repos')
def on_get_repos():
    socketio.emit('repos', get_user_repos(escape(session['user_id'])), request.sid)


@socketio.on('get repo tree')
def on_get_repo_tree(data):
    socketio.emit('repo tree', get_user_repo_tree(escape(session['user_id']),
                                                  data['repo_url'], data['default_branch']), request.sid)
    print(session['user_id'])

@socketio.on('get file contents')
def on_get_file_contents(data):
    print(data["content_url"])
    socketio.emit('file contents',
                  get_user_file_contents(escape(session['user_id']), data['content_url']), request.sid)


@socketio.on('lint')
def code(data):
    res = lint_code(data)
    socketio.emit('output', res, request.sid)
    subprocess.run(['rm', '-r', f'./userfiles/{res["filename"]}'])


if __name__ == '__main__':
    models.db.create_all()
    socketio.run(app,
                 host=os.getenv('IP', '0.0.0.0'),
                 port=int(os.getenv('PORT', '3000')))
