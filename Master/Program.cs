using Master.Models;
using Master.Hubs;
using Master.Config;
using Master.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add singleton classes
builder.Services.AddSingleton<TestRunnerManager>();

builder.Services.AddControllers();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

builder.Services.Configure<ConsulConfig>(builder.Configuration.GetSection("ConsulConfig"));
builder.Services.AddHttpClient("Consul", httpClient =>
{
    httpClient.BaseAddress = new Uri(builder.Configuration["ConsulConfig:ConsulAddress"]);

});

builder.Services.AddHostedService<ConsulHostedService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors();

app.MapControllers();
app.MapHub<DashboardHub>("/dashboard");

app.Run();

