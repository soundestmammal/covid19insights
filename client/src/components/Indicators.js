import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

const Indicators = () => {
    return(
        <Container style={{marginTop: '3em'}}>
            <Row>
                <Col>
                <Card style={{ width: '18rem', border: 'none'}}>
                    <Card.Body>
                        <Card.Title>How fast is COVID-19 spreading?</Card.Title>
                        <Card.Text>
                            How many cases can be expected from a single case?
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                <Col>
                <Card style={{ width: '18rem', border: 'none' }}>
                    <Card.Body>
                        <Card.Title>Is there widespread testing?</Card.Title>
                        <Card.Text>
                            Is a community only testing it's sickest patients?
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                <Col>
                <Card style={{ width: '18rem', border: 'none' }}>
                    <Card.Body>
                        <Card.Title>Can contact tracing meet demand?</Card.Title>
                        <Card.Text>
                            What percentage of cases can be traced within 24 hours?
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Indicators;