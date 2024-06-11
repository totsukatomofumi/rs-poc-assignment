using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using Google.Protobuf.WellKnownTypes;
using System.Threading;

using Master.Models;
using Master.Hubs;

namespace Master.Services;
public class ConsulHostedService : IHostedService
{
  private readonly IHttpClientFactory _httpClientFactory;
  private readonly TestRunnerManager _testRunnerManager;
  private readonly IHostApplicationLifetime _appLifetime;
  private readonly IHubContext<DashboardHub, IDashboardClient> _hubContext;
  private string index = "";

  public ConsulHostedService(IHttpClientFactory httpClientFactory, TestRunnerManager testRunnerManager, IHostApplicationLifetime appLifetime, IHubContext<DashboardHub, IDashboardClient> hubContext)
  {
    _httpClientFactory = httpClientFactory;
    _testRunnerManager = testRunnerManager;
    _appLifetime = appLifetime;
    _hubContext = hubContext;
  }

  private class ConsulNode
  {
    public string ID { get; set; }
    public string ServiceName { get; set; }
    public string ServiceAddress { get; set; }
    public int ServicePort { get; set; }

  }

  private List<TestRunner> Parse(List<ConsulNode> consulNodes)
  {
    List<TestRunner> testRunners = new List<TestRunner>();

    foreach (ConsulNode node in consulNodes)
    {
      testRunners.Add(new TestRunner
      {
        address = $"http://{node.ServiceAddress}:{node.ServicePort}"
      });
    }

    return testRunners;
  }

  private async void OnApplicationStarted()
  {
    bool isInitial = true;

    while (true)
    {
      HttpClient consulHttpClient = _httpClientFactory.CreateClient("Consul");

      // allow for long polling on consul side
      consulHttpClient.Timeout = Timeout.InfiniteTimeSpan;

      string request = "/v1/catalog/service/test-runner";

      if (!isInitial)
      {
        request += ("?index=" + index);
      }

      HttpResponseMessage response = await consulHttpClient.GetAsync(request);
      List<ConsulNode> consuleNodes = JsonSerializer.Deserialize<List<ConsulNode>>(await response.Content.ReadAsStringAsync());

      // parse here 
      List<TestRunner> testRunners = Parse(consuleNodes);

      // init and ping status
      foreach (TestRunner testRunner in testRunners)
      {
        await testRunner.Init();
        testRunner.isActive = (await testRunner.grpcClient.CheckTestStatusAsync(new Empty())).IsActive;
      }

      // assign
      _testRunnerManager.testRunners = testRunners;

      if (response.Headers.TryGetValues("X-Consul-Index", out var indices))
      {
        index = indices.First();
      }

      // push to client
      Console.WriteLine($"Updated list of services.");

      // update front end dashboards using signalR
      await _hubContext.Clients.All.PushTestRunnerList(_testRunnerManager.testRunners);

      if (isInitial)
      {
        isInitial = false;
      }
    }
  }

  public async Task StartAsync(CancellationToken cancellationToken)
  {
    _appLifetime.ApplicationStarted.Register(OnApplicationStarted);
  }

  public async Task StopAsync(CancellationToken cancellationToken)
  {

  }
}