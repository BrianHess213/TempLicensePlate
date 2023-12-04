import { Component } from "react";

class CasePack extends Component {
  state = {
    casePackQTY: null,
  };

  componentDidMount() {

    const newItemNumber = localStorage.getItem("itemNumber");

    fetch(`http://localhost:3001/getData?itemNumber=${newItemNumber}`)
      .then(res => res.json())
      .then(data => {
        // Check if data has the property 'Case_Pack_QTY'
        if (data && data.hasOwnProperty('Case_Pack_QTY')) {
          this.setState({ casePackQTY: data.Case_Pack_QTY });
          if (typeof this.props.onCasePackQtyChange === 'function') {
            this.props.onCasePackQtyChange(data.Case_Pack_QTY);
          }
        } else {
          console.error('Unexpected Data Structure:', data);
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {

    const setTimer = setTimeout(this.fetchData, 5000);


  }

  fetchData = () => {
    const newItemNumber = localStorage.getItem("itemNumber");

    fetch(`http://localhost:3001/getData?itemNumber=${newItemNumber}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ casePackQTY: data.Case_Pack_QTY });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };



  render() {
    return (
      <div>
        {/* Conditionally render the li only if casePackQTY has a value */}
        {this.state.casePackQTY !== null && (
          <div>{this.state.casePackQTY}</div>
        )}
      </div>
    );
  }
}

export default CasePack;