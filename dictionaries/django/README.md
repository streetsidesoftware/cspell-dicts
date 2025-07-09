# CSpell Django Dictionary

Django dictionary for cspell.

This is a pre-built dictionary for use with cspell.

<!--- @@inject: ../../static/requirements.md --->

<!--- @@inject: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Updating

This dictionary is generated from django's official documentation index : https://docs.djangoproject.com/en/`VERSION`/genindex/.
To update it, edit `update.py`to match wanted django's `VERSION`, install requirements ([requests](http://docs.python-requests.org) and [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)) and run the script :

```sh
pip install -r requirements.txt
python update.py
```

## License

WTFPL

<!--- @@inject: ../../static/footer.md --->
