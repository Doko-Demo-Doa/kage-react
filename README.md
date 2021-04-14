# Kage

Electron app for slides creation. Powered by [reveal.js](https://revealjs.com/) and [pandoc](https://pandoc.org/).

For Vue prototype, see [kage-vue](https://github.com/Doko-Demo-Doa/kage-vue)

## Installation

1. Clone from Gitlab repository:

```bash
git clone git@gitlab.com:dora-dev/kage-vue.git
```

On Windows, if you are going to use PowerShell 7. Create `.npmrc` at the root folder of the project then put this in:

```bat
script-shell = "C:\\Program Files\\PowerShell\\7\\pwsh.exe"

# Using the CLI
npm config set script-shell = "C:\\Program Files\\PowerShell\\7\\pwsh.exe"
```

## Terminology

- Block: Một khối vật thể của slide, có thể là khối chữ, hình ảnh, video hoặc audio.
