# NygDev Azure — LikeC4 model

LikeC4 port of the Structurizr workspace (`c4/Structurizr`), extended with an Azure deployment model derived from `terraform/` and a delivery model derived from `.github/workflows/`.

## Usage

```sh
npm install
npm start          # live preview at http://localhost:5173
npm run build      # static site -> dist/
npm run export:png # PNGs -> png/
```

VS Code: install the recommended `likec4.likec4-vscode` extension for inline previews.

This model is published by `.github/workflows/deploy-likec4.yml`: a push to master touching `c4/LikeC4/**` runs `likec4 validate`, then `likec4 build`, then uploads `dist/` to the `$web` container of the `nygdevcdn` storage account. The `likec4Deploy` view is that pipeline, modelled.

## Layout

- `src/_spec.c4` — element kinds (Azure-flavoured) and tags
- `src/model.c4` — logical model: RPG Server, nygard.dev, CDN, Admin Automation, Placeholder API, Cosmos DB
- `src/model.views.c4` — landscape + container views
- `src/cicd.spec.c4` — element kinds for the delivery plane (repository, workflow, workflow step, Entra app registration, blob container)
- `src/cicd.c4` — the delivery model: the repo, the five workflows, the OIDC identity, and the `$web` / `foundry` containers on `nygdevcdn`
- `src/cicd.views.c4` — delivery views (see below)
- `src/deployment/` — Azure subscription/resource-group deployment model and views, plus the GitHub-hosted runner

## Views

| View | What it answers |
| --- | --- |
| `index` | The whole estate, delivery plane included |
| `delivery` | Every path from this repo into the subscription: triggers, identity, blast radius |
| `likec4Pipeline` | The `Deploy LikeC4` workflow end to end — `.c4` text to `$web` |
| `likec4Deploy` | The same as a dynamic/sequence view, one push followed step by step |
| `oidcTrust` | Why no Azure credential is stored in GitHub |
| `deliveryDeployment` | Where the delivery plane physically runs |
| `azureDeployment` | Resource groups, plans, VNet/VM and storage, as provisioned by terraform |
| `foundryDeployment` | The FoundryVTT chain |
| `rpg`, `cdn` | Container-level views |
