import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { myDonation } from "../../API/Donor API/MyDonation";
import { useCurrency } from '../../context/CurrencyContext';

const MyDonations = () => {
  //      const recipients = [
  //   {
  //     id: 1,
  //     name: 'Ravi Sharma',
  //     age: 25,
  //     phone: '+91 98765 56789',
  //     problem: 'Heart Problem',
  //     amount: 300000,
  //     date: '2025-08-08',
  //     status: 'Ongoing',
  //     donor: 'Anjali Mehra',
  //     donations: [
  //       { name: 'Vikas Rao', phone: '+91 99111 22334', date: '2025-08-01', amount: 10000 },
  //       { name: 'Meena Das', phone: '+91 98123 45678', date: '2025-08-03', amount: 5000 },
  //     ],
  //     donors: [
  //       { name: 'Anjali Mehra', phone: '+91 98761 23456', email: 'anjali@example.com', amount: 150000, date: '2025-08-02' },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: 'Meena Rani',
  //     age: 32,
  //     phone: '+91 99876 54321',
  //     problem: 'Kidney Failure',
  //     amount: 450000,
  //     date: '2025-07-12',
  //     status: 'Completed',
  //     donor: 'Vikram Singh',
  //     donations: [
  //       { name: 'Tina Verma', phone: '+91 99999 11111', date: '2025-07-05', amount: 20000 },
  //       { name: 'Sahil Mehra', phone: '+91 98888 22222', date: '2025-07-10', amount: 15000 },
  //     ],
  //     donors: [
  //       { name: 'Vikram Singh', phone: '+91 98770 10101', email: 'vikram@example.com', amount: 250000, date: '2025-07-08' },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: 'Arjun Verma',
  //     age: 19,
  //     phone: '+91 97654 32109',
  //     problem: 'Leukemia',
  //     amount: 550000,
  //     date: '2025-09-20',
  //     status: 'Ongoing',
  //     donor: 'Pooja Yadav',
  //     donations: [
  //       { name: 'Rohan Patel', phone: '+91 93222 11122', date: '2025-09-05', amount: 50000 },
  //       { name: 'Aarti Joshi', phone: '+91 90000 12345', date: '2025-09-10', amount: 10000 },
  //     ],
  //     donors: [
  //       { name: 'Pooja Yadav', phone: '+91 99876 54320', email: 'pooja@example.com', amount: 300000, date: '2025-09-12' },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     name: 'Sita Kumari',
  //     age: 40,
  //     phone: '+91 96452 78123',
  //     problem: 'Breast Cancer',
  //     amount: 600000,
  //     date: '2025-06-18',
  //     status: 'Completed',
  //     donor: 'Raj Malhotra',
  //     donations: [
  //       { name: 'Nisha Gupta', phone: '+91 91234 67890', date: '2025-06-01', amount: 25000 },
  //       { name: 'Manoj Singh', phone: '+91 92345 98765', date: '2025-06-10', amount: 30000 },
  //     ],
  //     donors: [
  //       { name: 'Raj Malhotra', phone: '+91 93456 11223', email: 'raj.malhotra@example.com', amount: 400000, date: '2025-06-15' },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     name: 'Rohit Saini',
  //     age: 28,
  //     phone: '+91 95123 45678',
  //     problem: 'Liver Cirrhosis',
  //     amount: 350000,
  //     date: '2025-07-25',
  //     status: 'Ongoing',
  //     donor: 'Deepika Joshi',
  //     donations: [
  //       { name: 'Karan Mehta', phone: '+91 99887 66554', date: '2025-07-20', amount: 10000 },
  //       { name: 'Preeti Sharma', phone: '+91 98765 12345', date: '2025-07-22', amount: 15000 },
  //     ],
  //     donors: [
  //       { name: 'Deepika Joshi', phone: '+91 98123 98765', email: 'deepika.joshi@example.com', amount: 200000, date: '2025-07-24' },
  //     ],
  //   },
  //   {
  //     id: 6,
  //     name: 'Fatima Bano',
  //     age: 30,
  //     phone: '+91 98877 66554',
  //     problem: 'Brain Tumor',
  //     amount: 750000,
  //     date: '2025-08-15',
  //     status: 'Ongoing',
  //     donor: 'Armaan Khan',
  //     donations: [
  //       { name: 'Sahil Khan', phone: '+91 99222 33445', date: '2025-08-10', amount: 30000 },
  //       { name: 'Ayesha Patel', phone: '+91 99123 44556', date: '2025-08-12', amount: 20000 },
  //     ],
  //     donors: [
  //       { name: 'Armaan Khan', phone: '+91 98989 78787', email: 'armaan.khan@example.com', amount: 400000, date: '2025-08-13' },
  //     ],
  //   },
  //   {
  //     id: 7,
  //     name: 'Sunil Patil',
  //     age: 35,
  //     phone: '+91 93567 44321',
  //     problem: 'Spinal Injury',
  //     amount: 500000,
  //     date: '2025-05-30',
  //     status: 'Completed',
  //     donor: 'Neha Gupta',
  //     donations: [
  //       { name: 'Vijay Desai', phone: '+91 97654 11223', date: '2025-05-20', amount: 25000 },
  //       { name: 'Kiran Rao', phone: '+91 98765 33211', date: '2025-05-25', amount: 20000 },
  //     ],
  //     donors: [
  //       { name: 'Neha Gupta', phone: '+91 98223 44556', email: 'neha.gupta@example.com', amount: 400000, date: '2025-05-28' },
  //     ],
  //   },
  //   {
  //     id: 8,
  //     name: 'Kavita Mishra',
  //     age: 27,
  //     phone: '+91 93456 78901',
  //     problem: 'Thalassemia',
  //     amount: 280000,
  //     date: '2025-06-10',
  //     status: 'Ongoing',
  //     donor: 'Siddharth Rao',
  //     donations: [
  //       { name: 'Ritu Sharma', phone: '+91 91234 55555', date: '2025-06-05', amount: 10000 },
  //       { name: 'Rahul Singh', phone: '+91 92345 66666', date: '2025-06-07', amount: 15000 },
  //     ],
  //     donors: [
  //       { name: 'Siddharth Rao', phone: '+91 93456 12345', email: 'siddharth.rao@example.com', amount: 150000, date: '2025-06-08' },
  //     ],
  //   },
  //   {
  //     id: 9,
  //     name: 'Imran Qureshi',
  //     age: 45,
  //     phone: '+91 92345 67890',
  //     problem: 'Diabetes Complication',
  //     amount: 200000,
  //     date: '2025-07-05',
  //     status: 'Completed',
  //     donor: 'Anita Desai',
  //     donations: [
  //       { name: 'Alok Jain', phone: '+91 90000 77777', date: '2025-06-30', amount: 5000 },
  //       { name: 'Sunita Malhotra', phone: '+91 91111 88888', date: '2025-07-02', amount: 10000 },
  //     ],
  //     donors: [
  //       { name: 'Anita Desai', phone: '+91 92345 12345', email: 'anita.desai@example.com', amount: 150000, date: '2025-07-03' },
  //     ],
  //   },
  //   {
  //     id: 10,
  //     name: 'Lata Devi',
  //     age: 50,
  //     phone: '+91 91234 56789',
  //     problem: 'Hip Replacement',
  //     amount: 400000,
  //     date: '2025-09-01',
  //     status: 'Ongoing',
  //     donor: 'Ramesh Kumar',
  //     donations: [
  //       { name: 'Pooja Singh', phone: '+91 90000 99999', date: '2025-08-25', amount: 20000 },
  //       { name: 'Amit Sharma', phone: '+91 91111 77777', date: '2025-08-28', amount: 15000 },
  //     ],
  //     donors: [
  //       { name: 'Ramesh Kumar', phone: '+91 91234 11111', email: 'ramesh.kumar@example.com', amount: 250000, date: '2025-08-30' },
  //     ],
  //   },
  //   {
  //     id: 11,
  //     name: 'Mohit Chawla',
  //     age: 33,
  //     phone: '+91 99812 33445',
  //     problem: 'Lung Infection',
  //     amount: 320000,
  //     date: '2025-08-22',
  //     status: 'Completed',
  //     donor: 'Simran Kaur',
  //     donations: [
  //       { name: 'Rajiv Chopra', phone: '+91 93333 44444', date: '2025-08-10', amount: 12000 },
  //       { name: 'Neha Singh', phone: '+91 92222 55555', date: '2025-08-15', amount: 10000 },
  //     ],
  //     donors: [
  //       { name: 'Simran Kaur', phone: '+91 99812 33446', email: 'simran.kaur@example.com', amount: 200000, date: '2025-08-18' },
  //     ],
  //   },
  //   {
  //     id: 12,
  //     name: 'Priya Sen',
  //     age: 21,
  //     phone: '+91 98712 65432',
  //     problem: 'Brain Hemorrhage',
  //     amount: 670000,
  //     date: '2025-07-17',
  //     status: 'Ongoing',
  //     donor: 'Nikhil Jain',
  //     donations: [
  //       { name: 'Aman Gupta', phone: '+91 91234 12345', date: '2025-07-10', amount: 25000 },
  //       { name: 'Kajal Sharma', phone: '+91 91111 23456', date: '2025-07-12', amount: 20000 },
  //     ],
  //     donors: [
  //       { name: 'Nikhil Jain', phone: '+91 98765 67890', email: 'nikhil.jain@example.com', amount: 300000, date: '2025-07-14' },
  //     ],
  //   },
  //   {
  //     id: 13,
  //     name: 'Rakesh Thakur',
  //     age: 38,
  //     phone: '+91 97645 12345',
  //     problem: 'Multiple Injuries',
  //     amount: 480000,
  //     date: '2025-06-05',
  //     status: 'Completed',
  //     donor: 'Bhavna Taneja',
  //     donations: [
  //       { name: 'Deepak Malhotra', phone: '+91 90000 33333', date: '2025-06-01', amount: 15000 },
  //       { name: 'Sunil Joshi', phone: '+91 91111 44444', date: '2025-06-03', amount: 20000 },
  //     ],
  //     donors: [
  //       { name: 'Bhavna Taneja', phone: '+91 97654 12346', email: 'bhavna.taneja@example.com', amount: 300000, date: '2025-06-04' },
  //     ],
  //   },
  // ]
  const {convert} = useCurrency();

  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) {
          console.error("User not logged in or token missing");
          return;
        }
        const data = await myDonation(user.token , user.userId);
        setRecipients(data);
        console.log("Fetched donations:", data);
        // Assuming data is an array of donation objects
        // setRecipients(data); // Uncomment this line if you want to use fetched data
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchMyDonations();
  }
  , []);


      const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className='p-6 bg-white min-h-screen flex flex-col gap-3'>
          {recipients.map((item, index) => (
            <div
              key={index}
              className="flex justify-between lg:flex-row lg:flex-nowrap flex-col md:flex-wrap  lg:gap-0 gap-5 bg-white p-4 rounded-lg shadow-sm border border-gray-200 items-center"
            >
              <div>
                <p className="text-gray-500 text-sm">Patient Name:</p>
                <p className="text-[17px] font-semibold">{item.donationRequest.patientname}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Age:</p>
                <p className="text-[17px] font-semibold">{item.donationRequest.patientage}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone Number:</p>
                <p className="text-[17px] font-semibold">{item.donationRequest.patientnumber}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Medical Problem:</p>
                <p className="text-[17px] font-semibold">{item.donationRequest.medicalproblem}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Donation Amount:</p>
                <p className="text-[17px] font-semibold">{convert(item.amount)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Donated On:</p>
                <p className="text-[17px] font-semibold">{formatDate(item.donatedAt)}</p>
              </div>
           
           
            </div>
          ))}
    </div>
  )
}

export default MyDonations