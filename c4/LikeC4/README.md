# NygDev Azure — LikeC4 model

The architecture of the NygDevAzure estate as plain text, rendered as a browsable
site. Derived from `terraform/`, `.github/workflows/` and the two function apps in
this repository.

## Usage

```sh
npm install
npm start          # live preview at http://localhost:5173
npm run build      # static site -> dist/
npm run export:png # PNGs -> png/
```

VS Code: install the recommended `likec4.likec4-vscode` extension for inline previews.

This model is published by `.github/workflows/deploy-likec4.yml`: a push to master
touching `c4/LikeC4/**` runs `likec4 validate`, then `likec4 build`, then uploads
`dist/` to the `$web` container of the `nygdevcdn` storage account.

## How it is organised

The estate is small and the model is arranged around what a reader actually comes
looking for: **three journeys** — one per hostname — plus the plane that builds all
of them.

Nothing is drawn twice at the same level of detail. Where a fact belongs on more
than one page, it is on the most specific one and excluded from the others, with a
comment on the exclusion saying where it went.

```
src/
  _spec.c4              element kinds, their colours, and the tags
  model.c4              what runs, and what talks to what
  delivery.c4           the repo, the four workflows, and the OIDC identity
  views/
    landscape.c4        the whole estate — logical, then deployed
    apex.c4             journey 1 — nygard.dev
    running.c4          journey 2 — run.nygard.dev, and the WHOOP chain
    rpg.c4              journey 3 — rpg.nygard.dev, its infrastructure, its terraform
    delivery.c4         GitHub to Azure
  deployment/
    _spec.c4            deployment node kinds — the Azure containment hierarchy
    deployment.c4       where every element physically sits
```

Colour is set once, on the element kind in `_spec.c4`, rather than per view: a box
is coloured by what it is — a person, a page in a browser, something Azure runs, a
step in the pipeline, something outside the estate — and that holds on every page.
A view overrides colour only when it is making a point.

Each workflow is a single element. What a run does step by step lives in the
element's `description`, not in child elements — steps churn much faster than the
shape of the pipeline, and a diagram of `actions/checkout` teaches nobody anything.
The same rule is broken exactly once, for the two jobs inside `func-nygdev-api`,
because they run on different timers, fail for unrelated reasons and touch
different things, and one box would hide all three facts.

## Views

### Start here

| View | What it answers |
| --- | --- |
| `index` | The whole estate: three front doors and what sits behind them |

### Journey 1 — nygard.dev

| View | What it answers |
| --- | --- |
| `apex` | The apex site, and the Foundry status check its page makes |

### Journey 2 — run.nygard.dev

| View | What it answers |
| --- | --- |
| `running` | The dashboard and everything that feeds it: the two API jobs, WHOOP, the vault, Cosmos and the published blob |
| `runningPipeline` | The same chain as a sequence, in the order it happens |
| `whoopRefresh` | Spending and replacing the rotating refresh token |
| `whoopBootstrap` | The one-time OAuth consent that creates the first token |

### Journey 3 — rpg.nygard.dev

| View | What it answers |
| --- | --- |
| `rpg` | Browser to Caddy to Foundry, and where the media comes from |
| `rpgInfra` | The public IP, subnet and NSG, the VM, and the disk that outlives it |
| `rpgTerraform` | How that machine comes to exist at all |

### The plane that builds it

| View | What it answers |
| --- | --- |
| `delivery` | Which workflow can touch what, and the secretless identity all four go through |
| `azureDeployment` | Every resource group and what is in it |
