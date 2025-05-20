describe('Order Page Tests', () => {
    beforeEach(() => {
      // Se necesita estar autenticado para acceder a esta página, primero hacemos login
      cy.visit('https://ctplaman.netlify.app/login')
      
      // Usar credenciales proporcionadas
      cy.get('input#email').type('bminiclip2@gmail.com')
      cy.get('input#password').type('N3d6a3c363!')
      cy.get('button[type="submit"]').click()
      
      // Esperar a que redireccione al dashboard y la sesión se establezca
      cy.url().should('include', '/dashboard', { timeout: 10000 })
      
      // Navegar a la página de orden de pedido
      cy.visit('https://ctplaman.netlify.app/dashboard/orden-de-pedido')
      
      // Esperar a que la página cargue completamente
      cy.get('h2').contains('Crear Orden de Compra').should('be.visible')
    })
  
    it('should display the order creation form correctly', () => {
      // Verify that all form elements are present
      cy.get('input[placeholder="Nombre del Producto"]').should('be.visible');
      cy.get('input[placeholder="Cantidad"]').should('be.visible');
      cy.get('select[title="Unidad de medida"]').should('be.visible');
      cy.contains('button', 'Añadir Producto').should('be.visible');
      
      // Check for order details form elements
      cy.get('input[placeholder="Área Solicitante"]').should('be.visible');
      cy.get('input[placeholder="Receptor"]').should('be.visible');
      cy.get('textarea[placeholder="Comentarios"]').should('be.visible');
      cy.contains('button', 'Enviar Orden').should('be.visible');
    });
  
    it('should search for products and display results with "pato asado" in the dropdown', () => {
      // Intercept the product search API call
      cy.intercept('GET', '**/api/products/search*').as('searchProducts');
      
      // Type in the search field
      cy.get('input[placeholder="Nombre del Producto"]').type('pato');
      
      // Wait for the search API request to complete
      cy.wait('@searchProducts');
      
      // Verify search results dropdown is displayed
      cy.get('div.absolute').should('be.visible');
      
      // Verify that "pato asado" appears in the dropdown
      cy.contains('div', 'pato asado').should('be.visible');
    });
  
    it('should add product to the order list by selecting "pato asado" from dropdown', () => {
      // Mock product search results to ensure "pato asado" appears
      cy.intercept('GET', '**/api/products/search*', {
        statusCode: 200,
        body: [
          {
            id_Product: 1,
            name: 'pato asado'
          }
        ]
      }).as('searchProducts');
  
      // Mock unit of measure data
      cy.intercept('GET', '**/api/unitsofmeasure*', {
        statusCode: 200,
        body: [
          {
            unitOfMeasureId: 1,
            name: 'Kilogram'
          },
          {
            unitOfMeasureId: 2,
            name: 'Liter'
          }
        ]
      }).as('getUnits');
  
      // Search for a product
      cy.get('input[placeholder="Nombre del Producto"]').type('pato asado');
      cy.wait('@searchProducts');
      
      // Select "pato asado" from the dropdown
      cy.contains('div', 'pato asado').click();
      
      // Enter quantity
      cy.get('input[placeholder="Cantidad"]').type('5');
      
      // Select unit of measure
      cy.get('select[title="Unidad de medida"]').select(1);
      
      // Add product to order
      cy.contains('button', 'Añadir Producto').click();
      
      // Check that the product was added to the table
      cy.get('table tbody tr').should('have.length', 1);
      cy.get('table tbody tr td:nth-child(1) input').should('have.value', 'pato asado');
      cy.get('table tbody tr td:nth-child(2) input').should('have.value', '5');
      cy.get('table tbody tr td:nth-child(3) select').should('contain', 'Kilogram');
    });
  
    it('should validate required fields when submitting an empty form', () => {
      // Try to submit the form without filling in required fields
      cy.contains('button', 'Enviar Orden').click();
      
      // Check for error toast
      cy.contains('Todos los campos y al menos un producto son requeridos').should('be.visible');
    });
  
    it('should successfully submit a complete order form with "pato asado"', () => {
      // Mock product search for "pato asado"
      cy.intercept('GET', '**/api/products/search*', {
        statusCode: 200,
        body: [{ id_Product: 1, name: 'pato asado' }]
      }).as('searchProducts');
  
      // Mock unit of measure data
      cy.intercept('GET', '**/api/unitsofmeasure*', {
        statusCode: 200,
        body: [{ unitOfMeasureId: 1, name: 'Kilogram' }]
      }).as('getUnits');
  
      // Mock order creation API
      cy.intercept('POST', '**/api/orders*', {
        statusCode: 201,
        body: { message: 'Order created successfully' }
      }).as('createOrder');
  
      // Add "pato asado" to the order
      cy.get('input[placeholder="Nombre del Producto"]').type('pato asado');
      cy.wait('@searchProducts');
      cy.contains('div', 'pato asado').click();
      cy.get('input[placeholder="Cantidad"]').type('5');
      cy.get('select[title="Unidad de medida"]').select(1);
      cy.contains('button', 'Añadir Producto').click();
      
      // Fill in order details
      cy.get('input[placeholder="Área Solicitante"]').type('Test Department');
      cy.get('input[placeholder="Receptor"]').type('Test Receiver');
      cy.get('textarea[placeholder="Comentarios"]').type('Test comments for the order');
      
      // Submit the order
      cy.contains('button', 'Enviar Orden').click();
      
      // Wait for the API call to complete
      cy.wait('@createOrder');
      
      // Check for success message
      cy.contains('Orden creada exitosamente').should('be.visible');
      
      // Verify form fields were cleared after successful submission
      cy.get('input[placeholder="Área Solicitante"]').should('have.value', '');
      cy.get('input[placeholder="Receptor"]').should('have.value', '');
      cy.get('textarea[placeholder="Comentarios"]').should('have.value', '');
      cy.get('table tbody tr').should('not.exist');
    });
  
    it('should remove "pato asado" from the order list', () => {
      // Mock product search results for "pato asado"
      cy.intercept('GET', '**/api/products/search*', {
        statusCode: 200,
        body: [{ id_Product: 1, name: 'pato asado' }]
      }).as('searchProducts');
  
      // Mock unit of measure data
      cy.intercept('GET', '**/api/unitsofmeasure*', {
        statusCode: 200,
        body: [{ unitOfMeasureId: 1, name: 'Kilogram' }]
      }).as('getUnits');
  
      // Add "pato asado" to the order
      cy.get('input[placeholder="Nombre del Producto"]').type('pato');
      cy.wait('@searchProducts');
      cy.contains('div', 'pato asado').click();
      cy.get('input[placeholder="Cantidad"]').type('5');
      cy.get('select[title="Unidad de medida"]').select(1);
      cy.contains('button', 'Añadir Producto').click();
      
      // Verify product was added
      cy.get('table tbody tr').should('have.length', 1);
      
      // Remove the product
      cy.contains('button', 'Eliminar').click();
      
      // Verify product was removed
      cy.get('table tbody tr').should('not.exist');
    });
  
    it('should handle API errors gracefully when creating an order with "pato asado"', () => {
      // Mock product search for "pato asado"
      cy.intercept('GET', '**/api/products/search*', {
        statusCode: 200,
        body: [{ id_Product: 1, name: 'pato asado' }]
      }).as('searchProducts');
  
      // Mock unit of measure data
      cy.intercept('GET', '**/api/unitsofmeasure*', {
        statusCode: 200,
        body: [{ unitOfMeasureId: 1, name: 'Kilogram' }]
      }).as('getUnits');
  
      // Mock order creation API with error
      cy.intercept('POST', '**/api/orders*', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('createOrderError');
  
      // Add "pato asado" to the order
      cy.get('input[placeholder="Nombre del Producto"]').type('pato');
      cy.wait('@searchProducts');
      cy.contains('div', 'pato asado').click();
      cy.get('input[placeholder="Cantidad"]').type('5');
      cy.get('select[title="Unidad de medida"]').select(1);
      cy.contains('button', 'Añadir Producto').click();
      
      // Fill in order details
      cy.get('input[placeholder="Área Solicitante"]').type('Test Department');
      cy.get('input[placeholder="Receptor"]').type('Test Receiver');
      cy.get('textarea[placeholder="Comentarios"]').type('Test comments for the order');
      
      // Submit the order
      cy.contains('button', 'Enviar Orden').click();
      
      // Wait for the API call to complete
      cy.wait('@createOrderError');
      
      // Check for error message
      cy.contains('Ocurrió un error al crear la orden').should('be.visible');
    });
  });