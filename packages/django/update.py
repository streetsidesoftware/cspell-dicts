"""
Update django's dictionary using official documentation's index

Set VERSION and FILENAME before running : 

```sh
pip install -r requirements.txt
python update.py
```
"""

from bs4 import BeautifulSoup
import requests

BASE_URL = 'https://docs.djangoproject.com/en/{}/genindex/'
VERSION = '1.11'  # update to match current stable version number
FILENAME = 'django.txt'


def update():
    """
    Update FILENAME contents

    1. get https://docs.djangoproject.com/en/VERSION/genindex/ content
    2. extract all DT tags from the index
    3. cleanup (remove details, links, parenthesis, etc.)
    4. split dotted terms if needed (django.db -> django AND db) 
    5. deduplicate & sort the list
    6. write each words in FILENAME
    """

    fullpage = requests.get(BASE_URL.format(VERSION)).text
    soup = BeautifulSoup(fullpage, 'html.parser')
    data = soup.find('div', role='main')  # ignore the rest of the page

    # init with terms missing from index (mostly closing template tags)
    terms_list = [
        'elif', 'empty', 'endautoescape', 'endblocktrans', 'endcomment',
        'endfor', 'endfilter', 'endif', 'endifequal', 'endifnotequal',
        'endifchanged', 'endspaceless', 'endverbatim', 'endwith', 'openblock',
        'closeblock', 'openvariable', 'closevariable', 'openbrace',
        'closebrace', 'opencomment', 'closecomment'
    ]

    for index_entry in data.find_all('dt'):
        if index_entry.a:
            entry = index_entry.a
        else:
            entry = index_entry
        try:
            # cleanup spaces & parenthesis
            term = entry.string.strip().split(' ', 1)[0].split('(', 1)[0]
        except AttributeError:
            continue
        if term.startswith('--'):  # ignore command line params
            continue
        for word in term.split('.'):
            terms_list.append(word)

    with open(FILENAME, 'w') as output:
        for word in sorted(list(set(terms_list))):
            output.write(word + '\n')

if __name__ == '__main__':
    update()
