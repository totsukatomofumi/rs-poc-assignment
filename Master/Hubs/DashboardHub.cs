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

}