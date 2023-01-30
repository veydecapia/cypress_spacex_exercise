import flightDashboardPage from "../page-objects/flightDashboard.page";


describe('Flight Dashboard', () => {

    beforeEach(() => {
        cy.visit('/')
    });

    describe.skip('Table', () => {
        it('should flight dashboard page displayed', () => {
            cy.title().should('equal', 'Flight Dashboard')
        });
    
        it('should HTML table displayed', () => {
            flightDashboardPage.table.should('be.visible')
            flightDashboardPage.table.should('not.be.null')
        });

        it('should columns be displayed accordingly', () => {
            
        });

        it.skip('should upload icon button each row be displayed', () => {
            
        });
    });

    describe('Pagination', () => {
        
    });


    describe('Filter', () => {

        it('should correctly filter based on ship type', () => {
            //Act
            flightDashboardPage.selectShipType('Tug')
            flightDashboardPage.searchButton.click()

            //Assert
            flightDashboardPage.tableRow.should('have.length', 8)
            flightDashboardPage.verifyColumnValue('Tug', 1)
        });

        it('should correctly filter based on the weight', () => {
            //Act
            flightDashboardPage.weightFilterTextbox.type('266712')
            flightDashboardPage.searchButton.click()

            //Assert
            flightDashboardPage.tableRow.should('have.length', 1)
            flightDashboardPage.verifyColumnValue('266712', 2)
        });

        it('should correctly filter based on the home port', () => {
            //Act
            flightDashboardPage.homePortFilterTextbox.type('Port of Los Angeles')
            flightDashboardPage.searchButton.click()

            //Assert
            flightDashboardPage.tableRow.should('have.length', 10)
            flightDashboardPage.verifyColumnValue('Port of Los Angeles', 3)
        });


        it('should correctly filter based on combination of ship type, weight and home port', () => {
            //Assert
            //Verify value based on json filter - filterdata.json
            flightDashboardPage.verifyFilterData()
        });


    });




});