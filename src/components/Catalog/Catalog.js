import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Catalog(){
  const [ownerID, setOwnerID] = useState("");
  const [ownerProfile, setOwnerProfile] = useState({});
  const [collection, setCollection] = useState([]);
  const [offset, setOffset] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const handleOnChange = (e) => {
    setOwnerID(e.target.value);
    dataReset();
  }

  const handleOnSubmit = () => {
    getData();
  }

  const dataReset = () => {
    setOwnerProfile({});
    setCollection([]);
    setOffset(0);
  }

  const handleFullReset = () => {
    setOwnerID("");
    setShowLoadMore(false);
    dataReset();
  }

  const loadMore = () => {
    setOffset(prev => prev + 20);
  }

  const getData = () => {
    fetch('https://api.opensea.io/api/v1/assets?owner=' + ownerID + '&order_direction=desc&offset=' + offset + '&limit=20', { method: 'GET' })
      .then(response => response.json())
      .then((response) => {
        if(response.assets.length > 0){
          setCollection(prev => ([...prev, ...response.assets]));
          setOwnerProfile(response.assets[0].creator);
          response.assets.length < 20 ? setShowLoadMore(false) : setShowLoadMore(true);
        } else {
          setShowLoadMore(false);
        }
      })
      .catch(err => console.error(err));
  }

  const getDateDelta = (asset) => {
    let createdDate = new Date(asset.asset_contract.created_date);
    let todaysDate = new Date();
    // To calculate the time difference of two dates
    var Difference_In_Time = todaysDate.getTime() - createdDate.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return `${parseInt(Difference_In_Days)} ${Difference_In_Days > 1 ? 'days' : 'day'} ago`
  }

  useEffect(() => {
    if(ownerID)
      getData();
  }, [offset]);

  return (
    <div>
      <Container>
        <h1>NFT Catalog</h1>
        <Row>
          <Col md={8}>
            <input name="search" className="form-control" type="text" id="search" placeholder="Enter contract address here...." value={ownerID} onChange={handleOnChange} />
          </Col>
          <Col>
            <button className="btn btn-success" id="search" style={{width: '100%'}} onClick={handleOnSubmit}>Search</button>
          </Col>
          <Col>
            <button className="btn btn-secondary" id="reset" style={{width: '100%'}} onClick={handleFullReset}>Reset</button>
          </Col>
        </Row>

        <br />
        
        {(ownerProfile.profile_img_url !== undefined && (
          <Card style={{ width: '100%', textAlign: 'left' }}>
            <Card.Body>
              <Card.Title>Username: {ownerProfile.user?.username}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Contract Address: {ownerID}</Card.Subtitle>
              
              <Card.Link href={`https://opensea.io/${ownerProfile.user?.username}`}>OpenSea Profile</Card.Link>
            </Card.Body>
          </Card>
        ))}

        <br />

        <Row>
          {collection.map((col) => {
            return (
              <Col md={3} key={col.id} className="mb-4">
                <Card className="text-center">
                  <Card.Header>{col.name}</Card.Header>
                  <Card.Img variant="middle" src={col.image_preview_url} style={{maxHeight: '300px'}}/>
                  <Card.Body>
                    <Card.Title>{col.collection.name}</Card.Title>
                    <Card.Text>
                      {col.collection.description?.substring(0, 120)}{col.collection.description?.length > 120 ? '....' : ''}
                    </Card.Text>
                    <hr/>
                    <Row>
                      <Col>
                        <Card.Text>Buyer Fee: {parseFloat(col.collection.dev_buyer_fee_basis_points) / 100}%</Card.Text>  
                      </Col>
                      <Col>
                        <Card.Text>Seller Fee: {parseFloat(col.collection.dev_seller_fee_basis_points) / 100}%</Card.Text>  
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer className="text-muted">{getDateDelta(col)}</Card.Footer>
                </Card>
              </Col>
            )
          })}
        </Row>
        {(showLoadMore && (
          <button onClick={loadMore} className="btn btn-secondary">Load More</button>
        ))}
        <br/>
        <br/>
        <br/>
      </Container>
    </div>
  )
}
export default Catalog;
