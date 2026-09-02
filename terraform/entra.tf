# Entra ID app registrations.
#
# These are Microsoft Graph objects, not Resource Manager ones, so they come
# from the azuread provider rather than azurerm. The apply workflow's OIDC
# login covers both — azuread reads the same ARM_CLIENT_ID / ARM_TENANT_ID /
# ARM_USE_OIDC — but the workload identity needs Graph application permissions
# on top of its subscription role. Application.ReadWrite.OwnedBy is enough for
# everything declared here; without it the first apply fails with a bare 403
# from Graph rather than anything that names the missing grant.

data "azuread_client_config" "current" {}

# GymLog — one registration playing both parts of the gym logging flow: the
# identity a user signs in against, and the audience func-nygdev-api validates
# the resulting token for. Splitting it into a client registration and an API
# registration buys a boundary that is worth having when the two are owned by
# different people or deployed on different cadences; here they are one app and
# one apply, so a second registration would be two things to keep in step for
# nothing.
#
# The gym data itself already has a home — the `gym` container on
# nygdev-cosmos-db, partitioned on /objectId. That partition key is why this
# exists: a document belongs to the user whose object id is on it, and the only
# way the API learns that object id is from a validated token.
resource "azuread_application" "gymlog" {
  display_name = "GymLog"

  # Single tenant. This is a personal subscription with one directory in it;
  # AzureADMyOrg means a token from anywhere else is refused at the issuer
  # rather than at the audience check.
  sign_in_audience = "AzureADMyOrg"

  # The applying service principal is listed first and deliberately. Graph adds
  # the creator as an owner automatically, and Application.ReadWrite.OwnedBy —
  # the narrow permission this is meant to run under — only reaches
  # applications the caller owns. Setting owners to the human alone would hand
  # the registration over and lock the next apply out of the thing it just
  # created.
  owners = [
    data.azuread_client_config.current.object_id,
    var.entra_owner_objectid,
  ]

  api {
    # v2 tokens, to match the v2.0 issuer the function app is pointed at below.
    # Left at 1 the endpoint mints v1 tokens that the v2.0 validator rejects,
    # and the failure surfaces as an unhelpful 401 on every call.
    requested_access_token_version = 2

    # The scope a front end asks for. Without one there is nothing to request
    # and no way to obtain a token whose audience is this app, so an API-only
    # registration is not the smaller thing it looks like — it is one that
    # cannot be called.
    #
    # The id has to be a UUID and has to stay the same: it is what a consent
    # grant records, so changing it revokes every consent already given.
    # random_uuid keeps it in state rather than in the file, which is the same
    # guarantee without a literal to copy around.
    oauth2_permission_scope {
      id    = random_uuid.gymlog_access_as_user.result
      value = "access_as_user"

      # User, not Admin: this is one person signing in to their own gym log.
      type    = "User"
      enabled = true

      admin_consent_display_name = "Access GymLog"
      admin_consent_description  = "Allow the application to access GymLog on behalf of the signed-in user."
      user_consent_display_name  = "Access GymLog"
      user_consent_description   = "Allow the application to access your GymLog data on your behalf."
    }
  }
}

resource "random_uuid" "gymlog_access_as_user" {}

# api://<client id> — the App ID URI that qualifies the scope above, so a client
# requests api://<client id>/access_as_user rather than a bare word Entra
# cannot resolve.
#
# Its own resource rather than an identifier_uris argument on the application
# because the value is derived from the application's client id, and an
# argument that reads an attribute of the resource it sits in is a cycle
# terraform refuses to plan.
resource "azuread_application_identifier_uri" "gymlog" {
  application_id = azuread_application.gymlog.id
  identifier_uri = "api://${azuread_application.gymlog.client_id}"
}

# Easy Auth's callback, registered so the built-in sign-in flow at
# /.auth/login/aad works the moment it is switched on. It is not the path in
# use today: that flow is a confidential-client code exchange and needs a
# client secret, and no secret for this app is created here or stored in the
# vault. What works today is the other shape — a front end doing its own sign-in
# and presenting the bearer token, which the function app validates without
# ever holding a credential of its own.
#
# Separate from the application for the same reason as the identifier URI, and
# then one more: the URI contains the function app's hostname while the function
# app's auth settings contain this application's client id. Declared as an
# argument on either resource that is a cycle; declared here it is a third node
# that depends on both.
resource "azuread_application_redirect_uris" "gymlog_easy_auth" {
  application_id = azuread_application.gymlog.id
  type           = "Web"

  redirect_uris = [
    "https://${azurerm_function_app_flex_consumption.api.default_hostname}/.auth/login/aad/callback",
  ]
}

# The directory-local half of the registration. An application is the global
# definition; the service principal is what actually holds sign-ins, consent
# grants and role assignments in this tenant, and nothing can authenticate
# against an application that has none.
resource "azuread_service_principal" "gymlog" {
  client_id = azuread_application.gymlog.client_id

  # Anyone in the directory may sign in, rather than only users explicitly
  # assigned to the app. One-person directory; an assignment list here would be
  # a second place to remember.
  app_role_assignment_required = false

  owners = [
    data.azuread_client_config.current.object_id,
    var.entra_owner_objectid,
  ]
}
