using Consul;

using Slave.Services;
using Slave.Config;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();

builder.Services.Configure<ConsulConfig>(builder.Configuration.GetSection("ConsulConfig"));
builder.Services.AddSingleton<IConsulClient, ConsulClient>(p => new ConsulClient(consulConfig =>
    {
      string address = builder.Configuration["ConsulConfig:ConsulAddress"];
      consulConfig.Address = new Uri(address);
    }));

builder.Services.AddHostedService<ConsulHostedService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcService<TestRunnerService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();

