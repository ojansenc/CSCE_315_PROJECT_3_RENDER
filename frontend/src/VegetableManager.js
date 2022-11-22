import axios from 'axios';
import React from 'react';
import {useNavigate} from 'react-router-dom';


class VegetableManager extends React.Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            DataisLoaded: false
        };
    }

    // ComponentDidMount is used to
    // execute the code
    componentDidMount() {
        axios.get("http://localhost:8000/ingredients/?ingr_type=VEGGIES")
            .then(res => {
                const veggies = res.data;
                this.setState({items: veggies, DataisLoaded: true});
            })
    }

    render() {
        const {DataisLoaded, items} = this.state;
        if (!DataisLoaded) return <div>
            <h1> Please wait some time.... </h1></div>;

        const AlterIngredients = async () => {
            for (var i = 0; i < items.length; i++) {

                const item = items.at(i);
                console.log(items.at(i));
                let formField = new FormData();
                formField.append('ingredient_name', item.ingredient_name);
                formField.append('quantity', item.quantity);
                formField.append('units', item.units);
                formField.append('ingr_type', item.ingr_type);
                formField.append('usage_value', item.usage_value);

                await axios({
                    method: 'put',
                    url: 'http://localhost:8000/ingredients/' + item.ingredient_name + '/',
                    data: formField
                }).then(response => {
                    console.log(response.data);
                    window.location.reload(false);
                })
            }

        }

        return (
            //  <div className="content-tabs">
            <table>
                <tr>
                    <th>Ingredient Name</th>
                    <th>Alter Amount in Inventory</th>
                </tr>
                {
                    items.map((item, index) => (
                        <tr>
                            <td>{item.ingredient_name}</td>
                            <input
                                type="number"
                                className="form-control form-control-lg"
                                id={item.ingredient_name}
                                defaultValue={item.quantity}
                                placeholder={item.quantity}
                                name="alterInventoryAmt"
                                onChange={(e) => items.at(index).quantity = e.target.value}
                            />
                        </tr>
                    ))
                }
                <tr>
                    <button onClick={AlterIngredients} className="btn btn-primary btn-block">Alter Inventory Amount
                    </button>
                </tr>
            </table>
            // </div>
        );
    }
}

export default VegetableManager;