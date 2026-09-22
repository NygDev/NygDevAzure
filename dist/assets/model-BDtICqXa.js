import{n as e,t}from"./internal-GjOScapQ.js";var n=t({_stage:`layouted`,projectId:`nygdev-azure`,project:{id:`nygdev-azure`,title:`NygDev Azure`},specification:{tags:{ci:{color:`rgb(99,102,241)`},"managed-identity":{color:`rgb(7,115,175)`},oidc:{color:`rgb(217,119,6)`},scheduled:{color:`rgb(22,163,74)`},"signed-in":{color:`rgb(147,51,234)`}},elements:{actor:{notation:`Person`,style:{shape:`person`,color:`green`}},"static-web-app":{notation:`Azure Static Web App`,style:{shape:`browser`,icon:`azure:static-apps`,color:`sky`}},webapp:{notation:`Web App (browser)`,style:{shape:`browser`,color:`sky`}},"function-app":{notation:`Azure Function App`,style:{icon:`azure:function-apps`,color:`primary`}},job:{notation:`Job / endpoint group`,style:{color:`primary`,opacity:40}},"cosmos-db":{notation:`Azure Cosmos DB`,style:{shape:`storage`,icon:`azure:azure-cosmos-db`,color:`primary`}},"storage-account":{notation:`Azure Storage Account`,style:{shape:`storage`,icon:`azure:storage-accounts`,color:`primary`,opacity:20}},"blob-container":{notation:`Blob Container`,style:{shape:`storage`,icon:`azure:storage-container`,color:`primary`}},"secret-store":{notation:`Azure Key Vault`,style:{shape:`storage`,icon:`azure:key-vaults`,color:`primary`}},"virtual-machine":{notation:`Azure Virtual Machine`,style:{icon:`azure:virtual-machine`,color:`indigo`,opacity:15}},service:{notation:`Process on a VM`,style:{color:`indigo`}},repository:{notation:`Git Repository`,style:{shape:`storage`,icon:`tech:github`,color:`amber`,opacity:20}},"source-files":{notation:`Source Files (text)`,style:{icon:`tech:git`,color:`amber`}},"ci-platform":{notation:`CI/CD Platform`,style:{icon:`tech:github-actions`,color:`amber`,opacity:15}},"ci-environment":{notation:`CI Environment / Variables`,style:{icon:`tech:github`,color:`amber`}},workflow:{notation:`GitHub Actions Workflow`,style:{icon:`tech:github-actions`,color:`amber`}},"app-registration":{notation:`Entra App Registration`,style:{icon:`azure:app-registrations`,color:`amber`}},"external-system":{notation:`External System`,style:{color:`muted`,opacity:20}},"identity-provider":{notation:`Identity Provider`,style:{icon:`azure:external-identities`,color:`muted`,opacity:15}}},relationships:{},deployments:{internet:{notation:`Internet`,style:{opacity:0}},subscription:{notation:`Azure Subscription`,style:{icon:`azure:subscriptions`,opacity:5}},"resource-group":{notation:`Resource Group`,style:{icon:`azure:resource-groups`,opacity:10}},"service-plan":{notation:`App Service Plan (Flex Consumption)`,style:{icon:`azure:app-service-plans`,opacity:10}},vm:{notation:`Virtual Machine`,style:{icon:`azure:virtual-machine`,opacity:10}},vnet:{notation:`Virtual Network`,style:{icon:`azure:virtual-networks`,opacity:5}},subnet:{notation:`Subnet`,style:{icon:`azure:subnet`,opacity:10}},"public-ip":{notation:`Public IP Address`,style:{icon:`azure:public-ip-addresses`}},"blob-storage":{notation:`Storage Account`,style:{icon:`azure:storage-accounts`,opacity:10}},"storage-container":{notation:`Blob Container`,style:{icon:`azure:storage-container`,opacity:10}},"static-site":{notation:`Static Web App`,style:{icon:`azure:static-apps`}},disk:{notation:`Managed Disk`,style:{icon:`azure:disks`}},"sql-server":{notation:`Azure SQL Server`,style:{icon:`azure:sql-server`}},"key-vault":{notation:`Key Vault`,style:{icon:`azure:key-vaults`}},monitoring:{notation:`Monitoring`,style:{icon:`azure:application-insights`}}},customColors:{}},elements:{github:{notation:`External System`,style:{color:`muted`,opacity:20},technology:`github.com`,description:{txt:`Source of truth and CI/CD control plane for the whole estate`},title:`GitHub`,kind:`external-system`,id:`github`},entra:{notation:`Identity Provider`,style:{icon:`azure:external-identities`,color:`muted`,opacity:15},technology:`External Identities`,description:{txt:`The tenant behind both kinds of token in this estate: the short-lived\r
Azure access tokens the workflows run as, and the bearer tokens a person\r
signs in for on the training log. The registration for the second is\r
declared with journey four in model.c4.`},title:`Microsoft Entra ID`,kind:`identity-provider`,id:`entra`},azurerm:{notation:`External System`,style:{color:`muted`,opacity:20},technology:`management.azure.com`,description:{txt:`The Azure control plane. Terraform and the az CLI both reach the estate through it.`},title:`Azure Resource Manager`,kind:`external-system`,id:`azurerm`},tfstate:{notation:`Azure Storage Account`,style:{shape:`storage`,icon:`azure:storage-accounts`,color:`primary`,opacity:20},technology:`Azure Blob Storage, AzureAD auth`,description:{txt:`nygdevtfstate / tfstate / azure-infrastructure.tfstate in rg-nygdev-data`},title:`Terraform State`,kind:`storage-account`,id:`tfstate`},"github.repo":{notation:`Git Repository`,style:{shape:`storage`,icon:`tech:github`,color:`amber`,opacity:20},technology:`Github`,description:{txt:`Single repository; master is the deploy branch`},title:`NygDevAzure`,kind:`repository`,id:`github.repo`},"github.ghEnv":{notation:`CI Environment / Variables`,style:{icon:`tech:github`,color:`amber`},technology:`GitHub Actions environment`,description:{txt:`AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID,\r
AZURE_KEYVAULT_NAME, AZURE_VM_USERNAME, ENTRA_OWNER_OBJECTID.\r
Identifiers only — no credential is stored here.`},title:`Environment "NygDevAzure"`,kind:`ci-environment`,id:`github.ghEnv`},"github.actions":{notation:`CI/CD Platform`,style:{icon:`tech:github-actions`,color:`amber`,opacity:15},technology:`ubuntu-latest hosted runners`,description:{txt:`Every job declares id-token write and contents read, and\r
authenticates to Azure with azure/login@v3 over OIDC.`},title:`GitHub Actions`,kind:`ci-platform`,id:`github.actions`},"entra.ghOidc":{notation:`Entra App Registration`,style:{icon:`azure:app-registrations`,color:`amber`},technology:`Workload identity federation`,description:{txt:`The AZURE_CLIENT_ID principal. Federated credentials trust\r
token.actions.githubusercontent.com for this repository and the\r
NygDevAzure environment, so there is no client secret to leak.\r
Managed outside terraform — it is the identity terraform runs as,\r
and RBAC on it is the real blast radius of a compromised workflow.`},title:`GitHub deploy identity`,kind:`app-registration`,id:`entra.ghOidc`},"github.repo.srcC4":{notation:`Source Files (text)`,style:{icon:`tech:git`,color:`amber`},technology:`LikeC4 DSL`,description:{txt:`This model — specification, logical model, delivery, deployment and views`},title:`c4/LikeC4/**`,kind:`source-files`,id:`github.repo.srcC4`},"github.repo.srcTf":{notation:`Source Files (text)`,style:{icon:`tech:git`,color:`amber`},technology:`Terraform HCL`,description:{txt:`The Azure estate: resource groups, VNet, VM, storage, Cosmos, function apps, Key Vault`},title:`terraform/**`,kind:`source-files`,id:`github.repo.srcTf`},"github.repo.srcApi":{notation:`Source Files (text)`,style:{icon:`tech:git`,color:`amber`},technology:`C# / .NET 10 isolated worker`,description:{txt:`The WHOOP endpoints, the two timers, the running dashboard build, the gym routes and the GPS upload`},title:`apifunctionapp/**`,kind:`source-files`,id:`github.repo.srcApi`},"github.repo.srcGym":{notation:`Source Files (text)`,style:{icon:`tech:git`,color:`amber`},technology:`JSON, uploaded as blobs`,description:{txt:`The gym exercise library and the built-in day templates — the part of the training log that is the same for every account`},title:`gym/**`,kind:`source-files`,id:`github.repo.srcGym`},"github.repo.srcPs":{notation:`Source Files (text)`,style:{icon:`tech:git`,color:`amber`},technology:`PowerShell 7.4`,description:{txt:`cachecontrol and cachecontrolauto`},title:`psfunctionapp/**`,kind:`source-files`,id:`github.repo.srcPs`},"github.actions.deployC4":{notation:`GitHub Actions Workflow`,style:{icon:`tech:github-actions`,color:`amber`},technology:`deploy-likec4.yml — push to master on c4/LikeC4/**`,description:{txt:`Installs from the lockfile, runs likec4 validate (a broken model\r
fails the run before anything is touched), renders with likec4\r
build, then empties $web and uploads dist/ twice — everything as\r
no-cache, then assets/* again as immutable.\r
\r
Concurrency group deploy-likec4 with cancel-in-progress false,\r
because the delete-then-upload sequence must not interleave.`},title:`Deploy LikeC4`,kind:`workflow`,id:`github.actions.deployC4`},"github.actions.deployApi":{notation:`GitHub Actions Workflow`,style:{icon:`tech:github-actions`,color:`amber`},technology:`deploy-api-function-app.yml — push to master on apifunctionapp/**`,description:{txt:`dotnet publish -c Release, then Azure/functions-action@v1 to func-nygdev-api. A build failure stops the run before Azure is touched.`},title:`Deploy API Function App`,kind:`workflow`,id:`github.actions.deployApi`},"github.actions.deployIntegrations":{notation:`GitHub Actions Workflow`,style:{icon:`tech:github-actions`,color:`amber`},technology:`deploy-integrations-function-app.yml — push to master on integrationsfunctionapp/**`,description:{txt:`The same two steps against func-nygdev-integrations. A second\r
workflow rather than a matrix because the path filters are what\r
decide which app a change redeploys, and one project changing should\r
not restart the other.`},title:`Deploy Integrations Function App`,kind:`workflow`,id:`github.actions.deployIntegrations`},"github.actions.deployFunc":{notation:`GitHub Actions Workflow`,style:{icon:`tech:github-actions`,color:`amber`},technology:`deploy-ps-function-app.yml — push to master on psfunctionapp/**`,description:{txt:`Save-Module bundles Az.Accounts and Az.Storage into the package, then Azure/functions-action@v1 to func-nygdev-azadmin.`},title:`Deploy PS Function App`,kind:`workflow`,id:`github.actions.deployFunc`},"github.actions.tfApply":{notation:`GitHub Actions Workflow`,style:{icon:`tech:github-actions`,color:`amber`},technology:`terraform-apply.yml — workflow_dispatch only`,description:{txt:`Authenticates with ARM_USE_OIDC, fetches the home IP and the SSH\r
public key at run time, then terraform apply -auto-approve.\r
\r
Run by hand rather than on a push: there is no plan step and no\r
approval gate, so dispatching it is the decision point. Everything\r
this configuration manages can be recreated without data loss —\r
the Foundry disk and the Cosmos account are read or adopted, not\r
replaced. State is serialised by a terraform-apply concurrency\r
group.\r
\r
It also uploads the two gym JSON files, which is why editing an\r
exercise is an apply rather than a deploy: the provider notices the\r
checksum change and reuploads the blob.\r
\r
terraform-apply-gymbro.yml is the same configuration run under\r
-target for the planner Static Web App and the API app alone, so a\r
front-end change need not put the VM and the SQL server in its blast\r
radius. It plans before it applies, and it is narrower rather than\r
different — the caveat is that -target excludes dependents, so the\r
two role assignments hanging off the API app are not in its graph.\r
A plan there showing the app or its identity being replaced is the\r
signal to run this one instead.`},title:`Terraform Apply`,kind:`workflow`,id:`github.actions.tfApply`},user:{notation:`Person`,style:{shape:`person`,color:`green`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},title:`Visitor`,kind:`actor`,id:`user`},dev:{notation:`Person`,style:{shape:`person`,color:`green`},description:{txt:`Authors the model, the terraform and the function code, and pushes to master`},title:`Developer`,kind:`actor`,id:`dev`},web:{notation:`Azure Static Web App`,style:{shape:`browser`,icon:`azure:static-apps`,color:`sky`},technology:`Azure Static Web App — Free SKU, westeurope`,description:{txt:`nygdevapex. Links, and the live status of the Foundry server.`},title:`nygard.dev`,kind:`static-web-app`,id:`web`},running:{notation:`Azure Static Web App`,style:{shape:`browser`,icon:`azure:static-apps`,color:`sky`},technology:`Azure Static Web App — Free SKU, westeurope`,description:{txt:`nygdevrun — the running and marathon dashboard. Provisioned empty by\r
terraform; content deployed from the nygdevweb repository.\r
\r
The page holds no logic of its own worth drawing: it fetches one\r
pre-built JSON document from the CDN account and draws the charts in\r
it. Nothing is computed here, and no function is called.`},title:`run.nygard.dev`,kind:`static-web-app`,id:`running`},gym:{notation:`Azure Static Web App`,style:{shape:`browser`,icon:`azure:static-apps`,color:`sky`},technology:`Azure Static Web App — Free SKU, westeurope`,description:{txt:`nygdevgym — GymLog, the training logger. Provisioned empty by terraform;\r
the built React app is deployed from the nygdevweb repository.\r
\r
The first page in the estate that signs anybody in. Everything it shows\r
belongs to one account, so it holds an MSAL client, signs in against\r
Entra as the GymLog registration, and puts the resulting bearer token on\r
every call it makes to the API.\r
\r
It is also the first page that both fetches a blob and calls a function,\r
and the split is deliberate: the exercise library and the built-in day\r
templates are the same for every account, so they are anonymous blobs it\r
reads once and caches, and only what a person wrote goes through the API.`},title:`gym.nygard.dev`,kind:`static-web-app`,id:`gym`},gymbro:{notation:`Azure Static Web App`,style:{shape:`browser`,icon:`azure:static-apps`,color:`sky`},technology:`Azure Static Web App — Free SKU, westeurope`,description:{txt:`nygdevgymbro — the desktop planner for the same training log. A Static\r
Web App of its own rather than a path on the logger, because a Static Web\r
App routes on path only: a second subdomain with different content needs\r
a second resource, which is the same reason there were three already.\r
\r
It shares everything but the layout. Same API, same Cosmos partition,\r
same GymLog registration — Easy Auth checks which client obtained the\r
token, so a planner with a registration of its own would be answered 403\r
rather than given a login of its own. What it adds is a screen wide\r
enough to write a block on and to read a whole one back off.`},title:`gymbro.nygard.dev`,kind:`static-web-app`,id:`gymbro`},rpg:{notation:`Azure Virtual Machine`,style:{icon:`azure:virtual-machine`,color:`indigo`,opacity:15},technology:`Azure Linux VM — Standard_B2s, Ubuntu 26.04 LTS minimal`,description:{txt:`rpg-vm, behind the rpg-pip public IP. Built by terraform and\r
configured by cloud-init; worlds and media live on a separate disk\r
that survives the VM being rebuilt.`},title:`RPG Server`,kind:`virtual-machine`,id:`rpg`},api:{notation:`Azure Function App`,style:{icon:`azure:function-apps`,color:`primary`},technology:`.NET 10 isolated — Flex Consumption`,description:{txt:`func-nygdev-api. The training log and nothing else since the split:\r
blocks, sessions, sets and saved day templates, read and written a tap\r
at a time by the two gym front ends. Runs as id-nygdev-api, which is how\r
it reaches Cosmos without holding a key or a connection string.\r
\r
It used to carry the WHOOP sync and the dashboard build as well, and\r
losing them is what let Easy Auth be enforced here. Those two can\r
present no token — WHOOP redirects a browser to a callback, the phone\r
holds a function key — so while they shared this app the platform gate\r
had to stay off and every gym route refused unauthenticated callers for\r
itself. They are on Integrations now, and the gate is on:\r
require_authentication with Return401, no exempt paths.\r
\r
The route-level check stays regardless, because the two answer different\r
questions. The gate establishes that a token was valid. The check\r
establishes which user it named, and that answer is the Cosmos partition\r
key — read from the platform headers and never from a route, a query\r
string or a body, because it is the whole tenancy boundary.\r
\r
Every write carries the count the client believes the session already\r
holds and applies only while that is still true. So a request whose\r
reply was lost is safe to send again — it answers "already recorded"\r
rather than logging the set twice, which is what makes a one-tap button\r
safe to hammer on gym wifi and what lets the page draw the row before\r
the call returns.`},title:`API`,kind:`function-app`,id:`api`},integrations:{notation:`Azure Function App`,style:{icon:`azure:function-apps`,color:`primary`},technology:`.NET 10 isolated — Flex Consumption`,description:{txt:`func-nygdev-integrations. Everything that feeds the estate from outside\r
it, split off from the API so that app could have its gate turned on.\r
Runs as id-nygdev-integrations, which reaches Cosmos, the vault and the\r
CDN account without holding a key or a connection string.\r
\r
Two jobs on schedules a quarter of an hour apart, drawn apart on\r
purpose: one talks to WHOOP, the other to Cosmos and blob storage, so\r
neither failure is reported as the other. Beside them sits the phone\r
location spool — /api/gps/locations, a push rather than a schedule,\r
writing db/gps.\r
\r
No Easy Auth here, and that is the point of the app rather than an\r
omission. The WHOOP callback has to be reachable by WHOOP, and the rest\r
carry function keys, so there is no token for a gate to validate.`},title:`Integrations`,kind:`function-app`,id:`integrations`},azadmin:{notation:`Azure Function App`,style:{icon:`azure:function-apps`,color:`primary`},technology:`PowerShell 7.4 — Flex Consumption`,description:{txt:`func-nygdev-azadmin. Sets Cache-Control on Foundry media blobs, on demand and on blob-created events.`},title:`Admin Automation`,kind:`function-app`,id:`azadmin`},cosmos:{notation:`Azure Cosmos DB`,style:{shape:`storage`,icon:`azure:azure-cosmos-db`,color:`primary`},technology:`Azure Cosmos DB (NoSQL) — free tier`,description:{txt:`nygdev-cosmos-db / db, one account holding three containers that share\r
nothing but the throughput. Local auth is off, so Entra role assignments\r
are the only way in, and each is scoped to a single container rather than\r
to the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\r
reaches \`primary\` and \`gps\`. So neither app can read what the other\r
writes, which matters most in one direction — \`gym\` is partitioned per\r
user and is the tenancy boundary.\r
\r
\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\r
training log, partitioned on /objectId — the signed-in caller, which is\r
what makes the partition key the tenancy boundary rather than a routing\r
detail. \`gps\` is the phone location spool on /sender, with a three-day\r
TTL.\r
\r
All three are indexed opt-in, /* excluded and only what is filtered on\r
included: /sport_name and /score_state on primary, for the dashboard\r
build reading scored runs; /type and /mesoId on gym, for History and the\r
block map. Excluding is doing the most work on gym, where the sets are\r
the bulk of a document and are never filtered on — which is what keeps a\r
set-tap costing the same on the thirtieth set as on the first.\r
\r
Session consistency, and the training log is what asked for it: log a\r
set, re-read the session, and on Eventual the replica that answers may\r
not hold it yet. On a single-region account it costs the same RU as\r
Eventual.`},title:`Cosmos DB`,kind:`cosmos-db`,id:`cosmos`},keyvault:{notation:`Azure Key Vault`,style:{shape:`storage`,icon:`azure:key-vaults`,color:`primary`},technology:`Azure Key Vault — standard, RBAC data plane`,description:{txt:`nygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\r
hand from the WHOOP developer dashboard, and whoop-token.\r
\r
The second is not configuration. WHOOP rotates the refresh token on\r
every use and the API writes the replacement straight back, so this is\r
where that state lives between calls — which is why the identity holds\r
Secrets Officer here rather than a reader role.\r
\r
Terraform Apply also reads HomeIP from here at run time, and the\r
nygdev-ed25519 SSH public key sits beside it as its own resource.`},title:`Key Vault`,kind:`secret-store`,id:`keyvault`},cdn:{notation:`Azure Storage Account`,style:{shape:`storage`,icon:`azure:storage-accounts`,color:`primary`,opacity:20},technology:`Azure Blob Storage — nygdevcdn`,description:{txt:`One public account serving three unrelated things`},title:`CDN Storage`,kind:`storage-account`,id:`cdn`},whoop:{notation:`External System`,style:{color:`muted`,opacity:20},technology:`WHOOP API v2 — OAuth 2.0 + REST`,description:{txt:`Wearable platform, read-only to us and gated by an authorization code\r
grant. A person consents once and that yields a refresh token; every\r
refresh then rotates it, killing the old one the moment a new one is\r
issued. So the replacement has to be captured and stored, or the\r
integration locks itself out.`},title:`WHOOP`,kind:`external-system`,id:`whoop`},"rpg.client":{notation:`Web App (browser)`,style:{shape:`browser`,color:`sky`},technology:`HTML / JS in the browser`,description:{txt:`The game UI, served by Foundry VTT and running in the player browser`},title:`Foundry Client`,kind:`webapp`,id:`rpg.client`},"rpg.caddy":{notation:`Process on a VM`,style:{color:`indigo`},technology:`Caddy`,description:{txt:`Reverse proxy and TLS termination on 80/443, for rpg.nygard.dev`},title:`Caddy`,kind:`service`,id:`rpg.caddy`},"rpg.foundry":{notation:`Process on a VM`,style:{color:`indigo`},technology:`Node.js, listening on :30000`,description:{txt:`Self-hosted virtual tabletop, running as srv_foundry off the foundrydata disk`},title:`Foundry VTT`,kind:`service`,id:`rpg.foundry`},"integrations.sync":{notation:`Job / endpoint group`,style:{color:`primary`,opacity:40},technology:`Timer + HTTP trigger, one shared gate`,description:{txt:`Walks WHOOP collections into Cosmos. Timer at 00:00, 06:00, 12:00\r
and 18:00 UTC; /api/whoop/sync is the same work on demand, and both\r
go through one runner holding one gate, so a manual call landing on\r
top of the scheduled run stands down rather than racing it.\r
\r
The first runs backfill history newest-first on a time budget, each\r
picking up where the last stopped. Once a collection runs out of\r
history every later run re-reads the last seven days instead —\r
WHOOP filters on start time, and a record it rescored keeps the\r
start it always had, so a "since last sync" query would never see\r
it again.`},title:`WHOOP sync`,kind:`job`,id:`integrations.sync`},"integrations.dashboard":{notation:`Job / endpoint group`,style:{color:`primary`,opacity:40},technology:`Timer + HTTP trigger`,description:{txt:`Rebuilds the running dashboard from whatever is stored: pace by run\r
type, aerobic efficiency, weekly volume, acute:chronic workload,\r
weekly time in zones. Timer at 00:15, 06:15, 12:15 and 18:15 UTC —\r
fifteen minutes behind each sync, but not chained to it.\r
\r
It only needs the sync to have finished, not to have succeeded,\r
because it reads the stored runs rather than that run writes. The\r
build is a pure function of those runs and the day, so a slot that\r
finds nothing new republishes what is already there.\r
\r
/api/running/dashboard is the same build on demand, for a backfill\r
(where rebuilding after every sync call would be waste) or for a\r
change to the arithmetic, which reshapes the whole history.`},title:`Dashboard build`,kind:`job`,id:`integrations.dashboard`},"cdn.foundryMedia":{notation:`Blob Container`,style:{shape:`storage`,icon:`azure:storage-container`,color:`primary`},technology:`Storage Container`,description:{txt:`Foundry VTT media, fetched straight by player browsers`},title:`foundry`,kind:`blob-container`,id:`cdn.foundryMedia`},"cdn.dataContainer":{notation:`Blob Container`,style:{shape:`storage`,icon:`azure:storage-container`,color:`primary`},technology:`Anonymous blob read; the container cannot be listed`,description:{txt:`Three files, published by two different things.\r
\r
marathonprep.json is the built running dashboard, written by the\r
Integrations app and rewritten in place on every build, carrying a five-minute\r
Cache-Control so each rebuild reaches the page well before the next\r
one runs.\r
\r
gym-exercises.json and gym-templates.json are the exercise library and\r
the built-in day templates. They are not written by anything at run\r
time — they are files in the repository that terraform uploads, so\r
editing one is an apply rather than a deploy. They are here rather\r
than in Cosmos because they are identical for every account and change\r
when the app ships: served per account they would cost a function\r
invocation, a token and an RU to hand back the same objects. Cached\r
for a day, which is also the worst case for a new exercise reaching a\r
phone that has already loaded the app.\r
\r
Anonymous read is what lets all three be fetched with no key, no token\r
and no function call in between. The gym fetches deliberately send no\r
Authorization header either: adding one would turn a simple\r
cross-origin GET into a preflight this endpoint has no CORS rule for.`},title:`data`,kind:`blob-container`,id:`cdn.dataContainer`},"cdn.webSite":{notation:`Blob Container`,style:{shape:`storage`,icon:`azure:storage-container`,color:`primary`},technology:`Azure Storage static website hosting`,description:{txt:`This model, rendered by likec4 build and served at the account primary web endpoint`},title:`$web`,kind:`blob-container`,id:`cdn.webSite`},"entra.gymlog":{notation:`Entra App Registration`,style:{icon:`azure:app-registrations`,color:`amber`},technology:`Single-page application platform, no client secret`,description:{txt:`The identity both gym front ends sign in as, and the identity Easy\r
Auth on the API accepts. Both halves of that check name it: the token\r
is minted for GymLog, and it was obtained by GymLog.\r
\r
The second half is the one with consequences. The platform reads the\r
claim naming the client that obtained the token, so a front end given\r
a registration of its own is answered 403 rather than quietly working\r
— which is why the planner signs in as this registration rather than\r
as itself, and why giving it one later is a terraform change and not a\r
front-end one.\r
\r
Managed by hand, and it is the one thing in journey four that no\r
apply can create. Declaring it would mean the azuread provider and a\r
Microsoft Graph application grant on the workflow identity, which is a\r
much wider permission than one registration justifies. What that costs\r
is that the SPA redirect URIs and the exposed scope are portal work;\r
terraform prints them as outputs instead.`},title:`GymLog`,kind:`app-registration`,id:`entra.gymlog`}},relations:{"1uxxodk":{source:{model:`dev`},target:{model:`github.repo`},id:`1uxxodk`,title:`git push (master)`},"19kbw1d":{tags:[`ci`],source:{model:`github.repo.srcC4`},target:{model:`github.actions.deployC4`},id:`19kbw1d`,title:`Change here runs`},qs9thu:{tags:[`ci`],source:{model:`github.repo.srcApi`},target:{model:`github.actions.deployApi`},id:`qs9thu`,title:`Change here runs`},ks8ha:{tags:[`ci`],source:{model:`github.repo.srcPs`},target:{model:`github.actions.deployFunc`},id:`ks8ha`,title:`Change here runs`},oezbcz:{tags:[`ci`],source:{model:`github.repo.srcTf`},target:{model:`github.actions.tfApply`},id:`oezbcz`,title:`Change here is applied by`},azl3wj:{tags:[`ci`],source:{model:`github.repo.srcGym`},target:{model:`github.actions.tfApply`},id:`azl3wj`,title:`Change here is uploaded by`},"158pzxy":{tags:[`ci`],source:{model:`github.ghEnv`},target:{model:`github.actions`},id:`158pzxy`,title:`Supplies tenant, subscription and client ids to`},"14swp36":{tags:[`oidc`],source:{model:`github.actions`},target:{model:`entra.ghOidc`},id:`14swp36`,title:`Presents the runner OIDC token (azure/login@v3)`},"1a6a4e9":{tags:[`oidc`],source:{model:`entra.ghOidc`},target:{model:`github.actions`},id:`1a6a4e9`,title:`Issues a short-lived Azure access token to`},"1gq65y8":{source:{model:`entra.ghOidc`},target:{model:`azurerm`},id:`1gq65y8`,title:`Authorises calls against (RBAC on the subscription)`},wfd92d:{source:{model:`github.actions.deployC4`},target:{model:`cdn.webSite`},id:`wfd92d`,title:`Clears and re-uploads dist/ (az storage blob upload-batch)`},fmo01b:{source:{model:`github.actions.deployApi`},target:{model:`api`},id:`fmo01b`,title:`Deploys the published worker`},vyziuk:{source:{model:`github.actions.deployIntegrations`},target:{model:`integrations`},id:`vyziuk`,title:`Deploys the published worker`},"1m8sdzb":{source:{model:`github.actions.deployFunc`},target:{model:`azadmin`},id:`1m8sdzb`,title:`Deploys the function package`},"1bqc84i":{source:{model:`github.actions.tfApply`},target:{model:`keyvault`},id:`1bqc84i`,title:`Reads HomeIP, and the nygdev-ed25519 public key beside it, at run time`},"1rwdckr":{source:{model:`github.actions.tfApply`},target:{model:`tfstate`},id:`1rwdckr`,title:`Locks and writes state`},d12dc2:{source:{model:`github.actions.tfApply`},target:{model:`azurerm`},id:`d12dc2`,title:`terraform apply -auto-approve`},"182xnuw":{source:{model:`azurerm`},target:{model:`rpg`},id:`182xnuw`,title:`Creates rpg-vm and its NIC, the public IP, the VNet, subnet and NSG, and attaches the foundrydata disk`},"11df4fy":{source:{model:`azurerm`},target:{model:`web`},id:`11df4fy`,title:`Creates the nygdevapex Static Web App`},"1245i5k":{source:{model:`azurerm`},target:{model:`running`},id:`1245i5k`,title:`Creates the nygdevrun Static Web App`},w459vf:{source:{model:`azurerm`},target:{model:`gym`},id:`w459vf`,title:`Creates the nygdevgym Static Web App`},"1rn951":{source:{model:`azurerm`},target:{model:`gymbro`},id:`1rn951`,title:`Creates the nygdevgymbro Static Web App`},"1r24n0y":{source:{model:`azurerm`},target:{model:`api`},id:`1r24n0y`,title:`Creates func-nygdev-api, id-nygdev-api, its Cosmos role assignment, the CORS list naming gym and gymbro under both of their hostnames, and the Easy Auth block that now enforces a token`},"1b74092":{source:{model:`azurerm`},target:{model:`integrations`},id:`1b74092`,title:`Creates func-nygdev-integrations and its own plan — Flex allows one app per plan — plus id-nygdev-integrations, its Cosmos and blob role assignments, and the app settings the WHOOP code reads. Its Key Vault grant is the one thing here terraform cannot make: the apply identity holds no roleAssignments/write on rg-nygdev-security, so that one is granted out of band`},"2uzuk0":{source:{model:`azurerm`},target:{model:`azadmin`},id:`2uzuk0`,title:`Creates func-nygdev-azadmin and its blob role assignment`},"1ulnzvv":{source:{model:`azurerm`},target:{model:`cosmos`},id:`1ulnzvv`,title:`Creates the account, the database, the three containers and their indexing policies`},unwbp9:{source:{model:`azurerm`},target:{model:`cdn.dataContainer`},id:`unwbp9`,title:`Creates the data container and uploads the two gym JSON files (the account around it is read, not owned)`},"4f5yn5":{source:{model:`azurerm`},target:{model:`keyvault`},id:`4f5yn5`,title:`Creates the vault and the SSH public key resource — but none of the secrets`},"5x28p0":{source:{model:`cdn.webSite`},target:{model:`user`},id:`5x28p0`,title:`Serves the rendered diagrams (account primary web endpoint)`},"1esfpcz":{source:{model:`dev`},target:{model:`cdn.webSite`},id:`1esfpcz`,title:`Reviews the rendered model on`},"1lmsese":{source:{model:`user`},target:{model:`web`},id:`1lmsese`,title:`Visits https://nygard.dev`},r653i4:{source:{model:`web`},target:{model:`rpg.caddy`},id:`r653i4`,title:`Polls the Foundry status from the page (GET /api/status)`},yykv63:{source:{model:`user`},target:{model:`running`},id:`yykv63`,title:`Visits https://run.nygard.dev`},ziwldx:{source:{model:`running`},target:{model:`cdn.dataContainer`},id:`ziwldx`,title:`Fetches the built dashboard from the page (GET data/marathonprep.json)`},"1pqr4t6":{tags:[`managed-identity`],source:{model:`integrations.sync`},target:{model:`keyvault`},id:`1pqr4t6`,title:`Reads whoop-clientsecret; reads and rewrites the rotating whoop-token`},"1hjsar6":{tags:[`scheduled`],source:{model:`integrations.sync`},target:{model:`whoop`},id:`1hjsar6`,title:`Refreshes the access token, then pages cycles, sleep, workouts and recovery`},"1nhxbki":{tags:[`managed-identity`],source:{model:`integrations.sync`},target:{model:`cosmos`},id:`1nhxbki`,title:`Upserts each record on its WHOOP id, and one sync cursor per collection`},gm16oi:{tags:[`managed-identity`],source:{model:`integrations.dashboard`},target:{model:`cosmos`},id:`gm16oi`,title:`Queries the scored running workouts back out (the only query in the model)`},"1dvvjn1":{tags:[`managed-identity`],source:{model:`integrations.dashboard`},target:{model:`cdn.dataContainer`},id:`1dvvjn1`,title:`Publishes marathonprep.json (PUT, in place)`},"1radcrl":{source:{model:`user`},target:{model:`integrations`},id:`1radcrl`,title:`Grants WHOOP access, once (GET /api/whoop/authorize)`},tl5krj:{source:{model:`user`},target:{model:`rpg.client`},id:`tl5krj`,title:`Plays at https://rpg.nygard.dev`},wja7lj:{source:{model:`rpg.foundry`},target:{model:`cdn.foundryMedia`},id:`wja7lj`,title:`Holds asset URLs pointing at`},"1bv5zgx":{source:{model:`cdn.foundryMedia`},target:{model:`user`},id:`1bv5zgx`,title:`Serves media straight to the player browser`},"12896j":{tags:[`managed-identity`],source:{model:`azadmin`},target:{model:`cdn.foundryMedia`},id:`12896j`,title:`Sets Cache-Control on blobs`},"65jw9m":{source:{model:`cdn.foundryMedia`},target:{model:`azadmin`},id:`65jw9m`,title:`Blob-created events (Event Grid)`},"1w80116":{source:{model:`user`},target:{model:`gym`},id:`1w80116`,title:`Logs a session at https://gym.nygard.dev`},hgyq9w:{source:{model:`user`},target:{model:`gymbro`},id:`hgyq9w`,title:`Plans a block at https://gymbro.nygard.dev`},"1b5cvss":{source:{model:`gym`},target:{model:`entra.gymlog`},id:`1b5cvss`,title:`Signs in as this registration (MSAL, authorization code with PKCE)`},"57arr6":{source:{model:`gymbro`},target:{model:`entra.gymlog`},id:`57arr6`,title:`Signs in as the same registration, for the same reason`},"10bb0if":{tags:[`signed-in`],source:{model:`gym`},target:{model:`api`},id:`10bb0if`,title:`Reads and writes the training log, one tap at a time`},"1gosi7d":{tags:[`signed-in`],source:{model:`gymbro`},target:{model:`api`},id:`1gosi7d`,title:`Reads and writes the same routes, a whole block at a time`},ra8k0t:{source:{model:`gym`},target:{model:`cdn.dataContainer`},id:`ra8k0t`,title:`Fetches the exercise library and the built-in day templates, once, and caches them`},"5raq03":{source:{model:`gymbro`},target:{model:`cdn.dataContainer`},id:`5raq03`,title:`Fetches the same two files`},"138w9vh":{source:{model:`api`},target:{model:`entra.gymlog`},id:`138w9vh`,title:`Validates the bearer token against this registration, and refuses the request if it does not hold one`},pnn4nb:{tags:[`managed-identity`],source:{model:`api`},target:{model:`cosmos`},id:`pnn4nb`,title:`Reads and writes the blocks, sessions and saved templates in db/gym, under the object id off the token`},"10avaox":{source:{model:`rpg.client`},target:{model:`rpg.caddy`},id:`10avaox`,title:`HTTPS / WSS to rpg.nygard.dev`},m5rxcy:{source:{model:`rpg.caddy`},target:{model:`rpg.foundry`},id:`m5rxcy`,title:`Reverse proxies to :30000`},"7kbqw1":{source:{model:`rpg.foundry`},target:{model:`rpg.client`},id:`7kbqw1`,title:`Serves the game UI and world data`}},globals:{predicates:{},dynamicPredicates:{},styles:{}},views:{apex:{_type:`element`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/apex.c4`,description:{txt:`The whole of journey one. A visitor opens nygard.dev and gets a\r
free-tier Static Web App serving files, plus one live thing on the\r
page: whether the Foundry server is up.\r
\r
That status check is drawn from the site, but it runs in the visitor\r
browser. The free SKU has no linked backend and no proxying, so\r
nothing executes server-side here — the page it served calls Caddy on\r
rpg.nygard.dev cross-origin, and Caddy answers from the Foundry\r
process behind it. If the VM is on its nightly shutdown, this is the\r
call that fails and the page that says so.`},title:`nygard.dev — the apex site`,id:`apex`,autoLayout:{direction:`LR`,nodeSep:100,rankSep:170},notation:{nodes:[{title:`Azure Static Web App`,shape:`browser`,color:`sky`,kinds:[`static-web-app`]},{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Virtual Machine`,shape:`rectangle`,color:`indigo`,kinds:[`virtual-machine`]},{title:`Process on a VM`,shape:`rectangle`,color:`indigo`,kinds:[`service`]}]},hash:`hKMwOilygPZHiF4jOrIc074TwBcPkQ_eQBUN-LCIlQU`,bounds:{x:0,y:0,width:1182,height:600},nodes:[{id:`user`,parent:null,level:0,children:[],inEdges:[],outEdges:[`4agz2j`],title:`Visitor`,modelRef:`user`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],notation:`Person`,kind:`actor`,x:0,y:69,width:366,height:180,labelBBox:{x:18,y:29,width:330,height:119}},{id:`web`,parent:null,level:0,children:[],inEdges:[`4agz2j`],outEdges:[`1ebhhfu`],title:`nygard.dev`,modelRef:`web`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevapex. Links, and the live status of the Foundry server.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:16,y:372,width:333,height:180,labelBBox:{x:46,y:46,width:272,height:85}},{id:`rpg`,parent:null,level:0,children:[`rpg.caddy`,`rpg.foundry`],inEdges:[`1ebhhfu`],outEdges:[],title:`RPG Server`,modelRef:`rpg`,shape:`rectangle`,color:`indigo`,icon:`azure:virtual-machine`,style:{opacity:15,size:`md`},description:{txt:`rpg-vm, behind the rpg-pip public IP. Built by terraform and\r
configured by cloud-init; worlds and media live on a separate disk\r
that survives the VM being rebuilt.`},tags:[],notation:`Azure Virtual Machine`,technology:`Azure Linux VM — Standard_B2s, Ubuntu 26.04 LTS minimal`,kind:`virtual-machine`,depth:1,navigateTo:`rpg`,x:743,y:8,width:431,height:584,labelBBox:{x:6,y:0,width:76,height:15}},{id:`rpg.caddy`,parent:`rpg`,level:1,children:[],inEdges:[`1ebhhfu`],outEdges:[`tnfmbw`],title:`Caddy`,modelRef:`rpg.caddy`,shape:`rectangle`,color:`indigo`,style:{opacity:15,size:`md`},description:{txt:`Reverse proxy and TLS termination on 80/443, for rpg.nygard.dev`},tags:[],notation:`Process on a VM`,technology:`Caddy`,kind:`service`,x:782,y:372,width:351,height:180,labelBBox:{x:19,y:46,width:315,height:85}},{id:`rpg.foundry`,parent:`rpg`,level:1,children:[],inEdges:[`tnfmbw`],outEdges:[],title:`Foundry VTT`,modelRef:`rpg.foundry`,shape:`rectangle`,color:`indigo`,style:{opacity:15,size:`md`},description:{txt:`Self-hosted virtual tabletop, running as srv_foundry off the foundrydata disk`},tags:[],notation:`Process on a VM`,technology:`Node.js, listening on :30000`,kind:`service`,x:798,y:69,width:320,height:180,labelBBox:{x:30,y:46,width:260,height:85}}],edges:[{id:`4agz2j`,parent:null,source:`user`,target:`web`,label:`Visits https://nygard.dev`,relations:[`1lmsese`],color:`gray`,line:`dashed`,head:`normal`,points:[[183,249],[183,285],[183,326],[183,362]],labelBBox:{x:92,y:300,width:153,height:18}},{id:`1ebhhfu`,parent:null,source:`web`,target:`rpg.caddy`,label:`Polls the Foundry status from the page 
(GET /api/status)`,relations:[`r653i4`],color:`gray`,line:`dashed`,head:`normal`,points:[[349,462],[474,462],[644,462],[772,462]],labelBBox:{x:452,y:423,width:244,height:35}},{id:`tnfmbw`,parent:`rpg`,source:`rpg.caddy`,target:`rpg.foundry`,label:`Reverse proxies to :30000`,relations:[`m5rxcy`],color:`gray`,line:`dashed`,head:`normal`,points:[[958,372],[958,337],[958,296],[958,259]],labelBBox:{x:860,y:300,width:167,height:18}}]},delivery:{_type:`element`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/delivery.c4`,description:{txt:`One question: which workflow can touch what. Read it in four columns —\r
the developer and the paths they change, the workflow each path\r
triggers, the identity every one of them authenticates through, and\r
what it is then allowed to reach.\r
\r
Three of the four run on a push to master under a path filter, so\r
editing the matching directory is the whole deploy act. Terraform\r
Apply does not; it is dispatched by hand, because it is the one that\r
can destroy and rebuild a virtual machine.\r
\r
Two paths feed it, which is the answer to a question this page gets\r
asked. The gym exercise library and the built-in day templates are\r
JSON files that terraform uploads to the CDN, so a new exercise ships\r
through an apply rather than through any deploy — there is no pipeline\r
that publishes them, and looking for one is the wrong search.\r
\r
No Azure credential is stored in GitHub. The environment holds\r
identifiers only — tenant, subscription, client id — and the runner\r
mints a signed OIDC token that Entra trades for a short-lived access\r
token. The return leg of that trade is left off so the page stays a\r
left-to-right read; so is what an apply then builds, which is on the\r
journey views and on \`rpgTerraform\`.`},title:`Delivery — GitHub to Azure`,id:`delivery`,autoLayout:{direction:`LR`,nodeSep:100,rankSep:170},notation:{nodes:[{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Function App`,shape:`rectangle`,color:`primary`,kinds:[`function-app`]},{title:`CI Environment / Variables`,shape:`rectangle`,color:`amber`,kinds:[`ci-environment`]},{title:`CI/CD Platform`,shape:`rectangle`,color:`amber`,kinds:[`ci-platform`]},{title:`Entra App Registration`,shape:`rectangle`,color:`amber`,kinds:[`app-registration`]},{title:`External System`,shape:`rectangle`,color:`muted`,kinds:[`external-system`]},{title:`External System`,shape:`rectangle`,color:`primary`,kinds:[`external-system`]},{title:`GitHub Actions Workflow`,shape:`rectangle`,color:`amber`,kinds:[`workflow`]},{title:`Identity Provider`,shape:`rectangle`,color:`muted`,kinds:[`identity-provider`]},{title:`Source Files (text)`,shape:`rectangle`,color:`amber`,kinds:[`source-files`]},{title:`Azure Key Vault`,shape:`storage`,color:`primary`,kinds:[`secret-store`]},{title:`Azure Storage Account`,shape:`storage`,color:`primary`,kinds:[`storage-account`]},{title:`Blob Container`,shape:`storage`,color:`primary`,kinds:[`blob-container`]},{title:`Git Repository`,shape:`storage`,color:`amber`,kinds:[`repository`]}]},hash:`aHHkd01BE3HJWL-GutL07Y26TBbe35wWDQo3BKJQnK4`,bounds:{x:0,y:0,width:3243,height:2164},nodes:[{id:`github`,parent:null,level:0,children:[`github.ghEnv`,`github.repo`,`github.actions`],inEdges:[`gi4fq6`],outEdges:[`1a53c2o`,`1yvzo3m`,`1e5h2dd`,`2l7si1`,`p3tog9`,`1e9erc9`,`11i3ag3`,`1urwsaq`],title:`GitHub`,modelRef:`github`,shape:`rectangle`,color:`muted`,style:{opacity:20,size:`md`},description:{txt:`Source of truth and CI/CD control plane for the whole estate`},tags:[],notation:`External System`,technology:`github.com`,kind:`external-system`,depth:2,x:433,y:235,width:1324,height:1722,labelBBox:{x:6,y:0,width:46,height:15}},{id:`entra`,parent:null,level:0,children:[`entra.ghOidc`],inEdges:[`1a53c2o`],outEdges:[`1oooyf4`],title:`Microsoft Entra ID`,modelRef:`entra`,shape:`rectangle`,color:`muted`,icon:`azure:external-identities`,style:{opacity:15,size:`md`},description:{txt:`The tenant behind both kinds of token in this estate: the short-lived\r
Azure access tokens the workflows run as, and the bearer tokens a person\r
signs in for on the training log. The registration for the second is\r
declared with journey four in model.c4.`},tags:[],notation:`Identity Provider`,technology:`External Identities`,kind:`identity-provider`,depth:1,x:2082,y:1651,width:432,height:265,labelBBox:{x:6,y:0,width:125,height:15}},{id:`dev`,parent:null,level:0,children:[],inEdges:[],outEdges:[`gi4fq6`],title:`Developer`,modelRef:`dev`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Authors the model, the terraform and the function code, and pushes to master`},tags:[],notation:`Person`,kind:`actor`,x:0,y:577,width:320,height:180,labelBBox:{x:23,y:56,width:274,height:65}},{id:`github.ghEnv`,parent:`github`,level:1,children:[],inEdges:[],outEdges:[`4xbth`],title:`Environment "NygDevAzure"`,modelRef:`github.ghEnv`,shape:`rectangle`,color:`amber`,icon:`tech:github`,style:{opacity:15,size:`md`},description:{txt:`AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID,\r
AZURE_KEYVAULT_NAME, AZURE_VM_USERNAME, ENTRA_OWNER_OBJECTID.\r
Identifiers only — no credential is stored here.`},tags:[],notation:`CI Environment / Variables`,technology:`GitHub Actions environment`,kind:`ci-environment`,x:491,y:296,width:415,height:180,labelBBox:{x:46,y:19,width:353,height:139}},{id:`github.repo`,parent:`github`,level:1,children:[`github.repo.srcC4`,`github.repo.srcTf`,`github.repo.srcApi`,`github.repo.srcGym`,`github.repo.srcPs`],inEdges:[`gi4fq6`],outEdges:[`1szkzwm`,`vn2k3d`,`1bj31ie`,`nyhmuw`,`8w35jv`],title:`NygDevAzure`,modelRef:`github.repo`,shape:`storage`,color:`amber`,icon:`tech:github`,style:{opacity:20,size:`md`},description:{txt:`Single repository; master is the deploy branch`},tags:[],notation:`Git Repository`,technology:`Github`,kind:`repository`,depth:1,x:473,y:516,width:451,height:1401,labelBBox:{x:6,y:0,width:88,height:15}},{id:`github.repo.srcC4`,parent:`github.repo`,level:2,children:[],inEdges:[],outEdges:[`1szkzwm`],title:`c4/LikeC4/**`,modelRef:`github.repo.srcC4`,shape:`rectangle`,color:`amber`,icon:`tech:git`,style:{opacity:15,size:`md`},description:{txt:`This model — specification, logical model, delivery, deployment and views`},tags:[],notation:`Source Files (text)`,technology:`LikeC4 DSL`,kind:`source-files`,x:523,y:577,width:351,height:180,labelBBox:{x:46,y:37,width:289,height:103}},{id:`github.repo.srcTf`,parent:`github.repo`,level:2,children:[],inEdges:[],outEdges:[`vn2k3d`],title:`terraform/**`,modelRef:`github.repo.srcTf`,shape:`rectangle`,color:`amber`,icon:`tech:git`,style:{opacity:15,size:`md`},description:{txt:`The Azure estate: resource groups, VNet, VM, storage, Cosmos, function apps, Key Vault`},tags:[],notation:`Source Files (text)`,technology:`Terraform HCL`,kind:`source-files`,x:514,y:1137,width:370,height:180,labelBBox:{x:45,y:37,width:309,height:103}},{id:`github.repo.srcApi`,parent:`github.repo`,level:2,children:[],inEdges:[],outEdges:[`1bj31ie`],title:`apifunctionapp/**`,modelRef:`github.repo.srcApi`,shape:`rectangle`,color:`amber`,icon:`tech:git`,style:{opacity:15,size:`md`},description:{txt:`The WHOOP endpoints, the two timers, the running dashboard build, the gym routes and the GPS upload`},tags:[],notation:`Source Files (text)`,technology:`C# / .NET 10 isolated worker`,kind:`source-files`,x:522,y:1697,width:353,height:180,labelBBox:{x:46,y:28,width:291,height:121}},{id:`github.repo.srcGym`,parent:`github.repo`,level:2,children:[],inEdges:[],outEdges:[`nyhmuw`],title:`gym/**`,modelRef:`github.repo.srcGym`,shape:`rectangle`,color:`amber`,icon:`tech:git`,style:{opacity:15,size:`md`},description:{txt:`The gym exercise library and the built-in day templates — the part of the training log that is the same for every account`},tags:[],notation:`Source Files (text)`,technology:`JSON, uploaded as blobs`,kind:`source-files`,x:528,y:1417,width:341,height:180,labelBBox:{x:46,y:28,width:279,height:121}},{id:`github.repo.srcPs`,parent:`github.repo`,level:2,children:[],inEdges:[],outEdges:[`8w35jv`],title:`psfunctionapp/**`,modelRef:`github.repo.srcPs`,shape:`rectangle`,color:`amber`,icon:`tech:git`,style:{opacity:15,size:`md`},description:{txt:`cachecontrol and cachecontrolauto`},tags:[],notation:`Source Files (text)`,technology:`PowerShell 7.4`,kind:`source-files`,x:521,y:857,width:356,height:180,labelBBox:{x:45,y:55,width:295,height:67}},{id:`github.actions`,parent:`github`,level:1,children:[`github.actions.deployC4`,`github.actions.tfApply`,`github.actions.deployApi`,`github.actions.deployFunc`,`github.actions.deployIntegrations`],inEdges:[`4xbth`,`1szkzwm`,`vn2k3d`,`1bj31ie`,`nyhmuw`,`8w35jv`],outEdges:[`1a53c2o`,`1yvzo3m`,`1e5h2dd`,`2l7si1`,`p3tog9`,`1e9erc9`,`11i3ag3`,`1urwsaq`],title:`GitHub Actions`,modelRef:`github.actions`,shape:`rectangle`,color:`amber`,icon:`tech:github-actions`,style:{opacity:15,size:`md`},description:{txt:`Every job declares id-token write and contents read, and\r
authenticates to Azure with azure/login@v3 over OIDC.`},tags:[],notation:`CI/CD Platform`,technology:`ubuntu-latest hosted runners`,kind:`ci-platform`,depth:1,x:1217,y:516,width:500,height:1401,labelBBox:{x:6,y:0,width:99,height:15}},{id:`github.actions.deployC4`,parent:`github.actions`,level:2,children:[],inEdges:[`1szkzwm`],outEdges:[`1urwsaq`],title:`Deploy LikeC4`,modelRef:`github.actions.deployC4`,shape:`rectangle`,color:`amber`,icon:`tech:github-actions`,style:{opacity:15,size:`md`},description:{txt:`Installs from the lockfile, runs likec4 validate (a broken model\r
fails the run before anything is touched), renders with likec4\r
build, then empties $web and uploads dist/ twice — everything as\r
no-cache, then assets/* again as immutable.\r
\r
Concurrency group deploy-likec4 with cancel-in-progress false,\r
because the delete-then-upload sequence must not interleave.`},tags:[],notation:`GitHub Actions Workflow`,technology:`deploy-likec4.yml — push to master on c4/LikeC4/**`,kind:`workflow`,x:1302,y:577,width:330,height:180,labelBBox:{x:46,y:19,width:269,height:139}},{id:`github.actions.tfApply`,parent:`github.actions`,level:2,children:[],inEdges:[`vn2k3d`,`nyhmuw`],outEdges:[`1yvzo3m`,`1e5h2dd`,`2l7si1`],title:`Terraform Apply`,modelRef:`github.actions.tfApply`,shape:`rectangle`,color:`amber`,icon:`tech:github-actions`,style:{opacity:15,size:`md`},description:{txt:`Authenticates with ARM_USE_OIDC, fetches the home IP and the SSH\r
public key at run time, then terraform apply -auto-approve.\r
\r
Run by hand rather than on a push: there is no plan step and no\r
approval gate, so dispatching it is the decision point. Everything\r
this configuration manages can be recreated without data loss —\r
the Foundry disk and the Cosmos account are read or adopted, not\r
replaced. State is serialised by a terraform-apply concurrency\r
group.\r
\r
It also uploads the two gym JSON files, which is why editing an\r
exercise is an apply rather than a deploy: the provider notices the\r
checksum change and reuploads the blob.\r
\r
terraform-apply-gymbro.yml is the same configuration run under\r
-target for the planner Static Web App and the API app alone, so a\r
front-end change need not put the VM and the SQL server in its blast\r
radius. It plans before it applies, and it is narrower rather than\r
different — the caveat is that -target excludes dependents, so the\r
two role assignments hanging off the API app are not in its graph.\r
A plan there showing the app or its identity being replaced is the\r
signal to run this one instead.`},tags:[],notation:`GitHub Actions Workflow`,technology:`terraform-apply.yml — workflow_dispatch only`,kind:`workflow`,x:1281,y:1137,width:372,height:180,labelBBox:{x:46,y:19,width:310,height:139}},{id:`github.actions.deployApi`,parent:`github.actions`,level:2,children:[],inEdges:[`1bj31ie`],outEdges:[`p3tog9`],title:`Deploy API Function App`,modelRef:`github.actions.deployApi`,shape:`rectangle`,color:`amber`,icon:`tech:github-actions`,style:{opacity:15,size:`md`},description:{txt:`dotnet publish -c Release, then Azure/functions-action@v1 to func-nygdev-api. A build failure stops the run before Azure is touched.`},tags:[],notation:`GitHub Actions Workflow`,technology:`deploy-api-function-app.yml — push to master on apifunctionapp/**`,kind:`workflow`,x:1293,y:1417,width:347,height:180,labelBBox:{x:46,y:19,width:286,height:139}},{id:`github.actions.deployFunc`,parent:`github.actions`,level:2,children:[],inEdges:[`8w35jv`],outEdges:[`11i3ag3`],title:`Deploy PS Function App`,modelRef:`github.actions.deployFunc`,shape:`rectangle`,color:`amber`,icon:`tech:github-actions`,style:{opacity:15,size:`md`},description:{txt:`Save-Module bundles Az.Accounts and Az.Storage into the package, then Azure/functions-action@v1 to func-nygdev-azadmin.`},tags:[],notation:`GitHub Actions Workflow`,technology:`deploy-ps-function-app.yml — push to master on psfunctionapp/**`,kind:`workflow`,x:1274,y:857,width:385,height:180,labelBBox:{x:46,y:28,width:324,height:121}},{id:`github.actions.deployIntegrations`,parent:`github.actions`,level:2,children:[],inEdges:[],outEdges:[`1e9erc9`],title:`Deploy Integrations Function App`,modelRef:`github.actions.deployIntegrations`,shape:`rectangle`,color:`amber`,icon:`tech:github-actions`,style:{opacity:15,size:`md`},description:{txt:`The same two steps against func-nygdev-integrations. A second\r
workflow rather than a matrix because the path filters are what\r
decide which app a change redeploys, and one project changing should\r
not restart the other.`},tags:[],notation:`GitHub Actions Workflow`,technology:`deploy-integrations-function-app.yml — push to master on integrationsfunctionapp/**`,kind:`workflow`,x:1257,y:1697,width:419,height:180,labelBBox:{x:46,y:19,width:358,height:139}},{id:`entra.ghOidc`,parent:`entra`,level:1,children:[],inEdges:[`1a53c2o`],outEdges:[`1oooyf4`],title:`GitHub deploy identity`,modelRef:`entra.ghOidc`,shape:`rectangle`,color:`amber`,icon:`azure:app-registrations`,style:{opacity:15,size:`md`},description:{txt:`The AZURE_CLIENT_ID principal. Federated credentials trust\r
token.actions.githubusercontent.com for this repository and the\r
NygDevAzure environment, so there is no client secret to leak.\r
Managed outside terraform — it is the identity terraform runs as,\r
and RBAC on it is the real blast radius of a compromised workflow.`},tags:[],notation:`Entra App Registration`,technology:`Workload identity federation`,kind:`app-registration`,x:2114,y:1704,width:368,height:180,labelBBox:{x:46,y:19,width:306,height:139}},{id:`cdn`,parent:null,level:0,children:[`cdn.webSite`],inEdges:[`1urwsaq`],outEdges:[],title:`CDN Storage`,modelRef:`cdn`,shape:`storage`,color:`primary`,icon:`azure:storage-accounts`,style:{opacity:20,size:`md`},description:{txt:`One public account serving three unrelated things`},tags:[],notation:`Azure Storage Account`,technology:`Azure Blob Storage — nygdevcdn`,kind:`storage-account`,depth:1,x:2100,y:8,width:396,height:265,labelBBox:{x:6,y:0,width:85,height:15}},{id:`tfstate`,parent:null,level:0,children:[],inEdges:[`1e5h2dd`],outEdges:[],title:`Terraform State`,modelRef:`tfstate`,shape:`storage`,color:`primary`,icon:`azure:storage-accounts`,style:{opacity:20,size:`md`},description:{txt:`nygdevtfstate / tfstate / azure-infrastructure.tfstate in rg-nygdev-data`},tags:[],notation:`Azure Storage Account`,technology:`Azure Blob Storage, AzureAD auth`,kind:`storage-account`,x:2135,y:844,width:325,height:180,labelBBox:{x:47,y:37,width:262,height:103}},{id:`keyvault`,parent:null,level:0,children:[],inEdges:[`2l7si1`],outEdges:[],title:`Key Vault`,modelRef:`keyvault`,shape:`storage`,color:`primary`,icon:`azure:key-vaults`,style:{opacity:15,size:`md`},description:{txt:`nygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\r
hand from the WHOOP developer dashboard, and whoop-token.\r
\r
The second is not configuration. WHOOP rotates the refresh token on\r
every use and the API writes the replacement straight back, so this is\r
where that state lives between calls — which is why the identity holds\r
Secrets Officer here rather than a reader role.\r
\r
Terraform Apply also reads HomeIP from here at run time, and the\r
nygdev-ed25519 SSH public key sits beside it as its own resource.`},tags:[],notation:`Azure Key Vault`,technology:`Azure Key Vault — standard, RBAC data plane`,kind:`secret-store`,x:2118,y:1124,width:360,height:200,labelBBox:{x:46,y:29,width:298,height:139}},{id:`api`,parent:null,level:0,children:[],inEdges:[`p3tog9`],outEdges:[],title:`API`,modelRef:`api`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-api. The training log and nothing else since the split:\r
blocks, sessions, sets and saved day templates, read and written a tap\r
at a time by the two gym front ends. Runs as id-nygdev-api, which is how\r
it reaches Cosmos without holding a key or a connection string.\r
\r
It used to carry the WHOOP sync and the dashboard build as well, and\r
losing them is what let Easy Auth be enforced here. Those two can\r
present no token — WHOOP redirects a browser to a callback, the phone\r
holds a function key — so while they shared this app the platform gate\r
had to stay off and every gym route refused unauthenticated callers for\r
itself. They are on Integrations now, and the gate is on:\r
require_authentication with Return401, no exempt paths.\r
\r
The route-level check stays regardless, because the two answer different\r
questions. The gate establishes that a token was valid. The check\r
establishes which user it named, and that answer is the Cosmos partition\r
key — read from the platform headers and never from a route, a query\r
string or a body, because it is the whole tenancy boundary.\r
\r
Every write carries the count the client believes the session already\r
holds and applies only while that is still true. So a request whose\r
reply was lost is safe to send again — it answers "already recorded"\r
rather than logging the set twice, which is what makes a one-tap button\r
safe to hammer on gym wifi and what lets the page draw the row before\r
the call returns.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,x:2125,y:1424,width:345,height:180,labelBBox:{x:46,y:19,width:284,height:139}},{id:`azadmin`,parent:null,level:0,children:[],inEdges:[`11i3ag3`],outEdges:[],title:`Admin Automation`,modelRef:`azadmin`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-azadmin. Sets Cache-Control on Foundry media blobs, on demand and on blob-created events.`},tags:[],notation:`Azure Function App`,technology:`PowerShell 7.4 — Flex Consumption`,kind:`function-app`,x:2125,y:341,width:345,height:180,labelBBox:{x:46,y:28,width:284,height:121}},{id:`integrations`,parent:null,level:0,children:[],inEdges:[`1e9erc9`],outEdges:[],title:`Integrations`,modelRef:`integrations`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-integrations. Everything that feeds the estate from outside\r
it, split off from the API so that app could have its gate turned on.\r
Runs as id-nygdev-integrations, which reaches Cosmos, the vault and the\r
CDN account without holding a key or a connection string.\r
\r
Two jobs on schedules a quarter of an hour apart, drawn apart on\r
purpose: one talks to WHOOP, the other to Cosmos and blob storage, so\r
neither failure is reported as the other. Beside them sits the phone\r
location spool — /api/gps/locations, a push rather than a schedule,\r
writing db/gps.\r
\r
No Easy Auth here, and that is the point of the app rather than an\r
omission. The WHOOP callback has to be reachable by WHOOP, and the rest\r
carry function keys, so there is no token for a gate to validate.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,x:2123,y:1984,width:350,height:180,labelBBox:{x:46,y:19,width:288,height:139}},{id:`azurerm`,parent:null,level:0,children:[],inEdges:[`1yvzo3m`,`1oooyf4`],outEdges:[],title:`Azure Resource Manager`,modelRef:`azurerm`,shape:`rectangle`,color:`primary`,style:{opacity:20,size:`md`},description:{txt:`The Azure control plane. Terraform and the az CLI both reach the estate through it.`},tags:[],notation:`External System`,technology:`management.azure.com`,kind:`external-system`,x:2895,y:1704,width:347,height:180,labelBBox:{x:19,y:46,width:312,height:85}},{id:`cdn.webSite`,parent:`cdn`,level:1,children:[],inEdges:[`1urwsaq`],outEdges:[],title:`$web`,modelRef:`cdn.webSite`,shape:`storage`,color:`primary`,icon:`azure:storage-container`,style:{opacity:15,size:`md`},description:{txt:`This model, rendered by likec4 build and served at the account primary web endpoint`},tags:[],notation:`Blob Container`,technology:`Azure Storage static website hosting`,kind:`blob-container`,x:2132,y:61,width:332,height:180,labelBBox:{x:46,y:37,width:270,height:103}}],edges:[{id:`1szkzwm`,parent:`github`,source:`github.repo.srcC4`,target:`github.actions.deployC4`,label:`Change here runs`,relations:[`19kbw1d`],color:`gray`,line:`dashed`,head:`normal`,tags:[`ci`],points:[[874,676],[913,678],[953,679],[991,680],[1072,682],[1092,682],[1172,680],[1211,679],[1252,678],[1291,676]],labelBBox:{x:1024,y:658,width:116,height:18}},{id:`vn2k3d`,parent:`github`,source:`github.repo.srcTf`,target:`github.actions.tfApply`,label:`Change here is applied by`,relations:[`oezbcz`],color:`gray`,line:`dashed`,head:`normal`,tags:[`ci`],points:[[884,1227],[1001,1227],[1152,1227],[1271,1227]],labelBBox:{x:998,y:1205,width:167,height:18}},{id:`1bj31ie`,parent:`github`,source:`github.repo.srcApi`,target:`github.actions.deployApi`,label:`Change here runs`,relations:[`qs9thu`],color:`gray`,line:`dashed`,head:`normal`,tags:[`ci`],points:[[875,1723],[997,1678],[1160,1619],[1284,1574]],labelBBox:{x:1024,y:1600,width:116,height:18}},{id:`nyhmuw`,parent:`github`,source:`github.repo.srcGym`,target:`github.actions.tfApply`,label:`Change here is uploaded by`,relations:[`azl3wj`],color:`gray`,line:`dashed`,head:`normal`,tags:[`ci`],points:[[869,1445],[988,1402],[1147,1343],[1272,1298]],labelBBox:{x:992,y:1320,width:179,height:18}},{id:`8w35jv`,parent:`github`,source:`github.repo.srcPs`,target:`github.actions.deployFunc`,label:`Change here runs`,relations:[`ks8ha`],color:`gray`,line:`dashed`,head:`normal`,tags:[`ci`],points:[[877,947],[992,947],[1144,947],[1264,947]],labelBBox:{x:1024,y:925,width:116,height:18}},{id:`1yvzo3m`,parent:null,source:`github.actions.tfApply`,target:`azurerm`,label:`terraform apply -auto-approve`,relations:[`d12dc2`],color:`gray`,line:`dashed`,head:`normal`,points:[[1653,1172],[1693,1152],[1732,1124],[1757,1087],[1769,1069],[1754,1008],[1765,989],[1851,848],[1923,839],[2082,794],[2267,742],[2349,696],[2514,794],[2853,993],[2999,1483],[3048,1694]],labelBBox:{x:2203,y:715,width:189,height:18}},{id:`1oooyf4`,parent:null,source:`entra.ghOidc`,target:`azurerm`,label:`Authorises calls against (RBAC on the 
subscription)`,relations:[`1gq65y8`],color:`gray`,line:`dashed`,head:`normal`,points:[[2482,1794],[2604,1794],[2764,1794],[2886,1794]],labelBBox:{x:2568,y:1755,width:241,height:35}},{id:`1e5h2dd`,parent:null,source:`github.actions.tfApply`,target:`tfstate`,label:`Locks and writes state`,relations:[`1rwdckr`],color:`gray`,line:`dashed`,head:`normal`,points:[[1653,1162],[1794,1112],[1987,1044],[2125,995]],labelBBox:{x:1826,y:1015,width:143,height:18}},{id:`2l7si1`,parent:null,source:`github.actions.tfApply`,target:`keyvault`,label:`Reads HomeIP, and the nygdev-ed25519 
public key beside it, at run time`,relations:[`1bqc84i`],color:`gray`,line:`dashed`,head:`normal`,points:[[1653,1226],[1788,1226],[1971,1225],[2107,1225]],labelBBox:{x:1766,y:1186,width:262,height:35}},{id:`p3tog9`,parent:null,source:`github.actions.deployApi`,target:`api`,label:`Deploys the published worker`,relations:[`fmo01b`],color:`gray`,line:`dashed`,head:`normal`,points:[[1641,1508],[1779,1510],[1974,1511],[2115,1512]],labelBBox:{x:1803,y:1488,width:188,height:18}},{id:`1e9erc9`,parent:null,source:`github.actions.deployIntegrations`,target:`integrations`,label:`Deploys the published worker`,relations:[`vyziuk`],color:`gray`,line:`dashed`,head:`normal`,points:[[1677,1859],[1811,1906],[1984,1966],[2113,2010]],labelBBox:{x:1803,y:1875,width:188,height:18}},{id:`11i3ag3`,parent:null,source:`github.actions.deployFunc`,target:`azadmin`,label:`Deploys the function package`,relations:[`1m8sdzb`],color:`gray`,line:`dashed`,head:`normal`,points:[[1660,890],[1698,870],[1734,843],[1757,807],[1772,785],[1748,589],[1765,568],[1847,465],[1996,434],[2115,426]],labelBBox:{x:1803,y:416,width:188,height:18}},{id:`1urwsaq`,parent:null,source:`github.actions.deployC4`,target:`cdn.webSite`,label:`Clears and re-uploads dist/ (az storage 
blob upload-batch)`,relations:[`wfd92d`],color:`gray`,line:`dashed`,head:`normal`,points:[[1546,577],[1603,516],[1683,438],[1765,383],[1876,309],[2013,250],[2121,210]],labelBBox:{x:1774,y:213,width:245,height:34}},{id:`gi4fq6`,parent:null,source:`dev`,target:`github.repo`,label:`git push (master)`,relations:[`1uxxodk`],color:`gray`,line:`dashed`,head:`normal`,points:[[320,667],[365,667],[414,667],[463,667]],labelBBox:{x:397,y:668,width:109,height:18}},{id:`4xbth`,parent:`github`,source:`github.ghEnv`,target:`github.actions`,label:`Supplies tenant, subscription and client 
ids to`,relations:[`158pzxy`],color:`gray`,line:`dashed`,head:`normal`,tags:[`ci`],points:[[906,462],[999,496],[1109,536],[1207,572]],labelBBox:{x:813,y:520,width:247,height:34}},{id:`1a53c2o`,parent:null,source:`github.actions`,target:`entra.ghOidc`,label:`Presents the runner OIDC token 
(azure/login@v3)`,relations:[`14swp36`],color:`gray`,line:`dashed`,head:`normal`,tags:[`oidc`],points:[[1717,1789],[1841,1790],[1988,1791],[2103,1792]],labelBBox:{x:1710,y:1792,width:204,height:35}}]},gym:{_type:`element`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/gym.c4`,description:{txt:`Journey four, and the first one with a person in it who writes rather\r
than reads. Two front doors open on the same room: the logger is a phone\r
held in one hand with a bar in the other, the planner is the same block\r
on a desk. Behind them there is one API, one Cosmos container and one\r
Entra registration, and that is the whole design rather than a stage it\r
has not grown out of.\r
\r
Both pages fetch from two places, and the split is the interesting part.\r
The exercise library and the built-in day templates are identical for\r
every account, so they are anonymous blobs in the same container the\r
running dashboard is published to — no token, no function call, no RU,\r
cached for a day. Everything a person wrote goes through the API with a\r
bearer token instead, because it is theirs.\r
\r
The registration is drawn because it is load-bearing and because it is\r
the one thing here no terraform apply can create. Easy Auth checks both\r
that the token was minted for GymLog and that it was obtained by GymLog,\r
so the planner signs in as the logger rather than as itself.\r
\`gymSignIn\` is that exchange in order.\r
\r
Only the logger legs to Entra and to the blob are drawn. The planner\r
makes exactly the same sign-in to the same registration and fetches\r
exactly the same two files, and a second arrow for either crossed\r
another to add nothing — the box each one points at says what it is.\r
What the planner does differently is on the arrow it keeps: the same\r
routes, a whole block at a time.\r
\r
What the API does with the token is the whole tenancy boundary: the\r
Entra object id off the validated principal is the Cosmos partition key,\r
and it is never read from a route, a query string or a body.\r
\`gymSet\` is one write, and what a lost reply costs.`},title:`gym.nygard.dev and gymbro.nygard.dev — the training log`,id:`gym`,autoLayout:{direction:`LR`,nodeSep:110,rankSep:150},notation:{nodes:[{title:`Azure Static Web App`,shape:`browser`,color:`sky`,kinds:[`static-web-app`]},{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Function App`,shape:`rectangle`,color:`primary`,kinds:[`function-app`]},{title:`Entra App Registration`,shape:`rectangle`,color:`muted`,kinds:[`app-registration`]},{title:`Identity Provider`,shape:`rectangle`,color:`muted`,kinds:[`identity-provider`]},{title:`Azure Cosmos DB`,shape:`storage`,color:`primary`,kinds:[`cosmos-db`]},{title:`Azure Storage Account`,shape:`storage`,color:`primary`,kinds:[`storage-account`]},{title:`Blob Container`,shape:`storage`,color:`primary`,kinds:[`blob-container`]}]},hash:`IEZCpClv7dbZJP_ePNVRvlo7v9hSYY77baJ7MIABPo0`,bounds:{x:0,y:0,width:1956,height:1207},nodes:[{id:`user`,parent:null,level:0,children:[],inEdges:[],outEdges:[`4ahc08`,`31pcxj`],title:`Visitor`,modelRef:`user`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],notation:`Person`,kind:`actor`,x:0,y:371,width:366,height:180,labelBBox:{x:18,y:29,width:330,height:119}},{id:`@gr1`,parent:null,kind:`@group`,title:`The training log, in two shells`,color:`primary`,shape:`rectangle`,children:[`gym`,`gymbro`],inEdges:[`4ahc08`,`31pcxj`],outEdges:[`rxtcek`,`1swlixt`,`lar5mm`,`bd76uh`],level:0,depth:1,tags:[],style:{border:`dashed`,opacity:15},x:737,y:305,width:455,height:591,labelBBox:{x:6,y:0,width:201,height:15}},{id:`gym`,parent:`@gr1`,level:1,children:[],inEdges:[`4ahc08`],outEdges:[`rxtcek`,`1swlixt`,`bd76uh`],title:`gym.nygard.dev`,modelRef:`gym`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevgym — GymLog, the training logger. Provisioned empty by terraform;\r
the built React app is deployed from the nygdevweb repository.\r
\r
The first page in the estate that signs anybody in. Everything it shows\r
belongs to one account, so it holds an MSAL client, signs in against\r
Entra as the GymLog registration, and puts the resulting bearer token on\r
every call it makes to the API.\r
\r
It is also the first page that both fetches a blob and calls a function,\r
and the split is deliberate: the exercise library and the built-in day\r
templates are the same for every account, so they are anonymous blobs it\r
reads once and caches, and only what a person wrote goes through the API.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:784,y:366,width:360,height:189,labelBBox:{x:46,y:24,width:299,height:139}},{id:`gymbro`,parent:`@gr1`,level:1,children:[],inEdges:[`31pcxj`],outEdges:[`lar5mm`],title:`gymbro.nygard.dev`,modelRef:`gymbro`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevgymbro — the desktop planner for the same training log. A Static\r
Web App of its own rather than a path on the logger, because a Static Web\r
App routes on path only: a second subdomain with different content needs\r
a second resource, which is the same reason there were three already.\r
\r
It shares everything but the layout. Same API, same Cosmos partition,\r
same GymLog registration — Easy Auth checks which client obtained the\r
token, so a planner with a registration of its own would be answered 403\r
rather than given a login of its own. What it adds is a screen wide\r
enough to write a block on and to read a whole one back off.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:776,y:666,width:375,height:189,labelBBox:{x:47,y:24,width:313,height:139}},{id:`entra`,parent:null,level:0,children:[`entra.gymlog`],inEdges:[`rxtcek`],outEdges:[],title:`Microsoft Entra ID`,modelRef:`entra`,shape:`rectangle`,color:`muted`,icon:`azure:external-identities`,style:{opacity:15,size:`md`},description:{txt:`The tenant behind both kinds of token in this estate: the short-lived\r
Azure access tokens the workflows run as, and the bearer tokens a person\r
signs in for on the training log. The registration for the second is\r
declared with journey four in model.c4.`},tags:[],notation:`Identity Provider`,technology:`External Identities`,kind:`identity-provider`,depth:1,x:1541,y:8,width:403,height:265,labelBBox:{x:6,y:0,width:125,height:15}},{id:`cdn`,parent:null,level:0,children:[`cdn.dataContainer`],inEdges:[`bd76uh`],outEdges:[],title:`CDN Storage`,modelRef:`cdn`,shape:`storage`,color:`primary`,icon:`azure:storage-accounts`,style:{opacity:20,size:`md`},description:{txt:`One public account serving three unrelated things`},tags:[],notation:`Azure Storage Account`,technology:`Azure Blob Storage — nygdevcdn`,kind:`storage-account`,depth:1,x:1537,y:298,width:411,height:285,labelBBox:{x:6,y:0,width:85,height:15}},{id:`api`,parent:null,level:0,children:[],inEdges:[`1swlixt`,`lar5mm`],outEdges:[`jb1mak`],title:`API`,modelRef:`api`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-api. The training log and nothing else since the split:\r
blocks, sessions, sets and saved day templates, read and written a tap\r
at a time by the two gym front ends. Runs as id-nygdev-api, which is how\r
it reaches Cosmos without holding a key or a connection string.\r
\r
It used to carry the WHOOP sync and the dashboard build as well, and\r
losing them is what let Easy Auth be enforced here. Those two can\r
present no token — WHOOP redirects a browser to a callback, the phone\r
holds a function key — so while they shared this app the platform gate\r
had to stay off and every gym route refused unauthenticated callers for\r
itself. They are on Integrations now, and the gate is on:\r
require_authentication with Return401, no exempt paths.\r
\r
The route-level check stays regardless, because the two answer different\r
questions. The gate establishes that a token was valid. The check\r
establishes which user it named, and that answer is the Cosmos partition\r
key — read from the platform headers and never from a route, a query\r
string or a body, because it is the whole tenancy boundary.\r
\r
Every write carries the count the client believes the session already\r
holds and applies only while that is still true. So a request whose\r
reply was lost is safe to send again — it answers "already recorded"\r
rather than logging the set twice, which is what makes a one-tap button\r
safe to hammer on gym wifi and what lets the page draw the row before\r
the call returns.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,x:1570,y:661,width:345,height:180,labelBBox:{x:46,y:19,width:284,height:139}},{id:`entra.gymlog`,parent:`entra`,level:1,children:[],inEdges:[`rxtcek`],outEdges:[],title:`GymLog`,modelRef:`entra.gymlog`,shape:`rectangle`,color:`muted`,icon:`azure:app-registrations`,style:{opacity:15,size:`md`},description:{txt:`The identity both gym front ends sign in as, and the identity Easy\r
Auth on the API accepts. Both halves of that check name it: the token\r
is minted for GymLog, and it was obtained by GymLog.\r
\r
The second half is the one with consequences. The platform reads the\r
claim naming the client that obtained the token, so a front end given\r
a registration of its own is answered 403 rather than quietly working\r
— which is why the planner signs in as this registration rather than\r
as itself, and why giving it one later is a terraform change and not a\r
front-end one.\r
\r
Managed by hand, and it is the one thing in journey four that no\r
apply can create. Declaring it would mean the azuread provider and a\r
Microsoft Graph application grant on the workflow identity, which is a\r
much wider permission than one registration justifies. What that costs\r
is that the SPA redirect URIs and the exposed scope are portal work;\r
terraform prints them as outputs instead.`},tags:[],notation:`Entra App Registration`,technology:`Single-page application platform, no client secret`,kind:`app-registration`,x:1573,y:61,width:339,height:180,labelBBox:{x:46,y:19,width:277,height:139}},{id:`cdn.dataContainer`,parent:`cdn`,level:1,children:[],inEdges:[`bd76uh`],outEdges:[],title:`data`,modelRef:`cdn.dataContainer`,shape:`storage`,color:`primary`,icon:`azure:storage-container`,style:{opacity:15,size:`md`},description:{txt:`Three files, published by two different things.\r
\r
marathonprep.json is the built running dashboard, written by the\r
Integrations app and rewritten in place on every build, carrying a five-minute\r
Cache-Control so each rebuild reaches the page well before the next\r
one runs.\r
\r
gym-exercises.json and gym-templates.json are the exercise library and\r
the built-in day templates. They are not written by anything at run\r
time — they are files in the repository that terraform uploads, so\r
editing one is an apply rather than a deploy. They are here rather\r
than in Cosmos because they are identical for every account and change\r
when the app ships: served per account they would cost a function\r
invocation, a token and an RU to hand back the same objects. Cached\r
for a day, which is also the worst case for a new exercise reaching a\r
phone that has already loaded the app.\r
\r
Anonymous read is what lets all three be fetched with no key, no token\r
and no function call in between. The gym fetches deliberately send no\r
Authorization header either: adding one would turn a simple\r
cross-origin GET into a preflight this endpoint has no CORS rule for.`},tags:[],notation:`Blob Container`,technology:`Anonymous blob read; the container cannot be listed`,kind:`blob-container`,x:1570,y:351,width:346,height:200,labelBBox:{x:45,y:29,width:285,height:139}},{id:`cosmos`,parent:null,level:0,children:[],inEdges:[`jb1mak`],outEdges:[],title:`Cosmos DB`,modelRef:`cosmos`,shape:`storage`,color:`primary`,icon:`azure:azure-cosmos-db`,style:{opacity:15,size:`md`},description:{txt:`nygdev-cosmos-db / db, one account holding three containers that share\r
nothing but the throughput. Local auth is off, so Entra role assignments\r
are the only way in, and each is scoped to a single container rather than\r
to the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\r
reaches \`primary\` and \`gps\`. So neither app can read what the other\r
writes, which matters most in one direction — \`gym\` is partitioned per\r
user and is the tenancy boundary.\r
\r
\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\r
training log, partitioned on /objectId — the signed-in caller, which is\r
what makes the partition key the tenancy boundary rather than a routing\r
detail. \`gps\` is the phone location spool on /sender, with a three-day\r
TTL.\r
\r
All three are indexed opt-in, /* excluded and only what is filtered on\r
included: /sport_name and /score_state on primary, for the dashboard\r
build reading scored runs; /type and /mesoId on gym, for History and the\r
block map. Excluding is doing the most work on gym, where the sets are\r
the bulk of a document and are never filtered on — which is what keeps a\r
set-tap costing the same on the thirtieth set as on the first.\r
\r
Session consistency, and the training log is what asked for it: log a\r
set, re-read the session, and on Eventual the replica that answers may\r
not hold it yet. On a single-region account it costs the same RU as\r
Eventual.`},tags:[],notation:`Azure Cosmos DB`,technology:`Azure Cosmos DB (NoSQL) — free tier`,kind:`cosmos-db`,x:1558,y:1007,width:370,height:200,labelBBox:{x:46,y:29,width:308,height:139}}],edges:[{id:`4ahc08`,parent:null,source:`user`,target:`gym`,label:`Logs a session at https://gym.nygard.dev`,relations:[`1w80116`],color:`gray`,line:`dashed`,head:`normal`,points:[[366,461],[488,461],[649,461],[773,461]],labelBBox:{x:442,y:439,width:258,height:18}},{id:`31pcxj`,parent:null,source:`user`,target:`gymbro`,label:`Plans a block at 
https://gymbro.nygard.dev`,relations:[`hgyq9w`],color:`gray`,line:`dashed`,head:`normal`,points:[[366,531],[486,577],[644,638],[767,686]],labelBBox:{x:488,y:528,width:166,height:35}},{id:`rxtcek`,parent:null,source:`gym`,target:`entra.gymlog`,label:`Signs in as this registration (MSAL, 
authorization code with PKCE)`,relations:[`1b5cvss`],color:`gray`,line:`dashed`,head:`normal`,points:[[1144,389],[1270,339],[1438,272],[1563,222]],labelBBox:{x:1244,y:222,width:222,height:34}},{id:`1swlixt`,parent:null,source:`gym`,target:`api`,label:`Reads and writes the training log, one 
tap at a time`,relations:[`10bb0if`],color:`gray`,line:`dashed`,head:`normal`,tags:[`signed-in`],points:[[1144,528],[1269,574],[1435,636],[1560,683]],labelBBox:{x:1235,y:524,width:239,height:35}},{id:`lar5mm`,parent:null,source:`gymbro`,target:`api`,label:`Reads and writes the same routes, a 
whole block at a time`,relations:[`1gosi7d`],color:`gray`,line:`dashed`,head:`normal`,tags:[`signed-in`],points:[[1151,778],[1177,780],[1202,782],[1227,783],[1340,787],[1369,790],[1482,783],[1507,781],[1534,779],[1559,776]],labelBBox:{x:1239,y:744,width:232,height:35}},{id:`jb1mak`,parent:null,source:`api`,target:`cosmos`,label:`Reads and writes the blocks, sessions 
and saved templates in db/gym, under the 
object id off the token`,relations:[`pnn4nb`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[1743,841],[1743,888],[1743,946],[1743,995]],labelBBox:{x:1579,y:897,width:265,height:51}},{id:`bd76uh`,parent:null,source:`gym`,target:`cdn.dataContainer`,label:`Fetches the exercise library and the 
built-in day templates, once, and caches 
them`,relations:[`ra8k0t`],color:`gray`,line:`dashed`,head:`normal`,points:[[1144,459],[1268,457],[1433,455],[1558,453]],labelBBox:{x:1228,y:399,width:254,height:52}}]},gymSignIn:{_type:`dynamic`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/gym.c4`,description:{txt:`How a page ends up holding a token the API will accept, and why there is\r
only one registration in it.\r
\r
Nothing here has a client secret and nothing can: a browser cannot keep\r
one, so the code exchange is PKCE and what makes the flow safe is that\r
the redirect URI is registered and the verifier never left the page. The\r
registration has to be on the Single-page application platform for that\r
— the same URI registered under Web looks identical in the portal and\r
fails at sign-in, because a Web redirect URI makes Entra treat the caller\r
as a confidential client and demand the secret a browser cannot hold.\r
\r
Step seven is where the two checks that matter happen, and they are not\r
the same check. One asks who the token was minted for; the other asks\r
which client obtained it. A front end with a registration of its own\r
passes the first and fails the second, which is exactly why the planner\r
signs in as GymLog and why giving it an identity of its own is a\r
terraform change rather than a front-end one.\r
\r
Step eight is the point of all of it. The object id off the validated\r
principal is the Cosmos partition key, so it decides whose training log\r
the call reads — which is why it is taken from the platform headers and\r
never from anything the request could have said about itself.`},title:`Signing in to the training log`,id:`gymSignIn`,variant:`diagram`,flow:[`step-01`,`step-02`,`step-03`,`step-04`,`step-05`,`step-06`,`step-07`,`step-08`],autoLayout:{direction:`LR`},notation:{nodes:[{title:`Azure Static Web App`,shape:`browser`,color:`sky`,kinds:[`static-web-app`]},{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Function App`,shape:`rectangle`,color:`primary`,kinds:[`function-app`]},{title:`Entra App Registration`,shape:`rectangle`,color:`muted`,kinds:[`app-registration`]},{title:`Azure Cosmos DB`,shape:`storage`,color:`primary`,kinds:[`cosmos-db`]}]},hash:`C3ydZ1bHmhhK0jPKKULBJ5z0jA2Ig9ju9OzclCfnmp4`,sequenceLayout:{actors:[{id:`user`,x:0,y:0,width:366,height:180,ports:[{id:`step-01_source`,cx:183,cy:270,height:40,type:`source`,position:`right`}]},{id:`gym`,x:446,y:-5,width:360,height:189,ports:[{id:`step-01_target`,cx:180,cy:275,height:24,type:`target`,position:`left`},{id:`step-02_source`,cx:180,cy:297,height:40,type:`source`,position:`right`},{id:`step-03_target`,cx:180,cy:414,height:24,type:`target`,position:`right`},{id:`step-04_source`,cx:180,cy:531,height:40,type:`source`,position:`right`},{id:`step-05_target`,cx:180,cy:648,height:24,type:`target`,position:`right`},{id:`step-06_source`,cx:180,cy:765,height:40,type:`source`,position:`right`}]},{id:`entra.gymlog`,x:886,y:0,width:339,height:180,ports:[{id:`step-02_target`,cx:170,cy:292,height:24,type:`target`,position:`left`},{id:`step-03_source`,cx:170,cy:409,height:40,type:`source`,position:`left`},{id:`step-04_target`,cx:170,cy:526,height:24,type:`target`,position:`left`},{id:`step-05_source`,cx:170,cy:643,height:40,type:`source`,position:`left`},{id:`step-07_target`,cx:170,cy:877,height:24,type:`target`,position:`right`}]},{id:`api`,x:1305,y:0,width:345,height:180,ports:[{id:`step-06_target`,cx:173,cy:760,height:24,type:`target`,position:`left`},{id:`step-07_source`,cx:173,cy:877,height:40,type:`source`,position:`left`},{id:`step-08_source`,cx:173,cy:1010,height:40,type:`source`,position:`right`}]},{id:`cosmos`,x:1730,y:-10,width:370,height:200,ports:[{id:`step-08_target`,cx:185,cy:1020,height:24,type:`target`,position:`left`}]}],compounds:[],steps:[{id:`step-01`,sourceHandle:`step-01_source`,targetHandle:`step-01_target`,labelBBox:{width:117,height:29}},{id:`step-02`,sourceHandle:`step-02_source`,targetHandle:`step-02_target`,labelBBox:{width:292,height:43}},{id:`step-03`,sourceHandle:`step-03_source`,targetHandle:`step-03_target`,labelBBox:{width:269,height:43}},{id:`step-04`,sourceHandle:`step-04_source`,targetHandle:`step-04_target`,labelBBox:{width:276,height:43}},{id:`step-05`,sourceHandle:`step-05_source`,targetHandle:`step-05_target`,labelBBox:{width:275,height:43}},{id:`step-06`,sourceHandle:`step-06_source`,targetHandle:`step-06_target`,labelBBox:{width:279,height:43}},{id:`step-07`,sourceHandle:`step-07_source`,targetHandle:`step-07_target`,labelBBox:{width:258,height:59}},{id:`step-08`,sourceHandle:`step-08_source`,targetHandle:`step-08_target`,labelBBox:{width:265,height:60}}],parallelAreas:[],subflows:[],bounds:{x:0,y:0,width:2100,height:1120}},bounds:{x:0,y:0,width:3183,height:467},nodes:[{id:`user`,parent:null,level:0,children:[],inEdges:[],outEdges:[`step-01`],title:`Visitor`,modelRef:`user`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],notation:`Person`,kind:`actor`,x:0,y:145,width:366,height:180,labelBBox:{x:18,y:29,width:330,height:119}},{id:`gym`,parent:null,level:0,children:[],inEdges:[`step-01`,`step-03`,`step-05`],outEdges:[`step-02`,`step-04`,`step-06`],title:`gym.nygard.dev`,modelRef:`gym`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevgym — GymLog, the training logger. Provisioned empty by terraform;\r
the built React app is deployed from the nygdevweb repository.\r
\r
The first page in the estate that signs anybody in. Everything it shows\r
belongs to one account, so it holds an MSAL client, signs in against\r
Entra as the GymLog registration, and puts the resulting bearer token on\r
every call it makes to the API.\r
\r
It is also the first page that both fetches a blob and calls a function,\r
and the split is deliberate: the exercise library and the built-in day\r
templates are the same for every account, so they are anonymous blobs it\r
reads once and caches, and only what a person wrote goes through the API.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:601,y:140,width:360,height:189,labelBBox:{x:46,y:25,width:298,height:138}},{id:`entra.gymlog`,parent:null,level:0,children:[],inEdges:[`step-02`,`step-04`,`step-07`],outEdges:[`step-03`,`step-05`],title:`GymLog`,modelRef:`entra.gymlog`,shape:`rectangle`,color:`muted`,icon:`azure:app-registrations`,style:{opacity:15,size:`md`},description:{txt:`The identity both gym front ends sign in as, and the identity Easy\r
Auth on the API accepts. Both halves of that check name it: the token\r
is minted for GymLog, and it was obtained by GymLog.\r
\r
The second half is the one with consequences. The platform reads the\r
claim naming the client that obtained the token, so a front end given\r
a registration of its own is answered 403 rather than quietly working\r
— which is why the planner signs in as this registration rather than\r
as itself, and why giving it one later is a terraform change and not a\r
front-end one.\r
\r
Managed by hand, and it is the one thing in journey four that no\r
apply can create. Declaring it would mean the azuread provider and a\r
Microsoft Graph application grant on the workflow identity, which is a\r
much wider permission than one registration justifies. What that costs\r
is that the SPA redirect URIs and the exposed scope are portal work;\r
terraform prints them as outputs instead.`},tags:[],notation:`Entra App Registration`,technology:`Single-page application platform, no client secret`,kind:`app-registration`,x:1371,y:187,width:339,height:180,labelBBox:{x:46,y:20,width:277,height:138}},{id:`api`,parent:null,level:0,children:[],inEdges:[`step-06`],outEdges:[`step-07`,`step-08`],title:`API`,modelRef:`api`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-api. The training log and nothing else since the split:\r
blocks, sessions, sets and saved day templates, read and written a tap\r
at a time by the two gym front ends. Runs as id-nygdev-api, which is how\r
it reaches Cosmos without holding a key or a connection string.\r
\r
It used to carry the WHOOP sync and the dashboard build as well, and\r
losing them is what let Easy Auth be enforced here. Those two can\r
present no token — WHOOP redirects a browser to a callback, the phone\r
holds a function key — so while they shared this app the platform gate\r
had to stay off and every gym route refused unauthenticated callers for\r
itself. They are on Integrations now, and the gate is on:\r
require_authentication with Return401, no exempt paths.\r
\r
The route-level check stays regardless, because the two answer different\r
questions. The gate establishes that a token was valid. The check\r
establishes which user it named, and that answer is the Cosmos partition\r
key — read from the platform headers and never from a route, a query\r
string or a body, because it is the whole tenancy boundary.\r
\r
Every write carries the count the client believes the session already\r
holds and applies only while that is still true. So a request whose\r
reply was lost is safe to send again — it answers "already recorded"\r
rather than logging the set twice, which is what makes a one-tap button\r
safe to hammer on gym wifi and what lets the page draw the row before\r
the call returns.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,x:2085,y:32,width:345,height:180,labelBBox:{x:46,y:20,width:284,height:138}},{id:`cosmos`,parent:null,level:0,children:[],inEdges:[`step-08`],outEdges:[],title:`Cosmos DB`,modelRef:`cosmos`,shape:`storage`,color:`primary`,icon:`azure:azure-cosmos-db`,style:{opacity:15,size:`md`},description:{txt:`nygdev-cosmos-db / db, one account holding three containers that share\r
nothing but the throughput. Local auth is off, so Entra role assignments\r
are the only way in, and each is scoped to a single container rather than\r
to the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\r
reaches \`primary\` and \`gps\`. So neither app can read what the other\r
writes, which matters most in one direction — \`gym\` is partitioned per\r
user and is the tenancy boundary.\r
\r
\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\r
training log, partitioned on /objectId — the signed-in caller, which is\r
what makes the partition key the tenancy boundary rather than a routing\r
detail. \`gps\` is the phone location spool on /sender, with a three-day\r
TTL.\r
\r
All three are indexed opt-in, /* excluded and only what is filtered on\r
included: /sport_name and /score_state on primary, for the dashboard\r
build reading scored runs; /type and /mesoId on gym, for History and the\r
block map. Excluding is doing the most work on gym, where the sets are\r
the bulk of a document and are never filtered on — which is what keeps a\r
set-tap costing the same on the thirtieth set as on the first.\r
\r
Session consistency, and the training log is what asked for it: log a\r
set, re-read the session, and on Eventual the replica that answers may\r
not hold it yet. On a single-region account it costs the same RU as\r
Eventual.`},tags:[],notation:`Azure Cosmos DB`,technology:`Azure Cosmos DB (NoSQL) — free tier`,kind:`cosmos-db`,x:2813,y:22,width:370,height:200,labelBBox:{x:46,y:30,width:308,height:138}}],edges:[{id:`step-01`,parent:null,source:`user`,target:`gym`,label:`Taps sign in`,relations:[`1w80116`],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@0`,points:[[366,235],[437,235],[518,235],[590,235]],labelBBox:{x:435,y:203,width:101,height:21}},{id:`step-02`,parent:null,source:`gym`,target:`entra.gymlog`,label:`Redirects to Entra as GymLog: 
authorization code with PKCE, no secret`,relations:[`1b5cvss`],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@1`,points:[[961,195],[1064,178],[1196,167],[1311,188],[1328,191],[1345,196],[1361,201]],labelBBox:{x:1031,y:135,width:276,height:35}},{id:`step-03`,parent:null,source:`entra.gymlog`,target:`gym`,label:`Code back to the bridge page, which 
broadcasts it to the app`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@2`,dir:`back`,points:[[972,257],[989,258],[1005,260],[1021,261],[1138,269],[1270,273],[1371,275]],labelBBox:{x:1042,y:219,width:253,height:35}},{id:`step-04`,parent:null,source:`gym`,target:`entra.gymlog`,label:`Exchanges the code, then asks for an 
access token for the API scope`,relations:[`1b5cvss`],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@3`,points:[[961,328],[981,335],[1001,342],[1021,346],[1147,374],[1184,365],[1311,346],[1328,344],[1344,340],[1361,336]],labelBBox:{x:1039,y:304,width:260,height:35}},{id:`step-05`,parent:null,source:`entra.gymlog`,target:`gym`,label:`An access token: minted for GymLog, 
obtained by GymLog`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@4`,dir:`back`,points:[[873,337],[914,376],[966,416],[1021,436],[1142,480],[1188,474],[1311,436],[1357,422],[1401,395],[1438,367]],labelBBox:{x:1039,y:394,width:259,height:35}},{id:`step-06`,parent:null,source:`gym`,target:`api`,label:`Calls a gym route with the token in the 
Authorization header`,relations:[`10bb0if`],color:`gray`,line:`dashed`,head:`normal`,tags:[`signed-in`],astPath:`/steps@5`,points:[[929,141],[959,126],[990,113],[1021,104],[1385,7],[1831,52],[2075,89]],labelBBox:{x:1412,y:4,width:263,height:35}},{id:`step-07`,parent:null,source:`api`,target:`entra.gymlog`,label:`Easy Auth validates it — signature, 
issuer tenant, audience, and which 
client obtained it`,relations:[`138w9vh`],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@6`,dir:`back`,points:[[1720,239],[1832,214],[1975,184],[2085,160]],labelBBox:{x:1779,y:119,width:242,height:51}},{id:`step-08`,parent:null,source:`api`,target:`cosmos`,label:`The route reads the object id off the 
validated principal, and partitions on 
that`,relations:[`pnn4nb`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@7`,points:[[2431,122],[2542,122],[2686,122],[2802,122]],labelBBox:{x:2500,y:64,width:249,height:52}}]},gymSet:{_type:`dynamic`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/gym.c4`,description:{txt:`One tap, and then the same tap again after the reply went missing. This\r
is the behaviour the whole front end is built on, so it is worth a page.\r
\r
Every write carries the number of sets the page believes the exercise\r
already holds, and the patch applies only while that is still true.\r
Steps one to four are the ordinary case. Five to seven are the same\r
request arriving a second time — a reply lost on gym wifi, a tap\r
repeated, an offline queue replayed on reconnect — and the count no\r
longer matching is what makes it a no-op rather than a second set.\r
\r
Answering that with a 200 rather than an error is the deliberate part.\r
"Already recorded" means the first attempt landed, so the client has\r
nothing to reconcile and no rule to write about which of two replies to\r
believe. That is what makes the one-tap button safe to hammer, and it is\r
also what lets the page draw the row on the tap instead of three hundred\r
milliseconds later: the count the server checks is what makes drawing\r
first safe rather than optimistic.\r
\r
The other outcome is a refusal that says so — the page is stale, nothing\r
was written, and the answer carries what the count actually is so the\r
client re-reads the session and logs again from what it holds.`},title:`Logging a set, and what a lost reply costs`,id:`gymSet`,variant:`diagram`,flow:[`step-01`,`step-02`,`step-03`,`step-04`,`step-05`,`step-06`,`step-07`],autoLayout:{direction:`TB`},notation:{nodes:[{title:`Azure Static Web App`,shape:`browser`,color:`sky`,kinds:[`static-web-app`]},{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Function App`,shape:`rectangle`,color:`primary`,kinds:[`function-app`]},{title:`Azure Cosmos DB`,shape:`storage`,color:`primary`,kinds:[`cosmos-db`]}]},hash:`-lNXsD4Q0jwjjcB8n0dVZsR4AFDDpoC2VpA8LrHe_qU`,sequenceLayout:{actors:[{id:`user`,x:0,y:0,width:366,height:180,ports:[{id:`step-01_source`,cx:183,cy:270,height:40,type:`source`,position:`right`}]},{id:`gym`,x:446,y:-5,width:360,height:189,ports:[{id:`step-01_target`,cx:180,cy:275,height:24,type:`target`,position:`left`},{id:`step-02_source`,cx:180,cy:297,height:40,type:`source`,position:`right`},{id:`step-04_target`,cx:180,cy:436,height:24,type:`target`,position:`right`},{id:`step-05_source`,cx:180,cy:553,height:40,type:`source`,position:`right`},{id:`step-07_target`,cx:180,cy:692,height:24,type:`target`,position:`right`}]},{id:`api`,x:886,y:0,width:345,height:180,ports:[{id:`step-02_target`,cx:173,cy:292,height:24,type:`target`,position:`left`},{id:`step-03_source`,cx:173,cy:314,height:40,type:`source`,position:`right`},{id:`step-04_source`,cx:173,cy:431,height:40,type:`source`,position:`left`},{id:`step-05_target`,cx:173,cy:548,height:24,type:`target`,position:`left`},{id:`step-06_source`,cx:173,cy:570,height:40,type:`source`,position:`right`},{id:`step-07_source`,cx:173,cy:687,height:40,type:`source`,position:`left`}]},{id:`cosmos`,x:1311,y:-10,width:370,height:200,ports:[{id:`step-03_target`,cx:185,cy:324,height:24,type:`target`,position:`left`},{id:`step-06_target`,cx:185,cy:580,height:24,type:`target`,position:`left`}]}],compounds:[],steps:[{id:`step-01`,sourceHandle:`step-01_source`,targetHandle:`step-01_target`,labelBBox:{width:187,height:28}},{id:`step-02`,sourceHandle:`step-02_source`,targetHandle:`step-02_target`,labelBBox:{width:275,height:43}},{id:`step-03`,sourceHandle:`step-03_source`,targetHandle:`step-03_target`,labelBBox:{width:294,height:43}},{id:`step-04`,sourceHandle:`step-04_source`,targetHandle:`step-04_target`,labelBBox:{width:268,height:43}},{id:`step-05`,sourceHandle:`step-05_source`,targetHandle:`step-05_target`,labelBBox:{width:270,height:43}},{id:`step-06`,sourceHandle:`step-06_source`,targetHandle:`step-06_target`,labelBBox:{width:269,height:43}},{id:`step-07`,sourceHandle:`step-07_source`,targetHandle:`step-07_target`,labelBBox:{width:280,height:43}}],parallelAreas:[],subflows:[],bounds:{x:0,y:0,width:1681,height:780}},bounds:{x:0,y:0,width:1290,height:1240},nodes:[{id:`user`,parent:null,level:0,children:[],inEdges:[],outEdges:[`step-01`],title:`Visitor`,modelRef:`user`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],notation:`Person`,kind:`actor`,x:441,y:0,width:366,height:180,labelBBox:{x:18,y:29,width:330,height:119}},{id:`gym`,parent:null,level:0,children:[],inEdges:[`step-01`,`step-04`,`step-07`],outEdges:[`step-02`,`step-05`],title:`gym.nygard.dev`,modelRef:`gym`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevgym — GymLog, the training logger. Provisioned empty by terraform;\r
the built React app is deployed from the nygdevweb repository.\r
\r
The first page in the estate that signs anybody in. Everything it shows\r
belongs to one account, so it holds an MSAL client, signs in against\r
Entra as the GymLog registration, and puts the resulting bearer token on\r
every call it makes to the API.\r
\r
It is also the first page that both fetches a blob and calls a function,\r
and the split is deliberate: the exercise library and the built-in day\r
templates are the same for every account, so they are anonymous blobs it\r
reads once and caches, and only what a person wrote goes through the API.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:444,y:339,width:360,height:189,labelBBox:{x:46,y:24,width:299,height:138}},{id:`api`,parent:null,level:0,children:[],inEdges:[`step-02`,`step-05`],outEdges:[`step-03`,`step-04`,`step-06`,`step-07`],title:`API`,modelRef:`api`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-api. The training log and nothing else since the split:\r
blocks, sessions, sets and saved day templates, read and written a tap\r
at a time by the two gym front ends. Runs as id-nygdev-api, which is how\r
it reaches Cosmos without holding a key or a connection string.\r
\r
It used to carry the WHOOP sync and the dashboard build as well, and\r
losing them is what let Easy Auth be enforced here. Those two can\r
present no token — WHOOP redirects a browser to a callback, the phone\r
holds a function key — so while they shared this app the platform gate\r
had to stay off and every gym route refused unauthenticated callers for\r
itself. They are on Integrations now, and the gate is on:\r
require_authentication with Return401, no exempt paths.\r
\r
The route-level check stays regardless, because the two answer different\r
questions. The gate establishes that a token was valid. The check\r
establishes which user it named, and that answer is the Cosmos partition\r
key — read from the platform headers and never from a route, a query\r
string or a body, because it is the whole tenancy boundary.\r
\r
Every write carries the count the client believes the session already\r
holds and applies only while that is still true. So a request whose\r
reply was lost is safe to send again — it answers "already recorded"\r
rather than logging the set twice, which is what makes a one-tap button\r
safe to hammer on gym wifi and what lets the page draw the row before\r
the call returns.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,x:451,y:694,width:345,height:180,labelBBox:{x:47,y:19,width:283,height:139}},{id:`cosmos`,parent:null,level:0,children:[],inEdges:[`step-03`,`step-06`],outEdges:[],title:`Cosmos DB`,modelRef:`cosmos`,shape:`storage`,color:`primary`,icon:`azure:azure-cosmos-db`,style:{opacity:15,size:`md`},description:{txt:`nygdev-cosmos-db / db, one account holding three containers that share\r
nothing but the throughput. Local auth is off, so Entra role assignments\r
are the only way in, and each is scoped to a single container rather than\r
to the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\r
reaches \`primary\` and \`gps\`. So neither app can read what the other\r
writes, which matters most in one direction — \`gym\` is partitioned per\r
user and is the tenancy boundary.\r
\r
\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\r
training log, partitioned on /objectId — the signed-in caller, which is\r
what makes the partition key the tenancy boundary rather than a routing\r
detail. \`gps\` is the phone location spool on /sender, with a three-day\r
TTL.\r
\r
All three are indexed opt-in, /* excluded and only what is filtered on\r
included: /sport_name and /score_state on primary, for the dashboard\r
build reading scored runs; /type and /mesoId on gym, for History and the\r
block map. Excluding is doing the most work on gym, where the sets are\r
the bulk of a document and are never filtered on — which is what keeps a\r
set-tap costing the same on the thirtieth set as on the first.\r
\r
Session consistency, and the training log is what asked for it: log a\r
set, re-read the session, and on Eventual the replica that answers may\r
not hold it yet. On a single-region account it costs the same RU as\r
Eventual.`},tags:[],notation:`Azure Cosmos DB`,technology:`Azure Cosmos DB (NoSQL) — free tier`,kind:`cosmos-db`,x:439,y:1040,width:370,height:200,labelBBox:{x:46,y:29,width:308,height:139}}],edges:[{id:`step-01`,parent:null,source:`user`,target:`gym`,label:`Taps "Log same again"`,relations:[`1w80116`],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@0`,points:[[624,180],[624,225],[624,281],[624,329]],labelBBox:{x:633,y:247,width:171,height:20}},{id:`step-02`,parent:null,source:`gym`,target:`api`,label:`POSTs the set, carrying the set count 
the page believes the exercise holds`,relations:[`10bb0if`],color:`gray`,line:`dashed`,head:`normal`,tags:[`signed-in`],astPath:`/steps@1`,points:[[444,437],[228,446],[-92,484],[26,634],[77,699],[285,740],[441,762]],labelBBox:{x:35,y:592,width:259,height:35}},{id:`step-03`,parent:null,source:`api`,target:`cosmos`,label:`Patches the session — but only while the 
stored count still matches`,relations:[`pnn4nb`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@2`,points:[[452,872],[431,890],[412,910],[399,934],[378,974],[396,1010],[430,1041]],labelBBox:{x:409,y:938,width:278,height:35}},{id:`step-04`,parent:null,source:`api`,target:`gym`,label:`200: recorded, and the row the page 
already drew is now stored`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@3`,dir:`back`,points:[[437,536],[408,564],[394,598],[413,634],[424,657],[441,677],[461,694]],labelBBox:{x:422,y:592,width:252,height:35}},{id:`step-05`,parent:null,source:`gym`,target:`api`,label:`The reply never arrived, so the same 
request again`,relations:[`10bb0if`],color:`gray`,line:`dashed`,head:`normal`,tags:[`signed-in`],astPath:`/steps@4`,points:[[685,528],[700,561],[709,599],[700,634],[696,651],[690,669],[682,685]],labelBBox:{x:713,y:592,width:254,height:35}},{id:`step-06`,parent:null,source:`api`,target:`cosmos`,label:`The count no longer matches, so the 
patch does not apply`,relations:[`pnn4nb`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@5`,points:[[689,874],[699,893],[709,914],[714,934],[723,966],[716,999],[703,1030]],labelBBox:{x:727,y:938,width:253,height:35}},{id:`step-07`,parent:null,source:`api`,target:`gym`,label:`200 alreadyRecorded: the first attempt 
landed, and nothing was written twice`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@6`,dir:`back`,points:[[815,467],[934,496],[1056,548],[997,634],[952,701],[872,738],[797,758]],labelBBox:{x:1022,y:592,width:264,height:35}}]},index:{_type:`element`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/landscape.c4`,description:{txt:`Everything a visitor can reach, and what sits behind it. Read it as four\r
journeys that share a backend and almost nothing else:\r
\r
nygard.dev is a page of links that polls the game server for its\r
status. run.nygard.dev is a page that draws one JSON file.\r
rpg.nygard.dev is a virtual machine running Foundry VTT. And\r
gym.nygard.dev and gymbro.nygard.dev are two front doors on one\r
training log — a phone and a desk, one API and one Cosmos partition\r
behind them.\r
\r
The depth is behind two of them. The running dashboard is a chain the\r
API runs on a timer: WHOOP into Cosmos, Cosmos into charts, charts into\r
a blob the page fetches directly — \`running\` opens that up and\r
\`runningPipeline\` is the same thing in order. The training log is the\r
other, and what is deep about it is not the shape but the token: it is\r
the only thing here with a caller to authenticate, and \`gym\` is that\r
page.\r
\r
What builds all of this is left out on purpose — see \`delivery\`, and\r
\`rpgTerraform\` for the virtual machine specifically. So is Entra, which\r
both the gym sign-in and every deploy go through; it is on \`gym\` and on\r
\`delivery\` rather than crossing this page twice. So is the one-time\r
WHOOP consent, which is a person clicking through an OAuth screen once\r
and not something any site does; that is \`whoopBootstrap\`.\r
\r
One more leg is left off for readability rather than for altitude: the\r
gym pages also fetch the shipped exercise library and day templates off\r
the CDN account. Both arrows crossed the page to say something the API\r
leg beside them already implies, and both are on \`gym\`. The one blob\r
fetch drawn here is run.nygard.dev, where it is not a detail — it is the\r
only thing that page does.`},title:`The estate — five front doors`,id:`index`,autoLayout:{direction:`LR`,nodeSep:110,rankSep:150},notation:{nodes:[{title:`Azure Static Web App`,shape:`browser`,color:`sky`,kinds:[`static-web-app`]},{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Function App`,shape:`rectangle`,color:`primary`,kinds:[`function-app`]},{title:`Azure Virtual Machine`,shape:`rectangle`,color:`indigo`,kinds:[`virtual-machine`]},{title:`External System`,shape:`rectangle`,color:`muted`,kinds:[`external-system`]},{title:`Azure Cosmos DB`,shape:`storage`,color:`primary`,kinds:[`cosmos-db`]},{title:`Azure Key Vault`,shape:`storage`,color:`primary`,kinds:[`secret-store`]},{title:`Azure Storage Account`,shape:`storage`,color:`primary`,kinds:[`storage-account`]}]},hash:`HHeHcrwj051eVg32xro5gezbGOkL3l0s2PM205hl-wg`,bounds:{x:0,y:0,width:3400,height:2340},nodes:[{id:`user`,parent:null,level:0,children:[],inEdges:[`1qa2qtu`],outEdges:[`4agz2j`,`11x91p8`,`4agvge`,`4ahc08`,`31pcxj`],title:`Visitor`,modelRef:`user`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],notation:`Person`,kind:`actor`,x:0,y:321,width:366,height:180,labelBBox:{x:18,y:29,width:330,height:119}},{id:`integrations`,parent:null,level:0,children:[],inEdges:[],outEdges:[`1a42eq1`,`blokay`,`g0m9f2`,`14djfrc`],title:`Integrations`,modelRef:`integrations`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-integrations. Everything that feeds the estate from outside\r
it, split off from the API so that app could have its gate turned on.\r
Runs as id-nygdev-integrations, which reaches Cosmos, the vault and the\r
CDN account without holding a key or a connection string.\r
\r
Two jobs on schedules a quarter of an hour apart, drawn apart on\r
purpose: one talks to WHOOP, the other to Cosmos and blob storage, so\r
neither failure is reported as the other. Beside them sits the phone\r
location spool — /api/gps/locations, a push rather than a schedule,\r
writing db/gps.\r
\r
No Easy Auth here, and that is the point of the app rather than an\r
omission. The WHOOP callback has to be reachable by WHOOP, and the rest\r
carry function keys, so there is no token for a gate to validate.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,x:8,y:1749,width:350,height:180,labelBBox:{x:46,y:19,width:288,height:139}},{id:`web`,parent:null,level:0,children:[],inEdges:[`4agz2j`],outEdges:[`a0swfz`],title:`nygard.dev`,modelRef:`web`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevapex. Links, and the live status of the Foundry server.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:797,y:194,width:333,height:180,labelBBox:{x:47,y:46,width:271,height:85}},{id:`running`,parent:null,level:0,children:[],inEdges:[`11x91p8`],outEdges:[`3pg95w`],title:`run.nygard.dev`,modelRef:`running`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevrun — the running and marathon dashboard. Provisioned empty by\r
terraform; content deployed from the nygdevweb repository.\r
\r
The page holds no logic of its own worth drawing: it fetches one\r
pre-built JSON document from the CDN account and draws the charts in\r
it. Nothing is computed here, and no function is called.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:789,y:484,width:349,height:189,labelBBox:{x:47,y:24,width:287,height:139}},{id:`gym`,parent:null,level:0,children:[],inEdges:[`4ahc08`],outEdges:[`1swlixt`],title:`gym.nygard.dev`,modelRef:`gym`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevgym — GymLog, the training logger. Provisioned empty by terraform;\r
the built React app is deployed from the nygdevweb repository.\r
\r
The first page in the estate that signs anybody in. Everything it shows\r
belongs to one account, so it holds an MSAL client, signs in against\r
Entra as the GymLog registration, and puts the resulting bearer token on\r
every call it makes to the API.\r
\r
It is also the first page that both fetches a blob and calls a function,\r
and the split is deliberate: the exercise library and the built-in day\r
templates are the same for every account, so they are anonymous blobs it\r
reads once and caches, and only what a person wrote goes through the API.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:784,y:784,width:360,height:189,labelBBox:{x:46,y:24,width:299,height:139}},{id:`gymbro`,parent:null,level:0,children:[],inEdges:[`31pcxj`],outEdges:[`lar5mm`],title:`gymbro.nygard.dev`,modelRef:`gymbro`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevgymbro — the desktop planner for the same training log. A Static\r
Web App of its own rather than a path on the logger, because a Static Web\r
App routes on path only: a second subdomain with different content needs\r
a second resource, which is the same reason there were three already.\r
\r
It shares everything but the layout. Same API, same Cosmos partition,\r
same GymLog registration — Easy Auth checks which client obtained the\r
token, so a planner with a registration of its own would be answered 403\r
rather than given a login of its own. What it adds is a screen wide\r
enough to write a block on and to read a whole one back off.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:776,y:1084,width:375,height:189,labelBBox:{x:47,y:24,width:313,height:139}},{id:`keyvault`,parent:null,level:0,children:[],inEdges:[`blokay`],outEdges:[],title:`Key Vault`,modelRef:`keyvault`,shape:`storage`,color:`primary`,icon:`azure:key-vaults`,style:{opacity:15,size:`md`},description:{txt:`nygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\r
hand from the WHOOP developer dashboard, and whoop-token.\r
\r
The second is not configuration. WHOOP rotates the refresh token on\r
every use and the API writes the replacement straight back, so this is\r
where that state lives between calls — which is why the identity holds\r
Secrets Officer here rather than a reader role.\r
\r
Terraform Apply also reads HomeIP from here at run time, and the\r
nygdev-ed25519 SSH public key sits beside it as its own resource.`},tags:[],notation:`Azure Key Vault`,technology:`Azure Key Vault — standard, RBAC data plane`,kind:`secret-store`,x:2329,y:1850,width:360,height:200,labelBBox:{x:46,y:29,width:298,height:139}},{id:`whoop`,parent:null,level:0,children:[],inEdges:[`14djfrc`],outEdges:[],title:`WHOOP`,modelRef:`whoop`,shape:`rectangle`,color:`muted`,style:{opacity:20,size:`md`},description:{txt:`Wearable platform, read-only to us and gated by an authorization code\r
grant. A person consents once and that yields a refresh token; every\r
refresh then rotates it, killing the old one the moment a new one is\r
issued. So the replacement has to be captured and stored, or the\r
integration locks itself out.`},tags:[],notation:`External System`,technology:`WHOOP API v2 — OAuth 2.0 + REST`,kind:`external-system`,x:2337,y:2160,width:344,height:180,labelBBox:{x:18,y:19,width:308,height:139}},{id:`rpg`,parent:null,level:0,children:[],inEdges:[`4agvge`,`a0swfz`],outEdges:[`s3ixae`],title:`RPG Server`,modelRef:`rpg`,shape:`rectangle`,color:`indigo`,icon:`azure:virtual-machine`,style:{opacity:15,size:`md`},description:{txt:`rpg-vm, behind the rpg-pip public IP. Built by terraform and\r
configured by cloud-init; worlds and media live on a separate disk\r
that survives the VM being rebuilt.`},tags:[],notation:`Azure Virtual Machine`,technology:`Azure Linux VM — Standard_B2s, Ubuntu 26.04 LTS minimal`,kind:`virtual-machine`,navigateTo:`rpg`,x:1558,y:194,width:350,height:180,labelBBox:{x:46,y:19,width:288,height:139}},{id:`api`,parent:null,level:0,children:[],inEdges:[`1swlixt`,`lar5mm`],outEdges:[`jb1mak`],title:`API`,modelRef:`api`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-api. The training log and nothing else since the split:\r
blocks, sessions, sets and saved day templates, read and written a tap\r
at a time by the two gym front ends. Runs as id-nygdev-api, which is how\r
it reaches Cosmos without holding a key or a connection string.\r
\r
It used to carry the WHOOP sync and the dashboard build as well, and\r
losing them is what let Easy Auth be enforced here. Those two can\r
present no token — WHOOP redirects a browser to a callback, the phone\r
holds a function key — so while they shared this app the platform gate\r
had to stay off and every gym route refused unauthenticated callers for\r
itself. They are on Integrations now, and the gate is on:\r
require_authentication with Return401, no exempt paths.\r
\r
The route-level check stays regardless, because the two answer different\r
questions. The gate establishes that a token was valid. The check\r
establishes which user it named, and that answer is the Cosmos partition\r
key — read from the platform headers and never from a route, a query\r
string or a body, because it is the whole tenancy boundary.\r
\r
Every write carries the count the client believes the session already\r
holds and applies only while that is still true. So a request whose\r
reply was lost is safe to send again — it answers "already recorded"\r
rather than logging the set twice, which is what makes a one-tap button\r
safe to hammer on gym wifi and what lets the page draw the row before\r
the call returns.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,x:1560,y:1089,width:345,height:180,labelBBox:{x:46,y:19,width:283,height:139}},{id:`cdn`,parent:null,level:0,children:[],inEdges:[`3pg95w`,`s3ixae`,`g0m9f2`,`1csgmbb`],outEdges:[`1qa2qtu`,`1tc27cn`],title:`CDN Storage`,modelRef:`cdn`,shape:`storage`,color:`primary`,icon:`azure:storage-accounts`,style:{opacity:20,size:`md`},description:{txt:`One public account serving three unrelated things`},tags:[],notation:`Azure Storage Account`,technology:`Azure Blob Storage — nygdevcdn`,kind:`storage-account`,x:2337,y:351,width:343,height:180,labelBBox:{x:47,y:46,width:281,height:85}},{id:`cosmos`,parent:null,level:0,children:[],inEdges:[`jb1mak`,`1a42eq1`],outEdges:[],title:`Cosmos DB`,modelRef:`cosmos`,shape:`storage`,color:`primary`,icon:`azure:azure-cosmos-db`,style:{opacity:15,size:`md`},description:{txt:`nygdev-cosmos-db / db, one account holding three containers that share\r
nothing but the throughput. Local auth is off, so Entra role assignments\r
are the only way in, and each is scoped to a single container rather than\r
to the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\r
reaches \`primary\` and \`gps\`. So neither app can read what the other\r
writes, which matters most in one direction — \`gym\` is partitioned per\r
user and is the tenancy boundary.\r
\r
\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\r
training log, partitioned on /objectId — the signed-in caller, which is\r
what makes the partition key the tenancy boundary rather than a routing\r
detail. \`gps\` is the phone location spool on /sender, with a three-day\r
TTL.\r
\r
All three are indexed opt-in, /* excluded and only what is filtered on\r
included: /sport_name and /score_state on primary, for the dashboard\r
build reading scored runs; /type and /mesoId on gym, for History and the\r
block map. Excluding is doing the most work on gym, where the sets are\r
the bulk of a document and are never filtered on — which is what keeps a\r
set-tap costing the same on the thirtieth set as on the first.\r
\r
Session consistency, and the training log is what asked for it: log a\r
set, re-read the session, and on Eventual the replica that answers may\r
not hold it yet. On a single-region account it costs the same RU as\r
Eventual.`},tags:[],notation:`Azure Cosmos DB`,technology:`Azure Cosmos DB (NoSQL) — free tier`,kind:`cosmos-db`,x:2324,y:1498,width:370,height:200,labelBBox:{x:46,y:29,width:308,height:139}},{id:`azadmin`,parent:null,level:0,children:[],inEdges:[`1tc27cn`],outEdges:[`1csgmbb`],title:`Admin Automation`,modelRef:`azadmin`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-azadmin. Sets Cache-Control on Foundry media blobs, on demand and on blob-created events.`},tags:[],notation:`Azure Function App`,technology:`PowerShell 7.4 — Flex Consumption`,kind:`function-app`,x:3054,y:351,width:345,height:180,labelBBox:{x:46,y:28,width:284,height:121}}],edges:[{id:`4agz2j`,parent:null,source:`user`,target:`web`,label:`Visits https://nygard.dev`,relations:[`1lmsese`],color:`gray`,line:`dashed`,head:`normal`,points:[[366,381],[493,361],[662,333],[787,313]],labelBBox:{x:495,y:307,width:153,height:18}},{id:`11x91p8`,parent:null,source:`user`,target:`running`,label:`Visits https://run.nygard.dev`,relations:[`yykv63`],color:`gray`,line:`dashed`,head:`normal`,points:[[366,450],[490,477],[655,512],[779,539]],labelBBox:{x:483,y:448,width:177,height:18}},{id:`4agvge`,parent:null,source:`user`,target:`rpg`,label:`Plays at https://rpg.nygard.dev`,relations:[`tl5krj`],color:`gray`,line:`dashed`,head:`normal`,points:[[329,321],[445,255],[615,171],[777,139],[1043,86],[1355,158],[1548,218]],labelBBox:{x:868,y:98,width:193,height:18}},{id:`a0swfz`,parent:null,source:`web`,target:`rpg`,label:`Polls the Foundry status from the page 
(GET /api/status)`,relations:[`r653i4`],color:`gray`,line:`dashed`,head:`normal`,points:[[1130,284],[1253,284],[1421,284],[1548,284]],labelBBox:{x:1232,y:245,width:244,height:35}},{id:`4ahc08`,parent:null,source:`user`,target:`gym`,label:`Logs a session at https://gym.nygard.dev`,relations:[`1w80116`],color:`gray`,line:`dashed`,head:`normal`,points:[[329,501],[365,523],[405,548],[441,570],[558,640],[690,719],[792,779]],labelBBox:{x:442,y:548,width:258,height:18}},{id:`31pcxj`,parent:null,source:`user`,target:`gymbro`,label:`Plans a block at 
https://gymbro.nygard.dev`,relations:[`hgyq9w`],color:`gray`,line:`dashed`,head:`normal`,points:[[233,501],[280,582],[356,701],[441,789],[549,902],[691,1006],[801,1078]],labelBBox:{x:488,y:751,width:166,height:35}},{id:`1swlixt`,parent:null,source:`gym`,target:`api`,label:`Reads and writes the training log, one 
tap at a time`,relations:[`10bb0if`],color:`gray`,line:`dashed`,head:`normal`,tags:[`signed-in`],points:[[1144,949],[1266,997],[1428,1060],[1550,1108]],labelBBox:{x:1235,y:946,width:239,height:35}},{id:`lar5mm`,parent:null,source:`gymbro`,target:`api`,label:`Reads and writes the same routes, a 
whole block at a time`,relations:[`1gosi7d`],color:`gray`,line:`dashed`,head:`normal`,tags:[`signed-in`],points:[[1152,1179],[1273,1179],[1429,1179],[1549,1179]],labelBBox:{x:1239,y:1140,width:232,height:35}},{id:`jb1mak`,parent:null,source:`api`,target:`cosmos`,label:`Reads and writes the blocks, sessions 
and saved templates in db/gym, under the 
object id off the token`,relations:[`pnn4nb`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[1900,1269],[2025,1336],[2196,1429],[2325,1499]],labelBBox:{x:1984,y:1259,width:265,height:52}},{id:`1a42eq1`,parent:null,source:`integrations`,target:`cosmos`,label:`[...]`,relations:[`1nhxbki`,`gm16oi`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[358,1802],[386,1797],[414,1792],[441,1788],[1125,1689],[1945,1632],[2313,1609]],labelBBox:{x:1342,y:1647,width:25,height:18}},{id:`blokay`,parent:null,source:`integrations`,target:`keyvault`,label:`Reads whoop-clientsecret; reads and 
rewrites the rotating whoop-token`,relations:[`1pqr4t6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[358,1851],[565,1866],[921,1889],[1227,1904],[1614,1924],[2068,1938],[2318,1945]],labelBBox:{x:1237,y:1866,width:235,height:35}},{id:`3pg95w`,parent:null,source:`running`,target:`cdn`,label:`Fetches the built dashboard from the 
page (GET data/marathonprep.json)`,relations:[`ziwldx`],color:`gray`,line:`dashed`,head:`normal`,points:[[1138,563],[1433,537],[2027,484],[2327,457]],labelBBox:{x:1617,y:458,width:232,height:34}},{id:`s3ixae`,parent:null,source:`rpg`,target:`cdn`,label:`Holds asset URLs pointing at`,relations:[`wja7lj`],color:`gray`,line:`dashed`,head:`normal`,points:[[1907,319],[2032,344],[2200,378],[2327,404]],labelBBox:{x:2024,y:313,width:185,height:18}},{id:`g0m9f2`,parent:null,source:`integrations`,target:`cdn`,label:`Publishes marathonprep.json (PUT, in 
place)`,relations:[`1dvvjn1`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[320,1749],[358,1727],[400,1704],[441,1688],[1063,1434],[1357,1708],[1908,1324],[2199,1121],[2391,726],[2469,541]],labelBBox:{x:1234,y:1483,width:241,height:35}},{id:`1qa2qtu`,parent:null,source:`cdn`,target:`user`,label:`Serves media straight to the player 
browser`,relations:[`1bv5zgx`],color:`gray`,line:`dashed`,head:`normal`,points:[[2375,354],[2257,282],[2078,185],[1908,139],[1421,8],[1279,31],[777,71],[626,83],[574,53],[441,125],[360,169],[292,248],[246,312]],labelBBox:{x:1244,y:1,width:220,height:35}},{id:`1tc27cn`,parent:null,source:`cdn`,target:`azadmin`,label:`Blob-created events (Event Grid)`,relations:[`65jw9m`],color:`gray`,line:`dashed`,head:`normal`,points:[[2682,441],[2791,441],[2933,441],[3044,441]],labelBBox:{x:2770,y:419,width:208,height:18}},{id:`1csgmbb`,parent:null,source:`azadmin`,target:`cdn`,label:`Sets Cache-Control on blobs`,relations:[`12896j`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[3055,480],[3029,484],[3004,488],[2979,491],[2886,500],[2862,500],[2769,491],[2744,488],[2718,485],[2692,480]],labelBBox:{x:2783,y:469,width:183,height:18}},{id:`14djfrc`,parent:null,source:`integrations`,target:`whoop`,label:`Refreshes the access token, then pages 
cycles, sleep, workouts and recovery`,relations:[`1hjsar6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`scheduled`],points:[[358,1883],[386,1889],[414,1895],[441,1901],[1134,2043],[1967,2170],[2327,2224]],labelBBox:{x:1228,y:2013,width:254,height:34}}]},azureDeployment:{_type:`deployment`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/landscape.c4`,description:{txt:`Every resource group and what is in it, as terraform provisions it.\r
Two nodes sit outside Azure: the visitor browser, where every request\r
into the estate starts, and the WHOOP API, the one thing the estate\r
calls out to.\r
\r
Two things are read rather than owned: the nygdevcdn account, of which\r
only the \`data\` container and the two gym files in it are managed\r
here, and the foundrydata disk, which is attached and never created —\r
that is what lets rpg-vm be destroyed and rebuilt without losing a\r
world. sql-nygdev is the opposite case: owned here, in Sweden Central\r
rather than Norway East, and reached by nothing else on the page.`},title:`Deployment — the whole subscription`,id:`azureDeployment`,autoLayout:{direction:`LR`,nodeSep:110,rankSep:180},notation:{nodes:[{title:`App Service Plan (Flex Consumption)`,shape:`rectangle`,color:`primary`,kinds:[`service-plan`]},{title:`Azure SQL Server`,shape:`rectangle`,color:`amber`,kinds:[`sql-server`]},{title:`Azure Subscription`,shape:`rectangle`,color:`muted`,kinds:[`subscription`]},{title:`Internet`,shape:`rectangle`,color:`primary`,kinds:[`internet`]},{title:`Key Vault`,shape:`rectangle`,color:`primary`,kinds:[`key-vault`]},{title:`Managed Disk`,shape:`rectangle`,color:`indigo`,kinds:[`disk`]},{title:`Monitoring`,shape:`rectangle`,color:`primary`,kinds:[`monitoring`]},{title:`Public IP Address`,shape:`rectangle`,color:`indigo`,kinds:[`public-ip`]},{title:`Resource Group`,shape:`rectangle`,color:`primary`,kinds:[`resource-group`]},{title:`Resource Group`,shape:`rectangle`,color:`amber`,kinds:[`resource-group`]},{title:`Resource Group`,shape:`rectangle`,color:`indigo`,kinds:[`resource-group`]},{title:`Storage Account`,shape:`rectangle`,color:`primary`,kinds:[`blob-storage`]},{title:`Storage Account`,shape:`rectangle`,color:`amber`,kinds:[`blob-storage`]},{title:`Subnet`,shape:`rectangle`,color:`indigo`,kinds:[`subnet`]},{title:`Virtual Machine`,shape:`rectangle`,color:`indigo`,kinds:[`vm`]},{title:`Virtual Network`,shape:`rectangle`,color:`indigo`,kinds:[`vnet`]}]},hash:`RTyAGMHuTFiqGq8ISeJsPcdCVH5AYl2p9UpSD-tSCVI`,bounds:{x:0,y:0,width:3797,height:5020},nodes:[{id:`internet`,parent:null,level:0,children:[`internet.browser`,`internet.whoopApi`],inEdges:[`cacxnc`,`1utcibo`],outEdges:[`144ph5v`,`ukpbx1`,`q0nce`,`1rg3p9d`,`1pu7yn2`,`727wv2`],deploymentRef:`internet`,title:`Internet`,kind:`internet`,notation:`Internet`,color:`primary`,shape:`rectangle`,tags:[],style:{opacity:0,size:`md`},depth:1,x:132,y:189,width:2016,height:301,labelBBox:{x:6,y:0,width:59,height:15}},{id:`azure`,parent:null,level:0,children:[`azure.rgConsumption`,`azure.rgDb`,`azure.rgWeb`,`azure.rgNetwork`,`azure.rgVm`,`azure.rgData`,`azure.rgSecurity`],inEdges:[`144ph5v`,`ukpbx1`,`q0nce`,`1rg3p9d`,`1pu7yn2`,`727wv2`],outEdges:[`cacxnc`,`1utcibo`],deploymentRef:`azure`,title:`Azure Subscription`,kind:`subscription`,notation:`Azure Subscription`,color:`muted`,shape:`rectangle`,icon:`azure:subscriptions`,description:{txt:`Managed by terraform — norwayeast unless noted`},tags:[],style:{opacity:5,size:`md`},depth:3,x:8,y:1085,width:3781,height:3927,labelBBox:{x:6,y:0,width:128,height:15}},{id:`azure.rgConsumption`,parent:`azure`,level:1,children:[`azure.rgConsumption.aspPs`,`azure.rgConsumption.funcStorage`,`azure.rgConsumption.aspDotnet`,`azure.rgConsumption.aspIntegrations`,`azure.rgConsumption.appInsights`],inEdges:[`144ph5v`,`nn2xj8`,`n64c57`,`rb4hxq`],outEdges:[`cacxnc`,`1ygmn14`,`1xxqxqa`,`7k4f8v`,`786n1q`,`1qp6vi5`],deploymentRef:`azure.rgConsumption`,title:`rg-nygdev-consumption`,kind:`resource-group`,notation:`Resource Group`,color:`primary`,shape:`rectangle`,icon:`azure:resource-groups`,description:{txt:`Serverless compute, shared monitoring and deploy storage`},tags:[],style:{opacity:10,size:`md`},depth:2,x:108,y:3184,width:2770,height:912,labelBBox:{x:6,y:0,width:157,height:15}},{id:`azure.rgConsumption.aspPs`,parent:`azure.rgConsumption`,level:2,children:[`azure.rgConsumption.aspPs.azadminApp`],inEdges:[`rb4hxq`],outEdges:[`1i7627m`,`786n1q`],deploymentRef:`azure.rgConsumption.aspPs`,title:`asp-nygdev-flex-ps`,kind:`service-plan`,technology:`FC1 / Linux`,notation:`App Service Plan (Flex Consumption)`,color:`primary`,shape:`rectangle`,modelRef:`azadmin`,icon:`azure:app-service-plans`,tags:[],style:{opacity:10,size:`md`},depth:1,x:1721,y:3255,width:398,height:265,labelBBox:{x:6,y:0,width:127,height:15}},{id:`internet.browser`,parent:`internet`,level:1,children:[],inEdges:[`1utcibo`],outEdges:[`144ph5v`,`ukpbx1`,`q0nce`,`1rg3p9d`,`1pu7yn2`,`727wv2`],kind:`instance`,title:`Visitor browser`,description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],color:`green`,shape:`person`,style:{opacity:15,size:`sm`},deploymentRef:`internet.browser`,modelRef:`user`,x:183,y:304,width:288,height:135,labelBBox:{x:11,y:32,width:265,height:68}},{id:`azure.rgConsumption.funcStorage`,parent:`azure.rgConsumption`,level:2,children:[],inEdges:[],outEdges:[],deploymentRef:`azure.rgConsumption.funcStorage`,title:`nygdevfunc`,kind:`blob-storage`,notation:`Storage Account`,color:`primary`,shape:`rectangle`,icon:`azure:storage-accounts`,description:{txt:`Deployment packages — the azadmin-deploy, api-deploy and integrations-deploy containers`},tags:[],style:{opacity:10,size:`md`},x:159,y:3561,width:336,height:180,labelBBox:{x:45,y:47,width:275,height:83}},{id:`azure.rgConsumption.aspPs.azadminApp`,parent:`azure.rgConsumption.aspPs`,level:3,children:[],inEdges:[`rb4hxq`],outEdges:[`1i7627m`,`786n1q`],kind:`instance`,title:`func-nygdev-azadmin`,description:{txt:`512 MB instances, max 1. System-assigned identity.`},technology:`PowerShell 7.4 — Flex Consumption`,tags:[],icon:`azure:function-apps`,color:`primary`,shape:`rectangle`,style:{opacity:15,size:`md`},deploymentRef:`azure.rgConsumption.aspPs.azadminApp`,modelRef:`azadmin`,x:1753,y:3308,width:334,height:180,labelBBox:{x:46,y:46,width:272,height:84}},{id:`azure.rgDb`,parent:`azure`,level:1,children:[`azure.rgDb.sqlServer`,`azure.rgDb.cosmosDb`],inEdges:[`1ygmn14`,`1xxqxqa`],outEdges:[],deploymentRef:`azure.rgDb`,title:`rg-nygdev-db`,kind:`resource-group`,notation:`Resource Group`,color:`amber`,shape:`rectangle`,icon:`azure:resource-groups`,tags:[],style:{opacity:10,size:`md`},depth:1,x:101,y:4661,width:2774,height:301,labelBBox:{x:6,y:0,width:90,height:15}},{id:`azure.rgDb.sqlServer`,parent:`azure.rgDb`,level:2,children:[],inEdges:[],outEdges:[],deploymentRef:`azure.rgDb.sqlServer`,title:`sql-nygdev`,kind:`sql-server`,technology:`Azure SQL — swedencentral`,notation:`Azure SQL Server`,color:`amber`,shape:`rectangle`,icon:`azure:sql-server`,description:{txt:`Sweden Central, because the free Azure SQL offer is not available\r
in Norway East. Entra-only authentication and a firewall open to\r
the home IP alone. The free-tier database inside it was made by hand\r
and is deliberately not managed here.`},tags:[],style:{opacity:15,size:`md`},x:152,y:4732,width:350,height:180,labelBBox:{x:45,y:19,width:289,height:138}},{id:`azure.rgWeb`,parent:`azure`,level:1,children:[`azure.rgWeb.cdnStorage`,`azure.rgWeb.apex`,`azure.rgWeb.runDash`,`azure.rgWeb.gymSite`,`azure.rgWeb.gymbroSite`],inEdges:[`ukpbx1`,`q0nce`,`1rg3p9d`,`1pu7yn2`,`7k4f8v`,`786n1q`,`axilex`],outEdges:[`nn2xj8`,`n64c57`,`1utcibo`,`rb4hxq`],deploymentRef:`azure.rgWeb`,title:`rg-nygdev-web`,kind:`resource-group`,notation:`Resource Group`,color:`amber`,shape:`rectangle`,icon:`azure:resource-groups`,description:{txt:`Web front-ends. The Static Web Apps are in westeurope, Free SKU.`},tags:[],style:{opacity:10,size:`md`},depth:2,x:60,y:1592,width:3679,height:1542,labelBBox:{x:6,y:0,width:100,height:15}},{id:`azure.rgWeb.cdnStorage`,parent:`azure.rgWeb`,level:2,children:[`azure.rgWeb.cdnStorage.webContainer`,`azure.rgWeb.cdnStorage.dataContainer`,`azure.rgWeb.cdnStorage.mediaContainer`],inEdges:[`7k4f8v`,`786n1q`,`13jiyiq`,`nk631p`,`1fpqtea`,`axilex`],outEdges:[`1utcibo`,`rb4hxq`],deploymentRef:`azure.rgWeb.cdnStorage`,title:`nygdevcdn`,kind:`blob-storage`,notation:`Storage Account`,color:`amber`,shape:`rectangle`,icon:`azure:storage-accounts`,tags:[],style:{opacity:10,size:`md`},depth:1,x:110,y:2763,width:3579,height:321,labelBBox:{x:6,y:0,width:74,height:15}},{id:`azure.rgWeb.cdnStorage.webContainer`,parent:`azure.rgWeb.cdnStorage`,level:3,children:[],inEdges:[],outEdges:[],deploymentRef:`azure.rgWeb.cdnStorage.webContainer`,title:`$web`,kind:`storage-container`,notation:null,color:`amber`,shape:`storage`,modelRef:`cdn.webSite`,icon:`azure:storage-container`,tags:[],style:{opacity:10,size:`md`},description:{txt:`This model, rendered by likec4 build and served at the account primary web endpoint`},technology:`Azure Storage static website hosting`,x:161,y:2844,width:332,height:180,labelBBox:{x:46,y:37,width:270,height:102}},{id:`azure.rgNetwork`,parent:`azure`,level:1,children:[`azure.rgNetwork.pip`,`azure.rgNetwork.vnetMain`],inEdges:[`727wv2`],outEdges:[`199o5px`],deploymentRef:`azure.rgNetwork`,title:`rg-nygdev-network`,kind:`resource-group`,notation:`Resource Group`,color:`indigo`,shape:`rectangle`,icon:`azure:resource-groups`,tags:[],style:{opacity:10,size:`md`},depth:2,x:58,y:1156,width:1285,height:386,labelBBox:{x:6,y:0,width:131,height:15}},{id:`azure.rgNetwork.pip`,parent:`azure.rgNetwork`,level:2,children:[],inEdges:[`727wv2`],outEdges:[`199o5px`],deploymentRef:`azure.rgNetwork.pip`,title:`rpg-pip`,kind:`public-ip`,notation:`Public IP Address`,color:`indigo`,shape:`rectangle`,icon:`azure:public-ip-addresses`,description:{txt:`Static public IP, DNS label "rpg" — rpg.norwayeast.cloudapp.azure.com`},tags:[],style:{opacity:15,size:`md`},x:927,y:1227,width:365,height:180,labelBBox:{x:47,y:56,width:303,height:65}},{id:`azure.rgNetwork.vnetMain`,parent:`azure.rgNetwork`,level:2,children:[`azure.rgNetwork.vnetMain.subnetRpg`],inEdges:[],outEdges:[],deploymentRef:`azure.rgNetwork.vnetMain`,title:`nygdev-vnet`,kind:`vnet`,technology:`10.0.0.0/24`,notation:`Virtual Network`,color:`indigo`,shape:`rectangle`,icon:`azure:virtual-networks`,tags:[],style:{opacity:5,size:`md`},depth:1,x:108,y:1227,width:437,height:265,labelBBox:{x:6,y:0,width:83,height:15}},{id:`azure.rgNetwork.vnetMain.subnetRpg`,parent:`azure.rgNetwork.vnetMain`,level:3,children:[],inEdges:[],outEdges:[],deploymentRef:`azure.rgNetwork.vnetMain.subnetRpg`,title:`rpg-snet`,kind:`subnet`,technology:`10.0.0.0/29`,notation:`Subnet`,color:`indigo`,shape:`rectangle`,icon:`azure:subnet`,description:{txt:`NSG nygdev-nsg: 80/443 from anywhere; 22, 30000 and 30001 from the home IP only`},tags:[],style:{opacity:10,size:`md`},x:140,y:1280,width:373,height:180,labelBBox:{x:46,y:37,width:311,height:102}},{id:`azure.rgVm`,parent:`azure`,level:1,children:[`azure.rgVm.rpgVm`],inEdges:[`199o5px`],outEdges:[`axilex`,`1g416jd`],deploymentRef:`azure.rgVm`,title:`rg-nygdev-vm`,kind:`resource-group`,notation:`Resource Group`,color:`indigo`,shape:`rectangle`,icon:`azure:resource-groups`,tags:[],style:{opacity:10,size:`md`},depth:2,x:1663,y:1156,width:1225,height:386,labelBBox:{x:6,y:0,width:91,height:15}},{id:`azure.rgVm.rpgVm`,parent:`azure.rgVm`,level:2,children:[`azure.rgVm.rpgVm.caddyProc`,`azure.rgVm.rpgVm.foundryProc`],inEdges:[`199o5px`],outEdges:[`axilex`,`1g416jd`],deploymentRef:`azure.rgVm.rpgVm`,title:`rpg-vm`,kind:`vm`,technology:`Standard_B2s, Ubuntu 26.04 LTS minimal`,notation:`Virtual Machine`,color:`indigo`,shape:`rectangle`,icon:`azure:virtual-machine`,description:{txt:`30 GB StandardSSD OS disk, SSH key only, no VM agent and no\r
extensions. Configured entirely by cloud-init; auto-shutdown at\r
23:00 Oslo time.`},tags:[],style:{opacity:10,size:`md`},depth:1,x:1695,y:1209,width:1161,height:301,labelBBox:{x:6,y:0,width:48,height:15}},{id:`azure.rgVm.rpgVm.caddyProc`,parent:`azure.rgVm.rpgVm`,level:3,children:[],inEdges:[`199o5px`],outEdges:[`1m336sa`],kind:`instance`,title:`Caddy`,description:{txt:`Reverse proxy and TLS termination on 80/443, for rpg.nygard.dev`},technology:`Caddy`,tags:[],color:`indigo`,shape:`rectangle`,style:{opacity:15,size:`md`},deploymentRef:`azure.rgVm.rpgVm.caddyProc`,modelRef:`rpg.caddy`,x:1744,y:1280,width:351,height:180,labelBBox:{x:19,y:46,width:315,height:84}},{id:`azure.rgVm.rpgVm.foundryProc`,parent:`azure.rgVm.rpgVm`,level:3,children:[],inEdges:[`1m336sa`],outEdges:[`axilex`,`1g416jd`],kind:`instance`,title:`Foundry VTT`,description:{txt:`Self-hosted virtual tabletop, running as srv_foundry off the foundrydata disk`},technology:`Node.js, listening on :30000`,tags:[],color:`indigo`,shape:`rectangle`,style:{opacity:15,size:`md`},deploymentRef:`azure.rgVm.rpgVm.foundryProc`,modelRef:`rpg.foundry`,x:2486,y:1280,width:320,height:180,labelBBox:{x:30,y:46,width:260,height:84}},{id:`azure.rgData`,parent:`azure`,level:1,children:[`azure.rgData.foundryData`],inEdges:[`1g416jd`],outEdges:[],deploymentRef:`azure.rgData`,title:`rg-nygdev-data`,kind:`resource-group`,notation:`Resource Group`,color:`indigo`,shape:`rectangle`,icon:`azure:resource-groups`,description:{txt:`Persistent data — survives VM rebuilds`},tags:[],style:{opacity:10,size:`md`},depth:1,x:3242,y:1227,width:427,height:265,labelBBox:{x:6,y:0,width:105,height:15}},{id:`azure.rgWeb.apex`,parent:`azure.rgWeb`,level:2,children:[],inEdges:[`ukpbx1`],outEdges:[],deploymentRef:`azure.rgWeb.apex`,title:`nygdevapex`,kind:`static-site`,notation:null,color:`amber`,shape:`browser`,modelRef:`web`,icon:`azure:static-apps`,description:{txt:`Serves https://nygard.dev`},tags:[],style:{opacity:15,size:`md`},technology:`Azure Static Web App — Free SKU, westeurope`,x:945,y:1663,width:330,height:180,labelBBox:{x:47,y:55,width:267,height:66}},{id:`azure.rgWeb.runDash`,parent:`azure.rgWeb`,level:2,children:[],inEdges:[`q0nce`],outEdges:[`13jiyiq`],deploymentRef:`azure.rgWeb.runDash`,title:`nygdevrun`,kind:`static-site`,notation:null,color:`amber`,shape:`browser`,modelRef:`running`,icon:`azure:static-apps`,description:{txt:`Serves https://run.nygard.dev`},tags:[],style:{opacity:15,size:`md`},technology:`Azure Static Web App — Free SKU, westeurope`,x:945,y:1953,width:330,height:180,labelBBox:{x:47,y:55,width:267,height:66}},{id:`azure.rgWeb.gymSite`,parent:`azure.rgWeb`,level:2,children:[],inEdges:[`1rg3p9d`],outEdges:[`nn2xj8`,`nk631p`],deploymentRef:`azure.rgWeb.gymSite`,title:`nygdevgym`,kind:`static-site`,notation:null,color:`amber`,shape:`browser`,modelRef:`gym`,icon:`azure:static-apps`,description:{txt:`Serves https://gym.nygard.dev`},tags:[],style:{opacity:15,size:`md`},technology:`Azure Static Web App — Free SKU, westeurope`,x:945,y:2243,width:330,height:180,labelBBox:{x:47,y:55,width:267,height:66}},{id:`azure.rgWeb.gymbroSite`,parent:`azure.rgWeb`,level:2,children:[],inEdges:[`1pu7yn2`],outEdges:[`n64c57`,`1fpqtea`],deploymentRef:`azure.rgWeb.gymbroSite`,title:`nygdevgymbro`,kind:`static-site`,notation:null,color:`amber`,shape:`browser`,modelRef:`gymbro`,icon:`azure:static-apps`,description:{txt:`Serves https://gymbro.nygard.dev`},tags:[],style:{opacity:15,size:`md`},technology:`Azure Static Web App — Free SKU, westeurope`,x:936,y:2533,width:348,height:180,labelBBox:{x:46,y:55,width:287,height:66}},{id:`azure.rgData.foundryData`,parent:`azure.rgData`,level:2,children:[],inEdges:[`1g416jd`],outEdges:[],deploymentRef:`azure.rgData.foundryData`,title:`foundrydata`,kind:`disk`,technology:`Azure Managed Disk, attached at LUN 0`,notation:`Managed Disk`,color:`indigo`,shape:`rectangle`,icon:`azure:disks`,description:{txt:`Worlds, modules, media, the Caddyfile and the Foundry install.\r
Referenced by terraform as a data source and attached, never\r
created — which is what lets the VM be destroyed and rebuilt.`},tags:[],style:{opacity:15,size:`md`},x:3273,y:1280,width:363,height:180,labelBBox:{x:47,y:19,width:301,height:138}},{id:`azure.rgConsumption.aspDotnet`,parent:`azure.rgConsumption`,level:2,children:[`azure.rgConsumption.aspDotnet.apiApp`],inEdges:[`nn2xj8`,`n64c57`],outEdges:[`1ywbkrh`,`1xxqxqa`],deploymentRef:`azure.rgConsumption.aspDotnet`,title:`asp-nygdev-flex-dotnet`,kind:`service-plan`,technology:`FC1 / Linux`,notation:`App Service Plan (Flex Consumption)`,color:`primary`,shape:`rectangle`,modelRef:`api`,icon:`azure:app-service-plans`,tags:[],style:{opacity:10,size:`md`},depth:1,x:1704,y:3570,width:432,height:265,labelBBox:{x:6,y:0,width:157,height:15}},{id:`azure.rgConsumption.aspIntegrations`,parent:`azure.rgConsumption`,level:2,children:[],inEdges:[`144ph5v`],outEdges:[`pgcbgn`,`cacxnc`,`1ygmn14`,`7k4f8v`,`1qp6vi5`],deploymentRef:`azure.rgConsumption.aspIntegrations`,title:`asp-nygdev-flex-integrations`,kind:`service-plan`,technology:`FC1 / Linux`,notation:`App Service Plan (Flex Consumption)`,color:`primary`,shape:`rectangle`,modelRef:`integrations`,icon:`azure:app-service-plans`,tags:[],style:{opacity:10,size:`md`},description:{txt:`512 MB instances, max 1. Runs as id-nygdev-integrations. No CORS\r
list and no Easy Auth: nothing that calls it is a browser holding\r
a token — the WHOOP callback is a top-level redirect and the rest\r
carry function keys.`},x:922,y:3846,width:375,height:180,labelBBox:{x:47,y:19,width:313,height:138}},{id:`azure.rgConsumption.aspDotnet.apiApp`,parent:`azure.rgConsumption.aspDotnet`,level:3,children:[],inEdges:[`nn2xj8`,`n64c57`],outEdges:[`1ywbkrh`,`1xxqxqa`],kind:`instance`,title:`func-nygdev-api`,description:{txt:`512 MB instances, max 1. Runs as id-nygdev-api. CORS allows gym\r
and gymbro, each under its custom domain and its default hostname.\r
Easy Auth enforces GymLog tokens: require_authentication with\r
Return401 and no exempt paths, which is what moving the anonymous\r
callers off this app bought.`},technology:`.NET 10 isolated — Flex Consumption`,tags:[],icon:`azure:function-apps`,color:`primary`,shape:`rectangle`,style:{opacity:15,size:`md`},deploymentRef:`azure.rgConsumption.aspDotnet.apiApp`,modelRef:`api`,x:1736,y:3623,width:367,height:180,labelBBox:{x:47,y:19,width:305,height:138}},{id:`internet.whoopApi`,parent:`internet`,level:1,children:[],inEdges:[`cacxnc`],outEdges:[],kind:`instance`,title:`api.prod.whoop.com`,description:{txt:`The OAuth token endpoint and the v2 data API, both outside the subscription`},technology:`WHOOP API v2 — OAuth 2.0 + REST`,tags:[],color:`muted`,shape:`rectangle`,style:{opacity:20,size:`md`},deploymentRef:`internet.whoopApi`,modelRef:`whoop`,x:1742,y:260,width:355,height:180,labelBBox:{x:19,y:46,width:319,height:84}},{id:`azure.rgSecurity`,parent:`azure`,level:1,children:[`azure.rgSecurity.kv`],inEdges:[`1qp6vi5`],outEdges:[],deploymentRef:`azure.rgSecurity`,title:`rg-nygdev-security`,kind:`resource-group`,notation:`Resource Group`,color:`primary`,shape:`rectangle`,icon:`azure:resource-groups`,description:{txt:`The resource group is not created by this configuration; the vault in it is`},tags:[],style:{opacity:10,size:`md`},depth:1,x:1702,y:4346,width:437,height:265,labelBBox:{x:6,y:0,width:130,height:15}},{id:`azure.rgConsumption.appInsights`,parent:`azure.rgConsumption`,level:2,children:[],inEdges:[`pgcbgn`,`1ywbkrh`,`1i7627m`],outEdges:[],deploymentRef:`azure.rgConsumption.appInsights`,title:`appi-nygdev-consumption`,kind:`monitoring`,notation:`Monitoring`,color:`primary`,shape:`rectangle`,icon:`azure:application-insights`,description:{txt:`Application Insights, backed by the log-nygdev-consumption workspace`},tags:[],style:{opacity:15,size:`md`},x:2464,y:3623,width:363,height:180,labelBBox:{x:47,y:56,width:301,height:65}},{id:`azure.rgWeb.cdnStorage.dataContainer`,parent:`azure.rgWeb.cdnStorage`,level:3,children:[],inEdges:[`7k4f8v`,`13jiyiq`,`nk631p`,`1fpqtea`],outEdges:[],deploymentRef:`azure.rgWeb.cdnStorage.dataContainer`,title:`data`,kind:`storage-container`,notation:null,color:`amber`,shape:`storage`,modelRef:`cdn.dataContainer`,icon:`azure:storage-container`,tags:[],style:{opacity:10,size:`md`},description:{txt:`Three files, published by two different things.\r
\r
marathonprep.json is the built running dashboard, written by the\r
Integrations app and rewritten in place on every build, carrying a five-minute\r
Cache-Control so each rebuild reaches the page well before the next\r
one runs.\r
\r
gym-exercises.json and gym-templates.json are the exercise library and\r
the built-in day templates. They are not written by anything at run\r
time — they are files in the repository that terraform uploads, so\r
editing one is an apply rather than a deploy. They are here rather\r
than in Cosmos because they are identical for every account and change\r
when the app ships: served per account they would cost a function\r
invocation, a token and an RU to hand back the same objects. Cached\r
for a day, which is also the worst case for a new exercise reaching a\r
phone that has already loaded the app.\r
\r
Anonymous read is what lets all three be fetched with no key, no token\r
and no function call in between. The gym fetches deliberately send no\r
Authorization header either: adding one would turn a simple\r
cross-origin GET into a preflight this endpoint has no CORS rule for.`},technology:`Anonymous blob read; the container cannot be listed`,x:1747,y:2834,width:346,height:200,labelBBox:{x:46,y:29,width:285,height:138}},{id:`azure.rgWeb.cdnStorage.mediaContainer`,parent:`azure.rgWeb.cdnStorage`,level:3,children:[],inEdges:[`786n1q`,`axilex`],outEdges:[`1utcibo`,`rb4hxq`],deploymentRef:`azure.rgWeb.cdnStorage.mediaContainer`,title:`foundry`,kind:`storage-container`,notation:null,color:`amber`,shape:`storage`,modelRef:`cdn.foundryMedia`,icon:`azure:storage-container`,tags:[],style:{opacity:10,size:`md`},description:{txt:`Foundry VTT media, fetched straight by player browsers`},technology:`Storage Container`,x:3271,y:2844,width:367,height:180,labelBBox:{x:47,y:46,width:305,height:84}},{id:`azure.rgSecurity.kv`,parent:`azure.rgSecurity`,level:2,children:[],inEdges:[`1qp6vi5`],outEdges:[],deploymentRef:`azure.rgSecurity.kv`,title:`nygdev`,kind:`key-vault`,notation:`Key Vault`,color:`primary`,shape:`rectangle`,icon:`azure:key-vaults`,description:{txt:`RBAC data plane. Holds HomeIP, whoop-clientsecret and whoop-token, alongside the nygdev-ed25519 SSH public key resource.`},tags:[],style:{opacity:15,size:`md`},x:1734,y:4399,width:372,height:180,labelBBox:{x:46,y:38,width:311,height:101}},{id:`azure.rgDb.cosmosDb`,parent:`azure.rgDb`,level:2,children:[],inEdges:[`1ygmn14`,`1xxqxqa`],outEdges:[],kind:`instance`,title:`nygdev-cosmos-db`,description:{txt:`GlobalDocumentDB, free tier, local auth disabled, Session consistency — db / primary, gym and gps`},technology:`Azure Cosmos DB (NoSQL) — free tier`,tags:[],icon:`azure:azure-cosmos-db`,color:`amber`,shape:`storage`,style:{opacity:15,size:`md`},deploymentRef:`azure.rgDb.cosmosDb`,modelRef:`cosmos`,x:2467,y:4732,width:357,height:180,labelBBox:{x:47,y:37,width:295,height:102}}],edges:[{id:`144ph5v`,parent:null,source:`internet.browser`,target:`azure.rgConsumption.aspIntegrations`,label:`Grants WHOOP access, once (GET 
/api/whoop/authorize)`,relations:[`1radcrl`],color:`gray`,line:`dashed`,head:`normal`,points:[[338,439],[362,569],[432,858],[603,1023],[682,1099],[769,1021],[833,1110],[967,1294],[891,2935],[923,3161],[957,3407],[1035,3689],[1079,3836]],labelBBox:{x:604,y:985,width:227,height:34}},{id:`pgcbgn`,parent:`azure.rgConsumption`,source:`azure.rgConsumption.aspIntegrations`,target:`azure.rgConsumption.appInsights`,label:`Telemetry, to the same workspace`,relations:[`17z59xt`],color:`gray`,line:`dashed`,head:`normal`,points:[[1298,3908],[1592,3866],[2159,3783],[2455,3740]],labelBBox:{x:1811,y:3766,width:218,height:18}},{id:`cacxnc`,parent:null,source:`azure.rgConsumption.aspIntegrations`,target:`internet.whoopApi`,label:`[...]`,relations:[`1hjsar6`,`13l4764`],color:`gray`,line:`dashed`,head:`normal`,tags:[`scheduled`],points:[[1147,3846],[1202,3703],[1304,3415],[1343,3161],[1383,2910],[1315,1122],[1388,879],[1454,660],[1485,587],[1663,444],[1684,427],[1708,413],[1733,401]],labelBBox:{x:1504,y:436,width:25,height:18}},{id:`1ywbkrh`,parent:`azure.rgConsumption`,source:`azure.rgConsumption.aspDotnet.apiApp`,target:`azure.rgConsumption.appInsights`,label:`Telemetry (OpenTelemetry)`,relations:[`tk0ig8`],color:`gray`,line:`dashed`,head:`normal`,points:[[2104,3713],[2211,3713],[2346,3713],[2454,3713]],labelBBox:{x:2198,y:3691,width:176,height:18}},{id:`1i7627m`,parent:`azure.rgConsumption`,source:`azure.rgConsumption.aspPs.azadminApp`,target:`azure.rgConsumption.appInsights`,label:`Telemetry`,relations:[`1h0c43t`],color:`gray`,line:`dashed`,head:`normal`,points:[[2087,3452],[2174,3482],[2281,3521],[2374,3564],[2410,3580],[2448,3599],[2483,3618]],labelBBox:{x:2252,y:3471,width:66,height:18}},{id:`1ygmn14`,parent:`azure`,source:`azure.rgConsumption.aspIntegrations`,target:`azure.rgDb.cosmosDb`,label:`[...]`,relations:[`1nhxbki`,`gm16oi`,`pmzikr`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[1298,3921],[1566,3911],[2063,3931],[2374,4184],[2542,4320],[2608,4578],[2632,4721]],labelBBox:{x:1908,y:3908,width:25,height:18}},{id:`1xxqxqa`,parent:`azure`,source:`azure.rgConsumption.aspDotnet.apiApp`,target:`azure.rgDb.cosmosDb`,label:`[...]`,relations:[`pnn4nb`,`13ju45s`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[2104,3769],[2120,3779],[2136,3792],[2148,3807],[2213,3884],[2136,3948],[2197,4029],[2250,4103],[2315,4062],[2374,4131],[2526,4306],[2598,4575],[2628,4720]],labelBBox:{x:2273,y:4005,width:25,height:18}},{id:`ukpbx1`,parent:null,source:`internet.browser`,target:`azure.rgWeb.apex`,label:`[...]`,relations:[`1lmsese`,`vgefkl`],color:`gray`,line:`dashed`,head:`normal`,points:[[366,439],[493,663],[903,1389],[1054,1654]],labelBBox:{x:706,y:874,width:25,height:18}},{id:`q0nce`,parent:null,source:`internet.browser`,target:`azure.rgWeb.runDash`,label:`[...]`,relations:[`yykv63`,`10i6d8v`],color:`gray`,line:`dashed`,head:`normal`,points:[[471,421],[587,469],[744,553],[833,679],[978,885],[1070,1664],[1100,1943]],labelBBox:{x:706,y:469,width:25,height:18}},{id:`1rg3p9d`,parent:null,source:`internet.browser`,target:`azure.rgWeb.gymSite`,label:`[...]`,relations:[`1w80116`,`946zon`],color:`gray`,line:`dashed`,head:`normal`,points:[[445,439],[565,515],[744,649],[833,817],[989,1115],[863,1237],[923,1569],[966,1810],[1041,2088],[1081,2233]],labelBBox:{x:706,y:532,width:25,height:18}},{id:`1pu7yn2`,parent:null,source:`internet.browser`,target:`azure.rgWeb.gymbroSite`,label:`[...]`,relations:[`hgyq9w`,`1h2h5uh`],color:`gray`,line:`dashed`,head:`normal`,points:[[412,439],[530,538],[739,735],[833,955],[998,1342],[850,1483],[923,1898],[962,2124],[1037,2384],[1078,2523]],labelBBox:{x:706,y:604,width:25,height:18}},{id:`nn2xj8`,parent:`azure`,source:`azure.rgWeb.gymSite`,target:`azure.rgConsumption.aspDotnet.apiApp`,label:`[...]`,relations:[`10bb0if`,`1biockh`],color:`gray`,line:`dashed`,head:`normal`,tags:[`signed-in`],points:[[1275,2375],[1301,2388],[1325,2405],[1343,2427],[1401,2494],[1359,2538],[1388,2621],[1523,3003],[1754,3426],[1861,3614]],labelBBox:{x:1504,y:2597,width:25,height:18}},{id:`n64c57`,parent:`azure`,source:`azure.rgWeb.gymbroSite`,target:`azure.rgConsumption.aspDotnet.apiApp`,label:`[...]`,relations:[`1gosi7d`,`1dc0uk1`],color:`gray`,line:`dashed`,head:`normal`,tags:[`signed-in`],points:[[1285,2672],[1307,2684],[1327,2698],[1343,2717],[1392,2771],[1358,2808],[1388,2874],[1516,3161],[1731,3464],[1844,3615]],labelBBox:{x:1504,y:2850,width:25,height:18}},{id:`7k4f8v`,parent:`azure`,source:`azure.rgConsumption.aspIntegrations`,target:`azure.rgWeb.cdnStorage.dataContainer`,label:`[...]`,relations:[`1dvvjn1`,`17mf9sq`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[1236,3846],[1364,3745],[1557,3569],[1644,3365],[1673,3298],[1620,3097],[1663,3038],[1681,3012],[1708,2992],[1737,2977]],labelBBox:{x:1504,y:3341,width:25,height:18}},{id:`786n1q`,parent:`azure`,source:`azure.rgConsumption.aspPs.azadminApp`,target:`azure.rgWeb.cdnStorage.mediaContainer`,label:`Sets Cache-Control on blobs`,relations:[`12896j`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[2087,3441],[2111,3454],[2132,3470],[2148,3492],[2208,3571],[2124,3869],[2197,3938],[2211,3951],[2355,3946],[2374,3948],[2602,3964],[2691,4071],[2888,3955],[3235,3751],[3384,3249],[3434,3034]],labelBBox:{x:2555,y:3934,width:183,height:18}},{id:`13jiyiq`,parent:`azure.rgWeb`,source:`azure.rgWeb.runDash`,target:`azure.rgWeb.cdnStorage.dataContainer`,label:`Fetches the built dashboard from the 
page (GET data/marathonprep.json)`,relations:[`ziwldx`],color:`gray`,line:`dashed`,head:`normal`,points:[[1275,2080],[1392,2114],[1545,2175],[1644,2279],[1792,2434],[1866,2680],[1898,2823]],labelBBox:{x:1400,y:2082,width:232,height:35}},{id:`nk631p`,parent:`azure.rgWeb`,source:`azure.rgWeb.gymSite`,target:`azure.rgWeb.cdnStorage.dataContainer`,label:`Fetches the exercise library and the 
built-in day templates, once, and caches 
them`,relations:[`ra8k0t`],color:`gray`,line:`dashed`,head:`normal`,points:[[1275,2381],[1388,2420],[1535,2483],[1644,2572],[1731,2642],[1806,2746],[1856,2824]],labelBBox:{x:1389,y:2373,width:254,height:52}},{id:`1fpqtea`,parent:`azure.rgWeb`,source:`azure.rgWeb.gymbroSite`,target:`azure.rgWeb.cdnStorage.dataContainer`,label:`Fetches the same two files`,relations:[`5raq03`],color:`gray`,line:`dashed`,head:`normal`,points:[[1284,2689],[1417,2740],[1601,2811],[1736,2863]],labelBBox:{x:1431,y:2710,width:170,height:18}},{id:`1utcibo`,parent:null,source:`azure.rgWeb.cdnStorage.mediaContainer`,target:`internet.browser`,label:`Serves media straight to the player 
browser`,relations:[`1bv5zgx`],color:`gray`,line:`dashed`,head:`normal`,points:[[3437,2843],[3396,2619],[3290,2022],[3242,1519],[3234,1440],[3235,157],[3181,100],[3018,-75],[2886,40],[2647,40],[1109,40],[1109,40],[1109,40],[847,40],[571,201],[427,298]],labelBBox:{x:1810,y:1,width:220,height:35}},{id:`rb4hxq`,parent:`azure`,source:`azure.rgWeb.cdnStorage.mediaContainer`,target:`azure.rgConsumption.aspPs.azadminApp`,label:`Blob-created events (Event Grid)`,relations:[`65jw9m`],color:`gray`,line:`dashed`,head:`normal`,points:[[3271,2989],[2973,3079],[2389,3256],[2097,3344]],labelBBox:{x:2542,y:3090,width:208,height:18}},{id:`727wv2`,parent:null,source:`internet.browser`,target:`azure.rgNetwork.pip`,label:`HTTPS to rpg.nygard.dev`,relations:[`1m90jbu`],color:`gray`,line:`dashed`,head:`normal`,points:[[383,439],[519,603],[870,1027],[1029,1219]],labelBBox:{x:637,y:710,width:163,height:18}},{id:`199o5px`,parent:`azure`,source:`azure.rgNetwork.pip`,target:`azure.rgVm.rpgVm.caddyProc`,label:`Forwards 80/443 through rpg-snet`,relations:[`1jtxe5a`],color:`gray`,line:`dashed`,head:`normal`,points:[[1293,1329],[1425,1337],[1602,1349],[1735,1358]],labelBBox:{x:1408,y:1313,width:216,height:18}},{id:`1m336sa`,parent:`azure.rgVm.rpgVm`,source:`azure.rgVm.rpgVm.caddyProc`,target:`azure.rgVm.rpgVm.foundryProc`,label:`Reverse proxies to :30000`,relations:[`m5rxcy`],color:`gray`,line:`dashed`,head:`normal`,points:[[2096,1370],[2211,1370],[2362,1370],[2476,1370]],labelBBox:{x:2202,y:1348,width:167,height:18}},{id:`axilex`,parent:`azure`,source:`azure.rgVm.rpgVm.foundryProc`,target:`azure.rgWeb.cdnStorage.mediaContainer`,label:`Holds asset URLs pointing at`,relations:[`wja7lj`],color:`gray`,line:`dashed`,head:`normal`,points:[[2806,1410],[2836,1423],[2865,1441],[2888,1464],[3285,1863],[3410,2571],[3443,2832]],labelBBox:{x:2957,y:1504,width:185,height:18}},{id:`1g416jd`,parent:`azure`,source:`azure.rgVm.rpgVm.foundryProc`,target:`azure.rgData.foundryData`,label:`Stores worlds, modules and media on the 
attached disk`,relations:[`1qntz4a`],color:`gray`,line:`dashed`,head:`normal`,points:[[2806,1370],[2937,1370],[3124,1370],[3263,1370]],labelBBox:{x:2919,y:1331,width:262,height:35}},{id:`1qp6vi5`,parent:`azure`,source:`azure.rgConsumption.aspIntegrations`,target:`azure.rgSecurity.kv`,label:`HTTPS/443, Entra token for 
id-nygdev-integrations`,relations:[`14ndmcv`],color:`gray`,line:`dashed`,head:`normal`,points:[[1298,4006],[1314,4013],[1329,4021],[1343,4030],[1523,4135],[1707,4292],[1817,4392]],labelBBox:{x:1428,y:4022,width:177,height:35}}]},rpg:{_type:`element`,tags:null,links:null,viewOf:`rpg`,_stage:`layouted`,sourcePath:`src/views/rpg.c4`,description:{txt:`Journey three, at the level of processes. A player opens\r
rpg.nygard.dev; Caddy terminates TLS on 80/443 and reverse-proxies to\r
the Foundry process on :30000, which serves the game UI and the world\r
back over the same connection.\r
\r
Media is the one thing that does not come from the VM. Foundry holds\r
asset URLs pointing at the nygdevcdn storage account, so a player\r
browser fetches images and audio straight from blob storage and never\r
asks the B2s for them.\r
\r
What the VM actually is — the public IP in front of it, the subnet and\r
NSG around it, the disk under it — is \`rpgInfra\`. How it comes to\r
exist at all is \`rpgTerraform\`.`},title:`rpg.nygard.dev — Foundry VTT`,id:`rpg`,autoLayout:{direction:`LR`,nodeSep:100,rankSep:180},notation:{nodes:[{title:`Web App (browser)`,shape:`browser`,color:`sky`,kinds:[`webapp`]},{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Virtual Machine`,shape:`rectangle`,color:`indigo`,kinds:[`virtual-machine`]},{title:`Process on a VM`,shape:`rectangle`,color:`indigo`,kinds:[`service`]},{title:`Azure Storage Account`,shape:`storage`,color:`primary`,kinds:[`storage-account`]},{title:`Blob Container`,shape:`storage`,color:`primary`,kinds:[`blob-container`]}]},hash:`r5pABAPVxpGpK8g4yu4hVkWKv54vbQxzsFF6pGhXuMc`,bounds:{x:0,y:0,width:1950,height:793},nodes:[{id:`user`,parent:null,level:0,children:[],inEdges:[`19m1pz9`],outEdges:[`kmqedl`],title:`Visitor`,modelRef:`user`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],notation:`Person`,kind:`actor`,x:1543,y:573,width:366,height:180,labelBBox:{x:18,y:29,width:330,height:119}},{id:`rpg`,parent:null,level:0,children:[`rpg.foundry`,`rpg.client`,`rpg.caddy`],inEdges:[`kmqedl`],outEdges:[`1ujxps2`],title:`RPG Server`,modelRef:`rpg`,shape:`rectangle`,color:`indigo`,icon:`azure:virtual-machine`,style:{opacity:0,size:`md`},description:{txt:`rpg-vm, behind the rpg-pip public IP. Built by terraform and\r
configured by cloud-init; worlds and media live on a separate disk\r
that survives the VM being rebuilt.`},tags:[],notation:`Azure Virtual Machine`,technology:`Azure Linux VM — Standard_B2s, Ubuntu 26.04 LTS minimal`,kind:`virtual-machine`,depth:1,x:8,y:8,width:1934,height:504,labelBBox:{x:6,y:0,width:76,height:15}},{id:`rpg.foundry`,parent:`rpg`,level:1,children:[],inEdges:[`tnfmbw`],outEdges:[`enuzou`,`1ujxps2`],title:`Foundry VTT`,modelRef:`rpg.foundry`,shape:`rectangle`,color:`indigo`,style:{opacity:15,size:`md`},description:{txt:`Self-hosted virtual tabletop, running as srv_foundry off the foundrydata disk`},tags:[],notation:`Process on a VM`,technology:`Node.js, listening on :30000`,kind:`service`,x:48,y:282,width:320,height:180,labelBBox:{x:30,y:46,width:260,height:85}},{id:`rpg.client`,parent:`rpg`,level:1,children:[],inEdges:[`enuzou`,`kmqedl`],outEdges:[`1lpxjzc`],title:`Foundry Client`,modelRef:`rpg.client`,shape:`browser`,color:`sky`,style:{opacity:15,size:`md`},description:{txt:`The game UI, served by Foundry VTT and running in the player browser`},tags:[],notation:`Web App (browser)`,technology:`HTML / JS in the browser`,kind:`webapp`,x:793,y:292,width:328,height:180,labelBBox:{x:22,y:46,width:285,height:85}},{id:`cdn`,parent:null,level:0,children:[`cdn.foundryMedia`],inEdges:[`1ujxps2`],outEdges:[`19m1pz9`],title:`CDN Storage`,modelRef:`cdn`,shape:`storage`,color:`primary`,icon:`azure:storage-accounts`,style:{opacity:20,size:`md`},description:{txt:`One public account serving three unrelated things`},tags:[],notation:`Azure Storage Account`,technology:`Azure Blob Storage — nygdevcdn`,kind:`storage-account`,depth:1,x:741,y:520,width:432,height:265,labelBBox:{x:6,y:0,width:85,height:15}},{id:`rpg.caddy`,parent:`rpg`,level:1,children:[],inEdges:[`1lpxjzc`],outEdges:[`tnfmbw`],title:`Caddy`,modelRef:`rpg.caddy`,shape:`rectangle`,color:`indigo`,style:{opacity:15,size:`md`},description:{txt:`Reverse proxy and TLS termination on 80/443, for rpg.nygard.dev`},tags:[],notation:`Process on a VM`,technology:`Caddy`,kind:`service`,x:1550,y:69,width:351,height:180,labelBBox:{x:19,y:46,width:315,height:85}},{id:`cdn.foundryMedia`,parent:`cdn`,level:1,children:[],inEdges:[`1ujxps2`],outEdges:[`19m1pz9`],title:`foundry`,modelRef:`cdn.foundryMedia`,shape:`storage`,color:`primary`,icon:`azure:storage-container`,style:{opacity:15,size:`md`},description:{txt:`Foundry VTT media, fetched straight by player browsers`},tags:[],notation:`Blob Container`,technology:`Storage Container`,kind:`blob-container`,x:773,y:573,width:367,height:180,labelBBox:{x:47,y:46,width:305,height:85}}],edges:[{id:`1lpxjzc`,parent:`rpg`,source:`rpg.client`,target:`rpg.caddy`,label:`HTTPS / WSS to rpg.nygard.dev`,relations:[`10avaox`],color:`gray`,line:`dashed`,head:`normal`,points:[[1121,335],[1245,299],[1413,250],[1541,213]],labelBBox:{x:1239,y:222,width:206,height:18}},{id:`enuzou`,parent:`rpg`,source:`rpg.foundry`,target:`rpg.client`,label:`Serves the game UI and world data`,relations:[`7kbqw1`],color:`gray`,line:`dashed`,head:`normal`,points:[[368,374],[490,376],[657,378],[783,380]],labelBBox:{x:459,y:354,width:223,height:18}},{id:`tnfmbw`,parent:`rpg`,source:`rpg.caddy`,target:`rpg.foundry`,label:`Reverse proxies to :30000`,relations:[`m5rxcy`],color:`gray`,line:`dashed`,head:`normal`,points:[[1551,171],[1456,178],[1337,187],[1231,196],[1013,214],[957,206],[741,242],[619,263],[482,296],[378,324]],labelBBox:{x:874,y:179,width:167,height:18}},{id:`kmqedl`,parent:null,source:`user`,target:`rpg.client`,label:`Plays at https://rpg.nygard.dev`,relations:[`tl5krj`],color:`gray`,line:`dashed`,head:`normal`,points:[[1544,596],[1419,551],[1254,490],[1131,445]],labelBBox:{x:1246,y:467,width:193,height:18}},{id:`1ujxps2`,parent:null,source:`rpg.foundry`,target:`cdn.foundryMedia`,label:`Holds asset URLs pointing at`,relations:[`wja7lj`],color:`gray`,line:`dashed`,head:`normal`,points:[[368,434],[483,479],[640,540],[763,588]],labelBBox:{x:479,y:453,width:185,height:18}},{id:`19m1pz9`,parent:null,source:`cdn.foundryMedia`,target:`user`,label:`Serves media straight to the player 
browser`,relations:[`1bv5zgx`],color:`gray`,line:`dashed`,head:`normal`,points:[[1142,663],[1260,663],[1413,663],[1533,663]],labelBBox:{x:1232,y:624,width:220,height:35}}]},rpgInfra:{_type:`deployment`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/rpg.c4`,description:{txt:`What terraform builds for journey three, and nothing else.\r
\r
Traffic lands on rpg-pip — a static public IP with the DNS label\r
"rpg", which is what rpg.nygard.dev is a CNAME to — and reaches the VM\r
through rpg-snet. The NSG on that subnet is the only access control:\r
80 and 443 from anywhere, and 22, 30000 and 30001 from the home IP\r
alone, so Foundry own port is unreachable from the internet and only\r
Caddy answers on it.\r
\r
The split between rg-nygdev-vm and rg-nygdev-data is the point of the\r
whole layout. The VM, its NIC and its OS disk are disposable — no VM\r
agent, no extensions, configured entirely by cloud-init on first boot.\r
Everything worth keeping is on foundrydata, which terraform reads as a\r
data source and attaches rather than creates, so a rebuild replaces\r
the machine and leaves the worlds alone.`},title:`The infrastructure behind rpg.nygard.dev`,id:`rpgInfra`,autoLayout:{direction:`TB`,nodeSep:120,rankSep:140},notation:{nodes:[{title:`Azure Subscription`,shape:`rectangle`,color:`muted`,kinds:[`subscription`]},{title:`Internet`,shape:`rectangle`,color:`primary`,kinds:[`internet`]},{title:`Managed Disk`,shape:`rectangle`,color:`indigo`,kinds:[`disk`]},{title:`Public IP Address`,shape:`rectangle`,color:`indigo`,kinds:[`public-ip`]},{title:`Resource Group`,shape:`rectangle`,color:`indigo`,kinds:[`resource-group`]},{title:`Resource Group`,shape:`rectangle`,color:`primary`,kinds:[`resource-group`]},{title:`Storage Account`,shape:`rectangle`,color:`primary`,kinds:[`blob-storage`]},{title:`Subnet`,shape:`rectangle`,color:`indigo`,kinds:[`subnet`]},{title:`Virtual Machine`,shape:`rectangle`,color:`indigo`,kinds:[`vm`]},{title:`Virtual Network`,shape:`rectangle`,color:`indigo`,kinds:[`vnet`]}]},hash:`_3C43l32TQ_k6IybKfsn-BdfQyRTdBLwlS8usQKUUSs`,bounds:{x:0,y:0,width:1460,height:2020},nodes:[{id:`internet`,parent:null,level:0,children:[`internet.browser`],inEdges:[`1utcibo`],outEdges:[`727wv2`],deploymentRef:`internet`,title:`Internet`,kind:`internet`,notation:`Internet`,color:`primary`,shape:`rectangle`,tags:[],style:{opacity:0,size:`md`},depth:1,x:8,y:173,width:352,height:220,labelBBox:{x:6,y:0,width:59,height:15}},{id:`internet.browser`,parent:`internet`,level:1,children:[],inEdges:[`1utcibo`],outEdges:[`727wv2`],kind:`instance`,title:`Visitor browser`,description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],color:`green`,shape:`person`,style:{opacity:15,size:`sm`},deploymentRef:`internet.browser`,modelRef:`user`,x:40,y:226,width:288,height:135,labelBBox:{x:12,y:32,width:265,height:68}},{id:`azure`,parent:null,level:0,children:[`azure.rgNetwork`,`azure.rgVm`,`azure.rgData`,`azure.rgWeb`],inEdges:[`727wv2`],outEdges:[`1utcibo`],deploymentRef:`azure`,title:`Azure Subscription`,kind:`subscription`,notation:`Azure Subscription`,color:`muted`,shape:`rectangle`,icon:`azure:subscriptions`,description:{txt:`Managed by terraform — norwayeast unless noted`},tags:[],style:{opacity:5,size:`md`},depth:3,x:378,y:8,width:1074,height:2004,labelBBox:{x:6,y:0,width:128,height:15}},{id:`azure.rgNetwork`,parent:`azure`,level:1,children:[`azure.rgNetwork.pip`,`azure.rgNetwork.vnetMain`],inEdges:[`727wv2`],outEdges:[`199o5px`],deploymentRef:`azure.rgNetwork`,title:`rg-nygdev-network`,kind:`resource-group`,notation:`Resource Group`,color:`indigo`,shape:`rectangle`,icon:`azure:resource-groups`,tags:[],style:{opacity:10,size:`md`},depth:2,x:428,y:79,width:538,height:697,labelBBox:{x:6,y:0,width:131,height:15}},{id:`azure.rgNetwork.pip`,parent:`azure.rgNetwork`,level:2,children:[],inEdges:[`727wv2`],outEdges:[`199o5px`],deploymentRef:`azure.rgNetwork.pip`,title:`rpg-pip`,kind:`public-ip`,notation:`Public IP Address`,color:`indigo`,shape:`rectangle`,icon:`azure:public-ip-addresses`,description:{txt:`Static public IP, DNS label "rpg" — rpg.norwayeast.cloudapp.azure.com`},tags:[],style:{opacity:15,size:`md`},x:478,y:546,width:365,height:180,labelBBox:{x:46,y:56,width:304,height:65}},{id:`azure.rgNetwork.vnetMain`,parent:`azure.rgNetwork`,level:2,children:[`azure.rgNetwork.vnetMain.subnetRpg`],inEdges:[],outEdges:[],deploymentRef:`azure.rgNetwork.vnetMain`,title:`nygdev-vnet`,kind:`vnet`,technology:`10.0.0.0/24`,notation:`Virtual Network`,color:`indigo`,shape:`rectangle`,icon:`azure:virtual-networks`,tags:[],style:{opacity:5,size:`md`},depth:1,x:478,y:150,width:438,height:266,labelBBox:{x:6,y:0,width:83,height:15}},{id:`azure.rgNetwork.vnetMain.subnetRpg`,parent:`azure.rgNetwork.vnetMain`,level:3,children:[],inEdges:[],outEdges:[],deploymentRef:`azure.rgNetwork.vnetMain.subnetRpg`,title:`rpg-snet`,kind:`subnet`,technology:`10.0.0.0/29`,notation:`Subnet`,color:`indigo`,shape:`rectangle`,icon:`azure:subnet`,description:{txt:`NSG nygdev-nsg: 80/443 from anywhere; 22, 30000 and 30001 from the home IP only`},tags:[],style:{opacity:10,size:`md`},x:510,y:204,width:373,height:180,labelBBox:{x:46,y:37,width:312,height:102}},{id:`azure.rgVm`,parent:`azure`,level:1,children:[`azure.rgVm.rpgVm`],inEdges:[`199o5px`],outEdges:[`1g416jd`,`axilex`],deploymentRef:`azure.rgVm`,title:`rg-nygdev-vm`,kind:`resource-group`,notation:`Resource Group`,color:`indigo`,shape:`rectangle`,icon:`azure:resource-groups`,tags:[],style:{opacity:10,size:`md`},depth:2,x:680,y:827,width:516,height:729,labelBBox:{x:6,y:0,width:91,height:15}},{id:`azure.rgVm.rpgVm`,parent:`azure.rgVm`,level:2,children:[`azure.rgVm.rpgVm.caddyProc`,`azure.rgVm.rpgVm.foundryProc`],inEdges:[`199o5px`],outEdges:[`1g416jd`,`axilex`],deploymentRef:`azure.rgVm.rpgVm`,title:`rpg-vm`,kind:`vm`,technology:`Standard_B2s, Ubuntu 26.04 LTS minimal`,notation:`Virtual Machine`,color:`indigo`,shape:`rectangle`,icon:`azure:virtual-machine`,description:{txt:`30 GB StandardSSD OS disk, SSH key only, no VM agent and no\r
extensions. Configured entirely by cloud-init; auto-shutdown at\r
23:00 Oslo time.`},tags:[],style:{opacity:10,size:`md`},depth:1,x:712,y:880,width:452,height:644,labelBBox:{x:6,y:0,width:48,height:15}},{id:`azure.rgVm.rpgVm.caddyProc`,parent:`azure.rgVm.rpgVm`,level:3,children:[],inEdges:[`199o5px`],outEdges:[`1m336sa`],kind:`instance`,title:`Caddy`,description:{txt:`Reverse proxy and TLS termination on 80/443, for rpg.nygard.dev`},technology:`Caddy`,tags:[],color:`indigo`,shape:`rectangle`,style:{opacity:15,size:`md`},deploymentRef:`azure.rgVm.rpgVm.caddyProc`,modelRef:`rpg.caddy`,x:762,y:952,width:351,height:180,labelBBox:{x:19,y:46,width:315,height:84}},{id:`azure.rgVm.rpgVm.foundryProc`,parent:`azure.rgVm.rpgVm`,level:3,children:[],inEdges:[`1m336sa`],outEdges:[`1g416jd`,`axilex`],kind:`instance`,title:`Foundry VTT`,description:{txt:`Self-hosted virtual tabletop, running as srv_foundry off the foundrydata disk`},technology:`Node.js, listening on :30000`,tags:[],color:`indigo`,shape:`rectangle`,style:{opacity:15,size:`md`},deploymentRef:`azure.rgVm.rpgVm.foundryProc`,modelRef:`rpg.foundry`,x:778,y:1294,width:320,height:180,labelBBox:{x:30,y:47,width:260,height:84}},{id:`azure.rgData`,parent:`azure`,level:1,children:[`azure.rgData.foundryData`],inEdges:[`1g416jd`],outEdges:[],deploymentRef:`azure.rgData`,title:`rg-nygdev-data`,kind:`resource-group`,notation:`Resource Group`,color:`indigo`,shape:`rectangle`,icon:`azure:resource-groups`,description:{txt:`Persistent data — survives VM rebuilds`},tags:[],style:{opacity:10,size:`md`},depth:1,x:974,y:1665,width:428,height:265,labelBBox:{x:6,y:0,width:105,height:15}},{id:`azure.rgWeb`,parent:`azure`,level:1,children:[`azure.rgWeb.cdnStorage`],inEdges:[`axilex`],outEdges:[`1utcibo`],deploymentRef:`azure.rgWeb`,title:`rg-nygdev-web`,kind:`resource-group`,notation:`Resource Group`,color:`primary`,shape:`rectangle`,icon:`azure:resource-groups`,description:{txt:`Web front-ends. The Static Web Apps are in westeurope, Free SKU.`},tags:[],style:{opacity:10,size:`md`},depth:2,x:428,y:1612,width:496,height:350,labelBBox:{x:6,y:0,width:100,height:15}},{id:`azure.rgWeb.cdnStorage`,parent:`azure.rgWeb`,level:2,children:[`azure.rgWeb.cdnStorage.mediaContainer`],inEdges:[`axilex`],outEdges:[`1utcibo`],deploymentRef:`azure.rgWeb.cdnStorage`,title:`nygdevcdn`,kind:`blob-storage`,notation:`Storage Account`,color:`primary`,shape:`rectangle`,icon:`azure:storage-accounts`,tags:[],style:{opacity:10,size:`md`},depth:1,x:460,y:1665,width:432,height:265,labelBBox:{x:6,y:0,width:74,height:15}},{id:`azure.rgData.foundryData`,parent:`azure.rgData`,level:2,children:[],inEdges:[`1g416jd`],outEdges:[],deploymentRef:`azure.rgData.foundryData`,title:`foundrydata`,kind:`disk`,technology:`Azure Managed Disk, attached at LUN 0`,notation:`Managed Disk`,color:`indigo`,shape:`rectangle`,icon:`azure:disks`,description:{txt:`Worlds, modules, media, the Caddyfile and the Foundry install.\r
Referenced by terraform as a data source and attached, never\r
created — which is what lets the VM be destroyed and rebuilt.`},tags:[],style:{opacity:15,size:`md`},x:1006,y:1718,width:363,height:180,labelBBox:{x:46,y:20,width:302,height:138}},{id:`azure.rgWeb.cdnStorage.mediaContainer`,parent:`azure.rgWeb.cdnStorage`,level:3,children:[],inEdges:[`axilex`],outEdges:[`1utcibo`],deploymentRef:`azure.rgWeb.cdnStorage.mediaContainer`,title:`foundry`,kind:`storage-container`,notation:null,color:`primary`,shape:`storage`,modelRef:`cdn.foundryMedia`,icon:`azure:storage-container`,tags:[],style:{opacity:10,size:`md`},description:{txt:`Foundry VTT media, fetched straight by player browsers`},technology:`Storage Container`,x:492,y:1718,width:367,height:180,labelBBox:{x:46,y:47,width:306,height:84}}],edges:[{id:`727wv2`,parent:null,source:`internet.browser`,target:`azure.rgNetwork.pip`,label:`HTTPS to rpg.nygard.dev`,relations:[`1m90jbu`],color:`gray`,line:`dashed`,head:`normal`,points:[[277,361],[348,412],[449,484],[529,541]],labelBBox:{x:438,y:455,width:163,height:18}},{id:`199o5px`,parent:`azure`,source:`azure.rgNetwork.pip`,target:`azure.rgVm.rpgVm.caddyProc`,label:`Forwards 80/443 through rpg-snet`,relations:[`1jtxe5a`],color:`gray`,line:`dashed`,head:`normal`,points:[[722,726],[766,791],[826,877],[871,943]],labelBBox:{x:784,y:797,width:216,height:18}},{id:`1m336sa`,parent:`azure.rgVm.rpgVm`,source:`azure.rgVm.rpgVm.caddyProc`,target:`azure.rgVm.rpgVm.foundryProc`,label:`Reverse proxies to :30000`,relations:[`m5rxcy`],color:`gray`,line:`dashed`,head:`normal`,points:[[938,1131],[938,1178],[938,1236],[938,1284]],labelBBox:{x:939,y:1203,width:167,height:18}},{id:`1g416jd`,parent:`azure`,source:`azure.rgVm.rpgVm.foundryProc`,target:`azure.rgData.foundryData`,label:`Stores worlds, modules and media on the 
attached disk`,relations:[`1qntz4a`],color:`gray`,line:`dashed`,head:`normal`,points:[[991,1474],[1032,1543],[1088,1639],[1130,1710]],labelBBox:{x:1064,y:1565,width:262,height:35}},{id:`axilex`,parent:`azure`,source:`azure.rgVm.rpgVm.foundryProc`,target:`azure.rgWeb.cdnStorage.mediaContainer`,label:`Holds asset URLs pointing at`,relations:[`wja7lj`],color:`gray`,line:`dashed`,head:`normal`,points:[[883,1474],[840,1543],[781,1638],[737,1709]],labelBBox:{x:824,y:1574,width:185,height:18}},{id:`1utcibo`,parent:null,source:`azure.rgWeb.cdnStorage.mediaContainer`,target:`internet.browser`,label:`Serves media straight to the player 
browser`,relations:[`1bv5zgx`],color:`gray`,line:`dashed`,head:`normal`,points:[[501,1724],[380,1653],[240,1538],[240,1385],[240,635],[240,635],[240,635],[240,544],[220,440],[204,371]],labelBBox:{x:241,y:1023,width:220,height:35}}]},rpgTerraform:{_type:`element`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/rpg.c4`,description:{txt:`terraform/ is the only description of that machine that exists — there\r
is no console-built anything behind it — and Terraform Apply is the\r
only thing that can run it.\r
\r
That workflow is workflow_dispatch only, deliberately. There is no\r
plan step and no approval gate, so dispatching it by hand is the\r
decision point; a push to master does not rebuild a virtual machine on\r
its own.\r
\r
Two values it needs are not in the repository and are fetched at run\r
time from rg-nygdev-security: the home IP the NSG opens SSH and the\r
Foundry ports to, which is a secret in the vault, and the\r
nygdev-ed25519 public key the VM admin account is built with, which is\r
a resource of its own beside it. Neither is ever written to state as a\r
secret, and nothing in this picture holds an Azure credential — the\r
runner mints an OIDC token, Entra trades it for a short-lived access\r
token, and RBAC on that principal is the real blast radius.`},title:`How terraform creates the RPG server`,id:`rpgTerraform`,autoLayout:{direction:`LR`,nodeSep:110,rankSep:160},notation:{nodes:[{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Virtual Machine`,shape:`rectangle`,color:`indigo`,kinds:[`virtual-machine`]},{title:`CI Environment / Variables`,shape:`rectangle`,color:`amber`,kinds:[`ci-environment`]},{title:`CI/CD Platform`,shape:`rectangle`,color:`amber`,kinds:[`ci-platform`]},{title:`Entra App Registration`,shape:`rectangle`,color:`amber`,kinds:[`app-registration`]},{title:`External System`,shape:`rectangle`,color:`muted`,kinds:[`external-system`]},{title:`GitHub Actions Workflow`,shape:`rectangle`,color:`amber`,kinds:[`workflow`]},{title:`Identity Provider`,shape:`rectangle`,color:`muted`,kinds:[`identity-provider`]},{title:`Source Files (text)`,shape:`rectangle`,color:`amber`,kinds:[`source-files`]},{title:`Azure Key Vault`,shape:`storage`,color:`primary`,kinds:[`secret-store`]},{title:`Azure Storage Account`,shape:`storage`,color:`primary`,kinds:[`storage-account`]},{title:`Git Repository`,shape:`storage`,color:`amber`,kinds:[`repository`]}]},hash:`KpXnUBpcLvCR2_ODJgaiXsiSmkkyQFzk-Fz_BMLVdqg`,bounds:{x:0,y:0,width:2381,height:1187},nodes:[{id:`github`,parent:null,level:0,children:[`github.ghEnv`,`github.repo`,`github.actions`],inEdges:[`gi4fq6`,`1t587c0`],outEdges:[`1a53c2o`,`1yvzo3m`,`1e5h2dd`,`2l7si1`],title:`GitHub`,modelRef:`github`,shape:`rectangle`,color:`muted`,style:{opacity:20,size:`md`},description:{txt:`Source of truth and CI/CD control plane for the whole estate`},tags:[],notation:`External System`,technology:`github.com`,kind:`external-system`,depth:2,x:431,y:465,width:1238,height:603,labelBBox:{x:6,y:0,width:46,height:15}},{id:`entra`,parent:null,level:0,children:[`entra.ghOidc`],inEdges:[`1a53c2o`],outEdges:[`1t587c0`,`1oooyf4`],title:`Microsoft Entra ID`,modelRef:`entra`,shape:`rectangle`,color:`muted`,icon:`azure:external-identities`,style:{opacity:15,size:`md`},description:{txt:`The tenant behind both kinds of token in this estate: the short-lived\r
Azure access tokens the workflows run as, and the bearer tokens a person\r
signs in for on the training log. The registration for the second is\r
declared with journey four in model.c4.`},tags:[],notation:`Identity Provider`,technology:`External Identities`,kind:`identity-provider`,depth:1,x:1195,y:8,width:432,height:265,labelBBox:{x:6,y:0,width:125,height:15}},{id:`dev`,parent:null,level:0,children:[],inEdges:[],outEdges:[`gi4fq6`],title:`Developer`,modelRef:`dev`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Authors the model, the terraform and the function code, and pushes to master`},tags:[],notation:`Person`,kind:`actor`,x:0,y:816,width:320,height:180,labelBBox:{x:23,y:56,width:274,height:65}},{id:`github.ghEnv`,parent:`github`,level:1,children:[],inEdges:[],outEdges:[`4xbth`],title:`Environment "NygDevAzure"`,modelRef:`github.ghEnv`,shape:`rectangle`,color:`amber`,icon:`tech:github`,style:{opacity:15,size:`md`},description:{txt:`AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID,\r
AZURE_KEYVAULT_NAME, AZURE_VM_USERNAME, ENTRA_OWNER_OBJECTID.\r
Identifiers only — no credential is stored here.`},tags:[],notation:`CI Environment / Variables`,technology:`GitHub Actions environment`,kind:`ci-environment`,x:481,y:526,width:415,height:180,labelBBox:{x:46,y:19,width:353,height:139}},{id:`github.repo`,parent:`github`,level:1,children:[`github.repo.srcTf`],inEdges:[`gi4fq6`],outEdges:[`vn2k3d`],title:`NygDevAzure`,modelRef:`github.repo`,shape:`storage`,color:`amber`,icon:`tech:github`,style:{opacity:20,size:`md`},description:{txt:`Single repository; master is the deploy branch`},tags:[],notation:`Git Repository`,technology:`Github`,kind:`repository`,depth:1,x:471,y:763,width:435,height:265,labelBBox:{x:6,y:0,width:88,height:15}},{id:`github.repo.srcTf`,parent:`github.repo`,level:2,children:[],inEdges:[],outEdges:[`vn2k3d`],title:`terraform/**`,modelRef:`github.repo.srcTf`,shape:`rectangle`,color:`amber`,icon:`tech:git`,style:{opacity:15,size:`md`},description:{txt:`The Azure estate: resource groups, VNet, VM, storage, Cosmos, function apps, Key Vault`},tags:[],notation:`Source Files (text)`,technology:`Terraform HCL`,kind:`source-files`,x:504,y:816,width:370,height:180,labelBBox:{x:45,y:37,width:309,height:103}},{id:`github.actions`,parent:`github`,level:1,children:[`github.actions.tfApply`],inEdges:[`4xbth`,`vn2k3d`,`1t587c0`],outEdges:[`1a53c2o`,`1yvzo3m`,`1e5h2dd`,`2l7si1`],title:`GitHub Actions`,modelRef:`github.actions`,shape:`rectangle`,color:`amber`,icon:`tech:github-actions`,style:{opacity:15,size:`md`},description:{txt:`Every job declares id-token write and contents read, and\r
authenticates to Azure with azure/login@v3 over OIDC.`},tags:[],notation:`CI/CD Platform`,technology:`ubuntu-latest hosted runners`,kind:`ci-platform`,depth:1,x:1193,y:526,width:436,height:265,labelBBox:{x:6,y:0,width:99,height:15}},{id:`github.actions.tfApply`,parent:`github.actions`,level:2,children:[],inEdges:[`vn2k3d`],outEdges:[`1yvzo3m`,`1e5h2dd`,`2l7si1`],title:`Terraform Apply`,modelRef:`github.actions.tfApply`,shape:`rectangle`,color:`amber`,icon:`tech:github-actions`,style:{opacity:15,size:`md`},description:{txt:`Authenticates with ARM_USE_OIDC, fetches the home IP and the SSH\r
public key at run time, then terraform apply -auto-approve.\r
\r
Run by hand rather than on a push: there is no plan step and no\r
approval gate, so dispatching it is the decision point. Everything\r
this configuration manages can be recreated without data loss —\r
the Foundry disk and the Cosmos account are read or adopted, not\r
replaced. State is serialised by a terraform-apply concurrency\r
group.\r
\r
It also uploads the two gym JSON files, which is why editing an\r
exercise is an apply rather than a deploy: the provider notices the\r
checksum change and reuploads the blob.\r
\r
terraform-apply-gymbro.yml is the same configuration run under\r
-target for the planner Static Web App and the API app alone, so a\r
front-end change need not put the VM and the SQL server in its blast\r
radius. It plans before it applies, and it is narrower rather than\r
different — the caveat is that -target excludes dependents, so the\r
two role assignments hanging off the API app are not in its graph.\r
A plan there showing the app or its identity being replaced is the\r
signal to run this one instead.`},tags:[],notation:`GitHub Actions Workflow`,technology:`terraform-apply.yml — workflow_dispatch only`,kind:`workflow`,x:1225,y:579,width:372,height:180,labelBBox:{x:46,y:19,width:310,height:139}},{id:`entra.ghOidc`,parent:`entra`,level:1,children:[],inEdges:[`1a53c2o`],outEdges:[`1t587c0`,`1oooyf4`],title:`GitHub deploy identity`,modelRef:`entra.ghOidc`,shape:`rectangle`,color:`amber`,icon:`azure:app-registrations`,style:{opacity:15,size:`md`},description:{txt:`The AZURE_CLIENT_ID principal. Federated credentials trust\r
token.actions.githubusercontent.com for this repository and the\r
NygDevAzure environment, so there is no client secret to leak.\r
Managed outside terraform — it is the identity terraform runs as,\r
and RBAC on it is the real blast radius of a compromised workflow.`},tags:[],notation:`Entra App Registration`,technology:`Workload identity federation`,kind:`app-registration`,x:1227,y:61,width:368,height:180,labelBBox:{x:46,y:19,width:306,height:139}},{id:`tfstate`,parent:null,level:0,children:[],inEdges:[`1e5h2dd`],outEdges:[],title:`Terraform State`,modelRef:`tfstate`,shape:`storage`,color:`primary`,icon:`azure:storage-accounts`,style:{opacity:20,size:`md`},description:{txt:`nygdevtfstate / tfstate / azure-infrastructure.tfstate in rg-nygdev-data`},tags:[],notation:`Azure Storage Account`,technology:`Azure Blob Storage, AzureAD auth`,kind:`storage-account`,x:2038,y:697,width:325,height:180,labelBBox:{x:47,y:37,width:262,height:103}},{id:`keyvault`,parent:null,level:0,children:[],inEdges:[`2l7si1`],outEdges:[],title:`Key Vault`,modelRef:`keyvault`,shape:`storage`,color:`primary`,icon:`azure:key-vaults`,style:{opacity:15,size:`md`},description:{txt:`nygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\r
hand from the WHOOP developer dashboard, and whoop-token.\r
\r
The second is not configuration. WHOOP rotates the refresh token on\r
every use and the API writes the replacement straight back, so this is\r
where that state lives between calls — which is why the identity holds\r
Secrets Officer here rather than a reader role.\r
\r
Terraform Apply also reads HomeIP from here at run time, and the\r
nygdev-ed25519 SSH public key sits beside it as its own resource.`},tags:[],notation:`Azure Key Vault`,technology:`Azure Key Vault — standard, RBAC data plane`,kind:`secret-store`,x:2021,y:987,width:360,height:200,labelBBox:{x:46,y:29,width:298,height:139}},{id:`azurerm`,parent:null,level:0,children:[],inEdges:[`1yvzo3m`,`1oooyf4`],outEdges:[`ydc349`],title:`Azure Resource Manager`,modelRef:`azurerm`,shape:`rectangle`,color:`muted`,style:{opacity:20,size:`md`},description:{txt:`The Azure control plane. Terraform and the az CLI both reach the estate through it.`},tags:[],notation:`External System`,technology:`management.azure.com`,kind:`external-system`,x:2027,y:61,width:347,height:180,labelBBox:{x:18,y:46,width:312,height:85}},{id:`rpg`,parent:null,level:0,children:[],inEdges:[`ydc349`],outEdges:[],title:`RPG Server`,modelRef:`rpg`,shape:`rectangle`,color:`indigo`,icon:`azure:virtual-machine`,style:{opacity:25,size:`md`},description:{txt:`rpg-vm, behind the rpg-pip public IP. Built by terraform and\r
configured by cloud-init; worlds and media live on a separate disk\r
that survives the VM being rebuilt.`},tags:[],notation:`Azure Virtual Machine`,technology:`Azure Linux VM — Standard_B2s, Ubuntu 26.04 LTS minimal`,kind:`virtual-machine`,navigateTo:`rpg`,x:2026,y:407,width:350,height:180,labelBBox:{x:46,y:19,width:288,height:139}}],edges:[{id:`vn2k3d`,parent:`github`,source:`github.repo.srcTf`,target:`github.actions.tfApply`,label:`Change here is applied by`,relations:[`oezbcz`],color:`gray`,line:`dashed`,head:`normal`,tags:[`ci`],points:[[874,874],[958,857],[1058,833],[1145,802],[1175,791],[1206,777],[1236,763]],labelBBox:{x:977,y:780,width:167,height:18}},{id:`1yvzo3m`,parent:null,source:`github.actions.tfApply`,target:`azurerm`,label:`terraform apply -auto-approve`,relations:[`d12dc2`],color:`gray`,line:`dashed`,head:`normal`,points:[[1549,579],[1690,486],[1910,342],[2055,247]],labelBBox:{x:1714,y:300,width:189,height:18}},{id:`1oooyf4`,parent:null,source:`entra.ghOidc`,target:`azurerm`,label:`Authorises calls against (RBAC on the 
subscription)`,relations:[`1gq65y8`],color:`gray`,line:`dashed`,head:`normal`,points:[[1595,151],[1722,151],[1890,151],[2017,151]],labelBBox:{x:1688,y:112,width:241,height:35}},{id:`1e5h2dd`,parent:null,source:`github.actions.tfApply`,target:`tfstate`,label:`Locks and writes state`,relations:[`1rwdckr`],color:`gray`,line:`dashed`,head:`normal`,points:[[1597,697],[1727,716],[1900,742],[2027,761]],labelBBox:{x:1738,y:687,width:143,height:18}},{id:`2l7si1`,parent:null,source:`github.actions.tfApply`,target:`keyvault`,label:`Reads HomeIP, and the nygdev-ed25519 
public key beside it, at run time`,relations:[`1bqc84i`],color:`gray`,line:`dashed`,head:`normal`,points:[[1574,759],[1608,777],[1644,797],[1677,815],[1787,874],[1911,938],[2011,990]],labelBBox:{x:1678,y:776,width:262,height:35}},{id:`ydc349`,parent:null,source:`azurerm`,target:`rpg`,label:`Creates rpg-vm and its NIC, the public 
IP, the VNet, subnet and NSG, and 
attaches the foundrydata disk`,relations:[`182xnuw`],color:`gray`,line:`dashed`,head:`normal`,points:[[2201,241],[2201,289],[2201,348],[2201,397]],labelBBox:{x:2049,y:297,width:241,height:51}},{id:`gi4fq6`,parent:null,source:`dev`,target:`github.repo`,label:`git push (master)`,relations:[`1uxxodk`],color:`gray`,line:`dashed`,head:`normal`,points:[[320,906],[364,906],[413,906],[461,906]],labelBBox:{x:396,y:896,width:109,height:18}},{id:`4xbth`,parent:`github`,source:`github.ghEnv`,target:`github.actions`,label:`Supplies tenant, subscription and client 
ids to`,relations:[`158pzxy`],color:`gray`,line:`dashed`,head:`normal`,tags:[`ci`],points:[[896,631],[986,638],[1091,646],[1182,652]],labelBBox:{x:1046,y:604,width:247,height:34}},{id:`1a53c2o`,parent:null,source:`github.actions`,target:`entra.ghOidc`,label:`Presents the runner OIDC token 
(azure/login@v3)`,relations:[`14swp36`],color:`gray`,line:`dashed`,head:`normal`,tags:[`oidc`],points:[[1411,526],[1411,434],[1411,343],[1411,251]],labelBBox:{x:1206,y:385,width:204,height:35}},{id:`1t587c0`,parent:null,source:`entra.ghOidc`,target:`github.actions`,label:`Issues a short-lived Azure access token 
to`,relations:[`1a6a4e9`],color:`gray`,line:`dashed`,head:`normal`,tags:[`oidc`],points:[[1411,241],[1411,333],[1411,424],[1411,516]],labelBBox:{x:1412,y:385,width:251,height:34}}]},running:{_type:`element`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/running.c4`,description:{txt:`Journey two, end to end. The page itself is the simplest part of it:\r
it fetches one pre-built JSON document straight off the storage\r
account and draws the charts in it. No function is called, nothing is\r
computed in the browser, and there is no key anywhere in that path —\r
which is why the \`data\` container is anonymous-read.\r
\r
Everything else on this page happens hours before anyone visits. The\r
two jobs in the Integrations app are drawn separately because they are\r
separate:\r
one talks to WHOOP and writes to Cosmos, the other reads Cosmos and\r
writes a blob. They run on their own timers, a quarter of an hour\r
apart, so neither failure is reported as the other, and the build\r
only needs the sync to have finished rather than to have succeeded.\r
\r
The vault is on this page because the WHOOP leg does not work without\r
it: WHOOP rotates the refresh token on every renewal and kills the old\r
one immediately, so the token is state the Integrations app reads and\r
rewrites on\r
the same call, not configuration sitting in an app setting.\r
\`whoopRefresh\` is that exchange in order.\r
\r
\`runningPipeline\` is this same chain as a sequence.`},title:`run.nygard.dev — the running dashboard`,id:`running`,autoLayout:{direction:`LR`,nodeSep:110,rankSep:150},notation:{nodes:[{title:`Azure Static Web App`,shape:`browser`,color:`sky`,kinds:[`static-web-app`]},{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Function App`,shape:`rectangle`,color:`primary`,kinds:[`function-app`]},{title:`External System`,shape:`rectangle`,color:`muted`,kinds:[`external-system`]},{title:`Job / endpoint group`,shape:`rectangle`,color:`primary`,kinds:[`job`]},{title:`Azure Cosmos DB`,shape:`storage`,color:`primary`,kinds:[`cosmos-db`]},{title:`Azure Key Vault`,shape:`storage`,color:`primary`,kinds:[`secret-store`]},{title:`Azure Storage Account`,shape:`storage`,color:`primary`,kinds:[`storage-account`]},{title:`Blob Container`,shape:`storage`,color:`primary`,kinds:[`blob-container`]}]},hash:`vSIIGn0DuQz60Yl5KS18nvNTXiOS2hCtt9TGRxXoA5Y`,bounds:{x:0,y:0,width:1239,height:1447},nodes:[{id:`user`,parent:null,level:0,children:[],inEdges:[],outEdges:[`11x91p8`],title:`Visitor`,modelRef:`user`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],notation:`Person`,kind:`actor`,x:49,y:900,width:366,height:180,labelBBox:{x:18,y:29,width:330,height:119}},{id:`integrations`,parent:null,level:0,children:[`integrations.sync`,`integrations.dashboard`],inEdges:[],outEdges:[`wiveox`,`jq9a6b`,`4mmww`,`gf0tqb`,`diu6rh`],title:`Integrations`,modelRef:`integrations`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-integrations. Everything that feeds the estate from outside\r
it, split off from the API so that app could have its gate turned on.\r
Runs as id-nygdev-integrations, which reaches Cosmos, the vault and the\r
CDN account without holding a key or a connection string.\r
\r
Two jobs on schedules a quarter of an hour apart, drawn apart on\r
purpose: one talks to WHOOP, the other to Cosmos and blob storage, so\r
neither failure is reported as the other. Beside them sits the phone\r
location spool — /api/gps/locations, a push rather than a schedule,\r
writing db/gps.\r
\r
No Easy Auth here, and that is the point of the app rather than an\r
omission. The WHOOP callback has to be reachable by WHOOP, and the rest\r
carry function keys, so there is no token for a gate to validate.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,depth:1,x:8,y:259,width:449,height:571,labelBBox:{x:6,y:0,width:87,height:15}},{id:`running`,parent:null,level:0,children:[],inEdges:[`11x91p8`],outEdges:[`11swwcd`],title:`run.nygard.dev`,modelRef:`running`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevrun — the running and marathon dashboard. Provisioned empty by\r
terraform; content deployed from the nygdevweb repository.\r
\r
The page holds no logic of its own worth drawing: it fetches one\r
pre-built JSON document from the CDN account and draws the charts in\r
it. Nothing is computed here, and no function is called.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:57,y:1212,width:349,height:189,labelBBox:{x:47,y:24,width:287,height:139}},{id:`integrations.sync`,parent:`integrations`,level:1,children:[],inEdges:[],outEdges:[`wiveox`,`jq9a6b`,`4mmww`],title:`WHOOP sync`,modelRef:`integrations.sync`,shape:`rectangle`,color:`primary`,style:{opacity:40,size:`md`},description:{txt:`Walks WHOOP collections into Cosmos. Timer at 00:00, 06:00, 12:00\r
and 18:00 UTC; /api/whoop/sync is the same work on demand, and both\r
go through one runner holding one gate, so a manual call landing on\r
top of the scheduled run stands down rather than racing it.\r
\r
The first runs backfill history newest-first on a time budget, each\r
picking up where the last stopped. Once a collection runs out of\r
history every later run re-reads the last seven days instead —\r
WHOOP filters on start time, and a record it rescored keeps the\r
start it always had, so a "since last sync" query would never see\r
it again.`},tags:[],notation:`Job / endpoint group`,technology:`Timer + HTTP trigger, one shared gate`,kind:`job`,x:48,y:320,width:368,height:180,labelBBox:{x:18,y:19,width:332,height:139}},{id:`integrations.dashboard`,parent:`integrations`,level:1,children:[],inEdges:[],outEdges:[`gf0tqb`,`diu6rh`],title:`Dashboard build`,modelRef:`integrations.dashboard`,shape:`rectangle`,color:`primary`,style:{opacity:40,size:`md`},description:{txt:`Rebuilds the running dashboard from whatever is stored: pace by run\r
type, aerobic efficiency, weekly volume, acute:chronic workload,\r
weekly time in zones. Timer at 00:15, 06:15, 12:15 and 18:15 UTC —\r
fifteen minutes behind each sync, but not chained to it.\r
\r
It only needs the sync to have finished, not to have succeeded,\r
because it reads the stored runs rather than that run writes. The\r
build is a pure function of those runs and the day, so a slot that\r
finds nothing new republishes what is already there.\r
\r
/api/running/dashboard is the same build on demand, for a backfill\r
(where rebuilding after every sync call would be waste) or for a\r
change to the arithmetic, which reshapes the whole history.`},tags:[],notation:`Job / endpoint group`,technology:`Timer + HTTP trigger`,kind:`job`,x:56,y:610,width:351,height:180,labelBBox:{x:18,y:19,width:316,height:139}},{id:`whoop`,parent:null,level:0,children:[],inEdges:[`wiveox`],outEdges:[],title:`WHOOP`,modelRef:`whoop`,shape:`rectangle`,color:`muted`,style:{opacity:20,size:`md`},description:{txt:`Wearable platform, read-only to us and gated by an authorization code\r
grant. A person consents once and that yields a refresh token; every\r
refresh then rotates it, killing the old one the moment a new one is\r
issued. So the replacement has to be captured and stored, or the\r
integration locks itself out.`},tags:[],notation:`External System`,technology:`WHOOP API v2 — OAuth 2.0 + REST`,kind:`external-system`,x:853,y:0,width:344,height:180,labelBBox:{x:18,y:19,width:308,height:139}},{id:`keyvault`,parent:null,level:0,children:[],inEdges:[`jq9a6b`],outEdges:[],title:`Key Vault`,modelRef:`keyvault`,shape:`storage`,color:`primary`,icon:`azure:key-vaults`,style:{opacity:15,size:`md`},description:{txt:`nygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\r
hand from the WHOOP developer dashboard, and whoop-token.\r
\r
The second is not configuration. WHOOP rotates the refresh token on\r
every use and the API writes the replacement straight back, so this is\r
where that state lives between calls — which is why the identity holds\r
Secrets Officer here rather than a reader role.\r
\r
Terraform Apply also reads HomeIP from here at run time, and the\r
nygdev-ed25519 SSH public key sits beside it as its own resource.`},tags:[],notation:`Azure Key Vault`,technology:`Azure Key Vault — standard, RBAC data plane`,kind:`secret-store`,x:845,y:290,width:360,height:200,labelBBox:{x:46,y:29,width:298,height:139}},{id:`cosmos`,parent:null,level:0,children:[],inEdges:[`4mmww`,`gf0tqb`],outEdges:[],title:`Cosmos DB`,modelRef:`cosmos`,shape:`storage`,color:`primary`,icon:`azure:azure-cosmos-db`,style:{opacity:15,size:`md`},description:{txt:`nygdev-cosmos-db / db, one account holding three containers that share\r
nothing but the throughput. Local auth is off, so Entra role assignments\r
are the only way in, and each is scoped to a single container rather than\r
to the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\r
reaches \`primary\` and \`gps\`. So neither app can read what the other\r
writes, which matters most in one direction — \`gym\` is partitioned per\r
user and is the tenancy boundary.\r
\r
\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\r
training log, partitioned on /objectId — the signed-in caller, which is\r
what makes the partition key the tenancy boundary rather than a routing\r
detail. \`gps\` is the phone location spool on /sender, with a three-day\r
TTL.\r
\r
All three are indexed opt-in, /* excluded and only what is filtered on\r
included: /sport_name and /score_state on primary, for the dashboard\r
build reading scored runs; /type and /mesoId on gym, for History and the\r
block map. Excluding is doing the most work on gym, where the sets are\r
the bulk of a document and are never filtered on — which is what keeps a\r
set-tap costing the same on the thirtieth set as on the first.\r
\r
Session consistency, and the training log is what asked for it: log a\r
set, re-read the session, and on Eventual the replica that answers may\r
not hold it yet. On a single-region account it costs the same RU as\r
Eventual.`},tags:[],notation:`Azure Cosmos DB`,technology:`Azure Cosmos DB (NoSQL) — free tier`,kind:`cosmos-db`,x:840,y:600,width:370,height:200,labelBBox:{x:46,y:29,width:308,height:139}},{id:`cdn`,parent:null,level:0,children:[`cdn.dataContainer`],inEdges:[`11swwcd`,`diu6rh`],outEdges:[],title:`CDN Storage`,modelRef:`cdn`,shape:`storage`,color:`primary`,icon:`azure:storage-accounts`,style:{opacity:20,size:`md`},description:{txt:`One public account serving three unrelated things`},tags:[],notation:`Azure Storage Account`,technology:`Azure Blob Storage — nygdevcdn`,kind:`storage-account`,depth:1,x:820,y:1154,width:411,height:285,labelBBox:{x:6,y:0,width:85,height:15}},{id:`cdn.dataContainer`,parent:`cdn`,level:1,children:[],inEdges:[`11swwcd`,`diu6rh`],outEdges:[],title:`data`,modelRef:`cdn.dataContainer`,shape:`storage`,color:`primary`,icon:`azure:storage-container`,style:{opacity:15,size:`md`},description:{txt:`Three files, published by two different things.\r
\r
marathonprep.json is the built running dashboard, written by the\r
Integrations app and rewritten in place on every build, carrying a five-minute\r
Cache-Control so each rebuild reaches the page well before the next\r
one runs.\r
\r
gym-exercises.json and gym-templates.json are the exercise library and\r
the built-in day templates. They are not written by anything at run\r
time — they are files in the repository that terraform uploads, so\r
editing one is an apply rather than a deploy. They are here rather\r
than in Cosmos because they are identical for every account and change\r
when the app ships: served per account they would cost a function\r
invocation, a token and an RU to hand back the same objects. Cached\r
for a day, which is also the worst case for a new exercise reaching a\r
phone that has already loaded the app.\r
\r
Anonymous read is what lets all three be fetched with no key, no token\r
and no function call in between. The gym fetches deliberately send no\r
Authorization header either: adding one would turn a simple\r
cross-origin GET into a preflight this endpoint has no CORS rule for.`},tags:[],notation:`Blob Container`,technology:`Anonymous blob read; the container cannot be listed`,kind:`blob-container`,x:852,y:1207,width:346,height:200,labelBBox:{x:46,y:29,width:285,height:139}}],edges:[{id:`11x91p8`,parent:null,source:`user`,target:`running`,label:`Visits https://run.nygard.dev`,relations:[`yykv63`],color:`gray`,line:`dashed`,head:`normal`,points:[[232,1080],[232,1118],[232,1162],[232,1202]],labelBBox:{x:129,y:1136,width:177,height:18}},{id:`wiveox`,parent:null,source:`integrations.sync`,target:`whoop`,label:`Refreshes the access token, then pages 
cycles, sleep, workouts and recovery`,relations:[`1hjsar6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`scheduled`],points:[[416,336],[545,284],[716,215],[844,163]],labelBBox:{x:501,y:164,width:254,height:35}},{id:`jq9a6b`,parent:null,source:`integrations.sync`,target:`keyvault`,label:`Reads whoop-clientsecret; reads and 
rewrites the rotating whoop-token`,relations:[`1pqr4t6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[416,405],[542,402],[707,398],[834,395]],labelBBox:{x:511,y:358,width:235,height:35}},{id:`4mmww`,parent:null,source:`integrations.sync`,target:`cosmos`,label:`Upserts each record on its WHOOP id, and 
one sync cursor per collection`,relations:[`1nhxbki`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[416,477],[540,522],[703,582],[830,629]],labelBBox:{x:493,y:473,width:272,height:35}},{id:`gf0tqb`,parent:null,source:`integrations.dashboard`,target:`cosmos`,label:`Queries the scored running workouts back 
out (the only query in the model)`,relations:[`gm16oi`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[408,717],[436,719],[465,720],[492,722],[613,727],[644,727],[765,722],[786,721],[808,719],[829,718]],labelBBox:{x:495,y:683,width:266,height:35}},{id:`11swwcd`,parent:null,source:`running`,target:`cdn.dataContainer`,label:`Fetches the built dashboard from the 
page (GET data/marathonprep.json)`,relations:[`ziwldx`],color:`gray`,line:`dashed`,head:`normal`,points:[[407,1307],[535,1307],[710,1307],[841,1307]],labelBBox:{x:512,y:1268,width:232,height:35}},{id:`diu6rh`,parent:null,source:`integrations.dashboard`,target:`cdn.dataContainer`,label:`Publishes marathonprep.json (PUT, in 
place)`,relations:[`1dvvjn1`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],points:[[377,790],[403,808],[431,827],[457,845],[615,961],[790,1105],[903,1202]],labelBBox:{x:508,y:842,width:241,height:34}}]},runningPipeline:{_type:`dynamic`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/running.c4`,description:{txt:`The same chain as \`running\`, in the order it actually happens. Steps\r
one to six are the sync, on the timer at 00:00, 06:00, 12:00 and 18:00\r
UTC. Seven and eight are the build, fifteen minutes later on a timer\r
of its own. Nine and ten are whenever somebody visits, which is\r
unrelated to either.\r
\r
The middle is where the care is. WHOOP kills the old refresh token the\r
instant it issues a new one, so the reply to step two is the only copy\r
of the replacement that will ever exist — step four writes it to the\r
vault before the access token is spent on anything. A rotation that\r
succeeds at WHOOP and fails to persist locks the integration out until\r
someone re-runs the consent by hand.\r
\r
Step six upserts on the id WHOOP itself gives a record, which is what\r
makes re-reading a week free of duplicates, and writes one cursor per\r
collection beside it — that is the whole reason a run can stop on a\r
budget and a later one pick it up.`},title:`How WHOOP data reaches run.nygard.dev`,id:`runningPipeline`,variant:`diagram`,flow:[`step-01`,`step-02`,`step-03`,`step-04`,`step-05`,`step-06`,`step-07`,`step-08`,`step-09`,`step-10`],autoLayout:{direction:`TB`},notation:{nodes:[{title:`Azure Static Web App`,shape:`browser`,color:`sky`,kinds:[`static-web-app`]},{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`External System`,shape:`rectangle`,color:`muted`,kinds:[`external-system`]},{title:`Job / endpoint group`,shape:`rectangle`,color:`primary`,kinds:[`job`]},{title:`Azure Cosmos DB`,shape:`storage`,color:`primary`,kinds:[`cosmos-db`]},{title:`Azure Key Vault`,shape:`storage`,color:`primary`,kinds:[`secret-store`]},{title:`Blob Container`,shape:`storage`,color:`primary`,kinds:[`blob-container`]}]},hash:`YcCP7HInq2fZwZEIJDcr9DandEq8-7klhOUjo2JDzNY`,sequenceLayout:{actors:[{id:`integrations.sync`,x:0,y:0,width:368,height:180,ports:[{id:`step-01_source`,cx:184,cy:270,height:40,type:`source`,position:`right`},{id:`step-02_source`,cx:184,cy:387,height:40,type:`source`,position:`right`},{id:`step-03_target`,cx:184,cy:504,height:24,type:`target`,position:`right`},{id:`step-04_source`,cx:184,cy:621,height:40,type:`source`,position:`right`},{id:`step-05_source`,cx:184,cy:738,height:40,type:`source`,position:`right`},{id:`step-06_source`,cx:184,cy:855,height:40,type:`source`,position:`right`}]},{id:`keyvault`,x:448,y:-10,width:360,height:200,ports:[{id:`step-01_target`,cx:180,cy:280,height:24,type:`target`,position:`left`},{id:`step-04_target`,cx:180,cy:631,height:24,type:`target`,position:`left`}]},{id:`whoop`,x:888,y:0,width:344,height:180,ports:[{id:`step-02_target`,cx:172,cy:387,height:24,type:`target`,position:`left`},{id:`step-03_source`,cx:172,cy:504,height:40,type:`source`,position:`left`},{id:`step-05_target`,cx:172,cy:738,height:24,type:`target`,position:`left`}]},{id:`integrations.dashboard`,x:1312,y:0,width:351,height:180,ports:[{id:`step-07_source`,cx:176,cy:972,height:40,type:`source`,position:`right`},{id:`step-08_source`,cx:176,cy:1089,height:40,type:`source`,position:`right`}]},{id:`cosmos`,x:1743,y:-10,width:370,height:200,ports:[{id:`step-06_target`,cx:185,cy:865,height:24,type:`target`,position:`left`},{id:`step-07_target`,cx:185,cy:982,height:24,type:`target`,position:`left`}]},{id:`cdn.dataContainer`,x:2193,y:-10,width:346,height:200,ports:[{id:`step-08_target`,cx:173,cy:1099,height:24,type:`target`,position:`left`},{id:`step-10_target`,cx:173,cy:1319,height:24,type:`target`,position:`right`}]},{id:`user`,x:2619,y:0,width:366,height:180,ports:[{id:`step-09_source`,cx:183,cy:1206,height:40,type:`source`,position:`right`}]},{id:`running`,x:3065,y:-5,width:349,height:189,ports:[{id:`step-09_target`,cx:175,cy:1211,height:24,type:`target`,position:`left`},{id:`step-10_source`,cx:175,cy:1314,height:40,type:`source`,position:`left`}]}],compounds:[],steps:[{id:`step-01`,sourceHandle:`step-01_source`,targetHandle:`step-01_target`,labelBBox:{width:296,height:43}},{id:`step-02`,sourceHandle:`step-02_source`,targetHandle:`step-02_target`,labelBBox:{width:277,height:43}},{id:`step-03`,sourceHandle:`step-03_source`,targetHandle:`step-03_target`,labelBBox:{width:291,height:43}},{id:`step-04`,sourceHandle:`step-04_source`,targetHandle:`step-04_target`,labelBBox:{width:257,height:43}},{id:`step-05`,sourceHandle:`step-05_source`,targetHandle:`step-05_target`,labelBBox:{width:257,height:43}},{id:`step-06`,sourceHandle:`step-06_source`,targetHandle:`step-06_target`,labelBBox:{width:282,height:43}},{id:`step-07`,sourceHandle:`step-07_source`,targetHandle:`step-07_target`,labelBBox:{width:246,height:43}},{id:`step-08`,sourceHandle:`step-08_source`,targetHandle:`step-08_target`,labelBBox:{width:268,height:43}},{id:`step-09`,sourceHandle:`step-09_source`,targetHandle:`step-09_target`,labelBBox:{width:249,height:29}},{id:`step-10`,sourceHandle:`step-10_source`,targetHandle:`step-10_target`,labelBBox:{width:292,height:59}}],parallelAreas:[],subflows:[],bounds:{x:0,y:0,width:3414,height:1418}},bounds:{x:0,y:0,width:3094,height:918},nodes:[{id:`integrations.sync`,parent:null,level:0,children:[],inEdges:[`step-03`],outEdges:[`step-01`,`step-02`,`step-04`,`step-05`,`step-06`],title:`WHOOP sync`,modelRef:`integrations.sync`,shape:`rectangle`,color:`primary`,style:{opacity:40,size:`md`},description:{txt:`Walks WHOOP collections into Cosmos. Timer at 00:00, 06:00, 12:00\r
and 18:00 UTC; /api/whoop/sync is the same work on demand, and both\r
go through one runner holding one gate, so a manual call landing on\r
top of the scheduled run stands down rather than racing it.\r
\r
The first runs backfill history newest-first on a time budget, each\r
picking up where the last stopped. Once a collection runs out of\r
history every later run re-reads the last seven days instead —\r
WHOOP filters on start time, and a record it rescored keeps the\r
start it always had, so a "since last sync" query would never see\r
it again.`},tags:[],notation:`Job / endpoint group`,technology:`Timer + HTTP trigger, one shared gate`,kind:`job`,x:826,y:0,width:368,height:180,labelBBox:{x:18,y:19,width:332,height:139}},{id:`keyvault`,parent:null,level:0,children:[],inEdges:[`step-01`,`step-04`],outEdges:[],title:`Key Vault`,modelRef:`keyvault`,shape:`storage`,color:`primary`,icon:`azure:key-vaults`,style:{opacity:15,size:`md`},description:{txt:`nygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\r
hand from the WHOOP developer dashboard, and whoop-token.\r
\r
The second is not configuration. WHOOP rotates the refresh token on\r
every use and the API writes the replacement straight back, so this is\r
where that state lives between calls — which is why the identity holds\r
Secrets Officer here rather than a reader role.\r
\r
Terraform Apply also reads HomeIP from here at run time, and the\r
nygdev-ed25519 SSH public key sits beside it as its own resource.`},tags:[],notation:`Azure Key Vault`,technology:`Azure Key Vault — standard, RBAC data plane`,kind:`secret-store`,x:62,y:346,width:360,height:200,labelBBox:{x:46,y:29,width:298,height:139}},{id:`whoop`,parent:null,level:0,children:[],inEdges:[`step-02`,`step-05`],outEdges:[`step-03`],title:`WHOOP`,modelRef:`whoop`,shape:`rectangle`,color:`muted`,style:{opacity:20,size:`md`},description:{txt:`Wearable platform, read-only to us and gated by an authorization code\r
grant. A person consents once and that yields a refresh token; every\r
refresh then rotates it, killing the old one the moment a new one is\r
issued. So the replacement has to be captured and stored, or the\r
integration locks itself out.`},tags:[],notation:`External System`,technology:`WHOOP API v2 — OAuth 2.0 + REST`,kind:`external-system`,x:1032,y:356,width:344,height:180,labelBBox:{x:18,y:19,width:308,height:139}},{id:`integrations.dashboard`,parent:null,level:0,children:[],inEdges:[],outEdges:[`step-07`,`step-08`],title:`Dashboard build`,modelRef:`integrations.dashboard`,shape:`rectangle`,color:`primary`,style:{opacity:40,size:`md`},description:{txt:`Rebuilds the running dashboard from whatever is stored: pace by run\r
type, aerobic efficiency, weekly volume, acute:chronic workload,\r
weekly time in zones. Timer at 00:15, 06:15, 12:15 and 18:15 UTC —\r
fifteen minutes behind each sync, but not chained to it.\r
\r
It only needs the sync to have finished, not to have succeeded,\r
because it reads the stored runs rather than that run writes. The\r
build is a pure function of those runs and the day, so a slot that\r
finds nothing new republishes what is already there.\r
\r
/api/running/dashboard is the same build on demand, for a backfill\r
(where rebuilding after every sync call would be waste) or for a\r
change to the arithmetic, which reshapes the whole history.`},tags:[],notation:`Job / endpoint group`,technology:`Timer + HTTP trigger`,kind:`job`,x:2469,y:0,width:351,height:180,labelBBox:{x:18,y:19,width:316,height:139}},{id:`cosmos`,parent:null,level:0,children:[],inEdges:[`step-06`,`step-07`],outEdges:[],title:`Cosmos DB`,modelRef:`cosmos`,shape:`storage`,color:`primary`,icon:`azure:azure-cosmos-db`,style:{opacity:15,size:`md`},description:{txt:`nygdev-cosmos-db / db, one account holding three containers that share\r
nothing but the throughput. Local auth is off, so Entra role assignments\r
are the only way in, and each is scoped to a single container rather than\r
to the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\r
reaches \`primary\` and \`gps\`. So neither app can read what the other\r
writes, which matters most in one direction — \`gym\` is partitioned per\r
user and is the tenancy boundary.\r
\r
\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\r
training log, partitioned on /objectId — the signed-in caller, which is\r
what makes the partition key the tenancy boundary rather than a routing\r
detail. \`gps\` is the phone location spool on /sender, with a three-day\r
TTL.\r
\r
All three are indexed opt-in, /* excluded and only what is filtered on\r
included: /sport_name and /score_state on primary, for the dashboard\r
build reading scored runs; /type and /mesoId on gym, for History and the\r
block map. Excluding is doing the most work on gym, where the sets are\r
the bulk of a document and are never filtered on — which is what keeps a\r
set-tap costing the same on the thirtieth set as on the first.\r
\r
Session consistency, and the training log is what asked for it: log a\r
set, re-read the session, and on Eventual the replica that answers may\r
not hold it yet. On a single-region account it costs the same RU as\r
Eventual.`},tags:[],notation:`Azure Cosmos DB`,technology:`Azure Cosmos DB (NoSQL) — free tier`,kind:`cosmos-db`,x:1791,y:346,width:370,height:200,labelBBox:{x:46,y:29,width:308,height:139}},{id:`cdn.dataContainer`,parent:null,level:0,children:[],inEdges:[`step-08`,`step-10`],outEdges:[],title:`data`,modelRef:`cdn.dataContainer`,shape:`storage`,color:`primary`,icon:`azure:storage-container`,style:{opacity:15,size:`md`},description:{txt:`Three files, published by two different things.\r
\r
marathonprep.json is the built running dashboard, written by the\r
Integrations app and rewritten in place on every build, carrying a five-minute\r
Cache-Control so each rebuild reaches the page well before the next\r
one runs.\r
\r
gym-exercises.json and gym-templates.json are the exercise library and\r
the built-in day templates. They are not written by anything at run\r
time — they are files in the repository that terraform uploads, so\r
editing one is an apply rather than a deploy. They are here rather\r
than in Cosmos because they are identical for every account and change\r
when the app ships: served per account they would cost a function\r
invocation, a token and an RU to hand back the same objects. Cached\r
for a day, which is also the worst case for a new exercise reaching a\r
phone that has already loaded the app.\r
\r
Anonymous read is what lets all three be fetched with no key, no token\r
and no function call in between. The gym fetches deliberately send no\r
Authorization header either: adding one would turn a simple\r
cross-origin GET into a preflight this endpoint has no CORS rule for.`},tags:[],notation:`Blob Container`,technology:`Anonymous blob read; the container cannot be listed`,kind:`blob-container`,x:2747,y:346,width:346,height:200,labelBBox:{x:46,y:29,width:285,height:139}},{id:`user`,parent:null,level:0,children:[],inEdges:[],outEdges:[`step-09`],title:`Visitor`,modelRef:`user`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],notation:`Person`,kind:`actor`,x:2271,y:356,width:366,height:180,labelBBox:{x:18,y:29,width:330,height:119}},{id:`running`,parent:null,level:0,children:[],inEdges:[`step-09`],outEdges:[`step-10`],title:`run.nygard.dev`,modelRef:`running`,shape:`browser`,color:`sky`,icon:`azure:static-apps`,style:{opacity:15,size:`md`},description:{txt:`nygdevrun — the running and marathon dashboard. Provisioned empty by\r
terraform; content deployed from the nygdevweb repository.\r
\r
The page holds no logic of its own worth drawing: it fetches one\r
pre-built JSON document from the CDN account and draws the charts in\r
it. Nothing is computed here, and no function is called.`},tags:[],notation:`Azure Static Web App`,technology:`Azure Static Web App — Free SKU, westeurope`,kind:`static-web-app`,x:2459,y:728,width:349,height:189,labelBBox:{x:47,y:24,width:287,height:139}}],edges:[{id:`step-01`,parent:null,source:`integrations.sync`,target:`keyvault`,label:`Reads whoop-clientsecret and the stored 
refresh token`,relations:[`1pqr4t6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@0`,points:[[826,91],[568,96],[118,121],[16,240],[-18,280],[8,320],[53,353]],labelBBox:{x:25,y:244,width:280,height:35}},{id:`step-02`,parent:null,source:`integrations.sync`,target:`whoop`,label:`refresh_token grant, re-requesting the 
offline scope`,relations:[`1hjsar6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`scheduled`],astPath:`/steps@1`,points:[[826,180],[788,210],[767,247],[793,286],[845,361],[938,401],[1022,422]],labelBBox:{x:802,y:244,width:261,height:35}},{id:`step-03`,parent:null,source:`whoop`,target:`integrations.sync`,label:`A new access token, and a rotated 
refresh token — the old one is now dead`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@2`,dir:`back`,points:[[1064,189],[1093,241],[1128,305],[1156,356]],labelBBox:{x:1122,y:244,width:275,height:35}},{id:`step-04`,parent:null,source:`integrations.sync`,target:`keyvault`,label:`Writes the replacement, before the 
access token is used for anything`,relations:[`1pqr4t6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@3`,points:[[826,127],[726,150],[603,187],[501,240],[450,266],[399,303],[356,339]],labelBBox:{x:510,y:244,width:241,height:35}},{id:`step-05`,parent:null,source:`integrations.sync`,target:`whoop`,label:`Pages cycles, sleep, workouts and 
recovery, 25 records at a time`,relations:[`1hjsar6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`scheduled`],astPath:`/steps@4`,points:[[1194,109],[1280,127],[1375,165],[1428,240],[1459,284],[1431,325],[1385,358]],labelBBox:{x:1450,y:244,width:241,height:35}},{id:`step-06`,parent:null,source:`integrations.sync`,target:`cosmos`,label:`Upserts each record on its WHOOP id, 
then saves the cursor`,relations:[`1nhxbki`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@5`,points:[[1195,106],[1343,123],[1554,160],[1722,240],[1774,265],[1825,302],[1867,338]],labelBBox:{x:1808,y:244,width:266,height:35}},{id:`step-07`,parent:null,source:`integrations.dashboard`,target:`cosmos`,label:`Fifteen minutes later: queries the 
scored running workouts`,relations:[`gm16oi`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@6`,points:[[2481,180],[2419,213],[2347,251],[2282,286],[2244,306],[2203,327],[2164,348]],labelBBox:{x:2371,y:244,width:230,height:35}},{id:`step-08`,parent:null,source:`integrations.dashboard`,target:`cdn.dataContainer`,label:`Publishes marathonprep.json, with a 
five-minute cache lifetime`,relations:[`1dvvjn1`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@7`,points:[[2714,180],[2751,227],[2797,286],[2836,336]],labelBBox:{x:2800,y:244,width:252,height:35}},{id:`step-09`,parent:null,source:`user`,target:`running`,label:`Opens run.nygard.dev, whenever`,relations:[`yykv63`],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@8`,points:[[2454,536],[2456,578],[2464,627],[2484,668],[2493,687],[2505,704],[2519,721]],labelBBox:{x:2493,y:624,width:233,height:21}},{id:`step-10`,parent:null,source:`running`,target:`cdn.dataContainer`,label:`The page fetches the published JSON 
directly — anonymous, no function in the 
path`,relations:[`ziwldx`],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@9`,dir:`back`,points:[[2839,555],[2812,591],[2782,631],[2753,668],[2739,688],[2723,708],[2707,728]],labelBBox:{x:2809,y:610,width:276,height:51}}]},whoopRefresh:{_type:`dynamic`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/running.c4`,description:{txt:`The steady state, once the vault holds a refresh token. No person and\r
no browser: the app renews on its own and the visitor never appears.\r
\r
The ordering in the middle is the whole point, and is why the identity\r
holds Key Vault Secrets Officer rather than a reader role. It is also\r
why the app refuses to refresh twice at once, and why it re-requests\r
the offline scope every time — without that scope WHOOP returns an\r
access token and no replacement, and that refresh would be the last\r
one that ever worked.`},title:`WHOOP refresh — spending and replacing the token`,id:`whoopRefresh`,variant:`diagram`,flow:[`step-01`,`step-02`,`step-03`,`step-04`,`step-05`,`step-06`],autoLayout:{direction:`TB`},notation:{nodes:[{title:`Azure Function App`,shape:`rectangle`,color:`primary`,kinds:[`function-app`]},{title:`External System`,shape:`rectangle`,color:`muted`,kinds:[`external-system`]},{title:`Azure Key Vault`,shape:`storage`,color:`primary`,kinds:[`secret-store`]}]},hash:`tKONc-q5CSouESlTowJ8DOjK5YPbJIhS8hlFikngAMU`,sequenceLayout:{actors:[{id:`integrations`,x:0,y:0,width:350,height:180,ports:[{id:`step-01_source`,cx:175,cy:270,height:40,type:`source`,position:`right`},{id:`step-02_source`,cx:175,cy:387,height:40,type:`source`,position:`right`},{id:`step-03_target`,cx:175,cy:504,height:24,type:`target`,position:`right`},{id:`step-04_source`,cx:175,cy:621,height:40,type:`source`,position:`right`},{id:`step-05_source`,cx:175,cy:738,height:40,type:`source`,position:`right`},{id:`step-06_target`,cx:175,cy:840,height:24,type:`target`,position:`right`}]},{id:`keyvault`,x:430,y:-10,width:360,height:200,ports:[{id:`step-01_target`,cx:180,cy:280,height:24,type:`target`,position:`left`},{id:`step-04_target`,cx:180,cy:631,height:24,type:`target`,position:`left`}]},{id:`whoop`,x:870,y:0,width:344,height:180,ports:[{id:`step-02_target`,cx:172,cy:387,height:24,type:`target`,position:`left`},{id:`step-03_source`,cx:172,cy:504,height:40,type:`source`,position:`left`},{id:`step-05_target`,cx:172,cy:738,height:24,type:`target`,position:`left`},{id:`step-06_source`,cx:172,cy:840,height:40,type:`source`,position:`left`}]}],compounds:[],steps:[{id:`step-01`,sourceHandle:`step-01_source`,targetHandle:`step-01_target`,labelBBox:{width:301,height:43}},{id:`step-02`,sourceHandle:`step-02_source`,targetHandle:`step-02_target`,labelBBox:{width:277,height:43}},{id:`step-03`,sourceHandle:`step-03_source`,targetHandle:`step-03_target`,labelBBox:{width:293,height:43}},{id:`step-04`,sourceHandle:`step-04_source`,targetHandle:`step-04_target`,labelBBox:{width:251,height:43}},{id:`step-05`,sourceHandle:`step-05_source`,targetHandle:`step-05_target`,labelBBox:{width:292,height:28}},{id:`step-06`,sourceHandle:`step-06_source`,targetHandle:`step-06_target`,labelBBox:{width:299,height:43}}],parallelAreas:[],subflows:[],bounds:{x:0,y:0,width:1214,height:933}},bounds:{x:0,y:0,width:2140,height:546},nodes:[{id:`integrations`,parent:null,level:0,children:[],inEdges:[`step-03`,`step-06`],outEdges:[`step-01`,`step-02`,`step-04`,`step-05`],title:`Integrations`,modelRef:`integrations`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-integrations. Everything that feeds the estate from outside\r
it, split off from the API so that app could have its gate turned on.\r
Runs as id-nygdev-integrations, which reaches Cosmos, the vault and the\r
CDN account without holding a key or a connection string.\r
\r
Two jobs on schedules a quarter of an hour apart, drawn apart on\r
purpose: one talks to WHOOP, the other to Cosmos and blob storage, so\r
neither failure is reported as the other. Beside them sits the phone\r
location spool — /api/gps/locations, a push rather than a schedule,\r
writing db/gps.\r
\r
No Easy Auth here, and that is the point of the app rather than an\r
omission. The WHOOP callback has to be reachable by WHOOP, and the rest\r
carry function keys, so there is no token for a gate to validate.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,x:833,y:0,width:350,height:180,labelBBox:{x:46,y:19,width:288,height:139}},{id:`keyvault`,parent:null,level:0,children:[],inEdges:[`step-01`,`step-04`],outEdges:[],title:`Key Vault`,modelRef:`keyvault`,shape:`storage`,color:`primary`,icon:`azure:key-vaults`,style:{opacity:15,size:`md`},description:{txt:`nygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\r
hand from the WHOOP developer dashboard, and whoop-token.\r
\r
The second is not configuration. WHOOP rotates the refresh token on\r
every use and the API writes the replacement straight back, so this is\r
where that state lives between calls — which is why the identity holds\r
Secrets Officer here rather than a reader role.\r
\r
Terraform Apply also reads HomeIP from here at run time, and the\r
nygdev-ed25519 SSH public key sits beside it as its own resource.`},tags:[],notation:`Azure Key Vault`,technology:`Azure Key Vault — standard, RBAC data plane`,kind:`secret-store`,x:65,y:346,width:360,height:200,labelBBox:{x:46,y:29,width:298,height:139}},{id:`whoop`,parent:null,level:0,children:[],inEdges:[`step-02`,`step-05`],outEdges:[`step-03`,`step-06`],title:`WHOOP`,modelRef:`whoop`,shape:`rectangle`,color:`muted`,style:{opacity:20,size:`md`},description:{txt:`Wearable platform, read-only to us and gated by an authorization code\r
grant. A person consents once and that yields a refresh token; every\r
refresh then rotates it, killing the old one the moment a new one is\r
issued. So the replacement has to be captured and stored, or the\r
integration locks itself out.`},tags:[],notation:`External System`,technology:`WHOOP API v2 — OAuth 2.0 + REST`,kind:`external-system`,x:1233,y:356,width:344,height:180,labelBBox:{x:18,y:19,width:308,height:139}}],edges:[{id:`step-01`,parent:null,source:`integrations`,target:`keyvault`,label:`Reads whoop-clientsecret and the current 
whoop-token`,relations:[`1pqr4t6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@0`,points:[[833,91],[577,95],[119,120],[16,240],[-19,281],[9,321],[56,355]],labelBBox:{x:25,y:244,width:285,height:35}},{id:`step-02`,parent:null,source:`integrations`,target:`whoop`,label:`refresh_token grant, re-requesting the 
offline scope`,relations:[`1hjsar6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`scheduled`],astPath:`/steps@1`,points:[[833,174],[788,206],[761,245],[792,286],[845,354],[1062,398],[1223,422]],labelBBox:{x:801,y:244,width:261,height:35}},{id:`step-03`,parent:null,source:`whoop`,target:`integrations`,label:`New access token, and a rotated refresh 
token — the old one is now dead`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@2`,dir:`back`,points:[[1086,188],[1114,220],[1148,256],[1181,286],[1208,310],[1239,334],[1269,356]],labelBBox:{x:1190,y:244,width:277,height:35}},{id:`step-04`,parent:null,source:`integrations`,target:`keyvault`,label:`Writes the rotated token as a new 
version of whoop-token`,relations:[`1pqr4t6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@3`,points:[[833,125],[733,149],[608,186],[505,240],[453,266],[403,304],[360,339]],labelBBox:{x:514,y:244,width:235,height:35}},{id:`step-05`,parent:null,source:`integrations`,target:`whoop`,label:`Calls the data API with the access token`,relations:[`1hjsar6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`scheduled`],astPath:`/steps@4`,points:[[1183,122],[1306,148],[1456,189],[1494,240],[1518,272],[1508,311],[1488,347]],labelBBox:{x:1517,y:250,width:276,height:20}},{id:`step-06`,parent:null,source:`whoop`,target:`integrations`,label:`Answers, and the access token is cached 
until it nears expiry`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@5`,dir:`back`,points:[[1193,98],[1409,111],[1745,146],[1824,240],[1906,338],[1726,393],[1577,421]],labelBBox:{x:1854,y:244,width:283,height:35}}]},whoopBootstrap:{_type:`dynamic`,tags:null,links:null,_stage:`layouted`,sourcePath:`src/views/running.c4`,description:{txt:`How a refresh token gets into the vault in the first place. It runs\r
once, by hand, and only again if the token is revoked or lost — the\r
refresh grant can keep a token pair alive forever but cannot create\r
one, so a person at the consent screen is the only source.\r
\r
Every hop between the app and WHOOP goes through the browser, which is\r
why the visitor appears in the middle of a server-side flow: OAuth\r
redirects are the browser following Location headers, not two servers\r
talking. The client secret and the code exchange never leave Azure.\r
\r
The two auth levels differ for a reason. authorize sits behind a\r
function key because it is opened by hand. callback cannot: WHOOP\r
redirects a browser to it, and a key in a registered redirect URL would\r
sit in the developer dashboard and in browser history. What guards it\r
instead is the state parameter, signed with the client secret and good\r
for ten minutes, so only something that can read the vault could have\r
started the flow.`},title:`WHOOP consent — the one-time bootstrap`,id:`whoopBootstrap`,variant:`diagram`,flow:[`step-01`,`step-02`,`step-03`,`step-04`,`step-05`,`step-06`,`step-07`,`step-08`,`step-09`],autoLayout:{direction:`LR`,nodeSep:200,rankSep:40},notation:{nodes:[{title:`Person`,shape:`person`,color:`green`,kinds:[`actor`]},{title:`Azure Function App`,shape:`rectangle`,color:`primary`,kinds:[`function-app`]},{title:`External System`,shape:`rectangle`,color:`muted`,kinds:[`external-system`]},{title:`Azure Key Vault`,shape:`storage`,color:`primary`,kinds:[`secret-store`]}]},hash:`oOqC_JzwYtFVCx6IzvkJ29M4Z56v4JpwjDE3Hepcs0U`,sequenceLayout:{actors:[{id:`user`,x:0,y:0,width:366,height:180,ports:[{id:`step-01_source`,cx:183,cy:270,height:40,type:`source`,position:`right`},{id:`step-03_target`,cx:183,cy:408,height:24,type:`target`,position:`right`},{id:`step-04_source`,cx:183,cy:525,height:40,type:`source`,position:`right`},{id:`step-05_target`,cx:183,cy:627,height:24,type:`target`,position:`right`},{id:`step-06_source`,cx:183,cy:744,height:40,type:`source`,position:`right`}]},{id:`integrations`,x:446,y:0,width:350,height:180,ports:[{id:`step-01_target`,cx:175,cy:270,height:24,type:`target`,position:`left`},{id:`step-02_source`,cx:175,cy:292,height:40,type:`source`,position:`right`},{id:`step-03_source`,cx:175,cy:408,height:40,type:`source`,position:`left`},{id:`step-06_target`,cx:175,cy:744,height:24,type:`target`,position:`left`},{id:`step-07_source`,cx:175,cy:766,height:40,type:`source`,position:`right`},{id:`step-08_target`,cx:175,cy:883,height:24,type:`target`,position:`right`},{id:`step-09_source`,cx:175,cy:1e3,height:40,type:`source`,position:`right`}]},{id:`keyvault`,x:876,y:-10,width:360,height:200,ports:[{id:`step-02_target`,cx:180,cy:302,height:24,type:`target`,position:`left`},{id:`step-09_target`,cx:180,cy:1010,height:24,type:`target`,position:`left`}]},{id:`whoop`,x:1316,y:0,width:344,height:180,ports:[{id:`step-04_target`,cx:172,cy:525,height:24,type:`target`,position:`left`},{id:`step-05_source`,cx:172,cy:627,height:40,type:`source`,position:`left`},{id:`step-07_target`,cx:172,cy:766,height:24,type:`target`,position:`left`},{id:`step-08_source`,cx:172,cy:883,height:40,type:`source`,position:`left`}]}],compounds:[],steps:[{id:`step-01`,sourceHandle:`step-01_source`,targetHandle:`step-01_target`,labelBBox:{width:269,height:43}},{id:`step-02`,sourceHandle:`step-02_source`,targetHandle:`step-02_target`,labelBBox:{width:275,height:42}},{id:`step-03`,sourceHandle:`step-03_source`,targetHandle:`step-03_target`,labelBBox:{width:303,height:43}},{id:`step-04`,sourceHandle:`step-04_source`,targetHandle:`step-04_target`,labelBBox:{width:233,height:28}},{id:`step-05`,sourceHandle:`step-05_source`,targetHandle:`step-05_target`,labelBBox:{width:294,height:43}},{id:`step-06`,sourceHandle:`step-06_source`,targetHandle:`step-06_target`,labelBBox:{width:254,height:43}},{id:`step-07`,sourceHandle:`step-07_source`,targetHandle:`step-07_target`,labelBBox:{width:296,height:43}},{id:`step-08`,sourceHandle:`step-08_source`,targetHandle:`step-08_target`,labelBBox:{width:254,height:43}},{id:`step-09`,sourceHandle:`step-09_source`,targetHandle:`step-09_target`,labelBBox:{width:166,height:28}}],parallelAreas:[],subflows:[],bounds:{x:0,y:0,width:1660,height:1078}},bounds:{x:0,y:0,width:1749,height:1007},nodes:[{id:`user`,parent:null,level:0,children:[],inEdges:[`step-03`,`step-05`],outEdges:[`step-01`,`step-04`,`step-06`],title:`Visitor`,modelRef:`user`,shape:`person`,color:`green`,style:{opacity:15,size:`md`},description:{txt:`Reads the sites and plays on the game server. Also the person at the\r
WHOOP consent screen, once — a refresh token can be renewed forever,\r
but only a human can create the first one.\r
\r
On the training log they are more than a reader: they sign in, and the\r
Entra object id that comes back is the Cosmos partition every block,\r
session and set of theirs is written under.`},tags:[],notation:`Person`,kind:`actor`,x:0,y:210,width:366,height:180,labelBBox:{x:18,y:29,width:330,height:119}},{id:`integrations`,parent:null,level:0,children:[],inEdges:[`step-01`,`step-06`,`step-08`],outEdges:[`step-02`,`step-03`,`step-07`,`step-09`],title:`Integrations`,modelRef:`integrations`,shape:`rectangle`,color:`primary`,icon:`azure:function-apps`,style:{opacity:15,size:`md`},description:{txt:`func-nygdev-integrations. Everything that feeds the estate from outside\r
it, split off from the API so that app could have its gate turned on.\r
Runs as id-nygdev-integrations, which reaches Cosmos, the vault and the\r
CDN account without holding a key or a connection string.\r
\r
Two jobs on schedules a quarter of an hour apart, drawn apart on\r
purpose: one talks to WHOOP, the other to Cosmos and blob storage, so\r
neither failure is reported as the other. Beside them sits the phone\r
location spool — /api/gps/locations, a push rather than a schedule,\r
writing db/gps.\r
\r
No Easy Auth here, and that is the point of the app rather than an\r
omission. The WHOOP callback has to be reachable by WHOOP, and the rest\r
carry function keys, so there is no token for a gate to validate.`},tags:[],notation:`Azure Function App`,technology:`.NET 10 isolated — Flex Consumption`,kind:`function-app`,x:706,y:431,width:350,height:180,labelBBox:{x:46,y:20,width:288,height:138}},{id:`keyvault`,parent:null,level:0,children:[],inEdges:[`step-02`,`step-09`],outEdges:[],title:`Key Vault`,modelRef:`keyvault`,shape:`storage`,color:`primary`,icon:`azure:key-vaults`,style:{opacity:15,size:`md`},description:{txt:`nygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\r
hand from the WHOOP developer dashboard, and whoop-token.\r
\r
The second is not configuration. WHOOP rotates the refresh token on\r
every use and the API writes the replacement straight back, so this is\r
where that state lives between calls — which is why the identity holds\r
Secrets Officer here rather than a reader role.\r
\r
Terraform Apply also reads HomeIP from here at run time, and the\r
nygdev-ed25519 SSH public key sits beside it as its own resource.`},tags:[],notation:`Azure Key Vault`,technology:`Azure Key Vault — standard, RBAC data plane`,kind:`secret-store`,x:1389,y:377,width:360,height:200,labelBBox:{x:46,y:30,width:298,height:138}},{id:`whoop`,parent:null,level:0,children:[],inEdges:[`step-04`,`step-07`],outEdges:[`step-05`,`step-08`],title:`WHOOP`,modelRef:`whoop`,shape:`rectangle`,color:`muted`,style:{opacity:20,size:`md`},description:{txt:`Wearable platform, read-only to us and gated by an authorization code\r
grant. A person consents once and that yields a refresh token; every\r
refresh then rotates it, killing the old one the moment a new one is\r
issued. So the replacement has to be captured and stored, or the\r
integration locks itself out.`},tags:[],notation:`External System`,technology:`WHOOP API v2 — OAuth 2.0 + REST`,kind:`external-system`,x:1397,y:826,width:344,height:180,labelBBox:{x:17,y:20,width:308,height:138}}],edges:[{id:`step-01`,parent:null,source:`user`,target:`integrations`,label:`Opens /integrations/whoop/authorize 
(function key)`,relations:[`1radcrl`],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@0`,points:[[366,237],[465,214],[588,204],[686,253],[755,289],[805,362],[837,423]],labelBBox:{x:412,y:176,width:253,height:35}},{id:`step-02`,parent:null,source:`integrations`,target:`keyvault`,label:`Reads whoop-clientsecret, to sign the 
state with`,relations:[`1pqr4t6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@1`,points:[[1056,498],[1063,498],[1069,497],[1076,496],[1175,488],[1286,484],[1377,481]],labelBBox:{x:1095,y:440,width:259,height:34}},{id:`step-03`,parent:null,source:`integrations`,target:`user`,label:`302 to the WHOOP consent screen (client 
id, scopes, signed state)`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@2`,dir:`back`,points:[[376,361],[479,394],[606,434],[706,466]],labelBBox:{x:395,y:324,width:287,height:35}},{id:`step-04`,parent:null,source:`user`,target:`whoop`,label:`Signs in and grants the scopes`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@3`,points:[[259,211],[294,176],[338,141],[386,122],[809,-37],[1100,22],[1369,385],[1407,438],[1366,617],[1389,677],[1408,729],[1441,778],[1474,819]],labelBBox:{x:775,y:7,width:217,height:20}},{id:`step-05`,parent:null,source:`whoop`,target:`user`,label:`302 back to /integrations/whoop/callback 
with a code`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@4`,dir:`back`,points:[[222,400],[255,474],[310,574],[386,637],[679,881],[1146,920],[1397,922]],labelBBox:{x:744,y:776,width:278,height:35}},{id:`step-06`,parent:null,source:`user`,target:`integrations`,label:`The browser follows the redirect 
(anonymous; the state is the gate)`,relations:[`1radcrl`],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@5`,points:[[229,390],[263,448],[316,519],[386,552],[481,598],[599,592],[696,575]],labelBBox:{x:420,y:510,width:238,height:35}},{id:`step-07`,parent:null,source:`integrations`,target:`whoop`,label:`Exchanges the code (authorization_code 
grant, client secret)`,relations:[`1hjsar6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`scheduled`],astPath:`/steps@6`,points:[[985,611],[1014,634],[1045,658],[1076,677],[1175,740],[1292,797],[1387,840]],labelBBox:{x:1085,y:635,width:280,height:35}},{id:`step-08`,parent:null,source:`whoop`,target:`integrations`,label:`Access token, and the first refresh 
token`,relations:[],color:`gray`,line:`dashed`,head:`normal`,tags:[],astPath:`/steps@7`,dir:`back`,points:[[970,619],[1002,660],[1036,711],[1056,761],[1069,796],[1048,901],[1076,925],[1161,1001],[1292,995],[1397,972]],labelBBox:{x:1106,y:883,width:238,height:35}},{id:`step-09`,parent:null,source:`integrations`,target:`keyvault`,label:`Writes whoop-token`,relations:[`1pqr4t6`],color:`gray`,line:`dashed`,head:`normal`,tags:[`managed-identity`],astPath:`/steps@8`,points:[[1056,563],[1063,564],[1069,565],[1076,565],[1205,580],[1241,592],[1369,565],[1372,565],[1375,564],[1378,563]],labelBBox:{x:1150,y:533,width:150,height:20}}]}},deployments:{elements:{internet:{notation:`Internet`,style:{opacity:0},kind:`internet`,title:`Internet`,id:`internet`},azure:{notation:`Azure Subscription`,style:{icon:`azure:subscriptions`,opacity:5},kind:`subscription`,description:{txt:`Managed by terraform — norwayeast unless noted`},title:`Azure Subscription`,id:`azure`},"internet.browser":{id:`internet.browser`,element:`user`,title:`Visitor browser`,style:{size:`sm`,color:`green`}},"internet.whoopApi":{id:`internet.whoopApi`,element:`whoop`,title:`api.prod.whoop.com`,description:{txt:`The OAuth token endpoint and the v2 data API, both outside the subscription`},style:{}},"azure.rgConsumption":{notation:`Resource Group`,style:{icon:`azure:resource-groups`,opacity:10},kind:`resource-group`,description:{txt:`Serverless compute, shared monitoring and deploy storage`},title:`rg-nygdev-consumption`,id:`azure.rgConsumption`},"azure.rgDb":{notation:`Resource Group`,style:{icon:`azure:resource-groups`,opacity:10},kind:`resource-group`,title:`rg-nygdev-db`,id:`azure.rgDb`},"azure.rgWeb":{notation:`Resource Group`,style:{icon:`azure:resource-groups`,opacity:10},kind:`resource-group`,description:{txt:`Web front-ends. The Static Web Apps are in westeurope, Free SKU.`},title:`rg-nygdev-web`,id:`azure.rgWeb`},"azure.rgNetwork":{notation:`Resource Group`,style:{icon:`azure:resource-groups`,opacity:10},kind:`resource-group`,title:`rg-nygdev-network`,id:`azure.rgNetwork`},"azure.rgVm":{notation:`Resource Group`,style:{icon:`azure:resource-groups`,opacity:10},kind:`resource-group`,title:`rg-nygdev-vm`,id:`azure.rgVm`},"azure.rgData":{notation:`Resource Group`,style:{icon:`azure:resource-groups`,opacity:10},kind:`resource-group`,description:{txt:`Persistent data — survives VM rebuilds`},title:`rg-nygdev-data`,id:`azure.rgData`},"azure.rgSecurity":{notation:`Resource Group`,style:{icon:`azure:resource-groups`,opacity:10},kind:`resource-group`,description:{txt:`The resource group is not created by this configuration; the vault in it is`},title:`rg-nygdev-security`,id:`azure.rgSecurity`},"azure.rgConsumption.aspDotnet":{notation:`App Service Plan (Flex Consumption)`,style:{icon:`azure:app-service-plans`,opacity:10},kind:`service-plan`,technology:`FC1 / Linux`,title:`asp-nygdev-flex-dotnet`,id:`azure.rgConsumption.aspDotnet`},"azure.rgConsumption.aspIntegrations":{notation:`App Service Plan (Flex Consumption)`,style:{icon:`azure:app-service-plans`,opacity:10},kind:`service-plan`,technology:`FC1 / Linux`,title:`asp-nygdev-flex-integrations`,id:`azure.rgConsumption.aspIntegrations`},"azure.rgConsumption.aspPs":{notation:`App Service Plan (Flex Consumption)`,style:{icon:`azure:app-service-plans`,opacity:10},kind:`service-plan`,technology:`FC1 / Linux`,title:`asp-nygdev-flex-ps`,id:`azure.rgConsumption.aspPs`},"azure.rgConsumption.funcStorage":{notation:`Storage Account`,style:{icon:`azure:storage-accounts`,opacity:10},kind:`blob-storage`,description:{txt:`Deployment packages — the azadmin-deploy, api-deploy and integrations-deploy containers`},title:`nygdevfunc`,id:`azure.rgConsumption.funcStorage`},"azure.rgConsumption.appInsights":{notation:`Monitoring`,style:{icon:`azure:application-insights`},kind:`monitoring`,description:{txt:`Application Insights, backed by the log-nygdev-consumption workspace`},title:`appi-nygdev-consumption`,id:`azure.rgConsumption.appInsights`},"azure.rgDb.cosmosDb":{id:`azure.rgDb.cosmosDb`,element:`cosmos`,title:`nygdev-cosmos-db`,description:{txt:`GlobalDocumentDB, free tier, local auth disabled, Session consistency — db / primary, gym and gps`},style:{}},"azure.rgDb.sqlServer":{notation:`Azure SQL Server`,style:{icon:`azure:sql-server`},kind:`sql-server`,description:{txt:`Sweden Central, because the free Azure SQL offer is not available\r
in Norway East. Entra-only authentication and a firewall open to\r
the home IP alone. The free-tier database inside it was made by hand\r
and is deliberately not managed here.`},technology:`Azure SQL — swedencentral`,title:`sql-nygdev`,id:`azure.rgDb.sqlServer`},"azure.rgWeb.apex":{notation:`Static Web App`,style:{icon:`azure:static-apps`},kind:`static-site`,description:{txt:`Serves https://nygard.dev`},title:`nygdevapex`,id:`azure.rgWeb.apex`},"azure.rgWeb.runDash":{notation:`Static Web App`,style:{icon:`azure:static-apps`},kind:`static-site`,description:{txt:`Serves https://run.nygard.dev`},title:`nygdevrun`,id:`azure.rgWeb.runDash`},"azure.rgWeb.gymSite":{notation:`Static Web App`,style:{icon:`azure:static-apps`},kind:`static-site`,description:{txt:`Serves https://gym.nygard.dev`},title:`nygdevgym`,id:`azure.rgWeb.gymSite`},"azure.rgWeb.gymbroSite":{notation:`Static Web App`,style:{icon:`azure:static-apps`},kind:`static-site`,description:{txt:`Serves https://gymbro.nygard.dev`},title:`nygdevgymbro`,id:`azure.rgWeb.gymbroSite`},"azure.rgWeb.cdnStorage":{notation:`Storage Account`,style:{icon:`azure:storage-accounts`,opacity:10},kind:`blob-storage`,title:`nygdevcdn`,id:`azure.rgWeb.cdnStorage`},"azure.rgNetwork.pip":{notation:`Public IP Address`,style:{icon:`azure:public-ip-addresses`},kind:`public-ip`,description:{txt:`Static public IP, DNS label "rpg" — rpg.norwayeast.cloudapp.azure.com`},title:`rpg-pip`,id:`azure.rgNetwork.pip`},"azure.rgNetwork.vnetMain":{notation:`Virtual Network`,style:{icon:`azure:virtual-networks`,opacity:5},kind:`vnet`,technology:`10.0.0.0/24`,title:`nygdev-vnet`,id:`azure.rgNetwork.vnetMain`},"azure.rgVm.rpgVm":{notation:`Virtual Machine`,style:{icon:`azure:virtual-machine`,opacity:10},kind:`vm`,description:{txt:`30 GB StandardSSD OS disk, SSH key only, no VM agent and no\r
extensions. Configured entirely by cloud-init; auto-shutdown at\r
23:00 Oslo time.`},technology:`Standard_B2s, Ubuntu 26.04 LTS minimal`,title:`rpg-vm`,id:`azure.rgVm.rpgVm`},"azure.rgData.foundryData":{notation:`Managed Disk`,style:{icon:`azure:disks`},kind:`disk`,description:{txt:`Worlds, modules, media, the Caddyfile and the Foundry install.\r
Referenced by terraform as a data source and attached, never\r
created — which is what lets the VM be destroyed and rebuilt.`},technology:`Azure Managed Disk, attached at LUN 0`,title:`foundrydata`,id:`azure.rgData.foundryData`},"azure.rgSecurity.kv":{notation:`Key Vault`,style:{icon:`azure:key-vaults`},kind:`key-vault`,description:{txt:`RBAC data plane. Holds HomeIP, whoop-clientsecret and whoop-token, alongside the nygdev-ed25519 SSH public key resource.`},title:`nygdev`,id:`azure.rgSecurity.kv`},"azure.rgConsumption.aspDotnet.apiApp":{id:`azure.rgConsumption.aspDotnet.apiApp`,element:`api`,title:`func-nygdev-api`,description:{txt:`512 MB instances, max 1. Runs as id-nygdev-api. CORS allows gym\r
and gymbro, each under its custom domain and its default hostname.\r
Easy Auth enforces GymLog tokens: require_authentication with\r
Return401 and no exempt paths, which is what moving the anonymous\r
callers off this app bought.`},style:{}},"azure.rgConsumption.aspIntegrations.integrationsApp":{id:`azure.rgConsumption.aspIntegrations.integrationsApp`,element:`integrations`,title:`func-nygdev-integrations`,description:{txt:`512 MB instances, max 1. Runs as id-nygdev-integrations. No CORS\r
list and no Easy Auth: nothing that calls it is a browser holding\r
a token — the WHOOP callback is a top-level redirect and the rest\r
carry function keys.`},style:{}},"azure.rgConsumption.aspPs.azadminApp":{id:`azure.rgConsumption.aspPs.azadminApp`,element:`azadmin`,title:`func-nygdev-azadmin`,description:{txt:`512 MB instances, max 1. System-assigned identity.`},style:{}},"azure.rgWeb.apex.webApex":{id:`azure.rgWeb.apex.webApex`,element:`web`,style:{}},"azure.rgWeb.runDash.webRun":{id:`azure.rgWeb.runDash.webRun`,element:`running`,style:{}},"azure.rgWeb.gymSite.webGym":{id:`azure.rgWeb.gymSite.webGym`,element:`gym`,style:{}},"azure.rgWeb.gymbroSite.webGymbro":{id:`azure.rgWeb.gymbroSite.webGymbro`,element:`gymbro`,style:{}},"azure.rgWeb.cdnStorage.mediaContainer":{notation:`Blob Container`,style:{icon:`azure:storage-container`,opacity:10},kind:`storage-container`,title:`foundry`,id:`azure.rgWeb.cdnStorage.mediaContainer`},"azure.rgWeb.cdnStorage.dataContainer":{notation:`Blob Container`,style:{icon:`azure:storage-container`,opacity:10},kind:`storage-container`,title:`data`,id:`azure.rgWeb.cdnStorage.dataContainer`},"azure.rgWeb.cdnStorage.webContainer":{notation:`Blob Container`,style:{icon:`azure:storage-container`,opacity:10},kind:`storage-container`,title:`$web`,id:`azure.rgWeb.cdnStorage.webContainer`},"azure.rgNetwork.vnetMain.subnetRpg":{notation:`Subnet`,style:{icon:`azure:subnet`,opacity:10},kind:`subnet`,description:{txt:`NSG nygdev-nsg: 80/443 from anywhere; 22, 30000 and 30001 from the home IP only`},technology:`10.0.0.0/29`,title:`rpg-snet`,id:`azure.rgNetwork.vnetMain.subnetRpg`},"azure.rgVm.rpgVm.caddyProc":{id:`azure.rgVm.rpgVm.caddyProc`,element:`rpg.caddy`,style:{}},"azure.rgVm.rpgVm.foundryProc":{id:`azure.rgVm.rpgVm.foundryProc`,element:`rpg.foundry`,style:{}},"azure.rgWeb.cdnStorage.mediaContainer.mediaBlobs":{id:`azure.rgWeb.cdnStorage.mediaContainer.mediaBlobs`,element:`cdn.foundryMedia`,style:{}},"azure.rgWeb.cdnStorage.dataContainer.dataBlobs":{id:`azure.rgWeb.cdnStorage.dataContainer.dataBlobs`,element:`cdn.dataContainer`,style:{}},"azure.rgWeb.cdnStorage.webContainer.siteBlobs":{id:`azure.rgWeb.cdnStorage.webContainer.siteBlobs`,element:`cdn.webSite`,style:{}}},relations:{vgefkl:{title:`HTTPS to nygard.dev`,source:{deployment:`internet.browser`},target:{deployment:`azure.rgWeb.apex`},id:`vgefkl`},"10i6d8v":{title:`HTTPS to run.nygard.dev`,source:{deployment:`internet.browser`},target:{deployment:`azure.rgWeb.runDash`},id:`10i6d8v`},"946zon":{title:`HTTPS to gym.nygard.dev`,source:{deployment:`internet.browser`},target:{deployment:`azure.rgWeb.gymSite`},id:`946zon`},"1h2h5uh":{title:`HTTPS to gymbro.nygard.dev`,source:{deployment:`internet.browser`},target:{deployment:`azure.rgWeb.gymbroSite`},id:`1h2h5uh`},"1m90jbu":{title:`HTTPS to rpg.nygard.dev`,source:{deployment:`internet.browser`},target:{deployment:`azure.rgNetwork.pip`},id:`1m90jbu`},"1biockh":{title:`Calls /gym cross-origin with a bearer token`,source:{deployment:`azure.rgWeb.gymSite`},target:{deployment:`azure.rgConsumption.aspDotnet.apiApp`},id:`1biockh`},"1dc0uk1":{title:`The same routes, from the planner`,source:{deployment:`azure.rgWeb.gymbroSite`},target:{deployment:`azure.rgConsumption.aspDotnet.apiApp`},id:`1dc0uk1`},"1jtxe5a":{title:`Forwards 80/443 through rpg-snet`,source:{deployment:`azure.rgNetwork.pip`},target:{deployment:`azure.rgVm.rpgVm.caddyProc`},id:`1jtxe5a`},"1qntz4a":{title:`Stores worlds, modules and media on the attached disk`,source:{deployment:`azure.rgVm.rpgVm.foundryProc`},target:{deployment:`azure.rgData.foundryData`},id:`1qntz4a`},"13ju45s":{title:`HTTPS/443, gateway mode, Entra token for id-nygdev-api — scoped to db/gym alone`,source:{deployment:`azure.rgConsumption.aspDotnet.apiApp`},target:{deployment:`azure.rgDb.cosmosDb`},id:`13ju45s`},pmzikr:{title:`HTTPS/443, gateway mode, Entra token for id-nygdev-integrations — one grant each on db/primary and db/gps, and none on db/gym`,source:{deployment:`azure.rgConsumption.aspIntegrations.integrationsApp`},target:{deployment:`azure.rgDb.cosmosDb`},id:`pmzikr`},"14ndmcv":{title:`HTTPS/443, Entra token for id-nygdev-integrations`,source:{deployment:`azure.rgConsumption.aspIntegrations.integrationsApp`},target:{deployment:`azure.rgSecurity.kv`},id:`14ndmcv`},"17mf9sq":{title:`Publishes marathonprep.json as id-nygdev-integrations`,source:{deployment:`azure.rgConsumption.aspIntegrations.integrationsApp`},target:{deployment:`azure.rgWeb.cdnStorage.dataContainer`},id:`17mf9sq`},"13l4764":{title:`OAuth token grants and v2 reads`,source:{deployment:`azure.rgConsumption.aspIntegrations.integrationsApp`},target:{deployment:`internet.whoopApi`},id:`13l4764`},tk0ig8:{title:`Telemetry (OpenTelemetry)`,source:{deployment:`azure.rgConsumption.aspDotnet.apiApp`},target:{deployment:`azure.rgConsumption.appInsights`},id:`tk0ig8`},"17z59xt":{title:`Telemetry, to the same workspace`,source:{deployment:`azure.rgConsumption.aspIntegrations.integrationsApp`},target:{deployment:`azure.rgConsumption.appInsights`},id:`17z59xt`},"1h0c43t":{title:`Telemetry`,source:{deployment:`azure.rgConsumption.aspPs.azadminApp`},target:{deployment:`azure.rgConsumption.appInsights`},id:`1h0c43t`}}},imports:{},manualLayouts:{}}),{updateModel:r,$likec4model:i,useLikeC4Model:a,useLikeC4Views:o,useLikeC4View:s}=e(n);export{n as $likec4data,i as $likec4model,r as updateModel,a as useLikeC4Model,s as useLikeC4View,o as useLikeC4Views};