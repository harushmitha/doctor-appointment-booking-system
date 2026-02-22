# Doctor Appointment Booking System

A full-stack web application for managing doctor appointments with role-based access control. The system supports three user roles: Admin, Doctor, and Patient, each with specific functionalities.

## 🏗️ Architecture

- **Frontend**: React.js with React Router for navigation
- **Backend**: Spring Boot with Spring Security and JWT authentication
- **Database**: MySQL
- **Authentication**: JWT-based authentication with role-based access control

## 🚀 Features

### Admin Dashboard
- Manage doctors and patients
- View all appointments
- System administration

### Doctor Dashboard
- View assigned appointments
- Manage availability
- Patient management

### Patient Dashboard
- Book appointments with doctors
- View appointment history
- Manage profile

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17** or higher
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Maven** (v3.6 or higher)

## 🛠️ Installation & Setup

### Database Setup

1. Install and start MySQL server
2. Create a database named `doctor_db`:
   ```sql
   CREATE DATABASE doctor_db;
   ```
3. Update database credentials in `java_backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd java_backend
   ```

2. Install dependencies and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend server will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend application will start on `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

The backend configuration is located in `java_backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/doctor_db
spring.datasource.username=root
spring.datasource.password=root

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Frontend Configuration

The frontend is configured to communicate with the backend API. Update the API base URL in `frontend/src/services/api.js` if needed.

## 📁 Project Structure

```
doctor-appointment-booking-system/
├── frontend/                    # React.js frontend
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Auth.js
│   │   │   ├── Dashboard.js
│   │   │   ├── DoctorDashboard.js
│   │   │   └── PatientDashboard.js
│   │   ├── services/           # API services
│   │   └── App.js              # Main App component
│   └── package.json
├── java_backend/               # Spring Boot backend
│   ├── src/main/java/com/gvp/
│   │   ├── controller/         # REST controllers
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Data repositories
│   │   ├── security/          # Security configuration
│   │   └── service/           # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── README.md
```

## 🔐 Authentication

The system uses JWT (JSON Web Token) for authentication:

- Users authenticate via `/api/auth/login`
- JWT tokens are required for accessing protected endpoints
- Role-based access control (ADMIN, DOCTOR, PATIENT)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Delete appointment

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add new doctor
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor

## 🧪 Testing

### Backend Testing
```bash
cd java_backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   cd java_backend
   mvn clean package
   ```
2. Run the JAR file:
   ```bash
   java -jar target/doctorappointment-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve the `build` folder using a web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

## 🔄 Version History

- **v0.1.0** - Initial release with basic appointment booking functionality