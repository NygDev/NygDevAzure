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
- `src/model.c4` — logical model: RPG Server, nygard.dev, run.nygard.dev, CDN, Admin Automation, API, Cosmos DB
- `src/model.views.c4` — landscape, top-level data flow + container views
- `src/cicd.spec.c4` — element kinds for the delivery plane (repository, workflow, Entra app registration, blob container)
- `src/cicd.c4` — the delivery model: the repo, the three workflows, the OIDC identity, and the `$web` / `foundry` containers on `nygdevcdn`
- `src/cicd.views.c4` — delivery views (see below)
- `src/deployment/` — Azure subscription/resource-group deployment model and views, plus the GitHub-hosted runner

Each workflow is a single element. What a run does step by step lives in the element's `description`, not in child elements — steps churn much faster than the shape of the pipeline, and a diagram of `actions/checkout` teaches nobody anything.

## Views

| View | What it answers |
| --- | --- |
| `index` | The whole estate, delivery plane included |
| `dataflow` | Top level, both flows on one page: user to website and RPG Server, developer to GitHub to Azure, and what each box runs on |
| `delivery` | Every path from this repo into the subscription: triggers, identity, blast radius |
| `likec4Pipeline` | How `.c4` text reaches `$web` |
| `likec4Deploy` | The same as a dynamic/sequence view, one push followed end to end |
| `oidcTrust` | Why no Azure credential is stored in GitHub |
| `deliveryDeployment` | Where the delivery plane physically runs |
| `azureDeployment` | Resource groups, plans, VNet/VM and storage, as provisioned by terraform |
| `foundryDeployment` | The FoundryVTT chain |
| `rpg`, `cdn` | Container-level views |
| `whoopSync` | The API, WHOOP and Cosmos DB: what the daily sync reads, spends and writes |
| `whoopBootstrap` | The one-time OAuth consent, as a sequence |
| `whoopRefresh` | Spending and replacing the refresh token, as a sequence |
