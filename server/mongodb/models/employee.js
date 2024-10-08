import { Schema } from 'mongoose';



const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  
});

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;