using Slave.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcService<TestRunnerService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Start();

// Register to Master via HTTP endpoint.
var httpClient = app.Services.GetRequiredService<IHttpClientFactory>().CreateClient();
await httpClient.PostAsJsonAsync("http://localhost:5240/test/register", new { address = app.Urls.First() }); // TODO: configure Master's listening port

app.WaitForShutdown();
