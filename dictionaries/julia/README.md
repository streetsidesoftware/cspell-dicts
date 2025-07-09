# CSpell Julia Dictionary

Julia dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

<!--- @@inject: ../../static/requirements.md --->

<!--- @@inject: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Script to export all relevant Base functions

```julia
base_functions = names(Base) .|> string
# We get rid of operators like +, - etc...
filter!(f -> !isnothing(match(r"\w+", f)), base_functions)
open("./src/julia.txt", "w") do io
 println.(io, base_functions)
end;
```

## License

MIT

> Some packages may have other licenses included.

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
