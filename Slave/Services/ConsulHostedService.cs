using Consul;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;

namespace Slave.Services;
public class ConsulHostedService : IHostedService
{
  private readonly IServer _server;
  private readonly IConsulClient _consulClient;
  private readonly IHostApplicationLifetime _appLifetime;
  private readonly IConfiguration _configuration;
  private readonly ILogger<ConsulHostedService> _logger;
  private AgentServiceRegistration _serviceRegistration;

  public ConsulHostedService(IServer server, IConsulClient consulClient, IHostApplicationLifetime appLifetime, IConfiguration configuration, ILogger<ConsulHostedService> logger)
  {
    _server = server;
    _consulClient = consulClient;
    _appLifetime = appLifetime;
    _configuration = configuration;
    _logger = logger;
  }

  private async void OnApplicationStarted()
  {
    var address = new Uri(_server.Features.Get<IServerAddressesFeature>().Addresses.First());

    // register with consul
    _serviceRegistration = new AgentServiceRegistration
    {
      ID = Guid.NewGuid().ToString(),
      Name = _configuration["ConsulConfig:ServiceName"],
      Address = address.Host,
      Port = address.Port
    };

    _logger.LogInformation($"Registering service with Consul: {_serviceRegistration.Name}");

    await _consulClient.Agent.ServiceDeregister(_serviceRegistration.ID);
    await _consulClient.Agent.ServiceRegister(_serviceRegistration);

  }

  private async void OnApplicationStopping()
  {

    _logger.LogInformation($"Deregistering service from Consul: {_serviceRegistration.Name}");

    await _consulClient.Agent.ServiceDeregister(_serviceRegistration.ID);
  }

  public async Task StartAsync(CancellationToken cancellationToken)
  {
    _appLifetime.ApplicationStarted.Register(OnApplicationStarted);
    _appLifetime.ApplicationStopping.Register(OnApplicationStopping);

  }

  public async Task StopAsync(CancellationToken cancellationToken)
  {

  }
}