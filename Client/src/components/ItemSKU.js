import { Component } from "react";


class itemsku extends Component {

    state = {
        skuName: [],
    }

    componentDidMount() {

        const newItemNumber = localStorage.getItem("itemNumber");

        fetch(`http://localhost:3001/getData?itemNumber=${newItemNumber}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ skuName: data })
            })
    }

 

    componentDidUpdate(prevProps, prevState) {

     const setTimer = setTimeout(this.fetchData, 5000);

    }
    

    fetchData = () => {
        const newItemNumber = localStorage.getItem("itemNumber");

        fetch(`http://localhost:3001/getData?itemNumber=${newItemNumber}`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({ skuName: data });
                
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    };

    render() {

        return (
            <div>
                <div>{this.state.skuName.Item_Name}</div>
            </div>
        )
    }
}

export default itemsku;