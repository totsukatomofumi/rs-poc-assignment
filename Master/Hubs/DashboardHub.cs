using Microsoft.AspNetCore.SignalR;
using Master.Protos.Client;

namespace Master.Hubs;

public interface IDashboardClient
{
    Task RegisterTestRunner(string address, bool isActive);
    Task UpdateActivity(int index, bool isActive);
    Task PushTestLog(TestLog testLog);

}
public class DashboardHub : Hub<IDashboardClient>
{

}