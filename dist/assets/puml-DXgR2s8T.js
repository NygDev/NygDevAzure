var e=e=>{switch(e){case`apex`:return`@startuml
title "nygard.dev — the apex site"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<User>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<Web>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<RpgCaddy>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<RpgFoundry>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
person "==Visitor\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<User>> as User
rectangle "==nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevapex. Links, and the live status of the Foundry server." <<Web>> as Web
rectangle "RPG Server" <<Rpg>> as Rpg {
  skinparam RectangleBorderColor<<Rpg>> #6366f1
  skinparam RectangleFontColor<<Rpg>> #6366f1
  skinparam RectangleBorderStyle<<Rpg>> dashed

  rectangle "==Caddy\\n<size:10>[Caddy]</size>\\n\\nReverse proxy and TLS termination on 80/443, for rpg.nygard.dev" <<RpgCaddy>> as RpgCaddy
  rectangle "==Foundry VTT\\n<size:10>[Node.js, listening on :30000]</size>\\n\\nSelf-hosted virtual tabletop, running as srv_foundry off the foundrydata disk" <<RpgFoundry>> as RpgFoundry
}

User .[#8D8D8D,thickness=2].> Web : <color:#8D8D8D>Visits https://nygard.dev
Web .[#8D8D8D,thickness=2].> RpgCaddy : <color:#8D8D8D>Polls the Foundry status from the page (GET /api/status)
RpgCaddy .[#8D8D8D,thickness=2].> RpgFoundry : <color:#8D8D8D>Reverse proxies to :30000
@enduml
`;case`delivery`:return`@startuml
title "Delivery — GitHub to Azure"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<Dev>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<GithubGhEnv>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubRepoSrcC4>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubRepoSrcTf>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubRepoSrcApi>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubRepoSrcGym>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubRepoSrcPs>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubActionsDeployC4>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubActionsTfApply>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubActionsDeployApi>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubActionsDeployFunc>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubActionsDeployIntegrations>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<EntraGhOidc>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam database<<Tfstate>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Keyvault>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Api>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Azadmin>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Integrations>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Azurerm>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<CdnWebSite>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "GitHub" <<Github>> as Github {
  skinparam RectangleBorderColor<<Github>> #64748b
  skinparam RectangleFontColor<<Github>> #64748b
  skinparam RectangleBorderStyle<<Github>> dashed

  rectangle "==Environment "NygDevAzure"\\n<size:10>[GitHub Actions environment]</size>\\n\\nAZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID,\\r\\nAZURE_KEYVAULT_NAME, AZURE_VM_USERNAME, ENTRA_OWNER_OBJECTID.\\r\\nIdentifiers only — no credential is stored here." <<GithubGhEnv>> as GithubGhEnv
  rectangle "NygDevAzure" <<GithubRepo>> as GithubRepo {
    skinparam RectangleBorderColor<<GithubRepo>> #A35829
    skinparam RectangleFontColor<<GithubRepo>> #A35829
    skinparam RectangleBorderStyle<<GithubRepo>> dashed

    rectangle "==c4/LikeC4/**\\n<size:10>[LikeC4 DSL]</size>\\n\\nThis model — specification, logical model, delivery, deployment and views" <<GithubRepoSrcC4>> as GithubRepoSrcC4
    rectangle "==terraform/**\\n<size:10>[Terraform HCL]</size>\\n\\nThe Azure estate: resource groups, VNet, VM, storage, Cosmos, function apps, Key Vault" <<GithubRepoSrcTf>> as GithubRepoSrcTf
    rectangle "==apifunctionapp/**\\n<size:10>[C# / .NET 10 isolated worker]</size>\\n\\nThe WHOOP endpoints, the two timers, the running dashboard build, the gym routes and the GPS upload" <<GithubRepoSrcApi>> as GithubRepoSrcApi
    rectangle "==gym/**\\n<size:10>[JSON, uploaded as blobs]</size>\\n\\nThe gym exercise library and the built-in day templates — the part of the training log that is the same for every account" <<GithubRepoSrcGym>> as GithubRepoSrcGym
    rectangle "==psfunctionapp/**\\n<size:10>[PowerShell 7.4]</size>\\n\\ncachecontrol and cachecontrolauto" <<GithubRepoSrcPs>> as GithubRepoSrcPs
  }
  rectangle "GitHub Actions" <<GithubActions>> as GithubActions {
    skinparam RectangleBorderColor<<GithubActions>> #A35829
    skinparam RectangleFontColor<<GithubActions>> #A35829
    skinparam RectangleBorderStyle<<GithubActions>> dashed

    rectangle "==Deploy LikeC4\\n<size:10>[deploy-likec4.yml — push to master on c4/LikeC4/**]</size>\\n\\nInstalls from the lockfile, runs likec4 validate (a broken model\\r\\nfails the run before anything is touched), renders with likec4\\r\\nbuild, then empties $web and uploads dist/ twice — everything as\\r\\nno-cache, then assets/* again as immutable.\\r\\n\\r\\nConcurrency group deploy-likec4 with cancel-in-progress false,\\r\\nbecause the delete-then-upload sequence must not interleave." <<GithubActionsDeployC4>> as GithubActionsDeployC4
    rectangle "==Terraform Apply\\n<size:10>[terraform-apply.yml — workflow_dispatch only]</size>\\n\\nAuthenticates with ARM_USE_OIDC, fetches the home IP and the SSH\\r\\npublic key at run time, then terraform apply -auto-approve.\\r\\n\\r\\nRun by hand rather than on a push: there is no plan step and no\\r\\napproval gate, so dispatching it is the decision point. Everything\\r\\nthis configuration manages can be recreated without data loss —\\r\\nthe Foundry disk and the Cosmos account are read or adopted, not\\r\\nreplaced. State is serialised by a terraform-apply concurrency\\r\\ngroup.\\r\\n\\r\\nIt also uploads the two gym JSON files, which is why editing an\\r\\nexercise is an apply rather than a deploy: the provider notices the\\r\\nchecksum change and reuploads the blob.\\r\\n\\r\\nterraform-apply-gymbro.yml is the same configuration run under\\r\\n-target for the planner Static Web App and the API app alone, so a\\r\\nfront-end change need not put the VM and the SQL server in its blast\\r\\nradius. It plans before it applies, and it is narrower rather than\\r\\ndifferent — the caveat is that -target excludes dependents, so the\\r\\ntwo role assignments hanging off the API app are not in its graph.\\r\\nA plan there showing the app or its identity being replaced is the\\r\\nsignal to run this one instead." <<GithubActionsTfApply>> as GithubActionsTfApply
    rectangle "==Deploy API Function App\\n<size:10>[deploy-api-function-app.yml — push to master on apifunctionapp/**]</size>\\n\\ndotnet publish -c Release, then Azure/functions-action@v1 to func-nygdev-api. A build failure stops the run before Azure is touched." <<GithubActionsDeployApi>> as GithubActionsDeployApi
    rectangle "==Deploy PS Function App\\n<size:10>[deploy-ps-function-app.yml — push to master on psfunctionapp/**]</size>\\n\\nSave-Module bundles Az.Accounts and Az.Storage into the package, then Azure/functions-action@v1 to func-nygdev-azadmin." <<GithubActionsDeployFunc>> as GithubActionsDeployFunc
    rectangle "==Deploy Integrations Function App\\n<size:10>[deploy-integrations-function-app.yml — push to master on integrationsfunctionapp/**]</size>\\n\\nThe same two steps against func-nygdev-integrations. A second\\r\\nworkflow rather than a matrix because the path filters are what\\r\\ndecide which app a change redeploys, and one project changing should\\r\\nnot restart the other." <<GithubActionsDeployIntegrations>> as GithubActionsDeployIntegrations
  }
}
rectangle "Microsoft Entra ID" <<Entra>> as Entra {
  skinparam RectangleBorderColor<<Entra>> #64748b
  skinparam RectangleFontColor<<Entra>> #64748b
  skinparam RectangleBorderStyle<<Entra>> dashed

  rectangle "==GitHub deploy identity\\n<size:10>[Workload identity federation]</size>\\n\\nThe AZURE_CLIENT_ID principal. Federated credentials trust\\r\\ntoken.actions.githubusercontent.com for this repository and the\\r\\nNygDevAzure environment, so there is no client secret to leak.\\r\\nManaged outside terraform — it is the identity terraform runs as,\\r\\nand RBAC on it is the real blast radius of a compromised workflow." <<EntraGhOidc>> as EntraGhOidc
}
person "==Developer\\n\\nAuthors the model, the terraform and the function code, and pushes to master" <<Dev>> as Dev
rectangle "CDN Storage" <<Cdn>> as Cdn {
  skinparam RectangleBorderColor<<Cdn>> #3b82f6
  skinparam RectangleFontColor<<Cdn>> #3b82f6
  skinparam RectangleBorderStyle<<Cdn>> dashed

  database "==$web\\n<size:10>[Azure Storage static website hosting]</size>\\n\\nThis model, rendered by likec4 build and served at the account primary web endpoint" <<CdnWebSite>> as CdnWebSite
}
database "==Terraform State\\n<size:10>[Azure Blob Storage, AzureAD auth]</size>\\n\\nnygdevtfstate / tfstate / azure-infrastructure.tfstate in rg-nygdev-data" <<Tfstate>> as Tfstate
database "==Key Vault\\n<size:10>[Azure Key Vault — standard, RBAC data plane]</size>\\n\\nnygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\\r\\nhand from the WHOOP developer dashboard, and whoop-token.\\r\\n\\r\\nThe second is not configuration. WHOOP rotates the refresh token on\\r\\nevery use and the API writes the replacement straight back, so this is\\r\\nwhere that state lives between calls — which is why the identity holds\\r\\nSecrets Officer here rather than a reader role.\\r\\n\\r\\nTerraform Apply also reads HomeIP from here at run time, and the\\r\\nnygdev-ed25519 SSH public key sits beside it as its own resource." <<Keyvault>> as Keyvault
rectangle "==API\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\nfunc-nygdev-api. The training log and nothing else since the split:\\r\\nblocks, sessions, sets and saved day templates, read and written a tap\\r\\nat a time by the two gym front ends. Runs as id-nygdev-api, which is how\\r\\nit reaches Cosmos without holding a key or a connection string.\\r\\n\\r\\nIt used to carry the WHOOP sync and the dashboard build as well, and\\r\\nlosing them is what let Easy Auth be enforced here. Those two can\\r\\npresent no token — WHOOP redirects a browser to a callback, the phone\\r\\nholds a function key — so while they shared this app the platform gate\\r\\nhad to stay off and every gym route refused unauthenticated callers for\\r\\nitself. They are on Integrations now, and the gate is on:\\r\\nrequire_authentication with Return401, no exempt paths.\\r\\n\\r\\nThe route-level check stays regardless, because the two answer different\\r\\nquestions. The gate establishes that a token was valid. The check\\r\\nestablishes which user it named, and that answer is the Cosmos partition\\r\\nkey — read from the platform headers and never from a route, a query\\r\\nstring or a body, because it is the whole tenancy boundary.\\r\\n\\r\\nEvery write carries the count the client believes the session already\\r\\nholds and applies only while that is still true. So a request whose\\r\\nreply was lost is safe to send again — it answers "already recorded"\\r\\nrather than logging the set twice, which is what makes a one-tap button\\r\\nsafe to hammer on gym wifi and what lets the page draw the row before\\r\\nthe call returns." <<Api>> as Api
rectangle "==Admin Automation\\n<size:10>[PowerShell 7.4 — Flex Consumption]</size>\\n\\nfunc-nygdev-azadmin. Sets Cache-Control on Foundry media blobs, on demand and on blob-created events." <<Azadmin>> as Azadmin
rectangle "==Integrations\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\nfunc-nygdev-integrations. Everything that feeds the estate from outside\\r\\nit, split off from the API so that app could have its gate turned on.\\r\\nRuns as id-nygdev-integrations, which reaches Cosmos, the vault and the\\r\\nCDN account without holding a key or a connection string.\\r\\n\\r\\nTwo jobs on schedules a quarter of an hour apart, drawn apart on\\r\\npurpose: one talks to WHOOP, the other to Cosmos and blob storage, so\\r\\nneither failure is reported as the other. Beside them sits the phone\\r\\nlocation spool — /api/gps/locations, a push rather than a schedule,\\r\\nwriting db/gps.\\r\\n\\r\\nNo Easy Auth here, and that is the point of the app rather than an\\r\\nomission. The WHOOP callback has to be reachable by WHOOP, and the rest\\r\\ncarry function keys, so there is no token for a gate to validate." <<Integrations>> as Integrations
rectangle "==Azure Resource Manager\\n<size:10>[management.azure.com]</size>\\n\\nThe Azure control plane. Terraform and the az CLI both reach the estate through it." <<Azurerm>> as Azurerm

GithubRepoSrcC4 .[#8D8D8D,thickness=2].> GithubActionsDeployC4 : <color:#8D8D8D>Change here runs
GithubRepoSrcTf .[#8D8D8D,thickness=2].> GithubActionsTfApply : <color:#8D8D8D>Change here is applied by
GithubRepoSrcApi .[#8D8D8D,thickness=2].> GithubActionsDeployApi : <color:#8D8D8D>Change here runs
GithubRepoSrcGym .[#8D8D8D,thickness=2].> GithubActionsTfApply : <color:#8D8D8D>Change here is uploaded by
GithubRepoSrcPs .[#8D8D8D,thickness=2].> GithubActionsDeployFunc : <color:#8D8D8D>Change here runs
GithubActionsTfApply .[#8D8D8D,thickness=2].> Azurerm : <color:#8D8D8D>terraform apply -auto-approve
EntraGhOidc .[#8D8D8D,thickness=2].> Azurerm : <color:#8D8D8D>Authorises calls against (RBAC on the subscription)
GithubActionsTfApply .[#8D8D8D,thickness=2].> Tfstate : <color:#8D8D8D>Locks and writes state
GithubActionsTfApply .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Reads HomeIP, and the nygdev-ed25519 public key beside it, at run time
GithubActionsDeployApi .[#8D8D8D,thickness=2].> Api : <color:#8D8D8D>Deploys the published worker
GithubActionsDeployIntegrations .[#8D8D8D,thickness=2].> Integrations : <color:#8D8D8D>Deploys the published worker
GithubActionsDeployFunc .[#8D8D8D,thickness=2].> Azadmin : <color:#8D8D8D>Deploys the function package
GithubActionsDeployC4 .[#8D8D8D,thickness=2].> CdnWebSite : <color:#8D8D8D>Clears and re-uploads dist/ (az storage blob upload-batch)
Dev .[#8D8D8D,thickness=2].> GithubRepo : <color:#8D8D8D>git push (master)
GithubGhEnv .[#8D8D8D,thickness=2].> GithubActions : <color:#8D8D8D>Supplies tenant, subscription and client ids to
GithubActions .[#8D8D8D,thickness=2].> EntraGhOidc : <color:#8D8D8D>Presents the runner OIDC token (azure/login@v3)
@enduml
`;case`gym`:return`@startuml
title "gym.nygard.dev and gymbro.nygard.dev — the training log"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<User>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<Gym>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<Gymbro>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<Api>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<EntraGymlog>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam database<<CdnDataContainer>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Cosmos>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Visitor\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<User>> as User
rectangle "The training log, in two shells" <<@gr1>> as @gr1 {
  skinparam RectangleBorderColor<<@gr1>> #3b82f6
  skinparam RectangleFontColor<<@gr1>> #3b82f6
  skinparam RectangleBorderStyle<<@gr1>> dashed

  rectangle "==gym.nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevgym — GymLog, the training logger. Provisioned empty by terraform;\\r\\nthe built React app is deployed from the nygdevweb repository.\\r\\n\\r\\nThe first page in the estate that signs anybody in. Everything it shows\\r\\nbelongs to one account, so it holds an MSAL client, signs in against\\r\\nEntra as the GymLog registration, and puts the resulting bearer token on\\r\\nevery call it makes to the API.\\r\\n\\r\\nIt is also the first page that both fetches a blob and calls a function,\\r\\nand the split is deliberate: the exercise library and the built-in day\\r\\ntemplates are the same for every account, so they are anonymous blobs it\\r\\nreads once and caches, and only what a person wrote goes through the API." <<Gym>> as Gym
  rectangle "==gymbro.nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevgymbro — the desktop planner for the same training log. A Static\\r\\nWeb App of its own rather than a path on the logger, because a Static Web\\r\\nApp routes on path only: a second subdomain with different content needs\\r\\na second resource, which is the same reason there were three already.\\r\\n\\r\\nIt shares everything but the layout. Same API, same Cosmos partition,\\r\\nsame GymLog registration — Easy Auth checks which client obtained the\\r\\ntoken, so a planner with a registration of its own would be answered 403\\r\\nrather than given a login of its own. What it adds is a screen wide\\r\\nenough to write a block on and to read a whole one back off." <<Gymbro>> as Gymbro
}
rectangle "Microsoft Entra ID" <<Entra>> as Entra {
  skinparam RectangleBorderColor<<Entra>> #64748b
  skinparam RectangleFontColor<<Entra>> #64748b
  skinparam RectangleBorderStyle<<Entra>> dashed

  rectangle "==GymLog\\n<size:10>[Single-page application platform, no client secret]</size>\\n\\nThe identity both gym front ends sign in as, and the identity Easy\\r\\nAuth on the API accepts. Both halves of that check name it: the token\\r\\nis minted for GymLog, and it was obtained by GymLog.\\r\\n\\r\\nThe second half is the one with consequences. The platform reads the\\r\\nclaim naming the client that obtained the token, so a front end given\\r\\na registration of its own is answered 403 rather than quietly working\\r\\n— which is why the planner signs in as this registration rather than\\r\\nas itself, and why giving it one later is a terraform change and not a\\r\\nfront-end one.\\r\\n\\r\\nManaged by hand, and it is the one thing in journey four that no\\r\\napply can create. Declaring it would mean the azuread provider and a\\r\\nMicrosoft Graph application grant on the workflow identity, which is a\\r\\nmuch wider permission than one registration justifies. What that costs\\r\\nis that the SPA redirect URIs and the exposed scope are portal work;\\r\\nterraform prints them as outputs instead." <<EntraGymlog>> as EntraGymlog
}
rectangle "CDN Storage" <<Cdn>> as Cdn {
  skinparam RectangleBorderColor<<Cdn>> #3b82f6
  skinparam RectangleFontColor<<Cdn>> #3b82f6
  skinparam RectangleBorderStyle<<Cdn>> dashed

  database "==data\\n<size:10>[Anonymous blob read; the container cannot be listed]</size>\\n\\nThree files, published by two different things.\\r\\n\\r\\nmarathonprep.json is the built running dashboard, written by the\\r\\nIntegrations app and rewritten in place on every build, carrying a five-minute\\r\\nCache-Control so each rebuild reaches the page well before the next\\r\\none runs.\\r\\n\\r\\ngym-exercises.json and gym-templates.json are the exercise library and\\r\\nthe built-in day templates. They are not written by anything at run\\r\\ntime — they are files in the repository that terraform uploads, so\\r\\nediting one is an apply rather than a deploy. They are here rather\\r\\nthan in Cosmos because they are identical for every account and change\\r\\nwhen the app ships: served per account they would cost a function\\r\\ninvocation, a token and an RU to hand back the same objects. Cached\\r\\nfor a day, which is also the worst case for a new exercise reaching a\\r\\nphone that has already loaded the app.\\r\\n\\r\\nAnonymous read is what lets all three be fetched with no key, no token\\r\\nand no function call in between. The gym fetches deliberately send no\\r\\nAuthorization header either: adding one would turn a simple\\r\\ncross-origin GET into a preflight this endpoint has no CORS rule for." <<CdnDataContainer>> as CdnDataContainer
}
rectangle "==API\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\nfunc-nygdev-api. The training log and nothing else since the split:\\r\\nblocks, sessions, sets and saved day templates, read and written a tap\\r\\nat a time by the two gym front ends. Runs as id-nygdev-api, which is how\\r\\nit reaches Cosmos without holding a key or a connection string.\\r\\n\\r\\nIt used to carry the WHOOP sync and the dashboard build as well, and\\r\\nlosing them is what let Easy Auth be enforced here. Those two can\\r\\npresent no token — WHOOP redirects a browser to a callback, the phone\\r\\nholds a function key — so while they shared this app the platform gate\\r\\nhad to stay off and every gym route refused unauthenticated callers for\\r\\nitself. They are on Integrations now, and the gate is on:\\r\\nrequire_authentication with Return401, no exempt paths.\\r\\n\\r\\nThe route-level check stays regardless, because the two answer different\\r\\nquestions. The gate establishes that a token was valid. The check\\r\\nestablishes which user it named, and that answer is the Cosmos partition\\r\\nkey — read from the platform headers and never from a route, a query\\r\\nstring or a body, because it is the whole tenancy boundary.\\r\\n\\r\\nEvery write carries the count the client believes the session already\\r\\nholds and applies only while that is still true. So a request whose\\r\\nreply was lost is safe to send again — it answers "already recorded"\\r\\nrather than logging the set twice, which is what makes a one-tap button\\r\\nsafe to hammer on gym wifi and what lets the page draw the row before\\r\\nthe call returns." <<Api>> as Api
database "==Cosmos DB\\n<size:10>[Azure Cosmos DB (NoSQL) — free tier]</size>\\n\\nnygdev-cosmos-db / db, one account holding three containers that share\\r\\nnothing but the throughput. Local auth is off, so Entra role assignments\\r\\nare the only way in, and each is scoped to a single container rather than\\r\\nto the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\\r\\nreaches \`primary\` and \`gps\`. So neither app can read what the other\\r\\nwrites, which matters most in one direction — \`gym\` is partitioned per\\r\\nuser and is the tenancy boundary.\\r\\n\\r\\n\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\\r\\ntraining log, partitioned on /objectId — the signed-in caller, which is\\r\\nwhat makes the partition key the tenancy boundary rather than a routing\\r\\ndetail. \`gps\` is the phone location spool on /sender, with a three-day\\r\\nTTL.\\r\\n\\r\\nAll three are indexed opt-in, /* excluded and only what is filtered on\\r\\nincluded: /sport_name and /score_state on primary, for the dashboard\\r\\nbuild reading scored runs; /type and /mesoId on gym, for History and the\\r\\nblock map. Excluding is doing the most work on gym, where the sets are\\r\\nthe bulk of a document and are never filtered on — which is what keeps a\\r\\nset-tap costing the same on the thirtieth set as on the first.\\r\\n\\r\\nSession consistency, and the training log is what asked for it: log a\\r\\nset, re-read the session, and on Eventual the replica that answers may\\r\\nnot hold it yet. On a single-region account it costs the same RU as\\r\\nEventual." <<Cosmos>> as Cosmos

User .[#8D8D8D,thickness=2].> Gym : <color:#8D8D8D>Logs a session at https://gym.nygard.dev
User .[#8D8D8D,thickness=2].> Gymbro : <color:#8D8D8D>Plans a block at https://gymbro.nygard.dev
Gym .[#8D8D8D,thickness=2].> EntraGymlog : <color:#8D8D8D>Signs in as this registration (MSAL, authorization code with PKCE)
Gym .[#8D8D8D,thickness=2].> Api : <color:#8D8D8D>Reads and writes the training log, one tap at a time
Gymbro .[#8D8D8D,thickness=2].> Api : <color:#8D8D8D>Reads and writes the same routes, a whole block at a time
Api .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>Reads and writes the blocks, sessions and saved templates in db/gym, under the object id off the token
Gym .[#8D8D8D,thickness=2].> CdnDataContainer : <color:#8D8D8D>Fetches the exercise library and the built-in day templates, once, and caches them
@enduml
`;case`gymSignIn`:return`@startuml
title "Signing in to the training log"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<User>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<Gym>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<EntraGymlog>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Api>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Cosmos>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Visitor\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<User>> as User
rectangle "==gym.nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevgym — GymLog, the training logger. Provisioned empty by terraform;\\r\\nthe built React app is deployed from the nygdevweb repository.\\r\\n\\r\\nThe first page in the estate that signs anybody in. Everything it shows\\r\\nbelongs to one account, so it holds an MSAL client, signs in against\\r\\nEntra as the GymLog registration, and puts the resulting bearer token on\\r\\nevery call it makes to the API.\\r\\n\\r\\nIt is also the first page that both fetches a blob and calls a function,\\r\\nand the split is deliberate: the exercise library and the built-in day\\r\\ntemplates are the same for every account, so they are anonymous blobs it\\r\\nreads once and caches, and only what a person wrote goes through the API." <<Gym>> as Gym
rectangle "==GymLog\\n<size:10>[Single-page application platform, no client secret]</size>\\n\\nThe identity both gym front ends sign in as, and the identity Easy\\r\\nAuth on the API accepts. Both halves of that check name it: the token\\r\\nis minted for GymLog, and it was obtained by GymLog.\\r\\n\\r\\nThe second half is the one with consequences. The platform reads the\\r\\nclaim naming the client that obtained the token, so a front end given\\r\\na registration of its own is answered 403 rather than quietly working\\r\\n— which is why the planner signs in as this registration rather than\\r\\nas itself, and why giving it one later is a terraform change and not a\\r\\nfront-end one.\\r\\n\\r\\nManaged by hand, and it is the one thing in journey four that no\\r\\napply can create. Declaring it would mean the azuread provider and a\\r\\nMicrosoft Graph application grant on the workflow identity, which is a\\r\\nmuch wider permission than one registration justifies. What that costs\\r\\nis that the SPA redirect URIs and the exposed scope are portal work;\\r\\nterraform prints them as outputs instead." <<EntraGymlog>> as EntraGymlog
rectangle "==API\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\nfunc-nygdev-api. The training log and nothing else since the split:\\r\\nblocks, sessions, sets and saved day templates, read and written a tap\\r\\nat a time by the two gym front ends. Runs as id-nygdev-api, which is how\\r\\nit reaches Cosmos without holding a key or a connection string.\\r\\n\\r\\nIt used to carry the WHOOP sync and the dashboard build as well, and\\r\\nlosing them is what let Easy Auth be enforced here. Those two can\\r\\npresent no token — WHOOP redirects a browser to a callback, the phone\\r\\nholds a function key — so while they shared this app the platform gate\\r\\nhad to stay off and every gym route refused unauthenticated callers for\\r\\nitself. They are on Integrations now, and the gate is on:\\r\\nrequire_authentication with Return401, no exempt paths.\\r\\n\\r\\nThe route-level check stays regardless, because the two answer different\\r\\nquestions. The gate establishes that a token was valid. The check\\r\\nestablishes which user it named, and that answer is the Cosmos partition\\r\\nkey — read from the platform headers and never from a route, a query\\r\\nstring or a body, because it is the whole tenancy boundary.\\r\\n\\r\\nEvery write carries the count the client believes the session already\\r\\nholds and applies only while that is still true. So a request whose\\r\\nreply was lost is safe to send again — it answers "already recorded"\\r\\nrather than logging the set twice, which is what makes a one-tap button\\r\\nsafe to hammer on gym wifi and what lets the page draw the row before\\r\\nthe call returns." <<Api>> as Api
database "==Cosmos DB\\n<size:10>[Azure Cosmos DB (NoSQL) — free tier]</size>\\n\\nnygdev-cosmos-db / db, one account holding three containers that share\\r\\nnothing but the throughput. Local auth is off, so Entra role assignments\\r\\nare the only way in, and each is scoped to a single container rather than\\r\\nto the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\\r\\nreaches \`primary\` and \`gps\`. So neither app can read what the other\\r\\nwrites, which matters most in one direction — \`gym\` is partitioned per\\r\\nuser and is the tenancy boundary.\\r\\n\\r\\n\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\\r\\ntraining log, partitioned on /objectId — the signed-in caller, which is\\r\\nwhat makes the partition key the tenancy boundary rather than a routing\\r\\ndetail. \`gps\` is the phone location spool on /sender, with a three-day\\r\\nTTL.\\r\\n\\r\\nAll three are indexed opt-in, /* excluded and only what is filtered on\\r\\nincluded: /sport_name and /score_state on primary, for the dashboard\\r\\nbuild reading scored runs; /type and /mesoId on gym, for History and the\\r\\nblock map. Excluding is doing the most work on gym, where the sets are\\r\\nthe bulk of a document and are never filtered on — which is what keeps a\\r\\nset-tap costing the same on the thirtieth set as on the first.\\r\\n\\r\\nSession consistency, and the training log is what asked for it: log a\\r\\nset, re-read the session, and on Eventual the replica that answers may\\r\\nnot hold it yet. On a single-region account it costs the same RU as\\r\\nEventual." <<Cosmos>> as Cosmos

User .[#8D8D8D,thickness=2].> Gym : <color:#8D8D8D>Taps sign in
Gym .[#8D8D8D,thickness=2].> EntraGymlog : <color:#8D8D8D>Redirects to Entra as GymLog: authorization code with PKCE, no secret
EntraGymlog .[#8D8D8D,thickness=2].> Gym : <color:#8D8D8D>Code back to the bridge page, which broadcasts it to the app
Gym .[#8D8D8D,thickness=2].> EntraGymlog : <color:#8D8D8D>Exchanges the code, then asks for an access token for the API scope
EntraGymlog .[#8D8D8D,thickness=2].> Gym : <color:#8D8D8D>An access token: minted for GymLog, obtained by GymLog
Gym .[#8D8D8D,thickness=2].> Api : <color:#8D8D8D>Calls a gym route with the token in the Authorization header
Api .[#8D8D8D,thickness=2].> EntraGymlog : <color:#8D8D8D>Easy Auth validates it — signature, issuer tenant, audience, and which client obtained it
Api .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>The route reads the object id off the validated principal, and partitions on that
@enduml
`;case`gymSet`:return`@startuml
title "Logging a set, and what a lost reply costs"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<User>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<Gym>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<Api>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Cosmos>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Visitor\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<User>> as User
rectangle "==gym.nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevgym — GymLog, the training logger. Provisioned empty by terraform;\\r\\nthe built React app is deployed from the nygdevweb repository.\\r\\n\\r\\nThe first page in the estate that signs anybody in. Everything it shows\\r\\nbelongs to one account, so it holds an MSAL client, signs in against\\r\\nEntra as the GymLog registration, and puts the resulting bearer token on\\r\\nevery call it makes to the API.\\r\\n\\r\\nIt is also the first page that both fetches a blob and calls a function,\\r\\nand the split is deliberate: the exercise library and the built-in day\\r\\ntemplates are the same for every account, so they are anonymous blobs it\\r\\nreads once and caches, and only what a person wrote goes through the API." <<Gym>> as Gym
rectangle "==API\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\nfunc-nygdev-api. The training log and nothing else since the split:\\r\\nblocks, sessions, sets and saved day templates, read and written a tap\\r\\nat a time by the two gym front ends. Runs as id-nygdev-api, which is how\\r\\nit reaches Cosmos without holding a key or a connection string.\\r\\n\\r\\nIt used to carry the WHOOP sync and the dashboard build as well, and\\r\\nlosing them is what let Easy Auth be enforced here. Those two can\\r\\npresent no token — WHOOP redirects a browser to a callback, the phone\\r\\nholds a function key — so while they shared this app the platform gate\\r\\nhad to stay off and every gym route refused unauthenticated callers for\\r\\nitself. They are on Integrations now, and the gate is on:\\r\\nrequire_authentication with Return401, no exempt paths.\\r\\n\\r\\nThe route-level check stays regardless, because the two answer different\\r\\nquestions. The gate establishes that a token was valid. The check\\r\\nestablishes which user it named, and that answer is the Cosmos partition\\r\\nkey — read from the platform headers and never from a route, a query\\r\\nstring or a body, because it is the whole tenancy boundary.\\r\\n\\r\\nEvery write carries the count the client believes the session already\\r\\nholds and applies only while that is still true. So a request whose\\r\\nreply was lost is safe to send again — it answers "already recorded"\\r\\nrather than logging the set twice, which is what makes a one-tap button\\r\\nsafe to hammer on gym wifi and what lets the page draw the row before\\r\\nthe call returns." <<Api>> as Api
database "==Cosmos DB\\n<size:10>[Azure Cosmos DB (NoSQL) — free tier]</size>\\n\\nnygdev-cosmos-db / db, one account holding three containers that share\\r\\nnothing but the throughput. Local auth is off, so Entra role assignments\\r\\nare the only way in, and each is scoped to a single container rather than\\r\\nto the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\\r\\nreaches \`primary\` and \`gps\`. So neither app can read what the other\\r\\nwrites, which matters most in one direction — \`gym\` is partitioned per\\r\\nuser and is the tenancy boundary.\\r\\n\\r\\n\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\\r\\ntraining log, partitioned on /objectId — the signed-in caller, which is\\r\\nwhat makes the partition key the tenancy boundary rather than a routing\\r\\ndetail. \`gps\` is the phone location spool on /sender, with a three-day\\r\\nTTL.\\r\\n\\r\\nAll three are indexed opt-in, /* excluded and only what is filtered on\\r\\nincluded: /sport_name and /score_state on primary, for the dashboard\\r\\nbuild reading scored runs; /type and /mesoId on gym, for History and the\\r\\nblock map. Excluding is doing the most work on gym, where the sets are\\r\\nthe bulk of a document and are never filtered on — which is what keeps a\\r\\nset-tap costing the same on the thirtieth set as on the first.\\r\\n\\r\\nSession consistency, and the training log is what asked for it: log a\\r\\nset, re-read the session, and on Eventual the replica that answers may\\r\\nnot hold it yet. On a single-region account it costs the same RU as\\r\\nEventual." <<Cosmos>> as Cosmos

User .[#8D8D8D,thickness=2].> Gym : <color:#8D8D8D>Taps 'Log same again'
Gym .[#8D8D8D,thickness=2].> Api : <color:#8D8D8D>POSTs the set, carrying the set count the page believes the exercise holds
Api .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>Patches the session — but only while the stored count still matches
Api .[#8D8D8D,thickness=2].> Gym : <color:#8D8D8D>200: recorded, and the row the page already drew is now stored
Gym .[#8D8D8D,thickness=2].> Api : <color:#8D8D8D>The reply never arrived, so the same request again
Api .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>The count no longer matches, so the patch does not apply
Api .[#8D8D8D,thickness=2].> Gym : <color:#8D8D8D>200 alreadyRecorded: the first attempt landed, and nothing was written twice
@enduml
`;case`index`:return`@startuml
title "The estate — five front doors"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<User>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<Integrations>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Web>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<Running>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<Gym>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<Gymbro>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam database<<Keyvault>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Whoop>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Rpg>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<Api>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Cdn>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Cosmos>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Azadmin>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Visitor\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<User>> as User
rectangle "==Integrations\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\nfunc-nygdev-integrations. Everything that feeds the estate from outside\\r\\nit, split off from the API so that app could have its gate turned on.\\r\\nRuns as id-nygdev-integrations, which reaches Cosmos, the vault and the\\r\\nCDN account without holding a key or a connection string.\\r\\n\\r\\nTwo jobs on schedules a quarter of an hour apart, drawn apart on\\r\\npurpose: one talks to WHOOP, the other to Cosmos and blob storage, so\\r\\nneither failure is reported as the other. Beside them sits the phone\\r\\nlocation spool — /api/gps/locations, a push rather than a schedule,\\r\\nwriting db/gps.\\r\\n\\r\\nNo Easy Auth here, and that is the point of the app rather than an\\r\\nomission. The WHOOP callback has to be reachable by WHOOP, and the rest\\r\\ncarry function keys, so there is no token for a gate to validate." <<Integrations>> as Integrations
rectangle "==nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevapex. Links, and the live status of the Foundry server." <<Web>> as Web
rectangle "==run.nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevrun — the running and marathon dashboard. Provisioned empty by\\r\\nterraform; content deployed from the nygdevweb repository.\\r\\n\\r\\nThe page holds no logic of its own worth drawing: it fetches one\\r\\npre-built JSON document from the CDN account and draws the charts in\\r\\nit. Nothing is computed here, and no function is called." <<Running>> as Running
rectangle "==gym.nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevgym — GymLog, the training logger. Provisioned empty by terraform;\\r\\nthe built React app is deployed from the nygdevweb repository.\\r\\n\\r\\nThe first page in the estate that signs anybody in. Everything it shows\\r\\nbelongs to one account, so it holds an MSAL client, signs in against\\r\\nEntra as the GymLog registration, and puts the resulting bearer token on\\r\\nevery call it makes to the API.\\r\\n\\r\\nIt is also the first page that both fetches a blob and calls a function,\\r\\nand the split is deliberate: the exercise library and the built-in day\\r\\ntemplates are the same for every account, so they are anonymous blobs it\\r\\nreads once and caches, and only what a person wrote goes through the API." <<Gym>> as Gym
rectangle "==gymbro.nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevgymbro — the desktop planner for the same training log. A Static\\r\\nWeb App of its own rather than a path on the logger, because a Static Web\\r\\nApp routes on path only: a second subdomain with different content needs\\r\\na second resource, which is the same reason there were three already.\\r\\n\\r\\nIt shares everything but the layout. Same API, same Cosmos partition,\\r\\nsame GymLog registration — Easy Auth checks which client obtained the\\r\\ntoken, so a planner with a registration of its own would be answered 403\\r\\nrather than given a login of its own. What it adds is a screen wide\\r\\nenough to write a block on and to read a whole one back off." <<Gymbro>> as Gymbro
database "==Key Vault\\n<size:10>[Azure Key Vault — standard, RBAC data plane]</size>\\n\\nnygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\\r\\nhand from the WHOOP developer dashboard, and whoop-token.\\r\\n\\r\\nThe second is not configuration. WHOOP rotates the refresh token on\\r\\nevery use and the API writes the replacement straight back, so this is\\r\\nwhere that state lives between calls — which is why the identity holds\\r\\nSecrets Officer here rather than a reader role.\\r\\n\\r\\nTerraform Apply also reads HomeIP from here at run time, and the\\r\\nnygdev-ed25519 SSH public key sits beside it as its own resource." <<Keyvault>> as Keyvault
rectangle "==WHOOP\\n<size:10>[WHOOP API v2 — OAuth 2.0 + REST]</size>\\n\\nWearable platform, read-only to us and gated by an authorization code\\r\\ngrant. A person consents once and that yields a refresh token; every\\r\\nrefresh then rotates it, killing the old one the moment a new one is\\r\\nissued. So the replacement has to be captured and stored, or the\\r\\nintegration locks itself out." <<Whoop>> as Whoop
rectangle "==RPG Server\\n<size:10>[Azure Linux VM — Standard_B2s, Ubuntu 26.04 LTS minimal]</size>\\n\\nrpg-vm, behind the rpg-pip public IP. Built by terraform and\\r\\nconfigured by cloud-init; worlds and media live on a separate disk\\r\\nthat survives the VM being rebuilt." <<Rpg>> as Rpg
rectangle "==API\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\nfunc-nygdev-api. The training log and nothing else since the split:\\r\\nblocks, sessions, sets and saved day templates, read and written a tap\\r\\nat a time by the two gym front ends. Runs as id-nygdev-api, which is how\\r\\nit reaches Cosmos without holding a key or a connection string.\\r\\n\\r\\nIt used to carry the WHOOP sync and the dashboard build as well, and\\r\\nlosing them is what let Easy Auth be enforced here. Those two can\\r\\npresent no token — WHOOP redirects a browser to a callback, the phone\\r\\nholds a function key — so while they shared this app the platform gate\\r\\nhad to stay off and every gym route refused unauthenticated callers for\\r\\nitself. They are on Integrations now, and the gate is on:\\r\\nrequire_authentication with Return401, no exempt paths.\\r\\n\\r\\nThe route-level check stays regardless, because the two answer different\\r\\nquestions. The gate establishes that a token was valid. The check\\r\\nestablishes which user it named, and that answer is the Cosmos partition\\r\\nkey — read from the platform headers and never from a route, a query\\r\\nstring or a body, because it is the whole tenancy boundary.\\r\\n\\r\\nEvery write carries the count the client believes the session already\\r\\nholds and applies only while that is still true. So a request whose\\r\\nreply was lost is safe to send again — it answers "already recorded"\\r\\nrather than logging the set twice, which is what makes a one-tap button\\r\\nsafe to hammer on gym wifi and what lets the page draw the row before\\r\\nthe call returns." <<Api>> as Api
database "==CDN Storage\\n<size:10>[Azure Blob Storage — nygdevcdn]</size>\\n\\nOne public account serving three unrelated things" <<Cdn>> as Cdn
database "==Cosmos DB\\n<size:10>[Azure Cosmos DB (NoSQL) — free tier]</size>\\n\\nnygdev-cosmos-db / db, one account holding three containers that share\\r\\nnothing but the throughput. Local auth is off, so Entra role assignments\\r\\nare the only way in, and each is scoped to a single container rather than\\r\\nto the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\\r\\nreaches \`primary\` and \`gps\`. So neither app can read what the other\\r\\nwrites, which matters most in one direction — \`gym\` is partitioned per\\r\\nuser and is the tenancy boundary.\\r\\n\\r\\n\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\\r\\ntraining log, partitioned on /objectId — the signed-in caller, which is\\r\\nwhat makes the partition key the tenancy boundary rather than a routing\\r\\ndetail. \`gps\` is the phone location spool on /sender, with a three-day\\r\\nTTL.\\r\\n\\r\\nAll three are indexed opt-in, /* excluded and only what is filtered on\\r\\nincluded: /sport_name and /score_state on primary, for the dashboard\\r\\nbuild reading scored runs; /type and /mesoId on gym, for History and the\\r\\nblock map. Excluding is doing the most work on gym, where the sets are\\r\\nthe bulk of a document and are never filtered on — which is what keeps a\\r\\nset-tap costing the same on the thirtieth set as on the first.\\r\\n\\r\\nSession consistency, and the training log is what asked for it: log a\\r\\nset, re-read the session, and on Eventual the replica that answers may\\r\\nnot hold it yet. On a single-region account it costs the same RU as\\r\\nEventual." <<Cosmos>> as Cosmos
rectangle "==Admin Automation\\n<size:10>[PowerShell 7.4 — Flex Consumption]</size>\\n\\nfunc-nygdev-azadmin. Sets Cache-Control on Foundry media blobs, on demand and on blob-created events." <<Azadmin>> as Azadmin

User .[#8D8D8D,thickness=2].> Web : <color:#8D8D8D>Visits https://nygard.dev
User .[#8D8D8D,thickness=2].> Running : <color:#8D8D8D>Visits https://run.nygard.dev
User .[#8D8D8D,thickness=2].> Rpg : <color:#8D8D8D>Plays at https://rpg.nygard.dev
Web .[#8D8D8D,thickness=2].> Rpg : <color:#8D8D8D>Polls the Foundry status from the page (GET /api/status)
User .[#8D8D8D,thickness=2].> Gym : <color:#8D8D8D>Logs a session at https://gym.nygard.dev
User .[#8D8D8D,thickness=2].> Gymbro : <color:#8D8D8D>Plans a block at https://gymbro.nygard.dev
Gym .[#8D8D8D,thickness=2].> Api : <color:#8D8D8D>Reads and writes the training log, one tap at a time
Gymbro .[#8D8D8D,thickness=2].> Api : <color:#8D8D8D>Reads and writes the same routes, a whole block at a time
Api .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>Reads and writes the blocks, sessions and saved templates in db/gym, under the object id off the token
Integrations .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>[...]
Integrations .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Reads whoop-clientsecret; reads and rewrites the rotating whoop-token
Running .[#8D8D8D,thickness=2].> Cdn : <color:#8D8D8D>Fetches the built dashboard from the page (GET data/marathonprep.json)
Rpg .[#8D8D8D,thickness=2].> Cdn : <color:#8D8D8D>Holds asset URLs pointing at
Integrations .[#8D8D8D,thickness=2].> Cdn : <color:#8D8D8D>Publishes marathonprep.json (PUT, in place)
Cdn .[#8D8D8D,thickness=2].> User : <color:#8D8D8D>Serves media straight to the player browser
Cdn .[#8D8D8D,thickness=2].> Azadmin : <color:#8D8D8D>Blob-created events (Event Grid)
Azadmin .[#8D8D8D,thickness=2].> Cdn : <color:#8D8D8D>Sets Cache-Control on blobs
Integrations .[#8D8D8D,thickness=2].> Whoop : <color:#8D8D8D>Refreshes the access token, then pages cycles, sleep, workouts and recovery
@enduml
`;case`azureDeployment`:return`@startuml
title "Deployment — the whole subscription"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<InternetBrowser>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<AzureRgConsumptionFuncStorage>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<AzureRgConsumptionAspPsAzadminApp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<AzureRgDbSqlServer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam database<<AzureRgWebCdnStorageWebContainer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<AzureRgNetworkPip>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<AzureRgNetworkVnetMainSubnetRpg>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<AzureRgVmRpgVmCaddyProc>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<AzureRgVmRpgVmFoundryProc>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<AzureRgWebApex>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<AzureRgWebRunDash>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<AzureRgWebGymSite>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<AzureRgWebGymbroSite>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<AzureRgDataFoundryData>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<AzureRgConsumptionAspIntegrations>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<AzureRgConsumptionAspDotnetApiApp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<InternetWhoopApi>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<AzureRgConsumptionAppInsights>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<AzureRgWebCdnStorageDataContainer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam database<<AzureRgWebCdnStorageMediaContainer>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<AzureRgSecurityKv>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<AzureRgDbCosmosDb>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
rectangle "Internet" <<Internet>> as Internet {
  skinparam RectangleBorderColor<<Internet>> #3b82f6
  skinparam RectangleFontColor<<Internet>> #3b82f6
  skinparam RectangleBorderStyle<<Internet>> dashed

  person "==Visitor browser\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<InternetBrowser>> as InternetBrowser
  rectangle "==api.prod.whoop.com\\n<size:10>[WHOOP API v2 — OAuth 2.0 + REST]</size>\\n\\nThe OAuth token endpoint and the v2 data API, both outside the subscription" <<InternetWhoopApi>> as InternetWhoopApi
}
rectangle "Azure Subscription" <<Azure>> as Azure {
  skinparam RectangleBorderColor<<Azure>> #64748b
  skinparam RectangleFontColor<<Azure>> #64748b
  skinparam RectangleBorderStyle<<Azure>> dashed

  rectangle "rg-nygdev-consumption" <<AzureRgConsumption>> as AzureRgConsumption {
    skinparam RectangleBorderColor<<AzureRgConsumption>> #3b82f6
    skinparam RectangleFontColor<<AzureRgConsumption>> #3b82f6
    skinparam RectangleBorderStyle<<AzureRgConsumption>> dashed

    rectangle "asp-nygdev-flex-ps" <<AzureRgConsumptionAspPs>> as AzureRgConsumptionAspPs {
      skinparam RectangleBorderColor<<AzureRgConsumptionAspPs>> #3b82f6
      skinparam RectangleFontColor<<AzureRgConsumptionAspPs>> #3b82f6
      skinparam RectangleBorderStyle<<AzureRgConsumptionAspPs>> dashed

      rectangle "==func-nygdev-azadmin\\n<size:10>[PowerShell 7.4 — Flex Consumption]</size>\\n\\n512 MB instances, max 1. System-assigned identity." <<AzureRgConsumptionAspPsAzadminApp>> as AzureRgConsumptionAspPsAzadminApp
    }
    rectangle "==nygdevfunc\\n\\nDeployment packages — the azadmin-deploy, api-deploy and integrations-deploy containers" <<AzureRgConsumptionFuncStorage>> as AzureRgConsumptionFuncStorage
    rectangle "asp-nygdev-flex-dotnet" <<AzureRgConsumptionAspDotnet>> as AzureRgConsumptionAspDotnet {
      skinparam RectangleBorderColor<<AzureRgConsumptionAspDotnet>> #3b82f6
      skinparam RectangleFontColor<<AzureRgConsumptionAspDotnet>> #3b82f6
      skinparam RectangleBorderStyle<<AzureRgConsumptionAspDotnet>> dashed

      rectangle "==func-nygdev-api\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\n512 MB instances, max 1. Runs as id-nygdev-api. CORS allows gym\\r\\nand gymbro, each under its custom domain and its default hostname.\\r\\nEasy Auth enforces GymLog tokens: require_authentication with\\r\\nReturn401 and no exempt paths, which is what moving the anonymous\\r\\ncallers off this app bought." <<AzureRgConsumptionAspDotnetApiApp>> as AzureRgConsumptionAspDotnetApiApp
    }
    rectangle "==asp-nygdev-flex-integrations\\n<size:10>[FC1 / Linux]</size>\\n\\n512 MB instances, max 1. Runs as id-nygdev-integrations. No CORS\\r\\nlist and no Easy Auth: nothing that calls it is a browser holding\\r\\na token — the WHOOP callback is a top-level redirect and the rest\\r\\ncarry function keys." <<AzureRgConsumptionAspIntegrations>> as AzureRgConsumptionAspIntegrations
    rectangle "==appi-nygdev-consumption\\n\\nApplication Insights, backed by the log-nygdev-consumption workspace" <<AzureRgConsumptionAppInsights>> as AzureRgConsumptionAppInsights
  }
  rectangle "rg-nygdev-db" <<AzureRgDb>> as AzureRgDb {
    skinparam RectangleBorderColor<<AzureRgDb>> #A35829
    skinparam RectangleFontColor<<AzureRgDb>> #A35829
    skinparam RectangleBorderStyle<<AzureRgDb>> dashed

    rectangle "==sql-nygdev\\n<size:10>[Azure SQL — swedencentral]</size>\\n\\nSweden Central, because the free Azure SQL offer is not available\\r\\nin Norway East. Entra-only authentication and a firewall open to\\r\\nthe home IP alone. The free-tier database inside it was made by hand\\r\\nand is deliberately not managed here." <<AzureRgDbSqlServer>> as AzureRgDbSqlServer
    database "==nygdev-cosmos-db\\n<size:10>[Azure Cosmos DB (NoSQL) — free tier]</size>\\n\\nGlobalDocumentDB, free tier, local auth disabled, Session consistency — db / primary, gym and gps" <<AzureRgDbCosmosDb>> as AzureRgDbCosmosDb
  }
  rectangle "rg-nygdev-web" <<AzureRgWeb>> as AzureRgWeb {
    skinparam RectangleBorderColor<<AzureRgWeb>> #A35829
    skinparam RectangleFontColor<<AzureRgWeb>> #A35829
    skinparam RectangleBorderStyle<<AzureRgWeb>> dashed

    rectangle "nygdevcdn" <<AzureRgWebCdnStorage>> as AzureRgWebCdnStorage {
      skinparam RectangleBorderColor<<AzureRgWebCdnStorage>> #A35829
      skinparam RectangleFontColor<<AzureRgWebCdnStorage>> #A35829
      skinparam RectangleBorderStyle<<AzureRgWebCdnStorage>> dashed

      database "==$web\\n<size:10>[Azure Storage static website hosting]</size>\\n\\nThis model, rendered by likec4 build and served at the account primary web endpoint" <<AzureRgWebCdnStorageWebContainer>> as AzureRgWebCdnStorageWebContainer
      database "==data\\n<size:10>[Anonymous blob read; the container cannot be listed]</size>\\n\\nThree files, published by two different things.\\r\\n\\r\\nmarathonprep.json is the built running dashboard, written by the\\r\\nIntegrations app and rewritten in place on every build, carrying a five-minute\\r\\nCache-Control so each rebuild reaches the page well before the next\\r\\none runs.\\r\\n\\r\\ngym-exercises.json and gym-templates.json are the exercise library and\\r\\nthe built-in day templates. They are not written by anything at run\\r\\ntime — they are files in the repository that terraform uploads, so\\r\\nediting one is an apply rather than a deploy. They are here rather\\r\\nthan in Cosmos because they are identical for every account and change\\r\\nwhen the app ships: served per account they would cost a function\\r\\ninvocation, a token and an RU to hand back the same objects. Cached\\r\\nfor a day, which is also the worst case for a new exercise reaching a\\r\\nphone that has already loaded the app.\\r\\n\\r\\nAnonymous read is what lets all three be fetched with no key, no token\\r\\nand no function call in between. The gym fetches deliberately send no\\r\\nAuthorization header either: adding one would turn a simple\\r\\ncross-origin GET into a preflight this endpoint has no CORS rule for." <<AzureRgWebCdnStorageDataContainer>> as AzureRgWebCdnStorageDataContainer
      database "==foundry\\n<size:10>[Storage Container]</size>\\n\\nFoundry VTT media, fetched straight by player browsers" <<AzureRgWebCdnStorageMediaContainer>> as AzureRgWebCdnStorageMediaContainer
    }
    rectangle "==nygdevapex\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nServes https://nygard.dev" <<AzureRgWebApex>> as AzureRgWebApex
    rectangle "==nygdevrun\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nServes https://run.nygard.dev" <<AzureRgWebRunDash>> as AzureRgWebRunDash
    rectangle "==nygdevgym\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nServes https://gym.nygard.dev" <<AzureRgWebGymSite>> as AzureRgWebGymSite
    rectangle "==nygdevgymbro\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nServes https://gymbro.nygard.dev" <<AzureRgWebGymbroSite>> as AzureRgWebGymbroSite
  }
  rectangle "rg-nygdev-network" <<AzureRgNetwork>> as AzureRgNetwork {
    skinparam RectangleBorderColor<<AzureRgNetwork>> #6366f1
    skinparam RectangleFontColor<<AzureRgNetwork>> #6366f1
    skinparam RectangleBorderStyle<<AzureRgNetwork>> dashed

    rectangle "==rpg-pip\\n\\nStatic public IP, DNS label "rpg" — rpg.norwayeast.cloudapp.azure.com" <<AzureRgNetworkPip>> as AzureRgNetworkPip
    rectangle "nygdev-vnet" <<AzureRgNetworkVnetMain>> as AzureRgNetworkVnetMain {
      skinparam RectangleBorderColor<<AzureRgNetworkVnetMain>> #6366f1
      skinparam RectangleFontColor<<AzureRgNetworkVnetMain>> #6366f1
      skinparam RectangleBorderStyle<<AzureRgNetworkVnetMain>> dashed

      rectangle "==rpg-snet\\n<size:10>[10.0.0.0/29]</size>\\n\\nNSG nygdev-nsg: 80/443 from anywhere; 22, 30000 and 30001 from the home IP only" <<AzureRgNetworkVnetMainSubnetRpg>> as AzureRgNetworkVnetMainSubnetRpg
    }
  }
  rectangle "rg-nygdev-vm" <<AzureRgVm>> as AzureRgVm {
    skinparam RectangleBorderColor<<AzureRgVm>> #6366f1
    skinparam RectangleFontColor<<AzureRgVm>> #6366f1
    skinparam RectangleBorderStyle<<AzureRgVm>> dashed

    rectangle "rpg-vm" <<AzureRgVmRpgVm>> as AzureRgVmRpgVm {
      skinparam RectangleBorderColor<<AzureRgVmRpgVm>> #6366f1
      skinparam RectangleFontColor<<AzureRgVmRpgVm>> #6366f1
      skinparam RectangleBorderStyle<<AzureRgVmRpgVm>> dashed

      rectangle "==Caddy\\n<size:10>[Caddy]</size>\\n\\nReverse proxy and TLS termination on 80/443, for rpg.nygard.dev" <<AzureRgVmRpgVmCaddyProc>> as AzureRgVmRpgVmCaddyProc
      rectangle "==Foundry VTT\\n<size:10>[Node.js, listening on :30000]</size>\\n\\nSelf-hosted virtual tabletop, running as srv_foundry off the foundrydata disk" <<AzureRgVmRpgVmFoundryProc>> as AzureRgVmRpgVmFoundryProc
    }
  }
  rectangle "rg-nygdev-data" <<AzureRgData>> as AzureRgData {
    skinparam RectangleBorderColor<<AzureRgData>> #6366f1
    skinparam RectangleFontColor<<AzureRgData>> #6366f1
    skinparam RectangleBorderStyle<<AzureRgData>> dashed

    rectangle "==foundrydata\\n<size:10>[Azure Managed Disk, attached at LUN 0]</size>\\n\\nWorlds, modules, media, the Caddyfile and the Foundry install.\\r\\nReferenced by terraform as a data source and attached, never\\r\\ncreated — which is what lets the VM be destroyed and rebuilt." <<AzureRgDataFoundryData>> as AzureRgDataFoundryData
  }
  rectangle "rg-nygdev-security" <<AzureRgSecurity>> as AzureRgSecurity {
    skinparam RectangleBorderColor<<AzureRgSecurity>> #3b82f6
    skinparam RectangleFontColor<<AzureRgSecurity>> #3b82f6
    skinparam RectangleBorderStyle<<AzureRgSecurity>> dashed

    rectangle "==nygdev\\n\\nRBAC data plane. Holds HomeIP, whoop-clientsecret and whoop-token, alongside the nygdev-ed25519 SSH public key resource." <<AzureRgSecurityKv>> as AzureRgSecurityKv
  }
}

InternetBrowser .[#8D8D8D,thickness=2].> AzureRgConsumptionAspIntegrations : <color:#8D8D8D>Grants WHOOP access, once (GET /api/whoop/authorize)
AzureRgConsumptionAspIntegrations .[#8D8D8D,thickness=2].> AzureRgConsumptionAppInsights : <color:#8D8D8D>Telemetry, to the same workspace
AzureRgConsumptionAspIntegrations .[#8D8D8D,thickness=2].> InternetWhoopApi : <color:#8D8D8D>[...]
AzureRgConsumptionAspDotnetApiApp .[#8D8D8D,thickness=2].> AzureRgConsumptionAppInsights : <color:#8D8D8D>Telemetry (OpenTelemetry)
AzureRgConsumptionAspPsAzadminApp .[#8D8D8D,thickness=2].> AzureRgConsumptionAppInsights : <color:#8D8D8D>Telemetry
AzureRgConsumptionAspIntegrations .[#8D8D8D,thickness=2].> AzureRgDbCosmosDb : <color:#8D8D8D>[...]
AzureRgConsumptionAspDotnetApiApp .[#8D8D8D,thickness=2].> AzureRgDbCosmosDb : <color:#8D8D8D>[...]
InternetBrowser .[#8D8D8D,thickness=2].> AzureRgWebApex : <color:#8D8D8D>[...]
InternetBrowser .[#8D8D8D,thickness=2].> AzureRgWebRunDash : <color:#8D8D8D>[...]
InternetBrowser .[#8D8D8D,thickness=2].> AzureRgWebGymSite : <color:#8D8D8D>[...]
InternetBrowser .[#8D8D8D,thickness=2].> AzureRgWebGymbroSite : <color:#8D8D8D>[...]
AzureRgWebGymSite .[#8D8D8D,thickness=2].> AzureRgConsumptionAspDotnetApiApp : <color:#8D8D8D>[...]
AzureRgWebGymbroSite .[#8D8D8D,thickness=2].> AzureRgConsumptionAspDotnetApiApp : <color:#8D8D8D>[...]
AzureRgConsumptionAspIntegrations .[#8D8D8D,thickness=2].> AzureRgWebCdnStorageDataContainer : <color:#8D8D8D>[...]
AzureRgConsumptionAspPsAzadminApp .[#8D8D8D,thickness=2].> AzureRgWebCdnStorageMediaContainer : <color:#8D8D8D>Sets Cache-Control on blobs
AzureRgWebRunDash .[#8D8D8D,thickness=2].> AzureRgWebCdnStorageDataContainer : <color:#8D8D8D>Fetches the built dashboard from the page (GET data/marathonprep.json)
AzureRgWebGymSite .[#8D8D8D,thickness=2].> AzureRgWebCdnStorageDataContainer : <color:#8D8D8D>Fetches the exercise library and the built-in day templates, once, and caches them
AzureRgWebGymbroSite .[#8D8D8D,thickness=2].> AzureRgWebCdnStorageDataContainer : <color:#8D8D8D>Fetches the same two files
AzureRgWebCdnStorageMediaContainer .[#8D8D8D,thickness=2].> InternetBrowser : <color:#8D8D8D>Serves media straight to the player browser
AzureRgWebCdnStorageMediaContainer .[#8D8D8D,thickness=2].> AzureRgConsumptionAspPsAzadminApp : <color:#8D8D8D>Blob-created events (Event Grid)
InternetBrowser .[#8D8D8D,thickness=2].> AzureRgNetworkPip : <color:#8D8D8D>HTTPS to rpg.nygard.dev
AzureRgNetworkPip .[#8D8D8D,thickness=2].> AzureRgVmRpgVmCaddyProc : <color:#8D8D8D>Forwards 80/443 through rpg-snet
AzureRgVmRpgVmCaddyProc .[#8D8D8D,thickness=2].> AzureRgVmRpgVmFoundryProc : <color:#8D8D8D>Reverse proxies to :30000
AzureRgVmRpgVmFoundryProc .[#8D8D8D,thickness=2].> AzureRgWebCdnStorageMediaContainer : <color:#8D8D8D>Holds asset URLs pointing at
AzureRgVmRpgVmFoundryProc .[#8D8D8D,thickness=2].> AzureRgDataFoundryData : <color:#8D8D8D>Stores worlds, modules and media on the attached disk
AzureRgConsumptionAspIntegrations .[#8D8D8D,thickness=2].> AzureRgSecurityKv : <color:#8D8D8D>HTTPS/443, Entra token for id-nygdev-integrations
@enduml
`;case`rpg`:return`@startuml
title "rpg.nygard.dev — Foundry VTT"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<User>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<RpgFoundry>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<RpgClient>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<RpgCaddy>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<CdnFoundryMedia>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Visitor\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<User>> as User
rectangle "RPG Server" <<Rpg>> as Rpg {
  skinparam RectangleBorderColor<<Rpg>> #6366f1
  skinparam RectangleFontColor<<Rpg>> #6366f1
  skinparam RectangleBorderStyle<<Rpg>> dashed

  rectangle "==Foundry VTT\\n<size:10>[Node.js, listening on :30000]</size>\\n\\nSelf-hosted virtual tabletop, running as srv_foundry off the foundrydata disk" <<RpgFoundry>> as RpgFoundry
  rectangle "==Foundry Client\\n<size:10>[HTML / JS in the browser]</size>\\n\\nThe game UI, served by Foundry VTT and running in the player browser" <<RpgClient>> as RpgClient
  rectangle "==Caddy\\n<size:10>[Caddy]</size>\\n\\nReverse proxy and TLS termination on 80/443, for rpg.nygard.dev" <<RpgCaddy>> as RpgCaddy
}
rectangle "CDN Storage" <<Cdn>> as Cdn {
  skinparam RectangleBorderColor<<Cdn>> #3b82f6
  skinparam RectangleFontColor<<Cdn>> #3b82f6
  skinparam RectangleBorderStyle<<Cdn>> dashed

  database "==foundry\\n<size:10>[Storage Container]</size>\\n\\nFoundry VTT media, fetched straight by player browsers" <<CdnFoundryMedia>> as CdnFoundryMedia
}

RpgClient .[#8D8D8D,thickness=2].> RpgCaddy : <color:#8D8D8D>HTTPS / WSS to rpg.nygard.dev
RpgFoundry .[#8D8D8D,thickness=2].> RpgClient : <color:#8D8D8D>Serves the game UI and world data
RpgCaddy .[#8D8D8D,thickness=2].> RpgFoundry : <color:#8D8D8D>Reverse proxies to :30000
User .[#8D8D8D,thickness=2].> RpgClient : <color:#8D8D8D>Plays at https://rpg.nygard.dev
RpgFoundry .[#8D8D8D,thickness=2].> CdnFoundryMedia : <color:#8D8D8D>Holds asset URLs pointing at
CdnFoundryMedia .[#8D8D8D,thickness=2].> User : <color:#8D8D8D>Serves media straight to the player browser
@enduml
`;case`rpgInfra`:return`@startuml
title "The infrastructure behind rpg.nygard.dev"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<InternetBrowser>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<AzureRgNetworkPip>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<AzureRgNetworkVnetMainSubnetRpg>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<AzureRgVmRpgVmCaddyProc>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<AzureRgVmRpgVmFoundryProc>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam rectangle<<AzureRgDataFoundryData>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
skinparam database<<AzureRgWebCdnStorageMediaContainer>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Internet" <<Internet>> as Internet {
  skinparam RectangleBorderColor<<Internet>> #3b82f6
  skinparam RectangleFontColor<<Internet>> #3b82f6
  skinparam RectangleBorderStyle<<Internet>> dashed

  person "==Visitor browser\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<InternetBrowser>> as InternetBrowser
}
rectangle "Azure Subscription" <<Azure>> as Azure {
  skinparam RectangleBorderColor<<Azure>> #64748b
  skinparam RectangleFontColor<<Azure>> #64748b
  skinparam RectangleBorderStyle<<Azure>> dashed

  rectangle "rg-nygdev-network" <<AzureRgNetwork>> as AzureRgNetwork {
    skinparam RectangleBorderColor<<AzureRgNetwork>> #6366f1
    skinparam RectangleFontColor<<AzureRgNetwork>> #6366f1
    skinparam RectangleBorderStyle<<AzureRgNetwork>> dashed

    rectangle "==rpg-pip\\n\\nStatic public IP, DNS label "rpg" — rpg.norwayeast.cloudapp.azure.com" <<AzureRgNetworkPip>> as AzureRgNetworkPip
    rectangle "nygdev-vnet" <<AzureRgNetworkVnetMain>> as AzureRgNetworkVnetMain {
      skinparam RectangleBorderColor<<AzureRgNetworkVnetMain>> #6366f1
      skinparam RectangleFontColor<<AzureRgNetworkVnetMain>> #6366f1
      skinparam RectangleBorderStyle<<AzureRgNetworkVnetMain>> dashed

      rectangle "==rpg-snet\\n<size:10>[10.0.0.0/29]</size>\\n\\nNSG nygdev-nsg: 80/443 from anywhere; 22, 30000 and 30001 from the home IP only" <<AzureRgNetworkVnetMainSubnetRpg>> as AzureRgNetworkVnetMainSubnetRpg
    }
  }
  rectangle "rg-nygdev-vm" <<AzureRgVm>> as AzureRgVm {
    skinparam RectangleBorderColor<<AzureRgVm>> #6366f1
    skinparam RectangleFontColor<<AzureRgVm>> #6366f1
    skinparam RectangleBorderStyle<<AzureRgVm>> dashed

    rectangle "rpg-vm" <<AzureRgVmRpgVm>> as AzureRgVmRpgVm {
      skinparam RectangleBorderColor<<AzureRgVmRpgVm>> #6366f1
      skinparam RectangleFontColor<<AzureRgVmRpgVm>> #6366f1
      skinparam RectangleBorderStyle<<AzureRgVmRpgVm>> dashed

      rectangle "==Caddy\\n<size:10>[Caddy]</size>\\n\\nReverse proxy and TLS termination on 80/443, for rpg.nygard.dev" <<AzureRgVmRpgVmCaddyProc>> as AzureRgVmRpgVmCaddyProc
      rectangle "==Foundry VTT\\n<size:10>[Node.js, listening on :30000]</size>\\n\\nSelf-hosted virtual tabletop, running as srv_foundry off the foundrydata disk" <<AzureRgVmRpgVmFoundryProc>> as AzureRgVmRpgVmFoundryProc
    }
  }
  rectangle "rg-nygdev-data" <<AzureRgData>> as AzureRgData {
    skinparam RectangleBorderColor<<AzureRgData>> #6366f1
    skinparam RectangleFontColor<<AzureRgData>> #6366f1
    skinparam RectangleBorderStyle<<AzureRgData>> dashed

    rectangle "==foundrydata\\n<size:10>[Azure Managed Disk, attached at LUN 0]</size>\\n\\nWorlds, modules, media, the Caddyfile and the Foundry install.\\r\\nReferenced by terraform as a data source and attached, never\\r\\ncreated — which is what lets the VM be destroyed and rebuilt." <<AzureRgDataFoundryData>> as AzureRgDataFoundryData
  }
  rectangle "rg-nygdev-web" <<AzureRgWeb>> as AzureRgWeb {
    skinparam RectangleBorderColor<<AzureRgWeb>> #3b82f6
    skinparam RectangleFontColor<<AzureRgWeb>> #3b82f6
    skinparam RectangleBorderStyle<<AzureRgWeb>> dashed

    rectangle "nygdevcdn" <<AzureRgWebCdnStorage>> as AzureRgWebCdnStorage {
      skinparam RectangleBorderColor<<AzureRgWebCdnStorage>> #3b82f6
      skinparam RectangleFontColor<<AzureRgWebCdnStorage>> #3b82f6
      skinparam RectangleBorderStyle<<AzureRgWebCdnStorage>> dashed

      database "==foundry\\n<size:10>[Storage Container]</size>\\n\\nFoundry VTT media, fetched straight by player browsers" <<AzureRgWebCdnStorageMediaContainer>> as AzureRgWebCdnStorageMediaContainer
    }
  }
}

InternetBrowser .[#8D8D8D,thickness=2].> AzureRgNetworkPip : <color:#8D8D8D>HTTPS to rpg.nygard.dev
AzureRgNetworkPip .[#8D8D8D,thickness=2].> AzureRgVmRpgVmCaddyProc : <color:#8D8D8D>Forwards 80/443 through rpg-snet
AzureRgVmRpgVmCaddyProc .[#8D8D8D,thickness=2].> AzureRgVmRpgVmFoundryProc : <color:#8D8D8D>Reverse proxies to :30000
AzureRgVmRpgVmFoundryProc .[#8D8D8D,thickness=2].> AzureRgDataFoundryData : <color:#8D8D8D>Stores worlds, modules and media on the attached disk
AzureRgVmRpgVmFoundryProc .[#8D8D8D,thickness=2].> AzureRgWebCdnStorageMediaContainer : <color:#8D8D8D>Holds asset URLs pointing at
AzureRgWebCdnStorageMediaContainer .[#8D8D8D,thickness=2].> InternetBrowser : <color:#8D8D8D>Serves media straight to the player browser
@enduml
`;case`rpgTerraform`:return`@startuml
title "How terraform creates the RPG server"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<Dev>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<GithubGhEnv>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubRepoSrcTf>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<GithubActionsTfApply>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam rectangle<<EntraGhOidc>>{
  BackgroundColor #A35829
  FontColor #FFE0C2
  BorderColor #7E451D
}
skinparam database<<Tfstate>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Keyvault>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Azurerm>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<Rpg>>{
  BackgroundColor #6366f1
  FontColor #eef2ff
  BorderColor #4f46e5
}
rectangle "GitHub" <<Github>> as Github {
  skinparam RectangleBorderColor<<Github>> #64748b
  skinparam RectangleFontColor<<Github>> #64748b
  skinparam RectangleBorderStyle<<Github>> dashed

  rectangle "==Environment "NygDevAzure"\\n<size:10>[GitHub Actions environment]</size>\\n\\nAZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID,\\r\\nAZURE_KEYVAULT_NAME, AZURE_VM_USERNAME, ENTRA_OWNER_OBJECTID.\\r\\nIdentifiers only — no credential is stored here." <<GithubGhEnv>> as GithubGhEnv
  rectangle "NygDevAzure" <<GithubRepo>> as GithubRepo {
    skinparam RectangleBorderColor<<GithubRepo>> #A35829
    skinparam RectangleFontColor<<GithubRepo>> #A35829
    skinparam RectangleBorderStyle<<GithubRepo>> dashed

    rectangle "==terraform/**\\n<size:10>[Terraform HCL]</size>\\n\\nThe Azure estate: resource groups, VNet, VM, storage, Cosmos, function apps, Key Vault" <<GithubRepoSrcTf>> as GithubRepoSrcTf
  }
  rectangle "GitHub Actions" <<GithubActions>> as GithubActions {
    skinparam RectangleBorderColor<<GithubActions>> #A35829
    skinparam RectangleFontColor<<GithubActions>> #A35829
    skinparam RectangleBorderStyle<<GithubActions>> dashed

    rectangle "==Terraform Apply\\n<size:10>[terraform-apply.yml — workflow_dispatch only]</size>\\n\\nAuthenticates with ARM_USE_OIDC, fetches the home IP and the SSH\\r\\npublic key at run time, then terraform apply -auto-approve.\\r\\n\\r\\nRun by hand rather than on a push: there is no plan step and no\\r\\napproval gate, so dispatching it is the decision point. Everything\\r\\nthis configuration manages can be recreated without data loss —\\r\\nthe Foundry disk and the Cosmos account are read or adopted, not\\r\\nreplaced. State is serialised by a terraform-apply concurrency\\r\\ngroup.\\r\\n\\r\\nIt also uploads the two gym JSON files, which is why editing an\\r\\nexercise is an apply rather than a deploy: the provider notices the\\r\\nchecksum change and reuploads the blob.\\r\\n\\r\\nterraform-apply-gymbro.yml is the same configuration run under\\r\\n-target for the planner Static Web App and the API app alone, so a\\r\\nfront-end change need not put the VM and the SQL server in its blast\\r\\nradius. It plans before it applies, and it is narrower rather than\\r\\ndifferent — the caveat is that -target excludes dependents, so the\\r\\ntwo role assignments hanging off the API app are not in its graph.\\r\\nA plan there showing the app or its identity being replaced is the\\r\\nsignal to run this one instead." <<GithubActionsTfApply>> as GithubActionsTfApply
  }
}
rectangle "Microsoft Entra ID" <<Entra>> as Entra {
  skinparam RectangleBorderColor<<Entra>> #64748b
  skinparam RectangleFontColor<<Entra>> #64748b
  skinparam RectangleBorderStyle<<Entra>> dashed

  rectangle "==GitHub deploy identity\\n<size:10>[Workload identity federation]</size>\\n\\nThe AZURE_CLIENT_ID principal. Federated credentials trust\\r\\ntoken.actions.githubusercontent.com for this repository and the\\r\\nNygDevAzure environment, so there is no client secret to leak.\\r\\nManaged outside terraform — it is the identity terraform runs as,\\r\\nand RBAC on it is the real blast radius of a compromised workflow." <<EntraGhOidc>> as EntraGhOidc
}
person "==Developer\\n\\nAuthors the model, the terraform and the function code, and pushes to master" <<Dev>> as Dev
database "==Terraform State\\n<size:10>[Azure Blob Storage, AzureAD auth]</size>\\n\\nnygdevtfstate / tfstate / azure-infrastructure.tfstate in rg-nygdev-data" <<Tfstate>> as Tfstate
database "==Key Vault\\n<size:10>[Azure Key Vault — standard, RBAC data plane]</size>\\n\\nnygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\\r\\nhand from the WHOOP developer dashboard, and whoop-token.\\r\\n\\r\\nThe second is not configuration. WHOOP rotates the refresh token on\\r\\nevery use and the API writes the replacement straight back, so this is\\r\\nwhere that state lives between calls — which is why the identity holds\\r\\nSecrets Officer here rather than a reader role.\\r\\n\\r\\nTerraform Apply also reads HomeIP from here at run time, and the\\r\\nnygdev-ed25519 SSH public key sits beside it as its own resource." <<Keyvault>> as Keyvault
rectangle "==Azure Resource Manager\\n<size:10>[management.azure.com]</size>\\n\\nThe Azure control plane. Terraform and the az CLI both reach the estate through it." <<Azurerm>> as Azurerm
rectangle "==RPG Server\\n<size:10>[Azure Linux VM — Standard_B2s, Ubuntu 26.04 LTS minimal]</size>\\n\\nrpg-vm, behind the rpg-pip public IP. Built by terraform and\\r\\nconfigured by cloud-init; worlds and media live on a separate disk\\r\\nthat survives the VM being rebuilt." <<Rpg>> as Rpg

GithubRepoSrcTf .[#8D8D8D,thickness=2].> GithubActionsTfApply : <color:#8D8D8D>Change here is applied by
GithubActionsTfApply .[#8D8D8D,thickness=2].> Azurerm : <color:#8D8D8D>terraform apply -auto-approve
EntraGhOidc .[#8D8D8D,thickness=2].> Azurerm : <color:#8D8D8D>Authorises calls against (RBAC on the subscription)
GithubActionsTfApply .[#8D8D8D,thickness=2].> Tfstate : <color:#8D8D8D>Locks and writes state
GithubActionsTfApply .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Reads HomeIP, and the nygdev-ed25519 public key beside it, at run time
Azurerm .[#8D8D8D,thickness=2].> Rpg : <color:#8D8D8D>Creates rpg-vm and its NIC, the public IP, the VNet, subnet and NSG, and attaches the foundrydata disk
Dev .[#8D8D8D,thickness=2].> GithubRepo : <color:#8D8D8D>git push (master)
GithubGhEnv .[#8D8D8D,thickness=2].> GithubActions : <color:#8D8D8D>Supplies tenant, subscription and client ids to
GithubActions .[#8D8D8D,thickness=2].> EntraGhOidc : <color:#8D8D8D>Presents the runner OIDC token (azure/login@v3)
EntraGhOidc .[#8D8D8D,thickness=2].> GithubActions : <color:#8D8D8D>Issues a short-lived Azure access token to
@enduml
`;case`running`:return`@startuml
title "run.nygard.dev — the running dashboard"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<User>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<Running>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<IntegrationsSync>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<IntegrationsDashboard>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Whoop>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam database<<Keyvault>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Cosmos>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<CdnDataContainer>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Visitor\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<User>> as User
rectangle "Integrations" <<Integrations>> as Integrations {
  skinparam RectangleBorderColor<<Integrations>> #3b82f6
  skinparam RectangleFontColor<<Integrations>> #3b82f6
  skinparam RectangleBorderStyle<<Integrations>> dashed

  rectangle "==WHOOP sync\\n<size:10>[Timer + HTTP trigger, one shared gate]</size>\\n\\nWalks WHOOP collections into Cosmos. Timer at 00:00, 06:00, 12:00\\r\\nand 18:00 UTC; /api/whoop/sync is the same work on demand, and both\\r\\ngo through one runner holding one gate, so a manual call landing on\\r\\ntop of the scheduled run stands down rather than racing it.\\r\\n\\r\\nThe first runs backfill history newest-first on a time budget, each\\r\\npicking up where the last stopped. Once a collection runs out of\\r\\nhistory every later run re-reads the last seven days instead —\\r\\nWHOOP filters on start time, and a record it rescored keeps the\\r\\nstart it always had, so a "since last sync" query would never see\\r\\nit again." <<IntegrationsSync>> as IntegrationsSync
  rectangle "==Dashboard build\\n<size:10>[Timer + HTTP trigger]</size>\\n\\nRebuilds the running dashboard from whatever is stored: pace by run\\r\\ntype, aerobic efficiency, weekly volume, acute:chronic workload,\\r\\nweekly time in zones. Timer at 00:15, 06:15, 12:15 and 18:15 UTC —\\r\\nfifteen minutes behind each sync, but not chained to it.\\r\\n\\r\\nIt only needs the sync to have finished, not to have succeeded,\\r\\nbecause it reads the stored runs rather than that run writes. The\\r\\nbuild is a pure function of those runs and the day, so a slot that\\r\\nfinds nothing new republishes what is already there.\\r\\n\\r\\n/api/running/dashboard is the same build on demand, for a backfill\\r\\n(where rebuilding after every sync call would be waste) or for a\\r\\nchange to the arithmetic, which reshapes the whole history." <<IntegrationsDashboard>> as IntegrationsDashboard
}
rectangle "==run.nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevrun — the running and marathon dashboard. Provisioned empty by\\r\\nterraform; content deployed from the nygdevweb repository.\\r\\n\\r\\nThe page holds no logic of its own worth drawing: it fetches one\\r\\npre-built JSON document from the CDN account and draws the charts in\\r\\nit. Nothing is computed here, and no function is called." <<Running>> as Running
rectangle "==WHOOP\\n<size:10>[WHOOP API v2 — OAuth 2.0 + REST]</size>\\n\\nWearable platform, read-only to us and gated by an authorization code\\r\\ngrant. A person consents once and that yields a refresh token; every\\r\\nrefresh then rotates it, killing the old one the moment a new one is\\r\\nissued. So the replacement has to be captured and stored, or the\\r\\nintegration locks itself out." <<Whoop>> as Whoop
database "==Key Vault\\n<size:10>[Azure Key Vault — standard, RBAC data plane]</size>\\n\\nnygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\\r\\nhand from the WHOOP developer dashboard, and whoop-token.\\r\\n\\r\\nThe second is not configuration. WHOOP rotates the refresh token on\\r\\nevery use and the API writes the replacement straight back, so this is\\r\\nwhere that state lives between calls — which is why the identity holds\\r\\nSecrets Officer here rather than a reader role.\\r\\n\\r\\nTerraform Apply also reads HomeIP from here at run time, and the\\r\\nnygdev-ed25519 SSH public key sits beside it as its own resource." <<Keyvault>> as Keyvault
database "==Cosmos DB\\n<size:10>[Azure Cosmos DB (NoSQL) — free tier]</size>\\n\\nnygdev-cosmos-db / db, one account holding three containers that share\\r\\nnothing but the throughput. Local auth is off, so Entra role assignments\\r\\nare the only way in, and each is scoped to a single container rather than\\r\\nto the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\\r\\nreaches \`primary\` and \`gps\`. So neither app can read what the other\\r\\nwrites, which matters most in one direction — \`gym\` is partitioned per\\r\\nuser and is the tenancy boundary.\\r\\n\\r\\n\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\\r\\ntraining log, partitioned on /objectId — the signed-in caller, which is\\r\\nwhat makes the partition key the tenancy boundary rather than a routing\\r\\ndetail. \`gps\` is the phone location spool on /sender, with a three-day\\r\\nTTL.\\r\\n\\r\\nAll three are indexed opt-in, /* excluded and only what is filtered on\\r\\nincluded: /sport_name and /score_state on primary, for the dashboard\\r\\nbuild reading scored runs; /type and /mesoId on gym, for History and the\\r\\nblock map. Excluding is doing the most work on gym, where the sets are\\r\\nthe bulk of a document and are never filtered on — which is what keeps a\\r\\nset-tap costing the same on the thirtieth set as on the first.\\r\\n\\r\\nSession consistency, and the training log is what asked for it: log a\\r\\nset, re-read the session, and on Eventual the replica that answers may\\r\\nnot hold it yet. On a single-region account it costs the same RU as\\r\\nEventual." <<Cosmos>> as Cosmos
rectangle "CDN Storage" <<Cdn>> as Cdn {
  skinparam RectangleBorderColor<<Cdn>> #3b82f6
  skinparam RectangleFontColor<<Cdn>> #3b82f6
  skinparam RectangleBorderStyle<<Cdn>> dashed

  database "==data\\n<size:10>[Anonymous blob read; the container cannot be listed]</size>\\n\\nThree files, published by two different things.\\r\\n\\r\\nmarathonprep.json is the built running dashboard, written by the\\r\\nIntegrations app and rewritten in place on every build, carrying a five-minute\\r\\nCache-Control so each rebuild reaches the page well before the next\\r\\none runs.\\r\\n\\r\\ngym-exercises.json and gym-templates.json are the exercise library and\\r\\nthe built-in day templates. They are not written by anything at run\\r\\ntime — they are files in the repository that terraform uploads, so\\r\\nediting one is an apply rather than a deploy. They are here rather\\r\\nthan in Cosmos because they are identical for every account and change\\r\\nwhen the app ships: served per account they would cost a function\\r\\ninvocation, a token and an RU to hand back the same objects. Cached\\r\\nfor a day, which is also the worst case for a new exercise reaching a\\r\\nphone that has already loaded the app.\\r\\n\\r\\nAnonymous read is what lets all three be fetched with no key, no token\\r\\nand no function call in between. The gym fetches deliberately send no\\r\\nAuthorization header either: adding one would turn a simple\\r\\ncross-origin GET into a preflight this endpoint has no CORS rule for." <<CdnDataContainer>> as CdnDataContainer
}

User .[#8D8D8D,thickness=2].> Running : <color:#8D8D8D>Visits https://run.nygard.dev
IntegrationsSync .[#8D8D8D,thickness=2].> Whoop : <color:#8D8D8D>Refreshes the access token, then pages cycles, sleep, workouts and recovery
IntegrationsSync .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Reads whoop-clientsecret; reads and rewrites the rotating whoop-token
IntegrationsSync .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>Upserts each record on its WHOOP id, and one sync cursor per collection
IntegrationsDashboard .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>Queries the scored running workouts back out (the only query in the model)
Running .[#8D8D8D,thickness=2].> CdnDataContainer : <color:#8D8D8D>Fetches the built dashboard from the page (GET data/marathonprep.json)
IntegrationsDashboard .[#8D8D8D,thickness=2].> CdnDataContainer : <color:#8D8D8D>Publishes marathonprep.json (PUT, in place)
@enduml
`;case`runningPipeline`:return`@startuml
title "How WHOOP data reaches run.nygard.dev"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<IntegrationsSync>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Keyvault>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Whoop>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<IntegrationsDashboard>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Cosmos>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<CdnDataContainer>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam person<<User>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<Running>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==WHOOP sync\\n<size:10>[Timer + HTTP trigger, one shared gate]</size>\\n\\nWalks WHOOP collections into Cosmos. Timer at 00:00, 06:00, 12:00\\r\\nand 18:00 UTC; /api/whoop/sync is the same work on demand, and both\\r\\ngo through one runner holding one gate, so a manual call landing on\\r\\ntop of the scheduled run stands down rather than racing it.\\r\\n\\r\\nThe first runs backfill history newest-first on a time budget, each\\r\\npicking up where the last stopped. Once a collection runs out of\\r\\nhistory every later run re-reads the last seven days instead —\\r\\nWHOOP filters on start time, and a record it rescored keeps the\\r\\nstart it always had, so a "since last sync" query would never see\\r\\nit again." <<IntegrationsSync>> as IntegrationsSync
database "==Key Vault\\n<size:10>[Azure Key Vault — standard, RBAC data plane]</size>\\n\\nnygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\\r\\nhand from the WHOOP developer dashboard, and whoop-token.\\r\\n\\r\\nThe second is not configuration. WHOOP rotates the refresh token on\\r\\nevery use and the API writes the replacement straight back, so this is\\r\\nwhere that state lives between calls — which is why the identity holds\\r\\nSecrets Officer here rather than a reader role.\\r\\n\\r\\nTerraform Apply also reads HomeIP from here at run time, and the\\r\\nnygdev-ed25519 SSH public key sits beside it as its own resource." <<Keyvault>> as Keyvault
rectangle "==WHOOP\\n<size:10>[WHOOP API v2 — OAuth 2.0 + REST]</size>\\n\\nWearable platform, read-only to us and gated by an authorization code\\r\\ngrant. A person consents once and that yields a refresh token; every\\r\\nrefresh then rotates it, killing the old one the moment a new one is\\r\\nissued. So the replacement has to be captured and stored, or the\\r\\nintegration locks itself out." <<Whoop>> as Whoop
rectangle "==Dashboard build\\n<size:10>[Timer + HTTP trigger]</size>\\n\\nRebuilds the running dashboard from whatever is stored: pace by run\\r\\ntype, aerobic efficiency, weekly volume, acute:chronic workload,\\r\\nweekly time in zones. Timer at 00:15, 06:15, 12:15 and 18:15 UTC —\\r\\nfifteen minutes behind each sync, but not chained to it.\\r\\n\\r\\nIt only needs the sync to have finished, not to have succeeded,\\r\\nbecause it reads the stored runs rather than that run writes. The\\r\\nbuild is a pure function of those runs and the day, so a slot that\\r\\nfinds nothing new republishes what is already there.\\r\\n\\r\\n/api/running/dashboard is the same build on demand, for a backfill\\r\\n(where rebuilding after every sync call would be waste) or for a\\r\\nchange to the arithmetic, which reshapes the whole history." <<IntegrationsDashboard>> as IntegrationsDashboard
database "==Cosmos DB\\n<size:10>[Azure Cosmos DB (NoSQL) — free tier]</size>\\n\\nnygdev-cosmos-db / db, one account holding three containers that share\\r\\nnothing but the throughput. Local auth is off, so Entra role assignments\\r\\nare the only way in, and each is scoped to a single container rather than\\r\\nto the account: id-nygdev-api reaches \`gym\` alone, id-nygdev-integrations\\r\\nreaches \`primary\` and \`gps\`. So neither app can read what the other\\r\\nwrites, which matters most in one direction — \`gym\` is partitioned per\\r\\nuser and is the tenancy boundary.\\r\\n\\r\\n\`primary\` is the WHOOP store, partitioned on /type. \`gym\` is the\\r\\ntraining log, partitioned on /objectId — the signed-in caller, which is\\r\\nwhat makes the partition key the tenancy boundary rather than a routing\\r\\ndetail. \`gps\` is the phone location spool on /sender, with a three-day\\r\\nTTL.\\r\\n\\r\\nAll three are indexed opt-in, /* excluded and only what is filtered on\\r\\nincluded: /sport_name and /score_state on primary, for the dashboard\\r\\nbuild reading scored runs; /type and /mesoId on gym, for History and the\\r\\nblock map. Excluding is doing the most work on gym, where the sets are\\r\\nthe bulk of a document and are never filtered on — which is what keeps a\\r\\nset-tap costing the same on the thirtieth set as on the first.\\r\\n\\r\\nSession consistency, and the training log is what asked for it: log a\\r\\nset, re-read the session, and on Eventual the replica that answers may\\r\\nnot hold it yet. On a single-region account it costs the same RU as\\r\\nEventual." <<Cosmos>> as Cosmos
database "==data\\n<size:10>[Anonymous blob read; the container cannot be listed]</size>\\n\\nThree files, published by two different things.\\r\\n\\r\\nmarathonprep.json is the built running dashboard, written by the\\r\\nIntegrations app and rewritten in place on every build, carrying a five-minute\\r\\nCache-Control so each rebuild reaches the page well before the next\\r\\none runs.\\r\\n\\r\\ngym-exercises.json and gym-templates.json are the exercise library and\\r\\nthe built-in day templates. They are not written by anything at run\\r\\ntime — they are files in the repository that terraform uploads, so\\r\\nediting one is an apply rather than a deploy. They are here rather\\r\\nthan in Cosmos because they are identical for every account and change\\r\\nwhen the app ships: served per account they would cost a function\\r\\ninvocation, a token and an RU to hand back the same objects. Cached\\r\\nfor a day, which is also the worst case for a new exercise reaching a\\r\\nphone that has already loaded the app.\\r\\n\\r\\nAnonymous read is what lets all three be fetched with no key, no token\\r\\nand no function call in between. The gym fetches deliberately send no\\r\\nAuthorization header either: adding one would turn a simple\\r\\ncross-origin GET into a preflight this endpoint has no CORS rule for." <<CdnDataContainer>> as CdnDataContainer
person "==Visitor\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<User>> as User
rectangle "==run.nygard.dev\\n<size:10>[Azure Static Web App — Free SKU, westeurope]</size>\\n\\nnygdevrun — the running and marathon dashboard. Provisioned empty by\\r\\nterraform; content deployed from the nygdevweb repository.\\r\\n\\r\\nThe page holds no logic of its own worth drawing: it fetches one\\r\\npre-built JSON document from the CDN account and draws the charts in\\r\\nit. Nothing is computed here, and no function is called." <<Running>> as Running

IntegrationsSync .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Reads whoop-clientsecret and the stored refresh token
IntegrationsSync .[#8D8D8D,thickness=2].> Whoop : <color:#8D8D8D>refresh_token grant, re-requesting the offline scope
Whoop .[#8D8D8D,thickness=2].> IntegrationsSync : <color:#8D8D8D>A new access token, and a rotated refresh token — the old one is now dead
IntegrationsSync .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Writes the replacement, before the access token is used for anything
IntegrationsSync .[#8D8D8D,thickness=2].> Whoop : <color:#8D8D8D>Pages cycles, sleep, workouts and recovery, 25 records at a time
IntegrationsSync .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>Upserts each record on its WHOOP id, then saves the cursor
IntegrationsDashboard .[#8D8D8D,thickness=2].> Cosmos : <color:#8D8D8D>Fifteen minutes later: queries the scored running workouts
IntegrationsDashboard .[#8D8D8D,thickness=2].> CdnDataContainer : <color:#8D8D8D>Publishes marathonprep.json, with a five-minute cache lifetime
User .[#8D8D8D,thickness=2].> Running : <color:#8D8D8D>Opens run.nygard.dev, whenever
Running .[#8D8D8D,thickness=2].> CdnDataContainer : <color:#8D8D8D>The page fetches the published JSON directly — anonymous, no function in the path
@enduml
`;case`whoopRefresh`:return`@startuml
title "WHOOP refresh — spending and replacing the token"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<Integrations>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Keyvault>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Whoop>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
rectangle "==Integrations\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\nfunc-nygdev-integrations. Everything that feeds the estate from outside\\r\\nit, split off from the API so that app could have its gate turned on.\\r\\nRuns as id-nygdev-integrations, which reaches Cosmos, the vault and the\\r\\nCDN account without holding a key or a connection string.\\r\\n\\r\\nTwo jobs on schedules a quarter of an hour apart, drawn apart on\\r\\npurpose: one talks to WHOOP, the other to Cosmos and blob storage, so\\r\\nneither failure is reported as the other. Beside them sits the phone\\r\\nlocation spool — /api/gps/locations, a push rather than a schedule,\\r\\nwriting db/gps.\\r\\n\\r\\nNo Easy Auth here, and that is the point of the app rather than an\\r\\nomission. The WHOOP callback has to be reachable by WHOOP, and the rest\\r\\ncarry function keys, so there is no token for a gate to validate." <<Integrations>> as Integrations
database "==Key Vault\\n<size:10>[Azure Key Vault — standard, RBAC data plane]</size>\\n\\nnygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\\r\\nhand from the WHOOP developer dashboard, and whoop-token.\\r\\n\\r\\nThe second is not configuration. WHOOP rotates the refresh token on\\r\\nevery use and the API writes the replacement straight back, so this is\\r\\nwhere that state lives between calls — which is why the identity holds\\r\\nSecrets Officer here rather than a reader role.\\r\\n\\r\\nTerraform Apply also reads HomeIP from here at run time, and the\\r\\nnygdev-ed25519 SSH public key sits beside it as its own resource." <<Keyvault>> as Keyvault
rectangle "==WHOOP\\n<size:10>[WHOOP API v2 — OAuth 2.0 + REST]</size>\\n\\nWearable platform, read-only to us and gated by an authorization code\\r\\ngrant. A person consents once and that yields a refresh token; every\\r\\nrefresh then rotates it, killing the old one the moment a new one is\\r\\nissued. So the replacement has to be captured and stored, or the\\r\\nintegration locks itself out." <<Whoop>> as Whoop

Integrations .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Reads whoop-clientsecret and the current whoop-token
Integrations .[#8D8D8D,thickness=2].> Whoop : <color:#8D8D8D>refresh_token grant, re-requesting the offline scope
Whoop .[#8D8D8D,thickness=2].> Integrations : <color:#8D8D8D>New access token, and a rotated refresh token — the old one is now dead
Integrations .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Writes the rotated token as a new version of whoop-token
Integrations .[#8D8D8D,thickness=2].> Whoop : <color:#8D8D8D>Calls the data API with the access token
Whoop .[#8D8D8D,thickness=2].> Integrations : <color:#8D8D8D>Answers, and the access token is cached until it nears expiry
@enduml
`;case`whoopBootstrap`:return`@startuml
title "WHOOP consent — the one-time bootstrap"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<User>>{
  BackgroundColor #428a4f
  FontColor #f8fafc
  BorderColor #2d5d39
}
skinparam rectangle<<Integrations>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Keyvault>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Whoop>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
person "==Visitor\\n\\nReads the sites and plays on the game server. Also the person at the\\r\\nWHOOP consent screen, once — a refresh token can be renewed forever,\\r\\nbut only a human can create the first one.\\r\\n\\r\\nOn the training log they are more than a reader: they sign in, and the\\r\\nEntra object id that comes back is the Cosmos partition every block,\\r\\nsession and set of theirs is written under." <<User>> as User
rectangle "==Integrations\\n<size:10>[.NET 10 isolated — Flex Consumption]</size>\\n\\nfunc-nygdev-integrations. Everything that feeds the estate from outside\\r\\nit, split off from the API so that app could have its gate turned on.\\r\\nRuns as id-nygdev-integrations, which reaches Cosmos, the vault and the\\r\\nCDN account without holding a key or a connection string.\\r\\n\\r\\nTwo jobs on schedules a quarter of an hour apart, drawn apart on\\r\\npurpose: one talks to WHOOP, the other to Cosmos and blob storage, so\\r\\nneither failure is reported as the other. Beside them sits the phone\\r\\nlocation spool — /api/gps/locations, a push rather than a schedule,\\r\\nwriting db/gps.\\r\\n\\r\\nNo Easy Auth here, and that is the point of the app rather than an\\r\\nomission. The WHOOP callback has to be reachable by WHOOP, and the rest\\r\\ncarry function keys, so there is no token for a gate to validate." <<Integrations>> as Integrations
database "==Key Vault\\n<size:10>[Azure Key Vault — standard, RBAC data plane]</size>\\n\\nnygdev, in rg-nygdev-security. Holds whoop-clientsecret, copied in by\\r\\nhand from the WHOOP developer dashboard, and whoop-token.\\r\\n\\r\\nThe second is not configuration. WHOOP rotates the refresh token on\\r\\nevery use and the API writes the replacement straight back, so this is\\r\\nwhere that state lives between calls — which is why the identity holds\\r\\nSecrets Officer here rather than a reader role.\\r\\n\\r\\nTerraform Apply also reads HomeIP from here at run time, and the\\r\\nnygdev-ed25519 SSH public key sits beside it as its own resource." <<Keyvault>> as Keyvault
rectangle "==WHOOP\\n<size:10>[WHOOP API v2 — OAuth 2.0 + REST]</size>\\n\\nWearable platform, read-only to us and gated by an authorization code\\r\\ngrant. A person consents once and that yields a refresh token; every\\r\\nrefresh then rotates it, killing the old one the moment a new one is\\r\\nissued. So the replacement has to be captured and stored, or the\\r\\nintegration locks itself out." <<Whoop>> as Whoop

User .[#8D8D8D,thickness=2].> Integrations : <color:#8D8D8D>Opens /integrations/whoop/authorize (function key)
Integrations .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Reads whoop-clientsecret, to sign the state with
Integrations .[#8D8D8D,thickness=2].> User : <color:#8D8D8D>302 to the WHOOP consent screen (client id, scopes, signed state)
User .[#8D8D8D,thickness=2].> Whoop : <color:#8D8D8D>Signs in and grants the scopes
Whoop .[#8D8D8D,thickness=2].> User : <color:#8D8D8D>302 back to /integrations/whoop/callback with a code
User .[#8D8D8D,thickness=2].> Integrations : <color:#8D8D8D>The browser follows the redirect (anonymous; the state is the gate)
Integrations .[#8D8D8D,thickness=2].> Whoop : <color:#8D8D8D>Exchanges the code (authorization_code grant, client secret)
Whoop .[#8D8D8D,thickness=2].> Integrations : <color:#8D8D8D>Access token, and the first refresh token
Integrations .[#8D8D8D,thickness=2].> Keyvault : <color:#8D8D8D>Writes whoop-token
@enduml
`;default:throw Error(`Unknown viewId: `+e)}};export{e as pumlSource};