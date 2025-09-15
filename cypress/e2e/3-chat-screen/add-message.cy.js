describe('Add message', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login');
        cy.get('input[name="email"]').type('cypress@test.com');
        cy.get('input[name="password"]').type('123456789');
        cy.get('button[data-test="login-button"]').click();
        cy.get('h1').should('have.text', 'Chat');
    });

    it('should add a message', () => {
        
    });
});