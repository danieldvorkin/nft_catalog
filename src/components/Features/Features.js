import { render } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';

function Features(){
  const [features, setFeatures] = useState([]);
  const [offset, setOffset] = useState(0);

  const loadMore = () => {
    setOffset(offset + 5);
  }

  useEffect(() => {
    const options = {method: 'GET'};

    fetch('https://api.opensea.io/api/v1/events?only_opensea=false&offset=' + offset + '&limit=5', options)
      .then(response => response.json())
      .then(response => setFeatures((prev) => [...prev, ...response.asset_events]))
      .catch(err => console.error(err));
  }, [offset]);

  return (
    <Container>
      {features.map((feature) => {
        return (
          <Card key={feature.asset?.id} style={{margin: '20px 10px'}}>
            <Card.Body style={{padding: '5px 15px'}}>
              <Row>
                <Col className="fill" md={4} style={{textAlign: 'left'}}>
                  <img src={feature.asset?.collection?.banner_image_url} alt={feature.asset?.name} style={{maxHeight: '120px'}}/>
                </Col>
                <Col style={{textAlign: 'left'}}>
                  <strong>Name: </strong>{feature.asset?.name}&nbsp;-&nbsp;
                  <a href={feature.asset.permalink} target="_blank">{feature.asset.asset_contract?.address}</a>

                  <br/>
                  <strong>Description: </strong>{feature.asset?.description}

                  <br/>
                  <strong>Collection: </strong>
                  <a href={`https://opensea.io/collections/${feature.asset.collection?.name}`} target="_blank">{feature.asset.collection?.name}</a>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )
      })}
      <button onClick={loadMore} className="btn btn-secondary mt-4 mb-4">Load More</button>
    </Container>
  )
};

export default Features;
