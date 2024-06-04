import { SyntheticEvent, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

import { IService, ITestCase } from '../../app/Dashboard';

function ServiceList({ services, handleRunService }: { services: Array<IService>, handleRunService: (service: IService, testCase: ITestCase) => void }) {

  return (
  <Card style={{ height: 'calc(100vh - 20px)' }}>
    <Card.Header>
      Test Runners
    </Card.Header>
    <Accordion style={{ height: 'calc(100vh - 20px)', overflow: 'auto' }}>
      {services.map((s) => <Service service={s} handleRunService={handleRunService}/>)}
    </Accordion>
    <Card.Footer>
    </Card.Footer>
    </Card>
  );
}

function Service({ service, handleRunService }: { service: IService, handleRunService: (service: IService, testCase: ITestCase) => void  }) {
  // handle form
  const [duration, setDuration] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  
  // restrict input chars
  const handleChange = (e: SyntheticEvent) => {
    if ((new RegExp("^[0-9]*$")).test((e.target as HTMLInputElement).value)) {
      setDuration(Number((e.target as HTMLInputElement).value));
    }
  }

  const runTest = async (e: SyntheticEvent) => {
    e.preventDefault();
    
    // disable form
    setIsDisabled(true);

    // create test case
    const testCase: ITestCase = {
      name: "Sample Test",
      duration: duration
    }

    // run test handler
    await handleRunService(service, testCase);

    setIsDisabled(false);
  }

  return(
    <Accordion.Item eventKey={service.address} style={{ overflow: 'auto' }}>
      { service.isActive 
        ? <Accordion.Button style={{ opacity: '0.3', color: 'gray', backgroundColor: 'black' }} disabled={true}>
            {service.address}<Badge className='ms-2 me-2' pill bg="danger">{" "}</Badge>
          </Accordion.Button>
        : <Accordion.Button>
            {service.address}<Badge className='ms-2 me-2' pill bg="success">{" "}</Badge>
          </Accordion.Button>
      }
      <Accordion.Body>
      <Form onSubmit={runTest}>
        <fieldset disabled={isDisabled}>
          <Form.Group>
            <Container>
              <Row>
                <Col>
                  <Form.Control 
                    size="sm" 
                    type="text" 
                    placeholder="Duration (seconds)"
                    value={duration}
                    onChange={handleChange} 
                    />
                </Col>
                <Col className="d-flex justify-content-center align-items-center" xs='auto'>
                  <Button size="sm" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Container>
          </Form.Group>
        </fieldset>
      </Form>
      </Accordion.Body>
    </Accordion.Item>
  );
}

  
export default ServiceList;