import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { HubConnection } from "@microsoft/signalr";

import ServiceList from "../components/List/ServiceList";
import ServiceConsole from "../components/Console/ServiceConsole";
import { useAppDispatch, useAppSelector } from "./hooks";
import { addLog, resetLogs } from "../components/Console/consoleSlice";
import { addService, setService } from "../components/List/listSlice";

export interface IService {
  index: number;
  address: string;
  isActive: boolean;
}

export interface ITestCase {
  name: string;
  duration: number;
}

export interface ITestRequest {
  testRunnerIndex: number;
  connectionId: string | null;
  testCase: ITestCase;
}

export interface ITestLog {
  message: string;
}

export interface ITestResult {
  message: string;
}

// dashboard should contain the service list and consol components
// dashboard overall styling should be done here, treat as overall UI
function Dashboard({
  upstreamAddr,
  hubConnection,
}: {
  upstreamAddr: string;
  hubConnection: HubConnection;
}) {
  // all hooks should be here for ease of access
  // hook state only for rendering, view-only
  const services = useAppSelector((state) => state.list.services);
  const logs = useAppSelector((state) => state.console.logs);
  const dispatch = useAppDispatch();

  // handlers
  function handleRegisterService(address: string, isActive: boolean) {
    // TODO: Fetch entire array of services from backend
    dispatch(
      addService({
        index: 0,
        address: address,
        isActive: isActive,
      })
    );
  }

  function handleUpdateServiceActivity(index: number, isActive: boolean) {
    dispatch(
      setService({
        index,
        address: "",
        isActive,
      })
    );
  }

  function handlePushServiceLog(testLog: ITestLog) {
    dispatch(addLog(testLog));
  }

  async function handleRunService(service: IService, testCase: ITestCase) {
    // reset console
    dispatch(resetLogs());

    // prepare testRequest
    const testRequest: ITestRequest = {
      testRunnerIndex: service.index,
      connectionId: hubConnection.connectionId,
      testCase: testCase,
    };

    // call run test restful with connectionId
    const response = await fetch(upstreamAddr + "/test/run", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testRequest),
    });

    if (!response.ok) {
      alert(`${response.status}  ${response.statusText}`);
      return;
    }
    const testResult: ITestResult = await response.json();

    alert(testResult.message);
  }

  // register
  useEffect(() => {
    hubConnection.on("RegisterTestRunner", handleRegisterService);

    hubConnection.on("UpdateActivity", handleUpdateServiceActivity);

    hubConnection.on("PushTestLog", handlePushServiceLog);
  }, []);

  return (
    <Container
      fluid
      style={{
        marginTop: "10px",
        marginBottom: "10px",
        height: "calc(100vh - 20px)",
        overflow: "hidden",
      }}
    >
      <Row className="gx-3">
        <Col xs={3}>
          <ServiceList
            services={services}
            handleRunService={handleRunService}
          />
        </Col>
        <Col>
          <ServiceConsole logs={logs} />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
