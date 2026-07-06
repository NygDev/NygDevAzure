# NygDev Azure — LikeC4 model

LikeC4 port of the Structurizr workspace (`c4/Structurizr`), extended with an Azure deployment model derived from `terraform/`.

## Usage

```sh
npm install
npm start          # live preview at http://localhost:5173
npm run build      # static site -> dist/
npm run export:png # PNGs -> png/
```

VS Code: install the recommended `likec4.likec4-vscode` extension for inline previews.

## Layout

- `src/_spec.c4` — element kinds (Azure-flavoured) and tags
- `src/model.c4` — logical model: Gym Logger, RPG Server, nygdev.dev, CDN, Admin Automation
- `src/model.views.c4` — landscape + container views
- `src/deployment/` — Azure subscription/resource-group deployment model and views
