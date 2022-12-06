import axios from 'axios';
import React from 'react';
import Chart from 'chart.js/auto';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { CardContent, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid } from '@mui/x-data-grid';
import { Translate } from 'react-auto-translate';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });
/**
 * SalesDashboard Component in charge of displaying inventory and sales data.
 */
class SalesDashboard extends React.Component {

    // Constructor 
    /**
     * Default constructor for sales dashboard. 
     * @param {*} props Any property values to pass into parent. 
     * @param {string} lang Language code to use for Google Translate. Defaults to "en". 
     */
    constructor(props, lang = "en", theme="light") {
        super(props);
        this.theme = theme; 
        this.lang = lang;
        if(this.theme === "dark")
        {
            Chart.defaults.color = "#ffffff";
        }
        else
        {
            Chart.defaults.color = "#000000";
        }
        let curr = new Date(); // get current date
        let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        let last = first - 7; // last day is the first day + 6
        let startDate = new Date(curr.setDate(first));
        startDate = "" + (startDate.getFullYear()) + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
        let endDate = new Date(curr.setDate(last));
        endDate = "" + (endDate.getFullYear()) + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
        this.state = {
            dailySales: [],
            loadedDailyData: false,
            value: "2022-1-1",
            ingrReport: [],
            startDate: endDate,
            endDate: startDate,
            lastWeeksSales: 0.0,
            loadedLastWeekSales: false,
            lastWeeksTotalPizzas: 0,
            loadedLastWeeksPizzas: false,
            popularPizza: ["", 0],
            loadedBreakdown: false,
            breakDownData: []
        };

        this.dailySalesLineChart = null;
        this.breakDownChart = null;
        this.handleChange = this.handleChange.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);

