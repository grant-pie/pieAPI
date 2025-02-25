import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContactDto } from './contact.dto';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

@Injectable()
export class ContactService {
  async sendEmail(contactDto: ContactDto) {
    const { name, email, message } = contactDto;

    // Create a transporter using SMTP credentials
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,  // smtp.ethereal.email
        port: Number(process.env.EMAIL_PORT),  // 587
        secure: process.env.EMAIL_SECURE === 'true',  // false for 587
        auth: {
          user: process.env.EMAIL_USER,  // Your Ethereal email
          pass: process.env.EMAIL_PASS,  // Your Ethereal password
        },
        tls: {
          rejectUnauthorized: false,  // Sometimes needed with Ethereal
        },
      });
      
      

    // Define the email options
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_FROM}>`, // Sender name & email
      to: process.env.EMAIL_USER, // Your email (recipient)
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info);
        return { message: 'Email sent successfully!' };
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }
      
  }
}
