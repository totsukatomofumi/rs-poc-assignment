using System;
using Grpc.Core;
using Slave.Protos;
using Google.Protobuf.WellKnownTypes;

namespace Slave.Services;

public class TestRunnerService : GrpcTestRunner.GrpcTestRunnerBase
{
    private static TestStatus _testStatus = new TestStatus { IsActive = false };
    private static TestResult? _testResult;

    public override async Task RunTest(TestCase testCase, IServerStreamWriter<TestLog> testLogStream, ServerCallContext context)
    {
        _testStatus.IsActive = true;

        for (var i = 0; i < testCase.Duration; i++)
        {
            await Task.Delay(TimeSpan.FromSeconds(1));
            await testLogStream.WriteAsync(new TestLog
            {
                Message = $"[{DateTime.Now}] - Running test... Elapsed Time: {i + 1} seconds"
            });
        }

        _testResult = new TestResult
        {
            Message = $"Test Name: {testCase.Name}\n"
                    + "Result: Success\n"
                    + $"Duration: {testCase.Duration} seconds"
        };

        _testStatus.IsActive = false;

    }

    public override Task<TestResult> GetTestResult(Empty request, ServerCallContext context)
    {
        return Task.FromResult(_testResult);
    }

    public override Task<TestStatus> CheckTestStatus(Empty request, ServerCallContext context)
    {
        return Task.FromResult(_testStatus);
    }

}