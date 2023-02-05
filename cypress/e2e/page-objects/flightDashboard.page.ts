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
    ): Cypress.Chainable<JQuery<HTMLElement>> => {
        return this.shipTypeCombobox.click()
            .then(() => {

                this.shipTypeList.each(($ship) => {
                    const shipText = $ship.text().trim();
                    if (shipText === shipTypeName) {
                        //Click the list
                        cy.wrap($ship).click();
                        return cy.wrap($ship);
                    }
                });
            });
    }


    /**
     * @description
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
     * @description
     * Verifies data based on the json file
     * Loops through the json file data and enters data each row
     */
    verifyFilterData = () =>{

        filterData.forEach((datarow, index) =>{ //**Loop through the json file for filtering data */
            cy.log("Index row: " + index)
            cy.intercept('GET', '/ships').as('getShips')
            cy.visit('/')
            cy.wait('@getShips') //TODO: Add API test
            
            this.table.should('be.visible')
            this.enterFilterData(
                datarow.shipType, 
                datarow.weight,
                datarow.homePort
                ) //** Enter Filters based on json file data*/
            
            this.searchButton.click() //** Click Search button */
            this.verifyValidity(datarow.valid, index) //** Check if expected is valid */
        })
    }


    /**
     * @description
     * Enters Ship filtering value based on the data passed. 
     * @param shipType 
     * @param weight 
     * @param homePort 
     */
    enterFilterData = (
        shipType: string,
        weight: string, //TODO: Should be a number
        homePort: string
    ) => {
        if(shipType) {
            this.selectShipType(shipType)
                .should('have.text', shipType)
        }
        if(weight){
            this.weightFilterTextbox.type(weight)
                .should('have.value', weight)
        }
        if(homePort){
            this.homePortFilterTextbox.type(homePort)
                .should('have.value', homePort)
        }
    }


    /**
     * @description
     * Verifies alert icon and table visibility based on valid data
     * @param {number} valid 
     * @param {number} index 
     */
    verifyValidity = (
        valid: number,
        index: number
    ) => {
        if(valid === 1){
            this.alertIcon.should('not.exist')
            this.table.should('be.visible')  
            this.tableRow.should('have.length.greaterThan', 0)

            if(filterData[index].shipType 
                || filterData[index].weight
                || filterData[index].homePort){
                //Row entry should be less than what is returned by the API
                this.tableRow.should('have.length.below', 20) 
                this.verifyRow(index)
            }
            else{
                this.tableRow.should('have.length', 20)
            }
        }
        else{
            this.alertIcon.should('be.visible')
            this.table.should('not.exist')
        }
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
        this.tableRow.each(($row) =>{
            if (shipType) {
                cy.wrap($row)
                    .find('td:nth-child(1)')
                    .should('have.text', shipType)
            }
            if(weight){
                cy.wrap($row)
                    .find('td:nth-child(2)')
                    .should('have.text', weight)
            }
            if(homePort){
                cy.wrap($row)
                    .find('td:nth-child(3)')
                    .should('have.text', homePort)
            }
        })
    }



}

export default new FlightDashboard()