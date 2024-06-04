import { Card } from 'react-bootstrap';
import { ITestLog } from '../../app/Dashboard';

function ServiceConsole({ logs }: { logs: Array<ITestLog> }) {

    return (
        <Card style={{ height: 'calc(100vh - 20px)' }}>
            <Card.Header>Console</Card.Header>
            <Card.Body className="pt-1 pb-1" style={{ backgroundColor: 'black', color: 'white',  overflowY: 'auto' }}>
                {logs.map((t) => <div>{t.message}</div>)}
            </Card.Body>
            <Card.Footer>
            </Card.Footer>
        </Card>
    );
}

export default ServiceConsole;