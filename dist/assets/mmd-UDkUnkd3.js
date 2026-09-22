var e=e=>{switch(e){case`apex`:return`---
title: "nygard.dev — the apex site"
---
graph LR
  User@{ icon: "fa:user", shape: rounded, label: "Visitor" }
  Web@{ shape: rounded, label: "nygard.dev" }
  subgraph Rpg["\`RPG Server\`"]
    Rpg.Caddy@{ shape: rectangle, label: "Caddy" }
    Rpg.Foundry@{ shape: rectangle, label: "Foundry VTT" }
  end
  User -. "\`Visits https://nygard.dev\`" .-> Web
  Web -. "\`Polls the Foundry status from the page (GET /api/status)\`" .-> Rpg.Caddy
  Rpg.Caddy -. "\`Reverse proxies to :30000\`" .-> Rpg.Foundry
`;case`delivery`:return`---
title: "Delivery — GitHub to Azure"
---
graph LR
  subgraph Github["\`GitHub\`"]
    Github.GhEnv@{ shape: rectangle, label: "Environment \\"NygDevAzure\\"" }
    subgraph Github.Repo["\`NygDevAzure\`"]
      Github.Repo.SrcC4@{ shape: rectangle, label: "c4/LikeC4/**" }
      Github.Repo.SrcTf@{ shape: rectangle, label: "terraform/**" }
      Github.Repo.SrcApi@{ shape: rectangle, label: "apifunctionapp/**" }
      Github.Repo.SrcGym@{ shape: rectangle, label: "gym/**" }
      Github.Repo.SrcPs@{ shape: rectangle, label: "psfunctionapp/**" }
    end
    subgraph Github.Actions["\`GitHub Actions\`"]
      Github.Actions.DeployC4@{ shape: rectangle, label: "Deploy LikeC4" }
      Github.Actions.TfApply@{ shape: rectangle, label: "Terraform Apply" }
      Github.Actions.DeployApi@{ shape: rectangle, label: "Deploy API Function App" }
      Github.Actions.DeployFunc@{ shape: rectangle, label: "Deploy PS Function App" }
      Github.Actions.DeployIntegrations@{ shape: rectangle, label: "Deploy Integrations Function App" }
    end
  end
  subgraph Entra["\`Microsoft Entra ID\`"]
    Entra.GhOidc@{ shape: rectangle, label: "GitHub deploy identity" }
  end
  Dev@{ icon: "fa:user", shape: rounded, label: "Developer" }
  subgraph Cdn["\`CDN Storage\`"]
    Cdn.WebSite@{ shape: disk, label: "$web" }
  end
  Tfstate@{ shape: disk, label: "Terraform State" }
  Keyvault@{ shape: disk, label: "Key Vault" }
  Api@{ shape: rectangle, label: "API" }
  Azadmin@{ shape: rectangle, label: "Admin Automation" }
  Integrations@{ shape: rectangle, label: "Integrations" }
  Azurerm@{ shape: rectangle, label: "Azure Resource Manager" }
  Github.Repo.SrcC4 -. "\`Change here runs\`" .-> Github.Actions.DeployC4
  Github.Repo.SrcTf -. "\`Change here is applied by\`" .-> Github.Actions.TfApply
  Github.Repo.SrcApi -. "\`Change here runs\`" .-> Github.Actions.DeployApi
  Github.Repo.SrcGym -. "\`Change here is uploaded by\`" .-> Github.Actions.TfApply
  Github.Repo.SrcPs -. "\`Change here runs\`" .-> Github.Actions.DeployFunc
  Github.Actions.TfApply -. "\`terraform apply -auto-approve\`" .-> Azurerm
  Entra.GhOidc -. "\`Authorises calls against (RBAC on the subscription)\`" .-> Azurerm
  Github.Actions.TfApply -. "\`Locks and writes state\`" .-> Tfstate
  Github.Actions.TfApply -. "\`Reads HomeIP, and the nygdev-ed25519 public key beside it, at run time\`" .-> Keyvault
  Github.Actions.DeployApi -. "\`Deploys the published worker\`" .-> Api
  Github.Actions.DeployIntegrations -. "\`Deploys the published worker\`" .-> Integrations
  Github.Actions.DeployFunc -. "\`Deploys the function package\`" .-> Azadmin
  Github.Actions.DeployC4 -. "\`Clears and re-uploads dist/ (az storage blob upload-batch)\`" .-> Cdn.WebSite
  Dev -. "\`git push (master)\`" .-> Github.Repo
  Github.GhEnv -. "\`Supplies tenant, subscription and client ids to\`" .-> Github.Actions
  Github.Actions -. "\`Presents the runner OIDC token (azure/login@v3)\`" .-> Entra.GhOidc
`;case`gym`:return`---
title: "gym.nygard.dev and gymbro.nygard.dev — the training log"
---
graph LR
  User@{ icon: "fa:user", shape: rounded, label: "Visitor" }
  subgraph _gr1["\`The training log, in two shells\`"]
    _gr1.Gym@{ shape: rounded, label: "gym.nygard.dev" }
    _gr1.Gymbro@{ shape: rounded, label: "gymbro.nygard.dev" }
  end
  subgraph Entra["\`Microsoft Entra ID\`"]
    Entra.Gymlog@{ shape: rectangle, label: "GymLog" }
  end
  subgraph Cdn["\`CDN Storage\`"]
    Cdn.DataContainer@{ shape: disk, label: "data" }
  end
  Api@{ shape: rectangle, label: "API" }
  Cosmos@{ shape: disk, label: "Cosmos DB" }
  User -. "\`Logs a session at https://gym.nygard.dev\`" .-> _gr1.Gym
  User -. "\`Plans a block at https://gymbro.nygard.dev\`" .-> _gr1.Gymbro
  _gr1.Gym -. "\`Signs in as this registration (MSAL, authorization code with PKCE)\`" .-> Entra.Gymlog
  _gr1.Gym -. "\`Reads and writes the training log, one tap at a time\`" .-> Api
  _gr1.Gymbro -. "\`Reads and writes the same routes, a whole block at a time\`" .-> Api
  Api -. "\`Reads and writes the blocks, sessions and saved templates in db/gym, under the object id off the token\`" .-> Cosmos
  _gr1.Gym -. "\`Fetches the exercise library and the built-in day templates, once, and caches them\`" .-> Cdn.DataContainer
`;case`gymSignIn`:return`---
title: "Signing in to the training log"
---
graph LR
  User@{ icon: "fa:user", shape: rounded, label: "Visitor" }
  Gym@{ shape: rounded, label: "gym.nygard.dev" }
  EntraGymlog@{ shape: rectangle, label: "GymLog" }
  Api@{ shape: rectangle, label: "API" }
  Cosmos@{ shape: disk, label: "Cosmos DB" }
  User -. "\`Taps sign in\`" .-> Gym
  Gym -. "\`Redirects to Entra as GymLog: authorization code with PKCE, no secret\`" .-> EntraGymlog
  EntraGymlog -. "\`Code back to the bridge page, which broadcasts it to the app\`" .-> Gym
  Gym -. "\`Exchanges the code, then asks for an access token for the API scope\`" .-> EntraGymlog
  EntraGymlog -. "\`An access token: minted for GymLog, obtained by GymLog\`" .-> Gym
  Gym -. "\`Calls a gym route with the token in the Authorization header\`" .-> Api
  Api -. "\`Easy Auth validates it — signature, issuer tenant, audience, and which client obtained it\`" .-> EntraGymlog
  Api -. "\`The route reads the object id off the validated principal, and partitions on that\`" .-> Cosmos
`;case`gymSet`:return`---
title: "Logging a set, and what a lost reply costs"
---
graph TB
  User@{ icon: "fa:user", shape: rounded, label: "Visitor" }
  Gym@{ shape: rounded, label: "gym.nygard.dev" }
  Api@{ shape: rectangle, label: "API" }
  Cosmos@{ shape: disk, label: "Cosmos DB" }
  User -. "\`Taps 'Log same again'\`" .-> Gym
  Gym -. "\`POSTs the set, carrying the set count the page believes the exercise holds\`" .-> Api
  Api -. "\`Patches the session — but only while the stored count still matches\`" .-> Cosmos
  Api -. "\`200: recorded, and the row the page already drew is now stored\`" .-> Gym
  Gym -. "\`The reply never arrived, so the same request again\`" .-> Api
  Api -. "\`The count no longer matches, so the patch does not apply\`" .-> Cosmos
  Api -. "\`200 alreadyRecorded: the first attempt landed, and nothing was written twice\`" .-> Gym
`;case`index`:return'---\ntitle: "The estate — five front doors"\n---\ngraph LR\n  User@{ icon: "fa:user", shape: rounded, label: "Visitor" }\n  Integrations@{ shape: rectangle, label: "Integrations" }\n  Web@{ shape: rounded, label: "nygard.dev" }\n  Running@{ shape: rounded, label: "run.nygard.dev" }\n  Gym@{ shape: rounded, label: "gym.nygard.dev" }\n  Gymbro@{ shape: rounded, label: "gymbro.nygard.dev" }\n  Keyvault@{ shape: disk, label: "Key Vault" }\n  Whoop@{ shape: rectangle, label: "WHOOP" }\n  Rpg@{ shape: rectangle, label: "RPG Server" }\n  Api@{ shape: rectangle, label: "API" }\n  Cdn@{ shape: disk, label: "CDN Storage" }\n  Cosmos@{ shape: disk, label: "Cosmos DB" }\n  Azadmin@{ shape: rectangle, label: "Admin Automation" }\n  User -. "`Visits https://nygard.dev`" .-> Web\n  User -. "`Visits https://run.nygard.dev`" .-> Running\n  User -. "`Plays at https://rpg.nygard.dev`" .-> Rpg\n  Web -. "`Polls the Foundry status from the page (GET /api/status)`" .-> Rpg\n  User -. "`Logs a session at https://gym.nygard.dev`" .-> Gym\n  User -. "`Plans a block at https://gymbro.nygard.dev`" .-> Gymbro\n  Gym -. "`Reads and writes the training log, one tap at a time`" .-> Api\n  Gymbro -. "`Reads and writes the same routes, a whole block at a time`" .-> Api\n  Api -. "`Reads and writes the blocks, sessions and saved templates in db/gym, under the object id off the token`" .-> Cosmos\n  Integrations -. "`[...]`" .-> Cosmos\n  Integrations -. "`Reads whoop-clientsecret; reads and rewrites the rotating whoop-token`" .-> Keyvault\n  Running -. "`Fetches the built dashboard from the page (GET data/marathonprep.json)`" .-> Cdn\n  Rpg -. "`Holds asset URLs pointing at`" .-> Cdn\n  Integrations -. "`Publishes marathonprep.json (PUT, in place)`" .-> Cdn\n  Cdn -. "`Serves media straight to the player browser`" .-> User\n  Cdn -. "`Blob-created events (Event Grid)`" .-> Azadmin\n  Azadmin -. "`Sets Cache-Control on blobs`" .-> Cdn\n  Integrations -. "`Refreshes the access token, then pages cycles, sleep, workouts and recovery`" .-> Whoop\n';case`azureDeployment`:return`---
title: "Deployment — the whole subscription"
---
graph LR
  subgraph Internet["\`Internet\`"]
    Internet.Browser@{ icon: "fa:user", shape: rounded, label: "Visitor browser" }
    Internet.WhoopApi@{ shape: rectangle, label: "api.prod.whoop.com" }
  end
  subgraph Azure["\`Azure Subscription\`"]
    subgraph Azure.RgConsumption["\`rg-nygdev-consumption\`"]
      subgraph Azure.RgConsumption.AspPs["\`asp-nygdev-flex-ps\`"]
        Azure.RgConsumption.AspPs.AzadminApp@{ shape: rectangle, label: "func-nygdev-azadmin" }
      end
      Azure.RgConsumption.FuncStorage@{ shape: rectangle, label: "nygdevfunc" }
      subgraph Azure.RgConsumption.AspDotnet["\`asp-nygdev-flex-dotnet\`"]
        Azure.RgConsumption.AspDotnet.ApiApp@{ shape: rectangle, label: "func-nygdev-api" }
      end
      Azure.RgConsumption.AspIntegrations@{ shape: rectangle, label: "asp-nygdev-flex-integrations" }
      Azure.RgConsumption.AppInsights@{ shape: rectangle, label: "appi-nygdev-consumption" }
    end
    subgraph Azure.RgDb["\`rg-nygdev-db\`"]
      Azure.RgDb.SqlServer@{ shape: rectangle, label: "sql-nygdev" }
      Azure.RgDb.CosmosDb@{ shape: disk, label: "nygdev-cosmos-db" }
    end
    subgraph Azure.RgWeb["\`rg-nygdev-web\`"]
      subgraph Azure.RgWeb.CdnStorage["\`nygdevcdn\`"]
        Azure.RgWeb.CdnStorage.WebContainer@{ shape: disk, label: "$web" }
        Azure.RgWeb.CdnStorage.DataContainer@{ shape: disk, label: "data" }
        Azure.RgWeb.CdnStorage.MediaContainer@{ shape: disk, label: "foundry" }
      end
      Azure.RgWeb.Apex@{ shape: rounded, label: "nygdevapex" }
      Azure.RgWeb.RunDash@{ shape: rounded, label: "nygdevrun" }
      Azure.RgWeb.GymSite@{ shape: rounded, label: "nygdevgym" }
      Azure.RgWeb.GymbroSite@{ shape: rounded, label: "nygdevgymbro" }
    end
    subgraph Azure.RgNetwork["\`rg-nygdev-network\`"]
      Azure.RgNetwork.Pip@{ shape: rectangle, label: "rpg-pip" }
      subgraph Azure.RgNetwork.VnetMain["\`nygdev-vnet\`"]
        Azure.RgNetwork.VnetMain.SubnetRpg@{ shape: rectangle, label: "rpg-snet" }
      end
    end
    subgraph Azure.RgVm["\`rg-nygdev-vm\`"]
      subgraph Azure.RgVm.RpgVm["\`rpg-vm\`"]
        Azure.RgVm.RpgVm.CaddyProc@{ shape: rectangle, label: "Caddy" }
        Azure.RgVm.RpgVm.FoundryProc@{ shape: rectangle, label: "Foundry VTT" }
      end
    end
    subgraph Azure.RgData["\`rg-nygdev-data\`"]
      Azure.RgData.FoundryData@{ shape: rectangle, label: "foundrydata" }
    end
    subgraph Azure.RgSecurity["\`rg-nygdev-security\`"]
      Azure.RgSecurity.Kv@{ shape: rectangle, label: "nygdev" }
    end
  end
  Internet.Browser -. "\`Grants WHOOP access, once (GET /api/whoop/authorize)\`" .-> Azure.RgConsumption.AspIntegrations
  Azure.RgConsumption.AspIntegrations -. "\`Telemetry, to the same workspace\`" .-> Azure.RgConsumption.AppInsights
  Azure.RgConsumption.AspIntegrations -. "\`[...]\`" .-> Internet.WhoopApi
  Azure.RgConsumption.AspDotnet.ApiApp -. "\`Telemetry (OpenTelemetry)\`" .-> Azure.RgConsumption.AppInsights
  Azure.RgConsumption.AspPs.AzadminApp -. "\`Telemetry\`" .-> Azure.RgConsumption.AppInsights
  Azure.RgConsumption.AspIntegrations -. "\`[...]\`" .-> Azure.RgDb.CosmosDb
  Azure.RgConsumption.AspDotnet.ApiApp -. "\`[...]\`" .-> Azure.RgDb.CosmosDb
  Internet.Browser -. "\`[...]\`" .-> Azure.RgWeb.Apex
  Internet.Browser -. "\`[...]\`" .-> Azure.RgWeb.RunDash
  Internet.Browser -. "\`[...]\`" .-> Azure.RgWeb.GymSite
  Internet.Browser -. "\`[...]\`" .-> Azure.RgWeb.GymbroSite
  Azure.RgWeb.GymSite -. "\`[...]\`" .-> Azure.RgConsumption.AspDotnet.ApiApp
  Azure.RgWeb.GymbroSite -. "\`[...]\`" .-> Azure.RgConsumption.AspDotnet.ApiApp
  Azure.RgConsumption.AspIntegrations -. "\`[...]\`" .-> Azure.RgWeb.CdnStorage.DataContainer
  Azure.RgConsumption.AspPs.AzadminApp -. "\`Sets Cache-Control on blobs\`" .-> Azure.RgWeb.CdnStorage.MediaContainer
  Azure.RgWeb.RunDash -. "\`Fetches the built dashboard from the page (GET data/marathonprep.json)\`" .-> Azure.RgWeb.CdnStorage.DataContainer
  Azure.RgWeb.GymSite -. "\`Fetches the exercise library and the built-in day templates, once, and caches them\`" .-> Azure.RgWeb.CdnStorage.DataContainer
  Azure.RgWeb.GymbroSite -. "\`Fetches the same two files\`" .-> Azure.RgWeb.CdnStorage.DataContainer
  Azure.RgWeb.CdnStorage.MediaContainer -. "\`Serves media straight to the player browser\`" .-> Internet.Browser
  Azure.RgWeb.CdnStorage.MediaContainer -. "\`Blob-created events (Event Grid)\`" .-> Azure.RgConsumption.AspPs.AzadminApp
  Internet.Browser -. "\`HTTPS to rpg.nygard.dev\`" .-> Azure.RgNetwork.Pip
  Azure.RgNetwork.Pip -. "\`Forwards 80/443 through rpg-snet\`" .-> Azure.RgVm.RpgVm.CaddyProc
  Azure.RgVm.RpgVm.CaddyProc -. "\`Reverse proxies to :30000\`" .-> Azure.RgVm.RpgVm.FoundryProc
  Azure.RgVm.RpgVm.FoundryProc -. "\`Holds asset URLs pointing at\`" .-> Azure.RgWeb.CdnStorage.MediaContainer
  Azure.RgVm.RpgVm.FoundryProc -. "\`Stores worlds, modules and media on the attached disk\`" .-> Azure.RgData.FoundryData
  Azure.RgConsumption.AspIntegrations -. "\`HTTPS/443, Entra token for id-nygdev-integrations\`" .-> Azure.RgSecurity.Kv
`;case`rpg`:return`---
title: "rpg.nygard.dev — Foundry VTT"
---
graph LR
  User@{ icon: "fa:user", shape: rounded, label: "Visitor" }
  subgraph Rpg["\`RPG Server\`"]
    Rpg.Foundry@{ shape: rectangle, label: "Foundry VTT" }
    Rpg.Client@{ shape: rounded, label: "Foundry Client" }
    Rpg.Caddy@{ shape: rectangle, label: "Caddy" }
  end
  subgraph Cdn["\`CDN Storage\`"]
    Cdn.FoundryMedia@{ shape: disk, label: "foundry" }
  end
  Rpg.Client -. "\`HTTPS / WSS to rpg.nygard.dev\`" .-> Rpg.Caddy
  Rpg.Foundry -. "\`Serves the game UI and world data\`" .-> Rpg.Client
  Rpg.Caddy -. "\`Reverse proxies to :30000\`" .-> Rpg.Foundry
  User -. "\`Plays at https://rpg.nygard.dev\`" .-> Rpg.Client
  Rpg.Foundry -. "\`Holds asset URLs pointing at\`" .-> Cdn.FoundryMedia
  Cdn.FoundryMedia -. "\`Serves media straight to the player browser\`" .-> User
`;case`rpgInfra`:return`---
title: "The infrastructure behind rpg.nygard.dev"
---
graph TB
  subgraph Internet["\`Internet\`"]
    Internet.Browser@{ icon: "fa:user", shape: rounded, label: "Visitor browser" }
  end
  subgraph Azure["\`Azure Subscription\`"]
    subgraph Azure.RgNetwork["\`rg-nygdev-network\`"]
      Azure.RgNetwork.Pip@{ shape: rectangle, label: "rpg-pip" }
      subgraph Azure.RgNetwork.VnetMain["\`nygdev-vnet\`"]
        Azure.RgNetwork.VnetMain.SubnetRpg@{ shape: rectangle, label: "rpg-snet" }
      end
    end
    subgraph Azure.RgVm["\`rg-nygdev-vm\`"]
      subgraph Azure.RgVm.RpgVm["\`rpg-vm\`"]
        Azure.RgVm.RpgVm.CaddyProc@{ shape: rectangle, label: "Caddy" }
        Azure.RgVm.RpgVm.FoundryProc@{ shape: rectangle, label: "Foundry VTT" }
      end
    end
    subgraph Azure.RgData["\`rg-nygdev-data\`"]
      Azure.RgData.FoundryData@{ shape: rectangle, label: "foundrydata" }
    end
    subgraph Azure.RgWeb["\`rg-nygdev-web\`"]
      subgraph Azure.RgWeb.CdnStorage["\`nygdevcdn\`"]
        Azure.RgWeb.CdnStorage.MediaContainer@{ shape: disk, label: "foundry" }
      end
    end
  end
  Internet.Browser -. "\`HTTPS to rpg.nygard.dev\`" .-> Azure.RgNetwork.Pip
  Azure.RgNetwork.Pip -. "\`Forwards 80/443 through rpg-snet\`" .-> Azure.RgVm.RpgVm.CaddyProc
  Azure.RgVm.RpgVm.CaddyProc -. "\`Reverse proxies to :30000\`" .-> Azure.RgVm.RpgVm.FoundryProc
  Azure.RgVm.RpgVm.FoundryProc -. "\`Stores worlds, modules and media on the attached disk\`" .-> Azure.RgData.FoundryData
  Azure.RgVm.RpgVm.FoundryProc -. "\`Holds asset URLs pointing at\`" .-> Azure.RgWeb.CdnStorage.MediaContainer
  Azure.RgWeb.CdnStorage.MediaContainer -. "\`Serves media straight to the player browser\`" .-> Internet.Browser
`;case`rpgTerraform`:return`---
title: "How terraform creates the RPG server"
---
graph LR
  subgraph Github["\`GitHub\`"]
    Github.GhEnv@{ shape: rectangle, label: "Environment \\"NygDevAzure\\"" }
    subgraph Github.Repo["\`NygDevAzure\`"]
      Github.Repo.SrcTf@{ shape: rectangle, label: "terraform/**" }
    end
    subgraph Github.Actions["\`GitHub Actions\`"]
      Github.Actions.TfApply@{ shape: rectangle, label: "Terraform Apply" }
    end
  end
  subgraph Entra["\`Microsoft Entra ID\`"]
    Entra.GhOidc@{ shape: rectangle, label: "GitHub deploy identity" }
  end
  Dev@{ icon: "fa:user", shape: rounded, label: "Developer" }
  Tfstate@{ shape: disk, label: "Terraform State" }
  Keyvault@{ shape: disk, label: "Key Vault" }
  Azurerm@{ shape: rectangle, label: "Azure Resource Manager" }
  Rpg@{ shape: rectangle, label: "RPG Server" }
  Github.Repo.SrcTf -. "\`Change here is applied by\`" .-> Github.Actions.TfApply
  Github.Actions.TfApply -. "\`terraform apply -auto-approve\`" .-> Azurerm
  Entra.GhOidc -. "\`Authorises calls against (RBAC on the subscription)\`" .-> Azurerm
  Github.Actions.TfApply -. "\`Locks and writes state\`" .-> Tfstate
  Github.Actions.TfApply -. "\`Reads HomeIP, and the nygdev-ed25519 public key beside it, at run time\`" .-> Keyvault
  Azurerm -. "\`Creates rpg-vm and its NIC, the public IP, the VNet, subnet and NSG, and attaches the foundrydata disk\`" .-> Rpg
  Dev -. "\`git push (master)\`" .-> Github.Repo
  Github.GhEnv -. "\`Supplies tenant, subscription and client ids to\`" .-> Github.Actions
  Github.Actions -. "\`Presents the runner OIDC token (azure/login@v3)\`" .-> Entra.GhOidc
  Entra.GhOidc -. "\`Issues a short-lived Azure access token to\`" .-> Github.Actions
`;case`running`:return`---
title: "run.nygard.dev — the running dashboard"
---
graph LR
  User@{ icon: "fa:user", shape: rounded, label: "Visitor" }
  subgraph Integrations["\`Integrations\`"]
    Integrations.Sync@{ shape: rectangle, label: "WHOOP sync" }
    Integrations.Dashboard@{ shape: rectangle, label: "Dashboard build" }
  end
  Running@{ shape: rounded, label: "run.nygard.dev" }
  Whoop@{ shape: rectangle, label: "WHOOP" }
  Keyvault@{ shape: disk, label: "Key Vault" }
  Cosmos@{ shape: disk, label: "Cosmos DB" }
  subgraph Cdn["\`CDN Storage\`"]
    Cdn.DataContainer@{ shape: disk, label: "data" }
  end
  User -. "\`Visits https://run.nygard.dev\`" .-> Running
  Integrations.Sync -. "\`Refreshes the access token, then pages cycles, sleep, workouts and recovery\`" .-> Whoop
  Integrations.Sync -. "\`Reads whoop-clientsecret; reads and rewrites the rotating whoop-token\`" .-> Keyvault
  Integrations.Sync -. "\`Upserts each record on its WHOOP id, and one sync cursor per collection\`" .-> Cosmos
  Integrations.Dashboard -. "\`Queries the scored running workouts back out (the only query in the model)\`" .-> Cosmos
  Running -. "\`Fetches the built dashboard from the page (GET data/marathonprep.json)\`" .-> Cdn.DataContainer
  Integrations.Dashboard -. "\`Publishes marathonprep.json (PUT, in place)\`" .-> Cdn.DataContainer
`;case`runningPipeline`:return`---
title: "How WHOOP data reaches run.nygard.dev"
---
graph TB
  IntegrationsSync@{ shape: rectangle, label: "WHOOP sync" }
  Keyvault@{ shape: disk, label: "Key Vault" }
  Whoop@{ shape: rectangle, label: "WHOOP" }
  IntegrationsDashboard@{ shape: rectangle, label: "Dashboard build" }
  Cosmos@{ shape: disk, label: "Cosmos DB" }
  CdnDataContainer@{ shape: disk, label: "data" }
  User@{ icon: "fa:user", shape: rounded, label: "Visitor" }
  Running@{ shape: rounded, label: "run.nygard.dev" }
  IntegrationsSync -. "\`Reads whoop-clientsecret and the stored refresh token\`" .-> Keyvault
  IntegrationsSync -. "\`refresh_token grant, re-requesting the offline scope\`" .-> Whoop
  Whoop -. "\`A new access token, and a rotated refresh token — the old one is now dead\`" .-> IntegrationsSync
  IntegrationsSync -. "\`Writes the replacement, before the access token is used for anything\`" .-> Keyvault
  IntegrationsSync -. "\`Pages cycles, sleep, workouts and recovery, 25 records at a time\`" .-> Whoop
  IntegrationsSync -. "\`Upserts each record on its WHOOP id, then saves the cursor\`" .-> Cosmos
  IntegrationsDashboard -. "\`Fifteen minutes later: queries the scored running workouts\`" .-> Cosmos
  IntegrationsDashboard -. "\`Publishes marathonprep.json, with a five-minute cache lifetime\`" .-> CdnDataContainer
  User -. "\`Opens run.nygard.dev, whenever\`" .-> Running
  Running -. "\`The page fetches the published JSON directly — anonymous, no function in the path\`" .-> CdnDataContainer
`;case`whoopRefresh`:return`---
title: "WHOOP refresh — spending and replacing the token"
---
graph TB
  Integrations@{ shape: rectangle, label: "Integrations" }
  Keyvault@{ shape: disk, label: "Key Vault" }
  Whoop@{ shape: rectangle, label: "WHOOP" }
  Integrations -. "\`Reads whoop-clientsecret and the current whoop-token\`" .-> Keyvault
  Integrations -. "\`refresh_token grant, re-requesting the offline scope\`" .-> Whoop
  Whoop -. "\`New access token, and a rotated refresh token — the old one is now dead\`" .-> Integrations
  Integrations -. "\`Writes the rotated token as a new version of whoop-token\`" .-> Keyvault
  Integrations -. "\`Calls the data API with the access token\`" .-> Whoop
  Whoop -. "\`Answers, and the access token is cached until it nears expiry\`" .-> Integrations
`;case`whoopBootstrap`:return'---\ntitle: "WHOOP consent — the one-time bootstrap"\n---\ngraph LR\n  User@{ icon: "fa:user", shape: rounded, label: "Visitor" }\n  Integrations@{ shape: rectangle, label: "Integrations" }\n  Keyvault@{ shape: disk, label: "Key Vault" }\n  Whoop@{ shape: rectangle, label: "WHOOP" }\n  User -. "`Opens /integrations/whoop/authorize (function key)`" .-> Integrations\n  Integrations -. "`Reads whoop-clientsecret, to sign the state with`" .-> Keyvault\n  Integrations -. "`302 to the WHOOP consent screen (client id, scopes, signed state)`" .-> User\n  User -. "`Signs in and grants the scopes`" .-> Whoop\n  Whoop -. "`302 back to /integrations/whoop/callback with a code`" .-> User\n  User -. "`The browser follows the redirect (anonymous; the state is the gate)`" .-> Integrations\n  Integrations -. "`Exchanges the code (authorization_code grant, client secret)`" .-> Whoop\n  Whoop -. "`Access token, and the first refresh token`" .-> Integrations\n  Integrations -. "`Writes whoop-token`" .-> Keyvault\n';default:throw Error(`Unknown viewId: `+e)}};export{e as mmdSource};