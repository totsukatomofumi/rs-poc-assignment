import { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { HubConnection } from "@microsoft/signalr";

import ServiceList from "../components/List/ServiceList";
import ServiceConsole from "../components/Console/ServiceConsole";
import { useAppDispatch, useAppSelector } from "./hooks";
import { addLog, resetLogs } from "../components/Console/consoleSlice";
import {
  setServices,
  addActiveService,
  removeActiveService,
} from "../components/List/listSlice";

export interface TestRunner {
  address: string;
  isActive: boolean;
}

export interface TestCase {
  name: string;
  duration: number;
}

export interface TestRequest {
  connectionId: string | null;
  testRunner: TestRunner;
  testCase: TestCase;
}

export interface TestLog {
  message: string;
}

export interface TestResult {
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
  const activeServices = useAppSelector((state) => state.list.activeServices);
  const dispatch = useAppDispatch();

  // handlers
  function handlePushServiceLog(testLog: TestLog) {
    dispatch(addLog(testLog));
  }

  async function handleRunService(service: TestRunner, testCase: TestCase) {
    dispatch(addActiveService(service));

    // reset console if no active services
    if (activeServices.length === 0) {
      dispatch(resetLogs());
    }

    // prepare testRequest
    const testRequest: TestRequest = {
      connectionId: hubConnection.connectionId,
      testRunner: service,
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
    const testResult: TestResult = await response.json();

    dispatch(removeActiveService(service));

    alert(testResult.message);
  }

  function handlePushServiceList(services: Array<TestRunner>) {
    dispatch(setServices(services));
  }

  // register
  useEffect(() => {
    hubConnection.on("PushTestLog", handlePushServiceLog);

    hubConnection.on("PushTestRunnerList", handlePushServiceList);
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
          <ServiceList handleRunService={handleRunService} />
        </Col>
        <Col>
          <ServiceConsole />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
