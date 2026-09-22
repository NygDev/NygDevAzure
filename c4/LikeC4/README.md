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
looking for: **four journeys** — one per thing a person can do, which is one per
hostname except on the training log, where a phone and a desk open on the same
data — plus the plane that builds all of them.

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
    gym.c4              journey 4 — the training log, its sign-in, and one guarded write
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
The same rule is broken exactly once, inside `func-nygdev-integrations`, which is
drawn as two: timers that fire on different schedules and fail for unrelated
reasons, so one box would report either failure as the other. `func-nygdev-api`
used to be drawn as three for the same reason, with the gym routes beside those
timers; the split moved the timers out, and an app with one job in it is just the
app.

`terraform-apply-gymbro.yml` has no element of its own: it is the same
configuration under `-target`, so it can touch nothing `Terraform Apply` cannot, and
what is worth knowing about it is on that element instead.

## Views

### Start here

| View | What it answers |
| --- | --- |
| `index` | The whole estate: five front doors and what sits behind them |

### Journey 1 — nygard.dev

| View | What it answers |
| --- | --- |
| `apex` | The apex site, and the Foundry status check its page makes |

### Journey 2 — run.nygard.dev

| View | What it answers |
| --- | --- |
| `running` | The dashboard and everything that feeds it: the two Integrations jobs, WHOOP, the vault, Cosmos and the published blob |
| `runningPipeline` | The same chain as a sequence, in the order it happens |
| `whoopRefresh` | Spending and replacing the rotating refresh token |
| `whoopBootstrap` | The one-time OAuth consent that creates the first token |

### Journey 3 — rpg.nygard.dev

| View | What it answers |
| --- | --- |
| `rpg` | Browser to Caddy to Foundry, and where the media comes from |
| `rpgInfra` | The public IP, subnet and NSG, the VM, and the disk that outlives it |
| `rpgTerraform` | How that machine comes to exist at all |

### Journey 4 — gym.nygard.dev and gymbro.nygard.dev

| View | What it answers |
| --- | --- |
| `gym` | The logger, the planner, the one registration they share, and what comes from a blob rather than the API |
| `gymSignIn` | How a page ends up holding a token the API accepts, and the two checks Easy Auth makes on it |
| `gymSet` | One logged set, and why sending it twice cannot record it twice |

### The plane that builds it

| View | What it answers |
| --- | --- |
| `delivery` | Which workflow can touch what, and the secretless identity all four go through |
| `azureDeployment` | Every resource group and what is in it |
