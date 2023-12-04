import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Card, Form, Container, Row, Col, Image } from 'react-bootstrap';
import $, { data } from "jquery";
import moment from 'moment';
import { Formik, useFormik } from "formik"
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios'
import ItemSku from './components/ItemSKU';
import CasePack from './components/CasePackQTY';




<script src="https://cdn.jsdelivr.net/npm/ajax-client@2.0.2/lib/ajax-client.min.js"></script>


function App() {

  $(document).ready(function () {
    document.getElementById("currentDate").innerHTML = new moment().format('llll'); // Sat, Nov 11, 2023 8:07 AM
  });

  const PrintTimer = () => {
    window.print();
  };

  const validate = values => {
    const errors = {}
    if (!values.item) {
      errors.item = 'Required'

    } else if (values.item) {
      var itemCount = document.getElementById("itemNumberID").value;
      document.getElementById("itemBarcode").src = "https://barcode.orcascan.com/?data=" + itemCount;
    }

    if (!values.caseQTY) {
      errors.caseQTY = 'Required'

    } else if (values.caseQTY) {


    }

    if (!values.userName) {
      errors.userName = 'Required'

    }
    return errors;
  }

  const formik = useFormik({
    initialValues: {
      item: '',
      case: '',
      caseQTY: '',
      userName: ''
    },
    validate,
    onSubmit: values => {
      PrintTimer();
    }
  });

  // This state will hold the value from the CasePack component (returned value from the database)
  const [casePackQty, setCasePackQty] = useState(0);

  // This state will hold the user input value
  const [userInput, setUserInput] = useState('');

  // This state will hold the calculated value
  const [calculatedValue, setCalculatedValue] = useState(0);

  // Function to handle a change in the CasePackQty component's value
  const handleCasePackQtyChange = (value) => {
    const qtyValue = Number(value); // Assuming the returned value is a string, convert it to number
    setCasePackQty(qtyValue);
    calculateAndSetResult(userInput, qtyValue);
  };

  // Function to handle changes in the user's input value
  const handleUserInputChange = (event) => {
    const userValue = event.target.value;
    setUserInput(userValue); // You'll want to validate this input if necessary
    calculateAndSetResult(userValue, casePackQty);
  };

  // Function that calculates and sets the result
  const calculateAndSetResult = (inputQty, packQty) => {
    const result = Number(inputQty) * packQty;
    setCalculatedValue(result); // Update the calculated value that will be displayed

    var Results = inputQty * packQty;

    document.getElementById("caseEachID").value = Results;

    // This is so the Each Barcode can updat to the correct value
    Results = caseEach;


    var caseCount = document.getElementById("PackQTY").value;
    document.getElementById("caseBarcode").src = "https://barcode.orcascan.com/?data=" + caseCount;
    //console.log(caseCount);

    var caseEach = document.getElementById("caseEachID").value;
    document.getElementById("eachBarcode").src = "https://barcode.orcascan.com/?data=" + caseEach;


  };

  /*const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submit action
    //const itemNumber = formik.values.item || 7501;
    const sharedVariable = formik.values.item || 7501;
    console.log(sharedVariable);

    
  
    axios.post(`http://localhost:3001/updateItemNumber`, { newItemNumber: sharedVariable })
      .then((response) => {
        // Handle your response here. For example, update the state.
        console.log('Updated item number:', response.data);
        // Maybe update a state variable to cause a component rerender with the new data.
      })
      .catch((error) => {
        console.error('Error updating item number:', error);
      });
  };*/



  const handleSubmit = () => {
    // Get the itemNumber from the form state, not hard-coded
    const sku = parseInt(formik.values.item, 10)
    const itemNumber = sku || 'defaultItemNumber';
    console.log(typeof sku);

    localStorage.setItem("itemNumber", itemNumber);


    // Send POST request
    axios.post('http://localhost:3001/updateItemData', { newItemNumber: itemNumber })
      .then((postResponse) => {
        console.log('POST response data:', postResponse.data);

        // Now make the GET request
        return axios.get(`http://localhost:3001/getData?itemNumber=${itemNumber}`);
      })
      .then((getResponse) => {
        console.log('GET response data:', getResponse.data);

        // Do something with the GET response data, e.g., update state, UI, etc.

        // This example assumes that the state `setCasePackQty` expects the actual pack quantity,
        // not the entire response object.

        formik.values.case = 0;
        document.getElementById("PackQTY").value = 0;
        document.getElementById("caseEachID").value = 0;


        if (getResponse.data && getResponse.data.Case_Pack_QTY) {
          setCasePackQty(getResponse.data.Case_Pack_QTY);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  return (
    <div className="App">
      <header className="App-header">


        <Container fluid className='mr-auto p-2'>

          <Card className='mb-5' border='0' style={{ color: "#000" }}>
            <Card.Title className='fs-1'>License Plate</Card.Title>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group>
                <Row>
                  




                  
                  <div className="row justify-content-around">
                    <div className="col-4">
                    <Col>
                    <Form.Label className=''>Item Number:</Form.Label>
                    <ItemSku plaintext></ItemSku>
                    <Form.Control id='itemNumberID' name='item' className='text-center' type='text' placeholder='Enter Item Number' onBlur={formik.handleBlur} value={formik.values.item} onChange={formik.handleChange} plaintext ></Form.Control>
                    {formik.touched.item && formik.errors.item ? <div className="text-danger">{formik.errors.item}</div> : null}
                  </Col>
                    </div>
                    
                
                    <div className="col-4">
                    <Col>
                    <Form.Label className=''>Case Count:</Form.Label>

                    <Form.Control
                      id='PackQTY'
                      name='caseQTY'
                      className='text-center'
                      type='text'
                      value={formik.values.caseQTY}
                      onChange={(event) => {
                        formik.handleChange(event);
                        handleUserInputChange(event); // Call the handler here for user input changes
                      }}
                      onBlur={formik.handleBlur}
                      placeholder='Enter QTY'
                      plaintext
                    />
                    {formik.touched.caseQTY && formik.errors.caseQTY ? <div className="text-danger">{formik.errors.caseQTY}</div> : null}
                  </Col>

                    </div>
                  </div>

             

                  <div className="row justify-content-around">
                    <div className="col-4">
                    <Image id='itemBarcode' className='img-fluid h-100 w-100' src={"https://barcode.orcascan.com/?data=EnterItemNumber"} onChange={formik.handleChange} rounded />
                    </div>
                    
                
                    <div className="col-4">
                    <Image id='caseBarcode' className='img-fluid h-100 w-100' src={"https://barcode.orcascan.com/?data=EnterCaseNumber"} onChange={formik.handleChange} rounded />
                    </div>
                  </div>





                    <Form.Label>Case QTY</Form.Label>
                    <CasePack onCasePackQtyChange={handleCasePackQtyChange} />


                    <Col>
                      <Form.Label className=''>Eaches:</Form.Label>
                      <Form.Control id='caseEachID' className='text-center' type='text' onChange={formik.handleChange} disabled plaintext></Form.Control>

                      <Container>
                        <Image id='eachBarcode' className='img-fluid h-25 w-50' src={"https://barcode.orcascan.com/?data=EnterEachNumber"} onChange={formik.handleChange} rounded />
                      </Container>

                    </Col>
                    <Container>

                    </Container>

                    <Col>
                      <Form.Control name='userName' className='text-center' placeholder='Enter Name' type='text' value={formik.values.userName} onBlur={formik.handleBlur} onChange={formik.handleChange} plaintext></Form.Control>
                      {formik.touched.userName && formik.errors.userName ? <div className="text-danger">{formik.errors.userName}</div> : null}
                    </Col>

                    <Col>
                      <p id='currentDate' value="">Date goes here!</p>
                    </Col>

                </Row>
              </Form.Group>
            </Form>
          </Card>
        </Container>



        <Container className='d-grid gap-2 d-print-none'>
          <Button id='printButton' className='mb-5 d-print-none btn btn-primary btn-lg ' type='submit' onClick={handleSubmit}>Get Info</Button>

          <Button id='printButton' className='mb-5 d-print-none btn btn-primary btn-lg ' type='submit' onClick={formik.handleSubmit}>Print</Button>

        </Container>

      </header>
    </div>
  );
}

export default App;

//<Button id='printButton' className='d-print-none' type='submit' onClickCapture={}>Testing Get Items</Button>
