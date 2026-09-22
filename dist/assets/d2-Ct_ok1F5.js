var e=e=>{switch(e){case`apex`:return`direction: right

User: {
  label: "Visitor"
  shape: c4-person
}
Web: {
  label: "nygard.dev"
}
Rpg: {
  label: "RPG Server"

  Caddy: {
    label: "Caddy"
  }
  Foundry: {
    label: "Foundry VTT"
  }
}

User -> Web: "Visits https://nygard.dev"
Web -> Rpg.Caddy: "Polls the Foundry status from the page (GET /api/status)"
Rpg.Caddy -> Rpg.Foundry: "Reverse proxies to :30000"
`;case`delivery`:return`direction: right

Github: {
  label: "GitHub"

  GhEnv: {
    label: "Environment \\"NygDevAzure\\""
  }
  Repo: {
    label: "NygDevAzure"
    shape: stored_data

    SrcC4: {
      label: "c4/LikeC4/**"
    }
    SrcTf: {
      label: "terraform/**"
    }
    SrcApi: {
      label: "apifunctionapp/**"
    }
    SrcGym: {
      label: "gym/**"
    }
    SrcPs: {
      label: "psfunctionapp/**"
    }
  }
  Actions: {
    label: "GitHub Actions"

    DeployC4: {
      label: "Deploy LikeC4"
    }
    TfApply: {
      label: "Terraform Apply"
    }
    DeployApi: {
      label: "Deploy API Function App"
    }
    DeployFunc: {
      label: "Deploy PS Function App"
    }
    DeployIntegrations: {
      label: "Deploy Integrations Function App"
    }
  }
}
Entra: {
  label: "Microsoft Entra ID"

  GhOidc: {
    label: "GitHub deploy identity"
  }
}
Dev: {
  label: "Developer"
  shape: c4-person
}
Cdn: {
  label: "CDN Storage"
  shape: stored_data

  WebSite: {
    label: "$web"
    shape: stored_data
  }
}
Tfstate: {
  label: "Terraform State"
  shape: stored_data
}
Keyvault: {
  label: "Key Vault"
  shape: stored_data
}
Api: {
  label: "API"
}
Azadmin: {
  label: "Admin Automation"
}
Integrations: {
  label: "Integrations"
}
Azurerm: {
  label: "Azure Resource Manager"
}

Github.Repo.SrcC4 -> Github.Actions.DeployC4: "Change here runs"
Github.Repo.SrcTf -> Github.Actions.TfApply: "Change here is applied by"
Github.Repo.SrcApi -> Github.Actions.DeployApi: "Change here runs"
Github.Repo.SrcGym -> Github.Actions.TfApply: "Change here is uploaded by"
Github.Repo.SrcPs -> Github.Actions.DeployFunc: "Change here runs"
Github.Actions.TfApply -> Azurerm: "terraform apply -auto-approve"
Entra.GhOidc -> Azurerm: "Authorises calls against (RBAC on the subscription)"
Github.Actions.TfApply -> Tfstate: "Locks and writes state"
Github.Actions.TfApply -> Keyvault: "Reads HomeIP, and the nygdev-ed25519 public key beside it, at run time"
Github.Actions.DeployApi -> Api: "Deploys the published worker"
Github.Actions.DeployIntegrations -> Integrations: "Deploys the published worker"
Github.Actions.DeployFunc -> Azadmin: "Deploys the function package"
Github.Actions.DeployC4 -> Cdn.WebSite: "Clears and re-uploads dist/ (az storage blob upload-batch)"
Dev -> Github.Repo: "git push (master)"
Github.GhEnv -> Github.Actions: "Supplies tenant, subscription and client ids to"
Github.Actions -> Entra.GhOidc: "Presents the runner OIDC token (azure/login@v3)"
`;case`gym`:return`direction: right

User: {
  label: "Visitor"
  shape: c4-person
}
@gr1: {
  label: "The training log, in two shells"

  : {
    label: "gym.nygard.dev"
  }
  O: {
    label: "gymbro.nygard.dev"
  }
}
Entra: {
  label: "Microsoft Entra ID"

  Gymlog: {
    label: "GymLog"
  }
}
Cdn: {
  label: "CDN Storage"
  shape: stored_data

  DataContainer: {
    label: "data"
    shape: stored_data
  }
}
Api: {
  label: "API"
}
Cosmos: {
  label: "Cosmos DB"
  shape: stored_data
}

User -> @gr1.: "Logs a session at https://gym.nygard.dev"
User -> @gr1.O: "Plans a block at https://gymbro.nygard.dev"
@gr1. -> Entra.Gymlog: "Signs in as this registration (MSAL, authorization code with PKCE)"
@gr1. -> Api: "Reads and writes the training log, one tap at a time"
@gr1.O -> Api: "Reads and writes the same routes, a whole block at a time"
Api -> Cosmos: "Reads and writes the blocks, sessions and saved templates in db/gym, under the object id off the token"
@gr1. -> Cdn.DataContainer: "Fetches the exercise library and the built-in day templates, once, and caches them"
`;case`gymSignIn`:return`direction: right

User: {
  label: "Visitor"
  shape: c4-person
}
Gym: {
  label: "gym.nygard.dev"
}
EntraGymlog: {
  label: "GymLog"
}
Api: {
  label: "API"
}
Cosmos: {
  label: "Cosmos DB"
  shape: stored_data
}

User -> Gym: "Taps sign in"
Gym -> EntraGymlog: "Redirects to Entra as GymLog: authorization code with PKCE, no secret"
EntraGymlog -> Gym: "Code back to the bridge page, which broadcasts it to the app"
Gym -> EntraGymlog: "Exchanges the code, then asks for an access token for the API scope"
EntraGymlog -> Gym: "An access token: minted for GymLog, obtained by GymLog"
Gym -> Api: "Calls a gym route with the token in the Authorization header"
Api -> EntraGymlog: "Easy Auth validates it — signature, issuer tenant, audience, and which client obtained it"
Api -> Cosmos: "The route reads the object id off the validated principal, and partitions on that"
`;case`gymSet`:return`direction: down

User: {
  label: "Visitor"
  shape: c4-person
}
Gym: {
  label: "gym.nygard.dev"
}
Api: {
  label: "API"
}
Cosmos: {
  label: "Cosmos DB"
  shape: stored_data
}

User -> Gym: "Taps \\"Log same again\\""
Gym -> Api: "POSTs the set, carrying the set count the page believes the exercise holds"
Api -> Cosmos: "Patches the session — but only while the stored count still matches"
Api -> Gym: "200: recorded, and the row the page already drew is now stored"
Gym -> Api: "The reply never arrived, so the same request again"
Api -> Cosmos: "The count no longer matches, so the patch does not apply"
Api -> Gym: "200 alreadyRecorded: the first attempt landed, and nothing was written twice"
`;case`index`:return`direction: right

User: {
  label: "Visitor"
  shape: c4-person
}
Integrations: {
  label: "Integrations"
}
Web: {
  label: "nygard.dev"
}
Running: {
  label: "run.nygard.dev"
}
Gym: {
  label: "gym.nygard.dev"
}
Gymbro: {
  label: "gymbro.nygard.dev"
}
Keyvault: {
  label: "Key Vault"
  shape: stored_data
}
Whoop: {
  label: "WHOOP"
}
Rpg: {
  label: "RPG Server"
}
Api: {
  label: "API"
}
Cdn: {
  label: "CDN Storage"
  shape: stored_data
}
Cosmos: {
  label: "Cosmos DB"
  shape: stored_data
}
Azadmin: {
  label: "Admin Automation"
}

User -> Web: "Visits https://nygard.dev"
User -> Running: "Visits https://run.nygard.dev"
User -> Rpg: "Plays at https://rpg.nygard.dev"
Web -> Rpg: "Polls the Foundry status from the page (GET /api/status)"
User -> Gym: "Logs a session at https://gym.nygard.dev"
User -> Gymbro: "Plans a block at https://gymbro.nygard.dev"
Gym -> Api: "Reads and writes the training log, one tap at a time"
Gymbro -> Api: "Reads and writes the same routes, a whole block at a time"
Api -> Cosmos: "Reads and writes the blocks, sessions and saved templates in db/gym, under the object id off the token"
Integrations -> Cosmos: "[...]"
Integrations -> Keyvault: "Reads whoop-clientsecret; reads and rewrites the rotating whoop-token"
Running -> Cdn: "Fetches the built dashboard from the page (GET data/marathonprep.json)"
Rpg -> Cdn: "Holds asset URLs pointing at"
Integrations -> Cdn: "Publishes marathonprep.json (PUT, in place)"
Cdn -> User: "Serves media straight to the player browser"
Cdn -> Azadmin: "Blob-created events (Event Grid)"
Azadmin -> Cdn: "Sets Cache-Control on blobs"
Integrations -> Whoop: "Refreshes the access token, then pages cycles, sleep, workouts and recovery"
`;case`azureDeployment`:return`direction: right

Internet: {
  label: "Internet"

  Browser: {
    label: "Visitor browser"
    shape: c4-person
  }
  WhoopApi: {
    label: "api.prod.whoop.com"
  }
}
Azure: {
  label: "Azure Subscription"

  RgConsumption: {
    label: "rg-nygdev-consumption"

    AspPs: {
      label: "asp-nygdev-flex-ps"

      AzadminApp: {
        label: "func-nygdev-azadmin"
      }
    }
    FuncStorage: {
      label: "nygdevfunc"
    }
    AspDotnet: {
      label: "asp-nygdev-flex-dotnet"

      ApiApp: {
        label: "func-nygdev-api"
      }
    }
    AspIntegrations: {
      label: "asp-nygdev-flex-integrations"
    }
    AppInsights: {
      label: "appi-nygdev-consumption"
    }
  }
  RgDb: {
    label: "rg-nygdev-db"

    SqlServer: {
      label: "sql-nygdev"
    }
    CosmosDb: {
      label: "nygdev-cosmos-db"
      shape: stored_data
    }
  }
  RgWeb: {
    label: "rg-nygdev-web"

    CdnStorage: {
      label: "nygdevcdn"

      WebContainer: {
        label: "$web"
        shape: stored_data
      }
      DataContainer: {
        label: "data"
        shape: stored_data
      }
      MediaContainer: {
        label: "foundry"
        shape: stored_data
      }
    }
    Apex: {
      label: "nygdevapex"
    }
    RunDash: {
      label: "nygdevrun"
    }
    GymSite: {
      label: "nygdevgym"
    }
    GymbroSite: {
      label: "nygdevgymbro"
    }
  }
  RgNetwork: {
    label: "rg-nygdev-network"

    Pip: {
      label: "rpg-pip"
    }
    VnetMain: {
      label: "nygdev-vnet"

      SubnetRpg: {
        label: "rpg-snet"
      }
    }
  }
  RgVm: {
    label: "rg-nygdev-vm"

    RpgVm: {
      label: "rpg-vm"

      CaddyProc: {
        label: "Caddy"
      }
      FoundryProc: {
        label: "Foundry VTT"
      }
    }
  }
  RgData: {
    label: "rg-nygdev-data"

    FoundryData: {
      label: "foundrydata"
    }
  }
  RgSecurity: {
    label: "rg-nygdev-security"

    Kv: {
      label: "nygdev"
    }
  }
}

Internet.Browser -> Azure.RgConsumption.AspIntegrations: "Grants WHOOP access, once (GET /api/whoop/authorize)"
Azure.RgConsumption.AspIntegrations -> Azure.RgConsumption.AppInsights: "Telemetry, to the same workspace"
Azure.RgConsumption.AspIntegrations -> Internet.WhoopApi: "[...]"
Azure.RgConsumption.AspDotnet.ApiApp -> Azure.RgConsumption.AppInsights: "Telemetry (OpenTelemetry)"
Azure.RgConsumption.AspPs.AzadminApp -> Azure.RgConsumption.AppInsights: "Telemetry"
Azure.RgConsumption.AspIntegrations -> Azure.RgDb.CosmosDb: "[...]"
Azure.RgConsumption.AspDotnet.ApiApp -> Azure.RgDb.CosmosDb: "[...]"
Internet.Browser -> Azure.RgWeb.Apex: "[...]"
Internet.Browser -> Azure.RgWeb.RunDash: "[...]"
Internet.Browser -> Azure.RgWeb.GymSite: "[...]"
Internet.Browser -> Azure.RgWeb.GymbroSite: "[...]"
Azure.RgWeb.GymSite -> Azure.RgConsumption.AspDotnet.ApiApp: "[...]"
Azure.RgWeb.GymbroSite -> Azure.RgConsumption.AspDotnet.ApiApp: "[...]"
Azure.RgConsumption.AspIntegrations -> Azure.RgWeb.CdnStorage.DataContainer: "[...]"
Azure.RgConsumption.AspPs.AzadminApp -> Azure.RgWeb.CdnStorage.MediaContainer: "Sets Cache-Control on blobs"
Azure.RgWeb.RunDash -> Azure.RgWeb.CdnStorage.DataContainer: "Fetches the built dashboard from the page (GET data/marathonprep.json)"
Azure.RgWeb.GymSite -> Azure.RgWeb.CdnStorage.DataContainer: "Fetches the exercise library and the built-in day templates, once, and caches them"
Azure.RgWeb.GymbroSite -> Azure.RgWeb.CdnStorage.DataContainer: "Fetches the same two files"
Azure.RgWeb.CdnStorage.MediaContainer -> Internet.Browser: "Serves media straight to the player browser"
Azure.RgWeb.CdnStorage.MediaContainer -> Azure.RgConsumption.AspPs.AzadminApp: "Blob-created events (Event Grid)"
Internet.Browser -> Azure.RgNetwork.Pip: "HTTPS to rpg.nygard.dev"
Azure.RgNetwork.Pip -> Azure.RgVm.RpgVm.CaddyProc: "Forwards 80/443 through rpg-snet"
Azure.RgVm.RpgVm.CaddyProc -> Azure.RgVm.RpgVm.FoundryProc: "Reverse proxies to :30000"
Azure.RgVm.RpgVm.FoundryProc -> Azure.RgWeb.CdnStorage.MediaContainer: "Holds asset URLs pointing at"
Azure.RgVm.RpgVm.FoundryProc -> Azure.RgData.FoundryData: "Stores worlds, modules and media on the attached disk"
Azure.RgConsumption.AspIntegrations -> Azure.RgSecurity.Kv: "HTTPS/443, Entra token for id-nygdev-integrations"
`;case`rpg`:return`direction: right

User: {
  label: "Visitor"
  shape: c4-person
}
Rpg: {
  label: "RPG Server"

  Foundry: {
    label: "Foundry VTT"
  }
  Client: {
    label: "Foundry Client"
  }
  Caddy: {
    label: "Caddy"
  }
}
Cdn: {
  label: "CDN Storage"
  shape: stored_data

  FoundryMedia: {
    label: "foundry"
    shape: stored_data
  }
}

Rpg.Client -> Rpg.Caddy: "HTTPS / WSS to rpg.nygard.dev"
Rpg.Foundry -> Rpg.Client: "Serves the game UI and world data"
Rpg.Caddy -> Rpg.Foundry: "Reverse proxies to :30000"
User -> Rpg.Client: "Plays at https://rpg.nygard.dev"
Rpg.Foundry -> Cdn.FoundryMedia: "Holds asset URLs pointing at"
Cdn.FoundryMedia -> User: "Serves media straight to the player browser"
`;case`rpgInfra`:return`direction: down

Internet: {
  label: "Internet"

  Browser: {
    label: "Visitor browser"
    shape: c4-person
  }
}
Azure: {
  label: "Azure Subscription"

  RgNetwork: {
    label: "rg-nygdev-network"

    Pip: {
      label: "rpg-pip"
    }
    VnetMain: {
      label: "nygdev-vnet"

      SubnetRpg: {
        label: "rpg-snet"
      }
    }
  }
  RgVm: {
    label: "rg-nygdev-vm"

    RpgVm: {
      label: "rpg-vm"

      CaddyProc: {
        label: "Caddy"
      }
      FoundryProc: {
        label: "Foundry VTT"
      }
    }
  }
  RgData: {
    label: "rg-nygdev-data"

    FoundryData: {
      label: "foundrydata"
    }
  }
  RgWeb: {
    label: "rg-nygdev-web"

    CdnStorage: {
      label: "nygdevcdn"

      MediaContainer: {
        label: "foundry"
        shape: stored_data
      }
    }
  }
}

Internet.Browser -> Azure.RgNetwork.Pip: "HTTPS to rpg.nygard.dev"
Azure.RgNetwork.Pip -> Azure.RgVm.RpgVm.CaddyProc: "Forwards 80/443 through rpg-snet"
Azure.RgVm.RpgVm.CaddyProc -> Azure.RgVm.RpgVm.FoundryProc: "Reverse proxies to :30000"
Azure.RgVm.RpgVm.FoundryProc -> Azure.RgData.FoundryData: "Stores worlds, modules and media on the attached disk"
Azure.RgVm.RpgVm.FoundryProc -> Azure.RgWeb.CdnStorage.MediaContainer: "Holds asset URLs pointing at"
Azure.RgWeb.CdnStorage.MediaContainer -> Internet.Browser: "Serves media straight to the player browser"
`;case`rpgTerraform`:return`direction: right

Github: {
  label: "GitHub"

  GhEnv: {
    label: "Environment \\"NygDevAzure\\""
  }
  Repo: {
    label: "NygDevAzure"
    shape: stored_data

    SrcTf: {
      label: "terraform/**"
    }
  }
  Actions: {
    label: "GitHub Actions"

    TfApply: {
      label: "Terraform Apply"
    }
  }
}
Entra: {
  label: "Microsoft Entra ID"

  GhOidc: {
    label: "GitHub deploy identity"
  }
}
Dev: {
  label: "Developer"
  shape: c4-person
}
Tfstate: {
  label: "Terraform State"
  shape: stored_data
}
Keyvault: {
  label: "Key Vault"
  shape: stored_data
}
Azurerm: {
  label: "Azure Resource Manager"
}
Rpg: {
  label: "RPG Server"
}

Github.Repo.SrcTf -> Github.Actions.TfApply: "Change here is applied by"
Github.Actions.TfApply -> Azurerm: "terraform apply -auto-approve"
Entra.GhOidc -> Azurerm: "Authorises calls against (RBAC on the subscription)"
Github.Actions.TfApply -> Tfstate: "Locks and writes state"
Github.Actions.TfApply -> Keyvault: "Reads HomeIP, and the nygdev-ed25519 public key beside it, at run time"
Azurerm -> Rpg: "Creates rpg-vm and its NIC, the public IP, the VNet, subnet and NSG, and attaches the foundrydata disk"
Dev -> Github.Repo: "git push (master)"
Github.GhEnv -> Github.Actions: "Supplies tenant, subscription and client ids to"
Github.Actions -> Entra.GhOidc: "Presents the runner OIDC token (azure/login@v3)"
Entra.GhOidc -> Github.Actions: "Issues a short-lived Azure access token to"
`;case`running`:return`direction: right

User: {
  label: "Visitor"
  shape: c4-person
}
Integrations: {
  label: "Integrations"

  Sync: {
    label: "WHOOP sync"
  }
  Dashboard: {
    label: "Dashboard build"
  }
}
Running: {
  label: "run.nygard.dev"
}
Whoop: {
  label: "WHOOP"
}
Keyvault: {
  label: "Key Vault"
  shape: stored_data
}
Cosmos: {
  label: "Cosmos DB"
  shape: stored_data
}
Cdn: {
  label: "CDN Storage"
  shape: stored_data

  DataContainer: {
    label: "data"
    shape: stored_data
  }
}

User -> Running: "Visits https://run.nygard.dev"
Integrations.Sync -> Whoop: "Refreshes the access token, then pages cycles, sleep, workouts and recovery"
Integrations.Sync -> Keyvault: "Reads whoop-clientsecret; reads and rewrites the rotating whoop-token"
Integrations.Sync -> Cosmos: "Upserts each record on its WHOOP id, and one sync cursor per collection"
Integrations.Dashboard -> Cosmos: "Queries the scored running workouts back out (the only query in the model)"
Running -> Cdn.DataContainer: "Fetches the built dashboard from the page (GET data/marathonprep.json)"
Integrations.Dashboard -> Cdn.DataContainer: "Publishes marathonprep.json (PUT, in place)"
`;case`runningPipeline`:return`direction: down

IntegrationsSync: {
  label: "WHOOP sync"
}
Keyvault: {
  label: "Key Vault"
  shape: stored_data
}
Whoop: {
  label: "WHOOP"
}
IntegrationsDashboard: {
  label: "Dashboard build"
}
Cosmos: {
  label: "Cosmos DB"
  shape: stored_data
}
CdnDataContainer: {
  label: "data"
  shape: stored_data
}
User: {
  label: "Visitor"
  shape: c4-person
}
Running: {
  label: "run.nygard.dev"
}

IntegrationsSync -> Keyvault: "Reads whoop-clientsecret and the stored refresh token"
IntegrationsSync -> Whoop: "refresh_token grant, re-requesting the offline scope"
Whoop -> IntegrationsSync: "A new access token, and a rotated refresh token — the old one is now dead"
IntegrationsSync -> Keyvault: "Writes the replacement, before the access token is used for anything"
IntegrationsSync -> Whoop: "Pages cycles, sleep, workouts and recovery, 25 records at a time"
IntegrationsSync -> Cosmos: "Upserts each record on its WHOOP id, then saves the cursor"
IntegrationsDashboard -> Cosmos: "Fifteen minutes later: queries the scored running workouts"
IntegrationsDashboard -> CdnDataContainer: "Publishes marathonprep.json, with a five-minute cache lifetime"
User -> Running: "Opens run.nygard.dev, whenever"
Running -> CdnDataContainer: "The page fetches the published JSON directly — anonymous, no function in the path"
`;case`whoopRefresh`:return`direction: down

Integrations: {
  label: "Integrations"
}
Keyvault: {
  label: "Key Vault"
  shape: stored_data
}
Whoop: {
  label: "WHOOP"
}

Integrations -> Keyvault: "Reads whoop-clientsecret and the current whoop-token"
Integrations -> Whoop: "refresh_token grant, re-requesting the offline scope"
Whoop -> Integrations: "New access token, and a rotated refresh token — the old one is now dead"
Integrations -> Keyvault: "Writes the rotated token as a new version of whoop-token"
Integrations -> Whoop: "Calls the data API with the access token"
Whoop -> Integrations: "Answers, and the access token is cached until it nears expiry"
`;case`whoopBootstrap`:return`direction: right

User: {
  label: "Visitor"
  shape: c4-person
}
Integrations: {
  label: "Integrations"
}
Keyvault: {
  label: "Key Vault"
  shape: stored_data
}
Whoop: {
  label: "WHOOP"
}

User -> Integrations: "Opens /integrations/whoop/authorize (function key)"
Integrations -> Keyvault: "Reads whoop-clientsecret, to sign the state with"
Integrations -> User: "302 to the WHOOP consent screen (client id, scopes, signed state)"
User -> Whoop: "Signs in and grants the scopes"
Whoop -> User: "302 back to /integrations/whoop/callback with a code"
User -> Integrations: "The browser follows the redirect (anonymous; the state is the gate)"
Integrations -> Whoop: "Exchanges the code (authorization_code grant, client secret)"
Whoop -> Integrations: "Access token, and the first refresh token"
Integrations -> Keyvault: "Writes whoop-token"
`;default:throw Error(`Unknown viewId: `+e)}};export{e as d2Source};