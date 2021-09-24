String literals in Python
A string literal is where you specify the contents of a string in a program.

```py
>>> a = 'A string'
```

Here ‘A string’ is a string literal. The variable a is a string variable, or, better put in Python, a variable that points to a string.

String literals can use single or double quote delimiters.

```py
>>> a = 'A string'  # string literal with single quotes
>>> b = "A string"  # string literal with double quotes
>>> b == a  # there is no difference between these strings
True
```

Literal strings with single quote delimiters can use double quotes inside them without any extra work.

```py
>>> print('Single quoted string with " is no problem')
```

Single quoted string with " is no problem
If you need an actual single quote character inside a literal string delimited by single quotes, you can use the backslash character before the single quote, to tell Python not to terminate the string:

```py
>>> print('Single quoted string containing \' is OK with backslash')
```

Single quoted string containing ' is OK with backslash
Likewise for double quotes:

```py
>>> print("Double quoted string with ' is no problem")
```

Double quoted string with ' is no problem

```py
>>> print("Double quoted string containing \" is OK with backslash")
```

Double quoted string containing " is OK with backslash
Some characters preceded by a backslash have special meaning. For example:

```py
>>> print('Backslash before "n", as in \n, inserts a new line character')  #doctest: +NORMALIZE_WHITESPACE
```

Backslash before "n", as in
, inserts a new line character
If you do not want the backslash to have this special meaning, prefix your string literal with ‘r’, meaning “raw”:

```py
>>> print(r'Prefixed by "r" the \n no longer inserts a new line')
```

Prefixed by "r" the \n no longer inserts a new line
You can use triple quotes to enclose strings with more than one line:

```py
>>> print('''This string literal
... has more than one
... line''')
```

> This string literal
> has more than one
> line
> Triple quotes can use single or double quote marks:

```py
>>> print("""This string literal
... also has more than one
... line""")
```

> This string literal
> also has more than one
> line

<!--- cspell:ignore doctest  -->