        this.excessColumns = [
            { field: 'ingr_name', headerName: <Translate>Ingredient</Translate>, minWidth: 200, flex: 1, align: 'center', headerAlign: 'center', renderCell: (params) => { return <Translate> {params.value}</Translate>; } },
            { field: 'stock', headerName: <Translate>Current Stock Used</Translate>, minWidth: 200, flex: 1, align: 'center', headerAlign: 'center', type: "number" },
            { field: 'percentage_used', headerName: <Translate>% Used</Translate>, minWidth: 200, flex: 1, align: 'center', headerAlign: 'center', type: "number" },

        ]

    }
    /**
     * Updates date for excess report. 
     * @param {string} newValue 
     * New value of string to use
     */
    handleChange(newValue) {
        this.setState({ value: newValue }, this.getIngredientReport);
    }
    /**
     * Gets daily sales data from startDate and endDate.
     * @returns void
     */
    getDailySalesData() {
        const { startDate, endDate } = this.state;
        if (startDate.length === 0 || endDate.length === 0) {
            return;
        }
        //  console.log("In here: ", `http://localhost:8000/ingredient_excess_report/?date=${value}`);
        axios.get(`http://localhost:8000/daily_sales_total/?start_date=${startDate}&end_date=${endDate}`)
            .then(res => {
                const res_data = res.data;
                this.setState({ dailySales: res_data, loadedDailyData: true });
            })
    }
    /**
     * Helper function to standardize large numbers. 
     * @param {any} x numerical to convert to string 
     * @returns comma separated value
     */
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    /**
     * Sets breakdown data. 
     */
    setSalesBreakdownData() {
        const { startDate, endDate } = this.state;
        axios.get(`http://localhost:8000/sales_breakdown/?start_date=${startDate}&end_date=${endDate}`)
            .then(res => {
                const res_data = res.data;
                this.setState({ breakDownData: res_data, loadedBreakdown: true });
            })
    }

    /**
     * Sets last weeks pizza counts. 
     */
    setLastWeeksPizzaCounts() {
        axios.get(`http://localhost:8000/pizza_counts/`)
            .then(res => {
                const res_data = res.data;
                let totalCounts = 0;
                let popPizza = "";
                let maxCount = 0;
                for (var i = 0; i < res_data.length; i++) {
                    totalCounts += res_data[i]["amount_purchased"];
                    if (res_data[i]["amount_purchased"] > maxCount) {
                        popPizza = res_data[i]["pizza_type"];
                        maxCount = res_data[i]["amount_purchased"]
                    }
                }
                this.setState({ lastWeeksTotalPizzas: this.numberWithCommas(totalCounts), popularPizza: [popPizza, maxCount], loadedLastWeeksPizzas: true });
            })
    }
    /**
     * sets LastWeeksSales from API.
     */
    setLastWeeksSales() {
        axios.get(`http://localhost:8000/last_week_sales/`)
            .then(res => {
                const res_data = res.data;
                this.setState({ lastWeeksSales: this.numberWithCommas(res_data["last_week_total"]), loadedLastWeekSales: true });
            })
    }
    /**
     * Update start date for daily sales data range.
     * @param {string} newValue new valid date
     */
    updateStartDate(newValue) {
        this.setState({ startDate: newValue }, this.getDailySalesData);
    }
    getTheme()
    {
        if(this.theme === "light")
        {
            return lightTheme;
        }
        return darkTheme; 
    }
    /**
     * Updates end date for daily sales data range. 
     * @param {string} newValue new end date
     */
    updateEndDate(newValue) {
        console.log(newValue);
        this.setState({ endDate: newValue }, this.getDailySalesData);
    }

    /**
     * Sets excess report data for ingredients. 
     */
    getIngredientReport() {
        const { value } = this.state;
        //  console.log("In here: ", `http://localhost:8000/ingredient_excess_report/?date=${value}`);
        axios.get(`http://localhost:8000/ingredient_excess_report/?date=${value}`)
            .then(res => {
                const res_data = res.data;
                this.setState({ ingrReport: res_data, loadedDailyData: true });
            })

    }

    /**
     * Gets individual rows for excess report. 
     * @param {array} data 
     * @returns array of JSON objects
     */

    getIngredientReportRows(data) {

        let rows = [];
        for (var i = 0; i < data.length; i++) {

            let row = { id: i, ingr_name: data[i]['ingr_name'], stock: data[i]["stock"], percentage_used: data[i]["percentage_used"] }
            rows.push(row);

        }
        return rows;
    }
    // ComponentDidMount is used to
    // execute the code 
    /**
     * Sets up default page.
     */
    componentDidMount() {
        /*
        axios.get("http://localhost:8000/daily_sales_total/")
            .then(res => {
                const res_data = res.data;
                this.setState({ dailySales: res_data, loadedDailyData: true });
            })*/
        this.getDailySalesData();
        this.getIngredientReport();
        this.setLastWeeksSales();
        this.setLastWeeksPizzaCounts();
        this.setSalesBreakdownData();

    }
    /**
     * Helper function that gets sales data formatted nicely. 
     * @param {JSON} responseData 
     * @returns data for pie chart
     */
    getSalesBreakdownData(responseData) {
        let keys = [];
        let labelID = "";
        let salesData = [];
        
        for (var i = 0; i < responseData.length; i++) {
            let item_type = responseData[i]["crusttype"] + " " + responseData[i]["pizzatype"];
        
            keys.push(item_type);
            salesData.push(responseData[i]["salescost"]);
        }
        return { labels: keys, datasets: [{ label: labelID, data: salesData }] };

    }
    getOptions()
    {
        if(this.theme === "dark")
        {
            return {
                scales: {
                    y: {
                      grid: {
                        color: 'white'
                      }
                    },
                    x: {
                      grid: {
                        color: 'white'
                      }
                    }
                  }
            };
        }
        return {};
    }
    /**
     * Returns HTML code to be rendered for sales dashboard. 
     * @returns HTML code to be rendered for sales dashboard
     */
    render() {
        let selectTheme = this.getTheme();
        let graphOptions = this.getOptions();
        const { breakDownData, loadedBreakdown, popularPizza, loadedLastWeeksPizzas, lastWeeksTotalPizzas, dailySales, loadedDailyData, value, ingrReport, startDate, endDate, loadedLastWeekSales, lastWeeksSales } = this.state;
        if (!(loadedDailyData && loadedLastWeekSales && loadedLastWeeksPizzas && loadedBreakdown)) {
            return (
               
            <div>  <ThemeProvider theme={darkTheme}>Loading Sales Dashboard...
          
                <canvas id="dailysalestotal" height={"50%"}>

                </canvas>

                <canvas id="breakdownchart" height={"50%"}>

                </canvas></ThemeProvider>
            </div>)
        }
        else {
            if (this.dailySalesLineChart != null) {
                this.dailySalesLineChart.destroy();
            }

            if (this.breakDownChart != null) {
                this.breakDownChart.destroy();
            }

            let excessRows = this.getIngredientReportRows(ingrReport);
            let breakPie = this.getSalesBreakdownData(breakDownData);
           
            this.breakDownChart = new Chart(
                document.getElementById("breakdownchart"),
                {
                    type: 'pie',
                    data: breakPie,
                    options:{responsive: true}
                },
            );
            this.dailySalesLineChart = new Chart(
                document.getElementById('dailysalestotal'),
                {
                    type: 'line',
                    data: {
                        labels: dailySales.map(item => item.order_date),
                        datasets: [
                            {
                                label: 'Daily Sales Total ($)',
                                data: dailySales.map(item => item.sales_total)
                            }
                        ]
                    },
                    options:
                    graphOptions
                }
            );
        
            return (<div>
                 <ThemeProvider theme={selectTheme}>
                    <CssBaseline/>
                <br></br>
                <h1 style={{textAlign:"center"}}><Translate>Weekly Summary</Translate></h1>
                <div>
                    <Grid
                        container
                        spacing={20}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        justifyContent="center"


                    >
                        <Grid item xs={3}>
                            <Card sx={{ minWidth: 275, display: "inline-block" }}>
                                <CardContent>
                                    <div align="center">
                                        <Typography sx={{ fontSize: 25 }} gutterBottom>
                                            Last 7 Days of Revenue
                                        </Typography>
                                        <Typography sx={{ fontSize: 40 }} gutterBottom>
                                            ${lastWeeksSales}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card sx={{ minWidth: 275, display: "inline-block" }}>

                                <CardContent>
                                    <div align="center">
                                        <Typography sx={{ fontSize: 25 }} gutterBottom>
                                            Number of Pizzas Sold Since Last Week
                                        </Typography>
                                        <Typography sx={{ fontSize: 40 }} gutterBottom>
                                            {lastWeeksTotalPizzas}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card sx={{ minWidth: 275, display: "inline-block", margin: "auto" }}>
                                <CardContent>
                                    <div align="center">
                                        <Typography sx={{ fontSize: 25 }} gutterBottom>
                                            Most Popular Pizza
                                        </Typography>
                                        <Typography sx={{ fontSize: 40 }} gutterBottom>
                                            {popularPizza[0]}
                                        </Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid></Grid>
                </div>
                <br></br>
                <h1 style={{textAlign:"center"}}> <Translate>Daily Sales Tracker</Translate></h1>
                <br></br>
                <h2><Translate>Daily Sales Over Time</Translate></h2>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        label="Start Date"
                        inputFormat="YYYY-MM-DD"
                        value={startDate}
                        defaultValue={'2022-01-01'}
                        onChange={this.updateStartDate}
                        renderInput={(params) => <TextField {...params} />}
                    /> </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        label="End Date"
                        inputFormat="YYYY-MM-DD"
                        value={endDate}
                        defaultValue={'2022-01-01'}
                        onChange={this.updateEndDate}
                        renderInput={(params) => <TextField {...params} />}
                    /> </LocalizationProvider>
                <canvas id="dailysalestotal" height={"50%"}>

                </canvas>



                <h2><Translate>Breakdown By Item</Translate></h2>
                <div style={{width: '25%', margin: 'auto'}}>
                <canvas id="breakdownchart" height={"25%"} width={"25%"}>   </canvas>
                </div>
                <br></br>
             
                <h1 style={{textAlign:"center"}}><Translate>Ingredient Tracker</Translate></h1>
                <LocalizationProvider dateAdapter={AdapterDayjs}>

                     
                    <DesktopDatePicker
                        label={<Translate>View Ingredient Usage Since</Translate>}
                        inputFormat="YYYY-MM-DD"
                        value={value}
                        defaultValue={'2022-01-01'}
                        onChange={this.handleChange}
                        renderInput={(params) => <TextField {...params} />}
                    /> </LocalizationProvider>
                <div style={{ height: 400, width: '100%' }}>

                    <DataGrid columns={this.excessColumns} rows={excessRows}></DataGrid>
                </div>
                </ThemeProvider>
            </div>


            );
        }
    }
}

export default SalesDashboard;
