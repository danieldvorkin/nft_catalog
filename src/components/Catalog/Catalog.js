import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';

function Catalog(){
  const [ownerID, setOwnerID] = useState("");
  const [ownerProfile, setOwnerProfile] = useState({});
  const [collection, setCollection] = useState([]);
  const [offset, setOffset] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({});

  const handleClose = () => {
    setShow(false);
    setSelectedAsset({});
  }

  const handleShow = (event) => {
    setShow(true);
    setSelectedAsset({});
    let asset = collection.filter((i) => i.id == event.target.name)[0];
    getAssetData(asset);
  }

  const handleOnChange = (e) => {
    setOwnerID(e.target.value);
    dataReset();
  }

  const handleOnSubmit = () => {
    getCollectionData();
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

  const getAssetData = (asset) => {
    let url = 'https://api.opensea.io/api/v1/asset/' + asset.asset_contract.address + '/' + asset.token_id + '/';
    fetch(url, {method: 'GET'})
      .then(response => response.json())
      .then((response) => {
        setSelectedAsset(response);
        console.log(response)
      })
      .catch(err => console.error(err));
  }

  const getCollectionData = () => {
    fetch('https://api.opensea.io/api/v1/assets?owner=' + ownerID + '&order_direction=desc&offset=' + offset + '&limit=20', { method: 'GET' })
      .then(response => response.json())
      .then((response) => {
        if(response.assets.length > 0){
          setCollection(prev => ([...prev, ...response.assets]));
          setOwnerProfile(response.assets[0].creator);
          response.assets.length < 20 ? setShowLoadMore(false) : setShowLoadMore(true);
          console.log(response.assets)
        } else {
          setShowLoadMore(false);
        }
      })
      .catch(err => console.error(err));
  }

  const getDateDelta = (asset) => {
    let createdDate = new Date(asset.asset_contract.created_date);
    let todaysDate = new Date();
    
    var Difference_In_Time = todaysDate.getTime() - createdDate.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return `${parseInt(Difference_In_Days)} ${Difference_In_Days > 1 ? 'days' : 'day'} ago`
  }

  useEffect(() => {
    if(ownerID)
      getCollectionData();
  }, [offset]);

  return (
    <div>
      <Container>
        <h1>NFT Catalog</h1>
        <Row>
          <Col md={8}>
            <input name="search" className="form-control" type="text" id="search" placeholder="Enter contract address here or just press Search...." value={ownerID} onChange={handleOnChange} />
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
                      {col.collection.description?.substring(0, 80)}{col.collection.description?.length > 80 ? '....' : ''}
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
                    <hr/>
                    <a href={col.permalink} className="btn btn-primary" style={{width: '100%'}} target="_blank">OpenSea</a>
                    <button href="#" className="btn btn-outline-success mt-1" style={{width: '100%'}} onClick={handleShow} name={col.id}>More Details</button>
                  </Card.Body>
                  <Card.Footer className="text-muted">{getDateDelta(col)}</Card.Footer>
                </Card>
              </Col>
            )
          })}

          <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>More Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{margin: '0 auto', textAlign: 'center'}}>
                <img src={selectedAsset.image_url} alt={selectedAsset.name}/>
              </div>
              <hr/>
              <Row>
                <Col>
                  <p><strong>Name: </strong>{selectedAsset.name}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p><strong>Description: </strong>{selectedAsset.collection?.description}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p><strong>Owners: </strong><br/>{selectedAsset?.collection?.stats?.num_owners}</p>
                </Col>
                <Col>
                  <p>
                    <strong>Floor Price</strong><br/>
                    <img src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" alt="ETH" style={{maxHeight: '20px', marginRight: '5px'}}/>
                    {selectedAsset?.collection?.stats?.floor_price?.toFixed(4)}
                  </p>
                </Col>
                <Col>
                  <p><strong>Total Vol: </strong><br/>{selectedAsset?.collection?.stats?.total_volume?.toFixed(4)}</p>
                </Col>
                <Col>
                  <p>
                    <strong>Average Price: </strong><br/>
                    <img src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" alt="ETH" style={{maxHeight: '20px', marginRight: '5px'}}/>
                    {selectedAsset?.collection?.stats?.average_price?.toFixed(4)}
                  </p>
                </Col>
              </Row>
              <hr/>
              <Row>
                {selectedAsset.collection?.payment_tokens?.map((token) => {
                  return (
                    <Col style={{textAlign: 'center'}}>
                      <img src={token.image_url} alt={token.symbol} style={{maxHeight: '30px'}}/>
                      <h6>{token.symbol}</h6>
                    </Col>
                  )
                })}
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

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
