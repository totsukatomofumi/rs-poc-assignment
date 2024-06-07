import { Card } from "react-bootstrap";
import { TestLog } from "../../app/Dashboard";
import { useAppSelector } from "../../app/hooks";

function ServiceConsole() {
  const logs = useAppSelector((state) => state.console.logs);

  return (
    <Card style={{ height: "calc(100vh - 20px)" }}>
      <Card.Header>Console</Card.Header>
      <Card.Body
        className="pt-1 pb-1"
        style={{ backgroundColor: "black", color: "white", overflowY: "auto" }}
      >
        {logs.map((t: TestLog) => (
          <div>{t.message}</div>
        ))}
      </Card.Body>
      <Card.Footer></Card.Footer>
    </Card>
  );
}

export default ServiceConsole;
