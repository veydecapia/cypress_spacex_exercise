import cypress from "cypress";
import filterData from "../../fixtures/filterdata.json";


class FlightDashboard{


    get shipTypeCombobox(){
        return cy.get('[role="button"]')
    }

    get shipTypeList(){
        return cy.get('ul[role="listbox"] li')
    }
    
    get weightFilterTextbox(){
        return cy.get('.MuiBox-root-7 input[type="text"]')
    }

    get homePortFilterTextbox(){
        return cy.get('.MuiBox-root-8 input[type="text"]')
    }

    get searchButton(){
        return cy.contains('Search')
    }

    get table(){
        return cy.get('.MuiTable-root.MuiTable-stickyHeader')
    }

    get tableBody(){
        return this.table.find('tbody')
    }

    get tableRow(){
        return this.tableBody.find('tr')
    }

    get alertIcon(){
        return cy.get('.MuiAlert-message')
    }


    /**
     * @description
     * Selects a Ship Type to filter
     * @param {string} shipTypeName The ship type to select
     */
    selectShipType = (
        shipTypeName: string
    ) => {
        this.shipTypeCombobox.click()

        this.shipTypeList.each(($ship) => {
            const shipText = $ship.text().trim()

            if(shipText === shipTypeName){
                //Click the list
                cy.wrap($ship).click()
                        .then(()=>{
                            this.shipTypeCombobox
                                .invoke('text')
                                .then((text)=>{
                                    //Selected text should be equal to Ship type
                                    expect(text).to.equal(shipTypeName)
                            })
                    })
            }
        })
    }


    /**
     * Verifies data based on the expected text
     * @param {string} text Expected value to compare
     * @param {number} column Column to check
     */
    verifyColumnValue = (
        text: string,
        column: number
    ) => {

        this.tableRow.each(($row) =>{
            cy.wrap($row)
                .find('td:nth-child(' + column.toString() + ')')
                .should("have.text", text)
        })
    }


    /**
     * Verifies data based on the json file
     * Loops through the json file data and enters data each row
     */
    verifyFilterData = () =>{

        //**Loop through the json file for filtering data */
        filterData.forEach((datarow, index) =>{
            cy.log("Index row: " + index)
            cy.intercept('GET', '/ships').as('getShips')

            cy.visit('/')
            cy.wait('@getShips')
            
            this.table.should('be.visible')
            //** Enter Filters based on json file data*/
                .then(() => {
                    if (datarow.shipType != "") {
                        //Verification already done inside selectShipType
                        this.selectShipType(datarow.shipType) 
                    }
                    if(datarow.weight != ""){
                        this.weightFilterTextbox.type(datarow.weight)
                            .should('have.value', datarow.weight)
                    }
                    if(datarow.homePort != ""){
                        this.homePortFilterTextbox.type(datarow.homePort)
                            .should('have.value', datarow.homePort)
                    }
                })

            //** Click Search button */
                .then(() => {
                    this.searchButton.click()
                    // cy.pause()
                    cy.wait(1000)
                })
            //** Check if expected is invalid */
                .then(() => {
                    if(datarow.valid === 1){
                        this.alertIcon.should('not.exist')
                        this.table.should('be.visible')  
                    }
                    else{
                        this.alertIcon.should('be.visible')
                        this.table.should('not.exist')
                    }
                })
                .then(() => {
                    if(datarow.valid === 1){
                        this.verifyRow(index)
                    }
                })

        })
    }

    /**
     * Compares the value of the text of the cell to the expected value.
     * @param {number} index Indicates the array
     */
    verifyRow = (
        index: number
    ) => {
        const shipType = filterData[index].shipType
        const weight = filterData[index].weight
        const homePort = filterData[index].homePort

        //**Loop through each row and verify filtered data
        cy.wait('@getShips')
        this.tableRow.each(($row) =>{
            if (shipType != "") {
                cy.wrap($row)
                    .find('td:nth-child(1)')
                    .should('have.text', shipType)
            }
            if(weight != ""){
                cy.wrap($row)
                    .find('td:nth-child(2)')
                    .should('have.text', weight)
            }
            if(homePort != ""){
                cy.wrap($row)
                    .find('td:nth-child(3)')
                    .should('have.text', homePort)
            }
        })

    }



}

export default new FlightDashboard()