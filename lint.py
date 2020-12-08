'''This file handles linting for user's code'''
# pylint: disable=subprocess-run-check, missing-function-docstring, no-else-return, unused-argument, broad-except
import subprocess
import os
import re

# get the current script path.
here = os.path.dirname(os.path.realpath(__file__))
SUBDIR = "userfiles"


def make_file(data):
    linter = data['linter']
    code = data['code']
    filename = data['uuid'] + ('.py' if linter == 'pylint' else '.js')

    filepath = os.path.join(here, SUBDIR, filename)
    file = open(filepath, "w")
    file.write(code)
    file.close()

    if linter == 'eslint':
        eslintrc = read_file('config', '.eslintrc.js')
        filepath = os.path.join(here, SUBDIR, f'.{filename}')
        file = open(filepath, "w")
        file.write(eslintrc.replace('STYLEGUIDEHERE', data['styleguide']))
        file.close()

    return {'linter': linter, 'filename': filename}


def lint_code(file, data, fix=False):
    linter = file['linter']
    filename = file['filename']
    styleguide = data['styleguide']
    if linter == 'eslint':
        return eslint(linter, filename, styleguide, fix)
    elif linter == 'pylint':
        return pylint(linter, filename, fix)
    else:
        return pylint(linter, filename, fix)


def eslint(linter, filename, styleguide, fix=False):
    if fix:
        result = subprocess.run([
            'eslint', '-c', f'./userfiles/.{filename}', '-f', 'html', '--fix',
            f'./userfiles/{filename}'
        ],
                                stdout=subprocess.PIPE)
    else:
        result = subprocess.run([
            'eslint', '-c', f'./userfiles/.{filename}', '-f', 'html',
            f'./userfiles/{filename}'
        ],
                                stdout=subprocess.PIPE)
    result = result.stdout.decode("utf-8")
    result = result.replace('style="display:none"',
                            'style="display:table-row"')
    result = re.sub(r'\[\+\].*.js', 'eslint', result)

    file_contents = read_file(SUBDIR, filename)
    return {
        'linter': linter,
        'output': result,
        'filename': filename,
        'file_contents': file_contents
    }


def read_file(location, filename):
    filepath = os.path.join(here, location, filename)
    file = open(filepath, "r")
    return file.read()


def pylint(linter, filename, fix=False):
    if fix:
        subprocess.run(['yapf', '-i', f'./userfiles/{filename}'],
                       stdout=subprocess.PIPE)
    shell_ps = subprocess.Popen(('pylint', f'./userfiles/{filename}'),
                                stdout=subprocess.PIPE)
    result = subprocess.check_output(('pylint-json2html'),
                                     stdin=shell_ps.stdout).decode("utf-8")
    try:
        result = re.sub(r'<h2>Metrics<\/h2>(?s).*', '', result)
        result = re.sub(r'<h1>Pylint report from report.jinja2(?s).+?<\/h3>',
                        '', result)
        result = re.sub(
            r'(<tr>(?s).+?<\/tr>)(?s).+?<td>1<\/td>(?s).+?Module name.+?<\/tr>',
            r'\g<1> ', result)
        result = result.replace("padding: 1em;", "")
    except Exception as error:
        print(error)

    filepath = os.path.join(here, SUBDIR, filename)
    file = open(filepath, "r")
    file_contents = file.read()

    return {
        'linter': linter,
        'output': result,
        'filename': filename,
        'file_contents': file_contents
    }
