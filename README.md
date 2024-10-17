# Optimum Documentation Hub

### Setup

You need to setup a python virtual environment and then install Poetry. Poetry should always be installed in a dedicated virtual environment to isolate it from the rest of your system.

```
curl -sSL https://install.python-poetry.org | python3 -
```

Then, 

```
poetry install
```

To Run the documentation: 

```
./test.sh
```
### Add New Documentation

You can drop new documentation files under the `docs` folder, documentation files need to be in markdown format in order for Mkdocs to render it properly

### References

Official documentation for Mkdocs Material is [here](https://squidfunk.github.io/mkdocs-material/)
