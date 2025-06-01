describe('Feed Page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/feed');
    cy.wait('@getIngredients');
  });

  describe('Feed List', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/orders/all', {
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
        ],
        total: 2,
        totalToday: 1
      }).as('getOrders');
    });

    it('should display feed list', () => {
      cy.get('[data-testid="feed-list"]').should('be.visible');
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

    it('should handle feed loading state', () => {
      cy.intercept('GET', 'api/orders/all', {
        delay: 1000,
        success: true,
        orders: [],
        total: 0,
        totalToday: 0
      }).as('getDelayedOrders');

      cy.visit('/feed');
      cy.get('[data-testid="loader"]').should('be.visible');
      cy.wait('@getDelayedOrders');
      cy.get('[data-testid="loader"]').should('not.exist');
    });

    it('should handle feed error', () => {
      cy.intercept('GET', 'api/orders/all', {
        statusCode: 500,
        body: {
          success: false,
          message: 'Failed to fetch feed'
        }
      }).as('getFailedOrders');

      cy.visit('/feed');
      cy.wait('@getFailedOrders');
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').contains('Failed to fetch feed');
    });
  });

  describe('Feed Statistics', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/orders/all', {
        success: true,
        orders: [],
        total: 100,
        totalToday: 25
      }).as('getOrders');
    });

    it('should display feed statistics', () => {
      cy.get('[data-testid="feed-stats"]').should('be.visible');
      cy.get('[data-testid="total-orders"]').contains('100');
      cy.get('[data-testid="today-orders"]').contains('25');
    });

    it('should display order status counts', () => {
      cy.intercept('GET', 'api/orders/all', {
        success: true,
        orders: [
          { status: 'done' },
          { status: 'pending' },
          { status: 'done' }
        ],
        total: 3,
        totalToday: 2
      }).as('getOrdersWithStatus');

      cy.visit('/feed');
      cy.get('[data-testid="done-orders"]').contains('2');
      cy.get('[data-testid="pending-orders"]').contains('1');
    });
  });

  describe('WebSocket Connection', () => {
    it('should connect to WebSocket', () => {
      cy.window().then((win) => {
        const ws = new WebSocket('wss://norma.nomoreparties.space/orders/all');
        ws.onopen = () => {
          expect(ws.readyState).to.equal(WebSocket.OPEN);
        };
      });
    });

    it('should handle WebSocket messages', () => {
      cy.window().then((win) => {
        const ws = new WebSocket('wss://norma.nomoreparties.space/orders/all');
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          expect(data).to.have.property('orders');
          expect(data).to.have.property('total');
          expect(data).to.have.property('totalToday');
        };
      });
    });

    it('should handle WebSocket errors', () => {
      cy.window().then((win) => {
        const ws = new WebSocket('wss://norma.nomoreparties.space/orders/all');
        ws.onerror = (error) => {
          expect(error).to.exist;
        };
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to order details page', () => {
      cy.get('[data-testid="order-card"]').first().click();
      cy.url().should('include', '/feed/12345');
    });

    it('should navigate to profile', () => {
      cy.get('[data-testid="profile-link"]').click();
      cy.url().should('include', '/profile');
    });

    it('should navigate to constructor', () => {
      cy.get('[data-testid="constructor-link"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });
}); 