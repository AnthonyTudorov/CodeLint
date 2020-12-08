import Footer from 'rc-footer';
import React from 'react';
import 'rc-footer/assets/index.css';
import './footer.css';

export default function BottomFooter() {
  return (
    <Footer
      theme="light"
      columns={[
        {
          title: 'About',
          items: [
            {
              title: 'Codelint is a project built on passion. After much discussion among ourselves, we came to the realization that there was a lack of online linting tools available to the public and we wanted to fill that niche. Codelint is an appliction that allows one to lint their code, while also simultaneously linking one\'s own Github profile.  Thus, Codelint was made by programmers for programmers, and our mission is to provide you the best linter there is without paying a single cent. We have made our app flexible. For example, pylint does not support auto fixing, so we used yapf to fix your python code!',
              openExternal: false,
            },
          ],
        },
        {
          title: 'Technologies',
          items: [
            {
              title: 'Python',
              url: 'https://www.python.org/',
              openExternal: true,
            },
            {
              title: 'Flask',
              url: 'https://flask.palletsprojects.com/en/1.1.x/',
              openExternal: true,
            },
            {
              title: 'React.js',
              url: 'https://reactjs.org/',
              openExternal: true,
            },
            {
              title: 'Eslint',
              url: 'https://eslint.org/',
              openExternal: true,
            },
            {
              title: 'PostgreSQL',
              url: 'https://www.postgresql.org/',
              openExternal: true,
            },
            {
              title: 'GitHub',
              url: 'https://github.com/',
              openExternal: true,
            },
          ],
        }]}
      bottom="© 2020 Codelint™"
    />
  );
}
