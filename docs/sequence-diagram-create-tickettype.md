sequenceDiagram
    participant Cliente as Cliente (Admin)
    participant Router as TicketType Router
    participant AuthMW as Auth Middleware
    participant AdminMW as Admin Middleware
    participant ValidatorMW as Schema Validator
    participant Controller as TicketType Controller
    participant Model as TicketType Model
    participant BaseModel as Base Model
    participant ORM as MikroORM
    participant DB as Base de Datos

    Note over Cliente: POST /ticket-types
    Note over Cliente: Headers: Authorization: Bearer <token>
    Note over Cliente: Body: JSON con datos del ticket type

    Cliente->>Router: POST /ticket-types (application/json)
    
    Router->>AuthMW: verifyToken()
    AuthMW->>AuthMW: Extraer token del header Authorization
    AuthMW->>AuthMW: Validar JWT token
    
    alt Token válido
        AuthMW->>AuthMW: Decodificar payload (id, email, isAdmin)
        AuthMW->>Router: req.user = payload
        Router->>AdminMW: isAdmin()
        AdminMW->>AdminMW: Verificar req.user.isAdmin
        
        alt Usuario es admin
            AdminMW->>Router: Continuar
            Router->>ValidatorMW: schemaValidator(CreateTicketTypeSchema)
            ValidatorMW->>ValidatorMW: Validar formato de fechas (YYYY-MM-DD HH:MM:SS)
            ValidatorMW->>ValidatorMW: Validar que finish > begin datetime
            ValidatorMW->>ValidatorMW: Validar precio > 0 y cantidad > 0
            ValidatorMW->>ValidatorMW: Validar que eventId sea número válido
            
            alt Validación exitosa
                ValidatorMW->>Router: Datos validados
                Router->>Controller: create(req, res, next)
                
                Controller->>Controller: Extraer datos del req.body
                Note over Controller: ticketTypeName, beginDatetime, finishDatetime,<br/>price, maxQuantity, event
                
                Controller->>Model: getEventWithLocation(eventId)
                Model->>ORM: em.findOne(Event, eventId, {populate: ['location']})
                ORM->>DB: SELECT events.*, locations.* FROM events JOIN locations...
                DB-->>ORM: Event con Location data
                ORM-->>Model: Event entity con location
                Model-->>Controller: Event con location
                
                alt Evento existe
                    Controller->>Model: getTotalMaxQuantityByEvent(eventId)
                    Model->>ORM: em.find(TicketType, {event: eventId})
                    ORM->>DB: SELECT * FROM ticket_types WHERE event_id = ?
                    DB-->>ORM: Array de TicketTypes existentes
                    ORM-->>Model: TicketTypes del evento
                    Model->>Model: Calcular suma total de maxQuantity
                    Model-->>Controller: currentTotalMaxQuantity
                    
                    Controller->>Controller: Calcular nueva capacidad total
                    Note over Controller: newTotal = currentTotal + nuevoMaxQuantity
                    Controller->>Controller: Validar capacidad vs location.maxCapacity
                    
                    alt Capacidad válida (newTotal <= maxCapacity)
                        Controller->>Model: create(ticketTypeData)
                        Model->>BaseModel: create(ticketTypeData)
                        BaseModel->>ORM: em.create(TicketType, data)
                        ORM->>ORM: Crear instancia de TicketType
                        Note over ORM: @BeforeCreate hook ejecuta:<br/>availableTickets = maxQuantity
                        BaseModel->>ORM: em.flush()
                        ORM->>DB: INSERT INTO ticket_types (...)
                        DB-->>ORM: TicketType creado con ID
                        ORM-->>BaseModel: Entidad persistida
                        BaseModel-->>Model: TicketType entity
                        Model-->>Controller: TicketType creado
                        
                        Controller->>Controller: Calcular información de capacidad
                        Controller->>Cliente: 201 Created
                        Note over Cliente: { message: "Tipo de ticket creado exitosamente",<br/>data: ticketType,<br/>capacityInfo: {...} }
                        
                    else Capacidad excedida
                        Controller->>Cliente: 422 Unprocessable Entity
                        Note over Cliente: ValidationError:<br/>"La capacidad total superaría<br/>la capacidad máxima de la ubicación"
                    end
                    
                else Evento no existe
                    Controller->>Cliente: 404 Not Found
                    Note over Cliente: NotFoundError:<br/>"Evento con ID X no encontrado"
                end
                
            else Validación fallida
                ValidatorMW->>Cliente: 400 Bad Request
                Note over Cliente: Error de validación de esquema
            end
            
        else Usuario no es admin
            AdminMW->>Cliente: 403 Forbidden
            Note over Cliente: "Access denied: Admin only"
        end
        
    else Token inválido
        AuthMW->>Cliente: 401 Unauthorized
        Note over Cliente: "Unauthorized" o "Required token"
    end

    Note over Cliente, DB: Validaciones de Negocio Principales:
    Note over Cliente, DB: 1. Evento debe existir
    Note over Cliente, DB: 2. Suma de maxQuantity no debe superar location.maxCapacity
    Note over Cliente, DB: 3. finishDatetime > beginDatetime
    Note over Cliente, DB: 4. Precio y cantidad deben ser positivos
