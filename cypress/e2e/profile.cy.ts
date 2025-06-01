describe('Profile Page', () => {
  beforeEach(() => {
    window.localStorage.setItem('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.intercept('GET', 'api/auth/user', {
      success: true,
      user: {
        email: 'test@example.com',
        name: 'Test User'
      }
    }).as('getUser');

    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/profile');
    cy.wait(['@getUser', '@getIngredients']);
  });

  afterEach(() => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  describe('Profile Information', () => {
    it('should display user information', () => {
      cy.get('[data-testid="profile-form"]').should('be.visible');
      cy.get('[data-testid="name-input"]').should('have.value', 'Test User');
      cy.get('[data-testid="email-input"]').should('have.value', 'test@example.com');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('[data-testid="name-input"]').clear();
      cy.get('[data-testid="email-input"]').clear();
      cy.get('[data-testid="save-button"]').click();

      cy.get('[data-testid="name-error"]').should('be.visible');
      cy.get('[data-testid="email-error"]').should('be.visible');
    });

    it('should show validation error for invalid email', () => {
      cy.get('[data-testid="email-input"]').clear().type('invalid-email');
      cy.get('[data-testid="save-button"]').click();
      cy.get('[data-testid="email-error"]').should('be.visible');
    });

    it('should handle successful profile update', () => {
      cy.intercept('PATCH', 'api/auth/user', {
        success: true,
        user: {
          email: 'updated@example.com',
          name: 'Updated User'
        }
      }).as('updateUser');

      cy.get('[data-testid="name-input"]').clear().type('Updated User');
      cy.get('[data-testid="email-input"]').clear().type('updated@example.com');
      cy.get('[data-testid="save-button"]').click();

      cy.wait('@updateUser');
      cy.get('[data-testid="success-message"]').should('be.visible');
      cy.get('[data-testid="name-input"]').should('have.value', 'Updated User');
      cy.get('[data-testid="email-input"]').should('have.value', 'updated@example.com');
    });

    it('should handle profile update error', () => {
      cy.intercept('PATCH', 'api/auth/user', {
        statusCode: 400,
        body: {
          success: false,
          message: 'Invalid data'
        }
      }).as('updateUser');

      cy.get('[data-testid="name-input"]').clear().type('Invalid User');
      cy.get('[data-testid="email-input"]').clear().type('invalid@example.com');
      cy.get('[data-testid="save-button"]').click();

      cy.wait('@updateUser');
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').contains('Invalid data');
    });
  });

  describe('Order History', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/orders', {
        success: true,
        orders: [
          {
            _id: '1',
            ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093d'],
            status: 'done',
            name: 'Space флюоресцентный бургер',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: '2024-01-01T12:00:00.000Z',
            number: 12345
          },
          {
            _id: '2',
            ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093d'],
            status: 'pending',
            name: 'Space флюоресцентный бургер',
            createdAt: '2024-01-01T12:30:00.000Z',
            updatedAt: '2024-01-01T12:30:00.000Z',
            number: 12346
          }
        ]
      }).as('getOrders');
    });

    it('should display order history', () => {
      cy.get('[data-testid="order-history"]').should('be.visible');
      cy.get('[data-testid="order-card"]').should('have.length', 2);
    });

    it('should display order details', () => {
      cy.get('[data-testid="order-card"]').first().within(() => {
        cy.contains('12345');
        cy.contains('Space флюоресцентный бургер');
        cy.contains('Выполнен');
      });
    });

    it('should open order details modal', () => {
      cy.get('[data-testid="order-card"]').first().click();
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]').contains('12345');
    });

    it('should handle order history loading state', () => {
      cy.intercept('GET', 'api/orders', {
        delay: 1000,
        success: true,
        orders: []
      }).as('getDelayedOrders');

      cy.visit('/profile');
      cy.get('[data-testid="loader"]').should('be.visible');
      cy.wait('@getDelayedOrders');
      cy.get('[data-testid="loader"]').should('not.exist');
    });

    it('should handle order history error', () => {
      cy.intercept('GET', 'api/orders', {
        statusCode: 500,
        body: {
          success: false,
          message: 'Failed to fetch orders'
        }
      }).as('getFailedOrders');

      cy.visit('/profile');
      cy.wait('@getFailedOrders');
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').contains('Failed to fetch orders');
    });
  });

  describe('Navigation', () => {
    it('should navigate to profile orders', () => {
      cy.get('[data-testid="profile-orders-link"]').click();
      cy.url().should('include', '/profile/orders');
    });

    it('should navigate to profile settings', () => {
      cy.get('[data-testid="profile-settings-link"]').click();
      cy.url().should('include', '/profile/settings');
    });

    it('should navigate to main page', () => {
      cy.get('[data-testid="main-page-link"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });
}); 