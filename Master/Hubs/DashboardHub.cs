using Microsoft.AspNetCore.SignalR;
using Master.Protos.Client;
using Master.Models;

namespace Master.Hubs;

public interface IDashboardClient
{
    Task PushTestRunnerList(List<TestRunner> testRunners);
    Task PushTestLog(TestLog testLog);

}
public class DashboardHub : Hub<IDashboardClient>
{
    TestRunnerManager _testRunnerManager;
    public DashboardHub(TestRunnerManager testRunnerManager)
    {
        _testRunnerManager = testRunnerManager;
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.Client(Context.ConnectionId).PushTestRunnerList(_testRunnerManager.testRunners);
    }
}