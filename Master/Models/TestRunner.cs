using Master.Protos.Client;
using Grpc.Net.Client;
using Google.Protobuf.WellKnownTypes;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Master.Models;

public class TestRunner
{
    public string address { get; set; } // get and set for model binding

    [JsonIgnore]
    [BindNever]
    public GrpcTestRunner.GrpcTestRunnerClient? grpcClient { get; private set; }// client here    

    [JsonIgnore]
    [BindNever]
    public bool isActive { get; set; } = false;

    // call after receiving over registration restful call
    public async Task Init()
    {
        // intialise client to call grpc from microservice
        grpcClient = new GrpcTestRunner.GrpcTestRunnerClient(GrpcChannel.ForAddress(address));

        // poll activity status
        isActive = (await grpcClient.CheckTestStatusAsync(new Empty())).IsActive;
    }
}

public class TestRunnerManager
{
    public List<TestRunner> testRunners { get; } = new List<TestRunner>();
}

