friends = ['john', ur'pat', u'gary', r'michael']
for i, name in enumerate(friends):
    print("iteration {iteration} is {name}".format(iteration=i, name=name))


"""
[PEP 3112 -- Bytes literals in Python 3000 | Python.org](https://www.python.org/dev/peps/pep-3112/)
"""

bytes('Hello world', 'ascii')
'Hello world'.encode('ascii')

"""
The proposed syntax is:
"""

b'Hello world'
b"Hello world"

"""
Existing spellings of an 8-bit binary sequence in Python 3000 include:
"""

bytes([0x7f, 0x45, 0x4c, 0x46, 0x01, 0x01, 0x01, 0x00])
bytes('\x7fELF\x01\x01\x01\0', 'latin-1')
'7f454c4601010100'.decode('hex')

"""
The proposed syntax is:
"""

b'\x7f\x45\x4c\x46\x01\x01\x01\x00'
b'\x7fELF\x01\x01\x01\0'

"""
In both cases, the advantages of the new syntax are brevity, some small efficiency gain, and the detection of encoding errors at compile time rather than at runtime.
The brevity benefit is especially felt when using the string-like methods of bytes objects:
"""

lines = bdata.split(bytes('\n', 'ascii'))  # existing syntax
lines = bdata.split(b'\n')  # proposed syntax

"""
And when converting code from Python 2.x to Python 3000:
"""

sok.send('EXIT\r\n')  # Python 2.x
sok.send('EXIT\r\n'.encode('ascii'))  # Python 3000 existing
sok.send(b'EXIT\r\n')  # proposed


a = 'A string'

a = 'A string'  # string literal with single quotes
b = "A string"  # string literal with double quotes
b == a  # there is no difference between these strings

print('Single quoted string with " is no problem')


print('Single quoted string containing \' is OK with backslash')


print("Double quoted string with ' is no problem")

print("Double quoted string containing \" is OK with backslash")

# doctest: +NORMALIZE_WHITESPACE
print('Backslash before "n", as in \n, inserts a new line character')

print(r'Prefixed by "r" the \n no longer inserts a new line')

print('''This string literal
has more than one
line''')

print("""This string literal
also has more than one
line""")


"""
cspell:ignore bdata sok
"""
