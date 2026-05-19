workspace "Azure Architectural Landscape" "Architectural landscape for the NygDevAzure platform." {

    !identifiers hierarchical

    # Icon root. Resolved relative to THIS DSL file (data/1/workspace.dsl), so
    # '../themes/Azure' reaches data/themes/Azure/. The parser reads each icon
    # file at parse time and embeds it as base64 in the workspace JSON; the
    # browser never fetches them by URL, so spaces/'+' in folder names are fine.
    !const ICONS "../themes/Azure"

    model {

        # -------------------------------------------------------------------
        # External
        # -------------------------------------------------------------------
        github = softwareSystem "GitHub" "Hosts Terraform IaC, C# .NET 10 and PowerShell source, and Actions workflows." {
            tags "External" "GitHub"
        }
        tenant = softwareSystem "nygdev.onmicrosoft.com" "Microsoft Entra tenant. Guest usage surface for external collaborators." {
            tags "Azure" "Tenant"
        }

        # -------------------------------------------------------------------
        # FoundryVTT: on-demand RPG site
        # Users hit nygdevapex (Static Web App), which calls start-rpg-server
        # (Logic App) through the azurevm-1 API Connection. start-rpg-server
        # boots rpg-vm, the VM that actually serves FoundryVTT. The VM's
        # NIC, public IP, disks and SSH key are part of the same system.
        # -------------------------------------------------------------------
        foundryVtt = softwareSystem "FoundryVTT" "On-demand FoundryVTT RPG site." {
            tags "Azure" "FoundryVTT"

            web = container "nygdevapex" "Front-end where users trigger 'start'." "Static Web App" {
                tags "Azure" "Static Web App"
            }
            starter = container "start-rpg-server" "Boots rpg-vm on demand." "Logic App" {
                tags "Azure" "Logic App"
            }
            apiConn = container "azurevm-1" "API Connection used by start-rpg-server to invoke Azure VM endpoints." "API Connection" {
                tags "Azure" "API Connection"
            }
            vm = container "rpg-vm" "Azure Virtual Machine running FoundryVTT." "Virtual Machine" {
                tags "Azure" "Virtual Machine"
            }
            nic = container "rpg-vm-nic" "Network interface attached to rpg-vm." "Network Interface" {
                tags "Azure" "Network Interface"
            }
            pip = container "rpg-pip" "Public IP bound to rpg-vm-nic." "Public IP" {
                tags "Azure" "Public IP"
            }
            osDisk = container "rpg-vm-osdisk" "OS disk for rpg-vm." "Disk" {
                tags "Azure" "Disk"
            }
            dataDisk = container "foundrydata" "Data disk holding Foundry worlds and assets." "Disk" {
                tags "Azure" "Disk"
            }
            sshKey = container "nygdev-ed25519" "SSH key for rpg-vm access." "SSH Key" {
                tags "Azure" "SSH Key"
            }
        }

        # -------------------------------------------------------------------
        # Compute - Function Apps and the plans they run on
        # -------------------------------------------------------------------
        group "Function Apps" {
            funcAzadmin = softwareSystem "func-nygdev-azadmin" "Function App performing Azure admin operations." {
                tags "Azure" "Function App"
            }
            funcLogger = softwareSystem "func-nygdev-logger" "Function App for logging and diagnostics." {
                tags "Azure" "Function App"
            }
            aspFlexDotnet = softwareSystem "asp-nygdev-flex-dotnet" "App Service plan, Flex Consumption, .NET runtime." {
                tags "Azure" "App Service Plan"
            }
            aspFlexPs = softwareSystem "asp-nygdev-flex-ps" "App Service plan, Flex Consumption, PowerShell runtime." {
                tags "Azure" "App Service Plan"
            }
            nygdevfunc = softwareSystem "nygdevfunc" "Storage account backing the Function Apps." {
                tags "Azure" "Storage Account"
            }
        }

        # -------------------------------------------------------------------
        # Networking
        # -------------------------------------------------------------------
        nygdevVnet = softwareSystem "nygdev-vnet" "Virtual network for the NygDev platform." {
            tags "Azure" "Virtual Network"
        }
        nygdevNsg = softwareSystem "nygdev-nsg" "Network security group applied to nygdev-vnet." {
            tags "Azure" "Network Security Group"
        }

        # -------------------------------------------------------------------
        # Storage (non-Function)
        # -------------------------------------------------------------------
        nygdevtfstate = softwareSystem "nygdevtfstate" "Storage account holding Terraform remote state." {
            tags "Azure" "Storage Account"
        }
        nygdevcdn = softwareSystem "nygdevcdn" "Storage account serving CDN content." {
            tags "Azure" "Storage Account"
        }

        # -------------------------------------------------------------------
        # Data
        # -------------------------------------------------------------------
        nygdevCosmosDb = softwareSystem "nygdev-cosmos-db" "Azure Cosmos DB account." {
            tags "Azure" "Cosmos DB"
        }

        # -------------------------------------------------------------------
        # Security
        # -------------------------------------------------------------------
        nygdevKv = softwareSystem "nygdev" "Key vault. Secrets, keys and certificates for the platform." {
            tags "Azure" "Key Vault"
        }

        # -------------------------------------------------------------------
        # Integration
        # -------------------------------------------------------------------
        cacheupdate = softwareSystem "cacheupdate" "Event Grid system topic broadcasting cache-update events." {
            tags "Azure" "Event Grid Topic"
        }

        # -------------------------------------------------------------------
        # Observability
        # -------------------------------------------------------------------
        group "Observability" {
            appiConsumption = softwareSystem "appi-nygdev-consumption" "Application Insights instance." {
                tags "Azure" "Application Insights"
            }
            logConsumption = softwareSystem "log-nygdev-consumption" "Log Analytics workspace backing appi-nygdev-consumption." {
                tags "Azure" "Log Analytics"
            }
            appiSmartDetection = softwareSystem "ApplicationInsightsSmartDetection" "Action group used by Smart Detection alerts." {
                tags "Azure" "Action Group"
            }
        }

        # -------------------------------------------------------------------
        # Web / front-end (unrelated to FoundryVTT)
        # -------------------------------------------------------------------
        gymlog = softwareSystem "gymlog" "Static Web App." {
            tags "Azure" "Static Web App"
        }
    }

    views {
        systemLandscape "Landscape" "The Azure architectural landscape." {
            include *
            autolayout lr 300 150
        }

        container foundryVtt "FoundryVtt" "Internal structure of the FoundryVTT system." {
            include *
            autolayout lr 200 100
        }

        styles {
            element "Element" {
                color #ffffff
                background #0078d4
                stroke #003766
                strokeWidth 4
                shape roundedbox
            }
            element "Azure" {
                background #0078d4
                stroke #003766
            }
            element "External" {
                background #24292e
                stroke #000000
            }
            element "GitHub" {
                icon "https://github.githubassets.com/favicons/favicon.svg"
            }

            # Compute
            element "Virtual Machine" {
                icon "${ICONS}/Compute - Virtual Machine.svg"
            }
            element "Disk" {
                icon "${ICONS}/Compute - Disks.svg"
            }
            element "Function App" {
                icon "${ICONS}/Compute - Function Apps.svg"
            }
            element "App Service Plan" {
                icon "${ICONS}/App Services - App Service Plans.svg"
            }

            # Networking
            element "Virtual Network" {
                icon "${ICONS}/Networking - Virtual Networks.svg"
            }
            element "Network Security Group" {
                icon "${ICONS}/Networking - Network Security Groups.svg"
            }
            element "Network Interface" {
                icon "${ICONS}/Networking - Network Interfaces.svg"
            }
            element "Public IP" {
                icon "${ICONS}/Networking - Public IP Addresses.svg"
            }

            # Storage / data
            element "Storage Account" {
                icon "${ICONS}/Storage - Storage Accounts.svg"
            }
            element "Cosmos DB" {
                icon "${ICONS}/Databases - Azure Cosmos DB.svg"
            }

            # Security / identity
            element "Key Vault" {
                icon "${ICONS}/Security - Key Vaults.svg"
            }
            element "SSH Key" {
                icon "${ICONS}/Other - SSH Keys.svg"
            }
            element "Tenant" {
                icon "${ICONS}/Identity - External Identities.svg"
            }

            # Integration
            element "Logic App" {
                icon "${ICONS}/Integration - Logic Apps.svg"
            }
            element "API Connection" {
                icon "${ICONS}/DevOps - API Connections.svg"
            }
            element "Event Grid Topic" {
                icon "${ICONS}/Integration - Event Grid Topics.svg"
            }

            # Observability
            element "Application Insights" {
                icon "${ICONS}/DevOps - Application Insights.svg"
            }
            element "Log Analytics" {
                icon "${ICONS}/Analytics - Log Analytics Workspaces.svg"
            }
            element "Action Group" {
                icon "${ICONS}/Management + Governance - Alerts.svg"
            }

            # Web
            element "Static Web App" {
                icon "${ICONS}/Web - Static Apps.svg"
            }
        }
    }

}
