<!-- markdownlint-disable MD033 -->

# Source Directory

All source files used to generate the dictionary should be stored in this directory.

## [`build.sh`](./build.sh)

K8s dictionary build script.

```sh
./build.sh
```

### Arguments

> **Note**: Type `--help` for more information

| **Name**              | **Description**            | **Default**                                                                                                 | **Values**                                                                                                                          |
| --------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `--definitions <URL>` | K8s definitions URL        | `https://raw.githubusercontent.com/yannh/kubernetes-json-schema/master/master-standalone/_definitions.json` | Any valid URL                                                                                                                       |
| `--disable-color`     | Disable color              | `false`                                                                                                     |
| `--help`              | Show help message and exit |
| `--log-level <LEVEL>` | Logger level               | `info`                                                                                                      | `fatal` Fatal level <br/> `error` Error level <br/> `warn` Warning level <br/> `info` Informational level <br/> `debug` Debug level |
| `--out-file <FILE>`   | Output file                | `words.txt`                                                                                                 | Any valid file                                                                                                                      |
