using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Gym;

/// <summary>
/// Day templates: a saved plan a user can drop into any day of any block.
///
/// Only the user's own are here. The built-in templates that ship with the app
/// are a CDN blob — <c>gym-templates.json</c>, beside the exercise library — for
/// the reason that file gives: they are identical for every user and change
/// when the code ships, so paying a function invocation, a token and an RU per
/// account to serve the same list back is the wrong shape. The front end reads
/// both and shows them in one picker; only this half needs a principal, because
/// only this half is somebody's.
///
/// <b>Applying a template is not a call.</b> There is no route here that writes
/// a template into a block, and there should not be: the Plan tab already holds
/// the whole block as a local draft and already sends it back wholesale on
/// Save, so dropping a template into a day is an array assignment on the client
/// followed by the PATCH that was going to happen anyway. A route for it would
/// be a second way to write <c>days</c>, racing the first.
///
/// That is also why a template is a copy rather than a link. Nothing on a block
/// records where a day's plan came from, so renaming or deleting a template
/// cannot reach back and change a block that was filled from it — which is what
/// makes both safe to do without a confirmation.
/// </summary>
public class GymTemplates(GymStore store, ILogger<GymTemplates> logger)
{
    /// <summary>
    /// Every day plan this user has saved, newest first.
    ///
    /// An empty list is the ordinary state rather than a first-run one worth
    /// signalling: the picker is not empty without it, because the built-ins
    /// are always there.
    /// </summary>
    [Function("GymTemplatesList")]
    public Task<IActionResult> List(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gym/templates")] HttpRequest request,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            var templates = await store.ListTemplatesAsync(objectId, token);

            return new OkObjectResult(new
            {
                ok = true,
                templates = templates.Select(template => template.ToResponse()).ToArray(),
            });
        });

    /// <summary>
    /// Saves a day plan under a name.
    ///
    /// The natural way in is a day that is already planned: the Plan tab has
    /// the exercises and the set counts in hand, and saving is capturing what is
    /// on screen. Nothing requires that, though — the body is a name and a
    /// plan, wherever the client got them.
    ///
    /// Names are not unique, deliberately. Two templates called "Push" is a
    /// thing a person can want, the id is the identity, and refusing the second
    /// would mean the only way to keep both is to invent a name for one.
    /// </summary>
    [Function("GymTemplatesCreate")]
    public Task<IActionResult> Create(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "gym/templates")] HttpRequest request,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            var (body, rejection) = await GymEndpoint.ReadBodyAsync(request, token);

            if (body is null)
            {
                return rejection!;
            }

            using (body)
            {
                if (!GymRequests.TryReadTemplate(body.RootElement, out var name, out var plan, out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                var template = await store.CreateTemplateAsync(objectId, name, plan, token);

                if (template is null)
                {
                    return GymEndpoint.Failure(
                        HttpStatusCode.Conflict,
                        "template_limit",
                        $"This account already has {GymLimits.MaxTemplatesPerUser} saved day "
                        + "templates, which is the cap. Delete one to save another — the cap is a "
                        + "guard against a client saving in a loop rather than a judgement about "
                        + "how many plans anyone needs.");
                }

                return new ObjectResult(new { ok = true, template = template.ToResponse() })
                {
                    StatusCode = (int)HttpStatusCode.Created,
                };
            }
        });

    /// <summary>
    /// Re-saves a template in place: a new name, a new plan, or both.
    ///
    /// PUT rather than PATCH because both fields are always sent — a template
    /// is two fields, and the sheet that edits one is holding all of it. Note
    /// what that means and what it does not: <c>plan</c> replaces wholesale, and
    /// no block filled from this template changes, now or later.
    ///
    /// The 404 is the replace's own answer rather than a read in front of it,
    /// so this costs one write and nothing else.
    /// </summary>
    [Function("GymTemplatesReplace")]
    public Task<IActionResult> Replace(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "gym/templates/{templateId}")] HttpRequest request,
        string templateId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsTemplateId(templateId))
            {
                return GymEndpoint.Invalid(NotATemplateId(templateId));
            }

            var (body, rejection) = await GymEndpoint.ReadBodyAsync(request, token);

            if (body is null)
            {
                return rejection!;
            }

            using (body)
            {
                if (!GymRequests.TryReadTemplate(body.RootElement, out var name, out var plan, out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                var replaced = await store.ReplaceTemplateAsync(objectId, templateId, name, plan, token);

                return replaced
                    ? new OkObjectResult(new
                    {
                        ok = true,
                        template = new DayTemplate(templateId, name, plan).ToResponse(),
                    })
                    : NoSuchTemplate(templateId);
            }
        });

    /// <summary>
    /// Removes a saved template.
    ///
    /// Nothing cascades and nothing needs confirming the way a block delete
    /// does: a day filled from this template copied its exercises at the time,
    /// so what is destroyed here is the shortcut, never a plan or a workout.
    /// </summary>
    [Function("GymTemplatesDelete")]
    public Task<IActionResult> Delete(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "gym/templates/{templateId}")] HttpRequest request,
        string templateId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsTemplateId(templateId))
            {
                return GymEndpoint.Invalid(NotATemplateId(templateId));
            }

            var deleted = await store.DeleteTemplateAsync(objectId, templateId, token);

            return deleted
                ? new OkObjectResult(new { ok = true, id = templateId, deleted = true })
                : NoSuchTemplate(templateId);
        });

    private static string NotATemplateId(string templateId) =>
        $"'{templateId}' is not a template id. They look like template_01k4… and are the ids this "
        + "API hands back from POST /api/gym/templates and GET /api/gym/templates, not names.";

    private static IActionResult NoSuchTemplate(string templateId) =>
        GymEndpoint.Failure(
            HttpStatusCode.NotFound,
            "no_such_template",
            $"There is no template {templateId} saved by this user. After a lost response on a "
            + "delete, this is the retry finding the first one finished.");
}
