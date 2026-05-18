using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;

namespace NygDev.logtest;

public sealed class JwtAuthMiddleware : IFunctionsWorkerMiddleware
{
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var http = context.GetHttpContext();
        if (http is null)
        {
            // Not an HTTP trigger (timer, queue, etc) — skip auth.
            await next(context);
            return;
        }

        var result = await http.AuthenticateAsync(JwtBearerDefaults.AuthenticationScheme);
        if (!result.Succeeded)
        {
            http.Response.StatusCode = StatusCodes.Status401Unauthorized;
            http.Response.Headers.WWWAuthenticate =
                $"Bearer error=\"invalid_token\", error_description=\"{result.Failure?.Message}\"";
            return; // short-circuit; do NOT call next
        }

        http.User = result.Principal!;
        await next(context);
    }
}
