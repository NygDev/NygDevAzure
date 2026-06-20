workspace "NygDev Azure" "Big-picture C4 model of the NygDevAzure estate" {

    !identifiers hierarchical

    model {
        u = person "User" "Uses the apps, websites and game server"

        entra = softwareSystem "Microsoft Entra ID" "Identity provider — issues JWTs for the Logger API" {
            tags "EntraID"
        }

        gym = softwareSystem "Gym Logger" "Offline-first PWA for logging lift sessions" {
            pwa = container "Gym Logger PWA" "Offline-first web app (service worker + IndexedDB), served from nygdevcdn static website" "HTML/JS PWA" {
                tags "StaticWebsite"
            }
            api = container "Logger API" "func-nygdev-logger — GetExercises, LogLiftSession" "Azure Functions, .NET 10 isolated (Flex Consumption)" {
                tags "FunctionApp"
            }
            db = container "Cosmos DB" "nygdev-cosmos-db / db / primary" "Azure Cosmos DB (NoSQL)" {
                tags "CosmosDB"
            }
        }

        web = softwareSystem "nygdev.dev" "Personal website (webapex) — free-tier Azure Static Web App" {
            tags "StaticApp"
        }

        rpg = softwareSystem "RPG Server" "rpg-vm — Ubuntu Linux VM running Foundry VTT (Caddy reverse proxy) behind rpg-pip public IP" {
            tags "VirtualMachine"
        }

        cdn = softwareSystem "CDN Storage" "nygdevcdn storage account — Gym Logger PWA static website and CDN for Foundry media (foundry container)" {
            tags "StorageAccount"
        }

        azadmin = softwareSystem "Admin Automation" "func-nygdev-azadmin — PowerShell 7.4 cache-control functions" {
            tags "FunctionApp"
        }

        u -> gym.pwa "Logs lifts with"
        u -> web "Visits"
        u -> rpg "Plays on"

        gym.pwa -> entra "Signs user in, obtains JWT"
        gym.pwa -> gym.api "Calls (HTTPS/JSON, bearer JWT)"
        gym.api -> entra "Validates JWTs against"
        gym.api -> gym.db "Reads/writes (managed identity)"

        rpg -> cdn "Holds asset URLs pointing to"
        azadmin -> cdn "Sets Cache-Control on blobs (managed identity)"
        cdn -> u "Serves Gym Logger PWA and Foundry media to (direct browser fetch)"
    }

    views {
        systemLandscape "Landscape" {
            include *
        }

        container gym "GymLoggerContainers" {
            include *
        }

        styles {
            element "Element" {
                color #0773af
                stroke #0773af
                strokeWidth 7
                shape roundedbox
            }
            element "Person" {
                shape person
            }
            element "Boundary" {
                strokeWidth 5
            }
            relationship "Relationship" {
                thickness 4
            }

            element "FunctionApp" {
                icon "../themes/Azure/Compute - Function Apps.svg"
            }
            element "CosmosDB" {
                icon "../themes/Azure/Databases - Azure Cosmos DB.svg"
            }
            element "StaticApp" {
                icon "../themes/Azure/Web - Static Apps.svg"
            }
            element "StaticWebsite" {
                icon "../themes/Azure/General - Folder Website.svg"
            }
            element "StorageAccount" {
                icon "../themes/Azure/Storage - Storage Accounts.svg"
            }
            element "VirtualMachine" {
                icon "../themes/Azure/Compute - Virtual Machine.svg"
            }
            element "EntraID" {
                icon "../themes/Azure/Identity - External Identities.svg"
            }
        }
    }

    configuration {
        scope none
    }

}
