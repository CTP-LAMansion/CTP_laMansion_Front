/// <reference types="cypress" />

describe('Certificates Page Tests', () => {
  beforeEach(() => {
    // Visitar la página de solicitud de certificados
    cy.visit('https://ctplaman.netlify.app/certificates')
    
    // Esperar a que la página cargue completamente
    cy.contains('Solicitud de Certificado', { timeout: 10000 }).should('be.visible')
  })

  it('should display the certificate request form with all required fields', () => {
    // Verificar el título de la página
    cy.contains('h3', 'Solicitud de Certificado').should('be.visible')
    
    // Verificar que los campos del estudiante están presentes con sus respectivas etiquetas
    cy.contains('label', 'Cédula del Estudiante').should('be.visible')
    cy.get('input#studentId').should('be.visible')
    
    cy.contains('label', 'Nombre del Estudiante').should('be.visible')
    cy.get('input#studentName').should('be.visible')
    
    cy.contains('label', 'Primer Apellido del Estudiante').should('be.visible')
    cy.get('input#studentLastName1').should('be.visible')
    
    cy.contains('label', 'Segundo Apellido del Estudiante').should('be.visible')
    cy.get('input#studentLastName2').should('be.visible')
    
    // Verificar la nota sobre estudiantes egresados
    cy.contains('*Si eres estudiante egresado, no es necesario rellenar los datos del encargado.*').should('be.visible')
    
    // Verificar campos del encargado
    cy.contains('label', 'Cédula del Encargado').should('be.visible')
    cy.get('input#EncargadoId').should('be.visible')
    
    cy.contains('label', 'Nombre del Encargado').should('be.visible')
    cy.get('input#guardianName').should('be.visible')
    
    cy.contains('label', 'Primer Apellido del Encargado').should('be.visible')
    cy.get('input#guardianLastName1').should('be.visible')
    
    cy.contains('label', 'Segundo Apellido del Encargado').should('be.visible')
    cy.get('input#guardianLastName2').should('be.visible')
    
    // Verificar campos de contacto
    cy.contains('label', 'Email').should('be.visible')
    cy.get('input#email').should('be.visible')
    
    cy.contains('label', 'Teléfono').should('be.visible')
    cy.get('input#phoneNumber').should('be.visible')
    
    // Verificar selectores
    cy.contains('label', 'Método de Entrega').should('be.visible')
    cy.get('select#deliveryMethod').should('be.visible')
    
    cy.contains('label', 'Tipo de Certificación').should('be.visible')
    cy.get('select#certificationType').should('be.visible')
    
    // Verificar mensaje sobre títulos
    cy.contains('*Los títulos solo pueden ser solicitados de manera física.*').should('be.visible')
    
    // Verificar botón de envío
    cy.contains('button', 'Enviar Solicitud').should('be.visible')
  })

  it('should validate required fields with exact error messages when submitting empty form', () => {
    // Intentar enviar el formulario sin completarlo
    cy.contains('button', 'Enviar Solicitud').click()
    
    // Verificar mensajes de error exactos para campos requeridos
    cy.contains('La cédula del estudiante es requerida').should('be.visible')
    cy.contains('El nombre del estudiante es requerido').should('be.visible')
    cy.contains('El primer apellido es requerido').should('be.visible')
    cy.contains('El segundo apellido es requerido').should('be.visible')
    cy.contains('El e-mail es requerido').should('be.visible')
    cy.contains('El teléfono es requerido').should('be.visible')


  })

  it('should validate dropdown placeholder texts match exactly', () => {
    // Verificar que los textos de placeholder en los dropdowns son exactamente los del componente
    cy.get('select#deliveryMethod option').first().should('have.text', 'Selecciona el Método de Entrega')
    cy.get('select#certificationType option').first().should('have.text', 'Selecciona el Certificado')
  })

  it('should load delivery method options from API', () => {
    // Verificar que el dropdown de métodos de entrega se carga con opciones
    // Espera a que las opciones se carguen (evita el mensaje de "Cargando métodos de entrega...")
    cy.get('select#deliveryMethod option').should('have.length.gt', 1, { timeout: 10000 })
    
    // Verificar que no aparece el mensaje de carga
    cy.contains('Cargando métodos de entrega...').should('not.exist')
  })

  it('should load certification types options from API', () => {
    // Verificar que el dropdown de tipos de certificación se carga con opciones
    // Espera a que las opciones se carguen (evita el mensaje de "Cargando tipos de certificación...")
    cy.get('select#certificationType option').should('have.length.gt', 1, { timeout: 10000 })
    
    // Verificar que no aparece el mensaje de carga
    cy.contains('Cargando tipos de certificación...').should('not.exist')
  })

  it('should submit a valid form and show success notification', () => {
    // Interceptar la petición POST para simular una respuesta exitosa
    cy.intercept('POST', '**/api/certificationRequests', {
      statusCode: 200,
      body: { success: true }
    }).as('formSubmit')
    
    // Completar el formulario con datos válidos
    cy.get('input#studentId').type('304560789')
    cy.get('input#studentName').type('María')
    cy.get('input#studentLastName1').type('Rodríguez')
    cy.get('input#studentLastName2').type('Sánchez')
    
    cy.get('input#email').type('maria.rodriguez@example.com')
    cy.get('input#phoneNumber').type('87654321')
    
    // Esperar a que las opciones de los dropdowns se carguen y seleccionarlas
    cy.get('select#deliveryMethod').should('not.be.disabled')
    cy.get('select#deliveryMethod option').should('have.length.gt', 1)
    cy.get('select#deliveryMethod').select(1)
    
    cy.get('select#certificationType').should('not.be.disabled')
    cy.get('select#certificationType option').should('have.length.gt', 1)
    cy.get('select#certificationType').select(1)
    
    // Enviar el formulario
    cy.contains('button', 'Enviar Solicitud').click()
    
    // Esperar a que se complete la petición
    cy.wait('@formSubmit')
    
    // Verificar que aparece notificación toast de éxito con el mensaje exacto
    cy.contains('Solicitud realizada correctamente!').should('be.visible')
    
    // Verificar que el formulario se ha reiniciado (campos vacíos)
    cy.get('input#studentId').should('have.value', '')
    cy.get('input#studentName').should('have.value', '')
  })

  it('should handle form submission error with exact error message', () => {
    // Interceptar la petición POST para simular un error en el servidor
    cy.intercept('POST', '**/api/certificationRequests', {
      statusCode: 500,
      body: { message: 'Error interno del servidor' }
    }).as('failedSubmit')
    
    // Completar el formulario con datos válidos
    cy.get('input#studentId').type('304560789')
    cy.get('input#studentName').type('María')
    cy.get('input#studentLastName1').type('Rodríguez')
    cy.get('input#studentLastName2').type('Sánchez')
    
    cy.get('input#email').type('maria.rodriguez@example.com')
    cy.get('input#phoneNumber').type('87654321')
    
    // Seleccionar opciones de los dropdowns
    cy.get('select#deliveryMethod').should('not.be.disabled')
    cy.get('select#deliveryMethod option').should('have.length.gt', 1)
    cy.get('select#deliveryMethod').select(1)
    
    cy.get('select#certificationType').should('not.be.disabled')
    cy.get('select#certificationType option').should('have.length.gt', 1)
    cy.get('select#certificationType').select(1)
    
    // Enviar el formulario
    cy.contains('button', 'Enviar Solicitud').click()
    
    // Esperar a que se complete la petición interceptada
    cy.wait('@failedSubmit')
    
    // Verificar que aparece notificación toast de error con el mensaje exacto
    cy.contains('Error al realizar la solicitud.').should('be.visible')
  })

  it('should show loading state in submit button while submitting', () => {
    // Interceptar la petición para simular retraso
    cy.intercept('POST', '**/api/certificationRequests', {
      delay: 1000,
      statusCode: 200,
      body: { success: true }
    }).as('slowSubmit')
    
    // Completar el formulario
    cy.get('input#studentId').type('304560789')
    cy.get('input#studentName').type('María')
    cy.get('input#studentLastName1').type('Rodríguez')
    cy.get('input#studentLastName2').type('Sánchez')
    cy.get('input#email').type('maria.rodriguez@example.com')
    cy.get('input#phoneNumber').type('87654321')
    
    // Seleccionar opciones de los dropdowns
    cy.get('select#deliveryMethod').should('not.be.disabled')
    cy.get('select#deliveryMethod').select(1)
    cy.get('select#certificationType').should('not.be.disabled')
    cy.get('select#certificationType').select(1)
    
    // Enviar el formulario
    cy.contains('button', 'Enviar Solicitud').click()
    
    // Verificar que el botón muestra "Enviando..." (texto exacto del componente)
    cy.get('button[type="submit"]').should('be.disabled')
    cy.get('button[type="submit"]').should('contain', 'Enviando...')
    
    // Esperar a que termine la petición
    cy.wait('@slowSubmit')
    
    // Verificar que el botón vuelve a su estado normal
    cy.get('button[type="submit"]').should('not.be.disabled')
    cy.get('button[type="submit"]').should('contain', 'Enviar Solicitud')
  })
})