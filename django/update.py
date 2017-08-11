"""
Update django's dictionary using official documentation's index

1. get https://docs.djangoproject.com/en/VERSION/genindex/ content
2. extract all DT tags from the index
3. cleanup (remove details, links, parenthesis, etc.)
4. split dotted terms if needed (django.db -> django AND db) 
5. deduplicate & sort the list
6. write each words in FILENAME
"""

from bs4 import BeautifulSoup
import requests

VERSION = '1.11'  # update to match current stable version number
FILENAME = 'django.txt'


fullpage = requests.get('https://docs.djangoproject.com/en/{}/genindex/'.format(VERSION)).text
soup = BeautifulSoup(fullpage, 'html.parser')
data = soup.find('div', role='main')  # ignore the rest of the page

terms_list = []

for index_entry in data.find_all('dt'):
	if index_entry.a:
		entry = index_entry.a
	else:
		entry = index_entry
	try:
		term = entry.string.strip().split(' ', 1)[0].split('(', 1)[0]  # cleanup spaces & parenthesis
	except AttributeError:
		continue
	if term.startswith('--'):  # ignore command line params
		continue
	for word in term.split('.'): 
		terms_list.append(word)

with open(FILENAME, 'w') as output:
	for word in sorted(list(set(terms_list))):
		output.write(word+ '\n')


		



