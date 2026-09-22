var e=e=>{switch(e){case`apex`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=apex,
        nodesep=1.389,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=LR,
        ranksep=2.362,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_rpg {
        graph [color="#2a2490",
            fillcolor="#2225aa",
            label=<<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RPG SERVER</B></FONT>>,
            likec4_depth=1,
            likec4_id=rpg,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        caddy [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Caddy</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">Caddy</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Reverse proxy and TLS termination on 80/443,<BR/>for rpg.nygard.dev</FONT></TD></TR></TABLE>>,
            likec4_id="rpg.caddy",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        foundry [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Foundry VTT</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">Node.js, listening on :30000</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Self-hosted virtual tabletop, running as<BR/>srv_foundry off the foundrydata disk</FONT></TD></TR></TABLE>>,
            likec4_id="rpg.foundry",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    user [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Visitor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token<BR/>can be renewed forever,<BR/>but only a human can create the first one.</FONT></TD></TR></TABLE>>,
        likec4_id=user,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    web [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevapex. Links, and the live<BR/>status of the Foundry server.</FONT></TD></TR></TABLE>>,
        likec4_id=web,
        likec4_level=0,
        margin="0.112,0.306",
        width=4.445];
    user -> web [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Visits https://nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="4agz2j",
        minlen=0,
        style=dashed,
        weight=2];
    web -> caddy [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Polls the Foundry status from the page<BR/>(GET /api/status)</FONT></TD></TR></TABLE>>,
        likec4_id="1ebhhfu",
        style=dashed];
    caddy -> foundry [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reverse proxies to :30000</FONT></TD></TR></TABLE>>,
        likec4_id=tnfmbw,
        minlen=0,
        style=dashed,
        weight=2];
}
`;case`delivery`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=delivery,
        nodesep=1.389,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=LR,
        ranksep=2.362,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_github {
        graph [color="#292f37",
            fillcolor="#3a404a",
            label=<<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>GITHUB</B></FONT>>,
            likec4_depth=2,
            likec4_id=github,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        subgraph cluster_repo {
            graph [color="#462a17",
                fillcolor="#5a3620",
                label=<<FONT POINT-SIZE="11" COLOR="#f9b27cb3"><B>NYGDEVAZURE</B></FONT>>,
                likec4_depth=1,
                likec4_id="github.repo",
                likec4_level=1,
                margin=40,
                style=filled
            ];
            srcc4 [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                group=github,
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">c4/LikeC4/**</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">LikeC4 DSL</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">This model — specification, logical<BR/>model, delivery, deployment and<BR/>views</FONT></TD></TR></TABLE>>,
                likec4_id="github.repo.srcC4",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            srctf [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                group=github,
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">terraform/**</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Terraform HCL</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">The Azure estate: resource groups,<BR/>VNet, VM, storage, Cosmos, function<BR/>apps, Key Vault</FONT></TD></TR></TABLE>>,
                likec4_id="github.repo.srcTf",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            srcapi [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                group=github,
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">apifunctionapp/**</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">C# / .NET 10 isolated worker</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">The WHOOP endpoints, the two<BR/>timers, the running dashboard<BR/>build, the gym routes and the GPS<BR/>upload</FONT></TD></TR></TABLE>>,
                likec4_id="github.repo.srcApi",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            srcgym [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                group=github,
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">gym/**</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">JSON, uploaded as blobs</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">The gym exercise library and the<BR/>built-in day templates — the part<BR/>of the training log that is the<BR/>same for every account</FONT></TD></TR></TABLE>>,
                likec4_id="github.repo.srcGym",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            srcps [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                group=github,
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">psfunctionapp/**</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">PowerShell 7.4</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">cachecontrol and cachecontrolauto</FONT></TD></TR></TABLE>>,
                likec4_id="github.repo.srcPs",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
        }
        subgraph cluster_actions {
            graph [color="#462a17",
                fillcolor="#5a3620",
                label=<<FONT POINT-SIZE="11" COLOR="#f9b27cb3"><B>GITHUB ACTIONS</B></FONT>>,
                likec4_depth=1,
                likec4_id="github.actions",
                likec4_level=1,
                margin=40,
                style=filled
            ];
            deployc4 [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                group=github,
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Deploy LikeC4</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">deploy-likec4.yml — push to master</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Installs from the lockfile, runs<BR/>likec4 validate (a broken model<BR/>fails the run before anything is<BR/>touched), renders with likec4<BR/>build, then empties $web and</FONT></TD></TR></TABLE>>,
                likec4_id="github.actions.deployC4",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            tfapply [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                group=github,
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Terraform Apply</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">terraform-apply.yml —</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Authenticates with ARM_USE_OIDC,<BR/>fetches the home IP and the SSH<BR/>public key at run time, then<BR/>terraform apply -auto-approve.<BR/>Run by hand rather than on a push:</FONT></TD></TR></TABLE>>,
                likec4_id="github.actions.tfApply",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            deployapi [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                group=github,
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Deploy API Function App</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">deploy-api-function-app.yml — push</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">dotnet publish -c Release, then<BR/>Azure/functions-action@v1 to<BR/>func-nygdev-api. A build failure<BR/>stops the run before Azure is<BR/>touched.</FONT></TD></TR></TABLE>>,
                likec4_id="github.actions.deployApi",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            deployfunc [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                group=github,
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Deploy PS Function App</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">deploy-ps-function-app.yml — push</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Save-Module bundles Az.Accounts and<BR/>Az.Storage into the package, then<BR/>Azure/functions-action@v1 to<BR/>func-nygdev-azadmin.</FONT></TD></TR></TABLE>>,
                likec4_id="github.actions.deployFunc",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
            deployintegrations [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Deploy Integrations Function App</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">deploy-integrations-function-app.yml</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">The same two steps against<BR/>func-nygdev-integrations. A second<BR/>workflow rather than a matrix<BR/>because the path filters are what<BR/>decide which app a change</FONT></TD></TR></TABLE>>,
                likec4_id="github.actions.deployIntegrations",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
        }
        ghenv [color="#7E451D",
            fillcolor="#A35829",
            fontcolor="#FFE0C2",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Environment "NygDevAzure"</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">GitHub Actions environment</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">AZURE_CLIENT_ID, AZURE_TENANT_ID,<BR/>AZURE_SUBSCRIPTION_ID,<BR/>AZURE_KEYVAULT_NAME,<BR/>AZURE_VM_USERNAME,<BR/>ENTRA_OWNER_OBJECTID.</FONT></TD></TR></TABLE>>,
            likec4_id="github.ghEnv",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
    }
    subgraph cluster_entra {
        graph [color="#2d333d",
            fillcolor="#3e4651",
            label=<<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>MICROSOFT ENTRA ID</B></FONT>>,
            likec4_depth=1,
            likec4_id=entra,
            likec4_level=0,
            margin=32,
            style=filled
        ];
        ghoidc [color="#7E451D",
            fillcolor="#A35829",
            fontcolor="#FFE0C2",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">GitHub deploy identity</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Workload identity federation</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">The AZURE_CLIENT_ID principal.<BR/>Federated credentials trust<BR/>token.actions.githubusercontent.com<BR/>for this repository and the<BR/>NygDevAzure environment, so there</FONT></TD></TR></TABLE>>,
            likec4_id="entra.ghOidc",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
    }
    subgraph cluster_cdn {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>CDN STORAGE</B></FONT>>,
            likec4_depth=1,
            likec4_id=cdn,
            likec4_level=0,
            margin=32,
            style=filled
        ];
        website [height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">$web</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Storage static website</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">This model, rendered by likec4<BR/>build and served at the account<BR/>primary web endpoint</FONT></TD></TR></TABLE>>,
            likec4_id="cdn.webSite",
            likec4_level=1,
            margin="0.112,0",
            penwidth=2,
            shape=cylinder,
            width=4.445];
    }
    dev [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Developer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Authors the model, the terraform and the<BR/>function code, and pushes to master</FONT></TD></TR></TABLE>>,
        likec4_id=dev,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    dev -> srcc4 [arrowhead=normal,
        lhead=cluster_repo,
        likec4_id=gi4fq6,
        minlen=1,
        style=dashed,
        weight=2,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">git push (master)</FONT></TD></TR></TABLE>>];
    ghenv -> deployc4 [arrowhead=normal,
        lhead=cluster_actions,
        likec4_id="4xbth",
        minlen=1,
        style=dashed,
        weight=3,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Supplies tenant, subscription and client<BR/>ids to</FONT></TD></TR></TABLE>>];
    srcc4 -> deployc4 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Change here runs</FONT></TD></TR></TABLE>>,
        likec4_id="1szkzwm",
        style=dashed,
        weight=2];
    srctf -> tfapply [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Change here is applied by</FONT></TD></TR></TABLE>>,
        likec4_id=vn2k3d,
        minlen=1,
        style=dashed];
    srcapi -> deployapi [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Change here runs</FONT></TD></TR></TABLE>>,
        likec4_id="1bj31ie",
        minlen=1,
        style=dashed];
    srcgym -> tfapply [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Change here is uploaded by</FONT></TD></TR></TABLE>>,
        likec4_id=nyhmuw,
        minlen=1,
        style=dashed];
    srcps -> deployfunc [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Change here runs</FONT></TD></TR></TABLE>>,
        likec4_id="8w35jv",
        minlen=1,
        style=dashed];
    deployc4 -> website [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Clears and re-uploads dist/ (az storage<BR/>blob upload-batch)</FONT></TD></TR></TABLE>>,
        likec4_id="1urwsaq",
        minlen=1,
        style=dashed];
    tfstate [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Terraform State</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Blob Storage, AzureAD auth</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdevtfstate / tfstate /<BR/>azure-infrastructure.tfstate in<BR/>rg-nygdev-data</FONT></TD></TR></TABLE>>,
        likec4_id=tfstate,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    tfapply -> tfstate [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Locks and writes state</FONT></TD></TR></TABLE>>,
        likec4_id="1e5h2dd",
        minlen=1,
        style=dashed];
    keyvault [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Key Vault</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Key Vault — standard, RBAC</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev, in rg-nygdev-security.<BR/>Holds whoop-clientsecret, copied in<BR/>by<BR/>hand from the WHOOP developer<BR/>dashboard, and whoop-token.</FONT></TD></TR></TABLE>>,
        likec4_id=keyvault,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    tfapply -> keyvault [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads HomeIP, and the nygdev-ed25519<BR/>public key beside it, at run time</FONT></TD></TR></TABLE>>,
        likec4_id="2l7si1",
        minlen=1,
        style=dashed];
    azurerm [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Azure Resource Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">management.azure.com</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">The Azure control plane. Terraform and the az<BR/>CLI both reach the estate through it.</FONT></TD></TR></TABLE>>,
        likec4_id=azurerm,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    tfapply -> azurerm [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">terraform apply -auto-approve</FONT></TD></TR></TABLE>>,
        likec4_id="1yvzo3m",
        style=dashed];
    api [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">API</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-api. The training log<BR/>and nothing else since the split:<BR/>blocks, sessions, sets and saved<BR/>day templates, read and written a<BR/>tap</FONT></TD></TR></TABLE>>,
        likec4_id=api,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    deployapi -> api [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Deploys the published worker</FONT></TD></TR></TABLE>>,
        likec4_id=p3tog9,
        minlen=1,
        style=dashed];
    azadmin [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Admin Automation</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">PowerShell 7.4 — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-azadmin. Sets<BR/>Cache-Control on Foundry media<BR/>blobs, on demand and on<BR/>blob-created events.</FONT></TD></TR></TABLE>>,
        likec4_id=azadmin,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    deployfunc -> azadmin [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Deploys the function package</FONT></TD></TR></TABLE>>,
        likec4_id="11i3ag3",
        minlen=1,
        style=dashed];
    deployintegrations -> ghoidc [arrowhead=normal,
        likec4_id="1a53c2o",
        ltail=cluster_actions,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Presents the runner OIDC token<BR/>(azure/login@v3)</FONT></TD></TR></TABLE>>];
    integrations [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Integrations</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-integrations.<BR/>Everything that feeds the estate<BR/>from outside<BR/>it, split off from the API so that<BR/>app could have its gate turned on.</FONT></TD></TR></TABLE>>,
        likec4_id=integrations,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    deployintegrations -> integrations [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Deploys the published worker</FONT></TD></TR></TABLE>>,
        likec4_id="1e9erc9",
        minlen=1,
        style=dashed,
        weight=3];
    ghoidc -> azurerm [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Authorises calls against (RBAC on the<BR/>subscription)</FONT></TD></TR></TABLE>>,
        likec4_id="1oooyf4",
        style=dashed,
        weight=2];
}
`;case`gym`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=gym,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=LR,
        ranksep=2.084,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph "cluster_@gr1" {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>THE TRAINING LOG, IN TWO SHELLS</B></FONT>>,
            likec4_depth=1,
            likec4_id="@gr1",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        gym [color="#0369a1",
            fillcolor="#0284c7",
            fontcolor="#f0f9ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">gym.nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevgym — GymLog, the training<BR/>logger. Provisioned empty by<BR/>terraform;<BR/>the built React app is deployed<BR/>from the nygdevweb repository.</FONT></TD></TR></TABLE>>,
            likec4_id=gym,
            likec4_level=1,
            margin="0.112,0.306",
            width=4.445];
        gymbro [color="#0369a1",
            fillcolor="#0284c7",
            fontcolor="#f0f9ff",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">gymbro.nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevgymbro — the desktop planner<BR/>for the same training log. A Static<BR/>Web App of its own rather than a<BR/>path on the logger, because a<BR/>Static Web</FONT></TD></TR></TABLE>>,
            likec4_id=gymbro,
            likec4_level=1,
            margin="0.112,0.306",
            width=4.445];
    }
    subgraph cluster_entra {
        graph [color="#2d333d",
            fillcolor="#3e4651",
            label=<<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>MICROSOFT ENTRA ID</B></FONT>>,
            likec4_depth=1,
            likec4_id=entra,
            likec4_level=0,
            margin=32,
            style=filled
        ];
        gymlog [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">GymLog</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#cbd5e1">Single-page application platform,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#cbd5e1">The identity both gym front ends<BR/>sign in as, and the identity Easy<BR/>Auth on the API accepts. Both<BR/>halves of that check name it: the<BR/>token</FONT></TD></TR></TABLE>>,
            likec4_id="entra.gymlog",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
    }
    subgraph cluster_cdn {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>CDN STORAGE</B></FONT>>,
            likec4_depth=1,
            likec4_id=cdn,
            likec4_level=0,
            margin=32,
            style=filled
        ];
        datacontainer [height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">data</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Anonymous blob read; the container</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">Three files, published by two<BR/>different things.<BR/>marathonprep.json is the built<BR/>running dashboard, written by the<BR/>Integrations app and rewritten in</FONT></TD></TR></TABLE>>,
            likec4_id="cdn.dataContainer",
            likec4_level=1,
            margin="0.112,0",
            penwidth=2,
            shape=cylinder,
            width=4.445];
    }
    user [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Visitor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token<BR/>can be renewed forever,<BR/>but only a human can create the first one.</FONT></TD></TR></TABLE>>,
        likec4_id=user,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    user -> gym [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Logs a session at https://gym.nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="4ahc08",
        style=dashed,
        weight=2];
    user -> gymbro [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Plans a block at<BR/>https://gymbro.nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="31pcxj",
        style=dashed];
    api [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">API</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-api. The training log<BR/>and nothing else since the split:<BR/>blocks, sessions, sets and saved<BR/>day templates, read and written a<BR/>tap</FONT></TD></TR></TABLE>>,
        likec4_id=api,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    gym -> api [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes the training log, one<BR/>tap at a time</FONT></TD></TR></TABLE>>,
        likec4_id="1swlixt",
        style=dashed,
        weight=2];
    gym -> gymlog [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Signs in as this registration (MSAL,<BR/>authorization code with PKCE)</FONT></TD></TR></TABLE>>,
        likec4_id=rxtcek,
        minlen=1,
        style=dashed];
    gym -> datacontainer [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Fetches the exercise library and the<BR/>built-in day templates, once, and caches<BR/>them</FONT></TD></TR></TABLE>>,
        likec4_id=bd76uh,
        minlen=1,
        style=dashed];
    gymbro -> api [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes the same routes, a<BR/>whole block at a time</FONT></TD></TR></TABLE>>,
        likec4_id=lar5mm,
        style=dashed];
    cosmos [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Cosmos DB</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev-cosmos-db / db, one account<BR/>holding three containers that share<BR/>nothing but the throughput. Local<BR/>auth is off, so Entra role<BR/>assignments</FONT></TD></TR></TABLE>>,
        likec4_id=cosmos,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    api -> cosmos [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes the blocks, sessions<BR/>and saved templates in db/gym, under the<BR/>object id off the token</FONT></TD></TR></TABLE>>,
        likec4_id=jb1mak,
        minlen=0,
        style=dashed];
}
`;case`gymSignIn`:return`digraph {
  likec4_viewId = "gymSignIn";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "user" [
    likec4_id = "user";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Visitor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token<BR/>can be renewed forever,<BR/>but only a human can create the first one.</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#428a4f";
    fontcolor = "#f8fafc";
    color = "#2d5d39";
  ];
  "gym" [
    likec4_id = "gym";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">gym.nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevgym — GymLog, the training<BR/>logger. Provisioned empty by<BR/>terraform;<BR/>the built React app is deployed<BR/>from the nygdevweb repository.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.306";
    width = 4.445;
    height = 2.5;
    fillcolor = "#0284c7";
    fontcolor = "#f0f9ff";
    color = "#0369a1";
  ];
  "gymlog" [
    likec4_id = "entra.gymlog";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">GymLog</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#cbd5e1">Single-page application platform,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#cbd5e1">The identity both gym front ends<BR/>sign in as, and the identity Easy<BR/>Auth on the API accepts. Both<BR/>halves of that check name it: the<BR/>token</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "api" [
    likec4_id = "api";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">API</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-api. The training log<BR/>and nothing else since the split:<BR/>blocks, sessions, sets and saved<BR/>day templates, read and written a<BR/>tap</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "cosmos" [
    likec4_id = "cosmos";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Cosmos DB</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev-cosmos-db / db, one account<BR/>holding three containers that share<BR/>nothing but the throughput. Local<BR/>auth is off, so Entra role<BR/>assignments</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    penwidth = 2;
    shape = "cylinder";
  ];
  "user" -> "gym" [
    likec4_id = "step-01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>0</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Taps sign in</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gym" -> "gymlog" [
    likec4_id = "step-02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Redirects to Entra as GymLog:<BR/>authorization code with PKCE, no secret</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gym" -> "gymlog" [
    likec4_id = "step-03";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Code back to the bridge page, which<BR/>broadcasts it to the app</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "gym" -> "gymlog" [
    likec4_id = "step-04";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Exchanges the code, then asks for an<BR/>access token for the API scope</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gym" -> "gymlog" [
    likec4_id = "step-05";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">An access token: minted for GymLog,<BR/>obtained by GymLog</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "gym" -> "api" [
    likec4_id = "step-06";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Calls a gym route with the token in the<BR/>Authorization header</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gymlog" -> "api" [
    likec4_id = "step-07";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Easy Auth validates it — signature,<BR/>issuer tenant, audience, and which<BR/>client obtained it</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "api" -> "cosmos" [
    likec4_id = "step-08";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">The route reads the object id off the<BR/>validated principal, and partitions on<BR/>that</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
}`;case`gymSet`:return`digraph {
  likec4_viewId = "gymSet";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "user" [
    likec4_id = "user";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Visitor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token<BR/>can be renewed forever,<BR/>but only a human can create the first one.</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#428a4f";
    fontcolor = "#f8fafc";
    color = "#2d5d39";
  ];
  "gym" [
    likec4_id = "gym";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">gym.nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevgym — GymLog, the training<BR/>logger. Provisioned empty by<BR/>terraform;<BR/>the built React app is deployed<BR/>from the nygdevweb repository.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.306";
    width = 4.445;
    height = 2.5;
    fillcolor = "#0284c7";
    fontcolor = "#f0f9ff";
    color = "#0369a1";
  ];
  "api" [
    likec4_id = "api";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">API</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-api. The training log<BR/>and nothing else since the split:<BR/>blocks, sessions, sets and saved<BR/>day templates, read and written a<BR/>tap</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "cosmos" [
    likec4_id = "cosmos";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Cosmos DB</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev-cosmos-db / db, one account<BR/>holding three containers that share<BR/>nothing but the throughput. Local<BR/>auth is off, so Entra role<BR/>assignments</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    penwidth = 2;
    shape = "cylinder";
  ];
  "user" -> "gym" [
    likec4_id = "step-01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>0</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Taps "Log same again"</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gym" -> "api" [
    likec4_id = "step-02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">POSTs the set, carrying the set count<BR/>the page believes the exercise holds</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "api" -> "cosmos" [
    likec4_id = "step-03";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Patches the session — but only while the<BR/>stored count still matches</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gym" -> "api" [
    likec4_id = "step-04";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">200: recorded, and the row the page<BR/>already drew is now stored</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "gym" -> "api" [
    likec4_id = "step-05";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">The reply never arrived, so the same<BR/>request again</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "api" -> "cosmos" [
    likec4_id = "step-06";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">The count no longer matches, so the<BR/>patch does not apply</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gym" -> "api" [
    likec4_id = "step-07";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">200 alreadyRecorded: the first attempt<BR/>landed, and nothing was written twice</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case`index`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=index,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=LR,
        ranksep=2.084,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    user [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Visitor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token<BR/>can be renewed forever,<BR/>but only a human can create the first one.</FONT></TD></TR></TABLE>>,
        likec4_id=user,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    web [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevapex. Links, and the live<BR/>status of the Foundry server.</FONT></TD></TR></TABLE>>,
        likec4_id=web,
        likec4_level=0,
        margin="0.112,0.306",
        width=4.445];
    user -> web [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Visits https://nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="4agz2j",
        style=dashed];
    running [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">run.nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevrun — the running and<BR/>marathon dashboard. Provisioned<BR/>empty by<BR/>terraform; content deployed from<BR/>the nygdevweb repository.</FONT></TD></TR></TABLE>>,
        likec4_id=running,
        likec4_level=0,
        margin="0.112,0.306",
        width=4.445];
    user -> running [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Visits https://run.nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="11x91p8",
        style=dashed];
    gym [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">gym.nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevgym — GymLog, the training<BR/>logger. Provisioned empty by<BR/>terraform;<BR/>the built React app is deployed<BR/>from the nygdevweb repository.</FONT></TD></TR></TABLE>>,
        likec4_id=gym,
        likec4_level=0,
        margin="0.112,0.306",
        width=4.445];
    user -> gym [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Logs a session at https://gym.nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="4ahc08",
        style=dashed];
    gymbro [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">gymbro.nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevgymbro — the desktop planner<BR/>for the same training log. A Static<BR/>Web App of its own rather than a<BR/>path on the logger, because a<BR/>Static Web</FONT></TD></TR></TABLE>>,
        likec4_id=gymbro,
        likec4_level=0,
        margin="0.112,0.306",
        width=4.445];
    user -> gymbro [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Plans a block at<BR/>https://gymbro.nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="31pcxj",
        style=dashed];
    rpg [color="#4f46e5",
        fillcolor="#6366f1",
        fontcolor="#eef2ff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">RPG Server</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#c7d2fe">Azure Linux VM — Standard_B2s,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#c7d2fe">rpg-vm, behind the rpg-pip public<BR/>IP. Built by terraform and<BR/>configured by cloud-init; worlds<BR/>and media live on a separate disk<BR/>that survives the VM being rebuilt.</FONT></TD></TR></TABLE>>,
        likec4_id=rpg,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    user -> rpg [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Plays at https://rpg.nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="4agvge",
        style=dashed];
    integrations [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Integrations</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-integrations.<BR/>Everything that feeds the estate<BR/>from outside<BR/>it, split off from the API so that<BR/>app could have its gate turned on.</FONT></TD></TR></TABLE>>,
        likec4_id=integrations,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    keyvault [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Key Vault</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Key Vault — standard, RBAC</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev, in rg-nygdev-security.<BR/>Holds whoop-clientsecret, copied in<BR/>by<BR/>hand from the WHOOP developer<BR/>dashboard, and whoop-token.</FONT></TD></TR></TABLE>>,
        likec4_id=keyvault,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    integrations -> keyvault [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads whoop-clientsecret; reads and<BR/>rewrites the rotating whoop-token</FONT></TD></TR></TABLE>>,
        likec4_id=blokay,
        minlen=1,
        style=dashed];
    whoop [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">WHOOP</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Wearable platform, read-only to us and gated<BR/>by an authorization code<BR/>grant. A person consents once and that yields<BR/>a refresh token; every<BR/>refresh then rotates it, killing the old one</FONT></TD></TR></TABLE>>,
        likec4_id=whoop,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    integrations -> whoop [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Refreshes the access token, then pages<BR/>cycles, sleep, workouts and recovery</FONT></TD></TR></TABLE>>,
        likec4_id="14djfrc",
        minlen=1,
        style=dashed];
    cdn [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">CDN Storage</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Blob Storage — nygdevcdn</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">One public account serving three<BR/>unrelated things</FONT></TD></TR></TABLE>>,
        likec4_id=cdn,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    integrations -> cdn [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Publishes marathonprep.json (PUT, in<BR/>place)</FONT></TD></TR></TABLE>>,
        likec4_id=g0m9f2,
        style=dashed];
    cosmos [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Cosmos DB</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev-cosmos-db / db, one account<BR/>holding three containers that share<BR/>nothing but the throughput. Local<BR/>auth is off, so Entra role<BR/>assignments</FONT></TD></TR></TABLE>>,
        likec4_id=cosmos,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    integrations -> cosmos [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>,
        likec4_id="1a42eq1",
        style=dashed];
    web -> rpg [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Polls the Foundry status from the page<BR/>(GET /api/status)</FONT></TD></TR></TABLE>>,
        likec4_id=a0swfz,
        style=dashed];
    running -> cdn [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Fetches the built dashboard from the<BR/>page (GET data/marathonprep.json)</FONT></TD></TR></TABLE>>,
        likec4_id="3pg95w",
        style=dashed];
    api [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">API</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-api. The training log<BR/>and nothing else since the split:<BR/>blocks, sessions, sets and saved<BR/>day templates, read and written a<BR/>tap</FONT></TD></TR></TABLE>>,
        likec4_id=api,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    gym -> api [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes the training log, one<BR/>tap at a time</FONT></TD></TR></TABLE>>,
        likec4_id="1swlixt",
        style=dashed];
    gymbro -> api [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes the same routes, a<BR/>whole block at a time</FONT></TD></TR></TABLE>>,
        likec4_id=lar5mm,
        style=dashed];
    rpg -> cdn [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Holds asset URLs pointing at</FONT></TD></TR></TABLE>>,
        likec4_id=s3ixae,
        style=dashed];
    api -> cosmos [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads and writes the blocks, sessions<BR/>and saved templates in db/gym, under the<BR/>object id off the token</FONT></TD></TR></TABLE>>,
        likec4_id=jb1mak,
        style=dashed];
    cdn -> user [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Serves media straight to the player<BR/>browser</FONT></TD></TR></TABLE>>,
        likec4_id="1qa2qtu",
        style=dashed];
    azadmin [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Admin Automation</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">PowerShell 7.4 — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-azadmin. Sets<BR/>Cache-Control on Foundry media<BR/>blobs, on demand and on<BR/>blob-created events.</FONT></TD></TR></TABLE>>,
        likec4_id=azadmin,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    cdn -> azadmin [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Blob-created events (Event Grid)</FONT></TD></TR></TABLE>>,
        likec4_id="1tc27cn",
        style=dashed];
    azadmin -> cdn [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Sets Cache-Control on blobs</FONT></TD></TR></TABLE>>,
        likec4_id="1csgmbb",
        style=dashed];
}
`;case`azureDeployment`:return`digraph {
  likec4_viewId = "azureDeployment";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 2.5;
  pad = 0.209;
  fontname = "Arial";
  newrank = true;
  clusterrank = "global";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "browser" [
    likec4_id = "internet.browser";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="16">Visitor browser</FONT></TD></TR><TR><TD><FONT POINT-SIZE="12" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token</FONT></TD></TR></TABLE>>;
    margin = "0.139,0.139";
    width = 3.334;
    height = 1.875;
    fillcolor = "#428a4f";
    fontcolor = "#f8fafc";
    color = "#2d5d39";
  ];
  "funcstorage" [
    likec4_id = "azure.rgConsumption.funcStorage";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">nygdevfunc</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">Deployment packages — the<BR/>azadmin-deploy, api-deploy and<BR/>integrations-deploy containers</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "azadminapp" [
    likec4_id = "azure.rgConsumption.aspPs.azadminApp";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">func-nygdev-azadmin</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">PowerShell 7.4 — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">512 MB instances, max 1.<BR/>System-assigned identity.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "sqlserver" [
    likec4_id = "azure.rgDb.sqlServer";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">sql-nygdev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Azure SQL — swedencentral</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Sweden Central, because the free<BR/>Azure SQL offer is not available<BR/>in Norway East. Entra-only<BR/>authentication and a firewall open<BR/>to</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "webcontainer" [
    likec4_id = "azure.rgWeb.cdnStorage.webContainer";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">$web</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Azure Storage static website</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">This model, rendered by likec4<BR/>build and served at the account<BR/>primary web endpoint</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
    penwidth = 2;
    shape = "cylinder";
  ];
  "pip" [
    likec4_id = "azure.rgNetwork.pip";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">rpg-pip</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#c7d2fe">Static public IP, DNS label "rpg" —<BR/>rpg.norwayeast.cloudapp.azure.com</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "subnetrpg" [
    likec4_id = "azure.rgNetwork.vnetMain.subnetRpg";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">rpg-snet</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#c7d2fe">10.0.0.0/29</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#c7d2fe">NSG nygdev-nsg: 80/443 from<BR/>anywhere; 22, 30000 and 30001 from<BR/>the home IP only</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "caddyproc" [
    likec4_id = "azure.rgVm.rpgVm.caddyProc";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Caddy</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">Caddy</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Reverse proxy and TLS termination on 80/443,<BR/>for rpg.nygard.dev</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "foundryproc" [
    likec4_id = "azure.rgVm.rpgVm.foundryProc";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Foundry VTT</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">Node.js, listening on :30000</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Self-hosted virtual tabletop, running as<BR/>srv_foundry off the foundrydata disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "apex" [
    likec4_id = "azure.rgWeb.apex";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">nygdevapex</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Serves https://nygard.dev</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.306";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "rundash" [
    likec4_id = "azure.rgWeb.runDash";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">nygdevrun</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Serves https://run.nygard.dev</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.306";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "gymsite" [
    likec4_id = "azure.rgWeb.gymSite";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">nygdevgym</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Serves https://gym.nygard.dev</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.306";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "gymbrosite" [
    likec4_id = "azure.rgWeb.gymbroSite";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">nygdevgymbro</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Serves https://gymbro.nygard.dev</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.306";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
  ];
  "foundrydata" [
    likec4_id = "azure.rgData.foundryData";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">foundrydata</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#c7d2fe">Azure Managed Disk, attached at LUN</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#c7d2fe">Worlds, modules, media, the<BR/>Caddyfile and the Foundry install.<BR/>Referenced by terraform as a data<BR/>source and attached, never<BR/>created — which is what lets the VM</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "aspintegrations" [
    likec4_id = "azure.rgConsumption.aspIntegrations";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">asp-nygdev-flex-integrations</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">FC1 / Linux</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">512 MB instances, max 1. Runs as<BR/>id-nygdev-integrations. No CORS<BR/>list and no Easy Auth: nothing that<BR/>calls it is a browser holding<BR/>a token — the WHOOP callback is a</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "apiapp" [
    likec4_id = "azure.rgConsumption.aspDotnet.apiApp";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">func-nygdev-api</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">512 MB instances, max 1. Runs as<BR/>id-nygdev-api. CORS allows gym<BR/>and gymbro, each under its custom<BR/>domain and its default hostname.<BR/>Easy Auth enforces GymLog tokens:</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "whoopapi" [
    likec4_id = "internet.whoopApi";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">api.prod.whoop.com</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">The OAuth token endpoint and the v2 data API,<BR/>both outside the subscription</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "appinsights" [
    likec4_id = "azure.rgConsumption.appInsights";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">appi-nygdev-consumption</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">Application Insights, backed by the<BR/>log-nygdev-consumption workspace</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "datacontainer" [
    likec4_id = "azure.rgWeb.cdnStorage.dataContainer";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">data</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Anonymous blob read; the container</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Three files, published by two<BR/>different things.<BR/>marathonprep.json is the built<BR/>running dashboard, written by the<BR/>Integrations app and rewritten in</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
    penwidth = 2;
    shape = "cylinder";
  ];
  "mediacontainer" [
    likec4_id = "azure.rgWeb.cdnStorage.mediaContainer";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">foundry</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Storage Container</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Foundry VTT media, fetched straight<BR/>by player browsers</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
    penwidth = 2;
    shape = "cylinder";
  ];
  "kv" [
    likec4_id = "azure.rgSecurity.kv";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">nygdev</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">RBAC data plane. Holds HomeIP,<BR/>whoop-clientsecret and whoop-token,<BR/>alongside the nygdev-ed25519 SSH<BR/>public key resource.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "cosmosdb" [
    likec4_id = "azure.rgDb.cosmosDb";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">nygdev-cosmos-db</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Azure Cosmos DB (NoSQL) — free tier</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">GlobalDocumentDB, free tier, local<BR/>auth disabled, Session consistency<BR/>— db / primary, gym and gps</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    fillcolor = "#A35829";
    fontcolor = "#FFE0C2";
    color = "#7E451D";
    penwidth = 2;
    shape = "cylinder";
  ];
  subgraph "cluster_internet" {
    likec4_id = "internet";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#194b9e";
    color = "#1b3d88";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>INTERNET</B></FONT>>;
    "browser";
    "whoopapi";
  }
  subgraph "cluster_azure" {
    likec4_id = "azure";
    likec4_level = 0;
    likec4_depth = 3;
    fillcolor = "#353b43";
    color = "#262b32";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>AZURE SUBSCRIPTION</B></FONT>>;
    subgraph "cluster_rgconsumption" {
      likec4_id = "azure.rgConsumption";
      likec4_level = 1;
      likec4_depth = 2;
      fillcolor = "#1a468d";
      color = "#1c3979";
      style = "filled";
      margin = 50;
      label = <<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>RG-NYGDEV-CONSUMPTION</B></FONT>>;
      "funcstorage";
      "aspintegrations";
      "appinsights";
      subgraph "cluster_aspps" {
        likec4_id = "azure.rgConsumption.aspPs";
        likec4_level = 2;
        likec4_depth = 1;
        fillcolor = "#194b9e";
        color = "#1b3d88";
        style = "filled";
        margin = 32;
        label = <<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>ASP-NYGDEV-FLEX-PS</B></FONT>>;
        "azadminapp";
      }
      subgraph "cluster_aspdotnet" {
        likec4_id = "azure.rgConsumption.aspDotnet";
        likec4_level = 2;
        likec4_depth = 1;
        fillcolor = "#194b9e";
        color = "#1b3d88";
        style = "filled";
        margin = 32;
        label = <<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>ASP-NYGDEV-FLEX-DOTNET</B></FONT>>;
        "apiapp";
      }
    }
    subgraph "cluster_rgdb" {
      likec4_id = "azure.rgDb";
      likec4_level = 1;
      likec4_depth = 1;
      fillcolor = "#5a3620";
      color = "#462a17";
      style = "filled";
      margin = 50;
      label = <<FONT POINT-SIZE="11" COLOR="#f9b27cb3"><B>RG-NYGDEV-DB</B></FONT>>;
      "sqlserver";
      "cosmosdb";
    }
    subgraph "cluster_rgweb" {
      likec4_id = "azure.rgWeb";
      likec4_level = 1;
      likec4_depth = 2;
      fillcolor = "#51321f";
      color = "#3f2717";
      style = "filled";
      margin = 50;
      label = <<FONT POINT-SIZE="11" COLOR="#f9b27cb3"><B>RG-NYGDEV-WEB</B></FONT>>;
      "apex";
      "rundash";
      "gymsite";
      "gymbrosite";
      subgraph "cluster_cdnstorage" {
        likec4_id = "azure.rgWeb.cdnStorage";
        likec4_level = 2;
        likec4_depth = 1;
        fillcolor = "#5a3620";
        color = "#462a17";
        style = "filled";
        margin = 50;
        label = <<FONT POINT-SIZE="11" COLOR="#f9b27cb3"><B>NYGDEVCDN</B></FONT>>;
        "webcontainer";
        "datacontainer";
        "mediacontainer";
      }
    }
    subgraph "cluster_rgnetwork" {
      likec4_id = "azure.rgNetwork";
      likec4_level = 1;
      likec4_depth = 2;
      fillcolor = "#232598";
      color = "#292481";
      style = "filled";
      margin = 50;
      label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RG-NYGDEV-NETWORK</B></FONT>>;
      "pip";
      subgraph "cluster_vnetmain" {
        likec4_id = "azure.rgNetwork.vnetMain";
        likec4_level = 2;
        likec4_depth = 1;
        fillcolor = "#2225aa";
        color = "#2a2490";
        style = "filled";
        margin = 32;
        label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>NYGDEV-VNET</B></FONT>>;
        "subnetrpg";
      }
    }
    subgraph "cluster_rgvm" {
      likec4_id = "azure.rgVm";
      likec4_level = 1;
      likec4_depth = 2;
      fillcolor = "#232598";
      color = "#292481";
      style = "filled";
      margin = 32;
      label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RG-NYGDEV-VM</B></FONT>>;
      subgraph "cluster_rpgvm" {
        likec4_id = "azure.rgVm.rpgVm";
        likec4_level = 2;
        likec4_depth = 1;
        fillcolor = "#2225aa";
        color = "#2a2490";
        style = "filled";
        margin = 50;
        label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RPG-VM</B></FONT>>;
        "caddyproc";
        "foundryproc";
      }
    }
    subgraph "cluster_rgdata" {
      likec4_id = "azure.rgData";
      likec4_level = 1;
      likec4_depth = 1;
      fillcolor = "#2225aa";
      color = "#2a2490";
      style = "filled";
      margin = 32;
      label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RG-NYGDEV-DATA</B></FONT>>;
      "foundrydata";
    }
    subgraph "cluster_rgsecurity" {
      likec4_id = "azure.rgSecurity";
      likec4_level = 1;
      likec4_depth = 1;
      fillcolor = "#194b9e";
      color = "#1b3d88";
      style = "filled";
      margin = 32;
      label = <<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>RG-NYGDEV-SECURITY</B></FONT>>;
      "kv";
    }
  }
  "browser" -> "aspintegrations" [
    likec4_id = "144ph5v";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Grants WHOOP access, once (GET<BR/>/api/whoop/authorize)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "aspintegrations" -> "appinsights" [
    likec4_id = "pgcbgn";
    style = "dashed";
    weight = 4;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Telemetry, to the same workspace</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "aspintegrations" -> "whoopapi" [
    likec4_id = "cacxnc";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "apiapp" -> "appinsights" [
    likec4_id = "1ywbkrh";
    style = "dashed";
    weight = 3;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Telemetry (OpenTelemetry)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "azadminapp" -> "appinsights" [
    likec4_id = "1i7627m";
    style = "dashed";
    weight = 4;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Telemetry</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "aspintegrations" -> "cosmosdb" [
    likec4_id = "1ygmn14";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "apiapp" -> "cosmosdb" [
    likec4_id = "1xxqxqa";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "browser" -> "apex" [
    likec4_id = "ukpbx1";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "browser" -> "rundash" [
    likec4_id = "q0nce";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "browser" -> "gymsite" [
    likec4_id = "1rg3p9d";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "browser" -> "gymbrosite" [
    likec4_id = "1pu7yn2";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gymsite" -> "apiapp" [
    likec4_id = "nn2xj8";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gymbrosite" -> "apiapp" [
    likec4_id = "n64c57";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "aspintegrations" -> "datacontainer" [
    likec4_id = "7k4f8v";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "azadminapp" -> "mediacontainer" [
    likec4_id = "786n1q";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Sets Cache-Control on blobs</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "rundash" -> "datacontainer" [
    likec4_id = "13jiyiq";
    style = "dashed";
    weight = 3;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Fetches the built dashboard from the<BR/>page (GET data/marathonprep.json)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gymsite" -> "datacontainer" [
    likec4_id = "nk631p";
    style = "dashed";
    weight = 3;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Fetches the exercise library and the<BR/>built-in day templates, once, and caches<BR/>them</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "gymbrosite" -> "datacontainer" [
    likec4_id = "1fpqtea";
    style = "dashed";
    weight = 3;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Fetches the same two files</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "mediacontainer" -> "browser" [
    likec4_id = "1utcibo";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Serves media straight to the player<BR/>browser</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "mediacontainer" -> "azadminapp" [
    likec4_id = "rb4hxq";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Blob-created events (Event Grid)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "browser" -> "pip" [
    likec4_id = "727wv2";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">HTTPS to rpg.nygard.dev</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "pip" -> "caddyproc" [
    likec4_id = "199o5px";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Forwards 80/443 through rpg-snet</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "caddyproc" -> "foundryproc" [
    likec4_id = "1m336sa";
    style = "dashed";
    weight = 5;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reverse proxies to :30000</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "foundryproc" -> "mediacontainer" [
    likec4_id = "axilex";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Holds asset URLs pointing at</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "foundryproc" -> "foundrydata" [
    likec4_id = "1g416jd";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Stores worlds, modules and media on the<BR/>attached disk</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "aspintegrations" -> "kv" [
    likec4_id = "1qp6vi5";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">HTTPS/443, Entra token for<BR/>id-nygdev-integrations</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
}`;case`rpg`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=rpg,
        nodesep=1.389,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=LR,
        ranksep=2.5,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_rpg {
        graph [color="#2a2490",
            fillcolor="#2225aa",
            label=<<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RPG SERVER</B></FONT>>,
            likec4_depth=1,
            likec4_id=rpg,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        foundry [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            group=rpg,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Foundry VTT</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">Node.js, listening on :30000</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Self-hosted virtual tabletop, running as<BR/>srv_foundry off the foundrydata disk</FONT></TD></TR></TABLE>>,
            likec4_id="rpg.foundry",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        client [color="#0369a1",
            fillcolor="#0284c7",
            fontcolor="#f0f9ff",
            group=rpg,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Foundry Client</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#B6ECF7">HTML / JS in the browser</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#B6ECF7">The game UI, served by Foundry VTT and<BR/>running in the player browser</FONT></TD></TR></TABLE>>,
            likec4_id="rpg.client",
            likec4_level=1,
            margin="0.278,0.306",
            width=4.445];
        caddy [color="#4f46e5",
            fillcolor="#6366f1",
            fontcolor="#eef2ff",
            group=rpg,
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Caddy</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">Caddy</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Reverse proxy and TLS termination on 80/443,<BR/>for rpg.nygard.dev</FONT></TD></TR></TABLE>>,
            likec4_id="rpg.caddy",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    subgraph cluster_cdn {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>CDN STORAGE</B></FONT>>,
            likec4_depth=1,
            likec4_id=cdn,
            likec4_level=0,
            margin=32,
            style=filled
        ];
        foundrymedia [height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">foundry</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Storage Container</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">Foundry VTT media, fetched straight<BR/>by player browsers</FONT></TD></TR></TABLE>>,
            likec4_id="cdn.foundryMedia",
            likec4_level=1,
            margin="0.112,0",
            penwidth=2,
            shape=cylinder,
            width=4.445];
    }
    user [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Visitor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token<BR/>can be renewed forever,<BR/>but only a human can create the first one.</FONT></TD></TR></TABLE>>,
        likec4_id=user,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    user -> client [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Plays at https://rpg.nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id=kmqedl,
        style=dashed];
    foundry -> client [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Serves the game UI and world data</FONT></TD></TR></TABLE>>,
        likec4_id=enuzou,
        style=dashed,
        weight=3];
    foundry -> foundrymedia [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Holds asset URLs pointing at</FONT></TD></TR></TABLE>>,
        likec4_id="1ujxps2",
        style=dashed];
    client -> caddy [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">HTTPS / WSS to rpg.nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="1lpxjzc",
        style=dashed,
        weight=2];
    caddy -> foundry [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reverse proxies to :30000</FONT></TD></TR></TABLE>>,
        likec4_id=tnfmbw,
        style=dashed,
        weight=3];
    foundrymedia -> user [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Serves media straight to the player<BR/>browser</FONT></TD></TR></TABLE>>,
        likec4_id="19m1pz9",
        style=dashed,
        weight=2];
}
`;case`rpgInfra`:return`digraph {
  likec4_viewId = "rpgInfra";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.667;
  ranksep = 1.945;
  pad = 0.209;
  fontname = "Arial";
  newrank = true;
  clusterrank = "global";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "browser" [
    likec4_id = "internet.browser";
    likec4_level = 1;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="16">Visitor browser</FONT></TD></TR><TR><TD><FONT POINT-SIZE="12" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token</FONT></TD></TR></TABLE>>;
    margin = "0.139,0.139";
    width = 3.334;
    height = 1.875;
    fillcolor = "#428a4f";
    fontcolor = "#f8fafc";
    color = "#2d5d39";
  ];
  "pip" [
    likec4_id = "azure.rgNetwork.pip";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="2" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">rpg-pip</FONT></TD><TD ROWSPAN="2" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#c7d2fe">Static public IP, DNS label "rpg" —<BR/>rpg.norwayeast.cloudapp.azure.com</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "subnetrpg" [
    likec4_id = "azure.rgNetwork.vnetMain.subnetRpg";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">rpg-snet</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#c7d2fe">10.0.0.0/29</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#c7d2fe">NSG nygdev-nsg: 80/443 from<BR/>anywhere; 22, 30000 and 30001 from<BR/>the home IP only</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "caddyproc" [
    likec4_id = "azure.rgVm.rpgVm.caddyProc";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Caddy</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">Caddy</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Reverse proxy and TLS termination on 80/443,<BR/>for rpg.nygard.dev</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "foundryproc" [
    likec4_id = "azure.rgVm.rpgVm.foundryProc";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Foundry VTT</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#c7d2fe">Node.js, listening on :30000</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c7d2fe">Self-hosted virtual tabletop, running as<BR/>srv_foundry off the foundrydata disk</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "foundrydata" [
    likec4_id = "azure.rgData.foundryData";
    likec4_level = 2;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">foundrydata</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#c7d2fe">Azure Managed Disk, attached at LUN</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#c7d2fe">Worlds, modules, media, the<BR/>Caddyfile and the Foundry install.<BR/>Referenced by terraform as a data<BR/>source and attached, never<BR/>created — which is what lets the VM</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#6366f1";
    fontcolor = "#eef2ff";
    color = "#4f46e5";
  ];
  "mediacontainer" [
    likec4_id = "azure.rgWeb.cdnStorage.mediaContainer";
    likec4_level = 3;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">foundry</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Storage Container</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">Foundry VTT media, fetched straight<BR/>by player browsers</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    penwidth = 2;
    shape = "cylinder";
  ];
  subgraph "cluster_internet" {
    likec4_id = "internet";
    likec4_level = 0;
    likec4_depth = 1;
    fillcolor = "#194b9e";
    color = "#1b3d88";
    style = "filled";
    margin = 32;
    label = <<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>INTERNET</B></FONT>>;
    "browser";
  }
  subgraph "cluster_azure" {
    likec4_id = "azure";
    likec4_level = 0;
    likec4_depth = 3;
    fillcolor = "#353b43";
    color = "#262b32";
    style = "filled";
    margin = 50;
    label = <<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>AZURE SUBSCRIPTION</B></FONT>>;
    subgraph "cluster_rgnetwork" {
      likec4_id = "azure.rgNetwork";
      likec4_level = 1;
      likec4_depth = 2;
      fillcolor = "#232598";
      color = "#292481";
      style = "filled";
      margin = 50;
      label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RG-NYGDEV-NETWORK</B></FONT>>;
      "pip";
      subgraph "cluster_vnetmain" {
        likec4_id = "azure.rgNetwork.vnetMain";
        likec4_level = 2;
        likec4_depth = 1;
        fillcolor = "#2225aa";
        color = "#2a2490";
        style = "filled";
        margin = 32;
        label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>NYGDEV-VNET</B></FONT>>;
        "subnetrpg";
      }
    }
    subgraph "cluster_rgvm" {
      likec4_id = "azure.rgVm";
      likec4_level = 1;
      likec4_depth = 2;
      fillcolor = "#232598";
      color = "#292481";
      style = "filled";
      margin = 32;
      label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RG-NYGDEV-VM</B></FONT>>;
      subgraph "cluster_rpgvm" {
        likec4_id = "azure.rgVm.rpgVm";
        likec4_level = 2;
        likec4_depth = 1;
        fillcolor = "#2225aa";
        color = "#2a2490";
        style = "filled";
        margin = 50;
        label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RPG-VM</B></FONT>>;
        "caddyproc";
        "foundryproc";
      }
    }
    subgraph "cluster_rgdata" {
      likec4_id = "azure.rgData";
      likec4_level = 1;
      likec4_depth = 1;
      fillcolor = "#2225aa";
      color = "#2a2490";
      style = "filled";
      margin = 32;
      label = <<FONT POINT-SIZE="11" COLOR="#c7d2feb3"><B>RG-NYGDEV-DATA</B></FONT>>;
      "foundrydata";
    }
    subgraph "cluster_rgweb" {
      likec4_id = "azure.rgWeb";
      likec4_level = 1;
      likec4_depth = 2;
      fillcolor = "#1a468d";
      color = "#1c3979";
      style = "filled";
      margin = 32;
      label = <<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>RG-NYGDEV-WEB</B></FONT>>;
      subgraph "cluster_cdnstorage" {
        likec4_id = "azure.rgWeb.cdnStorage";
        likec4_level = 2;
        likec4_depth = 1;
        fillcolor = "#194b9e";
        color = "#1b3d88";
        style = "filled";
        margin = 32;
        label = <<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>NYGDEVCDN</B></FONT>>;
        "mediacontainer";
      }
    }
  }
  "browser" -> "pip" [
    likec4_id = "727wv2";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">HTTPS to rpg.nygard.dev</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "pip" -> "caddyproc" [
    likec4_id = "199o5px";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Forwards 80/443 through rpg-snet</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "caddyproc" -> "foundryproc" [
    likec4_id = "1m336sa";
    style = "dashed";
    weight = 5;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reverse proxies to :30000</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "foundryproc" -> "foundrydata" [
    likec4_id = "1g416jd";
    style = "dashed";
    weight = 2;
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Stores worlds, modules and media on the<BR/>attached disk</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "foundryproc" -> "mediacontainer" [
    likec4_id = "axilex";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Holds asset URLs pointing at</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "mediacontainer" -> "browser" [
    likec4_id = "1utcibo";
    style = "dashed";
    label = <<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Serves media straight to the player<BR/>browser</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
}`;case`rpgTerraform`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=rpgTerraform,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=LR,
        ranksep=2.223,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_github {
        graph [color="#292f37",
            fillcolor="#3a404a",
            label=<<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>GITHUB</B></FONT>>,
            likec4_depth=2,
            likec4_id=github,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        subgraph cluster_repo {
            graph [color="#462a17",
                fillcolor="#5a3620",
                label=<<FONT POINT-SIZE="11" COLOR="#f9b27cb3"><B>NYGDEVAZURE</B></FONT>>,
                likec4_depth=1,
                likec4_id="github.repo",
                likec4_level=1,
                margin=32,
                style=filled
            ];
            srctf [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">terraform/**</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Terraform HCL</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">The Azure estate: resource groups,<BR/>VNet, VM, storage, Cosmos, function<BR/>apps, Key Vault</FONT></TD></TR></TABLE>>,
                likec4_id="github.repo.srcTf",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
        }
        subgraph cluster_actions {
            graph [color="#462a17",
                fillcolor="#5a3620",
                label=<<FONT POINT-SIZE="11" COLOR="#f9b27cb3"><B>GITHUB ACTIONS</B></FONT>>,
                likec4_depth=1,
                likec4_id="github.actions",
                likec4_level=1,
                margin=32,
                style=filled
            ];
            tfapply [color="#7E451D",
                fillcolor="#A35829",
                fontcolor="#FFE0C2",
                height=2.5,
                label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Terraform Apply</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">terraform-apply.yml —</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">Authenticates with ARM_USE_OIDC,<BR/>fetches the home IP and the SSH<BR/>public key at run time, then<BR/>terraform apply -auto-approve.<BR/>Run by hand rather than on a push:</FONT></TD></TR></TABLE>>,
                likec4_id="github.actions.tfApply",
                likec4_level=2,
                margin="0.112,0.223",
                width=4.445];
        }
        ghenv [color="#7E451D",
            fillcolor="#A35829",
            fontcolor="#FFE0C2",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Environment "NygDevAzure"</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">GitHub Actions environment</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">AZURE_CLIENT_ID, AZURE_TENANT_ID,<BR/>AZURE_SUBSCRIPTION_ID,<BR/>AZURE_KEYVAULT_NAME,<BR/>AZURE_VM_USERNAME,<BR/>ENTRA_OWNER_OBJECTID.</FONT></TD></TR></TABLE>>,
            likec4_id="github.ghEnv",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
    }
    subgraph cluster_entra {
        graph [color="#2d333d",
            fillcolor="#3e4651",
            label=<<FONT POINT-SIZE="11" COLOR="#cbd5e1b3"><B>MICROSOFT ENTRA ID</B></FONT>>,
            likec4_depth=1,
            likec4_id=entra,
            likec4_level=0,
            margin=32,
            style=filled
        ];
        ghoidc [color="#7E451D",
            fillcolor="#A35829",
            fontcolor="#FFE0C2",
            height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">GitHub deploy identity</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#f9b27c">Workload identity federation</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#f9b27c">The AZURE_CLIENT_ID principal.<BR/>Federated credentials trust<BR/>token.actions.githubusercontent.com<BR/>for this repository and the<BR/>NygDevAzure environment, so there</FONT></TD></TR></TABLE>>,
            likec4_id="entra.ghOidc",
            likec4_level=1,
            margin="0.112,0.223",
            width=4.445];
    }
    dev [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Developer</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Authors the model, the terraform and the<BR/>function code, and pushes to master</FONT></TD></TR></TABLE>>,
        likec4_id=dev,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    dev -> srctf [arrowhead=normal,
        lhead=cluster_repo,
        likec4_id=gi4fq6,
        minlen=1,
        style=dashed,
        weight=2,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">git push (master)</FONT></TD></TR></TABLE>>];
    ghenv -> tfapply [arrowhead=normal,
        lhead=cluster_actions,
        likec4_id="4xbth",
        minlen=1,
        style=dashed,
        weight=3,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Supplies tenant, subscription and client<BR/>ids to</FONT></TD></TR></TABLE>>];
    srctf -> tfapply [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Change here is applied by</FONT></TD></TR></TABLE>>,
        likec4_id=vn2k3d,
        style=dashed];
    tfapply -> ghoidc [arrowhead=normal,
        likec4_id="1a53c2o",
        ltail=cluster_actions,
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Presents the runner OIDC token<BR/>(azure/login@v3)</FONT></TD></TR></TABLE>>];
    tfstate [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Terraform State</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Blob Storage, AzureAD auth</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdevtfstate / tfstate /<BR/>azure-infrastructure.tfstate in<BR/>rg-nygdev-data</FONT></TD></TR></TABLE>>,
        likec4_id=tfstate,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    tfapply -> tfstate [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Locks and writes state</FONT></TD></TR></TABLE>>,
        likec4_id="1e5h2dd",
        minlen=1,
        style=dashed];
    keyvault [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Key Vault</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Key Vault — standard, RBAC</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev, in rg-nygdev-security.<BR/>Holds whoop-clientsecret, copied in<BR/>by<BR/>hand from the WHOOP developer<BR/>dashboard, and whoop-token.</FONT></TD></TR></TABLE>>,
        likec4_id=keyvault,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    tfapply -> keyvault [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads HomeIP, and the nygdev-ed25519<BR/>public key beside it, at run time</FONT></TD></TR></TABLE>>,
        likec4_id="2l7si1",
        minlen=1,
        style=dashed];
    azurerm [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Azure Resource Manager</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#cbd5e1">management.azure.com</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">The Azure control plane. Terraform and the az<BR/>CLI both reach the estate through it.</FONT></TD></TR></TABLE>>,
        likec4_id=azurerm,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    tfapply -> azurerm [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">terraform apply -auto-approve</FONT></TD></TR></TABLE>>,
        likec4_id="1yvzo3m",
        style=dashed];
    ghoidc -> tfapply [arrowhead=normal,
        lhead=cluster_actions,
        likec4_id="1t587c0",
        style=dashed,
        xlabel=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Issues a short-lived Azure access token<BR/>to</FONT></TD></TR></TABLE>>];
    ghoidc -> azurerm [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Authorises calls against (RBAC on the<BR/>subscription)</FONT></TD></TR></TABLE>>,
        likec4_id="1oooyf4",
        style=dashed,
        weight=2];
    rpg [color="#4f46e5",
        fillcolor="#6366f1",
        fontcolor="#eef2ff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">RPG Server</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#c7d2fe">Azure Linux VM — Standard_B2s,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#c7d2fe">rpg-vm, behind the rpg-pip public<BR/>IP. Built by terraform and<BR/>configured by cloud-init; worlds<BR/>and media live on a separate disk<BR/>that survives the VM being rebuilt.</FONT></TD></TR></TABLE>>,
        likec4_id=rpg,
        likec4_level=0,
        margin="0.112,0.223",
        width=4.445];
    azurerm -> rpg [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Creates rpg-vm and its NIC, the public<BR/>IP, the VNet, subnet and NSG, and<BR/>attaches the foundrydata disk</FONT></TD></TR></TABLE>>,
        likec4_id=ydc349,
        minlen=0,
        style=dashed,
        weight=3];
}
`;case`running`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=running,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=LR,
        ranksep=2.084,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_integrations {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>INTEGRATIONS</B></FONT>>,
            likec4_depth=1,
            likec4_id=integrations,
            likec4_level=0,
            margin=40,
            style=filled
        ];
        sync [height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">WHOOP sync</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Timer + HTTP trigger, one shared gate</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">Walks WHOOP collections into Cosmos. Timer at<BR/>00:00, 06:00, 12:00<BR/>and 18:00 UTC; /api/whoop/sync is the same<BR/>work on demand, and both<BR/>go through one runner holding one gate, so a</FONT></TD></TR></TABLE>>,
            likec4_id="integrations.sync",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        dashboard [height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Dashboard build</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Timer + HTTP trigger</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">Rebuilds the running dashboard from whatever<BR/>is stored: pace by run<BR/>type, aerobic efficiency, weekly volume,<BR/>acute:chronic workload,<BR/>weekly time in zones. Timer at 00:15, 06:15,</FONT></TD></TR></TABLE>>,
            likec4_id="integrations.dashboard",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    subgraph cluster_cdn {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>CDN STORAGE</B></FONT>>,
            likec4_depth=1,
            likec4_id=cdn,
            likec4_level=0,
            margin=32,
            style=filled
        ];
        datacontainer [height=2.5,
            label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">data</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Anonymous blob read; the container</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">Three files, published by two<BR/>different things.<BR/>marathonprep.json is the built<BR/>running dashboard, written by the<BR/>Integrations app and rewritten in</FONT></TD></TR></TABLE>>,
            likec4_id="cdn.dataContainer",
            likec4_level=1,
            margin="0.112,0",
            penwidth=2,
            shape=cylinder,
            width=4.445];
    }
    user [color="#2d5d39",
        fillcolor="#428a4f",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Visitor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token<BR/>can be renewed forever,<BR/>but only a human can create the first one.</FONT></TD></TR></TABLE>>,
        likec4_id=user,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    running [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">run.nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevrun — the running and<BR/>marathon dashboard. Provisioned<BR/>empty by<BR/>terraform; content deployed from<BR/>the nygdevweb repository.</FONT></TD></TR></TABLE>>,
        likec4_id=running,
        likec4_level=0,
        margin="0.112,0.306",
        width=4.445];
    user -> running [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Visits https://run.nygard.dev</FONT></TD></TR></TABLE>>,
        likec4_id="11x91p8",
        minlen=0,
        style=dashed,
        weight=2];
    running -> datacontainer [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Fetches the built dashboard from the<BR/>page (GET data/marathonprep.json)</FONT></TD></TR></TABLE>>,
        likec4_id="11swwcd",
        style=dashed,
        weight=2];
    whoop [color="#475569",
        fillcolor="#64748b",
        fontcolor="#f8fafc",
        height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">WHOOP</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Wearable platform, read-only to us and gated<BR/>by an authorization code<BR/>grant. A person consents once and that yields<BR/>a refresh token; every<BR/>refresh then rotates it, killing the old one</FONT></TD></TR></TABLE>>,
        likec4_id=whoop,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    sync -> whoop [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Refreshes the access token, then pages<BR/>cycles, sleep, workouts and recovery</FONT></TD></TR></TABLE>>,
        likec4_id=wiveox,
        minlen=1,
        style=dashed];
    keyvault [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Key Vault</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Key Vault — standard, RBAC</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev, in rg-nygdev-security.<BR/>Holds whoop-clientsecret, copied in<BR/>by<BR/>hand from the WHOOP developer<BR/>dashboard, and whoop-token.</FONT></TD></TR></TABLE>>,
        likec4_id=keyvault,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    sync -> keyvault [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Reads whoop-clientsecret; reads and<BR/>rewrites the rotating whoop-token</FONT></TD></TR></TABLE>>,
        likec4_id=jq9a6b,
        minlen=1,
        style=dashed];
    cosmos [height=2.5,
        label=<<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Cosmos DB</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev-cosmos-db / db, one account<BR/>holding three containers that share<BR/>nothing but the throughput. Local<BR/>auth is off, so Entra role<BR/>assignments</FONT></TD></TR></TABLE>>,
        likec4_id=cosmos,
        likec4_level=0,
        margin="0.112,0",
        penwidth=2,
        shape=cylinder,
        width=4.445];
    sync -> cosmos [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Upserts each record on its WHOOP id, and<BR/>one sync cursor per collection</FONT></TD></TR></TABLE>>,
        likec4_id="4mmww",
        style=dashed];
    dashboard -> cosmos [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Queries the scored running workouts back<BR/>out (the only query in the model)</FONT></TD></TR></TABLE>>,
        likec4_id=gf0tqb,
        style=dashed,
        weight=2];
    dashboard -> datacontainer [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">Publishes marathonprep.json (PUT, in<BR/>place)</FONT></TD></TR></TABLE>>,
        likec4_id=diu6rh,
        style=dashed];
}
`;case`runningPipeline`:return`digraph {
  likec4_viewId = "runningPipeline";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "sync" [
    likec4_id = "integrations.sync";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">WHOOP sync</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Timer + HTTP trigger, one shared gate</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">Walks WHOOP collections into Cosmos. Timer at<BR/>00:00, 06:00, 12:00<BR/>and 18:00 UTC; /api/whoop/sync is the same<BR/>work on demand, and both<BR/>go through one runner holding one gate, so a</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "keyvault" [
    likec4_id = "keyvault";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Key Vault</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Key Vault — standard, RBAC</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev, in rg-nygdev-security.<BR/>Holds whoop-clientsecret, copied in<BR/>by<BR/>hand from the WHOOP developer<BR/>dashboard, and whoop-token.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    penwidth = 2;
    shape = "cylinder";
  ];
  "whoop" [
    likec4_id = "whoop";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">WHOOP</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Wearable platform, read-only to us and gated<BR/>by an authorization code<BR/>grant. A person consents once and that yields<BR/>a refresh token; every<BR/>refresh then rotates it, killing the old one</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "dashboard" [
    likec4_id = "integrations.dashboard";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Dashboard build</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#bfdbfe">Timer + HTTP trigger</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#bfdbfe">Rebuilds the running dashboard from whatever<BR/>is stored: pace by run<BR/>type, aerobic efficiency, weekly volume,<BR/>acute:chronic workload,<BR/>weekly time in zones. Timer at 00:15, 06:15,</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "cosmos" [
    likec4_id = "cosmos";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Cosmos DB</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev-cosmos-db / db, one account<BR/>holding three containers that share<BR/>nothing but the throughput. Local<BR/>auth is off, so Entra role<BR/>assignments</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    penwidth = 2;
    shape = "cylinder";
  ];
  "datacontainer" [
    likec4_id = "cdn.dataContainer";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">data</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Anonymous blob read; the container</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">Three files, published by two<BR/>different things.<BR/>marathonprep.json is the built<BR/>running dashboard, written by the<BR/>Integrations app and rewritten in</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    penwidth = 2;
    shape = "cylinder";
  ];
  "user" [
    likec4_id = "user";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Visitor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token<BR/>can be renewed forever,<BR/>but only a human can create the first one.</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#428a4f";
    fontcolor = "#f8fafc";
    color = "#2d5d39";
  ];
  "running" [
    likec4_id = "running";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">run.nygard.dev</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#B6ECF7">Azure Static Web App — Free SKU,</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#B6ECF7">nygdevrun — the running and<BR/>marathon dashboard. Provisioned<BR/>empty by<BR/>terraform; content deployed from<BR/>the nygdevweb repository.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.306";
    width = 4.445;
    height = 2.5;
    fillcolor = "#0284c7";
    fontcolor = "#f0f9ff";
    color = "#0369a1";
  ];
  "sync" -> "keyvault" [
    likec4_id = "step-01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>0</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads whoop-clientsecret and the stored<BR/>refresh token</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sync" -> "whoop" [
    likec4_id = "step-02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">refresh_token grant, re-requesting the<BR/>offline scope</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sync" -> "whoop" [
    likec4_id = "step-03";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">A new access token, and a rotated<BR/>refresh token — the old one is now dead</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "sync" -> "keyvault" [
    likec4_id = "step-04";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Writes the replacement, before the<BR/>access token is used for anything</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sync" -> "whoop" [
    likec4_id = "step-05";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Pages cycles, sleep, workouts and<BR/>recovery, 25 records at a time</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "sync" -> "cosmos" [
    likec4_id = "step-06";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Upserts each record on its WHOOP id,<BR/>then saves the cursor</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dashboard" -> "cosmos" [
    likec4_id = "step-07";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Fifteen minutes later: queries the<BR/>scored running workouts</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "dashboard" -> "datacontainer" [
    likec4_id = "step-08";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Publishes marathonprep.json, with a<BR/>five-minute cache lifetime</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "user" -> "running" [
    likec4_id = "step-09";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Opens run.nygard.dev, whenever</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "datacontainer" -> "running" [
    likec4_id = "step-10";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>9</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">The page fetches the published JSON<BR/>directly — anonymous, no function in the<BR/>path</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case`whoopRefresh`:return`digraph {
  likec4_viewId = "whoopRefresh";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "TB";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 1.528;
  ranksep = 1.667;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "integrations" [
    likec4_id = "integrations";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Integrations</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-integrations.<BR/>Everything that feeds the estate<BR/>from outside<BR/>it, split off from the API so that<BR/>app could have its gate turned on.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "keyvault" [
    likec4_id = "keyvault";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Key Vault</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Key Vault — standard, RBAC</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev, in rg-nygdev-security.<BR/>Holds whoop-clientsecret, copied in<BR/>by<BR/>hand from the WHOOP developer<BR/>dashboard, and whoop-token.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    penwidth = 2;
    shape = "cylinder";
  ];
  "whoop" [
    likec4_id = "whoop";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">WHOOP</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Wearable platform, read-only to us and gated<BR/>by an authorization code<BR/>grant. A person consents once and that yields<BR/>a refresh token; every<BR/>refresh then rotates it, killing the old one</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "integrations" -> "keyvault" [
    likec4_id = "step-01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>0</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads whoop-clientsecret and the current<BR/>whoop-token</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "integrations" -> "whoop" [
    likec4_id = "step-02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">refresh_token grant, re-requesting the<BR/>offline scope</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "integrations" -> "whoop" [
    likec4_id = "step-03";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">New access token, and a rotated refresh<BR/>token — the old one is now dead</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "integrations" -> "keyvault" [
    likec4_id = "step-04";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Writes the rotated token as a new<BR/>version of whoop-token</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "integrations" -> "whoop" [
    likec4_id = "step-05";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Calls the data API with the access token</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "integrations" -> "whoop" [
    likec4_id = "step-06";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Answers, and the access token is cached<BR/>until it nears expiry</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
}`;case`whoopBootstrap`:return`digraph {
  likec4_viewId = "whoopBootstrap";
  bgcolor = "transparent";
  layout = "dot";
  compound = true;
  rankdir = "LR";
  splines = "spline";
  outputorder = "nodesfirst";
  nodesep = 2.778;
  ranksep = 0.556;
  pad = 0.209;
  fontname = "Arial";
  ordering = "in";
  graph [
    fontsize = 20;
    labeljust = "l";
    labelloc = "t";
  ];
  edge [
    arrowsize = 0.75;
    fontname = "Arial";
    fontsize = 14;
    penwidth = 2;
    color = "#8D8D8D";
    fontcolor = "#C9C9C9";
    style = "dashed";
  ];
  node [
    fontname = "Arial";
    shape = "rect";
    fillcolor = "#3b82f6";
    fontcolor = "#eff6ff";
    color = "#2563eb";
    style = "filled";
    penwidth = 0;
  ];
  "user" [
    likec4_id = "user";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">Visitor</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#c2f0c2">Reads the sites and plays on the game server.<BR/>Also the person at the<BR/>WHOOP consent screen, once — a refresh token<BR/>can be renewed forever,<BR/>but only a human can create the first one.</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#428a4f";
    fontcolor = "#f8fafc";
    color = "#2d5d39";
  ];
  "integrations" [
    likec4_id = "integrations";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Integrations</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">.NET 10 isolated — Flex Consumption</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">func-nygdev-integrations.<BR/>Everything that feeds the estate<BR/>from outside<BR/>it, split off from the API so that<BR/>app could have its gate turned on.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0.223";
    width = 4.445;
    height = 2.5;
  ];
  "keyvault" [
    likec4_id = "keyvault";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD ROWSPAN="3" WIDTH="76"> </TD><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="20">Key Vault</FONT></TD><TD ROWSPAN="3" WIDTH="16"> </TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="#bfdbfe">Azure Key Vault — standard, RBAC</FONT></TD></TR><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="15" COLOR="#bfdbfe">nygdev, in rg-nygdev-security.<BR/>Holds whoop-clientsecret, copied in<BR/>by<BR/>hand from the WHOOP developer<BR/>dashboard, and whoop-token.</FONT></TD></TR></TABLE>>;
    margin = "0.112,0";
    width = 4.445;
    height = 2.5;
    penwidth = 2;
    shape = "cylinder";
  ];
  "whoop" [
    likec4_id = "whoop";
    likec4_level = 0;
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="4"><TR><TD><FONT POINT-SIZE="20">WHOOP</FONT></TD></TR><TR><TD><FONT POINT-SIZE="13" COLOR="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</FONT></TD></TR><TR><TD><FONT POINT-SIZE="15" COLOR="#cbd5e1">Wearable platform, read-only to us and gated<BR/>by an authorization code<BR/>grant. A person consents once and that yields<BR/>a refresh token; every<BR/>refresh then rotates it, killing the old one</FONT></TD></TR></TABLE>>;
    margin = "0.223,0.223";
    width = 4.445;
    height = 2.5;
    fillcolor = "#64748b";
    fontcolor = "#f8fafc";
    color = "#475569";
  ];
  "user" -> "integrations" [
    likec4_id = "step-01";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>0</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Opens /integrations/whoop/authorize<BR/>(function key)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "integrations" -> "keyvault" [
    likec4_id = "step-02";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>1</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Reads whoop-clientsecret, to sign the<BR/>state with</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "user" -> "integrations" [
    likec4_id = "step-03";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>2</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">302 to the WHOOP consent screen (client<BR/>id, scopes, signed state)</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "user" -> "whoop" [
    likec4_id = "step-04";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>3</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Signs in and grants the scopes</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "user" -> "whoop" [
    likec4_id = "step-05";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>4</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">302 back to /integrations/whoop/callback<BR/>with a code</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "user" -> "integrations" [
    likec4_id = "step-06";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>5</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">The browser follows the redirect<BR/>(anonymous; the state is the gate)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "integrations" -> "whoop" [
    likec4_id = "step-07";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>6</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Exchanges the code (authorization_code<BR/>grant, client secret)</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
  "integrations" -> "whoop" [
    likec4_id = "step-08";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>7</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Access token, and the first refresh<BR/>token</FONT></TD></TR></TABLE>>;
    arrowtail = "normal";
    dir = "back";
  ];
  "integrations" -> "keyvault" [
    likec4_id = "step-09";
    label = <<TABLE BORDER="0" CELLPADDING="0" CELLSPACING="3"><TR><TD><TABLE BORDER="0" CELLPADDING="6" BGCOLOR="#18191BA0"><TR><TD WIDTH="20" HEIGHT="20"><FONT POINT-SIZE="14"><B>8</B></FONT></TD></TR></TABLE></TD><TD BGCOLOR="#18191BA0" CELLPADDING="3"><FONT POINT-SIZE="14">Writes whoop-token</FONT></TD></TR></TABLE>>;
    arrowhead = "normal";
  ];
}`;default:throw Error(`Unknown viewId: `+e)}},t=e=>{switch(e){case`apex`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1212pt" height="630pt"
 viewBox="0.00 0.00 1212.00 630.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 615.05)">
<g id="clust1" class="cluster">
<title>cluster_rpg</title>
<polygon fill="#2225aa" stroke="#2a2490" points="742.55,-8 742.55,-592 1173.67,-592 1173.67,-8 742.55,-8"/>
<text xml:space="preserve" text-anchor="start" x="750.55" y="-579.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RPG SERVER</text>
</g>
<!-- caddy -->
<g id="node1" class="node">
<title>caddy</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1133.67,-228 782.55,-228 782.55,-48 1133.67,-48 1133.67,-228"/>
<text xml:space="preserve" text-anchor="start" x="929.21" y="-159.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Caddy</text>
<text xml:space="preserve" text-anchor="start" x="939.32" y="-138.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Caddy</text>
<text xml:space="preserve" text-anchor="start" x="802.61" y="-117.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Reverse proxy and TLS termination on 80/443,</text>
<text xml:space="preserve" text-anchor="start" x="897.24" y="-99.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">for rpg.nygard.dev</text>
</g>
<!-- foundry -->
<g id="node2" class="node">
<title>foundry</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1118.13,-531 798.09,-531 798.09,-351 1118.13,-351 1118.13,-531"/>
<text xml:space="preserve" text-anchor="start" x="899.76" y="-462.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Foundry VTT</text>
<text xml:space="preserve" text-anchor="start" x="877.89" y="-441.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Node.js, listening on :30000</text>
<text xml:space="preserve" text-anchor="start" x="830.12" y="-420.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Self&#45;hosted virtual tabletop, running as</text>
<text xml:space="preserve" text-anchor="start" x="838.88" y="-402.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">srv_foundry off the foundrydata disk</text>
</g>
<!-- user -->
<g id="node3" class="node">
<title>user</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="366.09,-531 0,-531 0,-351 366.09,-351 366.09,-531"/>
<text xml:space="preserve" text-anchor="start" x="155.26" y="-480" font-family="Arial" font-size="20.00" fill="#f8fafc">Visitor</text>
<text xml:space="preserve" text-anchor="start" x="28.38" y="-457" font-family="Arial" font-size="15.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="110.08" y="-439" font-family="Arial" font-size="15.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-421" font-family="Arial" font-size="15.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
<text xml:space="preserve" text-anchor="start" x="102.16" y="-403" font-family="Arial" font-size="15.00" fill="#c2f0c2">can be renewed forever,</text>
<text xml:space="preserve" text-anchor="start" x="45.05" y="-385" font-family="Arial" font-size="15.00" fill="#c2f0c2">but only a human can create the first one.</text>
</g>
<!-- web -->
<g id="node4" class="node">
<title>web</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="349.76,-228 16.33,-228 16.33,-48 349.76,-48 349.76,-228"/>
<text xml:space="preserve" text-anchor="start" x="64.45" y="-132.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="108.39" y="-159.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="327.75" y="-132.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="108.39" y="-138.8" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="108.39" y="-117.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevapex. Links, and the live</text>
<text xml:space="preserve" text-anchor="start" x="108.39" y="-99.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">status of the Foundry server.</text>
</g>
<!-- caddy&#45;&gt;foundry -->
<g id="edge3" class="edge">
<title>caddy&#45;&gt;foundry</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M958.11,-227.68C958.11,-263.25 958.11,-304.31 958.11,-340.85"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="955.49,-340.5 958.11,-348 960.74,-340.5 955.49,-340.5"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="859,-278.1 859,-300.9 1028.43,-300.9 1028.43,-278.1 859,-278.1"/>
<text xml:space="preserve" text-anchor="start" x="862" y="-283.9" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reverse proxies to :30000</text>
</g>
<!-- user&#45;&gt;web -->
<g id="edge1" class="edge">
<title>user&#45;&gt;web</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M183.05,-351.03C183.05,-315.43 183.05,-274.36 183.05,-237.85"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="185.67,-238.21 183.05,-230.71 180.42,-238.21 185.67,-238.21"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="91.33,-278.1 91.33,-300.9 245.96,-300.9 245.96,-278.1 91.33,-278.1"/>
<text xml:space="preserve" text-anchor="start" x="94.33" y="-283.9" font-family="Arial" font-size="14.00" fill="#c9c9c9">Visits https://nygard.dev</text>
</g>
<!-- web&#45;&gt;caddy -->
<g id="edge2" class="edge">
<title>web&#45;&gt;caddy</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M349.41,-138C473.57,-138 643.61,-138 772.25,-138"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="772.09,-140.63 779.59,-138 772.09,-135.38 772.09,-140.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="451.09,-138 451.09,-177.6 697.55,-177.6 697.55,-138 451.09,-138"/>
<text xml:space="preserve" text-anchor="start" x="454.09" y="-160.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Polls the Foundry status from the page</text>
<text xml:space="preserve" text-anchor="start" x="454.09" y="-143.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">(GET /api/status)</text>
</g>
</g>
</svg>
`;case`delivery`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3273pt" height="2194pt"
 viewBox="0.00 0.00 3273.00 2194.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 2179.05)">
<g id="clust1" class="cluster">
<title>cluster_github</title>
<polygon fill="#3a404a" stroke="#292f37" points="433.1,-207 433.1,-1929 1757.05,-1929 1757.05,-207 433.1,-207"/>
<text xml:space="preserve" text-anchor="start" x="441.1" y="-1916.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">GITHUB</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_repo</title>
<polygon fill="#5a3620" stroke="#462a17" points="473.1,-247 473.1,-1648 924,-1648 924,-247 473.1,-247"/>
<text xml:space="preserve" text-anchor="start" x="481.1" y="-1635.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#f9b27c" fill-opacity="0.701961">NYGDEVAZURE</text>
</g>
<g id="clust3" class="cluster">
<title>cluster_actions</title>
<polygon fill="#5a3620" stroke="#462a17" points="1217.19,-247 1217.19,-1648 1717.05,-1648 1717.05,-247 1217.19,-247"/>
<text xml:space="preserve" text-anchor="start" x="1225.19" y="-1635.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#f9b27c" fill-opacity="0.701961">GITHUB ACTIONS</text>
</g>
<g id="clust4" class="cluster">
<title>cluster_entra</title>
<polygon fill="#3e4651" stroke="#2d333d" points="2081.67,-248 2081.67,-513 2514.11,-513 2514.11,-248 2081.67,-248"/>
<text xml:space="preserve" text-anchor="start" x="2089.67" y="-500.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">MICROSOFT ENTRA ID</text>
</g>
<g id="clust5" class="cluster">
<title>cluster_cdn</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="2099.58,-1891 2099.58,-2156 2496.19,-2156 2496.19,-1891 2099.58,-1891"/>
<text xml:space="preserve" text-anchor="start" x="2107.58" y="-2143.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">CDN STORAGE</text>
</g>
<!-- srcc4 -->
<g id="node1" class="node">
<title>srcc4</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="874.41,-1587 522.68,-1587 522.68,-1407 874.41,-1407 874.41,-1587"/>
<text xml:space="preserve" text-anchor="start" x="570.8" y="-1491.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="614.75" y="-1527.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">c4/LikeC4/**</text>
<text xml:space="preserve" text-anchor="start" x="852.4" y="-1491.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="614.75" y="-1506.8" font-family="Arial" font-size="13.00" fill="#f9b27c">LikeC4 DSL</text>
<text xml:space="preserve" text-anchor="start" x="614.75" y="-1485.2" font-family="Arial" font-size="15.00" fill="#f9b27c">This model — specification, logical</text>
<text xml:space="preserve" text-anchor="start" x="614.75" y="-1467.2" font-family="Arial" font-size="15.00" fill="#f9b27c">model, delivery, deployment and</text>
<text xml:space="preserve" text-anchor="start" x="614.75" y="-1449.2" font-family="Arial" font-size="15.00" fill="#f9b27c">views</text>
</g>
<!-- srctf -->
<g id="node2" class="node">
<title>srctf</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="884,-1027 513.1,-1027 513.1,-847 884,-847 884,-1027"/>
<text xml:space="preserve" text-anchor="start" x="561.22" y="-931.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="605.16" y="-967.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">terraform/**</text>
<text xml:space="preserve" text-anchor="start" x="861.99" y="-931.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="605.16" y="-946.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Terraform HCL</text>
<text xml:space="preserve" text-anchor="start" x="605.16" y="-925.2" font-family="Arial" font-size="15.00" fill="#f9b27c">The Azure estate: resource groups,</text>
<text xml:space="preserve" text-anchor="start" x="605.16" y="-907.2" font-family="Arial" font-size="15.00" fill="#f9b27c">VNet, VM, storage, Cosmos, function</text>
<text xml:space="preserve" text-anchor="start" x="605.16" y="-889.2" font-family="Arial" font-size="15.00" fill="#f9b27c">apps, Key Vault</text>
</g>
<!-- srcapi -->
<g id="node3" class="node">
<title>srcapi</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="875.26,-467 521.83,-467 521.83,-287 875.26,-287 875.26,-467"/>
<text xml:space="preserve" text-anchor="start" x="569.95" y="-371.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="613.9" y="-416.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">apifunctionapp/**</text>
<text xml:space="preserve" text-anchor="start" x="853.25" y="-371.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="613.9" y="-395.8" font-family="Arial" font-size="13.00" fill="#f9b27c">C# / .NET 10 isolated worker</text>
<text xml:space="preserve" text-anchor="start" x="613.9" y="-374.2" font-family="Arial" font-size="15.00" fill="#f9b27c">The WHOOP endpoints, the two</text>
<text xml:space="preserve" text-anchor="start" x="613.9" y="-356.2" font-family="Arial" font-size="15.00" fill="#f9b27c">timers, the running dashboard</text>
<text xml:space="preserve" text-anchor="start" x="613.9" y="-338.2" font-family="Arial" font-size="15.00" fill="#f9b27c">build, the gym routes and the GPS</text>
<text xml:space="preserve" text-anchor="start" x="613.9" y="-320.2" font-family="Arial" font-size="15.00" fill="#f9b27c">upload</text>
</g>
<!-- srcgym -->
<g id="node4" class="node">
<title>srcgym</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="869.41,-747 527.69,-747 527.69,-567 869.41,-567 869.41,-747"/>
<text xml:space="preserve" text-anchor="start" x="575.81" y="-651.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="619.75" y="-696.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">gym/**</text>
<text xml:space="preserve" text-anchor="start" x="847.4" y="-651.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="619.75" y="-675.8" font-family="Arial" font-size="13.00" fill="#f9b27c">JSON, uploaded as blobs</text>
<text xml:space="preserve" text-anchor="start" x="619.75" y="-654.2" font-family="Arial" font-size="15.00" fill="#f9b27c">The gym exercise library and the</text>
<text xml:space="preserve" text-anchor="start" x="619.75" y="-636.2" font-family="Arial" font-size="15.00" fill="#f9b27c">built&#45;in day templates — the part</text>
<text xml:space="preserve" text-anchor="start" x="619.75" y="-618.2" font-family="Arial" font-size="15.00" fill="#f9b27c">of the training log that is the</text>
<text xml:space="preserve" text-anchor="start" x="619.75" y="-600.2" font-family="Arial" font-size="15.00" fill="#f9b27c">same for every account</text>
</g>
<!-- srcps -->
<g id="node5" class="node">
<title>srcps</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="876.94,-1307 520.16,-1307 520.16,-1127 876.94,-1127 876.94,-1307"/>
<text xml:space="preserve" text-anchor="start" x="568.28" y="-1211.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="612.22" y="-1229.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">psfunctionapp/**</text>
<text xml:space="preserve" text-anchor="start" x="854.93" y="-1211.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="612.22" y="-1208.8" font-family="Arial" font-size="13.00" fill="#f9b27c">PowerShell 7.4</text>
<text xml:space="preserve" text-anchor="start" x="612.22" y="-1187.2" font-family="Arial" font-size="15.00" fill="#f9b27c">cachecontrol and cachecontrolauto</text>
</g>
<!-- deployc4 -->
<g id="node6" class="node">
<title>deployc4</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1632.57,-1587 1301.66,-1587 1301.66,-1407 1632.57,-1407 1632.57,-1587"/>
<text xml:space="preserve" text-anchor="start" x="1349.78" y="-1491.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1393.73" y="-1545.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Deploy LikeC4</text>
<text xml:space="preserve" text-anchor="start" x="1610.56" y="-1491.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1393.73" y="-1524.8" font-family="Arial" font-size="13.00" fill="#f9b27c">deploy&#45;likec4.yml — push to master</text>
<text xml:space="preserve" text-anchor="start" x="1393.73" y="-1503.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Installs from the lockfile, runs</text>
<text xml:space="preserve" text-anchor="start" x="1393.73" y="-1485.2" font-family="Arial" font-size="15.00" fill="#f9b27c">likec4 validate (a broken model</text>
<text xml:space="preserve" text-anchor="start" x="1393.73" y="-1467.2" font-family="Arial" font-size="15.00" fill="#f9b27c">fails the run before anything is</text>
<text xml:space="preserve" text-anchor="start" x="1393.73" y="-1449.2" font-family="Arial" font-size="15.00" fill="#f9b27c">touched), renders with likec4</text>
<text xml:space="preserve" text-anchor="start" x="1393.73" y="-1431.2" font-family="Arial" font-size="15.00" fill="#f9b27c">build, then empties $web and</text>
</g>
<!-- tfapply -->
<g id="node7" class="node">
<title>tfapply</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1653.4,-1027 1280.84,-1027 1280.84,-847 1653.4,-847 1653.4,-1027"/>
<text xml:space="preserve" text-anchor="start" x="1328.96" y="-931.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1372.9" y="-985.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Terraform Apply</text>
<text xml:space="preserve" text-anchor="start" x="1631.39" y="-931.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1372.9" y="-964.8" font-family="Arial" font-size="13.00" fill="#f9b27c">terraform&#45;apply.yml —</text>
<text xml:space="preserve" text-anchor="start" x="1372.9" y="-943.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Authenticates with ARM_USE_OIDC,</text>
<text xml:space="preserve" text-anchor="start" x="1372.9" y="-925.2" font-family="Arial" font-size="15.00" fill="#f9b27c">fetches the home IP and the SSH</text>
<text xml:space="preserve" text-anchor="start" x="1372.9" y="-907.2" font-family="Arial" font-size="15.00" fill="#f9b27c">public key at run time, then</text>
<text xml:space="preserve" text-anchor="start" x="1372.9" y="-889.2" font-family="Arial" font-size="15.00" fill="#f9b27c">terraform apply &#45;auto&#45;approve.</text>
<text xml:space="preserve" text-anchor="start" x="1372.9" y="-871.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Run by hand rather than on a push:</text>
</g>
<!-- deployapi -->
<g id="node8" class="node">
<title>deployapi</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1640.91,-747 1293.32,-747 1293.32,-567 1640.91,-567 1640.91,-747"/>
<text xml:space="preserve" text-anchor="start" x="1341.44" y="-651.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1385.39" y="-705.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Deploy API Function App</text>
<text xml:space="preserve" text-anchor="start" x="1618.9" y="-651.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1385.39" y="-684.8" font-family="Arial" font-size="13.00" fill="#f9b27c">deploy&#45;api&#45;function&#45;app.yml — push</text>
<text xml:space="preserve" text-anchor="start" x="1385.39" y="-663.2" font-family="Arial" font-size="15.00" fill="#f9b27c">dotnet publish &#45;c Release, then</text>
<text xml:space="preserve" text-anchor="start" x="1385.39" y="-645.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Azure/functions&#45;action@v1 to</text>
<text xml:space="preserve" text-anchor="start" x="1385.39" y="-627.2" font-family="Arial" font-size="15.00" fill="#f9b27c">func&#45;nygdev&#45;api. A build failure</text>
<text xml:space="preserve" text-anchor="start" x="1385.39" y="-609.2" font-family="Arial" font-size="15.00" fill="#f9b27c">stops the run before Azure is</text>
<text xml:space="preserve" text-anchor="start" x="1385.39" y="-591.2" font-family="Arial" font-size="15.00" fill="#f9b27c">touched.</text>
</g>
<!-- deployfunc -->
<g id="node9" class="node">
<title>deployfunc</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1660.09,-1307 1274.14,-1307 1274.14,-1127 1660.09,-1127 1660.09,-1307"/>
<text xml:space="preserve" text-anchor="start" x="1322.26" y="-1211.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1366.2" y="-1256.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Deploy PS Function App</text>
<text xml:space="preserve" text-anchor="start" x="1638.09" y="-1211.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1366.2" y="-1235.8" font-family="Arial" font-size="13.00" fill="#f9b27c">deploy&#45;ps&#45;function&#45;app.yml — push</text>
<text xml:space="preserve" text-anchor="start" x="1366.2" y="-1214.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Save&#45;Module bundles Az.Accounts and</text>
<text xml:space="preserve" text-anchor="start" x="1366.2" y="-1196.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Az.Storage into the package, then</text>
<text xml:space="preserve" text-anchor="start" x="1366.2" y="-1178.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Azure/functions&#45;action@v1 to</text>
<text xml:space="preserve" text-anchor="start" x="1366.2" y="-1160.2" font-family="Arial" font-size="15.00" fill="#f9b27c">func&#45;nygdev&#45;azadmin.</text>
</g>
<!-- deployintegrations -->
<g id="node10" class="node">
<title>deployintegrations</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1677.05,-467 1257.19,-467 1257.19,-287 1677.05,-287 1677.05,-467"/>
<text xml:space="preserve" text-anchor="start" x="1305.31" y="-371.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1349.25" y="-425.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Deploy Integrations Function App</text>
<text xml:space="preserve" text-anchor="start" x="1655.04" y="-371.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1349.25" y="-404.8" font-family="Arial" font-size="13.00" fill="#f9b27c">deploy&#45;integrations&#45;function&#45;app.yml</text>
<text xml:space="preserve" text-anchor="start" x="1349.25" y="-383.2" font-family="Arial" font-size="15.00" fill="#f9b27c">The same two steps against</text>
<text xml:space="preserve" text-anchor="start" x="1349.25" y="-365.2" font-family="Arial" font-size="15.00" fill="#f9b27c">func&#45;nygdev&#45;integrations. A second</text>
<text xml:space="preserve" text-anchor="start" x="1349.25" y="-347.2" font-family="Arial" font-size="15.00" fill="#f9b27c">workflow rather than a matrix</text>
<text xml:space="preserve" text-anchor="start" x="1349.25" y="-329.2" font-family="Arial" font-size="15.00" fill="#f9b27c">because the path filters are what</text>
<text xml:space="preserve" text-anchor="start" x="1349.25" y="-311.2" font-family="Arial" font-size="15.00" fill="#f9b27c">decide which app a change</text>
</g>
<!-- ghenv -->
<g id="node11" class="node">
<title>ghenv</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="906.06,-1868 491.04,-1868 491.04,-1688 906.06,-1688 906.06,-1868"/>
<text xml:space="preserve" text-anchor="start" x="539.16" y="-1772.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="583.1" y="-1826.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">Environment &quot;NygDevAzure&quot;</text>
<text xml:space="preserve" text-anchor="start" x="884.05" y="-1772.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="583.1" y="-1805.8" font-family="Arial" font-size="13.00" fill="#f9b27c">GitHub Actions environment</text>
<text xml:space="preserve" text-anchor="start" x="583.1" y="-1784.2" font-family="Arial" font-size="15.00" fill="#f9b27c">AZURE_CLIENT_ID, AZURE_TENANT_ID,</text>
<text xml:space="preserve" text-anchor="start" x="583.1" y="-1766.2" font-family="Arial" font-size="15.00" fill="#f9b27c">AZURE_SUBSCRIPTION_ID,</text>
<text xml:space="preserve" text-anchor="start" x="583.1" y="-1748.2" font-family="Arial" font-size="15.00" fill="#f9b27c">AZURE_KEYVAULT_NAME,</text>
<text xml:space="preserve" text-anchor="start" x="583.1" y="-1730.2" font-family="Arial" font-size="15.00" fill="#f9b27c">AZURE_VM_USERNAME,</text>
<text xml:space="preserve" text-anchor="start" x="583.1" y="-1712.2" font-family="Arial" font-size="15.00" fill="#f9b27c">ENTRA_OWNER_OBJECTID.</text>
</g>
<!-- ghoidc -->
<g id="node12" class="node">
<title>ghoidc</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="2482.11,-460 2113.67,-460 2113.67,-280 2482.11,-280 2482.11,-460"/>
<text xml:space="preserve" text-anchor="start" x="2161.79" y="-364.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="2205.73" y="-418.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">GitHub deploy identity</text>
<text xml:space="preserve" text-anchor="start" x="2460.1" y="-364.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="2205.73" y="-397.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Workload identity federation</text>
<text xml:space="preserve" text-anchor="start" x="2205.73" y="-376.2" font-family="Arial" font-size="15.00" fill="#f9b27c">The AZURE_CLIENT_ID principal.</text>
<text xml:space="preserve" text-anchor="start" x="2205.73" y="-358.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Federated credentials trust</text>
<text xml:space="preserve" text-anchor="start" x="2205.73" y="-340.2" font-family="Arial" font-size="15.00" fill="#f9b27c">token.actions.githubusercontent.com</text>
<text xml:space="preserve" text-anchor="start" x="2205.73" y="-322.2" font-family="Arial" font-size="15.00" fill="#f9b27c">for this repository and the</text>
<text xml:space="preserve" text-anchor="start" x="2205.73" y="-304.2" font-family="Arial" font-size="15.00" fill="#f9b27c">NygDevAzure environment, so there</text>
</g>
<!-- website -->
<g id="node13" class="node">
<title>website</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2464.19,-2086.64C2464.19,-2095.67 2389.65,-2103 2297.89,-2103 2206.12,-2103 2131.58,-2095.67 2131.58,-2086.64 2131.58,-2086.64 2131.58,-1939.36 2131.58,-1939.36 2131.58,-1930.33 2206.12,-1923 2297.89,-1923 2389.65,-1923 2464.19,-1930.33 2464.19,-1939.36 2464.19,-1939.36 2464.19,-2086.64 2464.19,-2086.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2464.19,-2086.64C2464.19,-2077.61 2389.65,-2070.27 2297.89,-2070.27 2206.12,-2070.27 2131.58,-2077.61 2131.58,-2086.64"/>
<text xml:space="preserve" text-anchor="start" x="2179.7" y="-2007.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2223.65" y="-2043.8" font-family="Arial" font-size="20.00" fill="#eff6ff">$web</text>
<text xml:space="preserve" text-anchor="start" x="2442.18" y="-2007.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2223.65" y="-2022.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Storage static website</text>
<text xml:space="preserve" text-anchor="start" x="2223.65" y="-2001.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">This model, rendered by likec4</text>
<text xml:space="preserve" text-anchor="start" x="2223.65" y="-1983.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">build and served at the account</text>
<text xml:space="preserve" text-anchor="start" x="2223.65" y="-1965.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">primary web endpoint</text>
</g>
<!-- dev -->
<g id="node14" class="node">
<title>dev</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="320.04,-1587 0,-1587 0,-1407 320.04,-1407 320.04,-1587"/>
<text xml:space="preserve" text-anchor="start" x="114.44" y="-1509" font-family="Arial" font-size="20.00" fill="#f8fafc">Developer</text>
<text xml:space="preserve" text-anchor="start" x="24.95" y="-1486" font-family="Arial" font-size="15.00" fill="#c2f0c2">Authors the model, the terraform and the</text>
<text xml:space="preserve" text-anchor="start" x="39.11" y="-1468" font-family="Arial" font-size="15.00" fill="#c2f0c2">function code, and pushes to master</text>
</g>
<!-- tfstate -->
<g id="node15" class="node">
<title>tfstate</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2460.4,-1303.64C2460.4,-1312.67 2387.56,-1320 2297.89,-1320 2208.22,-1320 2135.38,-1312.67 2135.38,-1303.64 2135.38,-1303.64 2135.38,-1156.36 2135.38,-1156.36 2135.38,-1147.33 2208.22,-1140 2297.89,-1140 2387.56,-1140 2460.4,-1147.33 2460.4,-1156.36 2460.4,-1156.36 2460.4,-1303.64 2460.4,-1303.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2460.4,-1303.64C2460.4,-1294.61 2387.56,-1287.27 2297.89,-1287.27 2208.22,-1287.27 2135.38,-1294.61 2135.38,-1303.64"/>
<text xml:space="preserve" text-anchor="start" x="2183.5" y="-1224.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2227.44" y="-1260.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Terraform State</text>
<text xml:space="preserve" text-anchor="start" x="2438.39" y="-1224.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2227.44" y="-1239.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Blob Storage, AzureAD auth</text>
<text xml:space="preserve" text-anchor="start" x="2227.44" y="-1218.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdevtfstate / tfstate /</text>
<text xml:space="preserve" text-anchor="start" x="2227.44" y="-1200.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">azure&#45;infrastructure.tfstate in</text>
<text xml:space="preserve" text-anchor="start" x="2227.44" y="-1182.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">rg&#45;nygdev&#45;data</text>
</g>
<!-- keyvault -->
<g id="node16" class="node">
<title>keyvault</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2477.93,-1021.9C2477.93,-1031.94 2397.23,-1040.1 2297.89,-1040.1 2198.54,-1040.1 2117.84,-1031.94 2117.84,-1021.9 2117.84,-1021.9 2117.84,-858.1 2117.84,-858.1 2117.84,-848.06 2198.54,-839.9 2297.89,-839.9 2397.23,-839.9 2477.93,-848.06 2477.93,-858.1 2477.93,-858.1 2477.93,-1021.9 2477.93,-1021.9"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2477.93,-1021.9C2477.93,-1011.86 2397.23,-1003.7 2297.89,-1003.7 2198.54,-1003.7 2117.84,-1011.86 2117.84,-1021.9"/>
<text xml:space="preserve" text-anchor="start" x="2165.96" y="-934.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2209.91" y="-988.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Key Vault</text>
<text xml:space="preserve" text-anchor="start" x="2455.92" y="-934.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2209.91" y="-967.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Key Vault — standard, RBAC</text>
<text xml:space="preserve" text-anchor="start" x="2209.91" y="-946.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev, in rg&#45;nygdev&#45;security.</text>
<text xml:space="preserve" text-anchor="start" x="2209.91" y="-928.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Holds whoop&#45;clientsecret, copied in</text>
<text xml:space="preserve" text-anchor="start" x="2209.91" y="-910.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">by</text>
<text xml:space="preserve" text-anchor="start" x="2209.91" y="-892.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">hand from the WHOOP developer</text>
<text xml:space="preserve" text-anchor="start" x="2209.91" y="-874.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">dashboard, and whoop&#45;token.</text>
</g>
<!-- azurerm -->
<g id="node17" class="node">
<title>azurerm</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="3243.21,-460 2895.44,-460 2895.44,-280 3243.21,-280 3243.21,-460"/>
<text xml:space="preserve" text-anchor="start" x="2955.38" y="-391.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Azure Resource Manager</text>
<text xml:space="preserve" text-anchor="start" x="2999.24" y="-370.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">management.azure.com</text>
<text xml:space="preserve" text-anchor="start" x="2915.5" y="-349.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">The Azure control plane. Terraform and the az</text>
<text xml:space="preserve" text-anchor="start" x="2949.67" y="-331.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">CLI both reach the estate through it.</text>
</g>
<!-- api -->
<g id="node18" class="node">
<title>api</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="2470.85,-740 2124.93,-740 2124.93,-560 2470.85,-560 2470.85,-740"/>
<text xml:space="preserve" text-anchor="start" x="2173.05" y="-644.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2216.99" y="-698.8" font-family="Arial" font-size="20.00" fill="#eff6ff">API</text>
<text xml:space="preserve" text-anchor="start" x="2448.84" y="-644.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2216.99" y="-677.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="2216.99" y="-656.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;api. The training log</text>
<text xml:space="preserve" text-anchor="start" x="2216.99" y="-638.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">and nothing else since the split:</text>
<text xml:space="preserve" text-anchor="start" x="2216.99" y="-620.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">blocks, sessions, sets and saved</text>
<text xml:space="preserve" text-anchor="start" x="2216.99" y="-602.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">day templates, read and written a</text>
<text xml:space="preserve" text-anchor="start" x="2216.99" y="-584.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">tap</text>
</g>
<!-- azadmin -->
<g id="node19" class="node">
<title>azadmin</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="2470.84,-1823 2124.93,-1823 2124.93,-1643 2470.84,-1643 2470.84,-1823"/>
<text xml:space="preserve" text-anchor="start" x="2173.05" y="-1727.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2217" y="-1772.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Admin Automation</text>
<text xml:space="preserve" text-anchor="start" x="2448.83" y="-1727.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2217" y="-1751.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">PowerShell 7.4 — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="2217" y="-1730.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;azadmin. Sets</text>
<text xml:space="preserve" text-anchor="start" x="2217" y="-1712.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Cache&#45;Control on Foundry media</text>
<text xml:space="preserve" text-anchor="start" x="2217" y="-1694.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">blobs, on demand and on</text>
<text xml:space="preserve" text-anchor="start" x="2217" y="-1676.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">blob&#45;created events.</text>
</g>
<!-- integrations -->
<g id="node20" class="node">
<title>integrations</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="2472.95,-180 2122.83,-180 2122.83,0 2472.95,0 2472.95,-180"/>
<text xml:space="preserve" text-anchor="start" x="2170.94" y="-84.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2214.89" y="-138.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Integrations</text>
<text xml:space="preserve" text-anchor="start" x="2450.94" y="-84.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2214.89" y="-117.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="2214.89" y="-96.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;integrations.</text>
<text xml:space="preserve" text-anchor="start" x="2214.89" y="-78.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Everything that feeds the estate</text>
<text xml:space="preserve" text-anchor="start" x="2214.89" y="-60.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">from outside</text>
<text xml:space="preserve" text-anchor="start" x="2214.89" y="-42.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">it, split off from the API so that</text>
<text xml:space="preserve" text-anchor="start" x="2214.89" y="-24.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">app could have its gate turned on.</text>
</g>
<!-- srcc4&#45;&gt;deployc4 -->
<g id="edge3" class="edge">
<title>srcc4&#45;&gt;deployc4</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M874.08,-1488.09C912.6,-1486.47 953.2,-1485.03 991.06,-1484.2 1071.54,-1482.43 1091.7,-1482.45 1172.19,-1484.2 1210.74,-1485.04 1252.12,-1486.5 1291.31,-1488.13"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1291.13,-1490.75 1298.73,-1488.45 1291.35,-1485.51 1291.13,-1490.75"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1022.58,-1484.2 1022.58,-1507 1140.66,-1507 1140.66,-1484.2 1022.58,-1484.2"/>
<text xml:space="preserve" text-anchor="start" x="1025.58" y="-1490" font-family="Arial" font-size="14.00" fill="#c9c9c9">Change here runs</text>
</g>
<!-- srctf&#45;&gt;tfapply -->
<g id="edge4" class="edge">
<title>srctf&#45;&gt;tfapply</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M883.65,-937C1000.51,-937 1151.58,-937 1270.59,-937"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1270.38,-939.63 1277.88,-937 1270.38,-934.38 1270.38,-939.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="997.29,-937 997.29,-959.8 1165.96,-959.8 1165.96,-937 997.29,-937"/>
<text xml:space="preserve" text-anchor="start" x="1000.29" y="-942.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Change here is applied by</text>
</g>
<!-- srcapi&#45;&gt;deployapi -->
<g id="edge5" class="edge">
<title>srcapi&#45;&gt;deployapi</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M874.93,-441.06C997.26,-485.74 1160.1,-545.22 1283.9,-590.44"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1282.71,-592.8 1290.65,-592.91 1284.51,-587.87 1282.71,-592.8"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1022.58,-542.08 1022.58,-564.88 1140.66,-564.88 1140.66,-542.08 1022.58,-542.08"/>
<text xml:space="preserve" text-anchor="start" x="1025.58" y="-547.88" font-family="Arial" font-size="14.00" fill="#c9c9c9">Change here runs</text>
</g>
<!-- srcgym&#45;&gt;tfapply -->
<g id="edge6" class="edge">
<title>srcgym&#45;&gt;tfapply</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M869.2,-718.97C988.15,-762.41 1147.43,-820.59 1271.54,-865.93"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1270.37,-868.3 1278.32,-868.4 1272.18,-863.37 1270.37,-868.3"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="991.06,-822.08 991.06,-844.88 1172.19,-844.88 1172.19,-822.08 991.06,-822.08"/>
<text xml:space="preserve" text-anchor="start" x="994.06" y="-827.88" font-family="Arial" font-size="14.00" fill="#c9c9c9">Change here is uploaded by</text>
</g>
<!-- srcps&#45;&gt;deployfunc -->
<g id="edge7" class="edge">
<title>srcps&#45;&gt;deployfunc</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M876.86,-1217C992.45,-1217 1143.59,-1217 1263.86,-1217"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1263.77,-1219.63 1271.27,-1217 1263.77,-1214.38 1263.77,-1219.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1022.58,-1217 1022.58,-1239.8 1140.66,-1239.8 1140.66,-1217 1022.58,-1217"/>
<text xml:space="preserve" text-anchor="start" x="1025.58" y="-1222.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Change here runs</text>
</g>
<!-- deployc4&#45;&gt;website -->
<g id="edge8" class="edge">
<title>deployc4&#45;&gt;website</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1546.38,-1586.97C1602.64,-1647.62 1682.8,-1726.26 1765.05,-1781 1875.65,-1854.62 2013.46,-1913.96 2121.08,-1954.2"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2119.96,-1956.58 2127.91,-1956.73 2121.79,-1951.66 2119.96,-1956.58"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1773.24,-1912.76 1773.24,-1952.36 2020.47,-1952.36 2020.47,-1912.76 1773.24,-1912.76"/>
<text xml:space="preserve" text-anchor="start" x="1776.24" y="-1935.36" font-family="Arial" font-size="14.00" fill="#c9c9c9">Clears and re&#45;uploads dist/ (az storage</text>
<text xml:space="preserve" text-anchor="start" x="1776.24" y="-1918.56" font-family="Arial" font-size="14.00" fill="#c9c9c9">blob upload&#45;batch)</text>
</g>
<!-- tfapply&#45;&gt;tfstate -->
<g id="edge9" class="edge">
<title>tfapply&#45;&gt;tfstate</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1653.34,-1002.48C1794.4,-1052.35 1987.14,-1120.49 2124.84,-1169.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2123.85,-1171.61 2131.8,-1171.64 2125.6,-1166.66 2123.85,-1171.61"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1824.6,-1126.86 1824.6,-1149.66 1969.11,-1149.66 1969.11,-1126.86 1824.6,-1126.86"/>
<text xml:space="preserve" text-anchor="start" x="1827.6" y="-1132.66" font-family="Arial" font-size="14.00" fill="#c9c9c9">Locks and writes state</text>
</g>
<!-- tfapply&#45;&gt;keyvault -->
<g id="edge10" class="edge">
<title>tfapply&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1653.34,-937.67C1788.32,-938.16 1970.63,-938.82 2106.75,-939.31"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2106.34,-941.94 2113.85,-939.34 2106.36,-936.69 2106.34,-941.94"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1765.05,-938.94 1765.05,-978.54 2028.67,-978.54 2028.67,-938.94 1765.05,-938.94"/>
<text xml:space="preserve" text-anchor="start" x="1768.05" y="-961.54" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads HomeIP, and the nygdev&#45;ed25519</text>
<text xml:space="preserve" text-anchor="start" x="1768.05" y="-944.74" font-family="Arial" font-size="14.00" fill="#c9c9c9">public key beside it, at run time</text>
</g>
<!-- tfapply&#45;&gt;azurerm -->
<g id="edge11" class="edge">
<title>tfapply&#45;&gt;azurerm</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1653.18,-991.79C1693.48,-1012.23 1731.61,-1039.86 1757.05,-1077 1769.39,-1095.03 1753.62,-1156.37 1765.05,-1175 1851.45,-1315.88 1922.65,-1324.96 2081.67,-1370 2266.59,-1422.38 2348.51,-1467.55 2514.11,-1370 2852.75,-1170.51 2999.1,-681.37 3048.02,-469.99"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3050.56,-470.68 3049.67,-462.78 3045.44,-469.51 3050.56,-470.68"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2202.29,-1427.44 2202.29,-1450.24 2393.49,-1450.24 2393.49,-1427.44 2202.29,-1427.44"/>
<text xml:space="preserve" text-anchor="start" x="2205.29" y="-1433.24" font-family="Arial" font-size="14.00" fill="#c9c9c9">terraform apply &#45;auto&#45;approve</text>
</g>
<!-- deployapi&#45;&gt;api -->
<g id="edge12" class="edge">
<title>deployapi&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1640.85,-655.54C1779.46,-654.37 1973.52,-652.73 2114.6,-651.54"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2114.59,-654.16 2122.06,-651.48 2114.54,-648.92 2114.59,-654.16"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1802.03,-654.33 1802.03,-677.13 1991.68,-677.13 1991.68,-654.33 1802.03,-654.33"/>
<text xml:space="preserve" text-anchor="start" x="1805.03" y="-660.13" font-family="Arial" font-size="14.00" fill="#c9c9c9">Deploys the published worker</text>
</g>
<!-- deployfunc&#45;&gt;azadmin -->
<g id="edge13" class="edge">
<title>deployfunc&#45;&gt;azadmin</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1660.04,-1273.85C1698.19,-1294.02 1733.65,-1321.02 1757.05,-1357 1771.53,-1379.28 1748.42,-1575.27 1765.05,-1596 1847.44,-1698.71 1995.71,-1730.48 2114.8,-1737.95"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2114.48,-1740.56 2122.12,-1738.37 2114.78,-1735.32 2114.48,-1740.56"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1802.02,-1726.48 1802.02,-1749.28 1991.69,-1749.28 1991.69,-1726.48 1802.02,-1726.48"/>
<text xml:space="preserve" text-anchor="start" x="1805.02" y="-1732.28" font-family="Arial" font-size="14.00" fill="#c9c9c9">Deploys the function package</text>
</g>
<!-- deployintegrations&#45;&gt;ghoidc -->
<g id="edge14" class="edge">
<title>deployintegrations&#45;&gt;ghoidc</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1717.04,-374.9C1840.87,-373.85 1988.28,-372.61 2103.48,-371.63"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2103.28,-374.26 2110.76,-371.57 2103.24,-369.01 2103.28,-374.26"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1709.47,-333.62 1709.47,-373.22 1915.45,-373.22 1915.45,-333.62 1709.47,-333.62"/>
<text xml:space="preserve" text-anchor="start" x="1712.47" y="-356.22" font-family="Arial" font-size="14.00" fill="#c9c9c9">Presents the runner OIDC token</text>
<text xml:space="preserve" text-anchor="start" x="1712.47" y="-339.42" font-family="Arial" font-size="14.00" fill="#c9c9c9">(azure/login@v3)</text>
</g>
<!-- deployintegrations&#45;&gt;integrations -->
<g id="edge15" class="edge">
<title>deployintegrations&#45;&gt;integrations</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1676.98,-304.67C1811.36,-258.14 1984.35,-198.23 2113.42,-153.53"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2113.94,-156.13 2120.17,-151.2 2112.22,-151.17 2113.94,-156.13"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1802.03,-267.65 1802.03,-290.45 1991.68,-290.45 1991.68,-267.65 1802.03,-267.65"/>
<text xml:space="preserve" text-anchor="start" x="1805.03" y="-273.45" font-family="Arial" font-size="14.00" fill="#c9c9c9">Deploys the published worker</text>
</g>
<!-- ghenv&#45;&gt;deployc4 -->
<g id="edge2" class="edge">
<title>ghenv&#45;&gt;deployc4</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M905.98,-1702.33C998.74,-1668.32 1109.21,-1627.83 1207.42,-1591.83"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1208.21,-1594.34 1214.35,-1589.29 1206.4,-1589.41 1208.21,-1594.34"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="812.48,-1605.79 812.48,-1645.39 1061.3,-1645.39 1061.3,-1605.79 812.48,-1605.79"/>
<text xml:space="preserve" text-anchor="start" x="815.48" y="-1628.39" font-family="Arial" font-size="14.00" fill="#c9c9c9">Supplies tenant, subscription and client</text>
<text xml:space="preserve" text-anchor="start" x="815.48" y="-1611.59" font-family="Arial" font-size="14.00" fill="#c9c9c9">ids to</text>
</g>
<!-- ghoidc&#45;&gt;azurerm -->
<g id="edge16" class="edge">
<title>ghoidc&#45;&gt;azurerm</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2481.72,-370C2603.74,-370 2763.56,-370 2885.56,-370"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2885.23,-372.63 2892.73,-370 2885.23,-367.38 2885.23,-372.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2567.11,-370 2567.11,-409.6 2810.44,-409.6 2810.44,-370 2567.11,-370"/>
<text xml:space="preserve" text-anchor="start" x="2570.11" y="-392.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Authorises calls against (RBAC on the</text>
<text xml:space="preserve" text-anchor="start" x="2570.11" y="-375.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">subscription)</text>
</g>
<!-- dev&#45;&gt;srcc4 -->
<g id="edge1" class="edge">
<title>dev&#45;&gt;srcc4</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.82,-1497C364.69,-1497 414.49,-1497 462.82,-1497"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="462.58,-1499.63 470.08,-1497 462.58,-1494.38 462.58,-1499.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="396.24,-1474.2 396.24,-1497 507.28,-1497 507.28,-1474.2 396.24,-1474.2"/>
<text xml:space="preserve" text-anchor="start" x="399.24" y="-1480" font-family="Arial" font-size="14.00" fill="#c9c9c9">git push (master)</text>
</g>
</g>
</svg>
`;case`gym`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1986pt" height="1237pt"
 viewBox="0.00 0.00 1986.00 1237.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1222.15)">
<g id="clust1" class="cluster">
<title>cluster_@gr1</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="736.57,-311.1 736.57,-902.1 1191.68,-902.1 1191.68,-311.1 736.57,-311.1"/>
<text xml:space="preserve" text-anchor="start" x="744.57" y="-889.2" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">THE TRAINING LOG, IN TWO SHELLS</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_entra</title>
<polygon fill="#3e4651" stroke="#2d333d" points="1540.92,-934.1 1540.92,-1199.1 1944.17,-1199.1 1944.17,-934.1 1540.92,-934.1"/>
<text xml:space="preserve" text-anchor="start" x="1548.92" y="-1186.2" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">MICROSOFT ENTRA ID</text>
</g>
<g id="clust3" class="cluster">
<title>cluster_cdn</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="1537.16,-624.1 1537.16,-909.1 1947.93,-909.1 1947.93,-624.1 1537.16,-624.1"/>
<text xml:space="preserve" text-anchor="start" x="1545.16" y="-896.2" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">CDN STORAGE</text>
</g>
<!-- gym -->
<g id="node1" class="node">
<title>gym</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1144.58,-840.93 783.67,-840.93 783.67,-651.27 1144.58,-651.27 1144.58,-840.93"/>
<text xml:space="preserve" text-anchor="start" x="831.79" y="-740.5" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-794.9" font-family="Arial" font-size="20.00" fill="#f0f9ff">gym.nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="1122.57" y="-740.5" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-773.9" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-752.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevgym — GymLog, the training</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-734.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">logger. Provisioned empty by</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-716.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">terraform;</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-698.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">the built React app is deployed</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-680.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">from the nygdevweb repository.</text>
</g>
<!-- gymbro -->
<g id="node2" class="node">
<title>gymbro</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1151.68,-540.93 776.57,-540.93 776.57,-351.27 1151.68,-351.27 1151.68,-540.93"/>
<text xml:space="preserve" text-anchor="start" x="824.68" y="-440.5" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-494.9" font-family="Arial" font-size="20.00" fill="#f0f9ff">gymbro.nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="1129.67" y="-440.5" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-473.9" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-452.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevgymbro — the desktop planner</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-434.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">for the same training log. A Static</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-416.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">Web App of its own rather than a</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-398.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">path on the logger, because a</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-380.3" font-family="Arial" font-size="15.00" fill="#b6ecf7">Static Web</text>
</g>
<!-- gymlog -->
<g id="node3" class="node">
<title>gymlog</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1912.17,-1146.1 1572.92,-1146.1 1572.92,-966.1 1912.17,-966.1 1912.17,-1146.1"/>
<text xml:space="preserve" text-anchor="start" x="1621.04" y="-1050.5" font-family="Arial" font-size="14.00" fill="#f8fafc"> </text>
<text xml:space="preserve" text-anchor="start" x="1664.98" y="-1104.9" font-family="Arial" font-size="20.00" fill="#f8fafc">GymLog</text>
<text xml:space="preserve" text-anchor="start" x="1890.16" y="-1050.5" font-family="Arial" font-size="14.00" fill="#f8fafc"> </text>
<text xml:space="preserve" text-anchor="start" x="1664.98" y="-1083.9" font-family="Arial" font-size="13.00" fill="#cbd5e1">Single&#45;page application platform,</text>
<text xml:space="preserve" text-anchor="start" x="1664.98" y="-1062.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">The identity both gym front ends</text>
<text xml:space="preserve" text-anchor="start" x="1664.98" y="-1044.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">sign in as, and the identity Easy</text>
<text xml:space="preserve" text-anchor="start" x="1664.98" y="-1026.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">Auth on the API accepts. Both</text>
<text xml:space="preserve" text-anchor="start" x="1664.98" y="-1008.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">halves of that check name it: the</text>
<text xml:space="preserve" text-anchor="start" x="1664.98" y="-990.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">token</text>
</g>
<!-- datacontainer -->
<g id="node4" class="node">
<title>datacontainer</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M1915.93,-838C1915.93,-848.04 1838.22,-856.2 1742.54,-856.2 1646.87,-856.2 1569.16,-848.04 1569.16,-838 1569.16,-838 1569.16,-674.2 1569.16,-674.2 1569.16,-664.16 1646.87,-656 1742.54,-656 1838.22,-656 1915.93,-664.16 1915.93,-674.2 1915.93,-674.2 1915.93,-838 1915.93,-838"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M1915.93,-838C1915.93,-827.96 1838.22,-819.8 1742.54,-819.8 1646.87,-819.8 1569.16,-827.96 1569.16,-838"/>
<text xml:space="preserve" text-anchor="start" x="1617.28" y="-750.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1661.22" y="-804.9" font-family="Arial" font-size="20.00" fill="#eff6ff">data</text>
<text xml:space="preserve" text-anchor="start" x="1893.92" y="-750.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1661.22" y="-783.9" font-family="Arial" font-size="13.00" fill="#bfdbfe">Anonymous blob read; the container</text>
<text xml:space="preserve" text-anchor="start" x="1661.22" y="-762.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">Three files, published by two</text>
<text xml:space="preserve" text-anchor="start" x="1661.22" y="-744.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">different things.</text>
<text xml:space="preserve" text-anchor="start" x="1661.22" y="-726.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">marathonprep.json is the built</text>
<text xml:space="preserve" text-anchor="start" x="1661.22" y="-708.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">running dashboard, written by the</text>
<text xml:space="preserve" text-anchor="start" x="1661.22" y="-690.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">Integrations app and rewritten in</text>
</g>
<!-- user -->
<g id="node5" class="node">
<title>user</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="366.09,-836.1 0,-836.1 0,-656.1 366.09,-656.1 366.09,-836.1"/>
<text xml:space="preserve" text-anchor="start" x="155.26" y="-785.1" font-family="Arial" font-size="20.00" fill="#f8fafc">Visitor</text>
<text xml:space="preserve" text-anchor="start" x="28.38" y="-762.1" font-family="Arial" font-size="15.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="110.08" y="-744.1" font-family="Arial" font-size="15.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-726.1" font-family="Arial" font-size="15.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
<text xml:space="preserve" text-anchor="start" x="102.16" y="-708.1" font-family="Arial" font-size="15.00" fill="#c2f0c2">can be renewed forever,</text>
<text xml:space="preserve" text-anchor="start" x="45.05" y="-690.1" font-family="Arial" font-size="15.00" fill="#c2f0c2">but only a human can create the first one.</text>
</g>
<!-- api -->
<g id="node6" class="node">
<title>api</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="1915.5,-546.1 1569.58,-546.1 1569.58,-366.1 1915.5,-366.1 1915.5,-546.1"/>
<text xml:space="preserve" text-anchor="start" x="1617.7" y="-450.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1661.65" y="-504.9" font-family="Arial" font-size="20.00" fill="#eff6ff">API</text>
<text xml:space="preserve" text-anchor="start" x="1893.5" y="-450.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1661.65" y="-483.9" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="1661.65" y="-462.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;api. The training log</text>
<text xml:space="preserve" text-anchor="start" x="1661.65" y="-444.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">and nothing else since the split:</text>
<text xml:space="preserve" text-anchor="start" x="1661.65" y="-426.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">blocks, sessions, sets and saved</text>
<text xml:space="preserve" text-anchor="start" x="1661.65" y="-408.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">day templates, read and written a</text>
<text xml:space="preserve" text-anchor="start" x="1661.65" y="-390.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">tap</text>
</g>
<!-- cosmos -->
<g id="node7" class="node">
<title>cosmos</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M1927.6,-182C1927.6,-192.04 1844.65,-200.2 1742.54,-200.2 1640.44,-200.2 1557.49,-192.04 1557.49,-182 1557.49,-182 1557.49,-18.2 1557.49,-18.2 1557.49,-8.16 1640.44,0 1742.54,0 1844.65,0 1927.6,-8.16 1927.6,-18.2 1927.6,-18.2 1927.6,-182 1927.6,-182"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M1927.6,-182C1927.6,-171.96 1844.65,-163.8 1742.54,-163.8 1640.44,-163.8 1557.49,-171.96 1557.49,-182"/>
<text xml:space="preserve" text-anchor="start" x="1605.61" y="-94.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-148.9" font-family="Arial" font-size="20.00" fill="#eff6ff">Cosmos DB</text>
<text xml:space="preserve" text-anchor="start" x="1905.59" y="-94.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-127.9" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-106.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev&#45;cosmos&#45;db / db, one account</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-88.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">holding three containers that share</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-70.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">nothing but the throughput. Local</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-52.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">auth is off, so Entra role</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-34.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">assignments</text>
</g>
<!-- gym&#45;&gt;gymlog -->
<g id="edge4" class="edge">
<title>gym&#45;&gt;gymlog</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1144.22,-817.61C1270.04,-867.84 1437.62,-934.75 1563.25,-984.91"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1562.23,-987.33 1570.17,-987.68 1564.18,-982.46 1562.23,-987.33"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1242.65,-946.98 1242.65,-986.58 1466.52,-986.58 1466.52,-946.98 1242.65,-946.98"/>
<text xml:space="preserve" text-anchor="start" x="1245.65" y="-969.58" font-family="Arial" font-size="14.00" fill="#c9c9c9">Signs in as this registration (MSAL,</text>
<text xml:space="preserve" text-anchor="start" x="1245.65" y="-952.78" font-family="Arial" font-size="14.00" fill="#c9c9c9">authorization code with PKCE)</text>
</g>
<!-- gym&#45;&gt;datacontainer -->
<g id="edge5" class="edge">
<title>gym&#45;&gt;datacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1144.22,-748.41C1268.26,-750 1432.89,-752.12 1557.9,-753.73"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1557.79,-756.36 1565.32,-753.83 1557.86,-751.11 1557.79,-756.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1226.68,-752.58 1226.68,-808.98 1482.49,-808.98 1482.49,-752.58 1226.68,-752.58"/>
<text xml:space="preserve" text-anchor="start" x="1229.68" y="-791.98" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches the exercise library and the</text>
<text xml:space="preserve" text-anchor="start" x="1229.68" y="-775.18" font-family="Arial" font-size="14.00" fill="#c9c9c9">built&#45;in day templates, once, and caches</text>
<text xml:space="preserve" text-anchor="start" x="1229.68" y="-758.38" font-family="Arial" font-size="14.00" fill="#c9c9c9">them</text>
</g>
<!-- gym&#45;&gt;api -->
<g id="edge3" class="edge">
<title>gym&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1144.22,-679.2C1268.95,-632.62 1434.71,-570.7 1559.97,-523.92"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1560.74,-526.44 1566.84,-521.35 1558.9,-521.52 1560.74,-526.44"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1234.07,-644.02 1234.07,-683.62 1475.1,-683.62 1475.1,-644.02 1234.07,-644.02"/>
<text xml:space="preserve" text-anchor="start" x="1237.07" y="-666.62" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes the training log, one</text>
<text xml:space="preserve" text-anchor="start" x="1237.07" y="-649.82" font-family="Arial" font-size="14.00" fill="#c9c9c9">tap at a time</text>
</g>
<!-- gymbro&#45;&gt;api -->
<g id="edge6" class="edge">
<title>gymbro&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1151.47,-428.82C1176.72,-427.03 1202.32,-425.5 1226.68,-424.5 1340.28,-419.82 1369.01,-417.6 1482.49,-424.5 1507.45,-426.02 1533.68,-428.35 1559.47,-431.07"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1558.97,-433.66 1566.71,-431.85 1559.54,-428.44 1558.97,-433.66"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1237.58,-424.5 1237.58,-464.1 1471.59,-464.1 1471.59,-424.5 1237.58,-424.5"/>
<text xml:space="preserve" text-anchor="start" x="1240.58" y="-447.1" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes the same routes, a</text>
<text xml:space="preserve" text-anchor="start" x="1240.58" y="-430.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">whole block at a time</text>
</g>
<!-- user&#45;&gt;gym -->
<g id="edge1" class="edge">
<title>user&#45;&gt;gym</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M365.72,-746.1C488.18,-746.1 649.39,-746.1 773.48,-746.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="773.32,-748.73 780.82,-746.1 773.32,-743.48 773.32,-748.73"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="441.09,-746.1 441.09,-768.9 701.57,-768.9 701.57,-746.1 441.09,-746.1"/>
<text xml:space="preserve" text-anchor="start" x="444.09" y="-751.9" font-family="Arial" font-size="14.00" fill="#c9c9c9">Logs a session at https://gym.nygard.dev</text>
</g>
<!-- user&#45;&gt;gymbro -->
<g id="edge2" class="edge">
<title>user&#45;&gt;gymbro</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M365.72,-676.14C486.12,-629.78 643.99,-568.99 767.2,-521.54"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="767.88,-524.1 773.93,-518.95 765.99,-519.2 767.88,-524.1"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="487.4,-640.5 487.4,-680.1 655.26,-680.1 655.26,-640.5 487.4,-640.5"/>
<text xml:space="preserve" text-anchor="start" x="490.4" y="-663.1" font-family="Arial" font-size="14.00" fill="#c9c9c9">Plans a block at</text>
<text xml:space="preserve" text-anchor="start" x="490.4" y="-646.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">https://gymbro.nygard.dev</text>
</g>
<!-- api&#45;&gt;cosmos -->
<g id="edge7" class="edge">
<title>api&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1742.54,-366.32C1742.54,-319.37 1742.54,-261.46 1742.54,-211.66"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1745.17,-211.69 1742.54,-204.19 1739.92,-211.69 1745.17,-211.69"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1577.99,-254.95 1577.99,-311.35 1844.7,-311.35 1844.7,-254.95 1577.99,-254.95"/>
<text xml:space="preserve" text-anchor="start" x="1580.99" y="-294.35" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes the blocks, sessions</text>
<text xml:space="preserve" text-anchor="start" x="1580.99" y="-277.55" font-family="Arial" font-size="14.00" fill="#c9c9c9">and saved templates in db/gym, under the</text>
<text xml:space="preserve" text-anchor="start" x="1580.99" y="-260.75" font-family="Arial" font-size="14.00" fill="#c9c9c9">object id off the token</text>
</g>
</g>
</svg>
`;case`gymSignIn`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3213pt" height="497pt"
 viewBox="0.00 0.00 3213.00 497.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 482.09)">
<!-- user -->
<g id="node1" class="node">
<title>user</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="366.09,-321.67 0,-321.67 0,-141.67 366.09,-141.67 366.09,-321.67"/>
<text xml:space="preserve" text-anchor="start" x="155.26" y="-270.67" font-family="Arial" font-size="20.00" fill="#f8fafc">Visitor</text>
<text xml:space="preserve" text-anchor="start" x="28.38" y="-247.67" font-family="Arial" font-size="15.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="110.08" y="-229.67" font-family="Arial" font-size="15.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-211.67" font-family="Arial" font-size="15.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
<text xml:space="preserve" text-anchor="start" x="102.16" y="-193.67" font-family="Arial" font-size="15.00" fill="#c2f0c2">can be renewed forever,</text>
<text xml:space="preserve" text-anchor="start" x="45.05" y="-175.67" font-family="Arial" font-size="15.00" fill="#c2f0c2">but only a human can create the first one.</text>
</g>
<!-- gym -->
<g id="node2" class="node">
<title>gym</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="961.49,-326.51 600.57,-326.51 600.57,-136.84 961.49,-136.84 961.49,-326.51"/>
<text xml:space="preserve" text-anchor="start" x="648.69" y="-226.07" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="692.64" y="-280.47" font-family="Arial" font-size="20.00" fill="#f0f9ff">gym.nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="939.48" y="-226.07" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="692.64" y="-259.47" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="692.64" y="-237.87" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevgym — GymLog, the training</text>
<text xml:space="preserve" text-anchor="start" x="692.64" y="-219.87" font-family="Arial" font-size="15.00" fill="#b6ecf7">logger. Provisioned empty by</text>
<text xml:space="preserve" text-anchor="start" x="692.64" y="-201.87" font-family="Arial" font-size="15.00" fill="#b6ecf7">terraform;</text>
<text xml:space="preserve" text-anchor="start" x="692.64" y="-183.87" font-family="Arial" font-size="15.00" fill="#b6ecf7">the built React app is deployed</text>
<text xml:space="preserve" text-anchor="start" x="692.64" y="-165.87" font-family="Arial" font-size="15.00" fill="#b6ecf7">from the nygdevweb repository.</text>
</g>
<!-- gymlog -->
<g id="node3" class="node">
<title>gymlog</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1710.31,-279.67 1371.06,-279.67 1371.06,-99.67 1710.31,-99.67 1710.31,-279.67"/>
<text xml:space="preserve" text-anchor="start" x="1419.18" y="-184.07" font-family="Arial" font-size="14.00" fill="#f8fafc"> </text>
<text xml:space="preserve" text-anchor="start" x="1463.13" y="-238.47" font-family="Arial" font-size="20.00" fill="#f8fafc">GymLog</text>
<text xml:space="preserve" text-anchor="start" x="1688.3" y="-184.07" font-family="Arial" font-size="14.00" fill="#f8fafc"> </text>
<text xml:space="preserve" text-anchor="start" x="1463.13" y="-217.47" font-family="Arial" font-size="13.00" fill="#cbd5e1">Single&#45;page application platform,</text>
<text xml:space="preserve" text-anchor="start" x="1463.13" y="-195.87" font-family="Arial" font-size="15.00" fill="#cbd5e1">The identity both gym front ends</text>
<text xml:space="preserve" text-anchor="start" x="1463.13" y="-177.87" font-family="Arial" font-size="15.00" fill="#cbd5e1">sign in as, and the identity Easy</text>
<text xml:space="preserve" text-anchor="start" x="1463.13" y="-159.87" font-family="Arial" font-size="15.00" fill="#cbd5e1">Auth on the API accepts. Both</text>
<text xml:space="preserve" text-anchor="start" x="1463.13" y="-141.87" font-family="Arial" font-size="15.00" fill="#cbd5e1">halves of that check name it: the</text>
<text xml:space="preserve" text-anchor="start" x="1463.13" y="-123.87" font-family="Arial" font-size="15.00" fill="#cbd5e1">token</text>
</g>
<!-- api -->
<g id="node4" class="node">
<title>api</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="2430.82,-434.67 2084.9,-434.67 2084.9,-254.67 2430.82,-254.67 2430.82,-434.67"/>
<text xml:space="preserve" text-anchor="start" x="2133.02" y="-339.07" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2176.96" y="-393.47" font-family="Arial" font-size="20.00" fill="#eff6ff">API</text>
<text xml:space="preserve" text-anchor="start" x="2408.81" y="-339.07" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2176.96" y="-372.47" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="2176.96" y="-350.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;api. The training log</text>
<text xml:space="preserve" text-anchor="start" x="2176.96" y="-332.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">and nothing else since the split:</text>
<text xml:space="preserve" text-anchor="start" x="2176.96" y="-314.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">blocks, sessions, sets and saved</text>
<text xml:space="preserve" text-anchor="start" x="2176.96" y="-296.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">day templates, read and written a</text>
<text xml:space="preserve" text-anchor="start" x="2176.96" y="-278.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">tap</text>
</g>
<!-- cosmos -->
<g id="node5" class="node">
<title>cosmos</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M3183.29,-426.57C3183.29,-436.62 3100.34,-444.77 2998.23,-444.77 2896.12,-444.77 2813.18,-436.62 2813.18,-426.57 2813.18,-426.57 2813.18,-262.77 2813.18,-262.77 2813.18,-252.73 2896.12,-244.57 2998.23,-244.57 3100.34,-244.57 3183.29,-252.73 3183.29,-262.77 3183.29,-262.77 3183.29,-426.57 3183.29,-426.57"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M3183.29,-426.57C3183.29,-416.53 3100.34,-408.37 2998.23,-408.37 2896.12,-408.37 2813.18,-416.53 2813.18,-426.57"/>
<text xml:space="preserve" text-anchor="start" x="2861.3" y="-339.07" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2905.25" y="-393.47" font-family="Arial" font-size="20.00" fill="#eff6ff">Cosmos DB</text>
<text xml:space="preserve" text-anchor="start" x="3161.28" y="-339.07" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2905.25" y="-372.47" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</text>
<text xml:space="preserve" text-anchor="start" x="2905.25" y="-350.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev&#45;cosmos&#45;db / db, one account</text>
<text xml:space="preserve" text-anchor="start" x="2905.25" y="-332.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">holding three containers that share</text>
<text xml:space="preserve" text-anchor="start" x="2905.25" y="-314.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">nothing but the throughput. Local</text>
<text xml:space="preserve" text-anchor="start" x="2905.25" y="-296.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">auth is off, so Entra role</text>
<text xml:space="preserve" text-anchor="start" x="2905.25" y="-278.87" font-family="Arial" font-size="15.00" fill="#bfdbfe">assignments</text>
</g>
<!-- user&#45;&gt;gym -->
<g id="edge1" class="edge">
<title>user&#45;&gt;gym</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M365.69,-231.67C436.75,-231.67 518.29,-231.67 590.12,-231.67"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="590.12,-234.3 597.62,-231.67 590.12,-229.05 590.12,-234.3"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="429.09,-234.67 429.09,-267.47 453.09,-267.47 453.09,-234.67 429.09,-234.67"/>
<text xml:space="preserve" text-anchor="start" x="437.2" y="-247.87" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">0</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="456.09,-234.67 456.09,-267.47 537.57,-267.47 537.57,-234.67 456.09,-234.67"/>
<text xml:space="preserve" text-anchor="start" x="459.09" y="-245.47" font-family="Arial" font-size="14.00" fill="#c9c9c9">Taps sign in</text>
</g>
<!-- gym&#45;&gt;gymlog -->
<g id="edge2" class="edge">
<title>gym&#45;&gt;gymlog</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M961.37,-271.81C1064.36,-288.84 1195.75,-300.33 1311.06,-278.67 1327.69,-275.55 1344.65,-271.26 1361.46,-266.23"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1362.04,-268.8 1368.43,-264.08 1360.49,-263.78 1362.04,-268.8"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1024.49,-293.51 1024.49,-333.11 1048.49,-333.11 1048.49,-293.51 1024.49,-293.51"/>
<text xml:space="preserve" text-anchor="start" x="1032.59" y="-310.11" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1051.49,-293.51 1051.49,-333.11 1308.06,-333.11 1308.06,-293.51 1051.49,-293.51"/>
<text xml:space="preserve" text-anchor="start" x="1084.07" y="-316.11" font-family="Arial" font-size="14.00" fill="#c9c9c9">Redirects to Entra as GymLog:</text>
<text xml:space="preserve" text-anchor="start" x="1054.49" y="-299.31" font-family="Arial" font-size="14.00" fill="#c9c9c9">authorization code with PKCE, no secret</text>
</g>
<!-- gym&#45;&gt;gymlog -->
<g id="edge3" class="edge">
<title>gym&#45;&gt;gymlog</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M971.81,-210.07C988.6,-208.56 1005.34,-207.19 1021.49,-206.07 1138.11,-198.01 1269.77,-193.9 1371.2,-191.82"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="971.61,-207.45 964.38,-210.75 972.09,-212.68 971.61,-207.45"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1036.14,-209.07 1036.14,-248.67 1060.14,-248.67 1060.14,-209.07 1036.14,-209.07"/>
<text xml:space="preserve" text-anchor="start" x="1044.25" y="-225.67" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1063.14,-209.07 1063.14,-248.67 1296.41,-248.67 1296.41,-209.07 1063.14,-209.07"/>
<text xml:space="preserve" text-anchor="start" x="1066.14" y="-231.67" font-family="Arial" font-size="14.00" fill="#c9c9c9">Code back to the bridge page, which</text>
<text xml:space="preserve" text-anchor="start" x="1107.01" y="-214.87" font-family="Arial" font-size="14.00" fill="#c9c9c9">broadcasts it to the app</text>
</g>
<!-- gym&#45;&gt;gymlog -->
<g id="edge4" class="edge">
<title>gym&#45;&gt;gymlog</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M961.21,-139.02C981.14,-131.71 1001.47,-125.47 1021.49,-121.07 1147.19,-93.45 1183.73,-102.38 1311.06,-121.07 1327.52,-123.49 1344.43,-126.83 1361.25,-130.75"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1360.29,-133.22 1368.2,-132.42 1361.51,-128.12 1360.29,-133.22"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1032.64,-124.07 1032.64,-163.67 1056.64,-163.67 1056.64,-124.07 1032.64,-124.07"/>
<text xml:space="preserve" text-anchor="start" x="1040.75" y="-140.67" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1059.64,-124.07 1059.64,-163.67 1299.91,-163.67 1299.91,-124.07 1059.64,-124.07"/>
<text xml:space="preserve" text-anchor="start" x="1062.64" y="-146.67" font-family="Arial" font-size="14.00" fill="#c9c9c9">Exchanges the code, then asks for an</text>
<text xml:space="preserve" text-anchor="start" x="1083.28" y="-129.87" font-family="Arial" font-size="14.00" fill="#c9c9c9">access token for the API scope</text>
</g>
<!-- gym&#45;&gt;gymlog -->
<g id="edge5" class="edge">
<title>gym&#45;&gt;gymlog</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M872.77,-129.65C913.86,-90.95 965.71,-51.35 1021.49,-31.07 1142.44,12.9 1188.24,7.36 1311.06,-31.07 1356.59,-45.32 1401.01,-72.17 1438.41,-99.79"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="871.02,-127.69 867.41,-134.77 874.65,-131.48 871.02,-127.69"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1033.05,-34.07 1033.05,-73.67 1057.05,-73.67 1057.05,-34.07 1033.05,-34.07"/>
<text xml:space="preserve" text-anchor="start" x="1041.16" y="-50.67" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1060.05,-34.07 1060.05,-73.67 1299.5,-73.67 1299.5,-34.07 1060.05,-34.07"/>
<text xml:space="preserve" text-anchor="start" x="1063.05" y="-56.67" font-family="Arial" font-size="14.00" fill="#c9c9c9">An access token: minted for GymLog,</text>
<text xml:space="preserve" text-anchor="start" x="1115.18" y="-39.87" font-family="Arial" font-size="14.00" fill="#c9c9c9">obtained by GymLog</text>
</g>
<!-- gym&#45;&gt;api -->
<g id="edge6" class="edge">
<title>gym&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M929.42,-326.37C958.87,-341.19 990.36,-354.34 1021.49,-362.67 1385.13,-460.05 1830.79,-415.45 2075.11,-377.78"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2075.15,-380.43 2082.16,-376.68 2074.34,-375.24 2075.15,-380.43"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1405.52,-424.44 1405.52,-464.04 1429.52,-464.04 1429.52,-424.44 1405.52,-424.44"/>
<text xml:space="preserve" text-anchor="start" x="1413.62" y="-441.04" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1432.52,-424.44 1432.52,-464.04 1675.86,-464.04 1675.86,-424.44 1432.52,-424.44"/>
<text xml:space="preserve" text-anchor="start" x="1435.52" y="-447.04" font-family="Arial" font-size="14.00" fill="#c9c9c9">Calls a gym route with the token in the</text>
<text xml:space="preserve" text-anchor="start" x="1489.59" y="-430.24" font-family="Arial" font-size="14.00" fill="#c9c9c9">Authorization header</text>
</g>
<!-- gymlog&#45;&gt;api -->
<g id="edge7" class="edge">
<title>gymlog&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1720.28,-228.38C1831.87,-252.57 1974.79,-283.54 2085.06,-307.44"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1721.11,-225.88 1713.23,-226.85 1720,-231.01 1721.11,-225.88"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1773.31,-293.11 1773.31,-349.51 1797.31,-349.51 1797.31,-293.11 1773.31,-293.11"/>
<text xml:space="preserve" text-anchor="start" x="1781.42" y="-318.11" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1800.31,-293.11 1800.31,-349.51 2021.9,-349.51 2021.9,-293.11 1800.31,-293.11"/>
<text xml:space="preserve" text-anchor="start" x="1803.72" y="-332.51" font-family="Arial" font-size="14.00" fill="#c9c9c9">Easy Auth validates it — signature,</text>
<text xml:space="preserve" text-anchor="start" x="1803.31" y="-315.71" font-family="Arial" font-size="14.00" fill="#c9c9c9">issuer tenant, audience, and which</text>
<text xml:space="preserve" text-anchor="start" x="1860.51" y="-298.91" font-family="Arial" font-size="14.00" fill="#c9c9c9">client obtained it</text>
</g>
<!-- api&#45;&gt;cosmos -->
<g id="edge8" class="edge">
<title>api&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2430.58,-344.67C2541.63,-344.67 2686.46,-344.67 2801.9,-344.67"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2801.74,-347.3 2809.24,-344.67 2801.74,-342.05 2801.74,-347.3"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2493.82,-347.67 2493.82,-404.07 2517.82,-404.07 2517.82,-347.67 2493.82,-347.67"/>
<text xml:space="preserve" text-anchor="start" x="2501.92" y="-372.67" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2520.82,-347.67 2520.82,-404.07 2750.18,-404.07 2750.18,-347.67 2520.82,-347.67"/>
<text xml:space="preserve" text-anchor="start" x="2524.99" y="-387.07" font-family="Arial" font-size="14.00" fill="#c9c9c9">The route reads the object id off the</text>
<text xml:space="preserve" text-anchor="start" x="2523.82" y="-370.27" font-family="Arial" font-size="14.00" fill="#c9c9c9">validated principal, and partitions on</text>
<text xml:space="preserve" text-anchor="start" x="2623.82" y="-353.47" font-family="Arial" font-size="14.00" fill="#c9c9c9">that</text>
</g>
</g>
</svg>
`;case`gymSet`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1320pt" height="1270pt"
 viewBox="0.00 0.00 1320.00 1270.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1254.91)">
<!-- user -->
<g id="node1" class="node">
<title>user</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="807.38,-1239.86 441.29,-1239.86 441.29,-1059.86 807.38,-1059.86 807.38,-1239.86"/>
<text xml:space="preserve" text-anchor="start" x="596.56" y="-1188.86" font-family="Arial" font-size="20.00" fill="#f8fafc">Visitor</text>
<text xml:space="preserve" text-anchor="start" x="469.67" y="-1165.86" font-family="Arial" font-size="15.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="551.38" y="-1147.86" font-family="Arial" font-size="15.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="461.35" y="-1129.86" font-family="Arial" font-size="15.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
<text xml:space="preserve" text-anchor="start" x="543.46" y="-1111.86" font-family="Arial" font-size="15.00" fill="#c2f0c2">can be renewed forever,</text>
<text xml:space="preserve" text-anchor="start" x="486.34" y="-1093.86" font-family="Arial" font-size="15.00" fill="#c2f0c2">but only a human can create the first one.</text>
</g>
<!-- gym -->
<g id="node2" class="node">
<title>gym</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="804.8,-901.06 443.88,-901.06 443.88,-711.4 804.8,-711.4 804.8,-901.06"/>
<text xml:space="preserve" text-anchor="start" x="492" y="-800.63" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="535.95" y="-855.03" font-family="Arial" font-size="20.00" fill="#f0f9ff">gym.nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="782.79" y="-800.63" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="535.95" y="-834.03" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="535.95" y="-812.43" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevgym — GymLog, the training</text>
<text xml:space="preserve" text-anchor="start" x="535.95" y="-794.43" font-family="Arial" font-size="15.00" fill="#b6ecf7">logger. Provisioned empty by</text>
<text xml:space="preserve" text-anchor="start" x="535.95" y="-776.43" font-family="Arial" font-size="15.00" fill="#b6ecf7">terraform;</text>
<text xml:space="preserve" text-anchor="start" x="535.95" y="-758.43" font-family="Arial" font-size="15.00" fill="#b6ecf7">the built React app is deployed</text>
<text xml:space="preserve" text-anchor="start" x="535.95" y="-740.43" font-family="Arial" font-size="15.00" fill="#b6ecf7">from the nygdevweb repository.</text>
</g>
<!-- api -->
<g id="node3" class="node">
<title>api</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="797.3,-545.8 451.38,-545.8 451.38,-365.8 797.3,-365.8 797.3,-545.8"/>
<text xml:space="preserve" text-anchor="start" x="499.5" y="-450.2" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="543.44" y="-504.6" font-family="Arial" font-size="20.00" fill="#eff6ff">API</text>
<text xml:space="preserve" text-anchor="start" x="775.29" y="-450.2" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="543.44" y="-483.6" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="543.44" y="-462" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;api. The training log</text>
<text xml:space="preserve" text-anchor="start" x="543.44" y="-444" font-family="Arial" font-size="15.00" fill="#bfdbfe">and nothing else since the split:</text>
<text xml:space="preserve" text-anchor="start" x="543.44" y="-426" font-family="Arial" font-size="15.00" fill="#bfdbfe">blocks, sessions, sets and saved</text>
<text xml:space="preserve" text-anchor="start" x="543.44" y="-408" font-family="Arial" font-size="15.00" fill="#bfdbfe">day templates, read and written a</text>
<text xml:space="preserve" text-anchor="start" x="543.44" y="-390" font-family="Arial" font-size="15.00" fill="#bfdbfe">tap</text>
</g>
<!-- cosmos -->
<g id="node4" class="node">
<title>cosmos</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M809.39,-182C809.39,-192.04 726.45,-200.2 624.34,-200.2 522.23,-200.2 439.29,-192.04 439.29,-182 439.29,-182 439.29,-18.2 439.29,-18.2 439.29,-8.16 522.23,0 624.34,0 726.45,0 809.39,-8.16 809.39,-18.2 809.39,-18.2 809.39,-182 809.39,-182"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M809.39,-182C809.39,-171.96 726.45,-163.8 624.34,-163.8 522.23,-163.8 439.29,-171.96 439.29,-182"/>
<text xml:space="preserve" text-anchor="start" x="487.41" y="-94.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="531.35" y="-148.9" font-family="Arial" font-size="20.00" fill="#eff6ff">Cosmos DB</text>
<text xml:space="preserve" text-anchor="start" x="787.38" y="-94.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="531.35" y="-127.9" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</text>
<text xml:space="preserve" text-anchor="start" x="531.35" y="-106.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev&#45;cosmos&#45;db / db, one account</text>
<text xml:space="preserve" text-anchor="start" x="531.35" y="-88.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">holding three containers that share</text>
<text xml:space="preserve" text-anchor="start" x="531.35" y="-70.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">nothing but the throughput. Local</text>
<text xml:space="preserve" text-anchor="start" x="531.35" y="-52.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">auth is off, so Entra role</text>
<text xml:space="preserve" text-anchor="start" x="531.35" y="-34.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">assignments</text>
</g>
<!-- user&#45;&gt;gym -->
<g id="edge1" class="edge">
<title>user&#45;&gt;gym</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M624.34,-1060C624.34,-1014.5 624.34,-958.84 624.34,-911.35"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="626.96,-911.56 624.34,-904.06 621.71,-911.56 626.96,-911.56"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="627.34,-964.06 627.34,-996.86 651.34,-996.86 651.34,-964.06 627.34,-964.06"/>
<text xml:space="preserve" text-anchor="start" x="635.45" y="-977.26" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">0</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="654.34,-964.06 654.34,-996.86 804.92,-996.86 804.92,-964.06 654.34,-964.06"/>
<text xml:space="preserve" text-anchor="start" x="657.34" y="-974.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">Taps &quot;Log same again&quot;</text>
</g>
<!-- gym&#45;&gt;api -->
<g id="edge2" class="edge">
<title>gym&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M444.22,-803.22C227.96,-794.25 -91.88,-756.2 25.68,-605.8 76.71,-540.52 284.74,-499.72 441.36,-477.65"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="441.53,-480.28 448.6,-476.65 440.81,-475.08 441.53,-480.28"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="28.68,-608.8 28.68,-648.4 52.68,-648.4 52.68,-608.8 28.68,-608.8"/>
<text xml:space="preserve" text-anchor="start" x="36.79" y="-625.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="55.68,-608.8 55.68,-648.4 294.34,-648.4 294.34,-608.8 55.68,-608.8"/>
<text xml:space="preserve" text-anchor="start" x="58.68" y="-631.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">POSTs the set, carrying the set count</text>
<text xml:space="preserve" text-anchor="start" x="61.77" y="-614.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">the page believes the exercise holds</text>
</g>
<!-- gym&#45;&gt;api -->
<g id="edge4" class="edge">
<title>gym&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M436.75,-704.33C408.18,-675.69 393.7,-642.26 412.62,-605.8 424.43,-583.06 441.47,-563.06 460.83,-545.71"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="434.87,-706.16 442.12,-709.42 438.49,-702.35 434.87,-706.16"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="415.62,-608.8 415.62,-648.4 439.62,-648.4 439.62,-608.8 415.62,-608.8"/>
<text xml:space="preserve" text-anchor="start" x="423.73" y="-625.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="442.62,-608.8 442.62,-648.4 674.34,-648.4 674.34,-608.8 442.62,-608.8"/>
<text xml:space="preserve" text-anchor="start" x="445.62" y="-631.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">200: recorded, and the row the page</text>
<text xml:space="preserve" text-anchor="start" x="475.22" y="-614.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">already drew is now stored</text>
</g>
<!-- gym&#45;&gt;api -->
<g id="edge5" class="edge">
<title>gym&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M685.15,-711.45C699.67,-678.61 708.82,-641.11 700.34,-605.8 696.22,-588.65 689.77,-571.24 682.34,-554.68"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="684.92,-554.01 679.39,-548.31 680.16,-556.22 684.92,-554.01"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="706.6,-608.8 706.6,-648.4 730.6,-648.4 730.6,-608.8 706.6,-608.8"/>
<text xml:space="preserve" text-anchor="start" x="714.7" y="-625.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="733.6,-608.8 733.6,-648.4 967.59,-648.4 967.59,-608.8 733.6,-608.8"/>
<text xml:space="preserve" text-anchor="start" x="736.6" y="-631.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">The reply never arrived, so the same</text>
<text xml:space="preserve" text-anchor="start" x="808.17" y="-614.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">request again</text>
</g>
<!-- gym&#45;&gt;api -->
<g id="edge7" class="edge">
<title>gym&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M814.83,-773.25C934.44,-744.14 1055.87,-692.21 997.34,-605.8 952.17,-539.12 871.83,-502.28 797.26,-481.92"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="814.38,-770.66 807.69,-774.95 815.6,-775.76 814.38,-770.66"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1015.51,-608.8 1015.51,-648.4 1039.51,-648.4 1039.51,-608.8 1015.51,-608.8"/>
<text xml:space="preserve" text-anchor="start" x="1023.62" y="-625.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1042.51,-608.8 1042.51,-648.4 1286.64,-648.4 1286.64,-608.8 1042.51,-608.8"/>
<text xml:space="preserve" text-anchor="start" x="1045.51" y="-631.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">200 alreadyRecorded: the first attempt</text>
<text xml:space="preserve" text-anchor="start" x="1048.23" y="-614.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">landed, and nothing was written twice</text>
</g>
<!-- api&#45;&gt;cosmos -->
<g id="edge3" class="edge">
<title>api&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M451.62,-368C430.69,-350.29 412.22,-329.63 399.42,-305.8 377.87,-265.69 396.36,-229.38 430.36,-198.85"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="432.04,-200.87 436.03,-194 428.63,-196.88 432.04,-200.87"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="402.42,-263.2 402.42,-302.8 426.42,-302.8 426.42,-263.2 402.42,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="410.52" y="-279.8" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="429.42,-263.2 429.42,-302.8 688.34,-302.8 688.34,-263.2 429.42,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="432.42" y="-285.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Patches the session — but only while the</text>
<text xml:space="preserve" text-anchor="start" x="479.9" y="-269" font-family="Arial" font-size="14.00" fill="#c9c9c9">stored count still matches</text>
</g>
<!-- api&#45;&gt;cosmos -->
<g id="edge6" class="edge">
<title>api&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M688.62,-365.81C699.23,-346.84 708.62,-326.32 714.34,-305.8 723.21,-273.94 716.22,-240.62 702.93,-210.34"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="705.43,-209.48 699.89,-203.78 700.66,-211.69 705.43,-209.48"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="721.3,-263.2 721.3,-302.8 745.3,-302.8 745.3,-263.2 721.3,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="729.41" y="-279.8" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="748.3,-263.2 748.3,-302.8 981.55,-302.8 981.55,-263.2 748.3,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="751.3" y="-285.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">The count no longer matches, so the</text>
<text xml:space="preserve" text-anchor="start" x="800.32" y="-269" font-family="Arial" font-size="14.00" fill="#c9c9c9">patch does not apply</text>
</g>
</g>
</svg>
`;case`index`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3430pt" height="2370pt"
 viewBox="0.00 0.00 3430.00 2370.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 2354.92)">
<!-- user -->
<g id="node1" class="node">
<title>user</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="366.09,-2019 0,-2019 0,-1839 366.09,-1839 366.09,-2019"/>
<text xml:space="preserve" text-anchor="start" x="155.26" y="-1968" font-family="Arial" font-size="20.00" fill="#f8fafc">Visitor</text>
<text xml:space="preserve" text-anchor="start" x="28.38" y="-1945" font-family="Arial" font-size="15.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="110.08" y="-1927" font-family="Arial" font-size="15.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-1909" font-family="Arial" font-size="15.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
<text xml:space="preserve" text-anchor="start" x="102.16" y="-1891" font-family="Arial" font-size="15.00" fill="#c2f0c2">can be renewed forever,</text>
<text xml:space="preserve" text-anchor="start" x="45.05" y="-1873" font-family="Arial" font-size="15.00" fill="#c2f0c2">but only a human can create the first one.</text>
</g>
<!-- web -->
<g id="node2" class="node">
<title>web</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1130.84,-2146 797.41,-2146 797.41,-1966 1130.84,-1966 1130.84,-2146"/>
<text xml:space="preserve" text-anchor="start" x="845.53" y="-2050.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="889.47" y="-2077.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="1108.83" y="-2050.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="889.47" y="-2056.8" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="889.47" y="-2035.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevapex. Links, and the live</text>
<text xml:space="preserve" text-anchor="start" x="889.47" y="-2017.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">status of the Foundry server.</text>
</g>
<!-- running -->
<g id="node3" class="node">
<title>running</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1138.76,-1855.83 789.49,-1855.83 789.49,-1666.17 1138.76,-1666.17 1138.76,-1855.83"/>
<text xml:space="preserve" text-anchor="start" x="837.61" y="-1755.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="881.55" y="-1809.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">run.nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="1116.75" y="-1755.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="881.55" y="-1788.8" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="881.55" y="-1767.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevrun — the running and</text>
<text xml:space="preserve" text-anchor="start" x="881.55" y="-1749.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">marathon dashboard. Provisioned</text>
<text xml:space="preserve" text-anchor="start" x="881.55" y="-1731.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">empty by</text>
<text xml:space="preserve" text-anchor="start" x="881.55" y="-1713.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">terraform; content deployed from</text>
<text xml:space="preserve" text-anchor="start" x="881.55" y="-1695.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">the nygdevweb repository.</text>
</g>
<!-- gym -->
<g id="node4" class="node">
<title>gym</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1144.58,-1555.83 783.67,-1555.83 783.67,-1366.17 1144.58,-1366.17 1144.58,-1555.83"/>
<text xml:space="preserve" text-anchor="start" x="831.79" y="-1455.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-1509.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">gym.nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="1122.57" y="-1455.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-1488.8" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-1467.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevgym — GymLog, the training</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-1449.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">logger. Provisioned empty by</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-1431.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">terraform;</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-1413.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">the built React app is deployed</text>
<text xml:space="preserve" text-anchor="start" x="875.73" y="-1395.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">from the nygdevweb repository.</text>
</g>
<!-- gymbro -->
<g id="node5" class="node">
<title>gymbro</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1151.68,-1255.83 776.57,-1255.83 776.57,-1066.17 1151.68,-1066.17 1151.68,-1255.83"/>
<text xml:space="preserve" text-anchor="start" x="824.68" y="-1155.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-1209.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">gymbro.nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="1129.67" y="-1155.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-1188.8" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-1167.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevgymbro — the desktop planner</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-1149.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">for the same training log. A Static</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-1131.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">Web App of its own rather than a</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-1113.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">path on the logger, because a</text>
<text xml:space="preserve" text-anchor="start" x="868.63" y="-1095.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">Static Web</text>
</g>
<!-- rpg -->
<g id="node6" class="node">
<title>rpg</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1907.57,-2146 1557.5,-2146 1557.5,-1966 1907.57,-1966 1907.57,-2146"/>
<text xml:space="preserve" text-anchor="start" x="1605.62" y="-2050.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-2104.8" font-family="Arial" font-size="20.00" fill="#eef2ff">RPG Server</text>
<text xml:space="preserve" text-anchor="start" x="1885.56" y="-2050.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-2083.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Azure Linux VM — Standard_B2s,</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-2062.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">rpg&#45;vm, behind the rpg&#45;pip public</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-2044.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">IP. Built by terraform and</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-2026.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">configured by cloud&#45;init; worlds</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-2008.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">and media live on a separate disk</text>
<text xml:space="preserve" text-anchor="start" x="1649.56" y="-1990.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">that survives the VM being rebuilt.</text>
</g>
<!-- integrations -->
<g id="node7" class="node">
<title>integrations</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="358.11,-591 7.98,-591 7.98,-411 358.11,-411 358.11,-591"/>
<text xml:space="preserve" text-anchor="start" x="56.1" y="-495.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="100.05" y="-549.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Integrations</text>
<text xml:space="preserve" text-anchor="start" x="336.1" y="-495.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="100.05" y="-528.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="100.05" y="-507.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;integrations.</text>
<text xml:space="preserve" text-anchor="start" x="100.05" y="-489.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Everything that feeds the estate</text>
<text xml:space="preserve" text-anchor="start" x="100.05" y="-471.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">from outside</text>
<text xml:space="preserve" text-anchor="start" x="100.05" y="-453.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">it, split off from the API so that</text>
<text xml:space="preserve" text-anchor="start" x="100.05" y="-435.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">app could have its gate turned on.</text>
</g>
<!-- keyvault -->
<g id="node8" class="node">
<title>keyvault</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2689.38,-471.9C2689.38,-481.94 2608.68,-490.1 2509.34,-490.1 2410,-490.1 2329.3,-481.94 2329.3,-471.9 2329.3,-471.9 2329.3,-308.1 2329.3,-308.1 2329.3,-298.06 2410,-289.9 2509.34,-289.9 2608.68,-289.9 2689.38,-298.06 2689.38,-308.1 2689.38,-308.1 2689.38,-471.9 2689.38,-471.9"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2689.38,-471.9C2689.38,-461.86 2608.68,-453.7 2509.34,-453.7 2410,-453.7 2329.3,-461.86 2329.3,-471.9"/>
<text xml:space="preserve" text-anchor="start" x="2377.42" y="-384.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2421.36" y="-438.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Key Vault</text>
<text xml:space="preserve" text-anchor="start" x="2667.37" y="-384.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2421.36" y="-417.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Key Vault — standard, RBAC</text>
<text xml:space="preserve" text-anchor="start" x="2421.36" y="-396.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev, in rg&#45;nygdev&#45;security.</text>
<text xml:space="preserve" text-anchor="start" x="2421.36" y="-378.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Holds whoop&#45;clientsecret, copied in</text>
<text xml:space="preserve" text-anchor="start" x="2421.36" y="-360.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">by</text>
<text xml:space="preserve" text-anchor="start" x="2421.36" y="-342.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">hand from the WHOOP developer</text>
<text xml:space="preserve" text-anchor="start" x="2421.36" y="-324.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">dashboard, and whoop&#45;token.</text>
</g>
<!-- whoop -->
<g id="node9" class="node">
<title>whoop</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2681.58,-180 2337.11,-180 2337.11,0 2681.58,0 2681.58,-180"/>
<text xml:space="preserve" text-anchor="start" x="2470.45" y="-138.8" font-family="Arial" font-size="20.00" fill="#f8fafc">WHOOP</text>
<text xml:space="preserve" text-anchor="start" x="2400.07" y="-117.8" font-family="Arial" font-size="13.00" fill="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</text>
<text xml:space="preserve" text-anchor="start" x="2358.84" y="-96.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">Wearable platform, read&#45;only to us and gated</text>
<text xml:space="preserve" text-anchor="start" x="2427.62" y="-78.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">by an authorization code</text>
<text xml:space="preserve" text-anchor="start" x="2357.16" y="-60.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">grant. A person consents once and that yields</text>
<text xml:space="preserve" text-anchor="start" x="2436.8" y="-42.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">a refresh token; every</text>
<text xml:space="preserve" text-anchor="start" x="2376.35" y="-24.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">refresh then rotates it, killing the old one</text>
</g>
<!-- cdn -->
<g id="node10" class="node">
<title>cdn</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2681.05,-1972.64C2681.05,-1981.67 2604.09,-1989 2509.34,-1989 2414.59,-1989 2337.63,-1981.67 2337.63,-1972.64 2337.63,-1972.64 2337.63,-1825.36 2337.63,-1825.36 2337.63,-1816.33 2414.59,-1809 2509.34,-1809 2604.09,-1809 2681.05,-1816.33 2681.05,-1825.36 2681.05,-1825.36 2681.05,-1972.64 2681.05,-1972.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2681.05,-1972.64C2681.05,-1963.61 2604.09,-1956.27 2509.34,-1956.27 2414.59,-1956.27 2337.63,-1963.61 2337.63,-1972.64"/>
<text xml:space="preserve" text-anchor="start" x="2385.75" y="-1893.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2429.69" y="-1920.8" font-family="Arial" font-size="20.00" fill="#eff6ff">CDN Storage</text>
<text xml:space="preserve" text-anchor="start" x="2659.04" y="-1893.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2429.69" y="-1899.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Blob Storage — nygdevcdn</text>
<text xml:space="preserve" text-anchor="start" x="2429.69" y="-1878.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">One public account serving three</text>
<text xml:space="preserve" text-anchor="start" x="2429.69" y="-1860.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">unrelated things</text>
</g>
<!-- cosmos -->
<g id="node11" class="node">
<title>cosmos</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2694.39,-823.9C2694.39,-833.94 2611.45,-842.1 2509.34,-842.1 2407.23,-842.1 2324.29,-833.94 2324.29,-823.9 2324.29,-823.9 2324.29,-660.1 2324.29,-660.1 2324.29,-650.06 2407.23,-641.9 2509.34,-641.9 2611.45,-641.9 2694.39,-650.06 2694.39,-660.1 2694.39,-660.1 2694.39,-823.9 2694.39,-823.9"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2694.39,-823.9C2694.39,-813.86 2611.45,-805.7 2509.34,-805.7 2407.23,-805.7 2324.29,-813.86 2324.29,-823.9"/>
<text xml:space="preserve" text-anchor="start" x="2372.41" y="-736.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2416.35" y="-790.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Cosmos DB</text>
<text xml:space="preserve" text-anchor="start" x="2672.38" y="-736.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2416.35" y="-769.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</text>
<text xml:space="preserve" text-anchor="start" x="2416.35" y="-748.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev&#45;cosmos&#45;db / db, one account</text>
<text xml:space="preserve" text-anchor="start" x="2416.35" y="-730.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">holding three containers that share</text>
<text xml:space="preserve" text-anchor="start" x="2416.35" y="-712.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">nothing but the throughput. Local</text>
<text xml:space="preserve" text-anchor="start" x="2416.35" y="-694.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">auth is off, so Entra role</text>
<text xml:space="preserve" text-anchor="start" x="2416.35" y="-676.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">assignments</text>
</g>
<!-- api -->
<g id="node12" class="node">
<title>api</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="1905.5,-1251 1559.58,-1251 1559.58,-1071 1905.5,-1071 1905.5,-1251"/>
<text xml:space="preserve" text-anchor="start" x="1607.69" y="-1155.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1651.64" y="-1209.8" font-family="Arial" font-size="20.00" fill="#eff6ff">API</text>
<text xml:space="preserve" text-anchor="start" x="1883.49" y="-1155.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1651.64" y="-1188.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="1651.64" y="-1167.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;api. The training log</text>
<text xml:space="preserve" text-anchor="start" x="1651.64" y="-1149.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">and nothing else since the split:</text>
<text xml:space="preserve" text-anchor="start" x="1651.64" y="-1131.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">blocks, sessions, sets and saved</text>
<text xml:space="preserve" text-anchor="start" x="1651.64" y="-1113.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">day templates, read and written a</text>
<text xml:space="preserve" text-anchor="start" x="1651.64" y="-1095.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">tap</text>
</g>
<!-- azadmin -->
<g id="node13" class="node">
<title>azadmin</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="3400.17,-1989 3054.26,-1989 3054.26,-1809 3400.17,-1809 3400.17,-1989"/>
<text xml:space="preserve" text-anchor="start" x="3102.38" y="-1893.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="3146.32" y="-1938.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Admin Automation</text>
<text xml:space="preserve" text-anchor="start" x="3378.16" y="-1893.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="3146.32" y="-1917.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">PowerShell 7.4 — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="3146.32" y="-1896.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;azadmin. Sets</text>
<text xml:space="preserve" text-anchor="start" x="3146.32" y="-1878.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Cache&#45;Control on Foundry media</text>
<text xml:space="preserve" text-anchor="start" x="3146.32" y="-1860.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">blobs, on demand and on</text>
<text xml:space="preserve" text-anchor="start" x="3146.32" y="-1842.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">blob&#45;created events.</text>
</g>
<!-- user&#45;&gt;web -->
<g id="edge1" class="edge">
<title>user&#45;&gt;web</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M365.72,-1958.62C492.79,-1979.33 661.58,-2006.84 787.33,-2027.34"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="786.64,-2029.89 794.46,-2028.51 787.48,-2024.71 786.64,-2029.89"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="494.01,-2011.3 494.01,-2034.1 648.64,-2034.1 648.64,-2011.3 494.01,-2011.3"/>
<text xml:space="preserve" text-anchor="start" x="497.01" y="-2017.1" font-family="Arial" font-size="14.00" fill="#c9c9c9">Visits https://nygard.dev</text>
</g>
<!-- user&#45;&gt;running -->
<g id="edge2" class="edge">
<title>user&#45;&gt;running</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M365.72,-1889.82C490.16,-1862.99 654.62,-1827.53 779.48,-1800.6"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="779.79,-1803.22 786.57,-1799.07 778.69,-1798.09 779.79,-1803.22"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="481.95,-1869.86 481.95,-1892.66 660.7,-1892.66 660.7,-1869.86 481.95,-1869.86"/>
<text xml:space="preserve" text-anchor="start" x="484.95" y="-1875.66" font-family="Arial" font-size="14.00" fill="#c9c9c9">Visits https://run.nygard.dev</text>
</g>
<!-- user&#45;&gt;gym -->
<g id="edge3" class="edge">
<title>user&#45;&gt;gym</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M328.54,-1839.08C365.17,-1816.46 404.51,-1792.33 441.09,-1770.2 557.89,-1699.54 690.22,-1621.18 792.42,-1561.02"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="793.54,-1563.41 798.67,-1557.35 790.88,-1558.89 793.54,-1563.41"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="441.09,-1770.2 441.09,-1793 701.57,-1793 701.57,-1770.2 441.09,-1770.2"/>
<text xml:space="preserve" text-anchor="start" x="444.09" y="-1776" font-family="Arial" font-size="14.00" fill="#c9c9c9">Logs a session at https://gym.nygard.dev</text>
</g>
<!-- user&#45;&gt;gymbro -->
<g id="edge4" class="edge">
<title>user&#45;&gt;gymbro</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M233.44,-1839.09C280.43,-1758.25 356.38,-1638.96 441.09,-1550.4 548.67,-1437.93 691.48,-1333.83 800.54,-1261.61"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="801.98,-1263.81 806.8,-1257.49 799.09,-1259.43 801.98,-1263.81"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="487.4,-1550.4 487.4,-1590 655.26,-1590 655.26,-1550.4 487.4,-1550.4"/>
<text xml:space="preserve" text-anchor="start" x="490.4" y="-1573" font-family="Arial" font-size="14.00" fill="#c9c9c9">Plans a block at</text>
<text xml:space="preserve" text-anchor="start" x="490.4" y="-1556.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">https://gymbro.nygard.dev</text>
</g>
<!-- user&#45;&gt;rpg -->
<g id="edge5" class="edge">
<title>user&#45;&gt;rpg</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M329.07,-2018.87C445.18,-2084.93 614.81,-2168.6 776.57,-2201 1043.03,-2254.37 1354.82,-2182.06 1547.77,-2121.81"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1548.47,-2124.34 1554.84,-2119.59 1546.9,-2119.33 1548.47,-2124.34"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="866.57,-2219.62 866.57,-2242.42 1061.67,-2242.42 1061.67,-2219.62 866.57,-2219.62"/>
<text xml:space="preserve" text-anchor="start" x="869.57" y="-2225.42" font-family="Arial" font-size="14.00" fill="#c9c9c9">Plays at https://rpg.nygard.dev</text>
</g>
<!-- web&#45;&gt;rpg -->
<g id="edge10" class="edge">
<title>web&#45;&gt;rpg</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1130.48,-2056C1253.23,-2056 1420.63,-2056 1547.6,-2056"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1547.3,-2058.63 1554.8,-2056 1547.3,-2053.38 1547.3,-2058.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1231.36,-2056 1231.36,-2095.6 1477.82,-2095.6 1477.82,-2056 1231.36,-2056"/>
<text xml:space="preserve" text-anchor="start" x="1234.36" y="-2078.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Polls the Foundry status from the page</text>
<text xml:space="preserve" text-anchor="start" x="1234.36" y="-2061.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">(GET /api/status)</text>
</g>
<!-- running&#45;&gt;cdn -->
<g id="edge11" class="edge">
<title>running&#45;&gt;cdn</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1138.4,-1776.5C1432.6,-1802.8 2026.95,-1855.95 2326.72,-1882.76"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2326.1,-1885.34 2333.8,-1883.39 2326.56,-1880.11 2326.1,-1885.34"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1615.53,-1843.72 1615.53,-1883.32 1849.55,-1883.32 1849.55,-1843.72 1615.53,-1843.72"/>
<text xml:space="preserve" text-anchor="start" x="1618.53" y="-1866.32" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches the built dashboard from the</text>
<text xml:space="preserve" text-anchor="start" x="1618.53" y="-1849.52" font-family="Arial" font-size="14.00" fill="#c9c9c9">page (GET data/marathonprep.json)</text>
</g>
<!-- gym&#45;&gt;api -->
<g id="edge12" class="edge">
<title>gym&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1144.33,-1390.85C1266.45,-1343.05 1427.59,-1279.97 1550.17,-1231.99"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1550.82,-1234.56 1556.85,-1229.38 1548.91,-1229.67 1550.82,-1234.56"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1234.07,-1355.4 1234.07,-1395 1475.11,-1395 1475.11,-1355.4 1234.07,-1355.4"/>
<text xml:space="preserve" text-anchor="start" x="1237.07" y="-1378" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes the training log, one</text>
<text xml:space="preserve" text-anchor="start" x="1237.07" y="-1361.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">tap at a time</text>
</g>
<!-- gymbro&#45;&gt;api -->
<g id="edge13" class="edge">
<title>gymbro&#45;&gt;api</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1151.63,-1161C1272.5,-1161 1429.2,-1161 1549.23,-1161"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1549.1,-1163.63 1556.6,-1161 1549.1,-1158.38 1549.1,-1163.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1237.59,-1161 1237.59,-1200.6 1471.59,-1200.6 1471.59,-1161 1237.59,-1161"/>
<text xml:space="preserve" text-anchor="start" x="1240.59" y="-1183.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes the same routes, a</text>
<text xml:space="preserve" text-anchor="start" x="1240.59" y="-1166.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">whole block at a time</text>
</g>
<!-- rpg&#45;&gt;cdn -->
<g id="edge14" class="edge">
<title>rpg&#45;&gt;cdn</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1907.42,-2020.77C2032.2,-1995.48 2199.96,-1961.49 2326.52,-1935.84"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2326.91,-1938.44 2333.74,-1934.38 2325.87,-1933.3 2326.91,-1938.44"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2022.66,-2005.22 2022.66,-2028.02 2209.2,-2028.02 2209.2,-2005.22 2022.66,-2005.22"/>
<text xml:space="preserve" text-anchor="start" x="2025.66" y="-2011.02" font-family="Arial" font-size="14.00" fill="#c9c9c9">Holds asset URLs pointing at</text>
</g>
<!-- integrations&#45;&gt;keyvault -->
<g id="edge6" class="edge">
<title>integrations&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M357.84,-488.6C564.74,-474.18 920.76,-450.44 1226.68,-435.4 1614.09,-416.35 2067.76,-402.21 2318.09,-395.11"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2317.94,-397.74 2325.36,-394.9 2317.79,-392.49 2317.94,-397.74"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1236.02,-435.4 1236.02,-475 1473.15,-475 1473.15,-435.4 1236.02,-435.4"/>
<text xml:space="preserve" text-anchor="start" x="1239.02" y="-458" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads whoop&#45;clientsecret; reads and</text>
<text xml:space="preserve" text-anchor="start" x="1239.02" y="-441.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">rewrites the rotating whoop&#45;token</text>
</g>
<!-- integrations&#45;&gt;whoop -->
<g id="edge7" class="edge">
<title>integrations&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M357.9,-457.34C385.65,-450.87 414.11,-444.53 441.09,-439 1134.21,-297.08 1966.61,-169.47 2327.16,-116.26"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2327.4,-118.88 2334.44,-115.19 2326.63,-113.68 2327.4,-118.88"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1226.68,-288.6 1226.68,-328.2 1482.5,-328.2 1482.5,-288.6 1226.68,-288.6"/>
<text xml:space="preserve" text-anchor="start" x="1229.68" y="-311.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">Refreshes the access token, then pages</text>
<text xml:space="preserve" text-anchor="start" x="1229.68" y="-294.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">cycles, sleep, workouts and recovery</text>
</g>
<!-- integrations&#45;&gt;cdn -->
<g id="edge8" class="edge">
<title>integrations&#45;&gt;cdn</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M320.37,-590.88C358.33,-613.16 400.36,-635.39 441.09,-652 1062.92,-905.58 1356.5,-632.21 1907.57,-1016 2199.39,-1219.23 2391.15,-1613.55 2468.99,-1798.57"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2466.46,-1799.33 2471.78,-1805.24 2471.31,-1797.31 2466.46,-1799.33"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1233.31,-818.32 1233.31,-857.92 1475.87,-857.92 1475.87,-818.32 1233.31,-818.32"/>
<text xml:space="preserve" text-anchor="start" x="1236.31" y="-840.92" font-family="Arial" font-size="14.00" fill="#c9c9c9">Publishes marathonprep.json (PUT, in</text>
<text xml:space="preserve" text-anchor="start" x="1236.31" y="-824.12" font-family="Arial" font-size="14.00" fill="#c9c9c9">place)</text>
</g>
<!-- integrations&#45;&gt;cosmos -->
<g id="edge9" class="edge">
<title>integrations&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M357.84,-538.03C385.6,-543.21 414.08,-548.09 441.09,-552 1125.38,-651.06 1945,-708.35 2312.84,-730.85"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2312.66,-733.46 2320.3,-731.3 2312.98,-728.22 2312.66,-733.46"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1341.09,-668.84 1341.09,-691.64 1368.09,-691.64 1368.09,-668.84 1341.09,-668.84"/>
<text xml:space="preserve" text-anchor="start" x="1344.09" y="-677.04" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- cdn&#45;&gt;user -->
<g id="edge16" class="edge">
<title>cdn&#45;&gt;user</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2374.83,-1986.1C2257.11,-2057.89 2078.22,-2155.1 1907.57,-2201 1421.28,-2331.8 1278.54,-2309.14 776.57,-2269 626.03,-2256.96 573.69,-2287.29 441.09,-2215 360.31,-2170.96 292.01,-2091.45 246.17,-2027.43"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="248.36,-2025.98 241.88,-2021.37 244.07,-2029.01 248.36,-2025.98"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1243.42,-2300.27 1243.42,-2339.87 1465.75,-2339.87 1465.75,-2300.27 1243.42,-2300.27"/>
<text xml:space="preserve" text-anchor="start" x="1246.42" y="-2322.87" font-family="Arial" font-size="14.00" fill="#c9c9c9">Serves media straight to the player</text>
<text xml:space="preserve" text-anchor="start" x="1246.42" y="-2306.07" font-family="Arial" font-size="14.00" fill="#c9c9c9">browser</text>
</g>
<!-- cdn&#45;&gt;azadmin -->
<g id="edge17" class="edge">
<title>cdn&#45;&gt;azadmin</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2681.81,-1899C2791.11,-1899 2932.61,-1899 3043.95,-1899"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3043.76,-1901.63 3051.26,-1899 3043.76,-1896.38 3043.76,-1901.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2769.39,-1899 2769.39,-1921.8 2979.26,-1921.8 2979.26,-1899 2769.39,-1899"/>
<text xml:space="preserve" text-anchor="start" x="2772.39" y="-1904.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Blob&#45;created events (Event Grid)</text>
</g>
<!-- api&#45;&gt;cosmos -->
<g id="edge15" class="edge">
<title>api&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1899.75,-1071.11C2024.92,-1003.43 2196.41,-910.68 2325.46,-840.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2326.67,-843.23 2332.01,-837.35 2324.17,-838.61 2326.67,-843.23"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1982.57,-1025.47 1982.57,-1081.87 2249.29,-1081.87 2249.29,-1025.47 1982.57,-1025.47"/>
<text xml:space="preserve" text-anchor="start" x="1985.57" y="-1064.87" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads and writes the blocks, sessions</text>
<text xml:space="preserve" text-anchor="start" x="1985.57" y="-1048.07" font-family="Arial" font-size="14.00" fill="#c9c9c9">and saved templates in db/gym, under the</text>
<text xml:space="preserve" text-anchor="start" x="1985.57" y="-1031.27" font-family="Arial" font-size="14.00" fill="#c9c9c9">object id off the token</text>
</g>
<!-- azadmin&#45;&gt;cdn -->
<g id="edge18" class="edge">
<title>azadmin&#45;&gt;cdn</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3054.5,-1859.82C3029.39,-1855.42 3003.74,-1851.64 2979.26,-1849.2 2886.45,-1839.93 2862.25,-1840.36 2769.39,-1849.2 2744.24,-1851.6 2717.89,-1855.27 2692.04,-1859.57"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2691.71,-1856.96 2684.76,-1860.8 2692.59,-1862.14 2691.71,-1856.96"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2781.83,-1849.2 2781.83,-1872 2966.82,-1872 2966.82,-1849.2 2781.83,-1849.2"/>
<text xml:space="preserve" text-anchor="start" x="2784.83" y="-1855" font-family="Arial" font-size="14.00" fill="#c9c9c9">Sets Cache&#45;Control on blobs</text>
</g>
</g>
</svg>
`;case`azureDeployment`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3827pt" height="5050pt"
 viewBox="0.00 0.00 3827.00 5050.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 5034.65)">
<g id="clust1" class="cluster">
<title>cluster_internet</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="132.34,-4530 132.34,-4831 2147.9,-4831 2147.9,-4530 132.34,-4530"/>
<text xml:space="preserve" text-anchor="start" x="140.34" y="-4818.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">INTERNET</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_azure</title>
<polygon fill="#353b43" stroke="#262b32" points="8,-8 8,-3935 3789.04,-3935 3789.04,-8 8,-8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-3922.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">AZURE SUBSCRIPTION</text>
</g>
<g id="clust3" class="cluster">
<title>cluster_rgconsumption</title>
<polygon fill="#1a468d" stroke="#1c3979" points="108.35,-924 108.35,-1836 2877.89,-1836 2877.89,-924 108.35,-924"/>
<text xml:space="preserve" text-anchor="start" x="116.35" y="-1823.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">RG&#45;NYGDEV&#45;CONSUMPTION</text>
</g>
<g id="clust4" class="cluster">
<title>cluster_aspps</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="1721.04,-1500 1721.04,-1765 2119.43,-1765 2119.43,-1500 1721.04,-1500"/>
<text xml:space="preserve" text-anchor="start" x="1729.04" y="-1752.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">ASP&#45;NYGDEV&#45;FLEX&#45;PS</text>
</g>
<g id="clust5" class="cluster">
<title>cluster_aspdotnet</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="1704.44,-1185 1704.44,-1450 2136.03,-1450 2136.03,-1185 1704.44,-1185"/>
<text xml:space="preserve" text-anchor="start" x="1712.44" y="-1437.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">ASP&#45;NYGDEV&#45;FLEX&#45;DOTNET</text>
</g>
<g id="clust6" class="cluster">
<title>cluster_rgdb</title>
<polygon fill="#5a3620" stroke="#462a17" points="101.27,-58 101.27,-359 2874.98,-359 2874.98,-58 101.27,-58"/>
<text xml:space="preserve" text-anchor="start" x="109.27" y="-346.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#f9b27c" fill-opacity="0.701961">RG&#45;NYGDEV&#45;DB</text>
</g>
<g id="clust7" class="cluster">
<title>cluster_rgweb</title>
<polygon fill="#51321f" stroke="#3f2717" points="60.43,-1886 60.43,-3428 3739.04,-3428 3739.04,-1886 60.43,-1886"/>
<text xml:space="preserve" text-anchor="start" x="68.43" y="-3415.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#f9b27c" fill-opacity="0.701961">RG&#45;NYGDEV&#45;WEB</text>
</g>
<g id="clust8" class="cluster">
<title>cluster_cdnstorage</title>
<polygon fill="#5a3620" stroke="#462a17" points="110.43,-1936 110.43,-2257 3689.04,-2257 3689.04,-1936 110.43,-1936"/>
<text xml:space="preserve" text-anchor="start" x="118.43" y="-2244.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#f9b27c" fill-opacity="0.701961">NYGDEVCDN</text>
</g>
<g id="clust9" class="cluster">
<title>cluster_rgnetwork</title>
<polygon fill="#232598" stroke="#292481" points="58,-3478 58,-3864 1343.4,-3864 1343.4,-3478 58,-3478"/>
<text xml:space="preserve" text-anchor="start" x="66" y="-3851.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RG&#45;NYGDEV&#45;NETWORK</text>
</g>
<g id="clust10" class="cluster">
<title>cluster_vnetmain</title>
<polygon fill="#2225aa" stroke="#2a2490" points="108,-3528 108,-3793 545.47,-3793 545.47,-3528 108,-3528"/>
<text xml:space="preserve" text-anchor="start" x="116" y="-3780.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">NYGDEV&#45;VNET</text>
</g>
<g id="clust11" class="cluster">
<title>cluster_rgvm</title>
<polygon fill="#232598" stroke="#292481" points="1662.67,-3478 1662.67,-3864 2888.2,-3864 2888.2,-3478 1662.67,-3478"/>
<text xml:space="preserve" text-anchor="start" x="1670.67" y="-3851.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RG&#45;NYGDEV&#45;VM</text>
</g>
<g id="clust12" class="cluster">
<title>cluster_rpgvm</title>
<polygon fill="#2225aa" stroke="#2a2490" points="1694.67,-3510 1694.67,-3811 2856.2,-3811 2856.2,-3510 1694.67,-3510"/>
<text xml:space="preserve" text-anchor="start" x="1702.67" y="-3798.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RPG&#45;VM</text>
</g>
<g id="clust13" class="cluster">
<title>cluster_rgdata</title>
<polygon fill="#2225aa" stroke="#2a2490" points="3241.56,-3528 3241.56,-3793 3668.96,-3793 3668.96,-3528 3241.56,-3528"/>
<text xml:space="preserve" text-anchor="start" x="3249.56" y="-3780.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RG&#45;NYGDEV&#45;DATA</text>
</g>
<g id="clust14" class="cluster">
<title>cluster_rgsecurity</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="1701.93,-409 1701.93,-674 2138.54,-674 2138.54,-409 1701.93,-409"/>
<text xml:space="preserve" text-anchor="start" x="1709.93" y="-661.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">RG&#45;NYGDEV&#45;SECURITY</text>
</g>
<!-- browser -->
<g id="node1" class="node">
<title>browser</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="471.14,-4715.5 182.34,-4715.5 182.34,-4580.5 471.14,-4580.5 471.14,-4715.5"/>
<text xml:space="preserve" text-anchor="start" x="273.83" y="-4665.2" font-family="Arial" font-size="16.00" fill="#f8fafc">Visitor browser</text>
<text xml:space="preserve" text-anchor="start" x="203" y="-4646" font-family="Arial" font-size="12.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="268.37" y="-4631.6" font-family="Arial" font-size="12.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="196.35" y="-4617.2" font-family="Arial" font-size="12.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
</g>
<!-- funcstorage -->
<g id="node2" class="node">
<title>funcstorage</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="495.12,-1459 158.35,-1459 158.35,-1279 495.12,-1279 495.12,-1459"/>
<text xml:space="preserve" text-anchor="start" x="206.47" y="-1363.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="250.42" y="-1390" font-family="Arial" font-size="20.00" fill="#eff6ff">nygdevfunc</text>
<text xml:space="preserve" text-anchor="start" x="473.11" y="-1363.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="250.42" y="-1367" font-family="Arial" font-size="15.00" fill="#bfdbfe">Deployment packages — the</text>
<text xml:space="preserve" text-anchor="start" x="250.42" y="-1349" font-family="Arial" font-size="15.00" fill="#bfdbfe">azadmin&#45;deploy, api&#45;deploy and</text>
<text xml:space="preserve" text-anchor="start" x="250.42" y="-1331" font-family="Arial" font-size="15.00" fill="#bfdbfe">integrations&#45;deploy containers</text>
</g>
<!-- azadminapp -->
<g id="node3" class="node">
<title>azadminapp</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="2087.43,-1712 1753.04,-1712 1753.04,-1532 2087.43,-1532 2087.43,-1712"/>
<text xml:space="preserve" text-anchor="start" x="1801.16" y="-1616.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1845.1" y="-1643.8" font-family="Arial" font-size="20.00" fill="#eff6ff">func&#45;nygdev&#45;azadmin</text>
<text xml:space="preserve" text-anchor="start" x="2065.42" y="-1616.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1845.1" y="-1622.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">PowerShell 7.4 — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="1845.1" y="-1601.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">512 MB instances, max 1.</text>
<text xml:space="preserve" text-anchor="start" x="1845.1" y="-1583.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">System&#45;assigned identity.</text>
</g>
<!-- sqlserver -->
<g id="node4" class="node">
<title>sqlserver</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="502.21,-288 151.27,-288 151.27,-108 502.21,-108 502.21,-288"/>
<text xml:space="preserve" text-anchor="start" x="199.39" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="243.33" y="-246.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">sql&#45;nygdev</text>
<text xml:space="preserve" text-anchor="start" x="480.2" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="243.33" y="-225.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Azure SQL — swedencentral</text>
<text xml:space="preserve" text-anchor="start" x="243.33" y="-204.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Sweden Central, because the free</text>
<text xml:space="preserve" text-anchor="start" x="243.33" y="-186.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Azure SQL offer is not available</text>
<text xml:space="preserve" text-anchor="start" x="243.33" y="-168.2" font-family="Arial" font-size="15.00" fill="#f9b27c">in Norway East. Entra&#45;only</text>
<text xml:space="preserve" text-anchor="start" x="243.33" y="-150.2" font-family="Arial" font-size="15.00" fill="#f9b27c">authentication and a firewall open</text>
<text xml:space="preserve" text-anchor="start" x="243.33" y="-132.2" font-family="Arial" font-size="15.00" fill="#f9b27c">to</text>
</g>
<!-- webcontainer -->
<g id="node5" class="node">
<title>webcontainer</title>
<path fill="#a35829" stroke="#7e451d" stroke-width="2" d="M493.04,-2159.64C493.04,-2168.67 418.5,-2176 326.74,-2176 234.97,-2176 160.43,-2168.67 160.43,-2159.64 160.43,-2159.64 160.43,-2012.36 160.43,-2012.36 160.43,-2003.33 234.97,-1996 326.74,-1996 418.5,-1996 493.04,-2003.33 493.04,-2012.36 493.04,-2012.36 493.04,-2159.64 493.04,-2159.64"/>
<path fill="none" stroke="#7e451d" stroke-width="2" d="M493.04,-2159.64C493.04,-2150.61 418.5,-2143.27 326.74,-2143.27 234.97,-2143.27 160.43,-2150.61 160.43,-2159.64"/>
<text xml:space="preserve" text-anchor="start" x="208.55" y="-2080.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="252.5" y="-2116.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">$web</text>
<text xml:space="preserve" text-anchor="start" x="471.03" y="-2080.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="252.5" y="-2095.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Azure Storage static website</text>
<text xml:space="preserve" text-anchor="start" x="252.5" y="-2074.2" font-family="Arial" font-size="15.00" fill="#f9b27c">This model, rendered by likec4</text>
<text xml:space="preserve" text-anchor="start" x="252.5" y="-2056.2" font-family="Arial" font-size="15.00" fill="#f9b27c">build and served at the account</text>
<text xml:space="preserve" text-anchor="start" x="252.5" y="-2038.2" font-family="Arial" font-size="15.00" fill="#f9b27c">primary web endpoint</text>
</g>
<!-- pip -->
<g id="node6" class="node">
<title>pip</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1293.4,-3793 927.47,-3793 927.47,-3613 1293.4,-3613 1293.4,-3793"/>
<text xml:space="preserve" text-anchor="start" x="975.59" y="-3697.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1019.53" y="-3715" font-family="Arial" font-size="20.00" fill="#eef2ff">rpg&#45;pip</text>
<text xml:space="preserve" text-anchor="start" x="1271.39" y="-3697.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1019.53" y="-3692" font-family="Arial" font-size="15.00" fill="#c7d2fe">Static public IP, DNS label &quot;rpg&quot; —</text>
<text xml:space="preserve" text-anchor="start" x="1019.53" y="-3674" font-family="Arial" font-size="15.00" fill="#c7d2fe">rpg.norwayeast.cloudapp.azure.com</text>
</g>
<!-- subnetrpg -->
<g id="node7" class="node">
<title>subnetrpg</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="513.47,-3740 140,-3740 140,-3560 513.47,-3560 513.47,-3740"/>
<text xml:space="preserve" text-anchor="start" x="188.12" y="-3644.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="232.06" y="-3680.8" font-family="Arial" font-size="20.00" fill="#eef2ff">rpg&#45;snet</text>
<text xml:space="preserve" text-anchor="start" x="491.46" y="-3644.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="232.06" y="-3659.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">10.0.0.0/29</text>
<text xml:space="preserve" text-anchor="start" x="232.06" y="-3638.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">NSG nygdev&#45;nsg: 80/443 from</text>
<text xml:space="preserve" text-anchor="start" x="232.06" y="-3620.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">anywhere; 22, 30000 and 30001 from</text>
<text xml:space="preserve" text-anchor="start" x="232.06" y="-3602.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">the home IP only</text>
</g>
<!-- caddyproc -->
<g id="node8" class="node">
<title>caddyproc</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="2095.79,-3740 1744.67,-3740 1744.67,-3560 2095.79,-3560 2095.79,-3740"/>
<text xml:space="preserve" text-anchor="start" x="1891.33" y="-3671.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Caddy</text>
<text xml:space="preserve" text-anchor="start" x="1901.45" y="-3650.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Caddy</text>
<text xml:space="preserve" text-anchor="start" x="1764.73" y="-3629.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Reverse proxy and TLS termination on 80/443,</text>
<text xml:space="preserve" text-anchor="start" x="1859.37" y="-3611.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">for rpg.nygard.dev</text>
</g>
<!-- foundryproc -->
<g id="node9" class="node">
<title>foundryproc</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="2806.2,-3740 2486.16,-3740 2486.16,-3560 2806.2,-3560 2806.2,-3740"/>
<text xml:space="preserve" text-anchor="start" x="2587.83" y="-3671.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Foundry VTT</text>
<text xml:space="preserve" text-anchor="start" x="2565.96" y="-3650.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Node.js, listening on :30000</text>
<text xml:space="preserve" text-anchor="start" x="2518.18" y="-3629.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Self&#45;hosted virtual tabletop, running as</text>
<text xml:space="preserve" text-anchor="start" x="2526.94" y="-3611.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">srv_foundry off the foundrydata disk</text>
</g>
<!-- apex -->
<g id="node10" class="node">
<title>apex</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1275.45,-3357 945.41,-3357 945.41,-3177 1275.45,-3177 1275.45,-3357"/>
<text xml:space="preserve" text-anchor="start" x="993.53" y="-3261.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1037.48" y="-3279.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">nygdevapex</text>
<text xml:space="preserve" text-anchor="start" x="1253.44" y="-3261.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1037.48" y="-3258.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="1037.48" y="-3237.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Serves https://nygard.dev</text>
</g>
<!-- rundash -->
<g id="node11" class="node">
<title>rundash</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1275.45,-3067 945.41,-3067 945.41,-2887 1275.45,-2887 1275.45,-3067"/>
<text xml:space="preserve" text-anchor="start" x="993.53" y="-2971.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1037.48" y="-2989.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">nygdevrun</text>
<text xml:space="preserve" text-anchor="start" x="1253.44" y="-2971.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1037.48" y="-2968.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="1037.48" y="-2947.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Serves https://run.nygard.dev</text>
</g>
<!-- gymsite -->
<g id="node12" class="node">
<title>gymsite</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1275.45,-2777 945.41,-2777 945.41,-2597 1275.45,-2597 1275.45,-2777"/>
<text xml:space="preserve" text-anchor="start" x="993.53" y="-2681.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1037.48" y="-2699.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">nygdevgym</text>
<text xml:space="preserve" text-anchor="start" x="1253.44" y="-2681.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1037.48" y="-2678.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="1037.48" y="-2657.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Serves https://gym.nygard.dev</text>
</g>
<!-- gymbrosite -->
<g id="node13" class="node">
<title>gymbrosite</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1284.63,-2487 936.23,-2487 936.23,-2307 1284.63,-2307 1284.63,-2487"/>
<text xml:space="preserve" text-anchor="start" x="984.35" y="-2391.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1028.3" y="-2409.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">nygdevgymbro</text>
<text xml:space="preserve" text-anchor="start" x="1262.63" y="-2391.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1028.3" y="-2388.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="1028.3" y="-2367.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Serves https://gymbro.nygard.dev</text>
</g>
<!-- foundrydata -->
<g id="node14" class="node">
<title>foundrydata</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="3636.96,-3740 3273.56,-3740 3273.56,-3560 3636.96,-3560 3636.96,-3740"/>
<text xml:space="preserve" text-anchor="start" x="3321.68" y="-3644.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="3365.62" y="-3698.8" font-family="Arial" font-size="20.00" fill="#eef2ff">foundrydata</text>
<text xml:space="preserve" text-anchor="start" x="3614.95" y="-3644.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="3365.62" y="-3677.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Azure Managed Disk, attached at LUN</text>
<text xml:space="preserve" text-anchor="start" x="3365.62" y="-3656.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Worlds, modules, media, the</text>
<text xml:space="preserve" text-anchor="start" x="3365.62" y="-3638.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Caddyfile and the Foundry install.</text>
<text xml:space="preserve" text-anchor="start" x="3365.62" y="-3620.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Referenced by terraform as a data</text>
<text xml:space="preserve" text-anchor="start" x="3365.62" y="-3602.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">source and attached, never</text>
<text xml:space="preserve" text-anchor="start" x="3365.62" y="-3584.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">created — which is what lets the VM</text>
</g>
<!-- aspintegrations -->
<g id="node15" class="node">
<title>aspintegrations</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="1298.12,-1174 922.75,-1174 922.75,-994 1298.12,-994 1298.12,-1174"/>
<text xml:space="preserve" text-anchor="start" x="970.87" y="-1078.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1014.81" y="-1132.8" font-family="Arial" font-size="20.00" fill="#eff6ff">asp&#45;nygdev&#45;flex&#45;integrations</text>
<text xml:space="preserve" text-anchor="start" x="1276.11" y="-1078.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1014.81" y="-1111.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">FC1 / Linux</text>
<text xml:space="preserve" text-anchor="start" x="1014.81" y="-1090.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">512 MB instances, max 1. Runs as</text>
<text xml:space="preserve" text-anchor="start" x="1014.81" y="-1072.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">id&#45;nygdev&#45;integrations. No CORS</text>
<text xml:space="preserve" text-anchor="start" x="1014.81" y="-1054.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">list and no Easy Auth: nothing that</text>
<text xml:space="preserve" text-anchor="start" x="1014.81" y="-1036.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">calls it is a browser holding</text>
<text xml:space="preserve" text-anchor="start" x="1014.81" y="-1018.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">a token — the WHOOP callback is a</text>
</g>
<!-- apiapp -->
<g id="node16" class="node">
<title>apiapp</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="2104.03,-1397 1736.44,-1397 1736.44,-1217 2104.03,-1217 2104.03,-1397"/>
<text xml:space="preserve" text-anchor="start" x="1784.56" y="-1301.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1828.51" y="-1355.8" font-family="Arial" font-size="20.00" fill="#eff6ff">func&#45;nygdev&#45;api</text>
<text xml:space="preserve" text-anchor="start" x="2082.02" y="-1301.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1828.51" y="-1334.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="1828.51" y="-1313.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">512 MB instances, max 1. Runs as</text>
<text xml:space="preserve" text-anchor="start" x="1828.51" y="-1295.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">id&#45;nygdev&#45;api. CORS allows gym</text>
<text xml:space="preserve" text-anchor="start" x="1828.51" y="-1277.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">and gymbro, each under its custom</text>
<text xml:space="preserve" text-anchor="start" x="1828.51" y="-1259.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">domain and its default hostname.</text>
<text xml:space="preserve" text-anchor="start" x="1828.51" y="-1241.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Easy Auth enforces GymLog tokens:</text>
</g>
<!-- whoopapi -->
<g id="node17" class="node">
<title>whoopapi</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2097.9,-4760 1742.57,-4760 1742.57,-4580 2097.9,-4580 2097.9,-4760"/>
<text xml:space="preserve" text-anchor="start" x="1830.18" y="-4691.8" font-family="Arial" font-size="20.00" fill="#f8fafc">api.prod.whoop.com</text>
<text xml:space="preserve" text-anchor="start" x="1810.96" y="-4670.8" font-family="Arial" font-size="13.00" fill="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</text>
<text xml:space="preserve" text-anchor="start" x="1762.62" y="-4649.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">The OAuth token endpoint and the v2 data API,</text>
<text xml:space="preserve" text-anchor="start" x="1824.76" y="-4631.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">both outside the subscription</text>
</g>
<!-- appinsights -->
<g id="node18" class="node">
<title>appinsights</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="2827.89,-1397 2464.47,-1397 2464.47,-1217 2827.89,-1217 2827.89,-1397"/>
<text xml:space="preserve" text-anchor="start" x="2512.59" y="-1301.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2556.53" y="-1319" font-family="Arial" font-size="20.00" fill="#eff6ff">appi&#45;nygdev&#45;consumption</text>
<text xml:space="preserve" text-anchor="start" x="2805.88" y="-1301.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2556.53" y="-1296" font-family="Arial" font-size="15.00" fill="#bfdbfe">Application Insights, backed by the</text>
<text xml:space="preserve" text-anchor="start" x="2556.53" y="-1278" font-family="Arial" font-size="15.00" fill="#bfdbfe">log&#45;nygdev&#45;consumption workspace</text>
</g>
<!-- datacontainer -->
<g id="node19" class="node">
<title>datacontainer</title>
<path fill="#a35829" stroke="#7e451d" stroke-width="2" d="M2093.62,-2167.9C2093.62,-2177.94 2015.91,-2186.1 1920.23,-2186.1 1824.56,-2186.1 1746.85,-2177.94 1746.85,-2167.9 1746.85,-2167.9 1746.85,-2004.1 1746.85,-2004.1 1746.85,-1994.06 1824.56,-1985.9 1920.23,-1985.9 2015.91,-1985.9 2093.62,-1994.06 2093.62,-2004.1 2093.62,-2004.1 2093.62,-2167.9 2093.62,-2167.9"/>
<path fill="none" stroke="#7e451d" stroke-width="2" d="M2093.62,-2167.9C2093.62,-2157.86 2015.91,-2149.7 1920.23,-2149.7 1824.56,-2149.7 1746.85,-2157.86 1746.85,-2167.9"/>
<text xml:space="preserve" text-anchor="start" x="1794.97" y="-2080.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1838.91" y="-2134.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">data</text>
<text xml:space="preserve" text-anchor="start" x="2071.61" y="-2080.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1838.91" y="-2113.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Anonymous blob read; the container</text>
<text xml:space="preserve" text-anchor="start" x="1838.91" y="-2092.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Three files, published by two</text>
<text xml:space="preserve" text-anchor="start" x="1838.91" y="-2074.2" font-family="Arial" font-size="15.00" fill="#f9b27c">different things.</text>
<text xml:space="preserve" text-anchor="start" x="1838.91" y="-2056.2" font-family="Arial" font-size="15.00" fill="#f9b27c">marathonprep.json is the built</text>
<text xml:space="preserve" text-anchor="start" x="1838.91" y="-2038.2" font-family="Arial" font-size="15.00" fill="#f9b27c">running dashboard, written by the</text>
<text xml:space="preserve" text-anchor="start" x="1838.91" y="-2020.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Integrations app and rewritten in</text>
</g>
<!-- mediacontainer -->
<g id="node20" class="node">
<title>mediacontainer</title>
<path fill="#a35829" stroke="#7e451d" stroke-width="2" d="M3639.04,-2159.64C3639.04,-2168.67 3556.67,-2176 3455.26,-2176 3353.85,-2176 3271.47,-2168.67 3271.47,-2159.64 3271.47,-2159.64 3271.47,-2012.36 3271.47,-2012.36 3271.47,-2003.33 3353.85,-1996 3455.26,-1996 3556.67,-1996 3639.04,-2003.33 3639.04,-2012.36 3639.04,-2012.36 3639.04,-2159.64 3639.04,-2159.64"/>
<path fill="none" stroke="#7e451d" stroke-width="2" d="M3639.04,-2159.64C3639.04,-2150.61 3556.67,-2143.27 3455.26,-2143.27 3353.85,-2143.27 3271.47,-2150.61 3271.47,-2159.64"/>
<text xml:space="preserve" text-anchor="start" x="3319.59" y="-2080.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="3363.54" y="-2107.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">foundry</text>
<text xml:space="preserve" text-anchor="start" x="3617.03" y="-2080.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="3363.54" y="-2086.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Storage Container</text>
<text xml:space="preserve" text-anchor="start" x="3363.54" y="-2065.2" font-family="Arial" font-size="15.00" fill="#f9b27c">Foundry VTT media, fetched straight</text>
<text xml:space="preserve" text-anchor="start" x="3363.54" y="-2047.2" font-family="Arial" font-size="15.00" fill="#f9b27c">by player browsers</text>
</g>
<!-- kv -->
<g id="node21" class="node">
<title>kv</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="2106.54,-621 1733.93,-621 1733.93,-441 2106.54,-441 2106.54,-621"/>
<text xml:space="preserve" text-anchor="start" x="1782.05" y="-525.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1825.99" y="-561" font-family="Arial" font-size="20.00" fill="#eff6ff">nygdev</text>
<text xml:space="preserve" text-anchor="start" x="2084.53" y="-525.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1825.99" y="-538" font-family="Arial" font-size="15.00" fill="#bfdbfe">RBAC data plane. Holds HomeIP,</text>
<text xml:space="preserve" text-anchor="start" x="1825.99" y="-520" font-family="Arial" font-size="15.00" fill="#bfdbfe">whoop&#45;clientsecret and whoop&#45;token,</text>
<text xml:space="preserve" text-anchor="start" x="1825.99" y="-502" font-family="Arial" font-size="15.00" fill="#bfdbfe">alongside the nygdev&#45;ed25519 SSH</text>
<text xml:space="preserve" text-anchor="start" x="1825.99" y="-484" font-family="Arial" font-size="15.00" fill="#bfdbfe">public key resource.</text>
</g>
<!-- cosmosdb -->
<g id="node22" class="node">
<title>cosmosdb</title>
<path fill="#a35829" stroke="#7e451d" stroke-width="2" d="M2824.98,-271.64C2824.98,-280.67 2744.84,-288 2646.18,-288 2547.52,-288 2467.38,-280.67 2467.38,-271.64 2467.38,-271.64 2467.38,-124.36 2467.38,-124.36 2467.38,-115.33 2547.52,-108 2646.18,-108 2744.84,-108 2824.98,-115.33 2824.98,-124.36 2824.98,-124.36 2824.98,-271.64 2824.98,-271.64"/>
<path fill="none" stroke="#7e451d" stroke-width="2" d="M2824.98,-271.64C2824.98,-262.61 2744.84,-255.27 2646.18,-255.27 2547.52,-255.27 2467.38,-262.61 2467.38,-271.64"/>
<text xml:space="preserve" text-anchor="start" x="2515.5" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="2559.44" y="-228.8" font-family="Arial" font-size="20.00" fill="#ffe0c2">nygdev&#45;cosmos&#45;db</text>
<text xml:space="preserve" text-anchor="start" x="2802.97" y="-192.4" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="2559.44" y="-207.8" font-family="Arial" font-size="13.00" fill="#f9b27c">Azure Cosmos DB (NoSQL) — free tier</text>
<text xml:space="preserve" text-anchor="start" x="2559.44" y="-186.2" font-family="Arial" font-size="15.00" fill="#f9b27c">GlobalDocumentDB, free tier, local</text>
<text xml:space="preserve" text-anchor="start" x="2559.44" y="-168.2" font-family="Arial" font-size="15.00" fill="#f9b27c">auth disabled, Session consistency</text>
<text xml:space="preserve" text-anchor="start" x="2559.44" y="-150.2" font-family="Arial" font-size="15.00" fill="#f9b27c">— db / primary, gym and gps</text>
</g>
<!-- browser&#45;&gt;pip -->
<g id="edge21" class="edge">
<title>browser&#45;&gt;pip</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M383.33,-4580.8C519.39,-4416.31 869.62,-3992.91 1028.68,-3800.62"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1030.5,-3802.54 1033.26,-3795.09 1026.46,-3799.19 1030.5,-3802.54"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="635.74,-4287.93 635.74,-4310.73 800.48,-4310.73 800.48,-4287.93 635.74,-4287.93"/>
<text xml:space="preserve" text-anchor="start" x="638.74" y="-4293.73" font-family="Arial" font-size="14.00" fill="#c9c9c9">HTTPS to rpg.nygard.dev</text>
</g>
<!-- browser&#45;&gt;apex -->
<g id="edge8" class="edge">
<title>browser&#45;&gt;apex</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M365.7,-4580.92C492.75,-4356.47 903.45,-3630.9 1053.7,-3365.45"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1055.82,-3367.04 1057.23,-3359.22 1051.25,-3364.46 1055.82,-3367.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="704.61,-4121.81 704.61,-4144.61 731.61,-4144.61 731.61,-4121.81 704.61,-4121.81"/>
<text xml:space="preserve" text-anchor="start" x="707.61" y="-4130.01" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- browser&#45;&gt;rundash -->
<g id="edge9" class="edge">
<title>browser&#45;&gt;rundash</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M470.86,-4598.22C586.63,-4550.42 744.43,-4466.73 832.75,-4341 977.92,-4134.34 1070.49,-3355.69 1099.57,-3076.99"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1102.15,-3077.63 1100.31,-3069.9 1096.92,-3077.08 1102.15,-3077.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="704.61,-4526.8 704.61,-4549.6 731.61,-4549.6 731.61,-4526.8 704.61,-4526.8"/>
<text xml:space="preserve" text-anchor="start" x="707.61" y="-4535" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- browser&#45;&gt;gymsite -->
<g id="edge10" class="edge">
<title>browser&#45;&gt;gymsite</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M445.28,-4580.55C564.74,-4505.09 744.42,-4371.1 832.75,-4203 989.32,-3905.02 862.69,-3782.21 922.75,-3451 966.45,-3210 1040.57,-2931.63 1081.02,-2786.59"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1083.45,-2787.65 1082.94,-2779.72 1078.39,-2786.23 1083.45,-2787.65"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="704.61,-4462.99 704.61,-4485.79 731.61,-4485.79 731.61,-4462.99 704.61,-4462.99"/>
<text xml:space="preserve" text-anchor="start" x="707.61" y="-4471.19" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- browser&#45;&gt;gymbrosite -->
<g id="edge11" class="edge">
<title>browser&#45;&gt;gymbrosite</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M412.21,-4580.89C529.68,-4482.04 738.55,-4285.05 832.75,-4065 998.44,-3677.96 850.03,-3536.69 922.75,-3122 962.48,-2895.4 1036.52,-2635.56 1078.42,-2496.77"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1080.85,-2497.83 1080.51,-2489.89 1075.82,-2496.31 1080.85,-2497.83"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="704.61,-4391.68 704.61,-4414.48 731.61,-4414.48 731.61,-4391.68 704.61,-4391.68"/>
<text xml:space="preserve" text-anchor="start" x="707.61" y="-4399.88" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- browser&#45;&gt;aspintegrations -->
<g id="edge1" class="edge">
<title>browser&#45;&gt;aspintegrations</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M338.23,-4580.66C361.98,-4450.2 431.75,-4161.4 603.47,-3996.4 682,-3920.95 768.85,-3998.17 832.75,-3910 966.61,-3725.3 890.89,-2084.87 922.75,-1859 957.49,-1612.68 1035.48,-1330.19 1078.86,-1183.76"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1081.31,-1184.72 1080.93,-1176.78 1076.28,-1183.23 1081.31,-1184.72"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="603.47,-3996.4 603.47,-4036 832.75,-4036 832.75,-3996.4 603.47,-3996.4"/>
<text xml:space="preserve" text-anchor="start" x="606.47" y="-4019" font-family="Arial" font-size="14.00" fill="#c9c9c9">Grants WHOOP access, once (GET</text>
<text xml:space="preserve" text-anchor="start" x="606.47" y="-4002.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">/api/whoop/authorize)</text>
</g>
<!-- azadminapp&#45;&gt;appinsights -->
<g id="edge5" class="edge">
<title>azadminapp&#45;&gt;appinsights</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2087.29,-1567.98C2174.12,-1538.04 2281.42,-1498.35 2374.47,-1456 2410.14,-1439.76 2447.5,-1420.66 2482.68,-1401.65"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2483.58,-1404.15 2488.91,-1398.26 2481.07,-1399.53 2483.58,-1404.15"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2251.39,-1526.45 2251.39,-1549.25 2319.62,-1549.25 2319.62,-1526.45 2251.39,-1526.45"/>
<text xml:space="preserve" text-anchor="start" x="2254.39" y="-1532.25" font-family="Arial" font-size="14.00" fill="#c9c9c9">Telemetry</text>
</g>
<!-- azadminapp&#45;&gt;mediacontainer -->
<g id="edge15" class="edge">
<title>azadminapp&#45;&gt;mediacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2087.16,-1578.28C2110.6,-1565.55 2132.06,-1549.14 2147.9,-1528 2207.69,-1448.22 2124.22,-1150.62 2196.54,-1082 2210.9,-1068.37 2354.72,-1073.41 2374.47,-1072 2602.24,-1055.73 2691.46,-948.28 2888.2,-1064.2 3234.98,-1268.53 3384.29,-1770.21 3433.89,-1985.36"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3431.27,-1985.7 3435.5,-1992.43 3436.39,-1984.53 3431.27,-1985.7"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2553.69,-1064.2 2553.69,-1087 2738.67,-1087 2738.67,-1064.2 2553.69,-1064.2"/>
<text xml:space="preserve" text-anchor="start" x="2556.69" y="-1070" font-family="Arial" font-size="14.00" fill="#c9c9c9">Sets Cache&#45;Control on blobs</text>
</g>
<!-- pip&#45;&gt;caddyproc -->
<g id="edge22" class="edge">
<title>pip&#45;&gt;caddyproc</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1293.22,-3691.07C1424.95,-3682.43 1602.41,-3670.79 1734.76,-3662.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1734.67,-3664.74 1741.99,-3661.63 1734.33,-3659.5 1734.67,-3664.74"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1407.19,-3684.34 1407.19,-3707.14 1624.86,-3707.14 1624.86,-3684.34 1407.19,-3684.34"/>
<text xml:space="preserve" text-anchor="start" x="1410.19" y="-3690.14" font-family="Arial" font-size="14.00" fill="#c9c9c9">Forwards 80/443 through rpg&#45;snet</text>
</g>
<!-- caddyproc&#45;&gt;foundryproc -->
<g id="edge23" class="edge">
<title>caddyproc&#45;&gt;foundryproc</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2095.56,-3650C2211,-3650 2361.64,-3650 2476.01,-3650"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2475.74,-3652.63 2483.24,-3650 2475.74,-3647.38 2475.74,-3652.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2200.79,-3650 2200.79,-3672.8 2370.22,-3672.8 2370.22,-3650 2200.79,-3650"/>
<text xml:space="preserve" text-anchor="start" x="2203.79" y="-3655.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reverse proxies to :30000</text>
</g>
<!-- foundryproc&#45;&gt;foundrydata -->
<g id="edge25" class="edge">
<title>foundryproc&#45;&gt;foundrydata</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2806.15,-3650C2937.42,-3650 3124.12,-3650 3263.45,-3650"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3263.29,-3652.63 3270.79,-3650 3263.29,-3647.38 3263.29,-3652.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2917.89,-3650 2917.89,-3689.6 3181.47,-3689.6 3181.47,-3650 2917.89,-3650"/>
<text xml:space="preserve" text-anchor="start" x="2920.89" y="-3672.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Stores worlds, modules and media on the</text>
<text xml:space="preserve" text-anchor="start" x="2920.89" y="-3655.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">attached disk</text>
</g>
<!-- foundryproc&#45;&gt;mediacontainer -->
<g id="edge24" class="edge">
<title>foundryproc&#45;&gt;mediacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2806.05,-3609.78C2836.13,-3596.5 2865.3,-3578.99 2888.2,-3556 3285.46,-3157.03 3409.86,-2449.06 3443.34,-2187.12"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="3445.92,-2187.63 3444.26,-2179.86 3440.71,-2186.97 3445.92,-2187.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2956.41,-3494.27 2956.41,-3517.07 3142.95,-3517.07 3142.95,-3494.27 2956.41,-3494.27"/>
<text xml:space="preserve" text-anchor="start" x="2959.41" y="-3500.07" font-family="Arial" font-size="14.00" fill="#c9c9c9">Holds asset URLs pointing at</text>
</g>
<!-- rundash&#45;&gt;datacontainer -->
<g id="edge16" class="edge">
<title>rundash&#45;&gt;datacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1275.41,-2939.9C1391.92,-2905.88 1544.72,-2844.63 1643.93,-2741 1792.32,-2586.01 1866.16,-2339.23 1898.25,-2196.96"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1900.76,-2197.75 1899.83,-2189.85 1895.64,-2196.61 1900.76,-2197.75"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1399.01,-2899.28 1399.01,-2938.88 1633.03,-2938.88 1633.03,-2899.28 1399.01,-2899.28"/>
<text xml:space="preserve" text-anchor="start" x="1402.01" y="-2921.88" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches the built dashboard from the</text>
<text xml:space="preserve" text-anchor="start" x="1402.01" y="-2905.08" font-family="Arial" font-size="14.00" fill="#c9c9c9">page (GET data/marathonprep.json)</text>
</g>
<!-- gymsite&#45;&gt;apiapp -->
<g id="edge12" class="edge">
<title>gymsite&#45;&gt;apiapp</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1275.24,-2644.15C1300.92,-2631.27 1325.01,-2614.58 1343.4,-2593 1401.01,-2525.39 1358.55,-2481.97 1388.12,-2398.2 1522.75,-2016.77 1754.15,-1593.75 1861.46,-1406.03"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1863.68,-1407.44 1865.13,-1399.63 1859.12,-1404.83 1863.68,-1407.44"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1502.53,-2398.2 1502.53,-2421 1529.52,-2421 1529.52,-2398.2 1502.53,-2398.2"/>
<text xml:space="preserve" text-anchor="start" x="1505.53" y="-2406.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- gymsite&#45;&gt;datacontainer -->
<g id="edge17" class="edge">
<title>gymsite&#45;&gt;datacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1275.4,-2638.61C1387.51,-2599.81 1534.96,-2537.04 1643.93,-2448 1730.65,-2377.14 1805.78,-2273.68 1855.55,-2195.5"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1857.48,-2197.35 1859.27,-2189.61 1853.04,-2194.55 1857.48,-2197.35"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1388.12,-2591.23 1388.12,-2647.63 1643.93,-2647.63 1643.93,-2591.23 1388.12,-2591.23"/>
<text xml:space="preserve" text-anchor="start" x="1391.12" y="-2630.63" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches the exercise library and the</text>
<text xml:space="preserve" text-anchor="start" x="1391.12" y="-2613.83" font-family="Arial" font-size="14.00" fill="#c9c9c9">built&#45;in day templates, once, and caches</text>
<text xml:space="preserve" text-anchor="start" x="1391.12" y="-2597.03" font-family="Arial" font-size="14.00" fill="#c9c9c9">them</text>
</g>
<!-- gymbrosite&#45;&gt;apiapp -->
<g id="edge13" class="edge">
<title>gymbrosite&#45;&gt;apiapp</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1284.63,-2348.02C1306.55,-2336.07 1327.01,-2321.28 1343.4,-2303 1392.06,-2248.73 1358.36,-2211.75 1388.12,-2145.2 1516.1,-1858.98 1730.54,-1556.09 1843.83,-1404.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1845.59,-1406.91 1847.99,-1399.34 1841.39,-1403.76 1845.59,-1406.91"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1502.53,-2145.2 1502.53,-2168 1529.52,-2168 1529.52,-2145.2 1502.53,-2145.2"/>
<text xml:space="preserve" text-anchor="start" x="1505.53" y="-2153.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- gymbrosite&#45;&gt;datacontainer -->
<g id="edge18" class="edge">
<title>gymbrosite&#45;&gt;datacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1284.23,-2330.47C1417.3,-2279.24 1600.81,-2208.59 1736.34,-2156.41"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1737.14,-2158.92 1743.19,-2153.78 1735.25,-2154.02 1737.14,-2158.92"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1430.15,-2287.53 1430.15,-2310.33 1601.89,-2310.33 1601.89,-2287.53 1430.15,-2287.53"/>
<text xml:space="preserve" text-anchor="start" x="1433.15" y="-2293.33" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches the same two files</text>
</g>
<!-- aspintegrations&#45;&gt;whoopapi -->
<g id="edge3" class="edge">
<title>aspintegrations&#45;&gt;whoopapi</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1147.01,-1173.71C1201.51,-1316.2 1303.53,-1604.21 1343.4,-1859 1382.6,-2109.56 1315.28,-3898.08 1388.12,-4141 1453.78,-4359.99 1484.83,-4432.34 1662.67,-4576 1683.71,-4592.99 1708.09,-4607.08 1733.3,-4618.71"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1731.93,-4620.97 1739.85,-4621.64 1734.08,-4616.18 1731.93,-4620.97"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1502.53,-4559.09 1502.53,-4581.89 1529.52,-4581.89 1529.52,-4559.09 1502.53,-4559.09"/>
<text xml:space="preserve" text-anchor="start" x="1505.53" y="-4567.29" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- aspintegrations&#45;&gt;appinsights -->
<g id="edge2" class="edge">
<title>aspintegrations&#45;&gt;appinsights</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1297.97,-1111.12C1591.61,-1153.82 2158.65,-1236.26 2454.71,-1279.31"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2453.9,-1281.84 2461.7,-1280.32 2454.65,-1276.65 2453.9,-1281.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1810.25,-1232.05 1810.25,-1254.85 2030.22,-1254.85 2030.22,-1232.05 1810.25,-1232.05"/>
<text xml:space="preserve" text-anchor="start" x="1813.25" y="-1237.85" font-family="Arial" font-size="14.00" fill="#c9c9c9">Telemetry, to the same workspace</text>
</g>
<!-- aspintegrations&#45;&gt;datacontainer -->
<g id="edge14" class="edge">
<title>aspintegrations&#45;&gt;datacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1235.65,-1173.78C1363.79,-1274.47 1556.84,-1450.59 1643.93,-1654.2 1672.62,-1721.28 1620.2,-1922.68 1662.67,-1982 1681.36,-2008.09 1707.75,-2027.65 1736.56,-2042.31"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1735.37,-2044.65 1743.27,-2045.57 1737.67,-2039.93 1735.37,-2044.65"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1502.53,-1654.2 1502.53,-1677 1529.52,-1677 1529.52,-1654.2 1502.53,-1654.2"/>
<text xml:space="preserve" text-anchor="start" x="1505.53" y="-1662.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- aspintegrations&#45;&gt;kv -->
<g id="edge26" class="edge">
<title>aspintegrations&#45;&gt;kv</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1297.96,-1014.02C1313.61,-1006.47 1328.96,-998.44 1343.4,-990 1523.04,-884.99 1707.02,-727.97 1817.21,-627.52"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1818.68,-629.73 1822.45,-622.73 1815.14,-625.85 1818.68,-629.73"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1426.65,-958.97 1426.65,-998.57 1605.4,-998.57 1605.4,-958.97 1426.65,-958.97"/>
<text xml:space="preserve" text-anchor="start" x="1429.65" y="-981.57" font-family="Arial" font-size="14.00" fill="#c9c9c9">HTTPS/443, Entra token for</text>
<text xml:space="preserve" text-anchor="start" x="1429.65" y="-964.77" font-family="Arial" font-size="14.00" fill="#c9c9c9">id&#45;nygdev&#45;integrations</text>
</g>
<!-- aspintegrations&#45;&gt;cosmosdb -->
<g id="edge6" class="edge">
<title>aspintegrations&#45;&gt;cosmosdb</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1298.1,-1098.48C1566.32,-1109.03 2062.67,-1089.01 2374.47,-836 2542.01,-700.04 2607.66,-441.51 2631.96,-298.84"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2634.5,-299.58 2633.14,-291.75 2629.32,-298.72 2634.5,-299.58"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1906.74,-1087.76 1906.74,-1110.56 1933.73,-1110.56 1933.73,-1087.76 1906.74,-1087.76"/>
<text xml:space="preserve" text-anchor="start" x="1909.74" y="-1095.96" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- apiapp&#45;&gt;appinsights -->
<g id="edge4" class="edge">
<title>apiapp&#45;&gt;appinsights</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2103.92,-1307C2210.94,-1307 2345.94,-1307 2454.34,-1307"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2454.22,-1309.63 2461.72,-1307 2454.22,-1304.38 2454.22,-1309.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2196.54,-1307 2196.54,-1329.8 2374.47,-1329.8 2374.47,-1307 2196.54,-1307"/>
<text xml:space="preserve" text-anchor="start" x="2199.54" y="-1312.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Telemetry (OpenTelemetry)</text>
</g>
<!-- apiapp&#45;&gt;cosmosdb -->
<g id="edge7" class="edge">
<title>apiapp&#45;&gt;cosmosdb</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2104.02,-1250.84C2120.46,-1240.29 2135.54,-1227.79 2147.9,-1213 2212.91,-1135.24 2136.48,-1071.84 2196.54,-990.2 2250.45,-916.92 2314.93,-957.78 2374.47,-889 2525.89,-714.08 2598.08,-444.58 2627.69,-299.23"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2630.25,-299.83 2629.15,-291.96 2625.1,-298.79 2630.25,-299.83"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2272.01,-990.2 2272.01,-1013 2299,-1013 2299,-990.2 2272.01,-990.2"/>
<text xml:space="preserve" text-anchor="start" x="2275.01" y="-998.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- mediacontainer&#45;&gt;browser -->
<g id="edge19" class="edge">
<title>mediacontainer&#45;&gt;browser</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3437.19,-2176.63C3395.79,-2400.46 3289.9,-2997.78 3241.56,-3501 3234.02,-3579.54 3235.29,-4862.3 3181.47,-4920 3018.48,-5094.74 2886.14,-4980 2647.18,-4980 1109.43,-4980 1109.43,-4980 1109.43,-4980 846.51,-4980 570.59,-4818.91 427.35,-4721.15"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="429.11,-4719.18 421.44,-4717.1 426.14,-4723.51 429.11,-4719.18"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1809.07,-4980 1809.07,-5019.6 2031.4,-5019.6 2031.4,-4980 1809.07,-4980"/>
<text xml:space="preserve" text-anchor="start" x="1812.07" y="-5002.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Serves media straight to the player</text>
<text xml:space="preserve" text-anchor="start" x="1812.07" y="-4985.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">browser</text>
</g>
<!-- mediacontainer&#45;&gt;azadminapp -->
<g id="edge20" class="edge">
<title>mediacontainer&#45;&gt;azadminapp</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3270.57,-2030.4C2972.98,-1940.33 2389.37,-1763.69 2096.97,-1675.19"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2097.95,-1672.74 2090.01,-1673.08 2096.43,-1677.77 2097.95,-1672.74"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2541.24,-1907.7 2541.24,-1930.5 2751.11,-1930.5 2751.11,-1907.7 2541.24,-1907.7"/>
<text xml:space="preserve" text-anchor="start" x="2544.24" y="-1913.5" font-family="Arial" font-size="14.00" fill="#c9c9c9">Blob&#45;created events (Event Grid)</text>
</g>
</g>
</svg>
`;case`rpg`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1980pt" height="823pt"
 viewBox="0.00 0.00 1980.00 823.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 808.05)">
<g id="clust1" class="cluster">
<title>cluster_rpg</title>
<polygon fill="#2225aa" stroke="#2a2490" points="8,-281 8,-785 1942,-785 1942,-281 8,-281"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-772.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RPG SERVER</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_cdn</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="741.49,-8 741.49,-273 1173.06,-273 1173.06,-8 741.49,-8"/>
<text xml:space="preserve" text-anchor="start" x="749.49" y="-260.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">CDN STORAGE</text>
</g>
<!-- foundry -->
<g id="node1" class="node">
<title>foundry</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="368.04,-511 48,-511 48,-331 368.04,-331 368.04,-511"/>
<text xml:space="preserve" text-anchor="start" x="149.67" y="-442.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Foundry VTT</text>
<text xml:space="preserve" text-anchor="start" x="127.8" y="-421.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Node.js, listening on :30000</text>
<text xml:space="preserve" text-anchor="start" x="80.03" y="-400.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Self&#45;hosted virtual tabletop, running as</text>
<text xml:space="preserve" text-anchor="start" x="88.79" y="-382.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">srv_foundry off the foundrydata disk</text>
</g>
<!-- client -->
<g id="node2" class="node">
<title>client</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1121.77,-501 792.78,-501 792.78,-321 1121.77,-321 1121.77,-501"/>
<text xml:space="preserve" text-anchor="start" x="892.25" y="-432.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">Foundry Client</text>
<text xml:space="preserve" text-anchor="start" x="883.95" y="-411.8" font-family="Arial" font-size="13.00" fill="#b6ecf7">HTML / JS in the browser</text>
<text xml:space="preserve" text-anchor="start" x="816.8" y="-390.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">The game UI, served by Foundry VTT and</text>
<text xml:space="preserve" text-anchor="start" x="860.56" y="-372.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">running in the player browser</text>
</g>
<!-- caddy -->
<g id="node3" class="node">
<title>caddy</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1902,-724 1550.88,-724 1550.88,-544 1902,-544 1902,-724"/>
<text xml:space="preserve" text-anchor="start" x="1697.53" y="-655.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Caddy</text>
<text xml:space="preserve" text-anchor="start" x="1707.65" y="-634.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Caddy</text>
<text xml:space="preserve" text-anchor="start" x="1570.94" y="-613.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Reverse proxy and TLS termination on 80/443,</text>
<text xml:space="preserve" text-anchor="start" x="1665.57" y="-595.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">for rpg.nygard.dev</text>
</g>
<!-- foundrymedia -->
<g id="node4" class="node">
<title>foundrymedia</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M1141.06,-203.64C1141.06,-212.67 1058.69,-220 957.28,-220 855.87,-220 773.49,-212.67 773.49,-203.64 773.49,-203.64 773.49,-56.36 773.49,-56.36 773.49,-47.33 855.87,-40 957.28,-40 1058.69,-40 1141.06,-47.33 1141.06,-56.36 1141.06,-56.36 1141.06,-203.64 1141.06,-203.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M1141.06,-203.64C1141.06,-194.61 1058.69,-187.27 957.28,-187.27 855.87,-187.27 773.49,-194.61 773.49,-203.64"/>
<text xml:space="preserve" text-anchor="start" x="821.61" y="-124.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="865.56" y="-151.8" font-family="Arial" font-size="20.00" fill="#eff6ff">foundry</text>
<text xml:space="preserve" text-anchor="start" x="1119.06" y="-124.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="865.56" y="-130.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Storage Container</text>
<text xml:space="preserve" text-anchor="start" x="865.56" y="-109.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Foundry VTT media, fetched straight</text>
<text xml:space="preserve" text-anchor="start" x="865.56" y="-91.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">by player browsers</text>
</g>
<!-- user -->
<g id="node5" class="node">
<title>user</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="1909.49,-220 1543.39,-220 1543.39,-40 1909.49,-40 1909.49,-220"/>
<text xml:space="preserve" text-anchor="start" x="1698.66" y="-169" font-family="Arial" font-size="20.00" fill="#f8fafc">Visitor</text>
<text xml:space="preserve" text-anchor="start" x="1571.77" y="-146" font-family="Arial" font-size="15.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="1653.48" y="-128" font-family="Arial" font-size="15.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="1563.45" y="-110" font-family="Arial" font-size="15.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
<text xml:space="preserve" text-anchor="start" x="1645.56" y="-92" font-family="Arial" font-size="15.00" fill="#c2f0c2">can be renewed forever,</text>
<text xml:space="preserve" text-anchor="start" x="1588.44" y="-74" font-family="Arial" font-size="15.00" fill="#c2f0c2">but only a human can create the first one.</text>
</g>
<!-- foundry&#45;&gt;client -->
<g id="edge2" class="edge">
<title>foundry&#45;&gt;client</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M367.95,-418.87C489.66,-417.24 657.38,-415 782.61,-413.32"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="782.57,-415.95 790.04,-413.22 782.5,-410.7 782.57,-415.95"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="458.04,-417.48 458.04,-440.28 683.49,-440.28 683.49,-417.48 458.04,-417.48"/>
<text xml:space="preserve" text-anchor="start" x="461.04" y="-423.28" font-family="Arial" font-size="14.00" fill="#c9c9c9">Serves the game UI and world data</text>
</g>
<!-- foundry&#45;&gt;foundrymedia -->
<g id="edge3" class="edge">
<title>foundry&#45;&gt;foundrymedia</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M367.95,-359.11C483.43,-314.14 640.33,-253.04 763.06,-205.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="763.72,-207.8 769.76,-202.64 761.82,-202.91 763.72,-207.8"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="477.5,-318.57 477.5,-341.37 664.04,-341.37 664.04,-318.57 477.5,-318.57"/>
<text xml:space="preserve" text-anchor="start" x="480.5" y="-324.37" font-family="Arial" font-size="14.00" fill="#c9c9c9">Holds asset URLs pointing at</text>
</g>
<!-- client&#45;&gt;caddy -->
<g id="edge4" class="edge">
<title>client&#45;&gt;caddy</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1121.44,-458.43C1244.5,-494.2 1413.37,-543.29 1541.27,-580.46"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1540.34,-582.93 1548.27,-582.5 1541.8,-577.89 1540.34,-582.93"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1238.08,-549.03 1238.08,-571.83 1446.38,-571.83 1446.38,-549.03 1238.08,-549.03"/>
<text xml:space="preserve" text-anchor="start" x="1241.08" y="-554.83" font-family="Arial" font-size="14.00" fill="#c9c9c9">HTTPS / WSS to rpg.nygard.dev</text>
</g>
<!-- caddy&#45;&gt;foundry -->
<g id="edge5" class="edge">
<title>caddy&#45;&gt;foundry</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1550.92,-621.75C1456.24,-614.9 1337.2,-605.96 1231.06,-597 1013.29,-578.62 957.01,-587.24 741.49,-551 618.54,-530.33 481.96,-496.76 377.91,-468.92"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="378.8,-466.44 370.87,-467.03 377.43,-471.51 378.8,-466.44"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="872.57,-592.22 872.57,-615.02 1041.99,-615.02 1041.99,-592.22 872.57,-592.22"/>
<text xml:space="preserve" text-anchor="start" x="875.57" y="-598.02" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reverse proxies to :30000</text>
</g>
<!-- foundrymedia&#45;&gt;user -->
<g id="edge6" class="edge">
<title>foundrymedia&#45;&gt;user</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1142.03,-130C1260.16,-130 1413.36,-130 1533.13,-130"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1532.99,-132.63 1540.49,-130 1532.99,-127.38 1532.99,-132.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1231.06,-130 1231.06,-169.6 1453.39,-169.6 1453.39,-130 1231.06,-130"/>
<text xml:space="preserve" text-anchor="start" x="1234.06" y="-152.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Serves media straight to the player</text>
<text xml:space="preserve" text-anchor="start" x="1234.06" y="-135.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">browser</text>
</g>
<!-- user&#45;&gt;client -->
<g id="edge1" class="edge">
<title>user&#45;&gt;client</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1543.72,-196.56C1418.79,-242.32 1253.91,-302.72 1130.97,-347.75"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1130.43,-345.15 1124.29,-350.19 1132.23,-350.08 1130.43,-345.15"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1244.68,-303.93 1244.68,-326.73 1439.78,-326.73 1439.78,-303.93 1244.68,-303.93"/>
<text xml:space="preserve" text-anchor="start" x="1247.68" y="-309.73" font-family="Arial" font-size="14.00" fill="#c9c9c9">Plays at https://rpg.nygard.dev</text>
</g>
</g>
</svg>
`;case`rpgInfra`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1490pt" height="2050pt"
 viewBox="0.00 0.00 1490.00 2050.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 2035.45)">
<g id="clust1" class="cluster">
<title>cluster_internet</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="8,-1627.3 8,-1847.5 360,-1847.5 360,-1627.3 8,-1627.3"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-1834.6" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">INTERNET</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_azure</title>
<polygon fill="#353b43" stroke="#262b32" points="378,-8 378,-2012.4 1452,-2012.4 1452,-8 378,-8"/>
<text xml:space="preserve" text-anchor="start" x="386" y="-1999.5" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">AZURE SUBSCRIPTION</text>
</g>
<g id="clust3" class="cluster">
<title>cluster_rgnetwork</title>
<polygon fill="#232598" stroke="#292481" points="428,-1244 428,-1941.2 966,-1941.2 966,-1244 428,-1244"/>
<text xml:space="preserve" text-anchor="start" x="436" y="-1928.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RG&#45;NYGDEV&#45;NETWORK</text>
</g>
<g id="clust4" class="cluster">
<title>cluster_vnetmain</title>
<polygon fill="#2225aa" stroke="#2a2490" points="478,-1604.8 478,-1870 916,-1870 916,-1604.8 478,-1604.8"/>
<text xml:space="preserve" text-anchor="start" x="486" y="-1857.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">NYGDEV&#45;VNET</text>
</g>
<g id="clust5" class="cluster">
<title>cluster_rgvm</title>
<polygon fill="#232598" stroke="#292481" points="680,-464 680,-1193.2 1196,-1193.2 1196,-464 680,-464"/>
<text xml:space="preserve" text-anchor="start" x="688" y="-1180.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RG&#45;NYGDEV&#45;VM</text>
</g>
<g id="clust6" class="cluster">
<title>cluster_rpgvm</title>
<polygon fill="#2225aa" stroke="#2a2490" points="712,-496 712,-1140 1164,-1140 1164,-496 712,-496"/>
<text xml:space="preserve" text-anchor="start" x="720" y="-1127.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RPG&#45;VM</text>
</g>
<g id="clust7" class="cluster">
<title>cluster_rgdata</title>
<polygon fill="#2225aa" stroke="#2a2490" points="974,-90 974,-355.2 1402,-355.2 1402,-90 974,-90"/>
<text xml:space="preserve" text-anchor="start" x="982" y="-342.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#c7d2fe" fill-opacity="0.701961">RG&#45;NYGDEV&#45;DATA</text>
</g>
<g id="clust8" class="cluster">
<title>cluster_rgweb</title>
<polygon fill="#1a468d" stroke="#1c3979" points="428,-58 428,-408.4 924,-408.4 924,-58 428,-58"/>
<text xml:space="preserve" text-anchor="start" x="436" y="-395.5" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">RG&#45;NYGDEV&#45;WEB</text>
</g>
<g id="clust9" class="cluster">
<title>cluster_cdnstorage</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="460,-90 460,-355.2 892,-355.2 892,-90 460,-90"/>
<text xml:space="preserve" text-anchor="start" x="468" y="-342.3" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">NYGDEVCDN</text>
</g>
<!-- browser -->
<g id="node1" class="node">
<title>browser</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="328.4,-1794.3 39.6,-1794.3 39.6,-1659.3 328.4,-1659.3 328.4,-1794.3"/>
<text xml:space="preserve" text-anchor="start" x="131.1" y="-1744" font-family="Arial" font-size="16.00" fill="#f8fafc">Visitor browser</text>
<text xml:space="preserve" text-anchor="start" x="60.26" y="-1724.8" font-family="Arial" font-size="12.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="125.63" y="-1710.4" font-family="Arial" font-size="12.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="53.61" y="-1696" font-family="Arial" font-size="12.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
</g>
<!-- pip -->
<g id="node2" class="node">
<title>pip</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="843.96,-1474 478.04,-1474 478.04,-1294 843.96,-1294 843.96,-1474"/>
<text xml:space="preserve" text-anchor="start" x="526.15" y="-1378.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="570.1" y="-1396" font-family="Arial" font-size="20.00" fill="#eef2ff">rpg&#45;pip</text>
<text xml:space="preserve" text-anchor="start" x="821.96" y="-1378.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="570.1" y="-1373" font-family="Arial" font-size="15.00" fill="#c7d2fe">Static public IP, DNS label &quot;rpg&quot; —</text>
<text xml:space="preserve" text-anchor="start" x="570.1" y="-1355" font-family="Arial" font-size="15.00" fill="#c7d2fe">rpg.norwayeast.cloudapp.azure.com</text>
</g>
<!-- subnetrpg -->
<g id="node3" class="node">
<title>subnetrpg</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="883.74,-1816.8 510.26,-1816.8 510.26,-1636.8 883.74,-1636.8 883.74,-1816.8"/>
<text xml:space="preserve" text-anchor="start" x="558.38" y="-1721.2" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="602.33" y="-1757.6" font-family="Arial" font-size="20.00" fill="#eef2ff">rpg&#45;snet</text>
<text xml:space="preserve" text-anchor="start" x="861.73" y="-1721.2" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="602.33" y="-1736.6" font-family="Arial" font-size="13.00" fill="#c7d2fe">10.0.0.0/29</text>
<text xml:space="preserve" text-anchor="start" x="602.33" y="-1715" font-family="Arial" font-size="15.00" fill="#c7d2fe">NSG nygdev&#45;nsg: 80/443 from</text>
<text xml:space="preserve" text-anchor="start" x="602.33" y="-1697" font-family="Arial" font-size="15.00" fill="#c7d2fe">anywhere; 22, 30000 and 30001 from</text>
<text xml:space="preserve" text-anchor="start" x="602.33" y="-1679" font-family="Arial" font-size="15.00" fill="#c7d2fe">the home IP only</text>
</g>
<!-- caddyproc -->
<g id="node4" class="node">
<title>caddyproc</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1113.56,-1068.8 762.44,-1068.8 762.44,-888.8 1113.56,-888.8 1113.56,-1068.8"/>
<text xml:space="preserve" text-anchor="start" x="909.09" y="-1000.6" font-family="Arial" font-size="20.00" fill="#eef2ff">Caddy</text>
<text xml:space="preserve" text-anchor="start" x="919.21" y="-979.6" font-family="Arial" font-size="13.00" fill="#c7d2fe">Caddy</text>
<text xml:space="preserve" text-anchor="start" x="782.5" y="-958" font-family="Arial" font-size="15.00" fill="#c7d2fe">Reverse proxy and TLS termination on 80/443,</text>
<text xml:space="preserve" text-anchor="start" x="877.13" y="-940" font-family="Arial" font-size="15.00" fill="#c7d2fe">for rpg.nygard.dev</text>
</g>
<!-- foundryproc -->
<g id="node5" class="node">
<title>foundryproc</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1098.02,-726 777.98,-726 777.98,-546 1098.02,-546 1098.02,-726"/>
<text xml:space="preserve" text-anchor="start" x="879.65" y="-657.8" font-family="Arial" font-size="20.00" fill="#eef2ff">Foundry VTT</text>
<text xml:space="preserve" text-anchor="start" x="857.78" y="-636.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Node.js, listening on :30000</text>
<text xml:space="preserve" text-anchor="start" x="810.01" y="-615.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Self&#45;hosted virtual tabletop, running as</text>
<text xml:space="preserve" text-anchor="start" x="818.77" y="-597.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">srv_foundry off the foundrydata disk</text>
</g>
<!-- foundrydata -->
<g id="node6" class="node">
<title>foundrydata</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="1369.7,-302 1006.3,-302 1006.3,-122 1369.7,-122 1369.7,-302"/>
<text xml:space="preserve" text-anchor="start" x="1054.42" y="-206.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1098.37" y="-260.8" font-family="Arial" font-size="20.00" fill="#eef2ff">foundrydata</text>
<text xml:space="preserve" text-anchor="start" x="1347.69" y="-206.4" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1098.37" y="-239.8" font-family="Arial" font-size="13.00" fill="#c7d2fe">Azure Managed Disk, attached at LUN</text>
<text xml:space="preserve" text-anchor="start" x="1098.37" y="-218.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Worlds, modules, media, the</text>
<text xml:space="preserve" text-anchor="start" x="1098.37" y="-200.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Caddyfile and the Foundry install.</text>
<text xml:space="preserve" text-anchor="start" x="1098.37" y="-182.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">Referenced by terraform as a data</text>
<text xml:space="preserve" text-anchor="start" x="1098.37" y="-164.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">source and attached, never</text>
<text xml:space="preserve" text-anchor="start" x="1098.37" y="-146.2" font-family="Arial" font-size="15.00" fill="#c7d2fe">created — which is what lets the VM</text>
</g>
<!-- mediacontainer -->
<g id="node7" class="node">
<title>mediacontainer</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M859.79,-285.64C859.79,-294.67 777.41,-302 676,-302 574.59,-302 492.21,-294.67 492.21,-285.64 492.21,-285.64 492.21,-138.36 492.21,-138.36 492.21,-129.33 574.59,-122 676,-122 777.41,-122 859.79,-129.33 859.79,-138.36 859.79,-138.36 859.79,-285.64 859.79,-285.64"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M859.79,-285.64C859.79,-276.61 777.41,-269.27 676,-269.27 574.59,-269.27 492.21,-276.61 492.21,-285.64"/>
<text xml:space="preserve" text-anchor="start" x="540.33" y="-206.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="584.28" y="-233.8" font-family="Arial" font-size="20.00" fill="#eff6ff">foundry</text>
<text xml:space="preserve" text-anchor="start" x="837.78" y="-206.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="584.28" y="-212.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Storage Container</text>
<text xml:space="preserve" text-anchor="start" x="584.28" y="-191.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Foundry VTT media, fetched straight</text>
<text xml:space="preserve" text-anchor="start" x="584.28" y="-173.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">by player browsers</text>
</g>
<!-- browser&#45;&gt;pip -->
<g id="edge1" class="edge">
<title>browser&#45;&gt;pip</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M276.82,-1659.48C348.48,-1608.28 448.59,-1536.76 528.65,-1479.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="529.79,-1481.97 534.37,-1475.48 526.74,-1477.7 529.79,-1481.97"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="436.8,-1544 436.8,-1566.8 601.54,-1566.8 601.54,-1544 436.8,-1544"/>
<text xml:space="preserve" text-anchor="start" x="439.8" y="-1549.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">HTTPS to rpg.nygard.dev</text>
</g>
<!-- pip&#45;&gt;caddyproc -->
<g id="edge2" class="edge">
<title>pip&#45;&gt;caddyproc</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M722.13,-1294.02C766.29,-1229.74 825.89,-1142.99 871.28,-1076.92"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="873.23,-1078.72 875.31,-1071.05 868.9,-1075.75 873.23,-1078.72"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="782.92,-1201.2 782.92,-1224 1000.59,-1224 1000.59,-1201.2 782.92,-1201.2"/>
<text xml:space="preserve" text-anchor="start" x="785.92" y="-1207" font-family="Arial" font-size="14.00" fill="#c9c9c9">Forwards 80/443 through rpg&#45;snet</text>
</g>
<!-- caddyproc&#45;&gt;foundryproc -->
<g id="edge3" class="edge">
<title>caddyproc&#45;&gt;foundryproc</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M938,-889.15C938,-842.29 938,-784.63 938,-736.28"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="940.63,-736.33 938,-728.83 935.38,-736.33 940.63,-736.33"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="938,-796 938,-818.8 1107.43,-818.8 1107.43,-796 938,-796"/>
<text xml:space="preserve" text-anchor="start" x="941" y="-801.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reverse proxies to :30000</text>
</g>
<!-- foundryproc&#45;&gt;foundrydata -->
<g id="edge4" class="edge">
<title>foundryproc&#45;&gt;foundrydata</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M990.71,-546.02C1031.52,-477.15 1087.97,-381.85 1130.04,-310.83"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1132.25,-312.25 1133.82,-304.46 1127.73,-309.58 1132.25,-312.25"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1063,-416.4 1063,-456 1326.58,-456 1326.58,-416.4 1063,-416.4"/>
<text xml:space="preserve" text-anchor="start" x="1066" y="-439" font-family="Arial" font-size="14.00" fill="#c9c9c9">Stores worlds, modules and media on the</text>
<text xml:space="preserve" text-anchor="start" x="1066" y="-422.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">attached disk</text>
</g>
<!-- foundryproc&#45;&gt;mediacontainer -->
<g id="edge5" class="edge">
<title>foundryproc&#45;&gt;mediacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M882.76,-546.02C840.13,-477.35 781.19,-382.42 737.14,-311.48"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="739.63,-310.51 733.44,-305.52 735.17,-313.28 739.63,-310.51"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="822.69,-424.8 822.69,-447.6 1009.22,-447.6 1009.22,-424.8 822.69,-424.8"/>
<text xml:space="preserve" text-anchor="start" x="825.69" y="-430.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Holds asset URLs pointing at</text>
</g>
<!-- mediacontainer&#45;&gt;browser -->
<g id="edge6" class="edge">
<title>mediacontainer&#45;&gt;browser</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M500.86,-296.24C379.63,-367.35 240,-482.38 240,-635 240,-1385 240,-1385 240,-1385 240,-1476.87 219.94,-1580.84 203.83,-1649.53"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="201.37,-1648.55 202.19,-1656.46 206.48,-1649.77 201.37,-1648.55"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="240,-959 240,-998.6 462.33,-998.6 462.33,-959 240,-959"/>
<text xml:space="preserve" text-anchor="start" x="243" y="-981.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Serves media straight to the player</text>
<text xml:space="preserve" text-anchor="start" x="243" y="-964.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">browser</text>
</g>
</g>
</svg>
`;case`rpgTerraform`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="2411pt" height="1217pt"
 viewBox="0.00 0.00 2411.00 1217.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1202.15)">
<g id="clust1" class="cluster">
<title>cluster_github</title>
<polygon fill="#3a404a" stroke="#292f37" points="431.1,-119.1 431.1,-722.1 1669.28,-722.1 1669.28,-119.1 431.1,-119.1"/>
<text xml:space="preserve" text-anchor="start" x="439.1" y="-709.2" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">GITHUB</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_repo</title>
<polygon fill="#5a3620" stroke="#462a17" points="471.1,-159.1 471.1,-424.1 906,-424.1 906,-159.1 471.1,-159.1"/>
<text xml:space="preserve" text-anchor="start" x="479.1" y="-411.2" font-family="Arial" font-weight="bold" font-size="11.00" fill="#f9b27c" fill-opacity="0.701961">NYGDEVAZURE</text>
</g>
<g id="clust3" class="cluster">
<title>cluster_actions</title>
<polygon fill="#5a3620" stroke="#462a17" points="1192.72,-396.1 1192.72,-661.1 1629.28,-661.1 1629.28,-396.1 1192.72,-396.1"/>
<text xml:space="preserve" text-anchor="start" x="1200.72" y="-648.2" font-family="Arial" font-weight="bold" font-size="11.00" fill="#f9b27c" fill-opacity="0.701961">GITHUB ACTIONS</text>
</g>
<g id="clust4" class="cluster">
<title>cluster_entra</title>
<polygon fill="#3e4651" stroke="#2d333d" points="1194.78,-914.1 1194.78,-1179.1 1627.22,-1179.1 1627.22,-914.1 1194.78,-914.1"/>
<text xml:space="preserve" text-anchor="start" x="1202.78" y="-1166.2" font-family="Arial" font-weight="bold" font-size="11.00" fill="#cbd5e1" fill-opacity="0.701961">MICROSOFT ENTRA ID</text>
</g>
<!-- srctf -->
<g id="node1" class="node">
<title>srctf</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="874,-371.1 503.1,-371.1 503.1,-191.1 874,-191.1 874,-371.1"/>
<text xml:space="preserve" text-anchor="start" x="551.22" y="-275.5" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="595.16" y="-311.9" font-family="Arial" font-size="20.00" fill="#ffe0c2">terraform/**</text>
<text xml:space="preserve" text-anchor="start" x="851.99" y="-275.5" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="595.16" y="-290.9" font-family="Arial" font-size="13.00" fill="#f9b27c">Terraform HCL</text>
<text xml:space="preserve" text-anchor="start" x="595.16" y="-269.3" font-family="Arial" font-size="15.00" fill="#f9b27c">The Azure estate: resource groups,</text>
<text xml:space="preserve" text-anchor="start" x="595.16" y="-251.3" font-family="Arial" font-size="15.00" fill="#f9b27c">VNet, VM, storage, Cosmos, function</text>
<text xml:space="preserve" text-anchor="start" x="595.16" y="-233.3" font-family="Arial" font-size="15.00" fill="#f9b27c">apps, Key Vault</text>
</g>
<!-- tfapply -->
<g id="node2" class="node">
<title>tfapply</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1597.28,-608.1 1224.72,-608.1 1224.72,-428.1 1597.28,-428.1 1597.28,-608.1"/>
<text xml:space="preserve" text-anchor="start" x="1272.84" y="-512.5" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1316.79" y="-566.9" font-family="Arial" font-size="20.00" fill="#ffe0c2">Terraform Apply</text>
<text xml:space="preserve" text-anchor="start" x="1575.27" y="-512.5" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1316.79" y="-545.9" font-family="Arial" font-size="13.00" fill="#f9b27c">terraform&#45;apply.yml —</text>
<text xml:space="preserve" text-anchor="start" x="1316.79" y="-524.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Authenticates with ARM_USE_OIDC,</text>
<text xml:space="preserve" text-anchor="start" x="1316.79" y="-506.3" font-family="Arial" font-size="15.00" fill="#f9b27c">fetches the home IP and the SSH</text>
<text xml:space="preserve" text-anchor="start" x="1316.79" y="-488.3" font-family="Arial" font-size="15.00" fill="#f9b27c">public key at run time, then</text>
<text xml:space="preserve" text-anchor="start" x="1316.79" y="-470.3" font-family="Arial" font-size="15.00" fill="#f9b27c">terraform apply &#45;auto&#45;approve.</text>
<text xml:space="preserve" text-anchor="start" x="1316.79" y="-452.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Run by hand rather than on a push:</text>
</g>
<!-- ghenv -->
<g id="node3" class="node">
<title>ghenv</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="896.06,-661.1 481.04,-661.1 481.04,-481.1 896.06,-481.1 896.06,-661.1"/>
<text xml:space="preserve" text-anchor="start" x="529.16" y="-565.5" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="573.1" y="-619.9" font-family="Arial" font-size="20.00" fill="#ffe0c2">Environment &quot;NygDevAzure&quot;</text>
<text xml:space="preserve" text-anchor="start" x="874.05" y="-565.5" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="573.1" y="-598.9" font-family="Arial" font-size="13.00" fill="#f9b27c">GitHub Actions environment</text>
<text xml:space="preserve" text-anchor="start" x="573.1" y="-577.3" font-family="Arial" font-size="15.00" fill="#f9b27c">AZURE_CLIENT_ID, AZURE_TENANT_ID,</text>
<text xml:space="preserve" text-anchor="start" x="573.1" y="-559.3" font-family="Arial" font-size="15.00" fill="#f9b27c">AZURE_SUBSCRIPTION_ID,</text>
<text xml:space="preserve" text-anchor="start" x="573.1" y="-541.3" font-family="Arial" font-size="15.00" fill="#f9b27c">AZURE_KEYVAULT_NAME,</text>
<text xml:space="preserve" text-anchor="start" x="573.1" y="-523.3" font-family="Arial" font-size="15.00" fill="#f9b27c">AZURE_VM_USERNAME,</text>
<text xml:space="preserve" text-anchor="start" x="573.1" y="-505.3" font-family="Arial" font-size="15.00" fill="#f9b27c">ENTRA_OWNER_OBJECTID.</text>
</g>
<!-- ghoidc -->
<g id="node4" class="node">
<title>ghoidc</title>
<polygon fill="#a35829" stroke="#7e451d" stroke-width="0" points="1595.22,-1126.1 1226.78,-1126.1 1226.78,-946.1 1595.22,-946.1 1595.22,-1126.1"/>
<text xml:space="preserve" text-anchor="start" x="1274.9" y="-1030.5" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1318.85" y="-1084.9" font-family="Arial" font-size="20.00" fill="#ffe0c2">GitHub deploy identity</text>
<text xml:space="preserve" text-anchor="start" x="1573.22" y="-1030.5" font-family="Arial" font-size="14.00" fill="#ffe0c2"> </text>
<text xml:space="preserve" text-anchor="start" x="1318.85" y="-1063.9" font-family="Arial" font-size="13.00" fill="#f9b27c">Workload identity federation</text>
<text xml:space="preserve" text-anchor="start" x="1318.85" y="-1042.3" font-family="Arial" font-size="15.00" fill="#f9b27c">The AZURE_CLIENT_ID principal.</text>
<text xml:space="preserve" text-anchor="start" x="1318.85" y="-1024.3" font-family="Arial" font-size="15.00" fill="#f9b27c">Federated credentials trust</text>
<text xml:space="preserve" text-anchor="start" x="1318.85" y="-1006.3" font-family="Arial" font-size="15.00" fill="#f9b27c">token.actions.githubusercontent.com</text>
<text xml:space="preserve" text-anchor="start" x="1318.85" y="-988.3" font-family="Arial" font-size="15.00" fill="#f9b27c">for this repository and the</text>
<text xml:space="preserve" text-anchor="start" x="1318.85" y="-970.3" font-family="Arial" font-size="15.00" fill="#f9b27c">NygDevAzure environment, so there</text>
</g>
<!-- dev -->
<g id="node5" class="node">
<title>dev</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="320.04,-371.1 0,-371.1 0,-191.1 320.04,-191.1 320.04,-371.1"/>
<text xml:space="preserve" text-anchor="start" x="114.44" y="-293.1" font-family="Arial" font-size="20.00" fill="#f8fafc">Developer</text>
<text xml:space="preserve" text-anchor="start" x="24.95" y="-270.1" font-family="Arial" font-size="15.00" fill="#c2f0c2">Authors the model, the terraform and the</text>
<text xml:space="preserve" text-anchor="start" x="39.11" y="-252.1" font-family="Arial" font-size="15.00" fill="#c2f0c2">function code, and pushes to master</text>
</g>
<!-- tfstate -->
<g id="node6" class="node">
<title>tfstate</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2363.45,-473.74C2363.45,-482.77 2290.61,-490.1 2200.94,-490.1 2111.27,-490.1 2038.44,-482.77 2038.44,-473.74 2038.44,-473.74 2038.44,-326.46 2038.44,-326.46 2038.44,-317.43 2111.27,-310.1 2200.94,-310.1 2290.61,-310.1 2363.45,-317.43 2363.45,-326.46 2363.45,-326.46 2363.45,-473.74 2363.45,-473.74"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2363.45,-473.74C2363.45,-464.71 2290.61,-457.37 2200.94,-457.37 2111.27,-457.37 2038.44,-464.71 2038.44,-473.74"/>
<text xml:space="preserve" text-anchor="start" x="2086.55" y="-394.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2130.5" y="-430.9" font-family="Arial" font-size="20.00" fill="#eff6ff">Terraform State</text>
<text xml:space="preserve" text-anchor="start" x="2341.44" y="-394.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2130.5" y="-409.9" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Blob Storage, AzureAD auth</text>
<text xml:space="preserve" text-anchor="start" x="2130.5" y="-388.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdevtfstate / tfstate /</text>
<text xml:space="preserve" text-anchor="start" x="2130.5" y="-370.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">azure&#45;infrastructure.tfstate in</text>
<text xml:space="preserve" text-anchor="start" x="2130.5" y="-352.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">rg&#45;nygdev&#45;data</text>
</g>
<!-- keyvault -->
<g id="node7" class="node">
<title>keyvault</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2380.99,-182C2380.99,-192.04 2300.29,-200.2 2200.94,-200.2 2101.6,-200.2 2020.9,-192.04 2020.9,-182 2020.9,-182 2020.9,-18.2 2020.9,-18.2 2020.9,-8.16 2101.6,0 2200.94,0 2300.29,0 2380.99,-8.16 2380.99,-18.2 2380.99,-18.2 2380.99,-182 2380.99,-182"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2380.99,-182C2380.99,-171.96 2300.29,-163.8 2200.94,-163.8 2101.6,-163.8 2020.9,-171.96 2020.9,-182"/>
<text xml:space="preserve" text-anchor="start" x="2069.02" y="-94.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2112.97" y="-148.9" font-family="Arial" font-size="20.00" fill="#eff6ff">Key Vault</text>
<text xml:space="preserve" text-anchor="start" x="2358.98" y="-94.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2112.97" y="-127.9" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Key Vault — standard, RBAC</text>
<text xml:space="preserve" text-anchor="start" x="2112.97" y="-106.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev, in rg&#45;nygdev&#45;security.</text>
<text xml:space="preserve" text-anchor="start" x="2112.97" y="-88.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">Holds whoop&#45;clientsecret, copied in</text>
<text xml:space="preserve" text-anchor="start" x="2112.97" y="-70.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">by</text>
<text xml:space="preserve" text-anchor="start" x="2112.97" y="-52.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">hand from the WHOOP developer</text>
<text xml:space="preserve" text-anchor="start" x="2112.97" y="-34.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">dashboard, and whoop&#45;token.</text>
</g>
<!-- azurerm -->
<g id="node8" class="node">
<title>azurerm</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2374.83,-1126.1 2027.06,-1126.1 2027.06,-946.1 2374.83,-946.1 2374.83,-1126.1"/>
<text xml:space="preserve" text-anchor="start" x="2087" y="-1057.9" font-family="Arial" font-size="20.00" fill="#f8fafc">Azure Resource Manager</text>
<text xml:space="preserve" text-anchor="start" x="2130.85" y="-1036.9" font-family="Arial" font-size="13.00" fill="#cbd5e1">management.azure.com</text>
<text xml:space="preserve" text-anchor="start" x="2047.12" y="-1015.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">The Azure control plane. Terraform and the az</text>
<text xml:space="preserve" text-anchor="start" x="2081.29" y="-997.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">CLI both reach the estate through it.</text>
</g>
<!-- rpg -->
<g id="node9" class="node">
<title>rpg</title>
<polygon fill="#6366f1" stroke="#4f46e5" stroke-width="0" points="2375.98,-780.1 2025.91,-780.1 2025.91,-600.1 2375.98,-600.1 2375.98,-780.1"/>
<text xml:space="preserve" text-anchor="start" x="2074.03" y="-684.5" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2117.97" y="-738.9" font-family="Arial" font-size="20.00" fill="#eef2ff">RPG Server</text>
<text xml:space="preserve" text-anchor="start" x="2353.97" y="-684.5" font-family="Arial" font-size="14.00" fill="#eef2ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2117.97" y="-717.9" font-family="Arial" font-size="13.00" fill="#c7d2fe">Azure Linux VM — Standard_B2s,</text>
<text xml:space="preserve" text-anchor="start" x="2117.97" y="-696.3" font-family="Arial" font-size="15.00" fill="#c7d2fe">rpg&#45;vm, behind the rpg&#45;pip public</text>
<text xml:space="preserve" text-anchor="start" x="2117.97" y="-678.3" font-family="Arial" font-size="15.00" fill="#c7d2fe">IP. Built by terraform and</text>
<text xml:space="preserve" text-anchor="start" x="2117.97" y="-660.3" font-family="Arial" font-size="15.00" fill="#c7d2fe">configured by cloud&#45;init; worlds</text>
<text xml:space="preserve" text-anchor="start" x="2117.97" y="-642.3" font-family="Arial" font-size="15.00" fill="#c7d2fe">and media live on a separate disk</text>
<text xml:space="preserve" text-anchor="start" x="2117.97" y="-624.3" font-family="Arial" font-size="15.00" fill="#c7d2fe">that survives the VM being rebuilt.</text>
</g>
<!-- srctf&#45;&gt;tfapply -->
<g id="edge3" class="edge">
<title>srctf&#45;&gt;tfapply</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M873.76,-312.84C957.74,-329.95 1057.64,-354.05 1144.72,-385.3 1175.04,-396.18 1206.37,-409.67 1236.41,-423.84"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1235.06,-426.1 1242.96,-426.96 1237.32,-421.36 1235.06,-426.1"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="976.06,-385.3 976.06,-408.1 1144.72,-408.1 1144.72,-385.3 976.06,-385.3"/>
<text xml:space="preserve" text-anchor="start" x="979.06" y="-391.1" font-family="Arial" font-size="14.00" fill="#c9c9c9">Change here is applied by</text>
</g>
<!-- tfapply&#45;&gt;ghoidc -->
<g id="edge4" class="edge">
<title>tfapply&#45;&gt;ghoidc</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1411,-661.1C1411,-752.71 1411,-844.33 1411,-935.95"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1408.38,-935.67 1411,-943.17 1413.63,-935.67 1408.38,-935.67"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1205.02,-763.76 1205.02,-803.36 1411,-803.36 1411,-763.76 1205.02,-763.76"/>
<text xml:space="preserve" text-anchor="start" x="1208.02" y="-786.36" font-family="Arial" font-size="14.00" fill="#c9c9c9">Presents the runner OIDC token</text>
<text xml:space="preserve" text-anchor="start" x="1208.02" y="-769.56" font-family="Arial" font-size="14.00" fill="#c9c9c9">(azure/login@v3)</text>
</g>
<!-- tfapply&#45;&gt;tfstate -->
<g id="edge5" class="edge">
<title>tfapply&#45;&gt;tfstate</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1597.24,-490.36C1727.35,-470.87 1900.17,-444.99 2027.38,-425.94"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2027.59,-428.57 2034.62,-424.86 2026.81,-423.37 2027.59,-428.57"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1736.84,-478.26 1736.84,-501.06 1881.35,-501.06 1881.35,-478.26 1736.84,-478.26"/>
<text xml:space="preserve" text-anchor="start" x="1739.84" y="-484.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">Locks and writes state</text>
</g>
<!-- tfapply&#45;&gt;keyvault -->
<g id="edge6" class="edge">
<title>tfapply&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1574.44,-428.23C1608.35,-409.67 1643.93,-390.34 1677.28,-372.5 1787.42,-313.59 1911.35,-248.92 2010.89,-197.39"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2011.99,-199.77 2017.45,-193.99 2009.58,-195.11 2011.99,-199.77"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1677.28,-372.5 1677.28,-412.1 1940.9,-412.1 1940.9,-372.5 1677.28,-372.5"/>
<text xml:space="preserve" text-anchor="start" x="1680.28" y="-395.1" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads HomeIP, and the nygdev&#45;ed25519</text>
<text xml:space="preserve" text-anchor="start" x="1680.28" y="-378.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">public key beside it, at run time</text>
</g>
<!-- tfapply&#45;&gt;azurerm -->
<g id="edge7" class="edge">
<title>tfapply&#45;&gt;azurerm</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1548.8,-608.03C1690.2,-700.99 1910.1,-845.55 2054.57,-940.53"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2052.88,-942.56 2060.59,-944.49 2055.76,-938.17 2052.88,-942.56"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1713.49,-864.88 1713.49,-887.68 1904.69,-887.68 1904.69,-864.88 1713.49,-864.88"/>
<text xml:space="preserve" text-anchor="start" x="1716.49" y="-870.68" font-family="Arial" font-size="14.00" fill="#c9c9c9">terraform apply &#45;auto&#45;approve</text>
</g>
<!-- ghenv&#45;&gt;tfapply -->
<g id="edge2" class="edge">
<title>ghenv&#45;&gt;tfapply</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M896,-555.91C985.54,-549.33 1090.68,-541.59 1182.46,-534.84"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1182.42,-537.47 1189.71,-534.31 1182.04,-532.24 1182.42,-537.47"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1044.7,-544.97 1044.7,-584.57 1293.52,-584.57 1293.52,-544.97 1044.7,-544.97"/>
<text xml:space="preserve" text-anchor="start" x="1047.7" y="-567.57" font-family="Arial" font-size="14.00" fill="#c9c9c9">Supplies tenant, subscription and client</text>
<text xml:space="preserve" text-anchor="start" x="1047.7" y="-550.77" font-family="Arial" font-size="14.00" fill="#c9c9c9">ids to</text>
</g>
<!-- ghoidc&#45;&gt;tfapply -->
<g id="edge8" class="edge">
<title>ghoidc&#45;&gt;tfapply</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1411,-946.19C1411,-854.59 1411,-763 1411,-671.4"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1413.63,-671.62 1411,-664.12 1408.38,-671.62 1413.63,-671.62"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1411,-763.83 1411,-803.43 1663.67,-803.43 1663.67,-763.83 1411,-763.83"/>
<text xml:space="preserve" text-anchor="start" x="1414" y="-786.43" font-family="Arial" font-size="14.00" fill="#c9c9c9">Issues a short&#45;lived Azure access token</text>
<text xml:space="preserve" text-anchor="start" x="1414" y="-769.63" font-family="Arial" font-size="14.00" fill="#c9c9c9">to</text>
</g>
<!-- ghoidc&#45;&gt;azurerm -->
<g id="edge9" class="edge">
<title>ghoidc&#45;&gt;azurerm</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1594.75,-1036.1C1721.68,-1036.1 1890.13,-1036.1 2017.08,-1036.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2016.77,-1038.73 2024.27,-1036.1 2016.77,-1033.48 2016.77,-1038.73"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1687.42,-1036.1 1687.42,-1075.7 1930.76,-1075.7 1930.76,-1036.1 1687.42,-1036.1"/>
<text xml:space="preserve" text-anchor="start" x="1690.42" y="-1058.7" font-family="Arial" font-size="14.00" fill="#c9c9c9">Authorises calls against (RBAC on the</text>
<text xml:space="preserve" text-anchor="start" x="1690.42" y="-1041.9" font-family="Arial" font-size="14.00" fill="#c9c9c9">subscription)</text>
</g>
<!-- dev&#45;&gt;srctf -->
<g id="edge1" class="edge">
<title>dev&#45;&gt;srctf</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.71,-281.1C364.08,-281.1 413.19,-281.1 460.68,-281.1"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="460.58,-283.73 468.08,-281.1 460.58,-278.48 460.58,-283.73"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="395.16,-269.7 395.16,-292.5 506.19,-292.5 506.19,-269.7 395.16,-269.7"/>
<text xml:space="preserve" text-anchor="start" x="398.16" y="-275.5" font-family="Arial" font-size="14.00" fill="#c9c9c9">git push (master)</text>
</g>
<!-- azurerm&#45;&gt;rpg -->
<g id="edge10" class="edge">
<title>azurerm&#45;&gt;rpg</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2200.94,-946.32C2200.94,-898.43 2200.94,-839.37 2200.94,-790.03"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2203.57,-790.18 2200.94,-782.68 2198.32,-790.18 2203.57,-790.18"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2048.09,-834.9 2048.09,-891.3 2291.4,-891.3 2291.4,-834.9 2048.09,-834.9"/>
<text xml:space="preserve" text-anchor="start" x="2051.09" y="-874.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">Creates rpg&#45;vm and its NIC, the public</text>
<text xml:space="preserve" text-anchor="start" x="2051.09" y="-857.5" font-family="Arial" font-size="14.00" fill="#c9c9c9">IP, the VNet, subnet and NSG, and</text>
<text xml:space="preserve" text-anchor="start" x="2051.09" y="-840.7" font-family="Arial" font-size="14.00" fill="#c9c9c9">attaches the foundrydata disk</text>
</g>
</g>
</svg>
`;case`running`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1269pt" height="1477pt"
 viewBox="0.00 0.00 1269.00 1477.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1462.05)">
<g id="clust1" class="cluster">
<title>cluster_integrations</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="8,-617 8,-1188 456.52,-1188 456.52,-617 8,-617"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-1175.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">INTEGRATIONS</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_cdn</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="819.84,-8 819.84,-293 1230.61,-293 1230.61,-8 819.84,-8"/>
<text xml:space="preserve" text-anchor="start" x="827.84" y="-280.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">CDN STORAGE</text>
</g>
<!-- sync -->
<g id="node1" class="node">
<title>sync</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="416.52,-1127 48,-1127 48,-947 416.52,-947 416.52,-1127"/>
<text xml:space="preserve" text-anchor="start" x="170.03" y="-1085.8" font-family="Arial" font-size="20.00" fill="#eff6ff">WHOOP sync</text>
<text xml:space="preserve" text-anchor="start" x="120.45" y="-1064.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Timer + HTTP trigger, one shared gate</text>
<text xml:space="preserve" text-anchor="start" x="68.06" y="-1043.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Walks WHOOP collections into Cosmos. Timer at</text>
<text xml:space="preserve" text-anchor="start" x="167.62" y="-1025.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">00:00, 06:00, 12:00</text>
<text xml:space="preserve" text-anchor="start" x="83.01" y="-1007.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">and 18:00 UTC; /api/whoop/sync is the same</text>
<text xml:space="preserve" text-anchor="start" x="143.45" y="-989.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">work on demand, and both</text>
<text xml:space="preserve" text-anchor="start" x="82.14" y="-971.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">go through one runner holding one gate, so a</text>
</g>
<!-- dashboard -->
<g id="node2" class="node">
<title>dashboard</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="408.24,-837 56.28,-837 56.28,-657 408.24,-657 408.24,-837"/>
<text xml:space="preserve" text-anchor="start" x="159.43" y="-795.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Dashboard build</text>
<text xml:space="preserve" text-anchor="start" x="171.04" y="-774.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Timer + HTTP trigger</text>
<text xml:space="preserve" text-anchor="start" x="76.33" y="-753.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Rebuilds the running dashboard from whatever</text>
<text xml:space="preserve" text-anchor="start" x="160.55" y="-735.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">is stored: pace by run</text>
<text xml:space="preserve" text-anchor="start" x="100.53" y="-717.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">type, aerobic efficiency, weekly volume,</text>
<text xml:space="preserve" text-anchor="start" x="153.47" y="-699.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">acute:chronic workload,</text>
<text xml:space="preserve" text-anchor="start" x="85.52" y="-681.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">weekly time in zones. Timer at 00:15, 06:15,</text>
</g>
<!-- datacontainer -->
<g id="node3" class="node">
<title>datacontainer</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M1198.61,-221.9C1198.61,-231.94 1120.9,-240.1 1025.23,-240.1 929.56,-240.1 851.84,-231.94 851.84,-221.9 851.84,-221.9 851.84,-58.1 851.84,-58.1 851.84,-48.06 929.56,-39.9 1025.23,-39.9 1120.9,-39.9 1198.61,-48.06 1198.61,-58.1 1198.61,-58.1 1198.61,-221.9 1198.61,-221.9"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M1198.61,-221.9C1198.61,-211.86 1120.9,-203.7 1025.23,-203.7 929.56,-203.7 851.84,-211.86 851.84,-221.9"/>
<text xml:space="preserve" text-anchor="start" x="899.96" y="-134.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="943.91" y="-188.8" font-family="Arial" font-size="20.00" fill="#eff6ff">data</text>
<text xml:space="preserve" text-anchor="start" x="1176.6" y="-134.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="943.91" y="-167.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Anonymous blob read; the container</text>
<text xml:space="preserve" text-anchor="start" x="943.91" y="-146.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Three files, published by two</text>
<text xml:space="preserve" text-anchor="start" x="943.91" y="-128.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">different things.</text>
<text xml:space="preserve" text-anchor="start" x="943.91" y="-110.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">marathonprep.json is the built</text>
<text xml:space="preserve" text-anchor="start" x="943.91" y="-92.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">running dashboard, written by the</text>
<text xml:space="preserve" text-anchor="start" x="943.91" y="-74.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Integrations app and rewritten in</text>
</g>
<!-- user -->
<g id="node4" class="node">
<title>user</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="415.3,-547 49.21,-547 49.21,-367 415.3,-367 415.3,-547"/>
<text xml:space="preserve" text-anchor="start" x="204.47" y="-496" font-family="Arial" font-size="20.00" fill="#f8fafc">Visitor</text>
<text xml:space="preserve" text-anchor="start" x="77.59" y="-473" font-family="Arial" font-size="15.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="159.29" y="-455" font-family="Arial" font-size="15.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="69.27" y="-437" font-family="Arial" font-size="15.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
<text xml:space="preserve" text-anchor="start" x="151.38" y="-419" font-family="Arial" font-size="15.00" fill="#c2f0c2">can be renewed forever,</text>
<text xml:space="preserve" text-anchor="start" x="94.26" y="-401" font-family="Arial" font-size="15.00" fill="#c2f0c2">but only a human can create the first one.</text>
</g>
<!-- running -->
<g id="node5" class="node">
<title>running</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="406.89,-234.83 57.62,-234.83 57.62,-45.17 406.89,-45.17 406.89,-234.83"/>
<text xml:space="preserve" text-anchor="start" x="105.74" y="-134.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="149.69" y="-188.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">run.nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="384.88" y="-134.4" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="149.69" y="-167.8" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="149.69" y="-146.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevrun — the running and</text>
<text xml:space="preserve" text-anchor="start" x="149.69" y="-128.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">marathon dashboard. Provisioned</text>
<text xml:space="preserve" text-anchor="start" x="149.69" y="-110.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">empty by</text>
<text xml:space="preserve" text-anchor="start" x="149.69" y="-92.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">terraform; content deployed from</text>
<text xml:space="preserve" text-anchor="start" x="149.69" y="-74.2" font-family="Arial" font-size="15.00" fill="#b6ecf7">the nygdevweb repository.</text>
</g>
<!-- whoop -->
<g id="node6" class="node">
<title>whoop</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1197.46,-1447 852.99,-1447 852.99,-1267 1197.46,-1267 1197.46,-1447"/>
<text xml:space="preserve" text-anchor="start" x="986.34" y="-1405.8" font-family="Arial" font-size="20.00" fill="#f8fafc">WHOOP</text>
<text xml:space="preserve" text-anchor="start" x="915.96" y="-1384.8" font-family="Arial" font-size="13.00" fill="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</text>
<text xml:space="preserve" text-anchor="start" x="874.73" y="-1363.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">Wearable platform, read&#45;only to us and gated</text>
<text xml:space="preserve" text-anchor="start" x="943.51" y="-1345.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">by an authorization code</text>
<text xml:space="preserve" text-anchor="start" x="873.05" y="-1327.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">grant. A person consents once and that yields</text>
<text xml:space="preserve" text-anchor="start" x="952.69" y="-1309.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">a refresh token; every</text>
<text xml:space="preserve" text-anchor="start" x="892.24" y="-1291.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">refresh then rotates it, killing the old one</text>
</g>
<!-- keyvault -->
<g id="node7" class="node">
<title>keyvault</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M1205.27,-1138.9C1205.27,-1148.94 1124.57,-1157.1 1025.23,-1157.1 925.88,-1157.1 845.19,-1148.94 845.19,-1138.9 845.19,-1138.9 845.19,-975.1 845.19,-975.1 845.19,-965.06 925.88,-956.9 1025.23,-956.9 1124.57,-956.9 1205.27,-965.06 1205.27,-975.1 1205.27,-975.1 1205.27,-1138.9 1205.27,-1138.9"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M1205.27,-1138.9C1205.27,-1128.86 1124.57,-1120.7 1025.23,-1120.7 925.88,-1120.7 845.19,-1128.86 845.19,-1138.9"/>
<text xml:space="preserve" text-anchor="start" x="893.31" y="-1051.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="937.25" y="-1105.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Key Vault</text>
<text xml:space="preserve" text-anchor="start" x="1183.26" y="-1051.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="937.25" y="-1084.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Key Vault — standard, RBAC</text>
<text xml:space="preserve" text-anchor="start" x="937.25" y="-1063.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev, in rg&#45;nygdev&#45;security.</text>
<text xml:space="preserve" text-anchor="start" x="937.25" y="-1045.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Holds whoop&#45;clientsecret, copied in</text>
<text xml:space="preserve" text-anchor="start" x="937.25" y="-1027.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">by</text>
<text xml:space="preserve" text-anchor="start" x="937.25" y="-1009.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">hand from the WHOOP developer</text>
<text xml:space="preserve" text-anchor="start" x="937.25" y="-991.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">dashboard, and whoop&#45;token.</text>
</g>
<!-- cosmos -->
<g id="node8" class="node">
<title>cosmos</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M1210.28,-828.9C1210.28,-838.94 1127.34,-847.1 1025.23,-847.1 923.12,-847.1 840.18,-838.94 840.18,-828.9 840.18,-828.9 840.18,-665.1 840.18,-665.1 840.18,-655.06 923.12,-646.9 1025.23,-646.9 1127.34,-646.9 1210.28,-655.06 1210.28,-665.1 1210.28,-665.1 1210.28,-828.9 1210.28,-828.9"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M1210.28,-828.9C1210.28,-818.86 1127.34,-810.7 1025.23,-810.7 923.12,-810.7 840.18,-818.86 840.18,-828.9"/>
<text xml:space="preserve" text-anchor="start" x="888.3" y="-741.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="932.24" y="-795.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Cosmos DB</text>
<text xml:space="preserve" text-anchor="start" x="1188.27" y="-741.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="932.24" y="-774.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</text>
<text xml:space="preserve" text-anchor="start" x="932.24" y="-753.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev&#45;cosmos&#45;db / db, one account</text>
<text xml:space="preserve" text-anchor="start" x="932.24" y="-735.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">holding three containers that share</text>
<text xml:space="preserve" text-anchor="start" x="932.24" y="-717.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">nothing but the throughput. Local</text>
<text xml:space="preserve" text-anchor="start" x="932.24" y="-699.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">auth is off, so Entra role</text>
<text xml:space="preserve" text-anchor="start" x="932.24" y="-681.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">assignments</text>
</g>
<!-- sync&#45;&gt;whoop -->
<g id="edge3" class="edge">
<title>sync&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M416.21,-1111.02C544.64,-1162.98 715.61,-1232.14 843.54,-1283.9"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="842.31,-1286.24 850.25,-1286.61 844.28,-1281.37 842.31,-1286.24"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="500.44,-1244.36 500.44,-1283.96 756.26,-1283.96 756.26,-1244.36 500.44,-1244.36"/>
<text xml:space="preserve" text-anchor="start" x="503.44" y="-1266.96" font-family="Arial" font-size="14.00" fill="#c9c9c9">Refreshes the access token, then pages</text>
<text xml:space="preserve" text-anchor="start" x="503.44" y="-1250.16" font-family="Arial" font-size="14.00" fill="#c9c9c9">cycles, sleep, workouts and recovery</text>
</g>
<!-- sync&#45;&gt;keyvault -->
<g id="edge4" class="edge">
<title>sync&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M416.21,-1041.63C541.5,-1044.79 707.26,-1048.99 834.06,-1052.19"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="833.69,-1054.81 841.25,-1052.37 833.82,-1049.56 833.69,-1054.81"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="509.78,-1049.96 509.78,-1089.56 746.91,-1089.56 746.91,-1049.96 509.78,-1049.96"/>
<text xml:space="preserve" text-anchor="start" x="512.78" y="-1072.56" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads whoop&#45;clientsecret; reads and</text>
<text xml:space="preserve" text-anchor="start" x="512.78" y="-1055.76" font-family="Arial" font-size="14.00" fill="#c9c9c9">rewrites the rotating whoop&#45;token</text>
</g>
<!-- sync&#45;&gt;cosmos -->
<g id="edge5" class="edge">
<title>sync&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M416.21,-969.92C540.07,-924.51 703.48,-864.6 829.7,-818.32"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="830.51,-820.82 836.65,-815.77 828.7,-815.89 830.51,-820.82"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="491.52,-934.92 491.52,-974.52 765.18,-974.52 765.18,-934.92 491.52,-934.92"/>
<text xml:space="preserve" text-anchor="start" x="494.52" y="-957.52" font-family="Arial" font-size="14.00" fill="#c9c9c9">Upserts each record on its WHOOP id, and</text>
<text xml:space="preserve" text-anchor="start" x="494.52" y="-940.72" font-family="Arial" font-size="14.00" fill="#c9c9c9">one sync cursor per collection</text>
</g>
<!-- dashboard&#45;&gt;datacontainer -->
<g id="edge7" class="edge">
<title>dashboard&#45;&gt;datacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M376.53,-657.2C403.45,-639.41 431.11,-620.5 456.52,-602 615.41,-486.26 789.57,-341.7 902.53,-245.41"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="903.91,-247.68 907.92,-240.81 900.51,-243.68 903.91,-247.68"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="507.07,-566.75 507.07,-606.35 749.62,-606.35 749.62,-566.75 507.07,-566.75"/>
<text xml:space="preserve" text-anchor="start" x="510.07" y="-589.35" font-family="Arial" font-size="14.00" fill="#c9c9c9">Publishes marathonprep.json (PUT, in</text>
<text xml:space="preserve" text-anchor="start" x="510.07" y="-572.55" font-family="Arial" font-size="14.00" fill="#c9c9c9">place)</text>
</g>
<!-- dashboard&#45;&gt;cosmos -->
<g id="edge6" class="edge">
<title>dashboard&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M408.17,-730.38C436.03,-728.31 464.54,-726.53 491.52,-725.4 613.04,-720.33 643.65,-720.34 765.18,-725.4 785.9,-726.26 807.54,-727.51 829.09,-728.98"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="828.64,-731.58 836.3,-729.48 829,-726.34 828.64,-731.58"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="494.22,-725.4 494.22,-765 762.47,-765 762.47,-725.4 494.22,-725.4"/>
<text xml:space="preserve" text-anchor="start" x="497.22" y="-748" font-family="Arial" font-size="14.00" fill="#c9c9c9">Queries the scored running workouts back</text>
<text xml:space="preserve" text-anchor="start" x="497.22" y="-731.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">out (the only query in the model)</text>
</g>
<!-- user&#45;&gt;running -->
<g id="edge1" class="edge">
<title>user&#45;&gt;running</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M232.26,-367.15C232.26,-329.16 232.26,-284.65 232.26,-245.14"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="234.88,-245.21 232.26,-237.71 229.63,-245.21 234.88,-245.21"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="128.48,-289.52 128.48,-312.32 307.23,-312.32 307.23,-289.52 128.48,-289.52"/>
<text xml:space="preserve" text-anchor="start" x="131.48" y="-295.32" font-family="Arial" font-size="14.00" fill="#c9c9c9">Visits https://run.nygard.dev</text>
</g>
<!-- running&#45;&gt;datacontainer -->
<g id="edge2" class="edge">
<title>running&#45;&gt;datacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M406.84,-140C535.24,-140 709.78,-140 840.53,-140"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="840.52,-142.63 848.02,-140 840.52,-137.38 840.52,-142.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="511.34,-140 511.34,-179.6 745.36,-179.6 745.36,-140 511.34,-140"/>
<text xml:space="preserve" text-anchor="start" x="514.34" y="-162.6" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fetches the built dashboard from the</text>
<text xml:space="preserve" text-anchor="start" x="514.34" y="-145.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">page (GET data/marathonprep.json)</text>
</g>
</g>
</svg>
`;case`runningPipeline`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3124pt" height="948pt"
 viewBox="0.00 0.00 3124.00 948.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 932.91)">
<!-- sync -->
<g id="node1" class="node">
<title>sync</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="1194.64,-917.86 826.12,-917.86 826.12,-737.86 1194.64,-737.86 1194.64,-917.86"/>
<text xml:space="preserve" text-anchor="start" x="948.15" y="-876.66" font-family="Arial" font-size="20.00" fill="#eff6ff">WHOOP sync</text>
<text xml:space="preserve" text-anchor="start" x="898.57" y="-855.66" font-family="Arial" font-size="13.00" fill="#bfdbfe">Timer + HTTP trigger, one shared gate</text>
<text xml:space="preserve" text-anchor="start" x="846.18" y="-834.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">Walks WHOOP collections into Cosmos. Timer at</text>
<text xml:space="preserve" text-anchor="start" x="945.74" y="-816.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">00:00, 06:00, 12:00</text>
<text xml:space="preserve" text-anchor="start" x="861.13" y="-798.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">and 18:00 UTC; /api/whoop/sync is the same</text>
<text xml:space="preserve" text-anchor="start" x="921.57" y="-780.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">work on demand, and both</text>
<text xml:space="preserve" text-anchor="start" x="860.26" y="-762.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">go through one runner holding one gate, so a</text>
</g>
<!-- keyvault -->
<g id="node2" class="node">
<title>keyvault</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M422.42,-554.06C422.42,-564.11 341.72,-572.26 242.38,-572.26 143.03,-572.26 62.34,-564.11 62.34,-554.06 62.34,-554.06 62.34,-390.26 62.34,-390.26 62.34,-380.22 143.03,-372.06 242.38,-372.06 341.72,-372.06 422.42,-380.22 422.42,-390.26 422.42,-390.26 422.42,-554.06 422.42,-554.06"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M422.42,-554.06C422.42,-544.02 341.72,-535.86 242.38,-535.86 143.03,-535.86 62.34,-544.02 62.34,-554.06"/>
<text xml:space="preserve" text-anchor="start" x="110.46" y="-466.56" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="154.4" y="-520.96" font-family="Arial" font-size="20.00" fill="#eff6ff">Key Vault</text>
<text xml:space="preserve" text-anchor="start" x="400.41" y="-466.56" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="154.4" y="-499.96" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Key Vault — standard, RBAC</text>
<text xml:space="preserve" text-anchor="start" x="154.4" y="-478.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev, in rg&#45;nygdev&#45;security.</text>
<text xml:space="preserve" text-anchor="start" x="154.4" y="-460.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">Holds whoop&#45;clientsecret, copied in</text>
<text xml:space="preserve" text-anchor="start" x="154.4" y="-442.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">by</text>
<text xml:space="preserve" text-anchor="start" x="154.4" y="-424.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">hand from the WHOOP developer</text>
<text xml:space="preserve" text-anchor="start" x="154.4" y="-406.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">dashboard, and whoop&#45;token.</text>
</g>
<!-- whoop -->
<g id="node3" class="node">
<title>whoop</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1376.61,-562.16 1032.14,-562.16 1032.14,-382.16 1376.61,-382.16 1376.61,-562.16"/>
<text xml:space="preserve" text-anchor="start" x="1165.49" y="-520.96" font-family="Arial" font-size="20.00" fill="#f8fafc">WHOOP</text>
<text xml:space="preserve" text-anchor="start" x="1095.11" y="-499.96" font-family="Arial" font-size="13.00" fill="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</text>
<text xml:space="preserve" text-anchor="start" x="1053.88" y="-478.36" font-family="Arial" font-size="15.00" fill="#cbd5e1">Wearable platform, read&#45;only to us and gated</text>
<text xml:space="preserve" text-anchor="start" x="1122.65" y="-460.36" font-family="Arial" font-size="15.00" fill="#cbd5e1">by an authorization code</text>
<text xml:space="preserve" text-anchor="start" x="1052.2" y="-442.36" font-family="Arial" font-size="15.00" fill="#cbd5e1">grant. A person consents once and that yields</text>
<text xml:space="preserve" text-anchor="start" x="1131.84" y="-424.36" font-family="Arial" font-size="15.00" fill="#cbd5e1">a refresh token; every</text>
<text xml:space="preserve" text-anchor="start" x="1071.39" y="-406.36" font-family="Arial" font-size="15.00" fill="#cbd5e1">refresh then rotates it, killing the old one</text>
</g>
<!-- dashboard -->
<g id="node4" class="node">
<title>dashboard</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="2821.36,-917.86 2469.4,-917.86 2469.4,-737.86 2821.36,-737.86 2821.36,-917.86"/>
<text xml:space="preserve" text-anchor="start" x="2572.55" y="-876.66" font-family="Arial" font-size="20.00" fill="#eff6ff">Dashboard build</text>
<text xml:space="preserve" text-anchor="start" x="2584.16" y="-855.66" font-family="Arial" font-size="13.00" fill="#bfdbfe">Timer + HTTP trigger</text>
<text xml:space="preserve" text-anchor="start" x="2489.45" y="-834.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">Rebuilds the running dashboard from whatever</text>
<text xml:space="preserve" text-anchor="start" x="2573.67" y="-816.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">is stored: pace by run</text>
<text xml:space="preserve" text-anchor="start" x="2513.65" y="-798.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">type, aerobic efficiency, weekly volume,</text>
<text xml:space="preserve" text-anchor="start" x="2566.59" y="-780.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">acute:chronic workload,</text>
<text xml:space="preserve" text-anchor="start" x="2498.64" y="-762.06" font-family="Arial" font-size="15.00" fill="#bfdbfe">weekly time in zones. Timer at 00:15, 06:15,</text>
</g>
<!-- cosmos -->
<g id="node5" class="node">
<title>cosmos</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M2161.43,-554.06C2161.43,-564.11 2078.49,-572.26 1976.38,-572.26 1874.27,-572.26 1791.33,-564.11 1791.33,-554.06 1791.33,-554.06 1791.33,-390.26 1791.33,-390.26 1791.33,-380.22 1874.27,-372.06 1976.38,-372.06 2078.49,-372.06 2161.43,-380.22 2161.43,-390.26 2161.43,-390.26 2161.43,-554.06 2161.43,-554.06"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M2161.43,-554.06C2161.43,-544.02 2078.49,-535.86 1976.38,-535.86 1874.27,-535.86 1791.33,-544.02 1791.33,-554.06"/>
<text xml:space="preserve" text-anchor="start" x="1839.45" y="-466.56" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1883.39" y="-520.96" font-family="Arial" font-size="20.00" fill="#eff6ff">Cosmos DB</text>
<text xml:space="preserve" text-anchor="start" x="2139.42" y="-466.56" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1883.39" y="-499.96" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Cosmos DB (NoSQL) — free tier</text>
<text xml:space="preserve" text-anchor="start" x="1883.39" y="-478.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev&#45;cosmos&#45;db / db, one account</text>
<text xml:space="preserve" text-anchor="start" x="1883.39" y="-460.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">holding three containers that share</text>
<text xml:space="preserve" text-anchor="start" x="1883.39" y="-442.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">nothing but the throughput. Local</text>
<text xml:space="preserve" text-anchor="start" x="1883.39" y="-424.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">auth is off, so Entra role</text>
<text xml:space="preserve" text-anchor="start" x="1883.39" y="-406.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">assignments</text>
</g>
<!-- datacontainer -->
<g id="node6" class="node">
<title>datacontainer</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M3093.76,-554.06C3093.76,-564.11 3016.05,-572.26 2920.38,-572.26 2824.71,-572.26 2746.99,-564.11 2746.99,-554.06 2746.99,-554.06 2746.99,-390.26 2746.99,-390.26 2746.99,-380.22 2824.71,-372.06 2920.38,-372.06 3016.05,-372.06 3093.76,-380.22 3093.76,-390.26 3093.76,-390.26 3093.76,-554.06 3093.76,-554.06"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M3093.76,-554.06C3093.76,-544.02 3016.05,-535.86 2920.38,-535.86 2824.71,-535.86 2746.99,-544.02 2746.99,-554.06"/>
<text xml:space="preserve" text-anchor="start" x="2795.11" y="-466.56" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2839.06" y="-520.96" font-family="Arial" font-size="20.00" fill="#eff6ff">data</text>
<text xml:space="preserve" text-anchor="start" x="3071.75" y="-466.56" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2839.06" y="-499.96" font-family="Arial" font-size="13.00" fill="#bfdbfe">Anonymous blob read; the container</text>
<text xml:space="preserve" text-anchor="start" x="2839.06" y="-478.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">Three files, published by two</text>
<text xml:space="preserve" text-anchor="start" x="2839.06" y="-460.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">different things.</text>
<text xml:space="preserve" text-anchor="start" x="2839.06" y="-442.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">marathonprep.json is the built</text>
<text xml:space="preserve" text-anchor="start" x="2839.06" y="-424.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">running dashboard, written by the</text>
<text xml:space="preserve" text-anchor="start" x="2839.06" y="-406.36" font-family="Arial" font-size="15.00" fill="#bfdbfe">Integrations app and rewritten in</text>
</g>
<!-- user -->
<g id="node7" class="node">
<title>user</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="2637.42,-562.16 2271.33,-562.16 2271.33,-382.16 2637.42,-382.16 2637.42,-562.16"/>
<text xml:space="preserve" text-anchor="start" x="2426.6" y="-511.16" font-family="Arial" font-size="20.00" fill="#f8fafc">Visitor</text>
<text xml:space="preserve" text-anchor="start" x="2299.71" y="-488.16" font-family="Arial" font-size="15.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="2381.41" y="-470.16" font-family="Arial" font-size="15.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="2291.39" y="-452.16" font-family="Arial" font-size="15.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
<text xml:space="preserve" text-anchor="start" x="2373.5" y="-434.16" font-family="Arial" font-size="15.00" fill="#c2f0c2">can be renewed forever,</text>
<text xml:space="preserve" text-anchor="start" x="2316.38" y="-416.16" font-family="Arial" font-size="15.00" fill="#c2f0c2">but only a human can create the first one.</text>
</g>
<!-- running -->
<g id="node8" class="node">
<title>running</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2809.01,-189.66 2459.74,-189.66 2459.74,0 2809.01,0 2809.01,-189.66"/>
<text xml:space="preserve" text-anchor="start" x="2507.86" y="-89.23" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2551.81" y="-143.63" font-family="Arial" font-size="20.00" fill="#f0f9ff">run.nygard.dev</text>
<text xml:space="preserve" text-anchor="start" x="2787" y="-89.23" font-family="Arial" font-size="14.00" fill="#f0f9ff"> </text>
<text xml:space="preserve" text-anchor="start" x="2551.81" y="-122.63" font-family="Arial" font-size="13.00" fill="#b6ecf7">Azure Static Web App — Free SKU,</text>
<text xml:space="preserve" text-anchor="start" x="2551.81" y="-101.03" font-family="Arial" font-size="15.00" fill="#b6ecf7">nygdevrun — the running and</text>
<text xml:space="preserve" text-anchor="start" x="2551.81" y="-83.03" font-family="Arial" font-size="15.00" fill="#b6ecf7">marathon dashboard. Provisioned</text>
<text xml:space="preserve" text-anchor="start" x="2551.81" y="-65.03" font-family="Arial" font-size="15.00" fill="#b6ecf7">empty by</text>
<text xml:space="preserve" text-anchor="start" x="2551.81" y="-47.03" font-family="Arial" font-size="15.00" fill="#b6ecf7">terraform; content deployed from</text>
<text xml:space="preserve" text-anchor="start" x="2551.81" y="-29.03" font-family="Arial" font-size="15.00" fill="#b6ecf7">the nygdevweb repository.</text>
</g>
<!-- sync&#45;&gt;keyvault -->
<g id="edge1" class="edge">
<title>sync&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M826.32,-826.74C568.12,-822.2 118.4,-796.87 15.9,-677.86 -18.45,-637.99 7.92,-598.26 53.07,-564.55"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="54.39,-566.83 58.94,-560.32 51.32,-562.57 54.39,-566.83"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="18.9,-635.26 18.9,-674.86 42.9,-674.86 42.9,-635.26 18.9,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="27" y="-651.86" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">0</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="45.9,-635.26 45.9,-674.86 306.38,-674.86 306.38,-635.26 45.9,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="48.9" y="-657.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads whoop&#45;clientsecret and the stored</text>
<text xml:space="preserve" text-anchor="start" x="135.28" y="-641.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">refresh token</text>
</g>
<!-- sync&#45;&gt;keyvault -->
<g id="edge4" class="edge">
<title>sync&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M826.35,-791.2C726.42,-767.43 602.78,-730.71 500.61,-677.86 449.66,-651.51 399.01,-614.41 356.24,-579.01"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="358.11,-577.15 350.67,-574.36 354.75,-581.18 358.11,-577.15"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="503.61,-635.26 503.61,-674.86 527.61,-674.86 527.61,-635.26 503.61,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="511.71" y="-651.86" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="530.61,-635.26 530.61,-674.86 751.38,-674.86 751.38,-635.26 530.61,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="533.61" y="-657.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">Writes the replacement, before the</text>
<text xml:space="preserve" text-anchor="start" x="537.49" y="-641.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">access token is used for anything</text>
</g>
<!-- sync&#45;&gt;whoop -->
<g id="edge2" class="edge">
<title>sync&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M826.42,-738.12C788.23,-707.58 766.68,-671.19 793.35,-632.26 844.99,-556.9 937.87,-517.23 1022.29,-496.34"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1022.65,-498.96 1029.33,-494.66 1021.43,-493.85 1022.65,-498.96"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="796.35,-635.26 796.35,-674.86 820.35,-674.86 820.35,-635.26 796.35,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="804.46" y="-651.86" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="823.35,-635.26 823.35,-674.86 1064.38,-674.86 1064.38,-635.26 823.35,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="826.35" y="-657.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">refresh_token grant, re&#45;requesting the</text>
<text xml:space="preserve" text-anchor="start" x="904.56" y="-641.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">offline scope</text>
</g>
<!-- sync&#45;&gt;whoop -->
<g id="edge3" class="edge">
<title>sync&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1063.99,-729.11C1092.68,-676.81 1127.75,-612.88 1155.65,-562"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1061.84,-727.57 1060.54,-735.41 1066.45,-730.1 1061.84,-727.57"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1116.2,-635.26 1116.2,-674.86 1140.2,-674.86 1140.2,-635.26 1116.2,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="1124.3" y="-651.86" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1143.2,-635.26 1143.2,-674.86 1398.24,-674.86 1398.24,-635.26 1143.2,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="1163.32" y="-657.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">A new access token, and a rotated</text>
<text xml:space="preserve" text-anchor="start" x="1146.2" y="-641.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">refresh token — the old one is now dead</text>
</g>
<!-- sync&#45;&gt;whoop -->
<g id="edge5" class="edge">
<title>sync&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1194.37,-809.24C1280.32,-790.72 1375.21,-753.26 1428.38,-677.86 1459.1,-634.3 1430.54,-593.2 1384.78,-559.42"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1386.45,-557.39 1378.82,-555.17 1383.4,-561.66 1386.45,-557.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1444.14,-635.26 1444.14,-674.86 1468.14,-674.86 1468.14,-635.26 1444.14,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="1452.25" y="-651.86" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1471.14,-635.26 1471.14,-674.86 1691.92,-674.86 1691.92,-635.26 1471.14,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="1474.14" y="-657.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">Pages cycles, sleep, workouts and</text>
<text xml:space="preserve" text-anchor="start" x="1488.94" y="-641.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">recovery, 25 records at a time</text>
</g>
<!-- sync&#45;&gt;cosmos -->
<g id="edge6" class="edge">
<title>sync&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1194.56,-812.27C1342.95,-794.98 1553.89,-757.66 1722.38,-677.86 1774.42,-653.22 1825.19,-615.86 1867.49,-579.78"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1869.02,-581.92 1872.99,-575.03 1865.59,-577.94 1869.02,-581.92"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1802.11,-635.26 1802.11,-674.86 1826.11,-674.86 1826.11,-635.26 1802.11,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="1810.22" y="-651.86" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1829.11,-635.26 1829.11,-674.86 2075.52,-674.86 2075.52,-635.26 1829.11,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="1832.11" y="-657.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">Upserts each record on its WHOOP id,</text>
<text xml:space="preserve" text-anchor="start" x="1885.39" y="-641.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">then saves the cursor</text>
</g>
<!-- dashboard&#45;&gt;cosmos -->
<g id="edge7" class="edge">
<title>dashboard&#45;&gt;cosmos</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2480.72,-738.03C2418.64,-704.68 2347.35,-666.57 2282.38,-632.26 2244.1,-612.06 2203.05,-590.58 2163.83,-570.15"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2165.52,-568.07 2157.65,-566.94 2163.09,-572.73 2165.52,-568.07"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2365.11,-635.26 2365.11,-674.86 2389.11,-674.86 2389.11,-635.26 2365.11,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="2373.22" y="-651.86" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2392.11,-635.26 2392.11,-674.86 2601.99,-674.86 2601.99,-635.26 2392.11,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="2395.11" y="-657.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">Fifteen minutes later: queries the</text>
<text xml:space="preserve" text-anchor="start" x="2420.79" y="-641.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">scored running workouts</text>
</g>
<!-- dashboard&#45;&gt;datacontainer -->
<g id="edge8" class="edge">
<title>dashboard&#45;&gt;datacontainer</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2714.42,-738.07C2751.34,-690.58 2797.11,-631.71 2836.12,-581.54"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2838.18,-583.17 2840.71,-575.63 2834.03,-579.94 2838.18,-583.17"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2794.12,-635.26 2794.12,-674.86 2818.12,-674.86 2818.12,-635.26 2794.12,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="2802.23" y="-651.86" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2821.12,-635.26 2821.12,-674.86 3052.81,-674.86 3052.81,-635.26 2821.12,-635.26"/>
<text xml:space="preserve" text-anchor="start" x="2824.12" y="-657.86" font-family="Arial" font-size="14.00" fill="#c9c9c9">Publishes marathonprep.json, with a</text>
<text xml:space="preserve" text-anchor="start" x="2857.99" y="-641.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">five&#45;minute cache lifetime</text>
</g>
<!-- datacontainer&#45;&gt;running -->
<g id="edge10" class="edge">
<title>datacontainer&#45;&gt;running</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2839.29,-363.06C2812.08,-326.93 2781.51,-286.49 2753.38,-249.66 2738.52,-230.21 2722.53,-209.44 2707.25,-189.65"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2836.98,-364.35 2843.58,-368.76 2841.17,-361.19 2836.98,-364.35"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2802.48,-252.66 2802.48,-309.06 2826.48,-309.06 2826.48,-252.66 2802.48,-252.66"/>
<text xml:space="preserve" text-anchor="start" x="2810.59" y="-277.66" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">9</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2829.48,-252.66 2829.48,-309.06 3086.07,-309.06 3086.07,-252.66 2829.48,-252.66"/>
<text xml:space="preserve" text-anchor="start" x="2839.48" y="-292.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">The page fetches the published JSON</text>
<text xml:space="preserve" text-anchor="start" x="2832.48" y="-275.26" font-family="Arial" font-size="14.00" fill="#c9c9c9">directly — anonymous, no function in the</text>
<text xml:space="preserve" text-anchor="start" x="2944.15" y="-258.46" font-family="Arial" font-size="14.00" fill="#c9c9c9">path</text>
</g>
<!-- user&#45;&gt;running -->
<g id="edge9" class="edge">
<title>user&#45;&gt;running</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2453.7,-382.27C2456.49,-340.25 2464.47,-290.47 2484.37,-249.66 2493.36,-231.22 2505.41,-213.6 2518.79,-197.31"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2520.67,-199.15 2523.51,-191.73 2516.66,-195.76 2520.67,-199.15"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2487.37,-264.46 2487.37,-297.26 2511.37,-297.26 2511.37,-264.46 2487.37,-264.46"/>
<text xml:space="preserve" text-anchor="start" x="2495.47" y="-277.66" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2514.37,-264.46 2514.37,-297.26 2727.38,-297.26 2727.38,-264.46 2514.37,-264.46"/>
<text xml:space="preserve" text-anchor="start" x="2517.37" y="-275.26" font-family="Arial" font-size="14.00" fill="#c9c9c9">Opens run.nygard.dev, whenever</text>
</g>
</g>
</svg>
`;case`whoopRefresh`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="2171pt" height="576pt"
 viewBox="0.00 0.00 2171.00 576.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 560.85)">
<!-- integrations -->
<g id="node1" class="node">
<title>integrations</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="1183.16,-545.8 833.03,-545.8 833.03,-365.8 1183.16,-365.8 1183.16,-545.8"/>
<text xml:space="preserve" text-anchor="start" x="881.15" y="-450.2" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="925.1" y="-504.6" font-family="Arial" font-size="20.00" fill="#eff6ff">Integrations</text>
<text xml:space="preserve" text-anchor="start" x="1161.15" y="-450.2" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="925.1" y="-483.6" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="925.1" y="-462" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;integrations.</text>
<text xml:space="preserve" text-anchor="start" x="925.1" y="-444" font-family="Arial" font-size="15.00" fill="#bfdbfe">Everything that feeds the estate</text>
<text xml:space="preserve" text-anchor="start" x="925.1" y="-426" font-family="Arial" font-size="15.00" fill="#bfdbfe">from outside</text>
<text xml:space="preserve" text-anchor="start" x="925.1" y="-408" font-family="Arial" font-size="15.00" fill="#bfdbfe">it, split off from the API so that</text>
<text xml:space="preserve" text-anchor="start" x="925.1" y="-390" font-family="Arial" font-size="15.00" fill="#bfdbfe">app could have its gate turned on.</text>
</g>
<!-- keyvault -->
<g id="node2" class="node">
<title>keyvault</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M425.14,-182C425.14,-192.04 344.44,-200.2 245.09,-200.2 145.75,-200.2 65.05,-192.04 65.05,-182 65.05,-182 65.05,-18.2 65.05,-18.2 65.05,-8.16 145.75,0 245.09,0 344.44,0 425.14,-8.16 425.14,-18.2 425.14,-18.2 425.14,-182 425.14,-182"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M425.14,-182C425.14,-171.96 344.44,-163.8 245.09,-163.8 145.75,-163.8 65.05,-171.96 65.05,-182"/>
<text xml:space="preserve" text-anchor="start" x="113.17" y="-94.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="157.12" y="-148.9" font-family="Arial" font-size="20.00" fill="#eff6ff">Key Vault</text>
<text xml:space="preserve" text-anchor="start" x="403.13" y="-94.5" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="157.12" y="-127.9" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Key Vault — standard, RBAC</text>
<text xml:space="preserve" text-anchor="start" x="157.12" y="-106.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev, in rg&#45;nygdev&#45;security.</text>
<text xml:space="preserve" text-anchor="start" x="157.12" y="-88.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">Holds whoop&#45;clientsecret, copied in</text>
<text xml:space="preserve" text-anchor="start" x="157.12" y="-70.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">by</text>
<text xml:space="preserve" text-anchor="start" x="157.12" y="-52.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">hand from the WHOOP developer</text>
<text xml:space="preserve" text-anchor="start" x="157.12" y="-34.3" font-family="Arial" font-size="15.00" fill="#bfdbfe">dashboard, and whoop&#45;token.</text>
</g>
<!-- whoop -->
<g id="node3" class="node">
<title>whoop</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1577.33,-190.1 1232.86,-190.1 1232.86,-10.1 1577.33,-10.1 1577.33,-190.1"/>
<text xml:space="preserve" text-anchor="start" x="1366.21" y="-148.9" font-family="Arial" font-size="20.00" fill="#f8fafc">WHOOP</text>
<text xml:space="preserve" text-anchor="start" x="1295.82" y="-127.9" font-family="Arial" font-size="13.00" fill="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</text>
<text xml:space="preserve" text-anchor="start" x="1254.59" y="-106.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">Wearable platform, read&#45;only to us and gated</text>
<text xml:space="preserve" text-anchor="start" x="1323.37" y="-88.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">by an authorization code</text>
<text xml:space="preserve" text-anchor="start" x="1252.92" y="-70.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">grant. A person consents once and that yields</text>
<text xml:space="preserve" text-anchor="start" x="1332.56" y="-52.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">a refresh token; every</text>
<text xml:space="preserve" text-anchor="start" x="1272.1" y="-34.3" font-family="Arial" font-size="15.00" fill="#cbd5e1">refresh then rotates it, killing the old one</text>
</g>
<!-- integrations&#45;&gt;keyvault -->
<g id="edge1" class="edge">
<title>integrations&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M833.24,-454.76C577.2,-450.55 119.37,-425.91 15.95,-305.8 -19.17,-265.01 9,-224.57 56.02,-190.54"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="57.25,-192.89 61.89,-186.44 54.24,-188.59 57.25,-192.89"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="18.95,-263.2 18.95,-302.8 42.95,-302.8 42.95,-263.2 18.95,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="27.06" y="-279.8" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">0</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="45.95,-263.2 45.95,-302.8 311.09,-302.8 311.09,-263.2 45.95,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="48.95" y="-285.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads whoop&#45;clientsecret and the current</text>
<text xml:space="preserve" text-anchor="start" x="138.44" y="-269" font-family="Arial" font-size="14.00" fill="#c9c9c9">whoop&#45;token</text>
</g>
<!-- integrations&#45;&gt;keyvault -->
<g id="edge4" class="edge">
<title>integrations&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M833.16,-420.34C733.32,-396.5 607.87,-359.31 504.54,-305.8 453.46,-279.35 402.6,-242.22 359.61,-206.83"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="361.46,-204.95 354.01,-202.18 358.11,-208.99 361.46,-204.95"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="507.54,-263.2 507.54,-302.8 531.54,-302.8 531.54,-263.2 507.54,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="515.65" y="-279.8" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="534.54,-263.2 534.54,-302.8 749.09,-302.8 749.09,-263.2 534.54,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="537.54" y="-285.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Writes the rotated token as a new</text>
<text xml:space="preserve" text-anchor="start" x="569.44" y="-269" font-family="Arial" font-size="14.00" fill="#c9c9c9">version of whoop&#45;token</text>
</g>
<!-- integrations&#45;&gt;whoop -->
<g id="edge2" class="edge">
<title>integrations&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M833.09,-372.23C788.32,-339.9 760.64,-300.82 792.07,-260.2 844.7,-192.16 1062.02,-147.86 1223.04,-123.69"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1223.05,-126.34 1230.08,-122.64 1222.28,-121.15 1223.05,-126.34"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="795.07,-263.2 795.07,-302.8 819.07,-302.8 819.07,-263.2 795.07,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="803.18" y="-279.8" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="822.07,-263.2 822.07,-302.8 1063.09,-302.8 1063.09,-263.2 822.07,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="825.07" y="-285.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">refresh_token grant, re&#45;requesting the</text>
<text xml:space="preserve" text-anchor="start" x="903.28" y="-269" font-family="Arial" font-size="14.00" fill="#c9c9c9">offline scope</text>
</g>
<!-- integrations&#45;&gt;whoop -->
<g id="edge3" class="edge">
<title>integrations&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1086.04,-358.28C1114.36,-325.62 1147.58,-289.93 1180.74,-260.2 1208.02,-235.73 1239.11,-211.64 1269.28,-189.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1084.21,-356.38 1081.3,-363.78 1088.18,-359.81 1084.21,-356.38"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1183.74,-263.2 1183.74,-302.8 1207.74,-302.8 1207.74,-263.2 1183.74,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="1191.84" y="-279.8" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1210.74,-263.2 1210.74,-302.8 1468.09,-302.8 1468.09,-263.2 1210.74,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="1213.74" y="-285.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">New access token, and a rotated refresh</text>
<text xml:space="preserve" text-anchor="start" x="1238.62" y="-269" font-family="Arial" font-size="14.00" fill="#c9c9c9">token — the old one is now dead</text>
</g>
<!-- integrations&#45;&gt;whoop -->
<g id="edge5" class="edge">
<title>integrations&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1183.12,-423.74C1306.49,-397.86 1456.22,-357.03 1494.09,-305.8 1517.78,-273.77 1508.09,-234.46 1488.02,-198.88"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1490.33,-197.64 1484.25,-192.53 1485.82,-200.32 1490.33,-197.64"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1510.96,-266.6 1510.96,-299.4 1534.96,-299.4 1534.96,-266.6 1510.96,-266.6"/>
<text xml:space="preserve" text-anchor="start" x="1519.07" y="-279.8" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1537.96,-266.6 1537.96,-299.4 1793.76,-299.4 1793.76,-266.6 1537.96,-266.6"/>
<text xml:space="preserve" text-anchor="start" x="1540.96" y="-277.4" font-family="Arial" font-size="14.00" fill="#c9c9c9">Calls the data API with the access token</text>
</g>
<!-- integrations&#45;&gt;whoop -->
<g id="edge6" class="edge">
<title>integrations&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1193.27,-447.64C1408.81,-434.96 1745.37,-400.2 1824.09,-305.8 1906.21,-207.33 1726.36,-152.35 1577.25,-124.74"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1193.14,-445.02 1185.8,-448.07 1193.44,-450.26 1193.14,-445.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1847.62,-263.2 1847.62,-302.8 1871.62,-302.8 1871.62,-263.2 1847.62,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="1855.73" y="-279.8" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1874.62,-263.2 1874.62,-302.8 2137.42,-302.8 2137.42,-263.2 1874.62,-263.2"/>
<text xml:space="preserve" text-anchor="start" x="1877.62" y="-285.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">Answers, and the access token is cached</text>
<text xml:space="preserve" text-anchor="start" x="1947.66" y="-269" font-family="Arial" font-size="14.00" fill="#c9c9c9">until it nears expiry</text>
</g>
</g>
</svg>
`;case`whoopBootstrap`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1779pt" height="1037pt"
 viewBox="0.00 0.00 1779.00 1037.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 1021.53)">
<!-- user -->
<g id="node1" class="node">
<title>user</title>
<polygon fill="#428a4f" stroke="#2d5d39" stroke-width="0" points="366.09,-796 0,-796 0,-616 366.09,-616 366.09,-796"/>
<text xml:space="preserve" text-anchor="start" x="155.26" y="-745" font-family="Arial" font-size="20.00" fill="#f8fafc">Visitor</text>
<text xml:space="preserve" text-anchor="start" x="28.38" y="-722" font-family="Arial" font-size="15.00" fill="#c2f0c2">Reads the sites and plays on the game server.</text>
<text xml:space="preserve" text-anchor="start" x="110.08" y="-704" font-family="Arial" font-size="15.00" fill="#c2f0c2">Also the person at the</text>
<text xml:space="preserve" text-anchor="start" x="20.06" y="-686" font-family="Arial" font-size="15.00" fill="#c2f0c2">WHOOP consent screen, once — a refresh token</text>
<text xml:space="preserve" text-anchor="start" x="102.16" y="-668" font-family="Arial" font-size="15.00" fill="#c2f0c2">can be renewed forever,</text>
<text xml:space="preserve" text-anchor="start" x="45.05" y="-650" font-family="Arial" font-size="15.00" fill="#c2f0c2">but only a human can create the first one.</text>
</g>
<!-- integrations -->
<g id="node2" class="node">
<title>integrations</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="1055.89,-575 705.77,-575 705.77,-395 1055.89,-395 1055.89,-575"/>
<text xml:space="preserve" text-anchor="start" x="753.88" y="-479.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="797.83" y="-533.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Integrations</text>
<text xml:space="preserve" text-anchor="start" x="1033.88" y="-479.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="797.83" y="-512.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">.NET 10 isolated — Flex Consumption</text>
<text xml:space="preserve" text-anchor="start" x="797.83" y="-491.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">func&#45;nygdev&#45;integrations.</text>
<text xml:space="preserve" text-anchor="start" x="797.83" y="-473.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Everything that feeds the estate</text>
<text xml:space="preserve" text-anchor="start" x="797.83" y="-455.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">from outside</text>
<text xml:space="preserve" text-anchor="start" x="797.83" y="-437.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">it, split off from the API so that</text>
<text xml:space="preserve" text-anchor="start" x="797.83" y="-419.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">app could have its gate turned on.</text>
</g>
<!-- keyvault -->
<g id="node3" class="node">
<title>keyvault</title>
<path fill="#3b82f6" stroke="#2563eb" stroke-width="2" d="M1748.7,-610.9C1748.7,-620.94 1668.01,-629.1 1568.66,-629.1 1469.32,-629.1 1388.62,-620.94 1388.62,-610.9 1388.62,-610.9 1388.62,-447.1 1388.62,-447.1 1388.62,-437.06 1469.32,-428.9 1568.66,-428.9 1668.01,-428.9 1748.7,-437.06 1748.7,-447.1 1748.7,-447.1 1748.7,-610.9 1748.7,-610.9"/>
<path fill="none" stroke="#2563eb" stroke-width="2" d="M1748.7,-610.9C1748.7,-600.86 1668.01,-592.7 1568.66,-592.7 1469.32,-592.7 1388.62,-600.86 1388.62,-610.9"/>
<text xml:space="preserve" text-anchor="start" x="1436.74" y="-523.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1480.68" y="-577.8" font-family="Arial" font-size="20.00" fill="#eff6ff">Key Vault</text>
<text xml:space="preserve" text-anchor="start" x="1726.7" y="-523.4" font-family="Arial" font-size="14.00" fill="#eff6ff"> </text>
<text xml:space="preserve" text-anchor="start" x="1480.68" y="-556.8" font-family="Arial" font-size="13.00" fill="#bfdbfe">Azure Key Vault — standard, RBAC</text>
<text xml:space="preserve" text-anchor="start" x="1480.68" y="-535.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">nygdev, in rg&#45;nygdev&#45;security.</text>
<text xml:space="preserve" text-anchor="start" x="1480.68" y="-517.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">Holds whoop&#45;clientsecret, copied in</text>
<text xml:space="preserve" text-anchor="start" x="1480.68" y="-499.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">by</text>
<text xml:space="preserve" text-anchor="start" x="1480.68" y="-481.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">hand from the WHOOP developer</text>
<text xml:space="preserve" text-anchor="start" x="1480.68" y="-463.2" font-family="Arial" font-size="15.00" fill="#bfdbfe">dashboard, and whoop&#45;token.</text>
</g>
<!-- whoop -->
<g id="node4" class="node">
<title>whoop</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1740.9,-180 1396.43,-180 1396.43,0 1740.9,0 1740.9,-180"/>
<text xml:space="preserve" text-anchor="start" x="1529.78" y="-138.8" font-family="Arial" font-size="20.00" fill="#f8fafc">WHOOP</text>
<text xml:space="preserve" text-anchor="start" x="1459.39" y="-117.8" font-family="Arial" font-size="13.00" fill="#cbd5e1">WHOOP API v2 — OAuth 2.0 + REST</text>
<text xml:space="preserve" text-anchor="start" x="1418.16" y="-96.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">Wearable platform, read&#45;only to us and gated</text>
<text xml:space="preserve" text-anchor="start" x="1486.94" y="-78.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">by an authorization code</text>
<text xml:space="preserve" text-anchor="start" x="1416.48" y="-60.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">grant. A person consents once and that yields</text>
<text xml:space="preserve" text-anchor="start" x="1496.13" y="-42.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">a refresh token; every</text>
<text xml:space="preserve" text-anchor="start" x="1435.67" y="-24.2" font-family="Arial" font-size="15.00" fill="#cbd5e1">refresh then rotates it, killing the old one</text>
</g>
<!-- user&#45;&gt;integrations -->
<g id="edge1" class="edge">
<title>user&#45;&gt;integrations</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M366.02,-769.11C465.49,-792.6 587.98,-802.92 685.77,-753 754.99,-717.66 805.25,-644.81 837.26,-583.98"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="839.54,-585.27 840.65,-577.4 834.88,-582.86 839.54,-585.27"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="405.41,-791.62 405.41,-831.22 429.41,-831.22 429.41,-791.62 405.41,-791.62"/>
<text xml:space="preserve" text-anchor="start" x="413.52" y="-808.22" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">0</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="432.41,-791.62 432.41,-831.22 666.45,-831.22 666.45,-791.62 432.41,-791.62"/>
<text xml:space="preserve" text-anchor="start" x="435.41" y="-814.22" font-family="Arial" font-size="14.00" fill="#c9c9c9">Opens /integrations/whoop/authorize</text>
<text xml:space="preserve" text-anchor="start" x="507.41" y="-797.42" font-family="Arial" font-size="14.00" fill="#c9c9c9">(function key)</text>
</g>
<!-- user&#45;&gt;integrations -->
<g id="edge3" class="edge">
<title>user&#45;&gt;integrations</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M375.86,-645.07C479.12,-612.28 605.51,-572.13 705.88,-540.25"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="375.18,-642.53 368.83,-647.31 376.77,-647.54 375.18,-642.53"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="389.09,-643.7 389.09,-683.3 413.09,-683.3 413.09,-643.7 389.09,-643.7"/>
<text xml:space="preserve" text-anchor="start" x="397.2" y="-660.3" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">2</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="416.09,-643.7 416.09,-683.3 682.77,-683.3 682.77,-643.7 416.09,-643.7"/>
<text xml:space="preserve" text-anchor="start" x="419.09" y="-666.3" font-family="Arial" font-size="14.00" fill="#c9c9c9">302 to the WHOOP consent screen (client</text>
<text xml:space="preserve" text-anchor="start" x="473.94" y="-649.5" font-family="Arial" font-size="14.00" fill="#c9c9c9">id, scopes, signed state)</text>
</g>
<!-- user&#45;&gt;integrations -->
<g id="edge6" class="edge">
<title>user&#45;&gt;integrations</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M228.82,-616.22C263.11,-558.33 316.38,-487.83 386.09,-454.4 481.36,-408.72 599.08,-414.01 695.68,-431.83"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="695.02,-434.38 702.88,-433.2 696.01,-429.22 695.02,-434.38"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="413.59,-457.4 413.59,-497 437.59,-497 437.59,-457.4 413.59,-457.4"/>
<text xml:space="preserve" text-anchor="start" x="421.7" y="-474" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">5</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="440.59,-457.4 440.59,-497 658.27,-497 658.27,-457.4 440.59,-457.4"/>
<text xml:space="preserve" text-anchor="start" x="450.22" y="-480" font-family="Arial" font-size="14.00" fill="#c9c9c9">The browser follows the redirect</text>
<text xml:space="preserve" text-anchor="start" x="443.59" y="-463.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">(anonymous; the state is the gate)</text>
</g>
<!-- user&#45;&gt;whoop -->
<g id="edge4" class="edge">
<title>user&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M259.3,-795.92C293.92,-830.41 337.98,-865.83 386.09,-884 808.99,-1043.71 1100.19,-984.73 1368.62,-621 1407.24,-568.67 1365.97,-389.97 1388.62,-329 1407.62,-277.86 1441.25,-228.37 1474.28,-187.83"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1476.19,-189.63 1478.94,-182.18 1472.14,-186.29 1476.19,-189.63"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="768.6,-970.68 768.6,-1003.48 792.6,-1003.48 792.6,-970.68 768.6,-970.68"/>
<text xml:space="preserve" text-anchor="start" x="776.71" y="-983.88" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">3</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="795.6,-970.68 795.6,-1003.48 993.05,-1003.48 993.05,-970.68 795.6,-970.68"/>
<text xml:space="preserve" text-anchor="start" x="798.6" y="-981.48" font-family="Arial" font-size="14.00" fill="#c9c9c9">Signs in and grants the scopes</text>
</g>
<!-- user&#45;&gt;whoop -->
<g id="edge5" class="edge">
<title>user&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M222.16,-606.64C255.32,-532.07 310.06,-432.31 386.09,-369 678.55,-125.47 1146.26,-86.68 1396.51,-84.96"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="219.85,-605.37 219.24,-613.29 224.66,-607.48 219.85,-605.37"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="738.25,-191.46 738.25,-231.06 762.25,-231.06 762.25,-191.46 738.25,-191.46"/>
<text xml:space="preserve" text-anchor="start" x="746.36" y="-208.06" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">4</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="765.25,-191.46 765.25,-231.06 1023.41,-231.06 1023.41,-191.46 765.25,-191.46"/>
<text xml:space="preserve" text-anchor="start" x="768.25" y="-214.06" font-family="Arial" font-size="14.00" fill="#c9c9c9">302 back to /integrations/whoop/callback</text>
<text xml:space="preserve" text-anchor="start" x="858.92" y="-197.26" font-family="Arial" font-size="14.00" fill="#c9c9c9">with a code</text>
</g>
<!-- integrations&#45;&gt;keyvault -->
<g id="edge2" class="edge">
<title>integrations&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1055.78,-508.17C1062.57,-508.84 1069.29,-509.45 1075.89,-510 1175.19,-518.3 1286.09,-522.98 1377.4,-525.62"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1377.27,-528.24 1384.84,-525.83 1377.42,-522.99 1377.27,-528.24"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1089.02,-528.34 1089.02,-567.94 1113.02,-567.94 1113.02,-528.34 1089.02,-528.34"/>
<text xml:space="preserve" text-anchor="start" x="1097.13" y="-544.94" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">1</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1116.02,-528.34 1116.02,-567.94 1355.49,-567.94 1355.49,-528.34 1116.02,-528.34"/>
<text xml:space="preserve" text-anchor="start" x="1119.02" y="-550.94" font-family="Arial" font-size="14.00" fill="#c9c9c9">Reads whoop&#45;clientsecret, to sign the</text>
<text xml:space="preserve" text-anchor="start" x="1206.19" y="-534.14" font-family="Arial" font-size="14.00" fill="#c9c9c9">state with</text>
</g>
<!-- integrations&#45;&gt;keyvault -->
<g id="edge9" class="edge">
<title>integrations&#45;&gt;keyvault</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1055.81,-443.8C1062.57,-442.81 1069.28,-441.94 1075.89,-441.2 1205.19,-426.79 1241.31,-414.37 1368.62,-441.2 1371.71,-441.85 1374.81,-442.55 1377.91,-443.3"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1376.99,-445.78 1384.91,-445.1 1378.3,-440.69 1376.99,-445.78"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1143.9,-444.2 1143.9,-477 1167.9,-477 1167.9,-444.2 1143.9,-444.2"/>
<text xml:space="preserve" text-anchor="start" x="1152" y="-457.4" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">8</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1170.9,-444.2 1170.9,-477 1300.61,-477 1300.61,-444.2 1170.9,-444.2"/>
<text xml:space="preserve" text-anchor="start" x="1173.9" y="-455" font-family="Arial" font-size="14.00" fill="#c9c9c9">Writes whoop&#45;token</text>
</g>
<!-- integrations&#45;&gt;whoop -->
<g id="edge7" class="edge">
<title>integrations&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M985.16,-395.15C1013.63,-372.37 1045.15,-348.86 1075.89,-329.4 1174.5,-266.97 1291.77,-209.3 1387.06,-166.22"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1387.99,-168.68 1393.75,-163.2 1385.83,-163.89 1387.99,-168.68"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1078.89,-332.4 1078.89,-372 1102.89,-372 1102.89,-332.4 1078.89,-332.4"/>
<text xml:space="preserve" text-anchor="start" x="1087" y="-349" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">6</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1105.89,-332.4 1105.89,-372 1365.62,-372 1365.62,-332.4 1105.89,-332.4"/>
<text xml:space="preserve" text-anchor="start" x="1108.89" y="-355" font-family="Arial" font-size="14.00" fill="#c9c9c9">Exchanges the code (authorization_code</text>
<text xml:space="preserve" text-anchor="start" x="1176.23" y="-338.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">grant, client secret)</text>
</g>
<!-- integrations&#45;&gt;whoop -->
<g id="edge8" class="edge">
<title>integrations&#45;&gt;whoop</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M970.15,-387.14C1002.4,-346.03 1035.85,-295.97 1055.89,-245 1069.29,-210.91 1048.46,-105.68 1075.89,-81.4 1161.33,-5.77 1291.56,-11.44 1396.54,-34.14"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="968.21,-385.36 965.6,-392.87 972.32,-388.62 968.21,-385.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1099.93,-84.4 1099.93,-124 1123.93,-124 1123.93,-84.4 1099.93,-84.4"/>
<text xml:space="preserve" text-anchor="start" x="1108.03" y="-101" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">7</text>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1126.93,-84.4 1126.93,-124 1344.58,-124 1344.58,-84.4 1126.93,-84.4"/>
<text xml:space="preserve" text-anchor="start" x="1129.93" y="-107" font-family="Arial" font-size="14.00" fill="#c9c9c9">Access token, and the first refresh</text>
<text xml:space="preserve" text-anchor="start" x="1218.63" y="-90.2" font-family="Arial" font-size="14.00" fill="#c9c9c9">token</text>
</g>
</g>
</svg>
`;default:throw Error(`Unknown viewId: `+e)}};export{e as dotSource,t as svgSource};