describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Ingredient Modal', () => {
    it('should open ingredient modal on click', () => {
      cy.get('[data-testid="ingredient-item"]').first().click();
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]').contains('Краторная булка N-200i');
    });

    it('should close ingredient modal on close button click', () => {
      cy.get('[data-testid="ingredient-item"]').first().click();
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('should close ingredient modal on overlay click', () => {
      cy.get('[data-testid="ingredient-item"]').first().click();
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('should show ingredient details in modal', () => {
      cy.get('[data-testid="ingredient-item"]').first().click();
      cy.get('[data-testid="modal"]').within(() => {
        cy.contains('Краторная булка N-200i');
        cy.contains('420 ккал');
        cy.contains('80 г');
        cy.contains('24 г');
        cy.contains('53 г');
      });
    });
  });

  describe('Constructor Functionality', () => {
    it('should add bun to constructor', () => {
      cy.get('[data-testid="ingredient-item"]').first().trigger('dragstart');
      cy.get('[data-testid="constructor-bun-top"]').trigger('drop');
      cy.get('[data-testid="constructor-bun-top"]').contains('Краторная булка N-200i');
    });

    it('should add main ingredient to constructor', () => {
      cy.get('[data-testid="ingredient-item"]').eq(1).trigger('dragstart');
      cy.get('[data-testid="constructor-main"]').trigger('drop');
      cy.get('[data-testid="constructor-main"]').contains('Биокотлета из марсианской Магнолии');
    });

    it('should update total price when adding ingredients', () => {
      const bunPrice = 1255;
      const mainPrice = 424;
      const expectedTotal = bunPrice * 2 + mainPrice;

      cy.get('[data-testid="ingredient-item"]').first().trigger('dragstart');
      cy.get('[data-testid="constructor-bun-top"]').trigger('drop');
      cy.get('[data-testid="ingredient-item"]').eq(1).trigger('dragstart');
      cy.get('[data-testid="constructor-main"]').trigger('drop');

      cy.get('[data-testid="total-price"]').should('contain', expectedTotal);
    });

    it('should remove ingredient from constructor', () => {
      cy.get('[data-testid="ingredient-item"]').eq(1).trigger('dragstart');
      cy.get('[data-testid="constructor-main"]').trigger('drop');
      cy.get('[data-testid="constructor-main"]').contains('Биокотлета из марсианской Магнолии');
      cy.get('[data-testid="remove-ingredient"]').click();
      cy.get('[data-testid="constructor-main"]').should('be.empty');
    });

    it('should not allow dropping non-bun ingredients in bun slots', () => {
      cy.get('[data-testid="ingredient-item"]').eq(1).trigger('dragstart');
      cy.get('[data-testid="constructor-bun-top"]').trigger('drop');
      cy.get('[data-testid="constructor-bun-top"]').should('not.contain', 'Биокотлета');
    });

    it('should not allow dropping bun ingredients in main slot', () => {
      cy.get('[data-testid="ingredient-item"]').first().trigger('dragstart');
      cy.get('[data-testid="constructor-main"]').trigger('drop');
      cy.get('[data-testid="constructor-main"]').should('be.empty');
    });
  });

  describe('Order Creation', () => {
    beforeEach(() => {
      window.localStorage.setItem('accessToken', 'test-access-token');
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
      
      cy.intercept('GET', 'api/auth/user', {
        success: true,
        user: { email: 'test@example.com', name: 'Test User' }
      }).as('getUser');

      cy.intercept('POST', 'api/orders', {
        success: true,
        name: 'Space флюоресцентный бургер',
        order: { number: 12345 }
      }).as('createOrder');
    });

    afterEach(() => {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
    });

    it('should create order and show modal', () => {
      cy.get('[data-testid="ingredient-item"]').first().trigger('dragstart');
      cy.get('[data-testid="constructor-bun-top"]').trigger('drop');
      cy.get('[data-testid="ingredient-item"]').eq(1).trigger('dragstart');
      cy.get('[data-testid="constructor-main"]').trigger('drop');

      cy.get('[data-testid="order-button"]').click();
      cy.wait('@createOrder');

      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]').contains('12345');

      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');

      cy.get('[data-testid="constructor-main"]').should('be.empty');
    });

    it('should not allow order creation without bun', () => {
      cy.get('[data-testid="ingredient-item"]').eq(1).trigger('dragstart');
      cy.get('[data-testid="constructor-main"]').trigger('drop');

      cy.get('[data-testid="order-button"]').should('be.disabled');
    });

    it('should not allow order creation without main ingredients', () => {
      cy.get('[data-testid="ingredient-item"]').first().trigger('dragstart');
      cy.get('[data-testid="constructor-bun-top"]').trigger('drop');

      cy.get('[data-testid="order-button"]').should('be.disabled');
    });

    it('should show error message when order creation fails', () => {
      cy.intercept('POST', 'api/orders', {
        success: false,
        message: 'Failed to create order'
      }).as('createOrderFail');

      cy.get('[data-testid="ingredient-item"]').first().trigger('dragstart');
      cy.get('[data-testid="constructor-bun-top"]').trigger('drop');
      cy.get('[data-testid="ingredient-item"]').eq(1).trigger('dragstart');
      cy.get('[data-testid="constructor-main"]').trigger('drop');

      cy.get('[data-testid="order-button"]').click();
      cy.wait('@createOrderFail');

      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').contains('Failed to create order');
    });
  });
}); 