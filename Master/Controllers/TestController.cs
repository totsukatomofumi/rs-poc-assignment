using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Master.Models;
using Master.Hubs;
using Master.Protos.Client;
using Grpc.Core;
using Google.Protobuf.WellKnownTypes;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    private TestRunnerManager _testRunnerManager;
    private IHubContext<DashboardHub, IDashboardClient> _hubContext;
    public TestController(TestRunnerManager testRunnerManager, IHubContext<DashboardHub, IDashboardClient> hubContext)
    {
        _testRunnerManager = testRunnerManager;
        _hubContext = hubContext;
    }

    [HttpPost("register")]
    public async Task RegisterTestRunner(TestRunner testRunner)
    {
        // initialise test runner given
        await testRunner.Init();

        // add to testrunner manager
        _testRunnerManager.testRunners.Add(testRunner);

        Console.WriteLine($"Registered {testRunner.address}");

        // update front end dashboards using signalR
        _hubContext.Clients.All.RegisterTestRunner(testRunner.address, testRunner.isActive);

    }

    public class TestRequest
    {
        public int testRunnerIndex { get; set; }
        public string connectionId { get; set; }
        public TestCase testCase { get; set; }
    }

    [HttpPost("run")]
    public async Task<ActionResult<TestResult>> RunTest([FromBody] TestRequest testRequest)
    {
        TestRunner testRunner = _testRunnerManager.testRunners[testRequest.testRunnerIndex];

        // check local 
        if (testRunner.isActive)
        {
            // return conflict 409, conflict w resources
            // shouldnt come here in the first place, should be greyed out
            return Conflict();
        }
        else
        {
            // reserve locally to prevent race conditions
            testRunner.isActive = true;

            // reflect this display on dashboards
            await _hubContext.Clients.AllExcept(testRequest.connectionId).UpdateActivity(testRequest.testRunnerIndex, testRunner.isActive);

            // run the test 
            // TODO: grpc accept the stream
            // TODO: cancellation token to cancel streaming, global cancellation token
            // streaming send back to client via signalr
            using var runTestCall = testRunner.grpcClient.RunTest(testRequest.testCase); // object pass in from http call pass into grpc

            await foreach (var testLog in runTestCall.ResponseStream.ReadAllAsync())
            {
                await _hubContext.Clients.Client(testRequest.connectionId).PushTestLog(testLog);
            }

            // all logs are sent
            // either last in response stream is the test results
            // OR call a new grpc to get final results -> send back to client in this response
            // hold the result
            TestResult testResult = await testRunner.grpcClient.GetTestResultAsync(new Empty());

            // release test client
            testRunner.isActive = false;

            // reflect this display on dashboards
            await _hubContext.Clients.AllExcept(testRequest.connectionId).UpdateActivity(testRequest.testRunnerIndex, testRunner.isActive);

            // return result
            return Ok(testResult);
        }
    }
}